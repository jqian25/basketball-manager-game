/**
 * client/src/game/talents/TalentSystem.ts
 * 
 * 篮球训练系统 - 天赋系统
 * 包含30种天赋的定义、效果和成长逻辑。
 * 
 * 设计原则：
 * 1. 真实篮球训练方法：天赋分类和效果模拟真实训练成果。
 * 2. 科学的成长曲线：天赋升级需要消耗资源（如训练点、经验），且高等级升级所需资源更多。
 * 3. 完整的数值设计：清晰定义天赋对属性的加成类型（基础值/百分比）和数值。
 */

// 1. 属性枚举 (简化版，仅包含天赋可能影响的关键属性)
export enum PlayerAttribute {
    // 身体素质
    Speed = "Speed", // 速度
    Acceleration = "Acceleration", // 加速度/爆发力
    Strength = "Strength", // 力量/对抗
    VerticalLeap = "VerticalLeap", // 垂直弹跳
    Stamina = "Stamina", // 体力/耐力
    Agility = "Agility", // 敏捷/柔韧

    // 进攻技巧
    ThreePointShot = "ThreePointShot", // 三分投篮
    MidRangeShot = "MidRangeShot", // 中距离投篮
    Layup = "Layup", // 上篮/篮下终结
    PostScoring = "PostScoring", // 背身得分
    BallHandling = "BallHandling", // 控球
    Passing = "Passing", // 传球
    FreeThrow = "FreeThrow", // 罚球

    // 防守技巧
    PerimeterDefense = "PerimeterDefense", // 外线防守
    InteriorDefense = "InteriorDefense", // 内线防守
    Steal = "Steal", // 抢断
    Block = "Block", // 盖帽
    Rebound = "Rebound", // 篮板/卡位
    DefensiveIQ = "DefensiveIQ", // 防守意识

    // 精神属性
    Clutch = "Clutch", // 关键球能力
    Leadership = "Leadership", // 领导力
    InjuryResistance = "InjuryResistance", // 伤病抵抗
    RecoveryRate = "RecoveryRate", // 恢复速度
    TrainingEfficiency = "TrainingEfficiency", // 训练效率
    PotentialCeiling = "PotentialCeiling", // 潜力上限
}

// 2. 天赋分类
export enum TalentCategory {
    Physical = "Physical", // 身体素质类
    OffensiveSkill = "OffensiveSkill", // 进攻技巧类
    DefensiveSkill = "DefensiveSkill", // 防守技巧类
    GameIQ = "GameIQ", // 比赛意识类
    SpecialRare = "SpecialRare", // 特殊/稀有类
}

// 3. 天赋效果类型
export enum TalentEffectType {
    FlatBoost = "FlatBoost", // 基础数值加成 (e.g., +5 Speed)
    PercentageBoost = "PercentageBoost", // 百分比加成 (e.g., +10% ThreePointShot Success Rate)
    MechanismChange = "MechanismChange", // 机制修改 (e.g., Unlock new move, Reduce fatigue cost)
    EfficiencyBoost = "EfficiencyBoost", // 效率加成 (e.g., +20% Training XP)
}

// 4. 天赋效果定义
export interface ITalentEffect {
    type: TalentEffectType;
    attribute?: PlayerAttribute; // 影响的属性
    value: number; // 基础数值（FlatBoost）或百分比（PercentageBoost/EfficiencyBoost）
    description: string; // 效果的具体描述（用于MechanismChange）
}

// 5. 天赋静态定义接口 (30种天赋的蓝图)
export interface ITalentDefinition {
    id: string; // 唯一ID (e.g., "P01")
    name: string; // 名称
    category: TalentCategory; // 分类
    description: string; // 详细描述
    maxLevel: number; // 最大等级
    baseEffects: ITalentEffect[]; // 基础效果 (Level 1时的效果)
    // 升级所需的资源类型和数量，此处简化为通用的“训练点”
    // levelUpCostMultiplier: number; // 升级消耗的乘数 (体现成长曲线的非线性)
}

// 6. 玩家拥有的天赋实例
export interface ITalentInstance {
    talentId: string;
    currentLevel: number;
    // progress: number; // 升级进度（可以用于更细致的成长曲线设计）
}

// 7. 30种天赋的具体定义
export const TALENT_DEFINITIONS: ITalentDefinition[] = [
    // --- 身体素质类 (Physical Talents) --- (6种)
    {
        id: "P01", name: "爆发引擎", category: TalentCategory.Physical, maxLevel: 5,
        description: "显著提升启动速度和第一步爆发力，使球员更容易摆脱防守。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Speed, value: 3, description: "基础速度+3" },
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Acceleration, value: 5, description: "加速度+5" },
        ]
    },
    {
        id: "P02", name: "钢铁核心", category: TalentCategory.Physical, maxLevel: 5,
        description: "增强核心力量和对抗能力，减少被撞倒概率，提升攻防稳定性。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Strength, value: 4, description: "力量+4" },
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.Strength, value: 5, description: "对抗成功率+5%" },
        ]
    },
    {
        id: "P03", name: "空中漫步", category: TalentCategory.Physical, maxLevel: 5,
        description: "提升垂直弹跳高度和滞空时间，增强篮下攻防能力。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.VerticalLeap, value: 5, description: "垂直弹跳+5" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "解锁更高级的扣篮和空中动作" },
        ]
    },
    {
        id: "P04", name: "耐力怪兽", category: TalentCategory.Physical, maxLevel: 5,
        description: "极大地减缓体力消耗速度，提升持久作战能力。",
        baseEffects: [
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.Stamina, value: 10, description: "体力消耗降低10%" },
        ]
    },
    {
        id: "P05", name: "柔韧大师", category: TalentCategory.Physical, maxLevel: 3,
        description: "提升关节和肌肉柔韧性，降低受伤风险，略微提升敏捷性。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Agility, value: 3, description: "敏捷+3" },
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.InjuryResistance, value: 15, description: "受伤概率降低15%" },
        ]
    },
    {
        id: "P06", name: "快速恢复", category: TalentCategory.Physical, maxLevel: 5,
        description: "显著加快比赛中体力的恢复速度和赛后伤病的恢复速度。",
        baseEffects: [
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.RecoveryRate, value: 20, description: "体力恢复速度+20%" },
        ]
    },
    
    // --- 进攻技巧类 (Offensive Skill Talents) --- (6种)
    {
        id: "O07", name: "神射手", category: TalentCategory.OffensiveSkill, maxLevel: 5,
        description: "提升所有投篮命中率，尤其是在空位和接球投篮时。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.ThreePointShot, value: 3, description: "三分投篮+3" },
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.MidRangeShot, value: 3, description: "中距离投篮+3" },
            { type: TalentEffectType.PercentageBoost, value: 5, description: "空位投篮命中率+5%" },
        ]
    },
    {
        id: "O08", name: "控球魔术师", category: TalentCategory.OffensiveSkill, maxLevel: 5,
        description: "提升运球时的控制力，降低失误率，解锁高级运球动作。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.BallHandling, value: 5, description: "控球+5" },
            { type: TalentEffectType.PercentageBoost, value: -10, description: "运球失误率降低10%" },
        ]
    },
    {
        id: "O09", name: "篮下终结者", category: TalentCategory.OffensiveSkill, maxLevel: 5,
        description: "提升篮下对抗后的命中率，解锁高难度上篮/抛投。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Layup, value: 5, description: "上篮/篮下终结+5" },
            { type: TalentEffectType.PercentageBoost, value: 8, description: "对抗上篮命中率+8%" },
        ]
    },
    {
        id: "O10", name: "急停跳投", category: TalentCategory.OffensiveSkill, maxLevel: 3,
        description: "提升急停跳投的命中率和出手速度。",
        baseEffects: [
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.MidRangeShot, value: 10, description: "急停跳投命中率+10%" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "出手速度略微加快" },
        ]
    },
    {
        id: "O11", name: "背身专家", category: TalentCategory.OffensiveSkill, maxLevel: 5,
        description: "提升背身单打的效率和成功率，解锁背身技巧。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.PostScoring, value: 5, description: "背身得分+5" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "解锁背身翻身跳投、梦幻脚步等动作" },
        ]
    },
    {
        id: "O12", name: "传球视野", category: TalentCategory.OffensiveSkill, maxLevel: 5,
        description: "提升传球精度和传出威胁球的概率，降低传球失误。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Passing, value: 5, description: "传球+5" },
            { type: TalentEffectType.PercentageBoost, value: 10, description: "传出助攻球的成功率+10%" },
        ]
    },
    
    // --- 防守技巧类 (Defensive Skill Talents) --- (6种)
    {
        id: "D13", name: "抢断大师", category: TalentCategory.DefensiveSkill, maxLevel: 5,
        description: "提升抢断成功率，降低抢断犯规概率。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Steal, value: 5, description: "抢断+5" },
            { type: TalentEffectType.PercentageBoost, value: -15, description: "抢断犯规概率降低15%" },
        ]
    },
    {
        id: "D14", name: "盖帽专家", category: TalentCategory.DefensiveSkill, maxLevel: 5,
        description: "提升盖帽范围和时机判断，减少假动作影响。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Block, value: 5, description: "盖帽+5" },
            { type: TalentEffectType.PercentageBoost, value: 10, description: "盖帽成功率+10%" },
        ]
    },
    {
        id: "D15", name: "防守威慑", category: TalentCategory.DefensiveSkill, maxLevel: 5,
        description: "在近距离防守时，降低对手的投篮命中率和控球成功率。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.PerimeterDefense, value: 3, description: "外线防守+3" },
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.InteriorDefense, value: 3, description: "内线防守+3" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "降低被防守者投篮命中率3%" },
        ]
    },
    {
        id: "D16", name: "卡位巨匠", category: TalentCategory.DefensiveSkill, maxLevel: 5,
        description: "提升篮板卡位成功率，确保抢占有利位置。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Rebound, value: 5, description: "篮板+5" },
            { type: TalentEffectType.PercentageBoost, value: 15, description: "卡位成功率+15%" },
        ]
    },
    {
        id: "D17", name: "脚步灵活", category: TalentCategory.DefensiveSkill, maxLevel: 5,
        description: "提升横向移动速度和防守脚步的稳定性，不易被晃过。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Agility, value: 5, description: "敏捷+5" },
            { type: TalentEffectType.PercentageBoost, value: -10, description: "被晃倒或失位概率降低10%" },
        ]
    },
    {
        id: "D18", name: "战术执行者", category: TalentCategory.DefensiveSkill, maxLevel: 3,
        description: "提升对防守战术的理解和执行力，减少防守漏人。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.DefensiveIQ, value: 5, description: "防守意识+5" },
            { type: TalentEffectType.PercentageBoost, value: -10, description: "防守漏人概率降低10%" },
        ]
    },

    // --- 比赛意识类 (Game IQ Talents) --- (6种)
    {
        id: "I19", name: "冷静杀手", category: TalentCategory.GameIQ, maxLevel: 3,
        description: "在比赛关键时刻（如第四节或加时赛）属性获得加成，不易受压力影响。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Clutch, value: 10, description: "关键球能力+10" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "关键时刻（最后2分钟）所有进攻属性+5" },
        ]
    },
    {
        id: "I20", name: "球场指挥官", category: TalentCategory.GameIQ, maxLevel: 3,
        description: "作为场上核心时，提升队友的传球和跑位效率。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Leadership, value: 10, description: "领导力+10" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "作为控球后卫时，队友传球和跑位效率+5%" },
        ]
    },
    {
        id: "I21", name: "无球跑位", category: TalentCategory.GameIQ, maxLevel: 5,
        description: "提升无球状态下的跑位效率和接球成功率，更容易获得空位机会。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Agility, value: 3, description: "敏捷+3" },
            { type: TalentEffectType.PercentageBoost, value: 15, description: "无球跑位获得空位机会概率+15%" },
        ]
    },
    {
        id: "I22", name: "犯规制造机", category: TalentCategory.GameIQ, maxLevel: 3,
        description: "提升在进攻端制造对手犯规的能力，增加罚球机会。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.FreeThrow, value: 5, description: "罚球+5" },
            { type: TalentEffectType.PercentageBoost, value: 10, description: "进攻造犯规概率+10%" },
        ]
    },
    {
        id: "I23", name: "阅读防守", category: TalentCategory.GameIQ, maxLevel: 5,
        description: "提升对对手防守阵型的识别能力，更容易找到进攻突破口。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.DefensiveIQ, value: 5, description: "防守意识+5 (用于阅读)" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "进攻决策成功率+5%" },
        ]
    },
    {
        id: "I24", name: "转换快攻", category: TalentCategory.GameIQ, maxLevel: 3,
        description: "提升在攻防转换中的速度和决策效率，增加快攻得分机会。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.Speed, value: 5, description: "快攻速度+5" },
            { type: TalentEffectType.PercentageBoost, value: 10, description: "快攻得分效率+10%" },
        ]
    },

    // --- 特殊/稀有类 (Special/Rare Talents) --- (6种)
    {
        id: "S25", name: "徽章大师", category: TalentCategory.SpecialRare, maxLevel: 3,
        description: "提升所有已解锁'徽章'（子能力）的效果等级。",
        baseEffects: [
            { type: TalentEffectType.EfficiencyBoost, value: 10, description: "所有徽章效果提升10%" },
        ]
    },
    {
        id: "S26", name: "伤病免疫", category: TalentCategory.SpecialRare, maxLevel: 3,
        description: "极大地降低伤病发生率，即使受伤也能快速恢复。",
        baseEffects: [
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.InjuryResistance, value: 30, description: "伤病发生率降低30%" },
            { type: TalentEffectType.PercentageBoost, attribute: PlayerAttribute.RecoveryRate, value: 30, description: "伤病恢复速度+30%" },
        ]
    },
    {
        id: "S27", name: "第六人", category: TalentCategory.SpecialRare, maxLevel: 3,
        description: "作为替补出场时，在短时间内获得大幅属性加成。",
        baseEffects: [
            { type: TalentEffectType.MechanismChange, value: 0, description: "替补出场后前5分钟，所有属性+8" },
        ]
    },
    {
        id: "S28", name: "教练之子", category: TalentCategory.SpecialRare, maxLevel: 1,
        description: "提升从教练和训练师处获得的经验和属性加成效率。",
        baseEffects: [
            { type: TalentEffectType.EfficiencyBoost, attribute: PlayerAttribute.TrainingEfficiency, value: 20, description: "训练经验获取+20%" },
        ]
    },
    {
        id: "S29", name: "全能战士", category: TalentCategory.SpecialRare, maxLevel: 3,
        description: "减少跨位置训练时的效率惩罚，使球员能更快地掌握非本位置技能。",
        baseEffects: [
            { type: TalentEffectType.EfficiencyBoost, value: 50, description: "跨位置训练效率惩罚降低50%" },
        ]
    },
    {
        id: "S30", name: "时代之星", category: TalentCategory.SpecialRare, maxLevel: 1,
        description: "拥有巨大的潜力上限，随着年龄增长，潜力衰退速度极慢。",
        baseEffects: [
            { type: TalentEffectType.FlatBoost, attribute: PlayerAttribute.PotentialCeiling, value: 10, description: "潜力上限+10" },
            { type: TalentEffectType.MechanismChange, value: 0, description: "潜力衰退速度降低50%" },
        ]
    },
    ];

// 检查天赋数量是否为30
if (TALENT_DEFINITIONS.length !== 30) {
    console.error(`错误：天赋数量不是30，当前数量为 ${TALENT_DEFINITIONS.length}`);
}


/**
 * TalentSystem 类
 * 负责管理天赋的定义、计算天赋效果以及处理天赋的升级逻辑。
 */
export class TalentSystem {
    private definitions: Map<string, ITalentDefinition>;

    constructor() {
        this.definitions = new Map(TALENT_DEFINITIONS.map(t => [t.id, t]));
    }

    /**
     * 获取指定ID的天赋定义
     * @param talentId 天赋ID
     * @returns 天赋定义
     */
    public getDefinition(talentId: string): ITalentDefinition | undefined {
        return this.definitions.get(talentId);
    }

    /**
     * 计算一个玩家所有天赋带来的总效果
     * @param playerTalents 玩家拥有的天赋实例列表
     * @returns 聚合后的总效果列表
     */
    public calculateTotalEffects(playerTalents: ITalentInstance[]): ITalentEffect[] {
        const totalEffects: ITalentEffect[] = [];
        const flatBoosts: Map<PlayerAttribute, number> = new Map();
        const percentBoosts: Map<PlayerAttribute, number> = new Map();
        const mechanismChanges: ITalentEffect[] = [];
        const efficiencyBoosts: Map<PlayerAttribute | "General", number> = new Map();

        for (const instance of playerTalents) {
            const definition = this.getDefinition(instance.talentId);
            if (!definition) continue;

            // 线性成长模型：效果 = 基础效果 * 当前等级
            // 假设 baseEffects 中的 value 是 Level 1 的效果。
            const level = instance.currentLevel;

            for (const effect of definition.baseEffects) {
                const scaledValue = effect.value * level;

                switch (effect.type) {
                    case TalentEffectType.FlatBoost:
                        if (effect.attribute) {
                            flatBoosts.set(effect.attribute, (flatBoosts.get(effect.attribute) || 0) + scaledValue);
                        }
                        break;
                    case TalentEffectType.PercentageBoost:
                        if (effect.attribute) {
                            percentBoosts.set(effect.attribute, (percentBoosts.get(effect.attribute) || 0) + scaledValue);
                        } else {
                            // 针对通用百分比效果，例如命中率
                            totalEffects.push({ ...effect, value: scaledValue });
                        }
                        break;
                    case TalentEffectType.EfficiencyBoost:
                        const key = effect.attribute || "General";
                        efficiencyBoosts.set(key, (efficiencyBoosts.get(key) || 0) + scaledValue);
                        break;
                    case TalentEffectType.MechanismChange:
                        // 机制修改不叠加数值，只记录存在
                        mechanismChanges.push(effect);
                        break;
                }
            }
        }

        // 聚合 FlatBoosts
        flatBoosts.forEach((value, attribute) => {
            totalEffects.push({
                type: TalentEffectType.FlatBoost,
                attribute: attribute,
                value: value,
                description: `基础属性 ${attribute} + ${value}`
            });
        });

        // 聚合 PercentageBoosts
        percentBoosts.forEach((value, attribute) => {
            totalEffects.push({
                type: TalentEffectType.PercentageBoost,
                attribute: attribute,
                value: value,
                description: `${attribute} 百分比效果 + ${value}%`
            });
        });

        // 聚合 EfficiencyBoosts
        efficiencyBoosts.forEach((value, key) => {
            totalEffects.push({
                type: TalentEffectType.EfficiencyBoost,
                attribute: key === "General" ? undefined : key as PlayerAttribute,
                value: value,
                description: `${key === "General" ? "通用" : key} 效率提升 ${value}%`
            });
        });

        // 添加 MechanismChanges
        totalEffects.push(...mechanismChanges);

        return totalEffects;
    }

    /**
     * 计算天赋升级所需的训练点（示例：非线性成长曲线）
     * @param talentId 天赋ID
     * @param currentLevel 当前等级
     * @returns 升级到下一级所需的训练点
     */
    public calculateLevelUpCost(talentId: string, currentLevel: number): number {
        const definition = this.getDefinition(talentId);
        if (!definition || currentLevel >= definition.maxLevel) {
            return 0; // 达到最大等级
        }

        // 科学的成长曲线：使用指数增长模型，基础消耗 * (1.5 ^ currentLevel)
        const baseCost = 100; // 假设基础消耗为100点训练点
        const cost = Math.round(baseCost * Math.pow(1.5, currentLevel));
        return cost;
    }

    /**
     * 尝试升级一个天赋
     * @param playerTalent 玩家拥有的天赋实例
     * @param availableTrainingPoints 玩家当前拥有的训练点
     * @returns 升级后的天赋实例和消耗的训练点
     */
    public tryLevelUp(playerTalent: ITalentInstance, availableTrainingPoints: number): { success: boolean, newTalent: ITalentInstance, pointsSpent: number } {
        const cost = this.calculateLevelUpCost(playerTalent.talentId, playerTalent.currentLevel);
        
        if (cost === 0) {
            return { success: false, newTalent: playerTalent, pointsSpent: 0 }; // 已满级
        }

        if (availableTrainingPoints >= cost) {
            const newTalent = { ...playerTalent, currentLevel: playerTalent.currentLevel + 1 };
            return { success: true, newTalent: newTalent, pointsSpent: cost };
        } else {
            return { success: false, newTalent: playerTalent, pointsSpent: 0 }; // 资源不足
        }
    }
}

// 导出所有定义，方便其他模块使用
export default TalentSystem;
