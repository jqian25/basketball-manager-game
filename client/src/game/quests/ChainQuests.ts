// client/src/game/quests/ChainQuests.ts

// 奖励类型
export enum RewardType {
    EXP = "EXP",
    GOLD = "GOLD",
    SKILL_POINT = "SKILL_POINT",
    ITEM = "ITEM",
    TITLE = "TITLE",
    UNLOCK_COURT = "UNLOCK_COURT",
}

// 奖励结构
export interface Reward {
    type: RewardType;
    value: number | string; // 数值或物品/称号ID
    description: string;
}

// 任务结构
export interface Quest {
    questId: string;
    name: string;
    description: string;
    prerequisiteQuestId: string | null; // 前置任务ID，null表示链的起点
    rewards: Reward[];
}

// 任务链结构
export interface QuestChain {
    chainId: string;
    name: string;
    quests: Quest[];
}

// -----------------------------------------------------------------------------
// 任务数据
// -----------------------------------------------------------------------------

export const ChainQuests: QuestChain[] = [
    {
        chainId: "C001",
        name: "街头传奇的崛起",
        quests: [
            {
                questId: "Q00101",
                name: "初次试炼：街角单挑",
                description: "在街角球场战胜老派球手'独眼'杰克，证明你的基础能力。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 500, description: "经验值" }, { type: RewardType.GOLD, value: 100, description: "金币" }],
            },
            {
                questId: "Q00102",
                name: "招牌动作：习得交叉步",
                description: "向街头导师学习并成功掌握'疾风交叉步'技巧。",
                prerequisiteQuestId: "Q00101",
                rewards: [{ type: RewardType.EXP, value: 800, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q00103",
                name: "五人制：首次组队赛",
                description: "组织一支临时队伍，在五人制半场比赛中取得胜利。",
                prerequisiteQuestId: "Q00102",
                rewards: [{ type: RewardType.EXP, value: 1200, description: "经验值" }, { type: RewardType.ITEM, value: "StreetBall_Jersey", description: "街球背心" }],
            },
            {
                questId: "Q00104",
                name: "传奇之路：街头霸主",
                description: "击败街区最强的队伍'黑曼巴'，成为新的街头霸主。",
                prerequisiteQuestId: "Q00103",
                rewards: [{ type: RewardType.EXP, value: 2000, description: "经验值" }, { type: RewardType.TITLE, value: "Street_Legend", description: "称号：街头传奇" }],
            },
        ],
    },
    {
        chainId: "C002",
        name: "学院邀请：青训营的考验",
        quests: [
            {
                questId: "Q00201",
                name: "体能测试：地狱跑圈",
                description: "完成学院青训营的极限体能测试，证明你的耐力。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 600, description: "经验值" }, { type: RewardType.GOLD, value: 150, description: "金币" }],
            },
            {
                questId: "Q00202",
                name: "基础训练：千次投篮",
                description: "在规定时间内完成一千次中距离投篮训练，提高命中率。",
                prerequisiteQuestId: "Q00201",
                rewards: [{ type: RewardType.EXP, value: 900, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q00203",
                name: "战术理解：三角进攻",
                description: "成功执行三次复杂的'三角进攻'战术，获得教练的认可。",
                prerequisiteQuestId: "Q00202",
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.ITEM, value: "Tactics_Book_A", description: "战术手册A" }],
            },
        ],
    },
    {
        chainId: "C003",
        name: "选秀之路：大学联赛的闪耀",
        quests: [
            {
                questId: "Q00301",
                name: "首发登场：证明自己",
                description: "在大学联赛的首场比赛中，至少获得10分5助攻。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1000, description: "经验值" }, { type: RewardType.GOLD, value: 300, description: "金币" }],
            },
            {
                questId: "Q00302",
                name: "关键一击：绝杀时刻",
                description: "在比赛最后5秒内投中制胜球，完成一次绝杀。",
                prerequisiteQuestId: "Q00301",
                rewards: [{ type: RewardType.EXP, value: 1800, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 2, description: "技能点" }],
            },
            {
                questId: "Q00303",
                name: "MVP争夺：分区决赛",
                description: "带领球队赢得大学分区决赛，并被评为最有价值球员(MVP)。",
                prerequisiteQuestId: "Q00302",
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.TITLE, value: "College_MVP", description: "称号：大学MVP" }],
            },
        ],
    },
    {
        chainId: "C004",
        name: "职业生涯：新秀赛季的挑战",
        quests: [
            {
                questId: "Q00401",
                name: "选秀之夜：被选中",
                description: "成功被一支职业球队选中，开启职业生涯。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 2500, description: "经验值" }, { type: RewardType.GOLD, value: 1000, description: "金币" }],
            },
            {
                questId: "Q00402",
                name: "适应联盟：首次三双",
                description: "在职业比赛中获得生涯首次三双数据。",
                prerequisiteQuestId: "Q00401",
                rewards: [{ type: RewardType.EXP, value: 4000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 3, description: "技能点" }],
            },
            {
                questId: "Q00403",
                name: "最佳新秀：赛季结束",
                description: "在赛季结束时，赢得'年度最佳新秀'奖项。",
                prerequisiteQuestId: "Q00402",
                rewards: [{ type: RewardType.EXP, value: 6000, description: "经验值" }, { type: RewardType.TITLE, value: "Rookie_of_the_Year", description: "称号：年度最佳新秀" }],
            },
        ],
    },
    {
        chainId: "C005",
        name: "防守大师：锁死对手",
        quests: [
            {
                questId: "Q00501",
                name: "抢断训练：偷猎者",
                description: "在训练模式中，连续成功抢断5次。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 700, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q00502",
                name: "盖帽盛宴：禁飞区",
                description: "在一场比赛中，至少完成5次盖帽。",
                prerequisiteQuestId: "Q00501",
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.ITEM, value: "Defense_Shoes", description: "防守型球鞋" }],
            },
            {
                questId: "Q00503",
                name: "防守核心：最佳防守球员",
                description: "在赛季中被评选为'年度最佳防守球员'。",
                prerequisiteQuestId: "Q00502",
                rewards: [{ type: RewardType.EXP, value: 8000, description: "经验值" }, { type: RewardType.TITLE, value: "DPOY", description: "称号：最佳防守球员" }],
            },
        ],
    },
    {
        chainId: "C006",
        name: "得分机器：火力全开",
        quests: [
            {
                questId: "Q00601",
                name: "三分射手：百步穿杨",
                description: "在比赛中连续投中5个三分球。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q00602",
                name: "高分表演：50分之夜",
                description: "在一场比赛中，个人得分达到50分或更高。",
                prerequisiteQuestId: "Q00601",
                rewards: [{ type: RewardType.EXP, value: 2500, description: "经验值" }, { type: RewardType.ITEM, value: "Scoring_Gloves", description: "得分手手套" }],
            },
            {
                questId: "Q00603",
                name: "得分王：赛季最高荣誉",
                description: "赢得赛季'得分王'称号。",
                prerequisiteQuestId: "Q00602",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.TITLE, value: "Scoring_Champion", description: "称号：得分王" }],
            },
        ],
    },
    {
        chainId: "C007",
        name: "全明星周末：聚光灯下",
        quests: [
            {
                questId: "Q00701",
                name: "入选：全明星投票",
                description: "成功入选全明星正赛。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.GOLD, value: 500, description: "金币" }],
            },
            {
                questId: "Q00702",
                name: "扣篮大赛：满分飞翔",
                description: "在扣篮大赛中，获得一次满分扣篮。",
                prerequisiteQuestId: "Q00701",
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.ITEM, value: "Dunk_Trophy", description: "扣篮大赛奖杯" }],
            },
            {
                questId: "Q00703",
                name: "正赛MVP：闪耀全场",
                description: "在全明星正赛中获得MVP。",
                prerequisiteQuestId: "Q00702",
                rewards: [{ type: RewardType.EXP, value: 5000, description: "经验值" }, { type: RewardType.TITLE, value: "AllStar_MVP", description: "称号：全明星MVP" }],
            },
        ],
    },
    {
        chainId: "C008",
        name: "季后赛征程：东部/西部之王",
        quests: [
            {
                questId: "Q00801",
                name: "首轮突破：淘汰对手",
                description: "在季后赛首轮系列赛中，以4-0或4-1淘汰对手。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 4000, description: "经验值" }, { type: RewardType.GOLD, value: 800, description: "金币" }],
            },
            {
                questId: "Q00802",
                name: "分区决赛：抢七大战",
                description: "在分区决赛中，赢得决定性的第七场比赛。",
                prerequisiteQuestId: "Q00801",
                rewards: [{ type: RewardType.EXP, value: 7000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 4, description: "技能点" }],
            },
            {
                questId: "Q00803",
                name: "分区冠军：东部/西部之王",
                description: "赢得分区冠军，获得进入总决赛的资格。",
                prerequisiteQuestId: "Q00802",
                rewards: [{ type: RewardType.EXP, value: 12000, description: "经验值" }, { type: RewardType.TITLE, value: "Conference_Champion", description: "称号：分区冠军" }],
            },
        ],
    },
    {
        chainId: "C009",
        name: "总决赛：奥布莱恩杯的荣耀",
        quests: [
            {
                questId: "Q00901",
                name: "总决赛首秀：适应压力",
                description: "在总决赛首场比赛中，表现出色，避免失误。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 5000, description: "经验值" }, { type: RewardType.ITEM, value: "Finals_Ball", description: "总决赛用球" }],
            },
            {
                questId: "Q00902",
                name: "扳平比分：关键战役",
                description: "在总决赛中，赢下一场将比分扳平的关键比赛。",
                prerequisiteQuestId: "Q00901",
                rewards: [{ type: RewardType.EXP, value: 8000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 5, description: "技能点" }],
            },
            {
                questId: "Q00903",
                name: "总冠军：登顶联盟",
                description: "赢得总决赛，获得NBA总冠军。",
                prerequisiteQuestId: "Q00902",
                rewards: [{ type: RewardType.EXP, value: 20000, description: "经验值" }, { type: RewardType.TITLE, value: "NBA_Champion", description: "称号：NBA总冠军" }],
            },
            {
                questId: "Q00904",
                name: "FMVP：总决赛最有价值球员",
                description: "在赢得总冠军的同时，被评为总决赛最有价值球员(FMVP)。",
                prerequisiteQuestId: "Q00903",
                rewards: [{ type: RewardType.EXP, value: 30000, description: "经验值" }, { type: RewardType.TITLE, value: "Finals_MVP", description: "称号：FMVP" }],
            },
        ],
    },
    {
        chainId: "C010",
        name: "国际赛场：国家队的召唤",
        quests: [
            {
                questId: "Q01001",
                name: "国家队集训：适应新体系",
                description: "成功通过国家队集训，适应国际篮球规则。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 4500, description: "经验值" }, { type: RewardType.GOLD, value: 500, description: "金币" }],
            },
            {
                questId: "Q01002",
                name: "洲际赛事：小组赛出线",
                description: "带领国家队在洲际篮球赛事的小组赛中出线。",
                prerequisiteQuestId: "Q01001",
                rewards: [{ type: RewardType.EXP, value: 6500, description: "经验值" }, { type: RewardType.ITEM, value: "National_Jersey", description: "国家队球衣" }],
            },
            {
                questId: "Q01003",
                name: "奥运梦想：夺取金牌",
                description: "在奥运会篮球比赛中，带领国家队夺取金牌。",
                prerequisiteQuestId: "Q01002",
                rewards: [{ type: RewardType.EXP, value: 25000, description: "经验值" }, { type: RewardType.TITLE, value: "Olympic_Gold", description: "称号：奥运金牌得主" }],
            },
        ],
    },
    {
        chainId: "C011",
        name: "导师的教诲：传承与责任",
        quests: [
            {
                questId: "Q01101",
                name: "寻找老兵：请教经验",
                description: "找到一位退役老兵，听取他对职业生涯的建议。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1000, description: "经验值" }, { type: RewardType.GOLD, value: 200, description: "金币" }],
            },
            {
                questId: "Q01102",
                name: "指导新秀：传授技巧",
                description: "在训练中指导一名新秀球员，帮助他提升一项技能。",
                prerequisiteQuestId: "Q01101",
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 2, description: "技能点" }],
            },
            {
                questId: "Q01103",
                name: "慈善赛：回馈社区",
                description: "组织并参加一场慈善篮球赛，为社区筹集资金。",
                prerequisiteQuestId: "Q01102",
                rewards: [{ type: RewardType.EXP, value: 5000, description: "经验值" }, { type: RewardType.TITLE, value: "Community_Mentor", description: "称号：社区导师" }],
            },
        ],
    },
    {
        chainId: "C012",
        name: "打破纪录：历史留名",
        quests: [
            {
                questId: "Q01201",
                name: "单场纪录：最高助攻数",
                description: "在一场比赛中，打破球队的单场助攻纪录。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 6000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 3, description: "技能点" }],
            },
            {
                questId: "Q01202",
                name: "赛季纪录：总抢断数",
                description: "打破联盟赛季总抢断数纪录。",
                prerequisiteQuestId: "Q01201",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.ITEM, value: "Record_Breaking_Ball", description: "纪录之球" }],
            },
            {
                questId: "Q01203",
                name: "历史得分王：超越传奇",
                description: "职业生涯总得分超越历史第一人。",
                prerequisiteQuestId: "Q01202",
                rewards: [{ type: RewardType.EXP, value: 50000, description: "经验值" }, { type: RewardType.TITLE, value: "GOAT", description: "称号：历史最佳" }],
            },
        ],
    },
    {
        chainId: "C013",
        name: "伤病回归：浴火重生",
        quests: [
            {
                questId: "Q01301",
                name: "遭遇重创：接受手术",
                description: "经历一次重大伤病，成功完成手术和初期康复。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1000, description: "经验值" }, { type: RewardType.ITEM, value: "Rehab_Kit", description: "康复工具包" }],
            },
            {
                questId: "Q01302",
                name: "漫长复健：重拾力量",
                description: "完成为期半年的复健训练，恢复身体机能。",
                prerequisiteQuestId: "Q01301",
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 2, description: "技能点" }],
            },
            {
                questId: "Q01303",
                name: "王者归来：复出首战",
                description: "在复出后的首场比赛中，打出高效率表现。",
                prerequisiteQuestId: "Q01302",
                rewards: [{ type: RewardType.EXP, value: 8000, description: "经验值" }, { type: RewardType.TITLE, value: "Phoenix", description: "称号：浴火凤凰" }],
            },
        ],
    },
    {
        chainId: "C014",
        name: "交易风波：适应新环境",
        quests: [
            {
                questId: "Q01401",
                name: "意外交易：告别旧队",
                description: "被交易到一支新的球队，成功与老队友告别。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 2000, description: "经验值" }, { type: RewardType.GOLD, value: 500, description: "金币" }],
            },
            {
                questId: "Q01402",
                name: "融入战术：学习新体系",
                description: "在新的球队体系中，成功掌握并执行新的战术。",
                prerequisiteQuestId: "Q01401",
                rewards: [{ type: RewardType.EXP, value: 4000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 3, description: "技能点" }],
            },
            {
                questId: "Q01403",
                name: "面对旧主：证明价值",
                description: "在对阵旧主球队的比赛中，打出赛季最佳表现。",
                prerequisiteQuestId: "Q01402",
                rewards: [{ type: RewardType.EXP, value: 7000, description: "经验值" }, { type: RewardType.TITLE, value: "The_Betrayer", description: "称号：证明者" }],
            },
        ],
    },
    {
        chainId: "C015",
        name: "魔鬼主场：客场挑战",
        quests: [
            {
                questId: "Q01501",
                name: "噪音考验：罚球命中",
                description: "在客场魔鬼主场的巨大噪音下，罚球命中率达到90%以上。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.GOLD, value: 300, description: "金币" }],
            },
            {
                questId: "Q01502",
                name: "连胜挑战：客场三连胜",
                description: "在连续三场客场比赛中，带领球队取得胜利。",
                prerequisiteQuestId: "Q01501",
                rewards: [{ type: RewardType.EXP, value: 5000, description: "经验值" }, { type: RewardType.ITEM, value: "Travel_Bag", description: "旅行包" }],
            },
            {
                questId: "Q01503",
                name: "打破不败：终结主场连胜",
                description: "击败一支主场连胜超过10场的球队。",
                prerequisiteQuestId: "Q01502",
                rewards: [{ type: RewardType.EXP, value: 9000, description: "经验值" }, { type: RewardType.TITLE, value: "Road_Warrior", description: "称号：客场战士" }],
            },
        ],
    },
    {
        chainId: "C016",
        name: "控球之魂：组织大师",
        quests: [
            {
                questId: "Q01601",
                name: "传球训练：不看人传球",
                description: "在训练中成功完成10次不看人传球。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 800, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q01602",
                name: "助攻上双：双十表现",
                description: "在一场比赛中，得分和助攻都达到两位数（双十）。",
                prerequisiteQuestId: "Q01601",
                rewards: [{ type: RewardType.EXP, value: 2000, description: "经验值" }, { type: RewardType.ITEM, value: "Playmaker_Wristband", description: "组织者护腕" }],
            },
            {
                questId: "Q01603",
                name: "助攻王：赛季最高荣誉",
                description: "赢得赛季'助攻王'称号。",
                prerequisiteQuestId: "Q01602",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.TITLE, value: "Assist_Champion", description: "称号：助攻王" }],
            },
        ],
    },
    {
        chainId: "C017",
        name: "篮板怪兽：内线统治",
        quests: [
            {
                questId: "Q01701",
                name: "卡位训练：抢占先机",
                description: "在训练中成功卡位并抢下15个篮板。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 900, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q01702",
                name: "篮板双十：统治内线",
                description: "在一场比赛中，得分和篮板都达到两位数（双十）。",
                prerequisiteQuestId: "Q01701",
                rewards: [{ type: RewardType.EXP, value: 2200, description: "经验值" }, { type: RewardType.ITEM, value: "Rebounder_Jersey", description: "篮板手球衣" }],
            },
            {
                questId: "Q01703",
                name: "篮板王：赛季最高荣誉",
                description: "赢得赛季'篮板王'称号。",
                prerequisiteQuestId: "Q01702",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.TITLE, value: "Rebound_Champion", description: "称号：篮板王" }],
            },
        ],
    },
    {
        chainId: "C018",
        name: "球馆解锁：秘密训练场",
        quests: [
            {
                questId: "Q01801",
                name: "寻找线索：旧地图",
                description: "从一位神秘人手中获得一张关于废弃球馆的旧地图。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 500, description: "经验值" }, { type: RewardType.ITEM, value: "Old_Map", description: "旧地图" }],
            },
            {
                questId: "Q01802",
                name: "修复设施：重焕生机",
                description: "收集材料并修复废弃球馆的照明和地板。",
                prerequisiteQuestId: "Q01801",
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.GOLD, value: 500, description: "金币" }],
            },
            {
                questId: "Q01803",
                name: "秘密特训：解锁球馆",
                description: "在修复后的球馆中完成一次高强度特训。",
                prerequisiteQuestId: "Q01802",
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.UNLOCK_COURT, value: "Secret_Gym", description: "解锁秘密训练球馆" }],
            },
        ],
    },
    {
        chainId: "C019",
        name: "媒体风暴：应对质疑",
        quests: [
            {
                questId: "Q01901",
                name: "负面报道：保持冷静",
                description: "面对媒体的负面报道，连续三场比赛打出高效率表现。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 2500, description: "经验值" }, { type: RewardType.GOLD, value: 400, description: "金币" }],
            },
            {
                questId: "Q01902",
                name: "公关危机：接受专访",
                description: "接受一次高难度专访，成功扭转公众形象。",
                prerequisiteQuestId: "Q01901",
                rewards: [{ type: RewardType.EXP, value: 4500, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 2, description: "技能点" }],
            },
            {
                questId: "Q01903",
                name: "证明价值：打脸专家",
                description: "在一场全国直播的比赛中，打出爆炸性数据，让所有质疑者闭嘴。",
                prerequisiteQuestId: "Q01902",
                rewards: [{ type: RewardType.EXP, value: 8000, description: "经验值" }, { type: RewardType.TITLE, value: "Media_Darling", description: "称号：媒体宠儿" }],
            },
        ],
    },
    {
        chainId: "C020",
        name: "宿敌对决：恩怨情仇",
        quests: [
            {
                questId: "Q02001",
                name: "宿敌出现：首次交锋",
                description: "在一场比赛中，与你的宿敌进行首次对位，得分高于他。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 3000, description: "经验值" }, { type: RewardType.GOLD, value: 500, description: "金币" }],
            },
            {
                questId: "Q02002",
                name: "关键防守：锁死宿敌",
                description: "在第四节最后五分钟，成功防守宿敌，使其得分挂零。",
                prerequisiteQuestId: "Q02001",
                rewards: [{ type: RewardType.EXP, value: 6000, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 3, description: "技能点" }],
            },
            {
                questId: "Q02003",
                name: "终极对决：季后赛淘汰",
                description: "在季后赛系列赛中，淘汰宿敌所在的球队。",
                prerequisiteQuestId: "Q02002",
                rewards: [{ type: RewardType.EXP, value: 12000, description: "经验值" }, { type: RewardType.TITLE, value: "Rival_Slayer", description: "称号：宿敌终结者" }],
            },
        ],
    },
    {
        chainId: "C021",
        name: "球队领袖：更衣室的权力",
        quests: [
            {
                questId: "Q02101",
                name: "更衣室发言：鼓舞士气",
                description: "在球队连败时，在更衣室发表一次成功的鼓舞士气的演讲。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 3500, description: "经验值" }, { type: RewardType.GOLD, value: 600, description: "金币" }],
            },
            {
                questId: "Q02102",
                name: "解决矛盾：队内和解",
                description: "成功调解队内两名核心球员的矛盾。",
                prerequisiteQuestId: "Q02101",
                rewards: [{ type: RewardType.EXP, value: 5500, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 3, description: "技能点" }],
            },
            {
                questId: "Q02103",
                name: "领袖气质：带领逆转",
                description: "在落后20分的情况下，带领球队完成逆转取胜。",
                prerequisiteQuestId: "Q02102",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.TITLE, value: "Team_Captain", description: "称号：球队领袖" }],
            },
        ],
    },
    {
        chainId: "C022",
        name: "篮球哲学：技能觉醒",
        quests: [
            {
                questId: "Q02201",
                name: "冥想训练：寻找平衡",
                description: "完成一次深度冥想训练，提升对比赛的专注度。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 1500, description: "经验值" }, { type: RewardType.SKILL_POINT, value: 1, description: "技能点" }],
            },
            {
                questId: "Q02202",
                name: "哲学领悟：创造新招",
                description: "在训练中创造出一种独特的、属于自己的篮球进攻招式。",
                prerequisiteQuestId: "Q02201",
                rewards: [{ type: RewardType.EXP, value: 4000, description: "经验值" }, { type: RewardType.ITEM, value: "New_Move_Scroll", description: "新招式卷轴" }],
            },
            {
                questId: "Q02203",
                name: "技能觉醒：爆发潜能",
                description: "在一场比赛中，成功使用新招式得分，并触发'技能觉醒'状态。",
                prerequisiteQuestId: "Q02202",
                rewards: [{ type: RewardType.EXP, value: 9000, description: "经验值" }, { type: RewardType.TITLE, value: "Awakened_Talent", description: "称号：觉醒天赋" }],
            },
        ],
    },
    {
        chainId: "C023",
        name: "王朝建立：三连冠伟业",
        quests: [
            {
                questId: "Q02301",
                name: "卫冕冠军：再次登顶",
                description: "带领球队成功卫冕总冠军。",
                prerequisiteQuestId: null, // 假设前置条件是已经完成C009
                rewards: [{ type: RewardType.EXP, value: 25000, description: "经验值" }, { type: RewardType.TITLE, value: "Back_to_Back", description: "称号：卫冕冠军" }],
            },
            {
                questId: "Q02302",
                name: "三连冠：历史地位",
                description: "带领球队完成三连冠的伟业。",
                prerequisiteQuestId: "Q02301",
                rewards: [{ type: RewardType.EXP, value: 50000, description: "经验值" }, { type: RewardType.TITLE, value: "Three_Peat", description: "称号：三连冠王朝" }],
            },
        ],
    },
    {
        chainId: "C024",
        name: "自由市场：生涯抉择",
        quests: [
            {
                questId: "Q02401",
                name: "合同年：打出高光",
                description: "在合同年的赛季中，打出职业生涯最佳表现。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 7000, description: "经验值" }, { type: RewardType.GOLD, value: 2000, description: "金币" }],
            },
            {
                questId: "Q02402",
                name: "自由市场：选择新家",
                description: "在自由市场中，成功与一支有竞争力的球队签下顶薪合同。",
                prerequisiteQuestId: "Q02401",
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.ITEM, value: "Max_Contract", description: "顶薪合同" }],
            },
            {
                questId: "Q02403",
                name: "兑现承诺：新队夺冠",
                description: "在转会新队的首个赛季，带领球队夺得总冠军。",
                prerequisiteQuestId: "Q02402",
                rewards: [{ type: RewardType.EXP, value: 30000, description: "经验值" }, { type: RewardType.TITLE, value: "The_Decision", description: "称号：生涯抉择者" }],
            },
        ],
    },
    {
        chainId: "C025",
        name: "退役仪式：永恒的传奇",
        quests: [
            {
                questId: "Q02501",
                name: "谢幕战：致敬球迷",
                description: "在职业生涯的最后一场比赛中，打出精彩的表现。",
                prerequisiteQuestId: null,
                rewards: [{ type: RewardType.EXP, value: 10000, description: "经验值" }, { type: RewardType.GOLD, value: 5000, description: "金币" }],
            },
            {
                questId: "Q02502",
                name: "球衣退役：至高荣誉",
                description: "在主队球馆举行球衣退役仪式。",
                prerequisiteQuestId: "Q02501",
                rewards: [{ type: RewardType.EXP, value: 50000, description: "经验值" }, { type: RewardType.TITLE, value: "Jersey_Retired", description: "称号：球衣退役者" }],
            },
            {
                questId: "Q02503",
                name: "名人堂：不朽传奇",
                description: "成功入选奈史密斯篮球名人堂。",
                prerequisiteQuestId: "Q02502",
                rewards: [{ type: RewardType.EXP, value: 100000, description: "经验值" }, { type: RewardType.TITLE, value: "Hall_of_Famer", description: "称号：名人堂成员" }],
            },
        ],
    },
];

// 导出任务总数，方便其他模块引用
export const QUEST_COUNT = ChainQuests.reduce((count, chain) => count + chain.quests.length, 0);