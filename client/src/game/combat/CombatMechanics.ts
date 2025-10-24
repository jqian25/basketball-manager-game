// client/src/game/combat/CombatMechanics.ts

/**
 * =================================================================
 * 篮球RPG回合制战斗系统 - 数据结构
 * =================================================================
 */

/**
 * 角色位置枚举：代表球员在场上的大致位置，影响其基础属性和技能偏向。
 */
export enum PlayerPosition {
    PG = "控球后卫 (Point Guard)",
    SG = "得分后卫 (Shooting Guard)",
    SF = "小前锋 (Small Forward)",
    PF = "大前锋 (Power Forward)",
    C = "中锋 (Center)",
}

/**
 * 属性枚举：代表球员的核心战斗属性。
 * 属性设计符合篮球主题，例如：
 * - 进攻：投篮、传球、控球
 * - 防守：抢断、盖帽、篮板
 * - 身体：体力、速度、力量
 */
export enum PlayerStat {
    // 进攻属性
    SHOOTING = "投篮", // 影响投篮命中率和伤害
    PASSING = "传球",   // 影响助攻率和技能协作效果
    HANDLING = "控球",  // 影响突破成功率和避免失误

    // 防守属性
    STEAL = "抢断",     // 影响抢断成功率
    BLOCK = "盖帽",     // 影响盖帽成功率
    REBOUND = "篮板",   // 影响争抢篮板成功率

    // 身体属性
    STAMINA = "体力",   // 影响行动次数和疲劳抵抗
    SPEED = "速度",     // 影响回合行动顺序（Initiative）和移动
    STRENGTH = "力量",   // 影响对抗成功率和内线得分
}

/**
 * 技能类型枚举：区分主动技能和被动技能。
 */
export enum SkillType {
    ACTIVE = "主动",
    PASSIVE = "被动",
}

/**
 * 战斗效果类型枚举：代表战斗中可能发生的各种状态效果。
 */
export enum CombatEffectType {
    BUFF_SHOOTING = "投篮加成",    // 增加投篮属性
    DEBUFF_SPEED = "速度削弱",     // 降低速度属性
    FATIGUE = "疲劳",           // 降低所有属性和行动力
    INJURY = "受伤",             // 持续伤害和属性大幅降低
    MOMENTUM = "势头高涨",       // 增加暴击率和特殊行动点
    TURNOVER_RISK = "失误风险增加", // 增加回合结束时失误的概率
}

/**
 * 状态效果接口：描述一个持续性的战斗效果。
 */
export interface IStatusEffect {
    type: CombatEffectType;
    duration: number; // 持续回合数
    value: number;    // 效果值（如属性增加/减少的百分比）
    sourcePlayerId: string; // 施加效果的球员ID
}

/**
 * 球员接口：描述一个参与战斗的球员。
 */
export interface IPlayer {
    id: string;
    name: string;
    position: PlayerPosition;
    stats: Record<PlayerStat, number>; // 基础属性值 (1-100)
    currentStamina: number; // 当前体力值
    maxStamina: number; // 最大体力值
    skills: ISkill[]; // 拥有的技能列表
    statusEffects: IStatusEffect[]; // 当前状态效果
    initiative: number; // 回合行动顺序值 (基于速度和随机数)
}

/**
 * 技能接口：描述一个球员可以使用的技能。
 */
export interface ISkill {
    id: string;
    name: string;
    type: SkillType;
    staminaCost: number; // 体力消耗
    description: string;
    // 技能效果的配置，具体实现由CombatMechanics类处理
    effectConfig: any;
}

/**
 * 战斗场景接口：描述当前战斗的状态。
 */
export interface ICombatState {
    teamA: IPlayer[]; // 进攻方 (或主队)
    teamB: IPlayer[]; // 防守方 (或客队)
    activeTeamId: 'A' | 'B'; // 当前行动的队伍
    activePlayerId: string; // 当前行动的球员ID
    turnCount: number; // 当前回合数
    actionLog: string[]; // 战斗日志
    isGameOver: boolean; // 战斗是否结束
    scoreA: number; // 队伍A得分
    scoreB: number; // 队伍B得分
    possession: 'A' | 'B'; // 当前球权
}

/**
 * 战斗行动接口：描述一个球员在回合中执行的动作。
 */
export interface ICombatAction {
    playerId: string;
    skillId: string; // 使用的技能ID
    targetPlayerIds: string[]; // 目标球员ID列表 (可以是队友或对手)
}

/**
 * =================================================================
 * 篮球RPG回合制战斗系统 - 配置
 * =================================================================
 */

/**
 * 战斗系统配置接口：用于调整战斗的全局参数。
 */
export interface ICombatConfig {
    /**
     * 属性影响系数：定义各项属性对战斗结果的影响权重。
     * 例如：投篮命中率 = 基础命中率 + 球员投篮 * SHOOTING_FACTOR
     */
    statInfluence: {
        [PlayerStat.SHOOTING]: number; // 投篮对命中率的影响
        [PlayerStat.PASSING]: number;  // 传球对助攻率的影响
        [PlayerStat.HANDLING]: number; // 控球对失误率的影响
        [PlayerStat.STEAL]: number;    // 抢断对抢断成功率的影响
        [PlayerStat.BLOCK]: number;    // 盖帽对盖帽成功率的影响
        [PlayerStat.REBOUND]: number;  // 篮板对篮板争抢成功率的影响
        [PlayerStat.STAMINA]: number;  // 体力对行动力的影响
        [PlayerStat.SPEED]: number;    // 速度对先手值的影响
        [PlayerStat.STRENGTH]: number; // 力量对内线对抗的影响
    };

    /**
     * 基础命中率：所有投篮的基础成功率（百分比）。
     */
    baseShotSuccessRate: number; // 0.0 - 1.0

    /**
     * 疲劳阈值：体力低于此百分比时开始施加疲劳状态。
     */
    fatigueThreshold: number; // 0.0 - 1.0

    /**
     * 疲劳效果值：疲劳状态对属性的削弱百分比。
     */
    fatigueEffectValue: number; // 0.0 - 1.0

    /**
     * 暴击率：基础暴击率（百分比）。
     */
    baseCriticalChance: number; // 0.0 - 1.0

    /**
     * 暴击伤害倍数：暴击时伤害的倍数。
     */
    criticalDamageMultiplier: number;

    /**
     * 回合结束时的失误基础概率。
     */
    baseTurnoverChance: number; // 0.0 - 1.0
}

/**
 * 默认战斗配置。
 */
export const DefaultCombatConfig: ICombatConfig = {
    statInfluence: {
        [PlayerStat.SHOOTING]: 0.005,
        [PlayerStat.PASSING]: 0.004,
        [PlayerStat.HANDLING]: 0.006,
        [PlayerStat.STEAL]: 0.007,
        [PlayerStat.BLOCK]: 0.006,
        [PlayerStat.REBOUND]: 0.005,
        [PlayerStat.STAMINA]: 0.01,
        [PlayerStat.SPEED]: 0.008,
        [PlayerStat.STRENGTH]: 0.005,
    },
    baseShotSuccessRate: 0.4, // 基础40%命中率
    fatigueThreshold: 0.3,    // 体力低于30%开始疲劳
    fatigueEffectValue: 0.15, // 疲劳状态削弱15%属性
    baseCriticalChance: 0.05, // 基础5%暴击率
    criticalDamageMultiplier: 1.5, // 暴击伤害1.5倍
    baseTurnoverChance: 0.02, // 基础2%失误率
};

/**
 * =================================================================
 * 篮球RPG回合制战斗系统 - 核心逻辑类
 * =================================================================
 */

/**
 * 战斗机制核心类：包含所有战斗逻辑和状态管理。
 */
export class CombatMechanics {
    private state: ICombatState;
    private config: ICombatConfig;

    constructor(initialState: ICombatState, config: ICombatConfig = DefaultCombatConfig) {
        this.state = initialState;
        this.config = config;
        this.initializeCombat();
    }

    /**
     * 初始化战斗：计算球员先手值，确定第一回合行动顺序。
     */
    private initializeCombat(): void {
        const allPlayers = [...this.state.teamA, ...this.state.teamB];
        allPlayers.forEach(player => {
            // 先手值 = 速度 * 速度系数 + 随机数 (1-10)
            player.initiative = player.stats[PlayerStat.SPEED] * this.config.statInfluence[PlayerStat.SPEED] * 10 + Math.floor(Math.random() * 10) + 1;
        });

        // 根据先手值排序，确定第一个行动的球员
        allPlayers.sort((a, b) => b.initiative - a.initiative);
        if (allPlayers.length > 0) {
            this.state.activePlayerId = allPlayers[0].id;
            this.state.activeTeamId = this.findPlayerTeam(allPlayers[0].id);
        }

        this.state.turnCount = 1;
        this.logAction(`战斗开始！球权归属 ${this.state.possession === 'A' ? '队伍A' : '队伍B'}`);
        this.logAction(`首个行动球员：${allPlayers[0]?.name || '无'}`);
    }

    /**
     * 查找球员所属队伍。
     */
    private findPlayerTeam(playerId: string): 'A' | 'B' {
        if (this.state.teamA.some(p => p.id === playerId)) return 'A';
        if (this.state.teamB.some(p => p.id === playerId)) return 'B';
        throw new Error(`Player with ID ${playerId} not found.`);
    }

    /**
     * 记录战斗日志。
     */
    private logAction(message: string): void {
        this.state.actionLog.push(`[回合 ${this.state.turnCount}] ${message}`);
    }

    /**
     * 获取当前战斗状态。
     */
    public getState(): ICombatState {
        return this.state;
    }

    /**
     * 处理球员行动。
     * @param action 球员执行的动作。
     */
    public processAction(action: ICombatAction): void {
        if (this.state.isGameOver) {
            this.logAction("战斗已结束，无法执行动作。");
            return;
        }

        const activePlayer = this.getPlayer(action.playerId);
        const skill = activePlayer.skills.find(s => s.id === action.skillId);

        if (!activePlayer || activePlayer.id !== this.state.activePlayerId) {
            this.logAction(`错误：非当前行动球员 ${action.playerId} 尝试行动。`);
            return;
        }

        if (!skill) {
            this.logAction(`错误：球员 ${activePlayer.name} 找不到技能 ${action.skillId}。`);
            return;
        }

        if (activePlayer.currentStamina < skill.staminaCost) {
            this.logAction(`错误：球员 ${activePlayer.name} 体力不足，无法使用 ${skill.name}。`);
            return;
        }

        // 1. 消耗体力
        activePlayer.currentStamina -= skill.staminaCost;
        this.logAction(`${activePlayer.name} 使用了技能 ${skill.name}，消耗体力 ${skill.staminaCost}。`);

        // 2. 执行技能效果 (此处仅为示例，实际需要复杂的技能效果处理函数)
        this.executeSkillEffect(activePlayer, skill, action.targetPlayerIds);

        // 3. 检查疲劳状态
        this.checkFatigue(activePlayer);

        // 4. 切换到下一个球员
        this.nextTurn();
    }

    /**
     * 获取球员对象。
     */
    private getPlayer(playerId: string): IPlayer {
        const player = [...this.state.teamA, ...this.state.teamB].find(p => p.id === playerId);
        if (!player) throw new Error(`Player with ID ${playerId} not found.`);
        return player;
    }

    /**
     * 执行技能效果的占位函数。
     * 实际游戏中，这里会根据技能类型和配置执行复杂的计算，
     * 例如投篮成功率、抢断判定、施加状态等。
     */
    private executeSkillEffect(source: IPlayer, skill: ISkill, targetIds: string[]): void {
        const targets = targetIds.map(id => this.getPlayer(id));

        switch (skill.name) {
            case "三分投篮":
                this.handleShotAttempt(source, 3, targets);
                break;
            case "强力抢断":
                this.handleStealAttempt(source, targets[0]);
                break;
            case "战术传球":
                this.handlePassAttempt(source, targets);
                break;
            default:
                this.logAction(`技能 ${skill.name} 的效果未实现。`);
                break;
        }
    }

    /**
     * 处理投篮尝试。
     */
    private handleShotAttempt(shooter: IPlayer, points: 2 | 3, targets: IPlayer[]): void {
        const opponentTeam = this.findPlayerTeam(shooter.id) === 'A' ? this.state.teamB : this.state.teamA;
        const defender = opponentTeam.find(p => p.position === PlayerPosition.C || p.position === PlayerPosition.PF); // 简化：内线球员防守

        // 投篮成功率 = 基础成功率 + 投篮属性 * 影响系数 - (防守球员盖帽属性 * 影响系数)
        let successRate = this.config.baseShotSuccessRate +
            shooter.stats[PlayerStat.SHOOTING] * this.config.statInfluence[PlayerStat.SHOOTING] * 10 -
            (defender ? defender.stats[PlayerStat.BLOCK] * this.config.statInfluence[PlayerStat.BLOCK] * 5 : 0);

        // 应用状态效果修正
        const shootingBuff = shooter.statusEffects.find(e => e.type === CombatEffectType.BUFF_SHOOTING);
        if (shootingBuff) {
            successRate *= (1 + shootingBuff.value);
        }

        successRate = Math.max(0.1, Math.min(0.9, successRate)); // 限制成功率在10%到90%之间

        if (Math.random() < successRate) {
            this.logAction(`${shooter.name} 投篮成功，获得 ${points} 分！`);
            if (this.state.possession === 'A') {
                this.state.scoreA += points;
            } else {
                this.state.scoreB += points;
            }
            this.state.possession = this.state.possession === 'A' ? 'B' : 'A'; // 进球后球权转换
        } else {
            this.logAction(`${shooter.name} 投篮未中！`);
            this.handleRebound(shooter); // 投篮不中触发篮板争抢
        }
    }

    /**
     * 处理抢断尝试。
     */
    private handleStealAttempt(stealer: IPlayer, target: IPlayer): void {
        // 抢断成功率 = 抢断属性 * 影响系数 - 目标控球属性 * 影响系数
        let successRate = stealer.stats[PlayerStat.STEAL] * this.config.statInfluence[PlayerStat.STEAL] * 10 -
            target.stats[PlayerStat.HANDLING] * this.config.statInfluence[PlayerStat.HANDLING] * 5;

        successRate = Math.max(0.05, Math.min(0.7, successRate));

        if (Math.random() < successRate) {
            this.logAction(`${stealer.name} 成功抢断 ${target.name}！球权转换！`);
            this.state.possession = this.findPlayerTeam(stealer.id);
        } else {
            this.logAction(`${stealer.name} 抢断失败。`);
            // 抢断失败可能导致犯规或失位，此处简化为无后果
        }
    }

    /**
     * 处理传球尝试（例如用于施加增益状态）。
     */
    private handlePassAttempt(passer: IPlayer, targets: IPlayer[]): void {
        // 传球成功率 = 传球属性 * 影响系数
        let successRate = passer.stats[PlayerStat.PASSING] * this.config.statInfluence[PlayerStat.PASSING] * 10;
        successRate = Math.min(0.95, successRate);

        if (Math.random() < successRate) {
            this.logAction(`${passer.name} 成功传球给 ${targets.map(t => t.name).join(', ')}，提升了他们的投篮能力！`);
            targets.forEach(target => {
                // 施加一个投篮加成状态
                target.statusEffects.push({
                    type: CombatEffectType.BUFF_SHOOTING,
                    duration: 2, // 持续2回合
                    value: 0.2, // 投篮成功率提高20%
                    sourcePlayerId: passer.id,
                });
            });
        } else {
            this.logAction(`${passer.name} 传球失误！`);
            this.state.possession = this.findPlayerTeam(passer.id) === 'A' ? 'B' : 'A'; // 传球失误导致球权转换
        }
    }

    /**
     * 处理篮板争抢。
     */
    private handleRebound(shooter: IPlayer): void {
        const teamA_rebound = this.state.teamA.reduce((sum, p) => sum + p.stats[PlayerStat.REBOUND], 0);
        const teamB_rebound = this.state.teamB.reduce((sum, p) => sum + p.stats[PlayerStat.REBOUND], 0);

        const totalRebound = teamA_rebound + teamB_rebound;
        const chanceA = totalRebound > 0 ? teamA_rebound / totalRebound : 0.5;

        if (Math.random() < chanceA) {
            this.state.possession = 'A';
            this.logAction(`队伍A抢到篮板！球权归属队伍A。`);
        } else {
            this.state.possession = 'B';
            this.logAction(`队伍B抢到篮板！球权归属队伍B。`);
        }
    }

    /**
     * 检查并施加疲劳状态。
     */
    private checkFatigue(player: IPlayer): void {
        const currentRatio = player.currentStamina / player.maxStamina;
        const hasFatigue = player.statusEffects.some(e => e.type === CombatEffectType.FATIGUE);

        if (currentRatio < this.config.fatigueThreshold && !hasFatigue) {
            player.statusEffects.push({
                type: CombatEffectType.FATIGUE,
                duration: 999, // 持续直到体力恢复
                value: this.config.fatigueEffectValue,
                sourcePlayerId: "SYSTEM",
            });
            this.logAction(`${player.name} 体力不支，进入疲劳状态！`);
        } else if (currentRatio >= this.config.fatigueThreshold && hasFatigue) {
            // 移除疲劳状态 (此处简化处理，实际可能需要更复杂的移除逻辑)
            player.statusEffects = player.statusEffects.filter(e => e.type !== CombatEffectType.FATIGUE);
            this.logAction(`${player.name} 恢复体力，疲劳状态解除！`);
        }
    }

    /**
     * 推进到下一个回合或下一个球员行动。
     */
    private nextTurn(): void {
        // 1. 状态效果持续时间减少
        const allPlayers = [...this.state.teamA, ...this.state.teamB];
        allPlayers.forEach(player => {
            player.statusEffects = player.statusEffects
                .map(effect => ({ ...effect, duration: effect.duration - 1 }))
                .filter(effect => effect.duration > 0);
        });

        // 2. 确定下一个行动的球员
        const sortedPlayers = allPlayers.sort((a, b) => b.initiative - a.initiative);
        const currentIndex = sortedPlayers.findIndex(p => p.id === this.state.activePlayerId);
        const nextIndex = (currentIndex + 1) % sortedPlayers.length;
        const nextPlayer = sortedPlayers[nextIndex];

        this.state.activePlayerId = nextPlayer.id;
        this.state.activeTeamId = this.findPlayerTeam(nextPlayer.id);

        // 如果回到第一个行动的球员，则回合数增加
        if (nextIndex === 0) {
            this.state.turnCount++;
            this.logAction(`--- 第 ${this.state.turnCount} 回合开始 ---`);
        }

        // 3. 检查游戏是否结束 (例如达到特定回合数或分数)
        if (this.state.turnCount > 10) { // 简化：10回合结束
            this.state.isGameOver = true;
            this.logAction(`战斗结束！最终比分 队伍A: ${this.state.scoreA} - 队伍B: ${this.state.scoreB}`);
        }
    }

    /**
     * 模拟一个完整的战斗流程示例。
     */
    public static simulateExampleCombat(): ICombatState {
        // 示例球员数据
        const player1: IPlayer = {
            id: "PG1", name: "闪电侠", position: PlayerPosition.PG,
            stats: { [PlayerStat.SHOOTING]: 80, [PlayerStat.PASSING]: 95, [PlayerStat.HANDLING]: 90, [PlayerStat.STEAL]: 85, [PlayerStat.BLOCK]: 40, [PlayerStat.REBOUND]: 30, [PlayerStat.STAMINA]: 80, [PlayerStat.SPEED]: 95, [PlayerStat.STRENGTH]: 50 },
            currentStamina: 80, maxStamina: 80, skills: [
                { id: "S1", name: "战术传球", type: SkillType.ACTIVE, staminaCost: 5, description: "传球给队友，增加其投篮BUFF。", effectConfig: {} },
            ], statusEffects: [], initiative: 0
        };
        const player2: IPlayer = {
            id: "C1", name: "巨无霸", position: PlayerPosition.C,
            stats: { [PlayerStat.SHOOTING]: 50, [PlayerStat.PASSING]: 60, [PlayerStat.HANDLING]: 40, [PlayerStat.STEAL]: 50, [PlayerStat.BLOCK]: 95, [PlayerStat.REBOUND]: 90, [PlayerStat.STAMINA]: 90, [PlayerStat.SPEED]: 40, [PlayerStat.STRENGTH]: 95 },
            currentStamina: 90, maxStamina: 90, skills: [
                { id: "S2", name: "内线强攻", type: SkillType.ACTIVE, staminaCost: 10, description: "尝试近距离投篮。", effectConfig: {} },
            ], statusEffects: [], initiative: 0
        };
        const player3: IPlayer = {
            id: "SG2", name: "神射手", position: PlayerPosition.SG,
            stats: { [PlayerStat.SHOOTING]: 95, [PlayerStat.PASSING]: 70, [PlayerStat.HANDLING]: 80, [PlayerStat.STEAL]: 60, [PlayerStat.BLOCK]: 50, [PlayerStat.REBOUND]: 40, [PlayerStat.STAMINA]: 75, [PlayerStat.SPEED]: 85, [PlayerStat.STRENGTH]: 60 },
            currentStamina: 75, maxStamina: 75, skills: [
                { id: "S3", name: "三分投篮", type: SkillType.ACTIVE, staminaCost: 15, description: "尝试三分线外投篮。", effectConfig: {} },
            ], statusEffects: [], initiative: 0
        };

        const initialState: ICombatState = {
            teamA: [player1, player2],
            teamB: [player3],
            activeTeamId: 'A',
            activePlayerId: "",
            turnCount: 0,
            actionLog: [],
            isGameOver: false,
            scoreA: 0,
            scoreB: 0,
            possession: 'A',
        };

        const combat = new CombatMechanics(initialState);

        // 模拟几个回合的动作
        // 1. 闪电侠 (PG1) 传球给巨无霸 (C1)
        combat.processAction({ playerId: "PG1", skillId: "S1", targetPlayerIds: ["C1"] });
        // 2. 神射手 (SG2) 尝试抢断闪电侠 (PG1)
        combat.processAction({ playerId: "SG2", skillId: "S2", targetPlayerIds: ["PG1"] });
        // 3. 巨无霸 (C1) 尝试投篮
        // 假设巨无霸的技能S2是内线强攻，此处用三分投篮S3代替模拟
        combat.processAction({ playerId: "C1", skillId: "S3", targetPlayerIds: [] });
        
        return combat.getState();
    }
}
// 示例：如何使用和查看模拟结果
// const finalState = CombatMechanics.simulateExampleCombat();
// console.log(finalState.actionLog);
// console.log(`最终比分: A ${finalState.scoreA} - B ${finalState.scoreB}`);