// client/src/game/systems/SkillTreeSystem.ts

/**
 * @file SkillTreeSystem.ts
 * @description Game Boy风格的技能树系统，使用Phaser 3实现。
 * @author Manus AI
 * @version 1.0.0
 */

// =================================================================
// 1. 数据结构定义
// =================================================================

/**
 * 技能状态枚举
 */
enum SkillStatus {
    Locked = 'LOCKED',          // 未解锁且不满足前置条件
    PrereqMet = 'PREREQ_MET',   // 未解锁但满足前置条件（可学习）
    Unlocked = 'UNLOCKED',      // 已解锁
}

/**
 * 技能数据接口
 */
interface SkillData {
    id: string;
    name: string;
    description: string;
    cost: number; // 学习所需技能点
    prerequisites: string[]; // 前置技能ID列表
    x: number; // 技能在树状图中的X坐标（网格单位）
    y: number; // 技能在树状图中的Y坐标（网格单位）
}

/**
 * 技能节点运行时接口
 */
interface SkillNode extends SkillData {
    status: SkillStatus;
    level: number;
    maxLevel: number;
    graphic?: Phaser.GameObjects.Graphics; // 技能节点的图形对象
    text?: Phaser.GameObjects.Text; // 技能节点的文本对象
}

/**
 * 技能树配置数据
 */
const SKILL_TREE_DATA: SkillData[] = [
    { id: 'start', name: '基础训练', description: '所有技能的起点。', cost: 0, prerequisites: [], x: 2, y: 0 },
    { id: 'str_up_1', name: '力量提升 I', description: '永久提升力量属性。', cost: 1, prerequisites: ['start'], x: 1, y: 2 },
    { id: 'int_up_1', name: '智力提升 I', description: '永久提升智力属性。', cost: 1, prerequisites: ['start'], x: 3, y: 2 },
    { id: 'str_up_2', name: '力量提升 II', description: '进一步提升力量。', cost: 2, prerequisites: ['str_up_1'], x: 1, y: 4 },
    { id: 'fireball', name: '火球术', description: '解锁火球攻击魔法。', cost: 3, prerequisites: ['int_up_1'], x: 4, y: 4 },
    { id: 'mastery', name: '大师级训练', description: '终极技能，大幅增强。', cost: 5, prerequisites: ['str_up_2', 'fireball'], x: 2, y: 6 },
];

// =================================================================
// 2. 样式常量 (Game Boy 风格)
// =================================================================

const GB_STYLE = {
    TILE_SIZE: 64, // 技能节点之间的网格大小
    NODE_SIZE: 24, // 技能节点的直径
    FONT_FAMILY: 'monospace', // 模拟Game Boy字体
    TEXT_COLOR: '#000000', // 黑色
    BG_COLOR: '#c0c7c0', // Game Boy 屏幕背景色
    LINE_COLOR: 0x000000, // 连接线颜色
    LINE_THICKNESS: 2,
    UNLOCKED_COLOR: 0x306850, // 已解锁（深绿）
    PREREQ_MET_COLOR: 0x88c070, // 可学习（浅绿）
    LOCKED_COLOR: 0x43523d, // 未解锁（深灰）
    CURSOR_COLOR: 0xff0000, // 红色光标
};

// =================================================================
// 3. 技能树系统类
// =================================================================

export class SkillTreeSystem {
    private scene: Phaser.Scene;
    private skillPoints: number;
    private skillNodes: Map<string, SkillNode>;
    private container: Phaser.GameObjects.Container;
    private cursor: Phaser.GameObjects.Graphics;
    private selectedNode: SkillNode | null = null;
    private descriptionText: Phaser.GameObjects.Text;
    private pointsText: Phaser.GameObjects.Text;

    /**
     * 构造函数
     * @param scene - Phaser 场景
     * @param initialPoints - 初始技能点数
     */
    constructor(scene: Phaser.Scene, initialPoints: number = 5) {
        this.scene = scene;
        this.skillPoints = initialPoints;
        this.skillNodes = new Map();

        // 初始化技能节点
        this.initializeSkillNodes();

        // 创建容器用于容纳所有技能树元素
        this.container = this.scene.add.container(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2
        );

        // 绘制背景和连接线
        this.drawBackground();
        this.drawConnections();

        // 绘制技能节点
        this.drawSkillNodes();

        // 绘制光标
        this.cursor = this.scene.add.graphics();
        this.container.add(this.cursor);

        // 绘制描述文本区域 (固定在屏幕底部)
        this.descriptionText = this.scene.add.text(
            10,
            this.scene.cameras.main.height - 60,
            '',
            {
                fontFamily: GB_STYLE.FONT_FAMILY,
                fontSize: '14px',
                color: GB_STYLE.TEXT_COLOR,
                wordWrap: { width: this.scene.cameras.main.width - 20 }
            }
        ).setScrollFactor(0); // 不随相机滚动

        // 绘制技能点数显示
        this.pointsText = this.scene.add.text(
            this.scene.cameras.main.width - 10,
            10,
            `技能点: ${this.skillPoints}`,
            {
                fontFamily: GB_STYLE.FONT_FAMILY,
                fontSize: '16px',
                color: GB_STYLE.TEXT_COLOR
            }
        ).setOrigin(1, 0).setScrollFactor(0); // 不随相机滚动

        // 初始化键盘控制
        this.setupInput();

        // 初始选择第一个节点
        this.selectNode(this.skillNodes.get('start')!);
    }

    /**
     * 初始化 SkillNode 运行时数据
     */
    private initializeSkillNodes(): void {
        SKILL_TREE_DATA.forEach(data => {
            const node: SkillNode = {
                ...data,
                status: SkillStatus.Locked,
                level: 0,
                maxLevel: 1, // 简化为只能解锁一次
            };
            this.skillNodes.set(data.id, node);
        });

        // 确保起始节点是已解锁状态
        const startNode = this.skillNodes.get('start');
        if (startNode) {
            startNode.status = SkillStatus.Unlocked;
            startNode.level = 1;
        }

        // 初始更新所有节点状态
        this.updateAllNodeStatuses();
    }

    /**
     * 根据前置条件更新单个技能节点的状态
     * @param node - 技能节点
     */
    private updateNodeStatus(node: SkillNode): void {
        if (node.status === SkillStatus.Unlocked) {
            return; // 已解锁的节点状态不变
        }

        const allPrereqsMet = node.prerequisites.every(prereqId => {
            const prereqNode = this.skillNodes.get(prereqId);
            return prereqNode && prereqNode.status === SkillStatus.Unlocked;
        });

        if (allPrereqsMet) {
            node.status = SkillStatus.PrereqMet;
        } else {
            node.status = SkillStatus.Locked;
        }
    }

    /**
     * 更新所有技能节点的状态
     */
    private updateAllNodeStatuses(): void {
        // 迭代直到状态稳定，以处理多级依赖
        let changed = true;
        while (changed) {
            changed = false;
            this.skillNodes.forEach(node => {
                const oldStatus = node.status;
                this.updateNodeStatus(node);
                if (node.status !== oldStatus) {
                    changed = true;
                }
            });
        }
    }

    /**
     * 将网格坐标转换为屏幕坐标
     * @param x - 网格X坐标
     * @param y - 网格Y坐标
     * @returns 屏幕坐标 { x, y }
     */
    private gridToScreen(x: number, y: number): { x: number, y: number } {
        // 假设技能树居中，x=4是中心
        return {
            x: (x - 4) * GB_STYLE.TILE_SIZE, 
            y: y * GB_STYLE.TILE_SIZE
        };
    }

    /**
     * 绘制技能树背景 (Game Boy 风格的单色背景)
     */
    private drawBackground(): void {
        const bg = this.scene.add.rectangle(
            0, 0,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xc0c7c0 // GB_STYLE.BG_COLOR
        ).setOrigin(0, 0).setScrollFactor(0);
        this.scene.add.existing(bg);
    }

    /**
     * 绘制技能节点之间的连接线
     */
    private drawConnections(): void {
        const graphics = this.scene.add.graphics({
            lineStyle: { width: GB_STYLE.LINE_THICKNESS, color: GB_STYLE.LINE_COLOR }
        });
        this.container.add(graphics);

        this.skillNodes.forEach(node => {
            const { x: fromX, y: fromY } = this.gridToScreen(node.x, node.y);

            node.prerequisites.forEach(prereqId => {
                const prereqNode = this.skillNodes.get(prereqId);
                if (prereqNode) {
                    const { x: toX, y: toY } = this.gridToScreen(prereqNode.x, prereqNode.y);

                    // 绘制直线连接
                    graphics.beginPath();
                    graphics.moveTo(fromX, fromY);
                    graphics.lineTo(toX, toY);
                    graphics.strokePath();
                }
            });
        });
    }

    /**
     * 绘制所有技能节点
     */
    private drawSkillNodes(): void {
        this.skillNodes.forEach(node => {
            const { x, y } = this.gridToScreen(node.x, node.y);

            // 绘制节点图形
            const graphic = this.scene.add.graphics();
            this.container.add(graphic);
            node.graphic = graphic;

            // 绘制节点文本 (技能名称)
            const text = this.scene.add.text(x, y + GB_STYLE.NODE_SIZE / 2 + 5, node.name, {
                fontFamily: GB_STYLE.FONT_FAMILY,
                fontSize: '10px',
                color: GB_STYLE.TEXT_COLOR
            }).setOrigin(0.5, 0);
            this.container.add(text);
            node.text = text;

            // 初始渲染
            this.renderNode(node);

            // 添加交互性 (鼠标点击)
            graphic.setInteractive(new Phaser.Geom.Circle(x, y, GB_STYLE.NODE_SIZE / 2), Phaser.Geom.Circle.Contains);
            graphic.on('pointerdown', () => this.selectNode(node));
        });
    }

    /**
     * 渲染单个技能节点的外观
     * @param node - 技能节点
     */
    private renderNode(node: SkillNode): void {
        const graphic = node.graphic!;
        const { x, y } = this.gridToScreen(node.x, node.y);
        graphic.clear();

        let color;
        switch (node.status) {
            case SkillStatus.Unlocked:
                color = GB_STYLE.UNLOCKED_COLOR;
                break;
            case SkillStatus.PrereqMet:
                color = GB_STYLE.PREREQ_MET_COLOR;
                break;
            case SkillStatus.Locked:
            default:
                color = GB_STYLE.LOCKED_COLOR;
                break;
        }

        // 绘制圆圈背景
        graphic.fillStyle(color, 1);
        graphic.fillCircle(x, y, GB_STYLE.NODE_SIZE / 2);

        // 绘制黑色边框
        graphic.lineStyle(GB_STYLE.LINE_THICKNESS, GB_STYLE.LINE_COLOR, 1);
        graphic.strokeCircle(x, y, GB_STYLE.NODE_SIZE / 2);

        // 绘制已解锁的标记 (如果已解锁)
        if (node.status === SkillStatus.Unlocked) {
            graphic.lineStyle(GB_STYLE.LINE_THICKNESS, GB_STYLE.LINE_COLOR, 1);
            graphic.beginPath();
            // 绘制一个简单的“√”
            graphic.moveTo(x - 8, y + 2);
            graphic.lineTo(x - 2, y + 8);
            graphic.lineTo(x + 8, y - 8);
            graphic.strokePath();
        }
    }

    /**
     * 选中一个技能节点
     * @param node - 要选中的技能节点
     */
    private selectNode(node: SkillNode): void {
        this.selectedNode = node;
        this.updateCursor();
        this.updateDescription();
    }

    /**
     * 更新光标位置和外观
     */
    private updateCursor(): void {
        if (!this.selectedNode) return;

        const { x, y } = this.gridToScreen(this.selectedNode.x, this.selectedNode.y);

        this.cursor.clear();
        this.cursor.lineStyle(GB_STYLE.LINE_THICKNESS, GB_STYLE.CURSOR_COLOR, 1);
        // 绘制一个围绕节点的正方形光标
        const size = GB_STYLE.NODE_SIZE + 8;
        this.cursor.strokeRect(x - size / 2, y - size / 2, size, size);
    }

    /**
     * 更新描述文本区域的内容
     */
    private updateDescription(): void {
        if (!this.selectedNode) {
            this.descriptionText.setText('');
            return;
        }

        const node = this.selectedNode;
        let statusText = '';
        let actionHint = '';

        switch (node.status) {
            case SkillStatus.Unlocked:
                statusText = '[已解锁]';
                actionHint = '（已学习）';
                break;
            case SkillStatus.PrereqMet:
                statusText = `[可学习] 消耗: ${node.cost}点`;
                actionHint = '按 [Z] 学习';
                break;
            case SkillStatus.Locked:
                statusText = '[未解锁]';
                actionHint = '（前置条件未满足）';
                break;
        }

        const prereqs = node.prerequisites.map(id => this.skillNodes.get(id)?.name || '未知').join(', ');
        const prereqLine = prereqs ? `前置: ${prereqs}` : '前置: 无';

        const description = [
            `名称: ${node.name} ${statusText}`,
            `描述: ${node.description}`,
            prereqLine,
            `技能点: ${this.skillPoints}点 ${actionHint}`
        ].join('\n');

        this.descriptionText.setText(description);
    }

    /**
     * 尝试学习当前选中的技能
     */
    private learnSelectedSkill(): void {
        if (!this.selectedNode) return;

        const node = this.selectedNode;

        if (node.status === SkillStatus.Unlocked) {
            console.log(`[SkillTreeSystem] 技能 ${node.name} 已学习。`);
            return;
        }

        if (node.status === SkillStatus.Locked) {
            console.log(`[SkillTreeSystem] 技能 ${node.name} 前置条件未满足。`);
            return;
        }

        if (this.skillPoints < node.cost) {
            console.log(`[SkillTreeSystem] 技能点不足。需要 ${node.cost}，现有 ${this.skillPoints}。`);
            return;
        }

        // 学习成功
        this.skillPoints -= node.cost;
        node.status = SkillStatus.Unlocked;
        node.level = 1;

        console.log(`[SkillTreeSystem] 成功学习技能: ${node.name}。剩余技能点: ${this.skillPoints}`);

        // 更新所有节点状态，因为新解锁的技能可能会满足其他技能的前置条件
        this.updateAllNodeStatuses();
        // 重新渲染所有节点和文本
        this.skillNodes.forEach(n => this.renderNode(n));
        this.pointsText.setText(`技能点: ${this.skillPoints}`);
        this.updateDescription();

        // 触发一个事件，通知游戏系统技能已解锁
        this.scene.events.emit('skillUnlocked', node.id);
    }

    /**
     * 设置键盘输入控制
     */
    private setupInput(): void {
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // 移动光标逻辑 (简化为网格移动)
        const moveCursor = (dx: number, dy: number) => {
            if (!this.selectedNode) return;

            const targetX = this.selectedNode.x + dx;
            const targetY = this.selectedNode.y + dy;

            // 查找目标网格位置的节点
            const targetNode = Array.from(this.skillNodes.values()).find(
                node => node.x === targetX && node.y === targetY
            );

            if (targetNode) {
                this.selectNode(targetNode);
            }
        };

        // 技能树节点布局是稀疏的，为了方便移动，我们直接跳到下一个最近的节点
        const findNextNode = (currentX: number, currentY: number, deltaX: number, deltaY: number): SkillNode | undefined => {
            let minDistance = Infinity;
            let nextNode: SkillNode | undefined;
            
            this.skillNodes.forEach(node => {
                // 检查方向
                if ((deltaY < 0 && node.y < currentY) || 
                    (deltaY > 0 && node.y > currentY) ||
                    (deltaX < 0 && node.x < currentX) ||
                    (deltaX > 0 && node.x > currentX)) {
                    
                    // 简化距离计算，只考虑主要方向
                    const distance = Math.abs(node.x - currentX) * 10 + Math.abs(node.y - currentY);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        nextNode = node;
                    }
                }
            });
            return nextNode;
        };

        const moveByDirection = (deltaX: number, deltaY: number) => {
            if (!this.selectedNode) return;
            
            const nextNode = findNextNode(this.selectedNode.x, this.selectedNode.y, deltaX, deltaY);
            
            if (nextNode) {
                this.selectNode(nextNode);
            }
        };

        cursors.up.on('down', () => moveByDirection(0, -1));
        cursors.down.on('down', () => moveByDirection(0, 1));
        cursors.left.on('down', () => moveByDirection(-1, 0));
        cursors.right.on('down', () => moveByDirection(1, 0));

        // 学习技能键
        zKey.on('down', () => this.learnSelectedSkill());
        
        // 鼠标交互已在 drawSkillNodes 中设置
    }

    /**
     * 获取已解锁的技能ID列表
     * @returns 已解锁的技能ID数组
     */
    public getUnlockedSkills(): string[] {
        return Array.from(this.skillNodes.values())
            .filter(node => node.status === SkillStatus.Unlocked)
            .map(node => node.id);
    }

    /**
     * 外部接口：增加技能点
     * @param amount - 增加的数量
     */
    public addSkillPoints(amount: number): void {
        this.skillPoints += amount;
        this.pointsText.setText(`技能点: ${this.skillPoints}`);
        this.updateAllNodeStatuses();
        this.skillNodes.forEach(n => this.renderNode(n));
        this.updateDescription();
    }
}

// -----------------------------------------------------------------
// 示例用法 (假设在一个Phaser 3 Scene中)
// -----------------------------------------------------------------
/*
// 1. 创建一个场景
class GameScene extends Phaser.Scene {
    private skillTreeSystem: SkillTreeSystem;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // 预加载任何Game Boy风格的字体或资源
        // 注意：Phaser.GameObjects.Text 默认使用 Canvas 字体，
        // 推荐在实际项目中加载一个像素风格的字体文件。
    }

    create() {
        // 实例化技能树系统，初始技能点为 5
        this.skillTreeSystem = new SkillTreeSystem(this, 5);

        // 监听技能解锁事件
        this.events.on('skillUnlocked', (skillId: string) => {
            console.log(`[GameScene] 技能 ${skillId} 已解锁！`);
            // 可以在这里应用属性增益或解锁新能力
        });

        // 示例：5秒后增加技能点
        this.time.delayedCall(5000, () => {
            this.skillTreeSystem.addSkillPoints(3);
            console.log("[GameScene] 获得 3 点技能点！");
        });
    }

    update() {
        // 技能树系统通常不需要在update中进行操作
    }
}

// 2. 配置和启动游戏
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // 设置一个Game Boy风格的背景色
    backgroundColor: GB_STYLE.BG_COLOR
};

// new Phaser.Game(config);
*/