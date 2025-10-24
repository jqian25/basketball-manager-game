/**
 * client/src/game/training/BasicTraining.ts
 * 
 * 篮球基础训练系统模块
 * 包含20种基础训练项目，基于真实的篮球训练方法，并设计了科学的数值成长曲线。
 */

/**
 * 核心篮球属性枚举
 * 用于定义训练效果作用的目标属性。
 */
export enum BasketballAttribute {
    BallHandling = 'BallHandling', // 控球
    Shooting = 'Shooting',     // 投篮
    Passing = 'Passing',      // 传球
    Defense = 'Defense',      // 防守
    Rebounding = 'Rebounding',  // 篮板
    Stamina = 'Stamina',      // 耐力
    Strength = 'Strength',    // 力量
    Agility = 'Agility',      // 敏捷
    Focus = 'Focus',        // 专注 (影响罚球、关键球)
    Range = 'Range',        // 射程 (影响远距离投篮命中率)
}

/**
 * 训练项目效果配置接口
 */
export interface TrainingEffect {
    attribute: BasketballAttribute;
    /** 基础提升值 (BaseGain)，用于计算实际属性增益 */
    baseGain: number;
    /** 
     * 成长难度系数 k，决定属性提升的衰减速度。
     * k=1.0: 线性提升 (如Stamina)
     * k=1.5: 身体素质 (如Strength, Agility)
     * k=2.0: 技术属性 (如Shooting, BallHandling)
     * k=2.5: 稀有/难提升属性 (如Focus, Range)
     */
    difficultyFactor: number; 
}

/**
 * 基础训练项目接口
 */
export interface BasicTrainingItem {
    /** 训练项目的唯一ID (英文，用于代码识别) */
    id: string; 
    /** 训练项目的中文名称 */
    name: string;
    /** 训练项目的描述 */
    description: string;
    /** 训练难度等级 (1-5) */
    difficulty: number; 
    /** 每次训练消耗的体力值 */
    staminaCost: number;
    /** 训练效果列表 */
    effects: TrainingEffect[];
}

/**
 * 20种基础训练项目配置数组
 * 
 * 数值设计原则:
 * 1. 真实性: 训练项目对应现实中的篮球技能。
 * 2. 科学成长: 采用指数衰减曲线 (Gain = BaseGain * (1 - CurrentValue/100)^k)，模拟属性越高，提升越慢。
 * 3. 完整性: 覆盖篮球的五大核心技能 (运、投、传、防、篮) 和身体素质。
 */
export const BASIC_TRAINING_LIST: BasicTrainingItem[] = [
    // 运球类 (BallHandling, k=2.0)
    {
        id: 'CrossoverDribble',
        name: '原地体前变向运球',
        description: '提高控球的熟练度和变向速度。',
        difficulty: 2,
        staminaCost: 10,
        effects: [
            { attribute: BasketballAttribute.BallHandling, baseGain: 10, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Agility, baseGain: 5, difficultyFactor: 1.5 },
        ],
    },
    {
        id: 'BetweenLegsDribble',
        name: '胯下运球',
        description: '提高运球的保护性和节奏变化。',
        difficulty: 2,
        staminaCost: 10,
        effects: [
            { attribute: BasketballAttribute.BallHandling, baseGain: 10, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Focus, baseGain: 3, difficultyFactor: 2.5 },
        ],
    },
    {
        id: 'BehindBackDribble',
        name: '背后运球',
        description: '提高背部保护球和快速转身的能力。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.BallHandling, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Agility, baseGain: 7, difficultyFactor: 1.5 },
        ],
    },
    {
        id: 'SpinMoveDribble',
        name: '转身运球',
        description: '提高运球中的转身摆脱能力，对力量有要求。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.BallHandling, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Strength, baseGain: 5, difficultyFactor: 1.5 },
        ],
    },
    {
        id: 'ContinuousCrossovers',
        name: '连续体前变向',
        description: '高强度运球训练，同时提升耐力。',
        difficulty: 4,
        staminaCost: 20,
        effects: [
            { attribute: BasketballAttribute.BallHandling, baseGain: 20, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Stamina, baseGain: 10, difficultyFactor: 1.0 }, // 耐力提升较快
        ],
    },
    // 投篮类 (Shooting, k=2.0)
    {
        id: 'FreeThrowShooting',
        name: '定点投篮 (罚球线)',
        description: '提高投篮的稳定性和罚球命中率。',
        difficulty: 1,
        staminaCost: 5,
        effects: [
            { attribute: BasketballAttribute.Shooting, baseGain: 10, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Focus, baseGain: 5, difficultyFactor: 2.5 }, // 专注度提升
        ],
    },
    {
        id: 'ThreePointShooting',
        name: '定点投篮 (三分线)',
        description: '提高远距离投篮的准确性，对射程有要求。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.Shooting, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Range, baseGain: 7, difficultyFactor: 2.5 }, // 射程提升最难
        ],
    },
    {
        id: 'CatchAndShoot',
        name: '跑动中接球投篮',
        description: '提高无球跑位后的快速出手能力和移动中的投篮准确性。',
        difficulty: 4,
        staminaCost: 20,
        effects: [
            { attribute: BasketballAttribute.Shooting, baseGain: 20, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Agility, baseGain: 10, difficultyFactor: 1.5 }, // 跑动与敏捷相关
        ],
    },
    {
        id: 'PullUpJumper',
        name: '运球急停跳投',
        description: '提高持球进攻中的急停急起和投篮技术。',
        difficulty: 5,
        staminaCost: 25,
        effects: [
            { attribute: BasketballAttribute.Shooting, baseGain: 25, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.BallHandling, baseGain: 10, difficultyFactor: 2.0 },
        ],
    },
    {
        id: 'LayupAndFloater',
        name: '上篮/挑篮训练',
        description: '提高篮下不同角度和距离的终结成功率。',
        difficulty: 2,
        staminaCost: 10,
        effects: [
            { attribute: BasketballAttribute.Shooting, baseGain: 10, difficultyFactor: 2.0 }, // 终结归类为Shooting
            { attribute: BasketballAttribute.Agility, baseGain: 5, difficultyFactor: 1.5 },
        ],
    },
    // 传球类 (Passing, k=2.0)
    {
        id: 'ChestPassPractice',
        name: '胸前传球',
        description: '提高短距离、快速、准确的传球。',
        difficulty: 1,
        staminaCost: 5,
        effects: [
            { attribute: BasketballAttribute.Passing, baseGain: 10, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Focus, baseGain: 5, difficultyFactor: 2.5 },
        ],
    },
    {
        id: 'BouncePassPractice',
        name: '击地传球',
        description: '提高中距离、穿透防守的传球。',
        difficulty: 2,
        staminaCost: 10,
        effects: [
            { attribute: BasketballAttribute.Passing, baseGain: 10, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Agility, baseGain: 5, difficultyFactor: 1.5 }, // 传球时的脚步变化
        ],
    },
    {
        id: 'OverheadPassPractice',
        name: '头顶传球/长传',
        description: '提高长距离转移球和内线高吊传球，需要力量。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.Passing, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Strength, baseGain: 7, difficultyFactor: 1.5 },
        ],
    },
    {
        id: 'NoLookPassPractice',
        name: '不看人传球训练',
        description: '提高传球视野和欺骗性，对专注度要求高。',
        difficulty: 4,
        staminaCost: 20,
        effects: [
            { attribute: BasketballAttribute.Passing, baseGain: 20, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Focus, baseGain: 10, difficultyFactor: 2.5 },
        ],
    },
    {
        id: 'PostEntryPassPractice',
        name: '内线喂球训练',
        description: '提高向内线球员传球的准确性和时机。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.Passing, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Strength, baseGain: 5, difficultyFactor: 1.5 }, // 力量传球
        ],
    },
    // 防守与篮板类 (Defense, Rebounding, k=2.0)
    {
        id: 'LateralShuffleDefense',
        name: '侧滑步防守',
        description: '提高横向移动速度和防守脚步。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.Defense, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Agility, baseGain: 10, difficultyFactor: 1.5 },
        ],
    },
    {
        id: 'StealTimingPractice',
        name: '抢断时机训练',
        description: '提高判断传球路线和抢断时机的能力。',
        difficulty: 4,
        staminaCost: 20,
        effects: [
            { attribute: BasketballAttribute.Defense, baseGain: 20, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Focus, baseGain: 10, difficultyFactor: 2.5 },
        ],
    },
    {
        id: 'ReboundingBoxOut',
        name: '篮板卡位训练',
        description: '提高篮下卡位和保护篮板球的能力，主要依赖力量和篮板意识。',
        difficulty: 3,
        staminaCost: 15,
        effects: [
            { attribute: BasketballAttribute.Rebounding, baseGain: 15, difficultyFactor: 2.0 },
            { attribute: BasketballAttribute.Strength, baseGain: 10, difficultyFactor: 1.5 },
        ],
    },
    // 体能与身体素质类 (Stamina, Strength, Agility)
    {
        id: 'QuickStartAndChangeDir',
        name: '快速启动/变向跑',
        description: '提高瞬间爆发力和变向速度。',
        difficulty: 4,
        staminaCost: 20,
        effects: [
            { attribute: BasketballAttribute.Agility, baseGain: 20, difficultyFactor: 1.5 },
            { attribute: BasketballAttribute.Stamina, baseGain: 5, difficultyFactor: 1.0 },
        ],
    },
    {
        id: 'BasicStaminaTraining',
        name: '基础体能训练',
        description: '提高整体耐力和身体对抗能力，如折返跑。',
        difficulty: 1,
        staminaCost: 25, // 基础体能消耗大，但难度低
        effects: [
            { attribute: BasketballAttribute.Stamina, baseGain: 25, difficultyFactor: 1.0 }, // 线性快速提升
            { attribute: BasketballAttribute.Strength, baseGain: 5, difficultyFactor: 1.5 },
        ],
    },
];

/**
 * 训练增益计算函数 (示例，可在游戏逻辑层实现)
 * 
 * @param effect 训练效果配置
 * @param currentValue 玩家当前属性值 (0-100)
 * @returns 实际获得的属性增益
 */
export function calculateAttributeGain(effect: TrainingEffect, currentValue: number): number {
    const { baseGain, difficultyFactor } = effect;
    
    // 指数衰减公式: Gain = BaseGain * (1 - CurrentValue/100)^k
    // 确保 currentValue 在 0 到 100 之间
    const normalizedValue = Math.min(100, Math.max(0, currentValue));
    
    // 衰减因子: (1 - normalizedValue / 100)^k
    const decayFactor = Math.pow(1 - normalizedValue / 100, difficultyFactor);
    
    // 实际增益
    const actualGain = baseGain * decayFactor;
    
    // 返回整数或根据需求返回浮点数
    return Math.max(0, actualGain);
}

// 导出所有内容，方便其他模块引用
export default BASIC_TRAINING_LIST;