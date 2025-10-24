// client/src/game/achievements/AchievementDatabase.ts

/**
 * 成就类别枚举
 */
export enum AchievementCategory {
    SCORING = "得分",
    PASSING = "传球与组织",
    REBOUNDING = "篮板",
    DEFENSE = "防守",
    MILESTONE = "里程碑",
    SPECIAL = "特殊挑战",
}

/**
 * 成就数据结构接口
 */
export interface Achievement {
    id: number;
    name: string;
    description: string;
    category: AchievementCategory;
    points: number; // 成就点数
}

/**
 * 篮球主题成就数据库 (共100个)
 */
export const AchievementDatabase: Achievement[] = [
    // --------------------------------------------------
    // 1. 得分 (SCORING) - 30个
    // --------------------------------------------------

    // 基础得分
    { id: 1, name: "初次得分", description: "在比赛中首次得分。", category: AchievementCategory.SCORING, points: 5 },
    { id: 2, name: "两分专家", description: "单场比赛命中至少10个两分球。", category: AchievementCategory.SCORING, points: 10 },
    { id: 3, name: "三分射手", description: "单场比赛命中至少5个三分球。", category: AchievementCategory.SCORING, points: 15 },
    { id: 4, name: "罚球机器", description: "单场比赛罚球命中率达到100%（至少6次罚球）。", category: AchievementCategory.SCORING, points: 10 },
    { id: 5, name: "得分上双", description: "单场比赛得分达到10分或以上。", category: AchievementCategory.SCORING, points: 5 },
    { id: 6, name: "得分20+", description: "单场比赛得分达到20分或以上。", category: AchievementCategory.SCORING, points: 10 },
    { id: 7, name: "得分30+", description: "单场比赛得分达到30分或以上。", category: AchievementCategory.SCORING, points: 20 },
    { id: 8, name: "得分40+", description: "单场比赛得分达到40分或以上。", category: AchievementCategory.SCORING, points: 30 },
    { id: 9, name: "得分50+", description: "单场比赛得分达到50分或以上。", category: AchievementCategory.SCORING, points: 50 },
    { id: 10, name: "爆棚手感", description: "连续命中5个投篮。", category: AchievementCategory.SCORING, points: 15 },
    { id: 11, name: "冷血杀手", description: "在比赛最后1分钟命中制胜球。", category: AchievementCategory.SCORING, points: 25 },
    { id: 12, name: "快攻先锋", description: "通过快攻得分至少8分。", category: AchievementCategory.SCORING, points: 10 },
    { id: 13, name: "二次进攻", description: "通过抢下进攻篮板并立即得分至少5次。", category: AchievementCategory.SCORING, points: 10 },
    { id: 14, name: "内线巨兽", description: "禁区得分达到20分。", category: AchievementCategory.SCORING, points: 15 },
    { id: 15, name: "中距离大师", description: "单场比赛命中至少5个中距离投篮。", category: AchievementCategory.SCORING, points: 10 },

    // 三分球挑战
    { id: 16, name: "三分雨", description: "单场比赛命中至少8个三分球。", category: AchievementCategory.SCORING, points: 25 },
    { id: 17, name: "超远射程", description: "命中至少1个距离三分线外3英尺的投篮。", category: AchievementCategory.SCORING, points: 15 },
    { id: 18, name: "底角杀手", description: "命中至少3个底角三分。", category: AchievementCategory.SCORING, points: 10 },

    // 扣篮与上篮
    { id: 19, name: "首次扣篮", description: "在比赛中首次完成扣篮。", category: AchievementCategory.SCORING, points: 10 },
    { id: 20, name: "空中作业", description: "单场比赛完成至少3次扣篮。", category: AchievementCategory.SCORING, points: 15 },
    { id: 21, name: "反手上篮", description: "成功完成一次反手上篮。", category: AchievementCategory.SCORING, points: 5 },
    { id: 22, name: "高难度上篮", description: "在至少两名防守球员干扰下完成上篮。", category: AchievementCategory.SCORING, points: 10 },

    // 效率
    { id: 23, name: "高效输出", description: "投篮命中率超过60%（至少10次出手）。", category: AchievementCategory.SCORING, points: 15 },
    { id: 24, name: "零失误得分", description: "得分超过15分且没有失误。", category: AchievementCategory.SCORING, points: 20 },
    { id: 25, name: "得分爆炸", description: "单节得分达到15分。", category: AchievementCategory.SCORING, points: 20 },
    { id: 26, name: "打四分", description: "成功完成一次“打四分”（三分球命中并造成犯规，罚球命中）。", category: AchievementCategory.SCORING, points: 25 },
    { id: 27, name: "And One", description: "成功完成一次“打三分”（两分球命中并造成犯规，罚球命中）。", category: AchievementCategory.SCORING, points: 10 },
    { id: 28, name: "压哨绝杀", description: "在半场或全场结束时命中压哨球。", category: AchievementCategory.SCORING, points: 30 },
    { id: 29, name: "主宰比赛", description: "在所有四节比赛中都获得得分。", category: AchievementCategory.SCORING, points: 10 },
    { id: 30, name: "得分机器", description: "连续5场比赛得分超过20分。", category: AchievementCategory.SCORING, points: 35 },

    // --------------------------------------------------
    // 2. 传球与组织 (PASSING) - 20个
    // --------------------------------------------------

    // 助攻
    { id: 31, name: "首次助攻", description: "在比赛中首次送出助攻。", category: AchievementCategory.PASSING, points: 5 },
    { id: 32, name: "助攻上双", description: "单场比赛助攻达到10次或以上。", category: AchievementCategory.PASSING, points: 15 },
    { id: 33, name: "助攻大师", description: "单场比赛助攻达到15次或以上。", category: AchievementCategory.PASSING, points: 30 },
    { id: 34, name: "组织核心", description: "单场比赛助攻占全队得分的50%以上。", category: AchievementCategory.PASSING, points: 20 },
    { id: 35, name: "空接连线", description: "成功完成一次空接助攻。", category: AchievementCategory.PASSING, points: 10 },
    { id: 36, name: "不看人传球", description: "成功完成一次不看人传球助攻。", category: AchievementCategory.PASSING, points: 15 },
    { id: 37, name: "长传制导", description: "成功完成一次全场长传助攻。", category: AchievementCategory.PASSING, points: 10 },
    { id: 38, name: "连续助攻", description: "连续3次进攻回合都送出助攻。", category: AchievementCategory.PASSING, points: 15 },
    { id: 39, name: "传球盛宴", description: "单场比赛送出至少5次三分球助攻。", category: AchievementCategory.PASSING, points: 15 },
    { id: 40, name: "零失误组织", description: "送出至少8次助攻且没有失误。", category: AchievementCategory.PASSING, points: 25 },

    // 控球与失误
    { id: 41, name: "运球过人", description: "成功晃过一名防守球员并得分。", category: AchievementCategory.PASSING, points: 10 },
    { id: 42, name: "脚踝终结者", description: "运球过人导致防守球员摔倒。", category: AchievementCategory.PASSING, points: 20 },
    { id: 43, name: "稳如泰山", description: "单场比赛没有失误（至少上场15分钟）。", category: AchievementCategory.PASSING, points: 15 },
    { id: 44, name: "视野开阔", description: "单场比赛送出至少3次穿越防守的传球助攻。", category: AchievementCategory.PASSING, points: 10 },
    { id: 45, name: "全能组织", description: "助攻、得分、篮板三项数据均达到5次。", category: AchievementCategory.PASSING, points: 15 },
    { id: 46, name: "战术执行者", description: "通过执行战术配合完成得分或助攻。", category: AchievementCategory.PASSING, points: 5 },
    { id: 47, name: "二次助攻", description: "成功完成一次“二次助攻”（传球给队友，队友再传球给得分者）。", category: AchievementCategory.PASSING, points: 10 },
    { id: 48, name: "快速推进", description: "在8秒内将球推进到前场并完成得分。", category: AchievementCategory.PASSING, points: 10 },
    { id: 49, name: "节奏掌控者", description: "比赛中连续5分钟保持进攻流畅，没有失误。", category: AchievementCategory.PASSING, points: 15 },
    { id: 50, name: "控场大师", description: "单场比赛助攻数是失误数的4倍以上（至少8次助攻）。", category: AchievementCategory.PASSING, points: 25 },

    // --------------------------------------------------
    // 3. 篮板 (REBOUNDING) - 15个
    // --------------------------------------------------

    // 篮板
    { id: 51, name: "首次篮板", description: "在比赛中首次抢下篮板。", category: AchievementCategory.REBOUNDING, points: 5 },
    { id: 52, name: "篮板上双", description: "单场比赛抢下10个或以上篮板。", category: AchievementCategory.REBOUNDING, points: 10 },
    { id: 53, name: "篮板狂人", description: "单场比赛抢下15个或以上篮板。", category: AchievementCategory.REBOUNDING, points: 20 },
    { id: 54, name: "篮板怪兽", description: "单场比赛抢下20个或以上篮板。", category: AchievementCategory.REBOUNDING, points: 40 },
    { id: 55, name: "进攻篮板", description: "单场比赛抢下至少5个进攻篮板。", category: AchievementCategory.REBOUNDING, points: 15 },
    { id: 56, name: "防守堡垒", description: "单场比赛抢下至少10个防守篮板。", category: AchievementCategory.REBOUNDING, points: 10 },
    { id: 57, name: "连续篮板", description: "连续3次防守回合都抢下防守篮板。", category: AchievementCategory.REBOUNDING, points: 10 },
    { id: 58, name: "卡位专家", description: "成功卡位帮助队友抢下篮板至少5次。", category: AchievementCategory.REBOUNDING, points: 10 },
    { id: 59, name: "一波流", description: "连续抢下两个进攻篮板并完成得分。", category: AchievementCategory.REBOUNDING, points: 15 },
    { id: 60, name: "后场发动机", description: "抢下防守篮板后立即发起快攻并助攻得分。", category: AchievementCategory.REBOUNDING, points: 15 },
    { id: 61, name: "关键篮板", description: "在比赛最后1分钟抢下关键防守篮板。", category: AchievementCategory.REBOUNDING, points: 20 },
    { id: 62, name: "全场覆盖", description: "抢下篮板后立即运球到前场。", category: AchievementCategory.REBOUNDING, points: 5 },
    { id: 63, name: "篮板统治者", description: "单场比赛篮板数超过对手全队篮板数的30%。", category: AchievementCategory.REBOUNDING, points: 25 },
    { id: 64, name: "篮板+得分", description: "单场比赛得分和篮板均达到15次。", category: AchievementCategory.REBOUNDING, points: 20 },
    { id: 65, name: "篮板+助攻", description: "单场比赛篮板和助攻均达到10次。", category: AchievementCategory.REBOUNDING, points: 20 },

    // --------------------------------------------------
    // 4. 防守 (DEFENSE) - 20个
    // --------------------------------------------------

    // 抢断与盖帽
    { id: 66, name: "首次抢断", description: "在比赛中首次完成抢断。", category: AchievementCategory.DEFENSE, points: 5 },
    { id: 67, name: "抢断专家", description: "单场比赛抢断达到5次或以上。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 68, name: "抢断狂魔", description: "单场比赛抢断达到8次或以上。", category: AchievementCategory.DEFENSE, points: 30 },
    { id: 69, name: "首次盖帽", description: "在比赛中首次完成盖帽。", category: AchievementCategory.DEFENSE, points: 5 },
    { id: 70, name: "盖帽机器", description: "单场比赛盖帽达到5次或以上。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 71, name: "禁飞区", description: "单场比赛盖帽达到8次或以上。", category: AchievementCategory.DEFENSE, points: 30 },
    { id: 72, name: "抢断+得分", description: "抢断后立即完成快攻得分。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 73, name: "盖帽+篮板", description: "盖帽后立即抢下防守篮板。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 74, name: "攻防一体", description: "单场比赛抢断和盖帽均达到3次。", category: AchievementCategory.DEFENSE, points: 20 },

    // 防守表现
    { id: 75, name: "防守威慑", description: "迫使对手出现至少5次失误。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 76, name: "限制得分", description: "成功防守对手明星球员，使其得分低于其赛季平均水平。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 77, name: "防守核心", description: "在场时，球队防守效率明显提高。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 78, name: "制造进攻犯规", description: "成功制造至少2次进攻犯规。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 79, name: "关键防守", description: "在比赛最后1分钟成功防守一次关键投篮。", category: AchievementCategory.DEFENSE, points: 20 },
    { id: 80, name: "全场紧逼", description: "连续3次防守回合成功限制对手在8秒内过半场。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 81, name: "篮下保护", description: "在禁区内成功干扰对手投篮至少5次。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 82, name: "防守铁闸", description: "单场比赛抢断、盖帽、制造进攻犯规总数达到8次。", category: AchievementCategory.DEFENSE, points: 25 },
    { id: 83, name: "零封对手", description: "在防守对手一次进攻中，迫使对手24秒违例。", category: AchievementCategory.DEFENSE, points: 10 },
    { id: 84, name: "完美防守", description: "单场比赛没有犯规（至少上场15分钟）。", category: AchievementCategory.DEFENSE, points: 15 },
    { id: 85, name: "防守反击", description: "通过抢断或盖帽，直接导致球队得分。", category: AchievementCategory.DEFENSE, points: 10 },

    // --------------------------------------------------
    // 5. 里程碑 (MILESTONE) - 10个
    // --------------------------------------------------

    { id: 86, name: "生涯首胜", description: "赢得你的第一场比赛。", category: AchievementCategory.MILESTONE, points: 10 },
    { id: 87, name: "十场胜利", description: "赢得10场比赛。", category: AchievementCategory.MILESTONE, points: 20 },
    { id: 88, name: "百场战役", description: "参加100场比赛。", category: AchievementCategory.MILESTONE, points: 30 },
    { id: 89, name: "得分破千", description: "生涯总得分达到1000分。", category: AchievementCategory.MILESTONE, points: 50 },
    { id: 90, name: "助攻五百", description: "生涯总助攻达到500次。", category: AchievementCategory.MILESTONE, points: 40 },
    { id: 91, name: "篮板五百", description: "生涯总篮板达到500个。", category: AchievementCategory.MILESTONE, points: 40 },
    { id: 92, name: "三双入门", description: "首次完成三双（得分、篮板、助攻、抢断、盖帽中任三项上双）。", category: AchievementCategory.MILESTONE, points: 50 },
    { id: 93, name: "四双传奇", description: "完成四双（得分、篮板、助攻、抢断、盖帽中任四项上双）。", category: AchievementCategory.MILESTONE, points: 100 },
    { id: 94, name: "五项全能", description: "单场比赛得分、篮板、助攻、抢断、盖帽均达到5次。", category: AchievementCategory.MILESTONE, points: 75 },
    { id: 95, name: "冠军之路", description: "赢得一项锦标赛或联赛冠军。", category: AchievementCategory.MILESTONE, points: 100 },

    // --------------------------------------------------
    // 6. 特殊挑战 (SPECIAL) - 5个
    // --------------------------------------------------

    { id: 96, name: "绝地反击", description: "在落后20分的情况下最终赢得比赛。", category: AchievementCategory.SPECIAL, points: 50 },
    { id: 97, name: "完美团队", description: "全队所有上场球员都有得分。", category: AchievementCategory.SPECIAL, points: 20 },
    { id: 98, name: "零秒出手", description: "在比赛时间归零的同时命中投篮。", category: AchievementCategory.SPECIAL, points: 30 },
    { id: 99, name: "铁人", description: "单场比赛打满全场，没有休息。", category: AchievementCategory.SPECIAL, points: 25 },
    { id: 100, name: "篮球之神", description: "解锁所有其他99个成就。", category: AchievementCategory.SPECIAL, points: 200 },
];

// 导出类型和数据库
export default AchievementDatabase;