/**
 * client/src/game/training/AdvancedTraining.ts
 * 篮球进阶训练系统模块
 * 包含15种进阶训练，旨在实现真实的训练方法、科学的成长曲线和完整的数值设计。
 */

// 1. 基础属性定义：球员属性和训练效果
// 假设球员的基础属性（PlayerStats）已在其他地方定义，这里只定义训练相关的接口。

/**
 * 定义训练对球员属性的增益效果
 * 数值设计：
 * - 基础属性（如 Shooting, Dribbling）的增长曲线应为对数曲线或S型曲线，初期增长快，后期增长慢。
 * - 训练效果（EffectValue）为基础增益值，实际增长需结合球员当前属性、训练难度、训练师等级等计算。
 * - 精神属性（如 Stamina, Focus）的增长应更平稳，线性或轻微对数。
 */
export interface TrainingEffect {
    /** 投篮能力增益 (0-100) */
    Shooting?: number;
    /** 运球能力增益 (0-100) */
    Dribbling?: number;
    /** 传球能力增益 (0-100) */
    Passing?: number;
    /** 防守能力增益 (0-100) */
    Defense?: number;
    /** 篮板能力增益 (0-100) */
    Rebounding?: number;
    /** 力量/体能增益 (0-100) */
    Strength?: number;
    /** 敏捷/速度增益 (0-100) */
    Agility?: number;
    /** 专注度增益 (0-100) */
    Focus?: number;
    /** 疲劳值消耗 (1-100) */
    FatigueCost: number;
    /** 训练经验值奖励 (1-100) */
    ExpReward: number;
}

/**
 * 训练难度枚举
 * 数值设计：难度越高，基础增益越高，疲劳消耗越大。
 */
export enum TrainingDifficulty {
    EASY = 'EASY',       // 简单 (基础增益 x0.8, 疲劳消耗 x0.5)
    NORMAL = 'NORMAL',   // 普通 (基础增益 x1.0, 疲劳消耗 x1.0)
    HARD = 'HARD',       // 困难 (基础增益 x1.2, 疲劳消耗 x1.5)
    ADVANCED = 'ADVANCED', // 进阶 (基础增益 x1.5, 疲劳消耗 x2.0)
    ELITE = 'ELITE',     // 精英 (基础增益 x2.0, 疲劳消耗 x3.0)
}

/**
 * 进阶训练模块接口
 */
export interface AdvancedTraining {
    /** 训练ID (唯一标识) */
    id: string;
    /** 训练名称 */
    name: string;
    /** 训练描述 */
    description: string;
    /** 训练难度 */
    difficulty: TrainingDifficulty;
    /** 训练所需时间 (分钟) */
    duration: number;
    /** 训练主要提升的属性标签 */
    primaryAttribute: string;
    /** 训练效果（基础增益和消耗） */
    effect: TrainingEffect;
    /** 训练解锁条件 (例如：球员等级, 属性要求) - 简化为属性要求 */
    unlockRequirement: {
        minAttribute: keyof Omit<TrainingEffect, 'FatigueCost' | 'ExpReward'>;
        minValue: number;
    };
}

// 2. 15种进阶训练的具体设计
// 结合真实篮球训练方法，分为投篮、运控、传球、防守、体能五大类，每类3项。

export const ADVANCED_TRAININGS: AdvancedTraining[] = [
    // --- 投篮类 (Shooting) ---
    {
        id: 'AT_001',
        name: '米勒时刻：跑位接球投篮',
        description: '高强度跑动后接球即投，训练无球跑位能力和体能下降时的投篮稳定性。',
        difficulty: TrainingDifficulty.HARD,
        duration: 45,
        primaryAttribute: '投篮',
        effect: {
            Shooting: 15,
            Agility: 8,
            Focus: 10, // 修正为 Focus，因为Stamina是体能属性，这里更侧重精神属性
            FatigueCost: 40,
            ExpReward: 50,
        },
        unlockRequirement: { minAttribute: 'Shooting', minValue: 75 },
    },
    {
        id: 'AT_002',
        name: '科比式后仰跳投训练',
        description: '在对抗和失衡状态下完成高质量的后仰跳投，重点提升中距离得分能力。',
        difficulty: TrainingDifficulty.ELITE,
        duration: 60,
        primaryAttribute: '投篮',
        effect: {
            Shooting: 25,
            Focus: 12,
            Strength: 5,
            FatigueCost: 60,
            ExpReward: 75,
        },
        unlockRequirement: { minAttribute: 'Shooting', minValue: 85 },
    },
    {
        id: 'AT_003',
        name: '三分线外快速出手练习',
        description: '模拟接球后快速调整姿势并出手三分，训练投篮速度和远距离命中率。',
        difficulty: TrainingDifficulty.ADVANCED,
        duration: 30,
        primaryAttribute: '投篮',
        effect: {
            Shooting: 18,
            Focus: 5,
            FatigueCost: 30,
            ExpReward: 45,
        },
        unlockRequirement: { minAttribute: 'Shooting', minValue: 70 },
    },

    // --- 运控类 (Dribbling) ---
    {
        id: 'AT_004',
        name: '双球交叉变向障碍训练',
        description: '同时运控两个篮球，并在障碍物间进行快速交叉变向，极大地提升手眼协调和运球熟练度。',
        difficulty: TrainingDifficulty.HARD,
        duration: 40,
        primaryAttribute: '运球',
        effect: {
            Dribbling: 18,
            Agility: 10,
            Focus: 8,
            FatigueCost: 45,
            ExpReward: 55,
        },
        unlockRequirement: { minAttribute: 'Dribbling', minValue: 75 },
    },
    {
        id: 'AT_005',
        name: '全场变速变向突破',
        description: '模拟实战中全速推进，急停、变速、变向突破防守，训练控球的实战应用和体能下的稳定性。',
        difficulty: TrainingDifficulty.ADVANCED,
        duration: 50,
        primaryAttribute: '运球',
        effect: {
            Dribbling: 15,
            Agility: 15,
            Strength: 12, // 修正为 Strength，更贴合突破时的身体对抗
            FatigueCost: 55,
            ExpReward: 65,
        },
        unlockRequirement: { minAttribute: 'Dribbling', minValue: 80 },
    },
    {
        id: 'AT_006',
        name: '低位背身单打脚步训练',
        description: '学习和重复复杂的低位脚步动作，如梦幻舞步、转身跳投，提升内线或背身控球能力。',
        difficulty: TrainingDifficulty.HARD,
        duration: 35,
        primaryAttribute: '运球/力量',
        effect: {
            Dribbling: 12,
            Strength: 10,
            Focus: 5,
            FatigueCost: 35,
            ExpReward: 40,
        },
        unlockRequirement: { minAttribute: 'Strength', minValue: 70 },
    },

    // --- 传球类 (Passing) ---
    {
        id: 'AT_007',
        name: '快速出球与视野训练',
        description: '在快速移动中，瞬间判断并完成精准的长距离传球，训练传球时机和球场视野。',
        difficulty: TrainingDifficulty.ADVANCED,
        duration: 40,
        primaryAttribute: '传球',
        effect: {
            Passing: 20,
            Focus: 15,
            Agility: 5,
            FatigueCost: 40,
            ExpReward: 55,
        },
        unlockRequirement: { minAttribute: 'Passing', minValue: 75 },
    },
    {
        id: 'AT_008',
        name: '高难度击地与空接传球',
        description: '练习在狭小空间内完成高难度的击地传球和精准的空接传球，提升传球技巧的多样性。',
        difficulty: TrainingDifficulty.HARD,
        duration: 30,
        primaryAttribute: '传球',
        effect: {
            Passing: 15,
            Focus: 10,
            FatigueCost: 30,
            ExpReward: 45,
        },
        unlockRequirement: { minAttribute: 'Passing', minValue: 70 },
    },
    {
        id: 'AT_009',
        name: '挡拆后决策与传球',
        description: '模拟挡拆战术，训练持球人在面对防守变化时，快速做出传球、投篮或突破的决策。',
        difficulty: TrainingDifficulty.ELITE,
        duration: 55,
        primaryAttribute: '传球/专注',
        effect: {
            Passing: 22,
            Focus: 20,
            FatigueCost: 50,
            ExpReward: 70,
        },
        unlockRequirement: { minAttribute: 'Focus', minValue: 80 },
    },

    // --- 防守类 (Defense) ---
    {
        id: 'AT_010',
        name: '无球防守跑位与抢断',
        description: '训练在无球状态下，预判对手跑位并进行绕前防守或抢断传球，提升防守意识和抢断几率。',
        difficulty: TrainingDifficulty.ADVANCED,
        duration: 45,
        primaryAttribute: '防守',
        effect: {
            Defense: 18,
            Agility: 10,
            Focus: 10,
            FatigueCost: 45,
            ExpReward: 60,
        },
        unlockRequirement: { minAttribute: 'Defense', minValue: 75 },
    },
    {
        id: 'AT_011',
        name: '低位单防与协防轮转',
        description: '针对性训练低位单防技巧，以及在团队防守中的快速协防和轮转站位。',
        difficulty: TrainingDifficulty.HARD,
        duration: 50,
        primaryAttribute: '防守/力量',
        effect: {
            Defense: 15,
            Strength: 15,
            FatigueCost: 50,
            ExpReward: 55,
        },
        unlockRequirement: { minAttribute: 'Strength', minValue: 75 },
    },
    {
        id: 'AT_012',
        name: '盖帽时机与垂直起跳训练',
        description: '专注于提升盖帽的时机判断、起跳高度和垂直弹跳能力，减少犯规。',
        difficulty: TrainingDifficulty.ELITE,
        duration: 35,
        primaryAttribute: '防守/篮板',
        effect: {
            Defense: 20,
            Rebounding: 10,
            Strength: 8,
            FatigueCost: 40,
            ExpReward: 65,
        },
        unlockRequirement: { minAttribute: 'Defense', minValue: 80 },
    },

    // --- 体能与篮板类 (Strength & Rebounding) ---
    {
        id: 'AT_013',
        name: '高强度冲刺与折返跑',
        description: '模拟比赛中的快速攻防转换，进行多次全场冲刺折返跑，极限提升体能和速度耐力。',
        difficulty: TrainingDifficulty.ADVANCED,
        duration: 60,
        primaryAttribute: '体能',
        effect: {
            Strength: 25, // Strength在这里代表体能和耐力
            Agility: 15,
            FatigueCost: 70,
            ExpReward: 80,
        },
        unlockRequirement: { minAttribute: 'Strength', minValue: 70 },
    },
    {
        id: 'AT_014',
        name: '卡位与篮板争抢对抗',
        description: '在强对抗下进行卡位和争抢进攻/防守篮板的训练，提升篮板意识和身体对抗能力。',
        difficulty: TrainingDifficulty.HARD,
        duration: 45,
        primaryAttribute: '篮板/力量',
        effect: {
            Rebounding: 20,
            Strength: 18,
            FatigueCost: 55,
            ExpReward: 60,
        },
        unlockRequirement: { minAttribute: 'Rebounding', minValue: 70 },
    },
    {
        id: 'AT_015',
        name: '核心力量与平衡性训练',
        description: '使用专业器材进行核心力量训练，增强身体平衡性和对抗时的稳定性。',
        difficulty: TrainingDifficulty.NORMAL,
        duration: 30,
        primaryAttribute: '力量',
        effect: {
            Strength: 15,
            Focus: 5,
            FatigueCost: 25,
            ExpReward: 35,
        },
        unlockRequirement: { minAttribute: 'Strength', minValue: 60 },
    },
];

// 3. 辅助函数（可选，用于模拟训练效果计算）
/**
 * 模拟计算实际属性增益的函数（科学的成长曲线）
 * 实际游戏中需要更复杂的逻辑，这里提供一个简化的对数增长模型示例。
 * @param baseGain 基础增益值
 * @param currentAttributeValue 球员当前属性值 (0-100)
 * @param difficultyMultiplier 难度乘数
 * @returns 实际增益值
 */
export function calculateActualGain(
    baseGain: number,
    currentAttributeValue: number,
    difficultyMultiplier: number = 1.0
): number {
    // 采用对数衰减模型：Gain = BaseGain * Multiplier * (1 - log(CurrentValue / 100))
    // 属性值越高，增长越慢。
    const maxAttribute = 100;
    // 调整对数因子，使得在接近100时衰减更明显
    const decayFactor = 1 - Math.log10(1 + (currentAttributeValue / maxAttribute) * 9); 
    const actualGain = baseGain * difficultyMultiplier * decayFactor;

    // 确保增益为正，且不会超过100的上限
    return Math.max(0, Math.min(maxAttribute - currentAttributeValue, actualGain));
}

/**
 * 获取难度对应的乘数
 * @param difficulty 训练难度
 * @returns 难度乘数
 */
export function getDifficultyMultiplier(difficulty: TrainingDifficulty): { gain: number, fatigue: number } {
    switch (difficulty) {
        case TrainingDifficulty.EASY: return { gain: 0.8, fatigue: 0.5 };
        case TrainingDifficulty.NORMAL: return { gain: 1.0, fatigue: 1.0 };
        case TrainingDifficulty.HARD: return { gain: 1.2, fatigue: 1.5 };
        case TrainingDifficulty.ADVANCED: return { gain: 1.5, fatigue: 2.0 };
        case TrainingDifficulty.ELITE: return { gain: 2.0, fatigue: 3.0 };
    }
}

// 示例：如何使用
/*
import { ADVANCED_TRAININGS, TrainingDifficulty, calculateActualGain, getDifficultyMultiplier } from './AdvancedTraining';

const playerCurrentShooting = 85;
const training = ADVANCED_TRAININGS.find(t => t.id === 'AT_002'); // 科比式后仰跳投
if (training && training.effect.Shooting) {
    const multiplier = getDifficultyMultiplier(training.difficulty).gain;
    const actualGain = calculateActualGain(training.effect.Shooting, playerCurrentShooting, multiplier);
    console.log(\`球员当前投篮: \${playerCurrentShooting}\`);
    console.log(\`训练基础增益: \${training.effect.Shooting}\`);
    console.log(\`难度乘数: \${multiplier}\`);
    console.log(\`实际投篮增益: \${actualGain.toFixed(2)}\`);
}
*/