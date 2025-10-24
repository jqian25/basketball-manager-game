// client/src/game/equipment/Armors.ts

/**
 * 防具类型 (Armor Type)
 * 用于区分防具的主要类别，例如：球鞋、球衣、护具等。
 */
export enum ArmorType {
    SNEAKERS = "Sneakers", // 球鞋
    JERSEY = "Jersey",     // 球衣
    SHORTS = "Shorts",     // 球裤
    ACCESSORY = "Accessory" // 护具/配件 (如护臂、护膝、头带等)
}

/**
 * 装备槽位 (Armor Slot)
 * 玩家可以装备防具的位置。
 */
export enum ArmorSlot {
    HEAD = "Head",       // 头部 (头带、发带等)
    UPPER_BODY = "UpperBody", // 上半身 (球衣、护胸等)
    LOWER_BODY = "LowerBody", // 下半身 (球裤、护腿等)
    FEET = "Feet",       // 脚部 (球鞋)
    HANDS = "Hands",     // 手部 (护腕、手套等)
    ACCESSORY_1 = "Accessory1", // 配件槽位1
    ACCESSORY_2 = "Accessory2"  // 配件槽位2
}

/**
 * 基础属性 (Base Stats)
 * 篮球RPG中可能影响玩家表现的属性。
 */
export interface ArmorStats {
    // 进攻属性
    shooting?: number;      // 投篮 (影响命中率)
    dribbling?: number;     // 运球 (影响控球和突破成功率)
    passing?: number;       // 传球 (影响传球精度和视野)

    // 防守属性
    defense?: number;       // 防守 (影响抢断、盖帽和贴防效果)
    rebounding?: number;    // 篮板 (影响抢篮板的几率)
    block?: number;         // 盖帽 (影响盖帽成功率)

    // 身体属性
    speed?: number;         // 速度 (影响移动速度)
    stamina?: number;       // 耐力 (影响体力消耗和持续作战能力)
    strength?: number;      // 力量 (影响对抗和卡位)
}

/**
 * 防具稀有度 (Rarity)
 */
export enum Rarity {
    COMMON = "Common",       // 普通
    UNCOMMON = "Uncommon",   // 罕见
    RARE = "Rare",           // 稀有
    EPIC = "Epic",           // 史诗
    LEGENDARY = "Legendary"  // 传奇
}

/**
 * 防具物品接口 (Armor Item Interface)
 */
export interface ArmorItem {
    id: string;             // 唯一ID
    name: string;           // 名称
    description: string;    // 描述
    type: ArmorType;        // 防具类型
    slot: ArmorSlot;        // 装备槽位
    rarity: Rarity;         // 稀有度
    stats: ArmorStats;      // 提供的属性加成
    levelRequirement: number; // 等级要求
    price: number;          // 售价 (游戏币)
}

/**
 * 防具数据集合
 */
export const Armors: Record<string, ArmorItem> = {
    // --- 普通 (Common) 10 items ---
    "COMMON_SNEAKER_1": {
        id: "COMMON_SNEAKER_1",
        name: "基础训练鞋",
        description: "最普通的训练用鞋，提供微弱的移动加成。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.COMMON,
        stats: { speed: 1, stamina: 1 },
        levelRequirement: 1,
        price: 50
    },
    "COMMON_JERSEY_1": {
        id: "COMMON_JERSEY_1",
        name: "白色训练背心",
        description: "透气性一般的白色背心。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.COMMON,
        stats: { stamina: 2 },
        levelRequirement: 1,
        price: 40
    },
    "COMMON_SHORTS_1": {
        id: "COMMON_SHORTS_1",
        name: "宽松训练短裤",
        description: "最常见的训练短裤，毫无特色。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.COMMON,
        stats: { defense: 1 },
        levelRequirement: 1,
        price: 30
    },
    "COMMON_HEADBAND_1": {
        id: "COMMON_HEADBAND_1",
        name: "吸汗头带",
        description: "防止汗水流入眼睛。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.COMMON,
        stats: { stamina: 1 },
        levelRequirement: 1,
        price: 20
    },
    "COMMON_WRISTBAND_1": {
        id: "COMMON_WRISTBAND_1",
        name: "普通护腕",
        description: "提供轻微的手腕支撑。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HANDS,
        rarity: Rarity.COMMON,
        stats: { passing: 1 },
        levelRequirement: 1,
        price: 20
    },
    "COMMON_SNEAKER_2": {
        id: "COMMON_SNEAKER_2",
        name: "旧款跑鞋",
        description: "虽然旧，但比赤脚好。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.COMMON,
        stats: { speed: 1, dribbling: 1 },
        levelRequirement: 2,
        price: 60
    },
    "COMMON_JERSEY_2": {
        id: "COMMON_JERSEY_2",
        name: "灰色训练T恤",
        description: "棉质T恤，吸汗一般。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.COMMON,
        stats: { defense: 1, strength: 1 },
        levelRequirement: 2,
        price: 50
    },
    "COMMON_SHORTS_2": {
        id: "COMMON_SHORTS_2",
        name: "侧边条纹短裤",
        description: "略微提升了外观。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.COMMON,
        stats: { speed: 1 },
        levelRequirement: 2,
        price: 40
    },
    "COMMON_KNEEPAD_1": {
        id: "COMMON_KNEEPAD_1",
        name: "基础护膝",
        description: "保护膝盖，提供微弱的力量加成。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_1,
        rarity: Rarity.COMMON,
        stats: { strength: 1 },
        levelRequirement: 3,
        price: 30
    },
    "COMMON_ELBOWPAD_1": {
        id: "COMMON_ELBOWPAD_1",
        name: "基础护肘",
        description: "保护手肘，提供微弱的投篮加成。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_2,
        rarity: Rarity.COMMON,
        stats: { shooting: 1 },
        levelRequirement: 3,
        price: 30
    },

    // --- 罕见 (Uncommon) 10 items ---
    "UNCOMMON_SNEAKER_1": {
        id: "UNCOMMON_SNEAKER_1",
        name: "疾风跑者",
        description: "轻盈的鞋身，适合快速突破。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.UNCOMMON,
        stats: { speed: 3, dribbling: 2 },
        levelRequirement: 5,
        price: 250
    },
    "UNCOMMON_JERSEY_1": {
        id: "UNCOMMON_JERSEY_1",
        name: "速干球衣",
        description: "高科技面料，有效保持身体干爽。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.UNCOMMON,
        stats: { stamina: 4, shooting: 1 },
        levelRequirement: 5,
        price: 200
    },
    "UNCOMMON_SHORTS_1": {
        id: "UNCOMMON_SHORTS_1",
        name: "弹性紧身短裤",
        description: "提供肌肉支撑，略微提升力量。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.UNCOMMON,
        stats: { strength: 3, defense: 1 },
        levelRequirement: 5,
        price: 180
    },
    "UNCOMMON_HEADBAND_2": {
        id: "UNCOMMON_HEADBAND_2",
        name: "控球大师头带",
        description: "据说能提高专注力，让运球更稳。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.UNCOMMON,
        stats: { dribbling: 3 },
        levelRequirement: 6,
        price: 150
    },
    "UNCOMMON_WRISTBAND_2": {
        id: "UNCOMMON_WRISTBAND_2",
        name: "传球护腕",
        description: "让你的手腕发力更精准。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HANDS,
        rarity: Rarity.UNCOMMON,
        stats: { passing: 3 },
        levelRequirement: 6,
        price: 150
    },
    "UNCOMMON_ANKLE_GUARD": {
        id: "UNCOMMON_ANKLE_GUARD",
        name: "专业护踝",
        description: "有效防止扭伤，提升防守稳定性。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_1,
        rarity: Rarity.UNCOMMON,
        stats: { defense: 3, speed: -1 },
        levelRequirement: 7,
        price: 120
    },
    "UNCOMMON_COMPRESSION_SHIRT": {
        id: "UNCOMMON_COMPRESSION_SHIRT",
        name: "紧身压缩衣",
        description: "提升身体爆发力。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.UNCOMMON,
        stats: { strength: 2, stamina: 2 },
        levelRequirement: 7,
        price: 180
    },
    "UNCOMMON_SNEAKER_3": {
        id: "UNCOMMON_SNEAKER_3",
        name: "中端实战靴",
        description: "均衡的性能，适合全能型球员。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.UNCOMMON,
        stats: { speed: 2, defense: 2, shooting: 1 },
        levelRequirement: 8,
        price: 300
    },
    "UNCOMMON_SHORTS_2": {
        id: "UNCOMMON_SHORTS_2",
        name: "防守型短裤",
        description: "加厚的面料，增强对抗能力。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.UNCOMMON,
        stats: { defense: 2, rebounding: 2 },
        levelRequirement: 8,
        price: 190
    },
    "UNCOMMON_FINGER_TAPE": {
        id: "UNCOMMON_FINGER_TAPE",
        name: "投篮手指胶带",
        description: "帮助稳定投篮手型。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HANDS,
        rarity: Rarity.UNCOMMON,
        stats: { shooting: 3 },
        levelRequirement: 9,
        price: 100
    },

    // --- 稀有 (Rare) 10 items ---
    "RARE_SNEAKER_1": {
        id: "RARE_SNEAKER_1",
        name: "闪电启动",
        description: "极轻的重量，让你瞬间启动。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.RARE,
        stats: { speed: 6, dribbling: 3, stamina: -1 },
        levelRequirement: 12,
        price: 800
    },
    "RARE_JERSEY_1": {
        id: "RARE_JERSEY_1",
        name: "三分射手球衣",
        description: "据说穿上它，手感会变得火热。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.RARE,
        stats: { shooting: 6, passing: 2 },
        levelRequirement: 12,
        price: 750
    },
    "RARE_SHORTS_1": {
        id: "RARE_SHORTS_1",
        name: "禁区守护者短裤",
        description: "加固的内衬，提升内线对抗能力。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.RARE,
        stats: { strength: 5, rebounding: 3, block: 1 },
        levelRequirement: 13,
        price: 700
    },
    "RARE_HEADBAND_3": {
        id: "RARE_HEADBAND_3",
        name: "组织核心头带",
        description: "让你在场上拥有更广阔的视野。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.RARE,
        stats: { passing: 5, dribbling: 2 },
        levelRequirement: 14,
        price: 500
    },
    "RARE_WRISTBAND_3": {
        id: "RARE_WRISTBAND_3",
        name: "抢断之手护腕",
        description: "增加你抢断时的手部灵活性。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HANDS,
        rarity: Rarity.RARE,
        stats: { defense: 5, dribbling: -1 },
        levelRequirement: 15,
        price: 450
    },
    "RARE_ARM_SLEEVE": {
        id: "RARE_ARM_SLEEVE",
        name: "精准投篮护臂",
        description: "稳定投篮姿势，减少失误。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_1,
        rarity: Rarity.RARE,
        stats: { shooting: 4, stamina: 2 },
        levelRequirement: 16,
        price: 480
    },
    "RARE_SNEAKER_2": {
        id: "RARE_SNEAKER_2",
        name: "全能战士",
        description: "攻防一体的均衡战靴。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.RARE,
        stats: { speed: 4, defense: 3, shooting: 2 },
        levelRequirement: 17,
        price: 900
    },
    "RARE_JERSEY_2": {
        id: "RARE_JERSEY_2",
        name: "铁血防守球衣",
        description: "让对手感受到压迫感。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.RARE,
        stats: { defense: 6, strength: 3 },
        levelRequirement: 18,
        price: 850
    },
    "RARE_SHORTS_2": {
        id: "RARE_SHORTS_2",
        name: "空接短裤",
        description: "提升弹跳高度，但会消耗更多体力。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.RARE,
        stats: { rebounding: 5, speed: 2, stamina: -2 },
        levelRequirement: 19,
        price: 650
    },
    "RARE_MOUTHGUARD": {
        id: "RARE_MOUTHGUARD",
        name: "专注护齿",
        description: "在激烈的对抗中保持冷静。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_2,
        rarity: Rarity.RARE,
        stats: { strength: 4, defense: 3 },
        levelRequirement: 20,
        price: 550
    },

    // --- 史诗 (Epic) 3 items ---
    "EPIC_SNEAKER_1": {
        id: "EPIC_SNEAKER_1",
        name: "幻影舞步",
        description: "穿上它，你的变向如幻影般不可捉摸。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.EPIC,
        stats: { dribbling: 10, speed: 8, shooting: 3, defense: -2 },
        levelRequirement: 25,
        price: 3000
    },
    "EPIC_JERSEY_1": {
        id: "EPIC_JERSEY_1",
        name: "得分机器球衣",
        description: "为得分而生，每一次出手都充满威胁。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.EPIC,
        stats: { shooting: 10, stamina: 5, passing: -1 },
        levelRequirement: 26,
        price: 2800
    },
    "EPIC_HEADBAND_1": {
        id: "EPIC_HEADBAND_1",
        name: "领袖光环头带",
        description: "提升全队士气，让你成为场上的指挥官。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.EPIC,
        stats: { passing: 8, defense: 5, stamina: 5 },
        levelRequirement: 27,
        price: 2000
    },

    // --- 传奇 (Legendary) 2 items ---
    "LEGENDARY_SNEAKER_1": {
        id: "LEGENDARY_SNEAKER_1",
        name: "飞人战靴 '23",
        description: "致敬传奇，拥有无与伦比的弹跳和滞空能力。",
        type: ArmorType.SNEAKERS,
        slot: ArmorSlot.FEET,
        rarity: Rarity.LEGENDARY,
        stats: { speed: 12, shooting: 10, dribbling: 5, block: 5, strength: 5 },
        levelRequirement: 30,
        price: 8000
    },
    "LEGENDARY_JERSEY_1": {
        id: "LEGENDARY_JERSEY_1",
        name: "黑曼巴精神球衣",
        description: "永不言弃的精神加持，在关键时刻爆发潜能。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.LEGENDARY,
        stats: { shooting: 15, defense: 10, stamina: 10, strength: 5 },
        levelRequirement: 30,
        price: 7500
    },

    // --- 补充 10个罕见/稀有配件，凑足35个 ---
    "UNCOMMON_SHIN_GUARD": {
        id: "UNCOMMON_SHIN_GUARD",
        name: "防撞护腿",
        description: "保护小腿，略微提升力量。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_2,
        rarity: Rarity.UNCOMMON,
        stats: { strength: 2, defense: 1 },
        levelRequirement: 10,
        price: 150
    },
    "UNCOMMON_GOGGLES": {
        id: "UNCOMMON_GOGGLES",
        name: "视野护目镜",
        description: "提升视野，让传球更精准。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.UNCOMMON,
        stats: { passing: 2, defense: 1 },
        levelRequirement: 10,
        price: 160
    },
    "UNCOMMON_COMPRESSION_SHORTS": {
        id: "UNCOMMON_COMPRESSION_SHORTS",
        name: "高弹力压缩短裤",
        description: "提供核心力量支持。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.UNCOMMON,
        stats: { strength: 3, stamina: 1 },
        levelRequirement: 10,
        price: 200
    },
    "RARE_KNEE_BRACE": {
        id: "RARE_KNEE_BRACE",
        name: "重型膝盖支架",
        description: "为内线对抗提供最大支撑。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_1,
        rarity: Rarity.RARE,
        stats: { strength: 6, speed: -2 },
        levelRequirement: 20,
        price: 600
    },
    "RARE_WRIST_WEIGHTS": {
        id: "RARE_WRIST_WEIGHTS",
        name: "负重护腕",
        description: "训练用护腕，提升力量，但降低速度。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HANDS,
        rarity: Rarity.RARE,
        stats: { strength: 5, speed: -3 },
        levelRequirement: 21,
        price: 500
    },
    "RARE_ELBOW_PAD_2": {
        id: "RARE_ELBOW_PAD_2",
        name: "投篮护肘 '41'",
        description: "致敬传奇中距离大师。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_2,
        rarity: Rarity.RARE,
        stats: { shooting: 5, dribbling: 1 },
        levelRequirement: 22,
        price: 520
    },
    "RARE_JERSEY_3": {
        id: "RARE_JERSEY_3",
        name: "篮板怪兽球衣",
        description: "让你在篮下拥有野兽般的嗅觉。",
        type: ArmorType.JERSEY,
        slot: ArmorSlot.UPPER_BODY,
        rarity: Rarity.RARE,
        stats: { rebounding: 6, strength: 3 },
        levelRequirement: 23,
        price: 780
    },
    "EPIC_SHORTS_1": {
        id: "EPIC_SHORTS_1",
        name: "空中漫步短裤",
        description: "仿佛拥有了滞空能力。",
        type: ArmorType.SHORTS,
        slot: ArmorSlot.LOWER_BODY,
        rarity: Rarity.EPIC,
        stats: { rebounding: 8, block: 5, speed: 3 },
        levelRequirement: 28,
        price: 2500
    },
    "LEGENDARY_HEADBAND_1": {
        id: "LEGENDARY_HEADBAND_1",
        name: "三双制造者头带",
        description: "全面提升你的各项能力，让你无所不能。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.HEAD,
        rarity: Rarity.LEGENDARY,
        stats: { passing: 8, shooting: 8, dribbling: 8, defense: 8, rebounding: 8 },
        levelRequirement: 30,
        price: 6000
    },
    "LEGENDARY_ARM_SLEEVE_1": {
        id: "LEGENDARY_ARM_SLEEVE_1",
        name: "绝杀之手护臂",
        description: "在比赛的最后时刻，你的投篮将无人能挡。",
        type: ArmorType.ACCESSORY,
        slot: ArmorSlot.ACCESSORY_1,
        rarity: Rarity.LEGENDARY,
        stats: { shooting: 15, speed: 5, stamina: 5 },
        levelRequirement: 30,
        price: 5500
    }
};

// 导出所有类型和数据
export type { ArmorItem };
export { ArmorType, ArmorSlot, Rarity, ArmorStats };
export default Armors;