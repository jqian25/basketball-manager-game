// client/src/game/skills/SpecialSkills.ts

/**
 * 特殊技能ID枚举
 */
export enum SpecialSkillId {
    // 进攻技能
    FADEAWAY_JUMPER = 'FADEAWAY_JUMPER',
    EURO_STEP = 'EURO_STEP',
    STEP_BACK_THREE = 'STEP_BACK_THREE',
    POSTERIZER = 'POSTERIZER',
    CLUTCH_SHOT = 'CLUTCH_SHOT',
    ANIMAL_INSTINCT = 'ANIMAL_INSTINCT',
    FLOATER_MASTER = 'FLOATER_MASTER',
    QUICK_RELEASE = 'QUICK_RELEASE',
    // 防守技能
    LOCKDOWN_DEFENDER = 'LOCKDOWN_DEFENDER',
    SHOT_BLOCKER = 'SHOT_BLOCKER',
    PICK_POCKET = 'PICK_POCKET',
    INTIMIDATION = 'INTIMIDATION',
    REBOUND_MAGNET = 'REBOUND_MAGNET',
    // 组织/传球技能
    DIAMOND_PASS = 'DIAMOND_PASS',
    COURT_VISION = 'COURT_VISION',
    FAST_BREAK_STARTER = 'FAST_BREAK_STARTER',
    // 体能/精神技能
    IRON_MAN = 'IRON_MAN',
    MAMBA_MENTALITY = 'MAMBA_MENTALITY',
    SIXTH_MAN_SPARK = 'SIXTH_MAN_SPARK',
    // 通用技能
    MASTER_OF_CEREMONY = 'MASTER_OF_CEREMONY',
}

/**
 * 技能类型枚举
 */
export enum SkillType {
    OFFENSE = 'OFFENSE', // 进攻
    DEFENSE = 'DEFENSE', // 防守
    PLAYMAKING = 'PLAYMAKING', // 组织
    PHYSICAL = 'PHYSICAL', // 体能/精神
}

/**
 * 技能触发条件枚举
 */
export enum TriggerCondition {
    ON_SHOOT = 'ON_SHOOT',               // 投篮时
    ON_DRIBBLE = 'ON_DRIBBLE',           // 运球时
    ON_DEFEND = 'ON_DEFEND',             // 防守时
    ON_PASS = 'ON_PASS',                 // 传球时
    ON_REBOUND = 'ON_REBOUND',           // 抢篮板时
    ON_LOW_STAMINA = 'ON_LOW_STAMINA',   // 体力低下时
    ON_FOURTH_QUARTER = 'ON_FOURTH_QUARTER', // 第四节或关键时刻
    PASSIVE = 'PASSIVE',                 // 被动常驻
}

/**
 * 技能效果类型枚举
 */
export enum EffectType {
    STAT_BOOST = 'STAT_BOOST',           // 属性提升
    SUCCESS_RATE_INCREASE = 'SUCCESS_RATE_INCREASE', // 成功率提升
    STAMINA_COST_REDUCTION = 'STAMINA_COST_REDUCTION', // 体力消耗减少
    OPPONENT_STAT_DEBUFF = 'OPPONENT_STAT_DEBUFF', // 降低对手属性
    SPECIAL_ACTION = 'SPECIAL_ACTION',   // 触发特殊动作
}

/**
 * 技能效果接口
 */
export interface SkillEffect {
    type: EffectType;
    description: string; // 效果描述
    targetStat?: string; // 目标属性 (如 'shooting', 'defense', 'stamina')
    value?: number;      // 效果数值 (如 +10, -5)
    duration?: number;   // 持续时间 (回合数或秒数)
}

/**
 * 特殊技能数据结构
 */
export interface SpecialSkill {
    id: SpecialSkillId;
    name: string;
    type: SkillType;
    description: string;
    trigger: TriggerCondition;
    cooldown?: number; // 冷却时间 (回合数)
    effects: SkillEffect[];
}

/**
 * 特殊技能数据库
 */
export const SpecialSkills: Record<SpecialSkillId, SpecialSkill> = {
    // 1. 后仰跳投 (进攻)
    [SpecialSkillId.FADEAWAY_JUMPER]: {
        id: SpecialSkillId.FADEAWAY_JUMPER,
        name: '后仰跳投',
        type: SkillType.OFFENSE,
        description: '在投篮时触发，大幅增加后仰跳投的命中率，并使防守者难以封盖。',
        trigger: TriggerCondition.ON_SHOOT,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '后仰跳投命中率 +15%',
                targetStat: 'shooting',
                value: 15,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低防守者封盖成功率 -10%',
                targetStat: 'block',
                value: -10,
            },
        ],
    },
    // 2. 欧洲步 (进攻)
    [SpecialSkillId.EURO_STEP]: {
        id: SpecialSkillId.EURO_STEP,
        name: '欧洲步',
        type: SkillType.OFFENSE,
        description: '在突破上篮时触发，以不规则的步伐晃过防守者，提高上篮成功率。',
        trigger: TriggerCondition.ON_DRIBBLE,
        cooldown: 3,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '上篮成功率 +20%',
                targetStat: 'layup',
                value: 20,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低防守者抢断成功率 -15%',
                targetStat: 'steal',
                value: -15,
            },
        ],
    },
    // 3. 后撤步三分 (进攻)
    [SpecialSkillId.STEP_BACK_THREE]: {
        id: SpecialSkillId.STEP_BACK_THREE,
        name: '后撤步三分',
        type: SkillType.OFFENSE,
        description: '在三分线外投篮时触发，创造投篮空间，大幅提升三分命中率。',
        trigger: TriggerCondition.ON_SHOOT,
        cooldown: 4,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '三分球命中率 +12%',
                targetStat: 'threePointShooting',
                value: 12,
            },
            {
                type: EffectType.STAMINA_COST_REDUCTION,
                description: '减少投篮体力消耗 10%',
                value: 10,
            },
        ],
    },
    // 4. 隔人暴扣 (进攻)
    [SpecialSkillId.POSTERIZER]: {
        id: SpecialSkillId.POSTERIZER,
        name: '隔人暴扣',
        type: SkillType.OFFENSE,
        description: '在内线扣篮时触发，无视防守者强行扣篮，有几率造成对方犯规。',
        trigger: TriggerCondition.ON_SHOOT,
        cooldown: 5,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '扣篮成功率 +30%',
                targetStat: 'dunk',
                value: 30,
            },
            {
                type: EffectType.SPECIAL_ACTION,
                description: '有25%几率造成对手犯规',
            },
        ],
    },
    // 5. 关键先生 (进攻)
    [SpecialSkillId.CLUTCH_SHOT]: {
        id: SpecialSkillId.CLUTCH_SHOT,
        name: '关键先生',
        type: SkillType.OFFENSE,
        description: '在第四节或比赛最后两分钟触发，所有投篮属性大幅提升。',
        trigger: TriggerCondition.ON_FOURTH_QUARTER,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '所有投篮属性 +15',
                targetStat: 'allShooting',
                value: 15,
                duration: -1, // 持续到比赛结束
            },
        ],
    },
    // 6. 动物本能 (进攻/体能)
    [SpecialSkillId.ANIMAL_INSTINCT]: {
        id: SpecialSkillId.ANIMAL_INSTINCT,
        name: '动物本能',
        type: SkillType.OFFENSE,
        description: '被动技能。在篮下进攻时，能更有效地利用身体对抗，提高命中率和造犯规能力。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '内线得分能力 +10',
                targetStat: 'insideScoring',
                value: 10,
            },
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '造犯规几率 +10%',
            },
        ],
    },
    // 7. 抛投大师 (进攻)
    [SpecialSkillId.FLOATER_MASTER]: {
        id: SpecialSkillId.FLOATER_MASTER,
        name: '抛投大师',
        type: SkillType.OFFENSE,
        description: '在罚球线附近使用抛投时触发，大幅提升抛投命中率，无视内线高大防守。',
        trigger: TriggerCondition.ON_SHOOT,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '抛投命中率 +25%',
                targetStat: 'floater',
                value: 25,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低对手盖帽属性 -5',
                targetStat: 'block',
                value: -5,
            },
        ],
    },
    // 8. 快速出手 (进攻)
    [SpecialSkillId.QUICK_RELEASE]: {
        id: SpecialSkillId.QUICK_RELEASE,
        name: '快速出手',
        type: SkillType.OFFENSE,
        description: '被动技能。减少投篮准备时间，使防守者更难反应。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '投篮速度 +10',
                targetStat: 'shootingSpeed',
                value: 10,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低对手防守干扰效果 15%',
            },
        ],
    },
    // 9. 封锁型防守者 (防守)
    [SpecialSkillId.LOCKDOWN_DEFENDER]: {
        id: SpecialSkillId.LOCKDOWN_DEFENDER,
        name: '封锁型防守者',
        type: SkillType.DEFENSE,
        description: '在单防对手时触发，大幅降低对手的运球和投篮属性。',
        trigger: TriggerCondition.ON_DEFEND,
        effects: [
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低被防守者运球属性 -10',
                targetStat: 'dribbling',
                value: -10,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低被防守者投篮命中率 -8%',
                targetStat: 'shooting',
                value: -8,
            },
        ],
    },
    // 10. 盖帽大师 (防守)
    [SpecialSkillId.SHOT_BLOCKER]: {
        id: SpecialSkillId.SHOT_BLOCKER,
        name: '盖帽大师',
        type: SkillType.DEFENSE,
        description: '在尝试盖帽时触发，增加盖帽范围和成功率。',
        trigger: TriggerCondition.ON_DEFEND,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '盖帽属性 +20',
                targetStat: 'block',
                value: 20,
            },
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '成功盖帽后有50%几率获得球权',
            },
        ],
    },
    // 11. 妙手空空 (防守)
    [SpecialSkillId.PICK_POCKET]: {
        id: SpecialSkillId.PICK_POCKET,
        name: '妙手空空',
        type: SkillType.DEFENSE,
        description: '在尝试抢断时触发，大幅提升抢断成功率，并减少犯规几率。',
        trigger: TriggerCondition.ON_DEFEND,
        cooldown: 2,
        effects: [
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '抢断成功率 +15%',
                targetStat: 'steal',
                value: 15,
            },
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '抢断犯规几率 -10%',
            },
        ],
    },
    // 12. 威慑力 (防守)
    [SpecialSkillId.INTIMIDATION]: {
        id: SpecialSkillId.INTIMIDATION,
        name: '威慑力',
        type: SkillType.DEFENSE,
        description: '被动技能。在内线防守时，降低所有对手在禁区内的投篮命中率。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低对手内线命中率 -10%',
                targetStat: 'insideShooting',
                value: -10,
            },
        ],
    },
    // 13. 篮板磁铁 (防守)
    [SpecialSkillId.REBOUND_MAGNET]: {
        id: SpecialSkillId.REBOUND_MAGNET,
        name: '篮板磁铁',
        type: SkillType.DEFENSE,
        description: '在抢篮板时触发，增加篮板预判能力和卡位成功率。',
        trigger: TriggerCondition.ON_REBOUND,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '篮板属性 +15',
                targetStat: 'rebounding',
                value: 15,
            },
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '卡位成功率 +20%',
            },
        ],
    },
    // 14. 钻石传球 (组织)
    [SpecialSkillId.DIAMOND_PASS]: {
        id: SpecialSkillId.DIAMOND_PASS,
        name: '钻石传球',
        type: SkillType.PLAYMAKING,
        description: '在传球时触发，传球速度和精准度大幅提升，且不易被抢断。',
        trigger: TriggerCondition.ON_PASS,
        cooldown: 3,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '传球精准度 +15',
                targetStat: 'passingAccuracy',
                value: 15,
            },
            {
                type: EffectType.OPPONENT_STAT_DEBUFF,
                description: '降低对手抢断成功率 -20%',
                targetStat: 'steal',
                value: -20,
            },
        ],
    },
    // 15. 视野大师 (组织)
    [SpecialSkillId.COURT_VISION]: {
        id: SpecialSkillId.COURT_VISION,
        name: '视野大师',
        type: SkillType.PLAYMAKING,
        description: '被动技能。提升传球视野，增加助攻成功率，并能发现隐藏的传球路线。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '视野属性 +10',
                targetStat: 'vision',
                value: 10,
            },
            {
                type: EffectType.SUCCESS_RATE_INCREASE,
                description: '助攻成功率 +10%',
            },
        ],
    },
    // 16. 快攻发起者 (组织)
    [SpecialSkillId.FAST_BREAK_STARTER]: {
        id: SpecialSkillId.FAST_BREAK_STARTER,
        name: '快攻发起者',
        type: SkillType.PLAYMAKING,
        description: '在抢到篮板或抢断成功后触发，为队友提供短暂的速度和投篮加成。',
        trigger: TriggerCondition.ON_REBOUND, // 也可以是抢断成功后
        cooldown: 4,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '所有队友速度 +10，持续3回合',
                targetStat: 'speed',
                value: 10,
                duration: 3,
            },
            {
                type: EffectType.STAT_BOOST,
                description: '所有队友快攻投篮命中率 +10%',
                targetStat: 'fastBreakShooting',
                value: 10,
                duration: 3,
            },
        ],
    },
    // 17. 铁人 (体能)
    [SpecialSkillId.IRON_MAN]: {
        id: SpecialSkillId.IRON_MAN,
        name: '铁人',
        type: SkillType.PHYSICAL,
        description: '被动技能。大幅减少体力消耗，并提高抗伤病能力。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.STAMINA_COST_REDUCTION,
                description: '所有行动体力消耗 -20%',
                value: 20,
            },
            {
                type: EffectType.STAT_BOOST,
                description: '抗伤病属性 +20',
                targetStat: 'injuryResistance',
                value: 20,
            },
        ],
    },
    // 18. 黑曼巴精神 (精神)
    [SpecialSkillId.MAMBA_MENTALITY]: {
        id: SpecialSkillId.MAMBA_MENTALITY,
        name: '黑曼巴精神',
        type: SkillType.PHYSICAL,
        description: '在体力低下时触发，无视体力惩罚，短暂提升全属性。',
        trigger: TriggerCondition.ON_LOW_STAMINA,
        cooldown: 5,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '全属性 +10，持续2回合',
                targetStat: 'all',
                value: 10,
                duration: 2,
            },
            {
                type: EffectType.SPECIAL_ACTION,
                description: '暂时免疫体力低下带来的命中率惩罚',
            },
        ],
    },
    // 19. 第六人火花 (精神)
    [SpecialSkillId.SIXTH_MAN_SPARK]: {
        id: SpecialSkillId.SIXTH_MAN_SPARK,
        name: '第六人火花',
        type: SkillType.PHYSICAL,
        description: '作为替补上场时触发，为自己和场上队友提供短暂的士气和命中率加成。',
        trigger: TriggerCondition.PASSIVE, // 第一次上场时触发
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '自身和队友士气 +10，持续5回合',
                targetStat: 'morale',
                value: 10,
                duration: 5,
            },
            {
                type: EffectType.STAT_BOOST,
                description: '自身投篮命中率 +5%',
                targetStat: 'shooting',
                value: 5,
                duration: 5,
            },
        ],
    },
    // 20. 控场大师 (通用)
    [SpecialSkillId.MASTER_OF_CEREMONY]: {
        id: SpecialSkillId.MASTER_OF_CEREMONY,
        name: '控场大师',
        type: SkillType.PLAYMAKING,
        description: '被动技能。能更好地控制比赛节奏，减少失误，并在关键时刻稳定军心。',
        trigger: TriggerCondition.PASSIVE,
        effects: [
            {
                type: EffectType.STAT_BOOST,
                description: '失误几率 -10%',
                targetStat: 'turnover',
                value: -10,
            },
            {
                type: EffectType.SPECIAL_ACTION,
                description: '在关键时刻（如被追分）有几率触发一次暂停效果',
            },
        ],
    },
};

// 导出类型以供其他模块使用
export type { SpecialSkill };
export default SpecialSkills;