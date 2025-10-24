// client/src/game/leaderboard/LeaderboardSystem.ts

/**
 * @file LeaderboardSystem.ts
 * @description 全局排行榜系统。负责与后端API通信，获取和提交排行榜数据。
 *              设计为生产级质量，易于维护，并包含详细注释。
 */

// --- 接口定义 ---

/**
 * @interface ILeaderboardEntry
 * @description 单个排行榜条目的数据结构。
 */
export interface ILeaderboardEntry {
    /** 排名 */
    rank: number;
    /** 用户ID */
    userId: string;
    /** 用户名/昵称 */
    username: string;
    /** 分数 */
    score: number;
    /** 提交时间 (ISO 8601 字符串) */
    timestamp: string;
}

/**
 * @interface ILeaderboardData
 * @description 从后端获取的排行榜数据结构。
 */
export interface ILeaderboardData {
    /** 当前页的排行榜条目列表 */
    entries: ILeaderboardEntry[];
    /** 总条目数 (用于分页) */
    totalCount: number;
    /** 当前页码 (从1开始) */
    currentPage: number;
    /** 每页条目数 */
    pageSize: number;
}

/**
 * @interface ILeaderboardSystemConfig
 * @description 排行榜系统的配置选项。
 */
export interface ILeaderboardSystemConfig {
    /** 后端API的基础URL */
    apiBaseUrl: string;
    /** 获取排行榜的端点 */
    fetchEndpoint: string;
    /** 提交分数的端点 */
    submitEndpoint: string;
    /** 默认每页条目数 */
    defaultPageSize?: number;
}

// --- 核心类实现 ---

/**
 * @class LeaderboardSystem
 * @description 全局排行榜管理类。
 *              - 负责处理所有与排行榜相关的网络请求。
 *              - 采用单例模式或作为服务注入到Phaser场景中。
 *              - 提供了获取排行榜数据和提交新分数的核心功能。
 */
export class LeaderboardSystem {
    private config: ILeaderboardSystemConfig;
    private static instance: LeaderboardSystem;

    /**
     * 私有构造函数，确保只能通过 getInstance 创建实例 (单例模式)。
     * @param config 排行榜系统的配置。
     */
    private constructor(config: ILeaderboardSystemConfig) {
        // 确保配置完整性
        if (!config.apiBaseUrl || !config.fetchEndpoint || !config.submitEndpoint) {
            throw new Error("LeaderboardSystem: Configuration is incomplete. apiBaseUrl, fetchEndpoint, and submitEndpoint are required.");
        }
        this.config = {
            ...config,
            defaultPageSize: config.defaultPageSize || 10,
        };
        console.log(`LeaderboardSystem initialized with API base URL: ${this.config.apiBaseUrl}`);
    }

    /**
     * 获取 LeaderboardSystem 的单例实例。
     * @param config 配置对象。仅在第一次调用时需要传入。
     * @returns LeaderboardSystem 实例。
     */
    public static getInstance(config?: ILeaderboardSystemConfig): LeaderboardSystem {
        if (!LeaderboardSystem.instance) {
            if (!config) {
                throw new Error("LeaderboardSystem must be initialized with a config object on first call.");
            }
            LeaderboardSystem.instance = new LeaderboardSystem(config);
        }
        return LeaderboardSystem.instance;
    }

    /**
     * 辅助方法：构建完整的API URL。
     * @param endpoint API端点路径。
     * @returns 完整的URL字符串。
     */
    private getApiUrl(endpoint: string): string {
        // 确保URL拼接正确，处理斜杠问题
        const baseUrl = this.config.apiBaseUrl.endsWith('/') ? this.config.apiBaseUrl.slice(0, -1) : this.config.apiBaseUrl;
        const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return `${baseUrl}/${path}`;
    }

    /**
     * 异步获取排行榜数据。
     * @param page 页码 (从1开始)。
     * @param pageSize 每页条目数。
     * @returns 包含排行榜条目和分页信息的 Promise。
     */
    public async fetchLeaderboard(page: number = 1, pageSize?: number): Promise<ILeaderboardData> {
        const size = pageSize || this.config.defaultPageSize;
        const url = this.getApiUrl(this.config.fetchEndpoint);
        
        // 构建查询参数
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: size.toString(),
            // 可以添加更多参数，如 timeRange: 'weekly'
        });
        
        try {
            console.log(`Fetching leaderboard: ${url}?${params.toString()}`);
            
            // 生产环境中应使用实际的 fetch
            // const response = await fetch(`${url}?${params.toString()}`);
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const data = await response.json();
            // return data as ILeaderboardData;

            // --- 模拟API响应 (用于演示和测试) ---
            await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
            
            const mockData: ILeaderboardData = {
                totalCount: 1000,
                currentPage: page,
                pageSize: size,
                entries: Array.from({ length: size }, (_, index) => ({
                    rank: (page - 1) * size + index + 1,
                    userId: `user_${1000 - index - (page - 1) * size}`,
                    username: `Player${(page - 1) * size + index + 1}`,
                    score: 10000 - ((page - 1) * size + index) * 50,
                    timestamp: new Date().toISOString(),
                })),
            };
            
            console.log(`Leaderboard data fetched successfully for page ${page}.`);
            return mockData;

        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            // 在生产环境中，可以抛出更具体的业务错误，或返回一个包含错误信息的对象
            throw new Error(`Failed to fetch leaderboard: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * 异步提交新分数到排行榜。
     * @param userId 用户的唯一标识符。
     * @param score 用户的分数。
     * @param username 用户的昵称 (可选，如果后端需要)。
     * @returns 提交结果的 Promise (通常是用户的新排名或其他确认信息)。
     */
    public async submitScore(userId: string, score: number, username?: string): Promise<{ success: boolean, newRank?: number }> {
        const url = this.getApiUrl(this.config.submitEndpoint);
        
        const payload = {
            userId,
            score,
            username,
            // 可以在此添加验证令牌 (如 JWT) 或其他元数据
            gameVersion: "1.0.0",
        };

        try {
            console.log(`Submitting score for user ${userId}: ${score}`);

            // 生产环境中应使用实际的 fetch
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(payload),
            // });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            
            // const result = await response.json();
            // return { success: true, newRank: result.rank };

            // --- 模拟API响应 (用于演示和测试) ---
            await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟
            
            // 模拟提交成功，并返回一个新排名
            const newRank = Math.floor(Math.random() * 100) + 1;
            console.log(`Score submitted successfully. New rank: ${newRank}`);
            return { success: true, newRank };

        } catch (error) {
            console.error(`Error submitting score for user ${userId}:`, error);
            throw new Error(`Failed to submit score: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    /**
     * 示例：如何在Phaser 3场景中使用此系统。
     * 
     * 可以在Phaser的Scene类中，通过以下方式获取实例：
     * 
     * ```typescript
     * import { LeaderboardSystem } from './LeaderboardSystem';
     * 
     * export class MainScene extends Phaser.Scene {
     *     private leaderboardSystem: LeaderboardSystem;
     * 
     *     constructor() {
     *         super({ key: 'MainScene' });
     *     }
     * 
     *     init() {
     *         // 假设在游戏启动时已经初始化过一次
     *         this.leaderboardSystem = LeaderboardSystem.getInstance();
     *     }
     * 
     *     create() {
     *         // 1. 获取排行榜数据
     *         this.leaderboardSystem.fetchLeaderboard(1, 20)
     *             .then(data => {
     *                 console.log("Leaderboard Data:", data.entries);
     *                 // TODO: 在UI中渲染排行榜
     *             })
     *             .catch(error => {
     *                 console.error("Could not load leaderboard:", error);
     *                 // TODO: 显示错误信息给用户
     *             });
     * 
     *         // 2. 提交分数
     *         const finalScore = 12345;
     *         const currentUserId = "player_abc";
     *         this.leaderboardSystem.submitScore(currentUserId, finalScore, "AwesomePlayer")
     *             .then(result => {
     *                 if (result.success) {
     *                     console.log(`Score submitted. New Rank: ${result.newRank}`);
     *                 }
     *             })
     *             .catch(error => {
     *                 console.error("Score submission failed:", error);
     *             });
     *     }
     * }
     * ```
     */
}

// 示例用法 (在实际项目中，这部分代码应在初始化逻辑中执行)
// const config: ILeaderboardSystemConfig = {
//     apiBaseUrl: "https://api.mygame.com/v1",
//     fetchEndpoint: "/leaderboard/global",
//     submitEndpoint: "/score/submit",
//     defaultPageSize: 20
// };

// try {
//     const leaderboard = LeaderboardSystem.getInstance(config);
    
//     // 首次获取
//     // leaderboard.fetchLeaderboard(1)
//     //     .then(data => console.log("Page 1 data:", data))
//     //     .catch(err => console.error(err));

//     // // 提交分数
//     // leaderboard.submitScore("test_user_001", 9999, "TestUser")
//     //     .then(result => console.log("Submission result:", result))
//     //     .catch(err => console.error(err));

// } catch (e) {
//     // console.error("Leaderboard System Initialization Failed:", e);
// }
