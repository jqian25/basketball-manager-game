// client/src/game/maps/CityMaps.ts

/**
 * @fileoverview 城市地图系统 - 10个城市地图
 * 模拟宝可梦Game Boy风格的地图配置
 * 使用Phaser 3 Tilemap和自定义数据结构
 */

// 1. 地图类型枚举
export enum MapType {
    CITY = "CITY",
    TOWN = "TOWN",
    ROUTE = "ROUTE",
    BUILDING = "BUILDING",
}

// 2. 瓦片集配置接口
export interface TilesetConfig {
    key: string; // 瓦片集名称，对应加载时的key
    tileWidth: number; // 瓦片宽度 (通常为16像素)
    tileHeight: number; // 瓦片高度 (通常为16像素)
    firstGid: number; // Tiled中瓦片集的起始GID
}

// 3. 传送点配置接口 (用于进出建筑或切换地图)
export interface WarpPoint {
    x: number; // 瓦片坐标X
    y: number; // 瓦片坐标Y
    targetMapKey: string; // 目标地图的key
    targetX: number; // 目标地图的瓦片坐标X
    targetY: number; // 目标地图的瓦片坐标Y
}

// 4. 野外遭遇配置接口 (用于草地等区域)
export interface WildEncounterArea {
    layerName: string; // 触发野外遭遇的图层名称 (例如: "GrassLayer")
    rate: number; // 遭遇率 (0-100)
    encounters: {
        pokemonId: number;
        minLevel: number;
        maxLevel: number;
        rarity: number; // 稀有度 (1-100)
    }[];
}

// 5. 完整的城市地图配置接口
export interface CityMapConfig {
    key: string; // 地图唯一标识符 (例如: "PalletTown")
    mapType: MapType; // 地图类型
    displayName: string; // 地图显示名称 (例如: "真新镇")
    tiledJson: string; // Tiled导出的JSON文件名 (例如: "pallet_town.json")
    
    // 宝可梦Game Boy风格的地图尺寸通常较小
    width: number; // 地图宽度 (瓦片数)
    height: number; // 地图高度 (瓦片数)
    tileWidth: number; // 瓦片宽度 (通常为16)
    tileHeight: number; // 瓦片高度 (通常为16)

    tilesets: TilesetConfig[]; // 使用的瓦片集配置

    // 图层名称约定 (Phaser Tilemap Layers)
    layers: {
        background: string; // 背景层 (例如: "Ground")
        collision: string; // 碰撞层 (例如: "Collision") - 包含碰撞属性的瓦片
        belowPlayer: string; // 玩家下方层 (例如: "BelowPlayer")
        abovePlayer: string; // 玩家上方层 (例如: "AbovePlayer")
    };

    playerSpawn: { // 玩家初始出生点
        x: number;
        y: number;
    };

    warpPoints: WarpPoint[]; // 传送点列表

    wildEncounters?: WildEncounterArea[]; // 野外遭遇区域 (可选)

    musicKey: string; // 背景音乐key
}

// 6. 10个城市地图的配置数据 (模拟宝可梦世界)
export const CityMaps: CityMapConfig[] = [
    // 1. 真新镇 (Pallet Town) - 起始城镇
    {
        key: "PalletTown",
        mapType: MapType.TOWN,
        displayName: "真新镇",
        tiledJson: "pallet_town.json",
        width: 10,
        height: 12,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 5, y: 10 },
        warpPoints: [
            { x: 5, y: 11, targetMapKey: "Route1", targetX: 5, targetY: 1 }, // 出镇
            { x: 4, y: 8, targetMapKey: "PlayerHouse", targetX: 3, targetY: 5 }, // 玩家家
        ],
        musicKey: "pallet_town_theme",
    },
    // 2. 常磐市 (Viridian City) - 第一个城市
    {
        key: "ViridianCity",
        mapType: MapType.CITY,
        displayName: "常磐市",
        tiledJson: "viridian_city.json",
        width: 20,
        height: 18,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 10, y: 16 },
        warpPoints: [
            { x: 10, y: 17, targetMapKey: "Route1", targetX: 15, targetY: 15 }, // 南方出口
            { x: 10, y: 1, targetMapKey: "Route2", targetX: 10, targetY: 15 }, // 北方出口
            { x: 5, y: 5, targetMapKey: "PokeCenter", targetX: 5, targetY: 7 }, // 宝可梦中心
            { x: 15, y: 5, targetMapKey: "PokeMart", targetX: 3, targetY: 5 }, // 宝可梦商店
        ],
        musicKey: "viridian_city_theme",
    },
    // 3. 尼比市 (Pewter City) - 拥有道馆
    {
        key: "PewterCity",
        mapType: MapType.CITY,
        displayName: "尼比市",
        tiledJson: "pewter_city.json",
        width: 18,
        height: 15,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 9, y: 13 },
        warpPoints: [
            { x: 1, y: 7, targetMapKey: "Route3", targetX: 15, targetY: 7 }, // 东边出口
            { x: 15, y: 10, targetMapKey: "Gym_Pewter", targetX: 5, targetY: 10 }, // 道馆
        ],
        musicKey: "pewter_city_theme",
    },
    // 4. 华蓝市 (Cerulean City)
    {
        key: "CeruleanCity",
        mapType: MapType.CITY,
        displayName: "华蓝市",
        tiledJson: "cerulean_city.json",
        width: 25,
        height: 20,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 12, y: 18 },
        warpPoints: [
            { x: 2, y: 10, targetMapKey: "Route4", targetX: 15, targetY: 10 }, // 西边出口
            { x: 20, y: 10, targetMapKey: "Route9", targetX: 5, targetY: 10 }, // 东边出口
            { x: 12, y: 5, targetMapKey: "Gym_Cerulean", targetX: 5, targetY: 10 }, // 道馆
        ],
        musicKey: "cerulean_city_theme",
    },
    // 5. 金黄市 (Saffron City) - 大都会
    {
        key: "SaffronCity",
        mapType: MapType.CITY,
        displayName: "金黄市",
        tiledJson: "saffron_city.json",
        width: 30,
        height: 30,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 15, y: 28 },
        warpPoints: [
            { x: 15, y: 29, targetMapKey: "Route6", targetX: 10, targetY: 10 }, // 南方出口
            { x: 15, y: 1, targetMapKey: "Route5", targetX: 10, targetY: 10 }, // 北方出口
            { x: 1, y: 15, targetMapKey: "Route7", targetX: 10, targetY: 10 }, // 西方出口
            { x: 29, y: 15, targetMapKey: "Route8", targetX: 10, targetY: 10 }, // 东方出口
            { x: 15, y: 15, targetMapKey: "SilphCo", targetX: 10, targetY: 10 }, // 西尔佛公司
        ],
        musicKey: "saffron_city_theme",
    },
    // 6. 彩虹市 (Celadon City) - 购物中心
    {
        key: "CeladonCity",
        mapType: MapType.CITY,
        displayName: "彩虹市",
        tiledJson: "celadon_city.json",
        width: 28,
        height: 25,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 14, y: 23 },
        warpPoints: [
            { x: 1, y: 12, targetMapKey: "Route16", targetX: 15, targetY: 10 }, // 西边出口
            { x: 27, y: 12, targetMapKey: "Route7", targetX: 5, targetY: 10 }, // 东边出口
            { x: 14, y: 5, targetMapKey: "DeptStore", targetX: 5, targetY: 10 }, // 百货大楼
        ],
        musicKey: "celadon_city_theme",
    },
    // 7. 浅红市 (Fuchsia City) - 狩猎地带
    {
        key: "FuchsiaCity",
        mapType: MapType.CITY,
        displayName: "浅红市",
        tiledJson: "fuchsia_city.json",
        width: 22,
        height: 20,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 11, y: 18 },
        warpPoints: [
            { x: 1, y: 10, targetMapKey: "Route18", targetX: 15, targetY: 10 }, // 西边出口
            { x: 11, y: 1, targetMapKey: "Route15", targetX: 10, targetY: 10 }, // 北边出口
            { x: 15, y: 10, targetMapKey: "SafariZone", targetX: 5, targetY: 5 }, // 狩猎地带
        ],
        musicKey: "fuchsia_city_theme",
    },
    // 8. 红莲岛 (Cinnabar Island) - 火山岛
    {
        key: "CinnabarIsland",
        mapType: MapType.CITY,
        displayName: "红莲岛",
        tiledJson: "cinnabar_island.json",
        width: 15,
        height: 15,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 7, y: 13 },
        warpPoints: [
            { x: 7, y: 14, targetMapKey: "Route21", targetX: 10, targetY: 10 }, // 南边水路
            { x: 5, y: 5, targetMapKey: "PokemonMansion", targetX: 5, targetY: 5 }, // 宝可梦大厦
        ],
        musicKey: "cinnabar_island_theme",
    },
    // 9. 苏芳岛 (SeviiIslands_One) - 扩展地图 (作为第9个城市)
    {
        key: "SeviiIslands_One",
        mapType: MapType.TOWN,
        displayName: "苏芳岛",
        tiledJson: "sevii_one_island.json",
        width: 12,
        height: 12,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "sevii_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 6, y: 10 },
        warpPoints: [
            { x: 6, y: 11, targetMapKey: "SeviiRoute1", targetX: 5, targetY: 1 }, // 出镇
        ],
        musicKey: "sevii_island_theme",
    },
    // 10. 石英高原 (Indigo Plateau) - 终点
    {
        key: "IndigoPlateau",
        mapType: MapType.CITY,
        displayName: "石英高原",
        tiledJson: "indigo_plateau.json",
        width: 15,
        height: 10,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 7, y: 8 },
        warpPoints: [
            { x: 7, y: 1, targetMapKey: "EliteFour_Lobby", targetX: 5, targetY: 5 }, // 进入冠军之路
            { x: 7, y: 9, targetMapKey: "Route23", targetX: 10, targetY: 10 }, // 返回
        ],
        musicKey: "indigo_plateau_theme",
    },
    // 额外的内部地图 (非10个城市地图主体，但作为warpTargets需要定义)
    {
        key: "PlayerHouse",
        mapType: MapType.BUILDING,
        displayName: "玩家的家",
        tiledJson: "player_house.json",
        width: 8,
        height: 8,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "indoor_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Floor",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 3, y: 5 },
        warpPoints: [
            { x: 3, y: 6, targetMapKey: "PalletTown", targetX: 4, targetY: 8 }, // 出门
        ],
        musicKey: "indoor_theme",
    },
    {
        key: "Route1",
        mapType: MapType.ROUTE,
        displayName: "1号道路",
        tiledJson: "route1.json",
        width: 10,
        height: 20,
        tileWidth: 16,
        tileHeight: 16,
        tilesets: [{ key: "kanto_tileset", tileWidth: 16, tileHeight: 16, firstGid: 1 }],
        layers: {
            background: "Ground",
            collision: "Collision",
            belowPlayer: "BelowPlayer",
            abovePlayer: "AbovePlayer",
        },
        playerSpawn: { x: 5, y: 1 },
        warpPoints: [
            { x: 5, y: 0, targetMapKey: "PalletTown", targetX: 5, targetY: 10 },
            { x: 15, y: 16, targetMapKey: "ViridianCity", targetX: 10, targetY: 16 },
        ],
        wildEncounters: [
            {
                layerName: "GrassLayer",
                rate: 15,
                encounters: [
                    { pokemonId: 16, minLevel: 2, maxLevel: 5, rarity: 50 }, // 波波
                    { pokemonId: 19, minLevel: 2, maxLevel: 4, rarity: 40 }, // 小拉达
                    { pokemonId: 1, minLevel: 3, maxLevel: 5, rarity: 10 }, // 妙蛙种子 (稀有)
                ]
            }
        ],
        musicKey: "route_theme",
    },
];