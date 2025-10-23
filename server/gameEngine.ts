/**
 * 篮球比赛引擎
 * 基于六维属性系统模拟真实篮球比赛
 */

import { Player } from "../drizzle/schema";

// 比赛配置
export interface MatchConfig {
  mode: "guest" | "registered";
  duration: number; // 分钟
  quarters: number; // 节数
}

// 球队配置
export interface TeamConfig {
  name: string;
  players: Player[];
  tactics: {
    pace: "slow" | "normal" | "fast";
    spacing: "inside" | "balanced" | "outside";
    defense: "man" | "zone";
  };
}

// 比赛事件
export interface GameEvent {
  type: "shot" | "assist" | "rebound" | "steal" | "block" | "foul" | "timeout" | "quarter_end" | "turnover";
  time: number; // 剩余时间（秒）
  quarter: number;
  team: "home" | "away";
  player?: Player;
  targetPlayer?: Player; // 被盖帽/被抢断的球员
  success?: boolean;
  points?: number;
  description: string;
}

// 比赛状态
export interface GameState {
  quarter: number;
  timeRemaining: number; // 秒
  homeScore: number;
  awayScore: number;
  possession: "home" | "away";
  events: GameEvent[];
  homeStats: TeamStats;
  awayStats: TeamStats;
  playerStats: Map<number, PlayerStats>;
  playerStamina: Map<number, number>; // 球员体能（1-20）
}

// 球队统计
export interface TeamStats {
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

// 球员统计
export interface PlayerStats {
  playerId: number;
  minutes: number;
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

/**
 * 比赛引擎类
 */
export class BasketballGameEngine {
  private config: MatchConfig;
  private homeTeam: TeamConfig;
  private awayTeam: TeamConfig;
  private state: GameState;

  constructor(config: MatchConfig, homeTeam: TeamConfig, awayTeam: TeamConfig) {
    this.config = config;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    
    // 初始化比赛状态
    this.state = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const quarterDuration = (this.config.duration * 60) / this.config.quarters;
    
    // 初始化球员体能
    const playerStamina = new Map<number, number>();
    [...this.homeTeam.players, ...this.awayTeam.players].forEach(p => {
      playerStamina.set(p.id, p.stamina);
    });
    
    return {
      quarter: 1,
      timeRemaining: quarterDuration,
      homeScore: 0,
      awayScore: 0,
      possession: Math.random() > 0.5 ? "home" : "away",
      events: [],
      homeStats: this.initializeTeamStats(),
      awayStats: this.initializeTeamStats(),
      playerStats: new Map(),
      playerStamina,
    };
  }

  private initializeTeamStats(): TeamStats {
    return {
      points: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointersMade: 0,
      threePointersAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
    };
  }

  /**
   * 消耗体能
   */
  private consumeStamina(playerId: number, amount: number = 0.5) {
    const current = this.state.playerStamina.get(playerId) || 10;
    this.state.playerStamina.set(playerId, Math.max(1, current - amount));
  }

  /**
   * 获取球员当前体能
   */
  private getPlayerStamina(playerId: number): number {
    return this.state.playerStamina.get(playerId) || 10;
  }

  /**
   * 模拟一个回合
   */
  private simulatePossession(): GameEvent[] {
    const events: GameEvent[] = [];
    const attackingTeam = this.state.possession === "home" ? this.homeTeam : this.awayTeam;
    const defendingTeam = this.state.possession === "away" ? this.homeTeam : this.awayTeam;
    
    // 随机选择进攻球员
    const shooter = this.selectShooter(attackingTeam);
    const defender = this.selectDefender(defendingTeam, shooter);
    
    // 消耗体能
    this.consumeStamina(shooter.id, 0.3);
    this.consumeStamina(defender.id, 0.2);
    
    // 检查是否被抢断
    const stealChance = this.calculateStealChance(defender, shooter);
    if (Math.random() < stealChance) {
      events.push({
        type: "steal",
        time: this.state.timeRemaining,
        quarter: this.state.quarter,
        team: this.state.possession === "home" ? "away" : "home",
        player: defender,
        targetPlayer: shooter,
        description: `${defender.name} 抢断 ${shooter.name}！`,
      });
      
      this.updateSteal(defender.id);
      this.updateTurnover(shooter.id);
      this.state.possession = this.state.possession === "home" ? "away" : "home";
      
      return events;
    }
    
    // 计算投篮类型概率
    const shotType = this.determineShotType(shooter, attackingTeam.tactics);
    
    // 检查是否被盖帽
    const blockChance = this.calculateBlockChance(defender, shooter, shotType);
    if (Math.random() < blockChance) {
      events.push({
        type: "block",
        time: this.state.timeRemaining,
        quarter: this.state.quarter,
        team: this.state.possession === "home" ? "away" : "home",
        player: defender,
        targetPlayer: shooter,
        description: `${defender.name} 盖帽 ${shooter.name}！`,
      });
      
      this.updateBlock(defender.id);
      this.updatePlayerStats(shooter.id, shotType, false);
      
      // 盖帽后球权归防守方
      this.state.possession = this.state.possession === "home" ? "away" : "home";
      
      return events;
    }
    
    // 计算投篮成功率
    const shotSuccess = this.calculateShotSuccess(shooter, defender, shotType);
    
    // 投篮事件
    const shotEvent: GameEvent = {
      type: "shot",
      time: this.state.timeRemaining,
      quarter: this.state.quarter,
      team: this.state.possession,
      player: shooter,
      success: shotSuccess,
      points: shotSuccess ? (shotType === "three" ? 3 : 2) : 0,
      description: this.generateShotDescription(shooter, shotType, shotSuccess),
    };
    
    events.push(shotEvent);
    
    // 更新分数和统计
    if (shotSuccess) {
      this.updateScore(shotEvent.points!);
      this.updatePlayerStats(shooter.id, shotType, true);
      
      // 可能有助攻
      if (Math.random() > 0.4) {
        const assister = this.selectAssister(attackingTeam, shooter);
        if (assister) {
          events.push({
            type: "assist",
            time: this.state.timeRemaining,
            quarter: this.state.quarter,
            team: this.state.possession,
            player: assister,
            description: `${assister.name} 助攻`,
          });
          this.updateAssist(assister.id);
        }
      }
      
      // 切换球权
      this.state.possession = this.state.possession === "home" ? "away" : "home";
    } else {
      this.updatePlayerStats(shooter.id, shotType, false);
      
      // 篮板球
      const rebounder = this.simulateRebound(defendingTeam, attackingTeam);
      events.push({
        type: "rebound",
        time: this.state.timeRemaining,
        quarter: this.state.quarter,
        team: rebounder.team,
        player: rebounder.player,
        description: `${rebounder.player.name} 抢到篮板`,
      });
      
      this.updateRebound(rebounder.player.id);
      this.consumeStamina(rebounder.player.id, 0.4);
      this.state.possession = rebounder.team;
    }
    
    return events;
  }

  /**
   * 计算抢断概率
   */
  private calculateStealChance(defender: Player, attacker: Player): number {
    const defenderStamina = this.getPlayerStamina(defender.id);
    const attackerStamina = this.getPlayerStamina(attacker.id);
    
    const baseChance = 0.05;
    const defenseBonus = (defender.defense / 20) * 0.08;
    const attackerIQPenalty = (attacker.basketballIQ / 20) * 0.05;
    const staminaFactor = (defenderStamina - attackerStamina) / 20 * 0.03;
    
    return Math.max(0, Math.min(0.15, baseChance + defenseBonus - attackerIQPenalty + staminaFactor));
  }

  /**
   * 计算盖帽概率
   */
  private calculateBlockChance(defender: Player, shooter: Player, shotType: string): number {
    // 三分球很难盖帽
    if (shotType === "three") return 0.02;
    
    const defenderStamina = this.getPlayerStamina(defender.id);
    
    const baseChance = shotType === "layup" ? 0.08 : 0.05;
    const athleticismBonus = (defender.athleticism / 20) * 0.1;
    const defenseBonus = (defender.defense / 20) * 0.05;
    const staminaFactor = (defenderStamina / 20) * 0.05;
    
    return Math.max(0, Math.min(0.2, baseChance + athleticismBonus + defenseBonus + staminaFactor));
  }

  /**
   * 选择投篮球员
   */
  private selectShooter(team: TeamConfig): Player {
    // 基于得分能力和体能加权随机选择
    const weights = team.players.map(p => {
      const stamina = this.getPlayerStamina(p.id);
      return p.scoring * (stamina / 20);
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < team.players.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return team.players[i];
      }
    }
    
    return team.players[0];
  }

  /**
   * 选择防守球员
   */
  private selectDefender(team: TeamConfig, attacker: Player): Player {
    // 选择位置相同或相近的防守球员
    const samePosition = team.players.filter(p => p.position === attacker.position);
    if (samePosition.length > 0) {
      // 基于防守能力选择
      const weights = samePosition.map(p => p.defense);
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < samePosition.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return samePosition[i];
        }
      }
      return samePosition[0];
    }
    return team.players[Math.floor(Math.random() * team.players.length)];
  }

  /**
   * 决定投篮类型
   */
  private determineShotType(player: Player, tactics: TeamConfig["tactics"]): "three" | "mid" | "layup" {
    const total = player.threePointTendency + player.midRangeTendency + player.driveTendency;
    let random = Math.random() * total;
    
    if (tactics.spacing === "outside") {
      random *= 1.5; // 增加三分倾向
    } else if (tactics.spacing === "inside") {
      random *= 0.7; // 减少三分倾向
    }
    
    if (random < player.threePointTendency) return "three";
    if (random < player.threePointTendency + player.midRangeTendency) return "mid";
    return "layup";
  }

  /**
   * 计算投篮成功率
   */
  private calculateShotSuccess(shooter: Player, defender: Player, shotType: string): boolean {
    const shooterStamina = this.getPlayerStamina(shooter.id);
    const defenderStamina = this.getPlayerStamina(defender.id);
    
    // 基础命中率
    let baseRate = 0.45;
    
    // 根据投篮类型调整
    if (shotType === "three") {
      baseRate = 0.35;
    } else if (shotType === "layup") {
      baseRate = 0.55;
    }
    
    // 进攻能力加成
    const offenseBonus = (shooter.scoring / 20) * 0.25;
    
    // 防守能力减成
    const defensePenalty = (defender.defense / 20) * 0.18;
    
    // 篮球智商影响
    const iqBonus = (shooter.basketballIQ / 20) * 0.12;
    
    // 体能影响（体能低会降低命中率）
    const staminaPenalty = (20 - shooterStamina) / 20 * 0.15;
    const defenderStaminaBonus = (20 - defenderStamina) / 20 * 0.08;
    
    const finalRate = baseRate + offenseBonus - defensePenalty + iqBonus - staminaPenalty + defenderStaminaBonus;
    
    return Math.random() < Math.max(0.1, Math.min(0.9, finalRate));
  }

  /**
   * 选择助攻球员
   */
  private selectAssister(team: TeamConfig, shooter: Player): Player | null {
    const others = team.players.filter(p => p.id !== shooter.id);
    if (others.length === 0) return null;
    
    // 基于传球能力加权选择
    const weights = others.map(p => p.passing);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < others.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return others[i];
      }
    }
    
    return others[0];
  }

  /**
   * 模拟篮板球
   */
  private simulateRebound(defendingTeam: TeamConfig, attackingTeam: TeamConfig): { team: "home" | "away"; player: Player } {
    // 防守方有更高概率抢到篮板
    const defenseChance = 0.7;
    const isDefensiveRebound = Math.random() < defenseChance;
    
    const reboundTeam = isDefensiveRebound ? defendingTeam : attackingTeam;
    const teamSide = reboundTeam === this.homeTeam ? "home" : "away";
    
    // 基于运动能力和体能选择篮板球员
    const weights = reboundTeam.players.map(p => {
      const stamina = this.getPlayerStamina(p.id);
      return p.athleticism * (stamina / 20);
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < reboundTeam.players.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return { team: teamSide, player: reboundTeam.players[i] };
      }
    }
    
    return { team: teamSide, player: reboundTeam.players[0] };
  }

  /**
   * 生成投篮描述
   */
  private generateShotDescription(player: Player, shotType: string, success: boolean): string {
    const shotTypeText = shotType === "three" ? "三分球" : shotType === "mid" ? "中距离投篮" : "上篮";
    const result = success ? "命中" : "不中";
    return `${player.name} ${shotTypeText} ${result}！`;
  }

  /**
   * 更新分数
   */
  private updateScore(points: number) {
    if (this.state.possession === "home") {
      this.state.homeScore += points;
      this.state.homeStats.points += points;
    } else {
      this.state.awayScore += points;
      this.state.awayStats.points += points;
    }
  }

  /**
   * 更新球员统计
   */
  private updatePlayerStats(playerId: number, shotType: string, success: boolean) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    const stats = this.state.playerStats.get(playerId)!;
    
    if (shotType === "three") {
      stats.threePointersAttempted++;
      const teamStats = this.getTeamStats(playerId);
      teamStats.threePointersAttempted++;
      
      if (success) {
        stats.threePointersMade++;
        stats.points += 3;
        teamStats.threePointersMade++;
      }
    } else {
      stats.fieldGoalsAttempted++;
      const teamStats = this.getTeamStats(playerId);
      teamStats.fieldGoalsAttempted++;
      
      if (success) {
        stats.fieldGoalsMade++;
        stats.points += 2;
        teamStats.fieldGoalsMade++;
      }
    }
  }

  /**
   * 获取球员所属球队的统计
   */
  private getTeamStats(playerId: number): TeamStats {
    const isHome = this.homeTeam.players.some(p => p.id === playerId);
    return isHome ? this.state.homeStats : this.state.awayStats;
  }

  /**
   * 更新助攻
   */
  private updateAssist(playerId: number) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    this.state.playerStats.get(playerId)!.assists++;
    this.getTeamStats(playerId).assists++;
  }

  /**
   * 更新篮板
   */
  private updateRebound(playerId: number) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    this.state.playerStats.get(playerId)!.rebounds++;
    this.getTeamStats(playerId).rebounds++;
  }

  /**
   * 更新抢断
   */
  private updateSteal(playerId: number) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    this.state.playerStats.get(playerId)!.steals++;
    this.getTeamStats(playerId).steals++;
  }

  /**
   * 更新盖帽
   */
  private updateBlock(playerId: number) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    this.state.playerStats.get(playerId)!.blocks++;
    this.getTeamStats(playerId).blocks++;
  }

  /**
   * 更新失误
   */
  private updateTurnover(playerId: number) {
    if (!this.state.playerStats.has(playerId)) {
      this.state.playerStats.set(playerId, {
        playerId,
        minutes: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      });
    }
    
    this.state.playerStats.get(playerId)!.turnovers++;
    this.getTeamStats(playerId).turnovers++;
  }

  /**
   * 运行比赛模拟
   */
  public async simulate(): Promise<GameState> {
    const quarterDuration = (this.config.duration * 60) / this.config.quarters;
    
    while (this.state.quarter <= this.config.quarters) {
      while (this.state.timeRemaining > 0) {
        // 模拟一个回合（约24秒）
        const possessionTime = Math.min(24, this.state.timeRemaining);
        const events = this.simulatePossession();
        
        this.state.events.push(...events);
        this.state.timeRemaining -= possessionTime;
      }
      
      // 节结束
      if (this.state.quarter < this.config.quarters) {
        this.state.events.push({
          type: "quarter_end",
          time: 0,
          quarter: this.state.quarter,
          team: "home",
          description: `第${this.state.quarter}节结束`,
        });
        
        this.state.quarter++;
        this.state.timeRemaining = quarterDuration;
        
        // 节间休息恢复体能
        this.state.playerStamina.forEach((stamina, playerId) => {
          const player = [...this.homeTeam.players, ...this.awayTeam.players].find(p => p.id === playerId);
          if (player) {
            const recovery = player.stamina * 0.3; // 恢复30%
            this.state.playerStamina.set(playerId, Math.min(player.stamina, stamina + recovery));
          }
        });
      } else {
        break;
      }
    }
    
    return this.state;
  }

  /**
   * 获取当前比赛状态
   */
  public getState(): GameState {
    return this.state;
  }
}

