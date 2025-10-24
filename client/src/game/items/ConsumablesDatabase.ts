// client/src/game/items/ConsumablesDatabase.ts

// 稀有度枚举
export enum Rarity {
    Common = "普通",
    Uncommon = "不常见",
    Rare = "稀有",
    Epic = "史诗",
    Legendary = "传奇",
}

// 属性接口 (根据篮球游戏需求设计)
export interface Attributes {
    // 基础恢复
    staminaRestore?: number; // 体力恢复 (百分比或固定值)
    energyRestore?: number;  // 能量/专注力恢复
    healthRestore?: number;  // 生命/伤病恢复

    // 临时增益
    shootingBoost?: number;  // 投篮命中率加成 (%)
    dribblingBoost?: number; // 运球/控球能力加成 (%)
    speedBoost?: number;     // 移动速度加成 (%)
    defenseBoost?: number;   // 防守/抢断能力加成 (%)
    passBoost?: number;      // 传球精准度加成 (%)
    reboundBoost?: number;   // 篮板能力加成 (%)

    // 持续时间 (秒)
    duration?: number;
}

// 消耗品接口
export interface ConsumableItem {
    id: number;
    name: string;
    description: string;
    attributes: Attributes;
    price: number; // 游戏内货币价格
    rarity: Rarity;
}

// 消耗品数据库
export const ConsumablesDatabase: ConsumableItem[] = [
    // 1-10: 基础能量和恢复
    {
        id: 1,
        name: "即效能量饮料",
        description: "快速补充流失的体力，让你在关键时刻不掉链子。",
        attributes: { staminaRestore: 20 },
        price: 50,
        rarity: Rarity.Common,
    },
    {
        id: 2,
        name: "运动绷带",
        description: "用于紧急处理轻微擦伤和扭伤，减少短暂的属性惩罚。",
        attributes: { healthRestore: 10 },
        price: 40,
        rarity: Rarity.Common,
    },
    {
        id: 3,
        name: "高级能量胶",
        description: "浓缩的能量，提供比饮料更持久的体力恢复。",
        attributes: { staminaRestore: 35 },
        price: 120,
        rarity: Rarity.Uncommon,
    },
    {
        id: 4,
        name: "战术暂停口哨",
        description: "模拟一次战术暂停，瞬间恢复少量能量和专注力。",
        attributes: { energyRestore: 15 },
        price: 80,
        rarity: Rarity.Common,
    },
    {
        id: 5,
        name: "冰敷袋",
        description: "快速缓解肌肉疲劳，暂时提升移动速度。",
        attributes: { speedBoost: 5, duration: 30 },
        price: 150,
        rarity: Rarity.Uncommon,
    },
    {
        id: 6,
        name: "超级复合维生素",
        description: "全面提升身体状态，小幅增加所有基础属性。",
        attributes: { shootingBoost: 1, dribblingBoost: 1, speedBoost: 1, defenseBoost: 1, duration: 60 },
        price: 300,
        rarity: Rarity.Rare,
    },
    {
        id: 7,
        name: "赛前热身油",
        description: "涂抹后感觉肌肉充满活力，短时间内提升运球和速度。",
        attributes: { dribblingBoost: 5, speedBoost: 5, duration: 45 },
        price: 180,
        rarity: Rarity.Uncommon,
    },
    {
        id: 8,
        name: "高压氧气瓶",
        description: "在体力透支时使用，瞬间恢复大量体力。",
        attributes: { staminaRestore: 60 },
        price: 500,
        rarity: Rarity.Rare,
    },
    {
        id: 9,
        name: "队医急救包",
        description: "包含多种专业医疗用品，大幅度恢复生命和减少伤病影响。",
        attributes: { healthRestore: 50 },
        price: 750,
        rarity: Rarity.Epic,
    },
    {
        id: 10,
        name: "精神集中药丸",
        description: "清除杂念，进入'区域'状态，大幅提高能量和专注力。",
        attributes: { energyRestore: 40 },
        price: 450,
        rarity: Rarity.Rare,
    },

    // 11-20: 投篮和得分
    {
        id: 11,
        name: "神射手瞄准镜",
        description: "短暂提升投篮精准度，三分线外更加致命。",
        attributes: { shootingBoost: 8, duration: 30 },
        price: 350,
        rarity: Rarity.Rare,
    },
    {
        id: 12,
        name: "罚球线魔药",
        description: "在罚球时使用，确保罚球命中率接近完美。",
        attributes: { shootingBoost: 20, duration: 10 },
        price: 200,
        rarity: Rarity.Uncommon,
    },
    {
        id: 13,
        name: "空中漫步气垫",
        description: "短暂增加滞空时间，让上篮和扣篮更难被封盖。",
        attributes: { shootingBoost: 5, defenseBoost: -5, duration: 15 }, // 增加投篮成功率，但可能略微影响落地防守
        price: 400,
        rarity: Rarity.Rare,
    },
    {
        id: 14,
        name: "后撤步秘籍",
        description: "使用后，下一次后撤步投篮的命中率大幅提升。",
        attributes: { shootingBoost: 15, duration: 5 },
        price: 550,
        rarity: Rarity.Epic,
    },
    {
        id: 15,
        name: "绝杀时刻芯片",
        description: "在比赛最后两分钟使用，所有投篮属性获得巨大提升。",
        attributes: { shootingBoost: 12, duration: 120 },
        price: 800,
        rarity: Rarity.Legendary,
    },
    {
        id: 16,
        name: "篮筐磁铁",
        description: "让篮筐在短时间内对你的投篮更友好，轻微增加投篮容错率。",
        attributes: { shootingBoost: 4, duration: 60 },
        price: 320,
        rarity: Rarity.Rare,
    },
    {
        id: 17,
        name: "中距离大师手册",
        description: "专注于中距离跳投的训练精华，提升中距离命中率。",
        attributes: { shootingBoost: 10, duration: 40 },
        price: 480,
        rarity: Rarity.Epic,
    },
    {
        id: 18,
        name: "三分线外兴奋剂",
        description: "让你感觉三分线近在咫尺，大幅提升三分球属性。",
        attributes: { shootingBoost: 10, dribblingBoost: -3, duration: 30 }, // 专注于投篮，牺牲运球
        price: 600,
        rarity: Rarity.Epic,
    },
    {
        id: 19,
        name: "扣篮王助推器",
        description: "短暂提升弹跳力和空中对抗能力，让扣篮更具观赏性和成功率。",
        attributes: { speedBoost: 8, duration: 20 },
        price: 450,
        rarity: Rarity.Rare,
    },
    {
        id: 20,
        name: "得分爆发药剂",
        description: "让你在短时间内进入得分模式，每次得分后属性都会小幅叠加。",
        attributes: { shootingBoost: 6, energyRestore: 10, duration: 45 },
        price: 700,
        rarity: Rarity.Epic,
    },

    // 21-30: 运球和组织
    {
        id: 21,
        name: "脚踝终结者护具",
        description: "提升运球时的节奏变化和控球稳定性，让防守者难以捉摸。",
        attributes: { dribblingBoost: 8, duration: 40 },
        price: 380,
        rarity: Rarity.Rare,
    },
    {
        id: 22,
        name: "魔术师手套",
        description: "短暂提升传球的隐蔽性和精准度，助攻更容易达成。",
        attributes: { passBoost: 10, duration: 30 },
        price: 420,
        rarity: Rarity.Rare,
    },
    {
        id: 23,
        name: "控球大师训练碟",
        description: "使用后，你的控球失误率将大幅降低。",
        attributes: { dribblingBoost: 5, defenseBoost: 2, duration: 60 },
        price: 250,
        rarity: Rarity.Uncommon,
    },
    {
        id: 24,
        name: "快速启动鞋垫",
        description: "提升第一步的爆发力，更容易突破防线。",
        attributes: { speedBoost: 10, duration: 25 },
        price: 490,
        rarity: Rarity.Epic,
    },
    {
        id: 25,
        name: "视野开阔眼镜",
        description: "提升场上视野，让你能看到并传出更具穿透力的球。",
        attributes: { passBoost: 15, duration: 45 },
        price: 650,
        rarity: Rarity.Epic,
    },
    {
        id: 26,
        name: "街球节奏药水",
        description: "让你在运球时充满街头篮球的节奏感，难以被抢断。",
        attributes: { dribblingBoost: 12, defenseBoost: -3, duration: 35 }, // 专注于进攻运球，防守略有松懈
        price: 520,
        rarity: Rarity.Epic,
    },
    {
        id: 27,
        name: "指挥官战术板",
        description: "使用后，你的队友会更有效地执行你的传球意图。",
        attributes: { passBoost: 8, energyRestore: 5, duration: 50 },
        price: 300,
        rarity: Rarity.Rare,
    },
    {
        id: 28,
        name: "无形之手药剂",
        description: "让你的传球路径更加隐蔽，难以被对手预判和拦截。",
        attributes: { passBoost: 12, duration: 20 },
        price: 480,
        rarity: Rarity.Rare,
    },
    {
        id: 29,
        name: "闪电侠加速器",
        description: "瞬间爆发的超高速度，让你在全场奔袭时无人能及。",
        attributes: { speedBoost: 15, staminaRestore: -5, duration: 15 }, // 速度极快，但消耗体力
        price: 750,
        rarity: Rarity.Legendary,
    },
    {
        id: 30,
        name: "组织核心芯片",
        description: "全面提升组织能力，每一次传球都充满威胁。",
        attributes: { dribblingBoost: 7, passBoost: 7, energyRestore: 10, duration: 60 },
        price: 900,
        rarity: Rarity.Legendary,
    },

    // 31-40: 防守和篮板
    {
        id: 31,
        name: "铁闸防守喷雾",
        description: "增加身体对抗的强度，让对手难以轻松突破。",
        attributes: { defenseBoost: 8, duration: 40 },
        price: 360,
        rarity: Rarity.Rare,
    },
    {
        id: 32,
        name: "抢断之王手胶",
        description: "让你的手指对球的触感更灵敏，抢断成功率小幅提升。",
        attributes: { defenseBoost: 5, duration: 60 },
        price: 280,
        rarity: Rarity.Uncommon,
    },
    {
        id: 33,
        name: "禁区守护者护膝",
        description: "提升在篮下卡位和封盖的能力，成为内线的屏障。",
        attributes: { reboundBoost: 8, defenseBoost: 4, duration: 50 },
        price: 550,
        rarity: Rarity.Epic,
    },
    {
        id: 34,
        name: "篮板嗅觉药剂",
        description: "让你能更准确地预判球的落点，提升篮板争抢成功率。",
        attributes: { reboundBoost: 10, duration: 30 },
        price: 400,
        rarity: Rarity.Rare,
    },
    {
        id: 35,
        name: "盖帽机器增高鞋垫",
        description: "暂时增加弹跳高度，让你的封盖范围覆盖整个禁区。",
        attributes: { defenseBoost: 10, speedBoost: -3, duration: 25 }, // 牺牲速度换取高度
        price: 600,
        rarity: Rarity.Epic,
    },
    {
        id: 36,
        name: "紧逼防守面罩",
        description: "让你能更贴近对手，干扰其投篮和传球。",
        attributes: { defenseBoost: 6, shootingBoost: -2, duration: 45 }, // 专注防守，进攻略受影响
        price: 320,
        rarity: Rarity.Rare,
    },
    {
        id: 37,
        name: "篮下巨兽药剂",
        description: "大幅提升身体力量和对抗性，在内线无人能敌。",
        attributes: { reboundBoost: 12, defenseBoost: 8, duration: 35 },
        price: 850,
        rarity: Rarity.Legendary,
    },
    {
        id: 38,
        name: "协防大师耳塞",
        description: "让你能更清晰地听到队友的呼喊，提升协防意识和成功率。",
        attributes: { defenseBoost: 5, passBoost: 3, duration: 60 },
        price: 450,
        rarity: Rarity.Rare,
    },
    {
        id: 39,
        name: "终结者之墙药剂",
        description: "在防守端形成一道不可逾越的墙，极大地削弱对手的进攻属性。",
        attributes: { defenseBoost: 15, shootingBoost: -10, duration: 20 }, // 强大的防守，但自身进攻被抑制
        price: 1000,
        rarity: Rarity.Legendary,
    },
    {
        id: 40,
        name: "二次进攻兴奋剂",
        description: "在抢到进攻篮板后，短时间内获得额外的体力恢复和投篮加成。",
        attributes: { reboundBoost: 5, staminaRestore: 10, shootingBoost: 5, duration: 15 },
        price: 500,
        rarity: Rarity.Epic,
    },

    // 41-50: 综合和特殊效果
    {
        id: 41,
        name: "全能战士营养餐",
        description: "均衡的营养，全面提升所有基础属性，但提升幅度较小。",
        attributes: { shootingBoost: 3, dribblingBoost: 3, speedBoost: 3, defenseBoost: 3, passBoost: 3, reboundBoost: 3, duration: 90 },
        price: 600,
        rarity: Rarity.Rare,
    },
    {
        id: 42,
        name: "逆转王牌香水",
        description: "在比分落后时使用，所有属性获得额外加成。",
        attributes: { shootingBoost: 5, defenseBoost: 5, speedBoost: 5, duration: 60 },
        price: 750,
        rarity: Rarity.Epic,
    },
    {
        id: 43,
        name: "主场优势旗帜",
        description: "模拟主场球迷的呐喊，为全队恢复少量能量。",
        attributes: { energyRestore: 10 },
        price: 350,
        rarity: Rarity.Rare,
    },
    {
        id: 44,
        name: "客场抗噪耳塞",
        description: "有效隔绝客场噪音干扰，防止属性因客场压力而降低。",
        attributes: { defenseBoost: 3, passBoost: 3, duration: 120 },
        price: 200,
        rarity: Rarity.Uncommon,
    },
    {
        id: 45,
        name: "体能教练的秘密药方",
        description: "极大地提高体力恢复速度，让你在场上跑动更持久。",
        attributes: { staminaRestore: 50, duration: 90 },
        price: 800,
        rarity: Rarity.Epic,
    },
    {
        id: 46,
        name: "时间膨胀药剂",
        description: "让你感觉时间流速变慢，获得短暂的反应速度加成。",
        attributes: { dribblingBoost: 10, defenseBoost: 10, duration: 10 },
        price: 950,
        rarity: Rarity.Legendary,
    },
    {
        id: 47,
        name: "得分机器合同",
        description: "使用后，你对得分的渴望达到顶峰，但传球意愿降低。",
        attributes: { shootingBoost: 15, passBoost: -10, duration: 40 },
        price: 700,
        rarity: Rarity.Epic,
    },
    {
        id: 48,
        name: "防守专家手册",
        description: "让你能更精准地判断对手的进攻意图，提升抢断和盖帽的成功率。",
        attributes: { defenseBoost: 12, duration: 50 },
        price: 650,
        rarity: Rarity.Epic,
    },
    {
        id: 49,
        name: "MVP光环",
        description: "散发出领袖魅力，全面提升自身和周围队友的属性。",
        attributes: { shootingBoost: 5, dribblingBoost: 5, speedBoost: 5, defenseBoost: 5, passBoost: 5, reboundBoost: 5, duration: 120 },
        price: 1500,
        rarity: Rarity.Legendary,
    },
    {
        id: 50,
        name: "传奇球星签名球",
        description: "收藏品，使用后可获得少量永久经验值和极高的能量恢复。",
        attributes: { energyRestore: 100 }, // 极高的能量恢复，作为传奇物品
        price: 2000,
        rarity: Rarity.Legendary,
    },
];

// 导出数据库，方便外部模块导入
export default ConsumablesDatabase;

// 物品总数: 50
// 模块名称: ConsumablesDatabase
