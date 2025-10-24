import Phaser from 'phaser';

/**
 * 昼夜循环系统配置接口
 */
export interface DayNightSystemConfig {
    /** 游戏中的一天对应现实中的秒数 (例如: 240秒 = 4分钟) */
    secondsPerDay: number;
    /** 初始时间 (0-23) */
    initialHour: number;
    /** 最小环境光强度 (0.0 - 1.0) */
    minAmbientIntensity: number;
    /** 最大环境光强度 (0.0 - 1.0) */
    maxAmbientIntensity: number;
    /** 白天开始的小时 (例如: 6) */
    dayStartHour: number;
    /** 夜晚开始的小时 (例如: 18) */
    nightStartHour: number;
    /** 环境光影响的图层名称 (例如: 'ground', 'buildings') */
    affectedLayers: string[];
}

/**
 * 昼夜循环系统
 * 模拟24小时时钟，控制环境光和天空颜色，实现昼夜切换效果。
 * 灵感来源于Game Boy风格的宝可梦游戏，注重性能和易扩展性。
 */
export class DayNightSystem {
    private scene: Phaser.Scene;
    private config: DayNightSystemConfig;

    /** 游戏中的当前小时 (0-23) */
    private currentHour: number;
    /** 游戏中的当前分钟 (0-59) */
    private currentMinute: number;
    /** 游戏中的当前秒数 (0-59) */
    private currentSecond: number;

    /** 计时器，用于跟踪现实时间 */
    private timer: Phaser.Time.TimerEvent;
    /** 游戏时间流逝的速度乘数 */
    private timeScale: number;

    /** 环境光遮罩 (Phaser.GameObjects.Rectangle) */
    private ambientOverlay: Phaser.GameObjects.Rectangle;

    /**
     * 构造函数
     * @param scene 场景实例
     * @param config 昼夜循环系统配置
     */
    constructor(scene: Phaser.Scene, config: DayNightSystemConfig) {
        this.scene = scene;
        this.config = config;
        this.currentHour = config.initialHour;
        this.currentMinute = 0;
        this.currentSecond = 0;

        // 计算时间流逝的速度乘数
        // timeScale = 86400 (游戏秒) / config.secondsPerDay (现实秒)
        this.timeScale = (24 * 60 * 60) / config.secondsPerDay;

        this.createAmbientOverlay();
        this.initializeTimer();
        this.updateTime(0); // 首次调用以设置初始状态
    }

    /**
     * 创建环境光遮罩
     */
    private createAmbientOverlay(): void {
        // 创建一个覆盖整个屏幕的矩形作为环境光遮罩
        this.ambientOverlay = this.scene.add.rectangle(
            0, 0,
            this.scene.sys.game.config.width as number,
            this.scene.sys.game.config.height as number,
            0x000000,
            0.0 // 初始透明度
        )
        .setOrigin(0, 0)
        .setScrollFactor(0) // 不随相机滚动
        .setDepth(999); // 确保在最上层
    }

    /**
     * 初始化时间更新计时器
     */
    private initializeTimer(): void {
        // 每 1000ms (1现实秒) 调用一次 updateTime
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * 更新游戏时间
     * @param delta 现实时间流逝的毫秒数 (来自 Phaser.Time.TimerEvent)
     */
    private updateTime(delta: number): void {
        // 实际流逝的现实秒数 (对于 loop: true 的 timerEvent，delta 总是 1000)
        const realSecondsElapsed = 1; 
        // 游戏时间流逝的秒数
        const gameSecondsElapsed = realSecondsElapsed * this.timeScale;

        this.currentSecond += gameSecondsElapsed;

        while (this.currentSecond >= 60) {
            this.currentSecond -= 60;
            this.currentMinute += 1;
        }

        while (this.currentMinute >= 60) {
            this.currentMinute -= 60;
            this.currentHour += 1;
        }

        while (this.currentHour >= 24) {
            this.currentHour -= 24;
            // 可以在这里触发“新的一天”事件
            this.scene.events.emit('daynight-new-day', this.currentHour);
        }

        // 更新环境光和颜色
        this.updateAmbientLight();

        // 检查并触发灯光开关事件
        this.checkLightSwitch();

        // 触发时间更新事件
        this.scene.events.emit('daynight-time-update', this.currentHour, this.currentMinute);
    }

    /**
     * 根据当前时间更新环境光强度和颜色
     */
    private updateAmbientLight(): void {
        const { dayStartHour, nightStartHour, minAmbientIntensity, maxAmbientIntensity } = this.config;

        // ----------------------------------------------------------------
        // 1. 计算环境光强度 (Ambient Intensity)
        // ----------------------------------------------------------------
        
        let intensity: number;
        const totalHours = 24;
        const currentHourFloat = this.currentHour + (this.currentMinute / 60);

        // 假设光照变化周期从 dayStartHour 到 nightStartHour，再到 dayStartHour
        const midday = (nightStartHour + dayStartHour) / 2;
        
        if (currentHourFloat >= dayStartHour && currentHourFloat < nightStartHour) {
            // 白天阶段 (光线增强或减弱)
            
            if (currentHourFloat < midday) {
                // 上午：从 dayStartHour 到 midday，强度从 minAmbientIntensity 升到 maxAmbientIntensity
                const hoursSinceDayStart = currentHourFloat - dayStartHour;
                const morningDuration = midday - dayStartHour;
                const progress = hoursSinceDayStart / morningDuration;
                intensity = Phaser.Math.Linear(minAmbientIntensity, maxAmbientIntensity, progress);
            } else {
                // 下午：从 midday 到 nightStartHour，强度从 maxAmbientIntensity 降到 minAmbientIntensity
                const hoursUntilNight = nightStartHour - currentHourFloat;
                const afternoonDuration = nightStartHour - midday;
                const progress = 1.0 - (hoursUntilNight / afternoonDuration); // 反向进度
                intensity = Phaser.Math.Linear(maxAmbientIntensity, minAmbientIntensity, progress);
            }

            // 确保强度在 [min, max] 范围内
            intensity = Phaser.Math.Clamp(intensity, minAmbientIntensity, maxAmbientIntensity);

        } else {
            // 夜晚阶段 (光线最弱)
            intensity = minAmbientIntensity;
        }

        // 映射强度到 Alpha (黑暗度):
        // 当 intensity = maxAmbientIntensity 时, alpha = 0 (完全白天)
        // 当 intensity = minAmbientIntensity 时, alpha = 1 (完全黑夜)
        const intensityRange = maxAmbientIntensity - minAmbientIntensity;
        let alpha = 1.0 - (intensity - minAmbientIntensity) / intensityRange;
        
        // 确保 alpha 在 0.0 到 1.0 之间
        alpha = Phaser.Math.Clamp(alpha, 0.0, 1.0);
        this.ambientOverlay.setAlpha(alpha);


        // ----------------------------------------------------------------
        // 2. 计算天空颜色/遮罩颜色 (Sky Color/Tint)
        // ----------------------------------------------------------------
        
        // 定义关键时间点的颜色
        const colorMap = [
            { hour: 0, color: 0x000033 }, // 00:00 午夜 (深蓝)
            { hour: 5, color: 0x333366 }, // 05:00 黎明前 (蓝紫)
            { hour: 6, color: 0x99ccff }, // 06:00 日出 (浅蓝)
            { hour: 8, color: 0xffffff }, // 08:00 白天 (白色/无色)
            { hour: 17, color: 0xffcc99 }, // 17:00 黄昏 (橙黄)
            { hour: 19, color: 0x663366 }, // 19:00 日落后 (深紫)
            { hour: 21, color: 0x000033 }, // 21:00 深夜 (深蓝)
            { hour: 24, color: 0x000033 }, // 循环回午夜
        ];

        let startColorEntry = colorMap[0];
        let endColorEntry = colorMap[1];
        let progress = 0;
        let foundInterval = false;

        for (let i = 0; i < colorMap.length - 1; i++) {
            if (currentHourFloat >= colorMap[i].hour && currentHourFloat < colorMap[i + 1].hour) {
                startColorEntry = colorMap[i];
                endColorEntry = colorMap[i + 1];
                
                const duration = endColorEntry.hour - startColorEntry.hour;
                const timeElapsed = currentHourFloat - startColorEntry.hour;
                progress = timeElapsed / duration;
                foundInterval = true;
                break;
            }
        }
        
        // 特殊处理跨越午夜的情况 (21点到5点)
        if (!foundInterval) {
            if (currentHourFloat >= 21) {
                startColorEntry = colorMap[6]; // 21点
                endColorEntry = colorMap[7]; // 24点 (0点)
                const duration = 24 - 21;
                const timeElapsed = currentHourFloat - 21;
                progress = timeElapsed / duration;
            } else if (currentHourFloat < 5) {
                // 0点到5点
                startColorEntry = colorMap[0]; // 0点
                endColorEntry = colorMap[1]; // 5点
                const duration = 5 - 0;
                const timeElapsed = currentHourFloat - 0;
                progress = timeElapsed / duration;
            }
        }
        
        // 确保 progress 不超过 1
        progress = Phaser.Math.Clamp(progress, 0, 1);

        const currentColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(startColorEntry.color),
            new Phaser.Display.Color(endColorEntry.color),
            255, // 颜色范围
            Math.floor(progress * 255) // 进度
        ).color;

        // 将颜色应用到遮罩上
        this.ambientOverlay.setFillStyle(currentColor, alpha);
        
        // ----------------------------------------------------------------
        // 3. 调整Tilemap图层的Tint (Game Boy风格)
        // ----------------------------------------------------------------
        
        // 遍历所有受影响的图层，应用Tint来模拟环境光影响
        this.config.affectedLayers.forEach(layerName => {
            const layer = this.scene.children.getByName(layerName) as Phaser.Tilemaps.TilemapLayer;
            if (layer) {
                if (alpha > 0.05) {
                    // 只在夜晚或黄昏时应用颜色
                    layer.setTint(currentColor);
                } else {
                    layer.setTint(0xffffff); // 白天移除 Tint
                }
            }
        });
    }

    /**
     * 检查是否需要触发灯光开关事件
     */
    private checkLightSwitch(): void {
        const isNight = this.currentHour >= this.config.nightStartHour || this.currentHour < this.config.dayStartHour;
        
        // 触发一个自定义事件，让游戏中的灯光对象监听
        this.scene.events.emit('daynight-light-switch', isNight);
    }

    /**
     * 获取当前格式化的时间 (HH:MM)
     * @returns 格式化的时间字符串
     */
    public getFormattedTime(): string {
        const h = String(Math.floor(this.currentHour)).padStart(2, '0');
        const m = String(Math.floor(this.currentMinute)).padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * 获取当前小时
     * @returns 当前小时 (0-23)
     */
    public getCurrentHour(): number {
        return this.currentHour;
    }

    /**
     * 获取当前环境光的 Alpha 值 (黑暗度)
     * @returns 黑暗度 (0.0 - 1.0)
     */
    public getDarknessAlpha(): number {
        return this.ambientOverlay.alpha;
    }

    /**
     * 销毁系统
     */
    public destroy(): void {
        this.timer.destroy();
        this.ambientOverlay.destroy();
    }
}
