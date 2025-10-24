/**
 * client/src/game/equipment/Weapons.ts
 * 篮球RPG游戏武器装备系统
 */

// 1. 数据结构定义

/** 装备槽位类型 */
export enum EquipmentSlot {
    Head = 'Head',          // 头部 (如头带、发型)
    Body = 'Body',          // 身体 (如球衣、护甲)
    Feet = 'Feet',          // 脚部 (如球鞋)
    Accessory = 'Accessory',// 配饰 (如护腕、项链)
    Weapon = 'Weapon'       // 武器 (如篮球本身，或特殊道具)
}

/** 装备稀有度 */
export enum Rarity {
    Common = 'Common',          // 普通 (白色)
    Uncommon = 'Uncommon',      // 优秀 (绿色)
    Rare = 'Rare',              // 稀有 (蓝色)
    Epic = 'Epic',              // 史诗 (紫色)
    Legendary = 'Legendary',    // 传说 (橙色)
    Mythic = 'Mythic'           // 神话 (红色)
}

/** 属性类型 */
export interface Stats {
    Shooting?: number;      // 投篮 (影响命中率和射程)
    Dribbling?: number;     // 运球 (影响控球能力和突破成功率)
    Defense?: number;       // 防守 (影响抢断、盖帽和防守站位)
    Passing?: number;       // 传球 (影响传球精度和视野)
    Stamina?: number;       // 体能 (影响持续作战能力和疲劳恢复)
    Strength?: number;      // 力量 (影响对抗和篮板)
    Speed?: number;         // 速度 (影响跑动和快攻)
}

/** 装备接口 */
export interface Equipment {
    id: string;
    name: string;
    slot: EquipmentSlot;
    rarity: Rarity;
    description: string;
    stats: Stats;
    specialEffect?: string; // 特殊效果描述
}

// 2. 详细配置数据 (40种装备)

export const EquipmentData: Record<string, Equipment> = {
    // --- 头部装备 (Head) ---
    'EQ001': {
        id: 'EQ001',
        name: '红色汗巾',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Common,
        description: '最基础的装备，能吸收汗水，让你保持清醒。',
        stats: { Stamina: 2 },
    },
    'EQ002': {
        id: 'EQ002',
        name: '老将头带',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Uncommon,
        description: '被无数汗水浸透的头带，象征着经验和沉稳。',
        stats: { Defense: 3, Stamina: 1 },
        specialEffect: '略微提升在关键时刻的防守专注度。',
    },
    'EQ003': {
        id: 'EQ003',
        name: '爆炸头假发',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Rare,
        description: '复古的造型，能有效干扰对手的视野。',
        stats: { Dribbling: 5, Shooting: -2 },
        specialEffect: '【街球风范】运球时有小概率晃倒对手。',
    },
    'EQ004': {
        id: 'EQ004',
        name: '战术分析仪',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Epic,
        description: '高科技装备，能实时分析对手的跑位和习惯。',
        stats: { Passing: 8, Defense: 5 },
        specialEffect: '【鹰眼】传球视野大幅提升，减少失误率。',
    },
    'EQ005': {
        id: 'EQ005',
        name: '冠军戒指头箍',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Legendary,
        description: '用冠军戒指串成的头箍，散发着胜利的光芒。',
        stats: { Shooting: 10, Passing: 10, Stamina: 5 },
        specialEffect: '【领袖气质】全队士气小幅提升，属性+3。',
    },

    // --- 身体装备 (Body) ---
    'EQ006': {
        id: 'EQ006',
        name: '训练背心',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Common,
        description: '透气性不错，适合日常训练。',
        stats: { Stamina: 3 },
    },
    'EQ007': {
        id: 'EQ007',
        name: '紧身运动衣',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Uncommon,
        description: '能有效支撑肌肉，减少运动损伤。',
        stats: { Strength: 4, Stamina: 2 },
    },
    'EQ008': {
        id: 'EQ008',
        name: '复古球衣',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Rare,
        description: '致敬传奇的球衣，穿着它仿佛获得了历史的力量。',
        stats: { Shooting: 6, Defense: 4 },
        specialEffect: '【致敬】在主场比赛时，投篮属性额外+2。',
    },
    'EQ009': {
        id: 'EQ009',
        name: '碳纤维护甲',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Epic,
        description: '轻量化高强度护甲，专为内线对抗设计。',
        stats: { Strength: 12, Defense: 8, Speed: -3 },
        specialEffect: '【禁区铁壁】大幅提升篮下防守和盖帽成功率。',
    },
    'EQ010': {
        id: 'EQ010',
        name: '全明星战袍',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Legendary,
        description: '只有最顶尖的球员才有资格穿上它。',
        stats: { Shooting: 15, Dribbling: 15, Defense: 15 },
        specialEffect: '【聚光灯】所有基础属性+5，并吸引对手双人包夹。',
    },

    // --- 脚部装备 (Feet) ---
    'EQ011': {
        id: 'EQ011',
        name: '普通跑鞋',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Common,
        description: '最普通的跑鞋，能跑起来就行。',
        stats: { Speed: 2 },
    },
    'EQ012': {
        id: 'EQ012',
        name: '耐磨训练鞋',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Uncommon,
        description: '抓地力强，适合快速变向。',
        stats: { Speed: 4, Dribbling: 2 },
    },
    'EQ013': {
        id: 'EQ013',
        name: '突破者战靴',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Rare,
        description: '轻盈且反应迅速，为突破手量身定制。',
        stats: { Speed: 8, Dribbling: 6, Strength: -2 },
        specialEffect: '【第一步】启动速度大幅提升。',
    },
    'EQ014': {
        id: 'EQ014',
        name: '空中漫步者',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Epic,
        description: '特殊的缓震科技，让你在空中停留更久。',
        stats: { Shooting: 10, Strength: 5 },
        specialEffect: '【滞空】跳投和扣篮时，抗干扰能力大幅提升。',
    },
    'EQ015': {
        id: 'EQ015',
        name: '传奇签名鞋',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Legendary,
        description: '某位传奇巨星的亲笔签名战靴，拥有不可思议的力量。',
        stats: { Shooting: 12, Dribbling: 12, Speed: 12 },
        specialEffect: '【Mamba Mentality】在第四节比赛中，所有属性额外+5。',
    },

    // --- 配饰 (Accessory) ---
    'EQ016': {
        id: 'EQ016',
        name: '普通护腕',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Common,
        description: '保护手腕，防止扭伤。',
        stats: { Passing: 1, Defense: 1 },
    },
    'EQ017': {
        id: 'EQ017',
        name: '三分射手护臂',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Uncommon,
        description: '特殊的材质能稳定投篮手型。',
        stats: { Shooting: 5 },
    },
    'EQ018': {
        id: 'EQ018',
        name: '磁性项链',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Rare,
        description: '据说能改善血液循环，提升体能。',
        stats: { Stamina: 8, Defense: 2 },
        specialEffect: '【快速恢复】疲劳值恢复速度加快10%。',
    },
    'EQ019': {
        id: 'EQ019',
        name: '战术耳麦',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Epic,
        description: '教练的指令能实时传达到你的耳中。',
        stats: { Passing: 10, Stamina: 5 },
        specialEffect: '【战术大师】每次成功执行战术后，获得临时属性加成。',
    },
    'EQ020': {
        id: 'EQ020',
        name: '时间掌控者手表',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Legendary,
        description: '能让你在比赛的节奏中游刃有余，仿佛时间被你掌控。',
        stats: { Dribbling: 15, Passing: 15 },
        specialEffect: '【慢动作】在突破时，对手的防守速度暂时降低。',
    },

    // --- 武器 (Weapon - 篮球) ---
    'EQ021': {
        id: 'EQ021',
        name: '街头水泥球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Common,
        description: '在水泥地上摩擦了无数次的篮球，手感粗糙。',
        stats: { Dribbling: 1, Shooting: 1 },
    },
    'EQ022': {
        id: 'EQ022',
        name: '室内训练球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Uncommon,
        description: '标准尺寸和重量，适合基础训练。',
        stats: { Dribbling: 3, Shooting: 3 },
    },
    'EQ023': {
        id: 'EQ023',
        name: '牛皮比赛球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Rare,
        description: '顶级牛皮制作，手感极佳，弹跳稳定。',
        stats: { Dribbling: 7, Shooting: 7 },
        specialEffect: '【完美手感】投篮命中率小幅提升。',
    },
    'EQ024': {
        id: 'EQ024',
        name: '智能芯片篮球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Epic,
        description: '内置芯片能实时反馈投篮弧度和力度数据。',
        stats: { Shooting: 12, Passing: 5 },
        specialEffect: '【精确制导】中远距离投篮命中率显著提升。',
    },
    'EQ025': {
        id: 'EQ025',
        name: '命运之球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Legendary,
        description: '传说中能决定比赛走向的篮球，拥有改变命运的力量。',
        stats: { Shooting: 20, Dribbling: 20, Passing: 20 },
        specialEffect: '【绝杀时刻】在比赛的最后30秒，所有属性翻倍。',
    },

    // --- 更多装备 (混合槽位) ---

    // 护具类 (Accessory/Body)
    'EQ026': {
        id: 'EQ026',
        name: '护膝专家',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Uncommon,
        description: '保护膝盖，适合频繁跳跃的球员。',
        stats: { Stamina: 3, Strength: 3 },
    },
    'EQ027': {
        id: 'EQ027',
        name: '防守大师护臂',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Rare,
        description: '增加手臂的摩擦力，让抢断更具威胁。',
        stats: { Defense: 8, Dribbling: -2 },
        specialEffect: '【死亡缠绕】抢断成功率提升。',
    },
    'EQ028': {
        id: 'EQ028',
        name: '能量压缩衣',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Epic,
        description: '能将运动产生的热能转化为体能储备。',
        stats: { Stamina: 15, Speed: 5 },
        specialEffect: '【永动机】体能消耗速度降低20%。',
    },
    'EQ029': {
        id: 'EQ029',
        name: '重力训练背心',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Rare,
        description: '训练时使用，比赛时脱下能感到身体异常轻盈。',
        stats: { Strength: 10, Speed: -5 },
        specialEffect: '【脱胎换骨】脱下后，速度属性临时+10。',
    },

    // 速度类 (Feet/Accessory)
    'EQ030': {
        id: 'EQ030',
        name: '闪电鞋垫',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Uncommon,
        description: '轻薄且富有弹性，提升启动速度。',
        stats: { Speed: 5 },
    },
    'EQ031': {
        id: 'EQ031',
        name: '风之子脚踝护具',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Epic,
        description: '专为极致速度设计的护具，能承受高速变向的压力。',
        stats: { Speed: 12, Dribbling: 8 },
        specialEffect: '【风驰电掣】在快攻中，速度属性翻倍。',
    },

    // 投篮/传球类 (Head/Weapon)
    'EQ032': {
        id: 'EQ032',
        name: '三分线眼镜',
        slot: EquipmentSlot.Head,
        rarity: Rarity.Rare,
        description: '能让你清晰地看到三分线外的投篮区域。',
        stats: { Shooting: 7, Passing: 3 },
        specialEffect: '【远程火力】三分线外投篮命中率提升。',
    },
    'EQ033': {
        id: 'EQ033',
        name: '魔术师的篮球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Epic,
        description: '仿佛有生命力，能自动找到队友的双手。',
        stats: { Passing: 15, Dribbling: 5 },
        specialEffect: '【不看人传球】传球时有概率触发不看人传球，并大幅提升助攻率。',
    },

    // 力量/内线类 (Body/Weapon)
    'EQ034': {
        id: 'EQ034',
        name: '篮下巨兽护具',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Legendary,
        description: '穿上它，你就是禁区内不可撼动的存在。',
        stats: { Strength: 25, Defense: 15, Speed: -10 },
        specialEffect: '【统治禁区】篮板和盖帽属性大幅提升，并对对手造成威慑。',
    },
    'EQ035': {
        id: 'EQ035',
        name: '重型训练球',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Uncommon,
        description: '比标准球重一倍，用于训练力量。',
        stats: { Strength: 5, Shooting: -3 },
    },

    // 混合属性 (Legendary/Mythic)
    'EQ036': {
        id: 'EQ036',
        name: '时间凝固护腕',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Mythic,
        description: '据说能短暂地让时间为你停止。',
        stats: { Dribbling: 30, Speed: 30, Stamina: 30 },
        specialEffect: '【时空穿梭】每场比赛可使用一次，在突破时进入短暂的无敌状态。',
    },
    'EQ037': {
        id: 'EQ037',
        name: '数据之神战袍',
        slot: EquipmentSlot.Body,
        rarity: Rarity.Mythic,
        description: '一切尽在掌握，你的每一个动作都是最优解。',
        stats: { Shooting: 25, Passing: 25, Defense: 25 },
        specialEffect: '【三双预警】当任一基础属性达到20时，该属性额外+10。',
    },
    'EQ038': {
        id: 'EQ038',
        name: '永恒之靴',
        slot: EquipmentSlot.Feet,
        rarity: Rarity.Mythic,
        description: '穿上它，你将拥有永不疲倦的步伐。',
        stats: { Speed: 40, Stamina: 40 },
        specialEffect: '【无限跑动】体能消耗归零，并免疫所有减速效果。',
    },
    'EQ039': {
        id: 'EQ039',
        name: '篮球之魂',
        slot: EquipmentSlot.Weapon,
        rarity: Rarity.Mythic,
        description: '篮球运动的具象化，拥有最纯粹的篮球力量。',
        stats: { Shooting: 50, Dribbling: 50, Passing: 50 },
        specialEffect: '【全能】所有基础属性+20，并使对手所有属性-5。',
    },
    'EQ040': {
        id: 'EQ040',
        name: '黑曼巴护指',
        slot: EquipmentSlot.Accessory,
        rarity: Rarity.Legendary,
        description: '传奇的遗物，蕴含着不屈的意志。',
        stats: { Shooting: 15, Defense: 15, Strength: 10 },
        specialEffect: '【不屈意志】在落后10分以上时，投篮命中率和防守成功率大幅提升。',
    },
};

// 导出所有装备的ID列表
export const EquipmentIds: string[] = Object.keys(EquipmentData);

// 辅助函数 (可选，用于类型安全访问)
export function getEquipment(id: string): Equipment | undefined {
    return EquipmentData[id];
}
