/**
 * 角色动画演示场景
 * 展示所有10个角色的完整4方向走路动画
 */

import Phaser from 'phaser';
import {
  preloadCharacterAnimations,
  createCharacterAnimations,
  createCharacterSprite,
  updateCharacterAnimation,
  CHARACTERS,
} from '../utils/CharacterAnimationLoader';

export default class AnimationDemoScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private playerSpeed = 300;
  
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  
  private infoText!: Phaser.GameObjects.Text;
  private demoSprites: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('AnimationDemoScene');
  }

  preload() {
    // 加载涩谷背景
    this.load.image('shibuya_bg', '/maps/tokyo/commercial/shibuya_crossing.png');
    
    // 加载所有角色动画
    preloadCharacterAnimations(this);
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // 创建背景
    const bg = this.add.image(width / 2, height / 2, 'shibuya_bg');
    bg.setDisplaySize(width * 2, height * 2);
    
    // 创建所有角色动画
    createCharacterAnimations(this);
    
    // 创建玩家（可控制）
    this.player = createCharacterSprite(this, width / 2, height / 2, 'player');
    this.player.setDepth(100);
    
    // 创建其他角色展示（自动行走）
    this.createDemoCharacters();
    
    // 设置相机跟随玩家
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, width * 2, height * 2);
    
    // 设置WASD键
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    
    // 创建UI
    this.createUI();
  }

  createDemoCharacters() {
    const { width, height } = this.cameras.main;
    
    // 排列其他9个角色（3x3网格）
    const startX = width * 0.3;
    const startY = height * 0.3;
    const spacing = 200;
    
    let index = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (index >= CHARACTERS.length - 1) break; // 跳过player（已作为主角）
        
        const characterKey = CHARACTERS[index + 1].key; // +1跳过player
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        
        const sprite = createCharacterSprite(this, x, y, characterKey);
        sprite.setDepth(50);
        
        // 添加名称标签
        const nameText = this.add.text(x, y - 60, CHARACTERS[index + 1].name, {
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 6, y: 3 },
        });
        nameText.setOrigin(0.5);
        nameText.setDepth(51);
        
        // 添加自动行走动画
        this.createAutoWalkBehavior(sprite, characterKey, x, y);
        
        this.demoSprites.push(sprite);
        index++;
      }
    }
  }

  createAutoWalkBehavior(
    sprite: Phaser.GameObjects.Sprite,
    characterKey: string,
    centerX: number,
    centerY: number
  ) {
    // 随机方向行走
    const walkDistance = 100;
    const walkDuration = 2000;
    
    const walk = () => {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const targetX = centerX + Math.cos(angle) * walkDistance;
      const targetY = centerY + Math.sin(angle) * walkDistance;
      
      // 计算速度向量
      const vx = (targetX - sprite.x) / (walkDuration / 1000);
      const vy = (targetY - sprite.y) / (walkDuration / 1000);
      
      // 更新动画
      updateCharacterAnimation(sprite, characterKey, vx, vy);
      
      // 移动到目标位置
      this.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        duration: walkDuration,
        ease: 'Linear',
        onComplete: () => {
          // 停止动画
          updateCharacterAnimation(sprite, characterKey, 0, 0);
          
          // 等待一会儿再继续
          this.time.delayedCall(1000, walk);
        },
      });
    };
    
    // 开始行走
    this.time.delayedCall(Phaser.Math.Between(0, 2000), walk);
  }

  createUI() {
    const { width, height } = this.cameras.main;
    
    // 信息文本
    this.infoText = this.add.text(20, 20, '', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 15, y: 10 },
    });
    this.infoText.setScrollFactor(0);
    this.infoText.setDepth(1000);
    
    // 标题
    const title = this.add.text(width / 2, 30, '🎮 角色动画演示', {
      fontSize: '32px',
      color: '#ff6b35',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
    });
    title.setOrigin(0.5, 0);
    title.setScrollFactor(0);
    title.setDepth(1000);
    
    // 说明文本
    const instructions = this.add.text(width / 2, height - 60, 
      '使用WASD键控制主角移动 | 其他角色自动行走演示', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 },
    });
    instructions.setOrigin(0.5);
    instructions.setScrollFactor(0);
    instructions.setDepth(1000);
  }

  update() {
    // WASD移动
    let vx = 0;
    let vy = 0;
    
    if (this.wasd.W.isDown) {
      vy = -this.playerSpeed;
    } else if (this.wasd.S.isDown) {
      vy = this.playerSpeed;
    }
    
    if (this.wasd.A.isDown) {
      vx = -this.playerSpeed;
    } else if (this.wasd.D.isDown) {
      vx = this.playerSpeed;
    }
    
    // 对角线移动速度归一化
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }
    
    // 更新玩家位置
    this.player.x += vx * (this.game.loop.delta / 1000);
    this.player.y += vy * (this.game.loop.delta / 1000);
    
    // 更新玩家动画
    updateCharacterAnimation(this.player, 'player', vx, vy);
    
    // 更新信息文本
    this.updateInfoText(vx, vy);
  }

  updateInfoText(vx: number, vy: number) {
    const isMoving = vx !== 0 || vy !== 0;
    const direction = isMoving ? this.getDirectionName(vx, vy) : '静止';
    
    let text = `角色动画演示\n`;
    text += `主角状态：${isMoving ? '移动' : '静止'}\n`;
    text += `当前方向：${direction}\n`;
    text += `位置：(${Math.round(this.player.x)}, ${Math.round(this.player.y)})`;
    
    this.infoText.setText(text);
  }

  getDirectionName(vx: number, vy: number): string {
    if (vy < 0 && Math.abs(vy) > Math.abs(vx)) return '上';
    if (vy > 0 && Math.abs(vy) > Math.abs(vx)) return '下';
    if (vx < 0 && Math.abs(vx) > Math.abs(vy)) return '左';
    if (vx > 0 && Math.abs(vx) > Math.abs(vy)) return '右';
    return '静止';
  }
}

