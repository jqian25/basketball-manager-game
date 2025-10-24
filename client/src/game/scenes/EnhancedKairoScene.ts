/**
 * 增强版开罗篮球游戏场景
 * 包含完整的东京街区、篮球道场、会动的NPC、建筑放大系统
 */

import Phaser from 'phaser';

// NPC类型定义
interface NPC {
  sprite: Phaser.GameObjects.Sprite;
  name: string;
  role: string;
  currentAction: string;
  targetX?: number;
  targetY?: number;
  speed: number;
  personality: string;
}

export class EnhancedKairoScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private npcs: NPC[] = [];
  
  // 游戏参数
  private playerSpeed: number = 120;
  private tileWidth: number = 64;
  private tileHeight: number = 32;
  
  // 游戏状态
  private money: number = 50000;
  private fans: number = 100;
  
  // UI元素
  private moneyText!: Phaser.GameObjects.Text;
  private fansText!: Phaser.GameObjects.Text;
  private interactionPrompt!: Phaser.GameObjects.Text;
  
  // 建筑物
  private buildings: Map<string, Phaser.GameObjects.Image> = new Map();
  private nearbyBuilding: string | null = null;

  constructor() {
    super({ key: 'EnhancedKairoScene' });
  }

  preload() {
    // 创建所有sprite资源
    this.createAllSprites();
  }

  private createAllSprites() {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    
    // 1. 创建玩家sprite (4方向动画)
    this.createPlayerSprites(graphics);
    
    // 2. 创建NPC sprite (多种类型)
    this.createNPCSprites(graphics);
    
    // 3. 创建地面瓦片
    this.createTileSprites(graphics);
    
    // 4. 创建建筑sprite
    this.createBuildingSprites(graphics);
    
    // 5. 创建篮球和装饰物
    this.createDecorationSprites(graphics);
    
    graphics.destroy();
  }

  private createPlayerSprites(graphics: Phaser.GameObjects.Graphics) {
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(dir => {
      for (let frame = 0; frame < 4; frame++) {
        graphics.clear();
        
        const baseX = 12;
        const baseY = 16;
        
        // 身体颜色
        const skinColor = 0xffdbac;
        const shirtColor = 0xff6600; // 橙色球衣
        const pantsColor = 0x0066cc; // 蓝色裤子
        const hairColor = 0x332211;
        
        // 根据方向绘制
        if (dir === 'down') {
          // 头发
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 6, baseY - 14, 12, 6);
          // 脸
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 5, baseY - 8, 10, 8);
          // 眼睛
          graphics.fillStyle(0x000000);
          graphics.fillRect(baseX - 3, baseY - 5, 2, 2);
          graphics.fillRect(baseX + 1, baseY - 5, 2, 2);
          // 球衣
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 7, baseY, 14, 10);
          // 号码1
          graphics.fillStyle(0xffffff);
          graphics.fillRect(baseX - 1, baseY + 2, 2, 6);
          // 腿(行走动画)
          graphics.fillStyle(pantsColor);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillRect(baseX - 5 + legOffset, baseY + 10, 3, 6);
          graphics.fillRect(baseX + 2 - legOffset, baseY + 10, 3, 6);
        } else if (dir === 'up') {
          // 背面
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 6, baseY - 14, 12, 6);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 7, baseY - 8, 14, 18);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillStyle(pantsColor);
          graphics.fillRect(baseX - 5 + legOffset, baseY + 10, 3, 6);
          graphics.fillRect(baseX + 2 - legOffset, baseY + 10, 3, 6);
        } else if (dir === 'left') {
          // 侧面
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 4, baseY - 14, 8, 6);
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 4, baseY - 8, 6, 8);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 6, baseY, 10, 10);
          const legOffset = frame % 2 === 0 ? 0 : 3;
          graphics.fillStyle(pantsColor);
          graphics.fillRect(baseX - 4, baseY + 10 + legOffset, 3, 6);
          graphics.fillRect(baseX, baseY + 10 - legOffset, 3, 6);
        } else {
          // 右侧
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 4, baseY - 14, 8, 6);
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 2, baseY - 8, 6, 8);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 4, baseY, 10, 10);
          const legOffset = frame % 2 === 0 ? 0 : 3;
          graphics.fillStyle(pantsColor);
          graphics.fillRect(baseX - 3, baseY + 10 + legOffset, 3, 6);
          graphics.fillRect(baseX + 1, baseY + 10 - legOffset, 3, 6);
        }
        
        graphics.generateTexture(`player_${dir}_${frame}`, 24, 32);
      }
    });
  }

  private createNPCSprites(graphics: Phaser.GameObjects.Graphics) {
    // 创建不同类型的NPC
    const npcTypes = [
      { name: 'player1', color: 0xff0000 }, // 红色球员
      { name: 'player2', color: 0x00ff00 }, // 绿色球员
      { name: 'coach', color: 0x000000 },   // 黑色教练
      { name: 'fan', color: 0xffff00 }      // 黄色粉丝
    ];
    
    npcTypes.forEach(type => {
      const directions = ['down', 'up', 'left', 'right'];
      
      directions.forEach(dir => {
        for (let frame = 0; frame < 4; frame++) {
          graphics.clear();
          
          const baseX = 12;
          const baseY = 16;
          
          // 使用不同颜色区分NPC
          if (dir === 'down') {
            graphics.fillStyle(0xffdbac);
            graphics.fillRect(baseX - 4, baseY - 12, 8, 8);
            graphics.fillStyle(type.color);
            graphics.fillRect(baseX - 6, baseY - 4, 12, 8);
            graphics.fillStyle(0x0066cc);
            const legOffset = frame % 2 === 0 ? 0 : 2;
            graphics.fillRect(baseX - 5 + legOffset, baseY + 4, 3, 6);
            graphics.fillRect(baseX + 2 - legOffset, baseY + 4, 3, 6);
          } else if (dir === 'up') {
            graphics.fillStyle(type.color);
            graphics.fillRect(baseX - 6, baseY - 12, 12, 16);
            graphics.fillStyle(0x0066cc);
            const legOffset = frame % 2 === 0 ? 0 : 2;
            graphics.fillRect(baseX - 5 + legOffset, baseY + 4, 3, 6);
            graphics.fillRect(baseX + 2 - legOffset, baseY + 4, 3, 6);
          } else {
            graphics.fillStyle(0xffdbac);
            graphics.fillRect(baseX - 4, baseY - 12, 8, 8);
            graphics.fillStyle(type.color);
            graphics.fillRect(baseX - 5, baseY - 4, 10, 8);
            graphics.fillStyle(0x0066cc);
            const legOffset = frame % 2 === 0 ? 0 : 2;
            graphics.fillRect(baseX - 4, baseY + 4 + legOffset, 3, 6);
            graphics.fillRect(baseX + 1, baseY + 4 - legOffset, 3, 6);
          }
          
          graphics.generateTexture(`npc_${type.name}_${dir}_${frame}`, 24, 32);
        }
      });
    });
  }

  private createTileSprites(graphics: Phaser.GameObjects.Graphics) {
    // 草地
    graphics.fillStyle(0x4a9d4a);
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    graphics.fillStyle(0x3d8a3d);
    for (let i = 0; i < 5; i++) {
      graphics.fillRect(10 + i * 10, 14 + i * 2, 2, 2);
    }
    graphics.generateTexture('tile_grass', 64, 32);
    graphics.clear();
    
    // 道路
    graphics.fillStyle(0x888888);
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    graphics.fillStyle(0x999999);
    graphics.fillRect(28, 14, 8, 4);
    graphics.generateTexture('tile_road', 64, 32);
    graphics.clear();
    
    // 篮球场地板
    graphics.fillStyle(0xd2691e);
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    graphics.fillStyle(0xffffff);
    graphics.fillRect(30, 15, 4, 2);
    graphics.generateTexture('tile_court', 64, 32);
    graphics.clear();
  }

  private createBuildingSprites(graphics: Phaser.GameObjects.Graphics) {
    // 篮球道场 (大型建筑)
    graphics.fillStyle(0x8b0000);
    graphics.fillRect(0, 60, 120, 80);
    graphics.fillStyle(0xffff00);
    graphics.fillRect(10, 65, 100, 15);
    graphics.fillStyle(0x000000);
    this.add.text(30, 70, '篮球道场', { fontSize: '12px', color: '#000000' }).setOrigin(0);
    graphics.fillStyle(0x654321);
    graphics.fillRect(50, 110, 20, 30);
    graphics.generateTexture('building_dojo', 120, 140);
    graphics.clear();
    
    // 训练馆
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(0, 50, 100, 70);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(10, 55, 80, 12);
    graphics.fillStyle(0x654321);
    graphics.fillRect(40, 95, 20, 25);
    graphics.generateTexture('building_training', 100, 120);
    graphics.clear();
    
    // 商店
    graphics.fillStyle(0xff6600);
    graphics.fillRect(0, 40, 80, 60);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(10, 45, 60, 10);
    graphics.fillStyle(0x654321);
    graphics.fillRect(30, 75, 20, 25);
    graphics.generateTexture('building_shop', 80, 100);
    graphics.clear();
    
    // 公园
    graphics.fillStyle(0x228b22);
    graphics.fillRect(0, 30, 80, 50);
    graphics.fillStyle(0x8b4513);
    graphics.fillCircle(40, 55, 15);
    graphics.fillStyle(0x006400);
    graphics.fillCircle(40, 45, 20);
    graphics.generateTexture('building_park', 80, 80);
    graphics.clear();
  }

  private createDecorationSprites(graphics: Phaser.GameObjects.Graphics) {
    // 篮球
    graphics.fillStyle(0xff6600);
    graphics.fillCircle(8, 8, 6);
    graphics.lineStyle(1, 0x000000);
    graphics.strokeCircle(8, 8, 6);
    graphics.generateTexture('basketball', 16, 16);
    graphics.clear();
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // 创建地图
    this.createLargeMap();
    
    // 创建玩家
    this.createPlayer();
    
    // 创建建筑
    this.createBuildings();
    
    // 创建NPC
    this.createNPCs();
    
    // 设置输入
    this.setupInput();
    
    // 创建动画
    this.createAnimations();
    
    // 创建UI
    this.createUI();
    
    // 设置相机
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.2);
    
    // 启动NPC AI
    this.startNPCAI();
  }

  private createLargeMap() {
    // 创建20x20的大地图
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const isoPos = this.cartesianToIsometric(x, y);
        
        // 地图布局: 中心是篮球场,周围是道路和草地
        let texture = 'tile_grass';
        
        // 道路网格
        if ((x >= 8 && x <= 11) || (y >= 8 && y <= 11)) {
          texture = 'tile_road';
        }
        
        // 篮球场区域
        if (x >= 9 && x <= 10 && y >= 9 && y <= 10) {
          texture = 'tile_court';
        }
        
        const tile = this.add.image(isoPos.x, isoPos.y, texture);
        tile.setDepth(y * 100 + x);
      }
    }
  }

  private createPlayer() {
    const startPos = this.cartesianToIsometric(10, 10);
    this.player = this.add.sprite(startPos.x, startPos.y - 16, 'player_down_0');
    this.player.setDepth(10000);
  }

  private createBuildings() {
    // 篮球道场 (中心位置)
    const dojoPos = this.cartesianToIsometric(9, 9);
    const dojo = this.add.image(dojoPos.x, dojoPos.y - 70, 'building_dojo');
    dojo.setDepth(900);
    dojo.setInteractive();
    dojo.setData('buildingType', 'dojo');
    this.buildings.set('dojo', dojo);
    
    // 训练馆
    const trainingPos = this.cartesianToIsometric(15, 5);
    const training = this.add.image(trainingPos.x, trainingPos.y - 60, 'building_training');
    training.setDepth(500);
    training.setInteractive();
    training.setData('buildingType', 'training');
    this.buildings.set('training', training);
    
    // 商店
    const shopPos = this.cartesianToIsometric(5, 15);
    const shop = this.add.image(shopPos.x, shopPos.y - 50, 'building_shop');
    shop.setDepth(1500);
    shop.setInteractive();
    shop.setData('buildingType', 'shop');
    this.buildings.set('shop', shop);
    
    // 公园
    const parkPos = this.cartesianToIsometric(15, 15);
    const park = this.add.image(parkPos.x, parkPos.y - 40, 'building_park');
    park.setDepth(1500);
    park.setInteractive();
    park.setData('buildingType', 'park');
    this.buildings.set('park', park);
  }

  private createNPCs() {
    // 在篮球场创建打球的NPC
    for (let i = 0; i < 4; i++) {
      const npcPos = this.cartesianToIsometric(9 + (i % 2), 9 + Math.floor(i / 2));
      const npcType = i % 2 === 0 ? 'player1' : 'player2';
      const sprite = this.add.sprite(npcPos.x, npcPos.y - 16, `npc_${npcType}_down_0`);
      sprite.setDepth(1000 + i);
      
      this.npcs.push({
        sprite,
        name: `球员${i + 1}`,
        role: 'player',
        currentAction: 'playing',
        speed: 50 + Math.random() * 30,
        personality: i % 2 === 0 ? '积极进攻' : '稳健防守'
      });
    }
    
    // 在道路上创建行人NPC
    for (let i = 0; i < 3; i++) {
      const npcPos = this.cartesianToIsometric(8 + i * 2, 8);
      const sprite = this.add.sprite(npcPos.x, npcPos.y - 16, 'npc_fan_down_0');
      sprite.setDepth(800 + i);
      
      this.npcs.push({
        sprite,
        name: `路人${i + 1}`,
        role: 'pedestrian',
        currentAction: 'walking',
        speed: 40 + Math.random() * 20,
        personality: '随机漫游'
      });
    }
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // WASD键
    const keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
    // 映射WASD到方向键
    this.cursors.up = keyW;
    this.cursors.left = keyA;
    this.cursors.down = keyS;
    this.cursors.right = keyD;
    
    // 空格键互动
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on('down', () => {
      if (this.nearbyBuilding) {
        this.enterBuilding(this.nearbyBuilding);
      }
    });
  }

  private createAnimations() {
    const directions = ['down', 'up', 'left', 'right'];
    
    // 玩家动画
    directions.forEach(dir => {
      this.anims.create({
        key: `player_walk_${dir}`,
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `player_${dir}_${i}` })),
        frameRate: 8,
        repeat: -1
      });
    });
    
    // NPC动画
    const npcTypes = ['player1', 'player2', 'coach', 'fan'];
    npcTypes.forEach(type => {
      directions.forEach(dir => {
        this.anims.create({
          key: `npc_${type}_walk_${dir}`,
          frames: Array.from({ length: 4 }, (_, i) => ({ key: `npc_${type}_${dir}_${i}` })),
          frameRate: 8,
          repeat: -1
        });
      });
    });
  }

  private createUI() {
    this.moneyText = this.add.text(10, 10, `💰 ¥${this.money}`, {
      fontSize: '20px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(20000);
    
    this.fansText = this.add.text(10, 45, `👥 粉丝: ${this.fans}`, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(20000);
    
    this.add.text(10, 80, 'WASD移动 | 空格互动', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(20000);
    
    this.interactionPrompt = this.add.text(400, 550, '', {
      fontSize: '18px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20000).setVisible(false);
  }

  private startNPCAI() {
    // 每秒更新NPC行为
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.npcs.forEach(npc => {
          if (npc.role === 'pedestrian' && Math.random() < 0.3) {
            // 随机移动
            const randomX = 5 + Math.floor(Math.random() * 10);
            const randomY = 5 + Math.floor(Math.random() * 10);
            const targetPos = this.cartesianToIsometric(randomX, randomY);
            npc.targetX = targetPos.x;
            npc.targetY = targetPos.y - 16;
          }
        });
      },
      loop: true
    });
  }

  private cartesianToIsometric(x: number, y: number): { x: number, y: number } {
    const isoX = (x - y) * (this.tileWidth / 2);
    const isoY = (x + y) * (this.tileHeight / 2);
    return { x: isoX + 640, y: isoY + 200 };
  }

  private enterBuilding(buildingType: string) {
    const messages: Record<string, string> = {
      dojo: '欢迎来到篮球道场!这里有最好的训练设施!',
      training: '训练馆开放中!提升你的技能!',
      shop: '装备商店!购买最新的篮球装备!',
      park: '公园是休息的好地方!'
    };
    
    this.showMessage('进入建筑', messages[buildingType] || '');
  }

  private showMessage(title: string, message: string) {
    const bg = this.add.rectangle(640, 360, 500, 200, 0x000000, 0.9);
    bg.setScrollFactor(0).setDepth(30000);
    
    const titleText = this.add.text(640, 300, title, {
      fontSize: '28px',
      color: '#ffff00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30001);
    
    const msgText = this.add.text(640, 360, message, {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: 450 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30001);
    
    this.time.delayedCall(3000, () => {
      bg.destroy();
      titleText.destroy();
      msgText.destroy();
    });
  }

  update() {
    if (!this.cursors) return;
    
    // 玩家移动
    this.updatePlayerMovement();
    
    // NPC移动
    this.updateNPCMovement();
    
    // 检查建筑物距离
    this.checkBuildingProximity();
  }

  private updatePlayerMovement() {
    let velocityX = 0;
    let velocityY = 0;
    let direction = '';
    
    if (this.cursors.left.isDown) {
      velocityX = -this.playerSpeed;
      direction = 'left';
    } else if (this.cursors.right.isDown) {
      velocityX = this.playerSpeed;
      direction = 'right';
    }
    
    if (this.cursors.up.isDown) {
      velocityY = -this.playerSpeed;
      direction = 'up';
    } else if (this.cursors.down.isDown) {
      velocityY = this.playerSpeed;
      direction = 'down';
    }
    
    this.player.x += velocityX * 0.016;
    this.player.y += velocityY * 0.016;
    
    if (direction) {
      this.player.play(`player_walk_${direction}`, true);
    } else {
      this.player.stop();
    }
  }

  private updateNPCMovement() {
    this.npcs.forEach(npc => {
      if (npc.targetX !== undefined && npc.targetY !== undefined) {
        const dx = npc.targetX - npc.sprite.x;
        const dy = npc.targetY - npc.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          const moveX = (dx / distance) * npc.speed * 0.016;
          const moveY = (dy / distance) * npc.speed * 0.016;
          
          npc.sprite.x += moveX;
          npc.sprite.y += moveY;
          
          // 确定方向
          let direction = 'down';
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
          } else {
            direction = dy > 0 ? 'down' : 'up';
          }
          
          const npcType = npc.role === 'player' ? 
            (this.npcs.indexOf(npc) % 2 === 0 ? 'player1' : 'player2') : 'fan';
          npc.sprite.play(`npc_${npcType}_walk_${direction}`, true);
        }
      }
    });
  }

  private checkBuildingProximity() {
    let nearestBuilding: string | null = null;
    let minDistance = 150;
    
    this.buildings.forEach((building, type) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        building.x, building.y
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestBuilding = type;
      }
    });
    
    if (nearestBuilding && minDistance < 100) {
      this.nearbyBuilding = nearestBuilding;
      this.interactionPrompt.setText(`按空格进入${this.getBuildingName(nearestBuilding)}`);
      this.interactionPrompt.setVisible(true);
    } else {
      this.nearbyBuilding = null;
      this.interactionPrompt.setVisible(false);
    }
  }

  private getBuildingName(type: string): string {
    const names: Record<string, string> = {
      dojo: '篮球道场',
      training: '训练馆',
      shop: '装备商店',
      park: '公园'
    };
    return names[type] || '';
  }
}

