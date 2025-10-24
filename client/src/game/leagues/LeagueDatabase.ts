// client/src/game/leagues/LeagueDatabase.ts

/**
 * 篮球联赛的规则配置
 */
export interface LeagueRules {
    /** 比赛总时长（分钟）。NBA/CBA为48分钟。 */
    gameDurationMinutes: number;
    /** 节数（通常为4节）。 */
    quarters: number;
    /** 每节时长（分钟）。 */
    quarterDurationMinutes: number;
    /** 加时赛时长（分钟）。 */
    overtimeDurationMinutes: number;
    /** 进攻时间（秒）。 */
    shotClockSeconds: number;
    /** 球队犯规次数上限（达到后进入罚球状态）。 */
    teamFoulLimit: number;
    /** 罚球规则（例如：'bonus_after_limit', 'clear_every_quarter'）。 */
    foulRuleType: 'NBA' | 'FIBA' | 'CBA';
    /** 允许的暂停次数。 */
    timeoutsAllowed: number;
    /** 是否启用教练挑战。 */
    coachChallengeEnabled: boolean;
    /** 联赛特有的其他规则描述。 */
    specialRules: string[];
}

/**
 * 联赛的赛程配置
 */
export interface ScheduleConfig {
    /** 常规赛比赛场次。 */
    regularSeasonGames: number;
    /** 季后赛队伍数量。 */
    playoffTeams: number;
    /** 季后赛系列赛的赛制（例如：'best_of_7', 'best_of_5'）。 */
    playoffFormat: 'best_of_7' | 'best_of_5' | 'single_elimination';
    /** 赛季开始月份。 */
    startMonth: number;
    /** 赛季结束月份。 */
    endMonth: number;
}

/**
 * 球队数据模型
 */
export interface Team {
    /** 球队ID（唯一标识）。 */
    id: string;
    /** 球队名称。 */
    name: string;
    /** 球队缩写。 */
    abbr: string;
    /** 所在城市/地区。 */
    city: string;
    /** 球队的整体能力值（用于游戏模拟）。 */
    overallRating: number;
    /** 球队的进攻风格（例如：'run_and_gun', 'half_court'）。 */
    offensiveStyle: string;
    /** 球队的防守风格（例如：'man_to_man', 'zone'）。 */
    defensiveStyle: string;
}

/**
 * 联赛数据模型
 */
export interface League {
    /** 联赛ID（唯一标识）。 */
    id: string;
    /** 联赛名称（例如：'NBA', 'CBA'）。 */
    name: string;
    /** 所在国家/地区。 */
    country: string;
    /** 联赛等级（例如：'Tier1', 'Tier2'）。 */
    tier: string;
    /** 联赛规则配置。 */
    rules: LeagueRules;
    /** 联赛赛程配置。 */
    schedule: ScheduleConfig;
    /** 联赛中的球队列表。 */
    teams: Team[];
}

/**
 * 导出数据结构：包含所有联赛的数据库
 */
export interface LeagueDatabase {
    [leagueId: string]: League;
}

// --- 模拟数据生成函数 (用于简化数据创建) ---

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[getRandomInt(0, arr.length - 1)];

const CITIES = ['洛杉矶', '波士顿', '北京', '马德里', '伊斯坦布尔', '悉尼', '里约热内卢', '多伦多', '伦敦', '巴黎', '东京', '上海', '广州', '深圳', '休斯顿', '迈阿密', '芝加哥', '达拉斯', '费城', '凤凰城'];
const TEAM_NAMES = ['猛龙', '雄鹿', '湖人', '快船', '勇士', '火箭', '独行侠', '凯尔特人', '尼克斯', '公牛', '飞虎', '金牛', '猎人', '闪电', '巨龙', '骑士', '先锋', '开拓者', '国王', '爵士'];
const OFFENSE_STYLES = ['快攻型', '半场阵地', '内外结合', '挡拆为主', '普林斯顿'];
const DEFENSE_STYLES = ['人盯人', '联防', '全场紧逼', '混合防守'];
const COUNTRIES = ['美国', '中国', '西班牙', '土耳其', '澳大利亚', '巴西', '加拿大', '英国', '法国', '日本', '国际'];

let teamIdCounter = 1;

function createMockTeam(city: string, name: string, ratingBase: number = 70): Team {
    const id = `T${teamIdCounter++}`;
    const abbr = name.substring(0, 3).toUpperCase();
    const overallRating = getRandomInt(ratingBase - 5, ratingBase + 5);

    return {
        id,
        name: name,
        abbr: abbr,
        city: city,
        overallRating,
        offensiveStyle: getRandomElement(OFFENSE_STYLES),
        defensiveStyle: getRandomElement(DEFENSE_STYLES),
    };
}

function createMockLeague(id: string, name: string, country: string, tier: string, teamCount: number, rules: LeagueRules, schedule: ScheduleConfig, ratingBase: number = 70): League {
    const teams: Team[] = [];
    const availableCities = [...CITIES];

    for (let i = 0; i < teamCount; i++) {
        const city = getRandomElement(availableCities);
        const teamName = getRandomElement(TEAM_NAMES);
        teams.push(createMockTeam(city, teamName, ratingBase));
        
        // 移除已使用的城市和队名，确保多样性
        availableCities.splice(availableCities.indexOf(city), 1);
        if (availableCities.length === 0) availableCities.push(...CITIES); // 城市用完则重置
    }

    return {
        id,
        name,
        country,
        tier,
        rules,
        schedule,
        teams,
    };
}

// --- 20个联赛的真实/模拟数据 ---

// 1. NBA (美国职业篮球联赛) - 真实数据参考
const NBA_RULES: LeagueRules = {
    gameDurationMinutes: 48,
    quarters: 4,
    quarterDurationMinutes: 12,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 5, // 每节犯规限制，或第四节最后两分钟
    foulRuleType: 'NBA',
    timeoutsAllowed: 7,
    coachChallengeEnabled: true,
    specialRules: ['防守三秒违例', '每节犯规满5次或第四节最后2分钟犯规进入罚球'],
};
const NBA_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 82,
    playoffTeams: 16,
    playoffFormat: 'best_of_7',
    startMonth: 10,
    endMonth: 6,
};
const NBA = createMockLeague('NBA', '美国职业篮球联赛', '美国', 'Tier1', 30, NBA_RULES, NBA_SCHEDULE, 90);

// 2. CBA (中国男子篮球职业联赛) - 真实数据参考
const CBA_RULES: LeagueRules = {
    gameDurationMinutes: 48,
    quarters: 4,
    quarterDurationMinutes: 12,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 4, // 每节犯规限制
    foulRuleType: 'CBA',
    timeoutsAllowed: 4,
    coachChallengeEnabled: true,
    specialRules: ['外援使用限制', '每节犯规满4次进入罚球'],
};
const CBA_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 52,
    playoffTeams: 12,
    playoffFormat: 'best_of_7',
    startMonth: 10,
    endMonth: 5,
};
const CBA = createMockLeague('CBA', '中国男子篮球职业联赛', '中国', 'Tier1', 20, CBA_RULES, CBA_SCHEDULE, 80);

// 3. EuroLeague (欧洲篮球联赛) - 真实数据参考 (FIBA规则基础)
const EURO_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 4,
    quarterDurationMinutes: 10,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 5,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 5,
    coachChallengeEnabled: false,
    specialRules: ['FIBA规则，无防守三秒'],
};
const EURO_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 34,
    playoffTeams: 8,
    playoffFormat: 'best_of_5',
    startMonth: 10,
    endMonth: 5,
};
const EURO = createMockLeague('EURO', '欧洲篮球联赛', '国际', 'Tier1', 18, EURO_RULES, EURO_SCHEDULE, 85);

// 4. LNB Pro A (法国顶级联赛)
const LNB_RULES = { ...EURO_RULES, specialRules: ['FIBA规则，本土球员保护'] };
const LNB_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 34, playoffFormat: 'best_of_5', playoffTeams: 8 };
const LNB = createMockLeague('LNB', '法国篮球甲级联赛', '法国', 'Tier2', 18, LNB_RULES, LNB_SCHEDULE, 75);

// 5. Liga ACB (西班牙顶级联赛)
const ACB_RULES = { ...EURO_RULES, specialRules: ['FIBA规则，快速攻防节奏'] };
const ACB_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 34, playoffFormat: 'best_of_5', playoffTeams: 8 };
const ACB = createMockLeague('ACB', '西班牙篮球甲级联赛', '西班牙', 'Tier2', 18, ACB_RULES, ACB_SCHEDULE, 78);

// 6. NBL (澳大利亚国家篮球联赛)
const NBL_RULES = { ...EURO_RULES, specialRules: ['FIBA规则，四分线（特殊比赛）'] };
const NBL_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 28, playoffTeams: 6, playoffFormat: 'best_of_3' };
const NBL = createMockLeague('NBL', '澳大利亚国家篮球联赛', '澳大利亚', 'Tier3', 10, NBL_RULES, NBL_SCHEDULE, 72);

// 7. VTB United League (东欧联赛)
const VTB_RULES = { ...EURO_RULES, specialRules: ['FIBA规则，多国球队参与'] };
const VTB_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 26, playoffTeams: 8, playoffFormat: 'best_of_5' };
const VTB = createMockLeague('VTB', 'VTB联合联赛', '国际', 'Tier2', 14, VTB_RULES, VTB_SCHEDULE, 76);

// 8. BBL (德国篮球联赛)
const BBL_RULES = { ...EURO_RULES };
const BBL_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 34, playoffFormat: 'best_of_5', playoffTeams: 8 };
const BBL = createMockLeague('BBL', '德国篮球甲级联赛', '德国', 'Tier3', 18, BBL_RULES, BBL_SCHEDULE, 74);

// 9. KBL (韩国篮球联赛)
const KBL_RULES = { ...CBA_RULES, foulRuleType: 'FIBA', specialRules: ['亚洲外援规则'] };
const KBL_SCHEDULE = { ...CBA_SCHEDULE, regularSeasonGames: 54, playoffTeams: 6, playoffFormat: 'best_of_5' };
const KBL = createMockLeague('KBL', '韩国篮球联赛', '韩国', 'Tier3', 10, KBL_RULES, KBL_SCHEDULE, 68);

// 10. BSL (土耳其篮球超级联赛)
const BSL_RULES = { ...EURO_RULES };
const BSL_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 30, playoffTeams: 8, playoffFormat: 'best_of_5' };
const BSL = createMockLeague('BSL', '土耳其篮球超级联赛', '土耳其', 'Tier2', 16, BSL_RULES, BSL_SCHEDULE, 77);

// 11. 虚拟联赛 - 北美次级发展联盟 (NBA G League 规则变体)
const DVL_RULES: LeagueRules = {
    gameDurationMinutes: 48,
    quarters: 4,
    quarterDurationMinutes: 12,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 5,
    foulRuleType: 'NBA',
    timeoutsAllowed: 6,
    coachChallengeEnabled: false,
    specialRules: ['双向合同球员限制', '比赛节奏更快'],
};
const DVL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 50,
    playoffTeams: 10,
    playoffFormat: 'single_elimination',
    startMonth: 11,
    endMonth: 4,
};
const DVL = createMockLeague('DVL', '发展者联盟', '美国', 'Tier2', 25, DVL_RULES, DVL_SCHEDULE, 70);

// 12. 虚拟联赛 - 亚洲精英联赛 (FIBA规则变体)
const AEL_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 4,
    quarterDurationMinutes: 10,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 4,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 4,
    coachChallengeEnabled: true,
    specialRules: ['亚洲外援和本土球员配额限制'],
};
const AEL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 24,
    playoffTeams: 8,
    playoffFormat: 'best_of_3',
    startMonth: 1,
    endMonth: 5,
};
const AEL = createMockLeague('AEL', '亚洲精英联赛', '国际', 'Tier2', 12, AEL_RULES, AEL_SCHEDULE, 73);

// 13. 虚拟联赛 - 南美洲超级联赛 (低强度FIBA规则)
const SSL_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 4,
    quarterDurationMinutes: 10,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 5,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 5,
    coachChallengeEnabled: false,
    specialRules: ['比赛强度较低，注重个人技术'],
};
const SSL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 30,
    playoffTeams: 6,
    playoffFormat: 'best_of_5',
    startMonth: 9,
    endMonth: 3,
};
const SSL = createMockLeague('SSL', '南美洲超级联赛', '巴西', 'Tier3', 15, SSL_RULES, SSL_SCHEDULE, 65);

// 14. 虚拟联赛 - 欧洲二级联赛
const EUL2_RULES = { ...EURO_RULES, teamFoulLimit: 6 };
const EUL2_SCHEDULE = { ...EURO_SCHEDULE, regularSeasonGames: 30, playoffTeams: 12, playoffFormat: 'single_elimination' };
const EUL2 = createMockLeague('EUL2', '欧洲挑战者联赛', '国际', 'Tier3', 20, EUL2_RULES, EUL2_SCHEDULE, 68);

// 15. 虚拟联赛 - 大洋洲冠军联赛
const OCL_RULES = { ...NBL_RULES, specialRules: ['FIBA规则，允许半职业球员'] };
const OCL_SCHEDULE = { ...NBL_SCHEDULE, regularSeasonGames: 20, playoffTeams: 4, playoffFormat: 'best_of_3' };
const OCL = createMockLeague('OCL', '大洋洲冠军联赛', '澳大利亚', 'Tier4', 8, OCL_RULES, OCL_SCHEDULE, 60);

// 16. 虚拟联赛 - 非洲职业联赛
const AFL_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 4,
    quarterDurationMinutes: 10,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 30, // 进攻时间更长
    teamFoulLimit: 5,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 5,
    coachChallengeEnabled: false,
    specialRules: ['比赛强度较低，注重个人技术'],
};
const AFL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 22,
    playoffTeams: 8,
    playoffFormat: 'best_of_3',
    startMonth: 9,
    endMonth: 3,
};
const AFL = createMockLeague('AFL', '非洲职业联赛', '国际', 'Tier4', 10, AFL_RULES, AFL_SCHEDULE, 62);

// 17. 虚拟联赛 - 校园篮球精英赛 (NCAA规则变体)
const CBE_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 2, // 上下半场
    quarterDurationMinutes: 20,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 30,
    teamFoulLimit: 7, // 半场犯规限制
    foulRuleType: 'NBA', // 罚球规则类似NCAA，但简化为NBA
    timeoutsAllowed: 4,
    coachChallengeEnabled: false,
    specialRules: ['无防守三秒', '半场犯规满7次进入罚球', '比赛时间为上下半场'],
};
const CBE_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 32,
    playoffTeams: 64,
    playoffFormat: 'single_elimination',
    startMonth: 11,
    endMonth: 3,
};
const CBE = createMockLeague('CBE', '校园篮球精英赛', '美国', 'Tier3', 64, CBE_RULES, CBE_SCHEDULE, 75);

// 18. 虚拟联赛 - 国际夏季联赛 (低强度，短赛程)
const ISL_RULES: LeagueRules = {
    gameDurationMinutes: 40,
    quarters: 4,
    quarterDurationMinutes: 10,
    overtimeDurationMinutes: 5,
    shotClockSeconds: 24,
    teamFoulLimit: 4,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 3,
    coachChallengeEnabled: false,
    specialRules: ['主要用于新秀和边缘球员考察', '比赛强度低'],
};
const ISL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 10,
    playoffTeams: 4,
    playoffFormat: 'single_elimination',
    startMonth: 7,
    endMonth: 8,
};
const ISL = createMockLeague('ISL', '国际夏季联赛', '国际', 'Tier5', 16, ISL_RULES, ISL_SCHEDULE, 55);

// 19. 虚拟联赛 - 欧洲业余联赛 (规则宽松)
const EAL_RULES: LeagueRules = {
    gameDurationMinutes: 32,
    quarters: 4,
    quarterDurationMinutes: 8,
    overtimeDurationMinutes: 3,
    shotClockSeconds: 35, // 进攻时间更长
    teamFoulLimit: 6,
    foulRuleType: 'FIBA',
    timeoutsAllowed: 3,
    coachChallengeEnabled: false,
    specialRules: ['规则宽松，业余球员为主'],
};
const EAL_SCHEDULE: ScheduleConfig = {
    regularSeasonGames: 18,
    playoffTeams: 8,
    playoffFormat: 'best_of_3',
    startMonth: 10,
    endMonth: 4,
};
const EAL = createMockLeague('EAL', '欧洲业余联赛', '英国', 'Tier5', 10, EAL_RULES, EAL_SCHEDULE, 50);

// 20. 虚拟联赛 - 中东超级联赛 (高外援限制)
const MESL_RULES = { ...AEL_RULES, specialRules: ['严格的外援限制', '高强度防守'] };
const MESL_SCHEDULE = { ...AEL_SCHEDULE, regularSeasonGames: 26, playoffTeams: 8, playoffFormat: 'best_of_5' };
const MESL = createMockLeague('MESL', '中东超级联赛', '国际', 'Tier3', 14, MESL_RULES, MESL_SCHEDULE, 70);


/**
 * 篮球联赛数据库
 * 包含20个联赛的数据，用于游戏系统初始化。
 */
export const LEAGUE_DATABASE: LeagueDatabase = {
    [NBA.id]: NBA,
    [CBA.id]: CBA,
    [EURO.id]: EURO,
    [LNB.id]: LNB,
    [ACB.id]: ACB,
    [NBL.id]: NBL,
    [VTB.id]: VTB,
    [BBL.id]: BBL,
    [KBL.id]: KBL,
    [BSL.id]: BSL,
    [DVL.id]: DVL,
    [AEL.id]: AEL,
    [SSL.id]: SSL,
    [EUL2.id]: EUL2,
    [OCL.id]: OCL,
    [AFL.id]: AFL,
    [CBE.id]: CBE,
    [ISL.id]: ISL,
    [EAL.id]: EAL,
    [MESL.id]: MESL,
};

// 确保导出的数据库包含20个联赛
// console.log(Object.keys(LEAGUE_DATABASE).length); // 20

// 默认导出数据库
export default LEAGUE_DATABASE;
