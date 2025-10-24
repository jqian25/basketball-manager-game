import * as Phaser from 'phaser';

/**
 * @class ParticleEffects
 * @description 负责管理游戏中的所有粒子效果，包括得分和庆祝效果。
 * 使用Phaser 3的粒子系统实现，并注重性能优化。
 */
export class ParticleEffects {
    private scene: Phaser.Scene;
    // 粒子纹理的键名，假设在场景中已加载名为 'particle_star' 和 'particle_square' 的纹理
    private static readonly STAR_TEXTURE = 'particle_star';
    private static readonly SQUARE_TEXTURE = 'particle_square';

    /**
     * @constructor
     * @param scene 当前的Phaser场景实例
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // 性能优化：预加载粒子纹理，尽管通常在Scene的preload中完成，
        // 但这里假设纹理已加载，并提供一个提示。
        // 在实际项目中，需要确保在调用效果前，这些纹理是可用的。
        // 建议使用简单的几何图形或小尺寸图片作为粒子，以减少GPU负担。
        // 例如，可以动态生成一个小的白色圆点或方块纹理。
        // 为了代码的完整性，我们假设 'particle_star' 和 'particle_square' 已经存在。
        
        // 实际项目中，如果需要动态生成纹理：
        // if (!this.scene.textures.exists(ParticleEffects.STAR_TEXTURE)) {
        //     const graphics = this.scene.add.graphics({ fillStyle: { color: 0xffffff } });
        //     graphics.fillCircle(5, 5, 5);
        //     graphics.generateTexture(ParticleEffects.STAR_TEXTURE, 10, 10);
        //     graphics.destroy();
        // }
    }

    /**
     * @method showScoreEffect
     * @description 在指定位置显示一个短暂的得分粒子效果。
     * 效果特点：向上喷射，快速消失，模拟分数增加的轻快感。
     * @param x 效果的X坐标
     * @param y 效果的Y坐标
     * @param scoreValue 得分数值，可用于影响粒子颜色或数量（此处简化为固定效果）
     */
    public showScoreEffect(x: number, y: number, scoreValue: number): void {
        // 性能优化：使用 createEmitterManager 而不是 add.particles，
        // 并且配置粒子的生命周期短，数量少。
        
        // 颜色根据得分值略微变化，增加视觉反馈
        const startColor = scoreValue >= 100 ? 0xffd700 : 0x00ff00; // 金色或绿色
        const endColor = 0xff0000; // 红色

        const emitter = this.scene.add.particles(x, y, ParticleEffects.STAR_TEXTURE, {
            // 粒子发射器的配置
            frame: { frames: [0, 1, 2, 3], cycle: true }, // 如果纹理是图集，可以使用帧
            lifespan: { min: 400, max: 800 }, // 粒子生命周期短
            speedY: { min: -300, max: -100 }, // 向上喷射
            speedX: { min: -50, max: 50 }, // 略微分散
            gravityY: 500, // 受重力影响，最终会落下
            scale: { start: 0.5, end: 0 }, // 粒子逐渐缩小消失
            angle: { min: 250, max: 290 }, // 向上角度
            alpha: { start: 1, end: 0 }, // 粒子逐渐透明消失
            quantity: 10, // 每次发射的粒子数量较少
            blendMode: 'ADD', // 叠加混合模式，使粒子更亮
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 5) }, // 小范围发射
            
            // 颜色插值
            tint: { start: startColor, end: endColor },
            
            // 仅发射一次
            on: true,
            active: true,
            frequency: -1, // -1 表示只发射一次
            
            // 性能优化：发射后自动销毁
            // 粒子系统本身不会自动销毁，需要手动处理
        });
        
        // 自动销毁发射器，释放资源
        this.scene.time.delayedCall(emitter.lifespan.max + 100, () => {
            emitter.manager.destroy(); // 销毁粒子管理器
        }, [], this);
    }

    /**
     * @method showCelebrationEffect
     * @description 在指定位置显示一个持续时间较长的庆祝粒子效果。
     * 效果特点：大量粒子，五彩斑斓，持续喷射，模拟烟花或彩带。
     * @param x 效果的X坐标
     * @param y 效果的Y坐标
     * @param duration 效果持续时间（毫秒）
     */
    public showCelebrationEffect(x: number, y: number, duration: number = 2000): void {
        // 性能优化：虽然粒子数量多，但通过限制发射速率和生命周期来控制同屏粒子数。
        
        // 随机颜色数组，模拟五彩纸屑
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        // 创建一个粒子发射器管理器
        const manager = this.scene.add.particles(0, 0, ParticleEffects.SQUARE_TEXTURE);
        
        // 配置发射器
        const emitter = manager.createEmitter({
            // 粒子发射器的配置
            x: x,
            y: y,
            lifespan: 1500, // 粒子生命周期适中
            speed: { min: 200, max: 400 }, // 较快的速度
            angle: { min: 0, max: 360 }, // 全方位喷射
            gravityY: 500, // 受重力影响
            scale: { start: 0.8, end: 0.1 }, // 粒子逐渐缩小
            alpha: { start: 1, end: 0 }, // 粒子逐渐透明消失
            quantity: 5, // 每次发射的粒子数量
            frequency: 50, // 发射频率较高，每50毫秒发射一次
            blendMode: 'ADD', // 叠加混合模式
            
            // 随机颜色
            tint: colors[Phaser.Math.Between(0, colors.length - 1)],
            
            // 随机选择颜色
            on: true,
            active: true,
            
            // 随机旋转
            rotate: { min: 0, max: 360 },
            
            // 随机颜色选择器，每次发射时随机选择一种颜色
            tintFill: true, // 确保 tint 作用于整个粒子
            tint: {
                onEmit: (particle, key, t, value) => {
                    return colors[Phaser.Math.Between(0, colors.length - 1)];
                }
            }
        });
        
        // 延迟停止发射器，然后销毁管理器
        this.scene.time.delayedCall(duration, () => {
            emitter.stop(); // 停止发射新粒子
            // 等待所有现有粒子生命周期结束
            this.scene.time.delayedCall(emitter.lifespan.max, () => {
                manager.destroy(); // 销毁粒子管理器
            }, [], this);
        }, [], this);
    }
    
    /**
     * @method showConfettiEffect
     * @description 另一个庆祝效果，模拟五彩纸屑从天而降。
     * 效果特点：从屏幕上方落下，旋转，颜色随机。
     * @param duration 效果持续时间（毫秒）
     * @param count 纸屑数量
     */
    public showConfettiEffect(duration: number = 3000, count: number = 50): void {
        const { width, height } = this.scene.scale;
        
        // 随机颜色数组
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080];
        
        // 创建一个粒子发射器管理器
        const manager = this.scene.add.particles(0, 0, ParticleEffects.SQUARE_TEXTURE);
        
        // 配置发射器
        const emitter = manager.createEmitter({
            // 粒子发射器的配置
            x: { min: 0, max: width }, // 从屏幕上方随机位置发射
            y: 0,
            lifespan: 4000, // 粒子生命周期较长，以便落到底部
            speed: { min: 50, max: 150 }, // 较慢的下落速度
            angle: 90, // 垂直向下
            gravityY: 50, // 极小的重力，模拟空气阻力
            scale: { start: 0.6, end: 0.1 }, // 粒子逐渐缩小
            alpha: { start: 1, end: 0 }, // 粒子逐渐透明消失
            quantity: 1, // 每次发射的粒子数量
            frequency: duration / count, // 根据总数量和持续时间计算发射频率
            blendMode: 'NORMAL', // 普通混合模式
            
            // 随机颜色
            tintFill: true,
            tint: {
                onEmit: (particle, key, t, value) => {
                    return colors[Phaser.Math.Between(0, colors.length - 1)];
                }
            },
            
            // 随机旋转
            rotate: { min: 0, max: 360, end: 720, ease: 'Linear' },
            
            // 仅在屏幕内可见
            bounds: new Phaser.Geom.Rectangle(0, 0, width, height),
            collideBottom: false, // 允许粒子落出屏幕
            
            // 仅发射一次
            on: true,
            active: true,
            // 使用 emitMax 控制总发射数量
            emitMax: count 
        });
        
        // 延迟销毁管理器
        this.scene.time.delayedCall(duration + 4000, () => {
            manager.destroy(); // 销毁粒子管理器
        }, [], this);
    }
}

// ----------------------------------------------------------------
// 示例用法 (假设在一个场景中):
// ----------------------------------------------------------------
/*
class GameScene extends Phaser.Scene {
    private particleEffects: ParticleEffects;

    preload() {
        // 预加载粒子纹理
        // 假设 'particle_star' 是一个星形或圆形的小图
        this.load.image(ParticleEffects.STAR_TEXTURE, 'assets/star.png');
        // 假设 'particle_square' 是一个方形的小图
        this.load.image(ParticleEffects.SQUARE_TEXTURE, 'assets/square.png');
    }

    create() {
        this.particleEffects = new ParticleEffects(this);

        // 示例：点击鼠标左键显示得分效果
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.particleEffects.showScoreEffect(pointer.x, pointer.y, 150);
        });

        // 示例：延迟3秒后显示庆祝效果
        this.time.delayedCall(3000, () => {
            const { width, height } = this.scale;
            this.particleEffects.showCelebrationEffect(width / 2, height / 2, 1500);
            this.particleEffects.showConfettiEffect(4000, 100);
        });
    }
}
*/