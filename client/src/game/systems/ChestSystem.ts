import Phaser from 'phaser';

/**
 * 宝箱类型
 */
export enum ChestType {
  GOLD = 'gold',    // 金色宝箱 - 篮球币
  SILVER = 'silver' // 银色宝箱 - 道具
}

/**
 * 道具类型
 */
export enum PowerUpType {
  ENERGY = 'energy',       // 能量篮球
  FIRE = 'fire',           // 火焰篮球
  SHIELD = 'shield',       // 护盾篮球
  SPEED = 'speed'          // 加速鞋
}

/**
 * 宝箱数据
 */
export interface ChestData {
  id: string;
  type: ChestType;
  x: number;
  y: number;
  opened: boolean;
  respawnTime?: number;
}

/**
 * 道具数据
 */
export interface PowerUpData {
  type: PowerUpType;
  duration: number;
  effect: number;
}

/**
 * 宝箱系统 - 管理地图中的宝箱生成和收集
 */
export class ChestSystem {
  private scene: Phaser.Scene;
  private chests: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private chestData: Map<string, ChestData> = new Map();
  private playerCoins: number = 0;
  private activePowerUps: Map<PowerUpType, number> = new Map();

  // 宝箱刷新配置
  private readonly GOLD_CHEST_RESPAWN = 300000;  // 5分钟
  private readonly SILVER_CHEST_RESPAWN = 600000; // 10分钟
  private readonly DETECTION_RANGE = 100;         // 检测范围

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * 初始化宝箱系统
   */
  initialize() {
    // 生成初始宝箱
    this.spawnInitialChests();

    // 设置定时刷新
    this.setupRespawnTimers();
  }

  /**
   * 生成初始宝箱
   */
  private spawnInitialChests() {
    // 生成10个金色宝箱（随机位置）
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(10, 140);
      const y = Phaser.Math.Between(10, 90);
      this.spawnChest(ChestType.GOLD, x, y);
    }

    // 生成5个银色宝箱（固定位置）
    const silverPositions = [
      [20, 20], [130, 20], [75, 50], [20, 80], [130, 80]
    ];

    silverPositions.forEach(([x, y], index) => {
      this.spawnChest(ChestType.SILVER, x, y, `silver_${index}`);
    });
  }

  /**
   * 生成宝箱
   */
  spawnChest(type: ChestType, tileX: number, tileY: number, customId?: string) {
    const id = customId || `${type}_${Date.now()}_${Math.random()}`;
    
    // 创建宝箱精灵
    const texture = type === ChestType.GOLD ? 'chest_gold' : 'chest_silver';
    const worldPos = this.getWorldPosition(tileX, tileY);
    
    const chest = this.scene.add.sprite(worldPos.x, worldPos.y, texture);
    chest.setOrigin(0.5, 1);
    chest.setScale(1.5);
    chest.setDepth(worldPos.y);
    chest.setData('chestId', id);
    chest.setData('chestType', type);

    // 添加闪烁动画
    this.scene.tweens.add({
      targets: chest,
      scaleX: 1.6,
      scaleY: 1.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 添加粒子效果
    this.addChestParticles(chest, type);

    // 保存宝箱数据
    const chestData: ChestData = {
      id,
      type,
      x: tileX,
      y: tileY,
      opened: false
    };

    this.chests.set(id, chest);
    this.chestData.set(id, chestData);

    // 设置交互
    chest.setInteractive();
    chest.on('pointerdown', () => this.openChest(id));
  }

  /**
   * 添加宝箱粒子效果
   */
  private addChestParticles(chest: Phaser.GameObjects.Sprite, type: ChestType) {
    const color = type === ChestType.GOLD ? 0xFFD700 : 0xC0C0C0;
    
    const particles = this.scene.add.particles(chest.x, chest.y - 30, 'basketball_coin', {
      speed: { min: 20, max: 40 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      frequency: 500,
      tint: color,
      blendMode: 'ADD'
    });

    particles.setDepth(chest.depth + 1);
    chest.setData('particles', particles);
  }

  /**
   * 打开宝箱
   */
  openChest(chestId: string) {
    const chest = this.chests.get(chestId);
    const data = this.chestData.get(chestId);

    if (!chest || !data || data.opened) return;

    // 标记为已打开
    data.opened = true;

    // 播放打开动画
    this.playOpenAnimation(chest, data.type);

    // 给予奖励
    this.giveReward(data.type, chest);

    // 销毁宝箱
    this.scene.time.delayedCall(1000, () => {
      const particles = chest.getData('particles');
      if (particles) particles.destroy();
      chest.destroy();
      this.chests.delete(chestId);
    });

    // 设置重生
    this.scheduleRespawn(data);
  }

  /**
   * 播放打开动画
   */
  private playOpenAnimation(chest: Phaser.GameObjects.Sprite, type: ChestType) {
    // 宝箱跳动
    this.scene.tweens.add({
      targets: chest,
      y: chest.y - 20,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    // 播放音效
    // this.scene.sound.play('chest_open');
  }

  /**
   * 给予奖励
   */
  private giveReward(type: ChestType, chest: Phaser.GameObjects.Sprite) {
    if (type === ChestType.GOLD) {
      // 金色宝箱 - 给予篮球币
      const coins = Phaser.Math.Between(10, 50);
      this.addCoins(coins);
      this.showRewardText(chest, `+${coins} 篮球币`, 0xFFD700);
    } else {
      // 银色宝箱 - 给予随机道具
      const powerUpTypes = Object.values(PowerUpType);
      const randomType = Phaser.Utils.Array.GetRandom(powerUpTypes);
      this.addPowerUp(randomType);
      this.showRewardText(chest, this.getPowerUpName(randomType), 0xC0C0C0);
    }
  }

  /**
   * 显示奖励文字
   */
  private showRewardText(chest: Phaser.GameObjects.Sprite, text: string, color: number) {
    const rewardText = this.scene.add.text(chest.x, chest.y - 60, text, {
      fontSize: '24px',
      color: `#${color.toString(16)}`,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    rewardText.setOrigin(0.5);
    rewardText.setDepth(10000);

    this.scene.tweens.add({
      targets: rewardText,
      y: rewardText.y - 50,
      alpha: 0,
      duration: 2000,
      ease: 'Cubic.easeOut',
      onComplete: () => rewardText.destroy()
    });
  }

  /**
   * 添加篮球币
   */
  addCoins(amount: number) {
    this.playerCoins += amount;
    this.scene.events.emit('coinsChanged', this.playerCoins);
  }

  /**
   * 添加道具
   */
  addPowerUp(type: PowerUpType) {
    const duration = this.getPowerUpDuration(type);
    this.activePowerUps.set(type, Date.now() + duration);
    this.scene.events.emit('powerUpAdded', type, duration);

    // 设置道具过期
    this.scene.time.delayedCall(duration, () => {
      this.activePowerUps.delete(type);
      this.scene.events.emit('powerUpExpired', type);
    });
  }

  /**
   * 获取道具持续时间
   */
  private getPowerUpDuration(type: PowerUpType): number {
    switch (type) {
      case PowerUpType.ENERGY: return 30000;  // 30秒
      case PowerUpType.FIRE: return 20000;    // 20秒
      case PowerUpType.SHIELD: return 10000;  // 10秒
      case PowerUpType.SPEED: return 20000;   // 20秒
      default: return 10000;
    }
  }

  /**
   * 获取道具名称
   */
  private getPowerUpName(type: PowerUpType): string {
    switch (type) {
      case PowerUpType.ENERGY: return '能量篮球';
      case PowerUpType.FIRE: return '火焰篮球';
      case PowerUpType.SHIELD: return '护盾篮球';
      case PowerUpType.SPEED: return '加速鞋';
      default: return '未知道具';
    }
  }

  /**
   * 设置重生计划
   */
  private scheduleRespawn(data: ChestData) {
    const respawnTime = data.type === ChestType.GOLD 
      ? this.GOLD_CHEST_RESPAWN 
      : this.SILVER_CHEST_RESPAWN;

    this.scene.time.delayedCall(respawnTime, () => {
      this.spawnChest(data.type, data.x, data.y, data.id);
    });
  }

  /**
   * 设置刷新定时器
   */
  private setupRespawnTimers() {
    // 每5分钟随机刷新一个金色宝箱
    this.scene.time.addEvent({
      delay: this.GOLD_CHEST_RESPAWN,
      callback: () => {
        const x = Phaser.Math.Between(10, 140);
        const y = Phaser.Math.Between(10, 90);
        this.spawnChest(ChestType.GOLD, x, y);
      },
      loop: true
    });
  }

  /**
   * 检查玩家附近的宝箱
   */
  checkNearbyChests(playerX: number, playerY: number) {
    this.chests.forEach((chest, id) => {
      const data = this.chestData.get(id);
      if (!data || data.opened) return;

      const distance = Phaser.Math.Distance.Between(
        playerX, playerY,
        chest.x, chest.y
      );

      if (distance < this.DETECTION_RANGE) {
        // 放大宝箱
        this.scene.tweens.add({
          targets: chest,
          scaleX: 2,
          scaleY: 2,
          duration: 200,
          ease: 'Back.easeOut'
        });

        // 显示提示
        this.showInteractionHint(chest);
      } else {
        // 恢复原始大小
        this.scene.tweens.add({
          targets: chest,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200
        });

        // 隐藏提示
        this.hideInteractionHint(chest);
      }
    });
  }

  /**
   * 显示交互提示
   */
  private showInteractionHint(chest: Phaser.GameObjects.Sprite) {
    let hint = chest.getData('hint');
    
    if (!hint) {
      hint = this.scene.add.text(chest.x, chest.y - 80, '按 E 打开', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      });
      hint.setOrigin(0.5);
      hint.setDepth(10000);
      chest.setData('hint', hint);
    }

    hint.setVisible(true);
  }

  /**
   * 隐藏交互提示
   */
  private hideInteractionHint(chest: Phaser.GameObjects.Sprite) {
    const hint = chest.getData('hint');
    if (hint) {
      hint.setVisible(false);
    }
  }

  /**
   * 获取世界坐标
   */
  private getWorldPosition(tileX: number, tileY: number): { x: number, y: number } {
    // 简化版本，实际应该从地图获取
    const TILE_WIDTH = 64;
    const TILE_HEIGHT = 32;
    
    const x = (tileX - tileY) * (TILE_WIDTH / 2);
    const y = (tileX + tileY) * (TILE_HEIGHT / 2);
    
    return { x, y };
  }

  /**
   * 获取当前篮球币数量
   */
  getCoins(): number {
    return this.playerCoins;
  }

  /**
   * 检查是否有激活的道具
   */
  hasPowerUp(type: PowerUpType): boolean {
    const expireTime = this.activePowerUps.get(type);
    return expireTime !== undefined && expireTime > Date.now();
  }

  /**
   * 更新系统
   */
  update(playerX: number, playerY: number) {
    this.checkNearbyChests(playerX, playerY);
  }

  /**
   * 销毁系统
   */
  destroy() {
    this.chests.forEach(chest => {
      const particles = chest.getData('particles');
      if (particles) particles.destroy();
      const hint = chest.getData('hint');
      if (hint) hint.destroy();
      chest.destroy();
    });
    this.chests.clear();
    this.chestData.clear();
  }
}

