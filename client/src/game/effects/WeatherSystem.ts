import * as Phaser from 'phaser';

/**
 * 定义支持的天气类型枚举
 */
export enum WeatherType {
    CLEAR = 'clear', // 晴天
    RAIN = 'rain',   // 雨天
    SNOW = 'snow',   // 雪天
}

/**
 * 天气系统的配置接口
 * 用于定义不同天气效果的粒子参数
 */
interface WeatherConfig {
    [key: string]: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig | null;
}

/**
 * 宝可梦Game Boy风格的天气系统实现。
 * 使用Phaser 3的粒子系统（Particle Emitter）来模拟雨和雪的效果，
 * 并通过简单的像素化粒子和颜色模拟Game Boy的复古视觉。
 * 
 * 为了性能优化，所有粒子都使用一个通用的ParticleManager，并根据
 * 天气类型切换不同的Emitter配置。
 */
export class WeatherSystem {
    private scene: Phaser.Scene;
    private currentWeather: WeatherType = WeatherType.CLEAR;
    private particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

    // 粒子纹理的键名
    private static readonly PARTICLE_KEY = 'weatherParticle';
    // 默认的Game Boy风格颜色（例如，深色背景下的浅色粒子）
    private static readonly RAIN_COLOR = 0x88bbee; // 浅蓝色/灰色
    private static readonly SNOW_COLOR = 0xffffff; // 白色

    /**
     * 构造函数
     * @param scene 当前场景
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // 1. 预加载粒子纹理（必须在场景的preload中调用此方法）
        // 生产环境中，最好在场景的preload方法中调用一个静态的preload方法
        if (!this.scene.textures.exists(WeatherSystem.PARTICLE_KEY)) {
            this.createParticleTexture();
        }

        // 2. 创建粒子管理器
        // 粒子管理器是一个高性能的容器，用于管理多个粒子发射器
        this.particleManager = this.scene.add.particles(0, 0, WeatherSystem.PARTICLE_KEY);
        // 确保粒子管理器位于最顶层
        this.particleManager.setDepth(Infinity);

        // 3. 初始设置为晴天
        this.setWeather(WeatherType.CLEAR);
    }

    /**
     * [私有方法] 创建一个简单的像素化粒子纹理。
     * Game Boy风格要求粒子简单、像素化。这里创建一个1x1的白色像素。
     */
    private createParticleTexture(): void {
        const graphics = this.scene.add.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 1, 1); // 1x1 像素
        graphics.generateTexture(WeatherSystem.PARTICLE_KEY, 1, 1);
        graphics.destroy();
    }

    /**
     * [私有方法] 定义不同天气类型的粒子发射器配置。
     * Game Boy风格的特点是粒子数量适中，速度较快，且尺寸固定。
     */
    private getWeatherConfigs(): WeatherConfig {
        const gameWidth = this.scene.sys.game.config.width as number;
        const gameHeight = this.scene.sys.game.config.height as number;

        // 基础粒子配置，用于雨和雪
        const baseConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            frame: 0,
            x: { min: 0, max: gameWidth }, // 粒子从屏幕顶部随机位置落下
            y: -10, // 从屏幕上方开始
            gravityY: 0, // 粒子系统使用自己的速度/加速度控制，不使用场景重力
            lifespan: { min: gameHeight * 10, max: gameHeight * 15 }, // 粒子生命周期取决于屏幕高度和速度
            speedY: 0, // 初始速度为0, 由setSpeed控制
            scale: 1, // 1x1 像素，保持Game Boy风格
            blendMode: 'NORMAL', // 保持简单，不使用ADD等混合模式
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, -10, gameWidth, 10), // 顶部发射区域
                quantity: 1,
                yoyo: false,
            },
        };

        return {
            [WeatherType.CLEAR]: null, // 晴天不需要粒子

            [WeatherType.RAIN]: {
                ...baseConfig,
                // 雨滴：速度快，数量多，颜色为浅蓝/灰色
                speedY: { min: 400, max: 600 }, // 快速下落
                quantity: 5, // 每帧发射数量，控制密度
                frequency: 50, // 发射间隔（毫秒），与quantity共同控制密度
                tint: WeatherSystem.RAIN_COLOR,
                // 模拟雨滴的拉伸效果 (Game Boy风格的雨滴通常是垂直线条)
                scaleX: 1,
                scaleY: { min: 4, max: 8 }, // 垂直拉伸，模拟雨线
                // 粒子在到达底部后重新发射
                bounds: new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight),
                collideBottom: true,
                onCollide: (particle, emitter) => {
                    // 粒子到达底部后重置位置，模拟无限循环的雨
                    particle.x = Phaser.Math.Between(0, gameWidth);
                    particle.y = -particle.scaleY.y * 10; // 重置到顶部
                    particle.life = particle.maxLife; // 重置生命周期
                },
                // 禁用默认的死亡后重置，我们使用onCollide手动重置
                // maxParticles: 200, // 最大粒子数，用于性能控制
            },

            [WeatherType.SNOW]: {
                ...baseConfig,
                // 雪花：速度慢，数量适中，颜色为白色，有轻微的横向摆动
                speedY: { min: 30, max: 80 }, // 慢速下落
                quantity: 1,
                frequency: 100,
                tint: WeatherSystem.SNOW_COLOR,
                scaleX: { min: 1, max: 2 }, // 雪花尺寸稍大
                scaleY: { min: 1, max: 2 },
                // 增加轻微的横向速度变化，模拟风吹
                speedX: { min: -10, max: 10 },
                // 粒子在到达底部后重新发射
                bounds: new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight),
                collideBottom: true,
                onCollide: (particle, emitter) => {
                    // 粒子到达底部后重置位置
                    particle.x = Phaser.Math.Between(0, gameWidth);
                    particle.y = -particle.scaleY.y * 10;
                    particle.life = particle.maxLife;
                },
            }
        };
    }

    /**
     * 切换当前天气效果。
     * @param type 要设置的天气类型。
     */
    public setWeather(type: WeatherType): void {
        if (this.currentWeather === type) {
            return; // 避免重复设置
        }

        this.currentWeather = type;

        // 停止并销毁旧的发射器
        if (this.emitter) {
            this.emitter.stop();
            this.emitter.remove(); // 从管理器中移除
            this.emitter = null;
        }

        const config = this.getWeatherConfigs()[type];

        if (config) {
            // 创建新的发射器并添加到管理器
            this.emitter = this.particleManager.createEmitter(config);
            // 确保发射器在场景坐标系中，并覆盖整个屏幕
            this.emitter.setPosition(0, 0); 
            this.emitter.start();
        }

        console.log(`[WeatherSystem] Weather set to: ${type}`);
    }

    /**
     * 获取当前天气类型。
     * @returns 当前天气类型。
     */
    public getCurrentWeather(): WeatherType {
        return this.currentWeather;
    }

    /**
     * 在场景更新循环中调用，用于处理一些需要每帧更新的逻辑（目前粒子系统自动更新，此方法预留）。
     * @param time 当前时间
     * @param delta 帧间隔时间
     */
    public update(time: number, delta: number): void {
        // 预留：如果需要更复杂的逻辑（如风力变化、背景滤镜等），可以在此实现。
        // 例如：根据风速调整粒子的speedX
        // if (this.emitter && this.currentWeather === WeatherType.SNOW) {
        //     // 动态调整雪花的横向速度
        // }
    }

    /**
     * 销毁天气系统对象，释放资源。
     */
    public destroy(): void {
        if (this.emitter) {
            this.emitter.stop();
            this.emitter.remove();
        }
        this.particleManager.destroy();
        // 销毁创建的纹理，避免内存泄漏 (如果其他地方没有使用的话)
        if (this.scene.textures.exists(WeatherSystem.PARTICLE_KEY)) {
             this.scene.textures.remove(WeatherSystem.PARTICLE_KEY);
        }
    }
}