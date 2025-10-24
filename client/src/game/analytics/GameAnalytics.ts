/**
 * client/src/game/analytics/GameAnalytics.ts
 * 
 * 游戏数据统计模块
 * 
 * 这是一个生产级质量的TypeScript模块，用于处理游戏内的数据统计和事件追踪。
 * 它设计为易于扩展和维护，支持多种数据统计后端（如Google Analytics, Amplitude, 自建API等）。
 * 在Phaser 3游戏环境中，它通常作为一个单例或通过依赖注入的方式在游戏场景或管理器中使用。
 */

// 定义事件属性的类型，方便类型检查和代码提示
export type AnalyticsProperties = { [key: string]: string | number | boolean };

/**
 * GameAnalytics类
 * 
 * 实现了游戏数据统计的核心逻辑。
 * 使用单例模式确保全局只有一个实例。
 */
export class GameAnalytics {
    // 单例实例
    private static instance: GameAnalytics;
    
    // 统计后端是否已初始化
    private isInitialized: boolean = false;

    // 待发送的事件队列，用于在初始化完成前缓存事件
    private eventQueue: { eventName: string, properties?: AnalyticsProperties }[] = [];

    /**
     * 私有构造函数，强制使用getInstance()获取实例。
     * @private
     */
    private constructor() {
        // 在这里可以进行一些初始设置，但真正的后端初始化应该在init()中进行
        console.log('[GameAnalytics] 模块已加载。');
    }

    /**
     * 获取GameAnalytics的单例实例。
     * @returns GameAnalytics的单例实例
     */
    public static getInstance(): GameAnalytics {
        if (!GameAnalytics.instance) {
            GameAnalytics.instance = new GameAnalytics();
        }
        return GameAnalytics.instance;
    }

    /**
     * 初始化数据统计服务。
     * 
     * 这是一个异步方法，模拟初始化外部SDK或API连接的过程。
     * 在实际项目中，应在此处加载并配置具体的统计SDK。
     * 
     * @param apiKey 统计服务的API Key
     * @param userId 当前用户的ID
     * @returns Promise<void>
     */
    public async init(apiKey: string, userId: string): Promise<void> {
        if (this.isInitialized) {
            console.warn('[GameAnalytics] 已经初始化，跳过。');
            return;
        }

        console.log(`[GameAnalytics] 正在使用Key: ${apiKey} 和 UserID: ${userId} 初始化统计服务...`);
        
        // --- 模拟异步初始化过程 ---
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟和SDK加载
        // --------------------------

        // 实际项目中，在这里调用具体的统计SDK初始化方法，例如：
        // MyAnalyticsSDK.initialize(apiKey);
        // MyAnalyticsSDK.setUserId(userId);
        // MyAnalyticsSDK.setUserProperties({ gameVersion: '1.0.0', platform: 'web' });

        this.isInitialized = true;
        console.log('[GameAnalytics] 统计服务初始化完成。');

        // 处理初始化前缓存的事件
        this.processQueue();
    }

    /**
     * 追踪一个游戏事件。
     * 
     * 如果统计服务尚未初始化，事件将被缓存。
     * 
     * @param eventName 事件的名称，例如 'level_start', 'item_purchased'
     * @param properties 事件相关的属性，例如 { level: 1, difficulty: 'easy' }
     */
    public trackEvent(eventName: string, properties?: AnalyticsProperties): void {
        if (!eventName || typeof eventName !== 'string') {
            console.error('[GameAnalytics] trackEvent: 事件名称无效。');
            return;
        }

        const logMessage = `[GameAnalytics] 追踪事件: ${eventName}` + 
                           (properties ? ` (属性: ${JSON.stringify(properties)})` : '');

        if (this.isInitialized) {
            console.log(logMessage);
            this.sendToBackend(eventName, properties);
        } else {
            console.warn(logMessage + ' - 缓存中 (未初始化)');
            this.eventQueue.push({ eventName, properties });
        }
    }

    /**
     * 追踪一个屏幕或场景的访问。
     * 
     * @param screenName 屏幕或场景的名称，例如 'MainMenu', 'LevelScene'
     */
    public trackScreen(screenName: string): void {
        this.trackEvent('screen_view', { screen_name: screenName });
    }

    /**
     * 追踪用户属性的设置或更新。
     * 
     * @param properties 用户属性，例如 { total_gold: 1000, last_level_completed: 5 }
     */
    public setUserProperties(properties: AnalyticsProperties): void {
        if (!this.isInitialized) {
            console.warn('[GameAnalytics] setUserProperties: 统计服务未初始化，属性设置将被忽略。');
            return;
        }

        console.log(`[GameAnalytics] 设置用户属性: ${JSON.stringify(properties)}`);
        // 实际项目中，在这里调用具体的统计SDK设置用户属性的方法，例如：
        // MyAnalyticsSDK.setUserProperties(properties);
    }

    /**
     * 刷新待发送的事件队列。
     * 当初始化完成后调用。
     * @private
     */
    private processQueue(): void {
        if (this.eventQueue.length > 0) {
            console.log(`[GameAnalytics] 正在处理 ${this.eventQueue.length} 个缓存事件...`);
            this.eventQueue.forEach(event => {
                this.sendToBackend(event.eventName, event.properties);
            });
            this.eventQueue = []; // 清空队列
            console.log('[GameAnalytics] 缓存事件处理完毕。');
        }
    }

    /**
     * 实际将事件发送到数据统计后端的方法。
     * 
     * 这是核心的集成点。在实际项目中，这里将包含与第三方SDK或自建API的交互逻辑。
     * 
     * @param eventName 事件名称
     * @param properties 事件属性
     * @private
     */
    private sendToBackend(eventName: string, properties?: AnalyticsProperties): void {
        // 生产环境中，这里会调用实际的统计SDK方法，例如：
        // MyAnalyticsSDK.track(eventName, properties);

        // 为了示例，我们只打印日志
        // console.log(`[GameAnalytics] [BACKEND] 发送: ${eventName}`, properties);
    }

    /**
     * 销毁实例（主要用于单元测试或特殊场景）。
     * 
     * 注意：在大多数游戏生命周期中，单例不需要被销毁。
     */
    public static destroy(): void {
        if (GameAnalytics.instance) {
            GameAnalytics.instance.isInitialized = false;
            GameAnalytics.instance.eventQueue = [];
            // 在实际项目中，这里可能需要调用SDK的关闭或清理方法
            console.log('[GameAnalytics] 实例已销毁。');
            (GameAnalytics.instance as any) = null;
        }
    }
}

// ----------------------------------------------------------------
// 使用示例 (在Phaser 3场景或游戏主文件中)
// ----------------------------------------------------------------

/*
// 1. 获取实例
const analytics = GameAnalytics.getInstance();

// 2. 初始化服务 (通常在游戏加载或用户登录后)
// 注意：初始化是异步的
analytics.init('YOUR_ANALYTICS_API_KEY', 'user_12345')
    .then(() => {
        console.log('数据统计服务已就绪。');
    });

// 3. 追踪事件 (在游戏流程中随时调用)
// 即使在初始化完成前调用，事件也会被缓存
analytics.trackEvent('game_start', {
    mode: 'story',
    difficulty: 'hard'
});

// 4. 追踪场景/屏幕
// 比如在Phaser Scene的create方法中
analytics.trackScreen('MainMenuScene');

// 5. 追踪用户行为
setTimeout(() => {
    analytics.trackEvent('level_completed', {
        level_id: 5,
        time_seconds: 120,
        enemies_killed: 45
    });
    
    analytics.setUserProperties({
        total_levels_completed: 5,
        last_level_time: 120
    });
}, 2000); // 模拟2秒后完成关卡
*/