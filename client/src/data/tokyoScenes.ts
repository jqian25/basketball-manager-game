/**
 * 东京都市场景数据库
 * 50个开罗游戏风格的等距像素艺术场景
 * 用于Pokemon Basketball RPG开放世界系统
 */

export interface TokyoScene {
  id: string;
  nameEn: string;
  nameZh: string;
  nameJp: string;
  category: "commercial" | "cultural" | "residential" | "sports" | "special";
  imagePath: string;
  description: string;
  hasBasketballCourt: boolean;
  difficulty?: "easy" | "normal" | "hard" | "expert";
  unlockLevel: number;
  connectedScenes: string[]; // 连接的场景ID
  npcs: string[]; // NPC ID列表
  items: string[]; // 可获得的道具
  quests: string[]; // 可接取的任务
}

export const TOKYO_SCENES: TokyoScene[] = [
  // ==================== 商业区（10个）====================
  {
    id: "shibuya_crossing",
    nameEn: "Shibuya Crossing",
    nameZh: "涩谷十字路口",
    nameJp: "渋谷スクランブル交差点",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/shibuya_crossing.png",
    description: "东京最繁忙的十字路口，巨大的LED屏幕和熙攘的人群",
    hasBasketballCourt: false,
    unlockLevel: 1,
    connectedScenes: ["harajuku", "omotesando"],
    npcs: ["npc_shibuya_fashionista", "npc_shibuya_photographer"],
    items: ["energy_drink", "trendy_sneakers"],
    quests: ["quest_shibuya_crossing_challenge"]
  },
  {
    id: "akihabara",
    nameEn: "Akihabara Electric Town",
    nameZh: "秋叶原电器街",
    nameJp: "秋葉原電気街",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/akihabara.png",
    description: "动漫和电子产品的圣地，充满御宅文化气息",
    hasBasketballCourt: false,
    unlockLevel: 3,
    connectedScenes: ["kanda_jimbocho", "ueno_park"],
    npcs: ["npc_akiba_otaku", "npc_akiba_maid_cafe"],
    items: ["anime_poster", "gaming_console"],
    quests: ["quest_akiba_treasure_hunt"]
  },
  {
    id: "shinjuku_kabukicho",
    nameEn: "Shinjuku Kabukicho",
    nameZh: "新宿歌舞伎町",
    nameJp: "新宿歌舞伎町",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/shinjuku.png",
    description: "东京最大的娱乐区，霓虹灯闪烁的夜生活中心",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["shinjuku_gyoen", "yoyogi_park"],
    npcs: ["npc_shinjuku_host", "npc_shinjuku_bartender"],
    items: ["energy_drink", "lucky_charm"],
    quests: ["quest_shinjuku_night_challenge"]
  },
  {
    id: "ginza",
    nameEn: "Ginza Shopping Street",
    nameZh: "银座购物街",
    nameJp: "銀座",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/ginza.png",
    description: "东京最奢华的购物区，高端品牌云集",
    hasBasketballCourt: false,
    unlockLevel: 7,
    connectedScenes: ["tokyo_station", "imperial_palace"],
    npcs: ["npc_ginza_luxury_shopper", "npc_ginza_jeweler"],
    items: ["luxury_watch", "designer_bag"],
    quests: ["quest_ginza_fashion_show"]
  },
  {
    id: "harajuku_takeshita",
    nameEn: "Harajuku Takeshita Street",
    nameZh: "原宿竹下通",
    nameJp: "原宿竹下通り",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/harajuku.png",
    description: "年轻人的时尚天堂，充满创意和个性",
    hasBasketballCourt: false,
    unlockLevel: 2,
    connectedScenes: ["shibuya_crossing", "meiji_shrine"],
    npcs: ["npc_harajuku_fashion_designer", "npc_harajuku_crepe_seller"],
    items: ["trendy_outfit", "sweet_crepe"],
    quests: ["quest_harajuku_fashion_contest"]
  },
  {
    id: "roppongi_hills",
    nameEn: "Roppongi Hills",
    nameZh: "六本木之丘",
    nameJp: "六本木ヒルズ",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/roppongi.png",
    description: "现代化的商业综合体，艺术与商业的完美结合",
    hasBasketballCourt: false,
    unlockLevel: 8,
    connectedScenes: ["tokyo_tower", "odaiba"],
    npcs: ["npc_roppongi_art_curator", "npc_roppongi_businessman"],
    items: ["art_book", "business_card"],
    quests: ["quest_roppongi_art_exhibition"]
  },
  {
    id: "omotesando",
    nameEn: "Omotesando Avenue",
    nameZh: "表参道",
    nameJp: "表参道",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/omotesando.png",
    description: "树荫大道两旁是设计师品牌店和现代建筑",
    hasBasketballCourt: false,
    unlockLevel: 6,
    connectedScenes: ["shibuya_crossing", "harajuku_takeshita"],
    npcs: ["npc_omotesando_architect", "npc_omotesando_designer"],
    items: ["designer_shoes", "architecture_magazine"],
    quests: ["quest_omotesando_design_walk"]
  },
  {
    id: "ikebukuro_sunshine",
    nameEn: "Ikebukuro Sunshine City",
    nameZh: "池袋阳光城",
    nameJp: "池袋サンシャインシティ",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/ikebukuro.png",
    description: "大型购物娱乐综合体，有水族馆和展望台",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["nakano_broadway", "koenji"],
    npcs: ["npc_ikebukuro_aquarium_guide", "npc_ikebukuro_shopper"],
    items: ["aquarium_ticket", "souvenir"],
    quests: ["quest_ikebukuro_observation_deck"]
  },
  {
    id: "tokyo_station_marunouchi",
    nameEn: "Tokyo Station Marunouchi",
    nameZh: "东京站丸之内",
    nameJp: "東京駅丸の内",
    category: "commercial",
    imagePath: "/maps/tokyo/commercial/tokyo_station.png",
    description: "历史悠久的红砖车站，商务区的中心",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["ginza", "imperial_palace"],
    npcs: ["npc_tokyo_station_conductor", "npc_tokyo_station_businessman"],
    items: ["train_pass", "bento_box"],
    quests: ["quest_tokyo_station_time_challenge"]
  },
  {
    id: "odaiba_seaside",
    nameEn: "Odaiba Seaside Park",
    nameZh: "台场海滨公园",
    nameJp: "お台場海浜公園",
    category: "commercial",
    imagePath: "/maps/tokyo/special/odaiba.png",
    description: "海滨娱乐区，可以看到彩虹大桥和自由女神像",
    hasBasketballCourt: false,
    unlockLevel: 9,
    connectedScenes: ["rainbow_bridge", "fuji_tv"],
    npcs: ["npc_odaiba_tourist", "npc_odaiba_photographer"],
    items: ["beach_ball", "camera"],
    quests: ["quest_odaiba_sunset_photo"]
  },

  // ==================== 文化区（10个）====================
  {
    id: "asakusa_sensoji",
    nameEn: "Asakusa Sensoji Temple",
    nameZh: "浅草寺雷门",
    nameJp: "浅草寺雷門",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/asakusa_temple.png",
    description: "东京最古老的寺庙，标志性的雷门和巨大红灯笼",
    hasBasketballCourt: false,
    unlockLevel: 1,
    connectedScenes: ["asakusa_hanayashiki", "sumida_river"],
    npcs: ["npc_asakusa_monk", "npc_asakusa_souvenir_seller"],
    items: ["omamori_charm", "senso_ji_fan"],
    quests: ["quest_asakusa_temple_blessing"]
  },
  {
    id: "meiji_shrine",
    nameEn: "Meiji Shrine",
    nameZh: "明治神宫",
    nameJp: "明治神宮",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/meiji_shrine.png",
    description: "宁静的神社，被茂密的森林环绕",
    hasBasketballCourt: false,
    unlockLevel: 2,
    connectedScenes: ["harajuku_takeshita", "yoyogi_park"],
    npcs: ["npc_meiji_shrine_priest", "npc_meiji_shrine_visitor"],
    items: ["ema_plaque", "sake_offering"],
    quests: ["quest_meiji_shrine_purification"]
  },
  {
    id: "ueno_park",
    nameEn: "Ueno Park",
    nameZh: "上野公园",
    nameJp: "上野公園",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/ueno_park.png",
    description: "春天樱花盛开的公园，有博物馆和动物园",
    hasBasketballCourt: false,
    unlockLevel: 3,
    connectedScenes: ["akihabara", "asakusa_sensoji"],
    npcs: ["npc_ueno_museum_curator", "npc_ueno_artist"],
    items: ["museum_ticket", "sketch_book"],
    quests: ["quest_ueno_cherry_blossom_viewing"]
  },
  {
    id: "imperial_palace",
    nameEn: "Imperial Palace",
    nameZh: "皇居外苑",
    nameJp: "皇居外苑",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/imperial_palace.png",
    description: "日本天皇的居所，被护城河和石墙环绕",
    hasBasketballCourt: false,
    unlockLevel: 7,
    connectedScenes: ["tokyo_station_marunouchi", "ginza"],
    npcs: ["npc_imperial_guard", "npc_imperial_historian"],
    items: ["history_book", "imperial_seal_replica"],
    quests: ["quest_imperial_palace_tour"]
  },
  {
    id: "zojoji_temple",
    nameEn: "Zojoji Temple",
    nameZh: "增上寺",
    nameJp: "増上寺",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/zojoji_temple.png",
    description: "佛教寺庙，背景是标志性的东京塔",
    hasBasketballCourt: false,
    unlockLevel: 6,
    connectedScenes: ["tokyo_tower", "roppongi_hills"],
    npcs: ["npc_zojoji_monk", "npc_zojoji_pilgrim"],
    items: ["buddhist_sutra", "incense"],
    quests: ["quest_zojoji_meditation"]
  },
  {
    id: "yoyogi_park",
    nameEn: "Yoyogi Park",
    nameZh: "代代木公园",
    nameJp: "代々木公園",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/yoyogi_park.png",
    description: "开放的绿地，周末有街头艺人表演",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["meiji_shrine", "shinjuku_kabukicho"],
    npcs: ["npc_yoyogi_street_performer", "npc_yoyogi_picnicker"],
    items: ["guitar_pick", "picnic_basket"],
    quests: ["quest_yoyogi_street_performance"]
  },
  {
    id: "tokyo_tower",
    nameEn: "Tokyo Tower",
    nameZh: "东京塔",
    nameJp: "東京タワー",
    category: "cultural",
    imagePath: "/maps/tokyo/special/tokyo_tower.png",
    description: "标志性的红色铁塔，东京的象征",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["zojoji_temple", "roppongi_hills"],
    npcs: ["npc_tokyo_tower_guide", "npc_tokyo_tower_tourist"],
    items: ["tower_keychain", "observation_ticket"],
    quests: ["quest_tokyo_tower_climb"]
  },
  {
    id: "tokyo_skytree",
    nameEn: "Tokyo Skytree",
    nameZh: "东京晴空塔",
    nameJp: "東京スカイツリー",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/tokyo_skytree.png",
    description: "世界最高的塔之一，现代东京的地标",
    hasBasketballCourt: false,
    unlockLevel: 10,
    connectedScenes: ["sumida_river", "asakusa_sensoji"],
    npcs: ["npc_skytree_staff", "npc_skytree_photographer"],
    items: ["skytree_badge", "panorama_photo"],
    quests: ["quest_skytree_top_floor"]
  },
  {
    id: "asakusa_hanayashiki",
    nameEn: "Asakusa Hanayashiki",
    nameZh: "浅草花屋敷",
    nameJp: "浅草花やしき",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/asakusa_hanayashiki.png",
    description: "日本最古老的游乐园，复古的游乐设施",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["asakusa_sensoji", "sumida_river"],
    npcs: ["npc_hanayashiki_operator", "npc_hanayashiki_child"],
    items: ["ride_ticket", "cotton_candy"],
    quests: ["quest_hanayashiki_roller_coaster"]
  },
  {
    id: "kanda_jimbocho",
    nameEn: "Kanda Jimbocho Bookstore District",
    nameZh: "神田神保町书店街",
    nameJp: "神田神保町古書街",
    category: "cultural",
    imagePath: "/maps/tokyo/cultural/kanda_jimbocho.png",
    description: "世界最大的旧书街，学术氛围浓厚",
    hasBasketballCourt: false,
    unlockLevel: 6,
    connectedScenes: ["akihabara", "tokyo_university"],
    npcs: ["npc_jimbocho_bookstore_owner", "npc_jimbocho_scholar"],
    items: ["rare_book", "vintage_manga"],
    quests: ["quest_jimbocho_book_hunt"]
  },

  // ==================== 居住区（10个）====================
  {
    id: "shimokitazawa",
    nameEn: "Shimokitazawa",
    nameZh: "下北泽",
    nameJp: "下北沢",
    category: "residential",
    imagePath: "/maps/tokyo/residential/shimokitazawa.png",
    description: "波西米亚风格的街区，充满音乐和艺术气息",
    hasBasketballCourt: false,
    unlockLevel: 3,
    connectedScenes: ["sangenjaya", "koenji"],
    npcs: ["npc_shimokita_musician", "npc_shimokita_vintage_shop_owner"],
    items: ["vintage_jacket", "indie_cd"],
    quests: ["quest_shimokita_live_music"]
  },
  {
    id: "nakameguro",
    nameEn: "Nakameguro",
    nameZh: "中目黑",
    nameJp: "中目黒",
    category: "residential",
    imagePath: "/maps/tokyo/residential/nakameguro.png",
    description: "运河两旁樱花树成荫，时尚咖啡馆林立",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["ebisu", "jiyugaoka"],
    npcs: ["npc_nakameguro_barista", "npc_nakameguro_photographer"],
    items: ["specialty_coffee", "cherry_blossom_photo"],
    quests: ["quest_nakameguro_canal_walk"]
  },
  {
    id: "kichijoji",
    nameEn: "Kichijoji",
    nameZh: "吉祥寺",
    nameJp: "吉祥寺",
    category: "residential",
    imagePath: "/maps/tokyo/residential/kichijoji.png",
    description: "最宜居的街区之一，有井之头公园和商店街",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["ogikubo", "asagaya"],
    npcs: ["npc_kichijoji_local", "npc_kichijoji_shop_owner"],
    items: ["local_snack", "park_map"],
    quests: ["quest_kichijoji_inokashira_park"]
  },
  {
    id: "jiyugaoka",
    nameEn: "Jiyugaoka",
    nameZh: "自由之丘",
    nameJp: "自由が丘",
    category: "residential",
    imagePath: "/maps/tokyo/residential/jiyugaoka.png",
    description: "欧式风格的街区，以面包店和时尚精品店闻名",
    hasBasketballCourt: false,
    unlockLevel: 6,
    connectedScenes: ["nakameguro", "ebisu"],
    npcs: ["npc_jiyugaoka_baker", "npc_jiyugaoka_fashion_buyer"],
    items: ["french_bread", "boutique_dress"],
    quests: ["quest_jiyugaoka_bakery_tour"]
  },
  {
    id: "ebisu",
    nameEn: "Ebisu",
    nameZh: "惠比寿",
    nameJp: "恵比寿",
    category: "residential",
    imagePath: "/maps/tokyo/residential/ebisu.png",
    description: "高档住宅区，有惠比寿花园广场和餐厅",
    hasBasketballCourt: false,
    unlockLevel: 7,
    connectedScenes: ["nakameguro", "jiyugaoka"],
    npcs: ["npc_ebisu_chef", "npc_ebisu_resident"],
    items: ["gourmet_meal", "wine_bottle"],
    quests: ["quest_ebisu_garden_place"]
  },
  {
    id: "sangenjaya",
    nameEn: "Sangenjaya",
    nameZh: "三轩茶屋",
    nameJp: "三軒茶屋",
    category: "residential",
    imagePath: "/maps/tokyo/residential/sangenjaya.png",
    description: "传统的本地街区，有居酒屋和商店街",
    hasBasketballCourt: false,
    unlockLevel: 3,
    connectedScenes: ["shimokitazawa", "shibuya_crossing"],
    npcs: ["npc_sangenjaya_izakaya_owner", "npc_sangenjaya_local"],
    items: ["sake", "yakitori"],
    quests: ["quest_sangenjaya_izakaya_crawl"]
  },
  {
    id: "koenji",
    nameEn: "Koenji",
    nameZh: "高円寺",
    nameJp: "高円寺",
    category: "residential",
    imagePath: "/maps/tokyo/residential/koenji.png",
    description: "复古服装和朋克文化的聚集地",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["shimokitazawa", "asagaya"],
    npcs: ["npc_koenji_punk_rocker", "npc_koenji_vintage_dealer"],
    items: ["leather_jacket", "punk_band_poster"],
    quests: ["quest_koenji_vintage_hunt"]
  },
  {
    id: "asagaya",
    nameEn: "Asagaya",
    nameZh: "阿佐谷",
    nameJp: "阿佐ヶ谷",
    category: "residential",
    imagePath: "/maps/tokyo/residential/asagaya.png",
    description: "宁静的住宅区，有珍珠中心商店街和爵士酒吧",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["koenji", "kichijoji"],
    npcs: ["npc_asagaya_jazz_musician", "npc_asagaya_shop_owner"],
    items: ["jazz_vinyl", "local_craft"],
    quests: ["quest_asagaya_jazz_night"]
  },
  {
    id: "ogikubo",
    nameEn: "Ogikubo",
    nameZh: "荻窪",
    nameJp: "荻窪",
    category: "residential",
    imagePath: "/maps/tokyo/residential/ogikubo.png",
    description: "安静的住宅区，以拉面店和本地市场闻名",
    hasBasketballCourt: false,
    unlockLevel: 4,
    connectedScenes: ["asagaya", "kichijoji"],
    npcs: ["npc_ogikubo_ramen_chef", "npc_ogikubo_market_vendor"],
    items: ["ramen_bowl", "fresh_vegetables"],
    quests: ["quest_ogikubo_ramen_challenge"]
  },
  {
    id: "nakano_broadway",
    nameEn: "Nakano Broadway",
    nameZh: "中野百老汇",
    nameJp: "中野ブロードウェイ",
    category: "residential",
    imagePath: "/maps/tokyo/residential/nakano_broadway.png",
    description: "动漫和收藏品的宝库，御宅族的天堂",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["ikebukuro_sunshine", "koenji"],
    npcs: ["npc_nakano_collector", "npc_nakano_manga_seller"],
    items: ["rare_figure", "vintage_manga"],
    quests: ["quest_nakano_treasure_hunt"]
  },

  // ==================== 体育设施（10个）====================
  {
    id: "national_stadium",
    nameEn: "National Stadium",
    nameZh: "国立竞技场",
    nameJp: "国立競技場",
    category: "sports",
    imagePath: "/maps/tokyo/sports/national_stadium.png",
    description: "奥运会主场馆，拥有世界级的篮球场地",
    hasBasketballCourt: true,
    difficulty: "expert",
    unlockLevel: 15,
    connectedScenes: ["yoyogi_gymnasium", "meiji_shrine"],
    npcs: ["npc_national_coach", "npc_national_champion"],
    items: ["olympic_medal", "championship_trophy"],
    quests: ["quest_national_championship"]
  },
  {
    id: "tokyo_dome",
    nameEn: "Tokyo Dome",
    nameZh: "东京巨蛋",
    nameJp: "東京ドーム",
    category: "sports",
    imagePath: "/maps/tokyo/sports/tokyo_dome.png",
    description: "多功能体育场，可举办篮球比赛",
    hasBasketballCourt: true,
    difficulty: "hard",
    unlockLevel: 12,
    connectedScenes: ["kanda_jimbocho", "ueno_park"],
    npcs: ["npc_dome_manager", "npc_dome_star_player"],
    items: ["dome_ticket", "sports_drink"],
    quests: ["quest_dome_tournament"]
  },
  {
    id: "ariake_arena",
    nameEn: "Ariake Arena",
    nameZh: "有明体育馆",
    nameJp: "有明アリーナ",
    category: "sports",
    imagePath: "/maps/tokyo/sports/ariake_arena.png",
    description: "现代化的体育设施，奥运排球和篮球场地",
    hasBasketballCourt: true,
    difficulty: "hard",
    unlockLevel: 13,
    connectedScenes: ["odaiba_seaside", "tokyo_big_sight"],
    npcs: ["npc_ariake_coach", "npc_ariake_athlete"],
    items: ["training_gear", "energy_bar"],
    quests: ["quest_ariake_training_camp"]
  },
  {
    id: "yoyogi_gymnasium",
    nameEn: "Yoyogi Gymnasium",
    nameZh: "代代木体育馆",
    nameJp: "代々木体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/yoyogi_gymnasium.png",
    description: "标志性的悬索屋顶设计，奥运遗产场馆",
    hasBasketballCourt: true,
    difficulty: "normal",
    unlockLevel: 8,
    connectedScenes: ["yoyogi_park", "national_stadium"],
    npcs: ["npc_yoyogi_veteran_coach", "npc_yoyogi_player"],
    items: ["training_manual", "sports_towel"],
    quests: ["quest_yoyogi_practice_match"]
  },
  {
    id: "komazawa_olympic_park",
    nameEn: "Komazawa Olympic Park",
    nameZh: "驹泽奥林匹克公园",
    nameJp: "駒沢オリンピック公園",
    category: "sports",
    imagePath: "/maps/tokyo/sports/komazawa_olympic_park.png",
    description: "多功能运动公园，有跑道和篮球场",
    hasBasketballCourt: true,
    difficulty: "normal",
    unlockLevel: 7,
    connectedScenes: ["sangenjaya", "jiyugaoka"],
    npcs: ["npc_komazawa_runner", "npc_komazawa_basketball_team"],
    items: ["running_shoes", "water_bottle"],
    quests: ["quest_komazawa_marathon"]
  },
  {
    id: "edogawa_gymnasium",
    nameEn: "Edogawa Gymnasium",
    nameZh: "江户川区体育馆",
    nameJp: "江戸川区体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/edogawa_gymnasium.png",
    description: "社区体育中心，本地篮球队的训练基地",
    hasBasketballCourt: true,
    difficulty: "easy",
    unlockLevel: 3,
    connectedScenes: ["tokyo_skytree", "sumida_river"],
    npcs: ["npc_edogawa_coach", "npc_edogawa_youth_player"],
    items: ["basketball", "team_jersey"],
    quests: ["quest_edogawa_youth_league"]
  },
  {
    id: "ota_gymnasium",
    nameEn: "Ota Gymnasium",
    nameZh: "大田区体育馆",
    nameJp: "大田区体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/ota_gymnasium.png",
    description: "区级体育设施，举办篮球锦标赛",
    hasBasketballCourt: true,
    difficulty: "normal",
    unlockLevel: 6,
    connectedScenes: ["haneda_airport", "odaiba_seaside"],
    npcs: ["npc_ota_referee", "npc_ota_team_captain"],
    items: ["tournament_badge", "protein_shake"],
    quests: ["quest_ota_district_tournament"]
  },
  {
    id: "setagaya_gymnasium",
    nameEn: "Setagaya Gymnasium",
    nameZh: "世田谷区体育馆",
    nameJp: "世田谷区体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/setagaya_gymnasium.png",
    description: "社区体育综合体，青少年篮球项目",
    hasBasketballCourt: true,
    difficulty: "easy",
    unlockLevel: 4,
    connectedScenes: ["sangenjaya", "shimokitazawa"],
    npcs: ["npc_setagaya_youth_coach", "npc_setagaya_student"],
    items: ["training_cone", "whistle"],
    quests: ["quest_setagaya_youth_training"]
  },
  {
    id: "nerima_gymnasium",
    nameEn: "Nerima Gymnasium",
    nameZh: "练马区体育馆",
    nameJp: "練馬区体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/nerima_gymnasium.png",
    description: "本地体育场馆，篮球联赛和社区活动",
    hasBasketballCourt: true,
    difficulty: "easy",
    unlockLevel: 5,
    connectedScenes: ["ikebukuro_sunshine", "kichijoji"],
    npcs: ["npc_nerima_league_organizer", "npc_nerima_amateur_player"],
    items: ["league_schedule", "sports_bag"],
    quests: ["quest_nerima_community_league"]
  },
  {
    id: "adachi_gymnasium",
    nameEn: "Adachi Gymnasium",
    nameZh: "足立区体育馆",
    nameJp: "足立区体育館",
    category: "sports",
    imagePath: "/maps/tokyo/sports/adachi_gymnasium.png",
    description: "区级运动中心，学校篮球比赛场地",
    hasBasketballCourt: true,
    difficulty: "easy",
    unlockLevel: 2,
    connectedScenes: ["tokyo_skytree", "asakusa_sensoji"],
    npcs: ["npc_adachi_school_coach", "npc_adachi_high_school_player"],
    items: ["school_uniform", "basketball_shoes"],
    quests: ["quest_adachi_school_championship"]
  },

  // ==================== 特色场景（10个）====================
  {
    id: "tsukiji_market",
    nameEn: "Tsukiji Market",
    nameZh: "筑地市场",
    nameJp: "築地市場",
    category: "special",
    imagePath: "/maps/tokyo/special/tsukiji_market.png",
    description: "世界著名的鱼市场，新鲜寿司和海鲜",
    hasBasketballCourt: false,
    unlockLevel: 6,
    connectedScenes: ["ginza", "tokyo_bay_night"],
    npcs: ["npc_tsukiji_fish_merchant", "npc_tsukiji_sushi_chef"],
    items: ["fresh_tuna", "sushi_set"],
    quests: ["quest_tsukiji_auction"]
  },
  {
    id: "tokyo_disneyland",
    nameEn: "Tokyo Disneyland",
    nameZh: "东京迪士尼乐园",
    nameJp: "東京ディズニーランド",
    category: "special",
    imagePath: "/maps/tokyo/special/tokyo_disneyland.png",
    description: "梦幻的主题乐园，充满魔法和欢乐",
    hasBasketballCourt: false,
    unlockLevel: 10,
    connectedScenes: ["haneda_airport", "odaiba_seaside"],
    npcs: ["npc_disney_cast_member", "npc_disney_visitor"],
    items: ["mickey_ears", "disney_ticket"],
    quests: ["quest_disney_parade"]
  },
  {
    id: "fuji_tv",
    nameEn: "Fuji TV Building",
    nameZh: "富士电视台",
    nameJp: "フジテレビ本社ビル",
    category: "special",
    imagePath: "/maps/tokyo/special/fuji_tv.png",
    description: "标志性的球形建筑，现代媒体中心",
    hasBasketballCourt: false,
    unlockLevel: 8,
    connectedScenes: ["odaiba_seaside", "rainbow_bridge"],
    npcs: ["npc_fuji_tv_producer", "npc_fuji_tv_reporter"],
    items: ["tv_show_ticket", "autograph"],
    quests: ["quest_fuji_tv_studio_tour"]
  },
  {
    id: "rainbow_bridge",
    nameEn: "Rainbow Bridge",
    nameZh: "彩虹大桥",
    nameJp: "レインボーブリッジ",
    category: "special",
    imagePath: "/maps/tokyo/special/rainbow_bridge.png",
    description: "横跨东京湾的悬索桥，夜晚灯光璀璨",
    hasBasketballCourt: false,
    unlockLevel: 9,
    connectedScenes: ["odaiba_seaside", "fuji_tv"],
    npcs: ["npc_bridge_photographer", "npc_bridge_engineer"],
    items: ["night_photo", "bridge_model"],
    quests: ["quest_rainbow_bridge_walk"]
  },
  {
    id: "sumida_river",
    nameEn: "Sumida River",
    nameZh: "隅田川河畔",
    nameJp: "隅田川",
    category: "special",
    imagePath: "/maps/tokyo/special/sumida_river.png",
    description: "樱花树成荫的河岸，传统游船和桥梁",
    hasBasketballCourt: false,
    unlockLevel: 5,
    connectedScenes: ["asakusa_sensoji", "tokyo_skytree"],
    npcs: ["npc_sumida_boat_captain", "npc_sumida_painter"],
    items: ["boat_ticket", "river_painting"],
    quests: ["quest_sumida_river_cruise"]
  },
  {
    id: "tokyo_bay_night",
    nameEn: "Tokyo Bay Night View",
    nameZh: "东京湾夜景",
    nameJp: "東京湾夜景",
    category: "special",
    imagePath: "/maps/tokyo/special/tokyo_bay_night.png",
    description: "海滨天际线，灯火辉煌的夜景",
    hasBasketballCourt: false,
    unlockLevel: 11,
    connectedScenes: ["odaiba_seaside", "rainbow_bridge"],
    npcs: ["npc_bay_night_photographer", "npc_bay_couple"],
    items: ["night_view_photo", "romantic_gift"],
    quests: ["quest_bay_night_photography"]
  },
  {
    id: "shinjuku_gyoen",
    nameEn: "Shinjuku Gyoen",
    nameZh: "新宿御苑",
    nameJp: "新宿御苑",
    category: "special",
    imagePath: "/maps/tokyo/special/shinjuku_gyoen.png",
    description: "大型日式庭园，有温室和传统景观",
    hasBasketballCourt: false,
    unlockLevel: 7,
    connectedScenes: ["shinjuku_kabukicho", "yoyogi_park"],
    npcs: ["npc_gyoen_gardener", "npc_gyoen_tea_master"],
    items: ["garden_map", "green_tea"],
    quests: ["quest_gyoen_four_seasons"]
  },
  {
    id: "tokyo_university",
    nameEn: "Tokyo University Hongo Campus",
    nameZh: "东京大学本乡校区",
    nameJp: "東京大学本郷キャンパス",
    category: "special",
    imagePath: "/maps/tokyo/special/tokyo_university.png",
    description: "日本顶尖学府，历史悠久的赤门",
    hasBasketballCourt: false,
    unlockLevel: 8,
    connectedScenes: ["kanda_jimbocho", "ueno_park"],
    npcs: ["npc_todai_professor", "npc_todai_student"],
    items: ["university_textbook", "research_paper"],
    quests: ["quest_todai_lecture"]
  },
  {
    id: "tokyo_big_sight",
    nameEn: "Tokyo Big Sight",
    nameZh: "东京国际展示场",
    nameJp: "東京ビッグサイト",
    category: "special",
    imagePath: "/maps/tokyo/special/tokyo_big_sight.png",
    description: "标志性的倒金字塔会展中心",
    hasBasketballCourt: false,
    unlockLevel: 9,
    connectedScenes: ["ariake_arena", "odaiba_seaside"],
    npcs: ["npc_big_sight_exhibitor", "npc_big_sight_visitor"],
    items: ["exhibition_catalog", "convention_badge"],
    quests: ["quest_big_sight_expo"]
  },
  {
    id: "haneda_airport",
    nameEn: "Haneda Airport International Terminal",
    nameZh: "羽田机场国际航站楼",
    nameJp: "羽田空港国際線ターミナル",
    category: "special",
    imagePath: "/maps/tokyo/special/haneda_airport.png",
    description: "现代化的国际机场，连接世界的门户",
    hasBasketballCourt: false,
    unlockLevel: 12,
    connectedScenes: ["ota_gymnasium", "tokyo_disneyland"],
    npcs: ["npc_haneda_pilot", "npc_haneda_traveler"],
    items: ["boarding_pass", "duty_free_goods"],
    quests: ["quest_haneda_world_tour"]
  }
];

// 根据分类获取场景
export function getScenesByCategory(category: TokyoScene["category"]): TokyoScene[] {
  return TOKYO_SCENES.filter(scene => scene.category === category);
}

// 根据ID获取场景
export function getSceneById(id: string): TokyoScene | undefined {
  return TOKYO_SCENES.find(scene => scene.id === id);
}

// 获取有篮球场的场景
export function getScenesWithBasketballCourt(): TokyoScene[] {
  return TOKYO_SCENES.filter(scene => scene.hasBasketballCourt);
}

// 根据等级获取可解锁的场景
export function getUnlockedScenes(playerLevel: number): TokyoScene[] {
  return TOKYO_SCENES.filter(scene => scene.unlockLevel <= playerLevel);
}

// 获取场景的连接场景
export function getConnectedScenes(sceneId: string): TokyoScene[] {
  const scene = getSceneById(sceneId);
  if (!scene) return [];
  
  return scene.connectedScenes
    .map(id => getSceneById(id))
    .filter((s): s is TokyoScene => s !== undefined);
}

