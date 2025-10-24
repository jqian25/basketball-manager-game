// client/src/game/stamina/StaminaSystem.ts

/**
 * 训练类型枚举
 * 定义不同训练活动的强度和恢复影响
 */
export enum TrainingType {
    // 低强度，主要消耗基础体力，恢复速度快
    LIGHT_DRILL = "LIGHT_DRILL", // 轻度运球/投篮练习
    // 中等强度，消耗体力适中，恢复速度正常
    MODERATE_DRILL = "MODERATE_DRILL", // 中等强度技战术演练
    // 高强度，大量消耗体力，产生高疲劳值，需要较长恢复时间
    HIGH_INTENSITY_DRILL = "HIGH_INTENSITY_DRILL", // 全场冲刺/对抗训练
    // 比赛，最高强度，消耗大量体力，产生最大疲劳值
    GAME = "GAME", // 正式比赛
    // 恢复活动，消耗体力极少，但能加速疲劳恢复
    RECOVERY_ACTIVITY = "RECOVERY_ACTIVITY", // 瑜伽/拉伸/冰浴
}

/**
 * 训练负荷参数接口
 * 定义每种训练对体力 (Stamina) 和疲劳 (Fatigue) 的影响
 */
export interface TrainingLoad {
    staminaCost: number; // 体力消耗百分比 (0.0 to 1.0)
    fatigueGain: number; // 疲劳值增加量 (绝对值)
    growthFactor: number; // 训练对成长的贡献系数
}

/**
 * 球员属性接口
 * 简化版，只包含与体力系统相关的核心属性
 */
export interface PlayerStats {
    level: number; // 球员等级
    baseStamina: number; // 基础最大体力值 (影响MaxStamina)
    staminaRecoveryRate: number; // 基础体力恢复速率 (影响StaminaRecoveryPerTick)
    fatigueResistance: number; // 疲劳抵抗力 (影响FatigueDecayRate)
    potential: number; // 潜力值 (影响成长曲线)
}

/**
 * 体力系统状态接口
 */
export interface StaminaState {
    currentStamina: number; // 当前体力值 (0 to MaxStamina)
    maxStamina: number; // 最大体力值
    currentFatigue: number; // 当前疲劳值 (0 to MaxFatigue)
    maxFatigue: number; // 最大疲劳值 (通常为固定值，如100)
    supercompensationProgress: number; // 超量恢复进度 (0.0 to 1.0)，影响成长
}

/**
 * 篮球训练体力管理系统
 * 核心逻辑：体力消耗与恢复，疲劳积累与消退，以及超量恢复机制下的成长。
 * 
 * 真实篮球训练方法体现：
 * 1. 区分不同强度的训练类型 (LIGHT, MODERATE, HIGH, GAME, RECOVERY)。
 * 2. 训练负荷 (TrainingLoad) 影响体力消耗 (staminaCost) 和疲劳积累 (fatigueGain)。
 * 3. 疲劳会降低最大体力值 (calculateMaxStamina)，模拟竞技状态下降。
 * 
 * 科学的成长曲线体现：
 * 1. 采用“超量恢复”模型 (Supercompensation)，训练积累疲劳，恢复后能力提升。
 * 2. 潜力值 (potential) 影响成长速度。
 * 3. 只有在疲劳充分消退后 (currentFatigue < threshold) 才能触发成长。
 * 
 * 完整的数值设计体现：
 * 1. 明确的常量配置 (LOAD_CONFIG, BASE_RECOVERY_PER_TICK, MAX_FATIGUE_CAP)。
 * 2. 属性 (PlayerStats) 影响恢复速率 (staminaRecoveryRate) 和疲劳消退速度 (fatigueResistance)。
 */
export class StaminaSystem {
    private state: StaminaState;
    private playerStats: PlayerStats;

    // 训练负荷配置 (可根据实际游戏平衡进行调整)
    private static readonly LOAD_CONFIG: Record<TrainingType, TrainingLoad> = {
        [TrainingType.LIGHT_DRILL]: { staminaCost: 0.05, fatigueGain: 5, growthFactor: 0.1 },
        [TrainingType.MODERATE_DRILL]: { staminaCost: 0.15, fatigueGain: 15, growthFactor: 0.3 },
        [TrainingType.HIGH_INTENSITY_DRILL]: { staminaCost: 0.30, fatigueGain: 35, growthFactor: 0.6 },
        [TrainingType.GAME]: { staminaCost: 0.50, fatigueGain: 60, growthFactor: 1.0 },
        [TrainingType.RECOVERY_ACTIVITY]: { staminaCost: 0.01, fatigueGain: -10, growthFactor: 0.0 }, // 负值表示减少疲劳
    };

    // 游戏时间单位 (Tick) 的恢复速率配置
    private static readonly BASE_RECOVERY_PER_TICK = 5; // 基础体力恢复点数/Tick
    private static readonly BASE_FATIGUE_DECAY = 2; // 基础疲劳消退点数/Tick
    private static readonly MAX_FATIGUE_CAP = 100; // 疲劳值上限

    constructor(initialStats: PlayerStats) {
        this.playerStats = initialStats;
        this.state = {
            currentStamina: initialStats.baseStamina,
            maxStamina: initialStats.baseStamina,
            currentFatigue: 0,
            maxFatigue: StaminaSystem.MAX_FATIGUE_CAP,
            supercompensationProgress: 0,
        };
    }

    /**
     * 计算当前的最大体力值 (MaxStamina)
     * 最大体力 = 基础体力 * (1 - 疲劳值 / 最大疲劳值 * 疲劳影响系数)
     * 高疲劳会显著降低最大体力，模拟竞技状态下降。
     */
    private calculateMaxStamina(): number {
        const fatiguePenalty = this.state.currentFatigue / this.state.maxFatigue;
        // 疲劳影响系数，例如 0.5 表示在满疲劳时最大体力下降 50%
        const fatigueEffectFactor = 0.5; 
        return this.playerStats.baseStamina * (1 - fatiguePenalty * fatigueEffectFactor);
    }

    /**
     * 执行训练活动，消耗体力和积累疲劳
     * @param type 训练类型
     * @returns 是否成功执行训练
     */
    public train(type: TrainingType): boolean {
        const load = StaminaSystem.LOAD_CONFIG[type];
        const cost = this.state.maxStamina * load.staminaCost;

        if (this.state.currentStamina < cost) {
            // console.log(`体力不足，无法进行 ${type} 训练。`);
            return false;
        }

        // 1. 体力消耗
        this.state.currentStamina -= cost;
        this.state.currentStamina = Math.max(0, this.state.currentStamina);

        // 2. 疲劳积累/消退
        let fatigueChange = load.fatigueGain;
        if (type !== TrainingType.RECOVERY_ACTIVITY) {
            // 疲劳积累受疲劳抵抗力影响，抵抗力越高，积累越少
            fatigueChange *= (1 - this.playerStats.fatigueResistance / 100); 
        }
        
        this.state.currentFatigue += fatigueChange;
        this.state.currentFatigue = Math.min(this.state.maxFatigue, Math.max(0, this.state.currentFatigue));

        // 3. 超量恢复进度积累 (只有非恢复性训练才积累)
        if (type !== TrainingType.RECOVERY_ACTIVITY) {
            // 疲劳值越高，积累的超量恢复潜力越大
            const potentialGain = load.growthFactor * (this.state.currentFatigue / this.state.maxFatigue);
            this.state.supercompensationProgress = Math.min(1.0, this.state.supercompensationProgress + potentialGain);
        }

        this.updateMaxStamina();
        return true;
    }

    /**
     * 游戏时间推进一个 Tick，进行体力恢复和疲劳消退
     */
    public tick(): void {
        // 1. 体力恢复
        const recoveryRate = StaminaSystem.BASE_RECOVERY_PER_TICK * (1 + this.playerStats.staminaRecoveryRate / 100);
        this.state.currentStamina += recoveryRate;
        this.state.currentStamina = Math.min(this.state.maxStamina, this.state.currentStamina);

        // 2. 疲劳消退 (超量恢复的核心机制)
        const decayRate = StaminaSystem.BASE_FATIGUE_DECAY * (1 + this.playerStats.fatigueResistance / 100);
        this.state.currentFatigue -= decayRate;
        this.state.currentFatigue = Math.max(0, this.state.currentFatigue);

        // 3. 超量恢复触发和成长
        this.handleSupercompensation();

        // 4. 更新最大体力 (受疲劳影响)
        this.updateMaxStamina();
    }

    /**
     * 处理超量恢复机制，当疲劳消退到一定程度时，触发能力成长
     * 模拟：训练 -> 疲劳 -> 恢复 -> 超量恢复 (能力提升)
     */
    private handleSupercompensation(): void {
        // 只有当疲劳值低于某个阈值 (例如 20%) 且有积累的超量恢复进度时才可能触发
        const threshold = this.state.maxFatigue * 0.2;
        
        if (this.state.currentFatigue < threshold && this.state.supercompensationProgress > 0.01) {
            
            // 疲劳越低，恢复越充分，成长效果越好
            const recoveryRatio = 1 - (this.state.currentFatigue / threshold); 
            
            // 基础成长值 = 潜力 * 超量恢复进度 * 恢复比例
            const baseGrowth = this.playerStats.potential * this.state.supercompensationProgress * recoveryRatio * 0.01;
            
            // 假设成长主要提升基础体力
            this.playerStats.baseStamina += baseGrowth;
            
            // 清除超量恢复进度，等待下一次训练
            this.state.supercompensationProgress = 0;
            
            // console.log(`[成长] 触发超量恢复! 基础体力提升 ${baseGrowth.toFixed(2)}。`);
        } else if (this.state.currentFatigue >= threshold) {
            // 如果疲劳值过高，超量恢复进度会缓慢衰减 (模拟训练过度)
            this.state.supercompensationProgress = Math.max(0, this.state.supercompensationProgress - 0.001);
        }
    }

    /**
     * 更新最大体力值并确保当前体力不超过最大值
     */
    private updateMaxStamina(): void {
        this.state.maxStamina = this.calculateMaxStamina();
        this.state.currentStamina = Math.min(this.state.currentStamina, this.state.maxStamina);
    }
    
    /**
     * 获取当前体力系统状态
     */
    public getState(): StaminaState {
        return this.state;
    }

    /**
     * 获取当前球员属性
     */
    public getPlayerStats(): PlayerStats {
        return this.playerStats;
    }
}

// --- 示例用法 (已注释掉，避免在生产环境中执行) ---

/*
// 假设一个初始球员
const initialPlayer: PlayerStats = {
    level: 1,
    baseStamina: 500,
    staminaRecoveryRate: 10, // 恢复速度快 10%
    fatigueResistance: 20, // 疲劳抵抗力 20%
    potential: 0.8, // 潜力值 0.8
};

const staminaSystem = new StaminaSystem(initialPlayer);

console.log("--- 初始状态 ---");
console.log(staminaSystem.getState());

// 1. 进行高强度训练
console.log("\n--- 进行高强度训练 (HIGH_INTENSITY_DRILL) ---");
staminaSystem.train(TrainingType.HIGH_INTENSITY_DRILL);
console.log(staminaSystem.getState());

// 2. 模拟时间流逝 (Tick) 和恢复
console.log("\n--- 模拟 20 个 Tick 的恢复 ---");
for (let i = 0; i < 20; i++) {
    staminaSystem.tick();
}
console.log(staminaSystem.getState());

// 3. 进行比赛
console.log("\n--- 进行比赛 (GAME) ---");
staminaSystem.train(TrainingType.GAME);
console.log(staminaSystem.getState());

// 4. 模拟长时间恢复和超量恢复
console.log("\n--- 模拟 100 个 Tick 的恢复 (触发超量恢复) ---");
for (let i = 0; i < 100; i++) {
    staminaSystem.tick();
}
console.log(staminaSystem.getState());
console.log("--- 球员属性变化 ---");
console.log(staminaSystem.getPlayerStats());
*/