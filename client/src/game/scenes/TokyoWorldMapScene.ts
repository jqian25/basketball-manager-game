import Phaser from 'phaser';

/**
 * 东京大地图场景
 * 完整的东京开放世界，包含50个场景、10个地标、7个区域
 */
export class TokyoWorldMapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private landmarks: Phaser.GameObjects.Image[] = [];
  private currentDistrict: string = '';
  private uiText!: Phaser.GameObjects.Text;
  private minimap!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'TokyoWorldMapScene' });
  }

  preload() {
    // 加载地标建筑
    this.load.image('tokyo_tower', '/landmarks/tokyo_tower.png');
    this.load.image('tokyo_skytree', '/landmarks/tokyo_skytree.png');
    this.load.image('shinkansen', '/landmarks/shinkansen.png');
    this.load.image('rainbow_bridge', '/landmarks/rainbow_bridge.png');
    this.load.image('fuji_tv', '/landmarks/fuji_tv.png');
    this.load.image('asakusa_temple', '/landmarks/asakusa_temple.png');
    this.load.image('meiji_shrine', '/landmarks/meiji_shrine.png');
    this.load.image('imperial_palace', '/landmarks/imperial_palace.png');
    this.load.image('shibuya_109', '/landmarks/shibuya_109.png');
    this.load.image('tokyo_dome', '/landmarks/tokyo_dome.png');

    // 加载场景图片
    this.load.image('shibuya_crossing', '/maps/tokyo/commercial/shibuya_crossing.png');
    this.load.image('akihabara', '/maps/tokyo/commercial/akihabara.png');
    this.load.image('shinjuku', '/maps/tokyo/commercial/shinjuku.png');

    // 加载瓦片
    this.load.image('brick_center', '/tilesets/ground/brick_center.png');
    this.load.image('road_center', '/tilesets/ground/road_center.png');
    this.load.image('grass_center', '/tilesets/ground/grass_center.png');
    this.load.image('shop_redwhite', '/tilesets/buildings/shop_redwhite.png');
    this.load.image('house_blue', '/tilesets/buildings/house_blue.png');
    this.load.image('office_gold', '/tilesets/buildings/office_gold.png');
    this.load.image('vending_machine', '/tilesets/decorations/vending_machine.png');
    this.load.image('street_lamp', '/tilesets/decorations/street_lamp.png');

    // 加载角色动画
    for (let i = 0; i < 4; i++) {
      this.load.image(`player_down_${i}`, `/sprites/animations/player/down/frame_${i}.png`);
      this.load.image(`player_up_${i}`, `/sprites/animations/player/up/frame_${i}.png`);
      this.load.image(`player_left_${i}`, `/sprites/animations/player/left/frame_${i}.png`);
      this.load.image(`player_right_${i}`, `/sprites/animations/player/right/frame_${i}.png`);
    }
  }

  create() {
    const width = 6400; // 200 tiles * 32px
    const height = 6400;

    // 创建地面（橙色砖地）
    this.createGround(width, height);

    // 创建道路网络
    this.createRoads();

    // 放置地标建筑
    this.placeLandmarks();

    // 放置建筑和装饰
    this.placeBuildings();

    // 创建玩家
    this.createPlayer();

    // 创建相机
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    // 创建控制
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // 创建UI
    this.createUI();

    // 创建小地图
    this.createMinimap();
  }

  private createGround(width: number, height: number) {
    // 使用瓦片填充地面
    for (let x = 0; x < width; x += 32) {
      for (let y = 0; y < height; y += 32) {
        const tile = this.add.image(x, y, 'brick_center');
        tile.setOrigin(0, 0);
        tile.setDepth(0);
      }
    }
  }

  private createRoads() {
    // 主要道路（灰色）
    const roads = [
      // 横向道路
      { x: 0, y: 1600, width: 6400, height: 64 },
      { x: 0, y: 3200, width: 6400, height: 64 },
      { x: 0, y: 4800, width: 6400, height: 64 },
      // 纵向道路
      { x: 2400, y: 0, width: 64, height: 6400 },
      { x: 3600, y: 0, width: 64, height: 6400 },
      { x: 4800, y: 0, width: 64, height: 6400 },
    ];

    roads.forEach(road => {
      for (let x = road.x; x < road.x + road.width; x += 32) {
        for (let y = road.y; y < road.y + road.height; y += 32) {
          const tile = this.add.image(x, y, 'road_center');
          tile.setOrigin(0, 0);
          tile.setDepth(1);
        }
      }
    });
  }

  private placeLandmarks() {
    const landmarks = [
      { key: 'tokyo_tower', x: 3200, y: 3200, name: '东京塔' },
      { key: 'tokyo_skytree', x: 4800, y: 2400, name: '东京晴空塔' },
      { key: 'shibuya_crossing', x: 2400, y: 3200, name: '涩谷十字路口' },
      { key: 'asakusa_temple', x: 5200, y: 2800, name: '浅草寺' },
      { key: 'meiji_shrine', x: 2000, y: 2400, name: '明治神宫' },
      { key: 'imperial_palace', x: 3600, y: 3600, name: '皇居' },
      { key: 'tokyo_dome', x: 4000, y: 2800, name: '东京巨蛋' },
      { key: 'rainbow_bridge', x: 2800, y: 4800, name: '彩虹大桥' },
      { key: 'fuji_tv', x: 3200, y: 5200, name: '富士电视台' },
      { key: 'shibuya_109', x: 2400, y: 3400, name: '涩谷109' },
    ];

    landmarks.forEach(landmark => {
      const img = this.add.image(landmark.x, landmark.y, landmark.key);
      img.setDepth(10);
      img.setInteractive();
      img.on('pointerover', () => {
        this.uiText.setText(`地标: ${landmark.name}\n点击查看详情`);
      });
      img.on('pointerout', () => {
        this.updateUIText();
      });
      img.on('pointerdown', () => {
        this.showLandmarkDetails(landmark.name);
      });
      this.landmarks.push(img);
    });
  }

  private placeBuildings() {
    // 涩谷区域 - 商业建筑
    this.placeBuildingCluster(2000, 3000, 'shop_redwhite', 10);
    this.placeBuildingCluster(2200, 3200, 'office_gold', 8);

    // 新宿区域 - 办公楼
    this.placeBuildingCluster(2800, 2400, 'office_gold', 15);

    // 秋叶原区域 - 商店
    this.placeBuildingCluster(4400, 3200, 'shop_redwhite', 12);

    // 居住区 - 住宅
    this.placeBuildingCluster(1600, 2000, 'house_blue', 20);
    this.placeBuildingCluster(5000, 4000, 'house_blue', 20);

    // 装饰元素（自动售货机、路灯）
    this.placeDecorations();
  }

  private placeBuildingCluster(x: number, y: number, buildingType: string, count: number) {
    for (let i = 0; i < count; i++) {
      const offsetX = Phaser.Math.Between(-200, 200);
      const offsetY = Phaser.Math.Between(-200, 200);
      const building = this.add.image(x + offsetX, y + offsetY, buildingType);
      building.setDepth(5);
    }
  }

  private placeDecorations() {
    // 沿道路放置路灯和自动售货机
    for (let x = 0; x < 6400; x += 200) {
      this.add.image(x, 1600, 'street_lamp').setDepth(6);
      this.add.image(x, 3200, 'street_lamp').setDepth(6);
      if (x % 400 === 0) {
        this.add.image(x + 50, 1650, 'vending_machine').setDepth(6);
      }
    }
  }

  private createPlayer() {
    this.player = this.add.sprite(3200, 3200, 'player_down_0');
    this.player.setDepth(20);

    // 创建玩家动画
    ['down', 'up', 'left', 'right'].forEach(direction => {
      this.anims.create({
        key: `player_walk_${direction}`,
        frames: [0, 1, 2, 3].map(i => ({ key: `player_${direction}_${i}` })),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  private createUI() {
    this.uiText = this.add.text(16, 16, '', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 10 },
    });
    this.uiText.setScrollFactor(0);
    this.uiText.setDepth(100);
    this.updateUIText();
  }

  private createMinimap() {
    const minimapSize = 200;
    this.minimap = this.add.graphics();
    this.minimap.setScrollFactor(0);
    this.minimap.setDepth(101);

    // 背景
    this.minimap.fillStyle(0x000000, 0.7);
    this.minimap.fillRect(
      this.cameras.main.width - minimapSize - 20,
      20,
      minimapSize,
      minimapSize
    );
  }

  private updateUIText() {
    const playerX = Math.floor(this.player.x);
    const playerY = Math.floor(this.player.y);
    this.uiText.setText(
      `东京大地图\n位置: (${playerX}, ${playerY})\n区域: ${this.currentDistrict}\n\nWASD/方向键: 移动\n鼠标: 点击地标查看详情`
    );
  }

  private updateDistrict() {
    const x = this.player.x;
    const y = this.player.y;

    if (x >= 2000 && x <= 2800 && y >= 3000 && y <= 3800) {
      this.currentDistrict = '涩谷区';
    } else if (x >= 2800 && x <= 3600 && y >= 2400 && y <= 3200) {
      this.currentDistrict = '新宿区';
    } else if (x >= 4400 && x <= 5200 && y >= 3200 && y <= 4000) {
      this.currentDistrict = '秋叶原区';
    } else if (x >= 5000 && x <= 5800 && y >= 2600 && y <= 3400) {
      this.currentDistrict = '浅草区';
    } else if (x >= 2200 && x <= 2800 && y >= 2600 && y <= 3200) {
      this.currentDistrict = '原宿区';
    } else if (x >= 3600 && x <= 4400 && y >= 4000 && y <= 4800) {
      this.currentDistrict = '银座区';
    } else if (x >= 2800 && x <= 3800 && y >= 5000 && y <= 5800) {
      this.currentDistrict = '台场区';
    } else {
      this.currentDistrict = '东京都';
    }
  }

  private showLandmarkDetails(name: string) {
    // 显示地标详情（可以扩展为完整的对话框）
    this.uiText.setText(`地标: ${name}\n\n[按ESC关闭]`);
  }

  private updateMinimap() {
    const minimapSize = 200;
    const minimapX = this.cameras.main.width - minimapSize - 20;
    const minimapY = 20;
    const scale = minimapSize / 6400;

    this.minimap.clear();

    // 背景
    this.minimap.fillStyle(0x000000, 0.7);
    this.minimap.fillRect(minimapX, minimapY, minimapSize, minimapSize);

    // 地标
    this.landmarks.forEach(landmark => {
      const x = minimapX + landmark.x * scale;
      const y = minimapY + landmark.y * scale;
      this.minimap.fillStyle(0xffff00, 1);
      this.minimap.fillCircle(x, y, 3);
    });

    // 玩家位置
    const playerX = minimapX + this.player.x * scale;
    const playerY = minimapY + this.player.y * scale;
    this.minimap.fillStyle(0xff0000, 1);
    this.minimap.fillCircle(playerX, playerY, 4);
  }

  update() {
    // 移动控制
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -speed;
      this.player.play('player_walk_left', true);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = speed;
      this.player.play('player_walk_right', true);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -speed;
      this.player.play('player_walk_up', true);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = speed;
      this.player.play('player_walk_down', true);
    }

    // 归一化对角线速度
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    // 应用移动
    this.player.x += velocityX * (1 / 60);
    this.player.y += velocityY * (1 / 60);

    // 边界限制
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, 6400);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, 6400);

    // 停止时停止动画
    if (velocityX === 0 && velocityY === 0) {
      this.player.anims.stop();
    }

    // 更新区域和UI
    this.updateDistrict();
    this.updateUIText();
    this.updateMinimap();
  }
}

