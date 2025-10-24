// client/src/game/season/SeasonManager.ts

/**
 * 球员属性接口
 */
interface Player {
    id: number;
    name: string;
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    // 球员能力值 (0-100)
    offense: number; // 进攻能力
    defense: number; // 防守能力
    stamina: number; // 体能
    clutch: number; // 关键能力
}

/**
 * 球队接口
 */
interface Team {
    id: number;
    name: string;
    abbreviation: string;
    roster: Player[]; // 球员名单
    record: { // 战绩
        wins: number;
        losses: number;
    };
    stats: { // 球队赛季累计数据
        pointsScored: number;
        pointsAllowed: number;
    };
}

/**
 * 比赛结果接口
 */
interface GameResult {
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
    winnerId: number;
    loserId: number;
    date: string;
    boxScore: { // 简化的比赛数据统计
        [teamId: number]: {
            points: number;
            rebounds: number;
            assists: number;
        }
    }
}

/**
 * 赛季状态接口
 */
interface SeasonState {
    currentDay: number;
    totalDays: number;
    regularSeasonGames: GameResult[];
    schedule: { day: number, game: { homeTeamId: number, awayTeamId: number }[] }[];
    teams: Team[];
    isPlayoffs: boolean;
    playoffBracket: any; // 简化处理，实际中会更复杂
}

/**
 * 赛季管理类
 */
export class SeasonManager {
    private state: SeasonState;
    private teams: Team[];
    private totalTeams: number = 30; // 假设30支球队

    constructor() {
        this.teams = this.generateInitialTeams(this.totalTeams);
        this.state = {
            currentDay: 0,
            totalDays: 82 * (this.totalTeams / 2), // 假设每队82场比赛，总比赛场次
            regularSeasonGames: [],
            schedule: [],
            teams: this.teams,
            isPlayoffs: false,
            playoffBracket: null,
        };
        this.generateSchedule();
    }

    /**
     * 生成初始球队和球员数据
     * @param count 球队数量
     */
    private generateInitialTeams(count: number): Team[] {
        // 实际应用中，这里会加载真实数据
        const teamNames = [
            "Lakers", "Celtics", "Bulls", "Warriors", "Heat", "Knicks", "Rockets", "Spurs",
            "76ers", "Suns", "Bucks", "Nets", "Clippers", "Mavericks", "Nuggets", "Raptors",
            "Jazz", "Blazers", "Hawks", "Pacers", "Magic", "Pistons", "Cavs", "Grizzlies",
            "Pelicans", "Thunder", "Kings", "Hornets", "Wizards", "Timberwolves"
        ].slice(0, count);

        return teamNames.map((name, index) => {
            const teamId = index + 1;
            const team: Team = {
                id: teamId,
                name: name,
                abbreviation: name.substring(0, 3).toUpperCase(),
                roster: this.generatePlayers(teamId),
                record: { wins: 0, losses: 0 },
                stats: { pointsScored: 0, pointsAllowed: 0 },
            };
            return team;
        });
    }

    /**
     * 为球队生成简化球员名单
     */
    private generatePlayers(teamId: number): Player[] {
        const players: Player[] = [];
        const positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[] = ['PG', 'SG', 'SF', 'PF', 'C'];
        for (let i = 0; i < 15; i++) {
            const position = positions[i % 5];
            const offense = Math.floor(Math.random() * 30) + 65; // 65-94
            const defense = Math.floor(Math.random() * 30) + 65;
            const stamina = Math.floor(Math.random() * 30) + 65;
            const clutch = Math.floor(Math.random() * 30) + 65;

            players.push({
                id: teamId * 100 + i + 1,
                name: `Player ${i + 1} (${position})`,
                position: position,
                offense,
                defense,
                stamina,
                clutch,
            });
        }
        return players;
    }

    /**
     * 生成常规赛赛程 (简化版: 循环赛)
     * 实际NBA赛程非常复杂，这里只做最简化的实现：每队打82场，总场次 30 * 82 / 2 = 1230
     */
    private generateSchedule(): void {
        const teams = this.teams.map(t => t.id);
        const gamesPerTeam = 82;
        const totalGames = (teams.length * gamesPerTeam) / 2;
        
        let schedule: { homeTeamId: number, awayTeamId: number }[] = [];

        // 简化赛程生成：确保每队有足够的比赛场次
        // 这是一个非常简化的循环赛生成器，可能无法完美匹配82场，但足以演示逻辑
        let gamesCount: { [key: number]: number } = {};
        teams.forEach(id => gamesCount[id] = 0);

        // 尝试生成总共 totalGames 场比赛
        while (schedule.length < totalGames) {
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    const teamA = teams[i];
                    const teamB = teams[j];

                    // 确保两队比赛场次都小于 gamesPerTeam
                    if (gamesCount[teamA] < gamesPerTeam && gamesCount[teamB] < gamesPerTeam) {
                        // 随机决定主客场
                        if (Math.random() < 0.5) {
                            schedule.push({ homeTeamId: teamA, awayTeamId: teamB });
                        } else {
                            schedule.push({ homeTeamId: teamB, awayTeamId: teamA });
                        }
                        gamesCount[teamA]++;
                        gamesCount[teamB]++;
                        
                        if (schedule.length >= totalGames) break;
                    }
                }
                if (schedule.length >= totalGames) break;
            }
            // 防止无限循环，如果一轮循环后没有新增比赛，则退出
            if (schedule.length === this.state.regularSeasonGames.length) break;
        }

        // 简单地将所有比赛分配到连续的日子，每天的比赛场次不限
        const dailySchedule: { day: number, game: { homeTeamId: number, awayTeamId: number }[] }[] = [];
        const gamesPerDay = 10; // 假设每天最多10场比赛
        let currentDay = 1;
        
        for (let i = 0; i < schedule.length; i += gamesPerDay) {
            dailySchedule.push({
                day: currentDay++,
                game: schedule.slice(i, i + gamesPerDay)
            });
        }
        
        this.state.schedule = dailySchedule;
        this.state.totalDays = dailySchedule.length;
    }

    /**
     * 模拟单场比赛 (核心游戏机制)
     * @param homeTeamId 主队ID
     * @param awayTeamId 客队ID
     */
    private simulateGame(homeTeamId: number, awayTeamId: number): GameResult {
        const homeTeam = this.teams.find(t => t.id === homeTeamId)!;
        const awayTeam = this.teams.find(t => t.id === awayTeamId)!;

        // 简化模拟：基于球队的平均能力值来决定得分
        const calculateTeamPower = (team: Team): number => {
            const offenseSum = team.roster.reduce((sum, p) => sum + p.offense, 0);
            const defenseSum = team.roster.reduce((sum, p) => sum + p.defense, 0);
            // 简化：进攻能力占70%，防守能力占30%
            return (offenseSum * 0.7 + defenseSum * 0.3) / team.roster.length;
        };

        const homePower = calculateTeamPower(homeTeam);
        const awayPower = calculateTeamPower(awayTeam);
        
        // 主场优势
        const homeAdvantage = 5; 
        const effectiveHomePower = homePower + homeAdvantage;
        const effectiveAwayPower = awayPower;

        // 基础得分范围
        const baseScore = 100;
        const scoreVariance = 15;

        // 得分计算：基于能力差异和随机性
        const calculateScore = (myPower: number, opponentPower: number): number => {
            // 能力差异影响基础得分
            const powerDiff = myPower - opponentPower;
            let score = baseScore + powerDiff * 0.5 + Math.floor(Math.random() * scoreVariance * 2) - scoreVariance;
            return Math.max(80, Math.round(score)); // 确保最低得分
        };

        let homeScore = calculateScore(effectiveHomePower, effectiveAwayPower);
        let awayScore = calculateScore(effectiveAwayPower, effectiveHomePower);

        // 确保有胜负（模拟加时赛）
        while (homeScore === awayScore) {
            // 加时赛随机增加得分
            if (Math.random() < 0.5) {
                homeScore += Math.floor(Math.random() * 5) + 1;
            } else {
                awayScore += Math.floor(Math.random() * 5) + 1;
            }
        }

        const winnerId = homeScore > awayScore ? homeTeamId : awayTeamId;
        const loserId = homeScore > awayScore ? awayTeamId : homeTeamId;

        return {
            homeTeamId,
            awayTeamId,
            homeScore,
            awayScore,
            winnerId,
            loserId,
            date: `Day ${this.state.currentDay}`,
            boxScore: {
                [homeTeamId]: { points: homeScore, rebounds: Math.floor(Math.random() * 40) + 30, assists: Math.floor(Math.random() * 20) + 15 },
                [awayTeamId]: { points: awayScore, rebounds: Math.floor(Math.random() * 40) + 30, assists: Math.floor(Math.random() * 20) + 15 },
            }
        };
    }

    /**
     * 更新球队战绩和数据
     */
    private updateTeamStats(result: GameResult): void {
        const homeTeam = this.teams.find(t => t.id === result.homeTeamId);
        const awayTeam = this.teams.find(t => t.id === result.awayTeamId);

        if (homeTeam) {
            if (result.winnerId === homeTeam.id) {
                homeTeam.record.wins++;
            } else {
                homeTeam.record.losses++;
            }
            homeTeam.stats.pointsScored += result.homeScore;
            homeTeam.stats.pointsAllowed += result.awayScore;
        }

        if (awayTeam) {
            if (result.winnerId === awayTeam.id) {
                awayTeam.record.wins++;
            } else {
                awayTeam.record.losses++;
            }
            awayTeam.stats.pointsScored += result.awayScore;
            awayTeam.stats.pointsAllowed += result.homeScore;
        }
    }

    /**
     * 模拟当前天的所有比赛
     */
    public simulateDay(): GameResult[] | null {
        if (this.state.isPlayoffs) {
            console.log("Playoffs are in progress. Use a separate method for playoff simulation.");
            return null;
        }
        
        if (this.state.currentDay >= this.state.totalDays) {
            console.log("Regular season finished.");
            return null;
        }

        this.state.currentDay++;
        const daySchedule = this.state.schedule.find(s => s.day === this.state.currentDay);

        if (!daySchedule) {
            console.log(`No games scheduled for Day ${this.state.currentDay}.`);
            return [];
        }

        const results: GameResult[] = [];
        for (const game of daySchedule.game) {
            const result = this.simulateGame(game.homeTeamId, game.awayTeamId);
            this.updateTeamStats(result);
            this.state.regularSeasonGames.push(result);
            results.push(result);
        }

        return results;
    }

    /**
     * 模拟整个常规赛直到结束
     */
    public simulateRegularSeason(): GameResult[] {
        let allResults: GameResult[] = [];
        while (this.state.currentDay < this.state.totalDays && !this.state.isPlayoffs) {
            const dayResults = this.simulateDay();
            if (dayResults) {
                allResults = allResults.concat(dayResults);
            } else {
                break;
            }
        }
        return allResults;
    }

    /**
     * 获取当前球队排名（简化：按胜场数降序）
     */
    public getStandings(): Team[] {
        return [...this.teams].sort((a, b) => {
            if (b.record.wins !== a.record.wins) {
                return b.record.wins - a.record.wins; // 胜场多者优先
            }
            // 平局则比较净胜分
            const aNetPoints = a.stats.pointsScored - a.stats.pointsAllowed;
            const bNetPoints = b.stats.pointsScored - b.stats.pointsAllowed;
            return bNetPoints - aNetPoints;
        });
    }

    /**
     * 检查并启动季后赛（简化：前8名进入季后赛）
     */
    public startPlayoffs(): any {
        if (this.state.isPlayoffs) {
            console.log("Playoffs already started.");
            return this.state.playoffBracket;
        }

        if (this.state.currentDay < this.state.totalDays) {
            console.log("Regular season is not finished yet.");
            return null;
        }

        const standings = this.getStandings();
        const playoffTeams = standings.slice(0, 8); // 假设前8名进入季后赛
        this.state.isPlayoffs = true;
        
        // 简化季后赛对阵：1-8, 2-7, 3-6, 4-5
        this.state.playoffBracket = [
            { round: 1, match: [{ teamA: playoffTeams[0], teamB: playoffTeams[7] }] },
            { round: 1, match: [{ teamA: playoffTeams[1], teamB: playoffTeams[6] }] },
            { round: 1, match: [{ teamA: playoffTeams[2], teamB: playoffTeams[5] }] },
            { round: 1, match: [{ teamA: playoffTeams[3], teamB: playoffTeams[4] }] },
        ];

        console.log("Playoffs started! Bracket:", this.state.playoffBracket);
        return this.state.playoffBracket;
    }

    // 暴露状态和数据的方法
    public getState(): SeasonState {
        return this.state;
    }
}

// 示例用法（在实际TypeScript项目中，这部分不会被导出，仅用于测试）
/*
const manager = new SeasonManager();
console.log("Initial Schedule Length:", manager.getState().schedule.length);

// 模拟10天
for(let i = 0; i < 10; i++) {
    const results = manager.simulateDay();
    if (results) {
        console.log(`Day ${manager.getState().currentDay} results: ${results.length} games played.`);
    }
}

// 模拟剩余常规赛
manager.simulateRegularSeason();
console.log("Regular Season Complete. Total Games:", manager.getState().regularSeasonGames.length);

// 查看排名
const standings = manager.getStandings();
console.log("Top 5 Standings:");
standings.slice(0, 5).forEach(team => {
    console.log(`${team.name}: ${team.record.wins}-${team.record.losses} (Scored: ${team.stats.pointsScored}, Allowed: ${team.stats.pointsAllowed})`);
});

// 启动季后赛
manager.startPlayoffs();
*/
