// client/src/game/systems/BadgeSystem.ts

/**
 * @fileoverview Game Boy风格的成就系统 (BadgeSystem)。
 * 
 * 该系统负责管理和追踪游戏中的成就（徽章）解锁状态。
 * 设计目标是易于集成到任何Phaser 3场景或游戏管理类中。
 * 
 * Game Boy风格体现在：
 * 1. 简洁的数据结构和逻辑。
 * 2. 状态存储可以轻松地序列化和反序列化（例如用于存档）。
 */

import Phaser from 'phaser';

// ============================================================================
// 1. 数据结构和类型定义
// ============================================================================

/**
 * 成就的唯一标识符（Game Boy风格：简洁命名）。
 * 实际游戏中应替换为具体的成就ID。
 */
export enum BadgeId {
    FIRST_STEP = "FIRST_STEP",      // 首次启动游戏
    TEN_KILLS = "TEN_KILLS",        // 击败10个敌人
    SECRET_FINDER = "SECRET_FINDER" // 找到一个隐藏物品
}

/**
 * 成就的状态数据接口。
 * 这是需要被保存和加载到存档中的部分。
 */
export interface BadgeState {
    id: BadgeId;
    unlocked: boolean;
    timestamp?: number; // 解锁时间戳，可选
}

/**
 * 成就的配置接口。
 * 包含成就的元数据和解锁条件。
 */
export interface BadgeConfig {
    id: BadgeId;
    name: string;
    description: string;
    // 解锁条件函数：接受当前游戏状态（或其他上下文）并返回是否已解锁。
    // 为了保持通用性，这里使用any作为参数，实际集成时应替换为具体的GameState接口。
    unlockCondition: (context: any) => boolean;
}

/**
 * BadgeSystem的初始化配置接口。
 */
export interface BadgeSystemConfig {
    badges: BadgeConfig[];
}

// ============================================================================
// 2. BadgeSystem 类实现
// ============================================================================

/**
 * 成就系统核心类。
 * 继承自Phaser.Events.EventEmitter，以便在成就解锁时发出事件。
 */
export class BadgeSystem extends Phaser.Events.EventEmitter {
    // 存储所有成就的配置
    private badgeConfigs: Map<BadgeId, BadgeConfig>;
    // 存储所有成就的当前状态
    private badgeStates: Map<BadgeId, BadgeState>;

    // 事件常量
    public static readonly BADGE_UNLOCKED = 'badgeUnlocked';

    /**
     * 构造函数。
     * @param config 初始化配置，包含所有成就的列表。
     */
    constructor(config: BadgeSystemConfig) {
        super();
        this.badgeConfigs = new Map();
        this.badgeStates = new Map();
        
        // 初始化配置和状态
        config.badges.forEach(badgeConfig => {
            this.badgeConfigs.set(badgeConfig.id, badgeConfig);
            // 默认所有成就都是未解锁状态
            this.badgeStates.set(badgeConfig.id, { id: badgeConfig.id, unlocked: false });
        });

        console.log(`[BadgeSystem] 初始化完成，共加载 ${this.badgeConfigs.size} 个成就。`);
    }

    /**
     * 尝试检查并解锁所有未解锁的成就。
     * 这是一个核心方法，应在游戏的关键时刻（如关卡结束、击败Boss等）调用。
     * @param context 游戏状态上下文，用于传递给解锁条件函数。
     */
    public checkBadges(context: any): void {
        let unlockedCount = 0;
        
        this.badgeConfigs.forEach(config => {
            const state = this.badgeStates.get(config.id);

            // 仅检查尚未解锁的成就
            if (state && !state.unlocked) {
                try {
                    if (config.unlockCondition(context)) {
                        this.unlockBadge(config.id);
                        unlockedCount++;
                    }
                } catch (error) {
                    console.error(`[BadgeSystem] 检查成就 ${config.id} 时出错:`, error);
                }
            }
        });

        if (unlockedCount > 0) {
            console.log(`[BadgeSystem] 本次检查解锁了 ${unlockedCount} 个成就。`);
        }
    }

    /**
     * 内部方法：解锁一个成就并触发事件。
     * @param id 要解锁的成就ID。
     */
    private unlockBadge(id: BadgeId): void {
        const state = this.badgeStates.get(id);
        const config = this.badgeConfigs.get(id);

        if (state && config && !state.unlocked) {
            state.unlocked = true;
            state.timestamp = Date.now();
            this.badgeStates.set(id, state); // 更新状态

            console.log(`[BadgeSystem] 成就解锁: ${config.name} (${id})`);

            // 触发事件，通知UI或其他系统
            this.emit(BadgeSystem.BADGE_UNLOCKED, config);
        }
    }

    /**
     * 获取指定成就的配置信息。
     * @param id 成就ID。
     * @returns 成就配置或null。
     */
    public getBadgeConfig(id: BadgeId): BadgeConfig | undefined {
        return this.badgeConfigs.get(id);
    }

    /**
     * 获取指定成就的当前状态。
     * @param id 成就ID。
     * @returns 成就状态或null。
     */
    public getBadgeState(id: BadgeId): BadgeState | undefined {
        return this.badgeStates.get(id);
    }

    /**
     * 获取所有成就的配置列表。
     */
    public getAllBadgeConfigs(): BadgeConfig[] {
        return Array.from(this.badgeConfigs.values());
    }

    /**
     * 获取所有成就的当前状态列表。
     */
    public getAllBadgeStates(): BadgeState[] {
        return Array.from(this.badgeStates.values());
    }

    /**
     * 获取所有已解锁的成就状态列表。
     */
    public getUnlockedBadges(): BadgeState[] {
        return Array.from(this.badgeStates.values()).filter(state => state.unlocked);
    }

    /**
     * 序列化成就状态，用于存档。
     * Game Boy风格：只保存最小必需数据。
     * @returns 包含所有成就状态的数组。
     */
    public save(): BadgeState[] {
        return this.getAllBadgeStates();
    }

    /**
     * 反序列化成就状态，用于读档。
     * @param savedStates 从存档中读取的成就状态数组。
     */
    public load(savedStates: BadgeState[]): void {
        if (!savedStates || savedStates.length === 0) {
            console.log("[BadgeSystem] 未找到存档状态，保持默认。");
            return;
        }

        savedStates.forEach(savedState => {
            const currentState = this.badgeStates.get(savedState.id);
            // 仅更新已存在的成就，并确保不会将已解锁状态覆盖为未解锁（除非逻辑需要，但通常不这样做）
            if (currentState) {
                currentState.unlocked = savedState.unlocked || currentState.unlocked;
                if (savedState.timestamp) {
                    currentState.timestamp = savedState.timestamp;
                }
                this.badgeStates.set(savedState.id, currentState);
            }
        });
        
        console.log(`[BadgeSystem] 从存档加载了 ${savedStates.length} 个成就状态。`);
    }
}

// ============================================================================
// 3. 易于集成的示例用法
// ============================================================================

/**
 * 示例：定义一个模拟的游戏状态接口，便于在条件函数中使用。
 */
export interface GameStateContext {
    playerKills: number;
    gameStarted: boolean;
    secretsFound: number;
    // ... 更多游戏状态
}

/**
 * 示例：定义所有成就的配置。
 */
export const DefaultBadgeConfigs: BadgeConfig[] = [
    {
        id: BadgeId.FIRST_STEP,
        name: "初次冒险",
        description: "第一次启动游戏，迈出伟大的第一步。",
        unlockCondition: (context: GameStateContext) => context.gameStarted === true,
    },
    {
        id: BadgeId.TEN_KILLS,
        name: "新手猎人",
        description: "击败了10个敌人。",
        unlockCondition: (context: GameStateContext) => context.playerKills >= 10,
    },
    {
        id: BadgeId.SECRET_FINDER,
        name: "秘密探险家",
        description: "发现了一个隐藏区域或物品。",
        unlockCondition: (context: GameStateContext) => context.secretsFound >= 1,
    }
];

// 示例：如何初始化和使用系统
/*
// 假设在你的主游戏场景或游戏管理类中
const gameState: GameStateContext = {
    playerKills: 0,
    gameStarted: false,
    secretsFound: 0
};

const badgeSystem = new BadgeSystem({ badges: DefaultBadgeConfigs });

// 监听成就解锁事件
badgeSystem.on(BadgeSystem.BADGE_UNLOCKED, (badgeConfig: BadgeConfig) => {
    // Game Boy风格的通知：例如在屏幕底部显示一个简单的文本框
    console.log(`[GB Style Pop-up] 恭喜！解锁成就: ${badgeConfig.name}`);
    // 可以在这里触发Phaser 3的UI动画
});

// 模拟游戏启动
gameState.gameStarted = true;
badgeSystem.checkBadges(gameState); // 检查 FIRST_STEP 成就

// 模拟击败敌人
gameState.playerKills = 11;
badgeSystem.checkBadges(gameState); // 检查 TEN_KILLS 成就

// 模拟存档和读档
const saveData = badgeSystem.save();
console.log("存档数据:", saveData);

// 模拟新系统启动并加载存档
const newBadgeSystem = new BadgeSystem({ badges: DefaultBadgeConfigs });
newBadgeSystem.load(saveData);

// 再次检查，已解锁的成就不会重复解锁
newBadgeSystem.checkBadges(gameState); 
*/