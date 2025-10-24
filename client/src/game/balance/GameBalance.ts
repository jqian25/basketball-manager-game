// client/src/game/balance/GameBalance.ts

/**
 * 球员位置枚举
 */
export enum PlayerPosition {
    PG = "Point Guard",
    SG = "Shooting Guard",
    SF = "Small Forward",
    PF = "Power Forward",
    C = "Center",
}

/**
 * 基础属性配置
 * 影响球员在场上的表现
 */
export interface IBaseStats {
    // 进攻属性 (0-100)
    shooting: number;       // 投篮能力 (三分/中距离)
    dribbling: number;      // 控球能力 (运球/传球)
    finishing: number;      // 终结能力 (上篮/扣篮)
    
    // 防守属性 (0-100)
    perimeterDefense: number; // 外线防守 (抢断/贴防)
    interiorDefense: number;  // 内线防守 (盖帽/篮下防守)
    rebounding: number;       // 篮板能力
    
    // 身体属性 (0-100)
    speed: number;          // 速度 (快攻/跑位)
    strength: number;       // 力量 (对抗/卡位)
    stamina: number;        // 体能 (持续作战能力)
}

/**
 * 球员位置加成配置
 * 定义不同位置的属性权重 (加成值，范围-10到+10)
 */
export interface IPositionBonus {
    [key: string]: IBaseStats; // key 为 PlayerPosition 枚举值
}

/**
 * 技能/天赋配置
 * 影响特定游戏行为的乘数或附加值
 */
export interface ISkillConfig {
    // 投篮相关
    threePointMultiplier: number; // 三分命中率乘数 (例如 1.05 表示 5% 提升)
    midRangeMultiplier: number;  // 中距离命中率乘数
    
    // 控球/传球相关
    passAccuracyBonus: number;   // 传球准确度加成 (例如 0.03 表示 3% 提升)
    turnoverReduction: number;   // 失误率减少百分比 (例如 0.1 表示减少 10% 失误率)
    
    // 防守相关
    blockRateBonus: number;      // 盖帽率加成
    stealRateBonus: number;      // 抢断率加成
    
    // 体能相关
    fatigueResistance: number;   // 抗疲劳能力乘数
}

/**
 * 游戏规则/全局配置
 * 影响比赛整体节奏和数值转换
 */
export interface IGameRules {
    // 属性转换率
    statToSuccessRateBase: number; // 属性值到成功率的基础转换值 (例如 0.3 表示基础成功率 30%)
    statToSuccessRateScale: number; // 属性值到成功率的缩放因子 (例如 0.005 表示每点属性增加 0.5% 成功率)
    
    // 比赛节奏
    paceFactor: number;          // 比赛节奏因子 (影响回合数，例如 1.0 为标准)
    
    // 犯规/体能
    foulRateBase: number;        // 基础犯规率 (例如 0.02 表示基础犯规率为 2%)
    staminaDecayRate: number;    // 体能衰减率 (例如 0.001 每回合衰减 0.1%)
}

/**
 * 完整的游戏平衡配置数据库
 */
export interface IGameBalanceDatabase {
    basePlayerStats: IBaseStats;      // 球员基础属性的平均值或基准值
    positionBonuses: IPositionBonus;  // 位置加成配置
    skillConfig: ISkillConfig;        // 技能/天赋配置
    gameRules: IGameRules;            // 游戏规则/全局配置
}

/**
 * 游戏平衡配置的实例
 * 实际用于游戏中的数值
 */
export const GameBalance: IGameBalanceDatabase = {
    // 假设基础球员属性平均值为 75
    basePlayerStats: {
        shooting: 75,
        dribbling: 75,
        finishing: 75,
        perimeterDefense: 75,
        interiorDefense: 75,
        rebounding: 75,
        speed: 75,
        strength: 75,
        stamina: 75,
    },

    // 位置加成 (加成值，范围-10到+10)
    positionBonuses: {
        [PlayerPosition.PG]: { // 控球后卫：高控球、高速度、高投篮
            shooting: 5,
            dribbling: 10,
            finishing: 0,
            perimeterDefense: 5,
            interiorDefense: -5,
            rebounding: -8,
            speed: 8,
            strength: -5,
            stamina: 5,
        },
        [PlayerPosition.SG]: { // 得分后卫：高投篮、高速度、中等控球
            shooting: 10,
            dribbling: 5,
            finishing: 5,
            perimeterDefense: 5,
            interiorDefense: -5,
            rebounding: -5,
            speed: 5,
            strength: -3,
            stamina: 3,
        },
        [PlayerPosition.SF]: { // 小前锋：全能、均衡
            shooting: 5,
            dribbling: 3,
            finishing: 5,
            perimeterDefense: 5,
            interiorDefense: 3,
            rebounding: 3,
            speed: 3,
            strength: 3,
            stamina: 5,
        },
        [PlayerPosition.PF]: { // 大前锋：高内线防守、高篮板、高力量、中等终结
            shooting: -5,
            dribbling: -8,
            finishing: 5,
            perimeterDefense: -5,
            interiorDefense: 8,
            rebounding: 10,
            speed: -5,
            strength: 8,
            stamina: 5,
        },
        [PlayerPosition.C]: { // 中锋：最高内线防守、最高篮板、最高力量、低速度、低控球
            shooting: -10,
            dribbling: -10,
            finishing: 8,
            perimeterDefense: -10,
            interiorDefense: 10,
            rebounding: 10,
            speed: -10,
            strength: 10,
            stamina: 8,
        },
    },

    // 技能/天赋配置 (乘数或加成)
    skillConfig: {
        threePointMultiplier: 1.05,     // 优秀射手三分命中率提升 5%
        midRangeMultiplier: 1.03,       // 优秀射手中距离命中率提升 3%
        passAccuracyBonus: 0.03,        // 优秀组织者传球准确度提升 3%
        turnoverReduction: 0.1,         // 控球大师减少 10% 失误率
        blockRateBonus: 0.05,           // 盖帽高手盖帽率提升 5%
        stealRateBonus: 0.04,           // 抢断专家抢断率提升 4%
        fatigueResistance: 1.1,         // 铁人体能衰减速度减慢 10% (即抗疲劳能力提升 10%)
    },

    // 游戏规则/全局配置
    gameRules: {
        // 属性转换率 (假设属性值 100 对应 80% 成功率)
        // 0.3 + 100 * 0.005 = 0.8
        statToSuccessRateBase: 0.3,     // 基础成功率 30%
        statToSuccessRateScale: 0.005,  // 每点属性增加 0.5% 成功率
        
        paceFactor: 1.0,                // 标准比赛节奏
        
        foulRateBase: 0.02,             // 基础犯规率 2%
        staminaDecayRate: 0.001,        // 体能衰减率 0.1% 每回合
    },
};