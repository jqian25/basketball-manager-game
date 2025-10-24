// client/src/game/ai/NPCIntelligentBehavior.ts

import * as Phaser from 'phaser';

/**
 * NPC行为状态枚举
 * 模拟Game Boy风格游戏中的简单、离散的NPC状态。
 */
export enum NPCState {
    IDLE = 'IDLE',          // 空闲/等待
    MOVE_TO_WORK = 'MOVE_TO_WORK', // 移动到工作地点
    WORKING = 'WORKING',    // 工作中
    MOVE_TO_SHOP = 'MOVE_TO_SHOP', // 移动到购物地点
    SHOPPING = 'SHOPPING',  // 购物中
    MOVE_TO_PLAY = 'MOVE_TO_PLAY', // 移动到娱乐地点 (如球场)
    PLAYING = 'PLAYING',    // 娱乐中 (如打球)
    CHATTING = 'CHATTING',  // 聊天中 (与玩家或另一个NPC)
    RESTING = 'RESTING',    // 休息/睡觉
    WAITING_FOR_LLM = 'WAITING_FOR_LLM', // 等待大模型响应
}

/**
 * NPC行为上下文接口
 * 包含NPC当前状态所需的所有数据，方便状态机管理。
 */
export interface NPCContext {
    npcName: string;
    currentLocation: Phaser.Math.Vector2;
    targetLocation?: Phaser.Math.Vector2;
    state: NPCState;
    dailySchedule: { time: number; activity: NPCState; location: Phaser.Math.Vector2 }[];
    lastLLMResponse: string;
    isMoving: boolean;
    // 宝可梦风格游戏可能需要的其他属性，如：
    // sprite: Phaser.GameObjects.Sprite;
    // dialogueQueue: string[];
}

/**
 * 模拟大模型API调用
 * 在实际生产环境中，这里会是一个对远程LLM服务的异步HTTP请求。
 * 为了演示，我们使用一个Promise来模拟异步延迟和响应。
 * @param prompt 传递给大模型的提示词
 * @returns 模拟的大模型响应
 */
async function mockLLMCall(prompt: string): Promise<string> {
    console.log(`LLM Prompt: ${prompt}`);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, Phaser.Math.Between(500, 1500)));

    if (prompt.includes('工作')) {
        return "我正在努力工作，为镇上的宝可梦中心整理物资。今天的工作是清点伤药。";
    } else if (prompt.includes('购物')) {
        return "我在商店里挑选树果，准备制作美味的宝可梦食物。我需要买5个橙橙果。";
    } else if (prompt.includes('打球')) {
        return "我正在和我的宝可梦进行一场友谊赛，练习'电光一闪'！";
    } else if (prompt.includes('聊天')) {
        return "你好，旅行者。你有没有听说最近在常磐森林发现了一只闪光的绿毛虫？";
    } else {
        return "我今天感觉很平静，正在享受阳光。";
    }
}

/**
 * NPCIntelligentBehavior 类
 * 核心的NPC智能行为系统，使用有限状态机（FSM）管理行为，并集成LLM进行决策或对话生成。
 * 继承自Phaser.GameObjects.GameObject以便集成到Phaser场景的生命周期。
 */
export class NPCIntelligentBehavior extends Phaser.GameObjects.GameObject {
    private context: NPCContext;
    private scene: Phaser.Scene;
    private npcSprite: Phaser.GameObjects.Sprite; // 假设NPC有一个Phaser Sprite对象
    private currentActivityTimer: Phaser.Time.TimerEvent | null = null;
    private llmCooldownTimer: Phaser.Time.TimerEvent | null = null;
    private readonly LLM_COOLDOWN_MS = 5000; // LLM调用冷却时间，避免频繁调用

    /**
     * 构造函数
     * @param scene Phaser场景
     * @param x NPC的初始X坐标
     * @param y NPC的初始Y坐标
     * @param texture NPC的贴图键
     * @param name NPC的名称
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
        super(scene, 'NPCIntelligentBehavior');
        this.scene = scene;

        // 1. 初始化Sprite对象 (模拟Game Boy风格，使用Tilemap坐标或简单Sprite)
        this.npcSprite = scene.add.sprite(x, y, texture).setOrigin(0.5, 0.5);
        this.scene.physics.add.existing(this.npcSprite); // 假设使用Phaser物理系统进行移动

        // 2. 初始化行为上下文
        this.context = {
            npcName: name,
            currentLocation: new Phaser.Math.Vector2(x, y),
            state: NPCState.IDLE,
            dailySchedule: this.generateDailySchedule(x, y), // 生成一个模拟的日常安排
            lastLLMResponse: '',
            isMoving: false,
        };

        // 3. 将自身添加到场景的更新列表，以便在场景更新时调用 update 方法
        scene.add.existing(this);
    }

    /**
     * 生成一个模拟的日常安排 (Game Boy风格的简单时间表)
     * 假设游戏时间从00:00到23:59，时间单位为分钟。
     * @param startX 初始X坐标
     * @param startY 初始Y坐标
     * @returns 日常安排列表
     */
    private generateDailySchedule(startX: number, startY: number): NPCContext['dailySchedule'] {
        const home = new Phaser.Math.Vector2(startX, startY);
        const work = new Phaser.Math.Vector2(startX + 100, startY);
        const shop = new Phaser.Math.Vector2(startX - 50, startY + 50);
        const play = new Phaser.Math.Vector2(startX + 50, startY - 100);

        return [
            { time: 480, activity: NPCState.MOVE_TO_WORK, location: work }, // 08:00 上班
            { time: 490, activity: NPCState.WORKING, location: work },      // 08:10 工作
            { time: 720, activity: NPCState.MOVE_TO_SHOP, location: shop }, // 12:00 购物
            { time: 730, activity: NPCState.SHOPPING, location: shop },     // 12:10 购物
            { time: 840, activity: NPCState.MOVE_TO_WORK, location: work }, // 14:00 返回工作
            { time: 1020, activity: NPCState.WORKING, location: work },     // 17:00 结束工作
            { time: 1030, activity: NPCState.MOVE_TO_PLAY, location: play },// 17:10 打球
            { time: 1140, activity: NPCState.PLAYING, location: play },     // 19:00 玩耍
            { time: 1260, activity: NPCState.RESTING, location: home },     // 21:00 休息
        ];
    }

    /**
     * 状态转换函数
     * @param newState 要转换到的新状态
     * @param targetLocation 新状态的目标位置
     */
    private transitionTo(newState: NPCState, targetLocation?: Phaser.Math.Vector2): void {
        console.log(`${this.context.npcName}: 状态从 ${this.context.state} 转换到 ${newState}`);
        this.context.state = newState;
        this.context.targetLocation = targetLocation;

        // 清除旧的活动计时器
        if (this.currentActivityTimer) {
            this.currentActivityTimer.remove(false);
            this.currentActivityTimer = null;
        }

        // 根据新状态执行进入逻辑
        switch (newState) {
            case NPCState.MOVE_TO_WORK:
            case NPCState.MOVE_TO_SHOP:
            case NPCState.MOVE_TO_PLAY:
                this.startMovement(targetLocation!);
                break;
            case NPCState.WORKING:
            case NPCState.SHOPPING:
            case NPCState.PLAYING:
            case NPCState.RESTING:
                // 设置一个计时器，模拟活动持续时间，时间到后转换到下一个状态
                const duration = Phaser.Math.Between(60, 180) * 1000; // 模拟 1-3 分钟的活动时间
                this.currentActivityTimer = this.scene.time.addEvent({
                    delay: duration,
                    callback: () => this.checkScheduleAndTransition(),
                    callbackScope: this,
                    loop: false
                });
                // 在进入活动状态时，调用LLM获取更具体的行为或对话
                this.callLLMForBehavior(newState);
                break;
            case NPCState.CHATTING:
                // 聊天状态需要外部触发 (如玩家交互)
                // 假设聊天持续 10 秒
                this.currentActivityTimer = this.scene.time.addEvent({
                    delay: 10000,
                    callback: () => this.transitionTo(NPCState.IDLE),
                    callbackScope: this,
                    loop: false
                });
                this.callLLMForBehavior(newState);
                break;
            case NPCState.IDLE:
                // IDLE状态下，每隔一段时间检查一次日程表
                this.currentActivityTimer = this.scene.time.addEvent({
                    delay: 5000,
                    callback: () => this.checkScheduleAndTransition(),
                    callbackScope: this,
                    loop: true
                });
                break;
            case NPCState.WAITING_FOR_LLM:
                // 仅用于内部状态管理，不设置活动计时器
                break;
        }
    }

    /**
     * 启动NPC移动到目标位置
     * @param target 目标位置
     */
    private startMovement(target: Phaser.Math.Vector2): void {
        this.context.isMoving = true;
        this.context.targetLocation = target;

        // 简单的移动逻辑：计算方向并设置速度 (Game Boy风格的简单移动)
        const dx = target.x - this.npcSprite.x;
        const dy = target.y - this.npcSprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 60; // 像素/秒

        if (distance > 1) {
            const duration = (distance / speed) * 1000;

            // 使用Tween进行平滑移动，模拟Game Boy风格的步进移动
            this.scene.tweens.add({
                targets: this.npcSprite,
                x: target.x,
                y: target.y,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    this.context.isMoving = false;
                    this.context.currentLocation.set(target.x, target.y);
                    // 移动完成后，转换到下一个活动状态
                    this.checkScheduleAndTransition(true);
                }
            });
        } else {
            // 已经到达，直接转换状态
            this.context.isMoving = false;
            this.checkScheduleAndTransition(true);
        }
    }

    /**
     * 检查日程表并转换状态
     * @param arrived 是否刚到达目标地点
     */
    private checkScheduleAndTransition(arrived: boolean = false): void {
        // 模拟当前游戏时间 (假设游戏每分钟对应现实1秒，或者使用一个全局时间管理器)
        // 这里简化为使用一个模拟的全局时间 (分钟)
        const simulatedGameTime = (this.scene.time.now / 1000) % 1440; // 0-1439 分钟 (一天)

        // 如果是移动完成后的检查，则转换到当前日程的活动状态
        if (arrived) {
            const currentSchedule = this.context.dailySchedule.find(s => 
                s.location.x === this.context.currentLocation.x && s.location.y === this.context.currentLocation.y
            );
            if (currentSchedule) {
                // 移动状态完成后，转换到对应的活动状态 (WORKING, SHOPPING, PLAYING等)
                const activityState = currentSchedule.activity;
                if (activityState !== this.context.state) { // 避免重复转换
                    this.transitionTo(activityState);
                    return;
                }
            }
        }

        // 检查日程表，看是否有新的活动开始
        for (const schedule of this.context.dailySchedule) {
            // 简单的时间匹配逻辑：如果当前时间接近日程时间，并且NPC处于IDLE或活动已结束
            if (Math.abs(simulatedGameTime - schedule.time) < 10 && this.context.state !== schedule.activity) {
                if (schedule.activity.startsWith('MOVE_TO')) {
                    // 如果是MOVE状态，直接转换
                    this.transitionTo(schedule.activity, schedule.location);
                    return;
                } else if (this.context.state === NPCState.IDLE || this.context.state === NPCState.RESTING) {
                    // 如果是活动状态，但NPC在IDLE，则开始移动到活动地点
                    const moveState = this.getCorrespondingMoveState(schedule.activity);
                    this.transitionTo(moveState, schedule.location);
                    return;
                }
            }
        }

        // 如果没有匹配的日程，且不在移动或活动中，则转换到IDLE
        if (!this.context.isMoving && this.currentActivityTimer === null && this.context.state !== NPCState.IDLE) {
            this.transitionTo(NPCState.IDLE);
        }
    }

    /**
     * 获取活动状态对应的移动状态
     * @param activityState 活动状态
     * @returns 对应的移动状态
     */
    private getCorrespondingMoveState(activityState: NPCState): NPCState {
        switch (activityState) {
            case NPCState.WORKING: return NPCState.MOVE_TO_WORK;
            case NPCState.SHOPPING: return NPCState.MOVE_TO_SHOP;
            case NPCState.PLAYING: return NPCState.MOVE_TO_PLAY;
            case NPCState.RESTING: return NPCState.RESTING; // 休息通常在原地或直接转换
            default: return NPCState.IDLE;
        }
    }


    /**
     * 调用大模型API获取行为细节或对话
     * @param state 当前的NPC状态
     */
    public callLLMForBehavior(state: NPCState): void {
        // 1. 检查冷却时间，避免API滥用
        if (this.llmCooldownTimer && this.llmCooldownTimer.getRemaining() > 0) {
            console.log(`${this.context.npcName}: LLM冷却中，跳过本次调用。`);
            return;
        }

        // 2. 设置冷却计时器
        this.llmCooldownTimer = this.scene.time.addEvent({
            delay: this.LLM_COOLDOWN_MS,
            callback: () => this.llmCooldownTimer = null,
            callbackScope: this,
            loop: false
        });

        // 3. 构造提示词
        const prompt = this.generateLLMPrompt(state);

        // 4. 转换到等待状态，防止在等待API期间重复调用或行为冲突
        const previousState = this.context.state;
        this.transitionTo(NPCState.WAITING_FOR_LLM);

        // 5. 异步调用模拟API
        mockLLMCall(prompt)
            .then(response => {
                this.context.lastLLMResponse = response;
                console.log(`${this.context.npcName} LLM Response: ${response}`);
                // 6. 恢复到之前的状态，并处理LLM的响应
                this.transitionTo(previousState);
                this.handleLLMResponse(response);
            })
            .catch(error => {
                console.error(`${this.context.npcName} LLM Error:`, error);
                // 7. 发生错误时，恢复到之前的状态
                this.transitionTo(previousState);
            });
    }

    /**
     * 根据当前状态生成LLM提示词
     * @param state 当前状态
     * @returns 提示词字符串
     */
    private generateLLMPrompt(state: NPCState): string {
        const basePrompt = `你是一个Game Boy风格宝可梦游戏中的NPC，名叫${this.context.npcName}。`;
        switch (state) {
            case NPCState.WORKING:
                return `${basePrompt}你现在正在工作。请描述你正在做什么，并说一句符合宝可梦世界观的台词。`;
            case NPCState.SHOPPING:
                return `${basePrompt}你现在正在购物。请描述你打算买什么，并说一句符合宝可梦世界观的台词。`;
            case NPCState.PLAYING:
                return `${basePrompt}你现在正在打球或进行娱乐活动。请描述你的活动，并说一句符合宝可梦世界观的台词。`;
            case NPCState.CHATTING:
                return `${basePrompt}你现在正在和玩家聊天。请说一句主动搭讪玩家的台词。`;
            default:
                return `${basePrompt}你现在处于空闲状态。请说一句简短的、符合宝可梦世界观的台词。`;
        }
    }

    /**
     * 处理LLM返回的响应
     * 在实际游戏中，这里可以解析JSON格式的响应，以获取更结构化的行为数据（如：移动目标、对话内容、物品交互等）。
     * @param response LLM的原始响应字符串
     */
    private handleLLMResponse(response: string): void {
        // 简单地将响应作为对话内容输出到控制台（或添加到对话队列）
        // 在Game Boy风格游戏中，这通常会触发一个对话框
        console.log(`[${this.context.npcName} 对话]: ${response}`);
    }

    /**
     * Phaser 3 场景更新循环方法
     * @param time 当前游戏时间
     * @param delta 自上一帧以来的时间差
     */
    public update(time: number, delta: number): void {
        // 确保在移动或等待LLM时，不进行状态转换检查
        if (this.context.isMoving || this.context.state === NPCState.WAITING_FOR_LLM) {
            return;
        }

        // 核心状态机逻辑：在IDLE状态下，定期检查日程
        if (this.context.state === NPCState.IDLE) {
            this.checkScheduleAndTransition();
        }

        // 可以在这里添加其他基于状态的更新逻辑，例如：
        // 1. 动画更新：根据状态和移动方向更新npcSprite的动画
        // 2. 交互检测：检测玩家是否靠近，如果靠近则转换到CHATTING状态
    }

    /**
     * 外部接口：与NPC开始聊天
     */
    public startChat(): void {
        if (this.context.state !== NPCState.CHATTING) {
            // 记录当前状态，以便聊天结束后恢复
            // 简化处理：直接转换到CHATTING
            this.transitionTo(NPCState.CHATTING);
        }
    }

    /**
     * 外部接口：获取NPC当前对话
     * @returns 当前的LLM对话响应
     */
    public getCurrentDialogue(): string {
        return this.context.lastLLMResponse;
    }

    /**
     * 外部接口：获取NPC的Sprite对象
     * @returns Phaser.GameObjects.Sprite
     */
    public getSprite(): Phaser.GameObjects.Sprite {
        return this.npcSprite;
    }

    /**
     * 外部接口：获取NPC的当前状态
     * @returns NPCState
     */
    public getState(): NPCState {
        return this.context.state;
    }

    // 性能优化和资源清理
    public destroy(fromScene?: boolean): void {
        if (this.currentActivityTimer) {
            this.currentActivityTimer.remove(false);
        }
        if (this.llmCooldownTimer) {
            this.llmCooldownTimer.remove(false);
        }
        this.npcSprite.destroy();
        super.destroy(fromScene);
    }
}

// -----------------------------------------------------------------------------
// 示例用法 (仅供参考，实际应在Phaser Scene中调用)
// -----------------------------------------------------------------------------
/*
class GameScene extends Phaser.Scene {
    private npcs: NPCIntelligentBehavior[] = [];

    preload() {
        // 加载NPC贴图，例如 'trainer_sprite'
        // this.load.spritesheet('trainer_sprite', 'assets/trainer.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // 创建一个NPC
        const npc1 = new NPCIntelligentBehavior(this, 100, 100, 'trainer_sprite', '宝可梦训练家小智');
        this.npcs.push(npc1);

        // 模拟玩家与NPC交互
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, npc1.getSprite().x, npc1.getSprite().y);
            if (distance < 50) {
                npc1.startChat();
            }
        });
    }

    update(time: number, delta: number) {
        this.npcs.forEach(npc => npc.update(time, delta));
    }
}
*/