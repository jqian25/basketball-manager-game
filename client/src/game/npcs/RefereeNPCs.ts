// client/src/game/npcs/RefereeNPCs.ts

/**
 * NPC外观类型
 */
export type Appearance = {
  height: string; // 身高，例如 "1.85m"
  build: '瘦弱' | '标准' | '健壮' | '微胖'; // 体型
  uniformColor: string; // 制服颜色，例如 "黑白条纹"
  whistleType: '金属' | '塑料' | '电子'; // 口哨类型
  signatureItem?: string; // 标志性物品，例如 "一副老花镜"
};

/**
 * NPC性格类型
 */
export type Personality = {
  temperament: '冷静' | '暴躁' | '幽默' | '严厉' | '随和'; // 脾气
  fairnessLevel: '极高' | '高' | '中等' | '低'; // 公平程度
  quirk?: string; // 怪癖，例如 "喜欢在暂停时吃香蕉"
};

/**
 * NPC行为模式
 */
export type BehaviorPattern = {
  callStyle: '严格判罚' | '放宽尺度' | '主场哨' | '平衡'; // 吹罚风格
  movement: '跑动积极' | '站位精准' | '移动缓慢'; // 场上移动
  reactionToDispute: '立即技术犯规' | '耐心解释' | '无视'; // 对争议的反应
};

/**
 * 裁判NPC对话片段
 */
export type Dialogue = {
  foulCall: string; // 吹罚犯规时的台词
  technicalFoul: string; // 吹罚技术犯规时的台词
  endOfQuarter: string; // 节间休息时的台词
  preGame: string; // 赛前热身时的台词
};

/**
 * 裁判NPC数据结构
 */
export interface RefereeNPC {
  id: number;
  name: string;
  role: '主裁判' | '边线裁判' | '记录台裁判';
  appearance: Appearance;
  personality: Personality;
  dialogue: Dialogue;
  behaviorPattern: BehaviorPattern;
}

/**
 * 裁判NPC数据库
 */
export const RefereeNPCs: RefereeNPC[] = [
  {
    id: 1,
    name: '铁面无私 约翰逊',
    role: '主裁判',
    appearance: {
      height: '1.90m',
      build: '健壮',
      uniformColor: '黑白条纹',
      whistleType: '金属',
      signatureItem: '闪亮的金哨子',
    },
    personality: {
      temperament: '严厉',
      fairnessLevel: '极高',
      quirk: '每次判罚前都会整理一下领结。',
    },
    dialogue: {
      foulCall: '犯规！这是阻挡犯规，球权转换！',
      technicalFoul: '够了！技术犯规！不接受任何争辩！',
      endOfQuarter: '第一节结束，双方球员请回休息区。',
      preGame: '比赛即将开始，请双方保持体育精神。',
    },
    behaviorPattern: {
      callStyle: '严格判罚',
      movement: '跑动积极',
      reactionToDispute: '立即技术犯规',
    },
  },
  {
    id: 2,
    name: '老好人 史密斯',
    role: '边线裁判',
    appearance: {
      height: '1.75m',
      build: '微胖',
      uniformColor: '灰色条纹',
      whistleType: '塑料',
      signatureItem: '一副老花镜，经常戴在鼻尖。',
    },
    personality: {
      temperament: '随和',
      fairnessLevel: '中等',
      quirk: '喜欢在死球时偷偷喝一口保温杯里的茶。',
    },
    dialogue: {
      foulCall: '（声音略小）哦，看起来是打手了，请注意动作。',
      technicalFoul: '冷静点，冷静点，大家都是为了比赛好。',
      endOfQuarter: '时间到了，请大家不要着急。',
      preGame: '祝大家打出一场精彩的比赛。',
    },
    behaviorPattern: {
      callStyle: '放宽尺度',
      movement: '移动缓慢',
      reactionToDispute: '耐心解释',
    },
  },
  {
    id: 3,
    name: '数据狂人 艾伦',
    role: '记录台裁判',
    appearance: {
      height: '1.80m',
      build: '标准',
      uniformColor: '深蓝色',
      whistleType: '电子',
      signatureItem: '一块功能复杂的数字手表。',
    },
    personality: {
      temperament: '冷静',
      fairnessLevel: '极高',
      quirk: '对比赛时间精确到毫秒有强迫症。',
    },
    dialogue: {
      foulCall: '（通过耳机）犯规次数已达上限，请执行罚球。',
      technicalFoul: '（通过耳机）请注意，您的行为已构成技术犯规。',
      endOfQuarter: '嘀——计时器显示本节比赛时间结束。',
      preGame: '记录台准备就绪，所有统计系统运行正常。',
    },
    behaviorPattern: {
      callStyle: '平衡',
      movement: '站位精准',
      reactionToDispute: '无视',
    },
  },
  {
    id: 4,
    name: '火爆脾气 迈克',
    role: '边线裁判',
    appearance: {
      height: '1.88m',
      build: '健壮',
      uniformColor: '红色条纹',
      whistleType: '金属',
      signatureItem: '永远皱着眉头。',
    },
    personality: {
      temperament: '暴躁',
      fairnessLevel: '低',
      quirk: '特别讨厌球员抱怨，会用极快的速度吹罚。',
    },
    dialogue: {
      foulCall: '（怒吼）走步！这绝对是走步！眼睛都瞎了吗？！',
      technicalFoul: '你再说一句试试！技术犯规！滚回替补席！',
      endOfQuarter: '快点！快点！别磨蹭！',
      preGame: '我警告你们，今天谁敢在我面前耍花招，后果自负！',
    },
    behaviorPattern: {
      callStyle: '主场哨', // 倾向于主队
      movement: '跑动积极',
      reactionToDispute: '立即技术犯规',
    },
  },
  {
    id: 5,
    name: '幽默大师 汤姆',
    role: '主裁判',
    appearance: {
      height: '1.83m',
      build: '标准',
      uniformColor: '黑白条纹',
      whistleType: '电子',
      signatureItem: '一个写着"冷静"的护腕。',
    },
    personality: {
      temperament: '幽默',
      fairnessLevel: '高',
      quirk: '喜欢在判罚时说一些冷笑话。',
    },
    dialogue: {
      foulCall: '犯规！伙计，你的手可不是磁铁，球衣拉不住的！',
      technicalFoul: '好了，好了，再争下去，今晚的晚餐就只有技术犯规套餐了！',
      endOfQuarter: '中场休息时间，去喝点水，别把地板都给烧着了！',
      preGame: '女士们先生们，准备好见证一场精彩的比赛...和我的精彩判罚了吗？',
    },
    behaviorPattern: {
      callStyle: '平衡',
      movement: '跑动积极',
      reactionToDispute: '耐心解释',
    },
  },
  {
    id: 6,
    name: '学院派 莉莉',
    role: '边线裁判',
    appearance: {
      height: '1.70m',
      build: '瘦弱',
      uniformColor: '淡蓝色条纹',
      whistleType: '塑料',
      signatureItem: '一本随身携带的规则手册。',
    },
    personality: {
      temperament: '冷静',
      fairnessLevel: '极高',
      quirk: '每次判罚后都会在脑海中引用具体的规则条款。',
    },
    dialogue: {
      foulCall: '根据规则第40条第3款，这是非法手部接触。',
      technicalFoul: '请注意，您的行为违反了体育道德，根据规则第50条，技术犯规。',
      endOfQuarter: '本节结束，请核对数据。',
      preGame: '我将严格按照国际篮联的最新规则进行判罚。',
    },
    behaviorPattern: {
      callStyle: '严格判罚',
      movement: '站位精准',
      reactionToDispute: '耐心解释',
    },
  },
  {
    id: 7,
    name: '慢半拍 鲍勃',
    role: '边线裁判',
    appearance: {
      height: '1.95m',
      build: '微胖',
      uniformColor: '黑白条纹',
      whistleType: '金属',
      signatureItem: '总是慢悠悠地走在场上。',
    },
    personality: {
      temperament: '随和',
      fairnessLevel: '中等',
      quirk: '判罚总是比实际发生慢一拍，像在思考人生。',
    },
    dialogue: {
      foulCall: '（思考3秒后）嗯...刚才好像有个犯规，算...算进攻犯规吧。',
      technicalFoul: '（挠头）呃...别吵了，不然我就要吹技术犯规了...真的。',
      endOfQuarter: '（听到蜂鸣器响后）哦，是结束了啊。',
      preGame: '（打哈欠）希望今天能早点结束。',
    },
    behaviorPattern: {
      callStyle: '放宽尺度',
      movement: '移动缓慢',
      reactionToDispute: '无视',
    },
  },
  {
    id: 8,
    name: '明星哨 凯文',
    role: '主裁判',
    appearance: {
      height: '1.85m',
      build: '标准',
      uniformColor: '金色条纹',
      whistleType: '金属',
      signatureItem: '一副名牌墨镜（虽然在室内）。',
    },
    personality: {
      temperament: '幽默',
      fairnessLevel: '低',
      quirk: '特别喜欢给明星球员和主队“面子哨”。',
    },
    dialogue: {
      foulCall: '（对明星球员）没事，继续打！这是好球！（对普通球员）犯规！',
      technicalFoul: '（对非明星球员）你再看我一眼试试？技术犯规！',
      endOfQuarter: '感谢所有球迷的欢呼，下节更精彩！',
      preGame: '今晚的焦点是...（看向明星球员）。',
    },
    behaviorPattern: {
      callStyle: '主场哨',
      movement: '跑动积极',
      reactionToDispute: '立即技术犯规',
    },
  },
  {
    id: 9,
    name: '沉默寡言 泽维尔',
    role: '记录台裁判',
    appearance: {
      height: '1.78m',
      build: '瘦弱',
      uniformColor: '黑色',
      whistleType: '电子',
      signatureItem: '一个永远保持严肃表情的脸。',
    },
    personality: {
      temperament: '严厉',
      fairnessLevel: '极高',
      quirk: '除了必要的判罚手势，几乎不开口说话。',
    },
    dialogue: {
      foulCall: '（只做手势，不说话）',
      technicalFoul: '（只做手势，指向替补席）',
      endOfQuarter: '（按下计时器，然后点头）',
      preGame: '（检查设备，然后点头）',
    },
    behaviorPattern: {
      callStyle: '严格判罚',
      movement: '站位精准',
      reactionToDispute: '无视',
    },
  },
  {
    id: 10,
    name: '戏剧女王 佩内洛普',
    role: '主裁判',
    appearance: {
      height: '1.72m',
      build: '标准',
      uniformColor: '粉色条纹', // 非传统颜色，增加趣味性
      whistleType: '金属',
      signatureItem: '一个夸张的犯规手势，像在跳舞。',
    },
    personality: {
      temperament: '暴躁',
      fairnessLevel: '高',
      quirk: '喜欢用极其夸张的肢体语言来宣布判罚。',
    },
    dialogue: {
      foulCall: '（伴随着一个旋转和跳跃）犯规！我的天呐，你差点把人家的胳膊扯下来！',
      technicalFoul: '（双手叉腰，大声呵斥）停下！这是我的舞台，你被罚下了！',
      endOfQuarter: '本节比赛的精彩大戏暂时告一段落！',
      preGame: '准备好了吗？今晚的表演即将开始！',
    },
    behaviorPattern: {
      callStyle: '平衡',
      movement: '跑动积极',
      reactionToDispute: '立即技术犯规',
    },
  },
];
