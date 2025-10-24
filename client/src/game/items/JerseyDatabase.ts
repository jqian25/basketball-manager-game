// client/src/game/items/JerseyDatabase.ts

/**
 * 稀有度类型定义
 * Common: 普通 (1-20)
 * Uncommon: 罕见 (21-40)
 * Rare: 稀有 (41-60)
 * Epic: 史诗 (61-75)
 * Legendary: 传奇 (76-80)
 */
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

/**
 * 物品属性接口 (Attributes)
 * 考虑到篮球主题，属性可以影响玩家角色的能力
 */
export interface ItemAttributes {
  speed: number; // 速度 (影响移动和快攻)
  stamina: number; // 体力/耐力 (影响持续奔跑和防守)
  shooting: number; // 投篮 (影响命中率)
  defense: number; // 防守 (影响抢断和盖帽)
  passing: number; // 传球 (影响助攻和失误率)
  rebound: number; // 篮板 (影响抢篮板能力)
}

/**
 * 球衣物品接口
 */
export interface JerseyItem {
  id: number;
  name: string;
  description: string;
  attributes: ItemAttributes;
  price: number; // 价格 (游戏货币)
  rarity: Rarity;
  team: string; // 球队名称
  player?: string; // 球员名称 (可选，用于特殊球衣)
}

/**
 * 80种球衣数据
 */
export const JerseyDatabase: JerseyItem[] = [
  // --- 国家队球衣 (1-20) ---
  {
    id: 1,
    name: "美国梦之队 '92 主场球衣",
    description: "篮球史上最伟大的球队。穿着它，感受传奇的力量。",
    attributes: { speed: 5, stamina: 5, shooting: 5, defense: 5, passing: 5, rebound: 5 },
    price: 9999,
    rarity: "Legendary",
    team: "美国国家队",
    player: "乔丹/魔术师/伯德"
  },
  {
    id: 2,
    name: "塞尔维亚国家队 客场球衣",
    description: "欧洲篮球的传统强队，精准的投射和团队配合。",
    attributes: { speed: 2, stamina: 3, shooting: 4, defense: 3, passing: 4, rebound: 3 },
    price: 3500,
    rarity: "Rare",
    team: "塞尔维亚国家队"
  },
  {
    id: 3,
    name: "西班牙国家队 主场球衣",
    description: "斗牛士军团，内线统治力与外线火力兼备。",
    attributes: { speed: 3, stamina: 4, shooting: 3, defense: 4, passing: 3, rebound: 4 },
    price: 3800,
    rarity: "Rare",
    team: "西班牙国家队"
  },
  {
    id: 4,
    name: "阿根廷国家队 经典蓝白条纹",
    description: "潘帕斯雄鹰，速度与灵巧的完美结合。",
    attributes: { speed: 4, stamina: 3, shooting: 3, defense: 2, passing: 4, rebound: 2 },
    price: 3200,
    rarity: "Rare",
    team: "阿根廷国家队"
  },
  {
    id: 5,
    name: "法国国家队 蓝白红配色",
    description: "天赋异禀的跑跳能力，拥有出色的运动天赋。",
    attributes: { speed: 4, stamina: 4, shooting: 2, defense: 3, passing: 3, rebound: 3 },
    price: 3000,
    rarity: "Rare",
    team: "法国国家队"
  },
  {
    id: 6,
    name: "澳大利亚国家队 绿色袋鼠",
    description: "身体素质出众，擅长对抗和转换进攻。",
    attributes: { speed: 3, stamina: 4, shooting: 3, defense: 4, passing: 2, rebound: 3 },
    price: 2800,
    rarity: "Uncommon",
    team: "澳大利亚国家队"
  },
  {
    id: 7,
    name: "立陶宛国家队 绿色森林",
    description: "欧洲传统射手强国，外线投射精准。",
    attributes: { speed: 2, stamina: 2, shooting: 5, defense: 2, passing: 3, rebound: 2 },
    price: 2500,
    rarity: "Uncommon",
    team: "立陶宛国家队"
  },
  {
    id: 8,
    name: "加拿大国家队 红色枫叶",
    description: "新生代力量，速度和爆发力十足。",
    attributes: { speed: 5, stamina: 3, shooting: 3, defense: 2, passing: 3, rebound: 2 },
    price: 2700,
    rarity: "Uncommon",
    team: "加拿大国家队"
  },
  {
    id: 9,
    name: "德国国家队 黑色战车",
    description: "纪律严明的防守和高效的进攻。",
    attributes: { speed: 3, stamina: 3, shooting: 3, defense: 4, passing: 2, rebound: 3 },
    price: 2600,
    rarity: "Uncommon",
    team: "德国国家队"
  },
  {
    id: 10,
    name: "巴西国家队 黄绿桑巴",
    description: "充满激情的进攻和华丽的运球。",
    attributes: { speed: 4, stamina: 2, shooting: 3, defense: 2, passing: 4, rebound: 2 },
    price: 2400,
    rarity: "Uncommon",
    team: "巴西国家队"
  },
  {
    id: 11,
    name: "中国国家队 红色巨龙",
    description: "亚洲篮球的代表，内线优势明显。",
    attributes: { speed: 2, stamina: 3, shooting: 2, defense: 3, passing: 2, rebound: 4 },
    price: 2200,
    rarity: "Common",
    team: "中国国家队"
  },
  {
    id: 12,
    name: "波多黎各国家队 白色海滩",
    description: "快速的小球战术，外线投射大胆。",
    attributes: { speed: 4, stamina: 2, shooting: 3, defense: 1, passing: 3, rebound: 1 },
    price: 2000,
    rarity: "Common",
    team: "波多黎各国家队"
  },
  {
    id: 13,
    name: "希腊国家队 蓝色海洋",
    description: "强硬的身体对抗和半场阵地战。",
    attributes: { speed: 2, stamina: 4, shooting: 2, defense: 3, passing: 2, rebound: 3 },
    price: 2100,
    rarity: "Common",
    team: "希腊国家队"
  },
  {
    id: 14,
    name: "意大利国家队 蓝色亚平宁",
    description: "优雅的战术执行和中距离投篮。",
    attributes: { speed: 3, stamina: 3, shooting: 3, defense: 2, passing: 3, rebound: 2 },
    price: 2300,
    rarity: "Common",
    team: "意大利国家队"
  },
  {
    id: 15,
    name: "土耳其国家队 红色星月",
    description: "内线长人众多，篮下保护出色。",
    attributes: { speed: 1, stamina: 3, shooting: 2, defense: 4, passing: 1, rebound: 4 },
    price: 1900,
    rarity: "Common",
    team: "土耳其国家队"
  },
  {
    id: 16,
    name: "新西兰国家队 黑色蕨叶",
    description: "独特的战舞，充满能量和侵略性。",
    attributes: { speed: 3, stamina: 3, shooting: 2, defense: 3, passing: 2, rebound: 3 },
    price: 1800,
    rarity: "Common",
    team: "新西兰国家队"
  },
  {
    id: 17,
    name: "伊朗国家队 绿色波斯",
    description: "亚洲传统强队，以中锋为核心。",
    attributes: { speed: 1, stamina: 2, shooting: 1, defense: 3, passing: 1, rebound: 5 },
    price: 1700,
    rarity: "Common",
    team: "伊朗国家队"
  },
  {
    id: 18,
    name: "韩国国家队 红色太极",
    description: "快速的跑动和精准的外线投射。",
    attributes: { speed: 5, stamina: 1, shooting: 4, defense: 1, passing: 2, rebound: 1 },
    price: 1600,
    rarity: "Common",
    team: "韩国国家队"
  },
  {
    id: 19,
    name: "尼日利亚国家队 绿色雄鹰",
    description: "非洲身体天赋的代表，爆发力强。",
    attributes: { speed: 4, stamina: 4, shooting: 1, defense: 2, passing: 1, rebound: 4 },
    price: 1500,
    rarity: "Common",
    team: "尼日利亚国家队"
  },
  {
    id: 20,
    name: "日本国家队 红色日出",
    description: "速度型后卫和日益提升的投射能力。",
    attributes: { speed: 5, stamina: 2, shooting: 3, defense: 1, passing: 3, rebound: 1 },
    price: 1400,
    rarity: "Common",
    team: "日本国家队"
  },

  // --- NBA 球队球衣 - 传奇/史诗 (21-40) ---
  {
    id: 21,
    name: "洛杉矶湖人队 8号 紫金王朝",
    description: "科比时代的经典，象征着无尽的得分火力。",
    attributes: { speed: 4, stamina: 4, shooting: 5, defense: 3, passing: 3, rebound: 3 },
    price: 8800,
    rarity: "Legendary",
    team: "洛杉矶湖人队",
    player: "科比·布莱恩特"
  },
  {
    id: 22,
    name: "芝加哥公牛队 23号 红色公牛",
    description: "篮球之神，穿上它，你就是球场上的主宰。",
    attributes: { speed: 5, stamina: 5, shooting: 5, defense: 5, passing: 4, rebound: 4 },
    price: 9900,
    rarity: "Legendary",
    team: "芝加哥公牛队",
    player: "迈克尔·乔丹"
  },
  {
    id: 23,
    name: "波士顿凯尔特人队 33号 绿色荣耀",
    description: "拉里·伯德的传奇，精准的传球和致命的远射。",
    attributes: { speed: 2, stamina: 4, shooting: 5, defense: 4, passing: 5, rebound: 4 },
    price: 7500,
    rarity: "Epic",
    team: "波士顿凯尔特人队",
    player: "拉里·伯德"
  },
  {
    id: 24,
    name: "迈阿密热火队 3号 韦德之道",
    description: "闪电侠的速度和关键时刻的得分能力。",
    attributes: { speed: 5, stamina: 4, shooting: 4, defense: 4, passing: 3, rebound: 2 },
    price: 7200,
    rarity: "Epic",
    team: "迈阿密热火队",
    player: "德维恩·韦德"
  },
  {
    id: 25,
    name: "圣安东尼奥马刺队 21号 邓肯时代",
    description: "沉默的石佛，内线防守和稳定的中投。",
    attributes: { speed: 1, stamina: 5, shooting: 4, defense: 5, passing: 3, rebound: 5 },
    price: 7800,
    rarity: "Epic",
    team: "圣安东尼奥马刺队",
    player: "蒂姆·邓肯"
  },
  {
    id: 26,
    name: "金州勇士队 30号 库里时代",
    description: "划时代的射手，无限的投射范围和快速的跑位。",
    attributes: { speed: 5, stamina: 4, shooting: 5, defense: 2, passing: 4, rebound: 1 },
    price: 8000,
    rarity: "Legendary",
    team: "金州勇士队",
    player: "斯蒂芬·库里"
  },
  {
    id: 27,
    name: "克利夫兰骑士队 23号 詹姆斯回归",
    description: "全能战士，身体素质和组织能力的完美结合。",
    attributes: { speed: 4, stamina: 5, shooting: 4, defense: 4, passing: 5, rebound: 4 },
    price: 8500,
    rarity: "Legendary",
    team: "克利夫兰骑士队",
    player: "勒布朗·詹姆斯"
  },
  {
    id: 28,
    name: "休斯顿火箭队 13号 大胡子",
    description: "后撤步三分和造犯规大师，进攻万花筒。",
    attributes: { speed: 3, stamina: 3, shooting: 5, defense: 2, passing: 5, rebound: 2 },
    price: 6800,
    rarity: "Epic",
    team: "休斯顿火箭队",
    player: "詹姆斯·哈登"
  },
  {
    id: 29,
    name: "达拉斯独行侠队 41号 德克金鸡独立",
    description: "诺维茨基的经典战袍，难以防守的单腿后仰跳投。",
    attributes: { speed: 2, stamina: 4, shooting: 5, defense: 3, passing: 2, rebound: 4 },
    price: 6500,
    rarity: "Epic",
    team: "达拉斯独行侠队",
    player: "德克·诺维茨基"
  },
  {
    id: 30,
    name: "费城76人队 3号 答案",
    description: "艾弗森的速度和不屈的斗志。",
    attributes: { speed: 5, stamina: 3, shooting: 4, defense: 3, passing: 2, rebound: 1 },
    price: 7000,
    rarity: "Epic",
    team: "费城76人队",
    player: "阿伦·艾弗森"
  },
  {
    id: 31,
    name: "奥兰多魔术队 1号 便士",
    description: "哈达威的优雅和全面的身手。",
    attributes: { speed: 4, stamina: 4, shooting: 4, defense: 3, passing: 4, rebound: 3 },
    price: 5500,
    rarity: "Rare",
    team: "奥兰多魔术队",
    player: "安芬尼·哈达威"
  },
  {
    id: 32,
    name: "犹他爵士队 32号 邮差",
    description: "卡尔·马龙的力量和稳定的得分。",
    attributes: { speed: 2, stamina: 5, shooting: 3, defense: 4, passing: 3, rebound: 5 },
    price: 5800,
    rarity: "Rare",
    team: "犹他爵士队",
    player: "卡尔·马龙"
  },
  {
    id: 33,
    name: "底特律活塞队 4号 坏孩子军团",
    description: "乔·杜马斯的铁血防守和团队协作。",
    attributes: { speed: 3, stamina: 4, shooting: 3, defense: 5, passing: 4, rebound: 3 },
    price: 6000,
    rarity: "Rare",
    team: "底特律活塞队",
    player: "乔·杜马斯"
  },
  {
    id: 34,
    name: "菲尼克斯太阳队 34号 查尔斯爵士",
    description: "巴克利的篮下统治力和全能身手。",
    attributes: { speed: 3, stamina: 5, shooting: 3, defense: 4, passing: 4, rebound: 5 },
    price: 6200,
    rarity: "Rare",
    team: "菲尼克斯太阳队",
    player: "查尔斯·巴克利"
  },
  {
    id: 35,
    name: "多伦多猛龙队 15号 卡特时代",
    description: "UFO的暴扣和观赏性极强的比赛风格。",
    attributes: { speed: 5, stamina: 4, shooting: 4, defense: 2, passing: 3, rebound: 3 },
    price: 6500,
    rarity: "Epic",
    team: "多伦多猛龙队",
    player: "文斯·卡特"
  },
  {
    id: 36,
    name: "纽约尼克斯队 33号 大猩猩",
    description: "尤因的内线支柱和强硬的风格。",
    attributes: { speed: 1, stamina: 5, shooting: 3, defense: 5, passing: 2, rebound: 5 },
    price: 5900,
    rarity: "Rare",
    team: "纽约尼克斯队",
    player: "帕特里克·尤因"
  },
  {
    id: 37,
    name: "俄克拉荷马雷霆队 0号 威少三双",
    description: "爆炸性的运动能力和无情的冲击力。",
    attributes: { speed: 5, stamina: 5, shooting: 3, defense: 3, passing: 5, rebound: 4 },
    price: 7000,
    rarity: "Epic",
    team: "俄克拉荷马雷霆队",
    player: "拉塞尔·威斯布鲁克"
  },
  {
    id: 38,
    name: "波特兰开拓者队 0号 利拉德时间",
    description: "超远三分和关键时刻的冷静。",
    attributes: { speed: 4, stamina: 3, shooting: 5, defense: 2, passing: 4, rebound: 1 },
    price: 6300,
    rarity: "Rare",
    team: "波特兰开拓者队",
    player: "达米安·利拉德"
  },
  {
    id: 39,
    name: "新奥尔良鹈鹕队 1号 锡安",
    description: "惊人的弹跳和内线冲击力。",
    attributes: { speed: 4, stamina: 4, shooting: 1, defense: 3, passing: 2, rebound: 4 },
    price: 5000,
    rarity: "Rare",
    team: "新奥尔良鹈鹕队",
    player: "锡安·威廉姆森"
  },
  {
    id: 40,
    name: "孟菲斯灰熊队 12号 莫兰特",
    description: "令人眼花缭乱的控球和空中作业。",
    attributes: { speed: 5, stamina: 3, shooting: 3, defense: 2, passing: 4, rebound: 2 },
    price: 5200,
    rarity: "Rare",
    team: "孟菲斯灰熊队",
    player: "贾·莫兰特"
  },

  // --- NBA 球队球衣 - 稀有/罕见 (41-60) ---
  {
    id: 41,
    name: "密尔沃基雄鹿队 34号 字母哥",
    description: "希腊怪兽，全场一条龙的冲击和防守。",
    attributes: { speed: 4, stamina: 5, shooting: 2, defense: 4, passing: 3, rebound: 5 },
    price: 7500,
    rarity: "Epic",
    team: "密尔沃基雄鹿队",
    player: "扬尼斯·阿德托昆博"
  },
  {
    id: 42,
    name: "布鲁克林篮网队 11号 欧文",
    description: "华丽的运球和无解的单挑能力。",
    attributes: { speed: 5, stamina: 3, shooting: 4, defense: 2, passing: 3, rebound: 1 },
    price: 5000,
    rarity: "Rare",
    team: "布鲁克林篮网队",
    player: "凯里·欧文"
  },
  {
    id: 43,
    name: "丹佛掘金队 15号 约基奇",
    description: "中锋的身体，后卫的视野和传球。",
    attributes: { speed: 1, stamina: 4, shooting: 4, defense: 3, passing: 5, rebound: 5 },
    price: 6800,
    rarity: "Epic",
    team: "丹佛掘金队",
    player: "尼古拉·约基奇"
  },
  {
    id: 44,
    name: "印第安纳步行者队 31号 雷吉米勒",
    description: "米勒时刻，关键时刻的冷血杀手。",
    attributes: { speed: 3, stamina: 3, shooting: 5, defense: 2, passing: 2, rebound: 1 },
    price: 5500,
    rarity: "Rare",
    team: "印第安纳步行者队",
    player: "雷吉·米勒"
  },
  {
    id: 45,
    name: "萨克拉门托国王队 4号 韦伯时代",
    description: "克里斯·韦伯的优雅策应和高位组织。",
    attributes: { speed: 3, stamina: 4, shooting: 3, defense: 3, passing: 4, rebound: 4 },
    price: 4800,
    rarity: "Rare",
    team: "萨克拉门托国王队",
    player: "克里斯·韦伯"
  },
  {
    id: 46,
    name: "亚特兰大老鹰队 15号 卡特退役版",
    description: "老飞人的最后战袍，经验和技术沉淀。",
    attributes: { speed: 3, stamina: 3, shooting: 4, defense: 2, passing: 3, rebound: 2 },
    price: 4500,
    rarity: "Rare",
    team: "亚特兰大老鹰队",
    player: "文斯·卡特"
  },
  {
    id: 47,
    name: "夏洛特黄蜂队 2号 肯巴沃克",
    description: "小快灵的代表，犀利的突破和中距离。",
    attributes: { speed: 5, stamina: 3, shooting: 3, defense: 2, passing: 3, rebound: 1 },
    price: 3500,
    rarity: "Uncommon",
    team: "夏洛特黄蜂队",
    player: "肯巴·沃克"
  },
  {
    id: 48,
    name: "华盛顿奇才队 0号 沃尔",
    description: "风驰电掣的速度和出色的快攻组织。",
    attributes: { speed: 5, stamina: 4, shooting: 2, defense: 2, passing: 4, rebound: 1 },
    price: 3800,
    rarity: "Uncommon",
    team: "华盛顿奇才队",
    player: "约翰·沃尔"
  },
  {
    id: 49,
    name: "波士顿凯尔特人队 0号 塔图姆",
    description: "年轻的得分机器，全面的进攻技巧。",
    attributes: { speed: 3, stamina: 4, shooting: 4, defense: 3, passing: 3, rebound: 3 },
    price: 4200,
    rarity: "Rare",
    team: "波士顿凯尔特人队",
    player: "杰森·塔图姆"
  },
  {
    id: 50,
    name: "洛杉矶快船队 2号 伦纳德",
    description: "攻防一体的超级巨星，大手和稳定的中投。",
    attributes: { speed: 3, stamina: 5, shooting: 4, defense: 5, passing: 2, rebound: 4 },
    price: 6000,
    rarity: "Epic",
    team: "洛杉矶快船队",
    player: "科怀·伦纳德"
  },
  {
    id: 51,
    name: "费城76人队 21号 恩比德",
    description: "大帝的内线统治力和中远距离投射。",
    attributes: { speed: 1, stamina: 4, shooting: 4, defense: 4, passing: 3, rebound: 5 },
    price: 5500,
    rarity: "Rare",
    team: "费城76人队",
    player: "乔尔·恩比德"
  },
  {
    id: 52,
    name: "犹他爵士队 45号 米切尔",
    description: "爆炸性的得分后卫，出色的突破和终结。",
    attributes: { speed: 5, stamina: 3, shooting: 4, defense: 2, passing: 3, rebound: 1 },
    price: 4000,
    rarity: "Rare",
    team: "犹他爵士队",
    player: "多诺万·米切尔"
  },
  {
    id: 53,
    name: "菲尼克斯太阳队 1号 布克",
    description: "得分后卫的教科书，优雅的中投和三分。",
    attributes: { speed: 3, stamina: 3, shooting: 5, defense: 2, passing: 4, rebound: 2 },
    price: 4500,
    rarity: "Rare",
    team: "菲尼克斯太阳队",
    player: "德文·布克"
  },
  {
    id: 54,
    name: "波特兰开拓者队 3号 CJ麦科勒姆",
    description: "犀利的控球和稳定的得分输出。",
    attributes: { speed: 4, stamina: 3, shooting: 4, defense: 2, passing: 3, rebound: 1 },
    price: 3500,
    rarity: "Uncommon",
    team: "波特兰开拓者队",
    player: "CJ·麦科勒姆"
  },
  {
    id: 55,
    name: "新奥尔良鹈鹕队 15号 英格拉姆",
    description: "修长的身躯和稳定的中距离跳投。",
    attributes: { speed: 3, stamina: 3, shooting: 4, defense: 3, passing: 3, rebound: 3 },
    price: 3200,
    rarity: "Uncommon",
    team: "新奥尔良鹈鹕队",
    player: "布兰登·英格拉姆"
  },
  {
    id: 56,
    name: "明尼苏达森林狼队 32号 唐斯",
    description: "能里能外的现代中锋，投射能力出色。",
    attributes: { speed: 2, stamina: 3, shooting: 4, defense: 3, passing: 3, rebound: 4 },
    price: 3000,
    rarity: "Uncommon",
    team: "明尼苏达森林狼队",
    player: "卡尔-安东尼·唐斯"
  },
  {
    id: 57,
    name: "萨克拉门托国王队 5号 福克斯",
    description: "联盟顶级的速度，快攻中的终结者。",
    attributes: { speed: 5, stamina: 4, shooting: 2, defense: 2, passing: 4, rebound: 1 },
    price: 3300,
    rarity: "Uncommon",
    team: "萨克拉门托国王队",
    player: "达龙·福克斯"
  },
  {
    id: 58,
    name: "底特律活塞队 1号 坎宁安",
    description: "全面的组织型后卫，拥有出色的视野。",
    attributes: { speed: 3, stamina: 3, shooting: 3, defense: 3, passing: 4, rebound: 3 },
    price: 2800,
    rarity: "Uncommon",
    team: "底特律活塞队",
    player: "凯德·坎宁安"
  },
  {
    id: 59,
    name: "奥兰多魔术队 5号 班切罗",
    description: "新一代的全能前锋，技术和身体兼备。",
    attributes: { speed: 3, stamina: 4, shooting: 3, defense: 3, passing: 3, rebound: 4 },
    price: 3100,
    rarity: "Uncommon",
    team: "奥兰多魔术队",
    player: "保罗·班切罗"
  },
  {
    id: 60,
    name: "俄克拉荷马雷霆队 2号 亚历山大",
    description: "节奏大师，擅长利用节奏变化得分。",
    attributes: { speed: 4, stamina: 3, shooting: 4, defense: 3, passing: 3, rebound: 2 },
    price: 4000,
    rarity: "Rare",
    team: "俄克拉荷马雷霆队",
    player: "谢伊·吉尔杰斯-亚历山大"
  },
  
  // --- NBA 球队球衣 - 常见 (61-80) ---
  {
    id: 61,
    name: "亚特兰大老鹰队 主场白",
    description: "基础款老鹰队主场球衣，提升基础属性。",
    attributes: { speed: 2, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 2 },
    price: 1000,
    rarity: "Common",
    team: "亚特兰大老鹰队"
  },
  {
    id: 62,
    name: "波士顿凯尔特人队 绿色客场",
    description: "凯尔特人队客场球衣，略微提升防守。",
    attributes: { speed: 2, stamina: 3, shooting: 2, defense: 3, passing: 2, rebound: 2 },
    price: 1500,
    rarity: "Common",
    team: "波士顿凯尔特人队"
  },
  {
    id: 63,
    name: "布鲁克林篮网队 黑色城市版",
    description: "篮网队城市版球衣，略微提升速度。",
    attributes: { speed: 3, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 1 },
    price: 1200,
    rarity: "Common",
    team: "布鲁克林篮网队"
  },
  {
    id: 64,
    name: "夏洛特黄蜂队 紫色经典",
    description: "黄蜂队经典配色，提升传球和灵活性。",
    attributes: { speed: 3, stamina: 2, shooting: 2, defense: 1, passing: 3, rebound: 1 },
    price: 1300,
    rarity: "Common",
    team: "夏洛特黄蜂队"
  },
  {
    id: 65,
    name: "芝加哥公牛队 黑色训练服",
    description: "公牛队训练服，提升体力。",
    attributes: { speed: 2, stamina: 3, shooting: 1, defense: 2, passing: 1, rebound: 2 },
    price: 900,
    rarity: "Common",
    team: "芝加哥公牛队"
  },
  {
    id: 66,
    name: "克利夫兰骑士队 酒红色",
    description: "骑士队主场配色，均衡的属性。",
    attributes: { speed: 2, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 2 },
    price: 1100,
    rarity: "Common",
    team: "克利夫兰骑士队"
  },
  {
    id: 67,
    name: "达拉斯独行侠队 蓝色客场",
    description: "独行侠队客场球衣，略微提升投篮。",
    attributes: { speed: 2, stamina: 2, shooting: 3, defense: 2, passing: 2, rebound: 1 },
    price: 1400,
    rarity: "Common",
    team: "达拉斯独行侠队"
  },
  {
    id: 68,
    name: "丹佛掘金队 蓝黄配色",
    description: "掘金队基础款，略微提升篮板。",
    attributes: { speed: 1, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 3 },
    price: 1300,
    rarity: "Common",
    team: "丹佛掘金队"
  },
  {
    id: 69,
    name: "底特律活塞队 蓝色复古",
    description: "活塞队复古球衣，提升防守和体力。",
    attributes: { speed: 1, stamina: 3, shooting: 1, defense: 3, passing: 1, rebound: 2 },
    price: 1500,
    rarity: "Common",
    team: "底特律活塞队"
  },
  {
    id: 70,
    name: "金州勇士队 蓝色主场",
    description: "勇士队主场球衣，提升速度和投篮。",
    attributes: { speed: 3, stamina: 2, shooting: 3, defense: 1, passing: 2, rebound: 1 },
    price: 1600,
    rarity: "Common",
    team: "金州勇士队"
  },
  {
    id: 71,
    name: "休斯顿火箭队 红色主场",
    description: "火箭队主场球衣，提升投篮。",
    attributes: { speed: 2, stamina: 2, shooting: 3, defense: 1, passing: 2, rebound: 2 },
    price: 1200,
    rarity: "Common",
    team: "休斯顿火箭队"
  },
  {
    id: 72,
    name: "印第安纳步行者队 黄色客场",
    description: "步行者队客场球衣，提升速度和传球。",
    attributes: { speed: 3, stamina: 2, shooting: 2, defense: 1, passing: 3, rebound: 1 },
    price: 1300,
    rarity: "Common",
    team: "印第安纳步行者队"
  },
  {
    id: 73,
    name: "洛杉矶快船队 红色条纹",
    description: "快船队城市版，均衡的属性。",
    attributes: { speed: 2, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 2 },
    price: 1400,
    rarity: "Common",
    team: "洛杉矶快船队"
  },
  {
    id: 74,
    name: "洛杉矶湖人队 经典白",
    description: "湖人队白色客场，略微提升传球。",
    attributes: { speed: 2, stamina: 2, shooting: 2, defense: 1, passing: 3, rebound: 2 },
    price: 1500,
    rarity: "Common",
    team: "洛杉矶湖人队"
  },
  {
    id: 75,
    name: "孟菲斯灰熊队 蓝色主场",
    description: "灰熊队主场球衣，提升防守。",
    attributes: { speed: 2, stamina: 2, shooting: 1, defense: 3, passing: 2, rebound: 2 },
    price: 1100,
    rarity: "Common",
    team: "孟菲斯灰熊队"
  },
  {
    id: 76,
    name: "迈阿密热火队 黑色主场",
    description: "热火队黑色主场，提升体力。",
    attributes: { speed: 2, stamina: 3, shooting: 2, defense: 2, passing: 1, rebound: 2 },
    price: 1200,
    rarity: "Common",
    team: "迈阿密热火队"
  },
  {
    id: 77,
    name: "密尔沃基雄鹿队 绿色客场",
    description: "雄鹿队客场球衣，提升篮板。",
    attributes: { speed: 1, stamina: 2, shooting: 2, defense: 2, passing: 1, rebound: 4 },
    price: 1300,
    rarity: "Common",
    team: "密尔沃基雄鹿队"
  },
  {
    id: 78,
    name: "明尼苏达森林狼队 蓝绿配色",
    description: "森林狼队基础款，略微提升速度。",
    attributes: { speed: 3, stamina: 2, shooting: 2, defense: 1, passing: 2, rebound: 2 },
    price: 1000,
    rarity: "Common",
    team: "明尼苏达森林狼队"
  },
  {
    id: 79,
    name: "纽约尼克斯队 橙色复古",
    description: "尼克斯队复古球衣，提升投篮。",
    attributes: { speed: 2, stamina: 2, shooting: 3, defense: 2, passing: 1, rebound: 2 },
    price: 1400,
    rarity: "Common",
    team: "纽约尼克斯队"
  },
  {
    id: 80,
    name: "奥兰多魔术队 蓝色主场",
    description: "魔术队主场球衣，均衡的属性。",
    attributes: { speed: 2, stamina: 2, shooting: 2, defense: 2, passing: 2, rebound: 2 },
    price: 1100,
    rarity: "Common",
    team: "奥兰多魔术队"
  },
];