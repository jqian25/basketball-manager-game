import * as Phaser from 'phaser';

/**
 * 相机控制器：实现宝可梦Game Boy风格的相机效果。
 * 核心功能包括：平滑跟随目标、相机震动、动态缩放。
 * 
 * 宝可梦Game Boy风格特点：
 * 1. 像素化：通常使用整数倍缩放，以保持像素清晰度。
 * 2. 居中跟随：目标居中，但移动时可能存在轻微的“迟滞”或“平滑”效果，以避免过于生硬。
 * 3. 限制视野：相机通常被限制在地图边界内。
 */
export class CameraController {
    private scene: Phaser.Scene;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private target: Phaser.GameObjects.Components.Transform | null = null;

    // 跟随参数
    private isFollowing: boolean = false;
    private followSpeed: number = 0.05; // 平滑跟随的速度，0到1之间，值越小越平滑

    // 缩放参数
    private currentZoom: number = 2; // 默认缩放，符合像素风格
    private targetZoom: number = 2;
    private zoomDuration: number = 500; // 缩放动画持续时间
    private zoomTween: Phaser.Tweens.Tween | null = null;

    // 震动参数
    private isShaking: boolean = false;
    private shakeDuration: number = 0;
    private shakeIntensity: number = 0;
    private shakeTimer: number = 0;

    /**
     * 构造函数
     * @param scene 场景实例
     * @param initialZoom 初始缩放比例，默认为2，以保持像素风格
     */
    constructor(scene: Phaser.Scene, initialZoom: number = 2) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        this.currentZoom = initialZoom;
        this.targetZoom = initialZoom;

        // 宝可梦风格：禁用Phaser内置的平滑跟随，我们自己实现更精细的平滑逻辑
        this.camera.setZoom(this.currentZoom);
        this.camera.setRoundPixels(true); // 确保像素清晰
    }

    /**
     * 设置相机跟随目标，并启用平滑跟随。
     * @param target 要跟随的游戏对象
     * @param speed 跟随平滑度，0.01（极慢）到1.0（瞬时），默认为0.05
     */
    public startFollow(target: Phaser.GameObjects.Components.Transform, speed: number = 0.05): void {
        this.target = target;
        this.followSpeed = Phaser.Math.Clamp(speed, 0.01, 1.0);
        this.isFollowing = true;
        
        // 立即将相机移动到目标位置，避免初始跳跃
        if (this.target) {
            this.camera.centerOn(this.target.x, this.target.y);
        }
    }

    /**
     * 停止跟随目标。
     */
    public stopFollow(): void {
        this.isFollowing = false;
        this.target = null;
    }

    /**
     * 动态缩放相机。
     * @param zoom 目标缩放比例
     * @param duration 缩放动画持续时间（毫秒）
     */
    public zoomTo(zoom: number, duration: number = 500): void {
        if (this.zoomTween) {
            this.zoomTween.stop();
        }

        this.targetZoom = zoom;
        this.zoomDuration = duration;

        this.zoomTween = this.scene.tweens.add({
            targets: this,
            currentZoom: this.targetZoom,
            duration: this.zoomDuration,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                this.camera.setZoom(this.currentZoom);
            },
            onComplete: () => {
                this.zoomTween = null;
            }
        });
    }

    /**
     * 触发相机震动效果。
     * @param intensity 震动强度，例如0.01到0.1
     * @param duration 震动持续时间（毫秒）
     */
    public shake(intensity: number = 0.05, duration: number = 200): void {
        this.isShaking = true;
        this.shakeIntensity = intensity * this.camera.width; // 强度转换为像素偏移
        this.shakeDuration = duration;
        this.shakeTimer = 0;
    }

    /**
     * 设置相机边界，确保相机不会移出地图范围。
     * @param x 地图左上角X坐标
     * @param y 地图左上角Y坐标
     * @param width 地图宽度
     * @param height 地图高度
     */
    public setBounds(x: number, y: number, width: number, height: number): void {
        this.camera.setBounds(x, y, width, height);
    }

    /**
     * 核心更新方法，应在场景的 update 循环中调用。
     * @param time 当前时间
     * @param delta 距离上一帧的时间差（毫秒）
     */
    public update(time: number, delta: number): void {
        // 1. 平滑跟随逻辑
        if (this.isFollowing && this.target) {
            const targetX = this.target.x;
            const targetY = this.target.y;

            const currentX = this.camera.scrollX + this.camera.width * 0.5;
            const currentY = this.camera.scrollY + this.camera.height * 0.5;

            // 使用线性插值（lerp）实现平滑跟随
            const newX = Phaser.Math.Linear(currentX, targetX, this.followSpeed);
            const newY = Phaser.Math.Linear(currentY, targetY, this.followSpeed);

            // centerOn 接受的是世界坐标，它会自动计算 scrollX/scrollY
            this.camera.centerOn(newX, newY);
        }

        // 2. 相机震动逻辑
        if (this.isShaking) {
            this.shakeTimer += delta;

            if (this.shakeTimer >= this.shakeDuration) {
                this.isShaking = false;
                // 震动结束，重置相机位置（通过重新centerOn目标来抵消最后的震动偏移）
                if (this.target) {
                    this.camera.centerOn(this.target.x, this.target.y);
                }
            } else {
                // 生成随机偏移
                const shakeFactor = 1 - this.shakeTimer / this.shakeDuration;
                const offsetX = (Math.random() * 2 - 1) * this.shakeIntensity * shakeFactor;
                const offsetY = (Math.random() * 2 - 1) * this.shakeIntensity * shakeFactor;

                // 临时应用偏移，直接修改scroll
                const currentScrollX = this.camera.scrollX;
                const currentScrollY = this.camera.scrollY;

                // 偏移量需要除以缩放比例，以在缩放后的视图中保持一致的震动感
                this.camera.setScroll(currentScrollX + offsetX / this.currentZoom, currentScrollY + offsetY / this.currentZoom);
            }
        }
        
        // 3. 确保缩放后像素保持清晰（在缩放补间动画中已处理）
    }

    /**
     * 获取当前相机缩放值。
     * @returns 当前缩放比例
     */
    public getZoom(): number {
        return this.currentZoom;
    }

    /**
     * 获取相机跟随的目标对象。
     * @returns 目标对象或null
     */
    public getTarget(): Phaser.GameObjects.Components.Transform | null {
        return this.target;
    }
}

// --------------------------------------------------------------------------------
// 辅助类型定义 (可选，但推荐用于清晰度)
// --------------------------------------------------------------------------------
/**
 * 相机控制器的配置接口
 */
export interface CameraControllerConfig {
    initialZoom?: number;
}