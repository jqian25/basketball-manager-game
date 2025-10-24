// client/src/game/battle/BattleSystem.ts

import * as Phaser from 'phaser';

/**
 * @enum {string} BattleState
 * 战斗状态枚举，用于控制回合制流程
 */
enum BattleState {
    START = 'START',            // 战斗开始：初始化
    PLAYER_TURN = 'PLAYER_TURN',  // 玩家回合：等待玩家选择行动
    ENEMY_TURN = 'ENEMY_TURN',    // 电脑回合：执行AI行动
    ACTION = 'ACTION',          // 执行行动动画和逻辑
    END = 'END',                // 战斗结束：显示结果
}

/**
 * @interface PlayerStats
 * 球员属性接口，定义了战斗所需的核心数据
 */
interface PlayerStats {
    name: string;
    hp: number;
    maxHp: number;
    offense: number; // 进攻能力 (影响投篮成功率/伤害)
    defense: number; // 防守能力 (影响被投篮成功率/伤害)
    speed: number;   // 速度 (影响行动顺序)
    spriteKey: string; // 角色贴图key (占位符使用)
}

/**
 * @class BattleSystem
 * 回合制篮球战斗系统核心类，继承自Phaser.Scene
 * 实现了Game Boy风格的低分辨率和调色板效果
 * 
 * 集成说明：
 * 1. 在Phaser的Game配置中添加此Scene: `scenes: [BattleSystem]`
 * 2. 在主场景中通过 `this.scene.start('BattleSystem')` 启动战斗
 */
export class BattleSystem extends Phaser.Scene {
    private state: BattleState = BattleState.START;
    private playerStats!: PlayerStats;
    private enemyStats!: PlayerStats;
    private turnQueue: PlayerStats[] = []; // 回合队列 (未使用，但保留用于扩展)
    private activePlayer: PlayerStats | null = null;

    // Game Boy 风格 UI 元素
    private uiBox!: Phaser.GameObjects.Graphics;
    private messageText!: Phaser.GameObjects.Text;
    private menuText!: Phaser.GameObjects.Text[];

    // 视觉元素 (使用Graphics占位符)
    private playerSprite!: Phaser.GameObjects.Graphics;
    private enemySprite!: Phaser.GameObjects.Graphics;
    private courtGraphics!: Phaser.GameObjects.Graphics;
    
    // Game Boy 调色板颜色 (4色)
    private readonly COLOR_GB_DARK = 0x0f380f; // 最深色
    private readonly COLOR_GB_MID_DARK = 0x306230; // 中深色
    private readonly COLOR_GB_MID_LIGHT = 0x84b584; // 中浅色
    private readonly COLOR_GB_LIGHT = 0x9bbc0f; // 最浅色/背景色

    /**
     * 构造函数，设置场景key
     */
    constructor() {
        // 设置场景key和初始状态
        super({ key: 'BattleSystem', active: false });
    }

    /**
     * 预加载资源 (此处为占位符，实际应加载像素图)
     */
    preload() {
        // 实际项目中应加载像素风格的图片，例如：
        // this.load.image('player_gb', 'assets/player_gb.png');
        // this.load.image('enemy_gb', 'assets/enemy_gb.png');
    }

    /**
     * 场景创建：初始化游戏世界和UI
     */
    create() {
        // 1. 初始化属性
        this.playerStats = {
            name: 'PLAYER 1', hp: 100, maxHp: 100, offense: 15, defense: 10, speed: 12, spriteKey: 'player_gb'
        };
        this.enemyStats = {
            name: 'CPU TEAM', hp: 100, maxHp: 100, offense: 10, defense: 15, speed: 10, spriteKey: 'enemy_gb'
        };

        // 2. 设置Game Boy风格的背景和分辨率
        this.cameras.main.setBackgroundColor(this.COLOR_GB_LIGHT);
        // 核心：设置Game Boy经典分辨率 160x144
        this.scale.setGameSize(160, 144); 

        // 3. 绘制篮球场和角色占位符
        this.drawCourt();
        this.createPlaceholderSprites();

        // 4. 创建UI元素
        this.createUI();

        // 5. 开始战斗流程
        this.changeState(BattleState.START);
    }

    /**
     * 创建占位符精灵（使用Graphics模拟像素人物）
     */
    private createPlaceholderSprites() {
        // 玩家精灵占位符 (中深色)
        this.playerSprite = this.add.graphics({ fillStyle: { color: this.COLOR_GB_MID_DARK } })
            .fillRect(30, 62, 20, 30) // 简单的矩形人物
            .setDepth(1);
        
        // 电脑精灵占位符 (深色)
        this.enemySprite = this.add.graphics({ fillStyle: { color: this.COLOR_GB_DARK } })
            .fillRect(110, 62, 20, 30)
            .setDepth(1);
    }

    /**
     * 绘制Game Boy风格的篮球场
     */
    private drawCourt() {
        this.courtGraphics = this.add.graphics();
        
        // 场地背景 (中浅色)
        this.courtGraphics.fillStyle(this.COLOR_GB_MID_LIGHT, 1);
        this.courtGraphics.fillRect(0, 0, 160, 144);

        // 场地线条 (深色)
        this.courtGraphics.lineStyle(1, this.COLOR_GB_DARK, 1);
        
        // 中线
        this.courtGraphics.beginPath();
        this.courtGraphics.moveTo(80, 0);
        this.courtGraphics.lineTo(80, 144);
        this.courtGraphics.strokePath();

        // 篮筐区域 (三分线模拟)
        this.courtGraphics.strokeRect(10, 50, 20, 44); // 玩家半场
        this.courtGraphics.strokeRect(130, 50, 20, 44); // 电脑半场
        
        // 篮筐 (深色圆圈)
        this.courtGraphics.fillStyle(this.COLOR_GB_DARK, 1);
        this.courtGraphics.fillCircle(140, 72, 3); // 电脑篮筐
        this.courtGraphics.fillCircle(20, 72, 3); // 玩家篮筐
    }

    /**
     * 创建Game Boy风格的UI框和文本
     */
    private createUI() {
        // UI 框 (底部)
        this.uiBox = this.add.graphics();
        this.uiBox.fillStyle(this.COLOR_GB_LIGHT, 1);
        this.uiBox.fillRect(0, 100, 160, 44); // 底部UI区域
        this.uiBox.lineStyle(1, this.COLOR_GB_DARK, 1);
        this.uiBox.strokeRect(0, 100, 160, 44); // 边框

        // 消息文本样式
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'monospace', // 模拟像素字体
            fontSize: '8px', // 低分辨率下的字体大小
            color: `#${this.COLOR_GB_DARK.toString(16)}`, // 字体颜色为最深色
            wordWrap: { width: 75 } // 限制消息区域宽度
        };
        
        // 消息文本 (左侧)
        this.messageText = this.add.text(5, 105, '', textStyle);
        this.messageText.setDepth(2);

        // 菜单文本数组 (右侧)
        this.menuText = [];
        for (let i = 0; i < 3; i++) {
            // 菜单项使用交互式文本，模拟按钮点击
            const menuTextStyle = { ...textStyle, wordWrap: { width: 70 } };
            const text = this.add.text(85, 105 + (i * 12), '', menuTextStyle).setDepth(2).setInteractive();
            text.on('pointerdown', () => this.handleMenuSelection(i));
            this.menuText.push(text);
        }
        this.hideMenu();
    }

    /**
     * 隐藏行动菜单
     */
    private hideMenu() {
        this.menuText.forEach(text => text.setVisible(false));
    }

    /**
     * 显示行动菜单 (玩家回合专用)
     */
    private showMenu() {
        this.menuText[0].setText('1. SHOOT').setVisible(true);
        this.menuText[1].setText('2. PASS').setVisible(true);
        this.menuText[2].setText('3. DEFEND').setVisible(true);
    }

    /**
     * 切换战斗状态，驱动战斗流程
     * @param newState 新的战斗状态
     */
    private changeState(newState: BattleState) {
        this.state = newState;
        switch (newState) {
            case BattleState.START:
                this.handleStart();
                break;
            case BattleState.PLAYER_TURN:
                this.handlePlayerTurn();
                break;
            case BattleState.ENEMY_TURN:
                this.handleEnemyTurn();
                break;
            case BattleState.ACTION:
                // 动作状态由执行函数控制，完成后自动进入下一流程
                break;
            case BattleState.END:
                this.handleEnd();
                break;
        }
    }

    /**
     * 战斗开始逻辑
     */
    private handleStart() {
        this.messageText.setText('BATTLE START!\n' + this.playerStats.name + ' vs ' + this.enemyStats.name);
        
        // 决定行动顺序 (速度快者先行动，简化为玩家先手)
        // this.turnQueue = [this.playerStats, this.enemyStats].sort((a, b) => b.speed - a.speed);
        
        // 延迟后进入玩家回合
        this.time.delayedCall(2000, () => this.changeState(BattleState.PLAYER_TURN));
    }

    /**
     * 玩家回合逻辑
     */
    private handlePlayerTurn() {
        this.activePlayer = this.playerStats;
        this.messageText.setText('YOUR TURN! Choose an action:');
        this.showMenu();
    }

    /**
     * 电脑回合逻辑
     */
    private handleEnemyTurn() {
        this.hideMenu();
        this.activePlayer = this.enemyStats;
        this.messageText.setText('CPU TURN...');
        
        // 简单的AI: 随机选择行动 (1: SHOOT, 2: PASS, 3: DEFEND)
        const action = Phaser.Math.Between(1, 3);
        this.time.delayedCall(1500, () => this.executeAction(this.enemyStats, action));
    }

    /**
     * 处理玩家菜单选择
     * @param selection 菜单索引 (0: SHOOT, 1: PASS, 2: DEFEND)
     */
    private handleMenuSelection(selection: number) {
        // 仅在玩家回合且状态为PLAYER_TURN时响应
        if (this.state !== BattleState.PLAYER_TURN) return;

        this.hideMenu();
        // 菜单索引 + 1 = 行动代码 (1, 2, 3)
        this.executeAction(this.playerStats, selection + 1);
    }

    /**
     * 执行行动逻辑：核心战斗计算
     * @param performer 行动者属性
     * @param actionCode 行动代码 (1: SHOOT, 2: PASS, 3: DEFEND)
     */
    private executeAction(performer: PlayerStats, actionCode: number) {
        this.changeState(BattleState.ACTION); // 进入行动状态
        const opponent = performer === this.playerStats ? this.enemyStats : this.playerStats;
        let message = '';
        let success = false;

        // 模拟成功率：基于进攻/防守属性对比
        const successChance = performer.offense / (performer.offense + opponent.defense);
        const roll = Math.random();

        switch (actionCode) {
            case 1: // SHOOT (投篮/攻击)
                message = performer.name + ' attempts a shot...';
                if (roll < successChance) {
                    const damage = Phaser.Math.Between(5, 15);
                    opponent.hp = Math.max(0, opponent.hp - damage);
                    message += `\nSCORE! ${opponent.name} takes ${damage} damage. (HP:${opponent.hp})`;
                    success = true;
                } else {
                    message += '\nMISSED! The shot was blocked.';
                }
                break;
            case 2: // PASS (传球/回复)
                message = performer.name + ' passes the ball to a teammate...';
                const heal = Phaser.Math.Between(5, 10);
                performer.hp = Math.min(performer.maxHp, performer.hp + heal);
                message += `\nHP recovered by ${heal}. (HP:${performer.hp})`;
                success = true;
                break;
            case 3: // DEFEND (防守/Buff)
                message = performer.name + ' sets up a strong defense.';
                // 临时增加防守属性，简化为下一回合生效
                performer.defense += 5;
                message += '\nDefense increased for this turn!';
                success = true;
                // 1秒后恢复防守属性
                this.time.delayedCall(1000, () => performer.defense -= 5); 
                break;
            default:
                message = 'Invalid action.';
        }

        this.messageText.setText(message);
        
        // 播放简单的动画效果
        this.animateAction(performer, success);

        // 检查战斗是否结束
        this.time.delayedCall(2500, () => this.checkBattleEnd());
    }

    /**
     * 简单的行动动画：跳跃和成功闪烁
     * @param performer 行动者
     * @param success 是否成功
     */
    private animateAction(performer: PlayerStats, success: boolean) {
        const sprite = performer === this.playerStats ? this.playerSprite : this.enemySprite;
        const originalX = sprite.x;
        const originalY = sprite.y;
        const targetX = performer === this.playerStats ? originalX + 10 : originalX - 10;
        const targetY = originalY - 5;

        // 简单的跳跃动画 (使用Tween)
        this.tweens.add({
            targets: sprite,
            x: targetX,
            y: targetY,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                sprite.setPosition(originalX, originalY); // 确保回到原位
                if (success) {
                    // 成功时闪烁效果 (Game Boy风格)
                    this.tweens.add({
                        targets: sprite,
                        alpha: 0,
                        duration: 100,
                        repeat: 2,
                        yoyo: true,
                        onComplete: () => sprite.setAlpha(1)
                    });
                }
            }
        });
    }

    /**
     * 检查战斗是否结束 (HP <= 0)
     */
    private checkBattleEnd() {
        if (this.playerStats.hp <= 0) {
            this.messageText.setText('GAME OVER! ' + this.enemyStats.name + ' WINS.');
            this.changeState(BattleState.END);
        } else if (this.enemyStats.hp <= 0) {
            this.messageText.setText('CONGRATULATIONS! ' + this.playerStats.name + ' WINS!');
            this.changeState(BattleState.END);
        } else {
            // 切换到下一个回合
            this.nextTurn();
        }
    }

    /**
     * 切换到下一个回合 (简单的玩家/电脑交替)
     */
    private nextTurn() {
        if (this.activePlayer === this.playerStats) {
            this.changeState(BattleState.ENEMY_TURN);
        } else {
            this.changeState(BattleState.PLAYER_TURN);
        }
    }

    /**
     * 战斗结束逻辑
     */
    private handleEnd() {
        this.hideMenu();
        // 可以在这里添加返回主菜单或重试的逻辑
        // this.time.delayedCall(3000, () => this.scene.start('MainMenuScene'));
    }
}
