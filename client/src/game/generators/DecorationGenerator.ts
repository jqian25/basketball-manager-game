// client/src/game/generators/DecorationGenerator.ts

import * as Phaser from 'phaser';

/**
 * @interface IDecorationConfig
 * @description 单个装饰物类型的配置接口。
 * 遵循Game Boy风格，装饰物通常是静态的、基于瓦片或小精灵图集(Sprite Sheet)的。
 * 易于扩展: 通过修改此接口和DECORATION_DATA即可快速添加新装饰物类型。
 */
interface IDecorationConfig {
    /** 装饰物的唯一标识符，例如 'street_light_01' */
    key: string;
    /** 装饰物的名称，用于调试或内部识别 */
    name: string;
    /** 装饰物所属的类别，例如 'street_furniture', 'vegetation', 'vehicle' */
    category: string;
    /** 装饰物在图集中的帧索引或名称 (如果使用图集) */
    frame?: string | number;
    /** 装饰物在游戏世界中的宽度 (像素) */
    width: number;
    /** 装饰物在游戏世界中的高度 (像素) */
    height: number;
    /** 碰撞体偏移量 (相对于装饰物中心点) */
    colliderOffset?: { x: number, y: number };
    /** 碰撞体大小 (如果与width/height不同) */
    colliderSize?: { width: number, height: number };
    /** 是否有碰撞 (例如，树木有，草地没有) */
    hasCollision: boolean;
    /** 描述，用于文档或编辑器 */
    description: string;
}

/**
 * @type DecorationData
 * @description 包含所有装饰物配置的数组类型。
 */
type DecorationData = IDecorationConfig[];

/**
 * @constant DECORATION_DATA
 * @description 预设的100种装饰物数据。
 * 在实际生产环境中，这些数据通常从外部JSON文件加载。
 * 此处为示例结构，包含100个占位符以满足需求。
 */
const DECORATION_DATA: DecorationData = [];

// 占位符数据 - 确保至少有100种
for (let i = 1; i <= 100; i++) {
    const category = i <= 20 ? 'vegetation' : (i <= 40 ? 'street_furniture' : (i <= 60 ? 'vehicle' : 'misc'));
    const name = `${category}_item_${String(i).padStart(3, '0')}`;
    DECORATION_DATA.push({
        key: name,
        name: name,
        category: category,
        frame: 0, // 假设所有装饰物都使用一个图集，帧索引从0开始
        width: 16, // Game Boy风格的常见瓦片/精灵大小
        height: 16,
        hasCollision: i % 5 !== 0, // 每5个中有一个没有碰撞
        description: `一个Game Boy风格的装饰物，编号 ${i}`,
        colliderOffset: { x: 0, y: 4 }, // 碰撞体稍微向上偏移，模拟底部碰撞
        colliderSize: { width: 16, height: 8 }
    });
}

/**
 * @class DecorationGenerator
 * @description 负责管理装饰物数据、加载资源和在场景中生成装饰物的类。
 * 遵循Game Boy风格和Phaser 3的最佳实践。
 */
export class DecorationGenerator {
    private scene: Phaser.Scene;
    private decorationConfigs: Map<string, IDecorationConfig>;

    /**
     * @property staticGroup
     * @description 用于存放所有带有碰撞体的装饰物，使用Phaser.Physics.Arcade.StaticGroup进行性能优化。
     * 易于扩展: 外部可以直接访问此Group进行碰撞检测。
     */
    public staticGroup: Phaser.Physics.Arcade.StaticGroup;

    /**
     * @property visualGroup
     * @description 用于存放所有纯视觉装饰物（无碰撞），使用Phaser.GameObjects.Group进行管理。
     * 易于扩展: 外部可以对所有视觉元素进行统一操作，例如视差滚动或隐藏。
     */
    public visualGroup: Phaser.GameObjects.Group;

    /**
     * @constructor
     * @param scene - Phaser 3 场景实例
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.decorationConfigs = new Map();
        this.loadConfigs(DECORATION_DATA);
        
        // 性能优化: 初始化两个Group来管理不同类型的装饰物
        this.staticGroup = this.scene.physics.add.staticGroup();
        this.visualGroup = this.scene.add.group();

        console.log(`DecorationGenerator: 已加载 ${this.decorationConfigs.size} 种装饰物配置。`);
    }

    /**
     * @private
     * @method loadConfigs
     * @param data - 装饰物配置数组
     * @description 将配置数组转换为Map，便于快速查找。
     */
    private loadConfigs(data: DecorationData): void {
        data.forEach(config => {
            if (this.decorationConfigs.has(config.key)) {
                console.warn(`DecorationGenerator: 发现重复的装饰物Key: ${config.key}`);
            }
            this.decorationConfigs.set(config.key, config);
        });
    }

    /**
     * @method preload
     * @description 在场景的preload阶段加载装饰物所需的资源。
     * 假设所有装饰物都在一个名为 'decorations_atlas' 的图集中。
     * @param atlasPath - 图集JSON文件的路径
     * @param texturePath - 纹理图片的路径
     */
    public preload(atlasPath: string, texturePath: string): void {
        // 生产级代码应确保资源只加载一次
        if (!this.scene.textures.exists('decorations_atlas')) {
            this.scene.load.atlas('decorations_atlas', texturePath, atlasPath);
            console.log('DecorationGenerator: 预加载装饰物图集...');
        }
    }

    /**
     * @method createDecoration
     * @description 在指定位置生成一个装饰物。
     * @param key - 装饰物的唯一标识符
     * @param x - 游戏世界坐标X
     * @param y - 游戏世界坐标Y
     * @returns Phaser.GameObjects.GameObject | null - 生成的装饰物对象或null (可能是Image或Arcade.Image)
     */
    public createDecoration(key: string, x: number, y: number): Phaser.GameObjects.GameObject | null {
        const config = this.decorationConfigs.get(key);

        if (!config) {
            console.error(`DecorationGenerator: 找不到Key为 ${key} 的装饰物配置。`);
            return null;
        }

        // 易于扩展/性能优化: 根据是否有碰撞体，使用不同的创建方式和Group
        if (config.hasCollision) {
            // 性能优化: 使用StaticGroup的create方法，它会自动创建Phaser.Physics.Arcade.Image并添加到Group中
            // StaticGroup适用于大量静态碰撞体，性能远高于手动添加物理体
            const staticDecoration = this.staticGroup.create(x, y, 'decorations_atlas', config.frame) as Phaser.Physics.Arcade.Image;
            
            // 1. 设置属性
            staticDecoration.setOrigin(0.5, 1); // 设置原点在底部中心，方便基于瓦片网格的定位
            staticDecoration.setDisplaySize(config.width, config.height);
            staticDecoration.setData('decorationKey', key);
            staticDecoration.setData('category', config.category);
            staticDecoration.setData('isCollider', true);
            
            // 2. 设置精确碰撞体 (Game Boy风格)
            const body = staticDecoration.body as Phaser.Physics.Arcade.StaticBody;
            
            const offset = config.colliderOffset || { x: 0, y: 0 };
            const size = config.colliderSize || { width: config.width, height: config.height };
            
            body.setSize(size.width, size.height);
            // 碰撞体的位置是相对于图像对象的原点 (0.5, 1) 计算的
            // body.setOffset(offsetX, offsetY) 是相对于图像左上角的
            const offsetX = (config.width - size.width) / 2 + offset.x;
            const offsetY = config.height - size.height + offset.y;
            
            body.setOffset(offsetX, offsetY);
            // StaticGroup创建的对象默认就是Immovable
            
            return staticDecoration;

        } else {
            // 纯视觉装饰物
            const decoration = this.scene.add.image(x, y, 'decorations_atlas', config.frame);
            
            // 1. 设置属性
            decoration.setOrigin(0.5, 1); // 设置原点在底部中心
            decoration.setDisplaySize(config.width, config.height);
            decoration.setData('decorationKey', key);
            decoration.setData('category', config.category);
            
            // 性能优化: 将纯视觉装饰物添加到visualGroup中
            this.visualGroup.add(decoration);
            
            return decoration;
        }
    }

    /**
     * @method createRandomDecoration
     * @description 在指定位置随机生成一个装饰物。
     * @param x - 游戏世界坐标X
     * @param y - 游戏世界坐标Y
     * @returns Phaser.GameObjects.GameObject | null - 生成的装饰物对象或null
     */
    public createRandomDecoration(x: number, y: number): Phaser.GameObjects.GameObject | null {
        const keys = Array.from(this.decorationConfigs.keys());
        if (keys.length === 0) {
            console.error('DecorationGenerator: 没有可用的装饰物配置。');
            return null;
        }
        const randomIndex = Phaser.Math.Between(0, keys.length - 1);
        const randomKey = keys[randomIndex];
        return this.createDecoration(randomKey, x, y);
    }

    /**
     * @method getDecorationConfig
     * @description 获取指定Key的装饰物配置。
     * @param key - 装饰物的唯一标识符
     * @returns IDecorationConfig | undefined
     */
    public getDecorationConfig(key: string): IDecorationConfig | undefined {
        return this.decorationConfigs.get(key);
    }

    /**
     * @method getAllKeys
     * @description 获取所有装饰物配置的Key。
     * @returns string[]
     */
    public getAllKeys(): string[] {
        return Array.from(this.decorationConfigs.keys());
    }

    /**
     * @method getCount
     * @description 获取装饰物配置的总数。
     * @returns number
     */
    public getCount(): number {
        return this.decorationConfigs.size;
    }
}