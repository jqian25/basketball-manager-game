// client/src/game/sponsors/SponsorshipSystem.ts

/**
 * 赞助商声望等级
 * 影响赞助金额的基数和赞助商的品牌影响力
 */
export enum SponsorReputation {
    LOCAL = 1,      // 地方性赞助商，低声望，低金额
    REGIONAL = 2,   // 区域性赞助商
    NATIONAL = 3,   // 全国性赞助商
    GLOBAL = 4,     // 全球性赞助商，高声望，高金额
}

/**
 * 赞助合同类型
 * 决定了赞助费用的支付结构和触发的奖励/惩罚机制
 */
export enum ContractType {
    FIXED_TERM = "FIXED_TERM",               // 固定期限合同，每年支付固定金额
    PERFORMANCE_BONUS = "PERFORMANCE_BONUS", // 绩效奖金合同，包含基于表现的额外奖励
    REVENUE_SHARE = "REVENUE_SHARE",         // 收入分成合同，基于球队商品销售等收入分成
}

/**
 * 赞助商接口
 */
export interface ISponsor {
    id: string;
    name: string;
    reputation: SponsorReputation;
    baseOfferValue: number; // 赞助商愿意提供的基础年费
    brandInfluence: number; // 赞助商的品牌影响力，影响球队的声望和球迷基础
    preferredMetrics: ('WINS' | 'MARKET_SIZE' | 'PLAYER_STAR_POWER')[]; // 赞助商偏好的评估指标
}

/**
 * 赞助合同接口
 */
export interface ISponsorshipContract {
    sponsorId: string;
    teamId: string;
    type: ContractType;
    annualPayment: number; // 每年支付的固定金额
    durationYears: number; // 合同持续年限
    yearsRemaining: number; // 剩余年限
    performanceBonusRate: number; // 绩效奖金比例 (0.0 - 1.0)，仅适用于 PERFORMANCE_BONUS
    revenueShareRate: number; // 收入分成比例 (0.0 - 1.0)，仅适用于 REVENUE_SHARE
    startDate: number; // 游戏年份
}

/**
 * 球队状态接口 (简化版，用于赞助商评估)
 */
export interface ITeamStatus {
    id: string;
    name: string;
    marketSize: number; // 市场规模 (1-100)
    teamReputation: number; // 球队声望 (1-100)
    currentSeasonWins: number; // 当前赛季胜场数
    playerStarPower: number; // 球队明星球员的综合影响力 (1-100)
    merchandiseRevenue: number; // 当前赛季商品销售收入 (用于收入分成)
}

/**
 * 赞助商系统核心类
 */
export class SponsorshipSystem {
    private sponsors: Map<string, ISponsor>;
    private activeContracts: Map<string, ISponsorshipContract>; // Key: teamId

    constructor() {
        this.sponsors = new Map();
        this.activeContracts = new Map();
        this.initializeSponsors();
    }

    /**
     * 初始化赞助商数据（模拟真实数据）
     */
    private initializeSponsors(): void {
        const initialSponsors: ISponsor[] = [
            {
                id: "nike", name: "Nike", reputation: SponsorReputation.GLOBAL,
                baseOfferValue: 50000000, brandInfluence: 95,
                preferredMetrics: ['WINS', 'PLAYER_STAR_POWER']
            },
            {
                id: "adidas", name: "Adidas", reputation: SponsorReputation.GLOBAL,
                baseOfferValue: 45000000, brandInfluence: 90,
                preferredMetrics: ['WINS', 'MARKET_SIZE']
            },
            {
                id: "gatorade", name: "Gatorade", reputation: SponsorReputation.NATIONAL,
                baseOfferValue: 15000000, brandInfluence: 70,
                preferredMetrics: ['WINS']
            },
            {
                id: "localbank", name: "City First Bank", reputation: SponsorReputation.LOCAL,
                baseOfferValue: 2000000, brandInfluence: 30,
                preferredMetrics: ['MARKET_SIZE']
            }
        ];

        initialSponsors.forEach(s => this.sponsors.set(s.id, s));
    }

    /**
     * 获取所有可用赞助商
     * @returns ISponsor[]
     */
    public getAllSponsors(): ISponsor[] {
        return Array.from(this.sponsors.values());
    }

    /**
     * 评估并生成赞助合同报价
     * 赞助金额基于球队状态和赞助商偏好进行动态调整
     * @param teamStatus 球队当前状态
     * @param sponsorId 赞助商ID
     * @returns ISponsorshipContract | null 赞助合同报价
     */
    public generateSponsorshipOffer(teamStatus: ITeamStatus, sponsorId: string): ISponsorshipContract | null {
        const sponsor = this.sponsors.get(sponsorId);
        if (!sponsor) return null;

        // 1. 基础价值评估
        let offerValue = sponsor.baseOfferValue;

        // 2. 动态调整：基于球队状态和赞助商偏好
        let multiplier = 1.0;
        const baseReputationMultiplier = teamStatus.teamReputation / 100; // 球队声望是基础乘数
        multiplier *= baseReputationMultiplier;

        // 偏好指标加权
        sponsor.preferredMetrics.forEach(metric => {
            switch (metric) {
                case 'WINS':
                    // 胜场越多，乘数越高。假设 50 胜场是基准 1.0
                    // NBA常规赛82场，41胜是50%胜率，作为基准
                    multiplier += (teamStatus.currentSeasonWins - 41) * 0.01;
                    break;
                case 'MARKET_SIZE':
                    // 市场规模越大，乘数越高
                    multiplier += (teamStatus.marketSize - 50) * 0.005;
                    break;
                case 'PLAYER_STAR_POWER':
                    // 明星影响力越大，乘数越高
                    multiplier += (teamStatus.playerStarPower - 50) * 0.008;
                    break;
            }
        });

        // 确保乘数在合理范围内 (例如 0.5 到 2.0)
        multiplier = Math.max(0.5, Math.min(2.0, multiplier));

        offerValue = Math.round(offerValue * multiplier / 10000) * 10000; // 四舍五入到万

        // 3. 确定合同类型和条款
        const contractType = this.determineContractType(sponsor.reputation, teamStatus.teamReputation);
        const durationYears = Math.floor(Math.random() * 3) + 2; // 2到4年

        let performanceBonusRate = 0;
        let revenueShareRate = 0;

        if (contractType === ContractType.PERFORMANCE_BONUS) {
            // 球队声望越高，赞助商越敢于提供奖金合同
            performanceBonusRate = 0.05 + (teamStatus.teamReputation / 100) * 0.15; // 5%到20%
        } else if (contractType === ContractType.REVENUE_SHARE) {
            // 球队市场规模越大，分成合同越有吸引力
            revenueShareRate = 0.03 + (teamStatus.marketSize / 100) * 0.07; // 3%到10%
        }

        // 4. 生成合同对象
        const contract: ISponsorshipContract = {
            sponsorId: sponsor.id,
            teamId: teamStatus.id,
            type: contractType,
            annualPayment: offerValue,
            durationYears: durationYears,
            yearsRemaining: durationYears,
            performanceBonusRate: parseFloat(performanceBonusRate.toFixed(3)),
            revenueShareRate: parseFloat(revenueShareRate.toFixed(3)),
            startDate: new Date().getFullYear(), // 简化为当前年份
        };

        return contract;
    }

    /**
     * 根据赞助商和球队声望动态决定合同类型
     * @param sponsorReputation 赞助商声望
     * @param teamReputation 球队声望
     * @returns ContractType
     */
    private determineContractType(sponsorReputation: SponsorReputation, teamReputation: number): ContractType {
        const totalReputation = sponsorReputation + teamReputation / 25; // 转换为 1-4 的范围

        if (totalReputation >= 6) {
            // 赞助商和球队声望都很高，倾向于绩效奖金或收入分成
            return Math.random() > 0.5 ? ContractType.PERFORMANCE_BONUS : ContractType.REVENUE_SHARE;
        } else if (totalReputation >= 4) {
            // 中等声望，倾向于绩效奖金或固定期限
            return Math.random() > 0.6 ? ContractType.PERFORMANCE_BONUS : ContractType.FIXED_TERM;
        } else {
            // 低声望，倾向于固定期限
            return ContractType.FIXED_TERM;
        }
    }

    /**
     * 接受赞助合同
     * @param contract 待接受的合同
     * @returns boolean 是否成功接受
     */
    public acceptContract(contract: ISponsorshipContract): boolean {
        if (this.activeContracts.has(contract.teamId)) {
            // 现实中可能允许同时有多个赞助商，但这里简化为每个球队一个主要赞助商
            console.warn(`Team ${contract.teamId} already has an active contract. Must terminate first.`);
            return false;
        }
        this.activeContracts.set(contract.teamId, contract);
        console.log(`Team ${contract.teamId} accepted contract with ${contract.sponsorId}. Annual Payment: ${contract.annualPayment}`);
        return true;
    }

    /**
     * 终止赞助合同
     * @param teamId 球队ID
     * @returns boolean 是否成功终止
     */
    public terminateContract(teamId: string): boolean {
        return this.activeContracts.delete(teamId);
    }

    /**
     * 赛季结束时处理赞助款项和奖金
     * 这是一个完整的游戏机制的核心部分。
     * @param teamStatus 球队最终状态
     * @returns number 本赛季获得的赞助总收入
     */
    public processEndOfSeasonPayments(teamStatus: ITeamStatus): number {
        const contract = this.activeContracts.get(teamStatus.id);
        if (!contract) {
            return 0;
        }

        let totalIncome = contract.annualPayment; // 基础年费

        if (contract.type === ContractType.PERFORMANCE_BONUS) {
            // 绩效奖金机制：基于胜场数和是否进入季后赛（假设45胜为季后赛门槛）
            let bonusMultiplier = 0;
            if (teamStatus.currentSeasonWins >= 45) {
                bonusMultiplier = 1.0; // 达到季后赛门槛，获得全额奖金
            } else if (teamStatus.currentSeasonWins >= 35) {
                bonusMultiplier = 0.5; // 表现尚可，获得一半奖金
            }
            // 真实篮球数据/规则：NBA常规赛82场，45胜是季后赛边缘球队。
            const maxBonus = contract.annualPayment * contract.performanceBonusRate;
            const performanceBonus = maxBonus * bonusMultiplier;
            totalIncome += performanceBonus;
            console.log(`Performance Bonus for ${teamStatus.name}: $${performanceBonus.toFixed(2)} (Wins: ${teamStatus.currentSeasonWins})`);

        } else if (contract.type === ContractType.REVENUE_SHARE) {
            // 收入分成机制：基于球队的商品销售收入
            const revenueShare = teamStatus.merchandiseRevenue * contract.revenueShareRate;
            totalIncome += revenueShare;
            console.log(`Revenue Share for ${teamStatus.name}: $${revenueShare.toFixed(2)} (Revenue: $${teamStatus.merchandiseRevenue})`);
        }

        // 更新合同剩余年限
        contract.yearsRemaining -= 1;
        if (contract.yearsRemaining <= 0) {
            this.terminateContract(teamStatus.id);
            console.log(`Contract for ${teamStatus.name} with ${contract.sponsorId} has expired.`);
        } else {
            this.activeContracts.set(teamStatus.id, contract); // 更新 Map
        }

        return totalIncome;
    }

    /**
     * 获取球队的当前赞助合同
     * @param teamId 球队ID
     * @returns ISponsorshipContract | undefined
     */
    public getActiveContract(teamId: string): ISponsorshipContract | undefined {
        return this.activeContracts.get(teamId);
    }

    /**
     * 模拟赞助商系统使用示例
     */
    public static runExample(): void {
        const system = new SponsorshipSystem();
        const teamAStatus: ITeamStatus = {
            id: "LAK",
            name: "Los Angeles Lakers",
            marketSize: 95,
            teamReputation: 90,
            currentSeasonWins: 58,
            playerStarPower: 98,
            merchandiseRevenue: 50000000, // 5000万
        };

        const teamBStatus: ITeamStatus = {
            id: "ORL",
            name: "Orlando Magic",
            marketSize: 40,
            teamReputation: 55,
            currentSeasonWins: 32,
            playerStarPower: 45,
            merchandiseRevenue: 10000000, // 1000万
        };

        console.log("--- 赞助商系统示例 ---");
        console.log("可用赞助商:", system.getAllSponsors().map(s => s.name).join(", "));

        // 1. 湖人队 (高声望) 收到 Nike 报价
        const nikeOffer = system.generateSponsorshipOffer(teamAStatus, "nike");
        if (nikeOffer) {
            console.log(`\n${teamAStatus.name} 收到 Nike 报价:`);
            console.log(`  合同类型: ${nikeOffer.type}`);
            console.log(`  年费: $${nikeOffer.annualPayment.toLocaleString()}`);
            console.log(`  期限: ${nikeOffer.durationYears} 年`);
            system.acceptContract(nikeOffer);
        }

        // 2. 魔术队 (低声望) 收到 Local Bank 报价
        const localBankOffer = system.generateSponsorshipOffer(teamBStatus, "localbank");
        if (localBankOffer) {
            console.log(`\n${teamBStatus.name} 收到 Local Bank 报价:`);
            console.log(`  合同类型: ${localBankOffer.type}`);
            console.log(`  年费: $${localBankOffer.annualPayment.toLocaleString()}`);
            console.log(`  期限: ${localBankOffer.durationYears} 年`);
            system.acceptContract(localBankOffer);
        }

        console.log("\n--- 赛季结束支付处理 ---");

        // 3. 湖人队支付处理 (高胜场，触发奖金/分成)
        const lakersIncome = system.processEndOfSeasonPayments(teamAStatus);
        console.log(`${teamAStatus.name} 本赛季赞助总收入: $${lakersIncome.toLocaleString()}`);
        console.log(`Lakers 剩余合同年限: ${system.getActiveContract(teamAStatus.id)?.yearsRemaining}`);

        // 4. 魔术队支付处理 (低胜场，可能只获得固定年费)
        const magicIncome = system.processEndOfSeasonPayments(teamBStatus);
        console.log(`${teamBStatus.name} 本赛季赞助总收入: $${magicIncome.toLocaleString()}`);
        console.log(`Magic 剩余合同年限: ${system.getActiveContract(teamBStatus.id)?.yearsRemaining}`);
    }
}

// 可以在其他模块中调用 SponsorshipSystem.runExample() 来测试系统
// SponsorshipSystem.runExample();