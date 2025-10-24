import * as Phaser from 'phaser';

/**
 * @enum CollisionType
 * @description 碰撞类型枚举，用于区分不同类型的碰撞目标，符合GB风格宝可梦游戏的网格化设计。
 */
export enum CollisionType {
    /** 地图瓦片碰撞，通常用于不可通行的地形 */
    TILE = 'tile',
    /** 建筑物碰撞，通常是地图上固定的、较大的不可通行区域 */
    BUILDING = 'building',
    /** NPC碰撞，用于角色之间的交互和阻挡 */
    NPC = 'npc',
}

/**
 * @interface ICollidable
 * @description 碰撞目标接口，用于统一处理所有可参与碰撞检测的实体（如玩家、NPC、建筑）。
 * 实现了该接口的实体可以被CollisionSystem管理和检测。
 */
export interface ICollidable {
    /** 唯一标识符，用于在系统中注册和排除自身 */
    id: string;
    /** 碰撞类型，用于分类处理 */
    collisionType: CollisionType;
    /**
     * 获取碰撞体边界。
     * @returns {Phaser.Geom.Rectangle} Phaser的矩形对象，表示实体的精确碰撞区域。
     */
    getBounds(): Phaser.Geom.Rectangle;
    /**
     * 碰撞发生时的可选回调函数。
     * @param {ICollidable} collider 与当前实体发生碰撞的另一个实体。
     */
    onCollide?: (collider: ICollidable) => void;
}

/**
 * @class CollisionSystem
 * @description 碰撞系统核心类。
 * 负责管理所有可碰撞实体和执行精确的瓦片、建筑、NPC碰撞检测。
 * 采用“预测性”检测模型，符合Game Boy风格宝可梦游戏的网格移动机制。
 * 
 * @requires Phaser.Scene 场景实例
 * @requires Phaser.Tilemaps.TilemapLayer 瓦片碰撞层
 */
export class CollisionSystem {
    private scene: Phaser.Scene;
    /** 存储所有注册的非瓦片可碰撞实体（建筑和NPC） */
    private collidables: ICollidable[] = [];
    /** 瓦片地图层，用于精确的瓦片碰撞检测 */
    private tileCollisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    /** 游戏中的瓦片大小（例如16x16），是GB风格游戏网格移动的基础 */
    private tileSize: number;

    /**
     * 构造函数。
     * @param {Phaser.Scene} scene Phaser场景实例。
     * @param {number} tileSize 游戏中的瓦片大小（默认为16）。
     */
    constructor(scene: Phaser.Scene, tileSize: number = 16) {
        this.scene = scene;
        this.tileSize = tileSize;
        // 性能优化：在GB风格游戏中，通常不需要在每帧的update中进行全局碰撞检测，
        // 而是只在角色尝试移动时进行预测性检测。因此，不默认注册update事件。
    }

    /**
     * 设置瓦片碰撞层。
     * 必须在地图加载后调用此方法，以启用瓦片碰撞检测。
     * @param {Phaser.Tilemaps.TilemapLayer} layer 包含碰撞属性的瓦片地图层。
     */
    public setTileCollisionLayer(layer: Phaser.Tilemaps.TilemapLayer): void {
        this.tileCollisionLayer = layer;
        // 性能优化：可以通过预处理瓦片数据来进一步优化，但Phaser的getTileAt已足够高效。
    }

    /**
     * 注册一个可碰撞实体（建筑或NPC）。
     * @param {ICollidable} collidable 实现了ICollidable接口的实体。
     */
    public register(collidable: ICollidable): void {
        if (!this.collidables.find(c => c.id === collidable.id)) {
            this.collidables.push(collidable);
        }
    }

    /**
     * 移除一个可碰撞实体。
     * @param {string} id 实体ID。
     */
    public unregister(id: string): void {
        this.collidables = this.collidables.filter(c => c.id !== id);
    }

    /**
     * 核心碰撞检测方法：检查一个给定的矩形区域是否与任何注册的实体或瓦片发生碰撞。
     * 这是一个“预测性”检测，用于在角色移动前判断新位置是否可行，是GB风格游戏移动逻辑的关键。
     * 
     * @param {Phaser.Geom.Rectangle} targetBounds 待检测的矩形区域（例如角色的预测新位置）。
     * @param {string[]} excludeIds 排除在检测之外的实体ID列表（例如自身）。
     * @returns {boolean} 如果发生碰撞，返回true；否则返回false。
     */
    public checkCollision(targetBounds: Phaser.Geom.Rectangle, excludeIds: string[] = []): boolean {
        // 1. 精确的瓦片碰撞检测
        if (this.checkTileCollision(targetBounds)) {
            return true;
        }

        // 2. 实体（建筑/NPC）碰撞检测
        // 遍历所有注册的实体，检查是否与目标区域相交
        for (const collidable of this.collidables) {
            if (excludeIds.includes(collidable.id)) {
                continue;
            }

            // 使用Phaser的Intersects方法进行精确矩形碰撞检测
            if (Phaser.Geom.Intersects.RectangleToRectangle(targetBounds, collidable.getBounds())) {
                // 触发回调（可选）：通知被碰撞的实体
                // 注意：这里我们只触发被碰撞实体的onCollide，而不是触发检测发起者的onCollide
                collidable.onCollide?.({ 
                    id: 'target_area', 
                    collisionType: CollisionType.TILE, // 碰撞发起者类型不重要，这里只是一个占位符
                    getBounds: () => targetBounds 
                });
                return true;
            }
        }

        return false;
    }

    /**
     * 精确的瓦片碰撞检测实现。
     * 检查给定的矩形区域是否覆盖了任何具有碰撞属性的瓦片。
     * 
     * @private
     * @param {Phaser.Geom.Rectangle} targetBounds 待检测的矩形区域。
     * @returns {boolean} 如果与瓦片发生碰撞，返回true。
     */
    private checkTileCollision(targetBounds: Phaser.Geom.Rectangle): boolean {
        if (!this.tileCollisionLayer) {
            // 如果没有设置瓦片碰撞层，则不进行瓦片碰撞检测
            return false;
        }

        // 将像素坐标转换为瓦片坐标范围，确保覆盖所有可能相交的瓦片
        const startTileX = this.tileCollisionLayer.worldToTileX(targetBounds.x);
        const startTileY = this.tileCollisionLayer.worldToTileY(targetBounds.y);
        const endTileX = this.tileCollisionLayer.worldToTileX(targetBounds.right - 1);
        const endTileY = this.tileCollisionLayer.worldToTileY(targetBounds.bottom - 1);

        // 遍历矩形区域覆盖的所有瓦片
        for (let y = startTileY; y <= endTileY; y++) {
            for (let x = startTileX; x <= endTileX; x++) {
                const tile = this.tileCollisionLayer.getTileAt(x, y);

                // 检查瓦片是否存在且具有碰撞属性
                // 假设碰撞属性通过Tiled编辑器设置的'collides: true'等属性来标记
                if (tile && tile.properties && tile.properties.collides === true) {
                    // 为了“精确碰撞”，我们检查矩形是否与瓦片边界相交。
                    const tileBounds = new Phaser.Geom.Rectangle(
                        tile.pixelX, 
                        tile.pixelY, 
                        this.tileSize, 
                        this.tileSize
                    );
                    
                    if (Phaser.Geom.Intersects.RectangleToRectangle(targetBounds, tileBounds)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * 获取瓦片大小。
     * @returns {number} 瓦片大小。
     */
    public getTileSize(): number {
        return this.tileSize;
    }
}
