// client/src/game/buildings/EntertainmentBuildings.ts

/**
 * 娱乐设施建筑配置接口
 * 遵循宝可梦Game Boy风格，强调像素艺术、简单设计和功能性。
 */
export interface IEntertainmentBuilding {
    /** 建筑的唯一标识符 */
    id: number;
    /** 建筑的显示名称 */
    name: string;
    /** 建筑的简短描述 */
    description: string;
    /** 建筑的建造资源消耗 */
    cost: number;
    /** 建筑在地图上的尺寸 (瓦片数, 例如 3x3) */
    size: { width: number; height: number };
    /** 建筑的像素艺术纹理键 (Phaser 3 Asset Key) */
    textureKey: string;
    /** 建筑提供的娱乐值/幸福度加成 */
    entertainmentValue: number;
    /** 建筑的每日维护费用 */
    upkeep: number;
    /** 建筑的特殊功能或效果 */
    specialEffect: string;
    /** 建筑的 Game Boy 风格颜色主题 (可选) */
    colorPalette?: string;
}

/**
 * 18种娱乐设施建筑的详细配置数据
 * 灵感来源于宝可梦世界观中的休闲和娱乐场所。
 */
export const EntertainmentBuildings: IEntertainmentBuilding[] = [
    // 1. 基础休闲设施
    {
        id: 101,
        name: "游戏厅",
        description: "经典街机和老虎机，提供基础娱乐。",
        cost: 500,
        size: { width: 3, height: 3 },
        textureKey: "building_game_corner",
        entertainmentValue: 15,
        upkeep: 5,
        specialEffect: "吸引少量训练家访问。",
        colorPalette: "Red/Yellow",
    },
    {
        id: 102,
        name: "喷泉广场",
        description: "美丽的公共喷泉，提升周围环境的幸福度。",
        cost: 300,
        size: { width: 4, height: 4 },
        textureKey: "building_fountain_sq",
        entertainmentValue: 10,
        upkeep: 2,
        specialEffect: "邻近建筑幸福度+5。",
        colorPalette: "Blue/Gray",
    },
    {
        id: 103,
        name: "宝可梦公园",
        description: "供宝可梦玩耍的绿色空间。",
        cost: 700,
        size: { width: 5, height: 5 },
        textureKey: "building_pkmn_park",
        entertainmentValue: 20,
        upkeep: 8,
        specialEffect: "小概率发现稀有道具。",
        colorPalette: "Green/Brown",
    },
    // 2. 体育与竞技
    {
        id: 104,
        name: "迷你竞技场",
        description: "举办小型宝可梦对战的场所。",
        cost: 1200,
        size: { width: 6, height: 5 },
        textureKey: "building_mini_arena",
        entertainmentValue: 30,
        upkeep: 15,
        specialEffect: "定期举办比赛，产生少量收入。",
        colorPalette: "White/Red",
    },
    {
        id: 105,
        name: "游泳池",
        description: "夏日休闲的好去处，主要吸引水系宝可梦。",
        cost: 900,
        size: { width: 4, height: 6 },
        textureKey: "building_swimming_pool",
        entertainmentValue: 25,
        upkeep: 10,
        specialEffect: "提升水系宝可梦的满意度。",
        colorPalette: "Cyan/Blue",
    },
    {
        id: 106,
        name: "自行车道",
        description: "供训练家骑车锻炼的环形车道。",
        cost: 400,
        size: { width: 7, height: 2 },
        textureKey: "building_bike_path",
        entertainmentValue: 12,
        upkeep: 3,
        specialEffect: "提升训练家移动速度。",
        colorPalette: "Gray/Black",
    },
    // 3. 文化与艺术
    {
        id: 107,
        name: "博物馆",
        description: "展示稀有化石和历史文物的场所。",
        cost: 1500,
        size: { width: 5, height: 4 },
        textureKey: "building_museum",
        entertainmentValue: 35,
        upkeep: 20,
        specialEffect: "吸引研究员和收藏家。",
        colorPalette: "Brown/Gold",
    },
    {
        id: 108,
        name: "剧院",
        description: "上演宝可梦表演和音乐剧。",
        cost: 1800,
        size: { width: 6, height: 6 },
        textureKey: "building_theater",
        entertainmentValue: 45,
        upkeep: 25,
        specialEffect: "大幅提升游客娱乐度。",
        colorPalette: "Purple/Red",
    },
    {
        id: 109,
        name: "艺术画廊",
        description: "展示本地艺术家的作品。",
        cost: 850,
        size: { width: 3, height: 5 },
        textureKey: "building_art_gallery",
        entertainmentValue: 22,
        upkeep: 12,
        specialEffect: "提升城市美学评分。",
        colorPalette: "White/Black",
    },
    // 4. 特色餐饮与服务
    {
        id: 110,
        name: "树果咖啡馆",
        description: "提供各种树果制作的饮品和小吃。",
        cost: 600,
        size: { width: 3, height: 2 },
        textureKey: "building_berry_cafe",
        entertainmentValue: 18,
        upkeep: 7,
        specialEffect: "小概率获得稀有树果。",
        colorPalette: "Pink/Green",
    },
    {
        id: 111,
        name: "豪华餐厅",
        description: "高档餐饮体验，吸引富有的游客。",
        cost: 2500,
        size: { width: 4, height: 4 },
        textureKey: "building_luxury_rest",
        entertainmentValue: 55,
        upkeep: 40,
        specialEffect: "每日产生高额利润。",
        colorPalette: "Black/Silver",
    },
    {
        id: 112,
        name: "温泉旅馆",
        description: "提供放松和治愈的温泉服务。",
        cost: 3000,
        size: { width: 7, height: 7 },
        textureKey: "building_hot_spring",
        entertainmentValue: 60,
        upkeep: 50,
        specialEffect: "恢复宝可梦少量HP/PP。",
        colorPalette: "Wood/Steam",
    },
    // 5. 独特体验
    {
        id: 113,
        name: "鬼屋探险",
        description: "惊险刺激的娱乐设施，吸引寻求刺激的游客。",
        cost: 1000,
        size: { width: 5, height: 3 },
        textureKey: "building_haunted_house",
        entertainmentValue: 40,
        upkeep: 18,
        specialEffect: "夜间娱乐值翻倍。",
        colorPalette: "Dark/Purple",
    },
    {
        id: 114,
        name: "摩天轮",
        description: "城市地标，提供俯瞰全景的浪漫体验。",
        cost: 4000,
        size: { width: 2, height: 8 },
        textureKey: "building_ferris_wheel",
        entertainmentValue: 70,
        upkeep: 60,
        specialEffect: "作为地标，大幅提升城市知名度。",
        colorPalette: "Rainbow",
    },
    {
        id: 115,
        name: "迷宫花园",
        description: "巨大的树篱迷宫，考验游客的智慧和方向感。",
        cost: 1100,
        size: { width: 8, height: 8 },
        textureKey: "building_maze_garden",
        entertainmentValue: 30,
        upkeep: 10,
        specialEffect: "游客停留时间延长。",
        colorPalette: "Green/Hedge",
    },
    // 6. 进阶设施
    {
        id: 116,
        name: "宝可梦选美大赛场",
        description: "举办宝可梦选美比赛的豪华场所。",
        cost: 5000,
        size: { width: 7, height: 6 },
        textureKey: "building_contest_hall",
        entertainmentValue: 80,
        upkeep: 70,
        specialEffect: "吸引高等级训练家和稀有宝可梦。",
        colorPalette: "Pink/Silver",
    },
    {
        id: 117,
        name: "电影制片厂",
        description: "拍摄宝可梦电影和电视节目的地方。",
        cost: 6000,
        size: { width: 8, height: 5 },
        textureKey: "building_movie_studio",
        entertainmentValue: 90,
        upkeep: 80,
        specialEffect: "提升城市文化影响力，解锁特殊任务。",
        colorPalette: "Gray/Light",
    },
    {
        id: 118,
        name: "火箭队秘密基地 (伪装)",
        description: "一个看似普通的仓库，实则提供地下高风险娱乐。",
        cost: 10000,
        size: { width: 4, height: 4 },
        textureKey: "building_secret_base",
        entertainmentValue: 100,
        upkeep: 100,
        specialEffect: "提供高回报的非法活动，但有被查封的风险。",
        colorPalette: "Black/Red",
    },
];

/**
 * 辅助函数: 根据ID获取建筑配置
 * @param id 建筑ID
 * @returns 建筑配置或 undefined
 */
export function getEntertainmentBuildingConfig(id: number): IEntertainmentBuilding | undefined {
    return EntertainmentBuildings.find(building => building.id === id);
}

/**
 * 辅助函数: 预加载所有建筑纹理 (示例)
 * 在Phaser 3的 Scene.preload() 中调用
 * @param scene Phaser.Scene 实例
 */
export function preloadEntertainmentBuildingAssets(scene: Phaser.Scene): void {
    EntertainmentBuildings.forEach(building => {
        // 假设所有的纹理都是一个名为 'buildings' 的图集中的帧，
        // 或者是一个单独的像素艺术图片。
        // 这里我们假设它们是单独的图片，需要预先加载。
        // 实际项目中，建议使用图集 (spritesheet) 来优化性能。
        
        // 示例加载路径：assets/sprites/buildings/{textureKey}.png
        // scene.load.image(building.textureKey, `assets/sprites/buildings/${building.textureKey}.png`);
        
        // 为了代码的完整性和可运行性，我们只保留接口和数据。
        // 实际的加载代码应在游戏场景中实现。
    });
    console.log(`Loaded configuration for ${EntertainmentBuildings.length} entertainment buildings.`);
}

// 示例用法 (在另一个文件或场景中):
/*
import { EntertainmentBuildings, getEntertainmentBuildingConfig } from './EntertainmentBuildings';

// 获取摩天轮的配置
const ferrisWheel = getEntertainmentBuildingConfig(114);
if (ferrisWheel) {
    console.log(`Building: ${ferrisWheel.name}, Cost: ${ferrisWheel.cost}`);
}

// 遍历所有建筑
EntertainmentBuildings.forEach(b => {
    console.log(`${b.id}: ${b.name} (${b.size.width}x${b.size.height})`);
});
*/