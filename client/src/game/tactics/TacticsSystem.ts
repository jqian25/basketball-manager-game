/**
 * client/src/game/tactics/TacticsSystem.ts
 * 篮球训练系统 - 战术系统模块
 *
 * 模块目标：
 * 1. 定义20种核心篮球战术（进攻/防守）。
 * 2. 实现科学的战术成长曲线（熟练度/等级）。
 * 3. 包含完整的数值设计（效果、消耗、成功率）。
 */

// --- 1. 基础类型定义 ---

/**
 * 战术类型：进攻或防守
 */
export enum ETacticType {
    Offense = "进攻",
    Defense = "防守",
}

/**
 * 战术难度等级
 * 影响训练难度、熟练度增长速度和初始成功率。
 */
export enum ETacticDifficulty {
    Beginner = "初级", // 1.0x 基础系数
    Intermediate = "中级", // 1.5x 基础系数
    Advanced = "高级", // 2.0x 基础系数
    Elite = "精英", // 2.5x 基础系数
}

/**
 * 战术效果影响的属性
 */
export enum EAttributeEffect {
    Shooting = "投篮命中率",
    Passing = "传球成功率",
    Rebounding = "篮板争夺率",
    Defense = "防守效率",
    EnergyCost = "体力消耗",
    Morale = "士气提升",
}

/**
 * 战术数值模型接口
 */
export interface ITacticStats {
    baseSuccessRate: number; // 基础成功率 (0.0 - 1.0)
    baseEnergyCost: number; // 基础体力消耗
    cooldownTurns: number; // 冷却回合数
    difficulty: ETacticDifficulty; // 战术难度
    effect: {
        attribute: EAttributeEffect;
        modifier: number; // 基础效果修正值
    };
}

/**
 * 战术定义接口
 */
export interface ITacticDefinition {
    id: number;
    name: string;
    type: ETacticType;
    description: string;
    stats: ITacticStats;
}

/**
 * 玩家战术状态接口 (代表成长曲线)
 */
export interface IPlayerTacticState {
    tacticId: number;
    level: number; // 战术等级 (0-100)
    masteryXP: number; // 熟练度经验值
    lastUsedTurn: number; // 上次使用回合
}

// --- 2. 数值设计公式 (科学的成长曲线) ---

/**
 * 难度系数映射
 */
const DIFFICULTY_MULTIPLIER: Record<ETacticDifficulty, number> = {
    [ETacticDifficulty.Beginner]: 1.0,
    [ETacticDifficulty.Intermediate]: 1.5,
    [ETacticDifficulty.Advanced]: 2.0,
    [ETacticDifficulty.Elite]: 2.5,
};

/**
 * 经验值到等级的成长曲线 (非线性：等级越高，所需经验越多 - 幂函数)
 * 经验值要求: XP_Required = BaseXP * Level^1.5 * DifficultyMultiplier
 * @param level 当前等级
 * @param difficulty 战术难度
 * @returns 升级到下一级所需的总经验值
 */
function getXPRequiredForNextLevel(level: number, difficulty: ETacticDifficulty): number {
    if (level >= 100) return Infinity;

    const baseXP = 100; // 基础经验
    const diffMult = DIFFICULTY_MULTIPLIER[difficulty];
    // 使用 Level^1.5 来实现非线性增长
    return Math.floor(baseXP * Math.pow(level + 1, 1.5) * diffMult);
}

/**
 * 计算战术的当前成功率 (受等级影响)
 * 成功率: CurrentRate = BaseRate + (1 - BaseRate) * (1 - e^(-Level / 30))
 * 这是一个对数/指数增长曲线，初始增长快，后期增长慢，逼近1.0。
 * @param baseRate 基础成功率
 * @param level 战术等级 (0-100)
 * @returns 实际成功率 (0.0 - 1.0)
 */
function calculateCurrentSuccessRate(baseRate: number, level: number): number {
    // 确保等级在 0 到 100 之间
    const normalizedLevel = Math.min(100, Math.max(0, level));
    // 曲线增长因子: 1 - e^(-x/k)，k值越大，曲线越平缓。这里 k=30
    const growthFactor = 1 - Math.exp(-normalizedLevel / 30);
    // 最终成功率不会超过 1.0
    return baseRate + (1.0 - baseRate) * growthFactor;
}

/**
 * 计算战术的当前效果修正值 (受等级影响)
 * 效果修正: CurrentModifier = BaseModifier * (1 + Level / 100)
 * 这是一个线性增长曲线，效果随等级线性提升。
 * @param baseModifier 基础效果修正值
 * @param level 战术等级 (0-100)
 * @returns 实际效果修正值
 */
function calculateCurrentEffectModifier(baseModifier: number, level: number): number {
    // 确保等级在 0 到 100 之间
    const normalizedLevel = Math.min(100, Math.max(0, level));
    return baseModifier * (1 + normalizedLevel / 100);
}

// --- 3. 20种篮球战术定义 ---

const TACTICS_DATA: ITacticDefinition[] = [
    // 进攻战术 (10 种)
    {
        id: 1, name: "挡拆战术 (Pick-and-Roll)", type: ETacticType.Offense,
        description: "持球人与掩护人配合，创造投篮或突破机会。基础进攻战术。",
        stats: {
            baseSuccessRate: 0.55, baseEnergyCost: 15, cooldownTurns: 2, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Shooting, modifier: 0.15 } // 投篮命中率+15%
        }
    },
    {
        id: 2, name: "三角进攻 (Triangle Offense)", type: ETacticType.Offense,
        description: "通过三名球员在侧翼形成三角站位，强调传导球和阅读防守。",
        stats: {
            baseSuccessRate: 0.40, baseEnergyCost: 25, cooldownTurns: 5, difficulty: ETacticDifficulty.Advanced,
            effect: { attribute: EAttributeEffect.Passing, modifier: 0.20 } // 传球成功率+20%
        }
    },
    {
        id: 3, name: "牛角战术 (Horns)", type: ETacticType.Offense,
        description: "两名大个子位于罚球线两侧肘区，为后卫提供双掩护或传球选择。",
        stats: {
            baseSuccessRate: 0.50, baseEnergyCost: 20, cooldownTurns: 3, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Shooting, modifier: 0.18 }
        }
    },
    {
        id: 4, name: "普林斯顿战术 (Princeton Offense)", type: ETacticType.Offense,
        description: "强调后门切入和低位传球的无球跑动战术。",
        stats: {
            baseSuccessRate: 0.35, baseEnergyCost: 30, cooldownTurns: 6, difficulty: ETacticDifficulty.Elite,
            effect: { attribute: EAttributeEffect.Morale, modifier: 0.30 } // 士气+30%
        }
    },
    {
        id: 5, name: "一星四射 (Isolation with 4 Shooters)", type: ETacticType.Offense,
        description: "拉开空间，让核心球员单打，其他四名球员在外线待命。",
        stats: {
            baseSuccessRate: 0.60, baseEnergyCost: 10, cooldownTurns: 1, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Shooting, modifier: 0.10 }
        }
    },
    {
        id: 6, name: "手递手传球 (Hand-off)", type: ETacticType.Offense,
        description: "球员将球交给跑动中的队友，通常伴随掩护。",
        stats: {
            baseSuccessRate: 0.65, baseEnergyCost: 10, cooldownTurns: 1, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Passing, modifier: 0.15 }
        }
    },
    {
        id: 7, name: "电梯门战术 (Elevator Doors)", type: ETacticType.Offense,
        description: "两名球员并排站立，为射手提供掩护，然后迅速合拢，如同电梯门。",
        stats: {
            baseSuccessRate: 0.45, baseEnergyCost: 25, cooldownTurns: 4, difficulty: ETacticDifficulty.Advanced,
            effect: { attribute: EAttributeEffect.Shooting, modifier: 0.25 }
        }
    },
    {
        id: 8, name: "低位单打 (Post-up)", type: ETacticType.Offense,
        description: "将球传入低位，由内线球员进行一对一进攻。",
        stats: {
            baseSuccessRate: 0.58, baseEnergyCost: 18, cooldownTurns: 2, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Rebounding, modifier: 0.15 } // 进攻篮板率+15%
        }
    },
    {
        id: 9, name: "快攻 (Fast Break)", type: ETacticType.Offense,
        description: "防守篮板后迅速推进，在对手落位前完成进攻。",
        stats: {
            baseSuccessRate: 0.70, baseEnergyCost: 35, cooldownTurns: 3, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Shooting, modifier: 0.15 }
        }
    },
    {
        id: 10, name: "Box Set (四角站位)", type: ETacticType.Offense,
        description: "四名球员站在罚球区四角，通常用于界外球或特殊战术的起始站位。",
        stats: {
            baseSuccessRate: 0.48, baseEnergyCost: 20, cooldownTurns: 4, difficulty: ETacticDifficulty.Advanced,
            effect: { attribute: EAttributeEffect.Passing, modifier: 0.18 }
        }
    },

    // 防守战术 (10 种)
    {
        id: 11, name: "人盯人防守 (Man-to-Man)", type: ETacticType.Defense,
        description: "每名防守球员负责盯防一名特定的进攻球员。",
        stats: {
            baseSuccessRate: 0.60, baseEnergyCost: 10, cooldownTurns: 0, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Defense, modifier: 0.15 } // 防守效率+15%
        }
    },
    {
        id: 12, name: "2-3 区域联防 (2-3 Zone)", type: ETacticType.Defense,
        description: "两名后卫在前场，三名球员在后场，覆盖区域而非球员。",
        stats: {
            baseSuccessRate: 0.55, baseEnergyCost: 15, cooldownTurns: 2, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Rebounding, modifier: 0.20 } // 防守篮板率+20%
        }
    },
    {
        id: 13, name: "全场紧逼 (Full-Court Press)", type: ETacticType.Defense,
        description: "在对手发球后就开始施加压力，消耗对手体力和时间。",
        stats: {
            baseSuccessRate: 0.45, baseEnergyCost: 30, cooldownTurns: 5, difficulty: ETacticDifficulty.Advanced,
            effect: { attribute: EAttributeEffect.EnergyCost, modifier: 0.50 } // 增加对手体力消耗50%
        }
    },
    {
        id: 14, name: "Box-and-One (混合防守)", type: ETacticType.Defense,
        description: "四名球员区域联防，一名球员紧盯对手核心得分手。",
        stats: {
            baseSuccessRate: 0.50, baseEnergyCost: 20, cooldownTurns: 3, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Defense, modifier: 0.25 }
        }
    },
    {
        id: 15, name: "收缩防守 (Pack-Line Defense)", type: ETacticType.Defense,
        description: "防守球员收缩到三秒区附近，阻止内线突破，迫使对手投篮。",
        stats: {
            baseSuccessRate: 0.65, baseEnergyCost: 10, cooldownTurns: 1, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Shooting, modifier: -0.10 } // 降低对手投篮命中率10%
        }
    },
    {
        id: 16, name: "无限换防 (Switch Everything)", type: ETacticType.Defense,
        description: "对所有掩护都进行换防，保持防守压力，但容易造成错位。",
        stats: {
            baseSuccessRate: 0.40, baseEnergyCost: 25, cooldownTurns: 4, difficulty: ETacticDifficulty.Elite,
            effect: { attribute: EAttributeEffect.Defense, modifier: 0.30 }
        }
    },
    {
        id: 17, name: "3-2 区域联防 (3-2 Zone)", type: ETacticType.Defense,
        description: "三名球员在前场，两名球员在后场，更侧重于对外线投篮的限制。",
        stats: {
            baseSuccessRate: 0.53, baseEnergyCost: 18, cooldownTurns: 2, difficulty: ETacticDifficulty.Intermediate,
            effect: { attribute: EAttributeEffect.Shooting, modifier: -0.15 }
        }
    },
    {
        id: 18, name: "陷阱防守 (Trap/Double-Team)", type: ETacticType.Defense,
        description: "对持球人进行双人包夹，迫使对手失误。",
        stats: {
            baseSuccessRate: 0.42, baseEnergyCost: 28, cooldownTurns: 3, difficulty: ETacticDifficulty.Advanced,
            effect: { attribute: EAttributeEffect.Passing, modifier: -0.20 } // 降低对手传球成功率20%
        }
    },
    {
        id: 19, name: "盯防发球人 (Deny the Inbounds)", type: ETacticType.Defense,
        description: "界外球发球时，紧盯所有接球人，阻止轻松发球。",
        stats: {
            baseSuccessRate: 0.68, baseEnergyCost: 12, cooldownTurns: 1, difficulty: ETacticDifficulty.Beginner,
            effect: { attribute: EAttributeEffect.Morale, modifier: -0.10 } // 降低对手士气10%
        }
    },
    {
        id: 20, name: "弹性防守 (Match-up Zone)", type: ETacticType.Defense,
        description: "结合人盯人和区域联防的特点，根据进攻站位进行调整。",
        stats: {
            baseSuccessRate: 0.47, baseEnergyCost: 22, cooldownTurns: 5, difficulty: ETacticDifficulty.Elite,
            effect: { attribute: EAttributeEffect.Defense, modifier: 0.28 }
        }
    },
];

// --- 4. 战术系统核心类 ---

export class TacticsSystem {
    private tacticsMap: Map<number, ITacticDefinition>;
    private playerStates: Map<number, IPlayerTacticState>; // Key: Tactic ID

    constructor() {
        this.tacticsMap = new Map(TACTICS_DATA.map(t => [t.id, t]));
        this.playerStates = new Map();
        // 初始化所有战术的玩家状态为 Level 0
        TACTICS_DATA.forEach(tactic => {
            this.playerStates.set(tactic.id, {
                tacticId: tactic.id,
                level: 0,
                masteryXP: 0,
                lastUsedTurn: -Infinity,
            });
        });
    }

    /**
     * 获取所有战术定义
     */
    public getAllTactics(): ITacticDefinition[] {
        return TACTICS_DATA;
    }

    /**
     * 获取指定战术的玩家状态
     * @param tacticId 战术ID
     */
    public getPlayerTacticState(tacticId: number): IPlayerTacticState | undefined {
        return this.playerStates.get(tacticId);
    }

    /**
     * 获取战术的完整数值模型（包含等级修正）
     * @param tacticId 战术ID
     * @returns 包含修正后的成功率和效果的数值对象
     */
    public getTacticModel(tacticId: number): {
        definition: ITacticDefinition;
        currentSuccessRate: number;
        currentEffectModifier: number;
        requiredXP: number;
    } | undefined {
        const definition = this.tacticsMap.get(tacticId);
        const state = this.playerStates.get(tacticId);

        if (!definition || !state) {
            return undefined;
        }

        const currentSuccessRate = calculateCurrentSuccessRate(
            definition.stats.baseSuccessRate,
            state.level
        );

        const currentEffectModifier = calculateCurrentEffectModifier(
            definition.stats.effect.modifier,
            state.level
        );

        const requiredXP = getXPRequiredForNextLevel(
            state.level,
            definition.stats.difficulty
        );

        return {
            definition,
            currentSuccessRate,
            currentEffectModifier,
            requiredXP,
        };
    }

    /**
     * 模拟训练/使用战术，增加熟练度 (核心成长逻辑)
     * @param tacticId 战术ID
     * @param xpGained 本次回合获得的熟练度
     * @returns 是否升级
     */
    public trainTactic(tacticId: number, xpGained: number): { leveledUp: boolean, newLevel: number, xpToNextLevel: number } {
        const state = this.playerStates.get(tacticId);
        const definition = this.tacticsMap.get(tacticId);
        let leveledUp = false;

        if (!state || !definition) {
            throw new Error(`Tactic with ID ${tacticId} not found.`);
        }

        state.masteryXP += xpGained;

        // 检查升级
        let xpRequired = getXPRequiredForNextLevel(state.level, definition.stats.difficulty);
        while (state.level < 100 && state.masteryXP >= xpRequired) {
            state.masteryXP -= xpRequired;
            state.level += 1;
            leveledUp = true;
            xpRequired = getXPRequiredForNextLevel(state.level, definition.stats.difficulty);
        }

        // 如果达到满级，剩余经验清零
        if (state.level === 100) {
            state.masteryXP = 0;
            xpRequired = Infinity;
        }

        return { leveledUp, newLevel: state.level, xpToNextLevel: xpRequired - state.masteryXP };
    }

    /**
     * 模拟在比赛中使用战术
     * @param tacticId 战术ID
     * @param currentTurn 当前比赛回合数
     * @returns 战术是否成功执行
     */
    public executeTactic(tacticId: number, currentTurn: number): boolean {
        const state = this.playerStates.get(tacticId);
        const model = this.getTacticModel(tacticId);

        if (!state || !model) {
            throw new Error(`Tactic with ID ${tacticId} not found.`);
        }

        // 检查冷却时间
        if (currentTurn - state.lastUsedTurn < model.definition.stats.cooldownTurns) {
            // 战术处于冷却中
            return false;
        }

        // 模拟成功率判定
        const successRoll = Math.random();
        const isSuccess = successRoll < model.currentSuccessRate;

        // 更新状态
        state.lastUsedTurn = currentTurn;

        // 成功或失败都会获得少量经验
        const baseXP = isSuccess ? 10 : 5;
        this.trainTactic(tacticId, baseXP);

        return isSuccess;
    }
}

// 示例用法 (可选，用于测试和说明)
/*
const tacticsSystem = new TacticsSystem();
const pickAndRollId = 1;

// 初始状态
console.log("初始状态 (挡拆):", tacticsSystem.getPlayerTacticState(pickAndRollId));
console.log("初始模型 (挡拆):", tacticsSystem.getTacticModel(pickAndRollId));

// 模拟训练 10 次
for (let i = 0; i < 10; i++) {
    const result = tacticsSystem.trainTactic(pickAndRollId, 50);
    if (result.leveledUp) {
        console.log(`挡拆战术升级到 Level ${result.newLevel}!`);
    }
}

// 训练后状态
const postTrainState = tacticsSystem.getPlayerTacticState(pickAndRollId);
const postTrainModel = tacticsSystem.getTacticModel(pickAndRollId);
console.log("\n训练后状态 (挡拆):", postTrainState);
console.log("训练后模型 (挡拆):", postTrainModel);

// 模拟使用战术
console.log("\n模拟使用战术 (回合 1):", tacticsSystem.executeTactic(pickAndRollId, 1));
console.log("模拟使用战术 (回合 2 - 冷却中):", tacticsSystem.executeTactic(pickAndRollId, 2));
console.log("模拟使用战术 (回合 3 - 冷却结束):", tacticsSystem.executeTactic(pickAndRollId, 3));
*/
