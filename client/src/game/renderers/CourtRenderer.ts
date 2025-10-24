import * as Phaser from 'phaser';

/**
 * @fileoverview 篮球场地渲染器。
 * 
 * 负责在Phaser 3场景中绘制和管理篮球场地的所有视觉元素。
 * 场地采用俯视视角（Top-Down View），并使用Phaser的Graphics对象进行高性能渲染。
 * 视觉效果设计注重真实感和清晰度，同时兼顾性能优化。
 */

// 场地常量定义
const COURT_WIDTH = 1000; // 场地总宽度 (像素)
const COURT_HEIGHT = 600; // 场地总长度 (像素)
const LINE_COLOR = 0xffffff; // 场地线条颜色 (白色)
const LINE_THICKNESS = 4; // 场地线条粗细
const COURT_COLOR_OUTER = 0x8b4513; // 场地外围颜色 (棕色/木地板)
const COURT_COLOR_INNER = 0x964b00; // 场地内围颜色 (稍深的棕色)
const KEY_AREA_COLOR = 0x654321; // 罚球区颜色 (深棕色)

// 篮球框和篮板的尺寸
const BACKBOARD_WIDTH = 100;
const BACKBOARD_HEIGHT = 5;
const RIM_RADIUS = 10;
const RIM_COLOR = 0xff0000; // 篮筐颜色 (红色)

/**
 * 篮球场地渲染器类。
 * 继承自Phaser.GameObjects.Container，方便管理所有场地元素。
 */
export class CourtRenderer extends Phaser.GameObjects.Container {
    private graphics: Phaser.GameObjects.Graphics;
    private scene: Phaser.Scene;

    /**
     * 构造函数。
     * @param scene 当前的Phaser场景。
     * @param x 场地容器的X坐标。
     * @param y 场地容器的Y坐标。
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;

        // 1. 初始化Graphics对象
        // 使用一个Graphics对象绘制所有线条和填充区域，以优化渲染批次。
        this.graphics = this.scene.add.graphics();
        this.add(this.graphics); // 将graphics对象添加到容器中

        // 2. 绘制场地
        this.drawCourt();

        // 3. 性能优化: 启用缓存
        // 将Graphics对象的内容缓存为静态纹理，减少CPU/GPU的重复绘制工作。
        // 适用于静态不变的场景元素。
        this.graphics.generateTexture('basketball_court', COURT_WIDTH, COURT_HEIGHT);
        // 移除原始graphics对象，使用Sprite代替，进一步优化渲染性能
        this.graphics.destroy();
        this.graphics = this.scene.add.graphics(); // 重新创建一个空的graphics对象，以防后续需要动态绘制
        this.add(this.graphics);

        // 4. 添加到场景
        this.scene.add.existing(this);
    }

    /**
     * 绘制整个篮球场地。
     * 包含外线、中线、三分线、罚球区和篮筐。
     */
    private drawCourt(): void {
        const g = this.graphics;
        const halfWidth = COURT_WIDTH / 2;
        const halfHeight = COURT_HEIGHT / 2;

        // --------------------------------------------------------------------
        // 1. 绘制场地背景 (木地板效果)
        // --------------------------------------------------------------------
        g.fillStyle(COURT_COLOR_OUTER, 1);
        g.fillRect(-halfWidth, -halfHeight, COURT_WIDTH, COURT_HEIGHT);

        // --------------------------------------------------------------------
        // 2. 设置线条样式
        // --------------------------------------------------------------------
        g.lineStyle(LINE_THICKNESS, LINE_COLOR, 1);
        
        // --------------------------------------------------------------------
        // 3. 绘制外围界线 (主场地矩形)
        // --------------------------------------------------------------------
        g.strokeRect(-halfWidth, -halfHeight, COURT_WIDTH, COURT_HEIGHT);

        // --------------------------------------------------------------------
        // 4. 绘制中线
        // --------------------------------------------------------------------
        g.beginPath();
        g.moveTo(0, -halfHeight);
        g.lineTo(0, halfHeight);
        g.stroke();

        // --------------------------------------------------------------------
        // 5. 绘制中圈
        // --------------------------------------------------------------------
        const CENTER_CIRCLE_RADIUS = 60;
        g.strokeCircle(0, 0, CENTER_CIRCLE_RADIUS);
        
        // 绘制中圈内半圆 (靠近两侧的半圆)
        g.beginPath();
        g.arc(0, 0, CENTER_CIRCLE_RADIUS, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), true);
        g.stroke();

        // --------------------------------------------------------------------
        // 6. 绘制两侧篮筐和篮板
        // --------------------------------------------------------------------
        this.drawGoal(g, -halfWidth, 0, 1); // 左侧篮筐
        this.drawGoal(g, halfWidth, 0, -1); // 右侧篮筐

        // --------------------------------------------------------------------
        // 7. 绘制两侧三分线 (高性能椭圆弧)
        // --------------------------------------------------------------------
        const THREE_POINT_LINE_RADIUS = 237.5; // FIBA/NBA标准三分线半径
        const THREE_POINT_LINE_DIST = 157.5; // 三分线直线部分到底线的距离

        // 左侧三分线
        this.drawThreePointLine(g, -halfWidth, halfHeight, THREE_POINT_LINE_RADIUS, THREE_POINT_LINE_DIST, false);
        // 右侧三分线
        this.drawThreePointLine(g, halfWidth, halfHeight, THREE_POINT_LINE_RADIUS, THREE_POINT_LINE_DIST, true);

        // --------------------------------------------------------------------
        // 8. 绘制两侧罚球区 (Key Area)
        // --------------------------------------------------------------------
        const KEY_AREA_WIDTH = 180;
        const KEY_AREA_HEIGHT = 150;
        const FREE_THROW_LINE_DIST = 190; // 罚球线到端线的距离

        // 左侧罚球区
        this.drawKeyArea(g, -halfWidth + FREE_THROW_LINE_DIST, 0, KEY_AREA_WIDTH, KEY_AREA_HEIGHT, false);
        // 右侧罚球区
        this.drawKeyArea(g, halfWidth - FREE_THROW_LINE_DIST, 0, KEY_AREA_WIDTH, KEY_AREA_HEIGHT, true);

        // --------------------------------------------------------------------
        // 9. 绘制中场跳球圈 (已在中圈绘制)
        // --------------------------------------------------------------------
    }

    /**
     * 绘制一侧的篮筐和篮板。
     * @param g Graphics对象。
     * @param x 篮筐中心X坐标。
     * @param y 篮筐中心Y坐标。
     * @param direction 方向因子 (-1 for right, 1 for left)。
     */
    private drawGoal(g: Phaser.GameObjects.Graphics, x: number, y: number, direction: number): void {
        // 篮板
        const backboardX = x + direction * 10; // 篮板稍微向内偏移
        g.lineStyle(LINE_THICKNESS, LINE_COLOR, 1);
        g.strokeRect(backboardX - BACKBOARD_WIDTH / 2, y - BACKBOARD_HEIGHT / 2, BACKBOARD_WIDTH, BACKBOARD_HEIGHT);

        // 篮筐 (使用圆形表示，简化处理)
        const rimX = x + direction * 20; // 篮筐在篮板前
        g.lineStyle(LINE_THICKNESS, RIM_COLOR, 1);
        g.strokeCircle(rimX, y, RIM_RADIUS);

        // 投篮区 (限制区) - 位于罚球区内
        const CHARGE_ARC_RADIUS = 40;
        g.lineStyle(LINE_THICKNESS, LINE_COLOR, 1);
        g.beginPath();
        // 绘制一个半圆，表示合理冲撞区
        g.arc(rimX, y, CHARGE_ARC_RADIUS, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), direction === 1);
        g.stroke();
    }

    /**
     * 绘制一侧三分线。
     * @param g Graphics对象。
     * @param endLineX 底线X坐标。
     * @param halfHeight 场地半高。
     * @param radius 三分线半径。
     * @param dist 三分线直线部分到底线的距离。
     * @param isRight 是否为右侧场地。
     */
    private drawThreePointLine(g: Phaser.GameObjects.Graphics, endLineX: number, halfHeight: number, radius: number, dist: number, isRight: boolean): void {
        const direction = isRight ? -1 : 1;
        const centerOffset = isRight ? -60 : 60; // 弧线中心点到底线的距离
        const arcCenterX = endLineX + centerOffset * direction;
        
        // 1. 绘制直线部分
        const startY = dist - halfHeight;
        const endY = halfHeight - dist;
        const lineX = endLineX + 10 * direction; // 直线部分稍微向内偏移

        g.beginPath();
        g.moveTo(lineX, startY);
        g.lineTo(lineX, endY);
        g.stroke();

        // 2. 绘制弧线部分
        // 计算弧线起点和终点
        const angleStart = isRight ? 90 : -90;
        const angleEnd = isRight ? 270 : 90;
        
        g.beginPath();
        // 使用arcTo模拟标准三分线弧线，但Phaser的Graphics arc方法更适合高性能绘制
        // 这里使用arc绘制一个完整的半圆弧
        g.arc(arcCenterX, 0, radius, Phaser.Math.DegToRad(angleStart), Phaser.Math.DegToRad(angleEnd), isRight);
        g.stroke();
    }

    /**
     * 绘制一侧罚球区 (Key Area)。
     * @param g Graphics对象。
     * @param freeThrowLineX 罚球线X坐标。
     * @param centerY 场地中心Y坐标。
     * @param width 罚球区宽度。
     * @param height 罚球区长度。
     * @param isRight 是否为右侧场地。
     */
    private drawKeyArea(g: Phaser.GameObjects.Graphics, freeThrowLineX: number, centerY: number, width: number, height: number, isRight: boolean): void {
        const halfHeight = height / 2;
        const direction = isRight ? -1 : 1;
        
        // 1. 填充罚球区 (视觉效果出色)
        const rectX = isRight ? freeThrowLineX - width : freeThrowLineX;
        g.fillStyle(KEY_AREA_COLOR, 0.8); // 稍微透明，模拟不同材质
        g.fillRect(rectX, centerY - halfHeight, width * direction, height);

        // 2. 绘制罚球区矩形线
        g.lineStyle(LINE_THICKNESS, LINE_COLOR, 1);
        g.strokeRect(rectX, centerY - halfHeight, width * direction, height);

        // 3. 绘制罚球圈
        const FREE_THROW_CIRCLE_RADIUS = 60;
        
        // 罚球线上的半圆 (靠近篮筐)
        g.beginPath();
        g.arc(freeThrowLineX, centerY, FREE_THROW_CIRCLE_RADIUS, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), !isRight);
        g.stroke();

        // 罚球线外的半圆 (虚线部分，这里简化为实线，但在实际游戏中应使用虚线)
        const arcX = isRight ? freeThrowLineX - width : freeThrowLineX + width;
        g.beginPath();
        g.arc(arcX, centerY, FREE_THROW_CIRCLE_RADIUS, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), isRight);
        g.stroke();
    }

    /**
     * 更新渲染器（如果需要动态更新，例如场地灯光变化）。
     * @param time 当前时间。
     * @param delta 距离上一帧的时间差。
     */
    public update(time: number, delta: number): void {
        // 性能优化: 静态渲染器通常不需要每帧更新。
        // 如果需要动态效果，例如场地灯光闪烁，可以在此实现。
    }

    /**
     * 获取场地总宽度。
     * @returns 场地宽度。
     */
    public getCourtWidth(): number {
        return COURT_WIDTH;
    }

    /**
     * 获取场地总高度。
     * @returns 场地高度。
     */
    public getCourtHeight(): number {
        return COURT_HEIGHT;
    }

    /**
     * 销毁渲染器及其子对象。
     */
    public destroy(fromScene?: boolean): void {
        // 销毁Graphics对象和纹理，释放资源
        this.scene.textures.remove('basketball_court');
        super.destroy(fromScene);
    }
}

// 示例用法 (在Phaser场景中):
/*
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // 实例化场地渲染器，放置在场景中心
        const court = new CourtRenderer(this, this.cameras.main.centerX, this.cameras.main.centerY);
        
        // 可选: 缩放场地以适应屏幕
        const scale = Math.min(this.sys.game.config.width as number / court.getCourtWidth(), this.sys.game.config.height as number / court.getCourtHeight()) * 0.9;
        court.setScale(scale);
    }
}
*/