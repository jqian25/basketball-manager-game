// client/src/game/combat/DamageCalculation.ts

/**
 * 基础属性定义
 * 灵感来源于篮球运动中的核心能力。
 */
export interface BaseStats {
    // 进攻属性
    Shooting: number; // 投篮能力，影响基础伤害
    Passing: number;  // 传球能力，影响团队技能和暴击率
    Dribbling: number; // 控球能力，影响命中率和闪避率

    // 防守属性
    Defense: number; // 基础防守，影响伤害减免
    Rebounding: number; // 篮板能力，影响特殊防御和生命恢复
    Stamina: number; // 体能，影响持续作战能力和技能消耗

    // 通用属性
    Luck: number; // 幸运值，影响暴击率、闪避率和特殊效果触发
    Health: number; // 当前生命值
    MaxHealth: number; // 最大生命值
}

/**
 * 装备提供的额外加成
 */
export interface EquipmentBonus {
    ShootingBonus: number;
    DefenseBonus: number;
    CriticalChanceBonus: number; // 暴击率加成 (百分比, 0.0 - 1.0)
    DamageReductionBonus: number; // 伤害减免加成 (百分比, 0.0 - 1.0)
    // ... 其他装备属性
}

/**
 * 技能或动作的配置
 */
export interface SkillConfig {
    BaseDamageMultiplier: number; // 基础伤害乘数
    AttributeScaling: keyof BaseStats; // 主要属性加成，例如 'Shooting'
    ScalingFactor: number; // 属性加成的系数
    IsCriticalGuaranteed: boolean; // 是否必定暴击
    DefensePenetration: number; // 防御穿透 (百分比, 0.0 - 1.0)
    // ... 其他技能效果
}

/**
 * 伤害计算请求的数据结构
 */
export interface DamageCalculationRequest {
    AttackerStats: BaseStats;
    AttackerEquipment: EquipmentBonus;
    AttackerSkill: SkillConfig;
    
    DefenderStats: BaseStats;
    DefenderEquipment: EquipmentBonus;

    // 随机种子，用于重现或避免重复随机数
    RandomSeed?: number; 
}

/**
 * 伤害计算结果的数据结构
 */
export interface DamageCalculationResult {
    TotalDamage: number;
    IsCritical: boolean;
    DamageBeforeReduction: number;
    FinalDefenseRating: number;
    DamageReductionPercentage: number;
    Log: string[]; // 详细的计算过程日志
}

/**
 * 篮球RPG伤害计算系统
 */
export class DamageCalculation {

    // 基础配置常量
    private static readonly BASE_DAMAGE_FACTOR = 10; // 基础伤害的基数
    private static readonly CRIT_MULTIPLIER = 1.5; // 暴击伤害倍数
    private static readonly BASE_CRIT_CHANCE = 0.05; // 基础暴击率 5%
    private static readonly DEFENSE_TO_REDUCTION_FACTOR = 0.005; // 每点防御转换为伤害减免的系数

    /**
     * 计算最终伤害
     * @param request 伤害计算请求
     * @returns 伤害计算结果
     */
    public static calculateDamage(request: DamageCalculationRequest): DamageCalculationResult {
        const log: string[] = [];
        
        // 1. 结合基础属性和装备加成，计算攻击者和防御者的有效属性
        const effectiveAttackerStats = this.getEffectiveStats(request.AttackerStats, request.AttackerEquipment, log, "Attacker");
        const effectiveDefenderStats = this.getEffectiveStats(request.DefenderStats, request.DefenderEquipment, log, "Defender");

        // 2. 基础伤害计算 (Base Damage)
        const baseDamage = this.calculateBaseDamage(effectiveAttackerStats, request.AttackerSkill, log);

        // 3. 暴击判定 (Critical Hit)
        const isCritical = this.determineCritical(effectiveAttackerStats, request.AttackerSkill, log);
        const damageAfterCrit = isCritical ? baseDamage * this.CRIT_MULTIPLIER : baseDamage;
        
        // 4. 伤害减免计算 (Damage Reduction)
        const { finalDefenseRating, damageReductionPercentage } = this.calculateDamageReduction(
            effectiveDefenderStats, 
            request.AttackerSkill.DefensePenetration, 
            request.DefenderEquipment.DamageReductionBonus, 
            log
        );

        const damageBeforeReduction = damageAfterCrit;
        const totalDamage = damageBeforeReduction * (1 - damageReductionPercentage);

        // 5. 结果封装
        log.push(`最终伤害: ${totalDamage.toFixed(2)}`);

        return {
            TotalDamage: Math.max(0, Math.round(totalDamage)), // 伤害至少为0
            IsCritical: isCritical,
            DamageBeforeReduction: damageBeforeReduction,
            FinalDefenseRating: finalDefenseRating,
            DamageReductionPercentage: damageReductionPercentage,
            Log: log
        };
    }

    /**
     * 计算有效属性
     */
    private static getEffectiveStats(baseStats: BaseStats, equipment: EquipmentBonus, log: string[], role: "Attacker" | "Defender"): BaseStats {
        const effectiveStats: BaseStats = { ...baseStats };
        
        // 示例：只考虑Shooting和Defense的装备加成
        effectiveStats.Shooting += equipment.ShootingBonus;
        effectiveStats.Defense += equipment.DefenseBonus;

        log.push(`[${role}] 有效Shooting: ${effectiveStats.Shooting.toFixed(0)} (基础: ${baseStats.Shooting}, 装备: ${equipment.ShootingBonus})`);
        log.push(`[${role}] 有效Defense: ${effectiveStats.Defense.toFixed(0)} (基础: ${baseStats.Defense}, 装备: ${equipment.DefenseBonus})`);

        return effectiveStats;
    }

    /**
     * 计算基础伤害
     */
    private static calculateBaseDamage(stats: BaseStats, skill: SkillConfig, log: string[]): number {
        // 基础伤害 = 基础伤害因子 * 技能乘数
        let baseDamage = this.BASE_DAMAGE_FACTOR * skill.BaseDamageMultiplier;
        log.push(`基础伤害 (Base): ${baseDamage.toFixed(2)} (因子: ${this.BASE_DAMAGE_FACTOR}, 乘数: ${skill.BaseDamageMultiplier})`);

        // 属性加成 = 对应属性值 * 属性加成系数
        const scalingAttributeValue = stats[skill.AttributeScaling];
        const attributeBonus = scalingAttributeValue * skill.ScalingFactor;
        log.push(`属性加成 (${skill.AttributeScaling}): ${attributeBonus.toFixed(2)} (值: ${scalingAttributeValue}, 系数: ${skill.ScalingFactor})`);

        const totalBaseDamage = baseDamage + attributeBonus;
        log.push(`总基础伤害: ${totalBaseDamage.toFixed(2)}`);
        
        return totalBaseDamage;
    }

    /**
     * 判定暴击
     */
    private static determineCritical(stats: BaseStats, skill: SkillConfig, log: string[]): boolean {
        if (skill.IsCriticalGuaranteed) {
            log.push("暴击判定: 技能必定暴击。");
            return true;
        }

        // 暴击率 = 基础暴击率 + 传球/幸运属性加成
        // 传球属性作为团队配合和精准度的体现，影响暴击率
        const critChanceFromStats = (stats.Passing * 0.001) + (stats.Luck * 0.0005); 
        const totalCritChance = this.BASE_CRIT_CHANCE + critChanceFromStats; // 假设装备加成已在getEffectiveStats中处理
        
        // 实际应用中，这里应该使用一个随机数生成器
        // 为了简化和可测试性，我们暂时使用一个固定的随机数（或者依赖外部传入的RandomSeed）
        // 假设随机数生成器返回 0.0 到 1.0 之间的一个值
        const randomRoll = Math.random(); // 实际应使用可控的随机数

        const isCritical = randomRoll < totalCritChance;

        log.push(`暴击判定: 基础率: ${this.BASE_CRIT_CHANCE.toFixed(2)}, 属性加成: ${critChanceFromStats.toFixed(4)}, 总暴击率: ${(totalCritChance * 100).toFixed(2)}%`);
        log.push(`随机掷骰: ${randomRoll.toFixed(4)}。结果: ${isCritical ? "暴击" : "未暴击"}`);
        
        return isCritical;
    }

    /**
     * 计算伤害减免
     */
    private static calculateDamageReduction(stats: BaseStats, penetration: number, equipmentReduction: number, log: string[]): { finalDefenseRating: number, damageReductionPercentage: number } {
        // 1. 计算有效防御等级 (考虑穿透)
        const effectiveDefense = stats.Defense;
        const finalDefenseRating = effectiveDefense * (1 - penetration);
        log.push(`防御穿透: ${(penetration * 100).toFixed(2)}%。有效防御等级: ${finalDefenseRating.toFixed(2)} (基础: ${effectiveDefense})`);

        // 2. 计算防御等级带来的伤害减免
        // 采用一个递减的公式，避免防御无限堆叠导致伤害减免达到100%
        // 伤害减免 = 1 - (100 / (100 + 防御等级 * 系数))
        // 简化为：伤害减免 = 防御等级 * 系数 / (1 + 防御等级 * 系数)
        const defenseReduction = (finalDefenseRating * this.DEFENSE_TO_REDUCTION_FACTOR) / (1 + finalDefenseRating * this.DEFENSE_TO_REDUCTION_FACTOR);
        log.push(`防御减免 (公式): ${(defenseReduction * 100).toFixed(2)}%`);

        // 3. 加上装备带来的额外减免
        const totalReduction = 1 - ((1 - defenseReduction) * (1 - equipmentReduction));
        
        log.push(`装备减免: ${(equipmentReduction * 100).toFixed(2)}%`);
        log.push(`总伤害减免: ${(totalReduction * 100).toFixed(2)}%`);

        return {
            finalDefenseRating: finalDefenseRating,
            damageReductionPercentage: totalReduction
        };
    }
}

// ----------------------------------------------------------------
// 示例用法（可选，用于测试）
// ----------------------------------------------------------------

/*
const attackerStats: BaseStats = {
    Shooting: 150, Passing: 80, Dribbling: 100,
    Defense: 50, Rebounding: 60, Stamina: 120,
    Luck: 10, Health: 1000, MaxHealth: 1000
};

const attackerEquipment: EquipmentBonus = {
    ShootingBonus: 20, DefenseBonus: 5, CriticalChanceBonus: 0.02, DamageReductionBonus: 0
};

const defenderStats: BaseStats = {
    Shooting: 50, Passing: 50, Dribbling: 50,
    Defense: 180, Rebounding: 100, Stamina: 100,
    Luck: 5, Health: 800, MaxHealth: 800
};

const defenderEquipment: EquipmentBonus = {
    ShootingBonus: 0, DefenseBonus: 10, CriticalChanceBonus: 0, DamageReductionBonus: 0.1
};

const threePointShot: SkillConfig = {
    BaseDamageMultiplier: 3.5, 
    AttributeScaling: 'Shooting', 
    ScalingFactor: 0.8, 
    IsCriticalGuaranteed: false, 
    DefensePenetration: 0.1
};

const request: DamageCalculationRequest = {
    AttackerStats: attackerStats,
    AttackerEquipment: attackerEquipment,
    AttackerSkill: threePointShot,
    DefenderStats: defenderStats,
    DefenderEquipment: defenderEquipment
};

const result = DamageCalculation.calculateDamage(request);

console.log("--- 伤害计算结果 ---");
console.log(`总伤害: ${result.TotalDamage}`);
console.log(`是否暴击: ${result.IsCritical ? '是' : '否'}`);
console.log(`伤害减免百分比: ${(result.DamageReductionPercentage * 100).toFixed(2)}%`);
console.log("--- 计算过程 ---");
result.Log.forEach(line => console.log(line));
*/