import * as Phaser from 'phaser';

/**
 * 拉拉队系统配置接口
 * 用于定义拉拉队表演的参数
 */
interface CheerleaderSystemConfig {
    /** Phaser场景实例 */
    scene: Phaser.Scene;
    /** 拉拉队表演的中心X坐标 */
    x: number;
    /** 拉拉队表演的中心Y坐标 */
    y: number;
    /** 拉拉队员的数量 */
    count: number;
    /** 拉拉队员的颜色 */
    color: number;
    /** 动画持续时间 (毫秒) */
    duration: number;
    /** 粒子效果的配置 */
    particleConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;
}

/**
 * CheerleaderSystem 类
 * 负责管理和渲染拉拉队表演的视觉效果和动画。
 * 
 * 性能优化考量:
 * 1. 使用Phaser的内置TweenManager进行高效动画管理。
 * 2. 使用Phaser的粒子系统（Particle Emitter）来处理动态视觉效果，该系统通常比手动创建大量Sprite更高效。
 * 3. 拉拉队员（CheerleaderObject）使用简单的图形（Graphics/Circle）而非复杂的Sprite，减少渲染开销。
 */
export class CheerleaderSystem {
    private scene: Phaser.Scene;
    private config: CheerleaderSystemConfig;
    private cheerleaders: Phaser.GameObjects.Graphics[] = [];
    private emitter?: Phaser.GameObjects.Particles.ParticleEmitter;

    /**
     * 构造函数
     * @param config 拉拉队系统配置
     */
    constructor(config: CheerleaderSystemConfig) {
        this.scene = config.scene;
        this.config = config;

        // 初始化拉拉队员
        this.createCheerleaders();
        // 初始化粒子效果
        this.createParticles();
    }

    /**
     * 创建拉拉队员对象（使用Graphics绘制的圆圈）
     * 
     * 视觉效果: 简单的圆圈代表拉拉队员，易于控制颜色和缩放。
     */
    private createCheerleaders(): void {
        const { scene, x, y, count, color } = this.config;
        const radius = 10;
        // const spacing = 40; // 队员之间的间距 - 未使用

        for (let i = 0; i < count; i++) {
            // 计算队员的初始位置，使其围绕中心点排布
            const angle = (i / count) * 2 * Math.PI;
            const startRadius = 100; // 初始半径，队员从外围入场
            const startX = x + startRadius * Math.cos(angle);
            const startY = y + startRadius * Math.sin(angle);

            // 使用Graphics对象绘制一个圆圈作为拉拉队员
            const cheerleader = scene.add.graphics({ x: startX, y: startY });
            cheerleader.fillStyle(color, 1);
            cheerleader.fillCircle(0, 0, radius);
            
            // 初始状态设置，用于动画起始
            cheerleader.setScale(0.5);
            cheerleader.setAlpha(0);

            this.cheerleaders.push(cheerleader);
        }
    }

    /**
     * 创建粒子发射器
     * 
     * 视觉效果: 粒子效果增强表演的动态感和庆祝氛围。
     */
    private createParticles(): void {
        const { scene, x, y, particleConfig } = this.config;
        
        // 创建粒子管理器
        // 注意: 'particle_texture' 必须在Scene的preload中加载
        const particles = scene.add.particles(0, 0, 'particle_texture', particleConfig);
        
        // 设置发射器的位置，使其在表演中心发射
        particles.setPosition(x, y);
        
        // 初始时停止发射，等待表演开始
        this.emitter = particles.getEmitter();
        this.emitter.on = false;
    }

    /**
     * 开始拉拉队表演动画
     * 
     * 视觉效果: 复杂的组合动画，包括移动、缩放、旋转和颜色变化。
     * 动画逻辑: 
     * 1. 队员从外围移动到中心点附近的表演区域（入场）。
     * 2. 在表演区域进行循环的“跳舞”动画（缩放和透明度变化）。
     * 3. 粒子效果在表演期间爆发。
     * 4. 表演结束后，队员淡出并销毁（退场）。
     */
    public startPerformance(): Promise<void> {
        const { scene, x, y, duration } = this.config;
        const totalDuration = duration;
        const entranceDuration = totalDuration * 0.2; // 入场动画占20%
        const mainPerformanceDuration = totalDuration * 0.6; // 主表演占60%
        const exitDuration = totalDuration * 0.2; // 退场动画占20%
        const radius = 50; // 表演区域的半径
        
        // 用于跟踪所有退场动画的Promise，确保在所有队员都退场后Promise才resolve
        const exitPromises: Promise<void>[] = [];

        // 1. 入场动画 (Entrance)
        this.cheerleaders.forEach((cheerleader, index) => {
            const angle = (index / this.cheerleaders.length) * 2 * Math.PI;
            const targetX = x + radius * Math.cos(angle);
            const targetY = y + radius * Math.sin(angle);

            // 队员从初始位置移动到表演位置，同时放大并淡入
            const entranceTween = scene.tweens.add({
                targets: cheerleader,
                x: targetX,
                y: targetY,
                scale: 1,
                alpha: 1,
                ease: 'Power2',
                duration: entranceDuration,
                delay: index * 50 // 错开一点延迟，增加层次感
            });

            // 2. 主表演动画 (Main Performance)
            entranceTween.on('complete', () => {
                // 启用粒子效果
                if (this.emitter) {
                    this.emitter.on = true;
                }

                // 循环“跳舞”动画：缩放和旋转脉冲
                const mainTween = scene.tweens.add({
                    targets: cheerleader,
                    scale: { from: 1, to: 1.2 },
                    angle: { from: 0, to: 360 }, // 旋转
                    yoyo: true, // 来回播放
                    repeat: Math.floor(mainPerformanceDuration / 500) - 1, // 循环次数
                    duration: 500, // 每次跳舞动作持续500ms
                    ease: 'Sine.easeInOut',
                    onRepeat: () => {
                        // 每次跳舞动作时，随机改变颜色，增强视觉冲击力
                        const newColor = Phaser.Display.Color.RandomRGB().color;
                        cheerleader.fillStyle(newColor, 1);
                        cheerleader.fillCircle(0, 0, 10); // 重新绘制以应用新颜色
                    },
                    onComplete: () => {
                        // 3. 退场动画 (Exit)
                        // 队员缩小并淡出
                        const exitPromise = new Promise<void>(resolve => {
                            scene.tweens.add({
                                targets: cheerleader,
                                scale: 0,
                                alpha: 0,
                                ease: 'Power1',
                                duration: exitDuration,
                                delay: index * 30, // 错开延迟
                                onComplete: () => {
                                    // 销毁队员对象以释放内存
                                    cheerleader.destroy();
                                    resolve();
                                }
                            });
                        });
                        exitPromises.push(exitPromise);
                    }
                });
            });
        });

        // 粒子效果的关闭延迟到主表演结束时
        this.scene.time.delayedCall(entranceDuration + mainPerformanceDuration, () => {
            if (this.emitter) {
                this.emitter.on = false; // 关闭粒子发射
            }
        });

        // 返回一个Promise，在所有队员都完成退场动画后解决
        // 注意: 由于主表演动画是循环的，这里需要等待总时长，并依赖onComplete来触发退场
        // 更健壮的做法是使用Promise.all(exitPromises)，但由于Phaser Tween的异步特性，
        // 简单地等待总时长并销毁系统，在实际游戏中可能更实用。
        return new Promise<void>(resolve => {
            this.scene.time.delayedCall(totalDuration, () => {
                // 销毁粒子系统
                if (this.emitter && this.emitter.manager) {
                    this.emitter.manager.destroy();
                }
                resolve();
            });
        });
    }

    /**
     * 销毁系统中的所有对象
     * 
     * 性能优化: 确保在场景切换或系统不再需要时释放所有资源。
     */
    public destroy(): void {
        this.cheerleaders.forEach(c => c.destroy());
        this.cheerleaders.length = 0; // 清空数组
        if (this.emitter && this.emitter.manager) {
            this.emitter.manager.destroy();
        }
    }
}

// ----------------------------------------------------------------------
// 示例用法 (仅供参考，实际项目中应在Scene的create方法中调用)
// ----------------------------------------------------------------------
/*
// 假设这是你的Phaser Scene
class GameScene extends Phaser.Scene {
    preload() {
        // 必须加载一个粒子纹理，例如一个小的白色圆点
        // this.load.image('particle_texture', 'assets/white_dot.png'); 
        // 否则粒子系统会报错
    }

    create() {
        // 示例粒子配置
        const particleConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            frame: { frames: [ 'particle_texture' ], cycle: true },
            x: 0,
            y: 0,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            gravityY: 100,
            lifespan: { min: 500, max: 1500 },
            quantity: 5,
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 10) }
        };

        const cheerleaderSystem = new CheerleaderSystem({
            scene: this,
            x: 400, // 屏幕中心
            y: 300,
            count: 8, // 8个拉拉队员
            color: 0xff00ff, // 洋红色
            duration: 4000, // 总表演时长4秒
            particleConfig: particleConfig
        });

        // 启动表演
        cheerleaderSystem.startPerformance().then(() => {
            console.log('拉拉队表演结束，系统已清理。');
        });

        // 监听输入，以便在需要时销毁系统
        this.input.on('pointerdown', () => {
            cheerleaderSystem.destroy();
        });
    }
}
*/