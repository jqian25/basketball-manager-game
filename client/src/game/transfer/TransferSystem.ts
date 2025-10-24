// client/src/game/transfer/TransferSystem.ts

/**
 * 球队的工资帽状态，决定了交易时薪金对等的限制。
 * - BELOW_CAP: 低于工资帽
 * - ABOVE_CAP_BELOW_1ST_APRON: 高于工资帽，低于第一土豪线
 * - ABOVE_1ST_APRON_BELOW_2ND_APRON: 高于第一土豪线，低于第二土豪线
 * - ABOVE_2ND_APRON: 高于第二土豪线（最严格限制）
 */
export enum CapStatus {
    BELOW_CAP = "BELOW_CAP",
    ABOVE_CAP_BELOW_1ST_APRON = "ABOVE_CAP_BELOW_1ST_APRON",
    ABOVE_1ST_APRON_BELOW_2ND_APRON = "ABOVE_1ST_APRON_BELOW_2ND_APRON",
    ABOVE_2ND_APRON = "ABOVE_2ND_APRON",
}

/**
 * 球员合同信息
 */
export interface PlayerContract {
    salary: number; // 当前赛季薪水（单位：美元）
    yearsRemaining: number; // 合同剩余年限
    isGuaranteed: boolean; // 薪水是否保障
}

/**
 * 球员交易限制
 */
export interface TradeRestriction {
    isTradeable: boolean; // 是否可交易
    reason?: string; // 不可交易的原因（如：新秀合同、One-Year Bird、刚签约等）
    tradeUnlockDate?: Date; // 交易限制解除日期
}

/**
 * 球员接口
 */
export interface Player {
    id: string;
    name: string;
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    overallRating: number; // 球员能力值
    teamId: string; // 当前所属球队ID
    contract: PlayerContract;
    restriction: TradeRestriction;
}

/**
 * 选秀权接口
 */
export interface DraftPick {
    year: number;
    round: 1 | 2;
    originalTeamId: string; // 选秀权最初属于的球队
    isProtected: boolean; // 是否受保护
    protectionDetails?: string; // 保护条款细节
}

/**
 * 交易特例 (Traded Player Exception) 接口
 */
export interface TradeException {
    id: string;
    amount: number; // TPE金额
    expirationDate: Date; // 到期日期
    isTaxpayerTPE: boolean; // 是否为纳税人TPE（影响使用限制）
}

/**
 * 交易资产的联合类型
 */
export type TradeAsset = Player | DraftPick | { type: 'CASH', amount: number } | TradeException;

/**
 * 球队接口
 */
export interface Team {
    id: string;
    name: string;
    roster: Player[];
    totalSalary: number;
    capStatus: CapStatus;
    tradeExceptions: TradeException[];
    draftPicks: DraftPick[]; // 球队拥有的选秀权
    cashSentInTrades: number; // 本赛季已送出现金总额
}

/**
 * 交易提案接口
 */
export interface TradeProposal {
    teamAId: string;
    teamBId: string;
    teamAAssetsOut: TradeAsset[]; // A队送出的资产
    teamBAssetsOut: TradeAsset[]; // B队送出的资产
}

/**
 * 交易验证结果接口
 */
export interface TradeValidationResult {
    isValid: boolean;
    reason?: string;
    details?: {
        teamAIncomingSalaryLimit: number;
        teamBIncomingSalaryLimit: number;
        teamAGeneratedTPE?: number;
        teamBGeneratedTPE?: number;
    };
}

/**
 * 交易系统核心类
 */
export class TransferSystem {
    private teams: Map<string, Team>;
    // 假设的CBA关键数值 (实际游戏中应从配置加载)
    private readonly SALARY_CAP: number = 141000000; 
    private readonly FIRST_APRON: number = 172000000; 
    private readonly SECOND_APRON: number = 182500000; 
    private readonly CASH_LIMIT: number = 7000000; 

    constructor(teams: Team[]) {
        this.teams = new Map(teams.map(team => [team.id, team]));
    }

    /**
     * 获取球队信息
     */
    public getTeam(teamId: string): Team | undefined {
        return this.teams.get(teamId);
    }

    /**
     * 检查并计算薪金对等规则
     * @param teamOutSalary 送出球员的薪水总额
     * @param teamCapStatus 送出球队的工资帽状态
     * @returns 允许接收的最高薪水
     */
    private calculateIncomingSalaryLimit(teamOutSalary: number, teamCapStatus: CapStatus): number {
        const salary = teamOutSalary;

        switch (teamCapStatus) {
            case CapStatus.BELOW_CAP:
                // 低于工资帽的球队不受薪金对等限制，理论上可以接收任意薪水，
                // 只要交易后总薪水不超过工资帽即可。这里返回一个极大值。
                return Infinity;

            case CapStatus.ABOVE_CAP_BELOW_1ST_APRON:
                // 薪水对等规则（非土豪线以上球队）
                if (salary <= 7250000) { // $0 - $7.25M
                    return salary * 2 + 250000;
                } else if (salary <= 29000000) { // $7.25M - $29M
                    return salary + 7500000;
                } else { // > $29M
                    return salary * 1.25 + 250000;
                }

            case CapStatus.ABOVE_1ST_APRON_BELOW_2ND_APRON:
                // 高于第一土豪线，低于第二土豪线的球队
                return salary * 1.10;

            case CapStatus.ABOVE_2ND_APRON:
                // 高于第二土豪线的球队（最严格限制：100% 对等）
                return salary;

            default:
                return 0;
        }
    }

    /**
     * 验证交易提案是否符合CBA规则
     * @param proposal 交易提案
     * @returns 验证结果
     */
    public validateTrade(proposal: TradeProposal): TradeValidationResult {
        const teamA = this.getTeam(proposal.teamAId);
        const teamB = this.getTeam(proposal.teamBId);

        if (!teamA || !teamB) {
            return { isValid: false, reason: "交易涉及的球队不存在。" };
        }

        // 1. 提取和验证交易资产
        const teamAOutPlayers = proposal.teamAAssetsOut.filter((a): a is Player => (a as Player).contract !== undefined);
        const teamBOutPlayers = proposal.teamBAssetsOut.filter((a): a is Player => (a as Player).contract !== undefined);
        const teamAOutCash = proposal.teamAAssetsOut.filter((a): a is { type: 'CASH', amount: number } => (a as { type: 'CASH', amount: number }).type === 'CASH')
            .reduce((sum, cash) => sum + cash.amount, 0);
        const teamBOutCash = proposal.teamBAssetsOut.filter((a): a is { type: 'CASH', amount: number } => (a as { type: 'CASH', amount: number }).type === 'CASH')
            .reduce((sum, cash) => sum + cash.amount, 0);
        const teamAOutPicks = proposal.teamAAssetsOut.filter((a): a is DraftPick => (a as DraftPick).round !== undefined);
        const teamBOutPicks = proposal.teamBAssetsOut.filter((a): a is DraftPick => (a as DraftPick).round !== undefined);

        if (teamAOutPlayers.length === 0 && teamBOutPlayers.length === 0) {
             return { isValid: false, reason: "交易中必须包含至少一名球员。" };
        }
        
        // 2. 球员交易限制检查
        for (const player of [...teamAOutPlayers, ...teamBOutPlayers]) {
            if (!player.restriction.isTradeable) {
                return { isValid: false, reason: `${player.name} 不可交易: ${player.restriction.reason || '未知限制'}` };
            }
        }

        // 3. 现金交易限制检查
        if (teamAOutCash > 0 && teamA.capStatus === CapStatus.ABOVE_2ND_APRON) {
            return { isValid: false, reason: `${teamA.name} 处于第二土豪线之上，不能送出现金。` };
        }
        if (teamBOutCash > 0 && teamB.capStatus === CapStatus.ABOVE_2ND_APRON) {
            return { isValid: false, reason: `${teamB.name} 处于第二土豪线之上，不能送出现金。` };
        }
        if (teamA.cashSentInTrades + teamAOutCash > this.CASH_LIMIT) {
            return { isValid: false, reason: `${teamA.name} 本赛季送出现金总额将超过 $${this.CASH_LIMIT / 1000000}M 的上限。` };
        }
        if (teamB.cashSentInTrades + teamBOutCash > this.CASH_LIMIT) {
            return { isValid: false, reason: `${teamB.name} 本赛季送出现金总额将超过 $${this.CASH_LIMIT / 1000000}M 的上限。` };
        }

        // 4. 选秀权交易限制检查 (7年限制)
        const currentYear = new Date().getFullYear();
        const maxFutureYear = currentYear + 7;
        const isTeamAAbove2ndApron = teamA.capStatus === CapStatus.ABOVE_2ND_APRON;
        const isTeamBAbove2ndApron = teamB.capStatus === CapStatus.ABOVE_2ND_APRON;

        for (const pick of [...teamAOutPicks, ...teamBOutPicks]) {
            if (pick.year >= maxFutureYear) {
                const teamName = pick.originalTeamId === teamA.id ? teamA.name : teamB.name;
                const isApronTeam = pick.originalTeamId === teamA.id ? isTeamAAbove2ndApron : isTeamBAbove2ndApron;
                
                if (isApronTeam && pick.round === 1) {
                    return { isValid: false, reason: `${teamName} 处于第二土豪线之上，不能交易 ${pick.year} 年或之后的首轮选秀权（7年限制）。` };
                }
            }
        }
        
        // 5. 薪金对等检查
        const teamAOutSalary = teamAOutPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
        const teamBOutSalary = teamBOutPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
        const teamAInSalary = teamBOutPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
        const teamBInSalary = teamAOutPlayers.reduce((sum, p) => sum + p.contract.salary, 0);

        // A队接收薪水限制检查 (A队送出，B队接收)
        const teamAIncomingLimit = this.calculateIncomingSalaryLimit(teamAOutSalary, teamA.capStatus);
        if (teamAInSalary > teamAIncomingLimit) {
            return { 
                isValid: false, 
                reason: `${teamA.name} 接收的薪水总额 ($${teamAInSalary.toLocaleString()}) 超过了薪金对等上限 ($${teamAIncomingLimit.toLocaleString()})。`,
                details: { teamAIncomingSalaryLimit: teamAIncomingLimit, teamBIncomingSalaryLimit: 0 }
            };
        }

        // B队接收薪水限制检查 (B队送出，A队接收)
        const teamBIncomingLimit = this.calculateIncomingSalaryLimit(teamBOutSalary, teamB.capStatus);
        if (teamBInSalary > teamBIncomingLimit) {
            return { 
                isValid: false, 
                reason: `${teamB.name} 接收的薪水总额 ($${teamBInSalary.toLocaleString()}) 超过了薪金对等上限 ($${teamBIncomingLimit.toLocaleString()})。`,
                details: { teamAIncomingSalaryLimit: teamAIncomingLimit, teamBIncomingSalaryLimit: teamBIncomingLimit }
            };
        }

        // 6. TPE 生成 (如果接收薪水小于送出薪水)
        let teamAGeneratedTPE = 0;
        let teamBGeneratedTPE = 0;

        if (teamAOutSalary > teamBInSalary) {
            teamAGeneratedTPE = teamAOutSalary - teamBInSalary;
        }
        if (teamBOutSalary > teamAInSalary) {
            teamBGeneratedTPE = teamBOutSalary - teamAInSalary;
        }
        
        // 7. 最终验证通过
        return { 
            isValid: true, 
            reason: "交易符合CBA规则。",
            details: {
                teamAIncomingSalaryLimit: teamAIncomingLimit,
                teamBIncomingSalaryLimit: teamBIncomingLimit,
                teamAGeneratedTPE: teamAGeneratedTPE,
                teamBGeneratedTPE: teamBGeneratedTPE,
            }
        };
    }

    /**
     * 执行交易
     * @param proposal 交易提案
     * @returns 交易是否成功
     */
    public executeTrade(proposal: TradeProposal): boolean {
        const validation = this.validateTrade(proposal);
        if (!validation.isValid) {
            console.error(`交易失败: ${validation.reason}`);
            return false;
        }

        const teamA = this.teams.get(proposal.teamAId)!;
        const teamB = this.teams.get(proposal.teamBId)!;

        // 1. 移除送出资产
        const teamAOutPlayers = proposal.teamAAssetsOut.filter((a): a is Player => (a as Player).contract !== undefined);
        const teamBOutPlayers = proposal.teamBAssetsOut.filter((a): a is Player => (a as Player).contract !== undefined);
        const teamAOutCash = proposal.teamAAssetsOut.filter((a): a is { type: 'CASH', amount: number } => (a as { type: 'CASH', amount: number }).type === 'CASH')
            .reduce((sum, cash) => sum + cash.amount, 0);
        const teamBOutCash = proposal.teamBAssetsOut.filter((a): a is { type: 'CASH', amount: number } => (a as { type: 'CASH', amount: number }).type === 'CASH')
            .reduce((sum, cash) => sum + cash.amount, 0);
        const teamAOutPicks = proposal.teamAAssetsOut.filter((a): a is DraftPick => (a as DraftPick).round !== undefined);
        const teamBOutPicks = proposal.teamBAssetsOut.filter((a): a is DraftPick => (a as DraftPick).round !== undefined);

        // 2. 更新A队资产
        teamA.roster = teamA.roster.filter(p => !teamAOutPlayers.some(outP => outP.id === p.id));
        teamA.roster.push(...teamBOutPlayers.map(p => ({ ...p, teamId: teamA.id }))); // 接收球员，更新teamId
        teamA.draftPicks = teamA.draftPicks.filter(p => !teamAOutPicks.some(outP => outP.year === p.year && outP.round === p.round && outP.originalTeamId === p.originalTeamId));
        teamA.draftPicks.push(...teamBOutPicks); // 接收选秀权
        teamA.cashSentInTrades += teamAOutCash;
        
        // 3. 更新B队资产
        teamB.roster = teamB.roster.filter(p => !teamBOutPlayers.some(outP => outP.id === p.id));
        teamB.roster.push(...teamAOutPlayers.map(p => ({ ...p, teamId: teamB.id }))); // 接收球员，更新teamId
        teamB.draftPicks = teamB.draftPicks.filter(p => !teamBOutPicks.some(outP => outP.year === p.year && outP.round === p.round && outP.originalTeamId === p.originalTeamId));
        teamB.draftPicks.push(...teamAOutPicks); // 接收选秀权
        teamB.cashSentInTrades += teamBOutCash;

        // 4. 更新总薪水和TPE (为简化，CapStatus更新逻辑省略，实际游戏中应有单独的CapManager)
        teamA.totalSalary = teamA.roster.reduce((sum, p) => sum + p.contract.salary, 0);
        teamB.totalSalary = teamB.roster.reduce((sum, p) => sum + p.contract.salary, 0);
        
        // 5. 生成TPE (简化处理，实际TPE应有更复杂的生成和过期逻辑)
        if (validation.details!.teamAGeneratedTPE! > 0) {
            teamA.tradeExceptions.push({
                id: `TPE-${teamA.id}-${Date.now()}`,
                amount: validation.details!.teamAGeneratedTPE!,
                expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年有效期
                isTaxpayerTPE: teamA.capStatus !== CapStatus.ABOVE_2ND_APRON, // 2nd Apron不能生成TPE
            });
        }
        if (validation.details!.teamBGeneratedTPE! > 0) {
            teamB.tradeExceptions.push({
                id: `TPE-${teamB.id}-${Date.now()}`,
                amount: validation.details!.teamBGeneratedTPE!,
                expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年有效期
                isTaxpayerTPE: teamB.capStatus !== CapStatus.ABOVE_2ND_APRON,
            });
        }

        console.log("交易成功执行！");
        return true;
    }

    // 辅助方法：更新球队工资帽状态、处理选秀权、生成TPE等
    // ...

}

// 示例数据（用于测试或初始化）
export const mockTeamA: Team = {
    id: "LAL",
    name: "洛杉矶湖人",
    roster: [
        { id: "P001", name: "勒布朗·詹姆斯", position: 'SF', overallRating: 96, teamId: "LAL", contract: { salary: 47600000, yearsRemaining: 1, isGuaranteed: true }, restriction: { isTradeable: true } },
        { id: "P002", name: "安东尼·戴维斯", position: 'PF', overallRating: 94, teamId: "LAL", contract: { salary: 43200000, yearsRemaining: 3, isGuaranteed: true }, restriction: { isTradeable: true } },
    ],
    totalSalary: 180000000, // 假设高于第二土豪线
    capStatus: CapStatus.ABOVE_2ND_APRON,
    tradeExceptions: [],
    draftPicks: [{ year: 2026, round: 1, originalTeamId: "LAL", isProtected: false }],
    cashSentInTrades: 0,
};

export const mockTeamB: Team = {
    id: "BOS",
    name: "波士顿凯尔特人",
    roster: [
        { id: "P003", name: "杰森·塔图姆", position: 'SF', overallRating: 95, teamId: "BOS", contract: { salary: 34800000, yearsRemaining: 4, isGuaranteed: true }, restriction: { isTradeable: true } },
        { id: "P004", name: "杰伦·布朗", position: 'SG', overallRating: 92, teamId: "BOS", contract: { salary: 31800000, yearsRemaining: 5, isGuaranteed: true }, restriction: { isTradeable: true } },
        { id: "P005", name: "马库斯·斯马特", position: 'PG', overallRating: 85, teamId: "BOS", contract: { salary: 20000000, yearsRemaining: 2, isGuaranteed: true }, restriction: { isTradeable: true } },
    ],
    totalSalary: 150000000, // 假设高于工资帽，低于第一土豪线
    capStatus: CapStatus.ABOVE_CAP_BELOW_1ST_APRON,
    tradeExceptions: [{ id: "TPE001", amount: 5000000, expirationDate: new Date('2025-02-01'), isTaxpayerTPE: false }],
    draftPicks: [{ year: 2025, round: 1, originalTeamId: "BOS", isProtected: true, protectionDetails: "Top 5 Protected" }],
    cashSentInTrades: 0,
};

// 示例交易提案：LAL 送出 P001 (47.6M) + 2026首轮 换 BOS 的 P005 (20M) + 现金 5M
export const mockTradeProposal: TradeProposal = {
    teamAId: "LAL",
    teamBId: "BOS",
    teamAAssetsOut: [
        { id: "P001", name: "勒布朗·詹姆斯", position: 'SF', overallRating: 96, teamId: "LAL", contract: { salary: 47600000, yearsRemaining: 1, isGuaranteed: true }, restriction: { isTradeable: true } },
        { year: 2026, round: 1, originalTeamId: "LAL", isProtected: false } as DraftPick,
    ],
    teamBAssetsOut: [
        { id: "P005", name: "马库斯·斯马特", position: 'PG', overallRating: 85, teamId: "BOS", contract: { salary: 20000000, yearsRemaining: 2, isGuaranteed: true }, restriction: { isTradeable: true } },
        { type: 'CASH', amount: 5000000 },
    ],
};

// 示例交易提案2：LAL 送出 P002 (43.2M) 换 BOS 的 P003 (34.8M)
export const mockTradeProposal2: TradeProposal = {
    teamAId: "LAL",
    teamBId: "BOS",
    teamAAssetsOut: [
        { id: "P002", name: "安东尼·戴维斯", position: 'PF', overallRating: 94, teamId: "LAL", contract: { salary: 43200000, yearsRemaining: 3, isGuaranteed: true }, restriction: { isTradeable: true } },
    ],
    teamBAssetsOut: [
        { id: "P003", name: "杰森·塔图姆", position: 'SF', overallRating: 95, teamId: "BOS", contract: { salary: 34800000, yearsRemaining: 4, isGuaranteed: true }, restriction: { isTradeable: true } },
    ],
};