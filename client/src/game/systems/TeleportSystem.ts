import Phaser from 'phaser';

/**
 * @interface TeleportTarget
 * 传送目标点的接口定义
 * 用于描述一个传送事件的目标位置和目标地图。
 */
export interface TeleportTarget {
    /** 目标场景/地图的唯一键名 */
    sceneKey: string;
    /** 目标位置的X坐标 (以瓦片为单位) */
    tileX: number;
    /** 目标位置的Y坐标 (以瓦片为单位) */
    tileY: number;
    /** 传送后的朝向 (可选) */
    direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * @interface TeleportEvent
 * 传送事件的接口定义
 * 用于描述一个触发传送事件的区域和其对应的目标。
 */
export interface TeleportEvent {
    /** 触发区域的唯一标识符 (例如: 'door_1', 'exit_house') */
    id: string;
    /** 触发区域在当前地图的X坐标 (以瓦片为单位) */
    tileX: number;
    /** 触发区域在当前地图的Y坐标 (以瓦片为单位) */
    tileY: number;
    /** 触发区域的宽度 (以瓦片为单位) */
    width: number;
    /** 触发区域的高度 (以瓦片为单位) */
    height: number;
    /** 传送的目标信息 */
    target: TeleportTarget;
}

/**
 * TeleportSystem - 传送系统
 * 负责处理地图间的切换和建筑内外场景的过渡。
 * 遵循宝可梦Game Boy风格：即时或短暂黑屏过渡。
 * 
 * 核心功能:
 * 1. 注册和管理地图上的所有传送事件。
 * 2. 监听玩家与传送区域的碰撞或交互。
 * 3. 执行场景切换和玩家位置重定位。
 * 4. 提供符合GB风格的过渡效果 (如黑屏渐变)。
 * 5. 易于扩展，支持异步加载地图资源。
 */
export class TeleportSystem {
    private scene: Phaser.Scene;
    private teleportEvents: TeleportEvent[] = [];
    private playerSprite: Phaser.GameObjects.Sprite | null = null;
    private tileSize: number = 16; // 宝可梦GB风格的瓦片大小，通常是16x16

    /**
     * 构造函数
     * @param scene 当前Phaser场景实例
     * @param tileSize 瓦片大小 (默认为16)
     */
    constructor(scene: Phaser.Scene, tileSize: number = 16) {
        this.scene = scene;
        this.tileSize = tileSize;
        console.log('TeleportSystem initialized.');
    }

    /**
     * 设置玩家精灵，用于碰撞检测和位置重定位。
     * @param playerSprite 玩家的Phaser精灵对象
     */
    public setPlayer(playerSprite: Phaser.GameObjects.Sprite): void {
        this.playerSprite = playerSprite;
    }

    /**
     * 注册一个新的传送事件。
     * @param event 传送事件对象
     */
    public registerTeleportEvent(event: TeleportEvent): void {
        this.teleportEvents.push(event);
        console.log(`Registered teleport event: ${event.id} to ${event.target.sceneKey}`);
    }

    /**
     * 注册多个传送事件。
     * @param events 传送事件对象数组
     */
    public registerTeleportEvents(events: TeleportEvent[]): void {
        events.forEach(event => this.registerTeleportEvent(event));
    }

    /**
     * 核心更新逻辑，每帧调用，用于检测玩家是否触发了传送事件。
     * 性能优化考量：仅在玩家移动后或特定间隔进行检测，但为简化示例，这里每帧检测。
     */
    public update(): void {
        if (!this.playerSprite) {
            return;
        }

        // 获取玩家的中心点坐标 (以像素为单位)
        const playerX = this.playerSprite.x;
        const playerY = this.playerSprite.y;

        for (const event of this.teleportEvents) {
            // 将瓦片坐标转换为像素坐标
            const eventPixelX = event.tileX * this.tileSize;
            const eventPixelY = event.tileY * this.tileSize;
            const eventPixelWidth = event.width * this.tileSize;
            const eventPixelHeight = event.height * this.tileSize;

            // 简单的矩形碰撞检测 (AABB)
            // 检查玩家中心点是否在传送区域内
            if (
                playerX >= eventPixelX &&
                playerX < eventPixelX + eventPixelWidth &&
                playerY >= eventPixelY &&
                playerY < eventPixelY + eventPixelHeight
            ) {
                // 玩家进入了传送区域
                this.executeTeleport(event.target);
                // 一旦触发，立即退出循环，避免重复触发
                break; 
            }
        }
    }

    /**
     * 执行传送操作，处理场景切换和过渡效果。
     * 遵循GB风格：短暂黑屏渐变。
     * @param target 传送目标信息
     */
    private executeTeleport(target: TeleportTarget): void {
        // 1. 禁用玩家输入和系统更新，防止在过渡期间进行操作
        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = false;
        }
        // 停止当前场景的 update 循环中的传送检测
        this.scene.sys.events.off('update', this.update, this);

        // 2. 实现GB风格的黑屏渐变过渡
        const fadeDuration = 300; // 300毫秒的黑屏渐变时间
        const camera = this.scene.cameras.main;

        // 渐出到黑色
        camera.fadeOut(fadeDuration, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                // 3. 渐变完成，执行场景切换
                this.switchScene(target);
            }
        });
    }

    /**
     * 切换到目标场景并设置玩家的新位置。
     * 
     * 性能优化/扩展性说明：
     * 1. 使用 scene.stop() 停止当前场景，释放资源。
     * 2. 使用 scene.start() 启动目标场景，并将 `teleportTarget` 和 `playerSpriteRef` 
     *    作为数据传递，确保玩家精灵在场景间复用，避免了销毁和重建。
     * @param target 传送目标信息
     */
    private switchScene(target: TeleportTarget): void {
        // 停止当前场景
        this.scene.scene.stop(this.scene.scene.key);
        
        // 启动/重启目标场景
        // 传递目标信息作为启动数据，目标场景需要处理这些数据
        this.scene.scene.start(target.sceneKey, {
            teleportTarget: target,
            // 将玩家精灵的引用也传递过去，以便目标场景可以重新设置它
            playerSpriteRef: this.player 
        });
    }

    /**
     * 在目标场景中，根据传送目标信息重新定位玩家。
     * 目标场景在启动后应调用此方法。
     * 
     * 性能优化/扩展性说明：
     * 1. 静态方法方便在任何场景的 `create` 方法中调用。
     * 2. 重新定位玩家后，立即执行 `fadeIn` 效果，完成过渡。
     * 3. 重新启用玩家输入和相机跟随。
     * @param target 传送目标信息
     * @param playerSprite 玩家的Phaser精灵对象
     * @param scene 目标场景实例
     */
    public static repositionPlayer(target: TeleportTarget, playerSprite: Phaser.GameObjects.Sprite, scene: Phaser.Scene): void {
        // 假设场景中有一个 tileSize 属性，如果没有则默认为 16
        const tileSize = (scene as any).tileSize || 16; 
        
        // 计算新的像素位置 (中心点)
        // 瓦片坐标 * 瓦片大小 + 半个瓦片大小 = 瓦片中心点的像素坐标
        const newX = target.tileX * tileSize + tileSize / 2;
        const newY = target.tileY * tileSize + tileSize / 2;

        playerSprite.setPosition(newX, newY);

        // 重新启用玩家输入和相机跟随
        if (scene.input.keyboard) {
            scene.input.keyboard.enabled = true;
        }
        scene.cameras.main.startFollow(playerSprite);
        scene.cameras.main.fadeIn(300, 0, 0, 0); // 从黑屏渐入

        // 可以在这里处理玩家朝向的改变 (取决于玩家控制器实现)
        if (target.direction) {
            console.log(`Player new direction: ${target.direction}`);
        }
        
        console.log(`Player repositioned to: (${target.tileX}, ${target.tileY}) in scene: ${target.sceneKey}`);
    }

    /**
     * 销毁系统，清理资源和事件监听。
     */
    public destroy(): void {
        this.teleportEvents = [];
        this.playerSprite = null;
        this.scene.sys.events.off('update', this.update, this);
        console.log('TeleportSystem destroyed.');
    }
}

// --------------------------------------------------------------------------------
// 示例用法 (仅作参考，实际使用时应在游戏场景中集成)
// --------------------------------------------------------------------------------

// 假设这是一个通用的世界场景基类，用于演示集成
class WorldScene extends Phaser.Scene {
    protected teleportSystem!: TeleportSystem;
    protected player!: Phaser.GameObjects.Sprite;
    public tileSize: number = 16; // 场景瓦片大小

    constructor(key: string) {
        super(key);
    }

    // ... preload, create, update 方法应在实际子类中实现 ...
}
