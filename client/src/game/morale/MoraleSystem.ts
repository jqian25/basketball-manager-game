// client/src/game/morale/MoraleSystem.ts

/**
 * 篮球训练系统中的士气状态枚举
 * 士气是影响球员训练效果、比赛表现和伤病风险的重要因素。
 */
export enum MoraleState {
    /** 极低士气：可能导致训练完全无效，比赛表现极差，高伤病风险。 */
    Dreadful = 'Dreadful',
    /** 低士气：训练效果显著降低，比赛表现受影响，伤病风险增加。 */
    Poor = 'Poor',
    /** 中等士气：基准状态，无额外加成或惩罚。 */
    Neutral = 'Neutral',
    /** 高士气：训练效果提升，比赛表现略微增强，伤病风险降低。 */
    Good = 'Good',
    /** 极高士气：训练效果显著提升，比赛表现大幅增强，伤病风险极低。 */
    Excellent = 'Excellent',
}

/**
 * 士气影响因子接口
 * 定义不同士气状态对游戏数值的影响。
 */
export interface MoraleEffect {
    /** 训练效果修正（百分比，1.0为基准） */
    trainingEfficiencyMultiplier: number;
    /** 比赛表现修正（百分比，1.0为基准） */
    performanceMultiplier: number;
    /** 伤病风险修正（百分比，1.0为基准） */
    injuryRiskMultiplier: number;
}

/**
 * 影响士气变化的事件类型
 */
export enum MoraleEvent {
    /** 胜利：大幅提升士气 */
    Win = 'Win',
    /** 失败：大幅降低士气 */
    Loss = 'Loss',
    /** 球员表现出色（如得分新高）：中幅提升士气 */
    GreatPerformance = 'GreatPerformance',
    /** 球员表现不佳（如多次失误）：中幅降低士气 */
    PoorPerformance = 'PoorPerformance',
    /** 成功完成训练目标：小幅提升士气 */
    TrainingSuccess = 'TrainingSuccess',
    /** 训练受伤或过度疲劳：小幅降低士气 */
    TrainingFailure = 'TrainingFailure',
    /** 休息日或团队活动：小幅提升士气 */
    RestDay = 'RestDay',
    /** 长期未上场或替补：持续小幅降低士气 */
    BenchWarm = 'BenchWarm',
}

/**
 * 球员士气数据结构
 */
export interface PlayerMorale {
    /** 当前士气值 (0-100) */
    value: number;
    /** 当前士气状态 */
    state: MoraleState;
    /** 最近一次士气更新的时间戳或游戏日 */
    lastUpdatedDay: number;
}

/**
 * 士气系统核心类
 * 负责管理士气值的计算、状态转换和效果应用。
 */
export class MoraleSystem {

    // 士气状态与数值区间的映射 (0-100)
    private static readonly MORALE_THRESHOLDS: { state: MoraleState, min: number, max: number }[] = [
        { state: MoraleState.Dreadful, min: 0, max: 20 },
        { state: MoraleState.Poor, min: 21, max: 40 },
        { state: MoraleState.Neutral, min: 41, max: 60 },
        { state: MoraleState.Good, min: 61, max: 80 },
        { state: MoraleState.Excellent, min: 81, max: 100 },
    ];

    // 不同士气状态下的影响因子
    private static readonly MORALE_EFFECTS: Record<MoraleState, MoraleEffect> = {
        [MoraleState.Dreadful]: { trainingEfficiencyMultiplier: 0.5, performanceMultiplier: 0.7, injuryRiskMultiplier: 1.5 },
        [MoraleState.Poor]: { trainingEfficiencyMultiplier: 0.8, performanceMultiplier: 0.9, injuryRiskMultiplier: 1.2 },
        [MoraleState.Neutral]: { trainingEfficiencyMultiplier: 1.0, performanceMultiplier: 1.0, injuryRiskMultiplier: 1.0 },
        [MoraleState.Good]: { trainingEfficiencyMultiplier: 1.1, performanceMultiplier: 1.1, injuryRiskMultiplier: 0.9 },
        [MoraleState.Excellent]: { trainingEfficiencyMultiplier: 1.3, performanceMultiplier: 1.2, injuryRiskMultiplier: 0.8 },
    };

    // 不同事件对士气值的影响量
    private static readonly MORALE_EVENT_IMPACT: Record<MoraleEvent, number> = {
        [MoraleEvent.Win]: 15,
        [MoraleEvent.Loss]: -15,
        [MoraleEvent.GreatPerformance]: 10,
        [MoraleEvent.PoorPerformance]: -10,
        [MoraleEvent.TrainingSuccess]: 5,
        [MoraleEvent.TrainingFailure]: -8,
        [MoraleEvent.RestDay]: 3,
        [MoraleEvent.BenchWarm]: -2, // 持续性影响
    };

    /**
     * 根据当前士气值计算士气状态。
     * @param value 当前士气值 (0-100)。
     * @returns 对应的士气状态。
     */
    private static calculateMoraleState(value: number): MoraleState {
        const clampedValue = Math.max(0, Math.min(100, value));
        for (const threshold of MoraleSystem.MORALE_THRESHOLDS) {
            if (clampedValue >= threshold.min && clampedValue <= threshold.max) {
                return threshold.state;
            }
        }
        // 理论上不会发生，作为安全回退
        return MoraleState.Neutral;
    }

    /**
     * 更新球员的士气值和状态。
     * @param currentMorale 球员当前的士气数据。
     * @param event 触发士气变化的事件。
     * @param currentDay 当前游戏日，用于更新 lastUpdatedDay。
     * @returns 更新后的球员士气数据。
     */
    public static updateMorale(currentMorale: PlayerMorale, event: MoraleEvent, currentDay: number): PlayerMorale {
        const impact = MoraleSystem.MORALE_EVENT_IMPACT[event];
        let newValue = currentMorale.value + impact;

        // 确保士气值在 0 到 100 之间
        newValue = Math.max(0, Math.min(100, newValue));

        const newState = MoraleSystem.calculateMoraleState(newValue);

        return {
            value: newValue,
            state: newState,
            lastUpdatedDay: currentDay,
        };
    }

    /**
     * 获取当前士气状态对游戏数值的影响因子。
     * @param state 球员当前的士气状态。
     * @returns 对应的士气影响因子。
     */
    public static getMoraleEffects(state: MoraleState): MoraleEffect {
        return MoraleSystem.MORALE_EFFECTS[state];
    }

    /**
     * 初始化一个新球员的士气数据。
     * @param initialValue 初始士气值 (默认为 50)。
     * @param currentDay 当前游戏日。
     * @returns 初始化的球员士气数据。
     */
    public static initializeMorale(initialValue: number = 50, currentDay: number = 0): PlayerMorale {
        const state = MoraleSystem.calculateMoraleState(initialValue);
        return {
            value: initialValue,
            state: state,
            lastUpdatedDay: currentDay,
        };
    }
}