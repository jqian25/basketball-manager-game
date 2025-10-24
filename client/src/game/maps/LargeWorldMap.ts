import * as Phaser from 'phaser';

/**
 * @file LargeWorldMap.ts
 * @description 宝可梦剑盾风格的大型世界地图生成器模块。
 * 实现了50x50瓦片地图的数据结构和初始化逻辑，支持多种地形和区域生成。
 * 遵循Game Boy风格，注重性能和可扩展性。
 */

// 瓦片类型枚举，用于地图数据数组
export enum TileType {
    GRASS_01 = 1, // 普通草地
    GRASS_02 = 2, // 深色草地/灌木
    WATER_01 = 3, // 河流/湖泊水面
    WATER_02 = 4, // 河流边缘/浅滩
    ROAD_01 = 5, // 道路主干道
    ROAD_02 = 6, // 道路次干道/小径
    TOWN_CENTER = 7, // 城镇中心/地标
    BUILDING = 8, // 建筑/房屋
    TREE = 9, // 树木
    FLOWERS = 10, // 花朵/装饰
    FIELD = 11, // 篮球场/公园草坪
    SHOPPING_STREET = 12, // 商店街特殊瓦片
    EMPTY = 0,
}

// 区域类型枚举，用于地图生成时的逻辑划分
export enum RegionType {
    WILDERNESS,
    TOWN,
    ROAD,
    RIVER,
    SPECIAL, // 商店街、篮球场、公园等
}

// 地图配置接口
export interface MapConfig {
    width: number; // 瓦片宽度 (50)
    height: number; // 瓦片高度 (50)
    tileSize: number; // 瓦片像素大小 (例如 16x16)
    tileSetName: string; // 瓦片集名称
    tileSetKey: string; // 瓦片集资源键
}

// 区域位置信息
interface Region {
    type: RegionType;
    x: number;
    y: number;
    width: number;
    height: number;
}

// 地图生成器类
export class LargeWorldMap {
    private scene: Phaser.Scene;
    private config: MapConfig;
    // 存储瓦片类型数据的二维数组
    private mapData: TileType[][];
    // 存储已生成的区域信息
    private regions: Region[] = [];
    // Phaser 3 瓦片地图对象
    private map: Phaser.Tilemaps.Tilemap | null = null;
    // Phaser 3 瓦片地图层
    private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;

    /**
     * 构造函数
     * @param scene Phaser 场景
     * @param config 地图配置
     */
    constructor(scene: Phaser.Scene, config: MapConfig) {
        this.scene = scene;
        this.config = config;
        this.mapData = this.initializeMapData(config.width, config.height);
    }

    /**
     * 初始化地图数据数组，全部填充为默认的草地。
     * @param width 地图宽度
     * @param height 地图高度
     * @returns 初始化后的二维数组
     */
    private initializeMapData(width: number, height: number): TileType[][] {
        const data: TileType[][] = [];
        for (let y = 0; y < height; y++) {
            data[y] = [];
            for (let x = 0; x < width; x++) {
                // 默认填充为草地，增加变化性
                data[y][x] = (Math.random() > 0.5) ? TileType.GRASS_01 : TileType.GRASS_02;
            }
        }
        return data;
    }

    /**
     * 生成完整的世界地图数据。
     */
    public generateMap(): void {
        console.log("开始生成 50x50 世界地图...");

        // 1. 区域划分 (放置城镇和特殊区域)
        this.generateRegions();

        // 2. 河流生成 (连接水域)
        this.generateRivers();

        // 3. 道路生成 (连接城镇和特殊区域)
        this.generateRoads();

        // 4. 细节填充 (树木、花朵、草地变化等)
        this.fillDetails();

        console.log("世界地图数据生成完毕。");
    }

    /**
     * 区域划分逻辑：随机分布城镇、特殊区域和荒野。
     */
    private generateRegions(): void {
        const { width, height } = this.config;
        const regionsToPlace = [
            { type: RegionType.TOWN, minSize: 8, maxSize: 12, count: 1, tile: TileType.TOWN_CENTER },
            { type: RegionType.SPECIAL, minSize: 6, maxSize: 8, count: 1, tile: TileType.FIELD, name: "篮球场/公园" },
            { type: RegionType.SPECIAL, minSize: 5, maxSize: 7, count: 1, tile: TileType.SHOPPING_STREET, name: "商店街" },
        ];

        for (const regionDef of regionsToPlace) {
            for (let i = 0; i < regionDef.count; i++) {
                let placed = false;
                let attempts = 0;
                while (!placed && attempts < 100) {
                    const size = Phaser.Math.Between(regionDef.minSize, regionDef.maxSize);
                    const x = Phaser.Math.Between(2, width - size - 2);
                    const y = Phaser.Math.Between(2, height - size - 2);

                    // 简单碰撞检测：确保区域不重叠
                    const isOverlapping = this.regions.some(r =>
                        x < r.x + r.width &&
                        x + size > r.x &&
                        y < r.y + r.height &&
                        y + size > r.y
                    );

                    if (!isOverlapping) {
                        this.regions.push({ type: regionDef.type, x, y, width: size, height: size });
                        this.placeRegionTiles(x, y, size, size, regionDef.tile, regionDef.type);
                        placed = true;
                    }
                    attempts++;
                }
            }
        }
    }

    /**
     * 放置区域瓦片
     */
    private placeRegionTiles(startX: number, startY: number, w: number, h: number, tileType: TileType, regionType: RegionType): void {
        for (let y = startY; y < startY + h; y++) {
            for (let x = startX; x < startX + w; x++) {
                if (this.isInBounds(x, y)) {
                    if (regionType === RegionType.TOWN) {
                        // 城镇：中心瓦片，周围是建筑
                        if (x === startX + Math.floor(w / 2) && y === startY + Math.floor(h / 2)) {
                            this.setTile(x, y, TileType.TOWN_CENTER);
                        } else if (x === startX || x === startX + w - 1 || y === startY || y === startY + h - 1) {
                            // 城镇边缘用建筑围起来
                            this.setTile(x, y, TileType.BUILDING);
                        } else {
                            // 城镇内部是道路或空地
                            this.setTile(x, y, TileType.ROAD_02);
                        }
                    } else if (regionType === RegionType.SPECIAL) {
                        // 特殊区域：例如篮球场/公园/商店街
                        if (tileType === TileType.SHOPPING_STREET) {
                            // 商店街：一排建筑和一条路
                            if (y === startY || y === startY + h - 1) {
                                this.setTile(x, y, TileType.BUILDING);
                            } else {
                                this.setTile(x, y, TileType.SHOPPING_STREET);
                            }
                        } else {
                            // 篮球场/公园：用 FIELD 瓦片
                            this.setTile(x, y, TileType.FIELD);
                        }
                    }
                }
            }
        }
    }

    /**
     * 道路生成逻辑：连接主要区域。
     * 使用简单的直线连接算法。
     */
    private generateRoads(): void {
        if (this.regions.length < 2) return;

        // 遍历所有区域，将它们两两连接
        for (let i = 0; i < this.regions.length; i++) {
            for (let j = i + 1; j < this.regions.length; j++) {
                const r1 = this.regions[i];
                const r2 = this.regions[j];

                // 计算两个区域的中心点
                const startX = r1.x + Math.floor(r1.width / 2);
                const startY = r1.y + Math.floor(r1.height / 2);
                const endX = r2.x + Math.floor(r2.width / 2);
                const endY = r2.y + Math.floor(r2.height / 2);

                // 简单的 L 形路径连接
                this.drawPath(startX, startY, endX, startY, TileType.ROAD_01); // 水平段
                this.drawPath(endX, startY, endX, endY, TileType.ROAD_01);   // 垂直段
            }
        }
    }

    /**
     * 绘制一条路径
     */
    private drawPath(x1: number, y1: number, x2: number, y2: number, tile: TileType): void {
        // 水平段
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);
        for (let x = startX; x <= endX; x++) {
            this.setTile(x, y1, tile);
        }
        // 垂直段
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);
        for (let y = startY; y <= endY; y++) {
            this.setTile(x2, y, tile);
        }
    }

    /**
     * 河流生成逻辑：使用随机游走或分形算法创建河流。
     * 这里使用简单的随机游走。
     */
    private generateRivers(): void {
        const { width, height } = this.config;
        // 从左侧随机位置开始
        let currentX = 0;
        let currentY = Phaser.Math.Between(5, height - 5);
        
        // 随机游走，直到到达右侧边缘
        while (currentX < width) {
            // 绘制河流主干
            this.setTile(currentX, currentY, TileType.WATER_01);
            this.setTile(currentX, currentY + 1, TileType.WATER_01); // 2格宽

            // 绘制河流边缘/浅滩
            this.setTile(currentX, currentY - 1, TileType.WATER_02);
            this.setTile(currentX, currentY + 2, TileType.WATER_02);

            // 随机移动：向右、右下、右上
            const direction = Phaser.Math.Between(0, 2);
            currentX++;
            if (direction === 1 && currentY < height - 5) {
                currentY++;
            } else if (direction === 2 && currentY > 5) {
                currentY--;
            }
        }
    }

    /**
     * 细节填充逻辑：添加树木、草地变化、花朵等装饰。
     */
    private fillDetails(): void {
        const { width, height } = this.config;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const currentTile = this.mapData[y][x];

                // 在草地上随机添加树木 (2% 概率)
                if ((currentTile === TileType.GRASS_01 || currentTile === TileType.GRASS_02) && Math.random() < 0.02) {
                    this.mapData[y][x] = TileType.TREE;
                }

                // 在草地上随机添加花朵 (1% 概率)
                if ((currentTile === TileType.GRASS_01 || currentTile === TileType.GRASS_02) && Math.random() < 0.01) {
                    this.mapData[y][x] = TileType.FLOWERS;
                }
            }
        }
    }

    /**
     * 将生成的地图数据加载到 Phaser 3 场景中进行渲染。
     * @returns Phaser.Tilemaps.TilemapLayer
     */
    public createPhaserMap(): Phaser.Tilemaps.TilemapLayer {
        if (this.map) {
            this.map.destroy();
        }

        // 1. 创建 Phaser 瓦片地图对象
        // 使用 createBlank 方法，传入地图数据、瓦片大小和地图尺寸
        this.map = this.scene.make.tilemap({
            data: this.mapData,
            tileWidth: this.config.tileSize,
            tileHeight: this.config.tileSize,
            width: this.config.width,
            height: this.config.height
        });

        // 2. 添加瓦片集 (必须在场景的 preload 阶段加载)
        // 注意：Phaser 3 的 createBlank 方法要求 data 数组中的值是瓦片集中的瓦片索引。
        // 我们的 TileType 枚举值是从 1 开始的，这与 Tiled 导出的瓦片索引习惯一致。
        const tiles = this.map.addTilesetImage(this.config.tileSetName, this.config.tileSetKey);

        // 3. 创建地图层
        this.groundLayer = this.map.createLayer(0, tiles, 0, 0);

        if (!this.groundLayer) {
            throw new Error("无法创建地图层。请检查瓦片集配置是否正确。");
        }

        // 4. 性能优化: 仅渲染可见区域
        // 对于 50x50 的地图，Phaser 3 默认的 Tilemap 性能已经很好。
        // 如果地图更大，可以考虑使用分块加载或动态层。

        return this.groundLayer;
    }

    /**
     * 获取地图数据
     * @returns 瓦片类型二维数组
     */
    public getMapData(): TileType[][] {
        return this.mapData;
    }

    /**
     * 获取 Phaser Tilemap 对象
     * @returns Phaser.Tilemaps.Tilemap | null
     */
    public getPhaserMap(): Phaser.Tilemaps.Tilemap | null {
        return this.map;
    }

    // ------------------------------------------------------------------
    // 辅助工具函数
    // ------------------------------------------------------------------

    /**
     * 检查坐标是否在地图边界内
     * @param x X坐标
     * @param y Y坐标
     * @returns 是否在边界内
     */
    private isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.config.width && y >= 0 && y < this.config.height;
    }

    /**
     * 设置指定坐标的瓦片类型
     * @param x X坐标
     * @param y Y坐标
     * @param type 瓦片类型
     */
    private setTile(x: number, y: number, type: TileType): void {
        if (this.isInBounds(x, y)) {
            this.mapData[y][x] = type;
        }
    }
}

// ------------------------------------------------------------------
// 示例用法 (仅作参考，实际使用时应在 Phaser 场景中调用)
// ------------------------------------------------------------------
/*
// 假设这是你的 Phaser 场景文件
class GameScene extends Phaser.Scene {
    preload() {
        // 必须加载一个瓦片集图片，并为其指定一个键
        // 假设 'gb_tiles' 是你加载的 Game Boy 风格瓦片集图片键
        // 瓦片集图片需要包含 LargeWorldMap.ts 中所有 TileType 对应的瓦片，且索引从 1 开始
        this.load.image('gb_tiles', 'assets/tileset/gb_tiles.png');
    }

    create() {
        const mapConfig: MapConfig = {
            width: 50,
            height: 50,
            tileSize: 16, // 16x16 瓦片，符合 Game Boy 风格
            tileSetName: 'GameBoyTileset', // Tiled 中使用的瓦片集名称 (必须与 addTilesetImage 的第一个参数匹配)
            tileSetKey: 'gb_tiles', // Phaser 加载的图片键
        };

        const worldMap = new LargeWorldMap(this, mapConfig);
        worldMap.generateMap(); // 生成地图数据

        try {
            const mapLayer = worldMap.createPhaserMap(); // 创建并渲染 Phaser 地图层
            console.log("地图层创建成功:", mapLayer);

            // 设置摄像机边界
            this.cameras.main.setBounds(0, 0, mapConfig.width * mapConfig.tileSize, mapConfig.height * mapConfig.tileSize);
            // 假设有一个名为 'player' 的精灵
            // const player = this.add.sprite(25 * 16 + 8, 25 * 16 + 8, 'player_sprite');
            // this.cameras.main.startFollow(player);

        } catch (error) {
            console.error("地图创建失败:", error);
        }
    }
}
*/