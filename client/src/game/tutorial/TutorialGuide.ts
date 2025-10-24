/**
 * client/src/game/tutorial/TutorialGuide.ts
 * 篮球主题游戏 - 教程引导系统
 *
 * 要求:
 * 1. 完整数据库 (使用常量数据结构模拟)
 * 2. 高质量内容 (符合篮球主题, 引导清晰)
 * 3. 符合篮球主题
 */

// 1. 定义数据结构
// 教程步骤类型
export interface TutorialStep {
    id: number; // 步骤ID
    title: string; // 步骤标题
    content: string; // 步骤内容/描述
    highlightElement?: string; // 需要高亮的UI元素ID或选择器
    actionRequired?: 'click' | 'input' | 'swipe' | 'none'; // 需要用户执行的动作
    nextStepCondition?: string; // 进入下一步的条件描述 (例如: '完成投篮' 或 '点击确定')
}

// 教程模块类型
export interface TutorialModule {
    moduleId: string; // 模块唯一ID (例如: 'basic_movement', 'shooting_mechanics')
    name: string; // 模块名称
    description: string; // 模块简介
    steps: TutorialStep[]; // 模块包含的步骤
}

// 2. 完整数据库 (教程内容)
const TUTORIAL_DATABASE: TutorialModule[] = [
    {
        moduleId: 'basic_movement',
        name: '基础运球与移动',
        description: '学习如何在球场上自由移动和控制球。',
        steps: [
            {
                id: 101,
                title: '欢迎来到球场',
                content: '篮球的旅程从这里开始。首先，你需要掌握基本的移动。',
                highlightElement: '#game-start-button',
                actionRequired: 'click',
                nextStepCondition: '点击“开始训练”按钮',
            },
            {
                id: 102,
                title: '掌握方向',
                content: '使用左侧摇杆（或WASD键）控制球员移动。尝试向各个方向移动。',
                highlightElement: '#joystick-area',
                actionRequired: 'swipe',
                nextStepCondition: '成功移动至指定区域',
            },
            {
                id: 103,
                title: '运球节奏',
                content: '运球是进攻的基础。球在你手中时，移动速度会略微降低。',
                highlightElement: '#dribble-status-icon',
                actionRequired: 'none',
                nextStepCondition: '系统自动进入下一步',
            },
        ],
    },
    {
        moduleId: 'shooting_mechanics',
        name: '投篮技巧',
        description: '学习如何进行有效的投篮，命中率是得分的关键。',
        steps: [
            {
                id: 201,
                title: '寻找空位',
                content: '在没有防守干扰的情况下投篮是最好的选择。移动到三分线外指定的投篮点。',
                highlightElement: '#shooting-spot-3pt',
                actionRequired: 'swipe',
                nextStepCondition: '到达指定投篮点',
            },
            {
                id: 202,
                title: '出手时机',
                content: '长按右下角的“投篮”按钮，当能量条达到绿色区域时松开，以获得完美命中。',
                highlightElement: '#shoot-button',
                actionRequired: 'input', // 模拟长按后松开
                nextStepCondition: '完成一次投篮尝试',
            },
            {
                id: 203,
                title: '罚球线练习',
                content: '罚球是送分题。前往罚球线，练习10次罚球。',
                highlightElement: '#free-throw-line',
                actionRequired: 'input',
                nextStepCondition: '命中5次罚球',
            },
        ],
    },
    {
        moduleId: 'defense_basics',
        name: '防守基础',
        description: '优秀的防守能为你带来更多进攻机会。',
        steps: [
            {
                id: 301,
                title: '贴身防守',
                content: '使用“紧逼”按钮（或Shift键）贴近持球人，限制他的移动和视野。',
                highlightElement: '#defense-press-button',
                actionRequired: 'click',
                nextStepCondition: '成功紧逼对手3秒',
            },
            {
                id: 302,
                title: '抢断时机',
                content: '在对手运球时，看准时机点击“抢断”按钮。注意：时机不对会犯规！',
                highlightElement: '#steal-button',
                actionRequired: 'click',
                nextStepCondition: '成功抢断一次',
            },
        ],
    },
];

// 3. 实现 TutorialGuide 类
export class TutorialGuide {
    private currentModuleId: string | null = null;
    private currentStepId: number | null = null;
    private isTutorialActive: boolean = false;

    constructor() {
        console.log('TutorialGuide: 教程系统初始化完成。');
    }

    /**
     * 获取所有可用的教程模块列表
     * @returns {TutorialModule[]} 教程模块数组
     */
    public getAllModules(): TutorialModule[] {
        // 返回数据库的副本以防止外部修改
        return JSON.parse(JSON.stringify(TUTORIAL_DATABASE));
    }

    /**
     * 根据模块ID开始一个教程
     * @param {string} moduleId - 要开始的教程模块ID
     * @returns {boolean} 是否成功开始教程
     */
    public startTutorial(moduleId: string): boolean {
        const module = TUTORIAL_DATABASE.find(m => m.moduleId === moduleId);
        if (!module || module.steps.length === 0) {
            console.error(`TutorialGuide: 模块ID ${moduleId} 不存在或无步骤。`);
            return false;
        }

        this.currentModuleId = moduleId;
        this.currentStepId = module.steps[0].id;
        this.isTutorialActive = true;
        console.log(`TutorialGuide: 开始教程模块 - ${module.name}`);
        this.displayCurrentStep();
        return true;
    }

    /**
     * 结束当前正在进行的教程
     */
    public endTutorial(): void {
        if (this.isTutorialActive) {
            console.log(`TutorialGuide: 教程模块 ${this.currentModuleId} 已结束。`);
            this.currentModuleId = null;
            this.currentStepId = null;
            this.isTutorialActive = false;
            // 通知UI层隐藏教程提示
            this.hideTutorialUI();
        }
    }

    /**
     * 推进到教程的下一步
     * @returns {TutorialStep | null} 下一步骤对象，如果教程结束则返回 null
     */
    public nextStep(): TutorialStep | null {
        if (!this.isTutorialActive || !this.currentModuleId || this.currentStepId === null) {
            return null;
        }

        const module = TUTORIAL_DATABASE.find(m => m.moduleId === this.currentModuleId);
        if (!module) {
            this.endTutorial();
            return null;
        }

        const currentStepIndex = module.steps.findIndex(s => s.id === this.currentStepId);
        const nextStepIndex = currentStepIndex + 1;

        if (nextStepIndex < module.steps.length) {
            const nextStep = module.steps[nextStepIndex];
            this.currentStepId = nextStep.id;
            this.displayCurrentStep();
            return nextStep;
        } else {
            // 模块结束
            this.endTutorial();
            return null;
        }
    }

    /**
     * 获取当前步骤的信息
     * @returns {TutorialStep | null} 当前步骤对象
     */
    public getCurrentStep(): TutorialStep | null {
        if (!this.isTutorialActive || !this.currentModuleId || this.currentStepId === null) {
            return null;
        }

        const module = TUTORIAL_DATABASE.find(m => m.moduleId === this.currentModuleId);
        if (!module) return null;

        return module.steps.find(s => s.id === this.currentStepId) || null;
    }

    /**
     * 模拟显示当前步骤的UI提示 (在实际游戏中，这会触发UI层面的逻辑)
     */
    private displayCurrentStep(): void {
        const step = this.getCurrentStep();
        if (step) {
            console.log(`--- 当前步骤: ${step.title} ---`);
            console.log(`内容: ${step.content}`);
            console.log(`高亮元素: ${step.highlightElement || '无'}`);
            console.log(`所需动作: ${step.actionRequired || '无'}`);
            console.log(`下一步条件: ${step.nextStepCondition || '无'}`);
            // 实际游戏中，这里会调用一个UI服务来显示气泡、高亮等
            // 例如: UIManager.showTutorialTip(step);
        }
    }

    /**
     * 模拟隐藏教程UI
     */
    private hideTutorialUI(): void {
        console.log('--- 教程UI已隐藏 ---');
        // 实际游戏中: UIManager.hideTutorialTip();
    }

    /**
     * 外部事件触发器：用于检查是否满足进入下一步的条件
     * @param {string} eventName - 触发的事件名称 (例如: 'onShootCompleted', 'onAreaEntered')
     * @param {any} eventData - 事件相关数据
     * @returns {boolean} 如果成功进入下一步，则返回 true
     */
    public handleGameEvent(eventName: string, eventData?: any): boolean {
        const currentStep = this.getCurrentStep();
        if (!currentStep || !this.isTutorialActive) {
            return false;
        }

        // 这是一个简化的检查逻辑，实际游戏中需要更复杂的条件判断
        // 例如，如果当前步骤要求 '完成一次投篮尝试'，并且收到了 'onShootCompleted' 事件
        if (eventName === 'onShootCompleted' && currentStep.nextStepCondition === '完成一次投篮尝试') {
            console.log('事件匹配: 完成投篮尝试');
            this.nextStep();
            return true;
        }

        if (eventName === 'onAreaEntered' && currentStep.nextStepCondition === '到达指定投篮点') {
            console.log('事件匹配: 到达指定投篮点');
            this.nextStep();
            return true;
        }

        // 模拟一个通用的点击事件推进
        if (eventName === 'onClick' && currentStep.actionRequired === 'click') {
             // 假设所有点击都能推进，除非有更具体的条件
             if (currentStep.nextStepCondition === '点击“开始训练”按钮') {
                console.log('事件匹配: 点击开始训练按钮');
                this.nextStep();
                return true;
             }
        }

        return false;
    }
}

// 示例用法 (仅用于演示，实际在游戏模块中调用)
/*
const tutorial = new TutorialGuide();
const modules = tutorial.getAllModules();
console.log('可用模块:', modules.map(m => m.name));

// 开始基础运球教程
tutorial.startTutorial('basic_movement');

// 模拟用户操作，推进步骤
// 模拟点击“开始训练”按钮
tutorial.handleGameEvent('onClick', { elementId: '#game-start-button' });

// 模拟用户移动到指定区域
tutorial.handleGameEvent('onAreaEntered', { areaId: 'start_zone' });

// 模拟系统自动进入下一步 (nextStepCondition: '系统自动进入下一步')
tutorial.nextStep();

// 结束教程
tutorial.endTutorial();
*/
