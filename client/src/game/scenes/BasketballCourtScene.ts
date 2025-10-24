import Phaser from 'phaser';
import { ChestSystem } from '../systems/ChestSystem';
import { LevelPortalSystem } from '../systems/LevelPortalSystem';

/**
 * 超大Kairosoft风格篮球场等距地图场景
 * 150x100瓦片 + 超级玛丽配色方案
 */
export class BasketballCourtScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private player!: Phaser.GameObjects.Sprite;
  private map!: Phaser.Tilemaps.Tilemap;  private buildingLayer!: Phaser.Tilemaps.TilemapLayer;
  private chestSystem!: ChestSystem;
  private portalSystem!: LevelPortalSystem;
  private eKey!: Phaser.Input.Keyboard.Key;  
  // 超大地图配置
  private readonly TILE_WIDTH = 64;
  private readonly TILE_HEIGHT = 32;
  private readonly MAP_WIDTH = 150;   // 超大地图宽度
  private readonly MAP_HEIGHT = 100;  // 超大地图高度
  
  // 超级玛丽配色方案
  private readonly COLORS = {
    BRIGHT_YELLOW: 0xFFFF00,    // 金币黄
    BRIGHT_RED: 0xFF0000,       // 马里奥红
    SKY_BLUE: 0x5C94FC,         // 天空蓝
    DEEP_BLUE: 0x0000FF,        // 深蓝
    BRICK_BROWN: 0x8B4513,      // 砖块棕
    BRIGHT_ORANGE: 0xFFA500,    // 橙色
    BRIGHT_GREEN: 0x00FF00,     // 鲜绿色
    GRASS_GREEN: 0x00A800       // 草地绿
  };
  
  constructor() {
    super({ key: 'BasketballCourtScene' });
  }

  preload() {
    this.load.setPath('/tiles/');
    
    // 加载所有瓦片
    this.load.image('grass_base', 'grass_base.png');
    this.load.image('grass_flower', 'grass_flower.png');
    this.load.image('court_orange', 'court_orange.png');
    this.load.image('court_blue', 'court_blue.png');
    this.load.image('road_straight', 'road_straight.png');
    this.load.image('water', 'water.png');
    this.load.image('tree_small', 'tree_small.png');
    this.load.image('basketball_hoop', 'basketball_hoop.png');
    this.load.image('bench', 'bench.png');
    this.load.image('fence', 'fence.png');
    this.load.image('building_red_roof', 'building_red_roof.png');
    this.load.image('building_orange_roof', 'building_orange_roof.png');
    this.load.image('gym_entrance', 'gym_entrance.png');
    this.load.image('scoreboard', 'scoreboard.png');
    this.load.image('bleachers', 'bleachers.png');
    
    // 加载角色
    this.load.setPath('/sprites/animations/');
    this.load.image('player', 'char_1_down_1.png');
    
    // 加载道具和宝箱
    this.load.setPath('/items/');
    this.load.image('basketball_coin', 'basketball_coin.png');
    this.load.image('chest_gold', 'chest_gold.png');
    this.load.image('chest_silver', 'chest_silver.png');
    this.load.image('energy_basketball', 'energy_basketball.png');
    this.load.image('fire_basketball', 'fire_basketball.png');
    this.load.image('shield_basketball', 'shield_basketball.png');
    this.load.image('speed_shoes', 'speed_shoes.png');
    this.load.image('level_portal', 'level_portal.png');
  }

  create() {
    // 创建超大等距地图
    this.createMassiveIsometricMap();
    
    // 创建玩家
    this.createPlayer();
    
    // 设置相机
    this.setupCamera();
        // 设置输入控制
    this.setupInput();
    
    // 初始化宝箱系统
    this.chestSystem = new ChestSystem(this);
    this.chestSystem.initialize();
    
    // 初始化关卡传送门系统
    this.portalSystem = new LevelPortalSystem(this);
    this.portalSystem.initialize();    
    // 添加UI
    this.addUIText();
    
    // 添加小地图
    this.createMinimap();
  }

  /**
   * 创建超大等距地图
   */
  private createMassiveIsometricMap() {
    this.map = this.make.tilemap({
      tileWidth: this.TILE_WIDTH,
      tileHeight: this.TILE_HEIGHT,
      width: this.MAP_WIDTH,
      height: this.MAP_HEIGHT,
      orientation: 'isometric'
    });

    // 添加瓦片集
    const tilesets = [
      this.map.addTilesetImage('grass_base', 'grass_base', this.TILE_WIDTH, this.TILE_HEIGHT),
      this.map.addTilesetImage('grass_flower', 'grass_flower', this.TILE_WIDTH, this.TILE_HEIGHT),
      this.map.addTilesetImage('court_orange', 'court_orange', this.TILE_WIDTH, this.TILE_HEIGHT),
      this.map.addTilesetImage('court_blue', 'court_blue', this.TILE_WIDTH, this.TILE_HEIGHT),
      this.map.addTilesetImage('road_straight', 'road_straight', this.TILE_WIDTH, this.TILE_HEIGHT),
      this.map.addTilesetImage('water', 'water', this.TILE_WIDTH, this.TILE_HEIGHT)
    ].filter(t => t !== null);

    // 创建地面层
    this.groundLayer = this.map.createBlankLayer('Ground', tilesets)!;

    // 填充超大地图数据
    this.fillMassiveMapData();
  }

  /**
   * 填充超大地图数据
   */
  private fillMassiveMapData() {
    console.log('🗺️ 开始生成超大地图：150x100瓦片...');
    
    // 1. 填充草地背景
    for (let y = 0; y < this.MAP_HEIGHT; y++) {
      for (let x = 0; x < this.MAP_WIDTH; x++) {
        const isFlower = Math.random() < 0.15;
        const tileName = isFlower ? 'grass_flower' : 'grass_base';
        const tileIndex = this.map.getTilesetIndex(tileName);
        this.groundLayer.putTileAt(tileIndex, x, y);
      }
    }

    // 2. 创建3个标准篮球场
    this.createBasketballCourt(25, 20, '主场馆');
    this.createBasketballCourt(75, 20, '训练场A');
    this.createBasketballCourt(25, 60, '训练场B');

    // 3. 创建道路网络
    this.createRoadNetwork();

    // 4. 创建建筑群
    this.createBuildingClusters();

    // 5. 创建装饰区域
    this.createDecorationAreas();

    // 6. 创建水景区
    this.createWaterFeatures();

    console.log('✅ 超大地图生成完成！');
  }

  /**
   * 创建篮球场
   */
  private createBasketballCourt(startX: number, startY: number, label: string) {
    const courtWidth = 28;
    const courtHeight = 15;

    // 填充篮球场地板
    for (let y = startY; y < startY + courtHeight; y++) {
      for (let x = startX; x < startX + courtWidth; x++) {
        // 罚球区使用蓝色
        const isFreeThrowArea = (
          (x >= startX + 2 && x <= startX + 6 && y >= startY + 5 && y <= startY + 10) ||
          (x >= startX + courtWidth - 7 && x <= startX + courtWidth - 3 && y >= startY + 5 && y <= startY + 10)
        );
        
        const tileName = isFreeThrowArea ? 'court_blue' : 'court_orange';
        const tileIndex = this.map.getTilesetIndex(tileName);
        this.groundLayer.putTileAt(tileIndex, x, y);
      }
    }

    // 添加篮球架
    this.addSprite(startX + 2, startY + 7, 'basketball_hoop', 2);
    this.addSprite(startX + courtWidth - 3, startY + 7, 'basketball_hoop', 2);

    // 添加记分牌
    this.addSprite(startX + 14, startY - 3, 'scoreboard', 2);

    // 添加看台
    this.addSprite(startX + courtWidth + 2, startY + 7, 'bleachers', 2.5);
    this.addSprite(startX - 4, startY + 7, 'bleachers', 2.5);

    // 添加长椅（替补席）
    for (let i = 0; i < 4; i++) {
      this.addSprite(startX - 2, startY + 3 + i * 2, 'bench', 1);
      this.addSprite(startX + courtWidth + 1, startY + 3 + i * 2, 'bench', 1);
    }

    // 添加栅栏
    for (let x = startX - 1; x <= startX + courtWidth; x++) {
      this.addSprite(x, startY - 1, 'fence', 0.5);
      this.addSprite(x, startY + courtHeight, 'fence', 0.5);
    }
  }

  /**
   * 创建道路网络
   */
  private createRoadNetwork() {
    // 横向主干道
    for (let x = 0; x < this.MAP_WIDTH; x++) {
      this.groundLayer.putTileAt(this.map.getTilesetIndex('road_straight'), x, 40);
      this.groundLayer.putTileAt(this.map.getTilesetIndex('road_straight'), x, 80);
    }

    // 纵向主干道
    for (let y = 0; y < this.MAP_HEIGHT; y++) {
      this.groundLayer.putTileAt(this.map.getTilesetIndex('road_straight'), 50, y);
      this.groundLayer.putTileAt(this.map.getTilesetIndex('road_straight'), 100, y);
    }
  }

  /**
   * 创建建筑群
   */
  private createBuildingClusters() {
    // 体育馆群（左上）
    this.addSprite(10, 10, 'gym_entrance', 3);
    this.addSprite(18, 10, 'building_red_roof', 2.5);
    this.addSprite(10, 18, 'building_orange_roof', 2.5);

    // 商业区（右上）
    this.addSprite(130, 10, 'building_orange_roof', 2.5);
    this.addSprite(138, 10, 'building_red_roof', 2.5);
    this.addSprite(130, 18, 'gym_entrance', 3);

    // 宿舍区（左下）
    this.addSprite(10, 85, 'building_red_roof', 2.5);
    this.addSprite(18, 85, 'building_orange_roof', 2.5);
    this.addSprite(10, 93, 'building_red_roof', 2.5);

    // 训练设施区（右下）
    this.addSprite(130, 85, 'gym_entrance', 3);
    this.addSprite(138, 85, 'building_orange_roof', 2.5);
  }

  /**
   * 创建装饰区域
   */
  private createDecorationAreas() {
    // 随机种植树木
    for (let i = 0; i < 200; i++) {
      const x = Math.floor(Math.random() * this.MAP_WIDTH);
      const y = Math.floor(Math.random() * this.MAP_HEIGHT);
      
      // 避开篮球场和道路区域
      if (this.isGrassArea(x, y)) {
        this.addSprite(x, y, 'tree_small', 1.5);
      }
    }

    // 随机放置长椅
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(Math.random() * this.MAP_WIDTH);
      const y = Math.floor(Math.random() * this.MAP_HEIGHT);
      
      if (this.isGrassArea(x, y)) {
        this.addSprite(x, y, 'bench', 1);
      }
    }
  }

  /**
   * 创建水景区
   */
  private createWaterFeatures() {
    // 右下角大水池
    for (let y = 90; y < this.MAP_HEIGHT; y++) {
      for (let x = 140; x < this.MAP_WIDTH; x++) {
        this.groundLayer.putTileAt(this.map.getTilesetIndex('water'), x, y);
      }
    }

    // 左上角小水池
    for (let y = 5; y < 12; y++) {
      for (let x = 35; x < 42; x++) {
        this.groundLayer.putTileAt(this.map.getTilesetIndex('water'), x, y);
      }
    }
  }

  /**
   * 检查是否为草地区域
   */
  private isGrassArea(x: number, y: number): boolean {
    const tile = this.groundLayer.getTileAt(x, y);
    if (!tile) return false;
    
    const tileName = tile.tileset?.name;
    return tileName === 'grass_base' || tileName === 'grass_flower';
  }

  /**
   * 添加精灵
   */
  private addSprite(tileX: number, tileY: number, texture: string, scale: number = 1) {
    const worldPos = this.map.tileToWorldXY(tileX, tileY);
    
    if (worldPos) {
      const sprite = this.add.sprite(worldPos.x, worldPos.y, texture);
      sprite.setOrigin(0.5, 1);
      sprite.setScale(scale);
      sprite.setDepth(worldPos.y);
    }
  }

  /**
   * 创建玩家
   */
  private createPlayer() {
    const centerX = Math.floor(this.MAP_WIDTH / 2);
    const centerY = Math.floor(this.MAP_HEIGHT / 2);
    const worldPos = this.map.tileToWorldXY(centerX, centerY);

    if (worldPos) {
      this.player = this.add.sprite(worldPos.x, worldPos.y, 'player');
      this.player.setOrigin(0.5, 1);
      this.player.setScale(2);
      this.player.setDepth(10000);
    }
  }

  /**
   * 设置相机
   */
  private setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    const bounds = this.map.getBounds();
    this.cameras.main.setBounds(
      bounds.x - 400,
      bounds.y - 400,
      bounds.width + 800,
      bounds.height + 800
    );
    
    this.cameras.main.setZoom(1);
  }

  /**
   * 设置输入
   */
  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // E键打开宝箱
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  /**
   * 添加UI文本
   */
  private addUIText() {
    const text = this.add.text(16, 16, 
      '🏀 超大篮球王国 (150x100瓦片)\n' +
      '🎨 超级玛丽配色方案\n' +
      '🎮 WASD移动 | 鼠标滚轮缩放', 
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 12, y: 12 }
      }
    );
    text.setScrollFactor(0);
    text.setDepth(10001);
  }

  /**
   * 创建小地图
   */
  private createMinimap() {
    const minimap = this.cameras.add(
      this.cameras.main.width - 210,
      10,
      200,
      133
    );
    
    minimap.setZoom(0.1);
    minimap.centerOn(0, 0);
    minimap.setBackgroundColor(0x000000);
    minimap.setBounds(
      this.map.getBounds().x,
      this.map.getBounds().y,
      this.map.getBounds().width,
      this.map.getBounds().height
    );
  }

  update(time: number, delta: number) {
    this.handlePlayerMovement(delta);
    this.handleZoom();
    
    // 更新宝箱系统
    if (this.chestSystem && this.player) {
      this.chestSystem.update(this.player.x, this.player.y);
    }
    
    // 更新关卡传送门系统
    if (this.portalSystem && this.player) {
      this.portalSystem.update(this.player.x, this.player.y);
    }
  }

  /**
   * 处理玩家移动
   */
  private handlePlayerMovement(delta: number) {
    const speed = 300;
    const moveDistance = (speed * delta) / 1000;

    let moveX = 0;
    let moveY = 0;

    if (this.wasdKeys.W.isDown || this.cursors.up?.isDown) moveY -= moveDistance;
    if (this.wasdKeys.S.isDown || this.cursors.down?.isDown) moveY += moveDistance;
    if (this.wasdKeys.A.isDown || this.cursors.left?.isDown) moveX -= moveDistance;
    if (this.wasdKeys.D.isDown || this.cursors.right?.isDown) moveX += moveDistance;

    if (moveX !== 0 || moveY !== 0) {
      const isoX = (moveX - moveY) * 0.5;
      const isoY = (moveX + moveY) * 0.25;
      
      this.player.x += isoX;
      this.player.y += isoY;
      this.player.setDepth(this.player.y);
    }
  }

  /**
   * 处理缩放
   */
  private handleZoom() {
    // 鼠标滚轮缩放
    this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      const currentZoom = this.cameras.main.zoom;
      const newZoom = Phaser.Math.Clamp(currentZoom - deltaY * 0.001, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
    });
  }
}

