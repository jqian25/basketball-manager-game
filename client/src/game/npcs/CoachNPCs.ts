// client/src/game/npcs/CoachNPCs.ts

/**
 * 教练NPC的教学风格
 */
export enum TeachingStyle {
    TacticalMaster = "战术大师", // 强调战术和策略
    Motivator = "激励型", // 强调精神和斗志
    Fundamentals = "基本功派", // 强调基础训练
    DataDriven = "数据分析型", // 强调数据和效率
    OldSchool = "老派硬核", // 强调纪律和体能
    ModernFlow = "现代流动型", // 强调空间和快速转换
}

/**
 * 教练NPC的行为模式
 */
export enum BehaviorPattern {
    PacingSideline = "沿边线踱步",
    YellingInstructions = "大声喊叫指令",
    CalmObservation = "冷静观察记录",
    DemonstratingDrills = "亲自示范训练",
    TalkingToRefs = "与裁判交流",
    SittingQuietly = "安静地坐着",
}

/**
 * 教练NPC的数据结构
 */
export interface CoachNPC {
    id: string; // 唯一标识符
    name: string; // 名称
    appearance: string; // 外观描述
    personality: string; // 性格描述
    teachingStyle: TeachingStyle; // 教学风格
    dialogue: {
        greeting: string; // 打招呼
        advice: string; // 核心建议
        victory: string; // 胜利台词
        defeat: string; // 失败台词
    };
    behaviorPattern: BehaviorPattern; // 场边行为模式
    specialty: string; // 专长领域 (e.g., 防守, 投篮, 控球)
}

/**
 * 15位教练NPC的数据库
 */
export const CoachNPCs: CoachNPC[] = [
    {
        id: "coach_1",
        name: "李指导 (Li Zhidao)",
        appearance: "身穿灰色运动服，戴着一副金丝眼镜，头发梳得一丝不苟。",
        personality: "冷静、严谨、一丝不苟，注重细节和执行力。",
        teachingStyle: TeachingStyle.TacticalMaster,
        dialogue: {
            greeting: "欢迎。篮球是五个人的运动，战术板上的每一个点都至关重要。",
            advice: "跑位要精确到厘米，传球要精确到毫秒。执行力决定一切。",
            victory: "战术的胜利。但不要骄傲，还有下一场比赛。",
            defeat: "我们输在了细节上。回去看录像，一个错误都不会放过。",
        },
        behaviorPattern: BehaviorPattern.CalmObservation,
        specialty: "半场阵地进攻战术",
    },
    {
        id: "coach_2",
        name: "老黑 (Lao Hei)",
        appearance: "身材魁梧，声音洪亮，总是穿着一件印有队徽的黑色T恤。",
        personality: "热情、火爆、充满激情，是更衣室的精神领袖。",
        teachingStyle: TeachingStyle.Motivator,
        dialogue: {
            greeting: "嘿！你看起来像个战士！准备好为胜利燃烧了吗？",
            advice: "别想太多！用你的心去打球！跑起来！跳起来！把球砸进去！",
            victory: "吼！这就是我们！激情和汗水铸就的胜利！",
            defeat: "没关系，抬起头！我们只是被绊倒了，下次我们会把地板都掀翻！",
        },
        behaviorPattern: BehaviorPattern.YellingInstructions,
        specialty: "团队凝聚力与精神属性",
    },
    {
        id: "coach_3",
        name: "王师傅 (Master Wang)",
        appearance: "年过六旬，穿着复古的运动鞋，手里总是拿着一个磨损的篮球。",
        personality: "和蔼可亲，但对基本功的要求近乎苛刻。",
        teachingStyle: TeachingStyle.Fundamentals,
        dialogue: {
            greeting: "年轻人，篮球的真谛都在这颗球里。你运球的姿势对吗？",
            advice: "扎实的基本功是你的地基。每天一千次运球，一千次投篮，不能少。",
            victory: "基础打得好，比赛自然赢。继续保持。",
            defeat: "回去练基本功！运球不稳，投篮没形，谈何胜利？",
        },
        behaviorPattern: BehaviorPattern.DemonstratingDrills,
        specialty: "投篮姿势与控球基础",
    },
    {
        id: "coach_4",
        name: "艾米 (Amy)",
        appearance: "年轻时尚，穿着智能运动手表，手持平板电脑，随时记录数据。",
        personality: "理性、客观、数据至上，相信效率和科学训练。",
        teachingStyle: TeachingStyle.DataDriven,
        dialogue: {
            greeting: "你好。我们的目标是提升效率。你的True Shooting Percentage是多少？",
            advice: "不要凭感觉打球。根据数据分析，你的最佳出手区域在左侧45度角。",
            victory: "数据模型预测的胜利。我们只是执行了最优解。",
            defeat: "数据异常。我们需要重新校准模型，找出效率最低的环节。",
        },
        behaviorPattern: BehaviorPattern.CalmObservation,
        specialty: "进攻效率与投篮区域分析",
    },
    {
        id: "coach_5",
        name: "铁血教头 (Iron Blood)",
        appearance: "面容严肃，留着短寸头，穿着军绿色的教练夹克。",
        personality: "铁血、强硬、纪律严明，体能训练是他永恒的主题。",
        teachingStyle: TeachingStyle.OldSchool,
        dialogue: {
            greeting: "站直了！这里是球场，不是游乐园。准备好流汗了吗？",
            advice: "防守！防守赢得总冠军！给我跑起来！体能是天赋的一部分！",
            victory: "赢了。但你们的体能储备还不够，明天早上五点，加练！",
            defeat: "懦夫！你们的意志力太薄弱了！再跑十圈，直到你们学会什么是痛苦！",
        },
        behaviorPattern: BehaviorPattern.PacingSideline,
        specialty: "高强度防守与体能储备",
    },
    {
        id: "coach_6",
        name: "杰森 (Jason)",
        appearance: "穿着休闲西装，发型潮流，喜欢用一些新潮的篮球术语。",
        personality: "灵活、创新、注重空间感和快速攻防转换。",
        teachingStyle: TeachingStyle.ModernFlow,
        dialogue: {
            greeting: "Yo！篮球已经进入新时代，我们需要'Flow'起来！",
            advice: "拉开空间，快速决策，找到最好的'Mismatch'。让球流动起来！",
            victory: "完美！我们的'Small Ball'战术执行得非常流畅！",
            defeat: "节奏被打乱了。我们需要更快的转换和更灵活的轮换。",
        },
        behaviorPattern: BehaviorPattern.PacingSideline,
        specialty: "小球战术与转换进攻",
    },
    {
        id: "coach_7",
        name: "周伯 (Uncle Zhou)",
        appearance: "总是笑眯眯的，穿着一件宽松的Polo衫，看起来像个退休教师。",
        personality: "耐心、慈祥，擅长心理辅导和球员关系维护。",
        teachingStyle: TeachingStyle.Motivator,
        dialogue: {
            greeting: "孩子，别紧张。篮球是快乐的。深呼吸，享受比赛。",
            advice: "相信你的队友，相信你自己。心态比技术更重要。",
            victory: "你们打得很棒，我为你们骄傲。去庆祝一下吧。",
            defeat: "没事的，每个人都会犯错。从错误中学习，下次会更好。",
        },
        behaviorPattern: BehaviorPattern.SittingQuietly,
        specialty: "心理建设与压力管理",
    },
    {
        id: "coach_8",
        name: "影子 (Shadow)",
        appearance: "总是戴着一顶低垂的帽子，沉默寡言，目光锐利。",
        personality: "神秘、内向，但对防守战术有超乎寻常的理解。",
        teachingStyle: TeachingStyle.TacticalMaster,
        dialogue: {
            greeting: "（点头示意）",
            advice: "记住对位球员的习惯。预判，提前站位。防守不是靠跑，是靠脑子。",
            victory: "（记录本上写下'防守到位'）",
            defeat: "（记录本上写下'漏人'，然后默默离开）",
        },
        behaviorPattern: BehaviorPattern.CalmObservation,
        specialty: "单兵防守与协防体系",
    },
    {
        id: "coach_9",
        name: "麦克 (Mike)",
        appearance: "典型的美式教练，穿着马甲，手里拿着咖啡杯，说话语速很快。",
        personality: "务实、高效、注重实战演练。",
        teachingStyle: TeachingStyle.Fundamentals,
        dialogue: {
            greeting: "Time is money, let's get to work! (时间就是金钱，开始训练！)",
            advice: "别浪费时间在花哨的动作上。最简单、最有效的得分方式，才是好球。",
            victory: "Good job. Now, what's the next drill?",
            defeat: "Unacceptable. We need to simplify and execute better.",
        },
        behaviorPattern: BehaviorPattern.YellingInstructions,
        specialty: "篮下终结与罚球训练",
    },
    {
        id: "coach_10",
        name: "苏珊 (Susan)",
        appearance: "知性优雅，穿着整洁的职业装，是球队的营养和体能顾问。",
        personality: "细心、专业、注重运动员的全面健康。",
        teachingStyle: TeachingStyle.DataDriven,
        dialogue: {
            greeting: "欢迎。你的体脂率和睡眠质量达标了吗？",
            advice: "科学的饮食和恢复是训练的一部分。没有健康的身体，谈何竞技状态？",
            victory: "很高兴看到你们的身体指标保持稳定。",
            defeat: "我们来看一下赛前能量摄入和赛后恢复方案，可能存在问题。",
        },
        behaviorPattern: BehaviorPattern.SittingQuietly,
        specialty: "运动营养学与体能恢复",
    },
    {
        id: "coach_11",
        name: "风暴 (Storm)",
        appearance: "一头银发，表情严肃，总是穿着一件带有闪电图案的队服。",
        personality: "脾气暴躁，但对胜利的渴望无人能及，擅长临场变阵。",
        teachingStyle: TeachingStyle.TacticalMaster,
        dialogue: {
            greeting: "别浪费我的时间。告诉我，你有什么能耐？",
            advice: "场上瞬息万变，你需要像风暴一样快速反应。三秒内做出决定！",
            victory: "这是我们应得的！但下次我要看到更完美的表现！",
            defeat: "换人！全部换下！你们在场上像一堆木头！",
        },
        behaviorPattern: BehaviorPattern.TalkingToRefs,
        specialty: "临场应变与关键球战术",
    },
    {
        id: "coach_12",
        name: "教授 (The Professor)",
        appearance: "戴着厚厚的眼镜，穿着一件带有肘部补丁的毛衣，像个大学讲师。",
        personality: "博学、理论派，喜欢用历史上的比赛案例来教学。",
        teachingStyle: TeachingStyle.OldSchool,
        dialogue: {
            greeting: "你好，请坐。我们来研究一下1980年代的三角进攻。",
            advice: "篮球哲学是基础。理解比赛的本质，才能做出正确的选择。",
            victory: "这是一场经典的胜利，值得载入史册。",
            defeat: "理论上我们没有输。是实践中出现了偏差，需要重新学习。",
        },
        behaviorPattern: BehaviorPattern.DemonstratingDrills,
        specialty: "篮球历史与经典进攻体系",
    },
    {
        id: "coach_13",
        name: "小李 (Xiao Li)",
        appearance: "刚退役的年轻球员，充满活力，与队员们打成一片。",
        personality: "活泼、亲切，是队员们的好大哥，擅长一对一指导。",
        teachingStyle: TeachingStyle.ModernFlow,
        dialogue: {
            greeting: "哥们儿！今天状态怎么样？来，我们一起跑个战术！",
            advice: "保持侵略性！大胆出手！我会为你承担责任！",
            victory: "太棒了！我们是最好的团队！晚上一起去吃烤肉！",
            defeat: "没事，下次我来教你那个绝杀球怎么处理。",
        },
        behaviorPattern: BehaviorPattern.DemonstratingDrills,
        specialty: "球员发展与个人技术提升",
    },
    {
        id: "coach_14",
        name: "独眼龙 (One-Eye)",
        appearance: "脸上有一道疤，戴着眼罩，穿着皮夹克，看起来像个赏金猎人。",
        personality: "沉默寡言，只关注防守，信奉“让对手得不了分，你就不会输”。",
        teachingStyle: TeachingStyle.Fundamentals,
        dialogue: {
            greeting: "（低沉的喉音）",
            advice: "防守！用你的身体去感受对手的移动！像胶水一样粘住他！",
            victory: "（指了指防守数据）干得不错。",
            defeat: "（砸了手中的战术板）防守失位！这是不可原谅的！",
        },
        behaviorPattern: BehaviorPattern.PacingSideline,
        specialty: "内线防守与篮板保护",
    },
    {
        id: "coach_15",
        name: "禅师 (The Zen Master)",
        appearance: "穿着宽松的麻布衣，手里拿着一串佛珠，总是微笑着。",
        personality: "平和、睿智，注重球员的心灵和精神层面。",
        teachingStyle: TeachingStyle.Motivator,
        dialogue: {
            greeting: "篮球如人生，每一刻都是修行。找到你内心的平静。",
            advice: "不要被外物所扰，专注当下。球场上的'无我'境界，才是最强大的力量。",
            victory: "恭喜你们，你们的心灵找到了和谐。",
            defeat: "胜败乃兵家常事。放下执念，明天再来。",
        },
        behaviorPattern: BehaviorPattern.SittingQuietly,
        specialty: "专注力训练与团队协作哲学",
    },
];