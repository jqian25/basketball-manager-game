// client/src/game/maps/DojoMaps.ts

/**
 * @fileoverview 宝可梦Game Boy风格的道馆地图系统配置。
 * 包含15个道馆地图的详细数据结构和配置。
 * 适用于Phaser 3游戏开发。
 */

// =================================================================
// 1. 接口定义
// =================================================================

/**
 * 宝可梦Game Boy风格地图的瓦片集配置
 */
export interface TilesetConfig {
    /** 瓦片集在Phaser中的键名 (例如: 'dojo_tiles') */
    key: string;
    /** 瓦片集图片文件名 (例如: 'dojo_tiles.png') */
    image: string;
    /** 瓦片集JSON数据文件名 (例如: 'dojo_tiles.json') - 如果使用Tiled导出 */
    json?: string;
}

/**
 * 地图中的传送点配置
 */
export interface TeleportPoint {
    /** 传送点的名称或ID */
    name: string;
    /** 传送点在当前地图的X坐标 (瓦片单位) */
    x: number;
    /** 传送点在当前地图的Y坐标 (瓦片单位) */
    y: number;
    /** 目标地图的ID */
    targetMapId: string;
    /** 目标地图的入口名称 (例如: 'Entrance', 'Exit') */
    targetSpawnPoint: string;
}

/**
 * 道馆地图配置接口
 */
export interface DojoMapConfig {
    /** 地图的唯一ID (例如: 'Dojo1') */
    id: string;
    /** 道馆的名称 (例如: '深灰道馆') */
    name: string;
    /** 道馆馆主的名称 */
    gymLeader: string;
    /** 道馆徽章的名称 */
    badgeName: string;
    /** 地图的瓦片宽度 (瓦片单位) */
    width: number;
    /** 地图的瓦片高度 (瓦片单位) */
    height: number;
    /** 地图的Tiled JSON文件名 (例如: 'dojo1.json') */
    tilemapKey: string;
    /** 瓦片集配置列表 */
    tilesets: TilesetConfig[];
    /** 初始生成点配置 (玩家进入地图的位置) */
    spawnPoints: {
        [key: string]: { x: number; y: number };
    };
    /** 传送点配置列表 (例如: 离开道馆的出口) */
    teleports: TeleportPoint[];
    /** 额外的地图属性 (例如: 战斗音乐, 特殊规则等) */
    properties?: {
        [key: string]: any;
    };
}

// =================================================================
// 2. 15个道馆地图配置数据
// =================================================================

/**
 * 宝可梦Game Boy风格的15个道馆地图配置数组
 */
export const DojoMaps: DojoMapConfig[] = [
    // --------------------------------------------------
    // Kanto 关都地区 (8个道馆) - 沿用经典设计
    // --------------------------------------------------
    {
        id: 'Dojo1',
        name: '深灰道馆',
        gymLeader: '小刚',
        badgeName: '灰色徽章',
        width: 10,
        height: 10,
        tilemapKey: 'dojo1_pewter_city',
        tilesets: [{ key: 'rock_tiles', image: 'rock_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 5, y: 9 },
            LeaderSpot: { x: 5, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 5, y: 9, targetMapId: 'PewterCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Rock',
            puzzle: '短距离迷宫',
        },
    },
    {
        id: 'Dojo2',
        name: '华蓝道馆',
        gymLeader: '小霞',
        badgeName: '蓝色徽章',
        width: 12,
        height: 12,
        tilemapKey: 'dojo2_cerulean_city',
        tilesets: [{ key: 'water_tiles', image: 'water_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 6, y: 11 },
            LeaderSpot: { x: 6, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 6, y: 11, targetMapId: 'CeruleanCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Water',
            puzzle: '跳水板路径',
        },
    },
    {
        id: 'Dojo3',
        name: '金黄道馆',
        gymLeader: '马志士',
        badgeName: '橙色徽章',
        width: 15,
        height: 15,
        tilemapKey: 'dojo3_vermilion_city',
        tilesets: [{ key: 'electric_tiles', image: 'electric_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 7, y: 14 },
            LeaderSpot: { x: 7, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 7, y: 14, targetMapId: 'VermilionCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Electric',
            puzzle: '垃圾桶开关',
        },
    },
    {
        id: 'Dojo4',
        name: '彩虹道馆',
        gymLeader: '莉佳',
        badgeName: '草之徽章',
        width: 16,
        height: 16,
        tilemapKey: 'dojo4_celadon_city',
        tilesets: [{ key: 'grass_tiles', image: 'grass_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 8, y: 15 },
            LeaderSpot: { x: 8, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 8, y: 15, targetMapId: 'CeladonCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Grass',
            puzzle: '隐藏路径',
        },
    },
    {
        id: 'Dojo5',
        name: '浅红道馆',
        gymLeader: '阿桔',
        badgeName: '粉红徽章',
        width: 14,
        height: 14,
        tilemapKey: 'dojo5_fuchsia_city',
        tilesets: [{ key: 'poison_tiles', image: 'poison_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 7, y: 13 },
            LeaderSpot: { x: 7, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 7, y: 13, targetMapId: 'FuchsiaCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Poison',
            puzzle: '隐形墙壁',
        },
    },
    {
        id: 'Dojo6',
        name: '金黄道馆',
        gymLeader: '娜姿',
        badgeName: '金色徽章',
        width: 18,
        height: 18,
        tilemapKey: 'dojo6_saffron_city',
        tilesets: [{ key: 'psychic_tiles', image: 'psychic_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 9, y: 17 },
            LeaderSpot: { x: 9, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 9, y: 17, targetMapId: 'SaffronCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Psychic',
            puzzle: '传送带迷宫',
        },
    },
    {
        id: 'Dojo7',
        name: '红莲道馆',
        gymLeader: '夏伯',
        badgeName: '火焰徽章',
        width: 16,
        height: 16,
        tilemapKey: 'dojo7_cinnabar_island',
        tilesets: [{ key: 'fire_tiles', image: 'fire_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 8, y: 15 },
            LeaderSpot: { x: 8, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 8, y: 15, targetMapId: 'CinnabarIsland', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Fire',
            puzzle: '问答挑战',
        },
    },
    {
        id: 'Dojo8',
        name: '常磐道馆',
        gymLeader: '坂木',
        badgeName: '绿色徽章',
        width: 20,
        height: 20,
        tilemapKey: 'dojo8_viridian_city',
        tilesets: [{ key: 'ground_tiles', image: 'ground_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 10, y: 19 },
            LeaderSpot: { x: 10, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 10, y: 19, targetMapId: 'ViridianCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Ground',
            puzzle: '旋转地板',
        },
    },

    // --------------------------------------------------
    // Johto 城都地区 (7个道馆) - 补充至15个道馆
    // --------------------------------------------------
    {
        id: 'Dojo9',
        name: '桔梗道馆',
        gymLeader: '阿速',
        badgeName: '飞翼徽章',
        width: 12,
        height: 12,
        tilemapKey: 'dojo9_violet_city',
        tilesets: [{ key: 'flying_tiles', image: 'flying_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 6, y: 11 },
            LeaderSpot: { x: 6, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 6, y: 11, targetMapId: 'VioletCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Flying',
            puzzle: '高空独木桥',
        },
    },
    {
        id: 'Dojo10',
        name: '桧皮道馆',
        gymLeader: '阿笔',
        badgeName: '昆虫徽章',
        width: 14,
        height: 14,
        tilemapKey: 'dojo10_azalea_town',
        tilesets: [{ key: 'bug_tiles', image: 'bug_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 7, y: 13 },
            LeaderSpot: { x: 7, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 7, y: 13, targetMapId: 'AzaleaTown', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Bug',
            puzzle: '蜘蛛网路径',
        },
    },
    {
        id: 'Dojo11',
        name: '满金道馆',
        gymLeader: '小茜',
        badgeName: '普通徽章',
        width: 16,
        height: 16,
        tilemapKey: 'dojo11_goldenrod_city',
        tilesets: [{ key: 'normal_tiles', image: 'normal_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 8, y: 15 },
            LeaderSpot: { x: 8, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 8, y: 15, targetMapId: 'GoldenrodCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Normal',
            puzzle: '旋转围栏',
        },
    },
    {
        id: 'Dojo12',
        name: '圆朱道馆',
        gymLeader: '松叶',
        badgeName: '幻影徽章',
        width: 18,
        height: 18,
        tilemapKey: 'dojo12_ecruteak_city',
        tilesets: [{ key: 'ghost_tiles', image: 'ghost_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 9, y: 17 },
            LeaderSpot: { x: 9, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 9, y: 17, targetMapId: 'EcruteakCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Ghost',
            puzzle: '黑暗路径',
        },
    },
    {
        id: 'Dojo13',
        name: '浅葱道馆',
        gymLeader: '阿蜜',
        badgeName: '钢铁徽章',
        width: 15,
        height: 15,
        tilemapKey: 'dojo13_olivine_city',
        tilesets: [{ key: 'steel_tiles', image: 'steel_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 7, y: 14 },
            LeaderSpot: { x: 7, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 7, y: 14, targetMapId: 'OlivineCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Steel',
            puzzle: '移动平台',
        },
    },
    {
        id: 'Dojo14',
        name: '卡吉道馆',
        gymLeader: '柳伯',
        badgeName: '冰冻徽章',
        width: 16,
        height: 16,
        tilemapKey: 'dojo14_mahogany_town',
        tilesets: [{ key: 'ice_tiles', image: 'ice_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 8, y: 15 },
            LeaderSpot: { x: 8, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 8, y: 15, targetMapId: 'MahoganyTown', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Ice',
            puzzle: '滑冰路径',
        },
    },
    {
        id: 'Dojo15',
        name: '烟墨道馆',
        gymLeader: '小椿',
        badgeName: '升龙徽章',
        width: 20,
        height: 20,
        tilemapKey: 'dojo15_blackthorn_city',
        tilesets: [{ key: 'dragon_tiles', image: 'dragon_tiles.png' }],
        spawnPoints: {
            Entrance: { x: 10, y: 19 },
            LeaderSpot: { x: 10, y: 2 },
        },
        teleports: [
            { name: 'Exit', x: 10, y: 19, targetMapId: 'BlackthornCity', targetSpawnPoint: 'DojoExit' },
        ],
        properties: {
            type: 'Dragon',
            puzzle: '熔岩路径',
        },
    },
];

// 导出所有配置和接口，方便其他模块使用
export default DojoMaps;

// 示例用法 (在Phaser场景中):
/*
import { DojoMaps, DojoMapConfig } from './DojoMaps';

export class GameScene extends Phaser.Scene {
    preload() {
        // 预加载所有地图的瓦片集图片和Tiled JSON
        DojoMaps.forEach(map => {
            map.tilesets.forEach(ts => {
                this.load.image(ts.key, `assets/tilesets/${ts.image}`);
                if (ts.json) {
                    this.load.json(ts.key + '_json', `assets/tilesets/${ts.json}`);
                }
            });
            this.load.tilemapTiledJSON(map.tilemapKey, `assets/tilemaps/${map.tilemapKey}.json`);
        });
    }

    create() {
        const currentMapId = 'Dojo1';
        const currentMapConfig = DojoMaps.find(m => m.id === currentMapId) as DojoMapConfig;

        if (currentMapConfig) {
            // 1. 创建Tilemap
            const map = this.make.tilemap({ key: currentMapConfig.tilemapKey, tileWidth: 16, tileHeight: 16 });

            // 2. 添加Tileset
            currentMapConfig.tilesets.forEach(ts => {
                map.addTilesetImage(ts.key, ts.key);
            });

            // 3. 创建图层 (假设图层名为 'Ground', 'Objects', 'Above')
            map.createLayer('Ground', currentMapConfig.tilesets[0].key);
            map.createLayer('Objects', currentMapConfig.tilesets[0].key);
            map.createLayer('Above', currentMapConfig.tilesets[0].key);

            // 4. 设置玩家初始位置
            const spawnPoint = currentMapConfig.spawnPoints.Entrance;
            console.log(`玩家将在 ${currentMapConfig.name} (${spawnPoint.x}, ${spawnPoint.y}) 处生成`);

            // 5. 处理传送点 (例如: 监听玩家与传送点的碰撞)
            currentMapConfig.teleports.forEach(tp => {
                console.log(`传送点: ${tp.name} -> ${tp.targetMapId}`);
                // 实际游戏中需要添加碰撞检测逻辑
            });
        }
    }
}
*/