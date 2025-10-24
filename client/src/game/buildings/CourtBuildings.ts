// client/src/game/buildings/CourtBuildings.ts

/**
 * 建筑类型枚举，用于区分不同建筑的通用功能
 * Court: 篮球场本体，用于比赛
 * Facility: 附属设施，如更衣室、训练馆
 * Landmark: 地标，如雕塑、入口
 * Shop: 商店，用于购买物品
 */
export enum BuildingType {
    Court = 'Court',
    Facility = 'Facility',
    Landmark = 'Landmark',
    Shop = 'Shop',
}

/**
 * 建筑的尺寸定义，以瓦片（Tile）为单位，模拟Game Boy的像素风格。
 * 假设一个瓦片是 16x16 像素。
 */
export interface BuildingSize {
    widthTiles: number;  // 宽度（瓦片数）
    heightTiles: number; // 高度（瓦片数）
}

/**
 * 建筑配置接口。
 * 模拟宝可梦Game Boy风格的建筑元素。
 */
export interface BuildingConfig {
    id: string;                 // 唯一标识符
    name: string;               // 建筑名称
    type: BuildingType;         // 建筑类型
    description: string;        // 建筑描述 (Game Boy风格的简短描述)
    size: BuildingSize;         // 建筑尺寸（瓦片）
    tileKey: string;            // 瓦片集/纹理的键名 (例如: 'tileset_court')
    frameIndex: number;         // 瓦片集中的帧索引 (用于区分不同建筑外观)
    interactionText: string;    // 靠近时显示的互动文本 (例如: '是否进入更衣室?')
    // 额外的Game Boy风格属性
    colorPalette: 'A' | 'B' | 'C' | 'D'; // 模拟Game Boy四色调色板
    isWalkable: boolean;        // 是否可穿过（通常为false）
    hasInterior: boolean;       // 是否有内部场景
    requiredLevel: number;      // 玩家进入所需的最低等级
}

/**
 * 20种篮球场建筑的详细配置数据。
 * 键为建筑ID，值为 BuildingConfig。
 */
export const CourtBuildings: Record<string, BuildingConfig> = {
    // 1. 比赛场地类 (Court) - 4种
    'court_main_arena': {
        id: 'court_main_arena',
        name: '主竞技场',
        type: BuildingType.Court,
        description: '举办重要比赛的宏伟场地。',
        size: { widthTiles: 12, heightTiles: 8 },
        tileKey: 'tileset_court',
        frameIndex: 0,
        interactionText: '进入主场，挑战联赛冠军?',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 10,
    },
    'court_training_gym': {
        id: 'court_training_gym',
        name: '训练馆',
        type: BuildingType.Court,
        description: '日常训练和自由练习的场所。',
        size: { widthTiles: 8, heightTiles: 6 },
        tileKey: 'tileset_court',
        frameIndex: 1,
        interactionText: '开始训练，提升能力?',
        colorPalette: 'B',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'court_street_ball': {
        id: 'court_street_ball',
        name: '街头球场',
        type: BuildingType.Court,
        description: '充满挑战和惊喜的户外街球场。',
        size: { widthTiles: 10, heightTiles: 7 },
        tileKey: 'tileset_court',
        frameIndex: 2,
        interactionText: '加入街头赛，赢得声望!',
        colorPalette: 'C',
        isWalkable: false,
        hasInterior: false,
        requiredLevel: 5,
    },
    'court_rooftop': {
        id: 'court_rooftop',
        name: '屋顶球场',
        type: BuildingType.Court,
        description: '高耸入云，俯瞰城市的独特球场。',
        size: { widthTiles: 6, heightTiles: 5 },
        tileKey: 'tileset_court',
        frameIndex: 3,
        interactionText: '欣赏风景，或来一场高空对决?',
        colorPalette: 'D',
        isWalkable: false,
        hasInterior: false,
        requiredLevel: 15,
    },
    
    // 2. 附属设施类 (Facility) - 5种
    'facility_locker_room': {
        id: 'facility_locker_room',
        name: '更衣室',
        type: BuildingType.Facility,
        description: '更换球衣和恢复体力的私密空间。',
        size: { widthTiles: 4, heightTiles: 3 },
        tileKey: 'tileset_facility',
        frameIndex: 0,
        interactionText: '进入更衣室?',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'facility_medical_bay': {
        id: 'facility_medical_bay',
        name: '医疗站',
        type: BuildingType.Facility,
        description: '治疗伤病，快速恢复状态。',
        size: { widthTiles: 5, heightTiles: 4 },
        tileKey: 'tileset_facility',
        frameIndex: 1,
        interactionText: '需要治疗吗?',
        colorPalette: 'B',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'facility_strategy_room': {
        id: 'facility_strategy_room',
        name: '战术室',
        type: BuildingType.Facility,
        description: '与教练讨论战术，制定比赛计划。',
        size: { widthTiles: 4, heightTiles: 4 },
        tileKey: 'tileset_facility',
        frameIndex: 2,
        interactionText: '查看战术板?',
        colorPalette: 'C',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 8,
    },
    'facility_weight_room': {
        id: 'facility_weight_room',
        name: '力量训练房',
        type: BuildingType.Facility,
        description: '增加力量和耐力的专业场所。',
        size: { widthTiles: 6, heightTiles: 5 },
        tileKey: 'tileset_facility',
        frameIndex: 3,
        interactionText: '进行力量训练?',
        colorPalette: 'D',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 5,
    },
    'facility_media_center': {
        id: 'facility_media_center',
        name: '媒体中心',
        type: BuildingType.Facility,
        description: '接受采访，提升球队知名度。',
        size: { widthTiles: 7, heightTiles: 4 },
        tileKey: 'tileset_facility',
        frameIndex: 4,
        interactionText: '召开新闻发布会?',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 12,
    },

    // 3. 地标类 (Landmark) - 4种
    'landmark_main_entrance': {
        id: 'landmark_main_entrance',
        name: '主入口',
        type: BuildingType.Landmark,
        description: '通往竞技场内部的宏伟大门。',
        size: { widthTiles: 5, heightTiles: 2 },
        tileKey: 'tileset_landmark',
        frameIndex: 0,
        interactionText: '进入竞技场?',
        colorPalette: 'B',
        isWalkable: true, // 入口本身可穿过
        hasInterior: false,
        requiredLevel: 1,
    },
    'landmark_champion_statue': {
        id: 'landmark_champion_statue',
        name: '冠军雕像',
        type: BuildingType.Landmark,
        description: '历届冠军的荣耀象征。',
        size: { widthTiles: 2, heightTiles: 4 },
        tileKey: 'tileset_landmark',
        frameIndex: 1,
        interactionText: '瞻仰雕像，获得灵感。',
        colorPalette: 'C',
        isWalkable: false,
        hasInterior: false,
        requiredLevel: 1,
    },
    'landmark_fountain': {
        id: 'landmark_fountain',
        name: '喷泉广场',
        type: BuildingType.Landmark,
        description: '人们聚集和休息的中心广场。',
        size: { widthTiles: 6, heightTiles: 6 },
        tileKey: 'tileset_landmark',
        frameIndex: 2,
        interactionText: '在喷泉边休息片刻。',
        colorPalette: 'D',
        isWalkable: true, // 广场区域可穿过
        hasInterior: false,
        requiredLevel: 1,
    },
    'landmark_scoreboard': {
        id: 'landmark_scoreboard',
        name: '巨型记分牌',
        type: BuildingType.Landmark,
        description: '显示最新比赛结果和排名的电子屏幕。',
        size: { widthTiles: 4, heightTiles: 3 },
        tileKey: 'tileset_landmark',
        frameIndex: 3,
        interactionText: '查看最新比分?',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: false,
        requiredLevel: 1,
    },
    
    // 4. 商店类 (Shop) - 4种
    'shop_gear_store': {
        id: 'shop_gear_store',
        name: '装备商店',
        type: BuildingType.Shop,
        description: '出售球鞋、球衣和护具。',
        size: { widthTiles: 4, heightTiles: 5 },
        tileKey: 'tileset_shop',
        frameIndex: 0,
        interactionText: '浏览最新装备?',
        colorPalette: 'B',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'shop_snack_bar': {
        id: 'shop_snack_bar',
        name: '小吃店',
        type: BuildingType.Shop,
        description: '出售恢复体力和士气的食物和饮料。',
        size: { widthTiles: 3, heightTiles: 3 },
        tileKey: 'tileset_shop',
        frameIndex: 1,
        interactionText: '买点吃的喝的?',
        colorPalette: 'C',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'shop_card_trader': {
        id: 'shop_card_trader',
        name: '卡牌交易站',
        type: BuildingType.Shop,
        description: '收集和交换稀有球员卡的地方。',
        size: { widthTiles: 5, heightTiles: 4 },
        tileKey: 'tileset_shop',
        frameIndex: 2,
        interactionText: '交换或购买球员卡?',
        colorPalette: 'D',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 3,
    },
    'shop_skill_trainer': {
        id: 'shop_skill_trainer',
        name: '技能导师小屋',
        type: BuildingType.Shop,
        description: '支付费用学习新的篮球技能。',
        size: { widthTiles: 4, heightTiles: 4 },
        tileKey: 'tileset_shop',
        frameIndex: 3,
        interactionText: '学习新技能?',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 5,
    },

    // 5. 混合/稀有建筑 (Mix/Rare) - 3种 (已完成 4+5+4+4=17, 还需要3种)
    'mix_vip_lounge': {
        id: 'mix_vip_lounge',
        name: '贵宾休息室',
        type: BuildingType.Facility,
        description: '只有高等级玩家才能进入的豪华区域。',
        size: { widthTiles: 5, heightTiles: 6 },
        tileKey: 'tileset_rare',
        frameIndex: 0,
        interactionText: '需要VIP通行证才能进入。',
        colorPalette: 'A',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 20,
    },
    'mix_teleport_pad': {
        id: 'mix_teleport_pad',
        name: '传送装置',
        type: BuildingType.Landmark,
        description: '快速传送到其他球场区域。',
        size: { widthTiles: 2, heightTiles: 2 },
        tileKey: 'tileset_rare',
        frameIndex: 1,
        interactionText: '启动传送?',
        colorPalette: 'B',
        isWalkable: true,
        hasInterior: false,
        requiredLevel: 1,
    },
    'mix_trophy_hall': {
        id: 'mix_trophy_hall',
        name: '荣誉殿堂',
        type: BuildingType.Landmark,
        description: '展示玩家赢得的所有奖杯。',
        size: { widthTiles: 8, heightTiles: 5 },
        tileKey: 'tileset_rare',
        frameIndex: 2,
        interactionText: '回顾你的荣耀?',
        colorPalette: 'C',
        isWalkable: false,
        hasInterior: true,
        requiredLevel: 1,
    },
    'mix_secret_passage': {
        id: 'mix_secret_passage',
        name: '秘密通道',
        type: BuildingType.Facility,
        description: '通往隐藏区域的神秘入口。',
        size: { widthTiles: 3, heightTiles: 1 },
        tileKey: 'tileset_rare',
        frameIndex: 3,
        interactionText: '发现隐藏的道路!',
        colorPalette: 'D',
        isWalkable: true,
        hasInterior: true,
        requiredLevel: 1,
    },
};

// 导出所有类型和常量，方便在游戏其他模块中使用
export type BuildingID = keyof typeof CourtBuildings;
export const BuildingList: BuildingConfig[] = Object.values(CourtBuildings);
