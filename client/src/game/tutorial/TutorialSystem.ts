import * as Phaser from 'phaser';

/**
 * @interface TutorialStep
 * @description 定义教程中的一个步骤所包含的数据结构。
 * 生产级代码应使用更强大的数据驱动方式（如JSON配置）来定义步骤，
 * 此处为简化示例，直接在代码中定义接口。
 */
interface TutorialStep {
    /** 步骤的唯一标识符。 */
    id: string;
    /** 步骤的文本说明，用于显示给玩家。 */
    text: string;
    /** 步骤的目标对象或UI元素的键名，用于高亮显示。 */
    targetKey: string;
    /** 步骤完成的触发器类型，例如 'click', 'move', 'action' 等。 */
    triggerType: 'click' | 'move' | 'action' | 'timed';
    /** 触发器所需的值，例如点击的按钮ID或移动到的坐标。 */
    triggerValue?: string | number | { x: number, y: number };
    /** 步骤开始时执行的回调函数。 */
    onStart?: (scene: Phaser.Scene) => void;
    /** 步骤完成时执行的回调函数。 */
    onComplete?: (scene: Phaser.Scene) => void;
}

/**
 * @class TutorialSystem
 * @description 游戏的新手引导系统。负责管理教程的步骤、显示提示和高亮目标。
 * 这是一个生产级质量的示例，注重模块化、可维护性和清晰的逻辑。
 */
export class TutorialSystem {
    private scene: Phaser.Scene;
    private steps: TutorialStep[];
    private currentStepIndex: number = -1;
    private isTutorialActive: boolean = false;
    private overlay: Phaser.GameObjects.Graphics | null = null;
    private promptText: Phaser.GameObjects.Text | null = null;
    private highlightRect: Phaser.GameObjects.Graphics | null = null;

    /**
     * @constructor
     * @param scene 当前的Phaser场景。
     * @param steps 教程步骤的数组。
     */
    constructor(scene: Phaser.Scene, steps: TutorialStep[]) {
        this.scene = scene;
        this.steps = steps;
        // 确保场景在销毁时清理资源
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);

        // 检查教程是否已完成（生产环境中应从本地存储或服务器获取）
        if (this.checkIfCompleted()) {
            console.log('Tutorial already completed. Skipping.');
            return;
        }

        // 注册事件监听器
        this.registerGlobalListeners();
    }

    /**
     * @private
     * @method checkIfCompleted
     * @returns {boolean} 检查教程是否已完成。
     */
    private checkIfCompleted(): boolean {
        // 实际应用中，这里会读取 localStorage 或用户数据
        // return localStorage.getItem('tutorial_completed') === 'true';
        return false; // 示例中默认未完成
    }

    /**
     * @private
     * @method setCompleted
     * @description 标记教程为已完成。
     */
    private setCompleted(): void {
        // 实际应用中，这里会写入 localStorage 或用户数据
        // localStorage.setItem('tutorial_completed', 'true');
        console.log('Tutorial completed and marked as finished.');
    }

    /**
     * @private
     * @method registerGlobalListeners
     * @description 注册全局事件监听器，用于监听游戏中的特定动作。
     */
    private registerGlobalListeners(): void {
        // 示例：监听场景中的全局点击事件（需要游戏其他部分触发此事件）
        this.scene.events.on('tutorial_trigger', this.handleTrigger, this);
        console.log('TutorialSystem: Global trigger listener registered.');
    }

    /**
     * @private
     * @method removeGlobalListeners
     * @description 移除全局事件监听器。
     */
    private removeGlobalListeners(): void {
        this.scene.events.off('tutorial_trigger', this.handleTrigger, this);
        console.log('TutorialSystem: Global trigger listener removed.');
    }

    /**
     * @private
     * @method handleTrigger
     * @param {string} type 触发器类型。
     * @param {any} value 触发器值。
     * @description 处理游戏事件触发，检查是否满足当前步骤的完成条件。
     */
    private handleTrigger(type: string, value: any): void {
        if (!this.isTutorialActive || this.currentStepIndex === -1) {
            return;
        }

        const currentStep = this.steps[this.currentStepIndex];

        if (currentStep.triggerType === type) {
            // 简单比较触发值，实际应用中可能需要更复杂的逻辑
            if (currentStep.triggerValue === undefined || currentStep.triggerValue === value) {
                console.log(`TutorialSystem: Step ${currentStep.id} triggered by ${type}:${value}`);
                this.nextStep();
            }
        }
    }

    /**
     * @public
     * @method start
     * @description 开始新手教程。
     */
    public start(): void {
        if (this.isTutorialActive) return;

        this.isTutorialActive = true;
        this.currentStepIndex = -1; // 从第一步开始
        console.log('TutorialSystem: Starting tutorial...');
        this.nextStep();
    }

    /**
     * @public
     * @method skip
     * @description 跳过新手教程。
     */
    public skip(): void {
        if (!this.isTutorialActive) return;

        console.log('TutorialSystem: Skipping tutorial.');
        this.isTutorialActive = false;
        this.currentStepIndex = this.steps.length; // 设置索引到末尾
        this.cleanupVisuals();
        this.setCompleted();
        this.removeGlobalListeners();
        // 可以在这里触发一个教程跳过事件
        this.scene.events.emit('tutorial_skipped');
    }

    /**
     * @private
     * @method nextStep
     * @description 推进到教程的下一个步骤。
     */
    private nextStep(): void {
        // 清理上一步的视觉元素
        this.cleanupVisuals();

        this.currentStepIndex++;

        if (this.currentStepIndex >= this.steps.length) {
            this.finish();
            return;
        }

        const step = this.steps[this.currentStepIndex];
        console.log(`TutorialSystem: Starting step ${step.id}`);

        // 步骤开始回调
        if (step.onStart) {
            step.onStart(this.scene);
        }

        // 设置视觉元素
        this.setupVisuals(step);

        // 特殊处理 'timed' 触发器
        if (step.triggerType === 'timed' && typeof step.triggerValue === 'number') {
            this.scene.time.delayedCall(step.triggerValue, () => {
                // 确保在延迟结束后当前步骤没有变化
                if (this.isTutorialActive && this.steps[this.currentStepIndex] === step) {
                    this.nextStep();
                }
            });
        }
    }

    /**
     * @private
     * @method finish
     * @description 结束新手教程。
     */
    private finish(): void {
        console.log('TutorialSystem: Tutorial finished successfully.');
        this.isTutorialActive = false;
        this.cleanupVisuals();
        this.setCompleted();
        this.removeGlobalListeners();
        // 触发教程完成事件
        this.scene.events.emit('tutorial_completed');
    }

    /**
     * @private
     * @method setupVisuals
     * @param {TutorialStep} step 当前的教程步骤。
     * @description 设置当前步骤的视觉提示，包括遮罩、高亮和文本。
     */
    private setupVisuals(step: TutorialStep): void {
        const { width, height } = this.scene.sys.game.canvas;

        // 1. 创建半透明遮罩
        this.overlay = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } });
        this.overlay.fillRect(0, 0, width, height);
        this.overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        this.overlay.setScrollFactor(0); // 确保不随摄像机移动
        this.overlay.setDepth(1000); // 设置高深度，确保在最上层

        let targetBounds: Phaser.Geom.Rectangle | null = null;
        let targetObject: Phaser.GameObjects.GameObject | null = null;

        // 2. 查找目标对象并计算边界
        // 假设目标对象可以通过场景的data或特定的管理器访问
        // 生产级代码需要一个可靠的机制来查找UI或游戏对象
        targetObject = this.scene.children.getByName(step.targetKey);

        if (targetObject && targetObject.displayOriginX !== undefined) {
             // 对于Phaser.GameObjects.GameObject，尝试获取其边界
             const bounds = targetObject.getBounds();
             targetBounds = new Phaser.Geom.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
        } else {
            console.warn(`TutorialSystem: Target object with key ${step.targetKey} not found or not a valid GameObject.`);
            // 如果找不到目标，则高亮屏幕中心或不进行高亮
            targetBounds = new Phaser.Geom.Rectangle(width / 2 - 100, height / 2 - 50, 200, 100);
        }
        
        // 3. 创建高亮遮罩（镂空效果）
        if (targetBounds) {
            this.highlightRect = this.scene.add.graphics({ lineStyle: { width: 5, color: 0xffff00, alpha: 1 } });
            this.highlightRect.setScrollFactor(0);
            this.highlightRect.setDepth(1001);
            this.highlightRect.strokeRect(targetBounds.x, targetBounds.y, targetBounds.width, targetBounds.height);
            
            // 尝试将目标对象提升到遮罩之上
            if (targetObject) {
                this.scene.children.bringToTop(targetObject);
                // 确保目标对象也能响应交互
                if (targetObject.input) {
                    targetObject.input.enabled = true;
                }
            }

            // 镂空效果的实现：
            // 1. 销毁旧的遮罩
            this.overlay.destroy();
            // 2. 重新创建遮罩并使用裁剪路径或Graphics的fill方法实现镂空
            this.overlay = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } });
            this.overlay.setDepth(1000);
            this.overlay.setScrollFactor(0);

            // 绘制一个覆盖全屏的矩形
            this.overlay.fillRect(0, 0, width, height);

            // 使用Graphics的clear方法来模拟镂空（需要复杂设置，这里简化为只绘制高亮边框）
            // 真正的镂空需要使用Canvas的裁剪路径或Render Texture，超出了基本示例的范围。
            // 简单起见，我们只用半透明遮罩和高亮边框。
        }

        // 4. 创建提示文本
        this.promptText = this.scene.add.text(width / 2, targetBounds.y > height / 2 ? 50 : height - 50, step.text, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 },
            wordWrap: { width: width * 0.8 }
        });
        this.promptText.setOrigin(0.5);
        this.promptText.setScrollFactor(0);
        this.promptText.setDepth(1002);
        this.promptText.setInteractive(); // 文本本身不应阻止点击，但可以用于显示跳过按钮

        // 5. 添加一个“跳过”按钮（简单文本）
        const skipButton = this.scene.add.text(width - 10, 10, '跳过 (Skip)', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ff0000',
            backgroundColor: '#333333',
            padding: { x: 5, y: 2 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(1002);

        skipButton.on('pointerup', () => {
            this.skip();
        });

        // 将跳过按钮添加到清理列表
        this.scene.data.set('tutorial_skip_button', skipButton);
    }

    /**
     * @private
     * @method cleanupVisuals
     * @description 清理当前步骤的视觉元素。
     */
    private cleanupVisuals(): void {
        if (this.overlay) {
            this.overlay.destroy();
            this.overlay = null;
        }
        if (this.promptText) {
            this.promptText.destroy();
            this.promptText = null;
        }
        if (this.highlightRect) {
            this.highlightRect.destroy();
            this.highlightRect = null;
        }
        
        // 清理跳过按钮
        const skipButton = this.scene.data.get('tutorial_skip_button');
        if (skipButton) {
            skipButton.destroy();
            this.scene.data.remove('tutorial_skip_button');
        }

        // 确保目标对象恢复正常交互状态（如果需要）
        // 生产级代码需要跟踪哪些对象被修改了交互状态
    }

    /**
     * @public
     * @method destroy
     * @description 销毁系统，清理所有资源和监听器。
     */
    public destroy(): void {
        this.skip(); // 确保清理视觉元素和监听器
        this.steps = [];
        console.log('TutorialSystem: Destroyed.');
    }
}

// --------------------------------------------------------------------------------
// 示例用法：如何定义和运行教程
// --------------------------------------------------------------------------------

/**
 * @function createTutorialSteps
 * @description 创建一个示例教程步骤列表。
 * @returns {TutorialStep[]} 教程步骤数组。
 */
export function createTutorialSteps(): TutorialStep[] {
    return [
        {
            id: 'welcome',
            text: '欢迎来到游戏！本教程将引导你了解基本操作。点击屏幕任意位置继续...',
            targetKey: 'game_area', // 假设有一个名为 'game_area' 的对象或区域
            triggerType: 'click',
            triggerValue: 'overlay_click', // 触发值，用于区分不同的点击事件
            onStart: (scene) => {
                // 可以在这里暂停游戏或显示欢迎动画
                console.log('Step 1: Welcome started.');
            },
            onComplete: (scene) => {
                console.log('Step 1: Welcome completed.');
            }
        },
        {
            id: 'move_button',
            text: '这是你的移动按钮。请点击它来前进。',
            targetKey: 'move_button_ui', // 假设UI中有一个名为 'move_button_ui' 的按钮
            triggerType: 'click',
            triggerValue: 'move_button_clicked',
            onStart: (scene) => {
                // 确保移动按钮是可点击的
                const moveButton = scene.children.getByName('move_button_ui');
                if (moveButton && moveButton.input) {
                    moveButton.input.enabled = true;
                    // 监听按钮点击事件，并在点击时发出 'tutorial_trigger' 事件
                    moveButton.on('pointerup', () => {
                        scene.events.emit('tutorial_trigger', 'click', 'move_button_clicked');
                    });
                }
            }
        },
        {
            id: 'inventory',
            text: '很好！现在，请注意你的背包图标。点击它打开背包。',
            targetKey: 'inventory_icon',
            triggerType: 'click',
            triggerValue: 'inventory_opened',
            onStart: (scene) => {
                // 假设游戏其他部分在背包打开时会触发 'tutorial_trigger', 'click', 'inventory_opened'
            }
        },
        {
            id: 'wait_for_info',
            text: '请阅读背包中的物品说明。等待3秒后自动进入下一步。',
            targetKey: 'inventory_panel',
            triggerType: 'timed',
            triggerValue: 3000, // 3秒
        },
        {
            id: 'final_step',
            text: '恭喜！你已经完成了新手教程。祝你游戏愉快！',
            targetKey: 'game_area',
            triggerType: 'click', // 再次点击屏幕结束
            triggerValue: 'overlay_click',
        }
    ];
}

// --------------------------------------------------------------------------------
// 注意：
// 1. 为了让这个系统真正运行，你需要在一个Phaser场景中实例化它，并确保场景中存在
//    具有相应 name 属性 ('move_button_ui', 'inventory_icon' 等) 的 GameObject。
// 2. 游戏中的交互逻辑（如点击按钮、打开背包）需要在完成动作后，主动调用
//    `scene.events.emit('tutorial_trigger', type, value)` 来通知教程系统。
// --------------------------------------------------------------------------------
