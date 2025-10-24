/**
 * client/src/game/systems/GrowthSystem.ts
 * 
 * 球员成长系统 (经验值和等级)
 * 
 * 特点:
 * 1. Game Boy风格: 采用简单的线性/二次曲线计算升级所需经验值，模拟早期RPG的成长曲线。
 * 2. 易于集成: 独立类设计，通过事件或回调机制通知外部状态变化。
 * 3. 详细注释: 解释每个方法和属性的用途。
 */

// 定义一个简单的事件发射器接口，方便集成到Phaser或其他框架的事件系统
// 在实际项目中，可以替换为Phaser.Events.EventEmitter或类似实现
interface IEventEmitter {
    on(event: string, fn: Function, context?: any): this;
    emit(event: string, ...args: any[]): boolean;
}

// 假设的玩家属性接口，方便展示系统可以影响哪些数据
interface IPlayerStats {
    maxHP: number;
    attack: number;
    defense: number;
    speed: number;
}

export class GrowthSystem {
    // 当前等级，初始为1
    private _level: number;
    
    // 当前经验值
    private _currentXP: number;
    
    // 升级到下一级所需的总经验值
    private _xpToNextLevel: number;

    // 外部事件发射器，用于通知升级等事件
    private _eventEmitter: IEventEmitter;

    // 玩家的统计数据引用 (可选，用于在升级时更新属性)
    private _stats?: IPlayerStats;

    // 构造函数
    // @param eventEmitter 游戏或场景的事件发射器，用于通知外部状态变化
    // @param initialLevel 初始等级 (默认为1)
    // @param stats 玩家属性的引用 (可选)
    constructor(eventEmitter: IEventEmitter, initialLevel: number = 1, stats?: IPlayerStats) {
        this._eventEmitter = eventEmitter;
        this._level = initialLevel;
        this._currentXP = 0;
        this._stats = stats;
        // 计算初始等级到下一级所需的经验值
        this._xpToNextLevel = this.calculateXPForLevel(this._level + 1);
        
        console.log(`GrowthSystem initialized. Level: ${this._level}, XP to next: ${this._xpToNextLevel}`);
    }

    /**
     * Game Boy风格的经验值计算公式。
     * 采用二次曲线: XP = C * (L^2) + K * L
     * 这种曲线在低级时升级快，高级时升级慢，符合经典RPG的体验。
     * 
     * @param level 目标等级
     * @returns 达到该目标等级所需的总经验值
     */
    private calculateXPForLevel(level: number): number {
        // L = level
        // 假设常数 C=50, K=100 (这些值可以调整以改变难度曲线)
        const C = 50;
        const K = 100;
        
        // 目标等级为1时，所需总经验值为0
        if (level <= 1) {
            return 0;
        }

        // 达到目标等级L所需的总经验值
        // 简化为：达到L级所需的总经验值 = 50 * (L-1)^2 + 100 * (L-1)
        // 这样L=2时，XP = 50*1 + 100*1 = 150
        // L=3时，XP = 50*4 + 100*2 = 400 (从2级到3级需要 400-150 = 250 XP)
        const L_minus_1 = level - 1;
        return C * L_minus_1 * L_minus_1 + K * L_minus_1;
    }

    /**
     * 获取当前等级
     */
    public get level(): number {
        return this._level;
    }

    /**
     * 获取当前经验值
     */
    public get currentXP(): number {
        return this._currentXP;
    }

    /**
     * 获取升级到下一级所需的总经验值
     */
    public get xpToNextLevel(): number {
        return this._xpToNextLevel;
    }

    /**
     * 获取距离下一级还差多少经验值
     */
    public get remainingXPToLevelUp(): number {
        const xpRequiredForCurrentLevel = this.calculateXPForLevel(this._level);
        return this._xpToNextLevel - (this._currentXP - xpRequiredForCurrentLevel);
    }

    /**
     * 添加经验值，并检查是否升级
     * 
     * @param amount 要添加的经验值数量
     */
    public addXP(amount: number): void {
        if (amount <= 0) {
            return;
        }

        this._currentXP += amount;
        this._eventEmitter.emit('xp-gained', amount, this._currentXP, this._xpToNextLevel);

        // 循环检查是否连续升级 (例如一次获得大量经验)
        while (this._currentXP >= this._xpToNextLevel) {
            this.levelUp();
        }
    }

    /**
     * 执行升级操作
     */
    private levelUp(): void {
        this._level++;
        
        // 打印升级信息 (Game Boy风格的简单提示)
        console.log(`LEVEL UP! ${this._level - 1} -> ${this._level}`);

        // 1. 更新下一级所需的经验值
        this._xpToNextLevel = this.calculateXPForLevel(this._level + 1);

        // 2. 更新玩家属性 (如果提供了stats引用)
        this.updateStatsOnLevelUp();

        // 3. 发射升级事件
        this._eventEmitter.emit('level-up', this._level, this._currentXP, this._xpToNextLevel);
    }

    /**
     * 升级时更新玩家属性 (Game Boy风格的简单属性增长)
     */
    private updateStatsOnLevelUp(): void {
        if (!this._stats) {
            return;
        }

        // 简单的线性增长，模拟每次升级属性随机或固定增加
        // 实际项目中会更复杂，例如基于职业或种族
        this._stats.maxHP += 10;
        this._stats.attack += 3;
        this._stats.defense += 2;
        this._stats.speed += 1;

        console.log(`Stats updated: HP+10, ATK+3, DEF+2, SPD+1`);
        this._eventEmitter.emit('stats-updated', this._stats);
    }

    /**
     * 获取当前等级到下一级所需的经验值
     * 
     * @returns 当前等级到下一级所需的经验值差
     */
    public getXpRequiredForNextLevel(): number {
        const xpRequiredForCurrentLevel = this.calculateXPForLevel(this._level);
        const xpRequiredForNextLevel = this.calculateXPForLevel(this._level + 1);
        return xpRequiredForNextLevel - xpRequiredForCurrentLevel;
    }

    /**
     * 获取当前系统状态的摘要
     */
    public getStatus(): { level: number, currentXP: number, xpToNextLevel: number, remainingXP: number } {
        return {
            level: this._level,
            currentXP: this._currentXP,
            xpToNextLevel: this._xpToNextLevel,
            remainingXP: this.remainingXPToLevelUp
        };
    }

    // --- 示例用法 (方便集成测试) ---
    // 假设在Phaser场景中，你可以这样初始化和使用：
    /*
    // 假设这是一个Phaser场景的create方法
    create() {
        // 1. 创建一个事件发射器 (Phaser自带)
        const eventEmitter = new Phaser.Events.EventEmitter();

        // 2. 定义玩家属性
        const playerStats: IPlayerStats = { maxHP: 100, attack: 10, defense: 5, speed: 5 };

        // 3. 实例化成长系统
        const growthSystem = new GrowthSystem(eventEmitter, 1, playerStats);

        // 4. 监听升级事件
        eventEmitter.on('level-up', (newLevel: number, currentXP: number) => {
            console.log(`Player has leveled up to ${newLevel}! New Stats:`, playerStats);
            // 在这里更新UI，播放音效等
        });

        eventEmitter.on('xp-gained', (amount: number, currentXP: number, xpToNextLevel: number) => {
            console.log(`Gained ${amount} XP. Total: ${currentXP}/${xpToNextLevel}`);
            // 在这里更新XP条UI
        });

        // 5. 模拟获得经验
        // growthSystem.addXP(100); // 获得100 XP
        // growthSystem.addXP(50);  // 再次获得50 XP，总共150，达到2级
        // growthSystem.addXP(300); // 获得300 XP，总共450，达到3级 (需要400)
    }
    */
}

// 导出接口，方便其他模块使用
export { IEventEmitter, IPlayerStats };