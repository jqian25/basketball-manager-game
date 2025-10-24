// client/src/game/items/TrainingEquipment.ts

/**
 * 稀有度枚举
 * COMMON: 常见
 * UNCOMMON: 罕见
 * RARE: 稀有
 * EPIC: 史诗
 * LEGENDARY: 传说
 */
export enum Rarity {
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    EPIC = "EPIC",
    LEGENDARY = "LEGENDARY",
}

/**
 * 训练器材属性接口
 * 属性值代表对球员某项能力的提升潜力或训练效果加成。
 * 属性值范围通常为 1-100，稀有度越高，属性值总和越高。
 */
export interface TrainingEquipmentAttributes {
    // 投篮能力 (Shooting)
    shooting: number;
    // 传球能力 (Passing)
    passing: number;
    // 控球能力 (Dribbling)
    dribbling: number;
    // 速度/敏捷 (Speed/Agility)
    speed: number;
    // 力量/对抗 (Strength/Physicality)
    strength: number;
    // 防守/抢断 (Defense/Steal)
    defense: number;
    // 篮板 (Rebounding)
    rebounding: number;
}

/**
 * 训练器材数据结构
 */
export interface TrainingEquipment {
    // 物品唯一ID (建议使用 UUID 或数字 ID，此处简化为字符串)
    id: string;
    // 物品名称
    name: string;
    // 物品描述
    description: string;
    // 稀有度
    rarity: Rarity;
    // 购买价格 (游戏币)
    price: number;
    // 属性加成
    attributes: TrainingEquipmentAttributes;
}

/**
 * 训练装备数据库
 * 包含60种篮球主题训练器材
 */
export const TrainingEquipmentDB: TrainingEquipment[] = [
    // --- COMMON (常见) - 20 items ---
    {
        id: "TE001",
        name: "基础篮球",
        description: "最普通的标准篮球，适合日常基础练习。",
        rarity: Rarity.COMMON,
        price: 50,
        attributes: { shooting: 5, passing: 5, dribbling: 5, speed: 2, strength: 2, defense: 3, rebounding: 3 }
    },
    {
        id: "TE002",
        name: "普通跳绳",
        description: "用于增强心肺功能和腿部爆发力的基本工具。",
        rarity: Rarity.COMMON,
        price: 30,
        attributes: { shooting: 1, passing: 1, dribbling: 2, speed: 6, strength: 3, defense: 1, rebounding: 1 }
    },
    {
        id: "TE003",
        name: "训练锥桶 (一套)",
        description: "用于敏捷性训练和运球路径规划的塑料锥桶。",
        rarity: Rarity.COMMON,
        price: 40,
        attributes: { shooting: 1, passing: 2, dribbling: 6, speed: 5, strength: 1, defense: 2, rebounding: 1 }
    },
    {
        id: "TE004",
        name: "简易护膝",
        description: "提供基础保护，防止轻微擦伤。",
        rarity: Rarity.COMMON,
        price: 20,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 1, strength: 4, defense: 3, rebounding: 3 }
    },
    {
        id: "TE005",
        name: "标准哑铃 (5kg)",
        description: "进行基础力量训练，增强手臂和核心力量。",
        rarity: Rarity.COMMON,
        price: 60,
        attributes: { shooting: 3, passing: 3, dribbling: 1, speed: 1, strength: 6, defense: 2, rebounding: 2 }
    },
    {
        id: "TE006",
        name: "基础运球眼镜",
        description: "限制向下看，强制练习抬头运球。",
        rarity: Rarity.COMMON,
        price: 35,
        attributes: { shooting: 1, passing: 3, dribbling: 7, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE007",
        name: "弹力带 (轻度)",
        description: "用于拉伸和轻度阻力训练，提高柔韧性。",
        rarity: Rarity.COMMON,
        price: 25,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 4, strength: 3, defense: 1, rebounding: 1 }
    },
    {
        id: "TE008",
        name: "计时器",
        description: "精确记录训练时间，培养时间观念。",
        rarity: Rarity.COMMON,
        price: 15,
        attributes: { shooting: 2, passing: 2, dribbling: 2, speed: 3, strength: 2, defense: 2, rebounding: 2 }
    },
    {
        id: "TE009",
        name: "泡沫轴",
        description: "基础的肌肉放松工具，缓解训练后的酸痛。",
        rarity: Rarity.COMMON,
        price: 30,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 3, strength: 3, defense: 1, rebounding: 1 }
    },
    {
        id: "TE010",
        name: "战术板 (小型)",
        description: "用于绘制简单战术，理解基础跑位。",
        rarity: Rarity.COMMON,
        price: 45,
        attributes: { shooting: 2, passing: 6, dribbling: 1, speed: 1, strength: 1, defense: 3, rebounding: 1 }
    },
    {
        id: "TE011",
        name: "基础运动水壶",
        description: "保持训练中的水分补充。",
        rarity: Rarity.COMMON,
        price: 10,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE012",
        name: "篮球鞋垫 (基础)",
        description: "提供基础的足部支撑。",
        rarity: Rarity.COMMON,
        price: 20,
        attributes: { shooting: 1, passing: 1, dribbling: 2, speed: 3, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE013",
        name: "普通运动毛巾",
        description: "吸汗，保持手部干燥。",
        rarity: Rarity.COMMON,
        price: 10,
        attributes: { shooting: 3, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE014",
        name: "基础护腕",
        description: "保护手腕关节，轻微吸汗。",
        rarity: Rarity.COMMON,
        price: 15,
        attributes: { shooting: 3, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE015",
        name: "篮球气筒",
        description: "确保篮球气压合适，影响手感。",
        rarity: Rarity.COMMON,
        price: 20,
        attributes: { shooting: 4, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE016",
        name: "基础训练背心",
        description: "轻便透气，适合日常训练。",
        rarity: Rarity.COMMON,
        price: 30,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 3, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE017",
        name: "训练手套 (防滑)",
        description: "增加持球时的摩擦力。",
        rarity: Rarity.COMMON,
        price: 40,
        attributes: { shooting: 4, passing: 2, dribbling: 2, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE018",
        name: "小型沙袋",
        description: "用于脚踝或手腕的轻量级负重训练。",
        rarity: Rarity.COMMON,
        price: 50,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 1, strength: 5, defense: 2, rebounding: 2 }
    },
    {
        id: "TE019",
        name: "基础拉伸垫",
        description: "提供舒适的拉伸和核心训练表面。",
        rarity: Rarity.COMMON,
        price: 25,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 2, strength: 3, defense: 1, rebounding: 1 }
    },
    {
        id: "TE020",
        name: "训练日志本",
        description: "记录每日训练进度和感受。",
        rarity: Rarity.COMMON,
        price: 10,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    // --- UNCOMMON (罕见) - 15 items ---
    {
        id: "TE021",
        name: "加重篮球 (1kg)",
        description: "比标准篮球重，用于增强手腕和指尖力量，提升投篮和传球的稳定性。",
        rarity: Rarity.UNCOMMON,
        price: 150,
        attributes: { shooting: 8, passing: 8, dribbling: 4, speed: 1, strength: 5, defense: 3, rebounding: 3 }
    },
    {
        id: "TE022",
        name: "敏捷梯",
        description: "用于脚步训练，显著提高横向移动速度和敏捷性。",
        rarity: Rarity.UNCOMMON,
        price: 120,
        attributes: { shooting: 2, passing: 3, dribbling: 6, speed: 10, strength: 2, defense: 5, rebounding: 1 }
    },
    {
        id: "TE023",
        name: "反应训练灯",
        description: "通过视觉信号训练球员的反应速度和决策能力。",
        rarity: Rarity.UNCOMMON,
        price: 200,
        attributes: { shooting: 3, passing: 5, dribbling: 5, speed: 8, strength: 1, defense: 4, rebounding: 1 }
    },
    {
        id: "TE024",
        name: "专业护踝",
        description: "提供中度支撑，降低脚踝扭伤的风险。",
        rarity: Rarity.UNCOMMON,
        price: 80,
        attributes: { shooting: 1, passing: 1, dribbling: 2, speed: 3, strength: 6, defense: 5, rebounding: 5 }
    },
    {
        id: "TE025",
        name: "可调节阻力伞",
        description: "进行冲刺跑训练时提供空气阻力，增强爆发力。",
        rarity: Rarity.UNCOMMON,
        price: 180,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 7, strength: 9, defense: 3, rebounding: 3 }
    },
    {
        id: "TE026",
        name: "传球靶",
        description: "固定在墙上或队友身上，用于精确传球练习。",
        rarity: Rarity.UNCOMMON,
        price: 100,
        attributes: { shooting: 3, passing: 10, dribbling: 2, speed: 1, strength: 1, defense: 2, rebounding: 1 }
    },
    {
        id: "TE027",
        name: "训练假人 (基础)",
        description: "模拟防守者，用于投篮和运球突破练习。",
        rarity: Rarity.UNCOMMON,
        price: 160,
        attributes: { shooting: 7, passing: 4, dribbling: 7, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE028",
        name: "高强度弹力带",
        description: "用于高强度阻力训练，增强肌肉爆发力。",
        rarity: Rarity.UNCOMMON,
        price: 90,
        attributes: { shooting: 2, passing: 2, dribbling: 1, speed: 5, strength: 8, defense: 2, rebounding: 2 }
    },
    {
        id: "TE029",
        name: "迷你蹦床",
        description: "用于增强弹跳力和腿部肌肉的快速收缩。",
        rarity: Rarity.UNCOMMON,
        price: 220,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 6, strength: 7, defense: 1, rebounding: 6 }
    },
    {
        id: "TE030",
        name: "战术板 (中型，磁性)",
        description: "更清晰地演示复杂战术，提升战术理解力。",
        rarity: Rarity.UNCOMMON,
        price: 130,
        attributes: { shooting: 3, passing: 9, dribbling: 1, speed: 1, strength: 1, defense: 5, rebounding: 1 }
    },
    {
        id: "TE031",
        name: "运动营养补充剂 (基础)",
        description: "帮助肌肉快速恢复，提高训练效率。",
        rarity: Rarity.UNCOMMON,
        price: 70,
        attributes: { shooting: 2, passing: 2, dribbling: 2, speed: 4, strength: 4, defense: 2, rebounding: 2 }
    },
    {
        id: "TE032",
        name: "篮球鞋垫 (专业减震)",
        description: "提供优秀的减震和能量反馈，保护膝盖。",
        rarity: Rarity.UNCOMMON,
        price: 110,
        attributes: { shooting: 2, passing: 2, dribbling: 3, speed: 5, strength: 5, defense: 3, rebounding: 3 }
    },
    {
        id: "TE033",
        name: "双球运球绳",
        description: "将两个篮球连接起来，强制进行双球运球训练。",
        rarity: Rarity.UNCOMMON,
        price: 60,
        attributes: { shooting: 1, passing: 3, dribbling: 9, speed: 3, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE034",
        name: "投篮弧度矫正器",
        description: "帮助球员找到最佳投篮出手角度。",
        rarity: Rarity.UNCOMMON,
        price: 140,
        attributes: { shooting: 10, passing: 1, dribbling: 1, speed: 1, strength: 1, defense: 1, rebounding: 1 }
    },
    {
        id: "TE035",
        name: "防守滑步带",
        description: "连接双脚，增加防守滑步时的阻力。",
        rarity: Rarity.UNCOMMON,
        price: 100,
        attributes: { shooting: 1, passing: 1, dribbling: 1, speed: 6, strength: 5, defense: 8, rebounding: 3 }
    },
    // --- RARE (稀有) - 15 items ---
    {
        id: "TE036",
        name: "智能投篮计数器",
        description: "自动记录投篮次数、命中率和投篮热区，提供精准数据分析。",
        rarity: Rarity.RARE,
        price: 450,
        attributes: { shooting: 15, passing: 5, dribbling: 5, speed: 2, strength: 2, defense: 3, rebounding: 3 }
    },
    {
        id: "TE037",
        name: "专业力量训练雪橇",
        description: "用于拖拽训练，极大增强下肢爆发力和核心力量。",
        rarity: Rarity.RARE,
        price: 600,
        attributes: { shooting: 3, passing: 3, dribbling: 1, speed: 8, strength: 15, defense: 5, rebounding: 5 }
    },
    {
        id: "TE038",
        name: "动态平衡板",
        description: "用于训练核心稳定性和踝关节力量，提升对抗中的平衡。",
        rarity: Rarity.RARE,
        price: 350,
        attributes: { shooting: 5, passing: 5, dribbling: 8, speed: 7, strength: 10, defense: 5, rebounding: 5 }
    },
    {
        id: "TE039",
        name: "高科技压缩护腿",
        description: "加速血液循环，最大限度减少肌肉疲劳和抽筋。",
        rarity: Rarity.RARE,
        price: 300,
        attributes: { shooting: 3, passing: 3, dribbling: 4, speed: 12, strength: 8, defense: 7, rebounding: 7 }
    },
    {
        id: "TE040",
        name: "双向传球回弹器",
        description: "模拟队友快速传球，用于接球和快速出手的训练。",
        rarity: Rarity.RARE,
        price: 400,
        attributes: { shooting: 10, passing: 15, dribbling: 5, speed: 2, strength: 2, defense: 2, rebounding: 2 }
    },
    {
        id: "TE041",
        name: "加重训练背心 (5kg)",
        description: "增加身体负重，提升弹跳和速度的绝对力量。",
        rarity: Rarity.RARE,
        price: 500,
        attributes: { shooting: 5, passing: 5, dribbling: 5, speed: 10, strength: 12, defense: 8, rebounding: 8 }
    },
    {
        id: "TE042",
        name: "专业运球反作用球",
        description: "不规则弹跳，强制球员提高运球时的反应和控制力。",
        rarity: Rarity.RARE,
        price: 250,
        attributes: { shooting: 3, passing: 3, dribbling: 15, speed: 5, strength: 3, defense: 3, rebounding: 3 }
    },
    {
        id: "TE043",
        name: "高空篮板训练杆",
        description: "用于模拟高强度篮板争夺，提高起跳时机和空中对抗能力。",
        rarity: Rarity.RARE,
        price: 380,
        attributes: { shooting: 2, passing: 2, dribbling: 1, speed: 5, strength: 10, defense: 10, rebounding: 15 }
    },
    {
        id: "TE044",
        name: "智能战术分析软件",
        description: "记录和分析比赛录像，提供对手和自身战术的详细报告。",
        rarity: Rarity.RARE,
        price: 550,
        attributes: { shooting: 5, passing: 12, dribbling: 5, speed: 3, strength: 3, defense: 12, rebounding: 5 }
    },
    {
        id: "TE045",
        name: "专业运动按摩枪",
        description: "深度放松肌肉，加速恢复，减少伤病。",
        rarity: Rarity.RARE,
        price: 420,
        attributes: { shooting: 4, passing: 4, dribbling: 4, speed: 10, strength: 10, defense: 4, rebounding: 4 }
    },
    {
        id: "TE046",
        name: "防守干扰手套",
        description: "模拟防守者的干扰，用于投篮和传球的抗干扰训练。",
        rarity: Rarity.RARE,
        price: 280,
        attributes: { shooting: 12, passing: 8, dribbling: 3, speed: 3, strength: 3, defense: 3, rebounding: 3 }
    },
    {
        id: "TE047",
        name: "篮球鞋垫 (碳板支撑)",
        description: "内置碳板，提供极致的抗扭转和能量传导。",
        rarity: Rarity.RARE,
        price: 320,
        attributes: { shooting: 5, passing: 5, dribbling: 7, speed: 10, strength: 7, defense: 5, rebounding: 5 }
    },
    {
        id: "TE048",
        name: "高强度核心滚轮",
        description: "用于腹部和核心肌群的极限训练。",
        rarity: Rarity.RARE,
        price: 200,
        attributes: { shooting: 3, passing: 3, dribbling: 3, speed: 5, strength: 15, defense: 5, rebounding: 5 }
    },
    {
        id: "TE049",
        name: "专业训练假人 (可移动)",
        description: "可以设置移动路径，模拟更真实的防守跑位。",
        rarity: Rarity.RARE,
        price: 700,
        attributes: { shooting: 8, passing: 8, dribbling: 10, speed: 5, strength: 5, defense: 5, rebounding: 5 }
    },
    {
        id: "TE050",
        name: "手眼协调训练球",
        description: "多面体设计，用于提高手眼协调和快速反应。",
        rarity: Rarity.RARE,
        price: 230,
        attributes: { shooting: 5, passing: 5, dribbling: 10, speed: 10, strength: 2, defense: 5, rebounding: 2 }
    },
    // --- EPIC (史诗) - 7 items ---
    {
        id: "TE051",
        name: "重力感应训练服",
        description: "内置微型配重和传感器，精确模拟更高重力环境下的运动，提升爆发极限。",
        rarity: Rarity.EPIC,
        price: 1500,
        attributes: { shooting: 10, passing: 10, dribbling: 10, speed: 15, strength: 20, defense: 15, rebounding: 15 }
    },
    {
        id: "TE052",
        name: "虚拟现实投篮模拟器",
        description: "在VR环境中模拟各种比赛压力下的投篮场景，极大地提升心理素质和命中率。",
        rarity: Rarity.EPIC,
        price: 2200,
        attributes: { shooting: 25, passing: 10, dribbling: 10, speed: 5, strength: 5, defense: 5, rebounding: 5 }
    },
    {
        id: "TE053",
        name: "全场自动传球机",
        description: "可编程，能以不同速度、角度和位置连续传球，实现高强度无间断训练。",
        rarity: Rarity.EPIC,
        price: 1800,
        attributes: { shooting: 15, passing: 25, dribbling: 10, speed: 5, strength: 5, defense: 5, rebounding: 5 }
    },
    {
        id: "TE054",
        name: "生物反馈监测仪",
        description: "实时监测心率、肌肉疲劳和神经反应，优化训练强度和恢复计划。",
        rarity: Rarity.EPIC,
        price: 1900,
        attributes: { shooting: 10, passing: 10, dribbling: 10, speed: 15, strength: 15, defense: 15, rebounding: 15 }
    },
    {
        id: "TE055",
        name: "高空跳跃辅助系统",
        description: "通过弹力绳辅助，安全地进行超高强度弹跳训练，突破弹跳极限。",
        rarity: Rarity.EPIC,
        price: 2500,
        attributes: { shooting: 5, passing: 5, dribbling: 5, speed: 10, strength: 20, defense: 10, rebounding: 20 }
    },
    {
        id: "TE056",
        name: "智能地板感应系统",
        description: "记录脚步移动、跑位路线和防守站位，提供战术执行效率的精确分析。",
        rarity: Rarity.EPIC,
        price: 2000,
        attributes: { shooting: 10, passing: 15, dribbling: 15, speed: 20, strength: 5, defense: 20, rebounding: 5 }
    },
    {
        id: "TE057",
        name: "顶级运动营养包",
        description: "包含最先进的恢复和增肌配方，将训练效果提升到新的水平。",
        rarity: Rarity.EPIC,
        price: 1200,
        attributes: { shooting: 10, passing: 10, dribbling: 10, speed: 15, strength: 15, defense: 10, rebounding: 10 }
    },
    // --- LEGENDARY (传说) - 3 items ---
    {
        id: "TE058",
        name: "【乔丹之影】训练服",
        description: "传说中的训练服，据说能唤醒球员内心深处的竞争欲望和得分本能。",
        rarity: Rarity.LEGENDARY,
        price: 5000,
        attributes: { shooting: 40, passing: 20, dribbling: 30, speed: 20, strength: 20, defense: 20, rebounding: 20 }
    },
    {
        id: "TE059",
        name: "【科比意志】曼巴精神训练球",
        description: "一个看似普通的篮球，但其材质能完美模拟比赛末段的疲劳手感，磨练球员的意志力。",
        rarity: Rarity.LEGENDARY,
        price: 4500,
        attributes: { shooting: 30, passing: 30, dribbling: 40, speed: 20, strength: 20, defense: 20, rebounding: 20 }
    },
    {
        id: "TE060",
        name: "【詹皇核心】力量训练机",
        description: "专为增强核心力量和持久性设计，能让使用者在对抗中保持不败的体能优势。",
        rarity: Rarity.LEGENDARY,
        price: 6000,
        attributes: { shooting: 20, passing: 20, dribbling: 20, speed: 30, strength: 40, defense: 30, rebounding: 30 }
    }
];
