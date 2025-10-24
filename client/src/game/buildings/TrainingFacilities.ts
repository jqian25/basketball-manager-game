/**
 * client/src/game/buildings/TrainingFacilities.ts
 *
 * 训练设施建筑配置。
 * 风格：宝可梦 Game Boy 风格。
 * 作用：提供各种训练服务，提升宝可梦的能力值、努力值或学习技能。
 */

// --- 1. 枚举和常量定义 ---

/**
 * 训练设施的类型，用于区分功能。
 */
export enum TrainingFacilityType {
    /** 提升基础能力值 (Base Stats: HP, Atk, Def, SpA, SpD, Spe) */
    STAT_BOOST = 'STAT_BOOST',
    /** 提升努力值 (Effort Values: EV) */
    EV_TRAINING = 'EV_TRAINING',
    /** 学习特殊技能或招式 */
    SKILL_LEARNING = 'SKILL_LEARNING',
    /** 恢复和特殊服务 */
    UTILITY = 'UTILITY',
}

/**
 * 15种训练设施的唯一标识符。
 */
export enum TrainingFacilityID {
    // 基础能力值提升 (STAT_BOOST) - 6种
    HP_GYM = 'HP_GYM',
    ATTACK_DOJO = 'ATTACK_DOJO',
    DEFENSE_FORT = 'DEFENSE_FORT',
    SP_ATTACK_ACADEMY = 'SP_ATTACK_ACADEMY',
    SP_DEFENSE_SANCTUARY = 'SP_DEFENSE_SANCTUARY',
    SPEED_TRACK = 'SPEED_TRACK',

    // 努力值训练 (EV_TRAINING) - 6种
    HP_EV_ARENA = 'HP_EV_ARENA',
    ATTACK_EV_PUNCHING_BAGS = 'ATTACK_EV_PUNCHING_BAGS',
    DEFENSE_EV_WALL = 'DEFENSE_EV_WALL',
    SP_ATTACK_EV_LAB = 'SP_ATTACK_EV_LAB',
    SP_DEFENSE_EV_SHIELD = 'SP_DEFENSE_EV_SHIELD',
    SPEED_EV_MAZE = 'SPEED_EV_MAZE',

    // 技能学习 (SKILL_LEARNING) - 2种
    MOVE_TUTOR_HALL = 'MOVE_TUTOR_HALL',
    TM_MACHINE_FACTORY = 'TM_MACHINE_FACTORY',

    // 恢复和特殊 (UTILITY) - 1种
    POKEMON_SPA = 'POKEMON_SPA',
}

// --- 2. 接口定义 ---

/**
 * 训练设施消耗的资源类型。
 * 简化为金币和时间。
 */
export interface ICost {
    gold: number;
    timeInMinutes: number;
}

/**
 * 单个训练设施的配置接口。
 */
export interface ITrainingFacilityConfig {
    id: TrainingFacilityID;
    name: string;
    type: TrainingFacilityType;
    description: string;
    // 宝可梦 Game Boy 风格的像素图资源键
    assetKey: string;
    // 设施升级所需资源 (简化)
    upgradeCost: ICost;
    // 设施提供的训练效果 (具体内容取决于 type)
    effect: {
        // STAT_BOOST: 提升的基础能力值百分比
        statBoostPercent?: number;
        // EV_TRAINING: 每次训练获得的努力值点数
        evGain?: number;
        // SKILL_LEARNING: 可学习的技能组ID (简化)
        skillGroup?: string;
        // UTILITY: 特殊效果描述 (例如恢复PP, 清除EV)
        utilityEffect?: string;
    };
}

/**
 * 所有训练设施的集合。
 */
export type ITrainingFacilities = Record<TrainingFacilityID, ITrainingFacilityConfig>;

// --- 3. 设施配置数据 ---

export const TrainingFacilities: ITrainingFacilities = {
    // --- 基础能力值提升 (STAT_BOOST) ---

    [TrainingFacilityID.HP_GYM]: {
        id: TrainingFacilityID.HP_GYM,
        name: '生命力道馆',
        type: TrainingFacilityType.STAT_BOOST,
        description: '专注于提高宝可梦的生命值上限，通过耐力训练和营养补充。',
        assetKey: 'building_hp_gym',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础HP
    },
    [TrainingFacilityID.ATTACK_DOJO]: {
        id: TrainingFacilityID.ATTACK_DOJO,
        name: '攻击力道场',
        type: TrainingFacilityType.STAT_BOOST,
        description: '通过密集的物理对抗训练，增强宝可梦的物理攻击力。',
        assetKey: 'building_atk_dojo',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础攻击
    },
    [TrainingFacilityID.DEFENSE_FORT]: {
        id: TrainingFacilityID.DEFENSE_FORT,
        name: '防御力堡垒',
        type: TrainingFacilityType.STAT_BOOST,
        description: '模拟各种恶劣环境，锻炼宝可梦的身体韧性和物理防御。',
        assetKey: 'building_def_fort',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础防御
    },
    [TrainingFacilityID.SP_ATTACK_ACADEMY]: {
        id: TrainingFacilityID.SP_ATTACK_ACADEMY,
        name: '特攻学院',
        type: TrainingFacilityType.STAT_BOOST,
        description: '研究元素能量的运用，提升宝可梦的特殊攻击能力。',
        assetKey: 'building_spa_academy',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础特攻
    },
    [TrainingFacilityID.SP_DEFENSE_SANCTUARY]: {
        id: TrainingFacilityID.SP_DEFENSE_SANCTUARY,
        name: '特防圣地',
        type: TrainingFacilityType.STAT_BOOST,
        description: '冥想和精神训练，增强宝可梦对特殊攻击的抵抗力。',
        assetKey: 'building_spd_sanctuary',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础特防
    },
    [TrainingFacilityID.SPEED_TRACK]: {
        id: TrainingFacilityID.SPEED_TRACK,
        name: '速度跑道',
        type: TrainingFacilityType.STAT_BOOST,
        description: '高速冲刺和敏捷训练，显著提升宝可梦的战斗速度。',
        assetKey: 'building_spe_track',
        upgradeCost: { gold: 5000, timeInMinutes: 60 },
        effect: { statBoostPercent: 0.01 }, // 每次训练提升1%基础速度
    },

    // --- 努力值训练 (EV_TRAINING) ---
    // 每次训练提供固定努力值，直到达到上限。

    [TrainingFacilityID.HP_EV_ARENA]: {
        id: TrainingFacilityID.HP_EV_ARENA,
        name: 'HP努力值斗技场',
        type: TrainingFacilityType.EV_TRAINING,
        description: '进行高强度耐力挑战，快速获得HP努力值。',
        assetKey: 'building_hp_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点HP EV
    },
    [TrainingFacilityID.ATTACK_EV_PUNCHING_BAGS]: {
        id: TrainingFacilityID.ATTACK_EV_PUNCHING_BAGS,
        name: '攻击努力值沙袋区',
        type: TrainingFacilityType.EV_TRAINING,
        description: '无情的沙袋击打，专注于提升物理攻击努力值。',
        assetKey: 'building_atk_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点攻击 EV
    },
    [TrainingFacilityID.DEFENSE_EV_WALL]: {
        id: TrainingFacilityID.DEFENSE_EV_WALL,
        name: '防御努力值壁垒',
        type: TrainingFacilityType.EV_TRAINING,
        description: '模拟防御屏障训练，提升物理防御努力值。',
        assetKey: 'building_def_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点防御 EV
    },
    [TrainingFacilityID.SP_ATTACK_EV_LAB]: {
        id: TrainingFacilityID.SP_ATTACK_EV_LAB,
        name: '特攻努力值实验室',
        type: TrainingFacilityType.EV_TRAINING,
        description: '进行能量操控实验，提升特殊攻击努力值。',
        assetKey: 'building_spa_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点特攻 EV
    },
    [TrainingFacilityID.SP_DEFENSE_EV_SHIELD]: {
        id: TrainingFacilityID.SP_DEFENSE_EV_SHIELD,
        name: '特防努力值护盾场',
        type: TrainingFacilityType.EV_TRAINING,
        description: '进行精神力场抵抗训练，提升特殊防御努力值。',
        assetKey: 'building_spd_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点特防 EV
    },
    [TrainingFacilityID.SPEED_EV_MAZE]: {
        id: TrainingFacilityID.SPEED_EV_MAZE,
        name: '速度努力值迷宫',
        type: TrainingFacilityType.EV_TRAINING,
        description: '计时穿越复杂迷宫，提升速度努力值。',
        assetKey: 'building_spe_ev',
        upgradeCost: { gold: 8000, timeInMinutes: 90 },
        effect: { evGain: 4 }, // 每次训练获得4点速度 EV
    },

    // --- 技能学习 (SKILL_LEARNING) ---

    [TrainingFacilityID.MOVE_TUTOR_HALL]: {
        id: TrainingFacilityID.MOVE_TUTOR_HALL,
        name: '招式教学大厅',
        type: TrainingFacilityType.SKILL_LEARNING,
        description: '聚集了各种招式教学者，可以花费资源让宝可梦学习特殊招式。',
        assetKey: 'building_move_tutor',
        upgradeCost: { gold: 15000, timeInMinutes: 120 },
        effect: { skillGroup: 'TUTOR_HIGH_COST' }, // 可学习稀有招式
    },
    [TrainingFacilityID.TM_MACHINE_FACTORY]: {
        id: TrainingFacilityID.TM_MACHINE_FACTORY,
        name: '招式机制造厂',
        type: TrainingFacilityType.SKILL_LEARNING,
        description: '提供招式机（TM）的制作和使用服务，学习通用技能。',
        assetKey: 'building_tm_factory',
        upgradeCost: { gold: 12000, timeInMinutes: 120 },
        effect: { skillGroup: 'TM_COMMON' }, // 可学习常见TM技能
    },

    // --- 恢复和特殊 (UTILITY) ---

    [TrainingFacilityID.POKEMON_SPA]: {
        id: TrainingFacilityID.POKEMON_SPA,
        name: '宝可梦温泉会馆',
        type: TrainingFacilityType.UTILITY,
        description: '提供放松和恢复服务，可清除所有努力值并提升亲密度。',
        assetKey: 'building_pokemon_spa',
        upgradeCost: { gold: 20000, timeInMinutes: 180 },
        effect: { utilityEffect: '完全恢复HP/PP，清除所有EV，大幅提升亲密度。' },
    },
};

/**
 * 导出一个函数，用于根据ID获取设施配置。
 * @param id 设施ID
 * @returns 设施配置
 */
export function getTrainingFacilityConfig(id: TrainingFacilityID): ITrainingFacilityConfig {
    const config = TrainingFacilities[id];
    if (!config) {
        // 在Phaser 3/TypeScript项目中，通常会有一个日志系统或错误处理机制
        // 这里简化为抛出错误，确保运行时配置的完整性
        throw new Error(`未找到ID为 ${id} 的训练设施配置。`);
    }
    return config;
}

// 示例：获取其中一个设施的配置
// const hpGymConfig = getTrainingFacilityConfig(TrainingFacilityID.HP_GYM);
// console.log(hpGymConfig.name, hpGymConfig.description);

// 示例：遍历所有设施
// Object.values(TrainingFacilities).forEach(facility => {
//     console.log(`[${facility.id}] ${facility.name} - 类型: ${facility.type}`);
// });

// 额外导出一个包含所有设施ID的数组，方便迭代
export const AllTrainingFacilityIDs: TrainingFacilityID[] = Object.values(TrainingFacilityID);

// 确保设施数量为15
if (AllTrainingFacilityIDs.length !== 15) {
    console.warn(`警告：训练设施数量不为15，当前数量为 ${AllTrainingFacilityIDs.length}`);
}

// ----------------------------------------------------------------
// 宝可梦 Game Boy 风格说明：
// 1. 命名简洁、直观，如 'HP GYM', 'ATTACK DOJO'。
// 2. 配置数据结构化，便于在Phaser 3中实例化和使用。
// 3. 效果描述使用游戏内术语（能力值、努力值、招式机）。
// 4. 包含 assetKey 用于加载像素风格的建筑贴图。
// ----------------------------------------------------------------
