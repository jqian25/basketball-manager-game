// client/src/game/camera/MatchCamera.ts

/**
 * 比赛镜头模式枚举，定义了不同的镜头行为。
 */
export enum CameraMode {
    /** 默认模式：跟随主玩家/目标。 */
    FollowTarget,
    /** 区域模式：聚焦于地图上的特定坐标或区域。 */
    FocusArea,
    /** 电影模式：用于过场动画或特殊事件，可能涉及多个目标或预设路径。 */
    Cinematic,
    /** 自由模式：不自动跟随，用于调试或特殊视角。 */
    Free,
}

/**
 * MatchCameraOptions 接口定义了 MatchCamera 类的配置选项。
 */
export interface MatchCameraOptions {
    /** 镜头的平滑度/延迟，值越大跟随越慢，视觉效果越平滑。 */
    lerp?: { x: number, y: number };
    /** 镜头缩放级别。 */
    zoom?: number;
    /** 镜头在 FocusArea 模式下的移动速度（像素/秒）。 */
    focusSpeed?: number;
    /** 镜头跟随目标时的边界限制（可选）。 */
    bounds?: Phaser.Geom.Rectangle;
}

/**
 * MatchCamera 类继承自 Phaser.Cameras.Scene2D.Camera，
 * 专为游戏比赛设计，提供多种平滑的镜头切换和跟随模式，以实现出色的视觉效果。
 * 
 * 性能优化：
 * 1. 使用 `Phaser.Math.Interpolation.Linear` 或 `Phaser.Math.SmoothStep` 进行平滑插值（Lerp），而不是每帧直接设置位置。
 * 2. 避免在 `preUpdate` 或 `postUpdate` 中进行昂贵的计算。
 * 3. 限制边界检查只在必要时进行。
 */
export class MatchCamera extends Phaser.Cameras.Scene2D.Camera {
    
    private currentMode: CameraMode = CameraMode.FollowTarget;
    private target: Phaser.GameObjects.Components.Transform | null = null;
    private focusPoint: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private focusSpeed: number;
    private lerpValues: { x: number, y: number };
    private scene: Phaser.Scene;

    /**
     * 构造函数。
     * @param scene Phaser 场景实例。
     * @param options 镜头配置选项。
     */
    constructor(scene: Phaser.Scene, options: MatchCameraOptions = {}) {
        // 调用父类构造函数，使用场景默认的相机配置
        super(scene.sys.scale.width, scene.sys.scale.height);
        this.scene = scene;
        
        // 应用配置
        this.lerpValues = options.lerp || { x: 0.1, y: 0.1 };
        this.focusSpeed = options.focusSpeed || 800; // 默认每秒800像素
        this.setZoom(options.zoom || 1);

        if (options.bounds) {
            this.setBounds(options.bounds.x, options.bounds.y, options.bounds.width, options.bounds.height);
        }

        // 注册到场景的相机管理器
        scene.cameras.addExisting(this);

        // 绑定更新事件，确保相机逻辑在每帧执行
        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * 设置镜头跟随的目标。
     * @param target 任何具有 x 和 y 属性的游戏对象或组件。
     * @param duration 切换到跟随模式时的过渡时间（毫秒），用于平滑过渡。
     */
    public follow(target: Phaser.GameObjects.Components.Transform, duration: number = 500): void {
        this.target = target;
        this.currentMode = CameraMode.FollowTarget;
        
        // 视觉效果：平滑过渡到目标
        this.scene.tweens.add({
            targets: this,
            scrollX: target.x - this.width * 0.5,
            scrollY: target.y - this.height * 0.5,
            duration: duration,
            ease: 'Power2',
            onComplete: () => {
                // 过渡完成后，启用 lerp 跟随
                this.setLerp(this.lerpValues.x, this.lerpValues.y);
            }
        });
    }

    /**
     * 设置镜头聚焦到地图上的特定点。
     * @param x 聚焦点的 X 坐标。
     * @param y 聚焦点的 Y 坐标。
     * @param duration 切换到聚焦模式时的过渡时间（毫秒）。
     */
    public focusOn(x: number, y: number, duration: number = 1000): void {
        this.target = null;
        this.currentMode = CameraMode.FocusArea;
        this.focusPoint.set(x, y);

        // 视觉效果：平滑移动到聚焦区域
        this.scene.tweens.add({
            targets: this,
            scrollX: x - this.width * 0.5,
            scrollY: y - this.height * 0.5,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // 停止自动跟随的 lerp
                this.setLerp(1, 1); // 禁用 lerp，直接定位
            }
        });
    }

    /**
     * 切换到电影模式或自由模式。
     * @param mode 要切换到的模式。
     */
    public setMode(mode: CameraMode.Cinematic | CameraMode.Free): void {
        this.currentMode = mode;
        this.target = null;
        this.setLerp(1, 1); // 禁用 lerp
        // 可以在这里添加额外的电影模式初始化逻辑
    }

    /**
     * 核心更新逻辑，在场景的 UPDATE 事件中调用。
     * @param time 当前时间。
     * @param delta 自上一帧以来的时间差（毫秒）。
     */
    public update(time: number, delta: number): void {
        // 性能优化：只在需要时执行逻辑
        switch (this.currentMode) {
            case CameraMode.FollowTarget:
                this.handleFollowTarget();
                break;
            case CameraMode.FocusArea:
                // 在 FocusArea 模式下，如果正在进行 Tween 动画，则由 Tween 控制。
                // 如果没有 Tween，则相机保持静止在 focusPoint。
                break;
            case CameraMode.Cinematic:
                // 电影模式逻辑：可能涉及复杂的路径跟随或多目标切换，
                // 通常由外部 Tween 或 Timeline 控制。
                break;
            case CameraMode.Free:
                // 自由模式：不执行任何自动移动逻辑。
                break;
        }
    }

    /**
     * 处理跟随目标模式下的相机移动逻辑。
     * 使用 Lerp 平滑移动，实现出色的视觉效果。
     */
    private handleFollowTarget(): void {
        if (!this.target) {
            return;
        }

        // 计算目标在屏幕中心的位置
        const targetX = this.target.x - this.width * 0.5;
        const targetY = this.target.y - this.height * 0.5;

        // 使用 Phaser 提供的 setLerp 和 startFollow 方法可以更简洁地实现，
        // 但为了展示自定义的平滑效果和控制，我们手动进行插值计算。
        // 注意：Phaser 3 Camera 已经内置了 setLerp 和 startFollow，
        // 这里的实现是为了演示如何在不使用内置 startFollow 的情况下实现自定义的平滑跟随。
        // 如果使用内置的 startFollow，代码会更简洁，但我们假设需要更细致的控制。

        // 视觉效果/性能优化：使用 Lerp（线性插值）平滑滚动
        const newScrollX = Phaser.Math.Linear(this.scrollX, targetX, this.lerpValues.x);
        const newScrollY = Phaser.Math.Linear(this.scrollY, targetY, this.lerpValues.y);

        this.setScroll(newScrollX, newScrollY);
    }

    /**
     * 切换镜头缩放级别，并提供平滑过渡。
     * @param zoom 目标缩放级别。
     * @param duration 过渡时间（毫秒）。
     */
    public zoomTo(zoom: number, duration: number = 500): void {
        // 视觉效果：平滑缩放
        this.scene.tweens.add({
            targets: this,
            zoom: zoom,
            duration: duration,
            ease: 'Sine.easeOut'
        });
    }

    /**
     * 销毁相机实例，并移除事件监听器。
     * 性能优化：确保清理工作，防止内存泄漏。
     */
    public destroy(): void {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.scene.cameras.remove(this);
        super.destroy();
    }
}