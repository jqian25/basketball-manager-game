import * as Phaser from 'phaser';

/**
 * 定义可被对象池管理的对象接口。
 * 任何需要被对象池化的类都应该实现此接口。
 */
export interface IPoolable extends Phaser.GameObjects.GameObject {
    /**
     * 当对象被从对象池取出时调用，用于初始化或重置状态。
     * @param args 任意初始化参数
     */
    activate(...args: any[]): void;

    /**
     * 当对象被放回对象池时调用，用于清理或禁用状态。
     */
    deactivate(): void;
}

/**
 * PerformanceOptimizer 类
 * 负责管理游戏中的对象池和资源（纹理、声音等）的引用计数，以实现性能优化。
 * 这是一个单例类，确保全局只有一个优化器实例。
 * 
 * 生产级质量要求：
 * 1. 单例模式，确保全局唯一性。
 * 2. 泛型对象池，支持不同类型的对象。
 * 3. 资源引用计数，实现资源的按需加载和卸载。
 * 4. 详细的TypeScript类型定义和JSDoc注释。
 */
export class PerformanceOptimizer {
    // 单例实例
    private static instance: PerformanceOptimizer;

    // 对象池 Map: key为对象类型名，value为该类型对象的对象池数组
    private objectPools: Map<string, IPoolable[]> = new Map();

    // 资源引用计数 Map: key为资源key，value为引用计数
    private resourceRefCounts: Map<string, number> = new Map();

    // 游戏场景引用，用于访问资源管理器
    private scene: Phaser.Scene | null = null;

    /**
     * 私有构造函数，防止外部直接实例化。
     */
    private constructor() {}

    /**
     * 获取 PerformanceOptimizer 的单例实例。
     * @returns PerformanceOptimizer 实例
     */
    public static getInstance(): PerformanceOptimizer {
        if (!PerformanceOptimizer.instance) {
            PerformanceOptimizer.instance = new PerformanceOptimizer();
        }
        return PerformanceOptimizer.instance;
    }

    /**
     * 初始化优化器，传入当前场景引用。
     * 必须在游戏启动时调用一次。
     * @param scene 当前的 Phaser.Scene 实例
     */
    public initialize(scene: Phaser.Scene): void {
        this.scene = scene;
        console.log("PerformanceOptimizer initialized.");
    }

    // =========================================================================
    // 对象池 (Object Pooling)
    // =========================================================================

    /**
     * 预先创建指定数量的对象并放入对象池。
     * @param typeName 对象的类型名称（用于Map的Key）
     * @param factory 对象的创建函数
     * @param count 预创建的数量
     * @param scene Phaser场景实例，用于创建游戏对象
     */
    public prePopulatePool<T extends IPoolable>(
        typeName: string,
        factory: (scene: Phaser.Scene) => T,
        count: number,
        scene: Phaser.Scene
    ): void {
        if (!this.objectPools.has(typeName)) {
            this.objectPools.set(typeName, []);
        }
        const pool = this.objectPools.get(typeName)!;

        for (let i = 0; i < count; i++) {
            const obj = factory(scene);
            obj.deactivate(); // 初始状态为禁用/隐藏
            pool.push(obj);
        }
        console.log(`Pre-populated pool for ${typeName} with ${count} objects.`);
    }

    /**
     * 从对象池中获取一个对象。
     * 如果对象池为空，则使用工厂函数创建一个新对象。
     * @param typeName 对象的类型名称
     * @param factory 对象的创建函数（在池为空时使用）
     * @param args 传递给对象的 activate 方法的参数
     * @returns IPoolable 实例
     */
    public getFromPool<T extends IPoolable>(
        typeName: string,
        factory: (scene: Phaser.Scene) => T,
        ...args: any[]
    ): T {
        if (!this.scene) {
            throw new Error("PerformanceOptimizer not initialized. Call initialize() first.");
        }

        if (!this.objectPools.has(typeName)) {
            this.objectPools.set(typeName, []);
        }

        const pool = this.objectPools.get(typeName)!;
        let obj: T;

        if (pool.length > 0) {
            // 从池中取出
            obj = pool.pop() as T;
        } else {
            // 池中无可用对象，创建新对象
            obj = factory(this.scene) as T;
            // 警告：在游戏运行时创建新对象可能导致性能波动，应尽量预先填充对象池
            console.warn(`Pool for ${typeName} was empty. Created a new object.`);
        }

        // 激活对象并设置状态
        obj.activate(...args);
        obj.setActive(true);
        obj.setVisible(true);

        return obj;
    }

    /**
     * 将一个对象放回对象池。
     * @param typeName 对象的类型名称
     * @param obj 要放回的对象
     */
    public returnToPool(typeName: string, obj: IPoolable): void {
        if (!this.objectPools.has(typeName)) {
            // 理论上不应该发生，但作为安全措施
            this.objectPools.set(typeName, []);
        }

        // 清理/禁用对象状态
        obj.deactivate();
        obj.setActive(false);
        obj.setVisible(false);

        const pool = this.objectPools.get(typeName)!;
        if (pool.indexOf(obj) === -1) {
            pool.push(obj);
        }
    }

    /**
     * 清理指定类型的所有对象池。
     * @param typeName 对象的类型名称
     */
    public clearPool(typeName: string): void {
        const pool = this.objectPools.get(typeName);
        if (pool) {
            // 销毁池中的所有对象，释放内存
            pool.forEach(obj => obj.destroy());
            this.objectPools.delete(typeName);
            console.log(`Cleared object pool for ${typeName}.`);
        }
    }

    /**
     * 清理所有对象池。
     */
    public clearAllPools(): void {
        this.objectPools.forEach((pool, typeName) => {
            pool.forEach(obj => obj.destroy());
            console.log(`Cleared object pool for ${typeName}.`);
        });
        this.objectPools.clear();
    }

    // =========================================================================
    // 资源管理 (Resource Management - Reference Counting)
    // =========================================================================

    /**
     * 增加资源的引用计数。
     * @param key 资源的键名（如纹理key, 声音key）
     */
    public acquireResource(key: string): void {
        const count = this.resourceRefCounts.get(key) || 0;
        this.resourceRefCounts.set(key, count + 1);
        // console.log(`Acquired resource: ${key}. Count: ${count + 1}`);
    }

    /**
     * 减少资源的引用计数。
     * 当引用计数降为 0 时，尝试卸载该资源。
     * @param key 资源的键名
     */
    public releaseResource(key: string): void {
        const count = this.resourceRefCounts.get(key);

        if (count === undefined || count <= 0) {
            console.warn(`Attempted to release unacquired or already zero-count resource: ${key}`);
            return;
        }

        const newCount = count - 1;
        this.resourceRefCounts.set(key, newCount);
        // console.log(`Released resource: ${key}. Count: ${newCount}`);

        if (newCount === 0) {
            this.unloadResource(key);
            this.resourceRefCounts.delete(key);
        }
    }

    /**
     * 检查资源是否已被加载且引用计数大于 0。
     * @param key 资源的键名
     * @returns boolean
     */
    public isResourceInUse(key: string): boolean {
        const count = this.resourceRefCounts.get(key);
        return count !== undefined && count > 0;
    }

    /**
     * 内部方法：尝试从 Phaser 资源管理器中卸载资源。
     * @param key 资源的键名
     */
    private unloadResource(key: string): void {
        if (!this.scene) {
            console.error("Cannot unload resource: PerformanceOptimizer not initialized.");
            return;
        }

        // 卸载逻辑：通过 Phaser 场景的 Cache 和 TextureManager 移除资源
        const textureManager = this.scene.sys.textures;
        const cache = this.scene.sys.cache;

        // 尝试卸载纹理
        if (textureManager.exists(key)) {
            textureManager.remove(key);
            console.log(`Unloaded texture resource: ${key}`);
            return;
        }

        // 尝试卸载音频
        if (cache.audio.exists(key)) {
            cache.audio.remove(key);
            console.log(`Unloaded audio resource: ${key}`);
            return;
        }

        // 尝试卸载其他类型数据 (如JSON, XML, Text)
        if (cache.json.exists(key)) {
            cache.json.remove(key);
            console.log(`Unloaded JSON resource: ${key}`);
            return;
        }
        
        // 可根据项目需求添加更多类型的卸载逻辑 (e.g., bitmapFont, tilemap, video)

        console.warn(`Resource ${key} was released but could not be explicitly unloaded from common caches.`);
    }

    /**
     * 清理所有资源引用计数，但不强制卸载资源。
     * 适用于场景切换时重置计数。
     */
    public clearAllResourceRefCounts(): void {
        this.resourceRefCounts.clear();
        console.log("Cleared all resource reference counts.");
    }

    // =========================================================================
    // 辅助方法 (Utility)
    // =========================================================================

    /**
     * 打印当前对象池的状态。
     */
    public logPoolStatus(): void {
        console.log("--- Object Pool Status ---");
        this.objectPools.forEach((pool, typeName) => {
            console.log(`[${typeName}]: ${pool.length} objects available.`);
        });
        console.log("--------------------------");
    }

    /**
     * 打印当前资源引用计数的状态。
     */
    public logResourceStatus(): void {
        console.log("--- Resource Reference Status ---");
        this.resourceRefCounts.forEach((count, key) => {
            console.log(`[${key}]: ${count} references.`);
        });
        console.log("---------------------------------");
    }
}