// client/src/game/collectibles/CollectibleDatabase.ts

/**
 * 篮球主题收藏品的接口定义
 */
export interface Collectible {
    /** 收藏品的唯一标识符 */
    id: number;
    /** 收藏品的名称 */
    name: string;
    /** 收藏品的稀有度 */
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
    /** 收藏品的简短描述 */
    description: string;
    /** 收藏品的类型 */
    type: 'Card' | 'Jersey' | 'Shoe' | 'Trophy' | 'Ball' | 'Ring' | 'Memorabilia';
    /** 收藏品的主题年份或赛季 */
    year: number;
}

/**
 * 收藏品数据库，包含80种不同的收藏品
 */
export const CollectibleDatabase: Collectible[] = [
    {
            "id": 1,
            "name": "乔丹1984新秀卡",
            "rarity": "Legendary",
            "description": "篮球之神迈克尔·乔丹1984年的新秀赛季球星卡，被认为是收藏界的圣杯。",
            "type": "Card",
            "year": 1984
    },
    {
            "id": 2,
            "name": "科比2000年总冠军戒指",
            "rarity": "Legendary",
            "description": "科比·布莱恩特随湖人队获得的2000年总冠军戒指复制品，开启了三连冠王朝。",
            "type": "Ring",
            "year": 2000
    },
    {
            "id": 3,
            "name": "詹姆斯2016总决赛战靴",
            "rarity": "Epic",
            "description": "勒布朗·詹姆斯在2016年总决赛G7中穿着的战靴，完成了1-3落后的惊天逆转。",
            "type": "Shoe",
            "year": 2016
    },
    {
            "id": 4,
            "name": "奥尼尔签名魔术队球衣",
            "rarity": "Rare",
            "description": "沙奎尔·奥尼尔在魔术队时期的签名球衣，见证了这位内线巨兽的崛起。",
            "type": "Jersey",
            "year": 1995
    },
    {
            "id": 5,
            "name": "拉里·伯德三连MVP奖杯",
            "rarity": "Legendary",
            "description": "波士顿凯尔特人传奇拉里·伯德连续三年获得常规赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 1986
    },
    {
            "id": 6,
            "name": "魔术师约翰逊助攻王纪念球",
            "rarity": "Epic",
            "description": "“魔术师”约翰逊获得赛季助攻王的纪念用球，充满了Showtime的华丽风格。",
            "type": "Ball",
            "year": 1987
    },
    {
            "id": 7,
            "name": "邓肯新秀赛季球星卡",
            "rarity": "Rare",
            "description": "蒂姆·邓肯1997年的新秀卡，标志着马刺队20年稳定的开始。",
            "type": "Card",
            "year": 1997
    },
    {
            "id": 8,
            "name": "库里首个三分纪录之夜票根",
            "rarity": "Uncommon",
            "description": "斯蒂芬·库里打破单赛季三分球纪录比赛的入场票根。",
            "type": "Memorabilia",
            "year": 2013
    },
    {
            "id": 9,
            "name": "姚明火箭队首发战袍",
            "rarity": "Epic",
            "description": "中国巨人姚明在休斯顿火箭队的首发赛季穿着的球衣。",
            "type": "Jersey",
            "year": 2002
    },
    {
            "id": 10,
            "name": "艾弗森“答案”签名球鞋",
            "rarity": "Rare",
            "description": "阿伦·艾弗森标志性的Reebok Question系列签名球鞋。",
            "type": "Shoe",
            "year": 2001
    },
    {
            "id": 11,
            "name": "1992年梦之队纪念金币",
            "rarity": "Legendary",
            "description": "纪念1992年巴塞罗那奥运会“梦之队”的限量版金币。",
            "type": "Memorabilia",
            "year": 1992
    },
    {
            "id": 12,
            "name": "杜兰特雷霆时期MVP奖杯模型",
            "rarity": "Epic",
            "description": "凯文·杜兰特在俄克拉荷马城雷霆队获得常规赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 2014
    },
    {
            "id": 13,
            "name": "哈登“大胡子”签名篮球",
            "rarity": "Rare",
            "description": "詹姆斯·哈登亲笔签名的官方比赛用球。",
            "type": "Ball",
            "year": 2018
    },
    {
            "id": 14,
            "name": "韦德热火队三连冠纪念卡",
            "rarity": "Uncommon",
            "description": "德维恩·韦德在热火队三巨头时期的纪念球星卡。",
            "type": "Card",
            "year": 2013
    },
    {
            "id": 15,
            "name": "诺维茨基2011总冠军戒指",
            "rarity": "Legendary",
            "description": "德克·诺维茨基带领小牛队夺得2011年总冠军的戒指复制品。",
            "type": "Ring",
            "year": 2011
    },
    {
            "id": 16,
            "name": "威少三双赛季签名球衣",
            "rarity": "Rare",
            "description": "拉塞尔·威斯布鲁克创造赛季场均三双纪录时的签名球衣。",
            "type": "Jersey",
            "year": 2017
    },
    {
            "id": 17,
            "name": "“手套”佩顿防守战靴",
            "rarity": "Uncommon",
            "description": "加里·佩顿在超音速队时期的防守型签名球鞋。",
            "type": "Shoe",
            "year": 1996
    },
    {
            "id": 18,
            "name": "马刺GDP组合纪念照片",
            "rarity": "Common",
            "description": "马刺队“GDP”组合（吉诺比利、邓肯、帕克）的经典合影。",
            "type": "Memorabilia",
            "year": 2007
    },
    {
            "id": 19,
            "name": "字母哥雄鹿队MVP赛季卡",
            "rarity": "Epic",
            "description": "扬尼斯·阿德托昆博获得常规赛MVP赛季的球星卡。",
            "type": "Card",
            "year": 2020
    },
    {
            "id": 20,
            "name": "1980年代湖人队Showtime纪念球",
            "rarity": "Rare",
            "description": "洛杉矶湖人队Showtime时代使用的官方比赛用球。",
            "type": "Ball",
            "year": 1985
    },
    {
            "id": 21,
            "name": "皮蓬公牛队二当家球衣",
            "rarity": "Rare",
            "description": "斯科蒂·皮蓬在芝加哥公牛队第二个三连冠时期的签名球衣。",
            "type": "Jersey",
            "year": 1997
    },
    {
            "id": 22,
            "name": "麦迪35秒13分纪念票根",
            "rarity": "Epic",
            "description": "特雷西·麦克格雷迪创造35秒13分奇迹比赛的入场票根。",
            "type": "Memorabilia",
            "year": 2004
    },
    {
            "id": 23,
            "name": "卡特猛龙队扣篮大赛战靴",
            "rarity": "Legendary",
            "description": "文斯·卡特在2000年扣篮大赛中穿着的球鞋，完成了惊世骇俗的表演。",
            "type": "Shoe",
            "year": 2000
    },
    {
            "id": 24,
            "name": "艾尔文·海耶斯子弹队纪念卡",
            "rarity": "Uncommon",
            "description": "华盛顿子弹队传奇球星艾尔文·海耶斯的复古球星卡。",
            "type": "Card",
            "year": 1978
    },
    {
            "id": 25,
            "name": "比尔·拉塞尔11冠戒指套装",
            "rarity": "Legendary",
            "description": "纪念比尔·拉塞尔11次总冠军的微缩戒指套装。",
            "type": "Ring",
            "year": 1969
    },
    {
            "id": 26,
            "name": "张伯伦100分比赛纪念球",
            "rarity": "Legendary",
            "description": "纪念维尔特·张伯伦单场100分比赛的特别定制篮球。",
            "type": "Ball",
            "year": 1962
    },
    {
            "id": 27,
            "name": "乔治·格文“冰人”签名球衣",
            "rarity": "Rare",
            "description": "马刺队传奇“冰人”乔治·格文的复古签名球衣。",
            "type": "Jersey",
            "year": 1980
    },
    {
            "id": 28,
            "name": "纳什太阳队MVP奖杯模型",
            "rarity": "Epic",
            "description": "史蒂夫·纳什连续两年获得常规赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 2006
    },
    {
            "id": 29,
            "name": "雷·阿伦绝杀三分战靴",
            "rarity": "Rare",
            "description": "雷·阿伦在2013年总决赛G6投中关键三分时穿着的球鞋。",
            "type": "Shoe",
            "year": 2013
    },
    {
            "id": 30,
            "name": "德雷克斯勒开拓者新秀卡",
            "rarity": "Uncommon",
            "description": "“滑翔机”克莱德·德雷克斯勒1983年的新秀球星卡。",
            "type": "Card",
            "year": 1983
    },
    {
            "id": 31,
            "name": "巴克利太阳队MVP球衣",
            "rarity": "Epic",
            "description": "查尔斯·巴克利在菲尼克斯太阳队获得MVP赛季的签名球衣。",
            "type": "Jersey",
            "year": 1993
    },
    {
            "id": 32,
            "name": "加内特森林狼时期签名篮球",
            "rarity": "Rare",
            "description": "凯文·加内特在明尼苏达森林狼队时期的亲笔签名篮球。",
            "type": "Ball",
            "year": 2004
    },
    {
            "id": 33,
            "name": "基德篮网队总决赛纪念卡",
            "rarity": "Uncommon",
            "description": "贾森·基德带领新泽西篮网队进入总决赛的纪念球星卡。",
            "type": "Card",
            "year": 2003
    },
    {
            "id": 34,
            "name": "霍华德魔术队扣篮王奖杯模型",
            "rarity": "Rare",
            "description": "德怀特·霍华德获得全明星扣篮大赛冠军的奖杯模型。",
            "type": "Trophy",
            "year": 2008
    },
    {
            "id": 35,
            "name": "韦斯特标志性剪影纪念品",
            "rarity": "Legendary",
            "description": "以NBA标志原型杰里·韦斯特为主题的限量版纪念品。",
            "type": "Memorabilia",
            "year": 1970
    },
    {
            "id": 36,
            "name": "尤因尼克斯队签名球鞋",
            "rarity": "Uncommon",
            "description": "帕特里克·尤因在纽约尼克斯队时期的签名球鞋。",
            "type": "Shoe",
            "year": 1994
    },
    {
            "id": 37,
            "name": "伊戈达拉FMVP奖杯模型",
            "rarity": "Epic",
            "description": "安德烈·伊戈达拉获得2015年总决赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 2015
    },
    {
            "id": 38,
            "name": "凯尔特人三巨头总冠军戒指",
            "rarity": "Rare",
            "description": "纪念波士顿凯尔特人队2008年总冠军的戒指复制品。",
            "type": "Ring",
            "year": 2008
    },
    {
            "id": 39,
            "name": "安东尼·戴维斯大学时期球衣",
            "rarity": "Uncommon",
            "description": "安东尼·戴维斯在肯塔基大学夺得NCAA冠军时的球衣。",
            "type": "Jersey",
            "year": 2012
    },
    {
            "id": 40,
            "name": "东契奇独行侠新秀卡",
            "rarity": "Rare",
            "description": "卢卡·东契奇2018年的新秀球星卡，未来之星。",
            "type": "Card",
            "year": 2018
    },
    {
            "id": 41,
            "name": "哈基姆·奥拉朱旺“梦幻脚步”签名球",
            "rarity": "Legendary",
            "description": "哈基姆·奥拉朱旺亲笔签名的官方比赛用球，代表着他无解的内线技术。",
            "type": "Ball",
            "year": 1994
    },
    {
            "id": 42,
            "name": "米切尔爵士队签名球鞋",
            "rarity": "Uncommon",
            "description": "多诺万·米切尔在犹他爵士队时期的签名球鞋。",
            "type": "Shoe",
            "year": 2021
    },
    {
            "id": 43,
            "name": "皮尔斯凯尔特人队总决赛MVP卡",
            "rarity": "Rare",
            "description": "保罗·皮尔斯获得2008年总决赛MVP的纪念球星卡。",
            "type": "Card",
            "year": 2008
    },
    {
            "id": 44,
            "name": "加索尔湖人队总冠军纪念品",
            "rarity": "Common",
            "description": "保罗·加索尔在湖人队获得总冠军的纪念钥匙扣。",
            "type": "Memorabilia",
            "year": 2010
    },
    {
            "id": 45,
            "name": "凯里·欧文骑士队绝杀战靴",
            "rarity": "Epic",
            "description": "凯里·欧文在2016年总决赛G7投中致胜三分时穿着的球鞋。",
            "type": "Shoe",
            "year": 2016
    },
    {
            "id": 46,
            "name": "雷霆三少时期纪念球衣",
            "rarity": "Rare",
            "description": "纪念杜兰特、威斯布鲁克和哈登在雷霆队时期的复古球衣。",
            "type": "Jersey",
            "year": 2011
    },
    {
            "id": 47,
            "name": "鲍勃·库西凯尔特人复古卡",
            "rarity": "Uncommon",
            "description": "波士顿凯尔特人队早期传奇鲍勃·库西的复古球星卡。",
            "type": "Card",
            "year": 1957
    },
    {
            "id": 48,
            "name": "1998年总决赛第六场票根",
            "rarity": "Legendary",
            "description": "迈克尔·乔丹“最后一投”比赛的入场票根，历史性的时刻。",
            "type": "Memorabilia",
            "year": 1998
    },
    {
            "id": 49,
            "name": "莫兰特灰熊队新秀赛季纪念球",
            "rarity": "Common",
            "description": "贾·莫兰特在孟菲斯灰熊队新秀赛季的纪念篮球。",
            "type": "Ball",
            "year": 2020
    },
    {
            "id": 50,
            "name": "本·西蒙斯76人队新秀卡",
            "rarity": "Uncommon",
            "description": "本·西蒙斯在费城76人队的新秀球星卡。",
            "type": "Card",
            "year": 2017
    },
    {
            "id": 51,
            "name": "伦纳德猛龙队总冠军戒指",
            "rarity": "Epic",
            "description": "科怀·伦纳德带领多伦多猛龙队夺得2019年总冠军的戒指复制品。",
            "type": "Ring",
            "year": 2019
    },
    {
            "id": 52,
            "name": "安东尼尼克斯队得分王球衣",
            "rarity": "Rare",
            "description": "卡梅隆·安东尼获得赛季得分王时的纽约尼克斯队签名球衣。",
            "type": "Jersey",
            "year": 2013
    },
    {
            "id": 53,
            "name": "克莱·汤普森单节37分纪念品",
            "rarity": "Epic",
            "description": "纪念克莱·汤普森单节砍下37分纪录的特别版纪念品。",
            "type": "Memorabilia",
            "year": 2015
    },
    {
            "id": 54,
            "name": "比尔·沃顿开拓者队MVP奖杯模型",
            "rarity": "Rare",
            "description": "比尔·沃顿在波特兰开拓者队获得常规赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 1978
    },
    {
            "id": 55,
            "name": "哈弗里切克凯尔特人复古球鞋",
            "rarity": "Uncommon",
            "description": "约翰·哈弗里切克在波士顿凯尔特人队时期的复古球鞋。",
            "type": "Shoe",
            "year": 1974
    },
    {
            "id": 56,
            "name": "掘金队“彩虹”复古球衣",
            "rarity": "Common",
            "description": "丹佛掘金队经典的“彩虹”配色复古球衣。",
            "type": "Jersey",
            "year": 1985
    },
    {
            "id": 57,
            "name": "约基奇掘金队MVP赛季卡",
            "rarity": "Epic",
            "description": "尼古拉·约基奇获得常规赛MVP赛季的球星卡。",
            "type": "Card",
            "year": 2021
    },
    {
            "id": 58,
            "name": "韦斯·昂塞尔德子弹队新秀卡",
            "rarity": "Uncommon",
            "description": "韦斯·昂塞尔德在巴尔的摩子弹队获得MVP的新秀球星卡。",
            "type": "Card",
            "year": 1969
    },
    {
            "id": 59,
            "name": "1972年湖人队33连胜纪念球",
            "rarity": "Legendary",
            "description": "纪念洛杉矶湖人队创纪录的33连胜时使用的官方比赛用球。",
            "type": "Ball",
            "year": 1972
    },
    {
            "id": 60,
            "name": "罗德曼活塞队“坏孩子军团”球衣",
            "rarity": "Rare",
            "description": "丹尼斯·罗德曼在底特律活塞队“坏孩子军团”时期的签名球衣。",
            "type": "Jersey",
            "year": 1989
    },
    {
            "id": 61,
            "name": "米勒时刻纪念票根",
            "rarity": "Epic",
            "description": "纪念雷吉·米勒在9秒内得到8分的“米勒时刻”比赛票根。",
            "type": "Memorabilia",
            "year": 1995
    },
    {
            "id": 62,
            "name": "比尔·沙曼凯尔特人队复古球",
            "rarity": "Common",
            "description": "波士顿凯尔特人队传奇比尔·沙曼在50年代使用的比赛用球。",
            "type": "Ball",
            "year": 1955
    },
    {
            "id": 63,
            "name": "德怀恩·韦德新秀卡",
            "rarity": "Uncommon",
            "description": "德怀恩·韦德2003年的新秀球星卡。",
            "type": "Card",
            "year": 2003
    },
    {
            "id": 64,
            "name": "霍里“大心脏”总冠军戒指",
            "rarity": "Rare",
            "description": "纪念罗伯特·霍里多次关键投篮夺冠的微缩戒指模型。",
            "type": "Ring",
            "year": 2005
    },
    {
            "id": 65,
            "name": "穆托姆博“摇手指”签名球鞋",
            "rarity": "Uncommon",
            "description": "迪肯贝·穆托姆博标志性“摇手指”动作的签名球鞋。",
            "type": "Shoe",
            "year": 1998
    },
    {
            "id": 66,
            "name": "麦克海尔凯尔特人队复古球衣",
            "rarity": "Common",
            "description": "凯文·麦克海尔在波士顿凯尔特人队时期的复古球衣。",
            "type": "Jersey",
            "year": 1984
    },
    {
            "id": 67,
            "name": "大卫·罗宾逊马刺队MVP奖杯模型",
            "rarity": "Epic",
            "description": "“海军上将”大卫·罗宾逊获得常规赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 1995
    },
    {
            "id": 68,
            "name": "格兰特·希尔活塞队新秀卡",
            "rarity": "Rare",
            "description": "格兰特·希尔1994年的新秀球星卡。",
            "type": "Card",
            "year": 1994
    },
    {
            "id": 69,
            "name": "雷霆队总决赛纪念球",
            "rarity": "Uncommon",
            "description": "俄克拉荷马城雷霆队2012年进入总决赛的纪念篮球。",
            "type": "Ball",
            "year": 2012
    },
    {
            "id": 70,
            "name": "阿德托昆博总决赛FMVP奖杯模型",
            "rarity": "Legendary",
            "description": "扬尼斯·阿德托昆博获得2021年总决赛MVP的奖杯模型。",
            "type": "Trophy",
            "year": 2021
    },
    {
            "id": 71,
            "name": "艾尔顿·布兰德快船队球衣",
            "rarity": "Common",
            "description": "埃尔顿·布兰德在洛杉矶快船队时期的签名球衣。",
            "type": "Jersey",
            "year": 2006
    },
    {
            "id": 72,
            "name": "德隆·威廉姆斯爵士队新秀卡",
            "rarity": "Common",
            "description": "德隆·威廉姆斯2005年的新秀球星卡。",
            "type": "Card",
            "year": 2005
    },
    {
            "id": 73,
            "name": "保罗·乔治步行者队签名球鞋",
            "rarity": "Rare",
            "description": "保罗·乔治在印第安纳步行者队时期的签名球鞋。",
            "type": "Shoe",
            "year": 2014
    },
    {
            "id": 74,
            "name": "1986年凯尔特人总冠军纪念品",
            "rarity": "Epic",
            "description": "纪念1986年拉里·伯德带领的凯尔特人队夺冠的限量版纪念品。",
            "type": "Memorabilia",
            "year": 1986
    },
    {
            "id": 75,
            "name": "阿伦·休斯顿尼克斯队球衣",
            "rarity": "Uncommon",
            "description": "阿伦·休斯顿在纽约尼克斯队时期的球衣。",
            "type": "Jersey",
            "year": 1999
    },
    {
            "id": 76,
            "name": "斯托克顿爵士队助攻抢断王纪念球",
            "rarity": "Rare",
            "description": "约翰·斯托克顿获得赛季助攻王和抢断王的纪念用球。",
            "type": "Ball",
            "year": 1992
    },
    {
            "id": 77,
            "name": "本·华莱士活塞队最佳防守球员奖杯模型",
            "rarity": "Uncommon",
            "description": "本·华莱士获得年度最佳防守球员奖的奖杯模型。",
            "type": "Trophy",
            "year": 2004
    },
    {
            "id": 78,
            "name": "鲍勃·佩蒂特老鹰队复古卡",
            "rarity": "Rare",
            "description": "圣路易斯老鹰队传奇鲍勃·佩蒂特的复古球星卡。",
            "type": "Card",
            "year": 1958
    },
    {
            "id": 79,
            "name": "2020年湖人队泡泡园区总冠军戒指",
            "rarity": "Epic",
            "description": "纪念洛杉矶湖人队在2020年奥兰多“泡泡”园区夺得总冠军的戒指复制品。",
            "type": "Ring",
            "year": 2020
    },
    {
            "id": 80,
            "name": "文斯·卡特猛龙队签名球衣",
            "rarity": "Legendary",
            "description": "“UFO”文斯·卡特在多伦多猛龙队时期的签名球衣，代表着他的巅峰时期。",
            "type": "Jersey",
            "year": 2000
    }
];

// 导出数据库
export default CollectibleDatabase;