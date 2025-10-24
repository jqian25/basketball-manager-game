/**
 * Tokyo Open World Scene
 * 展示50个东京场景和角色精灵的演示场景
 */

import Phaser from 'phaser';
import { TOKYO_SCENES, getSceneById, getConnectedScenes } from '../../data/tokyoScenes';

export class TokyoOpenWorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private currentSceneId: string = 'shibuya_crossing';
  private sceneBackground!: Phaser.GameObjects.Image;
  private sceneNameText!: Phaser.GameObjects.Text;
  private instructionsText!: Phaser.GameObjects.Text;
  private npcs: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super({ key: 'TokyoOpenWorldScene' });
  }

  preload() {
    // 加载所有东京场景背景
    TOKYO_SCENES.forEach(scene => {
      this.load.image(scene.id, scene.imagePath);
    });

    // 加载角色精灵
    this.load.image('player', '/sprites/player_main.png');
    this.load.image('coach', '/sprites/coach.png');
    this.load.image('pg_player', '/sprites/pg_player.png');
    this.load.image('sg_player', '/sprites/sg_player.png');
    this.load.image('sf_player', '/sprites/sf_player.png');
    this.load.image('pf_player', '/sprites/pf_player.png');
    this.load.image('c_player', '/sprites/c_player.png');
    this.load.image('npc_male', '/sprites/npc_male.png');
    this.load.image('npc_female', '/sprites/npc_female.png');
    this.load.image('shop_owner', '/sprites/shop_owner.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // 创建场景背景
    this.sceneBackground = this.add.image(width / 2, height / 2, this.currentSceneId);
    this.sceneBackground.setDisplaySize(width, height);

    // 创建玩家角色
    this.player = this.add.sprite(width / 2, height / 2, 'player');
    this.player.setScale(2); // 放大2倍以便看清

    // 创建NPC
    this.createNPCs();

    // 创建UI文本
    const currentScene = getSceneById(this.currentSceneId);
    this.sceneNameText = this.add.text(20, 20, '', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    this.updateSceneInfo();

    this.instructionsText = this.add.text(20, height - 120, 
      'WASD键移动 | 数字键1-9切换场景 | 空格键查看场景列表',
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }
    );

    // 设置WASD键控制
    this.cursors = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    }) as any;

    // 数字键切换场景
    this.input.keyboard!.on('keydown-ONE', () => this.switchScene('shibuya_crossing'));
    this.input.keyboard!.on('keydown-TWO', () => this.switchScene('akihabara'));
    this.input.keyboard!.on('keydown-THREE', () => this.switchScene('asakusa_sensoji'));
    this.input.keyboard!.on('keydown-FOUR', () => this.switchScene('national_stadium'));
    this.input.keyboard!.on('keydown-FIVE', () => this.switchScene('tokyo_dome'));
    this.input.keyboard!.on('keydown-SIX', () => this.switchScene('shimokitazawa'));
    this.input.keyboard!.on('keydown-SEVEN', () => this.switchScene('tokyo_tower'));
    this.input.keyboard!.on('keydown-EIGHT', () => this.switchScene('tokyo_disneyland'));
    this.input.keyboard!.on('keydown-NINE', () => this.switchScene('haneda_airport'));

    // 空格键显示场景列表
    this.input.keyboard!.on('keydown-SPACE', () => this.showSceneList());

    // 相机跟随玩家
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  update() {
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;

    // WASD键控制
    if (this.cursors.up.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown) {
      velocityY = speed;
    }

    if (this.cursors.left.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown) {
      velocityX = speed;
    }

    // 应用速度（使用简单的位置更新）
    this.player.x += velocityX * (this.game.loop.delta / 1000);
    this.player.y += velocityY * (this.game.loop.delta / 1000);

    // 限制玩家在屏幕内
    const { width, height } = this.cameras.main;
    this.player.x = Phaser.Math.Clamp(this.player.x, 50, width - 50);
    this.player.y = Phaser.Math.Clamp(this.player.y, 50, height - 50);

    // NPC简单移动动画
    this.npcs.forEach((npc, index) => {
      const time = this.time.now / 1000;
      npc.x += Math.sin(time + index) * 0.5;
      npc.y += Math.cos(time + index) * 0.5;
    });
  }

  private createNPCs() {
    const { width, height } = this.cameras.main;
    const npcSprites = ['coach', 'npc_male', 'npc_female', 'shop_owner'];

    // 创建4个NPC在场景中随机位置
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      const sprite = npcSprites[i];
      
      const npc = this.add.sprite(x, y, sprite);
      npc.setScale(2);
      this.npcs.push(npc);
    }
  }

  private switchScene(sceneId: string) {
    const scene = getSceneById(sceneId);
    if (!scene) {
      console.error(`Scene ${sceneId} not found`);
      return;
    }

    this.currentSceneId = sceneId;
    
    // 切换背景
    this.sceneBackground.setTexture(sceneId);
    
    // 更新场景信息
    this.updateSceneInfo();

    // 重置玩家位置
    const { width, height } = this.cameras.main;
    this.player.setPosition(width / 2, height / 2);

    // 重新创建NPC
    this.npcs.forEach(npc => npc.destroy());
    this.npcs = [];
    this.createNPCs();

    console.log(`Switched to scene: ${scene.nameZh} (${scene.nameEn})`);
  }

  private updateSceneInfo() {
    const scene = getSceneById(this.currentSceneId);
    if (!scene) return;

    const connectedScenes = getConnectedScenes(this.currentSceneId);
    const connectedNames = connectedScenes.map(s => s.nameZh).join(', ');

    this.sceneNameText.setText(
      `📍 ${scene.nameZh} (${scene.nameEn})\n` +
      `🏀 ${scene.hasBasketballCourt ? '有篮球场' : '无篮球场'} | ` +
      `⭐ 等级${scene.unlockLevel}\n` +
      `🔗 连接场景: ${connectedNames || '无'}`
    );
  }

  private showSceneList() {
    console.log('\n========== 东京场景列表 (50个) ==========');
    
    const categories = {
      commercial: '商业区',
      cultural: '文化区',
      residential: '居住区',
      sports: '体育设施',
      special: '特色场景'
    };

    Object.entries(categories).forEach(([category, name]) => {
      console.log(`\n【${name}】`);
      TOKYO_SCENES
        .filter(s => s.category === category)
        .forEach((scene, index) => {
          console.log(
            `  ${index + 1}. ${scene.nameZh} (${scene.nameEn}) - ` +
            `等级${scene.unlockLevel} ${scene.hasBasketballCourt ? '🏀' : ''}`
          );
        });
    });

    console.log('\n========================================\n');
  }
}

