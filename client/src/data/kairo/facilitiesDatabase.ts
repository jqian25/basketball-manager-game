/**
 * 设施数据库 - Basketball Club Story 完整设施定义
 * 包含所有60个设施的属性、成本、效果
 */

export interface FacilityDefinition {
  id: string;
  name: string;
  category: "amenity" | "training" | "decoration" | "nature";
  buildCost: number;
  maintenanceCost: number;
  size: { width: number; height: number }; // 格子单位
  maxLevel: number;
  levelUpCost: number;
  imagePath: string;
  description: string;
  baseEffects: {
    popularity?: number;
    training?: number;
    price?: number;
    stock?: number;
    exp?: number;
    upkeep?: number;
  };
  unlockCondition?: {
    type: "level" | "money" | "popularity" | "facility";
    value: number | string;
  };
}

/**
 * 所有设施的完整数据库
 */
export const FACILITIES_DATABASE: Record<string, FacilityDefinition> = {
  // ==================== 基础设施 ====================
  "bench": {
    id: "bench",
    name: "长凳",
    category: "amenity",
    buildCost: 500,
    maintenanceCost: 10,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 200,
    imagePath: "/kairo/facilities/bench.png",
    description: "供访客休息的长凳，提升舒适度",
    baseEffects: {
      popularity: 2
    }
  },
  
  "vending-machine": {
    id: "vending-machine",
    name: "自动贩卖机",
    category: "amenity",
    buildCost: 1000,
    maintenanceCost: 50,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 400,
    imagePath: "/kairo/facilities/vending-machine.png",
    description: "提供饮料和小吃，增加收入",
    baseEffects: {
      price: 5,
      popularity: 3
    }
  },

  "drink-stand": {
    id: "drink-stand",
    name: "饮料摊",
    category: "amenity",
    buildCost: 1500,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 600,
    imagePath: "/kairo/facilities/drink-stand.png",
    description: "售卖各种饮料，提升人气",
    baseEffects: {
      popularity: 5,
      price: 8
    }
  },

  "pizza-parlor": {
    id: "pizza-parlor",
    name: "披萨店",
    category: "amenity",
    buildCost: 5000,
    maintenanceCost: 200,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/pizza-parlor.png",
    description: "提供美味披萨，大幅提升收入",
    baseEffects: {
      price: 20,
      popularity: 10
    }
  },

  "crepe-truck": {
    id: "crepe-truck",
    name: "可丽饼餐车",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/crepe-truck.png",
    description: "移动餐车，降低维护成本",
    baseEffects: {
      upkeep: -50,
      popularity: 6
    }
  },

  "kebab-wagon": {
    id: "kebab-wagon",
    name: "烤肉串餐车",
    category: "amenity",
    buildCost: 3500,
    maintenanceCost: 120,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1400,
    imagePath: "/kairo/facilities/kebab-wagon.png",
    description: "烤肉串餐车，降低维护成本",
    baseEffects: {
      upkeep: -50,
      popularity: 7
    }
  },

  // ==================== 训练设施 ====================
  "school": {
    id: "school",
    name: "学校",
    category: "training",
    buildCost: 10000,
    maintenanceCost: 300,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 4000,
    imagePath: "/kairo/facilities/school.png",
    description: "提供学习环境，提升球员智力和经验",
    baseEffects: {
      exp: 20,
      training: 15
    }
  },

  "gym": {
    id: "gym",
    name: "健身房",
    category: "training",
    buildCost: 8000,
    maintenanceCost: 250,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 3200,
    imagePath: "/kairo/facilities/gym.png",
    description: "提供力量训练设备，提升体能",
    baseEffects: {
      exp: 20,
      training: 20
    }
  },

  "sports-gym": {
    id: "sports-gym",
    name: "运动健身房",
    category: "training",
    buildCost: 12000,
    maintenanceCost: 350,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 4800,
    imagePath: "/kairo/facilities/sports-gym.png",
    description: "专业运动训练设施，大幅提升训练效果",
    baseEffects: {
      exp: 10,
      training: 30
    }
  },

  "trampoline": {
    id: "trampoline",
    name: "蹦床",
    category: "training",
    buildCost: 4000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/trampoline.png",
    description: "提升跳跃能力训练",
    baseEffects: {
      training: 15,
      popularity: 5
    }
  },

  "mini-practice-court": {
    id: "mini-practice-court",
    name: "迷你训练场",
    category: "training",
    buildCost: 6000,
    maintenanceCost: 150,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2400,
    imagePath: "/kairo/facilities/mini-practice-court.png",
    description: "小型篮球训练场地",
    baseEffects: {
      exp: 7,
      training: 25
    }
  },

  "pool": {
    id: "pool",
    name: "游泳池",
    category: "training",
    buildCost: 15000,
    maintenanceCost: 400,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 6000,
    imagePath: "/kairo/facilities/pool.png",
    description: "提供恢复训练和体能提升",
    baseEffects: {
      exp: 20,
      training: 20,
      popularity: 10
    }
  },

  // ==================== 商店设施 ====================
  "stationery-shop": {
    id: "stationery-shop",
    name: "文具店",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/stationery-shop.png",
    description: "售卖文具用品",
    baseEffects: {
      stock: 10,
      price: 5
    }
  },

  "bookstore": {
    id: "bookstore",
    name: "书店",
    category: "amenity",
    buildCost: 4000,
    maintenanceCost: 120,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/bookstore.png",
    description: "售卖书籍，提升文化氛围",
    baseEffects: {
      stock: 15,
      popularity: 5
    }
  },

  "merch-store": {
    id: "merch-store",
    name: "周边商店",
    category: "amenity",
    buildCost: 8000,
    maintenanceCost: 200,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 3200,
    imagePath: "/kairo/facilities/merch-store.png",
    description: "售卖球队周边商品",
    baseEffects: {
      exp: 5,
      stock: 20,
      price: 15
    }
  },

  "official-merch-store": {
    id: "official-merch-store",
    name: "官方周边店",
    category: "amenity",
    buildCost: 12000,
    maintenanceCost: 300,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 4800,
    imagePath: "/kairo/facilities/official-merch-store.png",
    description: "官方授权周边商店，高收入",
    baseEffects: {
      exp: 5,
      stock: 30,
      price: 25
    }
  },

  "boutique": {
    id: "boutique",
    name: "精品店",
    category: "amenity",
    buildCost: 6000,
    maintenanceCost: 150,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2400,
    imagePath: "/kairo/facilities/boutique.png",
    description: "高端精品商店",
    baseEffects: {
      stock: 7,
      popularity: 8,
      price: 12
    }
  },

  // ==================== 餐饮设施 ====================
  "restaurant": {
    id: "restaurant",
    name: "餐厅",
    category: "amenity",
    buildCost: 10000,
    maintenanceCost: 300,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 4000,
    imagePath: "/kairo/facilities/restaurant.png",
    description: "提供正餐服务",
    baseEffects: {
      price: 20,
      popularity: 12
    }
  },

  "cafeteria": {
    id: "cafeteria",
    name: "自助餐厅",
    category: "amenity",
    buildCost: 8000,
    maintenanceCost: 250,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 3200,
    imagePath: "/kairo/facilities/cafeteria.png",
    description: "自助餐厅，性价比高",
    baseEffects: {
      price: 20,
      popularity: 10
    }
  },

  "fritter-stall": {
    id: "fritter-stall",
    name: "油炸小吃摊",
    category: "amenity",
    buildCost: 2000,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 800,
    imagePath: "/kairo/facilities/fritter-stall.png",
    description: "售卖油炸小吃",
    baseEffects: {
      stock: 10,
      popularity: 6
    }
  },

  "popcorn-stall": {
    id: "popcorn-stall",
    name: "爆米花摊",
    category: "amenity",
    buildCost: 1500,
    maintenanceCost: 60,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 600,
    imagePath: "/kairo/facilities/popcorn-stall.png",
    description: "售卖爆米花和零食",
    baseEffects: {
      stock: 10,
      popularity: 5
    }
  },

  "tea-parlor": {
    id: "tea-parlor",
    name: "茶室",
    category: "amenity",
    buildCost: 5000,
    maintenanceCost: 150,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/tea-parlor.png",
    description: "提供茶饮服务，营造宁静氛围",
    baseEffects: {
      popularity: 7,
      price: 10
    }
  },

  // ==================== 自然装饰 ====================
  "bamboo-grove": {
    id: "bamboo-grove",
    name: "竹林",
    category: "nature",
    buildCost: 3000,
    maintenanceCost: 50,
    size: { width: 2, height: 2 },
    maxLevel: 3,
    levelUpCost: 1000,
    imagePath: "/kairo/facilities/bamboo-grove.png",
    description: "竹林景观，提升环境美感",
    baseEffects: {
      popularity: 7
    }
  },

  "azalea": {
    id: "azalea",
    name: "杜鹃花",
    category: "nature",
    buildCost: 1000,
    maintenanceCost: 20,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 400,
    imagePath: "/kairo/facilities/azalea.png",
    description: "美丽的杜鹃花",
    baseEffects: {
      popularity: 20
    }
  },

  "camellia": {
    id: "camellia",
    name: "山茶花",
    category: "nature",
    buildCost: 1200,
    maintenanceCost: 25,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 480,
    imagePath: "/kairo/facilities/camellia.png",
    description: "优雅的山茶花",
    baseEffects: {
      popularity: 20
    }
  },

  "fountain": {
    id: "fountain",
    name: "喷泉",
    category: "decoration",
    buildCost: 4000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/fountain.png",
    description: "装饰性喷泉",
    baseEffects: {
      popularity: 7
    }
  },

  "pond": {
    id: "pond",
    name: "池塘",
    category: "nature",
    buildCost: 3000,
    maintenanceCost: 80,
    size: { width: 3, height: 3 },
    maxLevel: 3,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/pond.png",
    description: "宁静的池塘",
    baseEffects: {
      popularity: 7,
      upkeep: -50
    }
  },

  "park": {
    id: "park",
    name: "公园",
    category: "nature",
    buildCost: 6000,
    maintenanceCost: 150,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 2400,
    imagePath: "/kairo/facilities/park.png",
    description: "休闲公园区域",
    baseEffects: {
      popularity: 10,
      upkeep: -50
    }
  },

  "water-fountain": {
    id: "water-fountain",
    name: "饮水机",
    category: "amenity",
    buildCost: 800,
    maintenanceCost: 20,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 320,
    imagePath: "/kairo/facilities/water-fountain.png",
    description: "提供免费饮用水",
    baseEffects: {
      popularity: 3,
      upkeep: -50
    }
  },

  // ==================== 功能设施 ====================
  "locker-room": {
    id: "locker-room",
    name: "更衣室",
    category: "training",
    buildCost: 5000,
    maintenanceCost: 150,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/locker-room.png",
    description: "球员更衣室",
    baseEffects: {
      exp: 5,
      training: 10
    }
  },

  "storehouse": {
    id: "storehouse",
    name: "仓库",
    category: "amenity",
    buildCost: 4000,
    maintenanceCost: 100,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/storehouse.png",
    description: "存储设备和物资",
    baseEffects: {
      exp: 5,
      stock: 20
    }
  },

  "shower-room": {
    id: "shower-room",
    name: "淋浴室",
    category: "training",
    buildCost: 3000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/shower-room.png",
    description: "球员淋浴设施",
    baseEffects: {
      exp: 7,
      training: 5
    }
  },

  // ==================== 娱乐设施 ====================
  "movie-theater": {
    id: "movie-theater",
    name: "电影院",
    category: "amenity",
    buildCost: 15000,
    maintenanceCost: 400,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 6000,
    imagePath: "/kairo/facilities/movie-theater.png",
    description: "提供电影放映服务",
    baseEffects: {
      price: 100,
      popularity: 15
    }
  },

  "museum": {
    id: "museum",
    name: "博物馆",
    category: "amenity",
    buildCost: 12000,
    maintenanceCost: 300,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 4800,
    imagePath: "/kairo/facilities/museum.png",
    description: "展示球队历史",
    baseEffects: {
      price: 100,
      popularity: 12,
      upkeep: -50
    }
  },

  "fishing-pond": {
    id: "fishing-pond",
    name: "钓鱼池",
    category: "nature",
    buildCost: 8000,
    maintenanceCost: 200,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 3200,
    imagePath: "/kairo/facilities/fishing-pond.png",
    description: "休闲钓鱼场所",
    baseEffects: {
      popularity: 25,
      upkeep: -50
    }
  },

  "spa": {
    id: "spa",
    name: "温泉",
    category: "training",
    buildCost: 20000,
    maintenanceCost: 500,
    size: { width: 4, height: 4 },
    maxLevel: 5,
    levelUpCost: 8000,
    imagePath: "/kairo/facilities/spa.png",
    description: "豪华温泉设施，恢复体力",
    baseEffects: {
      popularity: 25,
      training: 15
    }
  },

  "hotel": {
    id: "hotel",
    name: "酒店",
    category: "amenity",
    buildCost: 25000,
    maintenanceCost: 600,
    size: { width: 5, height: 5 },
    maxLevel: 5,
    levelUpCost: 10000,
    imagePath: "/kairo/facilities/hotel.png",
    description: "提供住宿服务",
    baseEffects: {
      price: 50,
      popularity: 15
    }
  },

  "coconut-palm": {
    id: "coconut-palm",
    name: "椰子树",
    category: "nature",
    buildCost: 2000,
    maintenanceCost: 40,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 800,
    imagePath: "/kairo/facilities/coconut-palm.png",
    description: "热带椰子树",
    baseEffects: {
      popularity: 5
    }
  },

  // ==================== 特殊设施 ====================
  "fortune-teller": {
    id: "fortune-teller",
    name: "占卜屋",
    category: "amenity",
    buildCost: 5000,
    maintenanceCost: 120,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/fortune-teller.png",
    description: "神秘的占卜服务",
    baseEffects: {
      stock: 5,
      popularity: 8
    }
  },

  "watchmaker": {
    id: "watchmaker",
    name: "钟表店",
    category: "amenity",
    buildCost: 4000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/watchmaker.png",
    description: "售卖精密钟表",
    baseEffects: {
      stock: 5,
      upkeep: -50
    }
  },

  "cd-store": {
    id: "cd-store",
    name: "CD店",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/cd-store.png",
    description: "售卖音乐CD",
    baseEffects: {
      upkeep: -50,
      popularity: 5
    }
  },

  "music-shop": {
    id: "music-shop",
    name: "乐器店",
    category: "amenity",
    buildCost: 5000,
    maintenanceCost: 120,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/music-shop.png",
    description: "售卖乐器",
    baseEffects: {
      upkeep: -50,
      popularity: 8
    }
  },

  "dry-cleaner": {
    id: "dry-cleaner",
    name: "干洗店",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/dry-cleaner.png",
    description: "提供干洗服务",
    baseEffects: {
      price: 10,
      upkeep: -50
    }
  },

  "drugstore": {
    id: "drugstore",
    name: "药店",
    category: "amenity",
    buildCost: 4000,
    maintenanceCost: 100,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1600,
    imagePath: "/kairo/facilities/drugstore.png",
    description: "售卖药品和保健品",
    baseEffects: {
      upkeep: -50,
      training: 5
    }
  },

  "barber-shop": {
    id: "barber-shop",
    name: "理发店",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/barber-shop.png",
    description: "提供理发服务",
    baseEffects: {
      price: 20,
      upkeep: -50
    }
  },

  "florist": {
    id: "florist",
    name: "花店",
    category: "amenity",
    buildCost: 3000,
    maintenanceCost: 80,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/florist.png",
    description: "售卖鲜花",
    baseEffects: {
      stock: 7,
      popularity: 8
    }
  },

  "shrub": {
    id: "shrub",
    name: "灌木丛",
    category: "nature",
    buildCost: 500,
    maintenanceCost: 10,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 200,
    imagePath: "/kairo/facilities/shrub.png",
    description: "装饰性灌木",
    baseEffects: {
      popularity: 2
    }
  },

  "sunflower": {
    id: "sunflower",
    name: "向日葵",
    category: "nature",
    buildCost: 800,
    maintenanceCost: 15,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 320,
    imagePath: "/kairo/facilities/sunflower.png",
    description: "明亮的向日葵",
    baseEffects: {
      popularity: 10
    }
  },

  "cosmos-flowerbed": {
    id: "cosmos-flowerbed",
    name: "波斯菊花坛",
    category: "nature",
    buildCost: 1500,
    maintenanceCost: 30,
    size: { width: 2, height: 2 },
    maxLevel: 3,
    levelUpCost: 600,
    imagePath: "/kairo/facilities/cosmos-flowerbed.png",
    description: "美丽的波斯菊花坛",
    baseEffects: {
      popularity: 5
    }
  },

  "pine-tree": {
    id: "pine-tree",
    name: "松树",
    category: "nature",
    buildCost: 2000,
    maintenanceCost: 40,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 800,
    imagePath: "/kairo/facilities/pine-tree.png",
    description: "常青松树",
    baseEffects: {
      popularity: 5,
      upkeep: -50
    }
  },

  "rabbit-topiary": {
    id: "rabbit-topiary",
    name: "兔子造型树",
    category: "decoration",
    buildCost: 2500,
    maintenanceCost: 50,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 1000,
    imagePath: "/kairo/facilities/rabbit-topiary.png",
    description: "可爱的兔子造型修剪树",
    baseEffects: {
      popularity: 7
    }
  },

  "giraffe-topiary": {
    id: "giraffe-topiary",
    name: "长颈鹿造型树",
    category: "decoration",
    buildCost: 3000,
    maintenanceCost: 60,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 1200,
    imagePath: "/kairo/facilities/giraffe-topiary.png",
    description: "长颈鹿造型修剪树",
    baseEffects: {
      popularity: 7
    }
  },

  "horse-topiary": {
    id: "horse-topiary",
    name: "马造型树",
    category: "decoration",
    buildCost: 2800,
    maintenanceCost: 55,
    size: { width: 1, height: 1 },
    maxLevel: 3,
    levelUpCost: 1120,
    imagePath: "/kairo/facilities/horse-topiary.png",
    description: "马造型修剪树",
    baseEffects: {
      popularity: 10
    }
  },

  "white-bench": {
    id: "white-bench",
    name: "白色长凳",
    category: "decoration",
    buildCost: 600,
    maintenanceCost: 12,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 240,
    imagePath: "/kairo/facilities/white-bench.png",
    description: "优雅的白色长凳",
    baseEffects: {
      upkeep: -50
    }
  },

  "newspaper-stand": {
    id: "newspaper-stand",
    name: "报刊亭",
    category: "amenity",
    buildCost: 2000,
    maintenanceCost: 50,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 800,
    imagePath: "/kairo/facilities/newspaper-stand.png",
    description: "售卖报纸杂志",
    baseEffects: {
      exp: 10,
      stock: 5
    }
  },

  // ==================== 高级设施 ====================
  "team-flag": {
    id: "team-flag",
    name: "球队旗帜",
    category: "decoration",
    buildCost: 5000,
    maintenanceCost: 100,
    size: { width: 1, height: 1 },
    maxLevel: 5,
    levelUpCost: 2000,
    imagePath: "/kairo/facilities/team-flag.png",
    description: "展示球队荣誉",
    baseEffects: {
      exp: 12,
      popularity: 10
    }
  },

  "big-screen": {
    id: "big-screen",
    name: "大屏幕",
    category: "amenity",
    buildCost: 15000,
    maintenanceCost: 400,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 6000,
    imagePath: "/kairo/facilities/big-screen.png",
    description: "大型显示屏",
    baseEffects: {
      exp: 12,
      popularity: 15,
      upkeep: -50
    }
  },

  "ferris-wheel": {
    id: "ferris-wheel",
    name: "摩天轮",
    category: "amenity",
    buildCost: 30000,
    maintenanceCost: 800,
    size: { width: 5, height: 5 },
    maxLevel: 5,
    levelUpCost: 12000,
    imagePath: "/kairo/facilities/ferris-wheel.png",
    description: "大型摩天轮游乐设施",
    baseEffects: {
      price: 100,
      popularity: 30
    }
  },

  "bouncy-house": {
    id: "bouncy-house",
    name: "充气城堡",
    category: "amenity",
    buildCost: 8000,
    maintenanceCost: 200,
    size: { width: 3, height: 3 },
    maxLevel: 5,
    levelUpCost: 3200,
    imagePath: "/kairo/facilities/bouncy-house.png",
    description: "儿童充气游乐设施",
    baseEffects: {
      price: 100,
      popularity: 15
    }
  },

  "solar-panel": {
    id: "solar-panel",
    name: "太阳能板",
    category: "decoration",
    buildCost: 10000,
    maintenanceCost: 50,
    size: { width: 2, height: 2 },
    maxLevel: 5,
    levelUpCost: 4000,
    imagePath: "/kairo/facilities/solar-panel.png",
    description: "环保太阳能发电",
    baseEffects: {
      upkeep: -50
    }
  }
};

/**
 * 根据类别获取设施列表
 */
export function getFacilitiesByCategory(category: FacilityDefinition["category"]): FacilityDefinition[] {
  return Object.values(FACILITIES_DATABASE).filter(f => f.category === category);
}

/**
 * 根据ID获取设施定义
 */
export function getFacilityById(id: string): FacilityDefinition | undefined {
  return FACILITIES_DATABASE[id];
}

/**
 * 获取所有可建造的设施（根据解锁条件）
 */
export function getAvailableFacilities(
  clubLevel: number,
  money: number,
  popularity: number,
  builtFacilities: string[]
): FacilityDefinition[] {
  return Object.values(FACILITIES_DATABASE).filter(facility => {
    if (!facility.unlockCondition) return true;
    
    switch (facility.unlockCondition.type) {
      case "level":
        return clubLevel >= (facility.unlockCondition.value as number);
      case "money":
        return money >= (facility.unlockCondition.value as number);
      case "popularity":
        return popularity >= (facility.unlockCondition.value as number);
      case "facility":
        return builtFacilities.includes(facility.unlockCondition.value as string);
      default:
        return true;
    }
  });
}

