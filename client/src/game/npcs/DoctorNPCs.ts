// client/src/game/npcs/DoctorNPCs.ts

/**
 * NPC外观枚举
 */
export enum Appearance {
    /** 运动夹克, 听诊器, 篮球鞋 */
    SportJacketAndStethoscope = "运动夹克, 听诊器, 篮球鞋",
    /** 队医制服, 冰敷袋, 运动手表 */
    TeamDoctorUniformAndIcePack = "队医制服, 冰敷袋, 运动手表",
    /** 休闲西装, 护目镜, 战术板 */
    CasualSuitAndGogglesAndTacticalBoard = "休闲西装, 护目镜, 战术板",
    /** 物理治疗师T恤, 运动绷带, 瑜伽垫 */
    PTTShirtAndBandagesAndYogaMat = "物理治疗师T恤, 运动绷带, 瑜伽垫",
    /** 运动背心, 护膝, 能量饮料 */
    JerseyAndKneePadsAndEnergyDrink = "运动背心, 护膝, 能量饮料",
    /** 训练师马甲, 秒表, 哨子 */
    TrainerVestAndStopwatchAndWhistle = "训练师马甲, 秒表, 哨子",
    /** 斯文白大褂, 篮球杂志, 眼镜 */
    WhiteCoatAndBasketballMagazineAndGlasses = "斯文白大褂, 篮球杂志, 眼镜",
    /** 队服外套, 医疗箱, 蓝牙耳机 */
    TeamJacketAndMedicalKitAndBluetoothHeadset = "队服外套, 医疗箱, 蓝牙耳机",
}

/**
 * NPC性格枚举
 */
export enum Personality {
    /** 严谨专业, 数据至上 */
    StrictAndDataDriven = "严谨专业, 数据至上",
    /** 热情洋溢, 鼓舞人心 */
    PassionateAndInspiring = "热情洋溢, 鼓舞人心",
    /** 沉稳冷静, 经验丰富 */
    CalmAndExperienced = "沉稳冷静, 经验丰富",
    /** 幽默风趣, 善于心理疏导 */
    HumorousAndGoodAtCounseling = "幽默风趣, 善于心理疏导",
    /** 充满活力, 行动派 */
    EnergeticAndActionOriented = "充满活力, 行动派",
    /** 传统保守, 注重基础训练 */
    TraditionalAndFocusOnBasics = "传统保守, 注重基础训练",
    /** 科学怪人, 热衷于实验性疗法 */
    MadScientistAndExperimentalTherapies = "科学怪人, 热衷于实验性疗法",
    /** 哲学思考, 将伤病视为挑战 */
    PhilosophicalAndViewsInjuriesAsChallenges = "哲学思考, 将伤病视为挑战",
}

/**
 * NPC行为模式枚举
 */
export enum BehaviorPattern {
    /** 巡视训练场, 观察球员动作 */
    PatrolTrainingGroundsAndObservePlayers = "巡视训练场, 观察球员动作",
    /** 待在医疗室, 等待受伤球员 */
    StayInMedicalRoomAndWait = "待在医疗室, 等待受伤球员",
    /** 场边待命, 随时准备冲入场内 */
    StandByCourtsideAndReadyToRushIn = "场边待命, 随时准备冲入场内",
    /** 在力量房指导康复训练 */
    GuideRehabInWeightRoom = "在力量房指导康复训练",
    /** 与教练组讨论球员健康报告 */
    DiscussHealthReportWithCoaches = "与教练组讨论球员健康报告",
    /** 独自研究最新的运动医学论文 */
    ResearchLatestSportsMedicinePapers = "独自研究最新的运动医学论文",
    /** 在更衣室为球员提供心理支持 */
    ProvidePsychologicalSupportInLockerRoom = "在更衣室为球员提供心理支持",
    /** 进行预防性拉伸和按摩指导 */
    ConductPreventiveStretchingAndMassage = "进行预防性拉伸和按摩指导",
}

/**
 * 医生NPC数据结构接口
 */
export interface DoctorNPC {
    /** NPC的唯一名称 */
    name: string;
    /** NPC的外观描述或枚举值 */
    appearance: Appearance;
    /** NPC的性格描述或枚举值 */
    personality: Personality;
    /** NPC的典型对话 */
    dialogue: string;
    /** NPC的行为模式或枚举值 */
    behaviorPattern: BehaviorPattern;
}

/**
 * 医生NPC数据库
 */
export const DoctorNPCs: DoctorNPC[] = [
    {
        name: "迈克尔·康复师 (Michael 'The Mender' Kang)",
        appearance: Appearance.PTTShirtAndBandagesAndYogaMat,
        personality: Personality.EnergeticAndActionOriented,
        dialogue: "别担心，这只是个小扭伤！记住，康复训练就像罚球，重复、重复、再重复！",
        behaviorPattern: BehaviorPattern.GuideRehabInWeightRoom,
    },
    {
        name: "莎拉·数据 (Sarah 'The Stat' Doctor)",
        appearance: Appearance.WhiteCoatAndBasketballMagazineAndGlasses,
        personality: Personality.StrictAndDataDriven,
        dialogue: "根据我的生物力学分析，你投篮时膝盖的微小角度偏差，是导致你疲劳性骨折风险增加0.5%的原因。",
        behaviorPattern: BehaviorPattern.ResearchLatestSportsMedicinePapers,
    },
    {
        name: "老杰克 (Old Jack 'The Zen' Trainer)",
        appearance: Appearance.TrainerVestAndStopwatchAndWhistle,
        personality: Personality.CalmAndExperienced,
        dialogue: "孩子，伤病是比赛的一部分。深呼吸，找到你的节奏。身体的恢复，和比赛一样，需要耐心和智慧。",
        behaviorPattern: BehaviorPattern.ConductPreventiveStretchingAndMassage,
    },
    {
        name: "阿伦·激情 (Allen 'The Adrenaline' Smith)",
        appearance: Appearance.SportJacketAndStethoscope,
        personality: Personality.PassionateAndInspiring,
        dialogue: "起来！你比这更强！想想总决赛的最后一秒！我们现在就开始治疗，你很快就能重返赛场，去赢得那该死的冠军！",
        behaviorPattern: BehaviorPattern.StandByCourtsideAndReadyToRushIn,
    },
    {
        name: "艾娃·心理 (Ava 'The Anchor' Psychologist)",
        appearance: Appearance.CasualSuitAndGogglesAndTacticalBoard,
        personality: Personality.HumorousAndGoodAtCounseling,
        dialogue: "你不是受伤了，你只是在进行一次'战术暂停'。现在，告诉我，你对下一场比赛有什么'心理防守'策略？",
        behaviorPattern: BehaviorPattern.ProvidePsychologicalSupportInLockerRoom,
    },
    {
        name: "科比·传统 (Kobe 'The Classic' Physio)",
        appearance: Appearance.TeamDoctorUniformAndIcePack,
        personality: Personality.TraditionalAndFocusOnBasics,
        dialogue: "现代花哨的疗法？哼。冰敷、休息、抬高。这是篮球场上永恒的三角进攻，永远有效。",
        behaviorPattern: BehaviorPattern.StayInMedicalRoomAndWait,
    },
    {
        name: "弗兰肯斯坦博士 (Dr. 'Franken' Stein)",
        appearance: Appearance.TeamJacketAndMedicalKitAndBluetoothHeadset,
        personality: Personality.MadScientistAndExperimentalTherapies,
        dialogue: "别紧张，这台'超声波加速恢复仪'还处于Beta测试阶段。但相信我，它能让你三天内跑得比博尔特快！",
        behaviorPattern: BehaviorPattern.PatrolTrainingGroundsAndObservePlayers,
    },
    {
        name: "禅师·医生 (Dr. 'Zen Master' Phil)",
        appearance: Appearance.JerseyAndKneePadsAndEnergyDrink,
        personality: Personality.PhilosophicalAndViewsInjuriesAsChallenges,
        dialogue: "每一次伤病都是对你心性的考验。它让你停下来，思考你与篮球的关系。当你回归时，你将是一个更完整的球员。",
        behaviorPattern: BehaviorPattern.DiscussHealthReportWithCoaches,
    },
];