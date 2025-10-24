// client/src/game/events/RandomEvents.ts

/**
 * 随机事件可能带来的影响类型
 * 例如：属性增益/减益、资金变化、士气变化、伤病等
 */
export type EventEffectType = 'STAT_CHANGE' | 'MONEY_CHANGE' | 'MORALE_CHANGE' | 'INJURY' | 'PLAYER_ACQUISITION' | 'FAN_SUPPORT_CHANGE';

/**
 * 影响对象类型
 * 例如：球队整体、特定位置的球员、特定球员
 */
export type TargetType = 'TEAM' | 'PLAYER_ALL' | 'PLAYER_STAR' | 'PLAYER_ROOKIE' | 'PLAYER_POSITION' | 'SPECIFIC_PLAYER';

/**
 * 随机事件效果的详细定义
 */
export interface EventEffect {
    type: EventEffectType;
    target: TargetType;
    // 目标位置 (仅当 target 为 'PLAYER_POSITION' 时需要)
    position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    // 影响数值 (例如：属性变化值、资金变化额、士气变化值)
    value: number;
    // 影响的属性 (仅当 type 为 'STAT_CHANGE' 时需要)
    stat?: string; 
    // 持续时间 (例如：比赛场次，仅当效果为临时时需要)
    duration?: number;
}

/**
 * 随机事件结构
 */
export interface RandomEvent {
    id: number;
    title: string;
    description: string;
    // 触发事件的权重 (用于随机抽取)
    weight: number;
    // 事件发生后的效果列表
    effects: EventEffect[];
}

// --------------------------------------------------------------------------------
// 50个随机事件数据
// --------------------------------------------------------------------------------

export const RandomEvents: RandomEvent[] = [
    // 1. 核心球员爆发
    {
        id: 1,
        title: "核心球员爆发",
        description: "你的明星球员在最近的比赛中手感火热，连续打出超神表现，引起了联盟的广泛关注。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_STAR',
            value: 5,
            stat: 'Offensive Rating',
            duration: 5
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 10
        }]
    },
    // 2. 替补奇兵
    {
        id: 2,
        title: "替补奇兵",
        description: "一位长期坐在板凳上的替补球员，在一次关键比赛中挺身而出，打出了职业生涯最佳表现。",
        weight: 12,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 3,
            stat: 'Overall Rating',
            duration: 3
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 3. 伤病困扰
    {
        id: 3,
        title: "伤病困扰",
        description: "球队中的一名关键轮换球员在训练中不慎扭伤脚踝，需要缺席数周。",
        weight: 15,
        effects: [{
            type: 'INJURY',
            target: 'PLAYER_ALL',
            value: -2, // 影响球队整体轮换深度
            duration: 8 // 缺席场次
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 4. 媒体炒作
    {
        id: 4,
        title: "媒体炒作",
        description: "关于球队内部不和的流言蜚语在媒体上疯传，给球队带来了不必要的压力。",
        weight: 8,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -10,
            duration: 2
        }]
    },
    // 5. 慈善活动
    {
        id: 5,
        title: "慈善活动",
        description: "球队组织了一场成功的社区慈善活动，极大地提升了球队的公众形象。",
        weight: 5,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 15
        }, {
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: -50000 // 支出
        }]
    },
    // 6. 新秀墙
    {
        id: 6,
        title: "新秀墙",
        description: "被寄予厚望的新秀球员遭遇了“新秀墙”，表现大幅下滑，自信心受到打击。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ROOKIE',
            value: -8,
            stat: 'Overall Rating',
            duration: 10
        }]
    },
    // 7. 教练战术革新
    {
        id: 7,
        title: "教练战术革新",
        description: "主教练引入了一套全新的进攻战术，初期效果显著，让对手措手不及。",
        weight: 7,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: 4,
            stat: 'Offensive Rating',
            duration: 6
        }]
    },
    // 8. 球鞋合同
    {
        id: 8,
        title: "球鞋合同",
        description: "一名球员签下了一份高额的球鞋代言合同，他的场外曝光度大增，但似乎有点分心。",
        weight: 6,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_STAR',
            value: -2,
            stat: 'Focus',
            duration: 4
        }, {
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: 200000 // 球队分成
        }]
    },
    // 9. 裁判争议
    {
        id: 9,
        title: "裁判争议",
        description: "在一场关键比赛中，裁判的几次争议判罚导致球队失利，球迷和管理层都表达了强烈不满。",
        weight: 10,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -15
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 10. 训练馆升级
    {
        id: 10,
        title: "训练馆升级",
        description: "管理层决定投入资金升级球队的训练设施，长远来看将提升球员的训练效率和健康水平。",
        weight: 3,
        effects: [{
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: -1000000
        }, {
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 1,
            stat: 'Potential',
            duration: 999 // 永久
        }]
    },
    // 11. 队内冲突
    {
        id: 11,
        title: "队内冲突",
        description: "两名主力球员在更衣室发生激烈争吵，虽然很快被制止，但球队氛围变得紧张。",
        weight: 12,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -12,
            duration: 3
        }]
    },
    // 12. 完美化学反应
    {
        id: 12,
        title: "完美化学反应",
        description: "球队在场上和场下的配合都达到了前所未有的默契，团队篮球的威力尽显。",
        weight: 5,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: 6,
            stat: 'Team Chemistry',
            duration: 7
        }]
    },
    // 13. 交易流言
    {
        id: 13,
        title: "交易流言",
        description: "关于球队将进行重磅交易的传闻四起，一些球员开始担心自己的位置。",
        weight: 9,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: -3,
            stat: 'Focus',
            duration: 4
        }]
    },
    // 14. 关键球员续约
    {
        id: 14,
        title: "关键球员续约",
        description: "与一名核心球员成功完成续约谈判，确保了球队未来的稳定，极大地鼓舞了士气。",
        weight: 4,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 15
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 8
        }]
    },
    // 15. 意外的惊喜
    {
        id: 15,
        title: "意外的惊喜",
        description: "一名边缘球员在训练中展现出惊人的进步，教练组决定给他更多的上场时间。",
        weight: 7,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 5,
            stat: 'Potential',
            duration: 999
        }]
    },
    // 16. 糟糕的客场之旅
    {
        id: 16,
        title: "糟糕的客场之旅",
        description: "连续的客场比赛和长途飞行让球员们疲惫不堪，状态低迷。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -5,
            stat: 'Stamina',
            duration: 3
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -8
        }]
    },
    // 17. 罚球训练加成
    {
        id: 17,
        title: "罚球训练加成",
        description: "球队加大了罚球训练的强度，短期内罚球命中率有了明显提升。",
        weight: 8,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 4,
            stat: 'Free Throw',
            duration: 5
        }]
    },
    // 18. 豪赌失败
    {
        id: 18,
        title: "豪赌失败",
        description: "管理层在自由市场上高价签下了一名被高估的球员，他的表现远低于预期。",
        weight: 5,
        effects: [{
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: -500000 // 薪水惩罚
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 19. 球迷狂热
    {
        id: 19,
        title: "球迷狂热",
        description: "球队取得了一波连胜，主场球票销售一空，球迷的热情达到了顶点。",
        weight: 6,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 20
        }, {
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: 300000
        }]
    },
    // 20. 核心位置伤病
    {
        id: 20,
        title: "核心位置伤病",
        description: "你的首发控球后卫（PG）遭遇了严重伤病，将缺席整个赛季。",
        weight: 3,
        effects: [{
            type: 'INJURY',
            target: 'PLAYER_POSITION',
            position: 'PG',
            value: -50, // 严重影响
            duration: 50 // 赛季报销
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -20
        }]
    },
    // 21. 最佳第六人
    {
        id: 21,
        title: "最佳第六人",
        description: "你的主要替补球员打出了全明星级别的表现，成为联盟最佳第六人的有力竞争者。",
        weight: 8,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 6,
            stat: 'Clutch Rating',
            duration: 8
        }]
    },
    // 22. 糟糕的投篮选择
    {
        id: 22,
        title: "糟糕的投篮选择",
        description: "球队陷入了单打独斗的怪圈，多次出现不合理的投篮选择，进攻效率直线下降。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -5,
            stat: 'Offensive Rating',
            duration: 4
        }]
    },
    // 23. 扣篮大赛冠军
    {
        id: 23,
        title: "扣篮大赛冠军",
        description: "一名球员赢得了全明星周末的扣篮大赛冠军，为球队带来了巨大的曝光度和关注。",
        weight: 4,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 12
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 24. 财务危机
    {
        id: 24,
        title: "财务危机",
        description: "球队老板的场外投资失败，导致球队的运营资金出现紧张。",
        weight: 2,
        effects: [{
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: -2000000
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -10
        }]
    },
    // 25. 绝杀时刻
    {
        id: 25,
        title: "绝杀时刻",
        description: "球队在一场紧张刺激的比赛中，依靠一记压哨绝杀取胜，极大地鼓舞了全队士气。",
        weight: 7,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 20
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 26. 疲劳性骨折
    {
        id: 26,
        title: "疲劳性骨折",
        description: "一名内线球员因为过度劳累，被诊断出疲劳性骨折，需要长期休战。",
        weight: 5,
        effects: [{
            type: 'INJURY',
            target: 'PLAYER_POSITION',
            position: 'C',
            value: -30,
            duration: 25
        }, {
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -4,
            stat: 'Rebounding',
            duration: 25
        }]
    },
    // 27. 社交媒体风波
    {
        id: 27,
        title: "社交媒体风波",
        description: "一名球员在社交媒体上发布了不当言论，引发了公众的强烈批评。",
        weight: 10,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: -15
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 28. 训练营黑马
    {
        id: 28,
        title: "训练营黑马",
        description: "一名未被看好的自由球员在训练营中表现出色，成功赢得了球队的合同。",
        weight: 6,
        effects: [{
            type: 'PLAYER_ACQUISITION',
            target: 'TEAM',
            value: 1, // 增加一名球员
            stat: 'Depth'
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 29. 战术被破解
    {
        id: 29,
        title: "战术被破解",
        description: "对手教练组彻底研究了你的战术，在接下来的比赛中对你的球队进行了有效的限制。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -8,
            stat: 'Offensive Rating',
            duration: 5
        }]
    },
    // 30. 最佳防守球员
    {
        id: 30,
        title: "最佳防守球员",
        description: "一名球员在防守端表现出色，被认为是本赛季最佳防守球员的有力竞争者。",
        weight: 5,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 7,
            stat: 'Defensive Rating',
            duration: 10
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 31. 客场魔鬼赛程
    {
        id: 31,
        title: "客场魔鬼赛程",
        description: "球队将迎来连续五场客场对阵强队的魔鬼赛程，体能和心理都将面临巨大考验。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -6,
            stat: 'Overall Rating',
            duration: 5
        }]
    },
    // 32. 篮球名人堂来访
    {
        id: 32,
        title: "篮球名人堂来访",
        description: "一位传奇的篮球名人堂成员访问了球队训练，并与球员们进行了交流。",
        weight: 3,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 10
        }, {
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 2,
            stat: 'Motivation',
            duration: 3
        }]
    },
    // 33. 核心球员合同年
    {
        id: 33,
        title: "核心球员合同年",
        description: "一名核心球员进入合同年，为了争取下一份大合同，他的表现异常出色。",
        weight: 8,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_STAR',
            value: 8,
            stat: 'Overall Rating',
            duration: 999
        }]
    },
    // 34. 联盟罚款
    {
        id: 34,
        title: "联盟罚款",
        description: "主教练因在赛后新闻发布会上批评裁判而被联盟处以高额罚款。",
        weight: 7,
        effects: [{
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: -150000
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -3
        }]
    },
    // 35. 团队聚餐
    {
        id: 35,
        title: "团队聚餐",
        description: "球队组织了一次成功的团队聚餐，增进了球员之间的友谊和了解。",
        weight: 10,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 8
        }, {
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: 3,
            stat: 'Team Chemistry',
            duration: 4
        }]
    },
    // 36. 糟糕的饮食习惯
    {
        id: 36,
        title: "糟糕的饮食习惯",
        description: "几名年轻球员被发现有糟糕的饮食习惯，影响了他们的体能恢复。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ROOKIE',
            value: -5,
            stat: 'Stamina',
            duration: 6
        }]
    },
    // 37. 国际球员适应
    {
        id: 37,
        title: "国际球员适应",
        description: "球队的国际球员终于适应了联赛的节奏和文化，开始展现出天赋。",
        weight: 5,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 5,
            stat: 'Adaptability',
            duration: 999
        }]
    },
    // 38. 篮球训练营
    {
        id: 38,
        title: "篮球训练营",
        description: "球队在休赛期组织了一场成功的篮球训练营，吸引了大量年轻球迷。",
        weight: 4,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 10
        }, {
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: 150000
        }]
    },
    // 39. 关键三分射手手感冰冷
    {
        id: 39,
        title: "关键三分射手手感冰冷",
        description: "球队的主要三分射手陷入了投篮低谷，连续多场比赛三分命中率低于平均水平。",
        weight: 12,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_POSITION',
            position: 'SG',
            value: -6,
            stat: 'Three Point',
            duration: 5
        }]
    },
    // 40. 选秀夜的惊喜
    {
        id: 40,
        title: "选秀夜的惊喜",
        description: "在选秀大会上，球队用一个低顺位签选中了一名潜力巨大的球员，被认为是“打劫”成功。",
        weight: 3,
        effects: [{
            type: 'PLAYER_ACQUISITION',
            target: 'TEAM',
            value: 1,
            stat: 'Potential'
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 10
        }]
    },
    // 41. 禁赛处罚
    {
        id: 41,
        title: "禁赛处罚",
        description: "一名主力球员因场上不冷静行为，被联盟禁赛三场。",
        weight: 8,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_STAR',
            value: -10,
            stat: 'Availability',
            duration: 3
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 42. 队医的奇迹
    {
        id: 42,
        title: "队医的奇迹",
        description: "球队的医疗团队成功让一名受伤球员提前复出，且状态保持良好。",
        weight: 5,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_ALL',
            value: 5,
            stat: 'Health',
            duration: 999
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 43. 球队吉祥物失踪
    {
        id: 43,
        title: "球队吉祥物失踪",
        description: "球队吉祥物在一次客场比赛后神秘失踪，引发了一场小小的公关危机。",
        weight: 1,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: -3
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -2
        }]
    },
    // 44. 抢断大师
    {
        id: 44,
        title: "抢断大师",
        description: "一名后卫球员突然找到了抢断的诀窍，连续多场比赛贡献大量抢断。",
        weight: 7,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_POSITION',
            position: 'PG',
            value: 8,
            stat: 'Steal Rating',
            duration: 6
        }]
    },
    // 45. 球队大巴故障
    {
        id: 45,
        title: "球队大巴故障",
        description: "在前往客场比赛的路上，球队大巴发生故障，导致全队长时间延误，影响了赛前准备。",
        weight: 10,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: -4,
            stat: 'Stamina',
            duration: 1
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -5
        }]
    },
    // 46. 媒体日大成功
    {
        id: 46,
        title: "媒体日大成功",
        description: "球队的媒体日活动非常成功，球员们在镜头前表现出极佳的精神面貌和幽默感。",
        weight: 6,
        effects: [{
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 8
        }, {
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 5
        }]
    },
    // 47. 薪资空间优化
    {
        id: 47,
        title: "薪资空间优化",
        description: "管理层通过运作，成功清理了一份垃圾合同，为未来的引援腾出了宝贵的薪资空间。",
        weight: 3,
        effects: [{
            type: 'MONEY_CHANGE',
            target: 'TEAM',
            value: 1000000 // 节省的薪资
        }]
    },
    // 48. 关键比赛的低迷
    {
        id: 48,
        title: "关键比赛的低迷",
        description: "在对阵宿敌的关键比赛中，球队整体表现失常，以一场惨败告终。",
        weight: 15,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: -18
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: -10
        }]
    },
    // 49. 篮球之神附体
    {
        id: 49,
        title: "篮球之神附体",
        description: "一名球员在比赛中打出了不可思议的表现，仿佛被篮球之神附体，创造了多项队史纪录。",
        weight: 2,
        effects: [{
            type: 'STAT_CHANGE',
            target: 'PLAYER_STAR',
            value: 15,
            stat: 'Overall Rating',
            duration: 1
        }, {
            type: 'FAN_SUPPORT_CHANGE',
            target: 'TEAM',
            value: 15
        }]
    },
    // 50. 球队团建
    {
        id: 50,
        title: "球队团建",
        description: "球队组织了一次成功的团建活动，球员们在轻松愉快的氛围中增进了感情。",
        weight: 9,
        effects: [{
            type: 'MORALE_CHANGE',
            target: 'TEAM',
            value: 12
        }, {
            type: 'STAT_CHANGE',
            target: 'TEAM',
            value: 5,
            stat: 'Team Chemistry',
            duration: 5
        }]
    }
];