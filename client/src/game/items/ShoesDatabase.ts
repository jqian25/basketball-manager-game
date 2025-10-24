/**
 * 篮球装备库 - 篮球鞋物品数据库
 * 文件: client/src/game/items/ShoesDatabase.ts
 * 包含100种篮球鞋数据
 */

// 稀有度枚举
export enum Rarity {
    COMMON = "普通",
    UNCOMMON = "不常见",
    RARE = "稀有",
    EPIC = "史诗",
    LEGENDARY = "传奇",
}

// 属性接口
export interface Attributes {
    speed: number;       // 速度/敏捷
    jump: number;        // 弹跳力
    stability: number;   // 稳定性/支撑性
    durability: number;  // 耐久度
    grip: number;        // 抓地力
}

// 物品数据结构接口
export interface ShoeItem {
    id: string;
    name: string;
    description: string;
    brand: 'Nike' | 'Adidas' | 'Jordan' | 'Under Armour' | 'Puma';
    price: number;
    rarity: Rarity;
    attributes: Attributes;
}

// 篮球鞋物品数据库
export const ShoesDatabase: ShoeItem[] = [
    // ---------------------- Nike 系列 (25 items) ----------------------
    {
        id: "NIKE_001",
        name: "Nike Air Zoom Hyperflight 'Phoenix'",
        description: "轻量化速度型战靴，为突破手设计，提供极致的贴地感和响应速度。",
        brand: 'Nike',
        price: 1399,
        rarity: Rarity.RARE,
        attributes: { speed: 95, jump: 80, stability: 70, durability: 75, grip: 85 }
    },
    {
        id: "NIKE_002",
        name: "Nike LeBron 20 'The Debut'",
        description: "詹姆斯第20代签名鞋，兼具轻盈与力量，适合全能型球员。",
        brand: 'Nike',
        price: 1699,
        rarity: Rarity.EPIC,
        attributes: { speed: 85, jump: 88, stability: 92, durability: 90, grip: 88 }
    },
    {
        id: "NIKE_003",
        name: "Nike KD 15 'Aunt Pearl'",
        description: "杜兰特系列，中低帮设计，提供出色的缓震和场地感，纪念意义非凡。",
        brand: 'Nike',
        price: 1299,
        rarity: Rarity.RARE,
        attributes: { speed: 88, jump: 85, stability: 80, durability: 82, grip: 90 }
    },
    {
        id: "NIKE_004",
        name: "Nike Kyrie Low 5 'Bred'",
        description: "欧文低帮系列，以其快速变向和灵活著称，抓地力极强。",
        brand: 'Nike',
        price: 899,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 92, jump: 82, stability: 75, durability: 78, grip: 95 }
    },
    {
        id: "NIKE_005",
        name: "Nike PG 6 'Mismatched'",
        description: "保罗·乔治的第六代战靴，注重舒适性和全场表现。",
        brand: 'Nike',
        price: 999,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 80, jump: 80, stability: 85, durability: 85, grip: 85 }
    },
    {
        id: "NIKE_006",
        name: "Nike Kobe 6 Protro 'Grinch'",
        description: "科比经典复刻，超高人气配色，轻质、低帮、极致的场地感。",
        brand: 'Nike',
        price: 2499,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 98, jump: 90, stability: 70, durability: 70, grip: 98 }
    },
    {
        id: "NIKE_007",
        name: "Nike Air Jordan 37 'Light Bone'",
        description: "Jordan正代系列，融合了最新的缓震技术和经典设计元素。",
        brand: 'Jordan',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 85, jump: 95, stability: 88, durability: 85, grip: 85 }
    },
    {
        id: "NIKE_008",
        name: "Nike Giannis Immortality 2",
        description: "字母哥支线系列，性价比高，适合日常训练和实战。",
        brand: 'Nike',
        price: 699,
        rarity: Rarity.COMMON,
        attributes: { speed: 75, jump: 78, stability: 80, durability: 85, grip: 75 }
    },
    {
        id: "NIKE_009",
        name: "Nike Air Deldon 'Light Smoke Grey'",
        description: "WNBA球星埃琳娜·多恩的签名鞋，注重支撑和包裹。",
        brand: 'Nike',
        price: 849,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 78, jump: 75, stability: 90, durability: 88, grip: 80 }
    },
    {
        id: "NIKE_010",
        name: "Nike Air Foamposite One 'Penny'",
        description: "经典“喷”系列，独特的发泡鞋面提供无与伦比的保护和造型。",
        brand: 'Nike',
        price: 1799,
        rarity: Rarity.EPIC,
        attributes: { speed: 70, jump: 70, stability: 98, durability: 99, grip: 80 }
    },
    {
        id: "NIKE_011",
        name: "Nike Zoom Freak 4 'Equality'",
        description: "字母哥第四代，强调前掌反馈和横向支撑。",
        brand: 'Nike',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 85, jump: 88, stability: 85, durability: 80, grip: 88 }
    },
    {
        id: "NIKE_012",
        name: "Nike Air Max Impact 4",
        description: "搭载Max Air缓震，提供强力冲击保护，适合内线球员。",
        brand: 'Nike',
        price: 749,
        rarity: Rarity.COMMON,
        attributes: { speed: 70, jump: 85, stability: 88, durability: 90, grip: 70 }
    },
    {
        id: "NIKE_013",
        name: "Nike Air Zoom G.T. Cut 2 'Sabrina'",
        description: "G.T.系列顶级速度型，为变向和急停跳投提供极致优化。",
        brand: 'Nike',
        price: 1599,
        rarity: Rarity.EPIC,
        attributes: { speed: 96, jump: 85, stability: 80, durability: 75, grip: 92 }
    },
    {
        id: "NIKE_014",
        name: "Nike Renew Elevate 3",
        description: "入门级实战鞋，注重缓震和舒适度，适合新手。",
        brand: 'Nike',
        price: 599,
        rarity: Rarity.COMMON,
        attributes: { speed: 70, jump: 70, stability: 75, durability: 80, grip: 70 }
    },
    {
        id: "NIKE_015",
        name: "Nike Air Jordan 1 Retro High OG 'Lost & Found'",
        description: "经典AJ1复刻，收藏价值极高，实战性能一般。",
        brand: 'Jordan',
        price: 1999,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 65, jump: 60, stability: 65, durability: 95, grip: 60 }
    },
    {
        id: "NIKE_016",
        name: "Nike Cosmic Unity 2 'Black/White'",
        description: "环保理念战靴，轻质且注重能量反馈。",
        brand: 'Nike',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 82, jump: 85, stability: 85, durability: 78, grip: 85 }
    },
    {
        id: "NIKE_017",
        name: "Nike Air Jordan 36 Low 'Luka'",
        description: "AJ36低帮版本，为东契奇的全面身手提供支持。",
        brand: 'Jordan',
        price: 1399,
        rarity: Rarity.RARE,
        attributes: { speed: 90, jump: 90, stability: 85, durability: 80, grip: 90 }
    },
    {
        id: "NIKE_018",
        name: "Nike Air Force 1 Mid '07 LV8",
        description: "街头篮球经典，耐用性极佳，实战性能中等。",
        brand: 'Nike',
        price: 799,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 70, jump: 65, stability: 85, durability: 95, grip: 70 }
    },
    {
        id: "NIKE_019",
        name: "Nike Air Zoom BB NXT 'Blueprint'",
        description: "为现代篮球设计的全能鞋款，注重能量回馈和缓震。",
        brand: 'Nike',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 88, jump: 92, stability: 85, durability: 85, grip: 88 }
    },
    {
        id: "NIKE_020",
        name: "Nike Precision 6",
        description: "基础款训练鞋，轻便灵活，适合轻量级训练。",
        brand: 'Nike',
        price: 499,
        rarity: Rarity.COMMON,
        attributes: { speed: 75, jump: 70, stability: 70, durability: 75, grip: 70 }
    },
    {
        id: "NIKE_021",
        name: "Nike Air Jordan 4 Retro 'Military Black'",
        description: "AJ4经典配色，收藏为主，实战需谨慎。",
        brand: 'Jordan',
        price: 1899,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 60, jump: 55, stability: 70, durability: 90, grip: 55 }
    },
    {
        id: "NIKE_022",
        name: "Nike Air Zoom Crossover 2",
        description: "专为女性球员设计，提供更贴合的脚感和灵活度。",
        brand: 'Nike',
        price: 799,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 85, jump: 78, stability: 75, durability: 75, grip: 85 }
    },
    {
        id: "NIKE_023",
        name: "Nike Ja 1 'Day One'",
        description: "莫兰特首代签名鞋，强调爆发力和变向时的稳定性。",
        brand: 'Nike',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 93, jump: 87, stability: 80, durability: 78, grip: 90 }
    },
    {
        id: "NIKE_024",
        name: "Nike Air Jordan 38 'Fundamental'",
        description: "AJ正代最新款，极致轻量化和场地感，为现代篮球而生。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.EPIC,
        attributes: { speed: 90, jump: 95, stability: 85, durability: 80, grip: 90 }
    },
    {
        id: "NIKE_025",
        name: "Nike Air Max Penny 1 'Orlando'",
        description: "哈达威的经典战靴，复古风格，厚重但缓震出色。",
        brand: 'Nike',
        price: 1399,
        rarity: Rarity.RARE,
        attributes: { speed: 70, jump: 80, stability: 95, durability: 90, grip: 75 }
    },

    // ---------------------- Adidas 系列 (25 items) ----------------------
    {
        id: "ADIDAS_026",
        name: "Adidas Harden Vol. 7 'Better Scarlet'",
        description: "哈登第七代签名鞋，独特的造型和Boost缓震，适合后撤步。",
        brand: 'Adidas',
        price: 1299,
        rarity: Rarity.RARE,
        attributes: { speed: 85, jump: 80, stability: 90, durability: 85, grip: 88 }
    },
    {
        id: "ADIDAS_027",
        name: "Adidas Dame 8 'Dame Time'",
        description: "利拉德系列，注重轻便和快速启动，中底缓震均衡。",
        brand: 'Adidas',
        price: 999,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 90, jump: 85, stability: 80, durability: 80, grip: 90 }
    },
    {
        id: "ADIDAS_028",
        name: "Adidas Trae Young 2.0 'Ice Trae'",
        description: "特雷·杨签名鞋，强调极致的灵活和变向能力。",
        brand: 'Adidas',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 95, jump: 82, stability: 75, durability: 75, grip: 95 }
    },
    {
        id: "ADIDAS_029",
        name: "Adidas D Rose Son of Chi 2.0",
        description: "罗斯支线系列，继承了速度基因，适合快速进攻。",
        brand: 'Adidas',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 88, jump: 80, stability: 78, durability: 80, grip: 85 }
    },
    {
        id: "ADIDAS_030",
        name: "Adidas Exhibit A Mid",
        description: "全能型团队鞋，Lightstrike缓震，提供轻量支撑。",
        brand: 'Adidas',
        price: 899,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 80, jump: 80, stability: 85, durability: 85, grip: 80 }
    },
    {
        id: "ADIDAS_031",
        name: "Adidas Crazy 1 'Sunshine'",
        description: "科比早期经典战靴复刻，造型独特，包裹性强。",
        brand: 'Adidas',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 75, jump: 70, stability: 92, durability: 90, grip: 70 }
    },
    {
        id: "ADIDAS_032",
        name: "Adidas T-Mac 3 'All-Star'",
        description: "麦迪经典系列，全明星配色，适合中距离跳投。",
        brand: 'Adidas',
        price: 1399,
        rarity: Rarity.EPIC,
        attributes: { speed: 78, jump: 85, stability: 85, durability: 88, grip: 80 }
    },
    {
        id: "ADIDAS_033",
        name: "Adidas Pro Model 2G Low",
        description: "经典贝壳头低帮实战鞋，耐用且性价比高。",
        brand: 'Adidas',
        price: 699,
        rarity: Rarity.COMMON,
        attributes: { speed: 70, jump: 70, stability: 80, durability: 90, grip: 75 }
    },
    {
        id: "ADIDAS_034",
        name: "Adidas D.O.N. Issue #4 'Jazz'",
        description: "米切尔系列，轻量化设计，注重爆发力。",
        brand: 'Adidas',
        price: 949,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 92, jump: 85, stability: 78, durability: 78, grip: 88 }
    },
    {
        id: "ADIDAS_035",
        name: "Adidas Adizero Select 2.0",
        description: "极致轻量化鞋款，追求速度的终极选择。",
        brand: 'Adidas',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 98, jump: 85, stability: 70, durability: 70, grip: 90 }
    },
    {
        id: "ADIDAS_036",
        name: "Adidas Crazy Explosive 2017 PK",
        description: "Primeknit鞋面，Boost缓震，提供顶级舒适和能量反馈。",
        brand: 'Adidas',
        price: 1599,
        rarity: Rarity.EPIC,
        attributes: { speed: 85, jump: 95, stability: 85, durability: 80, grip: 85 }
    },
    {
        id: "ADIDAS_037",
        name: "Adidas Next Level Futurenatural",
        description: "无鞋带设计，一体化鞋面，提供独特的包裹感。",
        brand: 'Adidas',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 82, jump: 80, stability: 90, durability: 82, grip: 85 }
    },
    {
        id: "ADIDAS_038",
        name: "Adidas Top Ten 2000 'Lakers'",
        description: "复古经典，科比早期穿着，适合休闲和轻量实战。",
        brand: 'Adidas',
        price: 899,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 70, jump: 65, stability: 80, durability: 88, grip: 70 }
    },
    {
        id: "ADIDAS_039",
        name: "Adidas Forum Mid 'Triple White'",
        description: "街头潮流鞋款，篮球基因，耐穿性高。",
        brand: 'Adidas',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 65, jump: 60, stability: 85, durability: 95, grip: 65 }
    },
    {
        id: "ADIDAS_040",
        name: "Adidas Marquee Boost Low",
        description: "团队实战佳选，全掌Boost缓震，性价比高。",
        brand: 'Adidas',
        price: 999,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 80, jump: 85, stability: 82, durability: 85, grip: 80 }
    },
    {
        id: "ADIDAS_041",
        name: "Adidas Harden Stepback 3",
        description: "哈登支线，注重性价比和日常穿着。",
        brand: 'Adidas',
        price: 649,
        rarity: Rarity.COMMON,
        attributes: { speed: 75, jump: 75, stability: 78, durability: 82, grip: 78 }
    },
    {
        id: "ADIDAS_042",
        name: "Adidas Dame Certified",
        description: "利拉德的实战支线，提供可靠的性能。",
        brand: 'Adidas',
        price: 749,
        rarity: Rarity.COMMON,
        attributes: { speed: 82, jump: 78, stability: 80, durability: 80, grip: 85 }
    },
    {
        id: "ADIDAS_043",
        name: "Adidas Crazy BYW X 2.0",
        description: "Boost You Wear系列，复古与科技的结合，脚感出色。",
        brand: 'Adidas',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 88, jump: 90, stability: 80, durability: 85, grip: 88 }
    },
    {
        id: "ADIDAS_044",
        name: "Adidas Streetball 2.0",
        description: "户外篮球鞋，耐磨性强，造型粗犷。",
        brand: 'Adidas',
        price: 849,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 70, jump: 75, stability: 90, durability: 98, grip: 75 }
    },
    {
        id: "ADIDAS_045",
        name: "Adidas D Rose 1.5 'Forbidden City'",
        description: "罗斯经典战靴复刻，中国新年配色，收藏价值高。",
        brand: 'Adidas',
        price: 1599,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 90, jump: 85, stability: 85, durability: 82, grip: 92 }
    },
    {
        id: "ADIDAS_046",
        name: "Adidas Agent Gil Restomod",
        description: "阿里纳斯签名鞋复刻，注重稳定和力量。",
        brand: 'Adidas',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 80, jump: 80, stability: 90, durability: 85, grip: 80 }
    },
    {
        id: "ADIDAS_047",
        name: "Adidas Basketball 2023 'Exhibit B'",
        description: "阿迪达斯新一代团队鞋，轻量化和高性价比。",
        brand: 'Adidas',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 85, jump: 80, stability: 80, durability: 80, grip: 85 }
    },
    {
        id: "ADIDAS_048",
        name: "Adidas Trae Young 3 'Cactus Flower'",
        description: "特雷·杨第三代，更轻更灵活，为快速变向优化。",
        brand: 'Adidas',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 96, jump: 85, stability: 75, durability: 75, grip: 95 }
    },
    {
        id: "ADIDAS_049",
        name: "Adidas Harden Vol. 6 'Pulse Aqua'",
        description: "哈登第六代，全掌Boost，缓震和保护性出色。",
        brand: 'Adidas',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 82, jump: 88, stability: 90, durability: 85, grip: 88 }
    },
    {
        id: "ADIDAS_050",
        name: "Adidas Crazy Light Boost 2018",
        description: "曾经的极致轻量化代表，Boost缓震，速度型后卫最爱。",
        brand: 'Adidas',
        price: 1299,
        rarity: Rarity.EPIC,
        attributes: { speed: 95, jump: 88, stability: 75, durability: 75, grip: 90 }
    },

    // ---------------------- Jordan 系列 (25 items) ----------------------
    {
        id: "JORDAN_051",
        name: "Jordan Luka 1 'Next Nature'",
        description: "东契奇首代签名鞋，Isoplate科技提供横向支撑。",
        brand: 'Jordan',
        price: 999,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 85, jump: 85, stability: 90, durability: 80, grip: 88 }
    },
    {
        id: "JORDAN_052",
        name: "Jordan Zion 2 'Hope Diamond'",
        description: "锡安第二代，注重力量和爆发力，缓震配置高。",
        brand: 'Jordan',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 80, jump: 95, stability: 92, durability: 88, grip: 85 }
    },
    {
        id: "JORDAN_053",
        name: "Jordan Why Not .6 'Phantom'",
        description: "威少第六代，极致的包裹和速度感，适合突破。",
        brand: 'Jordan',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 94, jump: 88, stability: 78, durability: 75, grip: 90 }
    },
    {
        id: "JORDAN_054",
        name: "Jordan Air Jordan 11 Retro 'Concord'",
        description: "AJ11经典中的经典，漆皮设计，收藏价值和情怀拉满。",
        brand: 'Jordan',
        price: 2199,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 60, jump: 65, stability: 75, durability: 95, grip: 65 }
    },
    {
        id: "JORDAN_055",
        name: "Jordan Air Jordan 5 Retro 'Fire Red'",
        description: "AJ5经典配色，中底鲨鱼齿设计，实战性能中等。",
        brand: 'Jordan',
        price: 1799,
        rarity: Rarity.EPIC,
        attributes: { speed: 68, jump: 70, stability: 80, durability: 90, grip: 70 }
    },
    {
        id: "JORDAN_056",
        name: "Jordan Air Jordan 3 Retro 'Black Cement'",
        description: "AJ3经典爆裂纹，收藏为主，不适合高强度实战。",
        brand: 'Jordan',
        price: 1699,
        rarity: Rarity.EPIC,
        attributes: { speed: 65, jump: 60, stability: 70, durability: 92, grip: 60 }
    },
    {
        id: "JORDAN_057",
        name: "Jordan Air Jordan 34 'Eclipse'",
        description: "AJ正代轻量化里程碑，Eclipse Plate科技。",
        brand: 'Jordan',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 92, jump: 95, stability: 80, durability: 75, grip: 90 }
    },
    {
        id: "JORDAN_058",
        name: "Jordan Air Jordan 35 'Center of Gravity'",
        description: "AJ35，缓震和支撑性进一步提升，全能型战靴。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.EPIC,
        attributes: { speed: 88, jump: 92, stability: 85, durability: 80, grip: 88 }
    },
    {
        id: "JORDAN_059",
        name: "Jordan Air Jordan 13 Retro 'He Got Game'",
        description: "AJ13经典配色，豹爪设计，脚感舒适。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.RARE,
        attributes: { speed: 75, jump: 78, stability: 88, durability: 85, grip: 80 }
    },
    {
        id: "JORDAN_060",
        name: "Jordan Air Jordan 12 Retro 'Flu Game'",
        description: "AJ12经典，耐用性极高，为MJ带病出战设计。",
        brand: 'Jordan',
        price: 1899,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 70, jump: 75, stability: 95, durability: 98, grip: 75 }
    },
    {
        id: "JORDAN_061",
        name: "Jordan Air Jordan 33 SE 'Black Cement'",
        description: "FastFit系带系统，科技感十足，包裹性强。",
        brand: 'Jordan',
        price: 1399,
        rarity: Rarity.RARE,
        attributes: { speed: 85, jump: 88, stability: 90, durability: 80, grip: 85 }
    },
    {
        id: "JORDAN_062",
        name: "Jordan Air Jordan 1 Low SE 'Panda'",
        description: "AJ1低帮，休闲为主，适合街头穿着。",
        brand: 'Jordan',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 60, jump: 55, stability: 65, durability: 90, grip: 55 }
    },
    {
        id: "JORDAN_063",
        name: "Jordan Air Jordan 6 Retro 'Infrared'",
        description: "AJ6经典配色，乔丹首冠战靴，实战性能一般。",
        brand: 'Jordan',
        price: 1799,
        rarity: Rarity.EPIC,
        attributes: { speed: 65, jump: 68, stability: 80, durability: 92, grip: 68 }
    },
    {
        id: "JORDAN_064",
        name: "Jordan Air Jordan 2 Retro 'Chicago'",
        description: "AJ2复刻，简约设计，收藏价值高。",
        brand: 'Jordan',
        price: 1499,
        rarity: Rarity.RARE,
        attributes: { speed: 60, jump: 60, stability: 75, durability: 90, grip: 60 }
    },
    {
        id: "JORDAN_065",
        name: "Jordan Air Jordan 14 Retro 'Last Shot'",
        description: "AJ14经典，乔丹最后一投战靴，跑车设计灵感。",
        brand: 'Jordan',
        price: 1699,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 75, jump: 70, stability: 85, durability: 95, grip: 75 }
    },
    {
        id: "JORDAN_066",
        name: "Jordan Air Jordan 37 Low 'Bred'",
        description: "AJ37低帮版本，更轻更快，适合后卫。",
        brand: 'Jordan',
        price: 1399,
        rarity: Rarity.RARE,
        attributes: { speed: 88, jump: 92, stability: 80, durability: 78, grip: 88 }
    },
    {
        id: "JORDAN_067",
        name: "Jordan Air Jordan 8 Retro 'Aqua'",
        description: "AJ8经典，独特的交叉绑带，包裹性极强。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.RARE,
        attributes: { speed: 70, jump: 75, stability: 95, durability: 85, grip: 70 }
    },
    {
        id: "JORDAN_068",
        name: "Jordan Air Jordan 32 Low 'Banned'",
        description: "AJ32低帮，FlightSpeed科技，缓震出色。",
        brand: 'Jordan',
        price: 1299,
        rarity: Rarity.RARE,
        attributes: { speed: 85, jump: 88, stability: 85, durability: 78, grip: 85 }
    },
    {
        id: "JORDAN_069",
        name: "Jordan Air Jordan 19 Retro 'SE'",
        description: "AJ19，独特的网状鞋面，提供透气和支撑。",
        brand: 'Jordan',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 78, jump: 82, stability: 90, durability: 85, grip: 80 }
    },
    {
        id: "JORDAN_070",
        name: "Jordan Air Jordan 23 'Titanium'",
        description: "AJ23，乔丹数字签名，设计复杂，收藏价值高。",
        brand: 'Jordan',
        price: 2099,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 70, jump: 75, stability: 90, durability: 90, grip: 75 }
    },
    {
        id: "JORDAN_071",
        name: "Jordan Air Jordan 1 Mid 'Light Smoke Grey'",
        description: "AJ1中帮，日常穿搭热门款。",
        brand: 'Jordan',
        price: 899,
        rarity: Rarity.COMMON,
        attributes: { speed: 65, jump: 60, stability: 70, durability: 85, grip: 60 }
    },
    {
        id: "JORDAN_072",
        name: "Jordan Air Jordan 38 Low 'Coconut Milk'",
        description: "AJ38低帮，轻量化设计，适合快速移动。",
        brand: 'Jordan',
        price: 1499,
        rarity: Rarity.EPIC,
        attributes: { speed: 92, jump: 95, stability: 82, durability: 78, grip: 92 }
    },
    {
        id: "JORDAN_073",
        name: "Jordan Air Jordan 10 Retro 'Seattle'",
        description: "AJ10，纪念乔丹第一次复出。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.RARE,
        attributes: { speed: 70, jump: 70, stability: 85, durability: 90, grip: 70 }
    },
    {
        id: "JORDAN_074",
        name: "Jordan Air Jordan 18 Retro 'Sport Royal'",
        description: "AJ18，跑车设计灵感，鞋盖设计独特。",
        brand: 'Jordan',
        price: 1699,
        rarity: Rarity.EPIC,
        attributes: { speed: 75, jump: 80, stability: 90, durability: 88, grip: 78 }
    },
    {
        id: "JORDAN_075",
        name: "Jordan Air Jordan 16 Retro 'Midnight Navy'",
        description: "AJ16，可拆卸鞋盖，一鞋两穿。",
        brand: 'Jordan',
        price: 1599,
        rarity: Rarity.RARE,
        attributes: { speed: 72, jump: 75, stability: 92, durability: 85, grip: 75 }
    },

    // ---------------------- Under Armour 系列 (15 items) ----------------------
    {
        id: "UA_076",
        name: "Under Armour Curry Flow 10 'Sour Then Sweet'",
        description: "库里第十代签名鞋，Flow缓震科技，极致轻盈和抓地力。",
        brand: 'Under Armour',
        price: 1199,
        rarity: Rarity.EPIC,
        attributes: { speed: 98, jump: 90, stability: 80, durability: 70, grip: 99 }
    },
    {
        id: "UA_077",
        name: "Under Armour Curry 4 FloTro 'Retro'",
        description: "库里4代复刻，结合Flow科技，兼具经典外观和现代性能。",
        brand: 'Under Armour',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 95, jump: 88, stability: 78, durability: 75, grip: 95 }
    },
    {
        id: "UA_078",
        name: "Under Armour Spawn 5",
        description: "高性价比实战鞋，注重包裹和透气。",
        brand: 'Under Armour',
        price: 699,
        rarity: Rarity.COMMON,
        attributes: { speed: 80, jump: 75, stability: 80, durability: 85, grip: 80 }
    },
    {
        id: "UA_079",
        name: "Under Armour HOVR Havoc 5",
        description: "HOVR缓震科技，提供能量回馈，适合多位置球员。",
        brand: 'Under Armour',
        price: 899,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 85, jump: 82, stability: 85, durability: 80, grip: 85 }
    },
    {
        id: "UA_080",
        name: "Under Armour Embiid One 'Draft Day'",
        description: "恩比德首代签名鞋，注重力量和内线支撑。",
        brand: 'Under Armour',
        price: 999,
        rarity: Rarity.RARE,
        attributes: { speed: 75, jump: 88, stability: 95, durability: 90, grip: 80 }
    },
    {
        id: "UA_081",
        name: "Under Armour Curry 30 Low 'Splash'",
        description: "库里支线低帮，轻便灵活，适合外场。",
        brand: 'Under Armour',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 90, jump: 80, stability: 75, durability: 80, grip: 88 }
    },
    {
        id: "UA_082",
        name: "Under Armour Curry Flow 9 'Sesame Street'",
        description: "库里9代，与芝麻街联名，Flow缓震，配色有趣。",
        brand: 'Under Armour',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 96, jump: 88, stability: 80, durability: 75, grip: 98 }
    },
    {
        id: "UA_083",
        name: "Under Armour Lockdown 6",
        description: "入门级高帮，提供良好的脚踝保护。",
        brand: 'Under Armour',
        price: 599,
        rarity: Rarity.COMMON,
        attributes: { speed: 70, jump: 70, stability: 85, durability: 88, grip: 70 }
    },
    {
        id: "UA_084",
        name: "Under Armour Curry 2.5 'Black Taxi'",
        description: "库里2.5代，包裹性强，中帮设计。",
        brand: 'Under Armour',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 90, jump: 85, stability: 85, durability: 80, grip: 90 }
    },
    {
        id: "UA_085",
        name: "Under Armour HOVR Machina 3",
        description: "跑鞋科技融入篮球鞋，轻盈且缓震出色。",
        brand: 'Under Armour',
        price: 949,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 88, jump: 85, stability: 80, durability: 82, grip: 85 }
    },
    {
        id: "UA_086",
        name: "Under Armour Curry Flow 8 'White/Gold'",
        description: "库里8代，Flow科技首秀，突破传统中底设计。",
        brand: 'Under Armour',
        price: 1299,
        rarity: Rarity.EPIC,
        attributes: { speed: 97, jump: 89, stability: 80, durability: 70, grip: 99 }
    },
    {
        id: "UA_087",
        name: "Under Armour Jet '21",
        description: "基础训练鞋，简洁耐用。",
        brand: 'Under Armour',
        price: 499,
        rarity: Rarity.COMMON,
        attributes: { speed: 70, jump: 68, stability: 75, durability: 80, grip: 70 }
    },
    {
        id: "UA_088",
        name: "Under Armour Curry 7 'Dub Nation'",
        description: "库里7代，Micro G和HOVR双重缓震。",
        brand: 'Under Armour',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 92, jump: 85, stability: 82, durability: 78, grip: 92 }
    },
    {
        id: "UA_089",
        name: "Under Armour Project Rock 5",
        description: "巨石强森训练鞋，高强度支撑，适合力量型球员。",
        brand: 'Under Armour',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 70, jump: 75, stability: 98, durability: 95, grip: 75 }
    },
    {
        id: "UA_090",
        name: "Under Armour Curry Flow 2 'MVP'",
        description: "库里2代，经典复刻，Flow科技加持。",
        brand: 'Under Armour',
        price: 1299,
        rarity: Rarity.EPIC,
        attributes: { speed: 95, jump: 90, stability: 80, durability: 75, grip: 98 }
    },

    // ---------------------- Puma 系列 (10 items) ----------------------
    {
        id: "PUMA_091",
        name: "Puma LaMelo Ball MB.02 'GNO'",
        description: "三球第二代签名鞋，Nitro Foam缓震，轻量且回弹。",
        brand: 'Puma',
        price: 1199,
        rarity: Rarity.RARE,
        attributes: { speed: 92, jump: 90, stability: 80, durability: 78, grip: 90 }
    },
    {
        id: "PUMA_092",
        name: "Puma Clyde All-Pro 'Coast 2 Coast'",
        description: "经典Clyde系列升级，ProFoam缓震，场地感出色。",
        brand: 'Puma',
        price: 999,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 90, jump: 85, stability: 78, durability: 80, grip: 92 }
    },
    {
        id: "PUMA_093",
        name: "Puma Rise Nitro 'Puma Black'",
        description: "Nitro缓震科技，提供极致的能量反馈和轻盈。",
        brand: 'Puma',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 94, jump: 92, stability: 80, durability: 75, grip: 90 }
    },
    {
        id: "PUMA_094",
        name: "Puma Court Rider 2.0",
        description: "入门级实战鞋，注重舒适度和耐用性。",
        brand: 'Puma',
        price: 799,
        rarity: Rarity.COMMON,
        attributes: { speed: 80, jump: 75, stability: 80, durability: 85, grip: 80 }
    },
    {
        id: "PUMA_095",
        name: "Puma TRC Blaze Court 'White'",
        description: "复古跑鞋设计灵感，缓震和支撑均衡。",
        brand: 'Puma',
        price: 899,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 82, jump: 80, stability: 85, durability: 82, grip: 85 }
    },
    {
        id: "PUMA_096",
        name: "Puma All-Pro Nitro 'Scoot Henderson'",
        description: "为新星亨德森设计的All-Pro版本，性能全面升级。",
        brand: 'Puma',
        price: 1299,
        rarity: Rarity.EPIC,
        attributes: { speed: 95, jump: 90, stability: 85, durability: 80, grip: 95 }
    },
    {
        id: "PUMA_097",
        name: "Puma Clyde Hardwood 'Team'",
        description: "Clyde系列高帮，提供更多脚踝保护。",
        brand: 'Puma',
        price: 949,
        rarity: Rarity.UNCOMMON,
        attributes: { speed: 85, jump: 80, stability: 88, durability: 85, grip: 88 }
    },
    {
        id: "PUMA_098",
        name: "Puma MB.01 'Galaxy'",
        description: "三球首代签名鞋，独特的翅膀设计，收藏价值高。",
        brand: 'Puma',
        price: 1399,
        rarity: Rarity.LEGENDARY,
        attributes: { speed: 90, jump: 92, stability: 80, durability: 78, grip: 92 }
    },
    {
        id: "PUMA_099",
        name: "Puma Playmaker Pro",
        description: "团队实战鞋，注重平衡性，适合多种打法。",
        brand: 'Puma',
        price: 699,
        rarity: Rarity.COMMON,
        attributes: { speed: 78, jump: 75, stability: 82, durability: 85, grip: 80 }
    },
    {
        id: "PUMA_100",
        name: "Puma Clyde Court Disrupt 'Purple'",
        description: "Puma回归篮球市场的首批产品之一，混合缓震。",
        brand: 'Puma',
        price: 1099,
        rarity: Rarity.RARE,
        attributes: { speed: 88, jump: 85, stability: 80, durability: 80, grip: 90 }
    }
];

// 导出物品数量
export const SHOES_ITEM_COUNT = ShoesDatabase.length;

// 导出物品ID列表 (可选，但有助于索引)
export const ShoesIDs = ShoesDatabase.map(shoe => shoe.id);
