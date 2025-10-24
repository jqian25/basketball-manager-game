/**
 * 涩谷十字路口完整场景
 * 包含：WASD控制、NPC对话、建筑交互、碰撞检测、Fate风格放大效果
 */

import Phaser from 'phaser';

interface Building {
  sprite: Phaser.GameObjects.Image;
  name: string;
  type: 'shop' | 'restaurant' | 'arcade' | 'basketball_court' | 'station';
  interactionZone: Phaser.Geom.Rectangle;
  description: string;
}

interface NPC {
  sprite: Phaser.GameObjects.Sprite;
  name: string;
  role: string;
  personality: string;
  dialogues: string[];
  interactionZone: Phaser.Geom.Circle;
}

export class ShibuyaCrossingScene extends Phaser.Scene {
  // 玩家
  private player!: Phaser.GameObjects.Sprite;
  private playerSpeed: number = 200;
  
  // 控制
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };
  
  // 地图元素
  private background!: Phaser.GameObjects.Image;
  private buildings: Building[] = [];
  private npcs: NPC[] = [];
  
  // 交互系统
  private nearbyBuilding: Building | null = null;
  private nearbyNPC: NPC | null = null;
  private isDialogueOpen: boolean = false;
  
  // UI元素
  private interactionPrompt!: Phaser.GameObjects.Container;
  private dialogueBox!: Phaser.GameObjects.Container;
  private buildingZoomOverlay!: Phaser.GameObjects.Container;
  
  // 小地图
  private minimap!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'ShibuyaCrossingScene' });
  }

  preload() {
    // 加载背景
    this.load.image('shibuya_bg', '/maps/tokyo/commercial/shibuya_crossing.png');
    
    // 加载角色精灵
    this.load.image('player', '/sprites/player_main.png');
    this.load.image('npc_male', '/sprites/npc_male.png');
    this.load.image('npc_female', '/sprites/npc_female.png');
    this.load.image('shop_owner', '/sprites/shop_owner.png');
    this.load.image('coach', '/sprites/coach.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // 1. 创建背景（放大以便探索）
    this.background = this.add.image(0, 0, 'shibuya_bg');
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(width * 2, height * 2);

    // 2. 创建玩家
    this.player = this.add.sprite(width / 2, height / 2, 'player');
    this.player.setScale(3);
    this.player.setDepth(100);

    // 3. 设置相机跟随玩家
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, width * 2, height * 2);

    // 4. 创建建筑物
    this.createBuildings();

    // 5. 创建NPC
    this.createNPCs();

    // 6. 设置WASD键控制
    this.setupControls();

    // 7. 创建UI
    this.createUI();

    // 8. 创建小地图
    this.createMinimap();

    // 9. 添加调试信息
    this.createDebugInfo();
  }

  private createBuildings() {
    const { width, height } = this.cameras.main;

    // 建筑物配置（基于涩谷十字路口的实际布局）
    const buildingConfigs = [
      {
        x: width * 0.3,
        y: height * 0.4,
        name: '109百货',
        type: 'shop' as const,
        description: '涩谷最著名的时尚百货商店',
        color: 0xFFD700
      },
      {
        x: width * 1.5,
        y: height * 0.5,
        name: 'TSUTAYA书店',
        type: 'shop' as const,
        description: '涩谷地标性的书店和音乐店',
        color: 0x4169E1
      },
      {
        x: width * 0.8,
        y: height * 1.2,
        name: '涩谷篮球馆',
        type: 'basketball_court' as const,
        description: '街头篮球圣地，可以进行3v3比赛',
        color: 0xFF6B35
      },
      {
        x: width * 1.3,
        y: height * 1.5,
        name: '拉面店',
        type: 'restaurant' as const,
        description: '恢复体力的好地方',
        color: 0xFF4757
      },
      {
        x: width * 0.5,
        y: height * 1.7,
        name: '游戏中心',
        type: 'arcade' as const,
        description: '可以玩小游戏赚取金币',
        color: 0x9B59B6
      },
      {
        x: width * 1.7,
        y: height * 1.3,
        name: '涩谷站',
        type: 'station' as const,
        description: '前往其他东京地区',
        color: 0x2ECC71
      }
    ];

    buildingConfigs.forEach(config => {
      // 创建建筑物图标（简化的方块）
      const graphics = this.add.graphics();
      graphics.fillStyle(config.color, 0.8);
      graphics.fillRoundedRect(0, 0, 80, 80, 10);
      graphics.lineStyle(3, 0xFFFFFF, 1);
      graphics.strokeRoundedRect(0, 0, 80, 80, 10);
      graphics.generateTexture(`building_${config.name}`, 80, 80);
      graphics.destroy();

      const sprite = this.add.image(config.x, config.y, `building_${config.name}`);
      sprite.setScale(1.5);
      sprite.setDepth(50);

      // 添加建筑物名称
      const nameText = this.add.text(config.x, config.y - 80, config.name, {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      });
      nameText.setOrigin(0.5);
      nameText.setDepth(51);

      // 添加特殊图标
      let icon = '';
      if (config.type === 'basketball_court') icon = '🏀';
      else if (config.type === 'restaurant') icon = '🍜';
      else if (config.type === 'shop') icon = '🛍️';
      else if (config.type === 'arcade') icon = '🎮';
      else if (config.type === 'station') icon = '🚇';

      const iconText = this.add.text(config.x, config.y, icon, {
        fontSize: '40px'
      });
      iconText.setOrigin(0.5);
      iconText.setDepth(52);

      const building: Building = {
        sprite,
        name: config.name,
        type: config.type,
        interactionZone: new Phaser.Geom.Rectangle(
          config.x - 100,
          config.y - 100,
          200,
          200
        ),
        description: config.description
      };

      this.buildings.push(building);
    });
  }

  private createNPCs() {
    const { width, height } = this.cameras.main;

    const npcConfigs = [
      {
        x: width * 0.6,
        y: height * 0.7,
        sprite: 'coach',
        name: '安西教练',
        role: '篮球教练',
        personality: '严厉但关心学生，经验丰富',
        dialogues: [
          '年轻人，想学篮球吗？',
          '放弃比赛的话，比赛就结束了。',
          '涩谷篮球馆正在招募新球员！'
        ]
      },
      {
        x: width * 1.2,
        y: height * 0.9,
        sprite: 'npc_female',
        name: '晴子',
        role: '篮球队经理',
        personality: '热情开朗，喜欢篮球',
        dialogues: [
          '你好！你也喜欢篮球吗？',
          '涩谷十字路口总是这么热闹呢！',
          '要不要一起去看比赛？'
        ]
      },
      {
        x: width * 0.9,
        y: height * 1.4,
        sprite: 'npc_male',
        name: '流川枫',
        role: '篮球高手',
        personality: '冷酷，专注篮球',
        dialogues: [
          '...',
          '想挑战我吗？',
          '篮球馆见。'
        ]
      },
      {
        x: width * 1.6,
        y: height * 1.1,
        sprite: 'shop_owner',
        name: '商店老板',
        role: '体育用品店老板',
        personality: '友好，健谈',
        dialogues: [
          '欢迎光临！需要篮球装备吗？',
          '我这里有最新款的球鞋！',
          '买满1000日元送护腕哦！'
        ]
      }
    ];

    npcConfigs.forEach(config => {
      const sprite = this.add.sprite(config.x, config.y, config.sprite);
      sprite.setScale(3);
      sprite.setDepth(90);

      // NPC名称标签
      const nameTag = this.add.text(config.x, config.y - 60, config.name, {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 6, y: 3 }
      });
      nameTag.setOrigin(0.5);
      nameTag.setDepth(91);

      const npc: NPC = {
        sprite,
        name: config.name,
        role: config.role,
        personality: config.personality,
        dialogues: config.dialogues,
        interactionZone: new Phaser.Geom.Circle(config.x, config.y, 100)
      };

      this.npcs.push(npc);

      // NPC简单动画（上下浮动）
      this.tweens.add({
        targets: sprite,
        y: config.y - 10,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  private setupControls() {
    this.keys = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC
    }) as any;

    // E键交互
    this.keys.E.on('down', () => {
      if (this.nearbyBuilding && !this.isDialogueOpen) {
        this.interactWithBuilding(this.nearbyBuilding);
      } else if (this.nearbyNPC && !this.isDialogueOpen) {
        this.interactWithNPC(this.nearbyNPC);
      }
    });

    // ESC键关闭对话
    this.keys.ESC.on('down', () => {
      if (this.isDialogueOpen) {
        this.closeDialogue();
      }
      if (this.buildingZoomOverlay.visible) {
        this.closeBuildingZoom();
      }
    });
  }

  private createUI() {
    const { width, height } = this.cameras.main;

    // 交互提示
    this.interactionPrompt = this.add.container(width / 2, height - 100);
    this.interactionPrompt.setScrollFactor(0);
    this.interactionPrompt.setDepth(200);
    this.interactionPrompt.setVisible(false);

    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x000000, 0.8);
    promptBg.fillRoundedRect(-150, -30, 300, 60, 10);
    
    const promptText = this.add.text(0, 0, '按 E 键交互', {
      fontSize: '24px',
      color: '#ffffff'
    });
    promptText.setOrigin(0.5);

    this.interactionPrompt.add([promptBg, promptText]);

    // 对话框
    this.createDialogueBox();

    // 建筑物放大覆盖层
    this.createBuildingZoomOverlay();

    // 顶部信息栏
    this.createTopBar();
  }

  private createDialogueBox() {
    const { width, height } = this.cameras.main;

    this.dialogueBox = this.add.container(width / 2, height - 150);
    this.dialogueBox.setScrollFactor(0);
    this.dialogueBox.setDepth(300);
    this.dialogueBox.setVisible(false);

    const dialogueBg = this.add.graphics();
    dialogueBg.fillStyle(0x000000, 0.9);
    dialogueBg.fillRoundedRect(-400, -80, 800, 160, 15);
    dialogueBg.lineStyle(3, 0xFFD700, 1);
    dialogueBg.strokeRoundedRect(-400, -80, 800, 160, 15);

    const npcNameText = this.add.text(-380, -60, '', {
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    });

    const dialogueText = this.add.text(-380, -20, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: 750 }
    });

    const continueText = this.add.text(350, 50, '按ESC关闭', {
      fontSize: '14px',
      color: '#aaaaaa'
    });
    continueText.setOrigin(1, 0);

    this.dialogueBox.add([dialogueBg, npcNameText, dialogueText, continueText]);
  }

  private createBuildingZoomOverlay() {
    const { width, height } = this.cameras.main;

    this.buildingZoomOverlay = this.add.container(width / 2, height / 2);
    this.buildingZoomOverlay.setScrollFactor(0);
    this.buildingZoomOverlay.setDepth(400);
    this.buildingZoomOverlay.setVisible(false);

    // 半透明黑色背景
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.85);
    overlay.fillRect(-width / 2, -height / 2, width, height);

    // 建筑物详情卡片
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1a1a1a, 1);
    cardBg.fillRoundedRect(-350, -250, 700, 500, 20);
    cardBg.lineStyle(4, 0xFF6B35, 1);
    cardBg.strokeRoundedRect(-350, -250, 700, 500, 20);

    const buildingNameText = this.add.text(0, -200, '', {
      fontSize: '36px',
      color: '#FF6B35',
      fontStyle: 'bold'
    });
    buildingNameText.setOrigin(0.5);

    const buildingDescText = this.add.text(0, -130, '', {
      fontSize: '20px',
      color: '#ffffff',
      wordWrap: { width: 600 },
      align: 'center'
    });
    buildingDescText.setOrigin(0.5);

    const closeHint = this.add.text(0, 220, '按ESC关闭 | 按E进入', {
      fontSize: '18px',
      color: '#aaaaaa'
    });
    closeHint.setOrigin(0.5);

    this.buildingZoomOverlay.add([overlay, cardBg, buildingNameText, buildingDescText, closeHint]);
  }

  private createTopBar() {
    const { width } = this.cameras.main;

    const topBar = this.add.graphics();
    topBar.fillStyle(0x000000, 0.7);
    topBar.fillRect(0, 0, width, 60);
    topBar.setScrollFactor(0);
    topBar.setDepth(150);

    const locationText = this.add.text(20, 15, '📍 涩谷十字路口 (Shibuya Crossing)', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    locationText.setScrollFactor(0);
    locationText.setDepth(151);

    const controlsText = this.add.text(width - 20, 15, 'WASD移动 | E交互 | ESC关闭', {
      fontSize: '16px',
      color: '#aaaaaa'
    });
    controlsText.setOrigin(1, 0);
    controlsText.setScrollFactor(0);
    controlsText.setDepth(151);
  }

  private createMinimap() {
    const { width, height } = this.cameras.main;

    this.minimap = this.add.container(width - 170, height - 170);
    this.minimap.setScrollFactor(0);
    this.minimap.setDepth(200);

    // 小地图背景
    const minimapBg = this.add.graphics();
    minimapBg.fillStyle(0x000000, 0.7);
    minimapBg.fillRoundedRect(0, 0, 150, 150, 10);
    minimapBg.lineStyle(2, 0xFFFFFF, 0.5);
    minimapBg.strokeRoundedRect(0, 0, 150, 150, 10);

    const minimapTitle = this.add.text(75, 10, '小地图', {
      fontSize: '14px',
      color: '#ffffff'
    });
    minimapTitle.setOrigin(0.5);

    this.minimap.add([minimapBg, minimapTitle]);
  }

  private createDebugInfo() {
    const debugText = this.add.text(10, 70, '', {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 }
    });
    debugText.setScrollFactor(0);
    debugText.setDepth(500);

    this.events.on('update', () => {
      debugText.setText([
        `玩家位置: (${Math.floor(this.player.x)}, ${Math.floor(this.player.y)})`,
        `附近建筑: ${this.nearbyBuilding?.name || '无'}`,
        `附近NPC: ${this.nearbyNPC?.name || '无'}`,
        `对话状态: ${this.isDialogueOpen ? '打开' : '关闭'}`
      ]);
    });
  }

  update() {
    if (this.isDialogueOpen || this.buildingZoomOverlay.visible) {
      return; // 对话或查看建筑时不能移动
    }

    // WASD移动
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.W.isDown) velocityY = -this.playerSpeed;
    if (this.keys.S.isDown) velocityY = this.playerSpeed;
    if (this.keys.A.isDown) velocityX = -this.playerSpeed;
    if (this.keys.D.isDown) velocityX = this.playerSpeed;

    // 对角线移动速度归一化
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    this.player.x += velocityX * (this.game.loop.delta / 1000);
    this.player.y += velocityY * (this.game.loop.delta / 1000);

    // 限制玩家在地图边界内
    const { width, height } = this.cameras.main;
    this.player.x = Phaser.Math.Clamp(this.player.x, 50, width * 2 - 50);
    this.player.y = Phaser.Math.Clamp(this.player.y, 50, height * 2 - 50);

    // 检测附近的建筑物
    this.checkNearbyBuildings();

    // 检测附近的NPC
    this.checkNearbyNPCs();

    // 更新小地图
    this.updateMinimap();
  }

  private checkNearbyBuildings() {
    let foundBuilding = false;

    for (const building of this.buildings) {
      if (building.interactionZone.contains(this.player.x, this.player.y)) {
        this.nearbyBuilding = building;
        foundBuilding = true;
        
        // 显示交互提示
        if (!this.isDialogueOpen) {
          this.interactionPrompt.setVisible(true);
          const promptText = this.interactionPrompt.getAt(1) as Phaser.GameObjects.Text;
          promptText.setText(`按 E 查看 ${building.name}`);
        }
        
        break;
      }
    }

    if (!foundBuilding) {
      this.nearbyBuilding = null;
      if (!this.nearbyNPC) {
        this.interactionPrompt.setVisible(false);
      }
    }
  }

  private checkNearbyNPCs() {
    let foundNPC = false;

    for (const npc of this.npcs) {
      if (npc.interactionZone.contains(this.player.x, this.player.y)) {
        this.nearbyNPC = npc;
        foundNPC = true;
        
        // 显示交互提示
        if (!this.isDialogueOpen && !this.nearbyBuilding) {
          this.interactionPrompt.setVisible(true);
          const promptText = this.interactionPrompt.getAt(1) as Phaser.GameObjects.Text;
          promptText.setText(`按 E 与 ${npc.name} 对话`);
        }
        
        break;
      }
    }

    if (!foundNPC) {
      this.nearbyNPC = null;
      if (!this.nearbyBuilding) {
        this.interactionPrompt.setVisible(false);
      }
    }
  }

  private interactWithBuilding(building: Building) {
    console.log(`与建筑物交互: ${building.name}`);
    
    // 显示建筑物放大效果
    this.buildingZoomOverlay.setVisible(true);
    
    const nameText = this.buildingZoomOverlay.getAt(2) as Phaser.GameObjects.Text;
    const descText = this.buildingZoomOverlay.getAt(3) as Phaser.GameObjects.Text;
    
    nameText.setText(building.name);
    descText.setText(building.description);

    // 如果是篮球场，添加特殊提示
    if (building.type === 'basketball_court') {
      descText.setText(
        building.description + '\n\n' +
        '🏀 可以进行比赛训练\n' +
        '💪 提升球员能力\n' +
        '🏆 参加街头联赛'
      );
    }
  }

  private interactWithNPC(npc: NPC) {
    console.log(`与NPC对话: ${npc.name}`);
    
    this.isDialogueOpen = true;
    this.dialogueBox.setVisible(true);
    this.interactionPrompt.setVisible(false);
    
    const nameText = this.dialogueBox.getAt(1) as Phaser.GameObjects.Text;
    const dialogueText = this.dialogueBox.getAt(2) as Phaser.GameObjects.Text;
    
    nameText.setText(`${npc.name} (${npc.role})`);
    
    // 随机选择一句对话
    const randomDialogue = Phaser.Math.RND.pick(npc.dialogues);
    dialogueText.setText(randomDialogue);

    // NPC说话动画
    this.tweens.add({
      targets: npc.sprite,
      scaleX: 3.2,
      scaleY: 3.2,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }

  private closeDialogue() {
    this.isDialogueOpen = false;
    this.dialogueBox.setVisible(false);
  }

  private closeBuildingZoom() {
    this.buildingZoomOverlay.setVisible(false);
  }

  private updateMinimap() {
    // 清除旧的小地图内容
    while (this.minimap.length > 2) {
      const child = this.minimap.getAt(2);
      if (child) {
        child.destroy();
      }
    }

    const minimapScale = 0.05; // 缩放比例
    const minimapOffsetX = 75;
    const minimapOffsetY = 75;

    // 绘制玩家位置（红点）
    const playerDot = this.add.circle(
      minimapOffsetX + this.player.x * minimapScale,
      minimapOffsetY + this.player.y * minimapScale,
      3,
      0xFF0000
    );
    this.minimap.add(playerDot);

    // 绘制建筑物（黄点）
    this.buildings.forEach(building => {
      const buildingDot = this.add.circle(
        minimapOffsetX + building.sprite.x * minimapScale,
        minimapOffsetY + building.sprite.y * minimapScale,
        2,
        0xFFFF00
      );
      this.minimap.add(buildingDot);
    });

    // 绘制NPC（绿点）
    this.npcs.forEach(npc => {
      const npcDot = this.add.circle(
        minimapOffsetX + npc.sprite.x * minimapScale,
        minimapOffsetY + npc.sprite.y * minimapScale,
        2,
        0x00FF00
      );
      this.minimap.add(npcDot);
    });
  }
}

