// client/src/game/skills/BasicSkills.ts

/**
 * @description 技能类型枚举
 */
export enum SkillType {
    OFFENSE = 'Offense', // 进攻技能
    DEFENSE = 'Defense', // 防守技能
    PASSING = 'Passing', // 传球/组织技能
    PHYSICAL = 'Physical', // 身体/通用技能
}

/**
 * @description 技能目标类型枚举
 */
export enum TargetType {
    SELF = 'Self', // 自身
    OPPONENT = 'Opponent', // 对方球员
    TEAM = 'Team', // 己方全体
    OPPONENT_TEAM = 'OpponentTeam', // 对方全体
}

/**
 * @description 技能效果类型枚举
 */
export enum EffectType {
    STAT_BOOST = 'StatBoost', // 属性提升
    STAT_DEBUFF = 'StatDebuff', // 属性削弱
    SCORING_BONUS = 'ScoringBonus', // 得分加成
    STEAL_CHANCE = 'StealChance', // 抢断几率
    BLOCK_CHANCE = 'BlockChance', // 盖帽几率
    REBOUND_BONUS = 'ReboundBonus', // 篮板加成
    STAMINA_RECOVERY = 'StaminaRecovery', // 体力恢复
    COOLDOWN_REDUCTION = 'CooldownReduction', // 冷却缩减
}

/**
 * @description 技能属性影响类型枚举
 */
export enum StatType {
    SHOOTING = 'Shooting', // 投篮
    DRIVING = 'Driving', // 突破
    PASSING = 'Passing', // 传球
    DEFENSE = 'Defense', // 防守
    REBOUND = 'Rebound', // 篮板
    STAMINA = 'Stamina', // 体力
    SPEED = 'Speed', // 速度
    STRENGTH = 'Strength', // 力量
}

/**
 * @description 技能效果接口
 */
export interface ISkillEffect {
    type: EffectType; // 效果类型
    stat?: StatType; // 影响的属性 (如果 type 是 StatBoost/StatDebuff)
    value: number; // 效果数值 (例如：+10, -5, 0.15)
    duration?: number; // 持续回合数 (可选)
    description: string; // 效果描述
}

/**
 * @description 基础技能数据结构接口
 */
export interface IBasicSkill {
    id: string; // 唯一ID (例如: 'basic_layup')
    name: string; // 技能名称 (例如: '基础上篮')
    type: SkillType; // 技能类型 (进攻/防守/传球/身体)
    target: TargetType; // 目标类型 (自身/对方球员/全体)
    cooldown: number; // 冷却回合数
    staminaCost: number; // 体力消耗
    description: string; // 技能详细描述
    effects: ISkillEffect[]; // 技能效果列表
}

/**
 * @description 30个基础篮球技能配置数据
 */
export const BasicSkills: IBasicSkill[] = [
    // 进攻技能 (Offense) - 10个
    {
        id: 'off_layup',
        name: '基础切入上篮',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 5,
        description: '快速切入内线完成上篮，增加得分成功率。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.1, description: '本回合得分成功率提高10%' },
            { type: EffectType.STAT_BOOST, stat: StatType.DRIVING, value: 5, duration: 1, description: '突破属性临时提升5点' },
        ],
    },
    {
        id: 'off_mid_range',
        name: '中距离跳投',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 6,
        description: '在罚球线附近进行跳投，得分稳定。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.08, description: '本回合得分成功率提高8%' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 4, duration: 1, description: '投篮属性临时提升4点' },
        ],
    },
    {
        id: 'off_three_point',
        name: '基础三分投射',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 2,
        staminaCost: 8,
        description: '远距离三分线外出手，风险高回报大。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.05, description: '本回合三分得分成功率提高5%' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 6, duration: 1, description: '投篮属性临时提升6点' },
        ],
    },
    {
        id: 'off_post_up',
        name: '低位背身单打',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 2,
        staminaCost: 7,
        description: '利用身体优势在低位背身强打，考验力量。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.07, description: '本回合得分成功率提高7%' },
            { type: EffectType.STAT_BOOST, stat: StatType.STRENGTH, value: 10, duration: 1, description: '力量属性临时提升10点' },
        ],
    },
    {
        id: 'off_pump_fake',
        name: '投篮假动作',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 3,
        description: '利用假动作晃起防守人，为后续进攻创造空间。',
        effects: [
            { type: EffectType.STAT_DEBUFF, stat: StatType.DEFENSE, value: -5, duration: 1, description: '目标防守属性临时降低5点' },
        ],
    },
    {
        id: 'off_euro_step',
        name: '欧洲步上篮',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 3,
        staminaCost: 10,
        description: '变向迷惑防守人，以不规则步伐完成上篮。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.15, description: '本回合得分成功率提高15%' },
            { type: EffectType.STAT_BOOST, stat: StatType.DRIVING, value: 8, duration: 1, description: '突破属性临时提升8点' },
        ],
    },
    {
        id: 'off_crossover',
        name: '基础变向运球',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 4,
        description: '快速的左右手变向，旨在晃开防守。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.SPEED, value: 5, duration: 1, description: '速度属性临时提升5点' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.DEFENSE, value: -3, duration: 1, description: '目标防守属性临时降低3点' },
        ],
    },
    {
        id: 'off_fadeaway',
        name: '后仰跳投',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 3,
        staminaCost: 9,
        description: '难以防守的后仰跳投，需要高超的投篮技巧。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.12, description: '本回合得分成功率提高12%' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 7, duration: 1, description: '投篮属性临时提升7点' },
        ],
    },
    {
        id: 'off_drive_kick',
        name: '突破分球',
        type: SkillType.OFFENSE,
        target: TargetType.TEAM,
        cooldown: 2,
        staminaCost: 5,
        description: '突破后将球传给外线空位队友，创造投篮机会。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 10, duration: 1, description: '传球属性临时提升10点' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 5, duration: 1, description: '随机队友投篮属性临时提升5点' },
        ],
    },
    {
        id: 'off_free_throw',
        name: '罚球专精',
        type: SkillType.OFFENSE,
        target: TargetType.SELF,
        cooldown: 5,
        staminaCost: 0,
        description: '提高罚球命中率的被动技能（在回合内使用，持续整场）。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 10, duration: 99, description: '罚球命中率永久提升10点' },
        ],
    },

    // 防守技能 (Defense) - 10个
    {
        id: 'def_man_to_man',
        name: '基础盯人防守',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 4,
        description: '紧密盯防对手，限制其进攻空间。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DEFENSE, value: 5, duration: 1, description: '防守属性临时提升5点' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.SHOOTING, value: -3, duration: 1, description: '目标投篮属性临时降低3点' },
        ],
    },
    {
        id: 'def_block',
        name: '基础盖帽',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 2,
        staminaCost: 7,
        description: '高高跃起，尝试封盖对手的投篮。',
        effects: [
            { type: EffectType.BLOCK_CHANCE, value: 0.15, description: '本回合盖帽成功率提高15%' },
            { type: EffectType.STAT_BOOST, stat: StatType.REBOUND, value: 5, duration: 1, description: '篮板属性临时提升5点' },
        ],
    },
    {
        id: 'def_steal',
        name: '基础抢断',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 2,
        staminaCost: 6,
        description: '看准时机，尝试切掉对手手中的球。',
        effects: [
            { type: EffectType.STEAL_CHANCE, value: 0.12, description: '本回合抢断成功率提高12%' },
            { type: EffectType.STAT_BOOST, stat: StatType.DEFENSE, value: 3, duration: 1, description: '防守属性临时提升3点' },
        ],
    },
    {
        id: 'def_zone_defense',
        name: '区域联防',
        type: SkillType.DEFENSE,
        target: TargetType.TEAM,
        cooldown: 5,
        staminaCost: 15,
        description: '全体队员收缩防守，保护内线，但可能漏掉外线空位。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DEFENSE, value: 8, duration: 3, description: '己方全体防守属性临时提升8点 (持续3回合)' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.SHOOTING, value: -5, duration: 3, description: '对方全体投篮属性临时降低5点 (持续3回合)' },
        ],
    },
    {
        id: 'def_close_out',
        name: '扑防投篮',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 5,
        description: '迅速冲向持球人，干扰其投篮。',
        effects: [
            { type: EffectType.STAT_DEBUFF, stat: StatType.SHOOTING, value: -7, duration: 1, description: '目标投篮属性临时降低7点' },
            { type: EffectType.STAT_BOOST, stat: StatType.SPEED, value: 5, duration: 1, description: '速度属性临时提升5点' },
        ],
    },
    {
        id: 'def_box_out',
        name: '卡位抢篮板',
        type: SkillType.DEFENSE,
        target: TargetType.SELF,
        cooldown: 1,
        staminaCost: 3,
        description: '利用身体卡住对手，为抢篮板创造有利位置。',
        effects: [
            { type: EffectType.REBOUND_BONUS, value: 0.1, description: '本回合篮板成功率提高10%' },
            { type: EffectType.STAT_BOOST, stat: StatType.STRENGTH, value: 5, duration: 1, description: '力量属性临时提升5点' },
        ],
    },
    {
        id: 'def_help_defense',
        name: '协防补位',
        type: SkillType.DEFENSE,
        target: TargetType.TEAM,
        cooldown: 3,
        staminaCost: 8,
        description: '及时补防被突破的队友，弥补防守漏洞。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DEFENSE, value: 10, duration: 1, description: '己方全体防守属性临时提升10点' },
        ],
    },
    {
        id: 'def_take_charge',
        name: '制造进攻犯规',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 5,
        staminaCost: 10,
        description: '预判对手路径，站定位置制造进攻犯规，成功则直接获得球权。',
        effects: [
            { type: EffectType.STAT_DEBUFF, stat: StatType.DRIVING, value: -10, duration: 1, description: '目标突破属性临时降低10点' },
        ],
    },
    {
        id: 'def_press',
        name: '全场紧逼',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT_TEAM,
        cooldown: 8,
        staminaCost: 20,
        description: '对对方所有球员施加压力，迫使其失误。',
        effects: [
            { type: EffectType.STAT_DEBUFF, stat: StatType.PASSING, value: -10, duration: 2, description: '对方全体传球属性临时降低10点 (持续2回合)' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.SHOOTING, value: -5, duration: 2, description: '对方全体投篮属性临时降低5点 (持续2回合)' },
        ],
    },
    {
        id: 'def_rebound_master',
        name: '篮板嗅觉',
        type: SkillType.DEFENSE,
        target: TargetType.SELF,
        cooldown: 5,
        staminaCost: 0,
        description: '提高抢夺篮板球的能力。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.REBOUND, value: 10, duration: 99, description: '篮板属性永久提升10点' },
        ],
    },

    // 传球/组织技能 (Passing) - 5个
    {
        id: 'pass_basic',
        name: '基础胸前传球',
        type: SkillType.PASSING,
        target: TargetType.TEAM,
        cooldown: 1,
        staminaCost: 3,
        description: '最基本的传球方式，稳定可靠。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 5, duration: 1, description: '传球属性临时提升5点' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 3, duration: 1, description: '随机队友投篮属性临时提升3点' },
        ],
    },
    {
        id: 'pass_bounce',
        name: '击地传球',
        type: SkillType.PASSING,
        target: TargetType.TEAM,
        cooldown: 1,
        staminaCost: 4,
        description: '利用击地躲过防守人的拦截，适合内线传球。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 7, duration: 1, description: '传球属性临时提升7点' },
        ],
    },
    {
        id: 'pass_alley_oop',
        name: '空接传球',
        type: SkillType.PASSING,
        target: TargetType.TEAM,
        cooldown: 4,
        staminaCost: 12,
        description: '高风险高回报的传球，需要队友默契配合。',
        effects: [
            { type: EffectType.SCORING_BONUS, value: 0.2, description: '如果空接成功，得分成功率提高20%' },
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 15, duration: 1, description: '传球属性临时提升15点' },
        ],
    },
    {
        id: 'pass_no_look',
        name: '不看人传球',
        type: SkillType.PASSING,
        target: TargetType.TEAM,
        cooldown: 3,
        staminaCost: 8,
        description: '迷惑防守人，出其不意地将球传给空位队友。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 10, duration: 1, description: '传球属性临时提升10点' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.DEFENSE, value: -5, duration: 1, description: '随机对方球员防守属性临时降低5点' },
        ],
    },
    {
        id: 'pass_assist_master',
        name: '助攻大师',
        type: SkillType.PASSING,
        target: TargetType.SELF,
        cooldown: 5,
        staminaCost: 0,
        description: '提高传球的精准度和视野。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 10, duration: 99, description: '传球属性永久提升10点' },
        ],
    },

    // 身体/通用技能 (Physical) - 5个
    {
        id: 'phy_sprint',
        name: '快速冲刺',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 1,
        staminaCost: 7,
        description: '短时间内爆发速度，用于快速攻防转换。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.SPEED, value: 15, duration: 1, description: '速度属性临时提升15点' },
        ],
    },
    {
        id: 'phy_strong_dribble',
        name: '强力护球',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 1,
        staminaCost: 5,
        description: '利用身体保护球，防止被抢断。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.STRENGTH, value: 10, duration: 1, description: '力量属性临时提升10点' },
            { type: EffectType.STAT_BOOST, stat: StatType.DRIVING, value: 5, duration: 1, description: '突破属性临时提升5点' },
        ],
    },
    {
        id: 'phy_stamina_recover',
        name: '喘息调整',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 5,
        staminaCost: 0,
        description: '利用比赛间隙进行调整，恢复少量体力。',
        effects: [
            { type: EffectType.STAMINA_RECOVERY, value: 15, description: '立即恢复15点体力' },
        ],
    },
    {
        id: 'phy_iron_man',
        name: '铁人意志',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 10,
        staminaCost: 0,
        description: '提高对体力消耗的抵抗力。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.STAMINA, value: 20, duration: 99, description: '体力上限永久提升20点' },
        ],
    },
    {
        id: 'phy_quick_reaction',
        name: '快速反应',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 5,
        staminaCost: 0,
        description: '缩短所有技能的冷却时间。',
        effects: [
            { type: EffectType.COOLDOWN_REDUCTION, value: 1, description: '所有技能冷却时间永久减少1回合' },
        ],
    },

    // 额外的 5 个基础技能，凑足 30 个
    // 进攻
    {
        id: 'off_pick_roll',
        name: '挡拆配合',
        type: SkillType.OFFENSE,
        target: TargetType.TEAM,
        cooldown: 2,
        staminaCost: 8,
        description: '与队友进行挡拆，为持球人创造进攻空间。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DRIVING, value: 8, duration: 1, description: '持球人突破属性临时提升8点' },
            { type: EffectType.STAT_BOOST, stat: StatType.SHOOTING, value: 5, duration: 1, description: '掩护队友投篮属性临时提升5点' },
        ],
    },
    {
        id: 'off_spin_move',
        name: '转身突破',
        type: SkillType.OFFENSE,
        target: TargetType.OPPONENT,
        cooldown: 2,
        staminaCost: 6,
        description: '利用转身动作摆脱防守，进行切入。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DRIVING, value: 10, duration: 1, description: '突破属性临时提升10点' },
        ],
    },
    // 防守
    {
        id: 'def_post_defense',
        name: '低位防守',
        type: SkillType.DEFENSE,
        target: TargetType.OPPONENT,
        cooldown: 1,
        staminaCost: 5,
        description: '对抗低位单打，限制对手得分。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.DEFENSE, value: 7, duration: 1, description: '防守属性临时提升7点' },
            { type: EffectType.STAT_DEBUFF, stat: StatType.STRENGTH, value: -5, duration: 1, description: '目标力量属性临时降低5点' },
        ],
    },
    // 传球
    {
        id: 'pass_outlet',
        name: '长传快攻',
        type: SkillType.PASSING,
        target: TargetType.TEAM,
        cooldown: 3,
        staminaCost: 10,
        description: '抢到篮板后迅速长传发动快攻。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.PASSING, value: 12, duration: 1, description: '传球属性临时提升12点' },
            { type: EffectType.STAT_BOOST, stat: StatType.SPEED, value: 10, duration: 1, description: '随机队友速度属性临时提升10点' },
        ],
    },
    // 身体
    {
        id: 'phy_toughness',
        name: '身体对抗',
        type: SkillType.PHYSICAL,
        target: TargetType.SELF,
        cooldown: 1,
        staminaCost: 4,
        description: '在身体接触中保持平衡和控制。',
        effects: [
            { type: EffectType.STAT_BOOST, stat: StatType.STRENGTH, value: 8, duration: 1, description: '力量属性临时提升8点' },
        ],
    },
];

// 导出类型和接口，方便其他模块使用
export type { IBasicSkill, ISkillEffect };
export { SkillType, TargetType, EffectType, StatType };
