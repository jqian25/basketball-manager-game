/**
 * 城镇场景 - 主要游戏场景
 * 玩家可以自由移动、与NPC对话、进入建筑
 */

import Phaser from 'phaser';
import { GameState } from '../GameState';

export class TownScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private gameState: GameState;
  private npcs!: Phaser.Physics.Arcade.Group;
  private buildings!: Phaser.Physics.Arcade.StaticGroup;
  private dialogBox!: Phaser.GameObjects.Container;
  private dialogText!: Phaser.GameObjects.Text;
  private isDialogActive: boolean = false;
  private currentNPC: any = null;

  constructor() {
    super({ key: 'TownScene' });
    this.gameState = GameState.getInstance();
  }

  preload() {
    // 加载资源
    this.loadAssets();
  }

  private loadAssets() {
    // 创建简单的像素角色
    this.createPlayerSprite();
    this.createNPCSprites();
    this.createBuildingSprites();
    this.createTileSprites();
  }

  private createPlayerSprite() {
    // 创建16x16像素的玩家角色
    const graphics = this.make.graphics({}, false);
    
    // 向下
    graphics.fillStyle(0xffa500);
    graphics.fillRect(4, 0, 8, 4); // 头发
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4); // 脸
    graphics.fillStyle(0xff6600);
    graphics.fillRect(2, 8, 12, 6); // 身体
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(4, 14, 3, 2); // 左腿
    graphics.fillRect(9, 14, 3, 2); // 右腿
    graphics.generateTexture('player_down', 16, 16);
    graphics.clear();

    // 向上
    graphics.fillStyle(0xffa500);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0xff6600);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(4, 14, 3, 2);
    graphics.fillRect(9, 14, 3, 2);
    graphics.generateTexture('player_up', 16, 16);
    graphics.clear();

    // 向左
    graphics.fillStyle(0xffa500);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0xff6600);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(2, 14, 3, 2);
    graphics.fillRect(7, 14, 3, 2);
    graphics.generateTexture('player_left', 16, 16);
    graphics.clear();

    // 向右
    graphics.fillStyle(0xffa500);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0xff6600);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(6, 14, 3, 2);
    graphics.fillRect(11, 14, 3, 2);
    graphics.generateTexture('player_right', 16, 16);
    graphics.clear();

    graphics.destroy();
  }

  private createNPCSprites() {
    const graphics = this.make.graphics({}, false);
    
    // NPC 1 - 教练
    graphics.fillStyle(0x8b4513);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0x333333);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x666666);
    graphics.fillRect(4, 14, 3, 2);
    graphics.fillRect(9, 14, 3, 2);
    graphics.generateTexture('npc_coach', 16, 16);
    graphics.clear();

    // NPC 2 - 商人
    graphics.fillStyle(0xffff00);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0x00aa00);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(4, 14, 3, 2);
    graphics.fillRect(9, 14, 3, 2);
    graphics.generateTexture('npc_merchant', 16, 16);
    graphics.clear();

    // NPC 3 - 球员
    graphics.fillStyle(0x000000);
    graphics.fillRect(4, 0, 8, 4);
    graphics.fillStyle(0xffdbac);
    graphics.fillRect(4, 4, 8, 4);
    graphics.fillStyle(0xcc0000);
    graphics.fillRect(2, 8, 12, 6);
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(4, 14, 3, 2);
    graphics.fillRect(9, 14, 3, 2);
    graphics.generateTexture('npc_player', 16, 16);
    graphics.clear();

    graphics.destroy();
  }

  private createBuildingSprites() {
    const graphics = this.make.graphics({}, false);
    
    // 道场
    graphics.fillStyle(0x8b0000);
    graphics.fillRect(0, 0, 64, 64);
    graphics.fillStyle(0xffff00);
    graphics.fillRect(4, 4, 56, 8);
    graphics.fillStyle(0x654321);
    graphics.fillRect(24, 40, 16, 24);
    graphics.generateTexture('building_dojo', 64, 64);
    graphics.clear();

    // 商店
    graphics.fillStyle(0x00aa00);
    graphics.fillRect(0, 0, 64, 64);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(4, 4, 56, 8);
    graphics.fillStyle(0x654321);
    graphics.fillRect(24, 40, 16, 24);
    graphics.generateTexture('building_shop', 64, 64);
    graphics.clear();

    // 招募中心
    graphics.fillStyle(0x0066cc);
    graphics.fillRect(0, 0, 64, 64);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(4, 4, 56, 8);
    graphics.fillStyle(0x654321);
    graphics.fillRect(24, 40, 16, 24);
    graphics.generateTexture('building_recruit', 64, 64);
    graphics.clear();

    graphics.destroy();
  }

  private createTileSprites() {
    const graphics = this.make.graphics({}, false);
    
    // 草地
    graphics.fillStyle(0x228b22);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x2d8b2d);
    graphics.fillRect(2, 2, 4, 4);
    graphics.fillRect(26, 26, 4, 4);
    graphics.generateTexture('tile_grass', 32, 32);
    graphics.clear();

    // 道路
    graphics.fillStyle(0x888888);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x999999);
    graphics.fillRect(14, 0, 4, 32);
    graphics.generateTexture('tile_road', 32, 32);
    graphics.clear();

    graphics.destroy();
  }

  create() {
    // 创建地图
    this.createMap();

    // 创建建筑
    this.createBuildings();

    // 创建NPC
    this.createNPCs();

    // 创建玩家
    this.createPlayer();

    // 创建对话框
    this.createDialogBox();

    // 设置输入
    this.setupInput();

    // 设置碰撞
    this.setupCollisions();

    // 设置相机
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 800, 600);

    // 显示UI
    this.createUI();
  }

  private createMap() {
    // 创建简单的瓦片地图
    for (let y = 0; y < 600; y += 32) {
      for (let x = 0; x < 800; x += 32) {
        // 道路在中间
        if (x >= 352 && x <= 448) {
          this.add.image(x, y, 'tile_road').setOrigin(0);
        } else {
          this.add.image(x, y, 'tile_grass').setOrigin(0);
        }
      }
    }
  }

  private createBuildings() {
    this.buildings = this.physics.add.staticGroup();

    // 道场
    const dojo = this.buildings.create(200, 150, 'building_dojo');
    dojo.setData('type', 'dojo');
    dojo.setData('name', '篮球道场');

    // 商店
    const shop = this.buildings.create(600, 150, 'building_shop');
    shop.setData('type', 'shop');
    shop.setData('name', '装备商店');

    // 招募中心
    const recruit = this.buildings.create(400, 400, 'building_recruit');
    recruit.setData('type', 'recruit');
    recruit.setData('name', '球员招募中心');
  }

  private createNPCs() {
    this.npcs = this.physics.add.group();

    // 教练NPC
    const coach = this.npcs.create(300, 300, 'npc_coach');
    coach.setData('name', '王教练');
    coach.setData('role', '资深篮球教练');
    coach.setData('personality', '严格但关心学生，经验丰富');
    coach.setData('dialogues', [
      '欢迎来到篮球小镇！',
      '想要成为篮球高手，需要不断训练！',
      '道场里有强大的对手等着你挑战。'
    ]);

    // 商人NPC
    const merchant = this.npcs.create(550, 200, 'npc_merchant');
    merchant.setData('name', '李老板');
    merchant.setData('role', '装备商人');
    merchant.setData('personality', '精明但公道，热情好客');
    merchant.setData('dialogues', [
      '来看看我的商品吧！',
      '好装备能让你的球员更强！',
      '今天有特价优惠哦！'
    ]);

    // 球员NPC
    const player = this.npcs.create(450, 350, 'npc_player');
    player.setData('name', '小杰');
    player.setData('role', '街头球员');
    player.setData('personality', '热血青年，渴望加入强队');
    player.setData('dialogues', [
      '你好！我是小杰！',
      '我梦想成为职业球员！',
      '如果你需要队员，可以考虑我！'
    ]);
  }

  private createPlayer() {
    const playerData = this.gameState.getPlayerData();
    this.player = this.physics.add.sprite(playerData.x, playerData.y, 'player_down');
    this.player.setCollideWorldBounds(true);
    this.player.setData('direction', 'down');
  }

  private createDialogBox() {
    this.dialogBox = this.add.container(0, 0);
    this.dialogBox.setScrollFactor(0);
    this.dialogBox.setDepth(1000);

    // 对话框背景
    const bg = this.add.rectangle(400, 500, 700, 120, 0x000000, 0.8);
    const border = this.add.rectangle(400, 500, 700, 120);
    border.setStrokeStyle(4, 0xffffff);

    // 对话文本
    this.dialogText = this.add.text(100, 460, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: 600 }
    });

    this.dialogBox.add([bg, border, this.dialogText]);
    this.dialogBox.setVisible(false);
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.spaceKey.on('down', () => {
      if (this.isDialogActive) {
        this.closeDialog();
      } else {
        this.checkInteraction();
      }
    });
  }

  private setupCollisions() {
    this.physics.add.collider(this.player, this.buildings);
    this.physics.add.collider(this.player, this.npcs);
  }

  private createUI() {
    const playerData = this.gameState.getPlayerData();
    
    // 金币显示
    const moneyText = this.add.text(10, 10, `💰 ${playerData.money}`, {
      fontSize: '20px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    moneyText.setScrollFactor(0);
    moneyText.setDepth(100);

    // 队伍显示
    const teamText = this.add.text(10, 45, `👥 队伍: ${playerData.team.length}/6`, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    teamText.setScrollFactor(0);
    teamText.setDepth(100);
  }

  private checkInteraction() {
    // 检查是否靠近NPC
    const nearbyNPC = this.npcs.getChildren().find((npc: any) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.x, npc.y
      );
      return distance < 40;
    });

    if (nearbyNPC) {
      this.showDialog(nearbyNPC);
      return;
    }

    // 检查是否靠近建筑
    const nearbyBuilding = this.buildings.getChildren().find((building: any) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        building.x, building.y
      );
      return distance < 60;
    });

    if (nearbyBuilding) {
      this.enterBuilding(nearbyBuilding);
    }
  }

  private showDialog(npc: any) {
    this.isDialogActive = true;
    this.currentNPC = npc;
    
    const dialogues = npc.getData('dialogues');
    const randomDialogue = Phaser.Utils.Array.GetRandom(dialogues);
    
    this.dialogText.setText(`${npc.getData('name')}: ${randomDialogue}`);
    this.dialogBox.setVisible(true);
  }

  private closeDialog() {
    this.isDialogActive = false;
    this.currentNPC = null;
    this.dialogBox.setVisible(false);
  }

  private enterBuilding(building: any) {
    const type = building.getData('type');
    
    if (type === 'dojo') {
      this.scene.start('DojoScene');
    } else if (type === 'shop') {
      this.scene.start('ShopScene');
    } else if (type === 'recruit') {
      // TODO: 实现招募场景
      this.showDialog({ 
        getData: (key: string) => {
          if (key === 'name') return '招募中心';
          return ['招募系统开发中...'];
        }
      });
    }
  }

  update() {
    if (this.isDialogActive) {
      this.player.setVelocity(0);
      return;
    }

    const speed = 160;
    let moving = false;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setVelocityY(0);
      this.player.setTexture('player_left');
      this.player.setData('direction', 'left');
      moving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setVelocityY(0);
      this.player.setTexture('player_right');
      this.player.setData('direction', 'right');
      moving = true;
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.setVelocityX(0);
      this.player.setTexture('player_up');
      this.player.setData('direction', 'up');
      moving = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.setVelocityX(0);
      this.player.setTexture('player_down');
      this.player.setData('direction', 'down');
      moving = true;
    } else {
      this.player.setVelocity(0);
    }

    // 保存位置
    if (moving) {
      this.gameState.updatePosition(this.player.x, this.player.y, 'town');
    }
  }
}

