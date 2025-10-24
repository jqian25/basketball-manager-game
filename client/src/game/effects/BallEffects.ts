// client/src/game/effects/BallEffects.ts

import * as Phaser from 'phaser';

/**
 * 篮球动作视觉特效系统
 * 使用Phaser 3的粒子系统和Tween动画实现投篮、传球和扣篮的视觉反馈。
 * 旨在提供高性能和优秀的视觉效果。
 */
export class BallEffects {

    private scene: Phaser.Scene;
    private particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

    /**
     * 构造函数
     * @param scene 当前Phaser场景
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // 创建一个全局粒子管理器，用于管理所有特效的粒子发射器
        // 这样可以复用纹理，提高性能。
        this.particleManager = scene.add.particles('particleTexture'); // 假设已加载名为 'particleTexture' 的纹理

        // 预加载纹理（在实际项目中，这应该在Scene的preload方法中完成）
        // 为了代码的完整性，这里假设 'particleTexture' 已经是一个可用的白色圆点或星形纹理。
        // 如果没有预加载，Phaser会报错。在实际运行前，需要确保场景中已加载所需资源。
        // 例如：scene.load.image('particleTexture', 'assets/images/sparkle.png');
    }

    /**
     * 投篮特效 (Swish/进球特效)
     * 在篮球穿过篮筐时触发，模拟"刷网"的干净利落感和得分的兴奋感。
     * @param x 进球点的X坐标
     * @param y 进球点的Y坐标
     */
    public shootEffect(x: number, y: number): void {
        // 1. 粒子特效：金光闪耀
        const swishEmitter = this.particleManager.createEmitter({
            frame: 0, // 如果是图集，指定帧
            x: x,
            y: y,
            speed: { min: 100, max: 300 },
            angle: { min: 225, max: 315 }, // 向上方和两侧散开
            gravityY: 500, // 粒子受重力影响下落
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600, // 粒子生命周期较短
            quantity: 10, // 瞬间爆发的粒子数量
            blendMode: Phaser.BlendModes.ADD, // 使用叠加模式增强发光效果
            active: true,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 10), quantity: 10 }, // 从一个小圆圈边缘发射
        });

        // 立即发射一次并停止
        swishEmitter.explode(15, x, y);
        this.scene.time.delayedCall(600, () => {
            swishEmitter.stop();
            swishEmitter.remove(); // 性能优化：移除不再需要的发射器
        });

        // 2. 镜头/屏幕效果：轻微震动
        this.scene.cameras.main.shake(150, 0.005);
    }

    /**
     * 传球特效 (Speed Trail/能量线)
     * 模拟篮球高速移动时的拖尾和能量感，强调传球的速度和精准。
     * @param startX 起点X坐标
     * @param startY 起点Y坐标
     * @param endX 终点X坐标
     * @param endY 终点Y坐标
     * @param duration 传球持续时间 (毫秒)
     */
    public passEffect(startX: number, startY: number, endX: number, endY: number, duration: number = 300): void {
        // 1. 粒子发射器配置
        const passEmitter = this.particleManager.createEmitter({
            frame: 0,
            x: startX,
            y: startY,
            speed: 0, // 粒子本身不移动，跟随发射器
            scale: { start: 0.3, end: 0.1 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 200, // 较短的生命周期形成拖尾
            frequency: 10, // 较高的频率形成连续的线
            blendMode: Phaser.BlendModes.ADD,
            tint: [0x00ffff, 0x0088ff], // 蓝青色调，模拟能量
            active: true,
        });

        // 2. 运动路径Tween
        this.scene.tweens.add({
            targets: passEmitter,
            x: endX,
            y: endY,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                // 传球结束后，停止发射粒子，并在粒子生命周期结束后移除发射器
                passEmitter.on = false;
                this.scene.time.delayedCall(200, () => {
                    passEmitter.remove(); // 性能优化：移除不再需要的发射器
                });
            }
        });
    }

    /**
     * 扣篮特效 (Slam Dunk/冲击波)
     * 模拟扣篮时对篮筐和地面的强大冲击力。
     * @param x 扣篮点的X坐标
     * @param y 扣篮点的Y坐标 (通常在篮筐下方)
     */
    public dunkEffect(x: number, y: number): void {
        // 1. 冲击波粒子：圆形向外扩散
        const shockwaveEmitter = this.particleManager.createEmitter({
            frame: 0,
            x: x,
            y: y,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 }, // 全方位扩散
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 20,
            blendMode: Phaser.BlendModes.SCREEN, // 屏幕模式，更亮
            tint: 0xff8800, // 橙色调，模拟爆炸或冲击波
            active: true,
        });

        // 立即发射一次并停止
        shockwaveEmitter.explode(30, x, y);
        this.scene.time.delayedCall(500, () => {
            shockwaveEmitter.stop();
            shockwaveEmitter.remove(); // 性能优化：移除不再需要的发射器
        });

        // 2. 镜头/屏幕效果：剧烈震动和短暂缩放
        this.scene.cameras.main.shake(300, 0.015); // 比投篮更剧烈的震动
        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            zoom: 1.05, // 短暂放大
            duration: 100,
            yoyo: true, // 放大后立即缩小回原状
            ease: 'Sine.easeInOut',
        });
    }

    /**
     * 销毁粒子管理器，在场景销毁时调用，防止内存泄漏。
     */
    public destroy(): void {
        if (this.particleManager) {
            this.particleManager.destroy();
        }
    }
}

// -----------------------------------------------------------------------------------
// 使用示例 (仅为演示，实际应在场景的create方法中调用)
// -----------------------------------------------------------------------------------
/*
class GameScene extends Phaser.Scene {
    private ballEffects: BallEffects;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // 必须加载粒子纹理
        this.load.image('particleTexture', 'assets/images/sparkle.png');
        // 假设sparkle.png是一个小的白色圆点或星形图片
    }

    create() {
        this.ballEffects = new BallEffects(this);

        // 模拟投篮特效
        // this.time.delayedCall(1000, () => {
        //     this.ballEffects.shootEffect(400, 300);
        // });

        // 模拟传球特效
        // this.time.delayedCall(3000, () => {
        //     this.ballEffects.passEffect(100, 500, 700, 500, 500);
        // });

        // 模拟扣篮特效
        // this.time.delayedCall(5000, () => {
        //     this.ballEffects.dunkEffect(400, 550);
        // });
    }

    update() {
        // ...
    }
}
*/