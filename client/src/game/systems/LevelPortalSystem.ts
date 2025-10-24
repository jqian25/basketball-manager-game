import Phaser from 'phaser';
import { LevelData, LEVEL_1_1 } from '../scenes/ShootingGameScene';

/**
 * 关卡传送门数据
 */
export interface PortalData {
  id: string;
  x: number;
  y: number;
  level: LevelData;
  unlocked: boolean;
}

/**
 * 关卡传送门系统 - 管理地图中的关卡入口
 */
export class LevelPortalSystem {
  private scene: Phaser.Scene;
  private portals: Map<string, Phaser.GameObjects.Container> = new Map();
  private portalData: Map<string, PortalData> = new Map();
  private readonly DETECTION_RANGE = 100;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * 初始化传送门系统
   */
  initialize() {
    // 创建初始关卡传送门
    this.createPortal('1-1', 30, 30, LEVEL_1_1, true);
    // 可以添加更多关卡...
  }

  /**
   * 创建关卡传送门
   */
  createPortal(id: string, tileX: number, tileY: number, level: LevelData, unlocked: boolean) {
    const worldPos = this.getWorldPosition(tileX, tileY);

    // 创建容器
    const container = this.scene.add.container(worldPos.x, worldPos.y);

    // 传送门背景
    const portal = this.scene.add.sprite(0, 0, 'level_portal');
    portal.setOrigin(0.5, 1);
    portal.setScale(1.5);
    container.add(portal);

    // 关卡文字
    const levelText = this.scene.add.text(0, -120, `${level.world}-${level.level}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    levelText.setOrigin(0.5);
    container.add(levelText);

    // 锁定状态
    if (!unlocked) {
      const lock = this.scene.add.text(0, -60, '🔒', {
        fontSize: '32px'
      });
      lock.setOrigin(0.5);
      container.add(lock);
      container.setAlpha(0.5);
    } else {
      // 旋转动画
      this.scene.tweens.add({
        targets: portal,
        angle: 360,
        duration: 10000,
        repeat: -1,
        ease: 'Linear'
      });

      // 脉冲动画
      this.scene.tweens.add({
        targets: container,
        scaleX: 1.6,
        scaleY: 1.6,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    container.setDepth(worldPos.y);

    // 保存数据
    const portalDataObj: PortalData = {
      id,
      x: tileX,
      y: tileY,
      level,
      unlocked
    };

    this.portals.set(id, container);
    this.portalData.set(id, portalDataObj);

    // 设置交互
    if (unlocked) {
      portal.setInteractive();
      portal.on('pointerdown', () => this.enterLevel(id));
    }
  }

  /**
   * 进入关卡
   */
  enterLevel(portalId: string) {
    const data = this.portalData.get(portalId);
    if (!data || !data.unlocked) return;

    // 显示确认对话框
    this.showLevelConfirmDialog(data);
  }

  /**
   * 显示关卡确认对话框
   */
  private showLevelConfirmDialog(data: PortalData) {
    // 创建对话框背景
    const bg = this.scene.add.rectangle(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      600,
      400,
      0x000000,
      0.9
    );
    bg.setScrollFactor(0);
    bg.setDepth(10000);

    // 关卡信息
    const title = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 120,
      `关卡 ${data.level.world}-${data.level.level}`,
      {
        fontSize: '36px',
        color: '#FFD700',
        fontStyle: 'bold'
      }
    );
    title.setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(10001);

    const levelName = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 60,
      data.level.name,
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    );
    levelName.setOrigin(0.5);
    levelName.setScrollFactor(0);
    levelName.setDepth(10001);

    // 篮球数量
    const ballsText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      `可用篮球: ${data.level.basketballs.length}个`,
      {
        fontSize: '20px',
        color: '#ffffff'
      }
    );
    ballsText.setOrigin(0.5);
    ballsText.setScrollFactor(0);
    ballsText.setDepth(10001);

    // 星级要求
    const starsText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + 40,
      `⭐⭐⭐ ${data.level.stars[0]}球  ⭐⭐ ${data.level.stars[1]}球  ⭐ ${data.level.stars[2]}球`,
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    );
    starsText.setOrigin(0.5);
    starsText.setScrollFactor(0);
    starsText.setDepth(10001);

    // 开始按钮
    const startButton = this.scene.add.text(
      this.scene.cameras.main.centerX - 100,
      this.scene.cameras.main.centerY + 120,
      '开始挑战',
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#00FF00',
        padding: { x: 20, y: 10 }
      }
    );
    startButton.setOrigin(0.5);
    startButton.setScrollFactor(0);
    startButton.setDepth(10001);
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      // 跳转到带拉拉队开场的投篮游戏页面
      window.location.href = '/shooting-game-opening';
    });

    // 取消按钮
    const cancelButton = this.scene.add.text(
      this.scene.cameras.main.centerX + 100,
      this.scene.cameras.main.centerY + 120,
      '取消',
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#FF0000',
        padding: { x: 20, y: 10 }
      }
    );
    cancelButton.setOrigin(0.5);
    cancelButton.setScrollFactor(0);
    cancelButton.setDepth(10001);
    cancelButton.setInteractive();
    cancelButton.on('pointerdown', () => {
      bg.destroy();
      title.destroy();
      levelName.destroy();
      ballsText.destroy();
      starsText.destroy();
      startButton.destroy();
      cancelButton.destroy();
    });
  }

  /**
   * 检查玩家附近的传送门
   */
  checkNearbyPortals(playerX: number, playerY: number) {
    this.portals.forEach((container, id) => {
      const data = this.portalData.get(id);
      if (!data || !data.unlocked) return;

      const distance = Phaser.Math.Distance.Between(
        playerX, playerY,
        container.x, container.y
      );

      if (distance < this.DETECTION_RANGE) {
        // 放大传送门
        this.scene.tweens.add({
          targets: container,
          scaleX: 2,
          scaleY: 2,
          duration: 200,
          ease: 'Back.easeOut'
        });

        // 显示提示
        this.showInteractionHint(container);
      } else {
        // 恢复原始大小
        this.scene.tweens.add({
          targets: container,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200
        });

        // 隐藏提示
        this.hideInteractionHint(container);
      }
    });
  }

  /**
   * 显示交互提示
   */
  private showInteractionHint(container: Phaser.GameObjects.Container) {
    let hint = container.getData('hint');
    
    if (!hint) {
      hint = this.scene.add.text(container.x, container.y - 150, '按 E 进入关卡', {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      });
      hint.setOrigin(0.5);
      hint.setDepth(10000);
      container.setData('hint', hint);
    }

    hint.setVisible(true);
  }

  /**
   * 隐藏交互提示
   */
  private hideInteractionHint(container: Phaser.GameObjects.Container) {
    const hint = container.getData('hint');
    if (hint) {
      hint.setVisible(false);
    }
  }

  /**
   * 解锁关卡
   */
  unlockLevel(portalId: string) {
    const data = this.portalData.get(portalId);
    const container = this.portals.get(portalId);
    
    if (!data || !container || data.unlocked) return;

    data.unlocked = true;
    container.setAlpha(1);

    // 移除锁
    const lock = container.getAll().find(obj => obj.type === 'Text' && (obj as Phaser.GameObjects.Text).text === '🔒');
    if (lock) lock.destroy();

    // 添加动画
    const portal = container.getAt(0) as Phaser.GameObjects.Sprite;
    this.scene.tweens.add({
      targets: portal,
      angle: 360,
      duration: 10000,
      repeat: -1,
      ease: 'Linear'
    });

    portal.setInteractive();
    portal.on('pointerdown', () => this.enterLevel(portalId));
  }

  /**
   * 获取世界坐标
   */
  private getWorldPosition(tileX: number, tileY: number): { x: number, y: number } {
    const TILE_WIDTH = 64;
    const TILE_HEIGHT = 32;
    
    const x = (tileX - tileY) * (TILE_WIDTH / 2);
    const y = (tileX + tileY) * (TILE_HEIGHT / 2);
    
    return { x, y };
  }

  /**
   * 更新系统
   */
  update(playerX: number, playerY: number) {
    this.checkNearbyPortals(playerX, playerY);
  }

  /**
   * 销毁系统
   */
  destroy() {
    this.portals.forEach(container => {
      const hint = container.getData('hint');
      if (hint) hint.destroy();
      container.destroy();
    });
    this.portals.clear();
    this.portalData.clear();
  }
}

