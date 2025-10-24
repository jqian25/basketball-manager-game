import Phaser from 'phaser';

/**
 * 对话框的配置接口
 */
export interface DialogueConfig {
    /** 对话框的宽度 */
    width: number;
    /** 对话框的高度 */
    height: number;
    /** 对话框的X坐标 */
    x: number;
    /** 对话框的Y坐标 */
    y: number;
    /** 字体大小 */
    fontSize?: number;
    /** 字体颜色 */
    fontColor?: string;
    /** 打字机效果的速度 (毫秒/字符) */
    typeSpeed?: number;
    /** 对话框背景颜色 */
    boxFillColor?: number;
    /** 对话框边框颜色 */
    boxBorderColor?: number;
    /** 对话框边框宽度 */
    boxBorderThickness?: number;
    /** 头像尺寸 */
    avatarSize?: number;
}

/**
 * 对话行的数据接口
 */
export interface DialogueLine {
    /** 要显示的文本内容 */
    text: string;
    /** 可选的头像图片键名 */
    avatarKey?: string;
    /** 选项列表 (如果存在，则为对话的结束行) */
    options?: DialogueOption[];
}

/**
 * 对话选项的数据接口
 */
export interface DialogueOption {
    /** 选项显示的文本 */
    text: string;
    /** 选项被选中时返回的值或执行的回调函数 */
    value: string | ((scene: Phaser.Scene) => void);
}

/**
 * 宝可梦风格的NPC对话系统
 * 
 * 特点:
 * 1. 经典Game Boy风格的UI。
 * 2. 支持打字机效果。
 * 3. 支持头像显示。
 * 4. 支持多选项选择。
 * 5. 高度可配置和可扩展。
 */
export class DialogueSystem {
    private scene: Phaser.Scene;
    private config: DialogueConfig;
    private container: Phaser.GameObjects.Container;
    private dialogueBox: Phaser.GameObjects.Graphics;
    private dialogueText: Phaser.GameObjects.Text;
    private avatarImage: Phaser.GameObjects.Image | null = null;
    private optionsContainer: Phaser.GameObjects.Container | null = null;

    private currentDialogue: DialogueLine[] = [];
    private currentLineIndex: number = 0;
    private isTyping: boolean = false;
    private onDialogueComplete: (() => void) | null = null;

    /** 默认配置 */
    private static DEFAULT_CONFIG: Partial<DialogueConfig> = {
        fontSize: 16,
        fontColor: '#FFFFFF',
        typeSpeed: 50, // 50ms per character
        boxFillColor: 0x000000,
        boxBorderColor: 0xFFFFFF,
        boxBorderThickness: 2,
        avatarSize: 64,
    };

    /**
     * 构造函数
     * @param scene 场景实例
     * @param config 对话框配置
     */
    constructor(scene: Phaser.Scene, config: DialogueConfig) {
        this.scene = scene;
        this.config = { ...DialogueSystem.DEFAULT_CONFIG, ...config };

        // 创建主容器
        this.container = this.scene.add.container(this.config.x, this.config.y);
        this.container.setDepth(1000); // 确保在最上层
        this.container.setVisible(false);

        // 绘制对话框背景和边框
        this.dialogueBox = this.scene.add.graphics();
        this.drawDialogueBox();
        this.container.add(this.dialogueBox);

        // 创建文本对象
        this.dialogueText = this.scene.add.text(
            this.config.avatarSize! + 16, // 文本起始位置在头像右侧留出一定边距
            16,
            '',
            {
                fontFamily: 'PixelFont, monospace', // 假设已加载像素字体
                fontSize: `${this.config.fontSize}px`,
                color: this.config.fontColor,
                wordWrap: { width: this.config.width - this.config.avatarSize! - 32 } // 减去头像宽度和两侧边距
            }
        );
        this.container.add(this.dialogueText);

        // 监听场景的更新事件，用于打字机效果
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * 绘制对话框的Game Boy风格矩形
     */
    private drawDialogueBox(): void {
        const { width, height, boxFillColor, boxBorderColor, boxBorderThickness } = this.config;

        this.dialogueBox.clear();

        // 绘制边框
        this.dialogueBox.lineStyle(boxBorderThickness!, boxBorderColor!, 1);
        this.dialogueBox.strokeRect(0, 0, width, height);

        // 绘制填充
        this.dialogueBox.fillStyle(boxFillColor!, 0.95);
        this.dialogueBox.fillRect(boxBorderThickness!, boxBorderThickness!, width - boxBorderThickness! * 2, height - boxBorderThickness! * 2);
    }

    /**
     * 显示对话系统并开始对话
     * @param dialogue 对话内容列表
     * @param onComplete 对话结束时的回调函数
     */
    public startDialogue(dialogue: DialogueLine[], onComplete?: () => void): void {
        if (this.container.visible) {
            console.warn('Dialogue is already active.');
            return;
        }

        this.currentDialogue = dialogue;
        this.currentLineIndex = 0;
        this.onDialogueComplete = onComplete || null;

        this.container.setVisible(true);
        this.scene.input.keyboard.on('keydown-SPACE', this.handleInput, this);
        this.scene.input.on('pointerdown', this.handleInput, this);

        this.showNextLine();
    }

    /**
     * 隐藏对话系统
     */
    public hide(): void {
        this.container.setVisible(false);
        this.scene.input.keyboard.off('keydown-SPACE', this.handleInput, this);
        this.scene.input.off('pointerdown', this.handleInput, this);
        this.clearOptions();
        this.clearAvatar();
        this.isTyping = false;
        this.currentDialogue = [];
        this.currentLineIndex = 0;
        this.onDialogueComplete = null;
    }

    /**
     * 处理用户输入 (空格键或鼠标点击)
     */
    private handleInput(): void {
        if (!this.container.visible) return;

        if (this.isTyping) {
            // 如果正在打字，则立即显示全部文本
            this.completeTyping();
        } else if (!this.currentDialogue[this.currentLineIndex - 1]?.options) {
            // 如果文本已显示完毕且不是选项行，则显示下一行
            this.showNextLine();
        }
        // 如果是选项行，则等待选项被选中
    }

    /**
     * 显示下一行对话
     */
    private showNextLine(): void {
        this.clearOptions(); // 确保清除旧的选项

        if (this.currentLineIndex >= this.currentDialogue.length) {
            // 对话结束
            this.hide();
            this.onDialogueComplete?.();
            return;
        }

        const line = this.currentDialogue[this.currentLineIndex];
        this.updateAvatar(line.avatarKey);
        this.startTyping(line.text);

        this.currentLineIndex++;
    }

    /**
     * 更新头像显示
     * @param avatarKey 头像图片的键名
     */
    private updateAvatar(avatarKey?: string): void {
        this.clearAvatar();

        if (avatarKey && this.scene.textures.exists(avatarKey)) {
            const size = this.config.avatarSize!;
            
            this.avatarImage = this.scene.add.image(
                size / 2 + 8, // 8px 边距
                size / 2 + 8, // 8px 边距
                avatarKey
            );
            this.avatarImage.setDisplaySize(size, size);
            this.container.add(this.avatarImage);
        }
    }

    /**
     * 清除头像显示
     */
    private clearAvatar(): void {
        if (this.avatarImage) {
            this.avatarImage.destroy();
            this.avatarImage = null;
        }
    }

    /**
     * 开始打字机效果
     * @param fullText 完整的文本内容
     */
    private startTyping(fullText: string): void {
        this.isTyping = true;
        this.dialogueText.setText('');
        let charIndex = 0;

        const timer = this.scene.time.addEvent({
            delay: this.config.typeSpeed,
            callback: () => {
                if (charIndex < fullText.length) {
                    this.dialogueText.text += fullText[charIndex];
                    charIndex++;
                } else {
                    timer.remove();
                    this.isTyping = false;
                    this.checkOptions(this.currentDialogue[this.currentLineIndex - 1]);
                }
            },
            callbackScope: this,
            loop: true
        });

        // 存储 timer 以便在 completeTyping 中停止
        (this.dialogueText as any)._typingTimer = timer;
    }

    /**
     * 立即完成打字机效果
     */
    private completeTyping(): void {
        const timer = (this.dialogueText as any)._typingTimer as Phaser.Time.TimerEvent;
        if (timer) {
            timer.remove();
            (this.dialogueText as any)._typingTimer = null;
        }

        const line = this.currentDialogue[this.currentLineIndex - 1];
        if (line) {
            this.dialogueText.setText(line.text);
            this.isTyping = false;
            this.checkOptions(line);
        }
    }

    /**
     * 检查当前行是否有选项，如果有则显示
     * @param line 当前对话行
     */
    private checkOptions(line: DialogueLine): void {
        if (line.options && line.options.length > 0) {
            this.showOptions(line.options);
        }
    }

    /**
     * 显示多选项
     * @param options 选项列表
     */
    private showOptions(options: DialogueOption[]): void {
        // 移除输入监听器，防止用户在选项出现时继续推进对话
        this.scene.input.keyboard.off('keydown-SPACE', this.handleInput, this);
        this.scene.input.off('pointerdown', this.handleInput, this);

        this.optionsContainer = this.scene.add.container(
            this.config.width - 150, // 选项框靠右侧显示
            this.config.height - 16 * options.length - 32 // 选项框靠底部显示
        );
        this.container.add(this.optionsContainer);

        let yOffset = 0;
        const optionWidth = 130;
        const optionHeight = 24;
        const padding = 4;

        options.forEach((option, index) => {
            // 选项背景 (Game Boy 风格)
            const optionBox = this.scene.add.graphics();
            optionBox.fillStyle(this.config.boxFillColor!, 0.9);
            optionBox.fillRect(0, yOffset, optionWidth, optionHeight);
            optionBox.lineStyle(this.config.boxBorderThickness!, this.config.boxBorderColor!, 1);
            optionBox.strokeRect(0, yOffset, optionWidth, optionHeight);

            // 选项文本
            const optionText = this.scene.add.text(
                padding,
                yOffset + padding,
                option.text,
                {
                    fontFamily: 'PixelFont, monospace',
                    fontSize: `${this.config.fontSize}px`,
                    color: this.config.fontColor,
                }
            );

            // 使选项可交互
            optionBox.setInteractive(new Phaser.Geom.Rectangle(0, yOffset, optionWidth, optionHeight), Phaser.Geom.Rectangle.Contains);
            
            // 鼠标悬停效果 (可选)
            optionBox.on('pointerover', () => {
                optionBox.clear();
                optionBox.fillStyle(0x4444FF, 1); // 悬停高亮
                optionBox.fillRect(0, yOffset, optionWidth, optionHeight);
                optionBox.lineStyle(this.config.boxBorderThickness!, this.config.boxBorderColor!, 1);
                optionBox.strokeRect(0, yOffset, optionWidth, optionHeight);
            });

            optionBox.on('pointerout', () => {
                this.drawSingleOptionBox(optionBox, yOffset, optionWidth, optionHeight);
            });

            // 点击处理
            optionBox.once('pointerdown', () => this.handleOptionSelect(option));

            this.optionsContainer!.add([optionBox, optionText]);
            yOffset += optionHeight + padding;
        });
    }

    /**
     * 绘制单个选项框的默认状态
     */
    private drawSingleOptionBox(box: Phaser.GameObjects.Graphics, y: number, w: number, h: number) {
        box.clear();
        box.fillStyle(this.config.boxFillColor!, 0.9);
        box.fillRect(0, y, w, h);
        box.lineStyle(this.config.boxBorderThickness!, this.config.boxBorderColor!, 1);
        box.strokeRect(0, y, w, h);
    }

    /**
     * 清除选项容器
     */
    private clearOptions(): void {
        if (this.optionsContainer) {
            this.optionsContainer.destroy(true);
            this.optionsContainer = null;
        }
    }

    /**
     * 处理选项选择
     * @param option 被选中的选项
     */
    private handleOptionSelect(option: DialogueOption): void {
        this.clearOptions();
        this.hide();

        if (typeof option.value === 'function') {
            option.value(this.scene);
        } else {
            console.log(`Option selected with value: ${option.value}`);
            // 可以在这里触发一个事件，将选项值传递出去
            this.scene.events.emit('dialogueOptionSelected', option.value);
        }
    }

    /**
     * 场景更新循环，用于处理打字机效果的计时器
     * @param time 
     * @param delta 
     */
    private update(time: number, delta: number): void {
        // Phaser.Time.TimerEvent 已经处理了计时，这里留空，但保留 update 方法以符合 Phaser 习惯
    }

    /**
     * 获取对话框容器，方便外部进行定位或动画操作
     */
    public getContainer(): Phaser.GameObjects.Container {
        return this.container;
    }

    /**
     * 销毁系统资源
     */
    public destroy(): void {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.scene.input.keyboard.off('keydown-SPACE', this.handleInput, this);
        this.scene.input.off('pointerdown', this.handleInput, this);
        this.container.destroy(true);
    }
}

// --------------------------------------------------------------------------------
// 使用示例 (仅用于说明，不包含在模块代码中)
// --------------------------------------------------------------------------------
/*
// 假设在一个场景中
class GameScene extends Phaser.Scene {
    private dialogueSystem: DialogueSystem;

    preload() {
        // 预加载资源: 假设有一个名为 'npc_avatar' 的头像图片
        this.load.image('npc_avatar', 'assets/npc_avatar.png');
        // 假设已加载像素字体
    }

    create() {
        // 1. 初始化对话系统
        this.dialogueSystem = new DialogueSystem(this, {
            x: 50,
            y: 400,
            width: 700,
            height: 150,
            fontSize: 16,
            typeSpeed: 50,
        });

        // 监听选项选择事件
        this.events.on('dialogueOptionSelected', this.handleOption, this);

        // 2. 定义对话内容
        const dialogueData: DialogueLine[] = [
            { text: '你好，旅行者。你看起来很眼熟。', avatarKey: 'npc_avatar' },
            { text: '我正在寻找一只稀有的宝可梦，你能帮我吗？' },
            { 
                text: '请问你愿意接受这个任务吗？', 
                options: [
                    { text: '接受', value: 'accept' },
                    { text: '拒绝', value: 'reject' },
                    { text: '稍后', value: (scene) => { console.log('稍后处理逻辑'); scene.events.emit('dialogueOptionSelected', 'later'); } }
                ]
            }
        ];

        // 3. 启动对话
        this.input.keyboard.on('keydown-ENTER', () => {
             this.dialogueSystem.startDialogue(dialogueData, () => {
                console.log('整个对话流程已完成。');
            });
        });
        
        // 4. 销毁 (在场景销毁时调用)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    }

    handleOption(value: string) {
        console.log(\`处理选项: \${value}\`);
        if (value === 'accept') {
            // 启动任务逻辑
        } else if (value === 'reject') {
            // 拒绝逻辑
        }
    }

    shutdown() {
        this.dialogueSystem.destroy();
    }
}
*/