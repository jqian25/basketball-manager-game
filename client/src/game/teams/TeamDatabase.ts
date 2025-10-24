// client/src/game/teams/TeamDatabase.ts

/**
 * 球员位置定义
 */
export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

/**
 * 球员属性接口
 * 属性值范围建议为 1-100，代表能力强度
 */
export interface PlayerAttributes {
    // 进攻属性
    shooting3P: number; // 三分投射
    shootingMidRange: number; // 中距离投射
    drivingLayup: number; // 突破上篮/抛投
    postScoring: number; // 低位得分
    freeThrow: number; // 罚球

    // 组织/传球属性
    passing: number; // 传球视野和准确性
    ballHandling: number; // 控球和运球能力
    offensiveIQ: number; // 进攻意识/决策

    // 防守属性
    perimeterDefense: number; // 外线防守
    interiorDefense: number; // 内线防守
    stealing: number; // 抢断
    blocking: number; // 盖帽
    defensiveIQ: number; // 防守意识/轮转

    // 身体属性
    speed: number; // 速度/快攻能力
    acceleration: number; // 加速度/启动速度
    strength: number; // 力量/对抗能力
    vertical: number; // 弹跳/垂直高度
    stamina: number; // 体能/持久力

    // 篮板属性
    offensiveRebounding: number; // 进攻篮板
    defensiveRebounding: number; // 防守篮板
}

/**
 * 球员信息接口
 */
export interface Player {
    id: string; // 唯一ID
    name: string; // 姓名
    position: PlayerPosition; // 位置
    overallRating: number; // 综合能力值 (1-100)
    attributes: PlayerAttributes; // 详细属性
    age: number; // 年龄
    height: number; // 身高 (cm)
}

/**
 * 球队战术倾向
 * 影响比赛模拟中的决策
 */
export interface TeamTendencies {
    pace: number; // 比赛节奏 (1-100, 越高越快)
    threePointAttemptRate: number; // 三分球出手比例 (1-100, 越高越倾向投三分)
    insideScoringRate: number; // 内线得分比例 (1-100)
    aggressiveness: number; // 整体积极性/犯规倾向 (1-100)
    defensiveScheme: 'Man' | 'Zone' | 'SwitchAll'; // 防守策略
}

/**
 * 球队信息接口
 */
export interface Team {
    id: string; // 唯一ID，如 'LAL'
    name: string; // 球队全名
    city: string; // 城市
    roster: Player[]; // 球员名单
    tendencies: TeamTendencies; // 战术倾向
    overallRating: number; // 球队综合评分 (基于球员能力值平均或加权)
}

// --------------------------------------------------------------------------------
// 50支球队数据库
// --------------------------------------------------------------------------------

// 辅助函数：计算球员综合评分 (简化版，可根据需要调整权重)
const calculateOverallRating = (attr: PlayerAttributes): number => {
    const weights: Partial<Record<keyof PlayerAttributes, number>> = {
        shooting3P: 0.1,
        shootingMidRange: 0.05,
        drivingLayup: 0.1,
        postScoring: 0.05,
        passing: 0.05,
        ballHandling: 0.1,
        offensiveIQ: 0.1,
        perimeterDefense: 0.1,
        interiorDefense: 0.05,
        stealing: 0.05,
        blocking: 0.05,
        defensiveIQ: 0.1,
        speed: 0.05,
        strength: 0.05,
        offensiveRebounding: 0.025,
        defensiveRebounding: 0.025,
    };

    let totalScore = 0;
    let totalWeight = 0;
    
    // 确保所有属性都被计算
    for (const key in weights) {
        if (weights.hasOwnProperty(key)) {
            const attrKey = key as keyof PlayerAttributes;
            totalScore += attr[attrKey] * (weights[attrKey] || 0);
            totalWeight += (weights[attrKey] || 0);
        }
    }

    // 简单地将所有属性平均，并四舍五入
    const sumOfAttributes = Object.values(attr).reduce((sum, val) => sum + val, 0);
    const averageRating = sumOfAttributes / Object.keys(attr).length;
    
    // 采用加权平均和简单平均的折中
    return Math.round((totalScore / totalWeight + averageRating) / 2);
};


// 辅助函数：生成球员数据 (简化，用于填充50支球队)
const generatePlayer = (
    name: string, 
    position: PlayerPosition, 
    baseRating: number, 
    id: string,
    age: number,
    height: number
): Player => {
    // 基于基础评分生成属性，引入随机性 (±5)
    const generateAttr = (base: number, positionWeight: number = 1): number => {
        const value = Math.max(1, Math.min(100, base + Math.floor(Math.random() * 11) - 5));
        return Math.round(value * positionWeight);
    };

    const isGuard = position === 'PG' || position === 'SG';
    const isForward = position === 'SF' || position === 'PF';
    const isCenter = position === 'C';

    const attributes: PlayerAttributes = {
        // 进攻属性
        shooting3P: generateAttr(baseRating, isGuard ? 1.1 : (isForward ? 1.05 : 0.9)),
        shootingMidRange: generateAttr(baseRating, isGuard ? 1.05 : 1.0),
        drivingLayup: generateAttr(baseRating, isGuard ? 1.1 : 1.0),
        postScoring: generateAttr(baseRating, isCenter ? 1.1 : (isForward ? 1.05 : 0.9)),
        freeThrow: generateAttr(baseRating, 1.05),

        // 组织/传球属性
        passing: generateAttr(baseRating, isGuard ? 1.15 : 1.0),
        ballHandling: generateAttr(baseRating, isGuard ? 1.15 : 1.0),
        offensiveIQ: generateAttr(baseRating, 1.05),

        // 防守属性
        perimeterDefense: generateAttr(baseRating, isGuard ? 1.1 : (isForward ? 1.05 : 0.9)),
        interiorDefense: generateAttr(baseRating, isCenter ? 1.15 : (isForward ? 1.0 : 0.9)),
        stealing: generateAttr(baseRating, isGuard ? 1.1 : 1.0),
        blocking: generateAttr(baseRating, isCenter ? 1.15 : 1.0),
        defensiveIQ: generateAttr(baseRating, 1.05),

        // 身体属性
        speed: generateAttr(baseRating, isGuard ? 1.1 : 1.0),
        acceleration: generateAttr(baseRating, isGuard ? 1.1 : 1.0),
        strength: generateAttr(baseRating, isCenter ? 1.1 : 1.0),
        vertical: generateAttr(baseRating, 1.05),
        stamina: generateAttr(baseRating, 1.0),

        // 篮板属性
        offensiveRebounding: generateAttr(baseRating, isCenter ? 1.15 : 1.0),
        defensiveRebounding: generateAttr(baseRating, isCenter ? 1.15 : 1.0),
    };
    
    // 重新计算综合评分，以反映属性调整
    const overallRating = calculateOverallRating(attributes);

    return {
        id,
        name,
        position,
        overallRating: Math.max(60, Math.min(99, overallRating)), // 限制在 60-99 之间
        attributes,
        age,
        height,
    };
};

// 辅助函数：生成一支球队
const generateTeam = (
    id: string, 
    city: string, 
    name: string, 
    baseRating: number, 
    tendencies: TeamTendencies
): Team => {
    const teamName = `${city} ${name}`;
    const playerBaseRatings: Record<PlayerPosition, number[]> = {
        'PG': [baseRating + 5, baseRating - 5, baseRating - 10], // 首发控卫能力值最高
        'SG': [baseRating + 3, baseRating - 7, baseRating - 12],
        'SF': [baseRating + 4, baseRating - 6, baseRating - 11],
        'PF': [baseRating + 2, baseRating - 8, baseRating - 13],
        'C': [baseRating + 1, baseRating - 9, baseRating - 14],
    };
    
    // 填充剩余的替补球员，使用较低的基础评分
    for (let i = 0; i < 5; i++) {
        const positions: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C'];
        const pos = positions[i];
        playerBaseRatings[pos].push(baseRating - 15 - i, baseRating - 20 - i);
    }
    

    const roster: Player[] = [];
    let playerIdCounter = 1;

    const positions: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const playerNamesTemplate = [
        'Star Player', 'Veteran Shooter', 'Young Talent', 'Defensive Anchor', 'Role Player',
        'Bench Scorer', 'Rookie Guard', 'Backup Forward', 'Stretch Big', 'End of Bench'
    ];

    positions.forEach(pos => {
        playerBaseRatings[pos].forEach(rating => {
            const nameIndex = (playerIdCounter - 1) % playerNamesTemplate.length;
            const name = `${playerNamesTemplate[nameIndex]} ${pos} #${playerIdCounter}`;
            const id = `${id}-${playerIdCounter.toString().padStart(2, '0')}`;
            const age = Math.floor(Math.random() * 10) + 20; // 20-29岁
            const height = isGuard ? (Math.floor(Math.random() * 10) + 185) : (isCenter ? (Math.floor(Math.random() * 10) + 208) : (Math.floor(Math.random() * 10) + 198));
            roster.push(generatePlayer(name, pos, rating, id, age, height));
            playerIdCounter++;
        });
    });
    
    // 确保每队有至少12名球员 (5*3=15)
    while (roster.length < 12) {
        const pos = positions[roster.length % 5];
        const nameIndex = (playerIdCounter - 1) % playerNamesTemplate.length;
        const name = `${playerNamesTemplate[nameIndex]} ${pos} #${playerIdCounter}`;
        const id = `${id}-${playerIdCounter.toString().padStart(2, '0')}`;
        const rating = baseRating - 25;
        const age = Math.floor(Math.random() * 5) + 20;
        const height = isGuard ? (Math.floor(Math.random() * 10) + 185) : (isCenter ? (Math.floor(Math.random() * 10) + 208) : (Math.floor(Math.random() * 10) + 198));
        roster.push(generatePlayer(name, pos, rating, id, age, height));
        playerIdCounter++;
    }

    // 计算球队综合评分 (取前10名球员的平均值)
    const topPlayers = roster.sort((a, b) => b.overallRating - a.overallRating).slice(0, 10);
    const teamOverallRating = Math.round(topPlayers.reduce((sum, p) => sum + p.overallRating, 0) / topPlayers.length);

    return {
        id,
        name: teamName,
        city,
        roster,
        tendencies,
        overallRating: teamOverallRating,
    };
};

// --------------------------------------------------------------------------------
// 50支球队数据 (基于NBA和虚构的扩展联赛)
// --------------------------------------------------------------------------------

const ALL_TEAMS_DATA: Team[] = [
    // 30支NBA球队 (作为核心数据)
    generateTeam('LAL', 'Los Angeles', 'Lakers', 88, { pace: 70, threePointAttemptRate: 60, insideScoringRate: 75, aggressiveness: 75, defensiveScheme: 'Man' }),
    generateTeam('BOS', 'Boston', 'Celtics', 90, { pace: 75, threePointAttemptRate: 80, insideScoringRate: 60, aggressiveness: 80, defensiveScheme: 'SwitchAll' }),
    generateTeam('GSW', 'Golden State', 'Warriors', 85, { pace: 85, threePointAttemptRate: 90, insideScoringRate: 50, aggressiveness: 70, defensiveScheme: 'Man' }),
    generateTeam('MIL', 'Milwaukee', 'Bucks', 87, { pace: 65, threePointAttemptRate: 65, insideScoringRate: 80, aggressiveness: 78, defensiveScheme: 'Zone' }),
    generateTeam('DEN', 'Denver', 'Nuggets', 89, { pace: 70, threePointAttemptRate: 70, insideScoringRate: 70, aggressiveness: 72, defensiveScheme: 'Man' }),
    generateTeam('PHX', 'Phoenix', 'Suns', 86, { pace: 72, threePointAttemptRate: 75, insideScoringRate: 65, aggressiveness: 75, defensiveScheme: 'SwitchAll' }),
    generateTeam('PHI', 'Philadelphia', '76ers', 84, { pace: 60, threePointAttemptRate: 55, insideScoringRate: 85, aggressiveness: 85, defensiveScheme: 'Man' }),
    generateTeam('MIA', 'Miami', 'Heat', 83, { pace: 68, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 90, defensiveScheme: 'Zone' }),
    generateTeam('DAL', 'Dallas', 'Mavericks', 82, { pace: 78, threePointAttemptRate: 85, insideScoringRate: 55, aggressiveness: 65, defensiveScheme: 'Man' }),
    generateTeam('NYK', 'New York', 'Knicks', 80, { pace: 62, threePointAttemptRate: 60, insideScoringRate: 70, aggressiveness: 82, defensiveScheme: 'Man' }),
    generateTeam('TOR', 'Toronto', 'Raptors', 79, { pace: 75, threePointAttemptRate: 65, insideScoringRate: 70, aggressiveness: 70, defensiveScheme: 'SwitchAll' }),
    generateTeam('ATL', 'Atlanta', 'Hawks', 78, { pace: 80, threePointAttemptRate: 75, insideScoringRate: 60, aggressiveness: 68, defensiveScheme: 'Man' }),
    generateTeam('CHI', 'Chicago', 'Bulls', 77, { pace: 70, threePointAttemptRate: 68, insideScoringRate: 65, aggressiveness: 70, defensiveScheme: 'Man' }),
    generateTeam('CLE', 'Cleveland', 'Cavaliers', 81, { pace: 65, threePointAttemptRate: 60, insideScoringRate: 75, aggressiveness: 75, defensiveScheme: 'Zone' }),
    generateTeam('IND', 'Indiana', 'Pacers', 76, { pace: 88, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 60, defensiveScheme: 'Man' }),
    generateTeam('BKN', 'Brooklyn', 'Nets', 75, { pace: 70, threePointAttemptRate: 80, insideScoringRate: 55, aggressiveness: 65, defensiveScheme: 'SwitchAll' }),
    generateTeam('CHA', 'Charlotte', 'Hornets', 74, { pace: 82, threePointAttemptRate: 75, insideScoringRate: 55, aggressiveness: 62, defensiveScheme: 'Man' }),
    generateTeam('DET', 'Detroit', 'Pistons', 73, { pace: 65, threePointAttemptRate: 60, insideScoringRate: 70, aggressiveness: 70, defensiveScheme: 'Zone' }),
    generateTeam('ORL', 'Orlando', 'Magic', 72, { pace: 68, threePointAttemptRate: 65, insideScoringRate: 75, aggressiveness: 72, defensiveScheme: 'Man' }),
    generateTeam('WAS', 'Washington', 'Wizards', 71, { pace: 78, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 65, defensiveScheme: 'Man' }),
    generateTeam('HOU', 'Houston', 'Rockets', 70, { pace: 80, threePointAttemptRate: 85, insideScoringRate: 50, aggressiveness: 60, defensiveScheme: 'SwitchAll' }),
    generateTeam('MEM', 'Memphis', 'Grizzlies', 80, { pace: 75, threePointAttemptRate: 60, insideScoringRate: 75, aggressiveness: 88, defensiveScheme: 'Man' }),
    generateTeam('NOP', 'New Orleans', 'Pelicans', 79, { pace: 70, threePointAttemptRate: 65, insideScoringRate: 70, aggressiveness: 70, defensiveScheme: 'Zone' }),
    generateTeam('OKC', 'Oklahoma City', 'Thunder', 85, { pace: 85, threePointAttemptRate: 80, insideScoringRate: 60, aggressiveness: 70, defensiveScheme: 'Man' }),
    generateTeam('POR', 'Portland', 'Trail Blazers', 75, { pace: 72, threePointAttemptRate: 82, insideScoringRate: 58, aggressiveness: 68, defensiveScheme: 'Man' }),
    generateTeam('SAC', 'Sacramento', 'Kings', 83, { pace: 90, threePointAttemptRate: 75, insideScoringRate: 65, aggressiveness: 65, defensiveScheme: 'Man' }),
    generateTeam('SAS', 'San Antonio', 'Spurs', 70, { pace: 65, threePointAttemptRate: 60, insideScoringRate: 70, aggressiveness: 75, defensiveScheme: 'Zone' }),
    generateTeam('UTA', 'Utah', 'Jazz', 74, { pace: 78, threePointAttemptRate: 80, insideScoringRate: 55, aggressiveness: 65, defensiveScheme: 'SwitchAll' }),
    generateTeam('MIN', 'Minnesota', 'Timberwolves', 84, { pace: 68, threePointAttemptRate: 65, insideScoringRate: 80, aggressiveness: 78, defensiveScheme: 'Man' }),
    generateTeam('LAC', 'LA', 'Clippers', 86, { pace: 65, threePointAttemptRate: 75, insideScoringRate: 65, aggressiveness: 75, defensiveScheme: 'Man' }),

    // 20支虚构的扩展联赛球队 (能力值较低，用于填充50支队伍的需求)
    generateTeam('SHN', 'Shanghai', 'Sharks', 68, { pace: 70, threePointAttemptRate: 65, insideScoringRate: 70, aggressiveness: 60, defensiveScheme: 'Man' }),
    generateTeam('BEI', 'Beijing', 'Ducks', 69, { pace: 65, threePointAttemptRate: 60, insideScoringRate: 75, aggressiveness: 65, defensiveScheme: 'Zone' }),
    generateTeam('TOK', 'Tokyo', 'Samurai', 70, { pace: 75, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 68, defensiveScheme: 'SwitchAll' }),
    generateTeam('SEO', 'Seoul', 'Phoenix', 67, { pace: 80, threePointAttemptRate: 75, insideScoringRate: 55, aggressiveness: 55, defensiveScheme: 'Man' }),
    generateTeam('LON', 'London', 'Lions', 71, { pace: 60, threePointAttemptRate: 55, insideScoringRate: 80, aggressiveness: 70, defensiveScheme: 'Zone' }),
    generateTeam('PAR', 'Paris', 'Eagles', 72, { pace: 65, threePointAttemptRate: 60, insideScoringRate: 75, aggressiveness: 75, defensiveScheme: 'Man' }),
    generateTeam('MAD', 'Madrid', 'Bulls', 66, { pace: 70, threePointAttemptRate: 65, insideScoringRate: 70, aggressiveness: 60, defensiveScheme: 'SwitchAll' }),
    generateTeam('BER', 'Berlin', 'Bears', 65, { pace: 75, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 58, defensiveScheme: 'Man' }),
    generateTeam('MEX', 'Mexico City', 'Aztecs', 64, { pace: 85, threePointAttemptRate: 80, insideScoringRate: 50, aggressiveness: 50, defensiveScheme: 'Zone' }),
    generateTeam('RIO', 'Rio de Janeiro', 'Jaguars', 63, { pace: 78, threePointAttemptRate: 75, insideScoringRate: 55, aggressiveness: 52, defensiveScheme: 'Man' }),
    generateTeam('SYD', 'Sydney', 'Kookaburras', 62, { pace: 70, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 60, defensiveScheme: 'SwitchAll' }),
    generateTeam('TOR2', 'Toronto', 'Huskies', 61, { pace: 65, threePointAttemptRate: 55, insideScoringRate: 75, aggressiveness: 65, defensiveScheme: 'Zone' }),
    generateTeam('VAN', 'Vancouver', 'Grizzlies', 60, { pace: 68, threePointAttemptRate: 60, insideScoringRate: 70, aggressiveness: 62, defensiveScheme: 'Man' }),
    generateTeam('MON', 'Montreal', 'Moose', 59, { pace: 72, threePointAttemptRate: 65, insideScoringRate: 65, aggressiveness: 58, defensiveScheme: 'Man' }),
    generateTeam('SAO', 'Sao Paulo', 'Condors', 58, { pace: 80, threePointAttemptRate: 70, insideScoringRate: 60, aggressiveness: 55, defensiveScheme: 'SwitchAll' }),
    generateTeam('BUA', 'Buenos Aires', 'Pumas', 57, { pace: 75, threePointAttemptRate: 65, insideScoringRate: 65, aggressiveness: 60, defensiveScheme: 'Zone' }),
    generateTeam('CAI', 'Cairo', 'Pharaohs', 56, { pace: 60, threePointAttemptRate: 50, insideScoringRate: 80, aggressiveness: 70, defensiveScheme: 'Man' }),
    generateTeam('CAP', 'Cape Town', 'Vipers', 55, { pace: 65, threePointAttemptRate: 55, insideScoringRate: 75, aggressiveness: 65, defensiveScheme: 'Man' }),
    generateTeam('IST', 'Istanbul', 'Crescent', 54, { pace: 70, threePointAttemptRate: 60, insideScoringRate: 70, aggressiveness: 60, defensiveScheme: 'SwitchAll' }),
    generateTeam('MOS', 'Moscow', 'Bears', 53, { pace: 62, threePointAttemptRate: 55, insideScoringRate: 78, aggressiveness: 72, defensiveScheme: 'Zone' }),
];

/**
 * 球队数据库常量
 */
export const TeamDatabase: Team[] = ALL_TEAMS_DATA;

// 导出球队数量检查 (可选)
export const TEAM_COUNT = TeamDatabase.length;

// --------------------------------------------------------------------------------
// 示例用法（可选，用于测试和说明）
// --------------------------------------------------------------------------------
/*
console.log(`Total teams generated: ${TEAM_COUNT}`);
const lakers = TeamDatabase.find(t => t.id === 'LAL');
if (lakers) {
    console.log(`Team: ${lakers.name} (Rating: ${lakers.overallRating})`);
    console.log(`Tendency: Pace ${lakers.tendencies.pace}, 3P Rate ${lakers.tendencies.threePointAttemptRate}`);
    console.log('Roster (Top 3):');
    lakers.roster.slice(0, 3).forEach(p => {
        console.log(`  - ${p.name} (${p.position}, OVR: ${p.overallRating})`);
    });
}
*/