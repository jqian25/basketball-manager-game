/**
 * client/src/game/combat/BuffSystem.ts
 * 篮球RPG游戏Buff系统
 * 负责管理角色身上的增益/减益效果（Buff/Debuff）
 */

// 1. 完整数据结构

/**
 * Buff效果的类型，符合篮球RPG主题。
 * 增益（Buff）通常是正向的，减益（Debuff）是负向的。
 */
export enum BuffType {
    // 增益效果 (Buff)
    SHOOTING_ACCURACY_BOOST = "ShootingAccuracyBoost", // 投篮命中率提升
    SPEED_BOOST = "SpeedBoost",                       // 速度提升（快攻、跑位）
    STAMINA_REGEN_BOOST = "StaminaRegenBoost",        // 体力恢复加速
    DEFENSE_STRENGTH = "DefenseStrength",             // 防守强度提升（抢断、盖帽几率）
    THREE_POINT_SPECIALIST = "ThreePointSpecialist",  // 三分球专家（特定时间内三分命中率大幅提升）
    
    // 减益效果 (Debuff)
    FATIGUE = "Fatigue",                              // 疲劳（降低所有属性）
    INJURY_MINOR = "InjuryMinor",                     // 轻微伤（降低特定属性，如移动速度）
    PRESS_RESIST_REDUCTION = "PressResistReduction",  // 抗压能力下降（容易失误）
    SLOW = "Slow",                                    // 减速（降低移动速度）
}

/**
 * Buff效果的持续类型
 */
export enum BuffDurationType {
    DURATION = "Duration", // 有时间限制
    STACK = "Stack",       // 基于层数，层数耗尽或达到最大值时移除
    PERMANENT = "Permanent", // 永久（直到被驱散或比赛结束）
}

/**
 * Buff效果的生效方式
 */
export enum BuffEffectType {
    STAT_MODIFIER = "StatModifier", // 属性修改（如 +10% 命中率）
    TICK_EFFECT = "TickEffect",     // 持续效果（如每秒恢复体力）
    TRIGGER_EFFECT = "TriggerEffect", // 触发效果（如成功抢断后触发额外加速）
}

/**
 * 描述单个Buff实例的数据结构
 */
export interface IBuffInstance {
    id: string; // 唯一的Buff实例ID
    type: BuffType; // Buff类型
    sourceId: string; // 施加Buff的来源（如：技能ID，装备ID，球员ID）
    startTime: number; // Buff开始时间（毫秒时间戳）
    duration: number; // 持续时间（毫秒），如果为0表示永久或基于层数
    stacks: number; // 当前层数
    intensity: number; // 效果强度（例如：1.5倍速度，或 +10% 属性）
}

/**
 * 角色属性接口（简化版，用于演示Buff效果）
 */
export interface ICharacterStats {
    shootingAccuracy: number; // 投篮命中率
    speed: number;            // 速度
    stamina: number;          // 体力
    staminaRegenRate: number; // 体力恢复率
    defenseStrength: number;  // 防守强度
    pressResist: number;      // 抗压能力
    // ... 其他属性
}

/**
 * 角色接口（简化版）
 */
export interface ICharacter {
    id: string;
    name: string;
    baseStats: ICharacterStats;
    currentStats: ICharacterStats;
    buffs: IBuffInstance[]; // 角色当前拥有的Buff列表
}

// 2. 详细配置

/**
 * Buff配置接口
 */
export interface IBuffConfig {
    name: string;
    description: string;
    icon: string; // 图标资源路径
    durationType: BuffDurationType;
    effectType: BuffEffectType;
    isDebuff: boolean; // 是否为减益效果
    maxStacks: number; // 最大层数
    // Buff逻辑参数（根据effectType不同而不同）
    modifierKey?: keyof ICharacterStats; // 如果是StatModifier，作用于哪个属性
    modifierValue?: number; // 属性修改的基准值
    tickInterval?: number; // 持续效果的间隔（毫秒）
    tickEffectValue?: number; // 持续效果每次跳动的数值
    // ... 更多配置参数
}

/**
 * Buff配置表（详细配置）
 */
export const BuffConfig: Record<BuffType, IBuffConfig> = {
    [BuffType.SHOOTING_ACCURACY_BOOST]: {
        name: "神射手光环",
        description: "在队友的掩护下，投篮命中率暂时提升。",
        icon: "icon_shoot_buff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: false,
        maxStacks: 1,
        modifierKey: "shootingAccuracy",
        modifierValue: 0.15, // 提升15%
    },
    [BuffType.SPEED_BOOST]: {
        name: "快攻冲刺",
        description: "成功抢断或获得篮板后，移动速度大幅提升。",
        icon: "icon_speed_buff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: false,
        maxStacks: 1,
        modifierKey: "speed",
        modifierValue: 0.30, // 提升30%
    },
    [BuffType.STAMINA_REGEN_BOOST]: {
        name: "喘息恢复",
        description: "在替补席休息时，体力恢复速度加快。",
        icon: "icon_regen_buff",
        durationType: BuffDurationType.PERMANENT, // 假设在替补席是永久的
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: false,
        maxStacks: 1,
        modifierKey: "staminaRegenRate",
        modifierValue: 0.50, // 恢复率提升50%
    },
    [BuffType.DEFENSE_STRENGTH]: {
        name: "铁壁防守",
        description: "成功盖帽后，防守强度暂时提升。",
        icon: "icon_defense_buff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: false,
        maxStacks: 3, // 可叠加3层
        modifierKey: "defenseStrength",
        modifierValue: 0.10, // 每层提升10%
    },
    [BuffType.THREE_POINT_SPECIALIST]: {
        name: "火热手感",
        description: "连续命中三分球后触发，在短时间内三分球命中率极高。",
        icon: "icon_3pt_hot",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: false,
        maxStacks: 1,
        modifierKey: "shootingAccuracy",
        modifierValue: 0.50, // 提升50%
    },
    [BuffType.FATIGUE]: {
        name: "体力透支",
        description: "长时间高强度运动导致，全属性大幅下降。",
        icon: "icon_fatigue_debuff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: true,
        maxStacks: 1,
        modifierKey: "speed", // 疲劳影响多个属性，这里只演示一个
        modifierValue: -0.20, // 速度下降20%
    },
    [BuffType.SLOW]: {
        name: "脚步迟缓",
        description: "被对手的强力防守技能影响，移动速度降低。",
        icon: "icon_slow_debuff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: true,
        maxStacks: 1,
        modifierKey: "speed",
        modifierValue: -0.40, // 速度下降40%
    },
    [BuffType.PRESS_RESIST_REDUCTION]: {
        name: "抗压崩溃",
        description: "在关键时刻，抗压能力大幅下降，容易失误。",
        icon: "icon_press_debuff",
        durationType: BuffDurationType.DURATION,
        effectType: BuffEffectType.STAT_MODIFIER,
        isDebuff: true,
        maxStacks: 1,
        modifierKey: "pressResist",
        modifierValue: -0.50, // 抗压能力下降50%
    }
};

// 3. Buff系统实现

export class BuffSystem {
    private static instance: BuffSystem;
    private characters: Map<string, ICharacter> = new Map(); // 存储所有角色

    private constructor() {}

    public static getInstance(): BuffSystem {
        if (!BuffSystem.instance) {
            BuffSystem.instance = new BuffSystem();
        }
        return BuffSystem.instance;
    }

    /**
     * 注册一个角色到Buff系统
     * @param character 角色对象
     */
    public registerCharacter(character: ICharacter): void {
        this.characters.set(character.id, character);
        // 初始化角色的当前属性为基础属性
        this.applyAllBuffs(character); 
    }

    /**
     * 生成唯一的Buff实例ID
     */
    private generateBuffId(type: BuffType): string {
        return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * 查找角色身上是否存在指定类型的Buff
     * @param character 角色对象
     * @param type Buff类型
     * @returns 存在的Buff实例或null
     */
    private findBuffByType(character: ICharacter, type: BuffType): IBuffInstance | null {
        return character.buffs.find(b => b.type === type) || null;
    }

    /**
     * 添加或更新一个Buff效果
     * @param characterId 角色ID
     * @param type Buff类型
     * @param sourceId 来源ID
     * @param duration 持续时间（毫秒）
     * @param intensity 效果强度
     */
    public addBuff(
        characterId: string,
        type: BuffType,
        sourceId: string,
        duration: number = 0,
        intensity: number = 1
    ): IBuffInstance | null {
        const character = this.characters.get(characterId);
        if (!character) {
            console.warn(`Character with ID ${characterId} not found.`);
            return null;
        }

        const config = BuffConfig[type];
        if (!config) {
            console.error(`Buff type ${type} not configured.`);
            return null;
        }

        let existingBuff = this.findBuffByType(character, type);

        if (existingBuff) {
            // 1. 刷新持续时间 (Refresh Duration)
            if (config.durationType === BuffDurationType.DURATION) {
                existingBuff.startTime = Date.now();
                existingBuff.duration = duration > 0 ? duration : existingBuff.duration; // 刷新时间
            }

            // 2. 叠加层数 (Stacking)
            if (config.maxStacks > 1 && existingBuff.stacks < config.maxStacks) {
                existingBuff.stacks++;
            }
            
            // 3. 强度更新 (Intensity Update) - 简单的覆盖或取最大值，这里选择覆盖
            existingBuff.intensity = intensity;

            // 重新应用所有Buff以更新属性
            this.applyAllBuffs(character);
            return existingBuff;

        } else {
            // 创建新的Buff实例
            const newBuff: IBuffInstance = {
                id: this.generateBuffId(type),
                type,
                sourceId,
                startTime: Date.now(),
                duration: duration,
                stacks: 1,
                intensity: intensity,
            };

            character.buffs.push(newBuff);
            // 重新应用所有Buff以更新属性
            this.applyAllBuffs(character);
            return newBuff;
        }
    }

    /**
     * 移除一个Buff效果
     * @param characterId 角色ID
     * @param buffId Buff实例ID
     */
    public removeBuff(characterId: string, buffId: string): boolean {
        const character = this.characters.get(characterId);
        if (!character) return false;

        const initialLength = character.buffs.length;
        character.buffs = character.buffs.filter(b => b.id !== buffId);

        if (character.buffs.length < initialLength) {
            // 成功移除后，重新应用所有Buff以恢复属性
            this.applyAllBuffs(character);
            return true;
        }
        return false;
    }

    /**
     * 移除指定类型的所有Buff
     * @param characterId 角色ID
     * @param type Buff类型
     */
    public removeBuffByType(characterId: string, type: BuffType): void {
        const character = this.characters.get(characterId);
        if (!character) return;

        const initialLength = character.buffs.length;
        character.buffs = character.buffs.filter(b => b.type !== type);

        if (character.buffs.length < initialLength) {
            this.applyAllBuffs(character);
        }
    }

    /**
     * 核心逻辑：根据Buff列表重新计算角色的当前属性
     * @param character 角色对象
     */
    public applyAllBuffs(character: ICharacter): void {
        // 1. 重置当前属性为基础属性
        character.currentStats = { ...character.baseStats };

        // 2. 遍历所有Buff并应用效果
        for (const buff of character.buffs) {
            const config = BuffConfig[buff.type];
            if (!config) continue;

            const totalModifier = config.modifierValue! * buff.stacks * buff.intensity;

            switch (config.effectType) {
                case BuffEffectType.STAT_MODIFIER:
                    if (config.modifierKey) {
                        // 属性修改通常是乘法或加法。这里使用乘法（百分比提升）
                        const key = config.modifierKey;
                        // 确保属性存在且是数字
                        if (typeof character.currentStats[key] === 'number') {
                            // 假设属性值是基数，Buff提供百分比修正
                            (character.currentStats[key] as number) += (character.baseStats[key] as number) * totalModifier;
                        }
                    }
                    break;
                case BuffEffectType.TICK_EFFECT:
                    // Tick效果通常在游戏循环的Update/Tick阶段处理，这里只做属性修正演示
                    // 实际Tick逻辑应在游戏主循环中，通过检查Buff的tickInterval和上次生效时间来触发
                    break;
                case BuffEffectType.TRIGGER_EFFECT:
                    // 触发效果通常在特定事件发生时处理（如：OnShoot, OnSteal），这里不处理
                    break;
            }
        }
        
        // 3. 确保属性值不会低于0（或其他游戏规则限制）
        for (const key in character.currentStats) {
            if (character.currentStats.hasOwnProperty(key)) {
                const statKey = key as keyof ICharacterStats;
                if (character.currentStats[statKey] < 0) {
                    (character.currentStats[statKey] as number) = 0;
                }
            }
        }
    }

    /**
     * 游戏主循环中调用，用于处理Buff的持续时间、Tick效果等
     * @param deltaTime 距离上次更新的时间（毫秒）
     */
    public update(deltaTime: number): void {
        const now = Date.now();

        for (const character of this.characters.values()) {
            const buffsToRemove: string[] = [];

            for (const buff of character.buffs) {
                const config = BuffConfig[buff.type];
                if (!config) continue;

                // 1. 检查持续时间
                if (config.durationType === BuffDurationType.DURATION && buff.duration > 0) {
                    const elapsed = now - buff.startTime;
                    if (elapsed >= buff.duration) {
                        buffsToRemove.push(buff.id);
                        continue;
                    }
                }

                // 2. 处理持续效果 (Tick Effect)
                if (config.effectType === BuffEffectType.TICK_EFFECT && config.tickInterval) {
                    // 实际游戏中需要更复杂的逻辑来跟踪上次Tick时间，这里简化为只在Update中检查
                    // 假设Tick效果在ApplyAllBuffs中已经处理了属性修正，这里只处理每隔一段时间发生的事件（如扣血/回蓝）
                    // 示例：体力恢复加速（STAMINA_REGEN_BOOST）的Tick逻辑应在角色自身的Update中实现，
                    // BuffSystem只提供属性修正。如果需要系统级Tick，则需要额外的逻辑。
                }
            }

            // 移除过期的Buff
            if (buffsToRemove.length > 0) {
                character.buffs = character.buffs.filter(b => !buffsToRemove.includes(b.id));
                // 移除后需要重新计算属性
                this.applyAllBuffs(character);
            }
        }
    }
}

// 示例用法（可选，但有助于理解）
/*
// 模拟一个角色
const player: ICharacter = {
    id: "player_1",
    name: "超级后卫",
    baseStats: {
        shootingAccuracy: 0.5, // 50% 基础命中率
        speed: 10,
        stamina: 100,
        staminaRegenRate: 1,
        defenseStrength: 5,
        pressResist: 10,
    },
    currentStats: {
        shootingAccuracy: 0.5,
        speed: 10,
        stamina: 100,
        staminaRegenRate: 1,
        defenseStrength: 5,
        pressResist: 10,
    },
    buffs: [],
};

const buffSystem = BuffSystem.getInstance();
buffSystem.registerCharacter(player);

console.log("初始速度:", player.currentStats.speed); // 10

// 添加一个速度提升Buff (持续5秒, 提升30%)
const speedBuffDuration = 5000;
buffSystem.addBuff(player.id, BuffType.SPEED_BOOST, "Skill_FastBreak", speedBuffDuration, 1);

console.log("应用Buff后速度:", player.currentStats.speed); // 10 + 10 * 0.30 = 13

// 模拟时间流逝 (例如 6秒)
// 实际游戏中应在主循环中调用 update
setTimeout(() => {
    buffSystem.update(6000); // 假设经过6秒

    console.log("6秒后Buff列表长度:", player.buffs.length); // 0
    console.log("Buff移除后速度:", player.currentStats.speed); // 10 (恢复到基础属性)
}, 6000);
*/