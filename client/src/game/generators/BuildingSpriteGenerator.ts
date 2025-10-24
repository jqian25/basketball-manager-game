import * as Phaser from 'phaser';

/**
 * 定义建筑的类型和变体。
 * 建筑类型（如 'RESIDENCE'）应映射到纹理图集中的基础帧名。
 * 变体（如 'A', 'B', 'C'）将通过后缀添加到基础帧名后。
 * 
 * 假设纹理图集中有以下帧：
 * - RESIDENCE_A
 * - RESIDENCE_B
 * - RESIDENCE_C
 * - SHOP_A
 * - SHOP_B
 * - ...
 */
export type BuildingType = 
    | 'RESIDENCE' | 'SHOP' | 'GYM' | 'SCHOOL' | 'HOSPITAL' | 'POLICE_STATION' | 'FIRE_STATION' 
    | 'HOTEL' | 'RESTAURANT' | 'CAFE' | 'LIBRARY' | 'MUSEUM' | 'LABORATORY' | 'POWER_PLANT' 
    | 'FACTORY' | 'WAREHOUSE' | 'OFFICE' | 'BANK' | 'MARKET' | 'TOWER' | 'TEMPLE' 
    | 'CHURCH' | 'CASTLE' | 'FARM' | 'LIGHTHOUSE' | 'DOCK' | 'TRAIN_STATION' | 'BUS_STOP' 
    | 'PARK_BUILDING' | 'ARENA';

export type BuildingVariant = 'A' | 'B' | 'C';

/**
 * 建筑配置接口，用于描述一个建筑实例。
 * 继承自Phaser的Sprite配置，并添加了业务所需的元数据。
 */
export interface BuildingConfig extends Phaser.Types.GameObjects.Sprite.SpriteConfig {
    /** 建筑的唯一ID，用于在游戏逻辑中引用。 */
    id: string;
    /** 建筑的类型，用于查找基础帧名。 */
    type: BuildingType;
    /** 建筑的变体，用于确定最终的帧名。 */
    variant: BuildingVariant;
    /** 建筑的名称，用于UI显示等。 */
    name: string;
}

/**
 * 建筑Sprite批量生成器。
 * 负责根据预设的建筑类型和变体，生成用于创建Phaser Sprite的配置数组。
 * 旨在实现高性能、易于扩展和符合Game Boy风格的像素艺术标准。
 */
export class BuildingSpriteGenerator {
    private readonly textureAtlasKey: string;
    private readonly buildingTypes: BuildingType[] = [
        'RESIDENCE', 'SHOP', 'GYM', 'SCHOOL', 'HOSPITAL', 'POLICE_STATION', 'FIRE_STATION', 
        'HOTEL', 'RESTAURANT', 'CAFE', 'LIBRARY', 'MUSEUM', 'LABORATORY', 'POWER_PLANT', 
        'FACTORY', 'WAREHOUSE', 'OFFICE', 'BANK', 'MARKET', 'TOWER', 'TEMPLE', 
        'CHURCH', 'CASTLE', 'FARM', 'LIGHTHOUSE', 'DOCK', 'TRAIN_STATION', 'BUS_STOP', 
        'PARK_BUILDING', 'ARENA'
    ];
    private readonly variants: BuildingVariant[] = ['A', 'B', 'C'];

    /**
     * 构造函数。
     * @param textureAtlasKey 建筑Sprite所在的Phaser纹理图集的键名。
     */
    constructor(textureAtlasKey: string) {
        if (this.buildingTypes.length !== 30) {
            console.warn(`BuildingSpriteGenerator: Expected 30 building types, found ${this.buildingTypes.length}.`);
        }
        this.textureAtlasKey = textureAtlasKey;
    }

    /**
     * 内部辅助函数：根据类型和变体生成完整的纹理帧名。
     * @param type 建筑类型。
     * @param variant 建筑变体。
     * @returns 完整的纹理帧名（例如：'RESIDENCE_A'）。
     */
    private getFrameName(type: BuildingType, variant: BuildingVariant): string {
        return `${type}_${variant}`;
    }

    /**
     * 内部辅助函数：生成一个建筑的友好的中文名称。
     * @param type 建筑类型。
     * @param variant 建筑变体。
     * @returns 友好的建筑名称（例如：'住宅 A'）。
     */
    private getFriendlyName(type: BuildingType, variant: BuildingVariant): string {
        const nameMap: Record<BuildingType, string> = {
            'RESIDENCE': '住宅', 'SHOP': '商店', 'GYM': '体育馆', 'SCHOOL': '学校', 'HOSPITAL': '医院', 
            'POLICE_STATION': '警察局', 'FIRE_STATION': '消防局', 'HOTEL': '酒店', 'RESTAURANT': '餐厅', 
            'CAFE': '咖啡馆', 'LIBRARY': '图书馆', 'MUSEUM': '博物馆', 'LABORATORY': '实验室', 
            'POWER_PLANT': '发电厂', 'FACTORY': '工厂', 'WAREHOUSE': '仓库', 'OFFICE': '办公室', 
            'BANK': '银行', 'MARKET': '市场', 'TOWER': '塔楼', 'TEMPLE': '寺庙', 
            'CHURCH': '教堂', 'CASTLE': '城堡', 'FARM': '农场', 'LIGHTHOUSE': '灯塔', 
            'DOCK': '码头', 'TRAIN_STATION': '火车站', 'BUS_STOP': '公交站', 
            'PARK_BUILDING': '公园建筑', 'ARENA': '竞技场'
        };
        const variantMap: Record<BuildingVariant, string> = { 'A': 'A', 'B': 'B', 'C': 'C' };
        return `${nameMap[type]} ${variantMap[variant]}`;
    }

    /**
     * 批量生成所有建筑的Sprite配置。
     * 
     * @param startX 第一个建筑的X坐标。
     * @param startY 第一个建筑的Y坐标。
     * @param spacingX 建筑之间的X轴间隔。
     * @param spacingY 建筑之间的Y轴间隔。
     * @param buildingsPerRow 每行建筑的数量。
     * @returns 包含所有建筑Sprite配置的数组。
     */
    public generateAllBuildingConfigs(
        startX: number, 
        startY: number, 
        spacingX: number, 
        spacingY: number, 
        buildingsPerRow: number
    ): BuildingConfig[] {
        const configs: BuildingConfig[] = [];
        let index = 0;

        for (const type of this.buildingTypes) {
            for (const variant of this.variants) {
                const row = Math.floor(index / buildingsPerRow);
                const col = index % buildingsPerRow;

                // 计算位置
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                // 生成帧名和友好名称
                const frameName = this.getFrameName(type, variant);
                const friendlyName = this.getFriendlyName(type, variant);
                const id = `${type.toLowerCase()}_${variant.toLowerCase()}_${index}`;

                // 创建Sprite配置
                const config: BuildingConfig = {
                    id: id,
                    type: type,
                    variant: variant,
                    name: friendlyName,
                    key: this.textureAtlasKey, // 纹理图集的key
                    frame: frameName,         // 纹理图集中的帧名
                    x: x,                     // x坐标
                    y: y,                     // y坐标
                    // 性能优化：对于静态建筑，默认不启用物理和交互，减少Phaser内部处理。
                    active: true,
                    visible: true,
                    scale: 1, // 默认比例，符合像素风格
                    // Game Boy风格的建筑通常是俯视视角，使用原点(0.5, 1)使其底部对齐，方便地图布局
                    originX: 0.5,
                    originY: 1, 
                };

                configs.push(config);
                index++;
            }
        }

        console.log(`BuildingSpriteGenerator: Successfully generated ${configs.length} building configurations.`);
        return configs;
    }

    /**
     * 扩展方法：根据特定条件（例如：随机、特定区域）生成子集配置。
     * 
     * @param count 需要生成的建筑数量。
     * @param availableTypes 可用的建筑类型子集。
     * @param xRange X坐标范围 [min, max]。
     * @param yRange Y坐标范围 [min, max]。
     * @returns 随机生成的建筑配置数组。
     */
    public generateRandomConfigs(
        count: number, 
        availableTypes: BuildingType[] = this.buildingTypes,
        xRange: [number, number] = [0, 800],
        yRange: [number, number] = [0, 600]
    ): BuildingConfig[] {
        const configs: BuildingConfig[] = [];

        for (let i = 0; i < count; i++) {
            // 随机选择类型和变体
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            const variant = this.variants[Math.floor(Math.random() * this.variants.length)];
            
            // 随机选择位置
            const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
            const y = Math.random() * (yRange[1] - yRange[0]) + yRange[0];

            // 生成帧名和友好名称
            const frameName = this.getFrameName(type, variant);
            const friendlyName = this.getFriendlyName(type, variant);
            const id = `${type.toLowerCase()}_${variant.toLowerCase()}_rand_${i}`;

            // 创建Sprite配置
            const config: BuildingConfig = {
                id: id,
                type: type,
                variant: variant,
                name: friendlyName,
                key: this.textureAtlasKey,
                frame: frameName,
                x: x,
                y: y,
                active: true,
                visible: true,
                scale: 1,
                originX: 0.5,
                originY: 1, 
            };

            configs.push(config);
        }

        console.log(`BuildingSpriteGenerator: Successfully generated ${configs.length} random building configurations.`);
        return configs;
    }
}

// 导出所有类型，方便外部使用
export default BuildingSpriteGenerator;