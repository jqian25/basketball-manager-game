// client/src/game/buildings/CommercialBuildings.ts

/**
 * 商业建筑类型枚举 (Commercial Building Type Enum)
 * 遵循宝可梦Game Boy风格，涵盖常见的商店和服务类型。
 */
export enum CommercialBuildingType {
    POKE_MART = 'POKE_MART', // 宝可梦中心/商店
    POKE_CENTER = 'POKE_CENTER', // 宝可梦中心 (虽然通常是服务，但作为核心建筑列入)
    GYM = 'GYM', // 道馆
    CAFE = 'CAFE', // 咖啡馆/餐厅
    BAKERY = 'BAKERY', // 面包店
    CLOTHING_STORE = 'CLOTHING_STORE', // 服装店
    HAIR_SALON = 'HAIR_SALON', // 美容院/理发店
    BOOK_STORE = 'BOOK_STORE', // 书店
    FLOWER_SHOP = 'FLOWER_SHOP', // 花店
    GAME_CORNER = 'GAME_CORNER', // 游戏角/娱乐中心
    PHARMACY = 'PHARMACY', // 药店
    ANTIQUES_SHOP = 'ANTIQUES_SHOP', // 古董店
    FISH_MARKET = 'FISH_MARKET', // 鱼市/海鲜店
    HARDWARE_STORE = 'HARDWARE_STORE', // 五金店
    PET_STORE = 'PET_STORE', // 宠物店
    BIKE_SHOP = 'BIKE_SHOP', // 自行车店
    DAY_CARE = 'DAY_CARE', // 培育屋/日托所
    MUSEUM = 'MUSEUM', // 博物馆 (作为特殊商业/服务)
    TRAINER_SCHOOL = 'TRAINER_SCHOOL', // 训练家学校
    SECRET_BASE_SHOP = 'SECRET_BASE_SHOP', // 秘密基地商店
    DECORATION_SHOP = 'DECORATION_SHOP', // 装饰品店
    BERRY_SHOP = 'BERRY_SHOP', // 树果商店
    MOVE_TUTOR_HOUSE = 'MOVE_TUTOR_HOUSE', // 招式教学之家
    LOTTERY_CORNER = 'LOTTERY_CORNER', // 抽奖角
    INCENSE_SHOP = 'INCENSE_SHOP', // 熏香商店
}

/**
 * 商业建筑配置接口 (Commercial Building Configuration Interface)
 */
export interface CommercialBuildingConfig {
    id: string; // 唯一ID，例如 'C01'
    name: string; // 建筑名称
    type: CommercialBuildingType; // 建筑类型
    description: string; // 建筑描述
    spriteKey: string; // 在Phaser中加载的贴图Key
    size: { width: number; height: number }; // 建筑在地图上的尺寸 (以瓦片为单位)
    cost: number; // 建造或购买成本 (Game Boy风格的货币，例如 Pokédollars)
    isUnique: boolean; // 是否为唯一建筑 (例如 宝可梦中心)
    // 额外的Game Boy风格属性，例如：
    openTime: string; // 营业时间
    specialtyItem: string; // 商店特色商品
}

/**
 * 25种商业建筑的详细配置 (Detailed Configuration for 25 Commercial Buildings)
 */
export const CommercialBuildings: CommercialBuildingConfig[] = [
    {
        id: 'C01',
        name: '宝可梦商店',
        type: CommercialBuildingType.POKE_MART,
        description: '出售基本的道具和精灵球。',
        spriteKey: 'shop_mart',
        size: { width: 4, height: 4 },
        cost: 5000,
        isUnique: false,
        openTime: '08:00 - 21:00',
        specialtyItem: '精灵球',
    },
    {
        id: 'C02',
        name: '宝可梦中心',
        type: CommercialBuildingType.POKE_CENTER,
        description: '免费治疗宝可梦，提供PC服务。',
        spriteKey: 'shop_center',
        size: { width: 6, height: 5 },
        cost: 0, // 不可建造，或由系统预设
        isUnique: true,
        openTime: '24小时',
        specialtyItem: '治疗服务',
    },
    {
        id: 'C03',
        name: '道馆',
        type: CommercialBuildingType.GYM,
        description: '挑战道馆训练家，赢取徽章。',
        spriteKey: 'shop_gym',
        size: { width: 8, height: 6 },
        cost: 0,
        isUnique: true,
        openTime: '10:00 - 18:00',
        specialtyItem: '道馆徽章',
    },
    {
        id: 'C04',
        name: '秘密基地商店',
        type: CommercialBuildingType.SECRET_BASE_SHOP,
        description: '出售秘密基地装饰品和陷阱。',
        spriteKey: 'shop_secret',
        size: { width: 4, height: 3 },
        cost: 4500,
        isUnique: false,
        openTime: '11:00 - 19:00',
        specialtyItem: '秘密地毯',
    },
    {
        id: 'C05',
        name: '咖啡馆',
        type: CommercialBuildingType.CAFE,
        description: '购买饮料和点心，恢复宝可梦少量HP。',
        spriteKey: 'shop_cafe',
        size: { width: 5, height: 4 },
        cost: 6000,
        isUnique: false,
        openTime: '09:00 - 22:00',
        specialtyItem: '哞哞牛奶',
    },
    {
        id: 'C06',
        name: '面包房',
        type: CommercialBuildingType.BAKERY,
        description: '出售各种美味的宝可梦零食。',
        spriteKey: 'shop_bakery',
        size: { width: 4, height: 4 },
        cost: 5500,
        isUnique: false,
        openTime: '06:00 - 20:00',
        specialtyItem: '宝可梦泡芙',
    },
    {
        id: 'C07',
        name: '服装店',
        type: CommercialBuildingType.CLOTHING_STORE,
        description: '出售训练家的服装和配饰。',
        spriteKey: 'shop_cloth',
        size: { width: 5, height: 5 },
        cost: 7000,
        isUnique: false,
        openTime: '10:00 - 21:00',
        specialtyItem: '时尚帽子',
    },
    {
        id: 'C08',
        name: '美容院',
        type: CommercialBuildingType.HAIR_SALON,
        description: '改变训练家发型，提升宝可梦亲密度。',
        spriteKey: 'shop_hair',
        size: { width: 3, height: 4 },
        cost: 3000,
        isUnique: false,
        openTime: '10:00 - 20:00',
        specialtyItem: '亲密按摩',
    },
    {
        id: 'C09',
        name: '书店',
        type: CommercialBuildingType.BOOK_STORE,
        description: '出售关于宝可梦历史和战斗技巧的书籍。',
        spriteKey: 'shop_book',
        size: { width: 4, height: 5 },
        cost: 4000,
        isUnique: false,
        openTime: '09:00 - 21:00',
        specialtyItem: '稀有图鉴',
    },
    {
        id: 'C10',
        name: '花店',
        type: CommercialBuildingType.FLOWER_SHOP,
        description: '出售装饰用花卉和树果种子。',
        spriteKey: 'shop_flower',
        size: { width: 3, height: 3 },
        cost: 2500,
        isUnique: false,
        openTime: '07:00 - 19:00',
        specialtyItem: '神秘花束',
    },
    {
        id: 'C11',
        name: '游戏角',
        type: CommercialBuildingType.GAME_CORNER,
        description: '玩小游戏赢取代币，兑换稀有道具。',
        spriteKey: 'shop_game',
        size: { width: 6, height: 5 },
        cost: 8000,
        isUnique: true,
        openTime: '12:00 - 23:00',
        specialtyItem: '代币',
    },
    {
        id: 'C12',
        name: '药店',
        type: CommercialBuildingType.PHARMACY,
        description: '出售各种状态恢复药剂和维生素。',
        spriteKey: 'shop_pharma',
        size: { width: 4, height: 4 },
        cost: 5200,
        isUnique: false,
        openTime: '09:00 - 20:00',
        specialtyItem: '万灵药',
    },
    {
        id: 'C13',
        name: '古董店',
        type: CommercialBuildingType.ANTIQUES_SHOP,
        description: '出售稀有且昂贵的古代宝可梦物品。',
        spriteKey: 'shop_antique',
        size: { width: 5, height: 4 },
        cost: 12000,
        isUnique: true,
        openTime: '10:00 - 17:00',
        specialtyItem: '古代化石',
    },
    {
        id: 'C14',
        name: '鱼市',
        type: CommercialBuildingType.FISH_MARKET,
        description: '出售各种渔具和水系宝可梦的食物。',
        spriteKey: 'shop_fish',
        size: { width: 4, height: 3 },
        cost: 3500,
        isUnique: false,
        openTime: '06:00 - 18:00',
        specialtyItem: '超级鱼竿',
    },
    {
        id: 'C15',
        name: '五金店',
        type: CommercialBuildingType.HARDWARE_STORE,
        description: '出售建筑材料和工具，用于秘密基地建造。',
        spriteKey: 'shop_hardware',
        size: { width: 5, height: 4 },
        cost: 4800,
        isUnique: false,
        openTime: '08:00 - 19:00',
        specialtyItem: '木板',
    },
    {
        id: 'C16',
        name: '宠物店',
        type: CommercialBuildingType.PET_STORE,
        description: '出售宝可梦食物、玩具和美容用品。',
        spriteKey: 'shop_pet',
        size: { width: 4, height: 4 },
        cost: 5100,
        isUnique: false,
        openTime: '10:00 - 20:00',
        specialtyItem: '宝可方块',
    },
    {
        id: 'C17',
        name: '自行车店',
        type: CommercialBuildingType.BIKE_SHOP,
        description: '购买和修理自行车。',
        spriteKey: 'shop_bike',
        size: { width: 5, height: 3 },
        cost: 10000,
        isUnique: true,
        openTime: '09:00 - 18:00',
        specialtyItem: '折叠自行车',
    },
    {
        id: 'C18',
        name: '培育屋',
        type: CommercialBuildingType.DAY_CARE,
        description: '寄放宝可梦，有机会获得宝可梦蛋。',
        spriteKey: 'shop_daycare',
        size: { width: 7, height: 6 },
        cost: 0,
        isUnique: true,
        openTime: '24小时',
        specialtyItem: '宝可梦蛋',
    },
    {
        id: 'C19',
        name: '博物馆',
        type: CommercialBuildingType.MUSEUM,
        description: '展示古代宝可梦化石和历史文物。',
        spriteKey: 'shop_museum',
        size: { width: 8, height: 7 },
        cost: 0,
        isUnique: true,
        openTime: '09:00 - 17:00',
        specialtyItem: '化石复活',
    },
    {
        id: 'C20',
        name: '训练家学校',
        type: CommercialBuildingType.TRAINER_SCHOOL,
        description: '学习基础的宝可梦知识和战斗技巧。',
        spriteKey: 'shop_school',
        size: { width: 6, height: 5 },
        cost: 0,
        isUnique: true,
        openTime: '08:00 - 16:00',
        specialtyItem: '学习装置',
    },
    {
        id: 'C21',
        name: '装饰品店',
        type: CommercialBuildingType.DECORATION_SHOP,
        description: '出售各种用于房间和基地的装饰品。',
        spriteKey: 'shop_deco',
        size: { width: 4, height: 4 },
        cost: 3800,
        isUnique: false,
        openTime: '10:00 - 20:00',
        specialtyItem: '宝可梦玩偶',
    },
    {
        id: 'C22',
        name: '树果商店',
        type: CommercialBuildingType.BERRY_SHOP,
        description: '出售各种树果，用于制作宝可方块或战斗。',
        spriteKey: 'shop_berry',
        size: { width: 3, height: 3 },
        cost: 2000,
        isUnique: false,
        openTime: '07:00 - 17:00',
        specialtyItem: '文柚果',
    },
    {
        id: 'C23',
        name: '招式教学之家',
        type: CommercialBuildingType.MOVE_TUTOR_HOUSE,
        description: '支付碎片或金钱，让宝可梦学习特殊招式。',
        spriteKey: 'shop_tutor',
        size: { width: 5, height: 4 },
        cost: 0,
        isUnique: true,
        openTime: '10:00 - 18:00',
        specialtyItem: '特殊招式',
    },
    {
        id: 'C24',
        name: '抽奖角',
        type: CommercialBuildingType.LOTTERY_CORNER,
        description: '每天一次免费抽奖，奖品是稀有道具。',
        spriteKey: 'shop_lottery',
        size: { width: 4, height: 4 },
        cost: 0,
        isUnique: true,
        openTime: '全天',
        specialtyItem: '大师球碎片',
    },
    {
        id: 'C25',
        name: '熏香商店',
        type: CommercialBuildingType.INCENSE_SHOP,
        description: '出售各种熏香，影响宝可梦的孵化和遭遇。',
        spriteKey: 'shop_incense',
        size: { width: 3, height: 4 },
        cost: 4000,
        isUnique: false,
        openTime: '10:00 - 20:00',
        specialtyItem: '满腹熏香',
    },
];

// --------------------------------------------------------------------------------
// 示例：Phaser 3 中如何使用这些配置 (Example: How to use these configurations in Phaser 3)
// --------------------------------------------------------------------------------

// 假设这是你的Phaser 3场景类
export class BuildingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BuildingScene' });
    }

    preload() {
        // 预加载所有建筑的贴图
        CommercialBuildings.forEach(building => {
            // 假设贴图文件名为 [spriteKey].png
            // 在实际的Game Boy风格游戏中，贴图通常是小的像素图
            this.load.image(building.spriteKey, `assets/sprites/buildings/${building.spriteKey}.png`);
        });
    }

    create() {
        console.log('加载了', CommercialBuildings.length, '种商业建筑配置。');

        // 示例：在地图上放置一个宝可梦商店
        const pokeMartConfig = CommercialBuildings.find(b => b.type === CommercialBuildingType.POKE_MART);

        if (pokeMartConfig) {
            // 假设地图瓦片大小为 16x16 像素 (Game Boy风格)
            const TILE_SIZE = 16;
            const xPos = 10 * TILE_SIZE; // 放置在 (10, 10) 瓦片位置
            const yPos = 10 * TILE_SIZE;

            // 创建一个Phaser Sprite
            const pokeMart = this.add.sprite(xPos, yPos, pokeMartConfig.spriteKey);
            
            // 设置原点为左上角，使其基于瓦片坐标定位
            pokeMart.setOrigin(0, 0);

            // 缩放以模拟Game Boy风格的像素艺术
            // 在高清屏幕上，Game Boy风格的像素艺术通常会被放大 (例如 4x 或 6x)
            const SCALE = 4;
            pokeMart.setScale(SCALE);

            // 打印建筑信息
            console.log(`放置建筑: ${pokeMartConfig.name} (ID: ${pokeMartConfig.id})`);
            console.log(`尺寸 (瓦片): ${pokeMartConfig.size.width}x${pokeMartConfig.size.height}`);
            console.log(`成本: ${pokeMartConfig.cost} Pokédollars`);

            // 可以在Sprite上附加配置数据，以便后续交互
            pokeMart.setData('config', pokeMartConfig);

            // 示例交互：点击建筑显示描述
            pokeMart.setInteractive();
            pokeMart.on('pointerdown', () => {
                this.showBuildingInfo(pokeMartConfig);
            });
        }
    }

    showBuildingInfo(config: CommercialBuildingConfig) {
        // 在Game Boy风格中，这可能是一个简单的文本框
        const infoText = `--- ${config.name} ---\n` +
                         `类型: ${config.type}\n` +
                         `描述: ${config.description}\n` +
                         `营业时间: ${config.openTime}\n` +
                         `特色商品: ${config.specialtyItem}\n` +
                         `唯一性: ${config.isUnique ? '是' : '否'}`;

        // 实际游戏中需要实现一个Game Boy风格的UI组件来显示这些信息
        console.log(infoText);
        // 可以在这里添加一个Phaser Text对象来显示信息
        // const uiText = this.add.text(50, 50, infoText, { fontSize: '16px', color: '#000000', backgroundColor: '#ffffff' });
    }
}

// 导出所有必要的类型和数据
export default CommercialBuildings;
