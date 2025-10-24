// client/src/game/items/TrophiesDatabase.ts

/**
 * 物品稀有度枚举
 */
export enum Rarity {
    COMMON = "普通",
    UNCOMMON = "不常见",
    RARE = "稀有",
    EPIC = "史诗",
    LEGENDARY = "传说",
    MYTHIC = "神话",
}

/**
 * 物品属性接口
 * 属性值代表对玩家或球队的增益效果
 */
export interface ItemAttributes {
    // 投篮命中率提升 (%)
    shootingAccuracy?: number;
    // 抢断成功率提升 (%)
    stealChance?: number;
    // 盖帽成功率提升 (%)
    blockChance?: number;
    // 篮板争夺能力提升 (%)
    reboundPower?: number;
    // 传球视野提升 (点)
    passVision?: number;
    // 体能恢复速度提升 (%)
    staminaRecovery?: number;
    // 罚球命中率提升 (%)
    freeThrowAccuracy?: number;
    // 关键时刻表现提升 (点)
    clutchFactor?: number;
    // 团队精神提升 (点)
    teamSpirit?: number;
    // 经验值获取加成 (%)
    expBonus?: number;
}

/**
 * 奖杯/奖牌物品数据结构
 */
export interface TrophyItem {
    id: string; // 物品唯一ID
    name: string; // 名称
    description: string; // 描述
    rarity: Rarity; // 稀有度
    price: number; // 价格 (游戏币)
    attributes: ItemAttributes; // 属性
}

/**
 * 篮球主题奖杯和奖牌数据库
 * 包含30种物品
 */
export const TrophiesDatabase: TrophyItem[] = [
    // ----------------------------------------------------------------
    // 铜牌/普通 (COMMON)
    // ----------------------------------------------------------------
    {
        id: "T001",
        name: "社区联赛铜牌",
        description: "颁发给社区三对三联赛的第三名队伍。是荣誉的开始。",
        rarity: Rarity.COMMON,
        price: 50,
        attributes: {
            staminaRecovery: 1,
        },
    },
    {
        id: "T002",
        name: "最佳替补奖",
        description: "表彰在板凳席上做出贡献的球员，虽然上场时间不多，但总能带来活力。",
        rarity: Rarity.COMMON,
        price: 60,
        attributes: {
            teamSpirit: 1,
        },
    },
    {
        id: "T003",
        name: "单场篮板王纪念币",
        description: "记录了某场比赛中抢下最多篮板的成就。一块沉甸甸的锌合金纪念币。",
        rarity: Rarity.COMMON,
        price: 70,
        attributes: {
            reboundPower: 1,
        },
    },
    {
        id: "T004",
        name: "训练营优秀学员奖",
        description: "在基础篮球训练营中表现积极的证明。代表着努力和潜力。",
        rarity: Rarity.COMMON,
        price: 55,
        attributes: {
            expBonus: 2,
        },
    },
    {
        id: "T005",
        name: "友谊赛冠军奖杯",
        description: "一场非正式友谊赛的冠军奖杯，虽然不值钱，但代表着胜利的喜悦。",
        rarity: Rarity.COMMON,
        price: 45,
        attributes: {
            shootingAccuracy: 0.5,
        },
    },

    // ----------------------------------------------------------------
    // 银牌/不常见 (UNCOMMON)
    // ----------------------------------------------------------------
    {
        id: "T006",
        name: "城市街球赛亚军奖牌",
        description: "在激烈的城市街球赛中获得第二名。证明了在水泥地上磨练出的技巧。",
        rarity: Rarity.UNCOMMON,
        price: 150,
        attributes: {
            stealChance: 1,
            shootingAccuracy: 1,
        },
    },
    {
        id: "T007",
        name: "月度最佳防守球员奖",
        description: "表彰一个月内防守端表现最出色的球员。一块刻有坚固盾牌的银质奖牌。",
        rarity: Rarity.UNCOMMON,
        price: 180,
        attributes: {
            blockChance: 2,
        },
    },
    {
        id: "T008",
        name: "技巧挑战赛冠军奖杯",
        description: "在运球、传球和投篮等综合技巧挑战中夺冠的奖杯。注重全面性。",
        rarity: Rarity.UNCOMMON,
        price: 165,
        attributes: {
            passVision: 2,
            shootingAccuracy: 0.5,
        },
    },
    {
        id: "T009",
        name: "半职业联赛最佳新秀奖",
        description: "在半职业联赛中崭露头角的新人奖。预示着光明的未来。",
        rarity: Rarity.UNCOMMON,
        price: 200,
        attributes: {
            expBonus: 5,
            staminaRecovery: 2,
        },
    },
    {
        id: "T010",
        name: "年度最佳第六人奖杯",
        description: "授予那些从替补席上站出来，改变比赛走向的关键球员。",
        rarity: Rarity.UNCOMMON,
        price: 190,
        attributes: {
            clutchFactor: 2,
            teamSpirit: 1,
        },
    },

    // ----------------------------------------------------------------
    // 金牌/稀有 (RARE)
    // ----------------------------------------------------------------
    {
        id: "T011",
        name: "地区锦标赛金牌",
        description: "在地区级篮球锦标赛中获得的最高荣誉。含金量显著提升。",
        rarity: Rarity.RARE,
        price: 450,
        attributes: {
            shootingAccuracy: 2,
            staminaRecovery: 3,
        },
    },
    {
        id: "T012",
        name: "全明星三分球大赛奖杯",
        description: "在全明星周末三分球大赛中以高命中率夺冠的象征。纯粹的射手荣耀。",
        rarity: Rarity.RARE,
        price: 500,
        attributes: {
            shootingAccuracy: 4,
            freeThrowAccuracy: 2,
        },
    },
    {
        id: "T013",
        name: "赛季助攻王奖杯",
        description: "表彰整个赛季中送出最多助攻的组织者。传球艺术的巅峰。",
        rarity: Rarity.RARE,
        price: 480,
        attributes: {
            passVision: 5,
            teamSpirit: 2,
        },
    },
    {
        id: "T014",
        name: "最佳拼搏精神奖",
        description: "授予那些无论比分如何，始终保持高昂斗志和拼搏精神的球员。",
        rarity: Rarity.RARE,
        price: 420,
        attributes: {
            staminaRecovery: 5,
            reboundPower: 2,
        },
    },
    {
        id: "T015",
        name: "单场5x5成就奖牌",
        description: "记录了在一场比赛中达成得分、篮板、助攻、抢断、盖帽五项数据均达到5或以上的罕见成就。",
        rarity: Rarity.RARE,
        price: 550,
        attributes: {
            shootingAccuracy: 1,
            stealChance: 1.5,
            blockChance: 1.5,
            reboundPower: 1,
            passVision: 1,
        },
    },

    // ----------------------------------------------------------------
    // 铂金/史诗 (EPIC)
    // ----------------------------------------------------------------
    {
        id: "T016",
        name: "全国大学联赛冠军奖杯",
        description: "大学篮球最高荣誉，象征着年轻一代的统治力。一个巨大的银质奖杯。",
        rarity: Rarity.EPIC,
        price: 1200,
        attributes: {
            shootingAccuracy: 3,
            staminaRecovery: 5,
            clutchFactor: 3,
        },
    },
    {
        id: "T017",
        name: "年度最佳防守球员奖杯",
        description: "授予联盟中防守影响力最大的球员。以一只展开翅膀的老鹰为造型。",
        rarity: Rarity.EPIC,
        price: 1350,
        attributes: {
            stealChance: 4,
            blockChance: 4,
            reboundPower: 3,
        },
    },
    {
        id: "T018",
        name: "总决赛MVP奖杯",
        description: "在最高级别联赛总决赛中表现最出色的球员所获得的奖杯。闪耀着冠军的光芒。",
        rarity: Rarity.EPIC,
        price: 1500,
        attributes: {
            clutchFactor: 8,
            shootingAccuracy: 2,
            expBonus: 10,
        },
    },
    {
        id: "T019",
        name: "全明星扣篮大赛冠军奖杯",
        description: "象征着无与伦比的弹跳和创造力。篮球美学的极致体现。",
        rarity: Rarity.EPIC,
        price: 1100,
        attributes: {
            staminaRecovery: 8,
            reboundPower: 4,
        },
    },
    {
        id: "T020",
        name: "赛季最佳教练奖",
        description: "授予带领球队取得卓越成就的教练。代表着战术智慧和领导力。",
        rarity: Rarity.EPIC,
        price: 1000,
        attributes: {
            teamSpirit: 10,
            passVision: 3,
        },
    },

    // ----------------------------------------------------------------
    // 钻石/传说 (LEGENDARY)
    // ----------------------------------------------------------------
    {
        id: "T021",
        name: "联盟常规赛MVP奖杯",
        description: "授予整个赛季中表现最具有统治力的球员。篮球界个人荣誉的巅峰之一。",
        rarity: Rarity.LEGENDARY,
        price: 3500,
        attributes: {
            shootingAccuracy: 5,
            clutchFactor: 10,
            expBonus: 15,
        },
    },
    {
        id: "T022",
        name: "年度最佳总经理奖",
        description: "表彰通过精明交易和选秀为球队奠定基础的幕后英雄。象征着卓越的决策能力。",
        rarity: Rarity.LEGENDARY,
        price: 3000,
        attributes: {
            teamSpirit: 15,
            staminaRecovery: 10,
        },
    },
    {
        id: "T023",
        name: "历史得分王纪念奖章",
        description: "为打破联盟历史总得分纪录而铸造的纯金奖章。代表着持久的伟大。",
        rarity: Rarity.LEGENDARY,
        price: 4000,
        attributes: {
            shootingAccuracy: 8,
            freeThrowAccuracy: 5,
            clutchFactor: 5,
        },
    },
    {
        id: "T024",
        name: "四连冠王朝奖杯",
        description: "象征着连续四年夺得最高级别联赛冠军的无上荣耀。一个刻有四颗星的巨大奖杯。",
        rarity: Rarity.LEGENDARY,
        price: 4500,
        attributes: {
            teamSpirit: 20,
            staminaRecovery: 10,
            clutchFactor: 5,
        },
    },
    {
        id: "T025",
        name: "年度最佳抢断王奖杯",
        description: "授予赛季总抢断数最高的球员。象征着防守端的敏捷和预判。",
        rarity: Rarity.LEGENDARY,
        price: 3200,
        attributes: {
            stealChance: 10,
            passVision: 5,
        },
    },

    // ----------------------------------------------------------------
    // 传奇/神话 (MYTHIC)
    // ----------------------------------------------------------------
    {
        id: "T026",
        name: "名人堂入选戒指",
        description: "篮球界最高个人荣誉。象征着职业生涯的永恒不朽。",
        rarity: Rarity.MYTHIC,
        price: 8000,
        attributes: {
            shootingAccuracy: 10,
            stealChance: 5,
            blockChance: 5,
            reboundPower: 5,
            passVision: 5,
            clutchFactor: 15,
        },
    },
    {
        id: "T027",
        name: "全球篮球大使奖",
        description: "表彰对篮球运动在全球推广做出杰出贡献的人士。超越竞技的荣誉。",
        rarity: Rarity.MYTHIC,
        price: 7500,
        attributes: {
            teamSpirit: 30,
            expBonus: 20,
        },
    },
    {
        id: "T028",
        name: "完美赛季不败金杯",
        description: "记录了球队以全胜战绩夺冠的完美赛季。历史上极其罕见的成就。",
        rarity: Rarity.MYTHIC,
        price: 9000,
        attributes: {
            shootingAccuracy: 15,
            staminaRecovery: 15,
            clutchFactor: 10,
        },
    },
    {
        id: "T029",
        name: "“篮球之神”雕像",
        description: "一个微缩的、以传说中篮球之神为原型的雕像。蕴含着篮球的终极力量。",
        rarity: Rarity.MYTHIC,
        price: 10000,
        attributes: {
            shootingAccuracy: 20,
            clutchFactor: 20,
            freeThrowAccuracy: 10,
        },
    },
    {
        id: "T030",
        name: "宇宙联赛冠军奖杯",
        description: "来自一个超越现实的、汇聚了所有维度最强球队的联赛冠军。终极的篮球圣物。",
        rarity: Rarity.MYTHIC,
        price: 15000,
        attributes: {
            shootingAccuracy: 25,
            stealChance: 10,
            blockChance: 10,
            reboundPower: 10,
            passVision: 10,
            staminaRecovery: 10,
            freeThrowAccuracy: 10,
            clutchFactor: 25,
            teamSpirit: 25,
            expBonus: 25,
        },
    },
];