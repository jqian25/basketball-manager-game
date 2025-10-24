// client/src/game/maps/ArenaMaps.ts

/**
 * @fileoverview 定义竹技场（Arena）的地图配置数据。
 * 风格参考宝可梦Game Boy（GB）系列，数据结构应易于Phaser 3 Tilemap加载和使用。
 */

// ----------------------------------------------------------------------
// 1. 数据模型定义
// ----------------------------------------------------------------------

/**
 * 竞技场（竹技场）的类型，用于区分不同的主题或难度。
 */
export enum ArenaType {
    Grass = "Grass",      // 草地
    Rock = "Rock",        // 岩石
    Water = "Water",      // 水域
    Fire = "Fire",        // 火山/熔岩
    Ice = "Ice",          // 冰雪
    Electric = "Electric",  // 电气
    Ground = "Ground",      // 泥土/地面
    Poison = "Poison",      // 毒沼
    Psychic = "Psychic",    // 超能力
    Fighting = "Fighting",  // 格斗
    Ghost = "Ghost",      // 幽灵
    Dragon = "Dragon",      // 龙
}

/**
 * 地图瓦片集 (Tileset) 的配置。
 * 宝可梦GB风格通常使用一个或少数几个Tileset。
 */
export interface TilesetConfig {
    name: string;      // 在Tiled中定义的Tileset名称
    image: string;     // 对应的图片文件路径 (相对于assets目录)
}

/**
 * 竞技场地图的详细配置接口。
 * 模拟宝可梦GB风格的地图数据，包含地图文件、入口、出口等信息。
 */
export interface ArenaMapConfig {
    id: number;
    name: string;
    type: ArenaType;
    mapFile: string;      // Tiled JSON文件路径 (相对于assets/maps目录)
    tilesets: TilesetConfig[]; // 地图使用的Tileset配置
    entryPoint: { x: number, y: number, direction: 'up' | 'down' | 'left' | 'right' }; // 玩家进入地图的起始位置和朝向
    exitPoint: { x: number, y: number, targetMapId: number }; // 离开竞技场的出口位置和目标地图ID
    bossTrainer: {
        name: string;
        spriteKey: string;
        dialogue: string[]; // 战斗前的对话
    };
    // 宝可梦GB风格的地图通常有特定的“谜题”或环境效果
    specialEffect?: string; // 例如：冰面滑行，黑暗区域，传送带等
}

// ----------------------------------------------------------------------
// 2. 12个竹技场地图配置数据
// ----------------------------------------------------------------------

/**
 * 存储所有12个竹技场地图配置的常量对象。
 * 键为ArenaMapConfig.id。
 */
export const ArenaMaps: { [key: number]: ArenaMapConfig } = {
    // --------------------------------------------------
    // 第 1 技场：草地 - 基础训练
    // --------------------------------------------------
    1: {
        id: 1,
        name: "青竹试炼场",
        type: ArenaType.Grass,
        mapFile: "arena_01_grass.json",
        tilesets: [
            { name: "GrassTileset", image: "tiles/grass_gb.png" },
        ],
        entryPoint: { x: 10, y: 15, direction: 'up' },
        exitPoint: { x: 10, y: 16, targetMapId: 0 }, // 0代表返回城镇
        bossTrainer: {
            name: "训练家 小叶",
            spriteKey: "trainer_leaf",
            dialogue: ["欢迎来到第一个竹技场！让我看看你的基础实力！", "做好准备了吗？"],
        },
        specialEffect: "无",
    },

    // --------------------------------------------------
    // 第 2 技场：岩石 - 防御与坚韧
    // --------------------------------------------------
    2: {
        id: 2,
        name: "磐石之壁",
        type: ArenaType.Rock,
        mapFile: "arena_02_rock.json",
        tilesets: [
            { name: "RockTileset", image: "tiles/rock_gb.png" },
        ],
        entryPoint: { x: 5, y: 10, direction: 'up' },
        exitPoint: { x: 5, y: 11, targetMapId: 0 },
        bossTrainer: {
            name: "岩石大师 阿力",
            spriteKey: "trainer_brock",
            dialogue: ["我的竹子像岩石一样坚硬！你能突破我的防线吗？", "来吧，展示你的力量！"],
        },
        specialEffect: "地图中有许多不可破坏的岩石障碍物，需要绕行。",
    },

    // --------------------------------------------------
    // 第 3 技场：水域 - 速度与灵活
    // --------------------------------------------------
    3: {
        id: 3,
        name: "碧波竹海",
        type: ArenaType.Water,
        mapFile: "arena_03_water.json",
        tilesets: [
            { name: "WaterTileset", image: "tiles/water_gb.png" },
        ],
        entryPoint: { x: 12, y: 18, direction: 'up' },
        exitPoint: { x: 12, y: 19, targetMapId: 0 },
        bossTrainer: {
            name: "水手 蓝心",
            spriteKey: "trainer_misty",
            dialogue: ["水是生命之源，也是最难捉摸的对手。", "在我的竹海中，只有速度才能取胜！"],
        },
        specialEffect: "部分区域为水面，移动速度减半，且只能通过特定桥梁。",
    },

    // --------------------------------------------------
    // 第 4 技场：火焰 - 攻击与爆发
    // --------------------------------------------------
    4: {
        id: 4,
        name: "赤焰竹窟",
        type: ArenaType.Fire,
        mapFile: "arena_04_fire.json",
        tilesets: [
            { name: "FireTileset", image: "tiles/fire_gb.png" },
        ],
        entryPoint: { x: 8, y: 20, direction: 'up' },
        exitPoint: { x: 8, y: 21, targetMapId: 0 },
        bossTrainer: {
            name: "炎之使者 烈火",
            spriteKey: "trainer_blaine",
            dialogue: ["感受竹子燃烧的热情吧！", "一击必杀，才是火焰的真谛！"],
        },
        specialEffect: "地图中有熔岩区域，行走会持续受到少量伤害。",
    },

    // --------------------------------------------------
    // 第 5 技场：电气 - 麻痹与控制
    // --------------------------------------------------
    5: {
        id: 5,
        name: "雷鸣竹林",
        type: ArenaType.Electric,
        mapFile: "arena_05_electric.json",
        tilesets: [
            { name: "ElectricTileset", image: "tiles/electric_gb.png" },
        ],
        entryPoint: { x: 15, y: 10, direction: 'up' },
        exitPoint: { x: 15, y: 11, targetMapId: 0 },
        bossTrainer: {
            name: "电击小子 闪电",
            spriteKey: "trainer_lt_surge",
            dialogue: ["我的竹子充满了电流！小心被麻痹！", "你以为你能穿过我的防线吗？"],
        },
        specialEffect: "地图中散布着电击地板，踩上去会随机麻痹玩家一回合。",
    },

    // --------------------------------------------------
    // 第 6 技场：地面 - 陷阱与耐心
    // --------------------------------------------------
    6: {
        id: 6,
        name: "黄土迷宫",
        type: ArenaType.Ground,
        mapFile: "arena_06_ground.json",
        tilesets: [
            { name: "GroundTileset", image: "tiles/ground_gb.png" },
        ],
        entryPoint: { x: 10, y: 10, direction: 'up' },
        exitPoint: { x: 10, y: 11, targetMapId: 0 },
        bossTrainer: {
            name: "挖掘专家 泥巴",
            spriteKey: "trainer_giovanni",
            dialogue: ["这里是我的地盘，你找不到出路的！", "耐心和策略才是地面的力量！"],
        },
        specialEffect: "地图中有隐藏的沙坑陷阱，玩家可能被困住。",
    },

    // --------------------------------------------------
    // 第 7 技场：毒沼 - 消耗与持久
    // --------------------------------------------------
    7: {
        id: 7,
        name: "剧毒竹泽",
        type: ArenaType.Poison,
        mapFile: "arena_07_poison.json",
        tilesets: [
            { name: "PoisonTileset", image: "tiles/poison_gb.png" },
        ],
        entryPoint: { x: 18, y: 15, direction: 'up' },
        exitPoint: { x: 18, y: 16, targetMapId: 0 },
        bossTrainer: {
            name: "毒物学者 莉莉",
            spriteKey: "trainer_koga",
            dialogue: ["你已经吸入了我的毒气，你的体力正在流失...", "只有最坚韧的意志才能抵抗毒素！"],
        },
        specialEffect: "地图中大部分区域为毒沼，持续减少玩家生命值。",
    },

    // --------------------------------------------------
    // 第 8 技场：超能力 - 迷惑与心智
    // --------------------------------------------------
    8: {
        id: 8,
        name: "幻境竹庭",
        type: ArenaType.Psychic,
        mapFile: "arena_08_psychic.json",
        tilesets: [
            { name: "PsychicTileset", image: "tiles/psychic_gb.png" },
        ],
        entryPoint: { x: 5, y: 5, direction: 'down' },
        exitPoint: { x: 5, y: 4, targetMapId: 0 },
        bossTrainer: {
            name: "心灵导师 念慈",
            spriteKey: "trainer_sabrina",
            dialogue: ["你所看到的一切，都是真实的吗？", "用心去感受，而不是用眼睛！"],
        },
        specialEffect: "地图中有传送点谜题，需要找到正确的路径。部分区域可能颠倒玩家的移动方向。",
    },

    // --------------------------------------------------
    // 第 9 技场：格斗 - 纯粹力量
    // --------------------------------------------------
    9: {
        id: 9,
        name: "武道竹馆",
        type: ArenaType.Fighting,
        mapFile: "arena_09_fighting.json",
        tilesets: [
            { name: "FightingTileset", image: "tiles/fighting_gb.png" },
        ],
        entryPoint: { x: 10, y: 12, direction: 'up' },
        exitPoint: { x: 10, y: 13, targetMapId: 0 },
        bossTrainer: {
            name: "格斗宗师 铁拳",
            spriteKey: "trainer_chuck",
            dialogue: ["没有花哨的技巧，只有纯粹的力量！", "来，和我堂堂正正地打一场！"],
        },
        specialEffect: "地图中央有擂台，战斗必须在擂台上进行。",
    },

    // --------------------------------------------------
    // 第 10 技场：幽灵 - 隐匿与恐惧
    // --------------------------------------------------
    10: {
        id: 10,
        name: "幽暗竹冢",
        type: ArenaType.Ghost,
        mapFile: "arena_10_ghost.json",
        tilesets: [
            { name: "GhostTileset", image: "tiles/ghost_gb.png" },
        ],
        entryPoint: { x: 2, y: 2, direction: 'right' },
        exitPoint: { x: 1, y: 2, targetMapId: 0 },
        bossTrainer: {
            name: "鬼影 魅",
            spriteKey: "trainer_agatha",
            dialogue: ["你害怕黑暗吗？在这里，你将独自面对你的恐惧。", "你的竹子能看到看不见的东西吗？"],
        },
        specialEffect: "地图大部分区域为黑暗，玩家视野受限，需要找到光源。",
    },

    // --------------------------------------------------
    // 第 11 技场：冰雪 - 移动控制
    // --------------------------------------------------
    11: {
        id: 11,
        name: "极寒竹窟",
        type: ArenaType.Ice,
        mapFile: "arena_11_ice.json",
        tilesets: [
            { name: "IceTileset", image: "tiles/ice_gb.png" },
        ],
        entryPoint: { x: 15, y: 15, direction: 'up' },
        exitPoint: { x: 15, y: 16, targetMapId: 0 },
        bossTrainer: {
            name: "冰雪女王 霜",
            spriteKey: "trainer_lorelei",
            dialogue: ["我的竹子像冰一样冷静，像雪一样纯洁。", "在冰面上，你还能控制你的步伐吗？"],
        },
        specialEffect: "地图中大部分区域为冰面，玩家一旦移动就会滑行到下一个障碍物。",
    },

    // --------------------------------------------------
    // 第 12 技场：龙 - 终极挑战
    // --------------------------------------------------
    12: {
        id: 12,
        name: "龙之竹殿",
        type: ArenaType.Dragon,
        mapFile: "arena_12_dragon.json",
        tilesets: [
            { name: "DragonTileset", image: "tiles/dragon_gb.png" },
        ],
        entryPoint: { x: 10, y: 5, direction: 'down' },
        exitPoint: { x: 10, y: 4, targetMapId: 0 },
        bossTrainer: {
            name: "龙竹守护者 尊",
            spriteKey: "trainer_lance",
            dialogue: ["你已经走到了最后，但真正的挑战才刚刚开始。", "让我看看，你是否配得上竹技场的最高荣誉！"],
        },
        specialEffect: "地图结构复杂，结合了前面所有技场的环境效果。",
    },
};

/**
 * 辅助函数：根据ID获取地图配置。
 * @param id 竞技场ID
 * @returns 对应的ArenaMapConfig或null
 */
export function getArenaMapConfig(id: number): ArenaMapConfig | undefined {
    return ArenaMaps[id];
}

/**
 * 辅助函数：获取所有地图配置的列表。
 * @returns ArenaMapConfig[]
 */
export function getAllArenaMaps(): ArenaMapConfig[] {
    return Object.values(ArenaMaps);
}

// ----------------------------------------------------------------------
// 3. 导出
// ----------------------------------------------------------------------

export default ArenaMaps;