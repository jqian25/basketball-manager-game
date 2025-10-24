// client/src/game/npcs/PlayerNPCs.ts

/**
 * 篮球主题NPC数据结构定义
 */

// 1. 位置枚举
export enum Position {
  PG = "控球后卫 (PG)",
  SG = "得分后卫 (SG)",
  SF = "小前锋 (SF)",
  PF = "大前锋 (PF)",
  C = "中锋 (C)",
}

// 2. 风格枚举
export enum Style {
  Shooter = "射手",
  Slasher = "突破手",
  Playmaker = "组织者",
  Defender = "防守专家",
  Rebounder = "篮板手",
  AllAround = "全能",
}

// 3. 外观接口
export interface Appearance {
  height: number; // 身高 (cm)
  weight: number; // 体重 (kg)
  jerseyNumber: number; // 球衣号码
  skinColor: string; // 肤色描述 (e.g., "古铜色", "浅棕色")
  hairStyle: string; // 发型 (e.g., "爆炸头", "寸头")
}

// 4. 性格接口
export interface Personality {
  trait: string; // 主要性格特质 (e.g., "冷静", "火爆", "幽默")
  motto: string; // 座右铭或口头禅
  aggressiveness: number; // 侵略性 (1-10)
  teamwork: number; // 团队合作 (1-10)
}

// 5. 对话接口
export interface Dialogue {
  greeting: string; // 首次见面台词
  winQuote: string; // 胜利后台词
  loseQuote: string; // 失败后台词
  advice: string; // 给予玩家的建议
}

// 6. 行为模式接口
export interface BehaviorPattern {
  primaryAction: string; // 主要球场行为 (e.g., "三分投射", "内线强攻", "快攻组织")
  offenseTendency: number; // 进攻倾向 (1-10)
  defenseTendency: number; // 防守倾向 (1-10)
  signatureMove: string; // 招牌动作
}

// 7. 完整的球员NPC接口
export interface PlayerNPC {
  id: string; // 唯一ID
  name: string; // 姓名
  position: Position; // 位置
  style: Style; // 风格
  appearance: Appearance; // 外观
  personality: Personality; // 性格
  dialogue: Dialogue; // 对话
  behavior: BehaviorPattern; // 行为模式
  overallRating: number; // 综合能力评分 (1-100)
}

// 8. 球员NPC数据库 (30个NPC数据)
export const PlayerNPCs: PlayerNPC[] = [
  // PG - 组织者/Playmaker (1-6)
  {
    id: "NPC001",
    name: "林风",
    position: Position.PG,
    style: Style.Playmaker,
    overallRating: 92,
    appearance: { height: 188, weight: 85, jerseyNumber: 1, skinColor: "浅棕色", hairStyle: "清爽短发" },
    personality: { trait: "冷静", motto: "球场上的大脑，永远比对手多想一步。", aggressiveness: 4, teamwork: 10 },
    dialogue: {
      greeting: "你好，我是林风，需要我帮你理清进攻思路吗？",
      winQuote: "完美的战术执行，胜利属于团队！",
      loseQuote: "没关系，下次我们从失误中学习。",
      advice: "永远保持视野开阔，传球是艺术。",
    },
    behavior: { primaryAction: "挡拆后传球", offenseTendency: 7, defenseTendency: 6, signatureMove: "不看人传球" },
  },
  {
    id: "NPC002",
    name: "闪电侠·李",
    position: Position.PG,
    style: Style.Slasher,
    overallRating: 88,
    appearance: { height: 183, weight: 78, jerseyNumber: 3, skinColor: "古铜色", hairStyle: "莫西干头" },
    personality: { trait: "冲动", motto: "速度就是我的武器，没人能追上我。", aggressiveness: 9, teamwork: 6 },
    dialogue: {
      greeting: "别浪费时间，直接开始吧！",
      winQuote: "我冲破了所有防线！",
      loseQuote: "可恶，我的速度还不够快！",
      advice: "第一步加速，让防守人吃灰。",
    },
    behavior: { primaryAction: "全速突破上篮", offenseTendency: 9, defenseTendency: 5, signatureMove: "高速变向过人" },
  },
  {
    id: "NPC003",
    name: "老炮儿·王",
    position: Position.PG,
    style: Style.Defender,
    overallRating: 85,
    appearance: { height: 190, weight: 88, jerseyNumber: 12, skinColor: "健康肤色", hairStyle: "光头" },
    personality: { trait: "坚韧", motto: "想得分？先从我身上跨过去！", aggressiveness: 7, teamwork: 8 },
    dialogue: {
      greeting: "我是老王，防守从我这里开始。",
      winQuote: "让他们感受一下窒息的防守。",
      loseQuote: "防守端还有漏洞，这是我的责任。",
      advice: "贴紧他，别给他任何舒服出手的空间。",
    },
    behavior: { primaryAction: "贴身紧逼抢断", offenseTendency: 4, defenseTendency: 10, signatureMove: "死亡缠绕" },
  },
  {
    id: "NPC004",
    name: "三分机器·张",
    position: Position.PG,
    style: Style.Shooter,
    overallRating: 89,
    appearance: { height: 185, weight: 80, jerseyNumber: 11, skinColor: "白皙", hairStyle: "中分" },
    personality: { trait: "自信", motto: "只要球在我手上，三分线就是我的得分区。", aggressiveness: 8, teamwork: 7 },
    dialogue: {
      greeting: "需要火力支援吗？我随时准备就绪。",
      winQuote: "三分为王，射穿一切！",
      loseQuote: "手感冰冷，下次要找回准星。",
      advice: "跑位，接球，出手，一气呵成。",
    },
    behavior: { primaryAction: "无球跑位接球投篮", offenseTendency: 9, defenseTendency: 5, signatureMove: "超远三分" },
  },
  {
    id: "NPC005",
    name: "全能小黑",
    position: Position.PG,
    style: Style.AllAround,
    overallRating: 90,
    appearance: { height: 186, weight: 82, jerseyNumber: 0, skinColor: "深棕色", hairStyle: "小脏辫" },
    personality: { trait: "随和", motto: "我能做任何事，但最喜欢赢。", aggressiveness: 6, teamwork: 9 },
    dialogue: {
      greeting: "嗨，我是小黑，告诉我你想怎么打。",
      winQuote: "每个人都发挥了作用，这就是篮球。",
      loseQuote: "我们打得不够聪明，下次调整。",
      advice: "不要被一个位置限制，学着去适应比赛。",
    },
    behavior: { primaryAction: "组织与得分并重", offenseTendency: 8, defenseTendency: 8, signatureMove: "欧洲步" },
  },
  {
    id: "NPC006",
    name: "控卫导师·陈",
    position: Position.PG,
    style: Style.Playmaker,
    overallRating: 87,
    appearance: { height: 191, weight: 86, jerseyNumber: 2, skinColor: "浅棕色", hairStyle: "背头" },
    personality: { trait: "稳重", motto: "耐心是最好的组织武器。", aggressiveness: 3, teamwork: 10 },
    dialogue: {
      greeting: "欢迎，我来为你指引方向。",
      winQuote: "我们掌控了节奏，胜利自然到来。",
      loseQuote: "节奏被打乱了，这是最大的问题。",
      advice: "慢下来，观察防守，再做决定。",
    },
    behavior: { primaryAction: "半场阵地组织", offenseTendency: 5, defenseTendency: 7, signatureMove: "精准长传" },
  },
  // SG - 射手/Shooter (7-12)
  {
    id: "NPC007",
    name: "得分机器·赵",
    position: Position.SG,
    style: Style.Shooter,
    overallRating: 95,
    appearance: { height: 196, weight: 95, jerseyNumber: 24, skinColor: "健康肤色", hairStyle: "短卷发" },
    personality: { trait: "高傲", motto: "我的投篮，就是比赛的终结者。", aggressiveness: 10, teamwork: 5 },
    dialogue: {
      greeting: "把球给我，看我表演。",
      winQuote: "我早就知道会是这个结果。",
      loseQuote: "队友的配合太差了。",
      advice: "出手时机不重要，重要的是能投进。",
    },
    behavior: { primaryAction: "高难度中远距离跳投", offenseTendency: 10, defenseTendency: 4, signatureMove: "后仰跳投" },
  },
  {
    id: "NPC008",
    name: "侧翼猎手·吴",
    position: Position.SG,
    style: Style.AllAround,
    overallRating: 89,
    appearance: { height: 198, weight: 98, jerseyNumber: 9, skinColor: "浅棕色", hairStyle: "平头" },
    personality: { trait: "实用", motto: "得分，防守，我都能来一点。", aggressiveness: 7, teamwork: 8 },
    dialogue: {
      greeting: "侧翼交给我，我会让对手很难受。",
      winQuote: "一场硬仗，我们赢了。",
      loseQuote: "下次要更专注，特别是关键时刻。",
      advice: "利用你的身体优势，在攻防两端都保持压力。",
    },
    behavior: { primaryAction: "空切和转换进攻", offenseTendency: 8, defenseTendency: 7, signatureMove: "底线突破" },
  },
  {
    id: "NPC009",
    name: "防守尖兵·周",
    position: Position.SG,
    style: Style.Defender,
    overallRating: 86,
    appearance: { height: 195, weight: 93, jerseyNumber: 5, skinColor: "古铜色", hairStyle: "板寸" },
    personality: { trait: "专注", motto: "防守赢得总冠军。", aggressiveness: 6, teamwork: 9 },
    dialogue: {
      greeting: "来吧，让我看看你的进攻手段。",
      winQuote: "我们锁死了对手，干得漂亮！",
      loseQuote: "我的防守还不够完美。",
      advice: "预判对手的传球路线，制造抢断。",
    },
    behavior: { primaryAction: "外线单防与协防", offenseTendency: 5, defenseTendency: 10, signatureMove: "盖帽式抢断" },
  },
  {
    id: "NPC010",
    name: "暴扣狂人·郑",
    position: Position.SG,
    style: Style.Slasher,
    overallRating: 91,
    appearance: { height: 193, weight: 90, jerseyNumber: 23, skinColor: "深棕色", hairStyle: "爆炸头" },
    personality: { trait: "激情", motto: "没有什么比扣篮更能点燃全场了！", aggressiveness: 10, teamwork: 6 },
    dialogue: {
      greeting: "准备好迎接一场空中表演了吗？",
      winQuote: "胜利属于天空之王！",
      loseQuote: "地面战术太多了，我需要飞起来。",
      advice: "不要害怕身体接触，冲进去！",
    },
    behavior: { primaryAction: "持球突破暴扣", offenseTendency: 9, defenseTendency: 5, signatureMove: "战斧式扣篮" },
  },
  {
    id: "NPC011",
    name: "跑轰专家·冯",
    position: Position.SG,
    style: Style.Shooter,
    overallRating: 87,
    appearance: { height: 194, weight: 87, jerseyNumber: 7, skinColor: "白皙", hairStyle: "短发" },
    personality: { trait: "灵活", motto: "我总能在对手反应过来之前找到空位。", aggressiveness: 7, teamwork: 7 },
    dialogue: {
      greeting: "快节奏，高效率，这就是我的风格。",
      winQuote: "我们用速度击败了他们。",
      loseQuote: "我们跑得不够快，被拖入了阵地战。",
      advice: "永远跑起来，不要停下。",
    },
    behavior: { primaryAction: "快攻中的追身三分", offenseTendency: 8, defenseTendency: 6, signatureMove: "急停跳投" },
  },
  {
    id: "NPC012",
    name: "组织分卫·郭",
    position: Position.SG,
    style: Style.Playmaker,
    overallRating: 88,
    appearance: { height: 192, weight: 89, jerseyNumber: 6, skinColor: "健康肤色", hairStyle: "油头" },
    personality: { trait: "狡猾", motto: "得分不是唯一，助攻同样致命。", aggressiveness: 6, teamwork: 9 },
    dialogue: {
      greeting: "让我来帮你打开局面。",
      winQuote: "我的传球撕裂了他们的防线。",
      loseQuote: "我的传球失误太多了，需要反思。",
      advice: "假动作是你的朋友，用它来迷惑对手。",
    },
    behavior: { primaryAction: "高位策应与传球", offenseTendency: 7, defenseTendency: 7, signatureMove: "后撤步跳投" },
  },
  // SF - 全能/AllAround (13-18)
  {
    id: "NPC013",
    name: "小前锋之王·刘",
    position: Position.SF,
    style: Style.AllAround,
    overallRating: 98,
    appearance: { height: 203, weight: 105, jerseyNumber: 23, skinColor: "古铜色", hairStyle: "寸头" },
    personality: { trait: "霸气", motto: "我就是球场上的答案。", aggressiveness: 9, teamwork: 9 },
    dialogue: {
      greeting: "我是刘，准备好见证统治力了吗？",
      winQuote: "没有什么能阻止我，也没有什么能阻止我们。",
      loseQuote: "失败是不可接受的，下次我将更强。",
      advice: "在攻防两端都投入100%的精力。",
    },
    behavior: { primaryAction: "三威胁全能进攻", offenseTendency: 10, defenseTendency: 9, signatureMove: "标志性干拔跳投" },
  },
  {
    id: "NPC014",
    name: "防守铁闸·朱",
    position: Position.SF,
    style: Style.Defender,
    overallRating: 90,
    appearance: { height: 201, weight: 102, jerseyNumber: 4, skinColor: "深棕色", hairStyle: "短发" },
    personality: { trait: "沉默", motto: "用行动说话，用防守证明一切。", aggressiveness: 5, teamwork: 8 },
    dialogue: {
      greeting: "我会让你的对手感到绝望。",
      winQuote: "完美的防守，完美的胜利。",
      loseQuote: "我的防守强度还不够。",
      advice: "不要赌博式抢断，保持位置，限制他的选择。",
    },
    behavior: { primaryAction: "限制对方核心得分手", offenseTendency: 5, defenseTendency: 10, signatureMove: "钉板大帽" },
  },
  {
    id: "NPC015",
    name: "空间魔术师·何",
    position: Position.SF,
    style: Style.Shooter,
    overallRating: 88,
    appearance: { height: 200, weight: 96, jerseyNumber: 8, skinColor: "白皙", hairStyle: "长发束起" },
    personality: { trait: "优雅", motto: "篮球是艺术，投篮是我的画笔。", aggressiveness: 6, teamwork: 7 },
    dialogue: {
      greeting: "看我的表演，三分线外见。",
      winQuote: "我的投篮为我们打开了空间。",
      loseQuote: "我们没有充分利用场地的宽度。",
      advice: "拉开空间，为队友创造突破机会。",
    },
    behavior: { primaryAction: "底角和侧翼三分", offenseTendency: 9, defenseTendency: 5, signatureMove: "金鸡独立" },
  },
  {
    id: "NPC016",
    name: "内切专家·孙",
    position: Position.SF,
    style: Style.Slasher,
    overallRating: 87,
    appearance: { height: 202, weight: 100, jerseyNumber: 13, skinColor: "健康肤色", hairStyle: "寸头" },
    personality: { trait: "勤奋", motto: "没有捷径，只有不断的跑动和冲击。", aggressiveness: 8, teamwork: 7 },
    dialogue: {
      greeting: "我更喜欢在篮下解决问题。",
      winQuote: "篮下得分，最可靠的方式。",
      loseQuote: "我们错失了太多篮下机会。",
      advice: "无球跑动很重要，寻找切入时机。",
    },
    behavior: { primaryAction: "无球空切篮下", offenseTendency: 8, defenseTendency: 6, signatureMove: "滑翔上篮" },
  },
  {
    id: "NPC017",
    name: "组织前锋·谭",
    position: Position.SF,
    style: Style.Playmaker,
    overallRating: 89,
    appearance: { height: 204, weight: 108, jerseyNumber: 10, skinColor: "浅棕色", hairStyle: "短发" },
    personality: { trait: "全面", motto: "我能得分，也能让队友变得更好。", aggressiveness: 7, teamwork: 9 },
    dialogue: {
      greeting: "让我来组织一次高效的进攻。",
      winQuote: "团队篮球的胜利。",
      loseQuote: "我的决策不够果断。",
      advice: "利用身高优势，在高位进行传导。",
    },
    behavior: { primaryAction: "高位持球组织", offenseTendency: 7, defenseTendency: 7, signatureMove: "背身传球" },
  },
  {
    id: "NPC018",
    name: "篮板怪兽·高",
    position: Position.SF,
    style: Style.Rebounder,
    overallRating: 86,
    appearance: { height: 205, weight: 110, jerseyNumber: 15, skinColor: "古铜色", hairStyle: "爆炸头" },
    personality: { trait: "强硬", motto: "篮板是我的，没有人能抢走。", aggressiveness: 9, teamwork: 6 },
    dialogue: {
      greeting: "准备好抢篮板了吗？",
      winQuote: "二次进攻杀死了比赛。",
      loseQuote: "我们被对手抢了太多篮板。",
      advice: "卡位，卡位，再卡位！",
    },
    behavior: { primaryAction: "冲抢进攻篮板", offenseTendency: 6, defenseTendency: 8, signatureMove: "暴力补扣" },
  },
  // PF - 力量/Rebounder & Defender (19-24)
  {
    id: "NPC019",
    name: "内线屏障·马",
    position: Position.PF,
    style: Style.Defender,
    overallRating: 93,
    appearance: { height: 208, weight: 115, jerseyNumber: 32, skinColor: "深棕色", hairStyle: "短发" },
    personality: { trait: "沉稳", motto: "禁区是我的领地，任何人都别想轻易闯入。", aggressiveness: 7, teamwork: 8 },
    dialogue: {
      greeting: "内线有我，你大可放心。",
      winQuote: "我们守住了禁区，守住了胜利。",
      loseQuote: "我的护框能力需要加强。",
      advice: "保持垂直起跳，不要犯规。",
    },
    behavior: { primaryAction: "禁区护框与盖帽", offenseTendency: 5, defenseTendency: 10, signatureMove: "遮天大帽" },
  },
  {
    id: "NPC020",
    name: "中投靓仔·杨",
    position: Position.PF,
    style: Style.Shooter,
    overallRating: 90,
    appearance: { height: 206, weight: 108, jerseyNumber: 21, skinColor: "健康肤色", hairStyle: "莫霍克" },
    personality: { trait: "自信", motto: "中距离跳投，永不过时。", aggressiveness: 8, teamwork: 7 },
    dialogue: {
      greeting: "让我给你展示一下中投的艺术。",
      winQuote: "中投是比赛的节奏器。",
      loseQuote: "我们应该多打中距离。",
      advice: "利用身体优势，在罚球线附近创造空间。",
    },
    behavior: { primaryAction: "高位中距离跳投", offenseTendency: 9, defenseTendency: 6, signatureMove: "翻身跳投" },
  },
  {
    id: "NPC021",
    name: "野兽·钱",
    position: Position.PF,
    style: Style.Rebounder,
    overallRating: 91,
    appearance: { height: 207, weight: 120, jerseyNumber: 50, skinColor: "古铜色", hairStyle: "光头" },
    personality: { trait: "狂野", motto: "力量就是一切，给我冲！", aggressiveness: 10, teamwork: 5 },
    dialogue: {
      greeting: "准备好被我撞飞了吗？",
      winQuote: "篮板和得分，我全都要！",
      loseQuote: "我的力量没有完全发挥出来。",
      advice: "用你的体重去碾压对手。",
    },
    behavior: { primaryAction: "强力内线进攻与篮板", offenseTendency: 8, defenseTendency: 7, signatureMove: "野蛮冲撞" },
  },
  {
    id: "NPC022",
    name: "组织大前·蒋",
    position: Position.PF,
    style: Style.Playmaker,
    overallRating: 88,
    appearance: { height: 209, weight: 112, jerseyNumber: 44, skinColor: "浅棕色", hairStyle: "背头" },
    personality: { trait: "智慧", motto: "大个子也能传出好球。", aggressiveness: 5, teamwork: 9 },
    dialogue: {
      greeting: "让我来指挥内线和外线的配合。",
      winQuote: "内线传导球是胜利的关键。",
      loseQuote: "传球路线被切断了，我的错。",
      advice: "在肘区拿球，观察队友的跑位。",
    },
    behavior: { primaryAction: "高低位策应传球", offenseTendency: 6, defenseTendency: 8, signatureMove: "内线分球" },
  },
  {
    id: "NPC023",
    name: "蓝领战士·韩",
    position: Position.PF,
    style: Style.Defender,
    overallRating: 85,
    appearance: { height: 205, weight: 110, jerseyNumber: 14, skinColor: "健康肤色", hairStyle: "短发" },
    personality: { trait: "无私", motto: "我做脏活累活，你们去得分。", aggressiveness: 4, teamwork: 10 },
    dialogue: {
      greeting: "需要我做什么？我随时待命。",
      winQuote: "我们赢了，这就够了。",
      loseQuote: "我没有为团队做出足够的贡献。",
      advice: "积极地为队友做掩护，这是无形的贡献。",
    },
    behavior: { primaryAction: "高质量掩护和防守轮转", offenseTendency: 3, defenseTendency: 9, signatureMove: "铁血防守" },
  },
  {
    id: "NPC024",
    name: "内线终结者·程",
    position: Position.PF,
    style: Style.Slasher,
    overallRating: 89,
    appearance: { height: 206, weight: 114, jerseyNumber: 22, skinColor: "深棕色", hairStyle: "小脏辫" },
    personality: { trait: "好斗", motto: "在篮下，我就是不可阻挡的。", aggressiveness: 9, teamwork: 6 },
    dialogue: {
      greeting: "把球吊给我，我要得分。",
      winQuote: "内线的优势是无法被击败的。",
      loseQuote: "我的终结能力还需要提升。",
      advice: "利用假动作骗过对手，再出手。",
    },
    behavior: { primaryAction: "低位背身单打", offenseTendency: 9, defenseTendency: 5, signatureMove: "梦幻脚步" },
  },
  // C - 护框/Defender & Rebounder (25-30)
  {
    id: "NPC025",
    name: "禁区巨兽·丁",
    position: Position.C,
    style: Style.Defender,
    overallRating: 96,
    appearance: { height: 218, weight: 130, jerseyNumber: 99, skinColor: "古铜色", hairStyle: "光头" },
    personality: { trait: "威严", motto: "我的身高就是最大的武器。", aggressiveness: 8, teamwork: 7 },
    dialogue: {
      greeting: "欢迎来到我的禁区。",
      winQuote: "没有人能在我的头上得分。",
      loseQuote: "我需要更大的统治力。",
      advice: "站好你的位置，让对手感到压迫。",
    },
    behavior: { primaryAction: "镇守篮下，封盖投篮", offenseTendency: 6, defenseTendency: 10, signatureMove: "排球式大帽" },
  },
  {
    id: "NPC026",
    name: "篮板之神·方",
    position: Position.C,
    style: Style.Rebounder,
    overallRating: 94,
    appearance: { height: 215, weight: 125, jerseyNumber: 55, skinColor: "健康肤色", hairStyle: "短发" },
    personality: { trait: "执着", motto: "每一个篮板都是我的囊中之物。", aggressiveness: 9, teamwork: 8 },
    dialogue: {
      greeting: "篮板球，我来了！",
      winQuote: "篮板优势就是胜利优势。",
      loseQuote: "我们让对手抢了太多二次进攻。",
      advice: "永远追逐篮球的落点，不要放弃任何一个篮板。",
    },
    behavior: { primaryAction: "积极冲抢所有篮板", offenseTendency: 7, defenseTendency: 9, signatureMove: "空中抓板" },
  },
  {
    id: "NPC027",
    name: "策应中锋·钟",
    position: Position.C,
    style: Style.Playmaker,
    overallRating: 88,
    appearance: { height: 213, weight: 120, jerseyNumber: 16, skinColor: "浅棕色", hairStyle: "中长发" },
    personality: { trait: "细腻", motto: "我用传球连接内线和外线。", aggressiveness: 5, teamwork: 10 },
    dialogue: {
      greeting: "让我来组织一次内线发起的进攻。",
      winQuote: "我的传球找到了空位的队友。",
      loseQuote: "我的传球失误太多了。",
      advice: "利用你的身高，找到场上最空旷的队友。",
    },
    behavior: { primaryAction: "高位持球策应", offenseTendency: 6, defenseTendency: 7, signatureMove: "击地传球" },
  },
  {
    id: "NPC028",
    name: "投射型中锋·郝",
    position: Position.C,
    style: Style.Shooter,
    overallRating: 87,
    appearance: { height: 210, weight: 118, jerseyNumber: 33, skinColor: "白皙", hairStyle: "寸头" },
    personality: { trait: "冷静", motto: "拉开空间，让队友突破。", aggressiveness: 6, teamwork: 7 },
    dialogue: {
      greeting: "我在三分线等你。",
      winQuote: "我的三分让对手的中锋无所适从。",
      loseQuote: "我的投篮没有命中，下次我会更准。",
      advice: "站在三分线外，为内线拉开防守。",
    },
    behavior: { primaryAction: "外线三分投射", offenseTendency: 8, defenseTendency: 5, signatureMove: "定点三分" },
  },
  {
    id: "NPC029",
    name: "传统中锋·徐",
    position: Position.C,
    style: Style.Rebounder,
    overallRating: 92,
    appearance: { height: 216, weight: 128, jerseyNumber: 41, skinColor: "深棕色", hairStyle: "短发" },
    personality: { trait: "强硬", motto: "禁区就是我的家，我不会让任何人进来。", aggressiveness: 8, teamwork: 7 },
    dialogue: {
      greeting: "来吧，一对一，在篮下。",
      winQuote: "低位得分，最简单也最有效。",
      loseQuote: "我没有在篮下站稳脚跟。",
      advice: "低位要球，用身体碾压对手。",
    },
    behavior: { primaryAction: "低位背身单打和二次进攻", offenseTendency: 9, defenseTendency: 8, signatureMove: "小勾手" },
  },
  {
    id: "NPC030",
    name: "全能中锋·廖",
    position: Position.C,
    style: Style.AllAround,
    overallRating: 90,
    appearance: { height: 214, weight: 122, jerseyNumber: 17, skinColor: "健康肤色", hairStyle: "寸头" },
    personality: { trait: "适应性强", motto: "我能适应任何战术，内外兼修。", aggressiveness: 7, teamwork: 9 },
    dialogue: {
      greeting: "告诉我你需要什么，我都能做到。",
      winQuote: "内外兼修，无懈可击。",
      loseQuote: "我们没有打出我的优势。",
      advice: "根据对手的防守，选择内线强攻或外线投射。",
    },
    behavior: { primaryAction: "内外线结合，全面发展", offenseTendency: 8, defenseTendency: 8, signatureMove: "面筐突破" },
  },
];

// 导出类型，方便其他模块使用
export type { PlayerNPC };
