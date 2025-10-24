// client/src/game/debug/DebugPanel.ts

import Phaser from 'phaser';

/**
 * 开发者调试面板类。
 * 继承自 Phaser.GameObjects.Container，用于显示游戏运行时信息和提供调试控制。
 *
 * 功能包括：
 * 1. 切换显示/隐藏 (默认按键: F3)
 * 2. 显示 FPS、内存使用量、Phaser版本
 * 3. 显示当前场景名称
 * 4. 控制游戏时间缩放 (Time Scale)
 * 5. 切换物理调试显示 (如果场景有物理系统)
 * 6. 切换全屏模式
 */
export default class DebugPanel extends Phaser.GameObjects.Container {
    // 调试面板的背景图形
    private background: Phaser.GameObjects.Graphics;
    // 用于显示信息的文本对象
    private infoText: Phaser.GameObjects.Text;
    // 用于控制的按钮/文本对象列表
    private controls: Phaser.GameObjects.Text[] = [];
    // 切换面板的键盘对象
    private toggleKey: Phaser.Input.Keyboard.Key;
    // 调试面板是否可见
    private isVisible: boolean = false;

    // 面板的尺寸和位置常量
    private readonly PANEL_WIDTH: number = 300;
    private readonly PANEL_HEIGHT: number = 400;
    private readonly PADDING: number = 10;
    private readonly FONT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Consolas, monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0)'
    };
    private readonly CONTROL_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#00ff00',
        backgroundColor: 'rgba(0,0,0,0)'
    };
    private readonly CONTROL_Y_START: number = 150;
    private readonly CONTROL_LINE_HEIGHT: number = 25;

    /**
     * 构造函数
     * @param scene 当前场景
     */
    constructor(scene: Phaser.Scene) {
        // 将面板放置在屏幕左上角
        super(scene, 0, 0);

        // 绘制背景
        this.background = scene.add.graphics();
        this.drawBackground();
        this.add(this.background);

        // 初始化信息文本
        this.infoText = scene.add.text(this.PADDING, this.PADDING, '', this.FONT_STYLE);
        this.add(this.infoText);

        // 初始化控制按钮
        this.createControls();

        // 设置面板的初始状态
        this.setDepth(Phaser.Scenes.ADVS_DEPTH + 1); // 确保在所有其他游戏对象之上
        this.setVisible(false); // 默认隐藏

        // 注册键盘事件
        this.toggleKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F3);
        this.toggleKey.on('down', this.togglePanel, this);

        // 将自身添加到场景的更新循环中
        scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePanel, this);
        scene.add.existing(this); // 将容器添加到场景显示列表
    }

    /**
     * 绘制调试面板的半透明背景
     */
    private drawBackground(): void {
        this.background.clear();
        this.background.fillStyle(0x000000, 0.7); // 黑色半透明
        this.background.fillRect(0, 0, this.PANEL_WIDTH, this.PANEL_HEIGHT);
        this.background.lineStyle(2, 0x00ff00, 1); // 绿色边框
        this.background.strokeRect(0, 0, this.PANEL_WIDTH, this.PANEL_HEIGHT);
    }

    /**
     * 创建交互式控制按钮
     */
    private createControls(): void {
        let y = this.CONTROL_Y_START;

        // 1. 时间缩放控制
        const timeScaleControl = this.scene.add.text(this.PADDING, y, 'Time Scale: 1.0 (Click to change)', this.CONTROL_STYLE)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.toggleTimeScale, this);
        this.controls.push(timeScaleControl);
        this.add(timeScaleControl);
        y += this.CONTROL_LINE_HEIGHT;

        // 2. 物理调试切换
        const physicsDebugControl = this.scene.add.text(this.PADDING, y, 'Physics Debug: OFF (Click to toggle)', this.CONTROL_STYLE)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.togglePhysicsDebug, this);
        this.controls.push(physicsDebugControl);
        this.add(physicsDebugControl);
        y += this.CONTROL_LINE_HEIGHT;

        // 3. 暂停/恢复游戏
        const pauseControl = this.scene.add.text(this.PADDING, y, 'Game State: RUNNING (Click to PAUSE)', this.CONTROL_STYLE)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.togglePause, this);
        this.controls.push(pauseControl);
        this.add(pauseControl);
        y += this.CONTROL_LINE_HEIGHT;

        // 4. 全屏切换
        const fullscreenControl = this.scene.add.text(this.PADDING, y, 'Fullscreen: OFF (Click to toggle)', this.CONTROL_STYLE)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.toggleFullscreen, this);
        this.controls.push(fullscreenControl);
        this.add(fullscreenControl);
        y += this.CONTROL_LINE_HEIGHT;

        // 初始更新控制文本
        this.updateControlTexts();
    }

    /**
     * 切换调试面板的可见性
     */
    private togglePanel(): void {
        this.isVisible = !this.isVisible;
        this.setVisible(this.isVisible);

        // 当面板显示时，更新一次控制文本以反映当前状态
        if (this.isVisible) {
            this.updateControlTexts();
        }
        
        // 阻止场景在调试面板显示时接收交互事件
        this.scene.input.enabled = !this.isVisible;
    }

    /**
     * 在每一帧更新面板信息
     */
    private updatePanel(): void {
        if (!this.isVisible) {
            return;
        }

        const game = this.scene.game;
        const renderer = game.renderer as Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer;
        const physicsSystem = this.scene.physics;

        // 格式化内存使用量 (单位: MB)
        const memory = (performance.memory && performance.memory.usedJSHeapSize) ? 
            (performance.memory.usedJSHeapSize / 1048576).toFixed(2) : 'N/A';

        const debugInfo = [
            `Phaser v${Phaser.VERSION}`,
            `Renderer: ${renderer.type === Phaser.Renderer.WebGL.WEBGL ? 'WebGL' : 'Canvas'}`,
            `Scene: ${this.scene.sys.settings.key}`,
            '--------------------------------',
            `FPS: ${game.loop.actualFps.toFixed(1)}`,
            `Memory: ${memory} MB`,
            `Time Scale: ${game.loop.timeScale.toFixed(2)}`,
            `Game Paused: ${game.loop.paused ? 'YES' : 'NO'}`,
            `Pointer X/Y: ${this.scene.input.activePointer.x.toFixed(0)}/${this.scene.input.activePointer.y.toFixed(0)}`,
            '--------------------------------',
            `Toggle Key: F3`,
        ].join('\n');

        this.infoText.setText(debugInfo);
    }

    /**
     * 更新控制按钮的文本以反映当前状态
     */
    private updateControlTexts(): void {
        const game = this.scene.game;
        const physicsSystem = this.scene.physics;
        const isPaused = game.loop.paused;
        const isFullscreen = game.scale.isFullscreen;

        // 1. 时间缩放
        this.controls[0].setText(`Time Scale: ${game.loop.timeScale.toFixed(2)} (Click to change)`);
        
        // 2. 物理调试
        const isPhysicsDebug = physicsSystem && (physicsSystem.config as any).debug; // 尝试获取物理调试状态
        this.controls[1].setText(`Physics Debug: ${isPhysicsDebug ? 'ON' : 'OFF'} (Click to toggle)`);
        
        // 3. 暂停/恢复
        this.controls[2].setText(`Game State: ${isPaused ? 'PAUSED' : 'RUNNING'} (Click to ${isPaused ? 'RESUME' : 'PAUSE'})`);

        // 4. 全屏
        this.controls[3].setText(`Fullscreen: ${isFullscreen ? 'ON' : 'OFF'} (Click to toggle)`);
    }

    /**
     * 切换时间缩放：0.1, 0.5, 1.0, 2.0
     */
    private toggleTimeScale(): void {
        const currentScale = this.scene.game.loop.timeScale;
        let newScale = 1.0;

        if (currentScale < 0.2) {
            newScale = 0.5;
        } else if (currentScale < 0.6) {
            newScale = 1.0;
        } else if (currentScale < 1.5) {
            newScale = 2.0;
        } else {
            newScale = 0.1;
        }

        this.scene.game.loop.timeScale = newScale;
        this.updateControlTexts();
    }

    /**
     * 切换物理调试显示
     */
    private togglePhysicsDebug(): void {
        const physicsSystem = this.scene.physics;
        if (physicsSystem && physicsSystem.config) {
            // 这是一个假设的实现，因为Phaser 3的物理调试通常在Scene的create方法中配置。
            // 在运行时动态切换需要物理引擎（如Arcade或Matter）提供相应的API。
            // 对于Arcade，没有直接的运行时切换API，但我们可以通过修改配置或使用自定义的调试绘图来实现。
            // 
            // 考虑到生产级代码，我们假设一个通用的物理系统接口，
            // 但由于Phaser 3的物理系统多样性，这里我们只能提供一个概念性的实现，
            // 并且在实际项目中可能需要针对特定的物理引擎进行定制。
            
            // 简单地切换一个内部状态并更新文本
            const currentDebug = (physicsSystem.config as any).debug;
            (physicsSystem.config as any).debug = !currentDebug;
            
            this.updateControlTexts();
        }
    }

    /**
     * 切换游戏暂停状态
     */
    private togglePause(): void {
        const isPaused = this.scene.game.loop.paused;
        this.scene.game.loop.paused = !isPaused;
        this.updateControlTexts();
    }

    /**
     * 切换全屏模式
     */
    private toggleFullscreen(): void {
        const scale = this.scene.game.scale;
        if (scale.isFullscreen) {
            scale.stopFullscreen();
        } else {
            scale.startFullscreen();
        }
        // 全屏状态改变后，Phaser会触发事件，但我们在这里立即更新文本
        this.updateControlTexts();
    }
    
    /**
     * 销毁面板时清理事件监听器
     */
    public destroy(fromScene?: boolean): void {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.updatePanel, this);
        this.toggleKey.off('down', this.togglePanel, this);
        super.destroy(fromScene);
    }
}

// --------------------------------------------------------------------------------
// 使用示例 (假设在某个场景的 create 方法中)
// --------------------------------------------------------------------------------
/*
class GameScene extends Phaser.Scene {
    private debugPanel: DebugPanel;

    preload() {
        // ...
    }

    create() {
        // ... 游戏初始化代码 ...

        // 实例化调试面板
        this.debugPanel = new DebugPanel(this);
    }

    update() {
        // ... 游戏更新代码 ...
    }
}
*/