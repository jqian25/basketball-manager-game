// client/src/game/systems/SeasonSystem.ts

/**
 * @fileoverview 联赛系统 (SeasonSystem)
 * 负责管理联赛的赛程生成、进度追踪和结果记录。
 * 遵循Game Boy风格的设计理念，强调简洁、回合制和核心功能。
 */

// --- 接口定义 (Interfaces) ---

/**
 * 球队接口。
 * 包含球队的基本信息，如ID和名称。
 * 在Game Boy风格中，数据结构应尽量简洁。
 */
export interface ITeam {
    /** 球队的唯一标识符 (例如: "TEAM_A") */
    id: string;
    /** 球队的显示名称 (例如: "Pallet Town") */
    name: string;
    /** (可选) 球队的Game Boy风格颜色或主题ID */
    gbColorId?: number;
}

/**
 * 比赛结果接口。
 * 记录比赛的比分和状态。
 */
export interface IMatchResult {
    /** 主队得分 */
    homeScore: number;
    /** 客队得分 */
    awayScore: number;
    /** 比赛是否已完成 */
    isCompleted: boolean;
}

/**
 * 单场比赛接口。
 * 记录对阵双方和比赛结果。
 */
export interface IMatch {
    /** 比赛的唯一标识符 */
    matchId: string;
    /** 主队信息 */
    homeTeam: ITeam;
    /** 客队信息 */
    awayTeam: ITeam;
    /** 比赛结果 */
    result: IMatchResult;
    /** 比赛所属的轮次索引 */
    roundIndex: number;
    /** (可选) 比赛的日期或时间戳，用于模拟Game Boy的简单时间系统 */
    date?: number;
}

/**
 * 单个轮次接口。
 * 包含该轮次的所有比赛。
 */
export interface IRound {
    /** 轮次索引 (从0开始) */
    roundIndex: number;
    /** 本轮次的所有比赛 */
    matches: IMatch[];
}

/**
 * 联赛配置接口。
 * 用于初始化联赛系统。
 */
export interface ISeasonConfig {
    /** 参与联赛的所有球队 */
    teams: ITeam[];
    /** 是否进行双循环赛 (每队互相对阵两次) */
    doubleRoundRobin: boolean;
}

/**
 * 联赛系统公共接口。
 * 定义外部可调用的方法。
 */
export interface ISeasonSystem {
    /** 获取当前联赛配置 */
    getConfig(): ISeasonConfig;
    /** 获取完整的赛程表 */
    getSchedule(): IRound[];
    /** 获取当前轮次索引 */
    getCurrentRoundIndex(): number;
    /** 获取当前轮次信息 */
    getCurrentRound(): IRound | undefined;
    /** 记录一场比赛的结果 */
    recordMatchResult(matchId: string, homeScore: number, awayScore: number): boolean;
    /** 推进到下一轮次 */
    advanceToNextRound(): boolean;
}


// --- 核心实现 (Core Implementation) ---

/**
 * 联赛系统类。
 * 实现了赛程管理的核心逻辑。
 * 这是一个独立的系统，可以作为Phaser 3场景或游戏的Manager Service使用。
 */
export class SeasonSystem implements ISeasonSystem {
    /** 联赛配置 */
    private config: ISeasonConfig;
    /** 完整的赛程表 */
    private schedule: IRound[] = [];
    /** 当前进行到的轮次索引 */
    private currentRoundIndex: number = 0;
    /** 比赛ID计数器，用于生成唯一的matchId */
    private matchIdCounter: number = 0;

    /**
     * 构造函数。
     * @param config 联赛配置。
     */
    constructor(config: ISeasonConfig) {
        // 确保球队数量是偶数，如果不是，则添加一个虚拟球队。
        // Game Boy风格的简洁性，我们只支持偶数球队的赛程生成。
        if (config.teams.length % 2 !== 0) {
            console.warn("球队数量为奇数，已添加一个虚拟球队 (BYE) 以确保赛程生成正确。");
            const byeTeam: ITeam = { id: "BYE", name: "BYE", gbColorId: 0 };
            config.teams.push(byeTeam);
        }

        this.config = config;
        this.generateSchedule();
    }

    /**
     * 使用循环赛算法（Round-Robin Tournament）生成赛程。
     * 这是Game Boy时代体育游戏常用的简单且高效的赛程生成方法。
     * @private
     */
    private generateSchedule(): void {
        const teams = [...this.config.teams];
        const numTeams = teams.length;
        // 轮次总数 = 球队数 - 1 (单循环)
        const numRounds = numTeams - 1;
        
        // 赛程生成的核心：固定第一支球队，其余球队循环移动。
        // 算法参考：https://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
        
        // 1. 初始化对阵列表 (除第一支球队外的其余球队)
        const teamList = teams.slice(1);
        const fixedTeam = teams[0]; // 固定第一支球队

        // 2. 生成单循环赛程
        for (let round = 0; round < numRounds; round++) {
            const currentRound: IRound = { roundIndex: round, matches: [] };
            const halfSize = numTeams / 2;

            // 比赛配对
            for (let i = 0; i < halfSize; i++) {
                let homeTeam: ITeam;
                let awayTeam: ITeam;

                if (i === 0) {
                    // 第一个配对：固定队 vs 循环队列表的最后一个
                    homeTeam = fixedTeam;
                    awayTeam = teamList[numTeams - 2];
                } else {
                    // 其他配对：循环队列表的 i-1 和 numTeams - 2 - i
                    homeTeam = teamList[i - 1];
                    awayTeam = teamList[numTeams - 2 - i];
                }
                
                // 确保BYE队（虚拟队）不会作为主队出现，以简化逻辑
                if (homeTeam.id === "BYE") {
                    [homeTeam, awayTeam] = [awayTeam, homeTeam];
                }

                // 避免虚拟队之间的比赛
                if (homeTeam.id !== "BYE" && awayTeam.id !== "BYE") {
                    const match: IMatch = {
                        matchId: `M-${this.matchIdCounter++}`,
                        homeTeam: homeTeam,
                        awayTeam: awayTeam,
                        result: { homeScore: 0, awayScore: 0, isCompleted: false },
                        roundIndex: round,
                    };
                    currentRound.matches.push(match);
                }
            }

            this.schedule.push(currentRound);

            // 3. 循环移动球队：将最后一个队移到最前面
            const lastTeam = teamList.pop();
            if (lastTeam) {
                teamList.unshift(lastTeam);
            }
        }

        // 4. 如果是双循环赛，复制并交换主客场
        if (this.config.doubleRoundRobin) {
            const secondHalfSchedule: IRound[] = [];
            for (let i = 0; i < this.schedule.length; i++) {
                const originalRound = this.schedule[i];
                const newRound: IRound = { roundIndex: originalRound.roundIndex + numRounds, matches: [] };

                for (const originalMatch of originalRound.matches) {
                    const newMatch: IMatch = {
                        matchId: `M-${this.matchIdCounter++}`,
                        // 交换主客场
                        homeTeam: originalMatch.awayTeam,
                        awayTeam: originalMatch.homeTeam,
                        result: { homeScore: 0, awayScore: 0, isCompleted: false },
                        roundIndex: newRound.roundIndex,
                    };
                    newRound.matches.push(newMatch);
                }
                secondHalfSchedule.push(newRound);
            }
            // 将第二循环赛程添加到主赛程中
            this.schedule = this.schedule.concat(secondHalfSchedule);
        }
        
        // Game Boy风格：在控制台输出赛程，方便调试
        console.log("--- 联赛赛程生成完成 (Game Boy Style) ---");
        this.schedule.forEach(round => {
            console.log(`\nRound ${round.roundIndex + 1}:`);
            round.matches.forEach(match => {
                const home = match.homeTeam.name.padEnd(15, ' ');
                const away = match.awayTeam.name.padEnd(15, ' ');
                console.log(`  [${match.matchId}] ${home} vs ${away}`);
            });
        });
        console.log("-----------------------------------------");
    }

    /**
     * 查找赛程中指定ID的比赛。
     * @param matchId 比赛ID。
     * @returns 找到的比赛对象，如果未找到则返回undefined。
     * @private
     */
    private findMatchById(matchId: string): IMatch | undefined {
        // 遍历所有轮次和比赛，效率较低，但对于Game Boy风格的小型联赛是可接受的
        for (const round of this.schedule) {
            const match = round.matches.find(m => m.matchId === matchId);
            if (match) {
                return match;
            }
        }
        return undefined;
    }

    // --- ISeasonSystem 接口实现 (Public Methods) ---

    /**
     * 获取当前联赛配置。
     * @returns 联赛配置对象。
     */
    public getConfig(): ISeasonConfig {
        return this.config;
    }

    /**
     * 获取完整的赛程表。
     * @returns 包含所有轮次和比赛的数组。
     */
    public getSchedule(): IRound[] {
        return this.schedule;
    }

    /**
     * 获取当前进行到的轮次索引 (从0开始)。
     * @returns 当前轮次索引。
     */
    public getCurrentRoundIndex(): number {
        return this.currentRoundIndex;
    }

    /**
     * 获取当前轮次信息。
     * @returns 当前轮次对象，如果索引超出范围则返回undefined。
     */
    public getCurrentRound(): IRound | undefined {
        return this.schedule[this.currentRoundIndex];
    }

    /**
     * 记录一场比赛的结果。
     * Game Boy风格：一旦记录，结果不可更改。
     * @param matchId 比赛的唯一ID。
     * @param homeScore 主队得分。
     * @param awayScore 客队得分。
     * @returns 记录是否成功。
     */
    public recordMatchResult(matchId: string, homeScore: number, awayScore: number): boolean {
        const match = this.findMatchById(matchId);

        if (!match) {
            console.error(`[SeasonSystem] 错误: 未找到比赛ID ${matchId}`);
            return false;
        }

        if (match.result.isCompleted) {
            console.warn(`[SeasonSystem] 警告: 比赛 ${matchId} 结果已记录，不可重复记录。`);
            return false;
        }

        // 记录结果
        match.result.homeScore = homeScore;
        match.result.awayScore = awayScore;
        match.result.isCompleted = true;

        console.log(`[SeasonSystem] 比赛结果记录成功: ${match.homeTeam.name} ${homeScore} - ${awayScore} ${match.awayTeam.name}`);
        return true;
    }

    /**
     * 推进到下一轮次。
     * 在Game Boy风格游戏中，通常需要玩家手动操作或完成所有当前轮次比赛后自动触发。
     * @returns 是否成功推进到下一轮。
     */
    public advanceToNextRound(): boolean {
        // 检查当前轮次是否所有比赛都已完成
        const currentRound = this.getCurrentRound();
        if (currentRound) {
            const allCompleted = currentRound.matches.every(match => match.result.isCompleted);
            if (!allCompleted) {
                console.warn(`[SeasonSystem] 警告: 当前轮次 (Round ${this.currentRoundIndex + 1}) 仍有未完成的比赛。`);
                return false;
            }
        }

        // 推进轮次
        if (this.currentRoundIndex < this.schedule.length - 1) {
            this.currentRoundIndex++;
            console.log(`[SeasonSystem] 成功推进到下一轮: Round ${this.currentRoundIndex + 1}`);
            return true;
        } else {
            console.log("[SeasonSystem] 联赛已结束！");
            return false; // 联赛结束
        }
    }

    /**
     * (可选) 辅助方法：生成一个简单的积分榜。
     * Game Boy风格的简洁积分榜，只显示胜/平/负和积分。
     * @returns 积分榜数组。
     */
    public generateStandings(): { team: ITeam, points: number, wins: number, draws: number, losses: number, gamesPlayed: number }[] {
        const standingsMap = new Map<string, { team: ITeam, points: number, wins: number, draws: number, losses: number, gamesPlayed: number }>();

        // 初始化积分榜
        this.config.teams.filter(t => t.id !== "BYE").forEach(team => {
            standingsMap.set(team.id, { team, points: 0, wins: 0, draws: 0, losses: 0, gamesPlayed: 0 });
        });

        // 遍历所有已完成的比赛来计算积分
        for (const round of this.schedule) {
            for (const match of round.matches) {
                if (match.result.isCompleted) {
                    const homeStats = standingsMap.get(match.homeTeam.id);
                    const awayStats = standingsMap.get(match.awayTeam.id);

                    // 忽略虚拟队BYE
                    if (homeStats) homeStats.gamesPlayed++;
                    if (awayStats) awayStats.gamesPlayed++;

                    // 3分制: 胜=3, 平=1, 负=0
                    if (match.result.homeScore > match.result.awayScore) {
                        if (homeStats) { homeStats.points += 3; homeStats.wins++; }
                        if (awayStats) { awayStats.losses++; }
                    } else if (match.result.homeScore < match.result.awayScore) {
                        if (awayStats) { awayStats.points += 3; awayStats.wins++; }
                        if (homeStats) { homeStats.losses++; }
                    } else { // 平局
                        if (homeStats) { homeStats.points += 1; homeStats.draws++; }
                        if (awayStats) { awayStats.points += 1; awayStats.draws++; }
                    }
                }
            }
        }

        // 转换为数组并按积分排序 (Game Boy风格的简单排序)
        const standings = Array.from(standingsMap.values());
        standings.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points; // 积分高者优先
            }
            // 积分相同，按净胜球（未实现，此处简化为按名称排序）
            return a.team.name.localeCompare(b.team.name);
        });

        return standings;
    }
}

// --- 示例用法 (Example Usage for Integration) ---

// 假设这是一个Phaser 3场景的初始化部分
// import Phaser from 'phaser';

/**
 * 演示如何使用SeasonSystem。
 * 这是一个独立的函数，用于展示集成方式。
 */
export function demoSeasonSystemIntegration(): void {
    const teams: ITeam[] = [
        { id: "PKMN_R", name: "Red Team" },
        { id: "PKMN_B", name: "Blue Team" },
        { id: "PKMN_G", name: "Green Team" },
        { id: "PKMN_Y", name: "Yellow Team" },
        { id: "PKMN_P", name: "Purple Team" },
        { id: "PKMN_O", name: "Orange Team" },
    ];

    // 1. 初始化联赛系统
    const seasonConfig: ISeasonConfig = {
        teams: teams,
        doubleRoundRobin: true, // 双循环赛
    };
    const seasonSystem = new SeasonSystem(seasonConfig);

    // 2. 模拟游戏循环和比赛
    console.log("\n--- 模拟联赛进行中 ---");
    
    // 模拟进行3轮比赛
    for (let i = 0; i < 3; i++) {
        const currentRound = seasonSystem.getCurrentRound();
        if (!currentRound) break;

        console.log(`\n[GAME LOOP] 开始 Round ${currentRound.roundIndex + 1}`);

        // 模拟完成本轮所有比赛
        currentRound.matches.forEach(match => {
            // 随机生成Game Boy风格的简单比分 (0-3)
            const homeScore = Math.floor(Math.random() * 4);
            const awayScore = Math.floor(Math.random() * 4);
            seasonSystem.recordMatchResult(match.matchId, homeScore, awayScore);
        });

        // 推进到下一轮
        seasonSystem.advanceToNextRound();
    }

    // 3. 显示当前积分榜
    console.log("\n--- 当前积分榜 (Game Boy Style) ---");
    const standings = seasonSystem.generateStandings();
    console.log("Pos | Team Name       | Pts | W | D | L | GP");
    console.log("-------------------------------------------------");
    standings.forEach((s, index) => {
        const pos = String(index + 1).padEnd(3, ' ');
        const name = s.team.name.padEnd(15, ' ');
        const pts = String(s.points).padEnd(3, ' ');
        const w = String(s.wins).padEnd(1, ' ');
        const d = String(s.draws).padEnd(1, ' ');
        const l = String(s.losses).padEnd(1, ' ');
        const gp = String(s.gamesPlayed).padEnd(2, ' ');
        console.log(`${pos} | ${name} | ${pts} | ${w} | ${d} | ${l} | ${gp}`);
    });
    console.log("-------------------------------------------------");
    
    // 4. 完整的赛程表 (用于UI显示)
    // console.log("\n--- 完整赛程表 ---");
    // console.log(seasonSystem.getSchedule());
}

// 如果需要立即运行示例，可以取消注释下面一行
// demoSeasonSystemIntegration();
