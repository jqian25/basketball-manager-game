// 定义通用的NPC数据结构
export interface NPC {
    id: string; // 唯一标识符
    name: string; // 名称
    appearance: Appearance; // 外观描述
    personality: Personality; // 性格描述
    dialogue: Dialogue; // 对话内容
    behaviorPattern: BehaviorPattern; // 行为模式
}

// 外观结构
export interface Appearance {
    gender: 'Male' | 'Female' | 'Other'; // 性别
    ageRange: 'Teen' | '20s' | '30s' | '40s' | '50s+' | 'Elderly'; // 年龄范围
    clothing: string; // 服装描述，例如：'湖人队詹姆斯球衣', '印有球队Logo的帽子'
    distinguishingFeatures: string; // 显著特征，例如：'脸上涂有油彩', '戴着一副大黑框眼镜'
}

// 性格结构
export interface Personality {
    mbti?: string; // 可选的MBTI类型，用于更细致的性格划分
    keyTraits: string[]; // 关键性格特质，例如：['热情', '忠诚', '易怒']
    fanaticismLevel: 'Casual' | 'Moderate' | 'Hardcore' | 'Ultra'; // 狂热程度
    favoriteTeam: string; // 支持的球队
    rivalTeam: string; // 讨厌的球队
}

// 对话结构
export interface Dialogue {
    greeting: string; // 问候语
    winReaction: string; // 球队赢球时的反应
    lossReaction: string; // 球队输球时的反应
    generalComment: string; // 一般评论，例如对比赛、球员的看法
    triviaQuestion: string; // 篮球冷知识问题（可选）
}

// 行为模式结构
export interface BehaviorPattern {
    stadiumLocation: 'Front Row' | 'Upper Deck' | 'Concourse' | 'Team Store'; // 经常出现的位置
    inGameAction: string; // 比赛中的典型行为，例如：'不停地大喊防守', '紧张地来回踱步'
    postGameAction: string; // 赛后的典型行为
}

// FanNPC数据库
export const FanNPCs: NPC[] = [
    {
        id: 'FAN_001',
        name: '铁杆老王',
        appearance: {
            gender: 'Male',
            ageRange: '50s+',
            clothing: '一件褪色的90年代球衣，上面有磨损的签名',
            distinguishingFeatures: '戴着一副老花镜，手里总是拿着一个收音机听解说'
        },
        personality: {
            keyTraits: ['忠诚', '怀旧', '固执'],
            fanaticismLevel: 'Ultra',
            favoriteTeam: '主队（假设为本地球队）',
            rivalTeam: '宿敌队'
        },
        dialogue: {
            greeting: '小伙子，你见过我们队最辉煌的时代吗？',
            winReaction: '干得漂亮！这才是我们熟悉的篮球！',
            lossReaction: '唉，现在的年轻人啊，防守太软了！',
            generalComment: '现在的比赛节奏太快了，不如以前的阵地战有味道。',
            triviaQuestion: '你知道我们队史得分王是谁吗？'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '每当裁判判罚不利时，会大声抱怨并挥舞手臂',
            postGameAction: '在球场外和老朋友们讨论比赛的每一个细节'
        }
    },
    {
        id: 'FAN_002',
        name: '数据帝小李',
        appearance: {
            gender: 'Male',
            ageRange: '20s',
            clothing: '一件印有复杂数据图表的T恤',
            distinguishingFeatures: '戴着蓝牙耳机，不停地在手机上记录数据'
        },
        personality: {
            keyTraits: ['理性', '分析', '内向'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '数据表现差的球队'
        },
        dialogue: {
            greeting: '你好，根据我的模型，今天我们有72%的胜率。',
            winReaction: '正如我的数据预测的那样，关键在于第四节的有效投篮命中率。',
            lossReaction: '这不科学！我要重新跑一下我的Win Probability Added模型！',
            generalComment: '这个球员的真实命中率（TS%）被高估了，他的PER值也一般。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '每当有暂停时，会快速查阅球员数据并更新他的电子表格',
            postGameAction: '立即在社交媒体上发布一篇详细的赛后数据分析报告'
        }
    },
    {
        id: 'FAN_003',
        name: '时尚丽莎',
        appearance: {
            gender: 'Female',
            ageRange: '30s',
            clothing: '一件设计感十足的队服裙子，搭配时尚运动鞋',
            distinguishingFeatures: '化着精致的妆容，脖子上挂着一个高清相机'
        },
        personality: {
            keyTraits: ['外向', '爱美', '社交达人'],
            fanaticismLevel: 'Moderate',
            favoriteTeam: '主队',
            rivalTeam: '任何配色不时尚的球队'
        },
        dialogue: {
            greeting: '嗨！你觉得我今天的穿搭和队服配色搭吗？',
            winReaction: '太棒了！我要把这个胜利瞬间拍下来发到我的社交账号！',
            lossReaction: '哦不，我的妆都快哭花了！但至少照片拍得不错。',
            generalComment: '我觉得那个新秀的发型很酷，但他的投篮姿势需要改进。'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '在比赛间隙和中场休息时，不停地自拍和拍摄场馆氛围',
            postGameAction: '在场馆出口和朋友们合影留念'
        }
    },
    {
        id: 'FAN_004',
        name: '吉祥物迷小胖',
        appearance: {
            gender: 'Male',
            ageRange: 'Teen',
            clothing: '全身都是吉祥物的周边产品，包括头饰',
            distinguishingFeatures: '体型微胖，脸上总是带着兴奋的笑容'
        },
        personality: {
            keyTraits: ['天真', '活泼', '容易满足'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '吉祥物不好看的球队'
        },
        dialogue: {
            greeting: '你看到吉祥物了吗？它刚刚和我击掌了！',
            winReaction: '耶！吉祥物跳舞了！今天晚上我要抱着我的吉祥物玩偶睡觉！',
            lossReaction: '没关系，至少吉祥物很努力地在逗我们开心！',
            generalComment: '我最喜欢中场休息的活动了，比分什么的没那么重要啦。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '比赛中大部分时间都在寻找吉祥物，并试图和它互动',
            postGameAction: '排队和吉祥物合影'
        }
    },
    {
        id: 'FAN_005',
        name: '教练席上的张姨',
        appearance: {
            gender: 'Female',
            ageRange: '40s',
            clothing: '一件干净整洁的队服外套，手里拿着保温杯',
            distinguishingFeatures: '眼神锐利，仿佛能看穿战术'
        },
        personality: {
            keyTraits: ['操心', '爱指挥', '经验丰富'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '任何不打团队篮球的球队'
        },
        dialogue: {
            greeting: '这球应该传给内线啊，教练怎么还不叫暂停？',
            winReaction: '还好我刚才喊了，不然这球就丢了！',
            lossReaction: '战术执行得太差了！回去教练组要好好反思！',
            generalComment: '篮球是五个人的运动，不能光靠一个人单打独斗。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '不停地对场上球员和教练席进行“指导”，声音洪亮',
            postGameAction: '给电视台的体育热线打电话，发表她的战术意见'
        }
    },
    {
        id: 'FAN_006',
        name: '口号哥',
        appearance: {
            gender: 'Male',
            ageRange: '20s',
            clothing: '一件印有各种加油口号的DIY T恤',
            distinguishingFeatures: '嗓门特别大，脖子上青筋暴起'
        },
        personality: {
            keyTraits: ['激情', '吵闹', '组织者'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '制造噪音的客队球迷'
        },
        dialogue: {
            greeting: '来！跟我一起喊！防守！防守！防守！',
            winReaction: '我们是最棒的！把屋顶都掀翻了！',
            lossReaction: '嘘！安静！下一场我们赢回来！',
            generalComment: '气氛！我们需要气氛！没有气氛怎么能赢球！'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '组织周围的球迷喊口号，带领人浪',
            postGameAction: '声音沙哑地和朋友们庆祝'
        }
    },
    {
        id: 'FAN_007',
        name: '佛系小陈',
        appearance: {
            gender: 'Female',
            ageRange: '20s',
            clothing: '一件宽松的队服卫衣，抱着一个抱枕',
            distinguishingFeatures: '表情平静，仿佛在看一场电影'
        },
        personality: {
            keyTraits: ['冷静', '随和', '淡定'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '没有'
        },
        dialogue: {
            greeting: '来看球啦，希望今天能打得好看。',
            winReaction: '嗯，不错，赢了。',
            lossReaction: '没事，输赢都是常事，健康最重要。',
            generalComment: '篮球就是一种娱乐方式，不用太较真。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '安静地看球，偶尔吃点零食，不为比分波动',
            postGameAction: '平静地离开，仿佛什么都没发生'
        }
    },
    {
        id: 'FAN_008',
        name: '球鞋收藏家',
        appearance: {
            gender: 'Male',
            ageRange: '30s',
            clothing: '一身潮牌，脚上是一双限量版球星签名鞋',
            distinguishingFeatures: '手里拿着一个透明的鞋盒，里面装着另一双珍藏球鞋'
        },
        personality: {
            keyTraits: ['物质主义', '挑剔', '专业'],
            fanaticismLevel: 'Moderate',
            favoriteTeam: '主队',
            rivalTeam: '穿假鞋的球迷'
        },
        dialogue: {
            greeting: '你觉得这双Air Jordan 11的配色怎么样？',
            winReaction: '太棒了！我的球鞋今天带来了好运！',
            lossReaction: '唉，我的新鞋差点被踩脏了，晦气！',
            generalComment: '比起比赛，我更关注球员们穿的球鞋和装备。'
        },
        behaviorPattern: {
            stadiumLocation: 'Team Store',
            inGameAction: '中场休息时去周边商店看看有没有新发售的球鞋',
            postGameAction: '小心翼翼地擦拭他的球鞋，然后离开'
        }
    },
    {
        id: 'FAN_009',
        name: '键盘侠小赵',
        appearance: {
            gender: 'Male',
            ageRange: '20s',
            clothing: '一件黑色的连帽衫，戴着口罩',
            distinguishingFeatures: '低着头，手指不停地在手机上敲击'
        },
        personality: {
            keyTraits: ['刻薄', '多疑', '网络依赖'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '所有客队和不看好主队的媒体'
        },
        dialogue: {
            greeting: '（低声嘟囔）这个解说员是收了钱吗？说得都是什么鬼话！',
            winReaction: '（在手机上打字）我就说我们队是不可战胜的！那些黑子们出来挨打！',
            lossReaction: '（在手机上打字）教练下课！XX球员滚出球队！管理层是瞎子吗！',
            generalComment: '我早就预言了，这个球员迟早会成为球队的毒瘤。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '比赛中不停地在社交媒体和论坛上发表评论和争吵',
            postGameAction: '在回家的路上继续和网友们进行“赛后总结”'
        }
    },
    {
        id: 'FAN_010',
        name: '明星追随者',
        appearance: {
            gender: 'Female',
            ageRange: 'Teen',
            clothing: '印有某位球星大头照的T恤，手里拿着应援牌',
            distinguishingFeatures: '眼睛里只有她喜欢的球星，对其他人不感兴趣'
        },
        personality: {
            keyTraits: ['花痴', '盲目', '热情'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '和她偶像竞争的球员'
        },
        dialogue: {
            greeting: '啊啊啊！他看我了！他真的看我了！',
            winReaction: '我的宝贝太棒了！他就是MVP！',
            lossReaction: '都是队友不给力！不怪他！',
            generalComment: '我来这里就是为了看他打球，其他人是谁不重要。'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '每当偶像拿到球，就会尖叫并举起应援牌',
            postGameAction: '在球员通道附近等待，希望能要到签名'
        }
    },
    {
        id: 'FAN_011',
        name: '赌球老哥',
        appearance: {
            gender: 'Male',
            ageRange: '40s',
            clothing: '一件普通的Polo衫，看起来有点焦虑',
            distinguishingFeatures: '不停地看手机上的比分和赔率变化'
        },
        personality: {
            keyTraits: ['焦虑', '投机', '紧张'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '能赢盘的球队',
            rivalTeam: '输盘的球队'
        },
        dialogue: {
            greeting: '今天的大小分开了多少？我压了一个大分。',
            winReaction: '漂亮！收米了！今晚加餐！',
            lossReaction: '搞什么鬼！最后这个三分球为什么不进！',
            generalComment: '我不是来看球的，我是来看钱的。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中不停地计算分差和剩余时间，情绪随着比分起伏剧烈',
            postGameAction: '迅速离开球场，去兑现或继续研究下一场比赛'
        }
    },
    {
        id: 'FAN_012',
        name: '美食评论家',
        appearance: {
            gender: 'Female',
            ageRange: '30s',
            clothing: '一件印有食物图案的队服，手里拿着一个空爆米花桶',
            distinguishingFeatures: '对球场食物的评价比对比赛更上心'
        },
        personality: {
            keyTraits: ['吃货', '挑剔', '享乐主义'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '提供难吃食物的球场'
        },
        dialogue: {
            greeting: '你尝过这里的热狗吗？我觉得不如上赛季的。',
            winReaction: '今晚的啤酒和炸鸡味道更好了！庆祝一下！',
            lossReaction: '算了，至少我吃到了好吃的玉米片。',
            generalComment: '看球的乐趣有一半在于吃喝。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '中场休息时，会排队购买各种球场小吃，并拍照记录',
            postGameAction: '在美食App上给球场餐厅写评论'
        }
    },
    {
        id: 'FAN_013',
        name: '裁判批评家',
        appearance: {
            gender: 'Male',
            ageRange: '50s+',
            clothing: '一件印有“裁判是瞎子”标语的T恤',
            distinguishingFeatures: '手里拿着一个放大镜，似乎想看清每一个动作'
        },
        personality: {
            keyTraits: ['暴躁', '偏执', '不信任'],
            fanaticismLevel: 'Ultra',
            favoriteTeam: '主队',
            rivalTeam: '裁判'
        },
        dialogue: {
            greeting: '这球绝对走步了！裁判的眼睛是用来出气的吗？',
            winReaction: '要不是裁判在帮倒忙，我们早就赢了！',
            lossReaction: '都是黑哨！联盟针对我们！',
            generalComment: '篮球规则我比裁判清楚！'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中不停地对着裁判方向大喊，指出他们的“错误”',
            postGameAction: '在社交媒体上发布比赛中所有争议判罚的慢动作视频'
        }
    },
    {
        id: 'FAN_014',
        name: '外国友人Tom',
        appearance: {
            gender: 'Male',
            ageRange: '20s',
            clothing: '一件印有中文队名的球衣，但穿反了',
            distinguishingFeatures: '金发碧眼，努力用中文和周围人交流'
        },
        personality: {
            keyTraits: ['好奇', '友好', '文化爱好者'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '不了解'
        },
        dialogue: {
            greeting: '你好！我爱...篮球！',
            winReaction: '（用蹩脚的中文）太棒了！我们...赢了！',
            lossReaction: '哦，没关系。下一次...努力！',
            generalComment: '我喜欢这里的气氛，很热闹。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '不停地问周围的球迷关于比赛规则和球员名字',
            postGameAction: '尝试购买一些带有本地特色的纪念品'
        }
    },
    {
        id: 'FAN_015',
        name: '篮球哲学家',
        appearance: {
            gender: 'Male',
            ageRange: '30s',
            clothing: '一件没有队标的纯色T恤，戴着一副细框眼镜',
            distinguishingFeatures: '表情严肃，仿佛在思考人生的意义'
        },
        personality: {
            keyTraits: ['深刻', '内省', '悲观'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '所有不尊重篮球精神的球队'
        },
        dialogue: {
            greeting: '篮球，是关于希望与绝望的辩证统一。',
            winReaction: '胜利是偶然的，但努力是必然的。',
            lossReaction: '我们输掉的不是一场比赛，而是对篮球本质的理解。',
            generalComment: '篮球的魅力在于它的不确定性和对人性的考验。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中保持沉默，偶尔会低声说出一些哲学性的评论',
            postGameAction: '写一篇关于比赛的“深度”文章，探讨篮球精神'
        }
    },
    {
        id: 'FAN_016',
        name: '全能周边姐',
        appearance: {
            gender: 'Female',
            ageRange: '20s',
            clothing: '从头到脚都是主队的周边，包括耳环和指甲油',
            distinguishingFeatures: '手里拿着一个印有队标的马克杯'
        },
        personality: {
            keyTraits: ['狂热', '收集癖', '炫耀'],
            fanaticismLevel: 'Ultra',
            favoriteTeam: '主队',
            rivalTeam: '没有周边可买的球队'
        },
        dialogue: {
            greeting: '你看看我的新队标耳环，是不是超可爱？',
            winReaction: '我的周边今天带来了好运！我要再买一个纪念品！',
            lossReaction: '没关系，我还有很多周边可以安慰我。',
            generalComment: '我支持球队的方式就是买光他们的周边！'
        },
        behaviorPattern: {
            stadiumLocation: 'Team Store',
            inGameAction: '中场休息时，在周边店里仔细检查每一个新商品',
            postGameAction: '和陌生人展示她的周边收藏'
        }
    },
    {
        id: 'FAN_017',
        name: '临时球迷小明',
        appearance: {
            gender: 'Male',
            ageRange: 'Teen',
            clothing: '一件刚买的，标签还没撕掉的队服',
            distinguishingFeatures: '对比赛规则一知半解，不停地问问题'
        },
        personality: {
            keyTraits: ['好奇', '迷茫', '跟风'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '不知道'
        },
        dialogue: {
            greeting: '请问，那个三秒区是什么意思？',
            winReaction: '太好了！我们赢了！我猜我们队很厉害吧？',
            lossReaction: '哦，输了。那下一场我们还会来吗？',
            generalComment: '我只是被朋友拉来看球的。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '不停地看手机，偶尔抬头看一眼比赛，然后问身边的人发生了什么',
            postGameAction: '问朋友下次什么时候再来看球'
        }
    },
    {
        id: 'FAN_018',
        name: '老派防守狂',
        appearance: {
            gender: 'Male',
            ageRange: '40s',
            clothing: '一件印有“Defense Wins Championships”标语的T恤',
            distinguishingFeatures: '手臂上有一些旧伤，可能是以前打球留下的'
        },
        personality: {
            keyTraits: ['强硬', '务实', '注重细节'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '只注重进攻的球队'
        },
        dialogue: {
            greeting: '防守！防守！给我把球抢下来！',
            winReaction: '看到了吗？是防守赢得了这场比赛！',
            lossReaction: '进攻可以失误，防守绝不能松懈！',
            generalComment: '现在的球员太软了，没有以前的身体对抗。'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '每次防守成功都会大力鼓掌，并大声赞扬防守球员',
            postGameAction: '和朋友们分析比赛中的防守战术'
        }
    },
    {
        id: 'FAN_019',
        name: '情绪化小美',
        appearance: {
            gender: 'Female',
            ageRange: '20s',
            clothing: '一件印有球队Logo的卫衣，脸上涂着队标油彩',
            distinguishingFeatures: '情绪波动大，容易大哭大笑'
        },
        personality: {
            keyTraits: ['敏感', '情绪化', '真性情'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '任何击败主队的球队'
        },
        dialogue: {
            greeting: '我今天超级紧张，我的心跳得好快！',
            winReaction: '（喜极而泣）太感人了！我爱死这支球队了！',
            lossReaction: '（大哭）为什么会这样！我不能接受！',
            generalComment: '看球就是看一场人生的起起落落。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中会因为一个好球而尖叫，也会因为一个失误而抱头痛哭',
            postGameAction: '需要朋友安慰才能平静下来'
        }
    },
    {
        id: 'FAN_020',
        name: '专业解说员',
        appearance: {
            gender: 'Male',
            ageRange: '30s',
            clothing: '一件印有球队历史的复古T恤',
            distinguishingFeatures: '说话带有播音腔，喜欢使用专业术语'
        },
        personality: {
            keyTraits: ['知识渊博', '爱表现', '客观'],
            fanaticismLevel: 'Moderate',
            favoriteTeam: '主队',
            rivalTeam: '战术落后的球队'
        },
        dialogue: {
            greeting: '各位观众，我是您的场边解说，今天我们来分析一下这场比赛的战术布置。',
            winReaction: '这是一个教科书般的挡拆配合，完美的执行力！',
            lossReaction: '他们的区域联防做得很好，我们没能找到破解之道。',
            generalComment: '篮球是一门艺术，战术是它的灵魂。'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '比赛中不停地向身边的陌生人“解说”比赛，分析战术',
            postGameAction: '在回家的路上给朋友发长语音分析比赛'
        }
    },
    {
        id: 'FAN_021',
        name: '啦啦队队长',
        appearance: {
            gender: 'Female',
            ageRange: '20s',
            clothing: '一件短款队服，手里拿着一对彩球',
            distinguishingFeatures: '充满活力，动作夸张'
        },
        personality: {
            keyTraits: ['活力', '乐观', '积极'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '任何不积极的球队'
        },
        dialogue: {
            greeting: '让我们一起为球队加油！一二三，冲鸭！',
            winReaction: '我们是冠军！跳起来！',
            lossReaction: '没关系，我们还有下一次！保持微笑！',
            generalComment: '能量！我们需要正能量！'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '比赛中不停地跳舞和挥舞彩球，带动气氛',
            postGameAction: '组织球迷合唱队歌'
        }
    },
    {
        id: 'FAN_022',
        name: '安静的摄影师',
        appearance: {
            gender: 'Male',
            ageRange: '30s',
            clothing: '一件黑色T恤，背着一个专业的摄影包',
            distinguishingFeatures: '手里拿着一个长焦镜头相机，沉默寡言'
        },
        personality: {
            keyTraits: ['专注', '沉默', '艺术性'],
            fanaticismLevel: 'Moderate',
            favoriteTeam: '主队',
            rivalTeam: '光线不好的球场'
        },
        dialogue: {
            greeting: '（点头示意）',
            winReaction: '（按下快门，捕捉胜利瞬间）',
            lossReaction: '（叹气，收起相机）',
            generalComment: '篮球的美在于它的瞬间定格。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中不停地拍摄球员的特写和比赛的精彩瞬间',
            postGameAction: '回家整理照片，挑选最佳作品发布'
        }
    },
    {
        id: 'FAN_023',
        name: '小孩球迷乐乐',
        appearance: {
            gender: 'Male',
            ageRange: 'Teen',
            clothing: '一件大号的队服，像裙子一样拖到膝盖',
            distinguishingFeatures: '脸上贴着球队贴纸，手里拿着一个篮球'
        },
        personality: {
            keyTraits: ['调皮', '精力旺盛', '模仿'],
            fanaticismLevel: 'Casual',
            favoriteTeam: '主队',
            rivalTeam: '没有'
        },
        dialogue: {
            greeting: '叔叔，你会打篮球吗？',
            winReaction: '我要去打篮球！我要像他们一样厉害！',
            lossReaction: '爸爸，我们下次还能来看球吗？',
            generalComment: '我长大也要当篮球运动员！'
        },
        behaviorPattern: {
            stadiumLocation: 'Concourse',
            inGameAction: '在走廊里模仿球员的动作，运球或投篮（如果允许）',
            postGameAction: '缠着父母给他买新的篮球玩具'
        }
    },
    {
        id: 'FAN_024',
        name: '理性分析师',
        appearance: {
            gender: 'Female',
            ageRange: '30s',
            clothing: '商务休闲装，手里拿着一个笔记本',
            distinguishingFeatures: '表情严肃，记录着比赛的每一个细节'
        },
        personality: {
            keyTraits: ['逻辑', '批判', '专业'],
            fanaticismLevel: 'Hardcore',
            favoriteTeam: '主队',
            rivalTeam: '犯规多的球队'
        },
        dialogue: {
            greeting: '从战术角度来看，这个换人是明智的。',
            winReaction: '我们赢在执行力，但还有提升空间。',
            lossReaction: '这不是能力问题，是态度问题。',
            generalComment: '篮球不仅仅是运动，它也是一门管理学。'
        },
        behaviorPattern: {
            stadiumLocation: 'Upper Deck',
            inGameAction: '比赛中不停地做笔记，记录球员的跑位和战术执行情况',
            postGameAction: '撰写一份专业的赛后分析报告'
        }
    },
    {
        id: 'FAN_025',
        name: '客队卧底',
        appearance: {
            gender: 'Male',
            ageRange: '20s',
            clothing: '一件主队队服，但里面穿着客队的T恤',
            distinguishingFeatures: '表情阴险，时不时发出奇怪的笑声'
        },
        personality: {
            keyTraits: ['阴险', '反串', '幸灾乐祸'],
            fanaticismLevel: 'Ultra',
            favoriteTeam: '客队',
            rivalTeam: '主队'
        },
        dialogue: {
            greeting: '（假装热情）主队加油！',
            winReaction: '（低声）完了，客队怎么回事？',
            lossReaction: '（悄悄地）哈哈，活该！',
            generalComment: '（假装抱怨）主队打得太差了，真让人失望。'
        },
        behaviorPattern: {
            stadiumLocation: 'Front Row',
            inGameAction: '在主队得分时假装欢呼，在主队失误时偷偷窃笑',
            postGameAction: '迅速脱下主队队服，露出客队T恤，然后溜走'
        }
    }
];
