// client/src/game/npcs/SpecialNPCs.ts

/**
 * NPC外观接口
 */
export interface NPCAppearance {
    height: string; // 例如: "2.16m"
    jerseyNumber: number;
    signatureLook: string; // 标志性造型
}

/**
 * NPC性格类型
 */
export type NPCPersonality = '冷静' | '激情' | '幽默' | '内敛' | '霸气' | '导师' | '顽皮';

/**
 * NPC对话接口
 */
export interface NPCDialogue {
    greeting: string; // 问候语
    advice: string; // 建议/指导
    challenge: string; // 挑战宣言
}

/**
 * NPC行为模式类型
 */
export type NPCBehaviorPattern = '训练师' | '街球王' | '全能战士' | '三分射手' | '内线巨兽' | '组织核心' | '防守专家';

/**
 * 特殊NPC数据结构
 */
export interface SpecialNPC {
    id: number;
    name: string;
    appearance: NPCAppearance;
    personality: NPCPersonality;
    dialogue: NPCDialogue;
    behaviorPattern: NPCBehaviorPattern;
}

/**
 * 20个特殊NPC数据
 */
export const SpecialNPCs: SpecialNPC[] = [
    {
        id: 1,
        name: "迈克尔·乔神",
        appearance: { height: "1.98m", jerseyNumber: 23, signatureLook: "宽松短裤和黑色球鞋" },
        personality: "霸气",
        dialogue: {
            greeting: "欢迎来到我的球场，准备好接受挑战了吗？",
            advice: "天赋决定上限，努力决定下限。永远不要满足于现状。",
            challenge: "想赢我？先飞起来再说！"
        },
        behaviorPattern: "全能战士"
    },
    {
        id: 2,
        name: "科比·黑曼巴",
        appearance: { height: "1.98m", jerseyNumber: 8, signatureLook: "永不服输的眼神和紧咬的牙关" },
        personality: "激情",
        dialogue: {
            greeting: "Mamba Out. 你想从我这学到什么？",
            advice: "你见过凌晨四点的洛杉矶吗？努力是唯一的捷径。",
            challenge: "来吧，一对一，我不会传球的。"
        },
        behaviorPattern: "全能战士"
    },
    {
        id: 3,
        name: "勒布朗·国王",
        appearance: { height: "2.06m", jerseyNumber: 6, signatureLook: "发带和标志性的战斧式扣篮" },
        personality: "导师",
        dialogue: {
            greeting: "我来这里是为了赢球，你呢？",
            advice: "篮球是团队运动，学会信任你的队友。",
            challenge: "我的身体就是我的武器，你能突破我的防线吗？"
        },
        behaviorPattern: "组织核心"
    },
    {
        id: 4,
        name: "沙克·大鲨鱼",
        appearance: { height: "2.16m", jerseyNumber: 34, signatureLook: "庞大的身躯和幽默的笑容" },
        personality: "幽默",
        dialogue: {
            greeting: "嘿，小家伙，别被我的脚步晃倒了！",
            advice: "统治内线，从吃好睡好开始。",
            challenge: "来，试试看，你能把我推开吗？"
        },
        behaviorPattern: "内线巨兽"
    },
    {
        id: 5,
        name: "斯蒂芬·库里",
        appearance: { height: "1.91m", jerseyNumber: 30, signatureLook: "吐牙套和超远三分" },
        personality: "顽皮",
        dialogue: {
            greeting: "嘘... 准备好见证奇迹了吗？",
            advice: "投篮的秘诀？就是不断地投，直到它变成肌肉记忆。",
            challenge: "中场线？那只是我的热身距离。"
        },
        behaviorPattern: "三分射手"
    },
    {
        id: 6,
        name: "拉里·伯德",
        appearance: { height: "2.06m", jerseyNumber: 33, signatureLook: "朴素的白色球衣和冷静的表情" },
        personality: "冷静",
        dialogue: {
            greeting: "我在这里等你，你知道我要做什么。",
            advice: "用头脑打球，而不是只用身体。",
            challenge: "告诉我，你想拿第几名？"
        },
        behaviorPattern: "组织核心"
    },
    {
        id: 7,
        name: "魔术师约翰逊",
        appearance: { height: "2.06m", jerseyNumber: 32, signatureLook: "标志性的微笑和不看人传球" },
        personality: "激情",
        dialogue: {
            greeting: "Showtime! 让我们点燃全场！",
            advice: "视野决定你的上限，学会观察场上的每一个角落。",
            challenge: "来，防住我的传球路线！"
        },
        behaviorPattern: "组织核心"
    },
    {
        id: 8,
        name: "蒂姆·邓肯",
        appearance: { height: "2.11m", jerseyNumber: 21, signatureLook: "面无表情和扎实的基本功" },
        personality: "内敛",
        dialogue: {
            greeting: "嗯... 比赛开始了。",
            advice: "基本功是不会骗人的，重复，重复，再重复。",
            challenge: "我的银行打板，你能预测吗？"
        },
        behaviorPattern: "内线巨兽"
    },
    {
        id: 9,
        name: "阿伦·艾弗森",
        appearance: { height: "1.83m", jerseyNumber: 3, signatureLook: "地垄沟发型和护臂" },
        personality: "霸气",
        dialogue: {
            greeting: "我们谈论的是训练？不是比赛？",
            advice: "身高不代表一切，速度和意志力才是你的武器。",
            challenge: "想抢断我？你得比我快十倍。"
        },
        behaviorPattern: "街球王"
    },
    {
        id: 10,
        name: "哈基姆·奥拉朱旺",
        appearance: { height: "2.13m", jerseyNumber: 34, signatureLook: "梦幻脚步和优雅的转身" },
        personality: "冷静",
        dialogue: {
            greeting: "篮球是一门艺术，你准备好学习了吗？",
            advice: "内线进攻的精髓在于脚步，让防守人猜不透。",
            challenge: "来，试试防守我的'梦幻脚步'。"
        },
        behaviorPattern: "内线巨兽"
    },
    {
        id: 11,
        name: "雷吉·米勒",
        appearance: { height: "2.01m", jerseyNumber: 31, signatureLook: "瘦削的身材和关键时刻的绝杀" },
        personality: "幽默",
        dialogue: {
            greeting: "米勒时间到！你准备好被绝杀了么？",
            advice: "关键时刻，心理素质比技术更重要。",
            challenge: "我只需要0.8秒，你呢？"
        },
        behaviorPattern: "三分射手"
    },
    {
        id: 12,
        name: "加里·佩顿",
        appearance: { height: "1.93m", jerseyNumber: 20, signatureLook: "垃圾话和强硬的防守姿态" },
        personality: "霸气",
        dialogue: {
            greeting: "我是'手套'，你最好把球藏好。",
            advice: "防守就是态度，用你的声音和身体去压垮对手。",
            challenge: "来，运球过我，我保证你连中线都过不去。"
        },
        behaviorPattern: "防守专家"
    },
    {
        id: 13,
        name: "德克·诺维茨基",
        appearance: { height: "2.13m", jerseyNumber: 41, signatureLook: "金鸡独立后仰跳投" },
        personality: "内敛",
        dialogue: {
            greeting: "你好，让我们开始训练吧。",
            advice: "找到自己的独特武器，并把它磨练到极致。",
            challenge: "试试看，你能封盖我的后仰跳投吗？"
        },
        behaviorPattern: "全能战士"
    },
    {
        id: 14,
        name: "凯文·杜兰特",
        appearance: { height: "2.11m", jerseyNumber: 35, signatureLook: "修长的身形和无解的投篮" },
        personality: "冷静",
        dialogue: {
            greeting: "我只是一个得分手，仅此而已。",
            advice: "得分的关键在于创造空间，哪怕只有一点点。",
            challenge: "我的投篮没有死角，你信吗？"
        },
        behaviorPattern: "全能战士"
    },
    {
        id: 15,
        name: "史蒂夫·纳什",
        appearance: { height: "1.91m", jerseyNumber: 13, signatureLook: "长发和风骚的传球" },
        personality: "幽默",
        dialogue: {
            greeting: "跑起来！跑起来！太阳要下山了！",
            advice: "传球的艺术在于预判，比所有人都快一步。",
            challenge: "你能跟上我的节奏吗？"
        },
        behaviorPattern: "组织核心"
    },
    {
        id: 16,
        name: "斯科蒂·皮蓬",
        appearance: { height: "2.03m", jerseyNumber: 33, signatureLook: "全能的身手和防守" },
        personality: "导师",
        dialogue: {
            greeting: "我是二当家，但我的防守是顶级的。",
            advice: "做好你的本职工作，团队的胜利高于一切。",
            challenge: "来，我来教你如何锁死对手的箭头人物。"
        },
        behaviorPattern: "防守专家"
    },
    {
        id: 17,
        name: "文斯·卡特",
        appearance: { height: "1.98m", jerseyNumber: 15, signatureLook: "暴力美学的扣篮" },
        personality: "激情",
        dialogue: {
            greeting: "半人半神！准备好起飞了吗？",
            advice: "扣篮不仅仅是得分，它能点燃整个球馆。",
            challenge: "想和我比扣篮？你得跳得更高！"
        },
        behaviorPattern: "街球王"
    },
    {
        id: 18,
        name: "德怀恩·韦德",
        appearance: { height: "1.93m", jerseyNumber: 3, signatureLook: "迷踪步和闪电般的速度" },
        personality: "霸气",
        dialogue: {
            greeting: "闪电侠来了，你准备好被超越了吗？",
            advice: "突破的诀窍在于节奏的变化，让防守人失去平衡。",
            challenge: "我的'韦德之道'，你能跟上吗？"
        },
        behaviorPattern: "街球王"
    },
    {
        id: 19,
        name: "雷·阿伦",
        appearance: { height: "1.96m", jerseyNumber: 20, signatureLook: "教科书般的投篮姿势" },
        personality: "冷静",
        dialogue: {
            greeting: "我只是在重复训练的动作。",
            advice: "投篮是科学，每一个细节都不能放过。",
            challenge: "在比赛的最后时刻，你能顶住压力投进三分吗？"
        },
        behaviorPattern: "三分射手"
    },
    {
        id: 20,
        name: "本·华莱士",
        appearance: { height: "2.06m", jerseyNumber: 3, signatureLook: "爆炸头和强悍的篮板" },
        personality: "内敛",
        dialogue: {
            greeting: "我的工作是防守，得分交给别人。",
            advice: "防守赢得总冠军，用你的意志力去保护篮筐。",
            challenge: "别想在我头上抢到篮板！"
        },
        behaviorPattern: "防守专家"
    }
];