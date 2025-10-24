/**
 * NPC数据结构定义
 */
export interface NPC {
    id: number; // NPC唯一ID
    name: string; // 名称
    appearance: { // 外观描述
        height: string; // 身高
        build: string; // 体型
        clothing: string; // 服装
        notableFeature: string; // 显著特征
    };
    personality: { // 性格
        trait: string; // 主要特质
        motto: string; // 座右铭/口头禅
        interactionStyle: string; // 互动风格
    };
    dialogue: { // 对话
        greeting: string; // 首次见面问候语
        shopPrompt: string; // 引导玩家购物的台词
        farewell: string; // 告别语
    };
    behaviorPattern: { // 行为模式
        shopType: MerchantShopType; // 商店类型
        location: string; // 所在位置
        routine: string; // 日常活动
    };
}

/**
 * 商人商店类型
 */
export enum MerchantShopType {
    SNEAKER_STORE = "球鞋店",
    JERSEY_SHOP = "球衣装备店",
    TRAINING_GEAR = "训练器材店",
    ACCESSORIES = "篮球配件店", // 护腕、头带、袜子等
    NUTRITION_SUPPLEMENTS = "营养补给站", // 运动饮料、能量棒
    VINTAGE_COLLECTIBLES = "复古收藏品店", // 稀有球星卡、签名球
    STREET_FOOD_VENDOR = "街头小吃摊", // 快速补充能量
    CUSTOMIZATION_SERVICE = "定制服务店", // 球鞋/球衣定制
}

// 计划创建20个NPC，分配商店类型
// 球鞋店: 4个
// 球衣装备店: 3个
// 训练器材店: 3个
// 篮球配件店: 3个
// 营养补给站: 2个
// 复古收藏品店: 2个
// 街头小吃摊: 2个
// 定制服务店: 1个

// 总计: 4 + 3 + 3 + 3 + 2 + 2 + 2 + 1 = 20

import { NPC, MerchantShopType } from './npc_structure';

/**
 * 篮球主题商人NPC数据库
 */
export const MerchantNPCs: NPC[] = [
    // --- 球鞋店 (4个) ---
    {
        id: 1,
        name: "Kicks King - 雷蒙德",
        appearance: {
            height: "190cm",
            build: "精瘦",
            clothing: "限量版复古球衣和未发售的球鞋",
            notableFeature: "左臂有巨大篮球鞋涂鸦纹身",
        },
        personality: {
            trait: "狂热、挑剔",
            motto: "每一双鞋都有它的故事，别让它蒙尘。",
            interactionStyle: "喜欢考问顾客对球鞋历史的了解",
        },
        dialogue: {
            greeting: "哟，看你这步伐，是来找双能让你飞起来的战靴吧？",
            shopPrompt: "店里都是我精挑细选的艺术品，看上了哪双，我给你讲讲它的传奇。",
            farewell: "穿上它，去统治球场吧！下次带点好故事回来。",
        },
        behaviorPattern: {
            shopType: MerchantShopType.SNEAKER_STORE,
            location: "街区中心，最显眼的转角店铺",
            routine: "每天擦拭球鞋，对着镜子练习花式系鞋带。",
        },
    },
    {
        id: 2,
        name: "Sole Sister - 琳达",
        appearance: {
            height: "165cm",
            build: "匀称",
            clothing: "时尚运动套装，配色大胆的定制球鞋",
            notableFeature: "戴着一副镶满水钻的篮球造型耳环",
        },
        personality: {
            trait: "直率、潮流",
            motto: "球场是T台，你的脚下就是焦点。",
            interactionStyle: "会直接指出顾客的穿搭问题，并给出时尚建议",
        },
        dialogue: {
            greeting: "欢迎来到我的球鞋王国！告诉我，你今天的风格是什么？",
            shopPrompt: "别只看性能，兄弟。这双鞋能让你在场上场下都成为MVP。",
            farewell: "记住，时尚永不退场！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.SNEAKER_STORE,
            location: "潮流街区二楼，需要走过一条涂鸦走廊",
            routine: "定期在社交媒体上发布最新款球鞋的测评视频。",
        },
    },
    {
        id: 3,
        name: "Old School - 乔治",
        appearance: {
            height: "180cm",
            build: "微胖，略显老态",
            clothing: "宽松的90年代复古运动服，脚上是磨损严重的经典款",
            notableFeature: "总是叼着一根未点燃的雪茄",
        },
        personality: {
            trait: "怀旧、经验丰富",
            motto: "真正的经典永远不会过时。",
            interactionStyle: "喜欢讲述过去球星和球鞋的故事",
        },
        dialogue: {
            greeting: "年轻人，你脚上那双花里胡哨的玩意儿，能打赢我这双老古董吗？",
            shopPrompt: "这里只有真正的‘硬货’。如果你不懂历史，你就不配拥有它们。",
            farewell: "去吧，用你的方式向经典致敬。",
        },
        behaviorPattern: {
            shopType: MerchantShopType.SNEAKER_STORE,
            location: "老旧体育馆旁边的小巷深处",
            routine: "坐在店门口的折叠椅上，看老比赛录像。",
        },
    },
    {
        id: 4,
        name: "The Budgeter - 小李",
        appearance: {
            height: "175cm",
            build: "普通",
            clothing: "印有‘买一送一’字样的T恤，运动短裤",
            notableFeature: "算盘不离手，眼神精明",
        },
        personality: {
            trait: "精打细算、务实",
            motto: "性价比才是王道！",
            interactionStyle: "快速报出最低折扣和各种优惠组合",
        },
        dialogue: {
            greeting: "嘿！别浪费时间，直接告诉我你的预算和需求！",
            shopPrompt: "这双？性能不输顶配，价格只有一半！买它！",
            farewell: "省下的钱，记得买点吃的补充体力！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.SNEAKER_STORE,
            location: "大学篮球场附近的平价商场",
            routine: "不停地更新价格标签，计算库存周转率。",
        },
    },

    // --- 球衣装备店 (3个) ---
    {
        id: 5,
        name: "Jersey Fanatic - 麦克",
        appearance: {
            height: "185cm",
            build: "健壮",
            clothing: "每天更换一件不同球队的复刻球衣",
            notableFeature: "脖子上挂着哨子，像个兼职教练",
        },
        personality: {
            trait: "热情、团队精神",
            motto: "穿上你的战袍，你就是球队的一部分！",
            interactionStyle: "会向顾客询问他们最喜欢的球队和球员",
        },
        dialogue: {
            greeting: "欢迎！你今天想代表哪支球队出战？",
            shopPrompt: "球衣不只是衣服，它是荣耀和汗水的象征。我们有最全的尺码和版本！",
            farewell: "穿上它，去捍卫你的主场！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.JERSEY_SHOP,
            location: "体育馆入口正对面",
            routine: "组织店员进行‘最佳球衣搭配’比赛。",
        },
    },
    {
        id: 6,
        name: "The Tailor - 莎拉",
        appearance: {
            height: "170cm",
            build: "纤细",
            clothing: "一件绣着自己名字和号码的定制球衣，戴着顶针",
            notableFeature: "手指上布满了被针扎过的小伤口",
        },
        personality: {
            trait: "细致、完美主义",
            motto: "细节决定成败，无论是比赛还是服装。",
            interactionStyle: "专注于球衣的材质、剪裁和定制服务",
        },
        dialogue: {
            greeting: "你好，你需要一件独一无二的战袍吗？",
            shopPrompt: "告诉我你的号码、你的名字，我保证这件球衣穿在你身上，比原版更合身。",
            farewell: "去吧，让你的对手记住你的名字和号码！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.JERSEY_SHOP,
            location: "安静的商业街角落，店面不大但很精致",
            routine: "在缝纫机前工作，为顾客提供快速修补服务。",
        },
    },
    {
        id: 7,
        name: "Team Manager - 鲍勃",
        appearance: {
            height: "178cm",
            build: "壮实",
            clothing: "印有‘装备管理员’字样的夹克，背着一个巨大的运动包",
            notableFeature: "总是带着一个计时器，显得很匆忙",
        },
        personality: {
            trait: "高效、组织性强",
            motto: "没有装备，就没有比赛。",
            interactionStyle: "提供全套的球队装备采购和后勤建议",
        },
        dialogue: {
            greeting: "时间就是金钱，你需要什么，快点！",
            shopPrompt: "除了球衣，你还需要毛巾、水壶、训练服吗？一站式购齐，别耽误训练！",
            farewell: "别忘了你的水壶，保持水分！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.JERSEY_SHOP,
            location: "体育用品批发市场附近",
            routine: "整理库存，确保所有装备都按颜色和尺码分类。",
        },
    },

    // --- 训练器材店 (3个) ---
    {
        id: 8,
        name: "The Drill Sergeant - 汉斯",
        appearance: {
            height: "200cm",
            build: "肌肉发达",
            clothing: "黑色背心和军用迷彩裤",
            notableFeature: "脸上有一道旧伤疤，表情严肃",
        },
        personality: {
            trait: "严苛、纪律",
            motto: "汗水是最好的装备。",
            interactionStyle: "用教练的口吻，质疑顾客的训练强度",
        },
        dialogue: {
            greeting: "你看起来不够强壮。来这里干什么？",
            shopPrompt: "想要提升？你需要的是这些！负重背心、敏捷梯、专业发球机。别买那些花哨的玩意儿。",
            farewell: "没有借口！继续训练！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.TRAINING_GEAR,
            location: "地下训练室的入口处",
            routine: "亲自示范各种训练器材的使用方法，并进行高强度训练。",
        },
    },
    {
        id: 9,
        name: "Tech Guru - 阿伦",
        appearance: {
            height: "172cm",
            build: "瘦弱",
            clothing: "高科技面料的运动服，戴着智能眼镜",
            notableFeature: "总是摆弄着一个平板电脑，记录数据",
        },
        personality: {
            trait: "理性、数据驱动",
            motto: "用科学武装你的身体。",
            interactionStyle: "用大量专业术语和数据分析来推销产品",
        },
        dialogue: {
            greeting: "欢迎。你的运动表现数据分析结果如何？",
            shopPrompt: "这款智能篮球能实时追踪你的投篮弧度、出手速度和命中率。这是提升效率的最佳投资。",
            farewell: "根据数据反馈，明天你的训练强度应该提高15%。",
        },
        behaviorPattern: {
            shopType: MerchantShopType.TRAINING_GEAR,
            location: "科技园区的运动康复中心",
            routine: "编写新的运动算法和测试器材的精度。",
        },
    },
    {
        id: 10,
        name: "Home Court - 王姐",
        appearance: {
            height: "168cm",
            build: "健壮",
            clothing: "印有‘社区篮球’字样的卫衣，围着围裙",
            notableFeature: "笑容和蔼，手里拿着一个篮球形状的钥匙扣",
        },
        personality: {
            trait: "亲切、社区感",
            motto: "篮球，从家门口开始。",
            interactionStyle: "提供适合家庭和社区使用的训练器材",
        },
        dialogue: {
            greeting: "来啦？想要给你的小球场添点什么？",
            shopPrompt: "可折叠的篮筐、耐用的户外篮球、便携式计分器。让你的后院变成篮球天堂！",
            farewell: "记得多陪孩子打打球！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.TRAINING_GEAR,
            location: "居民区附近的体育用品店",
            routine: "组织社区篮球活动，并提供器材租赁服务。",
        },
    },

    // --- 篮球配件店 (3个) ---
    {
        id: 11,
        name: "The Protector - 卡尔",
        appearance: {
            height: "195cm",
            build: "强壮",
            clothing: "全身穿着各种护具：护膝、护肘、护腕",
            notableFeature: "走路姿势略显僵硬，似乎受过很多伤",
        },
        personality: {
            trait: "谨慎、注重安全",
            motto: "没有伤病，你才能打得更久。",
            interactionStyle: "反复强调保护的重要性，推销各种防护装备",
        },
        dialogue: {
            greeting: "你的身体是你的武器，别让它受伤！",
            shopPrompt: "你需要最好的护踝，最强的护齿。别等到受伤了才后悔没买。",
            farewell: "打球小心点！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.ACCESSORIES,
            location: "医院旁边的运动康复中心",
            routine: "阅读运动医学书籍，检查护具的磨损情况。",
        },
    },
    {
        id: 12,
        name: "Grip Master - 杰西",
        appearance: {
            height: "176cm",
            build: "灵活",
            clothing: "紧身运动衣，手上戴着一双防滑手套",
            notableFeature: "双手布满老茧，手指修长",
        },
        personality: {
            trait: "专注、细节控",
            motto: "控制力，决定一切。",
            interactionStyle: "专注于篮球的抓握感、袜子和护腕的吸汗性",
        },
        dialogue: {
            greeting: "你的手感如何？需要提升吗？",
            shopPrompt: "这款防滑喷雾、这条吸汗头带、这双专业篮球袜。小细节，大提升！",
            farewell: "去感受篮球在你手中的完美控制吧！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.ACCESSORIES,
            location: "室外篮球场附近的流动摊位",
            routine: "测试各种篮球的摩擦力，并记录数据。",
        },
    },
    {
        id: 13,
        name: "The Bling King - 蒂姆",
        appearance: {
            height: "188cm",
            build: "魁梧",
            clothing: "闪亮的金项链，戴着墨镜，穿着印有自己名字的篮球背心",
            notableFeature: "嘴里含着一个金色的护齿",
        },
        personality: {
            trait: "张扬、自信",
            motto: "打球要赢，穿搭要酷。",
            interactionStyle: "推销各种华丽、引人注目的配件",
        },
        dialogue: {
            greeting: "哟，兄弟，你这身行头还差点意思！",
            shopPrompt: "看看我的限量版头带、定制护腕、还有能闪瞎对手的护目镜！让你成为全场最靓的仔！",
            farewell: "去吧，让聚光灯照耀你！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.ACCESSORIES,
            location: "夜店附近的豪华运动品店",
            routine: "对着镜子调整自己的配饰，确保每一个角度都完美。",
        },
    },

    // --- 营养补给站 (2个) ---
    {
        id: 14,
        name: "Energy Chef - 安娜",
        appearance: {
            height: "160cm",
            build: "圆润",
            clothing: "干净的白色厨师服，戴着印有篮球图案的帽子",
            notableFeature: "总是带着一股香甜的能量棒味道",
        },
        personality: {
            trait: "温暖、营养专家",
            motto: "没有能量，就没有胜利。",
            interactionStyle: "关心顾客的健康和体力恢复",
        },
        dialogue: {
            greeting: "打完球累坏了吧？来点能量补充一下！",
            shopPrompt: "我这里有最棒的蛋白粉、定制的运动饮料、还有手工制作的能量棒。让你恢复如初！",
            farewell: "吃饱喝足，明天继续战斗！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.NUTRITION_SUPPLEMENTS,
            location: "体育馆出口处的移动餐车",
            routine: "研发新的运动营养配方，并为顾客提供免费试吃。",
        },
    },
    {
        id: 15,
        name: "The Hydrator - 约翰",
        appearance: {
            height: "183cm",
            build: "标准",
            clothing: "蓝色运动背心，手里拿着一个巨大的水壶",
            notableFeature: "皮肤晒得黝黑，像个马拉松运动员",
        },
        personality: {
            trait: "冷静、注重水分",
            motto: "水是生命之源，也是运动之源。",
            interactionStyle: "强调水分和电解质的重要性",
        },
        dialogue: {
            greeting: "你看起来有点脱水。需要点什么吗？",
            shopPrompt: "专业电解质饮料、快速补水片、还有各种口味的维生素水。别让脱水毁了你的比赛！",
            farewell: "多喝水，保持清醒！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.NUTRITION_SUPPLEMENTS,
            location: "户外篮球场边的自动贩卖机和休息区",
            routine: "定期检查水质，确保饮用水的新鲜和安全。",
        },
    },

    // --- 复古收藏品店 (2个) ---
    {
        id: 16,
        name: "The Historian - 陈叔",
        appearance: {
            height: "170cm",
            build: "瘦削",
            clothing: "一件泛黄的篮球名人堂夹克，戴着老花镜",
            notableFeature: "总是小心翼翼地擦拭着一个签名篮球",
        },
        personality: {
            trait: "沉稳、知识渊博",
            motto: "收藏的是历史，传承的是精神。",
            interactionStyle: "喜欢向顾客介绍收藏品背后的故事和价值",
        },
        dialogue: {
            greeting: "年轻人，对历史感兴趣吗？",
            shopPrompt: "这里有稀有的球星卡、绝版的签名球、还有一些你从未见过的老照片。每一件都是无价之宝。",
            farewell: "好好保管你手中的历史！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.VINTAGE_COLLECTIBLES,
            location: "博物馆附近的古董店二楼",
            routine: "鉴定和修复旧的篮球收藏品。",
        },
    },
    {
        id: 17,
        name: "Mystery Box - 凯文",
        appearance: {
            height: "180cm",
            build: "神秘",
            clothing: "连帽衫和口罩，只露出一双眼睛",
            notableFeature: "总是拿着一个黑色的手提箱",
        },
        personality: {
            trait: "神秘、投机",
            motto: "风险越大，回报越高。",
            interactionStyle: "推销各种‘盲盒’和未鉴定的稀有物品",
        },
        dialogue: {
            greeting: "想要一夜暴富吗？",
            shopPrompt: "我这里有你绝对想不到的稀有卡片，但你得敢赌一把。买个盲盒，也许里面就是一张MVP签名卡！",
            farewell: "祝你好运，希望你开出大奖！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.VINTAGE_COLLECTIBLES,
            location: "地下黑市的隐蔽角落",
            routine: "参加各种拍卖会，寻找潜在的稀有物品。",
        },
    },

    // --- 街头小吃摊 (2个) ---
    {
        id: 18,
        name: "Hot Dog Hero - 老王",
        appearance: {
            height: "175cm",
            build: "壮实",
            clothing: "油腻的围裙，戴着一顶棒球帽",
            notableFeature: "总是大声吆喝，声音洪亮",
        },
        personality: {
            trait: "热情、粗犷",
            motto: "吃饱了，才能跑得动！",
            interactionStyle: "提供快速、高热量的街头小吃",
        },
        dialogue: {
            greeting: "饿了吗？来个热狗，瞬间满血复活！",
            shopPrompt: "香肠、面包、酱料，加倍！这是球场边的传统，快速补充能量，别耽误比赛！",
            farewell: "下次带你的队友一起来！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.STREET_FOOD_VENDOR,
            location: "露天篮球场旁边",
            routine: "在摊位前烤香肠，与路过的球手聊天。",
        },
    },
    {
        id: 19,
        name: "Smoothie Queen - 艾米",
        appearance: {
            height: "163cm",
            build: "健康",
            clothing: "印有水果图案的T恤，扎着高马尾",
            notableFeature: "皮肤健康有光泽，总是面带微笑",
        },
        personality: {
            trait: "阳光、健康",
            motto: "天然能量，无敌状态！",
            interactionStyle: "推销新鲜果汁和冰沙，强调健康和清爽",
        },
        dialogue: {
            greeting: "打球打累了吧？来杯冰沙，清爽一下！",
            shopPrompt: "我的‘MVP特饮’富含维生素和电解质，纯天然无添加！喝完让你感觉像飞起来一样！",
            farewell: "保持健康，保持微笑！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.STREET_FOOD_VENDOR,
            location: "沙滩排球场和健身房附近",
            routine: "挑选新鲜水果，调制新的健康饮品。",
        },
    },

    // --- 定制服务店 (1个) ---
    {
        id: 20,
        name: "The Artist - 泽维尔",
        appearance: {
            height: "177cm",
            build: "艺术",
            clothing: "沾满颜料的牛仔外套，戴着贝雷帽",
            notableFeature: "手指上戴着各种戒指，眼神充满创意",
        },
        personality: {
            trait: "创意、不羁",
            motto: "你的装备，就是你的画布。",
            interactionStyle: "提供个性化的球鞋、球衣、篮球涂鸦和定制服务",
        },
        dialogue: {
            greeting: "想让你的装备变成独一无二的艺术品吗？",
            shopPrompt: "无论是球鞋上的手绘图案，还是球衣上的特殊刺绣，我都能帮你实现。让你的装备成为你的签名！",
            farewell: "去吧，带着你的艺术品去征服世界！",
        },
        behaviorPattern: {
            shopType: MerchantShopType.CUSTOMIZATION_SERVICE,
            location: "艺术区和篮球场交界处",
            routine: "在工作台上进行球鞋定制，播放着嘻哈音乐。",
        },
    },
];
