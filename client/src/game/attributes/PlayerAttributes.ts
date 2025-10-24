// client/src/game/attributes/PlayerAttributes.ts

/**
 * 球员属性接口定义
 * 属性值范围：0-100
 */
export interface IPlayerAttributes {
    // 身体属性 (Physical)
    strength: number; // 力量 (影响对抗、篮下终结、抢篮板)
    speed: number;    // 速度 (影响快攻、防守追击)
    stamina: number;  // 耐力 (影响比赛末段属性衰减)
    jumping: number;  // 弹跳 (影响盖帽、抢篮板、扣篮)
    
    // 技术属性 - 进攻 (Offense)
    shooting: number; // 投篮 (中距离和三分命中率)
    dribbling: number; // 控球 (影响运球失误率、突破成功率)
    passing: number;  // 传球 (影响助攻成功率、传球失误率)
    finishing: number; // 终结 (篮下命中率、上篮/扣篮成功率)
    
    // 技术属性 - 防守 (Defense)
    perimeterDefense: number; // 外线防守 (影响抢断、防守脚步、干扰投篮)
    interiorDefense: number;  // 内线防守 (影响盖帽、篮下对抗、卡位)
    rebounding: number;       // 篮板 (影响抢篮板位置和成功率)
    
    // 精神属性 (Mental)
    iq: number;       // 篮球智商 (影响决策、跑位、战术执行)
    clutch: number;   // 关键能力 (影响比赛关键时刻的属性加成/衰减)
}

/**
 * 训练类型枚举
 * 对应真实的篮球训练方法
 */
export enum TrainingType {
    WEIGHT_LIFTING = "力量训练",       // 提升 Strength
    SPRINT_DRILLS = "冲刺跑训练",      // 提升 Speed, Stamina
    PLYOMETRICS = "增强式训练",       // 提升 Jumping, Speed
    
    SHOOTING_PRACTICE = "投篮练习",    // 提升 Shooting, Clutch
    BALL_HANDLING = "控球训练",       // 提升 Dribbling, Passing
    FINISHING_DRILLS = "终结训练",     // 提升 Finishing, Strength
    
    DEFENSIVE_FOOTWORK = "防守脚步训练", // 提升 PerimeterDefense, Speed
    POST_DEFENSE = "内线防守训练",     // 提升 InteriorDefense, Rebounding, Strength
    FILM_STUDY = "录像学习",         // 提升 IQ, Passing
}

/**
 * 球员属性系统核心类
 * 包含属性、成长曲线和训练逻辑
 */
export class PlayerAttributes implements IPlayerAttributes {
    strength: number;
    speed: number;
    stamina: number;
    jumping: number;
    shooting: number;
    dribbling: number;
    passing: number;
    finishing: number;
    perimeterDefense: number;
    interiorDefense: number;
    rebounding: number;
    iq: number;
    clutch: number;
    
    // 球员年龄 (用于成长曲线)
    private _age: number;
    
    constructor(initialAttributes: IPlayerAttributes, initialAge: number = 18) {
        Object.assign(this, initialAttributes);
        this._age = initialAge;
        this.clampAttributes();
    }

    /**
     * 确保所有属性值在 0 到 100 之间
     */
    private clampAttributes(): void {
        const keys = Object.keys(this) as (keyof IPlayerAttributes)[];
        keys.forEach(key => {
            if (typeof this[key] === 'number') {
                this[key] = Math.max(0, Math.min(100, this[key]));
            }
        });
    }

    /**
     * 获取球员年龄
     */
    public get age(): number {
        return this._age;
    }

    /**
     * 模拟球员年龄增长
     * 每年调用一次，影响属性的自然衰减和潜力上限
     */
    public ageUp(): void {
        this._age++;
        // 模拟自然衰减和成长潜力变化
        const decayFactor = this.getDecayFactor(this._age);
        
        // 30岁后开始轻微衰减，主要影响身体属性
        if (this._age >= 30) {
            this.strength *= decayFactor;
            this.speed *= decayFactor;
            this.stamina *= decayFactor;
            this.jumping *= decayFactor;
            // 技术和精神属性衰减较慢
            this.shooting *= (1 - (1 - decayFactor) * 0.5);
            this.dribbling *= (1 - (1 - decayFactor) * 0.5);
            this.passing *= (1 - (1 - decayFactor) * 0.5);
        }
        
        this.clampAttributes();
    }

    /**
     * 科学的成长曲线：根据年龄获取属性衰减/成长潜力因子
     * 18-24岁：快速成长期 (Factor > 1.0)
     * 25-29岁：巅峰期 (Factor ≈ 1.0)
     * 30-34岁：轻微衰退 (Factor < 1.0)
     * 35+岁：快速衰退 (Factor << 1.0)
     * @param age 球员年龄
     * @returns 衰减/成长潜力因子 (0.95 - 1.05)
     */
    private getDecayFactor(age: number): number {
        if (age <= 24) return 1.0; // 成长期，不衰减，训练效果更好
        if (age <= 29) return 1.0; // 巅峰期，不衰减
        if (age <= 34) return 0.995; // 轻微衰减
        if (age <= 37) return 0.985; // 中度衰减
        return 0.97; // 快速衰减
    }
    
    /**
     * 训练方法：根据训练类型提升属性
     * 训练效果受年龄和当前属性值影响（属性越高，训练越难）
     * @param type 训练类型
     * @param intensity 训练强度 (0.0 - 1.0)
     * @param potential 球员潜力 (0.0 - 1.0, 越高训练效果越好)
     */
    public train(type: TrainingType, intensity: number, potential: number): void {
        // 基础增长值，受强度和潜力影响
        let baseGrowth = 0.5 * intensity * (0.5 + potential); 
        
        // 年龄影响：成长期训练效果加倍，衰退期效果减半
        const ageModifier = this._age <= 24 ? 1.5 : (this._age >= 30 ? 0.75 : 1.0);

        // 训练效果公式： 增长 = 基础增长 * 年龄修正 * (1 - 当前属性/100 * 0.8)
        // 属性越高，(1 - 当前属性/100 * 0.8) 越小，增长越慢
        const calculateGrowth = (currentValue: number): number => {
            const difficultyFactor = 1.0 - (currentValue / 100) * 0.8;
            return baseGrowth * ageModifier * difficultyFactor;
        };
        
        switch (type) {
            case TrainingType.WEIGHT_LIFTING:
                this.strength += calculateGrowth(this.strength) * 2.0; // 力量训练效果显著
                this.stamina += calculateGrowth(this.stamina) * 0.5;
                break;
            case TrainingType.SPRINT_DRILLS:
                this.speed += calculateGrowth(this.speed) * 1.5;
                this.stamina += calculateGrowth(this.stamina) * 1.5;
                break;
            case TrainingType.PLYOMETRICS:
                this.jumping += calculateGrowth(this.jumping) * 1.8;
                this.speed += calculateGrowth(this.speed) * 0.8;
                break;
            case TrainingType.SHOOTING_PRACTICE:
                this.shooting += calculateGrowth(this.shooting) * 2.0;
                this.clutch += calculateGrowth(this.clutch) * 0.5;
                break;
            case TrainingType.BALL_HANDLING:
                this.dribbling += calculateGrowth(this.dribbling) * 1.8;
                this.passing += calculateGrowth(this.passing) * 1.0;
                break;
            case TrainingType.FINISHING_DRILLS:
                this.finishing += calculateGrowth(this.finishing) * 2.0;
                this.strength += calculateGrowth(this.strength) * 0.5;
                break;
            case TrainingType.DEFENSIVE_FOOTWORK:
                this.perimeterDefense += calculateGrowth(this.perimeterDefense) * 1.8;
                this.speed += calculateGrowth(this.speed) * 0.5;
                break;
            case TrainingType.POST_DEFENSE:
                this.interiorDefense += calculateGrowth(this.interiorDefense) * 1.8;
                this.rebounding += calculateGrowth(this.rebounding) * 1.0;
                this.strength += calculateGrowth(this.strength) * 0.5;
                break;
            case TrainingType.FILM_STUDY:
                this.iq += calculateGrowth(this.iq) * 2.0;
                this.passing += calculateGrowth(this.passing) * 0.5;
                this.clutch += calculateGrowth(this.clutch) * 0.5;
                break;
            default:
                console.warn(`Unknown training type: ${type}`);
        }
        
        this.clampAttributes();
    }
    
    /**
     * 打印球员属性 (用于调试或展示)
     */
    public displayAttributes(): void {
        console.log(`--- 球员属性 (Age: ${this._age}) ---`);
        console.log(`力量 (Strength): ${this.strength.toFixed(2)}`);
        console.log(`速度 (Speed): ${this.speed.toFixed(2)}`);
        console.log(`耐力 (Stamina): ${this.stamina.toFixed(2)}`);
        console.log(`弹跳 (Jumping): ${this.jumping.toFixed(2)}`);
        console.log(`投篮 (Shooting): ${this.shooting.toFixed(2)}`);
        console.log(`控球 (Dribbling): ${this.dribbling.toFixed(2)}`);
        console.log(`传球 (Passing): ${this.passing.toFixed(2)}`);
        console.log(`终结 (Finishing): ${this.finishing.toFixed(2)}`);
        console.log(`外线防守 (PerimeterDefense): ${this.perimeterDefense.toFixed(2)}`);
        console.log(`内线防守 (InteriorDefense): ${this.interiorDefense.toFixed(2)}`);
        console.log(`篮板 (Rebounding): ${this.rebounding.toFixed(2)}`);
        console.log(`篮球智商 (IQ): ${this.iq.toFixed(2)}`);
        console.log(`关键能力 (Clutch): ${this.clutch.toFixed(2)}`);
    }
}

// 示例用法 (可选，用于测试，实际项目中可能不需要)
/*
const initialStats: IPlayerAttributes = {
    strength: 50, speed: 60, stamina: 70, jumping: 65,
    shooting: 40, dribbling: 55, passing: 60, finishing: 50,
    perimeterDefense: 50, interiorDefense: 40, rebounding: 45,
    iq: 50, clutch: 50
};

const player = new PlayerAttributes(initialStats, 19);
player.displayAttributes();

console.log("\n--- 训练阶段 (19岁, 高潜力 0.8, 高强度 1.0) ---");
const potential = 0.8;
const intensity = 1.0;

player.train(TrainingType.SHOOTING_PRACTICE, intensity, potential);
player.train(TrainingType.WEIGHT_LIFTING, intensity, potential);
player.displayAttributes();

console.log("\n--- 年龄增长到 32岁 ---");
for (let i = 0; i < 13; i++) {
    player.ageUp();
}
player.displayAttributes();

console.log("\n--- 衰退期训练 (32岁, 低潜力 0.3, 低强度 0.5) ---");
player.train(TrainingType.SHOOTING_PRACTICE, 0.5, 0.3);
player.train(TrainingType.SPRINT_DRILLS, 0.5, 0.3);
player.displayAttributes();
*/