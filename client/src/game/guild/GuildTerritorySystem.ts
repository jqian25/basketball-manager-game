// client/src/game/guild/GuildTerritorySystem.ts

import * as Phaser from 'phaser';

// -------------------------------------------------------------------------
// 1. 数据结构定义 (受宝可梦GB风格启发)
// -------------------------------------------------------------------------

/**
 * 联盟基础数据
 */
export interface GuildData {
    guildId: number;
    name: string;
    // GB风格颜色：使用4种灰度色或简单的原色模拟
    color: number; 
    // 联盟拥有的领地数量
    territoryCount: number;
}

/**
 * 单个领地的配置和运行时数据
 */
export interface TerritoryConfig {
    id: number;
    name: string;
    // 领地在地图上的中心瓦块坐标 (x, y)
    tileX: number;
    tileY: number;
    // 领地的大小 (例如: 3x3瓦块区域) - 边长，必须是奇数
    size: number; 
    // 当前占领该领地的联盟ID
    ownerGuildId: number | null; 
    // 领地的防御/资源等级 (GB风格中，等级通常是1-100)
    level: number; 
    // 运行时图形对象引用
    graphicsObject?: Phaser.GameObjects.Rectangle;
}

// -------------------------------------------------------------------------
// 2. 详细数据和配置 (符合宝可梦Game Boy风格)
// -------------------------------------------------------------------------

/**
 * 宝可梦GB风格的颜色映射
 * GB原版只有4种灰度，这里使用现代颜色模拟其风格
 */
const GB_COLORS = {
    // 联盟颜色
    RED_GUILD: 0xCC0000, // 红色，模拟GB深色调
    BLUE_GUILD: 0x0000CC, // 蓝色，模拟GB深色调
    YELLOW_GUILD: 0xCCAA00, // 黄色，模拟GB深色调
    GREEN_GUILD: 0x009900, // 绿色，模拟GB深色调
    NEUTRAL: 0x808080, // 中立/无主
    BACKGROUND: 0xFFFFFF, // UI背景
    BORDER: 0x000000, // UI边框
};

/**
 * 初始联盟数据
 */
const INITIAL_GUILDS: GuildData[] = [
    { guildId: 1, name: "火箭队残部", color: GB_COLORS.RED_GUILD, territoryCount: 1 },
    { guildId: 2, name: "联盟卫队", color: GB_COLORS.BLUE_GUILD, territoryCount: 1 },
    { guildId: 3, name: "野生宝可梦", color: GB_COLORS.GREEN_GUILD, territoryCount: 0 },
];

/**
 * 初始领地配置
 * 领地名称模拟宝可梦地点
 */
const INITIAL_TERRITORIES: TerritoryConfig[] = [
    // 领地 101: 重要的城市
    { id: 101, name: "常磐市", tileX: 3, tileY: 3, size: 5, ownerGuildId: 1, level: 85 },
    // 领地 102: 资源丰富的区域
    { id: 102, name: "华蓝洞窟", tileX: 10, tileY: 6, size: 3, ownerGuildId: 2, level: 70 },
    // 领地 103: 偏远无主之地
    { id: 103, name: "无人发电厂", tileX: 14, tileY: 14, size: 3, ownerGuildId: null, level: 45 },
    // 领地 104: 战略要地
    { id: 104, name: "彩虹市", tileX: 6, tileY: 12, size: 5, ownerGuildId: 2, level: 90 },
];

// -------------------------------------------------------------------------
// 3. 联盟领地系统实现
// -------------------------------------------------------------------------

/**
 * 联盟领地系统
 * 负责管理地图上的领地显示、交互和状态更新。
 * 作为一个Phaser Scene Plugin或独立System集成到游戏场景中。
 */
export class GuildTerritorySystem {
    private scene: Phaser.Scene;
    private territories: Map<number, TerritoryConfig>;
    private guildMap: Map<number, GuildData>;

    /**
     * 构造函数
     * @param scene 所在的Phaser场景
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.territories = new Map<number, TerritoryConfig>();
        this.guildMap = new Map<number, GuildData>();
        
        console.log("GuildTerritorySystem initialized.");
    }

    /**
     * 初始化系统数据 (实际游戏中可能从服务器加载)
     * @param initialTerritories 初始领地配置列表
     * @param initialGuilds 初始联盟数据列表
     */
    public init(initialTerritories: TerritoryConfig[] = INITIAL_TERRITORIES, initialGuilds: GuildData[] = INITIAL_GUILDS): void {
        initialGuilds.forEach(guild => this.guildMap.set(guild.guildId, guild));
        initialTerritories.forEach(config => {
            this.territories.set(config.id, config);
            this.drawTerritory(config);
        });
    }

    /**
     * 在地图上绘制单个领地的视觉表示 (GB风格: 简单的颜色覆盖)
     * @param config 领地配置
     */
    private drawTerritory(config: TerritoryConfig): void {
        const tilemap = this.scene.sys.settings.map as Phaser.Tilemaps.Tilemap;
        if (!tilemap || !tilemap.tileWidth || !tilemap.tileHeight) {
            console.warn("Tilemap not fully initialized. Cannot draw territory.");
            return;
        }

        const owner = config.ownerGuildId ? this.guildMap.get(config.ownerGuildId) : null;
        const color = owner ? owner.color : GB_COLORS.NEUTRAL;
        const alpha = owner ? 0.3 : 0.1; // 占领的更明显一些

        // 计算领地覆盖的像素区域
        const halfSize = Math.floor(config.size / 2);
        const tileWidth = tilemap.tileWidth;
        const tileHeight = tilemap.tileHeight;

        // 起始瓦块坐标 (左上角)
        const startTileX = config.tileX - halfSize;
        const startTileY = config.tileY - halfSize;

        // 像素坐标 (左上角)
        const startX = startTileX * tileWidth;
        const startY = startTileY * tileHeight;

        // 领地总宽度和高度
        const width = config.size * tileWidth;
        const height = config.size * tileHeight;

        // 销毁旧的图形对象（如果存在）
        if (config.graphicsObject) {
            config.graphicsObject.destroy();
        }

        // 使用一个矩形来覆盖整个领地区域
        const territoryRect = this.scene.add.rectangle(
            startX + width / 2, // 中心X
            startY + height / 2, // 中心Y
            width, 
            height, 
            color, 
            alpha
        );
        territoryRect.setOrigin(0.5, 0.5);
        territoryRect.setDepth(0.5); // 在地图层和角色层之间

        // 添加交互性：鼠标悬停显示领地信息
        territoryRect.setInteractive({ useHandCursor: true });
        territoryRect.on('pointerover', () => this.showTerritoryTooltip(config, territoryRect));
        territoryRect.on('pointerout', () => this.hideTerritoryTooltip());

        // 存储引用
        config.graphicsObject = territoryRect;
    }
    
    /**
     * 更新领地所有权
     * @param territoryId 领地ID
     * @param newOwnerGuildId 新的联盟ID
     */
    public updateTerritoryOwner(territoryId: number, newOwnerGuildId: number | null): void {
        const config = this.territories.get(territoryId);
        if (config) {
            config.ownerGuildId = newOwnerGuildId;
            // 重新绘制以更新颜色和透明度
            this.redrawTerritory(config);
        }
    }

    /**
     * 重新绘制单个领地 (更新图形对象的颜色和透明度)
     */
    private redrawTerritory(config: TerritoryConfig): void {
        if (!config.graphicsObject) {
            // 如果没有图形对象，则重新绘制
            this.drawTerritory(config);
            return;
        }

        const owner = config.ownerGuildId ? this.guildMap.get(config.ownerGuildId) : null;
        const color = owner ? owner.color : GB_COLORS.NEUTRAL;
        const alpha = owner ? 0.3 : 0.1;

        // 更新颜色和透明度
        config.graphicsObject.setFillStyle(color, alpha);
    }

    // -------------------------------------------------------------------------
    // 4. 宝可梦GB风格的UI/交互 (Tooltip/信息框)
    // -------------------------------------------------------------------------
    
    private tooltip: Phaser.GameObjects.Text | null = null;
    private tooltipBackground: Phaser.GameObjects.Graphics | null = null;

    /**
     * 显示领地信息提示框 (GB风格的对话框)
     */
    private showTerritoryTooltip(config: TerritoryConfig, marker: Phaser.GameObjects.Rectangle): void {
        this.hideTerritoryTooltip(); // 确保只显示一个

        const owner = config.ownerGuildId ? this.guildMap.get(config.ownerGuildId) : null;
        const ownerName = owner ? owner.name : "无主之地";
        
        // 提示文本
        const text = [
            `领地: ${config.name}`,
            `所有者: ${ownerName}`,
            `等级: ${config.level}级`,
            `区域: ${config.size}x${config.size} 瓦块`
        ].join('\n');
        
        // GB风格的UI: 黑色边框，白色背景，像素字体
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'monospace', // 模拟像素字体
            fontSize: '10px',
            color: GB_COLORS.BORDER,
            backgroundColor: GB_COLORS.BACKGROUND,
            padding: { x: 4, y: 2 }
        };

        // 提示框位置：固定在屏幕一角 (更符合GB的UI布局)
        const tooltipX = 10;
        const tooltipY = 10;

        this.tooltip = this.scene.add.text(tooltipX, tooltipY, text, style);
        this.tooltip.setOrigin(0, 0);
        this.tooltip.setDepth(100); // 确保在最上层
        this.tooltip.setScrollFactor(0); // 不随地图滚动

        // 绘制背景和边框
        const bounds = this.tooltip.getBounds();
        this.tooltipBackground = this.scene.add.graphics();
        this.tooltipBackground.fillStyle(GB_COLORS.BACKGROUND); // 白色背景
        this.tooltipBackground.fillRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
        this.tooltipBackground.lineStyle(2, GB_COLORS.BORDER); // 黑色边框
        this.tooltipBackground.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
        this.tooltipBackground.setDepth(99);
        this.tooltipBackground.setScrollFactor(0);
    }

    /**
     * 隐藏领地信息提示框
     */
    private hideTerritoryTooltip(): void {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        if (this.tooltipBackground) {
            this.tooltipBackground.destroy();
            this.tooltipBackground = null;
        }
    }

    /**
     * 销毁系统
     */
    public destroy(): void {
        this.territories.forEach(config => {
            if (config.graphicsObject) {
                config.graphicsObject.destroy();
            }
        });
        this.hideTerritoryTooltip();
        this.territories.clear();
        this.guildMap.clear();
        console.log("GuildTerritorySystem destroyed.");
    }
}

// -------------------------------------------------------------------------
// 5. 示例场景集成 (用于演示可运行性)
// -------------------------------------------------------------------------

/**
 * 示例场景，用于演示 GuildTerritorySystem 的集成和运行
 * 实际项目中，这个系统会被集成到主游戏场景中。
 */
export class GameScene extends Phaser.Scene {
    private territorySystem!: GuildTerritorySystem;
    private map!: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;
    private layer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // 模拟加载一个简单的瓦块集 (GB风格)
        // 注意：在实际运行环境中，你需要提供一个名为 'assets/tileset.png' 的图片文件
        this.load.image('tiles', 'assets/tileset.png'); 
    }

    create() {
        // -----------------------------------------------------------------
        // 1. 模拟地图创建 (Phaser 3 Tilemap)
        // -----------------------------------------------------------------
        
        // 创建一个虚拟的地图数据 (16x16 瓦块, 瓦块大小 16x16)
        const mapData = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ];

        this.map = this.make.tilemap({ data: mapData, tileWidth: 16, tileHeight: 16 });
        
        try {
            // 尝试添加 Tileset，如果 'tiles' 图片未加载，这里会抛出错误
            this.tileset = this.map.addTilesetImage('tiles', 'tiles', 16, 16);
            this.layer = this.map.createLayer(0, this.tileset, 0, 0)!;
        } catch (e) {
            // 如果加载失败，创建一个纯色背景并设置地图尺寸
            console.warn("Tileset 'tiles' not loaded. Creating a placeholder background.");
            this.add.rectangle(0, 0, this.map.width * 16, this.map.height * 16, 0xDDDDDD).setOrigin(0, 0);
            this.map.tileWidth = 16;
            this.map.tileHeight = 16;
        }

        // 确保 Tilemap 存在于 Scene Settings 中，以便 System 可以访问
        this.sys.settings.map = this.map;
        
        // -----------------------------------------------------------------
        // 2. 初始化联盟领地系统
        // -----------------------------------------------------------------
        // 使用默认的详细配置数据
        this.territorySystem = new GuildTerritorySystem(this);
        this.territorySystem.init();

        // -----------------------------------------------------------------
        // 3. 模拟游戏逻辑 (例如：5秒后领地易主)
        // -----------------------------------------------------------------
        this.time.delayedCall(5000, () => {
            console.log("5秒后: 常磐市 被 联盟卫队 占领");
            this.territorySystem.updateTerritoryOwner(101, 2);
        }, [], this);

        this.time.delayedCall(10000, () => {
            console.log("10秒后: 华蓝洞窟 变为 无主之地");
            this.territorySystem.updateTerritoryOwner(102, null);
        }, [], this);
    }
}

// -------------------------------------------------------------------------
// 6. 游戏配置和启动
// -------------------------------------------------------------------------

/**
 * 游戏的配置对象
 */
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 256, // 16 * 16 (GB风格分辨率)
    height: 256, // 16 * 16
    zoom: 2, // 放大以适应现代屏幕
    parent: 'game-container', // 假设HTML中有一个id为'game-container'的div
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

/**
 * 游戏实例启动函数
 */
export function startGame() {
    // 检查是否在浏览器环境中运行
    if (typeof window !== 'undefined') {
        new Phaser.Game(config);
    } else {
        console.log("Phaser Game can only be started in a browser environment.");
    }
}

// -------------------------------------------------------------------------
// 7. 导出主模块
// -------------------------------------------------------------------------

// 导出 GuildTerritorySystem 作为核心模块
export default GuildTerritorySystem;

// 为了在单个文件中提供完整的可运行示例，我们添加一个HTML片段
/*
<div id="game-container"></div>
<script src="phaser.min.js"></script>
<script>
// 假设这里是编译后的JS代码，并调用 startGame()
// import { startGame } from './GuildTerritorySystem';
// startGame();
</script>
*/