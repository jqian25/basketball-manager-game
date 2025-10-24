// client/src/game/items/CollectiblesDatabase.ts

/**
 * 物品稀有度枚举
 */
export enum Rarity {
    Common = "普通",
    Uncommon = "不常见",
    Rare = "稀有",
    Epic = "史诗",
    Legendary = "传奇",
    Mythic = "神话"
}

/**
 * 物品属性/效果接口
 */
export interface ItemAttribute {
    // 假设纪念品提供某种游戏内的属性加成
    statName: 'Offense' | 'Defense' | 'Stamina' | 'Luck' | 'Fandom'; // 属性名称
    value: number; // 属性值
}

/**
 * 纪念品物品数据结构
 */
export interface CollectibleItem {
    id: number; // 唯一ID
    name: string; // 名称
    description: string; // 描述
    attributes: ItemAttribute[]; // 属性列表
    price: number; // 价格 (游戏币)
    rarity: Rarity; // 稀有度
    theme: string; // 篮球主题细分 (如: 冠军, 签名, 历史时刻)
}

/**
 * 纪念品数据库
 */
export const CollectiblesDatabase: CollectibleItem[] = [
    // 1-10: Common (普通)
    {
        id: 1,
        name: "普通训练篮球",
        description: "一个磨损严重的标准训练篮球，手感一般。",
        attributes: [{ statName: 'Stamina', value: 1 }],
        price: 50,
        rarity: Rarity.Common,
        theme: "训练器材"
    },
    {
        id: 2,
        name: "球队宣传海报",
        description: "上赛季的球队宣传海报，有些许褶皱。",
        attributes: [{ statName: 'Fandom', value: 1 }],
        price: 40,
        rarity: Rarity.Common,
        theme: "宣传品"
    },
    {
        id: 3,
        name: "球馆旧票根",
        description: "一张多年前的普通比赛门票票根。",
        attributes: [{ statName: 'Luck', value: 1 }],
        price: 60,
        rarity: Rarity.Common,
        theme: "比赛记忆"
    },
    {
        id: 4,
        name: "啦啦队小彩球",
        description: "一场比赛结束后捡到的啦啦队彩球。",
        attributes: [{ statName: 'Stamina', value: 1 }],
        price: 30,
        rarity: Rarity.Common,
        theme: "场边物品"
    },
    {
        id: 5,
        name: "球队吉祥物钥匙扣",
        description: "印有球队吉祥物的小塑料钥匙扣。",
        attributes: [{ statName: 'Fandom', value: 1 }],
        price: 55,
        rarity: Rarity.Common,
        theme: "周边商品"
    },
    {
        id: 6,
        name: "快餐店联名纸杯",
        description: "印有球星头像的限定版纸杯。",
        attributes: [{ statName: 'Luck', value: 1 }],
        price: 35,
        rarity: Rarity.Common,
        theme: "联名周边"
    },
    {
        id: 7,
        name: "赛后地板碎屑",
        description: "从球场地板上收集到的一小撮木屑。",
        attributes: [{ statName: 'Defense', value: 1 }],
        price: 45,
        rarity: Rarity.Common,
        theme: "球场痕迹"
    },
    {
        id: 8,
        name: "普通球员卡",
        description: "一张量产的普通球员卡，没有特殊价值。",
        attributes: [{ statName: 'Offense', value: 1 }],
        price: 50,
        rarity: Rarity.Common,
        theme: "集换卡牌"
    },
    {
        id: 9,
        name: "球队队徽贴纸",
        description: "一张印有球队队徽的贴纸。",
        attributes: [{ statName: 'Fandom', value: 1 }],
        price: 25,
        rarity: Rarity.Common,
        theme: "装饰品"
    },
    {
        id: 10,
        name: "旧款护腕",
        description: "一条褪色的旧款篮球护腕。",
        attributes: [{ statName: 'Stamina', value: 1 }],
        price: 40,
        rarity: Rarity.Common,
        theme: "装备"
    },
    
    // 11-20: Uncommon (不常见)
    {
        id: 11,
        name: "球队限量版毛巾",
        description: "印有球队口号的限量版毛巾，吸汗效果不错。",
        attributes: [{ statName: 'Stamina', value: 3 }],
        price: 150,
        rarity: Rarity.Uncommon,
        theme: "周边商品"
    },
    {
        id: 12,
        name: "新秀赛季球衣碎片",
        description: "一张镶嵌着某球员新秀赛季球衣一小块布料的卡片。",
        attributes: [{ statName: 'Luck', value: 2 }, { statName: 'Fandom', value: 1 }],
        price: 200,
        rarity: Rarity.Uncommon,
        theme: "球衣碎片"
    },
    {
        id: 13,
        name: "训练营用篮球",
        description: "在球队训练营中使用过的篮球，带有训练的汗水和印记。",
        attributes: [{ statName: 'Offense', value: 2 }],
        price: 180,
        rarity: Rarity.Uncommon,
        theme: "训练器材"
    },
    {
        id: 14,
        name: "退役球星主题马克杯",
        description: "印有退役传奇球星经典动作的陶瓷马克杯。",
        attributes: [{ statName: 'Fandom', value: 3 }],
        price: 120,
        rarity: Rarity.Uncommon,
        theme: "周边商品"
    },
    {
        id: 15,
        name: "客场之旅纪念徽章",
        description: "球队客场挑战时发行的纪念徽章。",
        attributes: [{ statName: 'Luck', value: 3 }],
        price: 160,
        rarity: Rarity.Uncommon,
        theme: "纪念品"
    },
    {
        id: 16,
        name: "防守悍将签名照（印刷）",
        description: "一张印刷签名的防守型球员照片。",
        attributes: [{ statName: 'Defense', value: 3 }],
        price: 140,
        rarity: Rarity.Uncommon,
        theme: "签名周边"
    },
    {
        id: 17,
        name: "半场投篮挑战奖品",
        description: "在球馆半场投篮挑战中赢得的小奖品。",
        attributes: [{ statName: 'Offense', value: 2 }, { statName: 'Luck', value: 1 }],
        price: 170,
        rarity: Rarity.Uncommon,
        theme: "球馆活动"
    },
    {
        id: 18,
        name: "球队战术板复刻品",
        description: "一张缩小版的球队战术板复刻品。",
        attributes: [{ statName: 'Defense', value: 2 }],
        price: 190,
        rarity: Rarity.Uncommon,
        theme: "战术分析"
    },
    {
        id: 19,
        name: "季后赛首轮门票",
        description: "一张本赛季季后赛首轮比赛的门票。",
        attributes: [{ statName: 'Fandom', value: 2 }, { statName: 'Stamina', value: 1 }],
        price: 210,
        rarity: Rarity.Uncommon,
        theme: "比赛记忆"
    },
    {
        id: 20,
        name: "球员更衣室挂锁",
        description: "一个退役球员更衣室储物柜上用过的普通挂锁。",
        attributes: [{ statName: 'Stamina', value: 2 }, { statName: 'Defense', value: 1 }],
        price: 130,
        rarity: Rarity.Uncommon,
        theme: "更衣室"
    },

    // 21-30: Rare (稀有)
    {
        id: 21,
        name: "全明星赛纪念T恤",
        description: "一件保存完好的全明星周末纪念T恤。",
        attributes: [{ statName: 'Offense', value: 4 }, { statName: 'Fandom', value: 2 }],
        price: 450,
        rarity: Rarity.Rare,
        theme: "全明星"
    },
    {
        id: 22,
        name: "绝杀之夜比赛用球（未签名）",
        description: "某场比赛绝杀球发生时场上使用的比赛用球，但没有签名。",
        attributes: [{ statName: 'Luck', value: 5 }],
        price: 550,
        rarity: Rarity.Rare,
        theme: "历史时刻"
    },
    {
        id: 23,
        name: "传奇教练战术笔记（复刻）",
        description: "一本传奇教练手写战术笔记的限量复刻版。",
        attributes: [{ statName: 'Defense', value: 4 }, { statName: 'Stamina', value: 2 }],
        price: 480,
        rarity: Rarity.Rare,
        theme: "教练遗产"
    },
    {
        id: 24,
        name: "球员赛前热身服",
        description: "一件球员在赛前热身时穿过的训练服，有轻微汗渍。",
        attributes: [{ statName: 'Stamina', value: 5 }],
        price: 520,
        rarity: Rarity.Rare,
        theme: "装备"
    },
    {
        id: 25,
        name: "三连冠时期队旗",
        description: "球队三连冠时期在球馆悬挂的队旗之一。",
        attributes: [{ statName: 'Fandom', value: 5 }],
        price: 600,
        rarity: Rarity.Rare,
        theme: "冠军荣耀"
    },
    {
        id: 26,
        name: "新秀墙签名卡",
        description: "一张潜力新秀在突破“新秀墙”后首次签名的卡片。",
        attributes: [{ statName: 'Offense', value: 3 }, { statName: 'Luck', value: 3 }],
        price: 470,
        rarity: Rarity.Rare,
        theme: "签名卡牌"
    },
    {
        id: 27,
        name: "明星球员护踝",
        description: "一位全明星球员在比赛中佩戴过的护踝。",
        attributes: [{ statName: 'Defense', value: 5 }],
        price: 530,
        rarity: Rarity.Rare,
        theme: "装备"
    },
    {
        id: 28,
        name: "打破纪录之夜的计时器",
        description: "一个在某球员打破得分纪录之夜使用过的比赛计时器。",
        attributes: [{ statName: 'Offense', value: 5 }],
        price: 580,
        rarity: Rarity.Rare,
        theme: "历史时刻"
    },
    {
        id: 29,
        name: "场边记者旧笔记本",
        description: "一本资深场边记者记录了多年比赛心得的笔记本。",
        attributes: [{ statName: 'Luck', value: 4 }, { statName: 'Fandom', value: 2 }],
        price: 490,
        rarity: Rarity.Rare,
        theme: "媒体遗产"
    },
    {
        id: 30,
        name: "球队老板的雪茄盒",
        description: "一个球队老板在夺冠庆祝时使用过的雪茄盒。",
        attributes: [{ statName: 'Stamina', value: 4 }, { statName: 'Offense', value: 2 }],
        price: 510,
        rarity: Rarity.Rare,
        theme: "幕后故事"
    },

    // 31-40: Epic (史诗)
    {
        id: 31,
        name: "总决赛MVP签名篮球",
        description: "一位总决赛MVP亲笔签名的官方比赛用球。",
        attributes: [{ statName: 'Offense', value: 7 }, { statName: 'Fandom', value: 5 }],
        price: 1800,
        rarity: Rarity.Epic,
        theme: "签名球"
    },
    {
        id: 32,
        name: "退役球衣悬挂仪式邀请函",
        description: "一张某传奇球星退役球衣悬挂仪式的限量邀请函。",
        attributes: [{ statName: 'Luck', value: 6 }, { statName: 'Fandom', value: 6 }],
        price: 1600,
        rarity: Rarity.Epic,
        theme: "传奇退役"
    },
    {
        id: 33,
        name: "名人堂入选典礼领带",
        description: "一位名人堂成员在入选典礼上佩戴过的领带。",
        attributes: [{ statName: 'Stamina', value: 7 }, { statName: 'Luck', value: 4 }],
        price: 1750,
        rarity: Rarity.Epic,
        theme: "名人堂"
    },
    {
        id: 34,
        name: "关键抢断后球员摔倒的地板",
        description: "一块从球场上拆下的地板，据说是某球员完成关键抢断后摔倒的地方。",
        attributes: [{ statName: 'Defense', value: 8 }],
        price: 1900,
        rarity: Rarity.Epic,
        theme: "球场痕迹"
    },
    {
        id: 35,
        name: "赛季最佳防守球员奖杯底座",
        description: "一座赛季最佳防守球员奖杯的底座部分。",
        attributes: [{ statName: 'Defense', value: 7 }, { statName: 'Stamina', value: 5 }],
        price: 1850,
        rarity: Rarity.Epic,
        theme: "个人荣誉"
    },
    {
        id: 36,
        name: "球星赛前冥想坐垫",
        description: "某超级巨星在每次赛前冥想时使用的坐垫。",
        attributes: [{ statName: 'Stamina', value: 8 }],
        price: 1700,
        rarity: Rarity.Epic,
        theme: "幕后故事"
    },
    {
        id: 37,
        name: "球队历史得分王的首个得分球衣",
        description: "该球员职业生涯首个得分时所穿的球衣碎片。",
        attributes: [{ statName: 'Offense', value: 8 }],
        price: 2000,
        rarity: Rarity.Epic,
        theme: "球衣碎片"
    },
    {
        id: 38,
        name: "冠军戒指设计草图",
        description: "一份球队冠军戒指的原始设计草图。",
        attributes: [{ statName: 'Luck', value: 7 }, { statName: 'Offense', value: 3 }],
        price: 1650,
        rarity: Rarity.Epic,
        theme: "冠军荣耀"
    },
    {
        id: 39,
        name: "主教练的战术笔",
        description: "主教练在总决赛中用来画战术的笔。",
        attributes: [{ statName: 'Defense', value: 6 }, { statName: 'Luck', value: 5 }],
        price: 1950,
        rarity: Rarity.Epic,
        theme: "教练遗产"
    },
    {
        id: 40,
        name: "球队更衣室白板（部分）",
        description: "一块从球队更衣室拆下的白板，上面留有未擦除的战术涂鸦。",
        attributes: [{ statName: 'Fandom', value: 7 }, { statName: 'Defense', value: 4 }],
        price: 1780,
        rarity: Rarity.Epic,
        theme: "更衣室"
    },

    // 41-50: Legendary & Mythic (传奇 & 神话)
    {
        id: 41,
        name: "四连冠时期总决赛用球",
        description: "球队四连冠时期某场总决赛的官方比赛用球。",
        attributes: [{ statName: 'Offense', value: 10 }, { statName: 'Defense', value: 10 }],
        price: 4500,
        rarity: Rarity.Legendary,
        theme: "冠军荣耀"
    },
    {
        id: 42,
        name: "历史得分王签名球鞋",
        description: "历史得分王在打破纪录之夜亲穿并签名的球鞋。",
        attributes: [{ statName: 'Offense', value: 12 }, { statName: 'Stamina', value: 8 }],
        price: 5200,
        rarity: Rarity.Legendary,
        theme: "签名装备"
    },
    {
        id: 43,
        name: "三双之夜汗巾",
        description: "某超级巨星在完成生涯首次三双之夜使用过的汗巾。",
        attributes: [{ statName: 'Stamina', value: 11 }, { statName: 'Luck', value: 9 }],
        price: 4800,
        rarity: Rarity.Legendary,
        theme: "历史时刻"
    },
    {
        id: 44,
        name: "名人堂成员新秀赛季球衣",
        description: "一位名人堂成员新秀赛季穿过并签名的完整球衣。",
        attributes: [{ statName: 'Fandom', value: 12 }, { statName: 'Offense', value: 8 }],
        price: 5500,
        rarity: Rarity.Legendary,
        theme: "签名球衣"
    },
    {
        id: 45,
        name: "冠军戒指（复刻版，附证书）",
        description: "一枚带有官方认证证书的球队冠军戒指高精度复刻版。",
        attributes: [{ statName: 'Luck', value: 12 }],
        price: 4900,
        rarity: Rarity.Legendary,
        theme: "冠军荣耀"
    },
    {
        id: 46,
        name: "球队创始文件原件",
        description: "球队成立时签署的原始文件，具有极高历史价值。",
        attributes: [{ statName: 'Fandom', value: 15 }],
        price: 8000,
        rarity: Rarity.Mythic,
        theme: "球队历史"
    },
    {
        id: 47,
        name: "“乔丹”式罚球线起跳点地板",
        description: "一块从全明星赛场上拆下的地板，据称是某次罚球线起跳扣篮的起跳点。",
        attributes: [{ statName: 'Offense', value: 15 }, { statName: 'Luck', value: 10 }],
        price: 9500,
        rarity: Rarity.Mythic,
        theme: "历史时刻"
    },
    {
        id: 48,
        name: "绝杀球星的亲笔战术涂鸦",
        description: "一张被绝杀球星在赛前战术板上亲笔涂鸦的纸条。",
        attributes: [{ statName: 'Defense', value: 15 }, { statName: 'Offense', value: 15 }],
        price: 10000,
        rarity: Rarity.Mythic,
        theme: "签名周边"
    },
    {
        id: 49,
        name: "隐藏的冠军奖杯碎片",
        description: "一个被遗忘在球馆角落的，来自某座失传冠军奖杯的一小块碎片。",
        attributes: [{ statName: 'Stamina', value: 15 }, { statName: 'Defense', value: 10 }],
        price: 8500,
        rarity: Rarity.Mythic,
        theme: "失落的宝藏"
    },
    {
        id: 50,
        name: "篮球之神的首个签名篮球",
        description: "据说是篮球历史上最伟大的球员，在职业生涯首次签名活动中签下的篮球。",
        attributes: [{ statName: 'Offense', value: 20 }, { statName: 'Fandom', value: 20 }],
        price: 12000,
        rarity: Rarity.Mythic,
        theme: "篮球之神"
    }
];

// 导出物品数量
export const CollectiblesCount = CollectiblesDatabase.length;