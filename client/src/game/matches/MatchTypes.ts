/**
 * client/src/game/matches/MatchTypes.ts
 * 篮球游戏系统 - 比赛类型系统定义
 *
 * 定义了15种不同的篮球比赛模式，每种模式都包含影响游戏机制、规则和数据模拟的配置。
 * 旨在符合真实篮球数据、篮球运动规则和完整的游戏机制。
 */

// 1. 比赛模式枚举 (15种)
export enum MatchMode {
    // 经典模式
    NBA_REGULAR_SEASON = 'NBA_REGULAR_SEASON', // NBA常规赛
    NBA_PLAYOFFS = 'NBA_PLAYOFFS',             // NBA季后赛
    FIBA_INTERNATIONAL = 'FIBA_INTERNATIONAL', // 国际篮联标准赛
    NCAA_COLLEGE = 'NCAA_COLLEGE',             // NCAA大学篮球

    // 特殊规则模式
    STREET_BALL_3V3 = 'STREET_BALL_3V3',       // 街头篮球3v3 (半场)
    STREET_BALL_5V5 = 'STREET_BALL_5V5',       // 街头篮球5v5 (全场，特殊规则)
    HIGH_SCHOOL_GIRLS = 'HIGH_SCHOOL_GIRLS',   // 女子高中篮球 (特殊球大小和规则)
    VETERANS_LEAGUE = 'VETERANS_LEAGUE',       // 元老联赛 (低强度，慢节奏)

    // 训练/挑战模式
    FREE_PRACTICE = 'FREE_PRACTICE',           // 自由练习模式
    SHOOTING_CHALLENGE = 'SHOOTING_CHALLENGE', // 投篮挑战赛 (H.O.R.S.E. 或三分大赛)
    DUNK_CONTEST = 'DUNK_CONTEST',             // 扣篮大赛

    // 历史/特殊事件模式
    HISTORICAL_70S = 'HISTORICAL_70S',         // 70年代历史模式 (无三分线，特殊犯规)
    ALL_STAR_GAME = 'ALL_STAR_GAME',           // 全明星赛 (高得分，低防守)
    ONE_ON_ONE_KING = 'ONE_ON_ONE_KING',       // 1v1 单挑模式 (半场)
    CUSTOM_RULESET = 'CUSTOM_RULESET',         // 完全自定义规则 (作为模板)
}

// 2. 比赛规则配置接口
export interface IMatchConfig {
    mode: MatchMode;
    name: string;
    description: string;
    
    // 规则配置 (符合篮球运动规则)
    teamSize: number;           // 场上球员人数 (e.g., 5, 3, 1)
    quarterLengthMinutes: number; // 每节比赛时长 (分钟)
    totalQuarters: number;      // 总节数 (e.g., 4)
    shotClockSeconds: number;   // 进攻时间 (秒)
    foulLimit: number;          // 全队犯规限制 (达到后进入加罚)
    isHalftime: boolean;        // 是否有中场休息 (影响暂停和体力恢复)
    hasOvertime: boolean;       // 是否有加时赛
    threePointLineDistance: number; // 三分线距离 (米)

    // 游戏机制/数据模拟配置 (影响游戏体验和数据真实性)
    ballSize: 'STANDARD' | 'WOMEN' | 'YOUTH'; // 篮球尺寸
    paceModifier: 'SLOW' | 'NORMAL' | 'FAST'; // 比赛节奏修正 (影响回合数和体力消耗)
    foulFrequency: 'LOW' | 'NORMAL' | 'HIGH'; // 犯规频率修正 (影响吹罚尺度)
    defenseIntensity: 'LOW' | 'NORMAL' | 'HIGH'; // 防守强度修正 (影响抢断和盖帽概率)
    isRatingAdjusted: boolean;   // 球员能力值是否根据模式调整 (e.g., 街球模式更看重技巧)
}

// 3. 比赛模式配置数据
export const MatchConfigs: Record<MatchMode, IMatchConfig> = {
    [MatchMode.NBA_REGULAR_SEASON]: {
        mode: MatchMode.NBA_REGULAR_SEASON,
        name: 'NBA常规赛',
        description: '标准的NBA规则，每节12分钟，高强度对抗。',
        teamSize: 5,
        quarterLengthMinutes: 12,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 5, // 个人犯规6次，全队犯规5次
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'NORMAL',
        defenseIntensity: 'HIGH',
        isRatingAdjusted: false,
    },
    [MatchMode.NBA_PLAYOFFS]: {
        mode: MatchMode.NBA_PLAYOFFS,
        name: 'NBA季后赛',
        description: '与常规赛规则相同，但比赛强度和防守专注度更高。',
        teamSize: 5,
        quarterLengthMinutes: 12,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 5,
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'NORMAL', // 季后赛节奏可能更慢，更注重阵地战
        foulFrequency: 'LOW', // 裁判吹罚尺度可能更松
        defenseIntensity: 'HIGH',
        isRatingAdjusted: false,
    },
    [MatchMode.FIBA_INTERNATIONAL]: {
        mode: MatchMode.FIBA_INTERNATIONAL,
        name: 'FIBA国际篮联标准赛',
        description: '国际篮联规则，每节10分钟，三分线更近，犯规规则不同。',
        teamSize: 5,
        quarterLengthMinutes: 10,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 4, // 全队犯规4次
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 6.75,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'HIGH', // 国际比赛吹罚相对严格
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: false,
    },
    [MatchMode.NCAA_COLLEGE]: {
        mode: MatchMode.NCAA_COLLEGE,
        name: 'NCAA大学篮球',
        description: '大学篮球规则，上下半场制，进攻时间较长。',
        teamSize: 5,
        quarterLengthMinutes: 20, // 上下半场，每半场20分钟
        totalQuarters: 2,
        shotClockSeconds: 30,
        foulLimit: 6, // 个人犯规5次，全队犯规7次后进入一加一
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 6.75,
        ballSize: 'STANDARD',
        paceModifier: 'FAST', // 强调跑轰
        foulFrequency: 'NORMAL',
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: false,
    },
    [MatchMode.STREET_BALL_3V3]: {
        mode: MatchMode.STREET_BALL_3V3,
        name: '街头篮球3v3',
        description: '半场比赛，特殊得分规则 (1分/2分)，先达到分数获胜。',
        teamSize: 3,
        quarterLengthMinutes: 0, // 基于分数或时间限制 (如10分钟或21分)
        totalQuarters: 1,
        shotClockSeconds: 12,
        foulLimit: 6,
        isHalftime: false,
        hasOvertime: true,
        threePointLineDistance: 6.75,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'LOW', // 街球犯规吹罚宽松
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: true, // 调整为更看重个人技巧
    },
    [MatchMode.STREET_BALL_5V5]: {
        mode: MatchMode.STREET_BALL_5V5,
        name: '街头篮球5v5',
        description: '全场5v5，但采用更宽松的街球规则和更高的动作自由度。',
        teamSize: 5,
        quarterLengthMinutes: 8,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 7,
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'LOW',
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: true,
    },
    [MatchMode.HIGH_SCHOOL_GIRLS]: {
        mode: MatchMode.HIGH_SCHOOL_GIRLS,
        name: '女子高中篮球',
        description: '使用女子标准球，每节8分钟，规则与FIBA类似。',
        teamSize: 5,
        quarterLengthMinutes: 8,
        totalQuarters: 4,
        shotClockSeconds: 30,
        foulLimit: 4,
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 6.25, // 高中线
        ballSize: 'WOMEN',
        paceModifier: 'NORMAL',
        foulFrequency: 'NORMAL',
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: false,
    },
    [MatchMode.VETERANS_LEAGUE]: {
        mode: MatchMode.VETERANS_LEAGUE,
        name: '元老联赛',
        description: '低强度、慢节奏的比赛，强调战术配合，减少身体对抗。',
        teamSize: 5,
        quarterLengthMinutes: 10,
        totalQuarters: 4,
        shotClockSeconds: 30,
        foulLimit: 8, // 犯规限制更高，鼓励低强度对抗
        isHalftime: true,
        hasOvertime: false, // 鼓励平局或减少加时赛
        threePointLineDistance: 6.75,
        ballSize: 'STANDARD',
        paceModifier: 'SLOW',
        foulFrequency: 'LOW',
        defenseIntensity: 'LOW',
        isRatingAdjusted: true, // 调整为更看重经验和智商
    },
    [MatchMode.FREE_PRACTICE]: {
        mode: MatchMode.FREE_PRACTICE,
        name: '自由练习模式',
        description: '无时间限制、无犯规、无得分限制的练习场。',
        teamSize: 5,
        quarterLengthMinutes: 999, // 虚拟无限时间
        totalQuarters: 1,
        shotClockSeconds: 0, // 无进攻时间
        foulLimit: 999,
        isHalftime: false,
        hasOvertime: false,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'NORMAL',
        foulFrequency: 'LOW',
        defenseIntensity: 'LOW',
        isRatingAdjusted: false,
    },
    [MatchMode.SHOOTING_CHALLENGE]: {
        mode: MatchMode.SHOOTING_CHALLENGE,
        name: '投篮挑战赛',
        description: '专注于投篮得分的挑战，如三分大赛或定点投篮。',
        teamSize: 1,
        quarterLengthMinutes: 1, // 每轮时间
        totalQuarters: 3, // 3轮
        shotClockSeconds: 0,
        foulLimit: 0,
        isHalftime: false,
        hasOvertime: false,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'LOW',
        defenseIntensity: 'LOW',
        isRatingAdjusted: true, // 仅看重投篮能力
    },
    [MatchMode.DUNK_CONTEST]: {
        mode: MatchMode.DUNK_CONTEST,
        name: '扣篮大赛',
        description: '专注于扣篮动作的评分类比赛。',
        teamSize: 1,
        quarterLengthMinutes: 0,
        totalQuarters: 1,
        shotClockSeconds: 0,
        foulLimit: 0,
        isHalftime: false,
        hasOvertime: false,
        threePointLineDistance: 0,
        ballSize: 'STANDARD',
        paceModifier: 'SLOW', // 慢动作，注重细节
        foulFrequency: 'LOW',
        defenseIntensity: 'LOW',
        isRatingAdjusted: true, // 仅看重弹跳和扣篮能力
    },
    [MatchMode.HISTORICAL_70S]: {
        mode: MatchMode.HISTORICAL_70S,
        name: '70年代历史模式',
        description: '无三分线，更注重内线和中距离，身体对抗激烈，节奏较慢。',
        teamSize: 5,
        quarterLengthMinutes: 12,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 6,
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 0, // 无三分线
        ballSize: 'STANDARD',
        paceModifier: 'SLOW',
        foulFrequency: 'HIGH', // 身体对抗多，犯规多
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: true, // 调整为更看重内线能力
    },
    [MatchMode.ALL_STAR_GAME]: {
        mode: MatchMode.ALL_STAR_GAME,
        name: '全明星赛',
        description: '高得分，低防守，娱乐性至上。',
        teamSize: 5,
        quarterLengthMinutes: 12,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 999, // 几乎不吹犯规
        isHalftime: true,
        hasOvertime: false,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'FAST',
        foulFrequency: 'LOW',
        defenseIntensity: 'LOW',
        isRatingAdjusted: false,
    },
    [MatchMode.ONE_ON_ONE_KING]: {
        mode: MatchMode.ONE_ON_ONE_KING,
        name: '1v1 单挑模式',
        description: '半场单挑，先达到分数获胜，强调个人能力。',
        teamSize: 1,
        quarterLengthMinutes: 0,
        totalQuarters: 1,
        shotClockSeconds: 10,
        foulLimit: 5,
        isHalftime: false,
        hasOvertime: true,
        threePointLineDistance: 6.75,
        ballSize: 'STANDARD',
        paceModifier: 'NORMAL',
        foulFrequency: 'NORMAL',
        defenseIntensity: 'HIGH',
        isRatingAdjusted: true, // 极度看重个人能力
    },
    [MatchMode.CUSTOM_RULESET]: {
        mode: MatchMode.CUSTOM_RULESET,
        name: '完全自定义规则',
        description: '允许玩家修改所有规则参数的模板模式。',
        teamSize: 5,
        quarterLengthMinutes: 12,
        totalQuarters: 4,
        shotClockSeconds: 24,
        foulLimit: 5,
        isHalftime: true,
        hasOvertime: true,
        threePointLineDistance: 7.24,
        ballSize: 'STANDARD',
        paceModifier: 'NORMAL',
        foulFrequency: 'NORMAL',
        defenseIntensity: 'NORMAL',
        isRatingAdjusted: false,
    },
};

// 辅助函数 (可选，用于在游戏运行时根据模式获取配置)
export function getMatchConfig(mode: MatchMode): IMatchConfig {
    const config = MatchConfigs[mode];
    if (!config) {
        // 应该永远不会发生，但为了类型安全
        throw new Error(`未找到比赛模式配置: ${mode}`);
    }
    return config;
}

// 导出所有类型和数据
export default MatchConfigs;