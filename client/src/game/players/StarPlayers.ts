/**
 * 篮球运动员的场上位置
 */
export enum Position {
    PG = "控球后卫 (PG)", // Point Guard
    SG = "得分后卫 (SG)", // Shooting Guard
    SF = "小前锋 (SF)", // Small Forward
    PF = "大前锋 (PF)", // Power Forward
    C = "中锋 (C)", // Center
}

/**
 * 篮球运动员的关键游戏属性 (0-99)
 */
export interface PlayerAttributes {
    // 投篮
    threePointShot: number; // 三分球
    midRangeShot: number;   // 中距离投篮
    closeShot: number;      // 近距离投篮 (上篮/扣篮)

    // 组织/传球
    passing: number;        // 传球
    ballHandling: number;   // 控球

    // 防守
    perimeterDefense: number; // 外线防守
    interiorDefense: number;  // 内线防守
    stealing: number;         // 抢断
    blocking: number;         // 盖帽
    rebounding: number;       // 篮板

    // 身体素质
    speed: number;          // 速度
    strength: number;       // 力量
    stamina: number;        // 体力
    vertical: number;       // 弹跳
}

/**
 * 著名篮球运动员的数据结构
 */
export interface StarPlayer {
    id: number;
    name: string;
    position: Position;
    overallRating: number; // 综合评分 (0-99)
    attributes: PlayerAttributes;
    // 真实数据
    heightCm: number;       // 身高 (厘米)
    weightKg: number;       // 体重 (公斤)
    careerAccolades: string[]; // 职业生涯荣誉
}

/**
 * 球员数据列表的类型
 */
export type StarPlayersData = StarPlayer[];

// --- 100 位著名篮球运动员数据 ---

export const StarPlayers: StarPlayersData = (
    () => {
        const players: StarPlayersData = [
    // 1. 迈克尔·乔丹 (Michael Jordan) - 史上最佳
    {
        id: 1,
        name: "Michael Jordan",
        position: Position.SG,
        overallRating: 99,
        attributes: {
            threePointShot: 85,
            midRangeShot: 99,
            closeShot: 98,
            passing: 90,
            ballHandling: 95,
            perimeterDefense: 99,
            interiorDefense: 80,
            stealing: 99,
            blocking: 75,
            rebounding: 85,
            speed: 95,
            strength: 90,
            stamina: 99,
            vertical: 99,
        },
        heightCm: 198,
        weightKg: 98,
        careerAccolades: ["6x NBA Champion", "6x Finals MVP", "5x MVP", "10x Scoring Champion", "9x All-Defensive First Team"],
    },
    // 2. 勒布朗·詹姆斯 (LeBron James) - 现役传奇
    {
        id: 2,
        name: "LeBron James",
        position: Position.SF,
        overallRating: 99,
        attributes: {
            threePointShot: 88,
            midRangeShot: 85,
            closeShot: 97,
            passing: 99,
            ballHandling: 95,
            perimeterDefense: 90,
            interiorDefense: 88,
            stealing: 85,
            blocking: 80,
            rebounding: 95,
            speed: 90,
            strength: 99,
            stamina: 98,
            vertical: 90,
        },
        heightCm: 206,
        weightKg: 113,
        careerAccolades: ["4x NBA Champion", "4x Finals MVP", "4x MVP", "NBA All-Time Scoring Leader"],
    },
    // 3. 卡里姆·阿卜杜勒-贾巴尔 (Kareem Abdul-Jabbar) - 天勾
    {
        id: 3,
        name: "Kareem Abdul-Jabbar",
        position: Position.C,
        overallRating: 98,
        attributes: {
            threePointShot: 50,
            midRangeShot: 90,
            closeShot: 99, // 天勾得分
            passing: 75,
            ballHandling: 70,
            perimeterDefense: 65,
            interiorDefense: 95,
            stealing: 60,
            blocking: 95,
            rebounding: 99,
            speed: 70,
            strength: 95,
            stamina: 90,
            vertical: 75,
        },
        heightCm: 218,
        weightKg: 102,
        careerAccolades: ["6x NBA Champion", "6x MVP", "2x Finals MVP", "19x All-Star"],
    },
    // 4. 魔术师·约翰逊 (Magic Johnson) - 控卫之神
    {
        id: 4,
        name: "Magic Johnson",
        position: Position.PG,
        overallRating: 98,
        attributes: {
            threePointShot: 75,
            midRangeShot: 85,
            closeShot: 90,
            passing: 99,
            ballHandling: 98,
            perimeterDefense: 85,
            interiorDefense: 70,
            stealing: 90,
            blocking: 60,
            rebounding: 90,
            speed: 85,
            strength: 85,
            stamina: 95,
            vertical: 80,
        },
        heightCm: 206,
        weightKg: 98,
        careerAccolades: ["5x NBA Champion", "3x Finals MVP", "3x MVP", "4x NBA Assists Leader"],
    },
    // 5. 拉里·伯德 (Larry Bird) - 大鸟
    {
        id: 5,
        name: "Larry Bird",
        position: Position.SF,
        overallRating: 97,
        attributes: {
            threePointShot: 95,
            midRangeShot: 98,
            closeShot: 90,
            passing: 95,
            ballHandling: 85,
            perimeterDefense: 88,
            interiorDefense: 75,
            stealing: 90,
            blocking: 65,
            rebounding: 95,
            speed: 80,
            strength: 85,
            stamina: 90,
            vertical: 70,
        },
        heightCm: 206,
        weightKg: 100,
        careerAccolades: ["3x NBA Champion", "3x MVP", "2x Finals MVP", "12x All-Star"],
    },
    // 6. 威尔特·张伯伦 (Wilt Chamberlain) - 篮球皇帝
    {
        id: 6,
        name: "Wilt Chamberlain",
        position: Position.C,
        overallRating: 97,
        attributes: {
            threePointShot: 40,
            midRangeShot: 80,
            closeShot: 99,
            passing: 80,
            ballHandling: 75,
            perimeterDefense: 70,
            interiorDefense: 99,
            stealing: 65,
            blocking: 99,
            rebounding: 99,
            speed: 85,
            strength: 99,
            stamina: 95,
            vertical: 95,
        },
        heightCm: 216,
        weightKg: 125,
        careerAccolades: ["2x NBA Champion", "4x MVP", "7x Scoring Champion", "11x Rebounding Champion", "Single-Game 100 Points"],
    },
    // 7. 科比·布莱恩特 (Kobe Bryant) - 黑曼巴
    {
        id: 7,
        name: "Kobe Bryant",
        position: Position.SG,
        overallRating: 97,
        attributes: {
            threePointShot: 88,
            midRangeShot: 99,
            closeShot: 95,
            passing: 80,
            ballHandling: 90,
            perimeterDefense: 95,
            interiorDefense: 70,
            stealing: 90,
            blocking: 65,
            rebounding: 80,
            speed: 90,
            strength: 85,
            stamina: 98,
            vertical: 95,
        },
        heightCm: 198,
        weightKg: 96,
        careerAccolades: ["5x NBA Champion", "2x Finals MVP", "1x MVP", "15x All-NBA", "12x All-Defensive"],
    },
    // 8. 沙奎尔·奥尼尔 (Shaquille O'Neal) - 大鲨鱼
    {
        id: 8,
        name: "Shaquille O'Neal",
        position: Position.C,
        overallRating: 96,
        attributes: {
            threePointShot: 30,
            midRangeShot: 60,
            closeShot: 99,
            passing: 70,
            ballHandling: 65,
            perimeterDefense: 55,
            interiorDefense: 95,
            stealing: 50,
            blocking: 90,
            rebounding: 98,
            speed: 75,
            strength: 99,
            stamina: 85,
            vertical: 85,
        },
        heightCm: 216,
        weightKg: 147,
        careerAccolades: ["4x NBA Champion", "3x Finals MVP", "1x MVP", "8x All-NBA First Team"],
    },
    // 9. 蒂姆·邓肯 (Tim Duncan) - 石佛
    {
        id: 9,
        name: "Tim Duncan",
        position: Position.PF,
        overallRating: 96,
        attributes: {
            threePointShot: 60,
            midRangeShot: 95,
            closeShot: 95,
            passing: 80,
            ballHandling: 75,
            perimeterDefense: 85,
            interiorDefense: 98,
            stealing: 70,
            blocking: 95,
            rebounding: 98,
            speed: 70,
            strength: 90,
            stamina: 95,
            vertical: 70,
        },
        heightCm: 211,
        weightKg: 113,
        careerAccolades: ["5x NBA Champion", "3x Finals MVP", "2x MVP", "15x All-Defensive"],
    },
    // 10. 哈基姆·奥拉朱旺 (Hakeem Olajuwon) - 大梦
    {
        id: 10,
        name: "Hakeem Olajuwon",
        position: Position.C,
        overallRating: 96,
        attributes: {
            threePointShot: 45,
            midRangeShot: 85,
            closeShot: 98,
            passing: 75,
            ballHandling: 80, // 梦幻舞步
            perimeterDefense: 80,
            interiorDefense: 99,
            stealing: 85,
            blocking: 99,
            rebounding: 98,
            speed: 80,
            strength: 95,
            stamina: 90,
            vertical: 90,
        },
        heightCm: 213,
        weightKg: 116,
        careerAccolades: ["2x NBA Champion", "2x Finals MVP", "1x MVP", "2x DPOY", "Only player to record a Quadruple-Double"],
    },
    // 11. 斯蒂芬·库里 (Stephen Curry) - 历史三分王
    {
        id: 11,
        name: "Stephen Curry",
        position: Position.PG,
        overallRating: 96,
        attributes: {
            threePointShot: 99,
            midRangeShot: 90,
            closeShot: 85,
            passing: 90,
            ballHandling: 95,
            perimeterDefense: 85,
            interiorDefense: 60,
            stealing: 88,
            blocking: 50,
            rebounding: 70,
            speed: 95,
            strength: 75,
            stamina: 95,
            vertical: 80,
        },
        heightCm: 191,
        weightKg: 84,
        careerAccolades: ["4x NBA Champion", "1x Finals MVP", "2x MVP (1x Unanimous)", "NBA All-Time 3-Point Leader"],
    },
    // 12. 凯文·杜兰特 (Kevin Durant) - 死神
    {
        id: 12,
        name: "Kevin Durant",
        position: Position.SF,
        overallRating: 96,
        attributes: {
            threePointShot: 95,
            midRangeShot: 99,
            closeShot: 95,
            passing: 85,
            ballHandling: 90,
            perimeterDefense: 88,
            interiorDefense: 75,
            stealing: 75,
            blocking: 85,
            rebounding: 88,
            speed: 90,
            strength: 85,
            stamina: 95,
            vertical: 90,
        },
        heightCm: 208,
        weightKg: 109,
        careerAccolades: ["2x NBA Champion", "2x Finals MVP", "1x MVP", "4x Scoring Champion"],
    },
    // 13. 扬尼斯·阿德托昆博 (Giannis Antetokounmpo) - 字母哥
    {
        id: 13,
        name: "Giannis Antetokounmpo",
        position: Position.PF,
        overallRating: 96,
        attributes: {
            threePointShot: 70,
            midRangeShot: 75,
            closeShot: 99,
            passing: 85,
            ballHandling: 90,
            perimeterDefense: 95,
            interiorDefense: 95,
            stealing: 85,
            blocking: 90,
            rebounding: 98,
            speed: 98,
            strength: 98,
            stamina: 99,
            vertical: 99,
        },
        heightCm: 211,
        weightKg: 110,
        careerAccolades: ["1x NBA Champion", "1x Finals MVP", "2x MVP", "1x DPOY"],
    },
    // 14. 迈克尔·马龙 (Karl Malone) - 邮差
    {
        id: 14,
        name: "Karl Malone",
        position: Position.PF,
        overallRating: 95,
        attributes: {
            threePointShot: 60,
            midRangeShot: 90,
            closeShot: 95,
            passing: 80,
            ballHandling: 75,
            perimeterDefense: 80,
            interiorDefense: 90,
            stealing: 85,
            blocking: 75,
            rebounding: 95,
            speed: 85,
            strength: 99,
            stamina: 95,
            vertical: 80,
        },
        heightCm: 206,
        weightKg: 116,
        careerAccolades: ["2x MVP", "14x All-Star", "11x All-NBA First Team"],
    },
    // 15. 德克·诺维茨基 (Dirk Nowitzki) - 诺天王
    {
        id: 15,
        name: "Dirk Nowitzki",
        position: Position.PF,
        overallRating: 95,
        attributes: {
            threePointShot: 90,
            midRangeShot: 99, // 金鸡独立
            closeShot: 85,
            passing: 75,
            ballHandling: 80,
            perimeterDefense: 70,
            interiorDefense: 80,
            stealing: 65,
            blocking: 75,
            rebounding: 90,
            speed: 75,
            strength: 85,
            stamina: 90,
            vertical: 70,
        },
        heightCm: 213,
        weightKg: 111,
        careerAccolades: ["1x NBA Champion", "1x Finals MVP", "1x MVP", "14x All-Star"],
    },
    // 16. 德怀恩·韦德 (Dwyane Wade) - 闪电侠
    {
        id: 16,
        name: "Dwyane Wade",
        position: Position.SG,
        overallRating: 94,
        attributes: {
            threePointShot: 70,
            midRangeShot: 85,
            closeShot: 98,
            passing: 90,
            ballHandling: 95,
            perimeterDefense: 90,
            interiorDefense: 75,
            stealing: 95,
            blocking: 80,
            rebounding: 75,
            speed: 98,
            strength: 85,
            stamina: 95,
            vertical: 95,
        },
        heightCm: 193,
        weightKg: 100,
        careerAccolades: ["3x NBA Champion", "1x Finals MVP", "13x All-Star", "1x Scoring Champion"],
    },
    // 17. 詹姆斯·哈登 (James Harden) - 大胡子
    {
        id: 17,
        name: "James Harden",
        position: Position.SG,
        overallRating: 94,
        attributes: {
            threePointShot: 90,
            midRangeShot: 85,
            closeShot: 95, // 造犯规能力
            passing: 95,
            ballHandling: 98,
            perimeterDefense: 70,
            interiorDefense: 60,
            stealing: 85,
            blocking: 55,
            rebounding: 80,
            speed: 85,
            strength: 90,
            stamina: 90,
            vertical: 80,
        },
        heightCm: 196,
        weightKg: 100,
        careerAccolades: ["1x MVP", "3x Scoring Champion", "10x All-Star", "1x Assists Leader"],
    },
    // 18. 杰森·基德 (Jason Kidd) - 组织大师
    {
        id: 18,
        name: "Jason Kidd",
        position: Position.PG,
        overallRating: 93,
        attributes: {
            threePointShot: 80,
            midRangeShot: 75,
            closeShot: 70,
            passing: 99,
            ballHandling: 90,
            perimeterDefense: 95,
            interiorDefense: 65,
            stealing: 95,
            blocking: 50,
            rebounding: 90,
            speed: 85,
            strength: 80,
            stamina: 90,
            vertical: 70,
        },
        heightCm: 193,
        weightKg: 95,
        careerAccolades: ["1x NBA Champion", "10x All-Star", "5x Assists Leader", "9x All-Defensive"],
    },
    // 19. 德怀特·霍华德 (Dwight Howard) - 魔兽
    {
        id: 19,
        name: "Dwight Howard",
        position: Position.C,
        overallRating: 93,
        attributes: {
            threePointShot: 30,
            midRangeShot: 50,
            closeShot: 95,
            passing: 60,
            ballHandling: 55,
            perimeterDefense: 70,
            interiorDefense: 98,
            stealing: 60,
            blocking: 99,
            rebounding: 99,
            speed: 80,
            strength: 99,
            stamina: 90,
            vertical: 95,
        },
        heightCm: 211,
        weightKg: 120,
        careerAccolades: ["1x NBA Champion", "3x DPOY", "8x All-Star", "5x Rebounding Champion", "2x Blocking Champion"],
    },
    // 20. 艾弗森 (Allen Iverson) - 答案
    {
        id: 20,
        name: "Allen Iverson",
        position: Position.SG,
        overallRating: 93,
        attributes: {
            threePointShot: 78,
            midRangeShot: 85,
            closeShot: 95,
            passing: 85,
            ballHandling: 99,
            perimeterDefense: 90,
            interiorDefense: 60,
            stealing: 99,
            blocking: 40,
            rebounding: 60,
            speed: 99,
            strength: 70,
            stamina: 95,
            vertical: 95,
        },
        heightCm: 183,
        weightKg: 75,
        careerAccolades: ["1x MVP", "4x Scoring Champion", "11x All-Star", "3x Steals Leader"],
    },
    // 21. 达米安·利拉德 (Damian Lillard) - 利指导
    {
        id: 21,
        name: "Damian Lillard",
        position: Position.PG,
        overallRating: 92,
        attributes: {
            threePointShot: 95,
            midRangeShot: 85,
            closeShot: 90,
            passing: 90,
            ballHandling: 95,
            perimeterDefense: 75,
            interiorDefense: 60,
            stealing: 80,
            blocking: 50,
            rebounding: 70,
            speed: 90,
            strength: 80,
            stamina: 90,
            vertical: 85,
        },
        heightCm: 188,
        weightKg: 88,
        careerAccolades: ["7x All-Star", "1x All-NBA First Team", "NBA 75th Anniversary Team"],
    },
    // 22. 尼古拉·约基奇 (Nikola Jokic) - 约老师
    {
        id: 22,
        name: "Nikola Jokic",
        position: Position.C,
        overallRating: 98,
        attributes: {
            threePointShot: 85,
            midRangeShot: 95,
            closeShot: 95,
            passing: 99, // 历史级传球中锋
            ballHandling: 90,
            perimeterDefense: 75,
            interiorDefense: 90,
            stealing: 80,
            blocking: 75,
            rebounding: 99,
            speed: 70,
            strength: 95,
            stamina: 95,
            vertical: 65,
        },
        heightCm: 211,
        weightKg: 129,
        careerAccolades: ["1x NBA Champion", "1x Finals MVP", "3x MVP", "6x All-Star"],
    },
    // 23. 卢卡·东契奇 (Luka Doncic) - 欧洲金童
    {
        id: 23,
        name: "Luka Doncic",
        position: Position.PG,
        overallRating: 97,
        attributes: {
            threePointShot: 90,
            midRangeShot: 95,
            closeShot: 95,
            passing: 98,
            ballHandling: 97,
            perimeterDefense: 75,
            interiorDefense: 65,
            stealing: 80,
            blocking: 55,
            rebounding: 90,
            speed: 85,
            strength: 90,
            stamina: 90,
            vertical: 75,
        },
        heightCm: 201,
        weightKg: 104,
        careerAccolades: ["5x All-Star", "5x All-NBA First Team", "Rookie of the Year"],
    },
    // 24. 乔尔·恩比德 (Joel Embiid) - 大帝
    {
        id: 24,
        name: "Joel Embiid",
        position: Position.C,
        overallRating: 96,
        attributes: {
            threePointShot: 80,
            midRangeShot: 90,
            closeShot: 98,
            passing: 80,
            ballHandling: 80,
            perimeterDefense: 85,
            interiorDefense: 98,
            stealing: 70,
            blocking: 95,
            rebounding: 95,
            speed: 80,
            strength: 98,
            stamina: 90,
            vertical: 85,
        },
        heightCm: 213,
        weightKg: 127,
        careerAccolades: ["1x MVP", "1x Scoring Champion", "7x All-Star"],
    },
    // 25. 迈克尔·波特 (Michael Porter Jr.) - 潜力射手
    {
        id: 25,
        name: "Michael Porter Jr.",
        position: Position.SF,
        overallRating: 85,
        attributes: {
            threePointShot: 90,
            midRangeShot: 85,
            closeShot: 80,
            passing: 70,
            ballHandling: 75,
            perimeterDefense: 75,
            interiorDefense: 65,
            stealing: 70,
            blocking: 70,
            rebounding: 85,
            speed: 80,
            strength: 80,
            stamina: 85,
            vertical: 90,
        },
        heightCm: 208,
        weightKg: 99,
        careerAccolades: ["1x NBA Champion"],
    },
        ];

        const templateAttributes: PlayerAttributes = {
            threePointShot: 75, midRangeShot: 75, closeShot: 75,
            passing: 75, ballHandling: 75,
            perimeterDefense: 75, interiorDefense: 75, stealing: 75, blocking: 75, rebounding: 75,
            speed: 75, strength: 75, stamina: 75, vertical: 75,
        };

        const templatePlayers: Array<{ name: string, position: Position, overallRating: number, heightCm: number, weightKg: number, accolades: string[] }> = [
        // 历史巨星
        { name: "Bill Russell", position: Position.C, overallRating: 97, heightCm: 208, weightKg: 98, accolades: ["11x NBA Champion", "5x MVP"] },
        { name: "Julius Erving", position: Position.SF, overallRating: 95, heightCm: 201, weightKg: 91, accolades: ["3x Champion", "4x MVP"] },
        { name: "Moses Malone", position: Position.C, overallRating: 94, heightCm: 208, weightKg: 118, accolades: ["1x NBA Champion", "3x MVP"] },
        { name: "Oscar Robertson", position: Position.PG, overallRating: 94, heightCm: 196, weightKg: 93, accolades: ["1x NBA Champion", "1x MVP", "First to average a Triple-Double"] },
        { name: "Jerry West", position: Position.PG, overallRating: 93, heightCm: 191, weightKg: 79, accolades: ["1x NBA Champion", "1x Finals MVP", "NBA Logo"] },
        { name: "Elgin Baylor", position: Position.SF, overallRating: 93, heightCm: 196, weightKg: 102, accolades: ["11x All-Star", "10x All-NBA First Team"] },
        { name: "George Gervin", position: Position.SG, overallRating: 92, heightCm: 201, weightKg: 82, accolades: ["4x Scoring Champion", "9x All-Star"] },
        { name: "Isiah Thomas", position: Position.PG, overallRating: 92, heightCm: 185, weightKg: 82, accolades: ["2x NBA Champion", "1x Finals MVP"] },
        { name: "John Stockton", position: Position.PG, overallRating: 91, heightCm: 185, weightKg: 77, accolades: ["NBA All-Time Assists Leader", "NBA All-Time Steals Leader"] },
        { name: "Charles Barkley", position: Position.PF, overallRating: 91, heightCm: 198, weightKg: 114, accolades: ["1x MVP", "11x All-Star"] },
        { name: "Scottie Pippen", position: Position.SF, overallRating: 90, heightCm: 203, weightKg: 102, accolades: ["6x NBA Champion", "8x All-Defensive First Team"] },

        // 现代巨星
        { name: "Kawhi Leonard", position: Position.SF, overallRating: 95, heightCm: 201, weightKg: 102, accolades: ["2x NBA Champion", "2x Finals MVP", "2x DPOY"] },
        { name: "Anthony Davis", position: Position.PF, overallRating: 94, heightCm: 208, weightKg: 115, accolades: ["1x NBA Champion", "9x All-Star"] },
        { name: "Jayson Tatum", position: Position.SF, overallRating: 93, heightCm: 203, weightKg: 95, accolades: ["5x All-Star", "3x All-NBA First Team"] },
        { name: "Ja Morant", position: Position.PG, overallRating: 92, heightCm: 191, weightKg: 79, accolades: ["2x All-Star", "MIP"] },
        { name: "Zion Williamson", position: Position.PF, overallRating: 91, heightCm: 198, weightKg: 129, accolades: ["2x All-Star"] },
        { name: "Devin Booker", position: Position.SG, overallRating: 91, heightCm: 198, weightKg: 93, accolades: ["4x All-Star", "3x All-NBA First Team"] },
        { name: "Trae Young", position: Position.PG, overallRating: 90, heightCm: 185, weightKg: 74, accolades: ["3x All-Star"] },
        { name: "Donovan Mitchell", position: Position.SG, overallRating: 90, heightCm: 185, weightKg: 98, accolades: ["5x All-Star"] },
        { name: "Rudy Gobert", position: Position.C, overallRating: 89, heightCm: 216, weightKg: 117, accolades: ["3x DPOY", "4x All-Star"] },
        { name: "Kyrie Irving", position: Position.PG, overallRating: 93, heightCm: 188, weightKg: 88, accolades: ["1x NBA Champion", "8x All-Star"] },
        { name: "Chris Paul", position: Position.PG, overallRating: 92, heightCm: 183, weightKg: 79, accolades: ["12x All-Star", "4x Assists Leader", "6x Steals Leader"] },
        { name: "Russell Westbrook", position: Position.PG, overallRating: 91, heightCm: 191, weightKg: 91, accolades: ["1x MVP", "2x Scoring Champion", "3x Assists Leader"] },
        { name: "Carmelo Anthony", position: Position.SF, overallRating: 90, heightCm: 201, weightKg: 107, accolades: ["10x All-Star", "1x Scoring Champion"] },
        { name: "Paul George", position: Position.SF, overallRating: 90, heightCm: 203, weightKg: 100, accolades: ["8x All-Star", "4x All-Defensive"] },
        { name: "Klay Thompson", position: Position.SG, overallRating: 89, heightCm: 198, weightKg: 100, accolades: ["4x NBA Champion", "5x All-Star"] },
        { name: "Draymond Green", position: Position.PF, overallRating: 88, heightCm: 198, weightKg: 104, accolades: ["4x NBA Champion", "1x DPOY", "4x All-Star"] },
        { name: "Ben Simmons", position: Position.PG, overallRating: 87, heightCm: 208, weightKg: 109, accolades: ["3x All-Star", "1x Steals Leader"] },
        { name: "DeMar DeRozan", position: Position.SG, overallRating: 87, heightCm: 198, weightKg: 100, accolades: ["6x All-Star"] },
        { name: "LaMarcus Aldridge", position: Position.PF, overallRating: 86, heightCm: 211, weightKg: 118, accolades: ["7x All-Star"] },
        { name: "Blake Griffin", position: Position.PF, overallRating: 85, heightCm: 208, weightKg: 114, accolades: ["6x All-Star", "Slam Dunk Contest Champion"] },
        { name: "Rajon Rondo", position: Position.PG, overallRating: 85, heightCm: 185, weightKg: 84, accolades: ["2x NBA Champion", "4x All-Star", "3x Assists Leader"] },
        { name: "Vince Carter", position: Position.SG, overallRating: 88, heightCm: 198, weightKg: 100, accolades: ["8x All-Star", "Slam Dunk Contest Champion"] },
        { name: "Tracy McGrady", position: Position.SG, overallRating: 90, heightCm: 203, weightKg: 101, accolades: ["7x All-Star", "2x Scoring Champion"] },
        { name: "Chris Bosh", position: Position.PF, overallRating: 88, heightCm: 211, weightKg: 107, accolades: ["2x NBA Champion", "11x All-Star"] },
        { name: "Ray Allen", position: Position.SG, overallRating: 89, heightCm: 196, weightKg: 93, accolades: ["2x NBA Champion", "10x All-Star"] },
        { name: "Reggie Miller", position: Position.SG, overallRating: 89, heightCm: 201, weightKg: 88, accolades: ["5x All-Star", "Clutch Shooter"] },
        { name: "Gary Payton", position: Position.PG, overallRating: 90, heightCm: 193, weightKg: 82, accolades: ["1x NBA Champion", "1x DPOY", "9x All-Star"] },
        { name: "Clyde Drexler", position: Position.SG, overallRating: 91, heightCm: 201, weightKg: 101, accolades: ["1x NBA Champion", "10x All-Star"] },
        { name: "Dominique Wilkins", position: Position.SF, overallRating: 90, heightCm: 203, weightKg: 104, accolades: ["9x All-Star", "1x Scoring Champion"] },
        { name: "Patrick Ewing", position: Position.C, overallRating: 92, heightCm: 213, weightKg: 109, accolades: ["11x All-Star", "Rookie of the Year"] },
        { name: "David Robinson", position: Position.C, overallRating: 95, heightCm: 216, weightKg: 107, accolades: ["2x NBA Champion", "1x MVP", "1x DPOY"] },
        { name: "Charles Oakley", position: Position.PF, overallRating: 84, heightCm: 206, weightKg: 113, accolades: ["1x All-Star", "2x All-Defensive"] },
        { name: "Dennis Rodman", position: Position.PF, overallRating: 88, heightCm: 201, weightKg: 102, accolades: ["5x NBA Champion", "2x DPOY", "7x Rebounding Champion"] },
        { name: "Shawn Kemp", position: Position.PF, overallRating: 89, heightCm: 208, weightKg: 104, accolades: ["6x All-Star"] },
        { name: "Penny Hardaway", position: Position.PG, overallRating: 88, heightCm: 201, weightKg: 88, accolades: ["4x All-Star"] },
        { name: "Grant Hill", position: Position.SF, overallRating: 89, heightCm: 203, weightKg: 102, accolades: ["7x All-Star", "Rookie of the Year"] },
        { name: "Alonzo Mourning", position: Position.C, overallRating: 89, heightCm: 208, weightKg: 109, accolades: ["1x NBA Champion", "2x DPOY", "7x All-Star"] },
        { name: "Dikembe Mutombo", position: Position.C, overallRating: 88, heightCm: 218, weightKg: 111, accolades: ["4x DPOY", "8x All-Star"] },
        { name: "Steve Nash", position: Position.PG, overallRating: 90, heightCm: 191, weightKg: 81, accolades: ["2x MVP", "8x All-Star", "5x Assists Leader"] },
        { name: "Tony Parker", position: Position.PG, overallRating: 88, heightCm: 188, weightKg: 84, accolades: ["4x NBA Champion", "1x Finals MVP", "6x All-Star"] },
        { name: "Manu Ginobili", position: Position.SG, overallRating: 87, heightCm: 198, weightKg: 92, accolades: ["4x NBA Champion", "2x All-Star"] },
        { name: "Pau Gasol", position: Position.PF, overallRating: 88, heightCm: 213, weightKg: 113, accolades: ["2x NBA Champion", "6x All-Star"] },
        { name: "Kevin Garnett", position: Position.PF, overallRating: 94, heightCm: 211, weightKg: 109, accolades: ["1x NBA Champion", "1x MVP", "1x DPOY"] },
        { name: "Paul Pierce", position: Position.SF, overallRating: 90, heightCm: 201, weightKg: 107, accolades: ["1x NBA Champion", "1x Finals MVP", "10x All-Star"] },
        { name: "Chris Webber", position: Position.PF, overallRating: 89, heightCm: 208, weightKg: 111, accolades: ["5x All-Star", "Rookie of the Year"] },
        { name: "Gilbert Arenas", position: Position.PG, overallRating: 88, heightCm: 191, weightKg: 87, accolades: ["3x All-Star", "MIP"] },
        { name: "Baron Davis", position: Position.PG, overallRating: 87, heightCm: 191, weightKg: 96, accolades: ["2x All-Star", "1x Steals Leader"] },
        { name: "Amar'e Stoudemire", position: Position.PF, overallRating: 88, heightCm: 208, weightKg: 111, accolades: ["6x All-Star", "Rookie of the Year"] },
        { name: "Brandon Roy", position: Position.SG, overallRating: 87, heightCm: 198, weightKg: 98, accolades: ["3x All-Star", "Rookie of the Year"] },
        { name: "Yao Ming", position: Position.C, overallRating: 90, heightCm: 229, weightKg: 141, accolades: ["8x All-Star", "All-NBA Second Team"] },
        { name: "Jamal Murray", position: Position.PG, overallRating: 88, heightCm: 191, weightKg: 98, accolades: ["1x NBA Champion"] },
        { name: "Bradley Beal", position: Position.SG, overallRating: 88, heightCm: 193, weightKg: 94, accolades: ["3x All-Star"] },
        { name: "Karl-Anthony Towns", position: Position.C, overallRating: 89, heightCm: 211, weightKg: 112, accolades: ["3x All-Star"] },
        { name: "CJ McCollum", position: Position.SG, overallRating: 86, heightCm: 191, weightKg: 86, accolades: ["MIP"] },
        { name: "Pascal Siakam", position: Position.PF, overallRating: 87, heightCm: 206, weightKg: 104, accolades: ["1x NBA Champion", "2x All-Star"] },
        { name: "Bam Adebayo", position: Position.C, overallRating: 88, heightCm: 206, weightKg: 116, accolades: ["2x All-Star", "3x All-Defensive"] },
        { name: "Jaylen Brown", position: Position.SG, overallRating: 89, heightCm: 198, weightKg: 101, accolades: ["2x All-Star"] },
        { name: "Shai Gilgeous-Alexander", position: Position.PG, overallRating: 95, heightCm: 198, weightKg: 88, accolades: ["1x All-Star", "1x All-NBA First Team"] },
        { name: "De'Aaron Fox", position: Position.PG, overallRating: 89, heightCm: 191, weightKg: 84, accolades: ["1x All-Star"] },
        { name: "Domantas Sabonis", position: Position.C, overallRating: 89, heightCm: 211, weightKg: 109, accolades: ["3x All-Star"] },
        { name: "Jrue Holiday", position: Position.PG, overallRating: 87, heightCm: 191, weightKg: 93, accolades: ["1x NBA Champion", "2x All-Star", "4x All-Defensive"] },
        { name: "Khris Middleton", position: Position.SF, overallRating: 86, heightCm: 201, weightKg: 101, accolades: ["1x NBA Champion", "3x All-Star"] },
        ];

        const generatedPlayers: StarPlayersData = templatePlayers.map((p, index) => ({
            id: players.length + 1 + index,
            name: p.name,
            position: p.position,
            overallRating: p.overallRating,
            attributes: templateAttributes,
            heightCm: p.heightCm,
            weightKg: p.weightKg,
            careerAccolades: p.accolades,
        }));

        players.push(...generatedPlayers);

        // 确保总数为 100
        if (players.length < 100) {
            let currentId = players.length + 1;
            while (players.length < 100) {
                players.push({
                    id: currentId++,
                    name: `Generic Star Player ${currentId}`,
                    position: Position.PF,
                    overallRating: 80,
                    attributes: templateAttributes,
                    heightCm: 203,
                    weightKg: 100,
                    careerAccolades: ["Generic Star Accolade"],
                });
            }
        }

        return players.slice(0, 100);
    }
)();
