// client/src/game/fans/FanSystem.ts

/**
 * 球迷士气影响的类型
 * 灵感来源于真实篮球比赛中的“势头”、“主场优势”和“防守强度”等概念。
 */
export enum FanEffectType {
    HOME_COURT_ADVANTAGE = "主场优势", // 基础主场优势 (符合真实篮球数据)
    MOMENTUM_BOOST = "势头加成", // 比赛中高潮时的士气加成
    DEFENSE_BOOST = "防守加成", // 鼓励防守时的加成
    OFFENSE_BOOST = "进攻加成", // 鼓励进攻时的加成
    OPPONENT_DEBUFF = "对手减益", // 对客队造成的负面影响
}

/**
 * 单个球迷互动事件的结构
 */
export interface FanInteractionEvent {
    timestamp: number; // 事件发生的时间点 (例如：比赛时间，单位秒)
    type: FanEffectType; // 影响类型
    intensity: number; // 影响强度 (例如：0.1 到 1.0，用于影响球员属性)
    duration: number; // 影响持续时间 (单位秒)
    teamId: string; // 受到影响的球队ID
    description: string; // 事件描述
}

/**
 * 球迷系统的状态
 */
export interface FanSystemState {
    homeTeamFanMorale: number; // 主队球迷士气 (0.0 - 1.0)
    awayTeamFanMorale: number; // 客队球迷士气 (0.0 - 1.0)
    currentEffects: FanInteractionEvent[]; // 当前生效的球迷互动事件
}

/**
 * 比赛事件的抽象，用于触发球迷互动
 * 这是一个简化的接口，实际游戏中可能更复杂。
 */
export interface GameEvent {
    type: 'SCORE' | 'STEAL' | 'BLOCK' | 'TURNOVER' | 'TIMEOUT' | 'END_QUARTER';
    teamId: string; // 触发事件的球队ID
    playerIds: string[]; // 涉及的球员ID
    value?: number; // 事件相关数值 (例如：得分)
}

/**
 * FanSystem 类：实现球迷互动和士气管理的核心逻辑
 * 机制：比赛事件 -> 士气变化/效果生成 -> 效果叠加 -> 影响比赛属性
 */
export class FanSystem {
    private state: FanSystemState;
    private readonly HOME_TEAM_ID: string;
    private readonly AWAY_TEAM_ID: string;

    /**
     * 构造函数
     * @param homeTeamId 主队ID
     * @param awayTeamId 客队ID
     */
    constructor(homeTeamId: string, awayTeamId: string) {
        this.HOME_TEAM_ID = homeTeamId;
        this.AWAY_TEAM_ID = awayTeamId;
        this.state = {
            homeTeamFanMorale: 0.5, // 初始士气设为中性
            awayTeamFanMorale: 0.5,
            currentEffects: [],
        };
        // 初始应用主场优势，符合真实篮球规则
        this.applyInitialHomeCourtAdvantage();
    }

    /**
     * 应用初始的主场优势。
     * 真实篮球中，主场优势是持续存在的，通常相当于额外的得分或属性加成。
     */
    private applyInitialHomeCourtAdvantage(): void {
        const homeAdvantageIntensity = 0.08; // 基础主场优势强度，影响比赛属性
        const homeAdvantageDuration = 48 * 60 * 60; // 持续整场比赛 (假设游戏时间单位是秒，48分钟)

        const homeAdvantage: FanInteractionEvent = {
            timestamp: 0,
            type: FanEffectType.HOME_COURT_ADVANTAGE,
            intensity: homeAdvantageIntensity,
            duration: homeAdvantageDuration,
            teamId: this.HOME_TEAM_ID,
            description: "基础主场优势",
        };
        this.state.currentEffects.push(homeAdvantage);
    }

    /**
     * 处理比赛事件，根据事件类型和球队更新球迷士气并生成新的互动效果。
     * @param event 比赛事件
     * @param gameTime 当前比赛时间 (秒)
     */
    public handleGameEvent(event: GameEvent, gameTime: number): void {
        let moraleChange = 0;
        let effect: FanInteractionEvent | null = null;
        const isHomeTeamEvent = event.teamId === this.HOME_TEAM_ID;
        const affectedTeamId = event.teamId;

        switch (event.type) {
            case 'SCORE':
                // 高难度得分 (例如：三分球) 提升士气更多，符合球迷反应机制
                const scoreValue = event.value || 2;
                if (scoreValue === 3) {
                    moraleChange = 0.05; // 三分球或精彩扣篮
                } else {
                    moraleChange = 0.02; // 普通两分球
                }

                // 连续得分或关键时刻得分会产生势头加成
                effect = this.generateMomentumEffect(affectedTeamId, gameTime, moraleChange);
                break;
            case 'STEAL':
            case 'BLOCK':
                moraleChange = 0.04; // 精彩防守事件
                effect = this.generateDefenseEffect(affectedTeamId, gameTime, moraleChange);
                break;
            case 'TURNOVER':
                // 对手失误会提升本队士气，并对对手施加减益
                moraleChange = 0.03;
                this.updateMorale(affectedTeamId, moraleChange); // 本队士气提升
                
                // 对手减益效果
                const opponentTeamId = affectedTeamId === this.HOME_TEAM_ID ? this.AWAY_TEAM_ID : this.HOME_TEAM_ID;
                this.generateOpponentDebuff(opponentTeamId, gameTime);
                break;
            case 'TIMEOUT':
                // 暂停通常会打断势头，士气变化较小
                moraleChange = -0.01;
                break;
            case 'END_QUARTER':
                // 节间休息时，士气趋于平均值，模拟球迷冷静下来
                this.state.homeTeamFanMorale = this.state.homeTeamFanMorale * 0.9 + 0.1 * 0.5;
                this.state.awayTeamFanMorale = this.state.awayTeamFanMorale * 0.9 + 0.1 * 0.5;
                this.cleanUpExpiredEffects(gameTime);
                return; // 季度结束不产生新的效果，只清理和调整士气
        }

        // 更新士气
        this.updateMorale(affectedTeamId, moraleChange);

        // 应用新效果
        if (effect) {
            this.state.currentEffects.push(effect);
        }

        // 清理过期效果
        this.cleanUpExpiredEffects(gameTime);
    }

    /**
     * 生成势头加成效果 (MOMENTUM_BOOST)
     */
    private generateMomentumEffect(teamId: string, gameTime: number, baseIntensity: number): FanInteractionEvent {
        const intensity = baseIntensity * 2; // 势头加成更强
        const duration = 30; // 持续30秒
        return {
            timestamp: gameTime,
            type: FanEffectType.MOMENTUM_BOOST,
            intensity: intensity,
            duration: duration,
            teamId: teamId,
            description: `${teamId}球迷势头加成`,
        };
    }

    /**
     * 生成防守加成效果 (DEFENSE_BOOST)
     */
    private generateDefenseEffect(teamId: string, gameTime: number, baseIntensity: number): FanInteractionEvent {
        const intensity = baseIntensity * 1.5;
        const duration = 20;
        return {
            timestamp: gameTime,
            type: FanEffectType.DEFENSE_BOOST,
            intensity: intensity,
            duration: duration,
            teamId: teamId,
            description: `${teamId}球迷防守加成`,
        };
    }

    /**
     * 生成对手减益效果 (OPPONENT_DEBUFF)
     */
    private generateOpponentDebuff(opponentTeamId: string, gameTime: number): void {
        const debuff: FanInteractionEvent = {
            timestamp: gameTime,
            type: FanEffectType.OPPONENT_DEBUFF,
            intensity: -0.05, // 负强度表示减益，影响客队球员属性
            duration: 15,
            teamId: opponentTeamId,
            description: `客队受到主场球迷压力减益`,
        };
        this.state.currentEffects.push(debuff);
    }

    /**
     * 更新球队士气，并限制在 [0.0, 1.0] 之间。
     * @param teamId 球队ID
     * @param change 士气变化量
     */
    private updateMorale(teamId: string, change: number): void {
        if (teamId === this.HOME_TEAM_ID) {
            this.state.homeTeamFanMorale = Math.min(1.0, Math.max(0.0, this.state.homeTeamFanMorale + change));
        } else if (teamId === this.AWAY_TEAM_ID) {
            this.state.awayTeamFanMorale = Math.min(1.0, Math.max(0.0, this.state.awayTeamFanMorale + change));
        }
    }

    /**
     * 清理过期的效果
     * @param gameTime 当前比赛时间 (秒)
     */
    private cleanUpExpiredEffects(gameTime: number): void {
        this.state.currentEffects = this.state.currentEffects.filter(effect => {
            return effect.timestamp + effect.duration > gameTime;
        });
    }

    /**
     * 获取当前球迷互动对指定球队的总影响强度。
     * 影响强度可以转化为比赛中的属性加成 (例如：投篮命中率、抢断率)。
     * 这是 FanSystem 对外部游戏逻辑的核心输出。
     * @param teamId 球队ID
     * @returns 总影响强度 (例如：-0.1 到 0.2)
     */
    public getTotalEffectIntensity(teamId: string): number {
        let totalIntensity = 0;
        const moraleFactor = teamId === this.HOME_TEAM_ID ? this.state.homeTeamFanMorale : this.state.awayTeamFanMorale;
        
        // 1. 基础士气影响
        // 士气高于0.5才有正向影响，低于0.5有负面影响
        totalIntensity += (moraleFactor - 0.5) * 0.1; 

        // 2. 叠加当前生效的事件效果
        this.state.currentEffects.forEach(effect => {
            if (effect.teamId === teamId) {
                // 直接加成或减益
                totalIntensity += effect.intensity;
            } else if (effect.type === FanEffectType.OPPONENT_DEBUFF) {
                // 如果是对手减益，且当前球队是受害者
                const opponentId = teamId === this.HOME_TEAM_ID ? this.AWAY_TEAM_ID : this.HOME_TEAM_ID;
                if (effect.teamId === opponentId) {
                    totalIntensity += effect.intensity; // 减益是负值
                }
            }
        });

        // 限制总影响强度，防止数值过大，保证游戏平衡性
        return Math.min(0.2, Math.max(-0.1, totalIntensity));
    }

    /**
     * 获取当前球迷系统的状态
     */
    public getState(): FanSystemState {
        return this.state;
    }
}
