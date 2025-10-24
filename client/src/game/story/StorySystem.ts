// client/src/game/story/StorySystem.ts

/**
 * 剧情章节的类型定义
 */
export interface StoryChapter {
    /** 章节ID，唯一标识符 */
    id: number;
    /** 章节标题 */
    title: string;
    /** 章节描述或简短介绍 */
    summary: string;
    /** 章节的主要内容，由一系列剧情步骤组成 */
    scenes: StoryScene[];
    /** 章节解锁条件（例如：前置章节ID，或玩家等级等），此处简化为前置章节ID */
    prerequisiteChapterId: number | null;
}

/**
 * 剧情步骤（场景）的类型定义
 */
export interface StoryScene {
    /** 场景ID，在章节内唯一 */
    sceneId: number;
    /** 场景类型：对话、比赛、训练、选择等 */
    type: 'dialogue' | 'match' | 'training' | 'choice' | 'reward';
    /** 场景内容，根据类型不同而不同 */
    content: DialogueScene | MatchScene | TrainingScene | ChoiceScene | RewardScene;
}

/**
 * 对话场景内容
 */
export interface DialogueScene {
    /** 对话角色名称 */
    speaker: string;
    /** 对话文本 */
    text: string;
    /** 角色头像或立绘资源ID */
    avatarId?: string;
}

/**
 * 比赛场景内容
 */
export interface MatchScene {
    /** 比赛对手名称 */
    opponent: string;
    /** 比赛描述 */
    description: string;
    /** 比赛目标（例如：得分，助攻数，胜利） */
    goal: string;
    /** 比赛难度 */
    difficulty: 'easy' | 'medium' | 'hard' | 'very_hard' | 'ultimate'; // 扩展难度类型
}

/**
 * 训练场景内容
 */
export interface TrainingScene {
    /** 训练项目名称 */
    trainingName: string;
    /** 训练描述 */
    description: string;
    /** 提升的属性或技能 */
    skillBoost: string;
}

/**
 * 选择场景内容
 */
export interface ChoiceScene {
    /** 选择前的文本描述 */
    prompt: string;
    /** 选项列表 */
    options: {
        /** 选项文本 */
        text: string;
        /** 选项结果描述 */
        resultDescription: string;
        /** 选项可能带来的影响（例如：属性变化，跳转到其他场景） */
        effect: string;
    }[];
}

/**
 * 奖励场景内容
 */
export interface RewardScene {
    /** 奖励描述 */
    description: string;
    /** 奖励物品列表（例如：金币，装备，经验） */
    items: string[];
}


// --- 剧情数据库内容 (15个章节) ---
const STORY_CHAPTERS: StoryChapter[] = [
    // Chapter 1: 街头篮球的呼唤 (The Call of Streetball)
    {
        id: 1,
        title: "街头篮球的呼唤",
        summary: "从默默无闻的街头球手到追逐梦想的起点。你需要在社区球场证明自己。",
        prerequisiteChapterId: null,
        scenes: [
            { sceneId: 101, type: 'dialogue', content: { speaker: "旁白", text: "夏日午后，柏油路上热气腾腾。你正独自练习投篮，汗水浸湿了球衣。" } },
            { sceneId: 102, type: 'dialogue', content: { speaker: "老教练王", text: "嘿，小伙子，投篮姿势不错。但光有手感可不够，街球场上讲究的是硬仗！" } },
            { sceneId: 103, type: 'training', content: { trainingName: "基础运球训练", description: "在老教练的指导下，进行基础的体能和运球训练，提高控球能力。", skillBoost: "控球 +5, 体能 +3" } },
            { sceneId: 104, type: 'match', content: { opponent: "街头霸王队", description: "一场3对3半场比赛，证明你不是只会投篮的花架子。", goal: "赢下比赛", difficulty: "easy" } },
            { sceneId: 105, type: 'reward', content: { description: "成功在街球场立足。", items: ["经验值 +100", "街球币 +50"] } }
        ]
    },

    // Chapter 2: 试训风波 (The Tryout Turmoil)
    {
        id: 2,
        title: "试训风波",
        summary: "你获得了本地一支高中球队的试训机会。你需要展现出团队合作和防守能力。",
        prerequisiteChapterId: 1,
        scenes: [
            { sceneId: 201, type: 'dialogue', content: { speaker: "球队经理李", text: "欢迎来到校队试训。我们不缺得分手，我们需要的是能防守、会传球的球员。" } },
            { sceneId: 202, type: 'training', content: { trainingName: "防守脚步训练", description: "进行侧滑步和抢断训练，提升防守意识和速度。", skillBoost: "防守 +5, 速度 +3" } },
            { sceneId: 203, type: 'choice', content: {
                prompt: "在分组对抗中，你的队友被对手连续晃过。你是选择上前包夹，还是坚守自己的位置？",
                options: [
                    { text: "上前包夹", resultDescription: "冒险包夹，成功抢断，但若失败，则可能导致防守失位。", effect: "防守 +3，若成功：抢断率提高" },
                    { text: "坚守位置", resultDescription: "保持防守阵型，但队友可能会失分，展现了纪律性。", effect: "团队合作 +3，若失分：教练评价降低" }
                ]
            } },
            { sceneId: 204, type: 'match', content: { opponent: "校队二队", description: "全场5对5对抗赛，你的主要任务是限制对手的得分后卫。", goal: "防守端表现出色，并至少送出3次助攻", difficulty: "medium" } },
            { sceneId: 205, type: 'reward', content: { description: "成功通过试训，加入校队。", items: ["经验值 +150", "校队球衣"] } }
        ]
    },

    // Chapter 3: 替补席上的煎熬 (The Agony of the Bench)
    {
        id: 3,
        title: "替补席上的煎熬",
        summary: "作为新人，你坐在替补席上，需要时刻准备好抓住机会。",
        prerequisiteChapterId: 2,
        scenes: [
            { sceneId: 301, type: 'dialogue', content: { speaker: "队长张", text: "菜鸟，别灰心。机会是留给有准备的人的。在场下也要观察比赛。" } },
            { sceneId: 302, type: 'training', content: { trainingName: "无球跑动与接球投篮", description: "强化无球状态下的跑位和快速出手能力。", skillBoost: "无球跑动 +4, 投篮速度 +3" } },
            { sceneId: 303, type: 'dialogue', content: { speaker: "旁白", text: "比赛进入胶着阶段，主力控卫意外受伤，教练叫到你的名字。" } },
            { sceneId: 304, type: 'match', content: { opponent: "宿敌高中队", description: "比赛还剩最后五分钟，你必须在有限的时间内做出贡献。", goal: "在五分钟内得到至少4分并保持零失误", difficulty: "medium" } },
            { sceneId: 305, type: 'reward', content: { description: "关键时刻的稳定表现为你赢得了教练的信任。", items: ["经验值 +180", "教练好感度提升"] } }
        ]
    },

    // Chapter 4: 第一次首发 (The First Start)
    {
        id: 4,
        title: "第一次首发",
        summary: "你终于迎来了第一次首发机会，但压力巨大，你需要克服紧张，打出自己的节奏。",
        prerequisiteChapterId: 3,
        scenes: [
            { sceneId: 401, type: 'dialogue', content: { speaker: "教练", text: "别紧张，打出你训练时的水平。记住，控制节奏，多传球。" } },
            { sceneId: 402, type: 'training', content: { trainingName: "心理素质训练", description: "模拟比赛环境，进行高压下的罚球和关键球处理。", skillBoost: "冷静 +5, 罚球命中率 +2" } },
            { sceneId: 403, type: 'match', content: { opponent: "卫冕冠军队", description: "一场硬仗，对手实力强大，你必须在攻防两端保持专注。", goal: "全场得到10分，送出5次助攻，并赢下比赛", difficulty: "hard" } },
            { sceneId: 404, type: 'choice', content: {
                prompt: "比赛最后时刻，你持球突破，是选择自己强行上篮，还是传给空位的队友？",
                options: [
                    { text: "自己上篮", resultDescription: "承担责任，但命中率不高。", effect: "个人能力 +5，若失败：士气降低" },
                    { text: "传给队友", resultDescription: "信任队友，展现团队精神，但可能错失绝杀机会。", effect: "团队合作 +5，若成功：助攻率提高" }
                ]
            } },
            { sceneId: 405, type: 'reward', content: { description: "首发成功，成为球队不可或缺的一员。", items: ["经验值 +250", "媒体关注度提升"] } }
        ]
    },

    // Chapter 5: 伤病与低谷 (Injury and the Slump)
    {
        id: 5,
        title: "伤病与低谷",
        summary: "一次意外的伤病让你不得不暂时离开赛场，你需要在康复中保持心态。",
        prerequisiteChapterId: 4,
        scenes: [
            { sceneId: 501, type: 'dialogue', content: { speaker: "队医", text: "你需要休息至少两周。康复期间，保持积极心态是关键。" } },
            { sceneId: 502, type: 'training', content: { trainingName: "核心力量与柔韧性训练", description: "在不能上场的情况下，强化核心力量，为复出做准备。", skillBoost: "核心力量 +5, 伤病抵抗 +5" } },
            { sceneId: 503, type: 'dialogue', content: { speaker: "旁白", text: "你看着队友在场上拼搏，心中焦急。你决定提前复出，还是听从医嘱？" } },
            { sceneId: 504, type: 'choice', content: {
                prompt: "队医建议再休息一周，但下一场是关键战。你选择？",
                options: [
                    { text: "提前复出", resultDescription: "可能加重伤势，但能帮助球队。", effect: "风险增加，若赢球：队友信任度提升" },
                    { text: "听从医嘱", resultDescription: "确保完全康复，但错过关键战。", effect: "伤病抵抗 +5，若输球：教练略有不满" }
                ]
            } },
            { sceneId: 505, type: 'reward', content: { description: "无论是选择休息还是复出，你都明白了健康的重要性。", items: ["经验值 +200", "意志力 +5"] } }
        ]
    },

    // Chapter 6: 绝杀时刻 (The Buzzer Beater)
    {
        id: 6,
        title: "绝杀时刻",
        summary: "你伤愈复出，球队需要你投进关键一球。",
        prerequisiteChapterId: 5,
        scenes: [
            { sceneId: 601, type: 'dialogue', content: { speaker: "教练", text: "时间只剩5秒，我们落后1分。球交给你，执行战术！" } },
            { sceneId: 602, type: 'training', content: { trainingName: "关键球命中率训练", description: "在疲劳状态下，练习高难度投篮。", skillBoost: "关键球 +10, 投篮命中率 +3" } },
            { sceneId: 603, type: 'match', content: { opponent: "分区强队", description: "最后5秒，你需要完成一次得分。", goal: "投进绝杀球", difficulty: "hard" } },
            { sceneId: 604, type: 'dialogue', content: { speaker: "旁白", text: "球出手，时间走完，全场屏息..." } },
            { sceneId: 605, type: 'reward', content: { description: "绝杀成功，你成为了全城的英雄。", items: ["经验值 +300", "声望 +100", "特殊称号：绝杀先生"] } }
        ]
    },

    // Chapter 7: 招募信 (The Recruitment Letter)
    {
        id: 7,
        title: "招募信",
        summary: "你的出色表现吸引了大学球探的注意，你需要决定未来的方向。",
        prerequisiteChapterId: 6,
        scenes: [
            { sceneId: 701, type: 'dialogue', content: { speaker: "球探A", text: "我们大学的篮球项目非常适合你。来我们这里，你将有机会冲击NCAA。" } },
            { sceneId: 702, type: 'dialogue', content: { speaker: "球探B", text: "我们学校虽然不是顶级强队，但能给你足够的上场时间来证明自己。" } },
            { sceneId: 703, type: 'choice', content: {
                prompt: "你收到两份大学招募信，一份来自传统强队（竞争激烈），一份来自潜力黑马（有大量出场时间）。你选择？",
                options: [
                    { text: "传统强队", resultDescription: "挑战自我，但可能再次从替补打起。", effect: "潜力值提升，但初期属性增长缓慢" },
                    { text: "潜力黑马", resultDescription: "获得大量出场时间，快速成长。", effect: "初期属性增长加快，但上限略低" }
                ]
            } },
            { sceneId: 704, type: 'reward', content: { description: "你做出了人生中一个重要的决定，篮球生涯进入下一阶段。", items: ["经验值 +200", "大学奖学金"] } }
        ]
    },

    // Chapter 8: 大学菜鸟赛季 (The College Freshman Season)
    {
        id: 8,
        title: "大学菜鸟赛季",
        summary: "大学篮球的强度远超高中，你需要适应新的节奏和更专业的体系。",
        prerequisiteChapterId: 7,
        scenes: [
            { sceneId: 801, type: 'dialogue', content: { speaker: "大学教练", text: "这里是成年人的游戏。你必须更强壮，更有战术意识。" } },
            { sceneId: 802, type: 'training', content: { trainingName: "力量与对抗训练", description: "在健身房进行高强度力量训练，以适应大学级别的身体对抗。", skillBoost: "力量 +10, 爆发力 +5" } },
            { sceneId: 803, type: 'match', content: { opponent: "NCAA分区赛对手", description: "你的第一场NCAA正式比赛，对手是经验丰富的大三球员。", goal: "在比赛中完成一次成功的挡拆配合并得分", difficulty: "medium" } },
            { sceneId: 804, type: 'reward', content: { description: "你完成了大学赛场的首秀，虽然艰难，但你迈出了第一步。", items: ["经验值 +220", "战术理解 +5"] } }
        ]
    },

    // Chapter 9: 战术大师 (The Tactician)
    {
        id: 9,
        title: "战术大师",
        summary: "你开始深入研究比赛录像和战术手册，试图用智慧弥补经验的不足。",
        prerequisiteChapterId: 8,
        scenes: [
            { sceneId: 901, type: 'dialogue', content: { speaker: "助教", text: "篮球不是一个人的运动。理解战术，你才能成为真正的组织者。" } },
            { sceneId: 902, type: 'training', content: { trainingName: "战术板模拟训练", description: "学习并执行复杂的进攻和防守战术。", skillBoost: "战术理解 +10, 视野 +5" } },
            { sceneId: 903, type: 'choice', content: {
                prompt: "在一次暂停中，教练布置了一个战术，但你发现对手的站位可以被另一种打法克制。你选择？",
                options: [
                    { text: "严格执行教练战术", resultDescription: "展现纪律性，但可能错失良机。", effect: "教练信任度提升" },
                    { text: "尝试说服教练改变战术", resultDescription: "风险与机遇并存，展现领袖气质。", effect: "若成功：士气大增；若失败：教练信任度降低" }
                ]
            } },
            { sceneId: 904, type: 'match', content: { opponent: "高排名种子队", description: "运用新学的战术，打乱对手的节奏。", goal: "全队助攻数超过15次，且你的失误少于2次", difficulty: "hard" } },
            { sceneId: 905, type: 'reward', content: { description: "你证明了自己不仅有身体天赋，还有篮球智商。", items: ["经验值 +280", "篮球智商 +10"] } }
        ]
    },

    // Chapter 10: 疯狂三月 (March Madness)
    {
        id: 10,
        title: "疯狂三月",
        summary: "NCAA锦标赛开始，一场定胜负的残酷赛制，你的目标是全国冠军。",
        prerequisiteChapterId: 9,
        scenes: [
            { sceneId: 1001, type: 'dialogue', content: { speaker: "旁白", text: "聚光灯下，万人欢呼。这是你篮球生涯中最盛大的舞台。" } },
            { sceneId: 1002, type: 'training', content: { trainingName: "高强度体能储备", description: "为连续的高强度比赛储备体能。", skillBoost: "体能 +10, 恢复速度 +5" } },
            { sceneId: 1003, type: 'match', content: { opponent: "锦标赛黑马队", description: "淘汰赛第一轮，你必须全力以赴，不能给对手任何机会。", goal: "赢得比赛，并打出一次三双（得分、篮板、助攻）", difficulty: "hard" } },
            { sceneId: 1004, type: 'reward', content: { description: "你带领球队进入了下一轮，距离梦想更近了一步。", items: ["经验值 +350", "全国关注度提升"] } }
        ]
    },

    // Chapter 11: 选秀预测 (The Draft Projection)
    {
        id: 11,
        title: "选秀预测",
        summary: "你的名字开始出现在NBA选秀预测榜单上，你需要决定是否提前参选。",
        prerequisiteChapterId: 10,
        scenes: [
            { sceneId: 1101, type: 'dialogue', content: { speaker: "经纪人", text: "目前的预测你能在首轮末被选中。如果你再打一年，可能会进入乐透区。" } },
            { sceneId: 1102, type: 'dialogue', content: { speaker: "家人", text: "无论你做什么决定，我们都支持你。但要考虑清楚，这是你的人生。" } },
            { sceneId: 1103, type: 'choice', content: {
                prompt: "是选择现在参选（首轮末），还是再打一年（可能乐透）？",
                options: [
                    { text: "提前参选", resultDescription: "更快进入职业联赛，但选秀顺位不高。", effect: "立即进入职业生涯，选秀顺位锁定" },
                    { text: "再打一年", resultDescription: "有风险，但可能获得更高的选秀顺位。", effect: "属性继续增长，但有伤病或表现不佳的风险" }
                ]
            } },
            { sceneId: 1104, type: 'reward', content: { description: "你做出了迈向职业篮球的决定。", items: ["经验值 +300", "职业合同谈判机会"] } }
        ]
    },

    // Chapter 12: 选秀之夜 (Draft Night)
    {
        id: 12,
        title: "选秀之夜",
        summary: "你坐在选秀大会现场，等待着命运的宣判。",
        prerequisiteChapterId: 11,
        scenes: [
            { sceneId: 1201, type: 'dialogue', content: { speaker: "旁白", text: "灯光闪烁，你的心跳加速。大卫·斯特恩走上台，宣布下一个名字。" } },
            { sceneId: 1202, type: 'training', content: { trainingName: "媒体应对训练", description: "学习如何在聚光灯下应对媒体提问。", skillBoost: "公众形象 +5, 表达能力 +3" } },
            { sceneId: 1203, type: 'dialogue', content: { speaker: "总裁", text: "With the [XX] pick in the NBA Draft, the [Team Name] selects... [Your Name]!" } },
            { sceneId: 1204, type: 'reward', content: { description: "梦想成真，你被NBA球队选中，正式成为一名职业球员。", items: ["经验值 +500", "职业合同", "选秀帽"] } }
        ]
    },

    // Chapter 13: 职业生涯的挑战 (The Professional Challenge)
    {
        id: 13,
        title: "职业生涯的挑战",
        summary: "从大学到NBA，你需要面对更快的节奏、更强的对手和更残酷的商业竞争。",
        prerequisiteChapterId: 12,
        scenes: [
            { sceneId: 1301, type: 'dialogue', content: { speaker: "老将", text: "欢迎来到联盟，菜鸟。天赋在这里一文不值，努力和持久才是王道。" } },
            { sceneId: 1302, type: 'training', content: { trainingName: "专业化投篮训练", description: "根据NBA的防守强度，调整和优化你的投篮出手点和速度。", skillBoost: "投篮命中率 +5, 进攻技巧 +5" } },
            { sceneId: 1303, type: 'match', content: { opponent: "联盟顶级球星", description: "你将直接对位联盟的顶级得分手，你必须证明自己能防住他。", goal: "将对手的得分限制在赛季平均得分以下", difficulty: "hard" } },
            { sceneId: 1304, type: 'reward', content: { description: "在职业赛场上站稳了脚跟，赢得了队友和教练的尊重。", items: ["经验值 +400", "薪资提升"] } }
        ]
    },

    // Chapter 14: 季后赛之旅 (The Playoff Journey)
    {
        id: 14,
        title: "季后赛之旅",
        summary: "你所在的球队进入了季后赛，这是检验超级巨星的舞台。",
        prerequisiteChapterId: 13,
        scenes: [
            { sceneId: 1401, type: 'dialogue', content: { speaker: "教练", text: "季后赛是另一个级别的比赛，每一个回合都至关重要。" } },
            { sceneId: 1402, type: 'training', content: { trainingName: "高压战术执行", description: "在季后赛级别的防守强度下，练习战术的精准执行。", skillBoost: "抗压能力 +10, 传球精准度 +5" } },
            { sceneId: 1403, type: 'match', content: { opponent: "卫冕总冠军队", description: "系列赛的抢七大战，你必须打出职业生涯最佳表现。", goal: "赢得抢七大战，并成为全场得分王", difficulty: "very_hard" } },
            { sceneId: 1404, type: 'reward', content: { description: "你带领球队闯入了总决赛，创造了历史。", items: ["经验值 +600", "季后赛MVP提名"] } }
        ]
    },

    // Chapter 15: 总冠军的荣耀 (The Glory of the Championship)
    {
        id: 15,
        title: "总冠军的荣耀",
        summary: "总决赛的舞台，你距离篮球的最高荣誉只有一步之遥。",
        prerequisiteChapterId: 14,
        scenes: [
            { sceneId: 1501, type: 'dialogue', content: { speaker: "旁白", text: "总决赛的最后一战，比分紧咬，全世界的目光都聚焦在你身上。" } },
            { sceneId: 1502, type: 'training', content: { trainingName: "终极意志力挑战", description: "在极度疲惫和高压下，保持专注和执行力。", skillBoost: "意志力 +15, 全属性临时提升" } },
            { sceneId: 1503, type: 'match', content: { opponent: "总决赛对手", description: "总决赛的最终决战，你需要完成一次决定性的表演。", goal: "赢得总冠军", difficulty: "ultimate" } },
            { sceneId: 1504, type: 'dialogue', content: { speaker: "旁白", text: "终场哨响，比分定格。你高举双手，沐浴在金色的彩带雨中。" } },
            { sceneId: 1505, type: 'reward', content: { description: "你赢得了总冠军，完成了从街头到职业巅峰的传奇之旅。", items: ["经验值 +1000", "总冠军戒指", "FMVP奖杯"] } }
        ]
    }
];

/**
 * 剧情系统核心类
 * 负责存储和管理所有剧情章节数据
 */
export class StorySystem {
    // 使用 STORY_CHAPTERS 数组作为完整的数据库
    private static readonly storyDatabase: StoryChapter[] = STORY_CHAPTERS;

    /**
     * 获取所有剧情章节
     * @returns 剧情章节数组
     */
    public getAllChapters(): StoryChapter[] {
        return StorySystem.storyDatabase;
    }

    /**
     * 根据ID获取特定章节
     * @param id 章节ID
     * @returns 对应的章节，如果不存在则返回null
     */
    public getChapterById(id: number): StoryChapter | null {
        return StorySystem.storyDatabase.find(chapter => chapter.id === id) || null;
    }

    // 可以在此处添加更多方法，例如：
    // public getNextChapter(currentChapterId: number): StoryChapter | null { ... }
    // public isChapterUnlocked(chapterId: number, playerState: PlayerState): boolean { ... }
}

// 导出数据库，方便外部直接访问（例如：用于UI加载或数据测试）
export const STORY_DATABASE: StoryChapter[] = StorySystem.storyDatabase;