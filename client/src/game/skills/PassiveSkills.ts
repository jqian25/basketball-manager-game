// client/src/game/skills/PassiveSkills.ts

/**
 * 被动技能效果类型
 * StatBoost: 属性增强 (如力量、速度、命中率)
 * ProcChance: 触发几率 (如抢断、盖帽、投篮命中后触发额外效果)
 * Aura: 光环效果 (影响周围队友或对手)
 * Conditional: 条件触发 (满足特定条件时生效，如第四节、落后时)
 */
export type PassiveEffectType = 'StatBoost' | 'ProcChance' | 'Aura' | 'Conditional';

/**
 * 影响的属性类型
 * Strength: 力量 (影响身体对抗、盖帽成功率)
 * Agility: 敏捷 (影响移动速度、抢断成功率)
 * Shooting: 投篮 (影响投篮命中率、三分命中率)
 * Passing: 传球 (影响传球精准度、助攻率)
 * Defense: 防守 (影响防守站位、干扰成功率)
 * Stamina: 体力 (影响体力消耗速度、疲劳恢复)
 */
export type AttributeType = 'Strength' | 'Agility' | 'Shooting' | 'Passing' | 'Defense' | 'Stamina';

/**
 * 被动技能效果详情接口
 */
export interface PassiveEffect {
    type: PassiveEffectType;
    // 效果影响的属性，StatBoost类型必填
    attribute?: AttributeType;
    // 效果值，可以是百分比或固定值
    value: number;
    // 效果持续时间或触发几率 (秒或百分比)
    durationOrChance?: number;
    // 针对特定条件的描述或目标 (如 "第四节", "队友")
    conditionOrTarget?: string;
}

/**
 * 被动技能接口
 */
export interface PassiveSkill {
    id: string;
    name: string;
    description: string;
    // 技能稀有度 (Common, Rare, Epic, Legendary)
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    // 技能等级上限
    maxLevel: number;
    // 技能效果列表
    effects: PassiveEffect[];
}

/**
 * 被动技能数据库
 * 键为技能ID
 */
export const PassiveSkills: Record<string, PassiveSkill> = {
    "P001": {
        id: "P001",
        name: "三分射手光环",
        description: "作为球队的投射核心，你能够通过站位和跑动为周围队友创造三分投篮空间，提高他们的三分命中率。",
        rarity: "Epic",
        maxLevel: 3,
        effects: [
            { type: "Aura", attribute: "Shooting", value: 0.05, conditionOrTarget: "周围5米内的队友" }
        ]
    },
    "P002": {
        id: "P002",
        name: "突破大师",
        description: "你拥有出色的第一步和变向能力。每次成功突破防守者时，短时间内移动速度和敏捷性大幅提升。",
        rarity: "Rare",
        maxLevel: 5,
        effects: [
            { type: "Conditional", attribute: "Agility", value: 0.15, durationOrChance: 3, conditionOrTarget: "成功突破防守者后" }
        ]
    },
    "P003": {
        id: "P003",
        name: "禁区守护者",
        description: "你在篮下拥有强大的威慑力。在三秒区内时，你的力量和盖帽成功率得到显著增强。",
        rarity: "Epic",
        maxLevel: 3,
        effects: [
            { type: "Conditional", attribute: "Strength", value: 0.20, conditionOrTarget: "在三秒区内" },
            { type: "StatBoost", attribute: "Defense", value: 0.10 }
        ]
    },
    "P004": {
        id: "P004",
        name: "精准传球",
        description: "你的传球视野和精准度无人能及。传球属性获得永久提升，并降低传球失误的几率。",
        rarity: "Common",
        maxLevel: 10,
        effects: [
            { type: "StatBoost", attribute: "Passing", value: 0.05 }
        ]
    },
    "P005": {
        id: "P005",
        name: "关键先生",
        description: "在比赛的最后两分钟，当比分差距在5分以内时，你的所有投篮命中率和传球精准度获得巨大提升。",
        rarity: "Legendary",
        maxLevel: 1,
        effects: [
            { type: "Conditional", attribute: "Shooting", value: 0.25, conditionOrTarget: "第四节最后2分钟，分差≤5" },
            { type: "Conditional", attribute: "Passing", value: 0.25, conditionOrTarget: "第四节最后2分钟，分差≤5" }
        ]
    },
    "P006": {
        id: "P006",
        name: "铁人",
        description: "你拥有超凡的耐力。体力消耗速度降低，并且在体力较低时，属性惩罚效果减弱。",
        rarity: "Rare",
        maxLevel: 5,
        effects: [
            { type: "StatBoost", attribute: "Stamina", value: -0.15 } // 负值表示消耗减少
        ]
    },
    "P007": {
        id: "P007",
        name: "抢断嗅觉",
        description: "你对球的移动有天生的直觉。抢断成功率提高，并有小几率在抢断失败时不被吹罚犯规。",
        rarity: "Epic",
        maxLevel: 3,
        effects: [
            { type: "ProcChance", attribute: "Defense", value: 0.10, durationOrChance: 0.15, conditionOrTarget: "抢断成功率提高10%，抢断失败时15%几率不犯规" }
        ]
    },
    "P008": {
        id: "P008",
        name: "快攻推进器",
        description: "成功抢到防守篮板或完成抢断后，你和你的队友在接下来的5秒内获得额外的移动速度加成。",
        rarity: "Rare",
        maxLevel: 5,
        effects: [
            { type: "Aura", attribute: "Agility", value: 0.20, durationOrChance: 5, conditionOrTarget: "抢断或防守篮板后，影响自身和队友" }
        ]
    },
    "P009": {
        id: "P009",
        name: "背身单打专家",
        description: "在低位背身持球时，你的力量和投篮命中率获得提升，使你更容易完成低位得分。",
        rarity: "Rare",
        maxLevel: 5,
        effects: [
            { type: "Conditional", attribute: "Strength", value: 0.15, conditionOrTarget: "背身单打时" },
            { type: "Conditional", attribute: "Shooting", value: 0.10, conditionOrTarget: "背身单打时" }
        ]
    },
    "P010": {
        id: "P010",
        name: "挡拆大师",
        description: "作为掩护人或持球人，你的挡拆质量和挡拆后的投篮或传球成功率提高。",
        rarity: "Common",
        maxLevel: 10,
        effects: [
            { type: "StatBoost", attribute: "Defense", value: 0.10, conditionOrTarget: "作为掩护人，提高掩护质量" },
            { type: "StatBoost", attribute: "Shooting", value: 0.05, conditionOrTarget: "挡拆后投篮" }
        ]
    },
    "P011": {
        id: "P011",
        name: "篮板怪兽",
        description: "你的卡位意识和弹跳能力超乎常人。进攻和防守篮板成功率永久提高。",
        rarity: "Epic",
        maxLevel: 3,
        effects: [
            { type: "StatBoost", attribute: "Strength", value: 0.15 },
            { type: "ProcChance", attribute: "Defense", value: 0.10, conditionOrTarget: "篮板成功率提高10%" }
        ]
    },
    "P012": {
        id: "P012",
        name: "战术组织者",
        description: "你拥有卓越的战术理解力。每次成功助攻后，队友的下一次投篮命中率小幅提高。",
        rarity: "Legendary",
        maxLevel: 1,
        effects: [
            { type: "Conditional", attribute: "Shooting", value: 0.08, durationOrChance: 3, conditionOrTarget: "成功助攻后，影响队友的下一次投篮" }
        ]
    },
    "P013": {
        id: "P013",
        name: "无球跑位专家",
        description: "在无球跑动时，你的移动速度提高，并且更容易摆脱防守者，获得空位投篮机会。",
        rarity: "Rare",
        maxLevel: 5,
        effects: [
            { type: "Conditional", attribute: "Agility", value: 0.10, conditionOrTarget: "无球跑动时" },
            { type: "ProcChance", attribute: "Shooting", value: 0.10, conditionOrTarget: "更容易获得空位" }
        ]
    },
    "P014": {
        id: "P014",
        name: "造犯规大师",
        description: "你精通利用身体接触制造犯规。投篮或突破时，获得罚球的几率大幅提高。",
        rarity: "Common",
        maxLevel: 10,
        effects: [
            { type: "ProcChance", attribute: "Shooting", value: 0.20, conditionOrTarget: "投篮或突破时，获得罚球几率提高20%" }
        ]
    },
    "P015": {
        id: "P015",
        name: "防守威慑",
        description: "你强大的防守压迫感让对手感到不适。当你贴身防守对手时，对手的投篮命中率小幅下降。",
        rarity: "Epic",
        maxLevel: 3,
        effects: [
            { type: "Aura", attribute: "Shooting", value: -0.05, conditionOrTarget: "贴身防守的对手" }
        ]
    }
};

