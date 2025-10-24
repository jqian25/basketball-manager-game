/**
 * 开罗风格篮球经营游戏 - 主场景
 * 实现真正可移动的等距视角游戏
 */

import Phaser from 'phaser';

export class KairoMainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerSpeed: number = 100;
  private currentDirection: string = 'down';
  private isMoving: boolean = false;
  
  // 等距瓦片参数
  private tileWidth: number = 64;
  private tileHeight: number = 32;
  
  // 游戏状态
  private money: number = 10000;
  private fans: number = 0;
  private moneyText!: Phaser.GameObjects.Text;
  private fansText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'KairoMainScene' });
  }

  preload() {
    // 创建简单的像素角色sprite
    this.createPlayerSprites();
    // 创建地面瓦片
    this.createTileSprites();
    // 创建建筑sprite
    this.createBuildingSprites();
  }

  private createPlayerSprites() {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    
    // 创建4方向角色动画帧
    const directions = ['down', 'up', 'left', 'right'];
    const colors = [0xff6600, 0xffdbac, 0x0066cc]; // 橙色球衣、肤色、蓝色裤子
    
    directions.forEach((dir, dirIndex) => {
      for (let frame = 0; frame < 4; frame++) {
        graphics.clear();
        
        // 根据方向调整绘制
        if (dir === 'down') {
          // 向下 - 看到正面
          graphics.fillStyle(0xffa500); // 头发
          graphics.fillRect(6, 2, 12, 4);
          graphics.fillStyle(colors[1]); // 脸
          graphics.fillRect(6, 6, 12, 6);
          graphics.fillStyle(colors[0]); // 球衣
          graphics.fillRect(4, 12, 16, 10);
          // 腿部动画
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillStyle(colors[2]);
          graphics.fillRect(6 + legOffset, 22, 4, 6);
          graphics.fillRect(14 - legOffset, 22, 4, 6);
        } else if (dir === 'up') {
          // 向上 - 看到背面
          graphics.fillStyle(0xffa500);
          graphics.fillRect(6, 2, 12, 4);
          graphics.fillStyle(colors[0]);
          graphics.fillRect(4, 6, 16, 16);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillStyle(colors[2]);
          graphics.fillRect(6 + legOffset, 22, 4, 6);
          graphics.fillRect(14 - legOffset, 22, 4, 6);
        } else if (dir === 'left') {
          // 向左
          graphics.fillStyle(0xffa500);
          graphics.fillRect(8, 2, 10, 4);
          graphics.fillStyle(colors[1]);
          graphics.fillRect(8, 6, 8, 6);
          graphics.fillStyle(colors[0]);
          graphics.fillRect(6, 12, 12, 10);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillStyle(colors[2]);
          graphics.fillRect(8, 22 + legOffset, 4, 6);
          graphics.fillRect(12, 22 - legOffset, 4, 6);
        } else {
          // 向右
          graphics.fillStyle(0xffa500);
          graphics.fillRect(6, 2, 10, 4);
          graphics.fillStyle(colors[1]);
          graphics.fillRect(8, 6, 8, 6);
          graphics.fillStyle(colors[0]);
          graphics.fillRect(6, 12, 12, 10);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillStyle(colors[2]);
          graphics.fillRect(8, 22 + legOffset, 4, 6);
          graphics.fillRect(12, 22 - legOffset, 4, 6);
        }
        
        graphics.generateTexture(`player_${dir}_${frame}`, 24, 32);
      }
    });
    
    graphics.destroy();
  }

  private createTileSprites() {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    
    // 草地瓦片 - 等距菱形
    graphics.fillStyle(0x4a9d4a);
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    
    // 添加纹理
    graphics.fillStyle(0x3d8a3d);
    graphics.fillRect(28, 14, 2, 2);
    graphics.fillRect(36, 18, 2, 2);
    graphics.fillRect(30, 20, 2, 2);
    
    graphics.generateTexture('tile_grass', 64, 32);
    graphics.clear();
    
    // 道路瓦片
    graphics.fillStyle(0x888888);
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 16);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0x999999);
    graphics.fillRect(30, 14, 4, 4);
    
    graphics.generateTexture('tile_road', 64, 32);
    graphics.clear();
    
    graphics.destroy();
  }

  private createBuildingSprites() {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    
    // 篮球馆
    graphics.fillStyle(0x8b0000);
    graphics.fillRect(0, 40, 80, 60);
    graphics.fillStyle(0xffff00);
    graphics.fillRect(5, 45, 70, 10);
    graphics.fillStyle(0x654321);
    graphics.fillRect(30, 70, 20, 30);
    graphics.generateTexture('building_gym', 80, 100);
    graphics.clear();
    
    // 训练场
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(0, 40, 80, 60);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(5, 45, 70, 10);
    graphics.fillStyle(0x654321);
    graphics.fillRect(30, 70, 20, 30);
    graphics.generateTexture('building_training', 80, 100);
    graphics.clear();
    
    graphics.destroy();
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // 创建等距地图
    this.createIsometricMap();
    
    // 创建玩家
    this.createPlayer();
    
    // 创建建筑
    this.createBuildings();
    
    // 设置输入 - 支持方向键和WASD
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // 添加WASD键支持
    const keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
    // 将WASD映射到cursors
    this.cursors.up = keyW;
    this.cursors.left = keyA;
    this.cursors.down = keyS;
    this.cursors.right = keyD;
    
    // 创建动画
    this.createAnimations();
    
    // 创建UI
    this.createUI();
    
    // 设置相机
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);
  }

  private createIsometricMap() {
    // 创建10x10的等距地图
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const isoPos = this.cartesianToIsometric(x, y);
        
        // 中间是道路,其他是草地
        const texture = (x >= 4 && x <= 5) || (y >= 4 && y <= 5) ? 'tile_road' : 'tile_grass';
        
        const tile = this.add.image(isoPos.x, isoPos.y, texture);
        tile.setDepth(y * 10 + x);
      }
    }
  }

  private createPlayer() {
    // 玩家初始位置
    const startPos = this.cartesianToIsometric(5, 5);
    this.player = this.add.sprite(startPos.x, startPos.y - 16, 'player_down_0');
    this.player.setDepth(1000);
  }

  private createBuildings() {
    // 篮球馆
    const gymPos = this.cartesianToIsometric(2, 2);
    const gym = this.add.image(gymPos.x, gymPos.y - 50, 'building_gym');
    gym.setDepth(20);
    gym.setInteractive();
    gym.on('pointerdown', () => {
      this.showMessage('篮球馆', '训练你的球员,提升实力!');
    });
    
    // 训练场
    const trainingPos = this.cartesianToIsometric(7, 2);
    const training = this.add.image(trainingPos.x, trainingPos.y - 50, 'building_training');
    training.setDepth(20);
    training.setInteractive();
    training.on('pointerdown', () => {
      this.showMessage('训练场', '进行专项训练!');
    });
  }

  private createAnimations() {
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(dir => {
      this.anims.create({
        key: `walk_${dir}`,
        frames: [
          { key: `player_${dir}_0` },
          { key: `player_${dir}_1` },
          { key: `player_${dir}_2` },
          { key: `player_${dir}_3` }
        ],
        frameRate: 8,
        repeat: -1
      });
    });
  }

  private createUI() {
    // 金币显示
    this.moneyText = this.add.text(10, 10, `💰 ${this.money}`, {
      fontSize: '20px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    this.moneyText.setScrollFactor(0);
    this.moneyText.setDepth(10000);
    
    // 粉丝显示
    this.fansText = this.add.text(10, 45, `👥 粉丝: ${this.fans}`, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    this.fansText.setScrollFactor(0);
    this.fansText.setDepth(10000);
    
    // 操作提示
    this.add.text(10, 80, 'WASD或方向键移动', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10000);
  }

  private cartesianToIsometric(x: number, y: number): { x: number, y: number } {
    // 笛卡尔坐标转等距坐标
    const isoX = (x - y) * (this.tileWidth / 2);
    const isoY = (x + y) * (this.tileHeight / 2);
    
    return {
      x: isoX + 400,
      y: isoY + 100
    };
  }

  private isometricToCartesian(isoX: number, isoY: number): { x: number, y: number } {
    // 等距坐标转笛卡尔坐标
    isoX -= 400;
    isoY -= 100;
    
    const cartX = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
    const cartY = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
    
    return { x: Math.floor(cartX), y: Math.floor(cartY) };
  }

  private showMessage(title: string, message: string) {
    const bg = this.add.rectangle(400, 300, 400, 150, 0x000000, 0.8);
    bg.setScrollFactor(0);
    bg.setDepth(20000);
    
    const titleText = this.add.text(400, 260, title, {
      fontSize: '24px',
      color: '#ffff00'
    }).setOrigin(0.5);
    titleText.setScrollFactor(0);
    titleText.setDepth(20001);
    
    const msgText = this.add.text(400, 300, message, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
    msgText.setScrollFactor(0);
    msgText.setDepth(20001);
    
    this.time.delayedCall(2000, () => {
      bg.destroy();
      titleText.destroy();
      msgText.destroy();
    });
  }

  update() {
    if (!this.cursors) return;
    
    let velocityX = 0;
    let velocityY = 0;
    let newDirection = this.currentDirection;
    
    // 处理输入
    if (this.cursors.left.isDown) {
      velocityX = -this.playerSpeed;
      newDirection = 'left';
      this.isMoving = true;
    } else if (this.cursors.right.isDown) {
      velocityX = this.playerSpeed;
      newDirection = 'right';
      this.isMoving = true;
    }
    
    if (this.cursors.up.isDown) {
      velocityY = -this.playerSpeed;
      newDirection = 'up';
      this.isMoving = true;
    } else if (this.cursors.down.isDown) {
      velocityY = this.playerSpeed;
      newDirection = 'down';
      this.isMoving = true;
    }
    
    // 如果没有按键,停止移动
    if (!this.cursors.left.isDown && !this.cursors.right.isDown && 
        !this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.isMoving = false;
    }
    
    // 更新玩家位置
    this.player.x += velocityX * 0.016;
    this.player.y += velocityY * 0.016;
    
    // 更新动画
    if (this.isMoving) {
      if (this.currentDirection !== newDirection) {
        this.currentDirection = newDirection;
      }
      this.player.play(`walk_${this.currentDirection}`, true);
    } else {
      this.player.stop();
      this.player.setTexture(`player_${this.currentDirection}_0`);
    }
    
    // 更新深度(让角色在正确的层级)
    const cartPos = this.isometricToCartesian(this.player.x, this.player.y + 16);
    this.player.setDepth(1000 + cartPos.y * 10 + cartPos.x);
  }
}

