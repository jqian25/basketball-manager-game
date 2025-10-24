// client/src/game/finance/FinanceSystem.ts

/**
 * 球队财务系统 - 实现预算管理
 * 
 * 核心设计理念：
 * 1. 真实篮球数据：参考NBA等职业联赛的薪资帽、奢侈税、收入来源等概念。
 * 2. 符合篮球运动规则：财务操作需考虑球员合同、交易规则、伤病特例等。
 * 3. 完整游戏机制：提供预算、收入、支出、盈亏计算、赛季末结算等功能。
 */

// -----------------------------------------------------------------------------
// 财务常量和类型定义
// -----------------------------------------------------------------------------

/**
 * 财务系统配置参数（参考NBA 2024-2025赛季数据）
 */
export interface FinanceConfig {
    /** 薪资帽 (Salary Cap) - 球队总薪水不能超过此值，除非支付奢侈税 */
    salaryCap: number; 
    /** 奢侈税线 (Luxury Tax Threshold) - 超过此值开始支付奢侈税 */
    luxuryTaxThreshold: number;
    /** 奢侈税率 - 超过税线部分的税率（简化处理，实际NBA是阶梯税率） */
    luxuryTaxRate: number;
    /** 收入分成比例 - 联盟收入分配给球队的比例 */
    revenueShareRate: number;
    /** 基础运营成本 - 球队每赛季的基础开支（如场馆维护、非球员员工薪水等） */
    baseOperatingCost: number;
}

/**
 * 球队收入来源
 */
export interface TeamRevenue {
    /** 门票收入 (Ticket Sales) */
    ticketSales: number;
    /** 赞助和广告收入 (Sponsorships & Advertising) */
    sponsorships: number;
    /** 联盟收入分成 (League Revenue Sharing) */
    leagueShare: number;
    /** 季后赛收入 (Playoff Revenue) - 仅在进入季后赛时产生 */
    playoffRevenue: number;
    /** 其他收入 (Miscellaneous) */
    other: number;
}

/**
 * 球队支出项
 */
export interface TeamExpenses {
    /** 球员总薪水 (Player Salaries) */
    playerSalaries: number;
    /** 运营成本 (Operating Costs) */
    operatingCosts: number;
    /** 奢侈税 (Luxury Tax Paid) */
    luxuryTax: number;
    /** 交易支出 (Trade Expenses) - 如交易中的现金支出 */
    tradeExpenses: number;
    /** 其他支出 (Miscellaneous) */
    other: number;
}

// -----------------------------------------------------------------------------
// 核心财务系统类
// -----------------------------------------------------------------------------

export class FinanceSystem {
    private config: FinanceConfig;
    private currentBudget: number; // 球队当前现金预算
    private seasonRevenue: TeamRevenue;
    private seasonExpenses: TeamExpenses;

    /**
     * @param initialBudget 球队初始现金预算
     * @param config 财务系统配置
     */
    constructor(initialBudget: number, config: FinanceConfig) {
        this.currentBudget = initialBudget;
        this.config = config;
        this.resetSeasonFinancials();
    }

    /**
     * 重置赛季财务数据
     */
    public resetSeasonFinancials(): void {
        this.seasonRevenue = {
            ticketSales: 0,
            sponsorships: 0,
            leagueShare: 0,
            playoffRevenue: 0,
            other: 0,
        };
        this.seasonExpenses = {
            playerSalaries: 0,
            operatingCosts: this.config.baseOperatingCost, // 基础运营成本在赛季开始时计入
            luxuryTax: 0,
            tradeExpenses: 0,
            other: 0,
        };
    }

    // -------------------------------------------------------------------------
    // 预算管理核心方法
    // -------------------------------------------------------------------------

    /**
     * 获取当前现金预算
     * @returns 当前可用现金
     */
    public getCurrentBudget(): number {
        return this.currentBudget;
    }

    /**
     * 检查是否有足够的现金进行支出
     * @param amount 支出金额
     * @returns 是否足够
     */
    public canAfford(amount: number): boolean {
        return this.currentBudget >= amount;
    }

    /**
     * 增加现金收入
     * @param source 收入来源
     * @param amount 收入金额
     */
    public addRevenue(source: keyof TeamRevenue, amount: number): void {
        if (amount <= 0) return;
        this.seasonRevenue[source] += amount;
        this.currentBudget += amount;
    }

    /**
     * 记录支出并从预算中扣除
     * @param expense 支出类型
     * @param amount 支出金额
     * @returns 是否成功支出
     */
    public recordExpense(expense: keyof TeamExpenses, amount: number): boolean {
        if (amount <= 0) return true; // 零支出视为成功

        // 交易支出等需要实时检查现金
        if (expense !== 'playerSalaries' && expense !== 'luxuryTax' && !this.canAfford(amount)) {
            console.warn(`Insufficient funds to cover ${expense} expense of ${amount}. Current budget: ${this.currentBudget}`);
            return false;
        }

        this.seasonExpenses[expense] += amount;
        this.currentBudget -= amount;
        return true;
    }

    // -------------------------------------------------------------------------
    // 篮球规则相关财务计算
    // -------------------------------------------------------------------------

    /**
     * 计算奢侈税
     * 
     * 奢侈税 = (总薪水 - 奢侈税线) * 奢侈税率
     * @param totalPlayerSalaries 球队当前总薪水
     * @returns 应缴奢侈税金额
     */
    public calculateLuxuryTax(totalPlayerSalaries: number): number {
        const { luxuryTaxThreshold, luxuryTaxRate } = this.config;
        
        if (totalPlayerSalaries <= luxuryTaxThreshold) {
            return 0;
        }

        const overage = totalPlayerSalaries - luxuryTaxThreshold;
        // 简化处理，实际NBA是阶梯税率，这里使用一个固定税率
        const taxAmount = overage * luxuryTaxRate;

        // 记录奢侈税支出（注意：实际支付通常在赛季末）
        // 这里的recordExpense只是为了记录到seasonExpenses中，不立即扣除现金
        // 实际扣除应在赛季结算时进行，但为了简化，我们在这里计算并返回
        // 游戏机制可以设计为在赛季末调用此方法并进行实际扣除
        return taxAmount;
    }

    /**
     * 检查球队总薪水是否在硬/软薪资帽范围内
     * 
     * @param totalPlayerSalaries 球队当前总薪水
     * @returns 检查结果
     */
    public checkSalaryCapCompliance(totalPlayerSalaries: number): { compliant: boolean, message: string } {
        const { salaryCap, luxuryTaxThreshold } = this.config;

        if (totalPlayerSalaries > luxuryTaxThreshold) {
            const tax = this.calculateLuxuryTax(totalPlayerSalaries);
            return {
                compliant: true, // 超过奢侈税线但愿意支付奢侈税，在软帽下仍算合规
                message: `Warning: Exceeded Luxury Tax Threshold by ${totalPlayerSalaries - luxuryTaxThreshold}. Estimated Luxury Tax: ${tax.toFixed(2)}`,
            };
        }

        if (totalPlayerSalaries > salaryCap) {
            // 软帽机制允许通过特定例外（如鸟权、中产特例）超过薪资帽，但不能超过奢侈税线太多
            // 在此简化模型中，我们假设超过薪资帽但在税线以下是合规的（通过特例），
            // 除非是硬帽（如使用了双年特例或交易特例）。
            // 游戏机制需要更复杂的特例追踪。
            return {
                compliant: true, 
                message: `Note: Exceeded Salary Cap by ${totalPlayerSalaries - salaryCap}. Operating under soft cap exceptions.`,
            };
        }

        return { compliant: true, message: "Compliant with Salary Cap." };
    }

    // -------------------------------------------------------------------------
    // 赛季结算和报告
    // -------------------------------------------------------------------------

    /**
     * 计算赛季总收入
     */
    public getTotalRevenue(): number {
        return Object.values(this.seasonRevenue).reduce((sum, amount) => sum + amount, 0);
    }

    /**
     * 计算赛季总支出
     */
    public getTotalExpenses(): number {
        return Object.values(this.seasonExpenses).reduce((sum, amount) => sum + amount, 0);
    }

    /**
     * 赛季结算：更新最终预算，计算盈亏
     * 
     * @param finalPlayerSalaries 赛季末最终总薪水
     * @param isPlayoffTeam 球队是否进入季后赛
     * @returns 赛季财务报告
     */
    public seasonEndSettlement(finalPlayerSalaries: number, isPlayoffTeam: boolean): { profitLoss: number, finalBudget: number, luxuryTaxPaid: number } {
        // 1. 确认最终薪水支出
        this.seasonExpenses.playerSalaries = finalPlayerSalaries;

        // 2. 计算并记录奢侈税
        const taxAmount = this.calculateLuxuryTax(finalPlayerSalaries);
        this.seasonExpenses.luxuryTax = taxAmount;
        this.currentBudget -= taxAmount; // 扣除奢侈税

        // 3. 季后赛收入（如果适用）
        if (isPlayoffTeam) {
            // 假设季后赛收入与球队表现相关，这里使用一个简化值
            const playoffBonus = 10_000_000; 
            this.addRevenue('playoffRevenue', playoffBonus);
        }

        // 4. 计算盈亏
        const totalRevenue = this.getTotalRevenue();
        const totalExpenses = this.getTotalExpenses();
        const profitLoss = totalRevenue - totalExpenses;

        // 5. 最终预算已在过程中实时更新

        console.log(`Season Settlement Complete. Profit/Loss: ${profitLoss.toFixed(2)}`);

        // 重置下赛季数据
        this.resetSeasonFinancials();

        return {
            profitLoss,
            finalBudget: this.currentBudget,
            luxuryTaxPaid: taxAmount,
        };
    }
}

// -----------------------------------------------------------------------------
// 示例用法（用于测试和说明）
// -----------------------------------------------------------------------------

/*
// 示例配置 (Simplified NBA-like values in millions)
const NBA_CONFIG: FinanceConfig = {
    salaryCap: 141_000_000,           // 软帽线
    luxuryTaxThreshold: 171_000_000,  // 奢侈税线
    luxuryTaxRate: 1.5,               // 简化税率 150%
    revenueShareRate: 0.5,
    baseOperatingCost: 50_000_000,    // 50M 基础运营成本
};

const initialCash = 200_000_000; // 初始现金 200M

const finance = new FinanceSystem(initialCash, NBA_CONFIG);

// 模拟赛季收入
finance.addRevenue('ticketSales', 80_000_000);
finance.addRevenue('sponsorships', 40_000_000);
finance.addRevenue('leagueShare', 30_000_000);

// 模拟球员薪水 (总薪水 180M)
const totalSalaries = 180_000_000; 

// 检查薪资帽合规性
const capCheck = finance.checkSalaryCapCompliance(totalSalaries);
console.log(capCheck.message); // 应提示超过奢侈税线

// 模拟交易支出
finance.recordExpense('tradeExpenses', 5_000_000);

// 赛季结算
const settlement = finance.seasonEndSettlement(totalSalaries, true);
console.log(`\n--- Season Report ---`);
console.log(`Profit/Loss: ${(settlement.profitLoss / 1_000_000).toFixed(2)} M`);
console.log(`Luxury Tax Paid: ${(settlement.luxuryTaxPaid / 1_000_000).toFixed(2)} M`);
console.log(`Final Budget: ${(settlement.finalBudget / 1_000_000).toFixed(2)} M`);
*/