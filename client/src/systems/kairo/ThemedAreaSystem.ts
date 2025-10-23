/**
 * 主题区域系统 - Basketball Club Story
 * 实现63个主题区域的检测和协同效应计算
 */

export interface ThemedAreaDefinition {
  id: string;
  name: string;
  facilities: string[]; // 2-3个设施ID
  effect: {
    type: "price" | "popular" | "popularity" | "stock" | "exp" | "upkeep";
    value: number;
  };
  description: string;
}

/**
 * 63个主题区域的完整定义
 */
export const THEMED_AREAS: ThemedAreaDefinition[] = [
  {
    id: "rest-area",
    name: "休息区",
    facilities: ["bench", "vending-machine"],
    effect: { type: "price", value: 10 },
    description: "长凳和贩卖机的组合，提供舒适的休息环境"
  },
  {
    id: "drink-area",
    name: "饮料区",
    facilities: ["drink-stand", "vending-machine"],
    effect: { type: "popular", value: 5 },
    description: "饮料摊和贩卖机的组合，吸引口渴的访客"
  },
  {
    id: "restaurant-area",
    name: "餐厅区",
    facilities: ["pizza-parlor", "cafeteria"],
    effect: { type: "price", value: 20 },
    description: "披萨店和自助餐厅的组合，提供多样化餐饮"
  },
  {
    id: "food-truck-area",
    name: "餐车区",
    facilities: ["crepe-truck", "kebab-wagon"],
    effect: { type: "upkeep", value: -50 },
    description: "可丽饼和烤肉串餐车的组合，降低运营成本"
  },
  {
    id: "study-area",
    name: "学习区",
    facilities: ["school", "stationery-shop", "bookstore"],
    effect: { type: "stock", value: 15 },
    description: "学校、文具店和书店的组合，创造学习氛围"
  },
  {
    id: "team-activity-area",
    name: "团队活动区",
    facilities: ["school", "gym"],
    effect: { type: "exp", value: 20 },
    description: "学校和健身房的组合，提升团队训练效果"
  },
  {
    id: "workout-area",
    name: "锻炼区",
    facilities: ["trampoline", "mini-practice-court", "sports-gym"],
    effect: { type: "exp", value: 10 },
    description: "蹦床、迷你训练场和运动健身房的组合"
  },
  {
    id: "serene-area",
    name: "宁静区",
    facilities: ["bamboo-grove", "tea-parlor"],
    effect: { type: "popular", value: 7 },
    description: "竹林和茶室的组合，营造禅意氛围"
  },
  {
    id: "power-area",
    name: "能源区",
    facilities: ["solar-panel", "solar-panel"],
    effect: { type: "upkeep", value: -50 },
    description: "双太阳能板的组合，大幅降低能源成本"
  },
  {
    id: "snack-area",
    name: "小吃区",
    facilities: ["fritter-stall", "crepe-truck", "popcorn-stall"],
    effect: { type: "stock", value: 10 },
    description: "油炸小吃、可丽饼和爆米花的组合"
  },
  {
    id: "team-support-area",
    name: "球队支持区",
    facilities: ["team-flag", "big-screen"],
    effect: { type: "exp", value: 12 },
    description: "球队旗帜和大屏幕的组合，激励球队士气"
  },
  {
    id: "fun-area",
    name: "娱乐区",
    facilities: ["ferris-wheel", "bouncy-house"],
    effect: { type: "price", value: 100 },
    description: "摩天轮和充气城堡的组合，提供高端娱乐"
  },
  {
    id: "hot-and-toasty-area",
    name: "热辣区",
    facilities: ["pizza-parlor", "fritter-stall", "kebab-wagon"],
    effect: { type: "popular", value: 15 },
    description: "披萨、油炸小吃和烤肉串的组合，香气四溢"
  },
  {
    id: "yum-area",
    name: "美味区",
    facilities: ["restaurant", "cafeteria"],
    effect: { type: "price", value: 20 },
    description: "餐厅和自助餐厅的组合，满足各种口味"
  },
  {
    id: "garden-area",
    name: "花园区",
    facilities: ["azalea", "camellia"],
    effect: { type: "popularity", value: 20 },
    description: "杜鹃花和山茶花的组合，打造美丽花园"
  },
  {
    id: "cooldown-area",
    name: "降温区",
    facilities: ["fountain", "pond"],
    effect: { type: "popular", value: 7 },
    description: "喷泉和池塘的组合，提供清凉环境"
  },
  {
    id: "relaxation-area",
    name: "放松区",
    facilities: ["park", "fountain", "water-fountain"],
    effect: { type: "upkeep", value: -50 },
    description: "公园、喷泉和饮水机的组合，创造休闲空间"
  },
  {
    id: "team-spirit-area",
    name: "团队精神区",
    facilities: ["locker-room", "storehouse"],
    effect: { type: "exp", value: 5 },
    description: "更衣室和仓库的组合，强化团队凝聚力"
  },
  {
    id: "stocked-area",
    name: "库存区",
    facilities: ["merch-store", "official-merch-store"],
    effect: { type: "exp", value: 5 },
    description: "周边商店和官方周边店的组合"
  },
  {
    id: "shopping-area",
    name: "购物区",
    facilities: ["merch-store", "boutique"],
    effect: { type: "stock", value: 7 },
    description: "周边商店和精品店的组合"
  },
  {
    id: "event-area",
    name: "活动区",
    facilities: ["mini-practice-court", "shower-room"],
    effect: { type: "exp", value: 7 },
    description: "迷你训练场和淋浴室的组合"
  },
  {
    id: "vacation-area",
    name: "度假区",
    facilities: ["movie-theater", "museum"],
    effect: { type: "price", value: 100 },
    description: "电影院和博物馆的组合，提供文化体验"
  },
  {
    id: "splash-area",
    name: "水上区",
    facilities: ["pool", "fishing-pond", "spa"],
    effect: { type: "popular", value: 25 },
    description: "游泳池、钓鱼池和温泉的组合"
  },
  {
    id: "resort-area",
    name: "度假村区",
    facilities: ["hotel", "coconut-palm"],
    effect: { type: "price", value: 50 },
    description: "酒店和椰子树的组合，营造热带度假氛围"
  },
  {
    id: "mystery-area",
    name: "神秘区",
    facilities: ["fortune-teller", "watchmaker"],
    effect: { type: "stock", value: 5 },
    description: "占卜屋和钟表店的组合，增添神秘色彩"
  },
  {
    id: "music-area",
    name: "音乐区",
    facilities: ["cd-store", "music-shop"],
    effect: { type: "upkeep", value: -50 },
    description: "CD店和乐器店的组合"
  },
  {
    id: "griddle-area",
    name: "观影区",
    facilities: ["movie-theater", "popcorn-stall", "drink-stand"],
    effect: { type: "popular", value: 15 },
    description: "电影院、爆米花和饮料的完美组合"
  },
  {
    id: "daily-life-area",
    name: "生活区",
    facilities: ["dry-cleaner", "drugstore", "barber-shop"],
    effect: { type: "upkeep", value: -50 },
    description: "干洗店、药店和理发店的组合"
  },
  {
    id: "botanical-area",
    name: "植物区",
    facilities: ["florist", "shrub"],
    effect: { type: "stock", value: 7 },
    description: "花店和灌木丛的组合"
  },
  {
    id: "oriental-area",
    name: "东方区",
    facilities: ["camellia", "pine-tree", "bamboo-grove"],
    effect: { type: "upkeep", value: -70 },
    description: "山茶花、松树和竹林的组合，展现东方美学"
  },
  {
    id: "training-area",
    name: "训练区",
    facilities: ["sports-gym", "pool"],
    effect: { type: "exp", value: 20 },
    description: "运动健身房和游泳池的组合"
  },
  {
    id: "seasonal-area",
    name: "四季区",
    facilities: ["azalea", "sunflower", "cosmos-flowerbed"],
    effect: { type: "popular", value: 7 },
    description: "杜鹃花、向日葵和波斯菊的组合"
  },
  {
    id: "topiary-area",
    name: "造型树区",
    facilities: ["rabbit-topiary", "giraffe-topiary", "horse-topiary"],
    effect: { type: "popular", value: 7 },
    description: "兔子、长颈鹿和马造型树的组合"
  },
  {
    id: "snippy-area",
    name: "剪裁区",
    facilities: ["stationery-shop", "barber-shop", "florist"],
    effect: { type: "stock", value: 10 },
    description: "文具店、理发店和花店的组合"
  },
  {
    id: "flower-area",
    name: "花卉区",
    facilities: ["florist", "azalea"],
    effect: { type: "stock", value: 5 },
    description: "花店和杜鹃花的组合"
  },
  {
    id: "jump-area",
    name: "跳跃区",
    facilities: ["trampoline", "popcorn-stall", "rabbit-topiary"],
    effect: { type: "price", value: 20 },
    description: "蹦床、爆米花和兔子造型树的组合"
  },
  {
    id: "spa-area",
    name: "温泉区",
    facilities: ["spa", "hotel"],
    effect: { type: "popular", value: 15 },
    description: "温泉和酒店的组合，提供豪华体验"
  },
  {
    id: "retro-area",
    name: "复古区",
    facilities: ["watchmaker", "museum"],
    effect: { type: "upkeep", value: -50 },
    description: "钟表店和博物馆的组合，怀旧氛围"
  },
  {
    id: "bench-area",
    name: "长凳区",
    facilities: ["bench", "white-bench"],
    effect: { type: "upkeep", value: -50 },
    description: "普通长凳和白色长凳的组合"
  },
  {
    id: "info-area",
    name: "信息区",
    facilities: ["newspaper-stand", "big-screen"],
    effect: { type: "exp", value: 10 },
    description: "报刊亭和大屏幕的组合"
  },
  {
    id: "fishing-area",
    name: "钓鱼区",
    facilities: ["fishing-pond", "pond"],
    effect: { type: "upkeep", value: -50 },
    description: "钓鱼池和池塘的组合"
  },
  {
    id: "regulars-only-area",
    name: "常客区",
    facilities: ["cafeteria", "locker-room"],
    effect: { type: "popular", value: 5 },
    description: "自助餐厅和更衣室的组合"
  },
  {
    id: "first-aid-area",
    name: "急救区",
    facilities: ["drugstore", "water-fountain"],
    effect: { type: "upkeep", value: -50 },
    description: "药店和饮水机的组合"
  },
  {
    id: "flowerbed-area",
    name: "花坛区",
    facilities: ["bench", "cosmos-flowerbed"],
    effect: { type: "popular", value: 5 },
    description: "长凳和波斯菊花坛的组合"
  },
  {
    id: "summer-area",
    name: "夏日区",
    facilities: ["sunflower", "pool"],
    effect: { type: "popular", value: 10 },
    description: "向日葵和游泳池的组合"
  },
  {
    id: "gentlemens-area",
    name: "绅士区",
    facilities: ["watchmaker", "barber-shop"],
    effect: { type: "price", value: 20 },
    description: "钟表店和理发店的组合"
  },
  {
    id: "quick-dry-area",
    name: "快干区",
    facilities: ["dry-cleaner", "pond"],
    effect: { type: "price", value: 10 },
    description: "干洗店和池塘的组合"
  },
  {
    id: "nature-area",
    name: "自然区",
    facilities: ["pine-tree", "pond"],
    effect: { type: "upkeep", value: -50 },
    description: "松树和池塘的组合"
  },
  {
    id: "test-area",
    name: "测试区",
    facilities: ["mini-practice-court"],
    effect: { type: "exp", value: 10 },
    description: "迷你训练场的特殊区域"
  },
  {
    id: "horse-area",
    name: "马术区",
    facilities: ["horse-topiary"],
    effect: { type: "popular", value: 10 },
    description: "马造型树的特殊区域"
  },
  {
    id: "tranquility-area",
    name: "宁静区",
    facilities: ["bamboo-grove", "bamboo-grove", "bamboo-grove"],
    effect: { type: "popular", value: 7 },
    description: "三个竹林的组合，极致禅意"
  }
];

/**
 * 设施位置信息
 */
export interface FacilityPlacement {
  facilityId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 检测到的主题区域
 */
export interface DetectedThemedArea {
  areaDefinition: ThemedAreaDefinition;
  facilities: FacilityPlacement[];
  centerPosition: { x: number; y: number };
}

/**
 * 主题区域系统类
 */
export class ThemedAreaSystem {
  /**
   * 检测所有已形成的主题区域
   */
  static detectThemedAreas(placements: FacilityPlacement[]): DetectedThemedArea[] {
    const detectedAreas: DetectedThemedArea[] = [];

    for (const areaDefinition of THEMED_AREAS) {
      const matches = this.findAreaMatches(areaDefinition, placements);
      detectedAreas.push(...matches);
    }

    return detectedAreas;
  }

  /**
   * 查找特定主题区域的所有匹配
   */
  private static findAreaMatches(
    areaDefinition: ThemedAreaDefinition,
    placements: FacilityPlacement[]
  ): DetectedThemedArea[] {
    const matches: DetectedThemedArea[] = [];
    const requiredFacilities = areaDefinition.facilities;

    // 如果需要多个相同设施（如三个竹林）
    const facilityCounts = new Map<string, number>();
    for (const facilityId of requiredFacilities) {
      facilityCounts.set(facilityId, (facilityCounts.get(facilityId) || 0) + 1);
    }

    // 查找所有可能的组合
    const combinations = this.findFacilityCombinations(
      placements,
      facilityCounts
    );

    for (const combination of combinations) {
      // 检查设施是否相邻
      if (this.areFacilitiesAdjacent(combination)) {
        const centerPos = this.calculateCenterPosition(combination);
        matches.push({
          areaDefinition,
          facilities: combination,
          centerPosition: centerPos
        });
      }
    }

    return matches;
  }

  /**
   * 查找设施的所有可能组合
   */
  private static findFacilityCombinations(
    placements: FacilityPlacement[],
    requiredCounts: Map<string, number>
  ): FacilityPlacement[][] {
    const combinations: FacilityPlacement[][] = [];
    
    // 按设施类型分组
    const facilityGroups = new Map<string, FacilityPlacement[]>();
    for (const placement of placements) {
      if (!facilityGroups.has(placement.facilityId)) {
        facilityGroups.set(placement.facilityId, []);
      }
      facilityGroups.get(placement.facilityId)!.push(placement);
    }

    // 递归生成组合
    const generate = (
      current: FacilityPlacement[],
      remaining: Map<string, number>
    ) => {
      if (remaining.size === 0) {
        combinations.push([...current]);
        return;
      }

      const [facilityId, count] = Array.from(remaining.entries())[0];
      const availableFacilities = facilityGroups.get(facilityId) || [];

      // 选择count个该类型的设施
      this.selectCombinations(availableFacilities, count, (selected) => {
        const newRemaining = new Map(remaining);
        newRemaining.delete(facilityId);
        generate([...current, ...selected], newRemaining);
      });
    };

    generate([], requiredCounts);
    return combinations;
  }

  /**
   * 从数组中选择n个元素的所有组合
   */
  private static selectCombinations<T>(
    arr: T[],
    n: number,
    callback: (selected: T[]) => void,
    start = 0,
    current: T[] = []
  ) {
    if (current.length === n) {
      callback(current);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      this.selectCombinations(arr, n, callback, i + 1, [...current, arr[i]]);
    }
  }

  /**
   * 检查设施是否相邻（在3格范围内）
   */
  private static areFacilitiesAdjacent(facilities: FacilityPlacement[]): boolean {
    if (facilities.length <= 1) return true;

    const MAX_DISTANCE = 3; // 最大相邻距离（格子数）

    for (let i = 0; i < facilities.length; i++) {
      let hasAdjacentNeighbor = false;
      
      for (let j = 0; j < facilities.length; j++) {
        if (i === j) continue;

        const distance = this.calculateDistance(facilities[i], facilities[j]);
        if (distance <= MAX_DISTANCE) {
          hasAdjacentNeighbor = true;
          break;
        }
      }

      if (!hasAdjacentNeighbor && facilities.length > 1) {
        return false;
      }
    }

    return true;
  }

  /**
   * 计算两个设施之间的距离
   */
  private static calculateDistance(
    f1: FacilityPlacement,
    f2: FacilityPlacement
  ): number {
    const center1 = {
      x: f1.x + f1.width / 2,
      y: f1.y + f1.height / 2
    };
    const center2 = {
      x: f2.x + f2.width / 2,
      y: f2.y + f2.height / 2
    };

    return Math.sqrt(
      Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2)
    );
  }

  /**
   * 计算设施组的中心位置
   */
  private static calculateCenterPosition(
    facilities: FacilityPlacement[]
  ): { x: number; y: number } {
    let totalX = 0;
    let totalY = 0;

    for (const facility of facilities) {
      totalX += facility.x + facility.width / 2;
      totalY += facility.y + facility.height / 2;
    }

    return {
      x: totalX / facilities.length,
      y: totalY / facilities.length
    };
  }

  /**
   * 计算主题区域的总效果加成
   */
  static calculateTotalEffects(detectedAreas: DetectedThemedArea[]): {
    price: number;
    popular: number;
    popularity: number;
    stock: number;
    exp: number;
    upkeep: number;
  } {
    const totals = {
      price: 0,
      popular: 0,
      popularity: 0,
      stock: 0,
      exp: 0,
      upkeep: 0
    };

    for (const area of detectedAreas) {
      const effect = area.areaDefinition.effect;
      totals[effect.type] += effect.value;
    }

    return totals;
  }

  /**
   * 获取设施可能形成的主题区域建议
   */
  static getSuggestedAreas(facilityId: string): ThemedAreaDefinition[] {
    return THEMED_AREAS.filter(area =>
      area.facilities.includes(facilityId)
    );
  }
}

