// client/src/game/skills/AdvancedSkills.ts

/**
 * 技能类型：用于区分技能的主要用途
 */
export enum SkillType {
    OFFENSE = '进攻',
    DEFENSE = '防守',
    UTILITY = '辅助',
    PASSING = '传球',
}

/**
 * 技能目标：技能可以作用的对象
 */
export enum SkillTarget {
    SELF = '自身',
    OPPONENT = '对手',
    TEAMMATE = '队友',
    AREA = '区域',
}

/**
 * 属性影响：技能可能临时或永久影响的玩家属性
 */
export enum StatEffect {
    SHOOTING = '投篮',
    DRIBBLING = '运球',
    PASSING = '传球',
    DEFENSE = '防守',
    STAMINA = '体力',
    FOCUS = '专注',
    SPEED = '速度',
    JUMP = '弹跳',
    LUCK = '运气',
}

/**
 * 技能效果的详细配置
 */
export interface SkillEffect {
    stat: StatEffect; // 影响的属性
    value: number;    // 影响的数值（正数增强，负数削弱）
    duration: number; // 持续时间（回合数或秒数），0表示瞬时或永久
    isPercentage: boolean; // 是否为百分比影响
}

/**
 * 高级技能数据结构
 */
export interface AdvancedSkill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    target: SkillTarget;
    cost: number;        // 消耗的资源点（例如：专注值、体力值）
    cooldown: number;    // 冷却时间（回合数）
    requiredLevel: number; // 学习所需等级
    effects: SkillEffect[]; // 技能带来的效果列表
    animation: string;   // 技能施放时的动画/特效名称
}

/**
 * 25个高级技能的数据库
 */
export const AdvancedSkills: AdvancedSkill[] = [
    // 1. 进攻技能 (OFFENSE)
    {
        id: 'OFS001',
        name: '天勾绝杀',
        description: '消耗大量体力，在篮下以极高的命中率完成一次不可阻挡的勾手投篮。',
        type: SkillType.OFFENSE,
        target: SkillTarget.OPPONENT,
        cost: 80,
        cooldown: 5,
        requiredLevel: 30,
        effects: [
            { stat: StatEffect.SHOOTING, value: 50, duration: 1, isPercentage: false },
            { stat: StatEffect.STAMINA, value: -80, duration: 0, isPercentage: false },
        ],
        animation: 'SkyHook',
    },
    {
        id: 'OFS002',
        name: '幻影运球',
        description: '瞬间提升运球能力，使防守者难以判断方向，必定突破成功。',
        type: SkillType.OFFENSE,
        target: SkillTarget.SELF,
        cost: 60,
        cooldown: 4,
        requiredLevel: 32,
        effects: [
            { stat: StatEffect.DRIBBLING, value: 100, duration: 1, isPercentage: false },
            { stat: StatEffect.SPEED, value: 30, duration: 1, isPercentage: false },
        ],
        animation: 'PhantomDribble',
    },
    {
        id: 'OFS003',
        name: '后仰跳投大师',
        description: '在一次后仰跳投中大幅增加投篮属性，降低被封盖的几率。',
        type: SkillType.OFFENSE,
        target: SkillTarget.SELF,
        cost: 50,
        cooldown: 3,
        requiredLevel: 35,
        effects: [
            { stat: StatEffect.SHOOTING, value: 40, duration: 1, isPercentage: false },
            { stat: StatEffect.JUMP, value: 20, duration: 1, isPercentage: false },
        ],
        animation: 'Fadeaway',
    },
    {
        id: 'OFS004',
        name: '三分雨',
        description: '在接下来的3回合内，所有三分球命中率小幅提升。',
        type: SkillType.OFFENSE,
        target: SkillTarget.SELF,
        cost: 75,
        cooldown: 8,
        requiredLevel: 40,
        effects: [
            { stat: StatEffect.SHOOTING, value: 15, duration: 3, isPercentage: false },
        ],
        animation: 'ThreePointRain',
    },
    {
        id: 'OFS005',
        name: '低位梦幻脚步',
        description: '在低位单打时，连续使用假动作，大幅降低对手的防守属性。',
        type: SkillType.OFFENSE,
        target: SkillTarget.OPPONENT,
        cost: 70,
        cooldown: 5,
        requiredLevel: 38,
        effects: [
            { stat: StatEffect.DEFENSE, value: -40, duration: 1, isPercentage: false },
        ],
        animation: 'DreamShake',
    },
    {
        id: 'OFS006',
        name: '暴扣终结者',
        description: '在篮下强行起跳完成扣篮，无视对手一定比例的盖帽属性。',
        type: SkillType.OFFENSE,
        target: SkillTarget.OPPONENT,
        cost: 65,
        cooldown: 4,
        requiredLevel: 34,
        effects: [
            { stat: StatEffect.JUMP, value: 50, duration: 1, isPercentage: false },
            { stat: StatEffect.SHOOTING, value: 25, duration: 1, isPercentage: false }, // 保证命中
        ],
        animation: 'SlamDunk',
    },
    {
        id: 'OFS007',
        name: '节奏大师',
        description: '通过节奏变化迷惑对手，短暂提升全队的速度和运球。',
        type: SkillType.OFFENSE,
        target: SkillTarget.AREA,
        cost: 90,
        cooldown: 10,
        requiredLevel: 45,
        effects: [
            { stat: StatEffect.SPEED, value: 20, duration: 2, isPercentage: false },
            { stat: StatEffect.DRIBBLING, value: 20, duration: 2, isPercentage: false },
        ],
        animation: 'TempoControl',
    },

    // 2. 防守技能 (DEFENSE)
    {
        id: 'DFS008',
        name: '死亡缠绕',
        description: '对目标对手施加高强度防守压力，大幅降低其投篮和运球属性。',
        type: SkillType.DEFENSE,
        target: SkillTarget.OPPONENT,
        cost: 70,
        cooldown: 6,
        requiredLevel: 30,
        effects: [
            { stat: StatEffect.SHOOTING, value: -30, duration: 2, isPercentage: false },
            { stat: StatEffect.DRIBBLING, value: -30, duration: 2, isPercentage: false },
        ],
        animation: 'StrangleHold',
    },
    {
        id: 'DFS009',
        name: '遮天大帽',
        description: '瞬间爆发弹跳和防守属性，必定成功封盖对手的下一次投篮。',
        type: SkillType.DEFENSE,
        target: SkillTarget.OPPONENT,
        cost: 85,
        cooldown: 7,
        requiredLevel: 35,
        effects: [
            { stat: StatEffect.JUMP, value: 100, duration: 1, isPercentage: false },
            { stat: StatEffect.DEFENSE, value: 50, duration: 1, isPercentage: false },
        ],
        animation: 'SkyBlock',
    },
    {
        id: 'DFS010',
        name: '抢断专家',
        description: '预判对手传球或运球路线，大幅提升抢断成功率。',
        type: SkillType.DEFENSE,
        target: SkillTarget.OPPONENT,
        cost: 60,
        cooldown: 4,
        requiredLevel: 32,
        effects: [
            { stat: StatEffect.DEFENSE, value: 60, duration: 1, isPercentage: false }, // 影响抢断属性
            { stat: StatEffect.LUCK, value: 20, duration: 1, isPercentage: false },
        ],
        animation: 'StealMaster',
    },
    {
        id: 'DFS011',
        name: '铜墙铁壁',
        description: '在内线建立防守屏障，提升全队防守属性，持续2回合。',
        type: SkillType.DEFENSE,
        target: SkillTarget.AREA,
        cost: 95,
        cooldown: 12,
        requiredLevel: 42,
        effects: [
            { stat: StatEffect.DEFENSE, value: 25, duration: 2, isPercentage: false },
        ],
        animation: 'IronWall',
    },
    {
        id: 'DFS012',
        name: '篮板怪兽',
        description: '瞬间提升弹跳和运气，确保抢到下一次投篮不中的篮板球。',
        type: SkillType.DEFENSE,
        target: SkillTarget.SELF,
        cost: 70,
        cooldown: 5,
        requiredLevel: 38,
        effects: [
            { stat: StatEffect.JUMP, value: 50, duration: 1, isPercentage: false },
            { stat: StatEffect.LUCK, value: 50, duration: 1, isPercentage: false },
        ],
        animation: 'ReboundMonster',
    },
    {
        id: 'DFS013',
        name: '区域联防大师',
        description: '全队进入高级区域联防状态，降低对手传球和投篮的成功率。',
        type: SkillType.DEFENSE,
        target: SkillTarget.AREA,
        cost: 80,
        cooldown: 8,
        requiredLevel: 40,
        effects: [
            { stat: StatEffect.PASSING, value: -20, duration: 3, isPercentage: false },
            { stat: StatEffect.SHOOTING, value: -20, duration: 3, isPercentage: false },
        ],
        animation: 'ZoneDefense',
    },
    {
        id: 'DFS014',
        name: '疲劳打击',
        description: '通过持续的身体对抗，额外消耗目标对手的体力。',
        type: SkillType.DEFENSE,
        target: SkillTarget.OPPONENT,
        cost: 55,
        cooldown: 3,
        requiredLevel: 31,
        effects: [
            { stat: StatEffect.STAMINA, value: -50, duration: 0, isPercentage: false },
        ],
        animation: 'FatigueStrike',
    },

    // 3. 传球技能 (PASSING)
    {
        id: 'PSS015',
        name: '上帝视角传球',
        description: '拥有上帝般的视野，传出一次必定成功的助攻，并大幅提升队友的投篮属性。',
        type: SkillType.PASSING,
        target: SkillTarget.TEAMMATE,
        cost: 90,
        cooldown: 10,
        requiredLevel: 40,
        effects: [
            { stat: StatEffect.PASSING, value: 100, duration: 1, isPercentage: false }, // 保证传球成功
            { stat: StatEffect.SHOOTING, value: 30, duration: 1, isPercentage: false }, // 队友投篮加成
        ],
        animation: 'GodsEyePass',
    },
    {
        id: 'PSS016',
        name: '不看人传球',
        description: '传出一次极具迷惑性的不看人传球，短暂提升队友的专注度。',
        type: SkillType.PASSING,
        target: SkillTarget.TEAMMATE,
        cost: 65,
        cooldown: 5,
        requiredLevel: 33,
        effects: [
            { stat: StatEffect.PASSING, value: 40, duration: 1, isPercentage: false },
            { stat: StatEffect.FOCUS, value: 20, duration: 1, isPercentage: false },
        ],
        animation: 'NoLookPass',
    },
    {
        id: 'PSS017',
        name: '快攻发动者',
        description: '发动一次完美的快攻，瞬间提升全队的速度和传球属性。',
        type: SkillType.PASSING,
        target: SkillTarget.AREA,
        cost: 75,
        cooldown: 7,
        requiredLevel: 36,
        effects: [
            { stat: StatEffect.SPEED, value: 30, duration: 1, isPercentage: false },
            { stat: StatEffect.PASSING, value: 20, duration: 1, isPercentage: false },
        ],
        animation: 'FastBreak',
    },
    {
        id: 'PSS018',
        name: '战术大师',
        description: '呼叫一次复杂的战术跑位，大幅提升全队下一回合的进攻效率。',
        type: SkillType.PASSING,
        target: SkillTarget.AREA,
        cost: 100,
        cooldown: 15,
        requiredLevel: 50,
        effects: [
            { stat: StatEffect.SHOOTING, value: 20, duration: 1, isPercentage: false },
            { stat: StatEffect.DRIBBLING, value: 20, duration: 1, isPercentage: false },
            { stat: StatEffect.PASSING, value: 20, duration: 1, isPercentage: false },
        ],
        animation: 'TacticalMaster',
    },

    // 4. 辅助技能 (UTILITY)
    {
        id: 'UTL019',
        name: '肾上腺素爆发',
        description: '瞬间恢复大量体力，并在短时间内提升速度。',
        type: SkillType.UTILITY,
        target: SkillTarget.SELF,
        cost: 0, // 消耗专注值
        cooldown: 12,
        requiredLevel: 30,
        effects: [
            { stat: StatEffect.STAMINA, value: 100, duration: 0, isPercentage: false },
            { stat: StatEffect.SPEED, value: 25, duration: 2, isPercentage: false },
        ],
        animation: 'AdrenalineRush',
    },
    {
        id: 'UTL020',
        name: '专注光环',
        description: '在接下来的3回合内，全队专注度小幅提升，减少失误几率。',
        type: SkillType.UTILITY,
        target: SkillTarget.AREA,
        cost: 70,
        cooldown: 9,
        requiredLevel: 35,
        effects: [
            { stat: StatEffect.FOCUS, value: 20, duration: 3, isPercentage: false },
        ],
        animation: 'FocusAura',
    },
    {
        id: 'UTL021',
        name: '时间暂停',
        description: '在关键时刻叫出暂停，消除所有队友的负面状态效果。',
        type: SkillType.UTILITY,
        target: SkillTarget.AREA,
        cost: 120,
        cooldown: 20,
        requiredLevel: 48,
        effects: [
            // 效果：清除负面状态 (在实际游戏中需要特殊处理)
            { stat: StatEffect.LUCK, value: 50, duration: 0, isPercentage: false }, // 用运气属性模拟士气提升
        ],
        animation: 'TimeOut',
    },
    {
        id: 'UTL022',
        name: '黑洞体质',
        description: '吸引对手的注意力，使其进攻属性小幅下降，持续2回合。',
        type: SkillType.UTILITY,
        target: SkillTarget.OPPONENT,
        cost: 50,
        cooldown: 6,
        requiredLevel: 34,
        effects: [
            { stat: StatEffect.SHOOTING, value: -15, duration: 2, isPercentage: false },
            { stat: StatEffect.DRIBBLING, value: -15, duration: 2, isPercentage: false },
        ],
        animation: 'BlackHole',
    },
    {
        id: 'UTL023',
        name: '关键先生',
        description: '在比赛最后时刻（例如：剩余5回合内）使用，大幅提升投篮和运气属性。',
        type: SkillType.UTILITY,
        target: SkillTarget.SELF,
        cost: 60,
        cooldown: 1, // 关键时刻技能，冷却时间短
        requiredLevel: 40,
        effects: [
            { stat: StatEffect.SHOOTING, value: 40, duration: 1, isPercentage: false },
            { stat: StatEffect.LUCK, value: 40, duration: 1, isPercentage: false },
        ],
        animation: 'ClutchPlayer',
    },
    {
        id: 'UTL024',
        name: '战术欺骗',
        description: '迷惑对手，使其防守属性小幅下降，持续1回合。',
        type: SkillType.UTILITY,
        target: SkillTarget.OPPONENT,
        cost: 40,
        cooldown: 3,
        requiredLevel: 30,
        effects: [
            { stat: StatEffect.DEFENSE, value: -25, duration: 1, isPercentage: false },
        ],
        animation: 'TacticalDeception',
    },
    {
        id: 'UTL025',
        name: '全能战士',
        description: '短暂提升所有基础属性，持续1回合。',
        type: SkillType.UTILITY,
        target: SkillTarget.SELF,
        cost: 110,
        cooldown: 15,
        requiredLevel: 50,
        effects: [
            { stat: StatEffect.SHOOTING, value: 15, duration: 1, isPercentage: false },
            { stat: StatEffect.DRIBBLING, value: 15, duration: 1, isPercentage: false },
            { stat: StatEffect.PASSING, value: 15, duration: 1, isPercentage: false },
            { stat: StatEffect.DEFENSE, value: 15, duration: 1, isPercentage: false },
            { stat: StatEffect.SPEED, value: 15, duration: 1, isPercentage: false },
        ],
        animation: 'AllRounder',
    },
];
