/**
 * 完整动画演示场景
 * 展示所有动画资源：起床动画、小鸟飞行、角色走路
 */

import Phaser from 'phaser';
import { AnimationSystemLoader } from '../utils/AnimationSystemLoader';

export default class FullAnimationDemoScene extends Phaser.Scene {
  private animationLoader!: AnimationSystemLoader;
  private player!: Phaser.GameObjects.Sprite;
  private birds: Phaser.GameObjects.Sprite[] = [];
  private npcs: Phaser.GameObjects.Sprite[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private currentDirection: string = 'down';
  private isMoving: boolean = false;
  private wakeupSprite!: Phaser.GameObjects.Sprite;
  private wakeupComplete: boolean = false;

  constructor() {
    super({ key: 'FullAnimationDemoScene' });
  }

  preload() {
    // 创建动画加载器
    this.animationLoader = new AnimationSystemLoader(this);

    // 加载所有动画资源
    this.animationLoader.preloadAll();

    // 加载涩谷十字路口背景
    this.load.image('shibuya', '/maps/tokyo/commercial/shibuya_crossing.png');
  }

  create() {
    // 设置背景
    const bg = this.add.image(512, 384, 'shibuya');
    bg.setDisplaySize(1024, 768);

    // 创建所有动画
    this.animationLoader.createAll();

    // 创建起床动画精灵（左上角）
    this.createWakeupAnimation();

    // 创建玩家角色（中心）
    this.createPlayer();

    // 创建飞行的小鸟（多只）
    this.createBirds();

    // 创建NPC角色（自动行走）
    this.createNPCs();

    // 设置键盘控制
    this.setupControls();

    // 创建UI
    this.createUI();

    // 设置相机跟随玩家
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);
  }

  /**
   * 创建起床动画
   */
  private createWakeupAnimation() {
    this.wakeupSprite = this.add.sprite(150, 100, 'wakeup_0');
    this.wakeupSprite.setScale(3);
    this.wakeupSprite.setScrollFactor(0); // 固定在屏幕上

    // 播放起床动画
    this.wakeupSprite.play('wakeup');

    // 动画完成后隐藏
    this.wakeupSprite.on('animationcomplete', () => {
      this.wakeupComplete = true;
      this.time.delayedCall(1000, () => {
        this.wakeupSprite.setVisible(false);
      });
    });
  }

  /**
   * 创建玩家角色
   */
  private createPlayer() {
    this.player = this.add.sprite(512, 384, 'player_down_0');
    this.player.setScale(2);
    this.player.play('player_idle_down');
  }

  /**
   * 创建飞行的小鸟
   */
  private createBirds() {
    // 创建5只小鸟，在不同位置飞行
    const birdPositions = [
      { x: 200, y: 150, direction: 'right' },
      { x: 800, y: 200, direction: 'left' },
      { x: 400, y: 100, direction: 'down' },
      { x: 600, y: 500, direction: 'up' },
      { x: 300, y: 400, direction: 'right' },
    ];

    birdPositions.forEach((pos, index) => {
      const bird = this.add.sprite(pos.x, pos.y, `bird_${pos.direction}_0`);
      bird.setScale(1.5);
      bird.play(`bird_fly_${pos.direction}`);

      // 添加随机飞行路径
      this.tweens.add({
        targets: bird,
        x: pos.x + Phaser.Math.Between(-200, 200),
        y: pos.y + Phaser.Math.Between(-100, 100),
        duration: 3000 + index * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.birds.push(bird);
    });
  }

  /**
   * 创建NPC角色（自动行走）
   */
  private createNPCs() {
    const npcConfigs = [
      { character: 'coach', x: 300, y: 300, path: 'horizontal' },
      { character: 'pg', x: 700, y: 400, path: 'vertical' },
      { character: 'npc_female', x: 400, y: 500, path: 'circle' },
      { character: 'shop_owner', x: 600, y: 250, path: 'horizontal' },
    ];

    npcConfigs.forEach((config) => {
      const npc = this.add.sprite(config.x, config.y, `${config.character}_down_0`);
      npc.setScale(1.5);
      npc.play(`${config.character}_walk_down`);

      // 添加自动行走路径
      if (config.path === 'horizontal') {
        this.tweens.add({
          targets: npc,
          x: config.x + 200,
          duration: 4000,
          yoyo: true,
          repeat: -1,
          onUpdate: () => {
            const direction = npc.x > config.x + 100 ? 'right' : 'left';
            if (npc.anims.currentAnim?.key !== `${config.character}_walk_${direction}`) {
              npc.play(`${config.character}_walk_${direction}`);
            }
          },
        });
      } else if (config.path === 'vertical') {
        this.tweens.add({
          targets: npc,
          y: config.y + 150,
          duration: 3500,
          yoyo: true,
          repeat: -1,
          onUpdate: () => {
            const direction = npc.y > config.y + 75 ? 'down' : 'up';
            if (npc.anims.currentAnim?.key !== `${config.character}_walk_${direction}`) {
              npc.play(`${config.character}_walk_${direction}`);
            }
          },
        });
      } else if (config.path === 'circle') {
        // 圆形路径
        const angle = { value: 0 };
        this.tweens.add({
          targets: angle,
          value: Math.PI * 2,
          duration: 6000,
          repeat: -1,
          onUpdate: () => {
            npc.x = config.x + Math.cos(angle.value) * 100;
            npc.y = config.y + Math.sin(angle.value) * 100;

            // 根据移动方向更新动画
            const dir = angle.value < Math.PI / 2 || angle.value > (3 * Math.PI) / 2 ? 'right' : 'left';
            if (npc.anims.currentAnim?.key !== `${config.character}_walk_${dir}`) {
              npc.play(`${config.character}_walk_${dir}`);
            }
          },
        });
      }

      this.npcs.push(npc);
    });
  }

  /**
   * 设置键盘控制
   */
  private setupControls() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  /**
   * 创建UI
   */
  private createUI() {
    // 标题
    const title = this.add.text(512, 30, '完整动画系统演示', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Arial',
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);

    // 控制提示
    const controls = this.add.text(512, 70, 'WASD键控制移动 | 左上角：起床动画 | 蓝色小鸟：飞行动画 | NPC：自动行走', {
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      fontFamily: 'Arial',
    });
    controls.setOrigin(0.5);
    controls.setScrollFactor(0);

    // 动画统计
    const stats = this.add.text(20, 120, '', {
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      fontFamily: 'Arial',
    });
    stats.setScrollFactor(0);

    // 更新统计信息
    this.time.addEvent({
      delay: 100,
      callback: () => {
        stats.setText([
          `动画资源统计：`,
          `- 角色动画：160帧（10角色×4方向×4帧）`,
          `- 起床动画：8帧`,
          `- 小鸟飞行：16帧（4方向×4帧）`,
          `- 总计：184帧`,
          ``,
          `当前状态：`,
          `- 玩家位置：(${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
          `- 移动方向：${this.currentDirection}`,
          `- 飞行小鸟：${this.birds.length}只`,
          `- 自动NPC：${this.npcs.length}个`,
        ]);
      },
      loop: true,
    });
  }

  update() {
    this.handlePlayerMovement();
  }

  /**
   * 处理玩家移动
   */
  private handlePlayerMovement() {
    const speed = 3;
    let velocityX = 0;
    let velocityY = 0;

    // 检测按键
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -speed;
      this.currentDirection = 'left';
      this.isMoving = true;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = speed;
      this.currentDirection = 'right';
      this.isMoving = true;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -speed;
      this.currentDirection = 'up';
      this.isMoving = true;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = speed;
      this.currentDirection = 'down';
      this.isMoving = true;
    }

    // 如果没有按键，停止移动
    if (velocityX === 0 && velocityY === 0) {
      this.isMoving = false;
    }

    // 归一化对角线速度
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    // 更新位置
    this.player.x += velocityX;
    this.player.y += velocityY;

    // 限制在地图范围内
    this.player.x = Phaser.Math.Clamp(this.player.x, 50, 974);
    this.player.y = Phaser.Math.Clamp(this.player.y, 50, 718);

    // 更新动画
    const animKey = this.isMoving
      ? `player_walk_${this.currentDirection}`
      : `player_idle_${this.currentDirection}`;

    if (this.player.anims.currentAnim?.key !== animKey) {
      this.player.play(animKey);
    }
  }
}

