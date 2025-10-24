// client/src/game/items/SpecialItems.ts

/**
 * 稀有度枚举
 * Common: 普通 (灰色)
 * Uncommon: 罕见 (绿色)
 * Rare: 稀有 (蓝色)
 * Epic: 史诗 (紫色)
 * Legendary: 传说 (橙色)
 */
export enum Rarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
}

/**
 * 特殊道具属性接口
 * name: 道具名称
 * description: 道具描述
 * effect: 道具效果，可以是属性加成、经验值、金钱等
 * price: 道具出售价格（或购买价格）
 * rarity: 稀有度
 */
export interface SpecialItem {
    id: number;
    name: string;
    description: string;
    effect: {
        type: 'EXP' | 'Money' | 'StatBoost' | 'SkillUnlock' | 'TemporaryBuff' | 'Cosmetic';
        value: any; // 具体效果值，例如 { stat: 'Shooting', amount: 5 } 或 1000 (经验/金钱)
    };
    price: number;
    rarity: Rarity;
}

/**
 * 篮球主题特殊道具数据库
 */
export const SpecialItemsDB: SpecialItem[] = [
    // 经验与成长类 (1-10)
    {
        id: 1,
        name: "训练手册：基础运球",
        description: "详细的基础运球训练指南，能提供少量经验值。",
        effect: { type: 'EXP', value: 500 },
        price: 50,
        rarity: Rarity.Common,
    },
    {
        id: 2,
        name: "体能恢复饮料",
        description: "快速补充体力，短暂提升下一场比赛的移动速度。",
        effect: { type: 'TemporaryBuff', value: { stat: 'Speed', amount: 10, duration: '1 Game' } },
        price: 80,
        rarity: Rarity.Common,
    },
    {
        id: 3,
        name: "战术图板碎片",
        description: "收集完整的图板可以解锁新的战术。提供少量金钱。",
        effect: { type: 'Money', value: 150 },
        price: 30,
        rarity: Rarity.Common,
    },
    {
        id: 4,
        name: "高级训练营邀请函",
        description: "获得一次参加为期一周的高级训练营的机会，大幅增加经验。",
        effect: { type: 'EXP', value: 5000 },
        price: 500,
        rarity: Rarity.Uncommon,
    },
    {
        id: 5,
        name: "球探报告：潜力新星",
        description: "一份关于未来之星的详细报告，永久提升球员的潜力值。",
        effect: { type: 'StatBoost', value: { stat: 'Potential', amount: 1 } },
        price: 1200,
        rarity: Rarity.Rare,
    },
    {
        id: 6,
        name: "传奇教练的笔记",
        description: "记载了传奇教练的训练心得，永久提升球员的训练效率。",
        effect: { type: 'StatBoost', value: { stat: 'TrainingEfficiency', amount: 5 } },
        price: 3000,
        rarity: Rarity.Epic,
    },
    {
        id: 7,
        name: "MVP赛季纪念戒指",
        description: "佩戴者仿佛被MVP光环笼罩，获得巨额经验奖励。",
        effect: { type: 'EXP', value: 20000 },
        price: 8000,
        rarity: Rarity.Legendary,
    },
    {
        id: 8,
        name: "精准投篮秘籍",
        description: "一本稀有的训练秘籍，永久提升投篮属性。",
        effect: { type: 'StatBoost', value: { stat: 'Shooting', amount: 3 } },
        price: 1500,
        rarity: Rarity.Rare,
    },
    {
        id: 9,
        name: "防守大师徽章",
        description: "象征着顶级防守者的荣誉，永久提升抢断和盖帽属性。",
        effect: { type: 'StatBoost', value: { stat: 'Defense', amount: 2 } },
        price: 1800,
        rarity: Rarity.Rare,
    },
    {
        id: 10,
        name: "全明星周末门票",
        description: "一张珍贵的门票，提供大量金钱奖励。",
        effect: { type: 'Money', value: 3000 },
        price: 1000,
        rarity: Rarity.Uncommon,
    },

    // 技能与战术类 (11-20)
    {
        id: 11,
        name: "技能解锁卡：后撤步跳投",
        description: "使用后可立即解锁'后撤步跳投'技能。",
        effect: { type: 'SkillUnlock', value: 'Stepback Jumper' },
        price: 2500,
        rarity: Rarity.Epic,
    },
    {
        id: 12,
        name: "战术大师卷轴",
        description: "学习一种新的高级进攻战术。",
        effect: { type: 'SkillUnlock', value: 'Advanced Offense Play' },
        price: 1800,
        rarity: Rarity.Rare,
    },
    {
        id: 13,
        name: "临时战术调整卡",
        description: "在比赛中可额外进行一次战术暂停和调整。",
        effect: { type: 'TemporaryBuff', value: { type: 'ExtraTimeout', amount: 1 } },
        price: 400,
        rarity: Rarity.Uncommon,
    },
    {
        id: 14,
        name: "技能升级书：欧洲步",
        description: "提升'欧洲步'技能的等级和成功率。",
        effect: { type: 'StatBoost', value: { skill: 'Eurostep', amount: 1 } },
        price: 1000,
        rarity: Rarity.Rare,
    },
    {
        id: 15,
        name: "防守策略手册：区域联防",
        description: "解锁'区域联防'战术，适合对抗内线强队。",
        effect: { type: 'SkillUnlock', value: 'Zone Defense' },
        price: 1500,
        rarity: Rarity.Rare,
    },
    {
        id: 16,
        name: "绝杀时刻灵感",
        description: "在比赛最后时刻使用，短暂提升关键属性。",
        effect: { type: 'TemporaryBuff', value: { stat: 'Clutch', amount: 20, duration: 'Final Minute' } },
        price: 5000,
        rarity: Rarity.Legendary,
    },
    {
        id: 17,
        name: "技能解锁卡：空中接力",
        description: "解锁华丽的'空中接力'传球和终结技能。",
        effect: { type: 'SkillUnlock', value: 'Alley-Oop' },
        price: 2200,
        rarity: Rarity.Epic,
    },
    {
        id: 18,
        name: "快速传球训练带",
        description: "永久提升传球速度和准确性。",
        effect: { type: 'StatBoost', value: { stat: 'Passing', amount: 2 } },
        price: 900,
        rarity: Rarity.Uncommon,
    },
    {
        id: 19,
        name: "篮下终结指南",
        description: "专门针对篮下得分的技巧，永久提升上篮和扣篮属性。",
        effect: { type: 'StatBoost', value: { stat: 'Finishing', amount: 3 } },
        price: 1600,
        rarity: Rarity.Rare,
    },
    {
        id: 20,
        name: "铁血防守宣言",
        description: "使用后，在下一场比赛中，防守属性获得大幅临时提升。",
        effect: { type: 'TemporaryBuff', value: { stat: 'Defense', amount: 15, duration: '1 Game' } },
        price: 1000,
        rarity: Rarity.Uncommon,
    },

    // 幸运与消耗品类 (21-30)
    {
        id: 21,
        name: "幸运四叶草护腕",
        description: "微弱地提升比赛中获得稀有掉落的几率。",
        effect: { type: 'StatBoost', value: { stat: 'Luck', amount: 5 } },
        price: 600,
        rarity: Rarity.Uncommon,
    },
    {
        id: 22,
        name: "球鞋清洁套装",
        description: "保持球鞋最佳状态，短暂提升下一场比赛的敏捷度。",
        effect: { type: 'TemporaryBuff', value: { stat: 'Agility', amount: 5, duration: '1 Game' } },
        price: 120,
        rarity: Rarity.Common,
    },
    {
        id: 23,
        name: "神秘的篮球",
        description: "一个外观独特的篮球，使用后获得随机属性提升。",
        effect: { type: 'StatBoost', value: { stat: 'Random', amount: 1 } },
        price: 2000,
        rarity: Rarity.Rare,
    },
    {
        id: 24,
        name: "伤病恢复药剂",
        description: "立即治愈一次轻微伤病，缩短伤病恢复时间。",
        effect: { type: 'TemporaryBuff', value: { type: 'Heal', amount: 'Minor Injury' } },
        price: 800,
        rarity: Rarity.Rare,
    },
    {
        id: 25,
        name: "球场魔术师的幸运符",
        description: "大幅提升比赛中触发特殊事件（如绝杀、抢断）的几率。",
        effect: { type: 'StatBoost', value: { stat: 'ClutchLuck', amount: 10 } },
        price: 4000,
        rarity: Rarity.Epic,
    },
    {
        id: 26,
        name: "金币袋",
        description: "装满了金币的小袋子，提供中等金钱奖励。",
        effect: { type: 'Money', value: 1000 },
        price: 350,
        rarity: Rarity.Uncommon,
    },
    {
        id: 27,
        name: "快速换装卡",
        description: "在比赛中可使用一次，立即更换球员的装备。",
        effect: { type: 'Cosmetic', value: { type: 'In-game Gear Swap' } },
        price: 200,
        rarity: Rarity.Common,
    },
    {
        id: 28,
        name: "体能透支剂",
        description: "以牺牲少量体能上限为代价，暂时获得巨大的属性提升。",
        effect: { type: 'TemporaryBuff', value: { stat: 'AllStats', amount: 10, duration: '1 Quarter' } },
        price: 6000,
        rarity: Rarity.Legendary,
    },
    {
        id: 29,
        name: "媒体关注度提升卡",
        description: "使用后，下一场比赛的媒体关注度提高，增加比赛奖励。",
        effect: { type: 'Money', value: 'Reward Multiplier x1.5' },
        price: 1500,
        rarity: Rarity.Rare,
    },
    {
        id: 30,
        name: "团队士气鼓舞旗帜",
        description: "在比赛中使用，短暂提升全队士气和配合度。",
        effect: { type: 'TemporaryBuff', value: { stat: 'Teamwork', amount: 10, duration: '1 Half' } },
        price: 900,
        rarity: Rarity.Uncommon,
    },

    // 外观与特殊收藏品类 (31-40)
    {
        id: 31,
        name: "复古球衣碎片",
        description: "收集一定数量可以兑换一件稀有的复古球衣。",
        effect: { type: 'Cosmetic', value: { type: 'Fragment', item: 'Retro Jersey' } },
        price: 100,
        rarity: Rarity.Common,
    },
    {
        id: 32,
        name: "签名篮球：乔丹",
        description: "传说中迈克尔·乔丹亲笔签名的篮球，极具收藏价值。",
        effect: { type: 'Cosmetic', value: { type: 'Collectible', name: 'Jordan Signed Ball' } },
        price: 50000,
        rarity: Rarity.Legendary,
    },
    {
        id: 33,
        name: "特殊发型解锁券",
        description: "解锁一个独特的球员发型选项。",
        effect: { type: 'Cosmetic', value: { type: 'Hairstyle Unlock' } },
        price: 700,
        rarity: Rarity.Rare,
    },
    {
        id: 34,
        name: "球场特效：火焰灌篮",
        description: "解锁'火焰灌篮'特效，在灌篮时触发。",
        effect: { type: 'Cosmetic', value: { type: 'Dunk Effect', effect: 'Flame' } },
        price: 3500,
        rarity: Rarity.Epic,
    },
    {
        id: 35,
        name: "定制球鞋设计图",
        description: "获得一次设计独一无二的定制球鞋的机会。",
        effect: { type: 'Cosmetic', value: { type: 'Custom Shoe Blueprint' } },
        price: 2800,
        rarity: Rarity.Epic,
    },
    {
        id: 36,
        name: "啦啦队服装解锁卡",
        description: "解锁一套特殊的啦啦队服装，用于主场比赛。",
        effect: { type: 'Cosmetic', value: { type: 'Cheerleader Outfit' } },
        price: 1200,
        rarity: Rarity.Rare,
    },
    {
        id: 37,
        name: "球队吉祥物玩偶",
        description: "一个可爱的吉祥物玩偶，提供微小的金钱加成。",
        effect: { type: 'Money', value: 50 },
        price: 50,
        rarity: Rarity.Common,
    },
    {
        id: 38,
        name: "名人堂入场券",
        description: "一张象征至高荣誉的入场券，永久提升球员声望。",
        effect: { type: 'StatBoost', value: { stat: 'Reputation', amount: 5 } },
        price: 10000,
        rarity: Rarity.Legendary,
    },
    {
        id: 39,
        name: "球馆升级蓝图",
        description: "一份稀有的球馆升级设计图，永久提升主场优势。",
        effect: { type: 'StatBoost', value: { stat: 'HomeCourtAdvantage', amount: 3 } },
        price: 4500,
        rarity: Rarity.Epic,
    },
    {
        id: 40,
        name: "年度最佳新秀奖杯",
        description: "复制品，但仍能带来好运，永久提升球员的媒体曝光率。",
        effect: { type: 'StatBoost', value: { stat: 'MediaExposure', amount: 2 } },
        price: 2000,
        rarity: Rarity.Rare,
    },
];