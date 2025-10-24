import Phaser from 'phaser';

/**
 * 篮球类型
 */
export enum BasketballType {
  NORMAL = 'normal',       // 普通篮球
  SPEED = 'speed',         // 加速篮球
  BOMB = 'bomb',           // 爆炸篮球
  SPLIT = 'split',         // 分裂篮球
  BOOMERANG = 'boomerang'  // 回旋篮球
}

/**
 * 关卡数据
 */
export interface LevelData {
  world: number;
  level: number;
  name: string;
  basketballs: BasketballType[];
  targetPosition: { x: number, y: number };
  obstacles: { x: number, y: number, type: string }[];
  stars: [number, number, number]; // 3星、2星、1星所需篮球数
}

/**
 * 愤怒的小鸟式投篮游戏场景
 */
export class ShootingGameScene extends Phaser.Scene {
  private currentLevel!: LevelData;
  private basketballs: BasketballType[] = [];
  private currentBasketballIndex: number = 0;
  private activeBall?: Phaser.Physics.Matter.Sprite;
  private slingshot?: Phaser.GameObjects.Graphics;
  private trajectoryLine?: Phaser.GameObjects.Graphics;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private shotsUsed: number = 0;
  private score: number = 0;
  private stars: number = 0;

  // 弹弓位置
  private readonly SLINGSHOT_X = 200;
  private readonly SLINGSHOT_Y = 500;
  private readonly MAX_DRAG_DISTANCE = 150;

  constructor() {
    super({ key: 'ShootingGameScene' });
  }

  init(data: { level: LevelData }) {
    this.currentLevel = data.level;
    this.basketballs = [...data.level.basketballs];
    this.currentBasketballIndex = 0;
    this.shotsUsed = 0;
    this.score = 0;
    this.stars = 0;
  }

  preload() {
    // 加载篮球素材
    this.load.setPath('/items/');
    this.load.image('basketball_normal', 'basketball_normal.png');
    this.load.image('basketball_speed', 'basketball_speed.png');
    this.load.image('basketball_bomb', 'basketball_bomb.png');
    this.load.image('basketball_split', 'basketball_split.png');
    this.load.image('basketball_boomerang', 'basketball_boomerang.png');
  }

  create() {
    // 设置背景
    this.cameras.main.setBackgroundColor(0x87CEEB);

    // 启用Matter物理引擎
    this.matter.world.setBounds(0, 0, 1200, 800);
    this.matter.world.setGravity(0, 2);

    // 创建地面
    this.createGround();

    // 创建篮筐
    this.createBasket();

    // 创建障碍物
    this.createObstacles();

    // 创建弹弓
    this.createSlingshot();

    // 创建UI
    this.createUI();

    // 加载第一个篮球
    this.loadNextBasketball();

    // 设置输入
    this.setupInput();
  }

  /**
   * 创建地面
   */
  private createGround() {
    const ground = this.add.rectangle(600, 780, 1200, 40, 0x8B4513);
    this.matter.add.gameObject(ground, { isStatic: true });
  }

  /**
   * 创建篮筐
   */
  private createBasket() {
    const { x, y } = this.currentLevel.targetPosition;

    // 篮筐支架
    const pole = this.add.rectangle(x, y - 100, 10, 200, 0xFF0000);
    this.matter.add.gameObject(pole, { isStatic: true });

    // 篮板
    const backboard = this.add.rectangle(x + 30, y - 150, 80, 100, 0xFFFFFF);
    this.matter.add.gameObject(backboard, { isStatic: true });

    // 篮筐（传感器区域）
    const hoop = this.add.circle(x + 30, y - 50, 40, 0xFF8C00, 0.3);
    const hoopBody = this.matter.add.gameObject(hoop, {
      isStatic: true,
      isSensor: true
    });

    // 检测篮球进筐
    this.matter.world.on('collisionstart', (event: any) => {
      event.pairs.forEach((pair: any) => {
        if (pair.bodyA === hoopBody.body || pair.bodyB === hoopBody.body) {
          this.onBasketballScored();
        }
      });
    });
  }

  /**
   * 创建障碍物
   */
  private createObstacles() {
    this.currentLevel.obstacles.forEach(obstacle => {
      let obj;
      
      switch (obstacle.type) {
        case 'wood':
          obj = this.add.rectangle(obstacle.x, obstacle.y, 60, 60, 0x8B4513);
          this.matter.add.gameObject(obj, { density: 0.001 });
          break;
        case 'glass':
          obj = this.add.rectangle(obstacle.x, obstacle.y, 60, 60, 0x87CEEB, 0.5);
          this.matter.add.gameObject(obj, { density: 0.0005 });
          break;
        case 'stone':
          obj = this.add.rectangle(obstacle.x, obstacle.y, 60, 60, 0x808080);
          this.matter.add.gameObject(obj, { density: 0.01, isStatic: true });
          break;
      }
    });
  }

  /**
   * 创建弹弓
   */
  private createSlingshot() {
    this.slingshot = this.add.graphics();
    this.slingshot.lineStyle(8, 0x8B4513);
    this.slingshot.beginPath();
    this.slingshot.moveTo(this.SLINGSHOT_X - 40, this.SLINGSHOT_Y);
    this.slingshot.lineTo(this.SLINGSHOT_X, this.SLINGSHOT_Y - 80);
    this.slingshot.lineTo(this.SLINGSHOT_X + 40, this.SLINGSHOT_Y);
    this.slingshot.strokePath();

    // 轨迹线
    this.trajectoryLine = this.add.graphics();
  }

  /**
   * 创建UI
   */
  private createUI() {
    // 关卡信息
    this.add.text(20, 20, `关卡 ${this.currentLevel.world}-${this.currentLevel.level}`, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    // 剩余篮球
    this.add.text(20, 60, `剩余: ${this.basketballs.length - this.currentBasketballIndex}`, {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setName('remainingText');

    // 得分
    this.add.text(20, 100, `得分: ${this.score}`, {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setName('scoreText');

    // 星星
    const starText = this.add.text(20, 140, '⭐'.repeat(3), {
      fontSize: '24px'
    });

    // 返回按钮
    const backButton = this.add.text(1100, 20, '返回', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#FF0000',
      padding: { x: 15, y: 8 }
    });
    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('BasketballCourtScene');
    });
  }

  /**
   * 加载下一个篮球
   */
  private loadNextBasketball() {
    if (this.currentBasketballIndex >= this.basketballs.length) {
      this.onLevelFailed();
      return;
    }

    const type = this.basketballs[this.currentBasketballIndex];
    const texture = `basketball_${type}`;

    // 创建篮球
    this.activeBall = this.matter.add.sprite(
      this.SLINGSHOT_X,
      this.SLINGSHOT_Y - 80,
      texture
    );
    this.activeBall.setCircle(24);
    this.activeBall.setScale(0.5);
    this.activeBall.setStatic(true);
    this.activeBall.setData('type', type);
  }

  /**
   * 设置输入
   */
  private setupInput() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.activeBall) return;

      const distance = Phaser.Math.Distance.Between(
        pointer.x, pointer.y,
        this.activeBall.x, this.activeBall.y
      );

      if (distance < 50) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging || !this.activeBall) return;

      // 限制拖拽距离
      let dx = this.SLINGSHOT_X - pointer.x;
      let dy = (this.SLINGSHOT_Y - 80) - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.MAX_DRAG_DISTANCE) {
        const ratio = this.MAX_DRAG_DISTANCE / distance;
        dx *= ratio;
        dy *= ratio;
      }

      // 更新篮球位置
      this.activeBall.setPosition(
        this.SLINGSHOT_X - dx,
        (this.SLINGSHOT_Y - 80) - dy
      );

      // 绘制轨迹预览
      this.drawTrajectory(dx, dy);
    });

    this.input.on('pointerup', () => {
      if (!this.isDragging || !this.activeBall) return;

      this.isDragging = false;

      // 计算发射力度
      const dx = this.SLINGSHOT_X - this.activeBall.x;
      const dy = (this.SLINGSHOT_Y - 80) - this.activeBall.y;

      // 发射篮球
      this.shootBasketball(dx * 0.02, dy * 0.02);

      // 清除轨迹线
      this.trajectoryLine?.clear();
    });
  }

  /**
   * 绘制轨迹预览
   */
  private drawTrajectory(dx: number, dy: number) {
    if (!this.trajectoryLine || !this.activeBall) return;

    this.trajectoryLine.clear();
    this.trajectoryLine.lineStyle(2, 0xFFFFFF, 0.5);
    this.trajectoryLine.setDepth(100);

    const startX = this.activeBall.x;
    const startY = this.activeBall.y;
    const velocityX = dx * 0.02;
    const velocityY = dy * 0.02;

    // 绘制虚线轨迹
    for (let t = 0; t < 100; t += 5) {
      const x = startX + velocityX * t;
      const y = startY + velocityY * t + 0.5 * 2 * t * t / 60; // 考虑重力

      if (t === 0) {
        this.trajectoryLine.beginPath();
        this.trajectoryLine.moveTo(x, y);
      } else {
        this.trajectoryLine.lineTo(x, y);
      }

      if (x > 1200 || y > 800) break;
    }

    this.trajectoryLine.strokePath();
  }

  /**
   * 发射篮球
   */
  private shootBasketball(velocityX: number, velocityY: number) {
    if (!this.activeBall) return;

    this.activeBall.setStatic(false);
    this.activeBall.setVelocity(velocityX, velocityY);
    this.activeBall.setAngularVelocity(0.1);

    this.shotsUsed++;
    this.currentBasketballIndex++;

    // 更新UI
    const remainingText = this.children.getByName('remainingText') as Phaser.GameObjects.Text;
    if (remainingText) {
      remainingText.setText(`剩余: ${this.basketballs.length - this.currentBasketballIndex}`);
    }

    // 3秒后加载下一个篮球
    this.time.delayedCall(3000, () => {
      if (this.activeBall) {
        this.activeBall.destroy();
        this.activeBall = undefined;
      }
      this.loadNextBasketball();
    });

    // 特殊能力触发
    this.triggerSpecialAbility();
  }

  /**
   * 触发特殊能力
   */
  private triggerSpecialAbility() {
    if (!this.activeBall) return;

    const type = this.activeBall.getData('type');

    switch (type) {
      case BasketballType.SPEED:
        // 加速篮球 - 点击后加速
        this.input.once('pointerdown', () => {
          if (this.activeBall) {
            const velocity = this.activeBall.body as MatterJS.BodyType;
            this.activeBall.setVelocity(velocity.velocity.x * 2, velocity.velocity.y * 2);
          }
        });
        break;

      case BasketballType.BOMB:
        // 爆炸篮球 - 撞击后爆炸
        this.matter.world.once('collisionstart', (event: any) => {
          event.pairs.forEach((pair: any) => {
            if (pair.bodyA === this.activeBall?.body || pair.bodyB === this.activeBall?.body) {
              this.explode(this.activeBall!.x, this.activeBall!.y);
            }
          });
        });
        break;

      case BasketballType.SPLIT:
        // 分裂篮球 - 点击后分裂成3个
        this.input.once('pointerdown', () => {
          if (this.activeBall) {
            this.split(this.activeBall);
          }
        });
        break;
    }
  }

  /**
   * 爆炸效果
   */
  private explode(x: number, y: number) {
    // 创建爆炸粒子
    const particles = this.add.particles(x, y, 'basketball_bomb', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: 20,
      blendMode: 'ADD'
    });

    particles.explode();

    // 摧毁周围物体
    const bodies = this.matter.world.getAllBodies();
    bodies.forEach((body: any) => {
      const distance = Phaser.Math.Distance.Between(x, y, body.position.x, body.position.y);
      if (distance < 150 && !body.isStatic) {
        const angle = Phaser.Math.Angle.Between(x, y, body.position.x, body.position.y);
        const force = 0.05 * (1 - distance / 150);
        this.matter.applyForce(body, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force
        });
      }
    });

    this.time.delayedCall(1000, () => particles.destroy());
  }

  /**
   * 分裂效果
   */
  private split(ball: Phaser.Physics.Matter.Sprite) {
    const velocity = ball.body as MatterJS.BodyType;

    for (let i = -1; i <= 1; i++) {
      const smallBall = this.matter.add.sprite(ball.x, ball.y, 'basketball_split');
      smallBall.setCircle(12);
      smallBall.setScale(0.25);
      smallBall.setVelocity(
        velocity.velocity.x + i * 2,
        velocity.velocity.y - 2
      );
    }

    ball.destroy();
  }

  /**
   * 篮球进筐
   */
  private onBasketballScored() {
    this.score += 100;

    // 更新得分
    const scoreText = this.children.getByName('scoreText') as Phaser.GameObjects.Text;
    if (scoreText) {
      scoreText.setText(`得分: ${this.score}`);
    }

    // 计算星级
    this.calculateStars();

    // 显示成功动画
    this.showSuccessAnimation();

    // 延迟后进入下一关
    this.time.delayedCall(2000, () => {
      this.onLevelComplete();
    });
  }

  /**
   * 计算星级
   */
  private calculateStars() {
    const [threeStars, twoStars, oneStar] = this.currentLevel.stars;

    if (this.shotsUsed <= threeStars) {
      this.stars = 3;
    } else if (this.shotsUsed <= twoStars) {
      this.stars = 2;
    } else if (this.shotsUsed <= oneStar) {
      this.stars = 1;
    } else {
      this.stars = 0;
    }
  }

  /**
   * 显示成功动画
   */
  private showSuccessAnimation() {
    const text = this.add.text(600, 300, '进球！', {
      fontSize: '80px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8
    });
    text.setOrigin(0.5);
    text.setDepth(1000);

    this.tweens.add({
      targets: text,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 2000,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  /**
   * 关卡完成
   */
  private onLevelComplete() {
    // 显示结果界面
    const resultBg = this.add.rectangle(600, 400, 600, 400, 0x000000, 0.8);
    resultBg.setDepth(2000);

    const resultText = this.add.text(600, 250, '关卡完成！', {
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    resultText.setOrigin(0.5);
    resultText.setDepth(2001);

    const starsText = this.add.text(600, 350, '⭐'.repeat(this.stars), {
      fontSize: '64px'
    });
    starsText.setOrigin(0.5);
    starsText.setDepth(2001);

    const scoreText = this.add.text(600, 450, `得分: ${this.score}`, {
      fontSize: '32px',
      color: '#ffffff'
    });
    scoreText.setOrigin(0.5);
    scoreText.setDepth(2001);

    // 继续按钮
    const continueButton = this.add.text(600, 550, '继续', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#00FF00',
      padding: { x: 30, y: 15 }
    });
    continueButton.setOrigin(0.5);
    continueButton.setDepth(2001);
    continueButton.setInteractive();
    continueButton.on('pointerdown', () => {
      this.scene.start('BasketballCourtScene');
    });
  }

  /**
   * 关卡失败
   */
  private onLevelFailed() {
    const failText = this.add.text(600, 400, '挑战失败！', {
      fontSize: '64px',
      color: '#FF0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8
    });
    failText.setOrigin(0.5);
    failText.setDepth(1000);

    // 重试按钮
    const retryButton = this.add.text(600, 500, '重试', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#FF8C00',
      padding: { x: 30, y: 15 }
    });
    retryButton.setOrigin(0.5);
    retryButton.setDepth(1001);
    retryButton.setInteractive();
    retryButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}

// 示例关卡数据
export const LEVEL_1_1: LevelData = {
  world: 1,
  level: 1,
  name: '训练场 - 基础投篮',
  basketballs: [
    BasketballType.NORMAL,
    BasketballType.NORMAL,
    BasketballType.NORMAL
  ],
  targetPosition: { x: 900, y: 500 },
  obstacles: [
    { x: 600, y: 650, type: 'wood' },
    { x: 660, y: 650, type: 'wood' }
  ],
  stars: [1, 2, 3]
};

