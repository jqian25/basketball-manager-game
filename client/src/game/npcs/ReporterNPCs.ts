// client/src/game/npcs/ReporterNPCs.ts

/**
 * NPC外观类型
 * 描述NPC的视觉特征
 */
export type Appearance = {
    height: string; // 身高，例如 "180cm"
    bodyType: 'slim' | 'average' | 'muscular' | 'heavy'; // 体型
    clothing: string; // 服装描述，例如 "米色风衣，戴着黑色棒球帽"
    distinctiveFeature: string; // 显著特征，例如 "总是戴着一副老式眼镜"
};

/**
 * NPC性格类型
 * 描述NPC的个性特点
 */
export type Personality = {
    trait: string; // 主要性格特质，例如 "好胜心强"
    reportingStyle: 'aggressive' | 'investigative' | 'gossip' | 'analytical' | 'neutral'; // 报道风格
    motto: string; // 座右铭或口头禅
};

/**
 * NPC对话类型
 * 包含NPC的常用对话和特定情境对话
 */
export type Dialogue = {
    greeting: string; // 问候语
    onWin: string; // 球队获胜时的对话
    onLoss: string; // 球队失利时的对话
    exclusiveQuestion: string; // 独家问题
};

/**
 * NPC行为模式类型
 * 描述NPC在游戏中的行动规律
 */
export type BehaviorPattern = {
    location: string; // 经常出现的位置，例如 "更衣室门口"
    actionFrequency: 'high' | 'medium' | 'low'; // 提问或行动的频率
    targetPlayerType: string; // 倾向于采访的球员类型，例如 "超级巨星" 或 "替补球员"
};

/**
 * 记者NPC数据结构
 */
export type ReporterNPC = {
    id: number;
    name: string;
    focus: string; // 关注的篮球领域，例如 "战术分析" 或 "球员花边新闻"
    appearance: Appearance;
    personality: Personality;
    dialogue: Dialogue;
    behaviorPattern: BehaviorPattern;
};

// 记者NPC数据库 (共12个)
export const ReporterNPCs: ReporterNPC[] = [
    {
        id: 1,
        name: "迈克尔·布朗",
        focus: "战术分析与教练决策",
        appearance: {
            height: "190cm",
            bodyType: "slim",
            clothing: "深蓝色西装，佩戴球队徽章领带",
            distinctiveFeature: "总是带着一个厚厚的战术板"
        },
        personality: {
            trait: "冷静、专业",
            reportingStyle: "analytical",
            motto: "数据不会说谎，战术决定胜负。"
        },
        dialogue: {
            greeting: "你好，请问你对今晚的防守轮转有什么看法？",
            onWin: "这是一场教科书般的胜利，你们的三角进攻执行得非常完美。",
            onLoss: "教练组是否会为这场失利承担责任？你们的战术调整似乎慢了一拍。",
            exclusiveQuestion: "在第四节的关键时刻，你更倾向于使用区域联防还是人盯人防守？"
        },
        behaviorPattern: {
            location: "教练席附近、赛后新闻发布会前排",
            actionFrequency: "medium",
            targetPlayerType: "核心组织者、教练"
        }
    },
    {
        id: 2,
        name: "莎拉·詹姆斯",
        focus: "球员花边新闻和社交媒体动态",
        appearance: {
            height: "165cm",
            bodyType: "average",
            clothing: "时尚的红色连衣裙，戴着超大墨镜",
            distinctiveFeature: "手持镶钻的话筒"
        },
        personality: {
            trait: "八卦、活泼",
            reportingStyle: "gossip",
            motto: "球迷想知道的，就是我的头条！",
        },
        dialogue: {
            greeting: "嗨，大明星！能耽误你一分钟吗？",
            onWin: "恭喜！听说你赛后要去庆祝，能透露一下是和哪位神秘嘉宾吗？",
            onLoss: "这场失利会不会影响你的心情？你和队友的关系还好吗？",
            exclusiveQuestion: "最近社交媒体上那张照片是真的吗？你和某位明星的关系进展如何？"
        },
        behaviorPattern: {
            location: "球员通道出口、豪华包厢区",
            actionFrequency: "high",
            targetPlayerType: "高人气超级巨星、新秀"
        }
    },
    {
        id: 3,
        name: "大卫·李",
        focus: "球队文化与更衣室氛围",
        appearance: {
            height: "185cm",
            bodyType: "muscular",
            clothing: "宽松的T恤和牛仔裤，背着一个旧相机包",
            distinctiveFeature: "声音沙哑，总是带着一丝疲惫"
        },
        personality: {
            trait: "深入、富有同情心",
            reportingStyle: "investigative",
            motto: "篮球不只是比赛，更是生活。",
        },
        dialogue: {
            greeting: "你好，我能感受到你们团队的力量。",
            onWin: "这场胜利的背后，是怎样的团队精神在支撑着你们？",
            onLoss: "更衣室里现在气氛如何？你们将如何走出低谷，重新团结起来？",
            exclusiveQuestion: "你认为球队的‘化学反应’是否达到了最佳状态？有没有什么不为人知的幕后故事？"
        },
        behaviorPattern: {
            location: "训练场边缘、更衣室门口（等待权限）",
            actionFrequency: "medium",
            targetPlayerType: "队长、老将、角色球员"
        }
    },
    {
        id: 4,
        name: "艾米丽·王",
        focus: "数据统计与效率分析",
        appearance: {
            height: "170cm",
            bodyType: "slim",
            clothing: "黑色高领毛衣，戴着一副细边眼镜",
            distinctiveFeature: "手持平板电脑，随时记录数据"
        },
        personality: {
            trait: "严谨、数据控",
            reportingStyle: "analytical",
            motto: "让数字说话。",
        },
        dialogue: {
            greeting: "晚上好，我们来聊聊效率值。",
            onWin: "根据我的统计，你们本场比赛的有效投篮命中率达到了赛季新高，你是如何做到的？",
            onLoss: "你的失误率在本场比赛中有所上升，你认为这是疲劳还是对手的防守策略导致的？",
            exclusiveQuestion: "你对‘真实正负值’（RPM）这个数据有什么看法？它是否能全面衡量你的贡献？"
        },
        behaviorPattern: {
            location: "媒体工作间、比赛记录台附近",
            actionFrequency: "low",
            targetPlayerType: "数据型球员、技术流球员"
        }
    },
    {
        id: 5,
        name: "杰克·卡特",
        focus: "裁判判罚与联盟规则",
        appearance: {
            height: "178cm",
            bodyType: "average",
            clothing: "一件印有“公正”字样的卫衣，总是皱着眉头",
            distinctiveFeature: "脖子上挂着一个哨子形状的项链"
        },
        personality: {
            trait: "好斗、批判",
            reportingStyle: "aggressive",
            motto: "规则就是规则，没有模糊地带。",
        },
        dialogue: {
            greeting: "今晚的判罚值得商榷。",
            onWin: "你认为这场胜利是否得益于几次关键的裁判判罚？你对那个进攻犯规怎么看？",
            onLoss: "你对那个技术犯规判罚有什么不满？你认为联盟应该如何改进裁判的执法水平？",
            exclusiveQuestion: "你是否认为某些明星球员得到了‘特殊待遇’？"
        },
        behaviorPattern: {
            location: "技术台附近、赛后新闻发布会（提问尖锐）",
            actionFrequency: "high",
            targetPlayerType: "易怒的球员、教练"
        }
    },
    {
        id: 6,
        name: "林薇",
        focus: "球迷文化与主场氛围",
        appearance: {
            height: "168cm",
            bodyType: "slim",
            clothing: "穿着一件带有球队吉祥物图案的T恤，扎着高马尾",
            distinctiveFeature: "总是带着一个自拍杆进行直播"
        },
        personality: {
            trait: "热情、亲民",
            reportingStyle: "neutral",
            motto: "篮球的魅力，在于球迷的呐喊。",
        },
        dialogue: {
            greeting: "大家好，我是林薇，正在现场为大家直播！",
            onWin: "全场球迷都沸腾了！你有什么话想对一直支持你们的球迷说吗？",
            onLoss: "球迷们非常失望，你觉得你们的表现对得起他们的票价吗？",
            exclusiveQuestion: "你有没有注意到球迷为你制作的那个巨型横幅？你对主场氛围有什么感受？"
        },
        behaviorPattern: {
            location: "观众席前排、球迷互动区",
            actionFrequency: "high",
            targetPlayerType: "所有球员（以轻松的方式）"
        }
    },
    {
        id: 7,
        name: "老彼得",
        focus: "篮球历史与传统",
        appearance: {
            height: "175cm",
            bodyType: "heavy",
            clothing: "一件复古的羊毛衫，戴着一顶老式鸭舌帽",
            distinctiveFeature: "总是引用上世纪球星的语录"
        },
        personality: {
            trait: "怀旧、资深",
            reportingStyle: "investigative",
            motto: "了解历史，才能创造未来。",
        },
        dialogue: {
            greeting: "年轻人，你让我想起了当年的‘魔术师’。",
            onWin: "这场胜利是否能与你们队史上的黄金一代相提并论？你觉得你们的打法更像哪个时代的篮球？",
            onLoss: "你们的失利让我想起了1980年代的那场经典战役，你觉得问题出在哪里？",
            exclusiveQuestion: "你认为现代篮球是否失去了某些传统的美感？你最欣赏哪位传奇球星？"
        },
        behaviorPattern: {
            location: "球队荣誉室、老式体育馆的角落",
            actionFrequency: "low",
            targetPlayerType: "老将、对历史感兴趣的球员"
        }
    },
    {
        id: 8,
        name: "凯文·格林",
        focus: "球员健康与体能训练",
        appearance: {
            height: "182cm",
            bodyType: "muscular",
            clothing: "运动夹克，带着一个印有运动科学标志的笔记本",
            distinctiveFeature: "手臂上戴着一个运动监测手环"
        },
        personality: {
            trait: "注重细节、健康狂热",
            reportingStyle: "analytical",
            motto: "没有健康的身体，就没有一切。",
        },
        dialogue: {
            greeting: "你的体脂率最近怎么样？",
            onWin: "你今天的跑动距离创下了个人新高，你们的体能训练师做了什么特别的调整吗？",
            onLoss: "你看起来有点疲惫，你认为疲劳是否影响了你的投篮选择？你的恢复计划是什么？",
            exclusiveQuestion: "你对赛后的冰浴和高压氧舱有什么偏好？你认为哪种恢复方式最有效？"
        },
        behaviorPattern: {
            location: "球队训练馆、医疗室门口",
            actionFrequency: "medium",
            targetPlayerType: "伤愈复出的球员、体能出色的球员"
        }
    },
    {
        id: 9,
        name: "田中直人",
        focus: "国际篮球与海外球员动态",
        appearance: {
            height: "172cm",
            bodyType: "slim",
            clothing: "一件印有日本国家队标志的衬衫",
            distinctiveFeature: "说话带有浓重的口音"
        },
        personality: {
            trait: "谦逊、好奇",
            reportingStyle: "neutral",
            motto: "篮球是世界的语言。",
        },
        dialogue: {
            greeting: "你好，我是来自东京的记者。",
            onWin: "你的表现让亚洲球迷非常兴奋！你觉得国际球员在NBA的适应性如何？",
            onLoss: "这场失利对你们的国际声誉会有影响吗？你对欧洲联赛的打法有什么看法？",
            exclusiveQuestion: "你认为哪位海外新秀最有潜力进入NBA？你对FIBA的规则有什么建议？"
        },
        behaviorPattern: {
            location: "国际球员休息区、客队更衣室附近",
            actionFrequency: "low",
            targetPlayerType: "国际球员、有海外背景的教练"
        }
    },
    {
        id: 10,
        name: "菲奥娜·里德",
        focus: "选秀前景与大学篮球",
        appearance: {
            height: "175cm",
            bodyType: "average",
            clothing: "一件大学校队的夹克，总是带着一个笔记本和笔",
            distinctiveFeature: "眼神锐利，仿佛在评估每一个球员的潜力"
        },
        personality: {
            trait: "前瞻性、挑剔",
            reportingStyle: "investigative",
            motto: "未来是属于年轻人的。",
        },
        dialogue: {
            greeting: "我一直在关注你的选秀报告。",
            onWin: "你认为你们队中的新秀们是否已经兑现了他们的选秀潜力？",
            onLoss: "如果你们获得了高顺位选秀权，你认为球队应该选择哪种类型的球员？",
            exclusiveQuestion: "你觉得大学篮球和职业篮球最大的区别是什么？你对今年的选秀大会有什么预测？"
        },
        behaviorPattern: {
            location: "球探席、新秀训练营",
            actionFrequency: "medium",
            targetPlayerType: "新秀、年轻球员"
        }
    },
    {
        id: 11,
        name: "托尼·莫雷蒂",
        focus: "财务与合同细节",
        appearance: {
            height: "180cm",
            bodyType: "heavy",
            clothing: "昂贵的意大利手工西装，戴着金丝眼镜",
            distinctiveFeature: "总是拿着一份折叠起来的报纸（金融版）"
        },
        personality: {
            trait: "精明、现实",
            reportingStyle: "aggressive",
            motto: "生意就是生意。",
        },
        dialogue: {
            greeting: "我们来谈谈钱的问题。",
            onWin: "这场胜利会为你的下一份合同增加多少价值？你认为你的薪水是否与你的贡献相符？",
            onLoss: "你对球队的奢侈税有什么看法？你认为球队是否会为了腾出薪金空间而交易你？",
            exclusiveQuestion: "你对球员保障合同和非保障合同有什么偏好？你认为顶薪合同是否合理？"
        },
        behaviorPattern: {
            location: "球队管理层办公室门口、球员经纪人休息室",
            actionFrequency: "high",
            targetPlayerType: "合同年球员、高薪球员"
        }
    },
    {
        id: 12,
        name: "朱莉娅·罗伯茨",
        focus: "公益活动与社会责任",
        appearance: {
            height: "170cm",
            bodyType: "average",
            clothing: "一件印有慈善机构标志的T恤，笑容温暖",
            distinctiveFeature: "说话轻声细语，非常有礼貌"
        },
        personality: {
            trait: "善良、理想主义",
            reportingStyle: "neutral",
            motto: "用篮球的力量改变世界。",
        },
        dialogue: {
            greeting: "你好，很高兴能和你聊聊篮球之外的事情。",
            onWin: "这场胜利对你参与的慈善项目有什么意义？你希望通过你的影响力传递什么样的信息？",
            onLoss: "虽然输了比赛，但你对社区的贡献依然值得肯定。你下一步的公益计划是什么？",
            exclusiveQuestion: "你认为职业球员在社会责任方面应该扮演什么样的角色？你最关注哪个社会问题？"
        },
        behaviorPattern: {
            location: "社区活动中心、球员基金会活动现场",
            actionFrequency: "medium",
            targetPlayerType: "热衷公益的球员、有家庭的球员"
        }
    }
];