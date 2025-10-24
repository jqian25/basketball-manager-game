// client/src/game/positions/PositionSystem.ts

/**
 * 核心属性枚举
 * 定义球员能力值的基本维度
 */
export enum Attribute {
    // 进攻属性
    Shooting = "投篮",       // 影响投篮命中率和射程
    Passing = "传球",        // 影响助攻率、传球失误率和组织能力
    Dribbling = "控球",      // 影响持球推进速度、突破成功率和被抢断率
    Finishing = "终结",      // 影响篮下得分成功率（上篮/扣篮）

    // 防守属性
    PerimeterDefense = "外线防守", // 影响防守外线球员时的抢断、盖帽和限制得分
    InteriorDefense = "内线防守",  // 影响防守内线球员时的盖帽、干扰和限制得分
    Rebounding = "篮板",      // 影响抢夺进攻和防守篮板的能力

    // 身体属性
    Speed = "速度",          // 影响跑动速度和快攻能力
    Strength = "力量",        // 影响对抗、卡位和内线终结
    Stamina = "体力",        // 影响比赛中的持续表现和受伤风险
    Vertical = "弹跳",        // 影响盖帽、篮板和扣篮
}

/**
 * 篮球位置枚举
 */
export enum Position {
    PG = "控球后卫 (PG)",
    SG = "得分后卫 (SG)",
    SF = "小前锋 (SF)",
    PF = "大前锋 (PF)",
    C = "中锋 (C)",
}

/**
 * 训练方法枚举
 * 模拟真实的篮球训练项目，每个项目侧重于提升不同的属性
 */
export enum TrainingMethod {
    BallHandlingDrills = "控球技巧训练", // Dribbling, Passing, Speed
    ShootingPractice = "投篮专项训练",  // Shooting, Stamina
    PostMoves = "内线脚步训练",      // Finishing, InteriorDefense, Strength
    PerimeterDefenseDrills = "外线防守跑位", // PerimeterDefense, Speed, Stamina
    StrengthAndConditioning = "力量与体能训练", // Strength, Stamina, Vertical
    ReboundingBoxOut = "篮板卡位训练",  // Rebounding, Strength, Vertical
    PlaymakingSimulation = "组织战术演练", // Passing, Dribbling, Shooting
}

/**
 * 位置定义接口
 * 定义每个位置的名称、核心属性和推荐训练方法
 */
export interface PositionDefinition {
    name: Position;
    coreAttributes: Attribute[]; // 核心属性，成长速度更快
    recommendedTraining: TrainingMethod[]; // 推荐训练，效率更高
    baseAttributeDistribution: { [key in Attribute]?: number }; // 基础属性分布 (0-100)
}

/**
 * 球员成长曲线接口
 * 定义球员在不同阶段的成长速度乘数
 */
export interface GrowthCurve {
    [level: number]: number; // 级别到成长乘数的映射
}

/**
 * 属性成长权重接口
 * 定义训练方法对属性提升的权重
 */
export interface TrainingWeight {
    [key in Attribute]?: number;
}

/**
 * 训练方法效果映射
 * 真实篮球训练方法与属性提升的科学映射
 */
const TrainingEffects: { [key in TrainingMethod]: TrainingWeight } = {
    [TrainingMethod.BallHandlingDrills]: {
        [Attribute.Dribbling]: 1.5,
        [Attribute.Passing]: 1.0,
        [Attribute.Speed]: 0.5,
    },
    [TrainingMethod.ShootingPractice]: {
        [Attribute.Shooting]: 1.8,
        [Attribute.Stamina]: 0.2, // 投篮需要体力支撑
    },
    [TrainingMethod.PostMoves]: {
        [Attribute.Finishing]: 1.2,
        [Attribute.InteriorDefense]: 0.8,
        [Attribute.Strength]: 0.5,
    },
    [TrainingMethod.PerimeterDefenseDrills]: {
        [Attribute.PerimeterDefense]: 1.5,
        [Attribute.Speed]: 0.7,
        [Attribute.Stamina]: 0.3,
    },
    [TrainingMethod.StrengthAndConditioning]: {
        [Attribute.Strength]: 1.5,
        [Attribute.Stamina]: 1.2,
        [Attribute.Vertical]: 0.8,
    },
    [TrainingMethod.ReboundingBoxOut]: {
        [Attribute.Rebounding]: 1.5,
        [Attribute.Strength]: 0.5,
        [Attribute.Vertical]: 0.5,
    },
    [TrainingMethod.PlaymakingSimulation]: {
        [Attribute.Passing]: 1.5,
        [Attribute.Dribbling]: 0.5,
        [Attribute.Shooting]: 0.3, // 模拟实战，提升投篮选择
    },
};

/**
 * 球员成长曲线
 * 模拟运动员的职业生涯成长：早期快速成长，巅峰期平稳，后期缓慢衰退
 * 假设1-10级为新秀期/快速成长期，11-20级为巅峰期，21+为衰退期
 */
const PlayerGrowthCurve: GrowthCurve = {
    1: 1.5, 2: 1.8, 3: 2.0, 4: 2.2, 5: 2.5, // 快速成长
    6: 2.2, 7: 2.0, 8: 1.8, 9: 1.5, 10: 1.2, // 成长放缓
    11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0, // 巅峰平稳
    16: 0.9, 17: 0.8, 18: 0.7, 19: 0.6, 20: 0.5, // 缓慢衰退
    21: 0.3, 22: 0.2, 23: 0.1, // 严重衰退
};

/**
 * 篮球位置系统
 * 包含了所有位置的定义和成长逻辑
 */
export class PositionSystem {
    private positionDefinitions: { [key in Position]: PositionDefinition };

    constructor() {
        this.positionDefinitions = {
            [Position.PG]: {
                name: Position.PG,
                coreAttributes: [Attribute.Passing, Attribute.Dribbling, Attribute.Speed, Attribute.PerimeterDefense],
                recommendedTraining: [TrainingMethod.BallHandlingDrills, TrainingMethod.PlaymakingSimulation, TrainingMethod.PerimeterDefenseDrills],
                baseAttributeDistribution: {
                    [Attribute.Passing]: 85, [Attribute.Dribbling]: 90, [Attribute.Speed]: 80, [Attribute.PerimeterDefense]: 75,
                    [Attribute.Shooting]: 70, [Attribute.Finishing]: 60, [Attribute.InteriorDefense]: 40, [Attribute.Rebounding]: 30,
                    [Attribute.Strength]: 50, [Attribute.Stamina]: 85, [Attribute.Vertical]: 65,
                }
            },
            [Position.SG]: {
                name: Position.SG,
                coreAttributes: [Attribute.Shooting, Attribute.Dribbling, Attribute.Finishing, Attribute.Stamina],
                recommendedTraining: [TrainingMethod.ShootingPractice, TrainingMethod.BallHandlingDrills, TrainingMethod.StrengthAndConditioning],
                baseAttributeDistribution: {
                    [Attribute.Shooting]: 90, [Attribute.Dribbling]: 80, [Attribute.Finishing]: 75, [Attribute.Stamina]: 80,
                    [Attribute.Passing]: 65, [Attribute.PerimeterDefense]: 70, [Attribute.InteriorDefense]: 35, [Attribute.Rebounding]: 40,
                    [Attribute.Speed]: 75, [Attribute.Strength]: 60, [Attribute.Vertical]: 70,
                }
            },
            [Position.SF]: {
                name: Position.SF,
                coreAttributes: [Attribute.Shooting, Attribute.Finishing, Attribute.PerimeterDefense, Attribute.Vertical],
                recommendedTraining: [TrainingMethod.ShootingPractice, TrainingMethod.StrengthAndConditioning, TrainingMethod.PerimeterDefenseDrills],
                baseAttributeDistribution: {
                    [Attribute.Shooting]: 85, [Attribute.Finishing]: 85, [Attribute.PerimeterDefense]: 80, [Attribute.Vertical]: 85,
                    [Attribute.Passing]: 70, [Attribute.Dribbling]: 70, [Attribute.InteriorDefense]: 55, [Attribute.Rebounding]: 60,
                    [Attribute.Speed]: 80, [Attribute.Strength]: 70, [Attribute.Stamina]: 85,
                }
            },
            [Position.PF]: {
                name: Position.PF,
                coreAttributes: [Attribute.Rebounding, Attribute.InteriorDefense, Attribute.Strength, Attribute.Finishing],
                recommendedTraining: [TrainingMethod.ReboundingBoxOut, TrainingMethod.PostMoves, TrainingMethod.StrengthAndConditioning],
                baseAttributeDistribution: {
                    [Attribute.Rebounding]: 85, [Attribute.InteriorDefense]: 80, [Attribute.Strength]: 90, [Attribute.Finishing]: 80,
                    [Attribute.Shooting]: 60, [Attribute.Passing]: 55, [Attribute.Dribbling]: 40, [Attribute.PerimeterDefense]: 65,
                    [Attribute.Speed]: 60, [Attribute.Stamina]: 75, [Attribute.Vertical]: 75,
                }
            },
            [Position.C]: {
                name: Position.C,
                coreAttributes: [Attribute.InteriorDefense, Attribute.Rebounding, Attribute.Strength, Attribute.Vertical],
                recommendedTraining: [TrainingMethod.ReboundingBoxOut, TrainingMethod.PostMoves, TrainingMethod.StrengthAndConditioning],
                baseAttributeDistribution: {
                    [Attribute.InteriorDefense]: 90, [Attribute.Rebounding]: 95, [Attribute.Strength]: 95, [Attribute.Vertical]: 80,
                    [Attribute.Shooting]: 50, [Attribute.Passing]: 50, [Attribute.Dribbling]: 30, [Attribute.PerimeterDefense]: 50,
                    [Attribute.Speed]: 50, [Attribute.Stamina]: 70, [Attribute.Finishing]: 75,
                }
            },
        };
    }

    /**
     * 获取所有位置的定义
     */
    public getAllPositions(): { [key in Position]: PositionDefinition } {
        return this.positionDefinitions;
    }

    /**
     * 获取特定位置的定义
     * @param position 篮球位置
     */
    public getPositionDefinition(position: Position): PositionDefinition {
        return this.positionDefinitions[position];
    }

    /**
     * 计算训练效果
     * @param position 球员位置
     * @param currentLevel 球员当前等级 (影响成长曲线)
     * @param trainingMethod 采用的训练方法
     * @param baseGain 基础属性增益值 (例如：每次训练的基础点数)
     * @returns 属性增益对象
     */
    public calculateTrainingGain(position: Position, currentLevel: number, trainingMethod: TrainingMethod, baseGain: number = 1.0): { [key in Attribute]?: number } {
        const definition = this.getPositionDefinition(position);
        const growthMultiplier = PlayerGrowthCurve[Math.min(currentLevel, 23)] || 0.1; // 超出23级使用最低乘数
        const trainingWeights = TrainingEffects[trainingMethod];
        const gain: { [key in Attribute]?: number } = {};

        for (const attr of Object.values(Attribute)) {
            let totalMultiplier = 1.0;

            // 1. 训练方法权重 (真实训练方法)
            const trainingWeight = trainingWeights[attr] || 0;
            totalMultiplier *= trainingWeight;

            // 2. 位置核心属性加成 (科学成长曲线)
            if (definition.coreAttributes.includes(attr)) {
                totalMultiplier *= 1.5; // 核心属性额外成长加速
            }

            // 3. 推荐训练加成 (真实训练方法)
            if (definition.recommendedTraining.includes(trainingMethod)) {
                totalMultiplier *= 1.2; // 推荐训练方法效率提升
            }

            // 4. 职业生涯成长曲线
            totalMultiplier *= growthMultiplier;

            if (totalMultiplier > 0) {
                gain[attr] = baseGain * totalMultiplier;
            }
        }

        return gain;
    }

    /**
     * 获取球员的初始属性
     * @param position 球员位置
     * @returns 初始属性对象
     */
    public getInitialAttributes(position: Position): { [key in Attribute]: number } {
        const definition = this.getPositionDefinition(position);
        const initialAttributes: { [key in Attribute]: number } = {} as any;

        // 默认所有属性最低为30
        for (const attr of Object.values(Attribute)) {
            initialAttributes[attr] = 30;
        }

        // 应用位置基础分布
        for (const attr in definition.baseAttributeDistribution) {
            if (definition.baseAttributeDistribution.hasOwnProperty(attr)) {
                const key = attr as Attribute;
                initialAttributes[key] = definition.baseAttributeDistribution[key]!;
            }
        }

        return initialAttributes;
    }
}

// 示例用法:
// const positionSystem = new PositionSystem();
// const pgDefinition = positionSystem.getPositionDefinition(Position.PG);
// console.log("PG核心属性:", pgDefinition.coreAttributes);

// // 模拟一个5级PG进行控球技巧训练
// const pgLevel = 5;
// const pgTrainingGain = positionSystem.calculateTrainingGain(Position.PG, pgLevel, TrainingMethod.BallHandlingDrills);
// console.log(`5级PG进行 ${TrainingMethod.BallHandlingDrills} 的属性增益:`, pgTrainingGain);

// // 模拟一个20级C进行内线脚步训练
// const cLevel = 20;
// const cTrainingGain = positionSystem.calculateTrainingGain(Position.C, cLevel, TrainingMethod.PostMoves);
// console.log(`20级C进行 ${TrainingMethod.PostMoves} 的属性增益:`, cTrainingGain);
