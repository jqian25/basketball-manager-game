// client/src/game/injury/InjurySystem.ts

/**
 * 伤病类型枚举
 * 模拟篮球运动中常见的伤病，分为轻微、中等和严重。
 */
export enum InjuryType {
    MINOR_STRAIN = "轻微拉伤", // 1-3天恢复
    MODERATE_SPRAIN = "中度扭伤", // 4-10天恢复
    SEVERE_TEAR = "严重撕裂", // 11-30天恢复
    FATIGUE_FRACTURE = "疲劳性骨折", // 30-90天恢复
    CONCUSSION = "脑震荡", // 7-21天恢复
}

/**
 * 伤病部位枚举
 */
export enum InjuryLocation {
    ANKLE = "脚踝",
    KNEE = "膝盖",
    HAMSTRING = "腘绳肌",
    GROIN = "腹股沟",
    BACK = "背部",
    HEAD = "头部",
    SHOULDER = "肩膀",
}

/**
 * 球员的伤病状态接口
 */
export interface PlayerInjury {
    type: InjuryType;
    location: InjuryLocation;
    severity: number; // 0-100，伤病严重程度，影响恢复时间和训练效果
    recoveryDays: number; // 剩余恢复天数
    initialRecoveryDays: number; // 初始恢复天数
    injuryDate: number; // 受伤时的游戏时间戳（例如：天数）
    isChronic: boolean; // 是否是慢性伤病（例如：旧伤复发）
}

/**
 * 球员的身体状态接口
 * 模拟真实篮球训练中影响伤病风险的关键因素
 */
export interface PlayerCondition {
    fatigue: number; // 疲劳度 (0-100)。高疲劳度显著增加伤病风险。
    loadManagement: number; // 负荷管理系数 (0-100)。代表近期训练和比赛强度。
    durability: number; // 耐久度/体质 (0-100)。球员固有属性，影响受伤概率和恢复速度。
    recoveryRateMultiplier: number; // 恢复速度乘数 (例如：1.0)。受营养、睡眠等因素影响。
}

/**
 * 伤病系统配置常量
 */
const INJURY_CONFIG = {
    // 基础受伤概率（每训练/比赛周期）
    BASE_INJURY_CHANCE: 0.005,
    // 疲劳度对受伤概率的乘数影响 (每10点疲劳度)
    FATIGUE_MULTIPLIER_PER_10: 1.15,
    // 负荷管理对受伤概率的乘数影响 (每10点负荷管理)
    LOAD_MULTIPLIER_PER_10: 1.1,
    // 耐久度对受伤概率的乘数影响 (每10点耐久度)
    DURABILITY_DIVISOR_PER_10: 1.05, // 耐久度越高，受伤概率越低

    // 伤病类型和基础恢复天数范围 [min, max]
    RECOVERY_DAYS_MAP: {
        [InjuryType.MINOR_STRAIN]: [1, 3],
        [InjuryType.MODERATE_SPRAIN]: [4, 10],
        [InjuryType.SEVERE_TEAR]: [11, 30],
        [InjuryType.FATIGUE_FRACTURE]: [30, 90],
        [InjuryType.CONCUSSION]: [7, 21],
    },
    // 伤病对属性/训练效果的影响百分比 (例如：-0.10 表示减少10%)
    INJURY_EFFECT_ON_TRAINING: {
        [InjuryType.MINOR_STRAIN]: -0.10,
        [InjuryType.MODERATE_SPRAIN]: -0.30,
        [InjuryType.SEVERE_TEAR]: -0.60,
        [InjuryType.FATIGUE_FRACTURE]: -0.80,
        [InjuryType.CONCUSSION]: -0.50,
    }
};

/**
 * 伤病管理系统
 * 负责计算伤病风险、处理受伤事件、管理恢复进程。
 */
export class InjurySystem {
    private currentPlayerInjuries: Map<string, PlayerInjury[]> = new Map(); // 存储球员ID和其伤病列表

    constructor() {}

    /**
     * 科学的成长曲线和数值设计：计算球员在当前训练/比赛周期内的受伤概率。
     * 
     * @param playerId 球员ID
     * @param condition 球员当前的身体状态
     * @returns 受伤概率 (0.0 - 1.0)
     */
    public calculateInjuryChance(playerId: string, condition: PlayerCondition): number {
        let chance = INJURY_CONFIG.BASE_INJURY_CHANCE;

        // 1. 疲劳度影响：疲劳度越高，风险越大 (真实篮球训练方法)
        // 每10点疲劳度增加15%的风险
        const fatigueFactor = Math.floor(condition.fatigue / 10);
        chance *= Math.pow(INJURY_CONFIG.FATIGUE_MULTIPLIER_PER_10, fatigueFactor);

        // 2. 负荷管理影响：负荷管理越高（强度越大），风险越大
        // 每10点负荷管理增加10%的风险
        const loadFactor = Math.floor(condition.loadManagement / 10);
        chance *= Math.pow(INJURY_CONFIG.LOAD_MULTIPLIER_PER_10, loadFactor);

        // 3. 耐久度影响：耐久度越高，风险越低
        // 每10点耐久度减少5%的风险
        const durabilityFactor = Math.floor(condition.durability / 10);
        chance /= Math.pow(INJURY_CONFIG.DURABILITY_DIVISOR_PER_10, durabilityFactor);

        // 4. 旧伤复发风险 (慢性伤病管理)
        const currentInjuries = this.currentPlayerInjuries.get(playerId) || [];
        const chronicRisk = currentInjuries.filter(i => i.isChronic).length * 0.01; // 每有一个慢性伤病增加1%基础风险
        chance += chronicRisk;

        // 确保概率在合理范围内
        return Math.min(0.5, chance);
    }

    /**
     * 尝试让球员受伤。如果受伤，则生成一个随机伤病。
     * 
     * @param playerId 球员ID
     * @param condition 球员当前的身体状态
     * @param gameDay 当前游戏天数
     * @returns 如果受伤，返回新的PlayerInjury对象；否则返回null
     */
    public tryInjurePlayer(playerId: string, condition: PlayerCondition, gameDay: number): PlayerInjury | null {
        const chance = this.calculateInjuryChance(playerId, condition);
        const randomValue = Math.random();

        if (randomValue < chance) {
            const newInjury = this.generateRandomInjury(gameDay);
            const injuries = this.currentPlayerInjuries.get(playerId) || [];
            injuries.push(newInjury);
            this.currentPlayerInjuries.set(playerId, injuries);
            return newInjury;
        }

        return null;
    }

    /**
     * 真实篮球训练方法：根据伤病类型和严重程度，影响球员的训练效果。
     * 
     * @param playerId 球员ID
     * @returns 训练效果乘数 (例如：0.7 表示训练效果降低30%)
     */
    public getTrainingEffectMultiplier(playerId: string): number {
        const injuries = this.currentPlayerInjuries.get(playerId) || [];
        if (injuries.length === 0) {
            return 1.0;
        }

        // 叠加所有伤病的影响（取最严重的影响）
        let maxEffectReduction = 0;
        for (const injury of injuries) {
            const baseReduction = INJURY_CONFIG.INJURY_EFFECT_ON_TRAINING[injury.type];
            // 严重程度越高，影响越大 (0-100)
            const severityMultiplier = injury.severity / 100; 
            const totalReduction = baseReduction * severityMultiplier;
            maxEffectReduction = Math.min(maxEffectReduction, totalReduction); // maxEffectReduction是负值
        }

        return 1.0 + maxEffectReduction;
    }

    /**
     * 每日更新伤病状态和恢复进程。
     * 
     * @param playerId 球员ID
     * @param condition 球员当前的身体状态
     * @returns 恢复完成的伤病列表
     */
    public updateDailyRecovery(playerId: string, condition: PlayerCondition): PlayerInjury[] {
        const injuries = this.currentPlayerInjuries.get(playerId) || [];
        const recoveredInjuries: PlayerInjury[] = [];

        // 恢复速度受球员的耐久度和恢复速度乘数影响
        const baseRecoverySpeed = 1.0; // 每天恢复1天
        const durabilityBonus = condition.durability / 100 * 0.5; // 耐久度越高，恢复越快 (最高+0.5天)
        const recoveryMultiplier = condition.recoveryRateMultiplier; // 营养、睡眠等外部因素

        const actualRecoverySpeed = (baseRecoverySpeed + durabilityBonus) * recoveryMultiplier;

        const remainingInjuries: PlayerInjury[] = [];
        for (const injury of injuries) {
            injury.recoveryDays -= actualRecoverySpeed;

            if (injury.recoveryDays <= 0) {
                recoveredInjuries.push(injury);
            } else {
                remainingInjuries.push(injury);
            }
        }

        this.currentPlayerInjuries.set(playerId, remainingInjuries);
        return recoveredInjuries;
    }

    /**
     * 获取球员当前的伤病列表。
     * 
     * @param playerId 球员ID
     * @returns 伤病列表
     */
    public getPlayerInjuries(playerId: string): PlayerInjury[] {
        return this.currentPlayerInjuries.get(playerId) || [];
    }

    /**
     * 内部方法：生成一个随机伤病
     * 
     * @param gameDay 当前游戏天数
     * @returns 新的PlayerInjury对象
     */
    private generateRandomInjury(gameDay: number): PlayerInjury {
        const injuryTypes = Object.values(InjuryType);
        const randomType = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];

        const injuryLocations = Object.values(InjuryLocation);
        const randomLocation = injuryLocations[Math.floor(Math.random() * injuryLocations.length)];

        const [minDays, maxDays] = INJURY_CONFIG.RECOVERY_DAYS_MAP[randomType];
        // 恢复天数在范围内随机，并受伤病严重程度影响
        const severity = Math.floor(Math.random() * 60) + 40; // 严重程度 40-100
        const baseRecoveryDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
        const recoveryDays = Math.round(baseRecoveryDays * (severity / 100 * 0.5 + 0.75)); // 严重程度越高，恢复天数越多

        return {
            type: randomType,
            location: randomLocation,
            severity: severity,
            recoveryDays: recoveryDays,
            initialRecoveryDays: recoveryDays,
            injuryDate: gameDay,
            isChronic: Math.random() < 0.1, // 10%的概率是慢性伤病
        };
    }

    /**
     * 示例：模拟一天训练和比赛后的流程
     * 
     * @param playerId 球员ID
     * @param condition 球员当前的身体状态
     * @param gameDay 当前游戏天数
     */
    public simulateDay(playerId: string, condition: PlayerCondition, gameDay: number): { newInjury: PlayerInjury | null, recoveredInjuries: PlayerInjury[] } {
        // 1. 尝试受伤
        const newInjury = this.tryInjurePlayer(playerId, condition, gameDay);

        // 2. 更新恢复进程
        const recoveredInjuries = this.updateDailyRecovery(playerId, condition);

        // 3. (可选) 计算训练效果乘数
        // const trainingMultiplier = this.getTrainingEffectMultiplier(playerId);
        // console.log(`球员训练效果乘数: ${trainingMultiplier}`);

        return { newInjury, recoveredInjuries };
    }
}

// 示例用法（可选，在实际游戏中会被其他模块调用）
/*
const injurySystem = new InjurySystem();
const playerAId = "player_a";
const playerACondition: PlayerCondition = {
    fatigue: 85, // 高疲劳
    loadManagement: 90, // 高负荷
    durability: 60, // 一般体质
    recoveryRateMultiplier: 1.0,
};

let day = 1;
for (day = 1; day <= 5; day++) {
    console.log(`--- 第 ${day} 天 ---`);
    const { newInjury, recoveredInjuries } = injurySystem.simulateDay(playerAId, playerACondition, day);

    if (newInjury) {
        console.log(`🚨 球员 ${playerAId} 受伤了! 类型: ${newInjury.type}, 部位: ${newInjury.location}, 恢复天数: ${newInjury.recoveryDays}`);
    }

    if (recoveredInjuries.length > 0) {
        console.log(`✅ 球员 ${playerAId} 恢复了 ${recoveredInjuries.length} 处伤病。`);
    }

    const currentInjuries = injurySystem.getPlayerInjuries(playerAId);
    console.log(`当前伤病数量: ${currentInjuries.length}`);
    console.log(`训练效果乘数: ${injurySystem.getTrainingEffectMultiplier(playerAId).toFixed(2)}`);

    // 假设每天疲劳和负荷会略微下降
    playerACondition.fatigue = Math.max(0, playerACondition.fatigue - 5);
    playerACondition.loadManagement = Math.max(0, playerACondition.loadManagement - 5);
}
*/
