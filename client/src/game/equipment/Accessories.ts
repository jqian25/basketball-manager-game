// client/src/game/equipment/Accessories.ts

/**
 * 饰品槽位枚举
 * 篮球RPG主题下的常见饰品槽位
 */
export enum AccessorySlot {
    HEADBAND = "头带",
    WRISTBAND = "护腕",
    NECKLACE = "项链",
    ANKLET = "护踝",
    KNEEPAD = "护膝",
}

/**
 * 属性类型枚举
 * 篮球RPG中角色可能拥有的核心属性
 */
export enum StatType {
    SHOOTING = "投篮",      // 影响命中率、投篮范围
    PASSING = "传球",        // 影响传球精准度、视野
    DEFENSE = "防守",        // 影响抢断、盖帽、贴防
    REBOUNDING = "篮板",    // 影响篮板争抢成功率
    SPEED = "速度",          // 影响移动速度、快攻能力
    STAMINA = "体力",        // 影响持续作战能力
    DRIBBLING = "控球",      // 影响运球成功率、突破能力
    STRENGTH = "力量",      // 影响对抗、内线得分
}

/**
 * 饰品稀有度枚举
 */
export enum AccessoryRarity {
    COMMON = "普通",
    RARE = "稀有",
    EPIC = "史诗",
    LEGENDARY = "传奇",
    MYTHIC = "神话",
}

/**
 * 饰品属性接口
 * 描述饰品提供的属性加成
 */
export interface AccessoryStat {
    type: StatType;
    value: number; // 属性加成值
}

/**
 * 饰品数据结构接口
 */
export interface Accessory {
    id: number;
    name: string;
    description: string;
    slot: AccessorySlot;
    rarity: AccessoryRarity;
    stats: AccessoryStat[];
}

/**
 * 30种饰品配置数据
 * 饰品设计遵循篮球RPG主题
 */
export const Accessories: Accessory[] = [
    // ----------------------------------------------------------------
    // 1-5: 普通 (Common)
    // ----------------------------------------------------------------
    {
        id: 1001,
        name: "基础白色头带",
        description: "最常见的头带，稍微吸收汗水。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.COMMON,
        stats: [{ type: StatType.STAMINA, value: 5 }],
    },
    {
        id: 1002,
        name: "棉质护腕",
        description: "保护手腕，防止轻微扭伤。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.COMMON,
        stats: [{ type: StatType.DRIBBLING, value: 3 }],
    },
    {
        id: 1003,
        name: "普通运动项链",
        description: "无特殊功能的项链，只是装饰。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.COMMON,
        stats: [{ type: StatType.SPEED, value: 2 }],
    },
    {
        id: 1004,
        name: "弹性护踝",
        description: "基础款护踝，提供最基本的保护。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.COMMON,
        stats: [{ type: StatType.DEFENSE, value: 3 }],
    },
    {
        id: 1005,
        name: "简易护膝",
        description: "防止膝盖擦伤。",
        slot: AccessorySlot.KNEEPAD,
        rarity: AccessoryRarity.COMMON,
        stats: [{ type: StatType.STRENGTH, value: 3 }],
    },
    // ----------------------------------------------------------------
    // 6-12: 稀有 (Rare)
    // ----------------------------------------------------------------
    {
        id: 1006,
        name: "专注之眼头带",
        description: "帮助球员在关键时刻保持冷静。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.SHOOTING, value: 6 },
            { type: StatType.STAMINA, value: 5 }
        ],
    },
    {
        id: 1007,
        name: "指挥官护腕",
        description: "提升传球视野和决策速度。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.PASSING, value: 8 },
            { type: StatType.DRIBBLING, value: 4 }
        ],
    },
    {
        id: 1008,
        name: "铁血防守项链",
        description: "象征着不屈的防守意志。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.DEFENSE, value: 7 },
            { type: StatType.STRENGTH, value: 3 }
        ],
    },
    {
        id: 1009,
        name: "闪电护踝",
        description: "轻盈且坚固，让速度更上一层楼。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.SPEED, value: 10 },
            { type: StatType.STAMINA, value: 3 }
        ],
    },
    {
        id: 1010,
        name: "篮下霸主护膝",
        description: "专为内线球员设计，强化对抗。",
        slot: AccessorySlot.KNEEPAD,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.REBOUNDING, value: 7 },
            { type: StatType.STRENGTH, value: 5 }
        ],
    },
    {
        id: 1011,
        name: "街球手护腕",
        description: "让你的运球动作更加华丽且难以捉摸。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.DRIBBLING, value: 10 },
            { type: StatType.SHOOTING, value: 3 }
        ],
    },
    {
        id: 1012,
        name: "耐力跑者护踝",
        description: "有效减少疲劳，适合全场奔跑。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.RARE,
        stats: [
            { type: StatType.STAMINA, value: 12 }
        ],
    },
    // ----------------------------------------------------------------
    // 13-22: 史诗 (Epic)
    // ----------------------------------------------------------------
    {
        id: 1013,
        name: "三分射手头带",
        description: "据说能让佩戴者感受到三分线外的魔力。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.SHOOTING, value: 15 },
            { type: StatType.SPEED, value: -2 } // 专注于投篮，牺牲一点速度
        ],
    },
    {
        id: 1014,
        name: "魔术师护腕",
        description: "传球鬼魅莫测，对手难以预判。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.PASSING, value: 18 },
            { type: StatType.DRIBBLING, value: 8 }
        ],
    },
    {
        id: 1015,
        name: "禁飞区项链",
        description: "佩戴者周围的区域，仿佛被施加了盖帽结界。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.DEFENSE, value: 20 },
            { type: StatType.REBOUNDING, value: 5 }
        ],
    },
    {
        id: 1016,
        name: "风之子护踝",
        description: "突破如风，对手只能望尘莫及。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.SPEED, value: 25 },
            { type: StatType.DRIBBLING, value: 10 }
        ],
    },
    {
        id: 1017,
        name: "铜墙铁壁护膝",
        description: "极大地增强身体对抗能力。",
        slot: AccessorySlot.KNEEPAD,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.STRENGTH, value: 22 },
            { type: StatType.DEFENSE, value: 10 }
        ],
    },
    {
        id: 1018,
        name: "关键先生头带",
        description: "在比赛最后时刻，属性得到额外提升。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.SHOOTING, value: 10 },
            { type: StatType.PASSING, value: 10 },
            { type: StatType.DEFENSE, value: 10 }
        ],
    },
    {
        id: 1019,
        name: "进攻万花筒护腕",
        description: "全能型进攻球员的挚爱。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.SHOOTING, value: 12 },
            { type: StatType.DRIBBLING, value: 12 },
            { type: StatType.STAMINA, value: 5 }
        ],
    },
    {
        id: 1020,
        name: "篮板怪兽项链",
        description: "让佩戴者拥有不可思议的篮板嗅觉。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.REBOUNDING, value: 30 },
            { type: StatType.STRENGTH, value: 5 }
        ],
    },
    {
        id: 1021,
        name: "永动机护踝",
        description: "体力恢复速度大幅提升。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.STAMINA, value: 35 }
        ],
    },
    {
        id: 1022,
        name: "战术大师护膝",
        description: "提升对战术的理解和执行力。",
        slot: AccessorySlot.KNEEPAD,
        rarity: AccessoryRarity.EPIC,
        stats: [
            { type: StatType.PASSING, value: 15 },
            { type: StatType.DEFENSE, value: 10 }
        ],
    },
    // ----------------------------------------------------------------
    // 23-27: 传奇 (Legendary)
    // ----------------------------------------------------------------
    {
        id: 1023,
        name: "绝杀之王头带",
        description: "在比赛的最后五秒，投篮命中率提升至极限。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.LEGENDARY,
        stats: [
            { type: StatType.SHOOTING, value: 35 },
            { type: StatType.DRIBBLING, value: 10 },
            { type: StatType.STAMINA, value: 10 }
        ],
    },
    {
        id: 1024,
        name: "助攻机器护腕",
        description: "每一次传球都精准到位，仿佛能预知队友跑位。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.LEGENDARY,
        stats: [
            { type: StatType.PASSING, value: 40 },
            { type: StatType.SPEED, value: 10 }
        ],
    },
    {
        id: 1025,
        name: "抢断大师项链",
        description: "佩戴者拥有猎豹般的反应速度和抢断时机。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.LEGENDARY,
        stats: [
            { type: StatType.DEFENSE, value: 45 },
            { type: StatType.SPEED, value: 15 }
        ],
    },
    {
        id: 1026,
        name: "超音速护踝",
        description: "突破时产生音爆，让防守者无法跟上。",
        slot: AccessorySlot.ANKLET,
        rarity: AccessoryRarity.LEGENDARY,
        stats: [
            { type: StatType.SPEED, value: 50 },
            { type: StatType.DRIBBLING, value: 20 }
        ],
    },
    {
        id: 1027,
        name: "内线巨兽护膝",
        description: "在内线拥有绝对的统治力，无人能撼动。",
        slot: AccessorySlot.KNEEPAD,
        rarity: AccessoryRarity.LEGENDARY,
        stats: [
            { type: StatType.STRENGTH, value: 55 },
            { type: StatType.REBOUNDING, value: 25 }
        ],
    },
    // ----------------------------------------------------------------
    // 28-30: 神话 (Mythic)
    // ----------------------------------------------------------------
    {
        id: 1028,
        name: "全能之王头带",
        description: "佩戴者在场上几乎没有弱点，各项能力均衡提升。",
        slot: AccessorySlot.HEADBAND,
        rarity: AccessoryRarity.MYTHIC,
        stats: [
            { type: StatType.SHOOTING, value: 25 },
            { type: StatType.PASSING, value: 25 },
            { type: StatType.DEFENSE, value: 25 },
            { type: StatType.DRIBBLING, value: 25 },
        ],
    },
    {
        id: 1029,
        name: "时间掌控者项链",
        description: "能微调比赛节奏，让佩戴者永远比对手快一步。",
        slot: AccessorySlot.NECKLACE,
        rarity: AccessoryRarity.MYTHIC,
        stats: [
            { type: StatType.SPEED, value: 30 },
            { type: StatType.STAMINA, value: 30 },
            { type: StatType.PASSING, value: 20 }
        ],
    },
    {
        id: 1030,
        name: "篮球之神护腕",
        description: "蕴含着篮球史上最伟大球员的力量，全面碾压对手。",
        slot: AccessorySlot.WRISTBAND,
        rarity: AccessoryRarity.MYTHIC,
        stats: [
            { type: StatType.SHOOTING, value: 50 },
            { type: StatType.DEFENSE, value: 50 },
            { type: StatType.STRENGTH, value: 30 }
        ],
    },
];

// 辅助函数（可选，但有助于模块化）
/**
 * 根据ID查找饰品
 * @param id 饰品ID
 * @returns 饰品对象或null
 */
export function getAccessoryById(id: number): Accessory | undefined {
    return Accessories.find(acc => acc.id === id);
}