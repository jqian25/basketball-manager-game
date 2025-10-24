/**
 * 动画系统加载器
 * 统一管理所有游戏动画资源的加载和创建
 */

import Phaser from 'phaser';

export interface AnimationConfig {
  key: string;
  frames: number;
  frameRate: number;
  repeat: number;
}

/**
 * 动画系统加载器类
 */
export class AnimationSystemLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * 加载所有动画资源
   */
  preloadAll() {
    this.preloadCharacterAnimations();
    this.preloadWakeupAnimation();
    this.preloadBirdAnimation();
  }

  /**
   * 加载角色动画（10个角色×4方向×4帧=160帧）
   */
  private preloadCharacterAnimations() {
    const characters = [
      'player',      // 主角
      'coach',       // 教练
      'pg',          // 控球后卫
      'sg',          // 得分后卫
      'sf',          // 小前锋
      'pf',          // 大前锋
      'c',           // 中锋
      'npc_male',    // 路人男
      'npc_female',  // 路人女
      'shop_owner',  // 商店老板
    ];

    const directions = ['down', 'up', 'left', 'right'];

    characters.forEach((character) => {
      directions.forEach((direction) => {
        // 加载每个方向的4帧动画
        for (let i = 0; i < 4; i++) {
          const key = `${character}_${direction}_${i}`;
          const path = `/sprites/animations/${character}/${direction}/frame_${i}.png`;
          this.scene.load.image(key, path);
        }
      });
    });
  }

  /**
   * 加载起床动画（8帧）
   */
  private preloadWakeupAnimation() {
    for (let i = 0; i < 8; i++) {
      const key = `wakeup_${i}`;
      const path = `/animations/wakeup/frame_${i}.png`;
      this.scene.load.image(key, path);
    }
  }

  /**
   * 加载小鸟飞行动画（4方向×4帧=16帧）
   */
  private preloadBirdAnimation() {
    const directions = ['down', 'up', 'left', 'right'];

    directions.forEach((direction) => {
      for (let i = 0; i < 4; i++) {
        const key = `bird_${direction}_${i}`;
        const path = `/animations/bird/${direction}/frame_${i}.png`;
        this.scene.load.image(key, path);
      }
    });
  }

  /**
   * 创建所有动画
   */
  createAll() {
    this.createCharacterAnimations();
    this.createWakeupAnimation();
    this.createBirdAnimations();
  }

  /**
   * 创建角色动画
   */
  private createCharacterAnimations() {
    const characters = [
      'player',
      'coach',
      'pg',
      'sg',
      'sf',
      'pf',
      'c',
      'npc_male',
      'npc_female',
      'shop_owner',
    ];

    const directions = ['down', 'up', 'left', 'right'];

    characters.forEach((character) => {
      directions.forEach((direction) => {
        const animKey = `${character}_walk_${direction}`;

        // 检查动画是否已存在
        if (this.scene.anims.exists(animKey)) {
          return;
        }

        // 创建动画
        this.scene.anims.create({
          key: animKey,
          frames: [
            { key: `${character}_${direction}_0` },
            { key: `${character}_${direction}_1` },
            { key: `${character}_${direction}_2` },
            { key: `${character}_${direction}_3` },
          ],
          frameRate: 8,
          repeat: -1,
        });
      });

      // 创建待机动画（使用第一帧）
      directions.forEach((direction) => {
        const idleKey = `${character}_idle_${direction}`;

        if (this.scene.anims.exists(idleKey)) {
          return;
        }

        this.scene.anims.create({
          key: idleKey,
          frames: [{ key: `${character}_${direction}_0` }],
          frameRate: 1,
          repeat: 0,
        });
      });
    });
  }

  /**
   * 创建起床动画
   */
  private createWakeupAnimation() {
    if (this.scene.anims.exists('wakeup')) {
      return;
    }

    this.scene.anims.create({
      key: 'wakeup',
      frames: [
        { key: 'wakeup_0' }, // 躺在床上睡觉
        { key: 'wakeup_1' }, // 睁开眼睛
        { key: 'wakeup_2' }, // 伸懒腰
        { key: 'wakeup_3' }, // 坐起
        { key: 'wakeup_4' }, // 坐在床边
        { key: 'wakeup_5' }, // 站起
        { key: 'wakeup_6' }, // 整理衣服
        { key: 'wakeup_7' }, // 准备出发
      ],
      frameRate: 4,
      repeat: 0,
    });
  }

  /**
   * 创建小鸟飞行动画
   */
  private createBirdAnimations() {
    const directions = ['down', 'up', 'left', 'right'];

    directions.forEach((direction) => {
      const animKey = `bird_fly_${direction}`;

      if (this.scene.anims.exists(animKey)) {
        return;
      }

      this.scene.anims.create({
        key: animKey,
        frames: [
          { key: `bird_${direction}_0` },
          { key: `bird_${direction}_1` },
          { key: `bird_${direction}_2` },
          { key: `bird_${direction}_3` },
        ],
        frameRate: 12,
        repeat: -1,
      });
    });
  }

  /**
   * 获取角色动画键名
   */
  static getCharacterAnimKey(character: string, action: 'walk' | 'idle', direction: string): string {
    return `${character}_${action}_${direction}`;
  }

  /**
   * 获取小鸟动画键名
   */
  static getBirdAnimKey(direction: string): string {
    return `bird_fly_${direction}`;
  }

  /**
   * 获取起床动画键名
   */
  static getWakeupAnimKey(): string {
    return 'wakeup';
  }
}

export default AnimationSystemLoader;

