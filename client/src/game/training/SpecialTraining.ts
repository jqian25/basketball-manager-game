/**
 * 篮球训练系统：特殊训练课程数据定义
 * 文件: client/src/game/training/SpecialTraining.ts
 * 
 * 设计原则:
 * 1. 真实篮球训练方法: 课程名称和描述基于真实的篮球训练内容。
 * 2. 科学的成长曲线: 采用指数衰减模型 (Decay Rate = 0.95)，确保初始阶段成长快，后期成长放缓，模拟运动员成长瓶颈。
 * 3. 完整的数值设计: 包含等级上限、基础属性提升、经验需求和时间成本的完整计算参数。
 */

// 基础属性枚举
export enum EPlayerStat {
    STR = 'STR', // 力量 (Strength)
    AGI = 'AGI', // 敏捷 (Agility)
    JMP = 'JMP', // 弹跳 (Jump)
    SHT = 'SHT', // 投篮 (Shooting)
    PAS = 'PAS', // 传球 (Passing)
    DEF = 'DEF', // 防守 (Defense)
}

// 训练类型枚举
export enum ETrainingType {
    PHYSICAL = 'PHYSICAL', // 身体素质 (Physical)
    SKILL = 'SKILL',      // 技术技巧 (Skill)
    TACTIC = 'TACTIC',    // 战术理解 (Tactic)
}

// 特殊训练课程接口
export interface ISpecialTraining {
    /** 课程唯一ID */
    id: number;
    /** 课程名称 */
    name: string;
    /** 训练类型 */
    type: ETrainingType;
    /** 训练描述 */
    description: string;
    /** 主要提升属性 */
    primaryStat: EPlayerStat;
    /** 辅助提升属性 (可选) */
    secondaryStat?: EPlayerStat;
}

// 训练数值常量
export const TRAINING_CONSTANTS = {
    /** 最高训练等级 */
    MAX_LEVEL: 10,
    /** Level 1 基础属性提升值 (点) */
    BASE_GAIN: 5,
    /** 属性提升衰减系数 (每升一级，基础提升值乘以该系数) */
    DECAY_RATE: 0.95,
    /** Level 1 基础经验需求 */
    BASE_EXP: 100,
    /** 经验增长指数 (ExpRequired = BASE_EXP * Level^GROWTH_EXPONENT) */
    GROWTH_EXPONENT: 1.5,
    /** Level 1 基础时间成本 (分钟) */
    BASE_TIME: 30,
    /** 每级时间加成 (分钟) (TimeCost = BASE_TIME + (Level - 1) * TIME_BONUS_PER_LEVEL) */
    TIME_BONUS_PER_LEVEL: 5,
};

/**
 * 12种特殊训练课程数据
 * 数值计算函数 (应在游戏逻辑层实现):
 * 属性提升: Gain(L) = BASE_GAIN * Math.pow(DECAY_RATE, L - 1)
 * 经验需求: ExpRequired(L) = BASE_EXP * Math.pow(L, GROWTH_EXPONENT)
 * 时间成本: TimeCost(L) = BASE_TIME + (L - 1) * TIME_BONUS_PER_LEVEL
 */
export const SPECIAL_TRAININGS: ISpecialTraining[] = [
    {
        id: 1,
        name: '核心力量训练',
        type: ETrainingType.PHYSICAL,
        description: '专注于腹部、背部和腿部力量，提升对抗性和稳定性。',
        primaryStat: EPlayerStat.STR,
        secondaryStat: EPlayerStat.DEF,
    },
    {
        id: 2,
        name: '敏捷梯与折返跑',
        type: ETrainingType.PHYSICAL,
        description: '提升脚步频率、方向变化能力和反应速度。',
        primaryStat: EPlayerStat.AGI,
        secondaryStat: EPlayerStat.PAS,
    },
    {
        id: 3,
        name: '垂直弹跳特训',
        type: ETrainingType.PHYSICAL,
        description: '针对下肢爆发力训练，提高起跳高度和滞空能力。',
        primaryStat: EPlayerStat.JMP,
        secondaryStat: EPlayerStat.STR,
    },
    {
        id: 4,
        name: '定点投篮千次',
        type: ETrainingType.SKILL,
        description: '基础投篮姿势定型与肌肉记忆训练。',
        primaryStat: EPlayerStat.SHT,
    },
    {
        id: 5,
        name: '运球突破与变向',
        type: ETrainingType.SKILL,
        description: '提升控球的熟练度和变向的突然性。',
        primaryStat: EPlayerStat.AGI,
        secondaryStat: EPlayerStat.SHT,
    },
    {
        id: 6,
        name: '高位策应与分球',
        type: ETrainingType.SKILL,
        description: '提升视野、传球准确性和时机把握。',
        primaryStat: EPlayerStat.PAS,
        secondaryStat: EPlayerStat.AGI,
    },
    {
        id: 7,
        name: '底线防守滑步',
        type: ETrainingType.SKILL,
        description: '强化横向移动速度和防守站位意识。',
        primaryStat: EPlayerStat.DEF,
        secondaryStat: EPlayerStat.AGI,
    },
    {
        id: 8,
        name: '低位背身单打',
        type: ETrainingType.SKILL,
        description: '掌握背身要位、转身和勾手等低位进攻技术。',
        primaryStat: EPlayerStat.STR,
        secondaryStat: EPlayerStat.SHT,
    },
    {
        id: 9,
        name: '无球跑动与接球',
        type: ETrainingType.TACTIC,
        description: '学习摆脱防守、寻找空位和快速接球投篮。',
        primaryStat: EPlayerStat.PAS,
        secondaryStat: EPlayerStat.JMP,
    },
    {
        id: 10,
        name: '快攻转换与决策',
        type: ETrainingType.TACTIC,
        description: '提升攻防转换速度和快攻中的传球或终结决策。',
        primaryStat: EPlayerStat.AGI,
        secondaryStat: EPlayerStat.PAS,
    },
    {
        id: 11,
        name: '篮板卡位与冲抢',
        type: ETrainingType.PHYSICAL,
        description: '训练篮下卡位技巧和二次起跳抢篮板的能力。',
        primaryStat: EPlayerStat.STR,
        secondaryStat: EPlayerStat.JMP,
    },
    {
        id: 12,
        name: '罚球稳定性训练',
        type: ETrainingType.SKILL,
        description: '专注于在比赛压力下的罚球命中率和心理素质。',
        primaryStat: EPlayerStat.SHT,
    },
];
