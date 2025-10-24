/**
 * 宝可梦风格篮球RPG游戏主场景
 * 整合所有已开发的系统模块
 */

import Phaser from 'phaser';
import { DayNightSystem, DayNightSystemConfig } from '../systems/DayNightSystem';
// import { LargeWorldMapGenerator } from '../maps/LargeWorldMap';
import { BuildingSpriteGenerator } from '../generators/BuildingSpriteGenerator';
import { NPCGenerator } from '../generators/NPCGenerator';
import { DecorationGenerator } from '../generators/DecorationGenerator';
import { NPCIntelligentBehavior } from '../ai/NPCIntelligentBehavior';
import { DialogueSystem } from '../ui/DialogueSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { QuestSystem } from '../systems/QuestSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioManager } from '../audio/AudioManager';
import { WeatherSystem } from '../effects/WeatherSystem';
import { CameraController } from '../camera/CameraController';
import { TeleportSystem } from '../systems/TeleportSystem';
import { CollisionSystem } from '../physics/CollisionSystem';

export class PokemonStyleBasketballScene extends Phaser.Scene {
  // 核心系统
  private dayNightSystem!: DayNightSystem;
  private dialogueSystem!: DialogueSystem;
  private inventorySystem!: InventorySystem;
  private questSystem!: QuestSystem;
  private saveSystem!: SaveSystem;
  private audioManager!: AudioManager;
  private weatherSystem!: WeatherSystem;
  private cameraController!: CameraController;
  private teleportSystem!: TeleportSystem;
  private collisionSystem!: CollisionSystem;
  
  // 生成器
  private buildingGenerator!: BuildingSpriteGenerator;
  private npcGenerator!: NPCGenerator;
  private decorationGenerator!: DecorationGenerator;
  
  // 地图
  private worldMap!: LargeWorldMapGenerator;
  
  // 玩家
  private player!: Phaser.GameObjects.Sprite;
  private playerSpeed: number = 120;
  
  // 输入
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  
  // NPC列表
  private npcs: Array<{
    sprite: Phaser.GameObjects.Sprite;
    behavior: NPCIntelligentBehavior;
    name: string;
  }> = [];
  
  // UI元素
  private timeText!: Phaser.GameObjects.Text;
  private moneyText!: Phaser.GameObjects.Text;
  private interactionPrompt!: Phaser.GameObjects.Text;
  
  // 游戏状态
  private money: number = 10000;
  private playerName: string = "主角";

  constructor() {
    super({ key: 'PokemonStyleBasketballScene' });
  }

  preload() {
    // 创建所有sprite资源
    this.createAllSprites();
  }

  private createAllSprites() {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    
    // 1. 初始化生成器
    this.buildingGenerator = new BuildingSpriteGenerator(this);
    this.npcGenerator = new NPCGenerator(this);
    this.decorationGenerator = new DecorationGenerator(this);
    
    // 2. 生成所有资源
    this.buildingGenerator.generateAll();
    this.npcGenerator.generateAll();
    this.decorationGenerator.generateAll();
    
    // 3. 创建玩家sprite
    this.createPlayerSprites(graphics);
    
    // 4. 创建地面瓦片
    this.createTileSprites(graphics);
    
    graphics.destroy();
  }

  private createPlayerSprites(graphics: Phaser.GameObjects.Graphics) {
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(dir => {
      for (let frame = 0; frame < 4; frame++) {
        graphics.clear();
        
        const baseX = 8;
        const baseY = 12;
        
        // Game Boy风格简化像素
        const skinColor = 0xffdbac;
        const shirtColor = 0xff6600;
        const pantsColor = 0x0066cc;
        const hairColor = 0x332211;
        
        if (dir === 'down') {
          // 头发
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 4, baseY - 10, 8, 4);
          // 脸
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 3, baseY - 6, 6, 6);
          // 眼睛
          graphics.fillStyle(0x000000);
          graphics.fillRect(baseX - 2, baseY - 4, 1, 1);
          graphics.fillRect(baseX + 1, baseY - 4, 1, 1);
          // 球衣
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 4, baseY, 8, 6);
          // 腿
          graphics.fillStyle(pantsColor);
          const legOffset = frame % 2 === 0 ? 0 : 1;
          graphics.fillRect(baseX - 3 + legOffset, baseY + 6, 2, 4);
          graphics.fillRect(baseX + 1 - legOffset, baseY + 6, 2, 4);
        } else if (dir === 'up') {
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 4, baseY - 10, 8, 4);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 4, baseY - 6, 8, 12);
          graphics.fillStyle(pantsColor);
          const legOffset = frame % 2 === 0 ? 0 : 1;
          graphics.fillRect(baseX - 3 + legOffset, baseY + 6, 2, 4);
          graphics.fillRect(baseX + 1 - legOffset, baseY + 6, 2, 4);
        } else if (dir === 'left') {
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 3, baseY - 10, 6, 4);
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 3, baseY - 6, 4, 6);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 4, baseY, 7, 6);
          graphics.fillStyle(pantsColor);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillRect(baseX - 3, baseY + 6 + legOffset, 2, 4);
          graphics.fillRect(baseX, baseY + 6 - legOffset, 2, 4);
        } else {
          graphics.fillStyle(hairColor);
          graphics.fillRect(baseX - 3, baseY - 10, 6, 4);
          graphics.fillStyle(skinColor);
          graphics.fillRect(baseX - 1, baseY - 6, 4, 6);
          graphics.fillStyle(shirtColor);
          graphics.fillRect(baseX - 3, baseY, 7, 6);
          graphics.fillStyle(pantsColor);
          const legOffset = frame % 2 === 0 ? 0 : 2;
          graphics.fillRect(baseX - 2, baseY + 6 + legOffset, 2, 4);
          graphics.fillRect(baseX + 1, baseY + 6 - legOffset, 2, 4);
        }
        
        graphics.generateTexture(`player_${dir}_${frame}`, 16, 24);
      }
    });
  }

  private createTileSprites(graphics: Phaser.GameObjects.Graphics) {
    // 草地
    graphics.fillStyle(0x4a9d4a);
    graphics.fillRect(0, 0, 16, 16);
    graphics.fillStyle(0x3d8a3d);
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(2 + i * 5, 2 + i * 4, 1, 1);
    }
    graphics.generateTexture('tile_grass', 16, 16);
    graphics.clear();
    
    // 道路
    graphics.fillStyle(0x888888);
    graphics.fillRect(0, 0, 16, 16);
    graphics.fillStyle(0x999999);
    graphics.fillRect(7, 7, 2, 2);
    graphics.generateTexture('tile_road', 16, 16);
    graphics.clear();
    
    // 篮球场
    graphics.fillStyle(0xd2691e);
    graphics.fillRect(0, 0, 16, 16);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(7, 7, 2, 2);
    graphics.generateTexture('tile_court', 16, 16);
    graphics.clear();
    
    // 水面
    graphics.fillStyle(0x4a9dff);
    graphics.fillRect(0, 0, 16, 16);
    graphics.fillStyle(0x6ab0ff);
    graphics.fillRect(2, 2, 4, 4);
    graphics.generateTexture('tile_water', 16, 16);
    graphics.clear();
  }

  create() {
    // 1. 初始化所有系统
    this.initializeSystems();
    
    // 2. 创建地图
    this.createWorldMap();
    
    // 3. 创建玩家
    this.createPlayer();
    
    // 4. 创建NPC
    this.createNPCs();
    
    // 5. 创建UI
    this.createUI();
    
    // 6. 设置输入
    this.setupInput();
    
    // 7. 创建动画
    this.createAnimations();
    
    // 8. 设置相机
    this.cameraController.followTarget(this.player);
    
    // 9. 启动系统
    this.startSystems();
  }

  private initializeSystems() {
    // 昼夜系统
    const dayNightConfig: DayNightSystemConfig = {
      secondsPerDay: 240, // 4分钟一整天
      initialHour: 10,
      minAmbientIntensity: 0.2,
      maxAmbientIntensity: 0.9,
      dayStartHour: 6,
      nightStartHour: 18,
      affectedLayers: []
    };
    this.dayNightSystem = new DayNightSystem(this, dayNightConfig);
    
    // 对话系统
    this.dialogueSystem = new DialogueSystem(this);
    
    // 背包系统
    this.inventorySystem = new InventorySystem(this, 20);
    
    // 任务系统
    this.questSystem = new QuestSystem(this);
    
    // 存档系统
    this.saveSystem = new SaveSystem(this);
    
    // 音频管理器
    this.audioManager = new AudioManager(this);
    
    // 天气系统
    this.weatherSystem = new WeatherSystem(this);
    
    // 相机控制器
    this.cameraController = new CameraController(this);
    
    // 传送系统
    this.teleportSystem = new TeleportSystem(this);
    
    // 碰撞系统
    this.collisionSystem = new CollisionSystem(this);
    
    // 地图生成器
    this.worldMap = new LargeWorldMapGenerator(this);
  }

  private createWorldMap() {
    // 使用地图生成器创建50x50的大地图
    this.worldMap.generate();
  }

  private createPlayer() {
    // 在地图中心创建玩家
    this.player = this.add.sprite(400, 300, 'player_down_0');
    this.player.setDepth(1000);
    this.player.setData('type', 'player');
  }

  private createNPCs() {
    // 创建20个NPC
    const npcTypes = ['player', 'coach', 'student', 'doctor', 'merchant'];
    
    for (let i = 0; i < 20; i++) {
      const type = npcTypes[i % npcTypes.length];
      const x = 200 + Math.random() * 400;
      const y = 200 + Math.random() * 400;
      
      const sprite = this.add.sprite(x, y, `npc_${type}_down_0`);
      sprite.setDepth(900 + i);
      
      const behavior = new NPCIntelligentBehavior(this, sprite, {
        name: `NPC${i + 1}`,
        role: type,
        personality: i % 2 === 0 ? '友好' : '冷静',
        schedule: this.generateNPCSchedule(type)
      });
      
      this.npcs.push({
        sprite,
        behavior,
        name: `NPC${i + 1}`
      });
    }
  }

  private generateNPCSchedule(type: string): any {
    // 根据NPC类型生成日程
    const schedules: Record<string, any> = {
      player: {
        morning: 'training',
        afternoon: 'playing',
        evening: 'resting'
      },
      coach: {
        morning: 'teaching',
        afternoon: 'coaching',
        evening: 'planning'
      },
      student: {
        morning: 'studying',
        afternoon: 'playing',
        evening: 'homework'
      },
      doctor: {
        morning: 'clinic',
        afternoon: 'clinic',
        evening: 'research'
      },
      merchant: {
        morning: 'shop',
        afternoon: 'shop',
        evening: 'closing'
      }
    };
    
    return schedules[type] || schedules.player;
  }

  private createUI() {
    // 时间显示
    this.timeText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10000);
    
    // 金钱显示
    this.moneyText = this.add.text(10, 40, `💰 ¥${this.money}`, {
      fontSize: '16px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10000);
    
    // 互动提示
    this.interactionPrompt = this.add.text(400, 550, '', {
      fontSize: '14px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10000).setVisible(false);
    
    // 操作提示
    this.add.text(10, 70, 'WASD移动 | 空格互动 | I背包 | M地图', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 }
    }).setScrollFactor(0).setDepth(10000);
  }

  private setupInput() {
    // 方向键
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // WASD键
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // 空格键互动
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
      this.handleInteraction();
    });
    
    // I键打开背包
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I).on('down', () => {
      this.inventorySystem.toggle();
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
    const npcTypes = ['player', 'coach', 'student', 'doctor', 'merchant'];
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

  private startSystems() {
    // 监听昼夜系统事件
    this.events.on('daynight-time-update', (h: number, m: number) => {
      this.timeText.setText(`⏰ ${this.dayNightSystem.getFormattedTime()}`);
    });
    
    this.events.on('daynight-light-switch', (isNight: boolean) => {
      console.log(`灯光${isNight ? '开启' : '关闭'}`);
      // 这里可以控制路灯等装饰物的显示
    });
    
    // 启动NPC AI
    this.npcs.forEach(npc => {
      npc.behavior.start();
    });
  }

  private handleInteraction() {
    // 检查附近是否有可互动的对象
    const nearbyNPC = this.findNearbyNPC();
    
    if (nearbyNPC) {
      this.dialogueSystem.startDialogue({
        npcName: nearbyNPC.name,
        dialogues: [
          `你好!我是${nearbyNPC.name}`,
          '欢迎来到篮球世界!',
          '要来一场比赛吗?'
        ],
        choices: [
          { text: '好的!', callback: () => console.log('开始比赛') },
          { text: '下次吧', callback: () => console.log('拒绝') }
        ]
      });
    }
  }

  private findNearbyNPC() {
    const interactionDistance = 50;
    
    for (const npc of this.npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.sprite.x, npc.sprite.y
      );
      
      if (distance < interactionDistance) {
        return npc;
      }
    }
    
    return null;
  }

  update(time: number, delta: number) {
    // 更新玩家移动
    this.updatePlayerMovement();
    
    // 更新NPC
    this.npcs.forEach(npc => {
      npc.behavior.update(delta);
    });
    
    // 更新互动提示
    this.updateInteractionPrompt();
    
    // 更新天气系统
    this.weatherSystem.update(delta);
  }

  private updatePlayerMovement() {
    let velocityX = 0;
    let velocityY = 0;
    let direction = '';
    
    // 检查WASD或方向键
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      velocityX = -this.playerSpeed;
      direction = 'left';
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      velocityX = this.playerSpeed;
      direction = 'right';
    }
    
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      velocityY = -this.playerSpeed;
      direction = 'up';
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      velocityY = this.playerSpeed;
      direction = 'down';
    }
    
    // 归一化对角线移动
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }
    
    // 应用移动
    this.player.x += velocityX * 0.016;
    this.player.y += velocityY * 0.016;
    
    // 播放动画
    if (direction) {
      this.player.play(`player_walk_${direction}`, true);
    } else {
      this.player.stop();
    }
    
    // 边界检查
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, 800);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, 600);
  }

  private updateInteractionPrompt() {
    const nearbyNPC = this.findNearbyNPC();
    
    if (nearbyNPC) {
      this.interactionPrompt.setText(`按空格与${nearbyNPC.name}对话`);
      this.interactionPrompt.setVisible(true);
    } else {
      this.interactionPrompt.setVisible(false);
    }
  }
}

