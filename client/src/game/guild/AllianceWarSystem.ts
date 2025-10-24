import * as Phaser from 'phaser';

// =================================================================================
// 1. 数据结构和配置 (Data Structures and Configuration)
// =================================================================================

/**
 * 联盟（公会）的基础数据结构
 */
export interface Guild {
    id: number;
    name: string;
    tag: string; // 联盟标签，如 [RED]
    members: number;
    power: number; // 联盟总战力
    score: number; // 联盟战得分
}

/**
 * 联盟战区域（道馆/据点）的配置
 */
export interface WarZoneConfig {
    id: number;
    name: string;
    baseScore: number; // 占领基础得分
    defensePower: number; // 区域防御力
    defenderGuildId: number | null; // 当前占领的联盟ID
    position: { x: number, y: number }; // 在地图上的位置
}

/**
 * 联盟战状态
 */
export interface AllianceWarState {
    warId: number;
    status: 'Scheduled' | 'Active' | 'Ended';
    startTime: number; // Unix时间戳
    duration: number; // 持续时间（秒）
    guildA: Guild;
    guildB: Guild;
    zones: WarZoneConfig[];
}

/**
 * 模拟GB风格的颜色配置
 */
const GB_COLORS = {
    DARK: 0x0f380f, // 深绿色/黑色
    MEDIUM: 0x306230, // 中绿色
    LIGHT: 0x8bac0f, // 浅绿色
    BACKGROUND: 0x9bbc0f, // 背景色
    WHITE: 0xffffff,
    RED: 0xff0000,
    BLUE: 0x0000ff,
};

/**
 * 联盟战的默认配置数据
 */
const DEFAULT_WAR_STATE: AllianceWarState = {
    warId: 1001,
    status: 'Active',
    startTime: Date.now() - 3600000, // 1小时前开始
    duration: 3 * 3600, // 持续3小时
    guildA: { id: 1, name: '赤色火箭队', tag: '[RKT]', members: 50, power: 150000, score: 0 },
    guildB: { id: 2, name: '蓝色水舰队', tag: '[SJT]', members: 45, power: 145000, score: 0 },
    zones: [
        { id: 1, name: '中央道馆', baseScore: 500, defensePower: 10000, defenderGuildId: 1, position: { x: 160, y: 100 } },
        { id: 2, name: '东部基地', baseScore: 300, defensePower: 5000, defenderGuildId: 1, position: { x: 280, y: 150 } },
        { id: 3, name: '西部矿区', baseScore: 300, defensePower: 5000, defenderGuildId: 2, position: { x: 50, y: 200 } },
        { id: 4, name: '秘密港口', baseScore: 400, defensePower: 8000, defenderGuildId: null, position: { x: 200, y: 250 } },
    ],
};

// =================================================================================
// 2. 核心类和Phaser实现 (Core Class and Phaser Implementation)
// =================================================================================

/**
 * 模拟Game Boy风格的文本框
 * @param scene Phaser场景
 * @param x x坐标
 * @param y y坐标
 * @param width 宽度
 * @param height 高度
 * @param text 文本内容
 * @param color 文本颜色
 * @returns Phaser.GameObjects.Container
 */
function createGBTextBox(scene: Phaser.Scene, x: number, y: number, width: number, height: number, text: string, color: number = GB_COLORS.DARK) {
    const container = scene.add.container(x, y);

    // 边框和背景 (使用简单的矩形模拟GB风格的边框)
    const background = scene.add.rectangle(0, 0, width, height, GB_COLORS.BACKGROUND)
        .setOrigin(0);
    const border = scene.add.rectangle(0, 0, width, height)
        .setOrigin(0)
        .setStrokeStyle(2, GB_COLORS.DARK);

    // 文本 (使用简单的Phaser文本模拟像素字体)
    const textObject = scene.add.text(5, 5, text, {
        fontFamily: 'monospace', // 模拟像素字体
        fontSize: '10px',
        color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
        wordWrap: { width: width - 10 }
    });

    container.add([background, border, textObject]);
    container.setSize(width, height);
    return container;
}

/**
 * 联盟战系统核心类
 * 继承Phaser.Scene以方便在Phaser环境中测试和展示
 */
export class AllianceWarSystem extends Phaser.Scene {
    private warState: AllianceWarState;
    private zoneGraphics: Phaser.GameObjects.Graphics[] = [];
    private scoreTexts: { [key: number]: Phaser.GameObjects.Text } = {};
    private timerText!: Phaser.GameObjects.Text;
    private battleLogText!: Phaser.GameObjects.Text;

    constructor() {
        // 场景的Key，方便Phaser SceneManager调用
        super({ key: 'AllianceWarSystem' });
        this.warState = DEFAULT_WAR_STATE;
    }

    /**
     * 预加载资源 (GB风格不需要复杂资源，主要模拟颜色和字体)
     */
    preload() {
        // 可以在这里加载GB风格的像素字体图片或位图字体
        // 示例中我们使用默认的monospace字体模拟
    }

    /**
     * 初始化场景
     */
    create() {
        this.cameras.main.setBackgroundColor(GB_COLORS.BACKGROUND);
        
        // 1. 绘制地图和区域
        this.drawWarMap();

        // 2. 绘制信息面板 (GB风格的UI)
        this.drawInfoPanel();

        // 3. 设置定时器和更新逻辑
        this.time.addEvent({
            delay: 1000, // 每秒更新一次
            callback: this.updateWarState,
            callbackScope: this,
            loop: true
        });

        // 4. 模拟用户交互（点击区域发起攻击）
        this.input.on('pointerdown', this.handleMapClick, this);
    }

    /**
     * 绘制联盟战地图和区域
     */
    private drawWarMap() {
        const graphics = this.add.graphics({ lineStyle: { width: 2, color: GB_COLORS.DARK } });
        graphics.lineStyle(2, GB_COLORS.DARK);
        
        // 绘制一个简单的地图边框
        graphics.strokeRect(20, 50, 300, 250);

        // 绘制区域
        this.warState.zones.forEach(zone => {
            const color = zone.defenderGuildId === this.warState.guildA.id ? GB_COLORS.RED :
                          zone.defenderGuildId === this.warState.guildB.id ? GB_COLORS.BLUE :
                          GB_COLORS.MEDIUM;

            // 区域图形 (模拟GB风格的简单方块)
            const zoneGraphic = this.add.graphics({ fillStyle: { color: color } });
            zoneGraphic.fillRect(zone.position.x, zone.position.y, 40, 40);
            zoneGraphic.strokeRect(zone.position.x, zone.position.y, 40, 40);
            zoneGraphic.setInteractive(new Phaser.Geom.Rectangle(zone.position.x, zone.position.y, 40, 40), Phaser.Geom.Rectangle.Contains);
            zoneGraphic.setData('zoneId', zone.id);
            this.zoneGraphics.push(zoneGraphic);

            // 区域名称文本
            this.add.text(zone.position.x + 20, zone.position.y + 20, zone.name.substring(0, 2), {
                fontFamily: 'monospace',
                fontSize: '8px',
                color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
            }).setOrigin(0.5);

            // 区域得分文本 (用于实时更新)
            this.scoreTexts[zone.id] = this.add.text(zone.position.x + 20, zone.position.y + 45, `+${zone.baseScore}`, {
                fontFamily: 'monospace',
                fontSize: '8px',
                color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
            }).setOrigin(0.5);
        });
    }

    /**
     * 绘制GB风格的信息面板
     */
    private drawInfoPanel() {
        // 顶部计时器和状态面板
        const headerBox = createGBTextBox(this, 330, 50, 180, 50, '', GB_COLORS.DARK);
        this.add.existing(headerBox);
        
        this.timerText = this.add.text(335, 55, '时间: 00:00:00', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
        });
        this.add.text(335, 75, `状态: ${this.warState.status}`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
        });

        // 联盟得分面板
        const scoreBoxA = createGBTextBox(this, 20, 10, 150, 30, `${this.warState.guildA.tag} ${this.warState.guildA.name}: ${this.warState.guildA.score}`, GB_COLORS.RED);
        this.add.existing(scoreBoxA);
        const scoreBoxB = createGBTextBox(this, 170, 10, 150, 30, `${this.warState.guildB.tag} ${this.warState.guildB.name}: ${this.warState.guildB.score}`, GB_COLORS.BLUE);
        this.add.existing(scoreBoxB);

        // 战斗日志面板 (GB风格的对话框)
        const logBox = createGBTextBox(this, 20, 310, 490, 140, '欢迎来到联盟战!\n点击区域发起进攻...', GB_COLORS.DARK);
        this.add.existing(logBox);
        this.battleLogText = logBox.getAt(2) as Phaser.GameObjects.Text;
    }

    /**
     * 核心逻辑：每秒更新联盟战状态，包括计时和得分
     */
    private updateWarState() {
        if (this.warState.status !== 'Active') return;

        const now = Date.now();
        const elapsed = Math.floor((now - this.warState.startTime) / 1000);
        const remaining = this.warState.duration - elapsed;

        if (remaining <= 0) {
            this.warState.status = 'Ended';
            this.logMessage('联盟战结束! 正在结算...');
            this.calculateFinalScore();
            return;
        }

        // 更新计时器
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        this.timerText.setText(`时间: ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

        // 每分钟（模拟）进行得分结算
        if (elapsed % 60 === 0) {
            this.calculatePeriodicScore();
        }
    }

    /**
     * 模拟周期性得分计算
     */
    private calculatePeriodicScore() {
        let scoreA = 0;
        let scoreB = 0;

        this.warState.zones.forEach(zone => {
            if (zone.defenderGuildId === this.warState.guildA.id) {
                scoreA += zone.baseScore;
            } else if (zone.defenderGuildId === this.warState.guildB.id) {
                scoreB += zone.baseScore;
            }
        });

        this.warState.guildA.score += scoreA;
        this.warState.guildB.score += scoreB;

        // 更新UI
        const scoreBoxA = this.children.getByName('scoreBoxA') as Phaser.GameObjects.Container;
        const scoreBoxB = this.children.getByName('scoreBoxB') as Phaser.GameObjects.Container;
        
        // 重新绘制得分文本 (简化处理，实际中应更新文本对象)
        this.children.getAll().forEach(child => {
            if (child instanceof Phaser.GameObjects.Text && child.y === 15) {
                child.destroy();
            }
        });
        this.add.text(25, 15, `${this.warState.guildA.tag} ${this.warState.guildA.name}: ${this.warState.guildA.score}`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
        });
        this.add.text(175, 15, `${this.warState.guildB.tag} ${this.warState.guildB.name}: ${this.warState.guildB.score}`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: Phaser.Display.Color.GetColor(GB_COLORS.DARK, GB_COLORS.DARK, GB_COLORS.DARK).toString(16),
        });

        this.logMessage(`得分结算: ${this.warState.guildA.tag} +${scoreA}, ${this.warState.guildB.tag} +${scoreB}`);
    }

    /**
     * 模拟最终得分计算和结果展示
     */
    private calculateFinalScore() {
        const winner = this.warState.guildA.score > this.warState.guildB.score ? this.warState.guildA :
                       this.warState.guildB.score > this.warState.guildA.score ? this.warState.guildB :
                       null;
        
        let message = `最终得分: ${this.warState.guildA.tag} ${this.warState.guildA.score} vs ${this.warState.guildB.tag} ${this.warState.guildB.score}。\n`;
        message += winner ? `恭喜 ${winner.tag} ${winner.name} 获得胜利!` : '平局!';
        
        this.logMessage(message);
    }

    /**
     * 模拟点击地图区域发起进攻
     * @param pointer 鼠标指针
     * @param targets 交互对象
     */
    private handleMapClick(pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) {
        if (targets.length === 0) return;

        const target = targets[0];
        if (target instanceof Phaser.GameObjects.Graphics) {
            const zoneId = target.getData('zoneId') as number;
            const zone = this.warState.zones.find(z => z.id === zoneId);
            if (!zone) return;

            // 模拟玩家所属联盟（假设玩家属于Guild A）
            const attackerGuild = this.warState.guildA;
            const defenderGuild = zone.defenderGuildId === this.warState.guildB.id ? this.warState.guildB : null;
            const isFriendly = zone.defenderGuildId === attackerGuild.id;

            if (isFriendly) {
                this.logMessage(`[${zone.name}] 区域已在 ${attackerGuild.tag} 掌控中。`);
                return;
            }

            this.logMessage(`[${attackerGuild.tag}] 正在对 [${zone.name}] 发起进攻!`);
            this.simulateBattle(zone, attackerGuild, defenderGuild);
        }
    }

    /**
     * 核心逻辑：模拟一场GB风格的战斗
     * @param zone 目标区域
     * @param attacker 进攻方联盟
     * @param defender 防守方联盟
     */
    private simulateBattle(zone: WarZoneConfig, attacker: Guild, defender: Guild | null) {
        // 模拟战斗结果：基于战力对比的随机结果
        const attackerPower = attacker.power / attacker.members; // 模拟平均战力
        const defenderPower = defender ? defender.power / defender.members : zone.defensePower; // 区域防御力或对方平均战力
        
        const attackChance = attackerPower / (attackerPower + defenderPower);
        const win = Math.random() < attackChance * 1.5; // 进攻方略有优势

        // 模拟GB风格的战斗动画（这里简化为日志输出和区域颜色变化）
        this.time.delayedCall(1000, () => {
            if (win) {
                const oldDefenderTag = zone.defenderGuildId ? (zone.defenderGuildId === this.warState.guildA.id ? this.warState.guildA.tag : this.warState.guildB.tag) : '中立';
                
                // 区域易主
                zone.defenderGuildId = attacker.id;
                
                // 更新图形颜色
                const graphic = this.zoneGraphics.find(g => g.getData('zoneId') === zone.id);
                if (graphic) {
                    graphic.fillStyle(attacker.id === this.warState.guildA.id ? GB_COLORS.RED : GB_COLORS.BLUE);
                    graphic.fillRect(zone.position.x, zone.position.y, 40, 40);
                    graphic.strokeRect(zone.position.x, zone.position.y, 40, 40);
                }

                this.logMessage(`[${zone.name}] 区域被 ${attacker.tag} 成功占领! (原属: ${oldDefenderTag})`);
            } else {
                this.logMessage(`[${zone.name}] 区域防御成功! ${attacker.tag} 进攻失败。`);
            }
        }, [], this);
    }

    /**
     * 更新战斗日志
     * @param message 要添加的消息
     */
    private logMessage(message: string) {
        const currentText = this.battleLogText.text;
        const lines = currentText.split('\n');
        
        // 保持最多5行日志
        if (lines.length >= 5) {
            lines.shift();
        }
        lines.push(`> ${message}`);
        this.battleLogText.setText(lines.join('\n'));
    }
}

// =================================================================================
// 3. 示例用法 (Example Usage) - 模拟Phaser游戏启动
// =================================================================================

// 这是一个完整的Phaser 3配置，用于在浏览器中运行此系统进行测试。
// 在实际项目中，AllianceWarSystem会被集成到主游戏的Scene或Plugin中。

/*
// 完整的Phaser配置 (如果需要测试，请取消注释并在HTML中引用)
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 540, // 模拟GB屏幕比例
    height: 480,
    backgroundColor: GB_COLORS.BACKGROUND.toString(16),
    scene: [AllianceWarSystem],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // 模拟像素艺术的渲染设置
    render: {
        pixelArt: true
    }
};

// const game = new Phaser.Game(config);
*/

// 导出类以便在项目中引用
// export { AllianceWarSystem };
