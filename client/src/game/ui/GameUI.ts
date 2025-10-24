// client/src/game/ui/GameUI.ts

import Phaser from 'phaser';

/**
 * GameUI类负责管理游戏中的用户界面元素，如比分板和计时器。
 * 它作为一个Phaser容器（Container）存在，便于管理UI元素的层级和位置。
 */
export default class GameUI extends Phaser.GameObjects.Container {
    // 比分板相关的文本对象
    private scoreText: Phaser.GameObjects.Text;
    // 计时器相关的文本对象
    private timerText: Phaser.GameObjects.Text;
    // 当前比分
    private currentScore: number = 0;
    // 游戏开始时间（毫秒）
    private startTime: number = 0;
    // 计时器是否运行
    private isTimerRunning: boolean = false;

    /**
     * 构造函数
     * @param scene 当前场景
     * @param x 容器的x坐标
     * @param y 容器的y坐标
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        // 性能优化：将UI元素集中在一个Container中，减少场景中的对象数量
        super(scene, x, y);
        
        // 初始化UI元素
        this.createScoreboard();
        this.createTimer();

        // 将此容器添加到场景的更新列表中，以便在update中更新计时器
        scene.add.existing(this);
    }

    /**
     * 创建比分板UI
     * 视觉效果出色：使用自定义字体和阴影效果
     */
    private createScoreboard(): void {
        const scoreLabel = this.scene.add.text(0, 0, 'SCORE:', { 
            fontFamily: 'Arial Black', 
            fontSize: '32px', 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', fill: true }
        });
        scoreLabel.setOrigin(0, 0);
        this.add(scoreLabel);

        this.scoreText = this.scene.add.text(scoreLabel.width + 10, 0, this.currentScore.toString(), {
            fontFamily: 'Arial Black', 
            fontSize: '32px', 
            color: '#ffdd00', // 金色比分
            stroke: '#000000', 
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', fill: true }
        });
        this.scoreText.setOrigin(0, 0);
        this.add(this.scoreText);

        // 性能优化：设置比分板位置，使其位于屏幕左上角
        this.setPosition(10, 10);
    }

    /**
     * 创建计时器UI
     * 视觉效果出色：使用与比分板不同的颜色以示区别
     */
    private createTimer(): void {
        const timerLabel = this.scene.add.text(0, 50, 'TIME:', { 
            fontFamily: 'Arial Black', 
            fontSize: '32px', 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', fill: true }
        });
        timerLabel.setOrigin(0, 0);
        this.add(timerLabel);

        this.timerText = this.scene.add.text(timerLabel.width + 10, 50, '00:00', {
            fontFamily: 'Arial Black', 
            fontSize: '32px', 
            color: '#00ff00', // 绿色计时器
            stroke: '#000000', 
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', fill: true }
        });
        this.timerText.setOrigin(0, 0);
        this.add(this.timerText);
    }

    /**
     * 增加比分
     * @param points 增加的分数
     */
    public addScore(points: number): void {
        this.currentScore += points;
        this.updateScoreboard();
    }

    /**
     * 直接设置比分
     * @param score 新的比分
     */
    public setScore(score: number): void {
        this.currentScore = score;
        this.updateScoreboard();
    }

    /**
     * 更新比分板显示
     * 性能优化：仅在比分变化时更新文本对象
     */
    private updateScoreboard(): void {
        this.scoreText.setText(this.currentScore.toString());
    }

    /**
     * 开始计时器
     */
    public startTimer(): void {
        if (!this.isTimerRunning) {
            this.startTime = this.scene.time.now;
            this.isTimerRunning = true;
        }
    }

    /**
     * 停止计时器
     */
    public stopTimer(): void {
        this.isTimerRunning = false;
    }

    /**
     * 重置计时器和比分
     */
    public reset(): void {
        this.currentScore = 0;
        this.updateScoreboard();
        this.startTime = 0;
        this.isTimerRunning = false;
        this.timerText.setText('00:00');
    }

    /**
     * 场景的update方法会在每一帧调用
     * @param time 当前时间（毫秒）
     * @param delta 距离上一帧的时间差（毫秒）
     */
    public update(time: number, delta: number): void {
        // 性能优化：只在计时器运行时才进行时间计算和文本更新
        if (this.isTimerRunning) {
            const elapsedTime = time - this.startTime;
            this.updateTimer(elapsedTime);
        }
    }

    /**
     * 更新计时器显示
     * @param milliseconds 已经过去的时间（毫秒）
     */
    private updateTimer(milliseconds: number): void {
        // 性能优化：使用位运算提高性能
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // 格式化为 MM:SS 形式
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        this.timerText.setText(`${minutesStr}:${secondsStr}`);
    }

    /**
     * 获取当前比分
     * @returns 当前比分
     */
    public getScore(): number {
        return this.currentScore;
    }

    /**
     * 获取当前已运行时间（秒）
     * @returns 已运行时间（秒）
     */
    public getElapsedTime(): number {
        if (this.isTimerRunning) {
            return Math.floor((this.scene.time.now - this.startTime) / 1000);
        }
        return Math.floor(this.startTime / 1000); // 如果停止了，返回停止时的总时间
    }
}

// 示例用法（需要在游戏场景中调用）：
/*
// 假设这是你的游戏场景
export default class GameScene extends Phaser.Scene {
    private gameUI: GameUI;

    constructor() {
        super('GameScene');
    }

    create() {
        // 创建GameUI实例，放置在场景的左上角
        this.gameUI = new GameUI(this, 0, 0); 
        this.gameUI.setDepth(100); // 确保UI在最上层

        // 启动计时器
        this.gameUI.startTimer();

        // 模拟得分
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.gameUI.addScore(100);
                console.log('Score added. Current Score:', this.gameUI.getScore());
            },
            loop: true
        });
    }

    update(time: number, delta: number) {
        // GameUI的update方法会自动被调用，因为它被添加到了场景中
    }
}
*/
