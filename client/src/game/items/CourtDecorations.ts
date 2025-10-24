// client/src/game/items/CourtDecorations.ts

/**
 * 物品稀有度枚举
 */
export enum Rarity {
    Common = "普通",
    Uncommon = "不常见",
    Rare = "稀有",
    Epic = "史诗",
    Legendary = "传说",
}

/**
 * 物品属性接口
 * 装饰品可能影响的球场或球队属性
 */
export interface ItemAttributes {
    /** 观众热情度，影响主场优势 */
    FanMorale?: number;
    /** 球队士气，影响球员表现 */
    TeamSpirit?: number;
    /** 训练效率提升百分比 */
    TrainingEfficiency?: number;
    /** 商业收入加成百分比 */
    CommercialIncome?: number;
    /** 球员体力恢复速度加成百分比 */
    StaminaRecovery?: number;
}

/**
 * 球场装饰物品数据结构
 */
export interface CourtDecorationItem {
    /** 物品ID，唯一标识 */
    id: number;
    /** 物品名称 */
    name: string;
    /** 物品描述 */
    description: string;
    /** 物品价格（游戏币） */
    price: number;
    /** 物品稀有度 */
    rarity: Rarity;
    /** 物品属性加成 */
    attributes: ItemAttributes;
}

/**
 * 70种球场装饰物品数据
 */
export const CourtDecorations: CourtDecorationItem[] = [
    // --- 1-15: 普通 (Common) ---
    {
        id: 1,
        name: "基础木质长凳",
        description: "最常见的替补席长凳，实用但缺乏特色。",
        price: 50,
        rarity: Rarity.Common,
        attributes: { FanMorale: 1, TeamSpirit: 1 },
    },
    {
        id: 2,
        name: "标准LED记分牌",
        description: "清晰显示比分和时间的标准LED记分牌。",
        price: 120,
        rarity: Rarity.Common,
        attributes: { FanMorale: 2 },
    },
    {
        id: 3,
        name: "泛光照明灯",
        description: "基础的球场照明设备，确保比赛能正常进行。",
        price: 100,
        rarity: Rarity.Common,
        attributes: { TrainingEfficiency: 1 },
    },
    {
        id: 4,
        name: "蓝色塑料座椅",
        description: "观众席上最常见的蓝色塑料座椅，耐用且易于维护。",
        price: 30,
        rarity: Rarity.Common,
        attributes: { FanMorale: 1 },
    },
    {
        id: 5,
        name: "普通饮水机",
        description: "为球员提供基础补给的饮水机。",
        price: 60,
        rarity: Rarity.Common,
        attributes: { StaminaRecovery: 1 },
    },
    {
        id: 6,
        name: "球队标志地毯",
        description: "印有球队基础标志的入门级地毯，铺设在球员通道。",
        price: 80,
        rarity: Rarity.Common,
        attributes: { TeamSpirit: 1 },
    },
    {
        id: 7,
        name: "简易计时器",
        description: "用于训练和热身的简易倒计时器。",
        price: 40,
        rarity: Rarity.Common,
        attributes: { TrainingEfficiency: 1 },
    },
    {
        id: 8,
        name: "标准界线标志",
        description: "用于标记球场界线的标准贴纸或油漆。",
        price: 20,
        rarity: Rarity.Common,
        attributes: {},
    },
    {
        id: 9,
        name: "红色消防栓",
        description: "球场角落的必备安全设备。",
        price: 10,
        rarity: Rarity.Common,
        attributes: {},
    },
    {
        id: 10,
        name: "基础音响系统",
        description: "用于播放简单背景音乐和报幕的基础音响。",
        price: 150,
        rarity: Rarity.Common,
        attributes: { FanMorale: 2 },
    },
    {
        id: 11,
        name: "训练用锥桶",
        description: "一堆用于敏捷训练的橙色锥桶。",
        price: 25,
        rarity: Rarity.Common,
        attributes: { TrainingEfficiency: 1 },
    },
    {
        id: 12,
        name: "擦地板拖把",
        description: "用于清理球场湿滑区域的拖把和水桶。",
        price: 35,
        rarity: Rarity.Common,
        attributes: {},
    },
    {
        id: 13,
        name: "基础广告牌",
        description: "球场四周的静态广告牌，基础商业收入来源。",
        price: 70,
        rarity: Rarity.Common,
        attributes: { CommercialIncome: 1 },
    },
    {
        id: 14,
        name: "白色运动毛巾堆",
        description: "堆放整齐的白色运动毛巾，供球员使用。",
        price: 45,
        rarity: Rarity.Common,
        attributes: { StaminaRecovery: 1 },
    },
    {
        id: 15,
        name: "简陋的奖杯展示柜",
        description: "一个空荡荡的玻璃柜，等待被荣誉填满。",
        price: 90,
        rarity: Rarity.Common,
        attributes: { TeamSpirit: 1 },
    },

    // --- 16-30: 不常见 (Uncommon) ---
    {
        id: 16,
        name: "人体工学替补椅",
        description: "专为替补球员设计的舒适座椅，有助于保持状态。",
        price: 250,
        rarity: Rarity.Uncommon,
        attributes: { TeamSpirit: 3, StaminaRecovery: 1 },
    },
    {
        id: 17,
        name: "高清LED边线屏",
        description: "环绕球场边线的高清LED屏幕，可播放动态广告。",
        price: 450,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 4, CommercialIncome: 2 },
    },
    {
        id: 18,
        name: "专业级聚光灯",
        description: "提升球场亮度和氛围的专业级聚光灯。",
        price: 380,
        rarity: Rarity.Uncommon,
        attributes: { TrainingEfficiency: 2, FanMorale: 1 },
    },
    {
        id: 19,
        name: "带靠背的折叠座椅",
        description: "观众席升级，提供更好的观看体验。",
        price: 150,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 3 },
    },
    {
        id: 20,
        name: "运动饮料补给站",
        description: "提供多种运动饮料和能量棒的补给站。",
        price: 300,
        rarity: Rarity.Uncommon,
        attributes: { StaminaRecovery: 3 },
    },
    {
        id: 21,
        name: "定制队徽地毯",
        description: "印有精美球队队徽的厚实地毯，彰显球队文化。",
        price: 280,
        rarity: Rarity.Uncommon,
        attributes: { TeamSpirit: 3 },
    },
    {
        id: 22,
        name: "战术板和白板",
        description: "教练用于布置战术的专业设备。",
        price: 180,
        rarity: Rarity.Uncommon,
        attributes: { TrainingEfficiency: 2 },
    },
    {
        id: 23,
        name: "中场巨幅队旗",
        description: "比赛开始前在中场展开的巨幅队旗，鼓舞人心。",
        price: 400,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 5, TeamSpirit: 1 },
    },
    {
        id: 24,
        name: "吉祥物休息区",
        description: "为球队吉祥物准备的舒适休息和换装区域。",
        price: 200,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 3 },
    },
    {
        id: 25,
        name: "升级音响系统",
        description: "音质更佳的音响系统，提升现场氛围。",
        price: 550,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 5 },
    },
    {
        id: 26,
        name: "高精度投篮机",
        description: "用于辅助投篮训练的自动化设备。",
        price: 600,
        rarity: Rarity.Uncommon,
        attributes: { TrainingEfficiency: 3 },
    },
    {
        id: 27,
        name: "场边媒体工作台",
        description: "为记者和媒体准备的工作区域，吸引更多报道。",
        price: 350,
        rarity: Rarity.Uncommon,
        attributes: { CommercialIncome: 2 },
    },
    {
        id: 28,
        name: "定制色系地板漆",
        description: "使用球队主题色系重新粉刷球场地板。",
        price: 500,
        rarity: Rarity.Uncommon,
        attributes: { TeamSpirit: 2, FanMorale: 2 },
    },
    {
        id: 29,
        name: "便携式冷疗浴缸",
        description: "用于赛后快速恢复的简易冷疗设备。",
        price: 700,
        rarity: Rarity.Uncommon,
        attributes: { StaminaRecovery: 4 },
    },
    {
        id: 30,
        name: "球迷助威鼓",
        description: "放置在球迷区的大型助威鼓，提升现场噪音。",
        price: 100,
        rarity: Rarity.Uncommon,
        attributes: { FanMorale: 4 },
    },

    // --- 31-45: 稀有 (Rare) ---
    {
        id: 31,
        name: "豪华真皮替补席",
        description: "配备加热和按摩功能的豪华真皮替补席，顶级舒适。",
        price: 1500,
        rarity: Rarity.Rare,
        attributes: { TeamSpirit: 5, StaminaRecovery: 3 },
    },
    {
        id: 32,
        name: "四面悬挂式中央大屏",
        description: "悬挂在球场中央的四面高清大屏幕，全方位无死角。",
        price: 2500,
        rarity: Rarity.Rare,
        attributes: { FanMorale: 8, CommercialIncome: 4 },
    },
    {
        id: 33,
        name: "可编程RGBW照明系统",
        description: "能够根据比赛情况和音乐变色的智能照明系统。",
        price: 2000,
        rarity: Rarity.Rare,
        attributes: { FanMorale: 7, TrainingEfficiency: 3 },
    },
    {
        id: 34,
        name: "VIP包厢升级",
        description: "为贵宾提供极致体验的豪华私人包厢。",
        price: 1800,
        rarity: Rarity.Rare,
        attributes: { CommercialIncome: 5 },
    },
    {
        id: 35,
        name: "专业级康复设备区",
        description: "配备理疗床、按摩枪等专业康复设备的区域。",
        price: 3000,
        rarity: Rarity.Rare,
        attributes: { StaminaRecovery: 6, TrainingEfficiency: 1 },
    },
    {
        id: 36,
        name: "历史荣誉墙",
        description: "展示球队历年奖杯、球衣和重要照片的荣誉墙。",
        price: 1200,
        rarity: Rarity.Rare,
        attributes: { TeamSpirit: 6, FanMorale: 2 },
    },
    {
        id: 37,
        name: "高科技数据分析站",
        description: "配备高速电脑和专业软件，用于即时比赛数据分析。",
        price: 2200,
        rarity: Rarity.Rare,
        attributes: { TrainingEfficiency: 5 },
    },
    {
        id: 38,
        name: "全息投影仪",
        description: "能在中场投影出巨型队徽或球员形象的全息设备。",
        price: 3500,
        rarity: Rarity.Rare,
        attributes: { FanMorale: 9 },
    },
    {
        id: 39,
        name: "名人堂展品",
        description: "借来的退役球星签名球衣和鞋子，吸引球迷。",
        price: 2800,
        rarity: Rarity.Rare,
        attributes: { CommercialIncome: 3, FanMorale: 4 },
    },
    {
        id: 40,
        name: "环绕立体声系统",
        description: "顶级音质的环绕立体声系统，让每个角落的观众都能享受。",
        price: 4000,
        rarity: Rarity.Rare,
        attributes: { FanMorale: 10 },
    },
    {
        id: 41,
        name: "智能篮球训练系统",
        description: "能追踪投篮轨迹、分析动作的智能训练设备。",
        price: 4500,
        rarity: Rarity.Rare,
        attributes: { TrainingEfficiency: 7 },
    },
    {
        id: 42,
        name: "场边快速充电站",
        description: "为球员和教练的电子设备提供快速充电服务。",
        price: 1000,
        rarity: Rarity.Rare,
        attributes: { StaminaRecovery: 2, TeamSpirit: 3 },
    },
    {
        id: 43,
        name: "定制球场地板艺术",
        description: "由著名艺术家设计的球场中圈和三秒区图案。",
        price: 5000,
        rarity: Rarity.Rare,
        attributes: { TeamSpirit: 4, FanMorale: 5 },
    },
    {
        id: 44,
        name: "球衣退役旗帜",
        description: "悬挂在球场上空的退役球衣旗帜，象征荣耀。",
        price: 1300,
        rarity: Rarity.Rare,
        attributes: { TeamSpirit: 5 },
    },
    {
        id: 45,
        name: "豪华媒体发布厅",
        description: "配备专业灯光和背景板的赛后新闻发布厅。",
        price: 2700,
        rarity: Rarity.Rare,
        attributes: { CommercialIncome: 4 },
    },

    // --- 46-60: 史诗 (Epic) ---
    {
        id: 46,
        name: "磁悬浮替补舱",
        description: "未来科技，提供零重力休息环境，极致恢复。",
        price: 8000,
        rarity: Rarity.Epic,
        attributes: { StaminaRecovery: 12, TeamSpirit: 4 },
    },
    {
        id: 47,
        name: "360度环形LED屏幕",
        description: "环绕整个球场顶部的超大型LED屏幕，视觉震撼。",
        price: 12000,
        rarity: Rarity.Epic,
        attributes: { FanMorale: 15, CommercialIncome: 8 },
    },
    {
        id: 48,
        name: "AI智能追踪照明",
        description: "能自动跟随球员移动，并根据比赛节奏调整亮度的智能照明。",
        price: 10000,
        rarity: Rarity.Epic,
        attributes: { TrainingEfficiency: 10, FanMorale: 5 },
    },
    {
        id: 49,
        name: "私人定制豪华包厢群",
        description: "一整排由顶级设计师打造的豪华包厢，带来巨额收入。",
        price: 9000,
        rarity: Rarity.Epic,
        attributes: { CommercialIncome: 12 },
    },
    {
        id: 50,
        name: "高压氧舱康复中心",
        description: "配备多个高压氧舱，极大加速球员伤病恢复和体力恢复。",
        price: 15000,
        rarity: Rarity.Epic,
        attributes: { StaminaRecovery: 15, TrainingEfficiency: 2 },
    },
    {
        id: 51,
        name: "冠军戒指展示塔",
        description: "一座玻璃和金属打造的展示塔，陈列着球队所有的冠军戒指。",
        price: 7000,
        rarity: Rarity.Epic,
        attributes: { TeamSpirit: 15, FanMorale: 3 },
    },
    {
        id: 52,
        name: "虚拟现实战术训练室",
        description: "球员可以在虚拟环境中进行战术演练和模拟比赛。",
        price: 11000,
        rarity: Rarity.Epic,
        attributes: { TrainingEfficiency: 13 },
    },
    {
        id: 53,
        name: "球场地面投影系统",
        description: "能在球场地面投射出动态图案、数据或广告。",
        price: 13000,
        rarity: Rarity.Epic,
        attributes: { FanMorale: 18, CommercialIncome: 5 },
    },
    {
        id: 54,
        name: "退役球衣雕塑群",
        description: "以球队传奇球星退役球衣为主题的抽象雕塑群。",
        price: 6500,
        rarity: Rarity.Epic,
        attributes: { TeamSpirit: 10, FanMorale: 5 },
    },
    {
        id: 55,
        name: "全场动态音效系统",
        description: "根据比赛进程实时调整音效，模拟各种环境声。",
        price: 9500,
        rarity: Rarity.Epic,
        attributes: { FanMorale: 20 },
    },
    {
        id: 56,
        name: "多功能训练墙",
        description: "集成了反应训练、传球靶和力量测试的多功能墙。",
        price: 8500,
        rarity: Rarity.Epic,
        attributes: { TrainingEfficiency: 11 },
    },
    {
        id: 57,
        name: "场边机器人服务员",
        description: "为替补席和VIP区提供饮料和毛巾服务的机器人。",
        price: 5000,
        rarity: Rarity.Epic,
        attributes: { CommercialIncome: 6, TeamSpirit: 2 },
    },
    {
        id: 58,
        name: "可伸缩玻璃地板",
        description: "能在短时间内更换为其他运动场地板的玻璃系统。",
        price: 14000,
        rarity: Rarity.Epic,
        attributes: { CommercialIncome: 10, FanMorale: 5 },
    },
    {
        id: 59,
        name: "生物反馈休息舱",
        description: "监测球员生理数据并提供定制化放松程序的休息舱。",
        price: 16000,
        rarity: Rarity.Epic,
        attributes: { StaminaRecovery: 18 },
    },
    {
        id: 60,
        name: "巨型充气吉祥物",
        description: "比赛中场休息时升起的超大型充气吉祥物。",
        price: 4500,
        rarity: Rarity.Epic,
        attributes: { FanMorale: 12 },
    },

    // --- 61-70: 传说 (Legendary) ---
    {
        id: 61,
        name: "全息教练替补席",
        description: "替补席上能实时显示球员状态和全息战术图的控制台。",
        price: 30000,
        rarity: Rarity.Legendary,
        attributes: { TeamSpirit: 25, TrainingEfficiency: 10 },
    },
    {
        id: 62,
        name: "宇宙级星空穹顶",
        description: "球馆顶部安装的超高清LED屏幕，能模拟璀璨的星空或动态的城市景观。",
        price: 50000,
        rarity: Rarity.Legendary,
        attributes: { FanMorale: 40, CommercialIncome: 15 },
    },
    {
        id: 63,
        name: "能量恢复矩阵",
        description: "一种神秘的科技装置，能大幅提升球员在休息时的能量恢复效率。",
        price: 45000,
        rarity: Rarity.Legendary,
        attributes: { StaminaRecovery: 50 },
    },
    {
        id: 64,
        name: "不朽传奇雕像",
        description: "一座由稀有金属铸造的球队历史最佳球员雕像，永久激励人心。",
        price: 35000,
        rarity: Rarity.Legendary,
        attributes: { TeamSpirit: 30, FanMorale: 10 },
    },
    {
        id: 65,
        name: "时空穿梭球场地板",
        description: "传说中的地板，能微调时间流逝，略微增加训练时长。",
        price: 60000,
        rarity: Rarity.Legendary,
        attributes: { TrainingEfficiency: 25, StaminaRecovery: 5 },
    },
    {
        id: 66,
        name: "全球直播中心",
        description: "内置顶级直播设备和卫星链路的媒体中心，吸引全球关注。",
        price: 40000,
        rarity: Rarity.Legendary,
        attributes: { CommercialIncome: 30, FanMorale: 10 },
    },
    {
        id: 67,
        name: "冠军之魂火炬",
        description: "一座永不熄灭的火炬，象征球队的冠军精神，大幅提升士气。",
        price: 25000,
        rarity: Rarity.Legendary,
        attributes: { TeamSpirit: 40 },
    },
    {
        id: 68,
        name: "超感知球迷互动区",
        description: "利用先进传感器和AI技术，实现球迷与比赛的深度互动，创造狂热氛围。",
        price: 55000,
        rarity: Rarity.Legendary,
        attributes: { FanMorale: 55 },
    },
    {
        id: 69,
        name: "无限能源发电机",
        description: "为球场提供清洁、无限能源，大幅降低运营成本，间接提升收入。",
        price: 38000,
        rarity: Rarity.Legendary,
        attributes: { CommercialIncome: 20, TrainingEfficiency: 5 },
    },
    {
        id: 70,
        name: "篮球圣地核心",
        description: "据说是篮球之神遗留下的核心装置，全面提升所有属性。",
        price: 99999,
        rarity: Rarity.Legendary,
        attributes: {
            FanMorale: 30,
            TeamSpirit: 30,
            TrainingEfficiency: 15,
            CommercialIncome: 15,
            StaminaRecovery: 15,
        },
    },
];