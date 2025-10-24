// client/src/game/systems/TrainSystem.ts
import * as Phaser from 'phaser';

/**
 * Game Boy 风格的颜色调色板
 * 模拟 Game Boy 的四级灰度
 */
const GB_PALETTE = {
    // 颜色值使用十六进制表示，模拟Game Boy的绿色调
    DARKEST: 0x0f380f, // 最深色
    DARK: 0x306230,    // 深色
    LIGHT: 0x8bac0f,   // 浅色
    LIGHTEST: 0x9bbc0f  // 最浅色/背景色
};

/**
 * 训练课程数据结构
 */
interface TrainingCourse {
    id: string;
    name: string;
    description: string;
    durationSeconds: number;
    statBoost: { stat: string; amount: number };
    cost: number;
}

/**
 * 训练系统类 (TrainSystem)
 * 负责管理和显示游戏中的训练课程，具有Game Boy风格的界面。
 * 假设这个系统作为一个可叠加在主场景上的UI场景来实现。
 */
export class TrainSystem extends Phaser.Scene {
    // 场景的键名
    public static readonly KEY = 'TrainSystem';

    // 预设的训练课程列表
    private courses: TrainingCourse[] = [
        {
            id: 'strength_1',
            name: '基础俯卧撑',
            description: '提升少量力量。',
            durationSeconds: 10,
            statBoost: { stat: 'strength', amount: 1 },
            cost: 50
        },
        {
            id: 'agility_1',
            name: '敏捷跑圈',
            description: '提升少量敏捷。',
            durationSeconds: 15,
            statBoost: { stat: 'agility', amount: 1 },
            cost: 75
        },
        {
            id: 'endurance_1',
            name: '耐力长跑',
            description: '提升少量耐力。',
            durationSeconds: 20,
            statBoost: { stat: 'endurance', amount: 1 },
            cost: 100
        }
    ];

    // 当前选中的课程索引
    private selectedCourseIndex: number = 0;
    // UI元素
    private menuGraphics!: Phaser.GameObjects.Graphics;
    private courseTexts: Phaser.GameObjects.Text[] = [];
    private descriptionText!: Phaser.GameObjects.Text;
    private pointer!: Phaser.GameObjects.Text; // 模拟Game Boy选择指针

    constructor() {
        super({ key: TrainSystem.KEY });
    }

    /**
     * Phaser 场景的创建生命周期方法
     */
    create(): void {
        // 确保场景是透明的，以便看到下方的场景
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');
        
        // 绘制Game Boy风格的边框和背景
        this.drawGBWindow();

        // 创建课程列表文本
        this.createCourseList();

        // 创建描述文本区域
        this.createDescriptionArea();

        // 创建选择指针
        this.createPointer();

        // 监听键盘输入
        this.setupInput();

        // 初始更新UI
        this.updateSelection();

        console.log('TrainSystem initialized with Game Boy style UI.');
    }

    /**
     * 绘制Game Boy风格的窗口边框和背景
     */
    private drawGBWindow(): void {
        const width = 300;
        const height = 200;
        // 计算窗口中心位置
        const x = (this.sys.game.config.width as number) / 2 - width / 2;
        const y = (this.sys.game.config.height as number) / 2 - height / 2;
        const padding = 4;

        this.menuGraphics = this.add.graphics();

        // 1. 绘制最外层边框 (深色) - 模拟阴影或边框
        this.menuGraphics.fillStyle(GB_PALETTE.DARKEST, 1);
        this.menuGraphics.fillRect(x, y, width, height);

        // 2. 绘制内层边框 (浅色) - 模拟内凹效果
        this.menuGraphics.fillStyle(GB_PALETTE.LIGHT, 1);
        this.menuGraphics.fillRect(x + padding, y + padding, width - padding * 2, height - padding * 2);

        // 3. 绘制背景区域 (最浅色/背景色)
        this.menuGraphics.fillStyle(GB_PALETTE.LIGHTEST, 1);
        this.menuGraphics.fillRect(x + padding * 2, y + padding * 2, width - padding * 4, height - padding * 4);

        // 设置裁剪区域，确保文本不会溢出 (可选，但有助于保持界面整洁)
        // const maskShape = this.make.graphics();
        // maskShape.fillStyle(0xffffff);
        // maskShape.fillRect(x + padding * 2, y + padding * 2, width - padding * 4, height - padding * 4);
        // const mask = maskShape.createGeometryMask();
        // this.children.setMask(mask);
    }

    /**
     * 创建训练课程列表的文本对象
     */
    private createCourseList(): void {
        // 列表起始位置，位于窗口左上角
        const x = (this.sys.game.config.width as number) / 2 - 140;
        let y = (this.sys.game.config.height as number) / 2 - 80;
        const lineHeight = 20;

        this.courses.forEach((course, index) => {
            const text = this.add.text(x + 20, y + index * lineHeight, course.name, {
                fontFamily: 'monospace', // Game Boy 风格字体
                fontSize: '14px',
                color: `#${GB_PALETTE.DARKEST.toString(16)}`, // 字体颜色使用最深色
                padding: { x: 5, y: 2 }
            });
            text.setOrigin(0);
            this.courseTexts.push(text);
        });
    }

    /**
     * 创建课程描述文本区域
     */
    private createDescriptionArea(): void {
        const x = (this.sys.game.config.width as number) / 2 - 140;
        const y = (this.sys.game.config.height as number) / 2 + 20;

        // 描述区域的背景 (使用深色模拟标题栏或分隔线)
        this.menuGraphics.fillStyle(GB_PALETTE.DARK, 1);
        this.menuGraphics.fillRect(x + 8, y - 4, 284, 4); // 分隔线

        this.descriptionText = this.add.text(x + 10, y + 5, '选择一个课程...', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: `#${GB_PALETTE.DARKEST.toString(16)}`,
            wordWrap: { width: 280 }
        });
        this.descriptionText.setOrigin(0);
    }

    /**
     * 创建选择指针 (一个简单的箭头或方块)
     */
    private createPointer(): void {
        // 指针初始位置，会由 updateSelection 调整
        const x = (this.sys.game.config.width as number) / 2 - 140;
        const y = (this.sys.game.config.height as number) / 2 - 80;

        this.pointer = this.add.text(x + 5, y, '>', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: `#${GB_PALETTE.DARKEST.toString(16)}`
        });
        this.pointer.setOrigin(0);
        this.pointer.setVisible(true);
    }

    /**
     * 设置键盘输入监听
     */
    private setupInput(): void {
        // 监听上、下、A (确认)、B (取消) 键
        const cursors = this.input.keyboard.createCursorKeys();
        // 模拟Game Boy A键 (Z键)
        const keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); 
        // 模拟Game Boy B键 (X键)
        const keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X); 

        cursors.up.on('down', this.moveSelectionUp, this);
        cursors.down.on('down', this.moveSelectionDown, this);
        keyA.on('down', this.confirmSelection, this);
        keyB.on('down', this.cancelSystem, this);
    }

    /**
     * 向上移动选择
     */
    private moveSelectionUp(): void {
        if (this.selectedCourseIndex > 0) {
            this.selectedCourseIndex--;
            this.updateSelection();
        }
    }

    /**
     * 向下移动选择
     */
    private moveSelectionDown(): void {
        if (this.selectedCourseIndex < this.courses.length - 1) {
            this.selectedCourseIndex++;
            this.updateSelection();
        }
    }

    /**
     * 更新UI以反映当前选择
     */
    private updateSelection(): void {
        const selectedCourse = this.courses[this.selectedCourseIndex];

        // 1. 更新指针位置
        const targetText = this.courseTexts[this.selectedCourseIndex];
        this.pointer.setPosition(targetText.x - 15, targetText.y);

        // 2. 更新描述文本
        const description = [
            `课程: ${selectedCourse.name}`,
            `效果: ${selectedCourse.statBoost.stat.toUpperCase()} +${selectedCourse.statBoost.amount}`,
            `时长: ${selectedCourse.durationSeconds} 秒`,
            `费用: ${selectedCourse.cost} 金币`,
            `\n${selectedCourse.description}`
        ].join('\n');
        this.descriptionText.setText(description);

        // 3. 突出显示选中的文本 (模拟Game Boy反色效果)
        this.courseTexts.forEach((text, index) => {
            if (index === this.selectedCourseIndex) {
                // 选中：深色背景，浅色前景
                text.setBackgroundColor(`#${GB_PALETTE.DARK.toString(16)}`);
                text.setColor(`#${GB_PALETTE.LIGHTEST.toString(16)}`);
            } else {
                // 未选中：透明背景，深色前景
                text.setBackgroundColor('transparent');
                text.setColor(`#${GB_PALETTE.DARKEST.toString(16)}`);
            }
        });
    }

    /**
     * 确认选择并开始训练
     */
    private confirmSelection(): void {
        const course = this.courses[this.selectedCourseIndex];
        
        // 实际游戏中，这里会进行以下操作：
        // 1. 检查玩家的金币是否足够 (this.checkCost(course.cost))
        // 2. 扣除金币 (this.deductCost(course.cost))
        // 3. 启动一个计时器或状态，表示玩家正在训练 (this.startTraining(course))
        // 4. 训练完成后，应用属性提升 (this.applyStatBoost(course.statBoost))
        
        // 简化实现：直接在控制台输出训练信息，并模拟训练计时器
        console.log(`[TrainSystem] 玩家开始训练: ${course.name}`);
        console.log(`[TrainSystem] 训练时长: ${course.durationSeconds} 秒`);
        console.log(`[TrainSystem] 属性提升: ${course.statBoost.stat.toUpperCase()} +${course.statBoost.amount}`);

        // 模拟一个简单的训练过程反馈
        this.descriptionText.setText(`开始训练 ${course.name}...\n请等待 ${course.durationSeconds} 秒。\n\n(按 B 键退出)`);
        
        // 禁用输入，防止重复启动或移动选择
        this.input.keyboard.enabled = false;

        // 模拟训练计时器
        this.time.delayedCall(course.durationSeconds * 1000, () => {
            console.log(`[TrainSystem] 训练 ${course.name} 完成！`);
            this.descriptionText.setText(`训练 ${course.name} 完成！\n${course.statBoost.stat.toUpperCase()} 提升了 ${course.statBoost.amount} 点。\n\n(按 B 键退出)`);
            this.input.keyboard.enabled = true; // 重新启用输入
        }, [], this);
    }

    /**
     * 取消或退出训练系统
     */
    private cancelSystem(): void {
        // 停止训练系统场景
        this.scene.stop(TrainSystem.KEY);
        // 如果有主场景，可以重新激活主场景的更新和输入
        // this.scene.resume('MainGameScene');
        console.log('[TrainSystem] 训练系统已退出。');
    }

    // --- 辅助方法 (在实际游戏中需要实现) ---
    // 实际的 checkCost, deductCost, startTraining, applyStatBoost 等方法需要与游戏状态管理集成
}

// -----------------------------------------------------------------------------------
// 易于集成示例：
// 假设主场景 (MainGameScene) 想要启动训练系统：
//
// import { TrainSystem } from './systems/TrainSystem';
//
// class MainGameScene extends Phaser.Scene {
//     // ... 其他场景逻辑 ...
//
//     // 当玩家与训练师互动时调用
//     startTraining(): void {
//         // 启动 TrainSystem 场景，并使其叠加在当前场景之上
//         this.scene.launch(TrainSystem.KEY); 
//         // 暂停主场景的更新和输入，直到 TrainSystem 退出
//         // this.scene.pause(); 
//     }
// }
// -----------------------------------------------------------------------------------