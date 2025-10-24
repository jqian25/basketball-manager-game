// client/src/game/systems/QuestSystem.ts

/**
 * @fileoverview 任务系统 - 实现任务接受、进度跟踪、完成奖励。
 * @description 遵循宝可梦Game Boy风格，提供一个简单、易于扩展的任务管理系统。
 * 性能优化：使用事件驱动和Map结构进行高效查找和更新。
 * 易于扩展：使用枚举和接口定义任务，方便添加新任务类型和奖励。
 */

import Phaser from 'phaser';

// --- 1. 数据结构定义 ---

/**
 * 任务状态枚举
 */
export enum QuestStatus {
    AVAILABLE = 'AVAILABLE', // 可接受
    ACTIVE = 'ACTIVE',       // 正在进行
    COMPLETED = 'COMPLETED', // 已完成（待领取奖励）
    CLAIMED = 'CLAIMED',     // 奖励已领取
}

/**
 * 任务目标类型枚举 (可根据游戏需求扩展)
 */
export enum QuestGoalType {
    DEFEAT_ENEMIES = 'DEFEAT_ENEMIES', // 击败特定敌人
    COLLECT_ITEMS = 'COLLECT_ITEMS',   // 收集特定物品
    REACH_LOCATION = 'REACH_LOCATION', // 到达特定地点
    TALK_TO_NPC = 'TALK_TO_NPC',       // 与NPC对话
}

/**
 * 任务奖励接口 (可根据游戏需求扩展)
 */
export interface QuestReward {
    type: 'EXP' | 'ITEM' | 'MONEY';
    value: number | string; // 经验值数量、物品ID或金钱数量
}

/**
 * 任务目标接口
 */
export interface QuestGoal {
    type: QuestGoalType;
    target: string;     // 目标标识符 (如敌人ID, 物品ID, 地点名称, NPC ID)
    required: number;   // 目标需求数量
    current: number;    // 当前进度
}

/**
 * 任务定义接口
 */
export interface QuestDefinition {
    id: string;
    title: string;
    description: string;
    goals: QuestGoal[];
    rewards: QuestReward[];
    prerequisites?: string[]; // 前置任务ID
}

/**
 * 玩家任务实例接口
 */
export interface PlayerQuest extends QuestDefinition {
    status: QuestStatus;
    goals: QuestGoal[]; // 包含当前进度的目标
}

// --- 2. 任务数据 (示例) ---

const QUEST_DATA: Record<string, QuestDefinition> = {
    'start_quest_001': {
        id: 'start_quest_001',
        title: '初次见面',
        description: '去森林边缘击败3只野生的波波，证明你的实力。',
        goals: [
            { type: QuestGoalType.DEFEAT_ENEMIES, target: 'Pidgey', required: 3, current: 0 },
        ],
        rewards: [
            { type: 'EXP', value: 100 },
            { type: 'ITEM', value: 'Potion' },
        ],
    },
    'collect_berry_002': {
        id: 'collect_berry_002',
        title: '收集树果',
        description: '收集5个橙橙果交给镇上的老奶奶。',
        goals: [
            { type: QuestGoalType.COLLECT_ITEMS, target: 'OranBerry', required: 5, current: 0 },
        ],
        rewards: [
            { type: 'MONEY', value: 500 },
        ],
        prerequisites: ['start_quest_001'],
    }
};

// --- 3. 任务系统核心类 ---

export class QuestSystem {
    // 使用Map存储玩家正在进行或已完成的任务，方便快速查找
    private playerQuests: Map<string, PlayerQuest> = new Map();
    private scene: Phaser.Scene;

    // 事件发射器，用于通知UI和其他系统任务状态变化
    public events: Phaser.Events.EventEmitter;

    /**
     * 构造函数
     * @param scene Phaser场景实例
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.events = new Phaser.Events.EventEmitter();
        console.log('QuestSystem initialized.');
    }

    /**
     * 接受一个新任务。
     * @param questId 任务ID
     * @returns 是否成功接受任务
     */
    public acceptQuest(questId: string): boolean {
        const definition = QUEST_DATA[questId];
        if (!definition) {
            console.error(`Quest ID ${questId} not found.`);
            return false;
        }

        if (this.playerQuests.has(questId)) {
            console.warn(`Quest ${questId} is already known.`);
            return false;
        }

        // 检查前置条件
        if (definition.prerequisites) {
            for (const prereqId of definition.prerequisites) {
                const prereqQuest = this.playerQuests.get(prereqId);
                if (!prereqQuest || prereqQuest.status !== QuestStatus.CLAIMED) {
                    console.warn(`Quest ${questId} prerequisites not met: ${prereqId} not claimed.`);
                    return false;
                }
            }
        }

        // 创建玩家任务实例
        const newQuest: PlayerQuest = {
            ...definition,
            status: QuestStatus.ACTIVE,
        };

        this.playerQuests.set(questId, newQuest);
        this.events.emit('questAccepted', newQuest);
        console.log(`Quest accepted: ${newQuest.title}`);
        return true;
    }

    /**
     * 领取任务奖励。
     * @param questId 任务ID
     * @returns 是否成功领取奖励
     */
    public claimReward(questId: string): boolean {
        const quest = this.playerQuests.get(questId);

        if (!quest) {
            console.error(`Quest ${questId} not found in player's list.`);
            return false;
        }

        if (quest.status !== QuestStatus.COMPLETED) {
            console.warn(`Quest ${questId} is not completed yet.`);
            return false;
        }

        // 实际奖励逻辑 (这里仅为示例，需要与游戏内经济/物品系统集成)
        quest.rewards.forEach(reward => {
            console.log(`Awarding ${reward.type}: ${reward.value}`);
            // TODO: 调用PlayerStatsSystem.addExp(reward.value) 或 InventorySystem.addItem(reward.value)
        });

        quest.status = QuestStatus.CLAIMED;
        this.events.emit('questClaimed', quest);
        console.log(`Quest reward claimed: ${quest.title}`);
        return true;
    }

    /**
     * 检查并更新任务进度。这是系统的核心入口点。
     * @param goalType 触发进度的目标类型
     * @param targetId 目标标识符 (如被击败的敌人ID, 获得的物品ID)
     * @param amount 进度增加的数量 (默认为1)
     */
    public updateQuestProgress(goalType: QuestGoalType, targetId: string, amount: number = 1): void {
        let questUpdated = false;

        this.playerQuests.forEach(quest => {
            if (quest.status !== QuestStatus.ACTIVE) {
                return;
            }

            let questCompleted = true; // 假设任务已完成

            quest.goals.forEach(goal => {
                if (goal.type === goalType && goal.target === targetId) {
                    const newCurrent = Math.min(goal.current + amount, goal.required);
                    if (goal.current !== newCurrent) {
                        goal.current = newCurrent;
                        questUpdated = true;
                        this.events.emit('questProgress', quest, goal);
                    }
                }

                // 检查任务是否完成
                if (goal.current < goal.required) {
                    questCompleted = false; // 只要有一个目标未完成，任务就未完成
                }
            });

            // 如果任务完成，更新状态并触发事件
            if (questUpdated && questCompleted && quest.status === QuestStatus.ACTIVE) {
                quest.status = QuestStatus.COMPLETED;
                this.events.emit('questCompleted', quest);
                console.log(`Quest completed: ${quest.title}`);
            }
        });
    }

    /**
     * 获取玩家所有任务列表。
     * @returns 玩家任务数组
     */
    public getPlayerQuests(): PlayerQuest[] {
        return Array.from(this.playerQuests.values());
    }

    /**
     * 获取特定状态的任务列表。
     * @param status 任务状态
     * @returns 任务数组
     */
    public getQuestsByStatus(status: QuestStatus): PlayerQuest[] {
        return this.getPlayerQuests().filter(q => q.status === status);
    }

    /**
     * 获取任务定义。
     * @param questId 任务ID
     * @returns 任务定义或null
     */
    public getQuestDefinition(questId: string): QuestDefinition | null {
        return QUEST_DATA[questId] || null;
    }

    /**
     * 模拟一个事件触发，例如击败敌人。
     * @param enemyId 被击败的敌人ID
     */
    public onEnemyDefeated(enemyId: string): void {
        this.updateQuestProgress(QuestGoalType.DEFEAT_ENEMIES, enemyId, 1);
    }

    /**
     * 模拟一个事件触发，例如获得物品。
     * @param itemId 获得的物品ID
     * @param count 获得的数量
     */
    public onItemCollected(itemId: string, count: number = 1): void {
        this.updateQuestProgress(QuestGoalType.COLLECT_ITEMS, itemId, count);
    }

    /**
     * 模拟一个事件触发，例如到达地点。
     * @param locationName 地点名称
     */
    public onLocationReached(locationName: string): void {
        // 到达地点任务通常只需要1次，但为了通用性，我们传入1
        this.updateQuestProgress(QuestGoalType.REACH_LOCATION, locationName, 1);
    }

    /**
     * 模拟一个事件触发，例如与NPC对话。
     * @param npcId NPC的ID
     */
    public onNPCTalkedTo(npcId: string): void {
        this.updateQuestProgress(QuestGoalType.TALK_TO_NPC, npcId, 1);
    }

    // --- 4. Game Boy 风格 UI 辅助方法 (可选，用于集成到UI类中) ---

    /**
     * 格式化任务进度文本，模拟Game Boy风格的简洁显示。
     * @param goal 任务目标
     * @returns 格式化后的字符串，如 "波波: 1/3"
     */
    public static formatGoalProgress(goal: QuestGoal): string {
        return `${goal.target}: ${goal.current}/${goal.required}`;
    }

    /**
     * 格式化任务状态文本。
     * @param status 任务状态
     * @returns 格式化后的字符串
     */
    public static formatStatus(status: QuestStatus): string {
        switch (status) {
            case QuestStatus.AVAILABLE:
                return '可接受';
            case QuestStatus.ACTIVE:
                return '进行中';
            case QuestStatus.COMPLETED:
                return '完成！';
            case QuestStatus.CLAIMED:
                return '已完成';
            default:
                return '未知状态';
        }
    }
}
