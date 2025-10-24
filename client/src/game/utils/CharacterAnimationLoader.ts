/**
 * 角色动画加载器
 * 负责加载和创建所有角色的4方向走路动画
 */

import Phaser from 'phaser';

export interface CharacterConfig {
  key: string;
  name: string;
  description: string;
}

// 10个角色配置
export const CHARACTERS: CharacterConfig[] = [
  { key: 'player', name: '主角', description: '橙色35号球衣的篮球运动员' },
  { key: 'coach', name: '教练', description: '深蓝西装的篮球教练' },
  { key: 'pg', name: '控球后卫', description: '蓝色球衣的PG' },
  { key: 'sg', name: '得分后卫', description: '红色球衣的SG' },
  { key: 'sf', name: '小前锋', description: '绿色球衣的SF' },
  { key: 'pf', name: '大前锋', description: '黄色4号球衣的PF' },
  { key: 'c', name: '中锋', description: '紫色5号球衣的C' },
  { key: 'npc_male', name: '路人男', description: '蓝色T恤的男性NPC' },
  { key: 'npc_female', name: '路人女', description: '粉色连衣裙的女性NPC' },
  { key: 'shop_owner', name: '商店老板', description: '绿色围裙的商店老板' },
];

// 4个方向
export const DIRECTIONS = ['down', 'up', 'left', 'right'] as const;
export type Direction = typeof DIRECTIONS[number];

// 动画配置
export const ANIMATION_CONFIG = {
  frameRate: 8, // 8帧/秒
  repeat: -1, // 无限循环
};

/**
 * 加载所有角色的动画帧
 */
export function preloadCharacterAnimations(scene: Phaser.Scene): void {
  CHARACTERS.forEach((character) => {
    DIRECTIONS.forEach((direction) => {
      // 加载4帧动画
      for (let i = 0; i < 4; i++) {
        const key = `${character.key}_${direction}_${i}`;
        const path = `/sprites/animations/${character.key}/${direction}/frame_${i}.png`;
        scene.load.image(key, path);
      }
    });
  });
}

/**
 * 创建所有角色的动画
 */
export function createCharacterAnimations(scene: Phaser.Scene): void {
  CHARACTERS.forEach((character) => {
    DIRECTIONS.forEach((direction) => {
      const animKey = `${character.key}_walk_${direction}`;
      
      // 检查动画是否已存在
      if (scene.anims.exists(animKey)) {
        return;
      }

      // 创建动画帧数组
      const frames: Phaser.Types.Animations.AnimationFrame[] = [];
      for (let i = 0; i < 4; i++) {
        const key = `${character.key}_${direction}_${i}`;
        frames.push({ key, frame: 0 });
      }

      // 创建动画
      scene.anims.create({
        key: animKey,
        frames,
        frameRate: ANIMATION_CONFIG.frameRate,
        repeat: ANIMATION_CONFIG.repeat,
      });
    });

    // 创建idle动画（使用第0帧）
    DIRECTIONS.forEach((direction) => {
      const idleKey = `${character.key}_idle_${direction}`;
      
      if (scene.anims.exists(idleKey)) {
        return;
      }

      scene.anims.create({
        key: idleKey,
        frames: [{ key: `${character.key}_${direction}_0`, frame: 0 }],
        frameRate: 1,
        repeat: 0,
      });
    });
  });
}

/**
 * 创建角色精灵
 */
export function createCharacterSprite(
  scene: Phaser.Scene,
  x: number,
  y: number,
  characterKey: string
): Phaser.GameObjects.Sprite {
  // 使用down方向的第0帧作为初始图像
  const sprite = scene.add.sprite(x, y, `${characterKey}_down_0`);
  
  // 设置缩放（如果需要）
  sprite.setScale(2); // 放大2倍以便看清
  
  // 播放idle动画
  sprite.play(`${characterKey}_idle_down`);
  
  return sprite;
}

/**
 * 播放角色走路动画
 */
export function playWalkAnimation(
  sprite: Phaser.GameObjects.Sprite,
  characterKey: string,
  direction: Direction
): void {
  const animKey = `${characterKey}_walk_${direction}`;
  if (sprite.anims && sprite.anims.currentAnim?.key !== animKey) {
    sprite.play(animKey);
  }
}

/**
 * 播放角色idle动画
 */
export function playIdleAnimation(
  sprite: Phaser.GameObjects.Sprite,
  characterKey: string,
  direction: Direction
): void {
  const idleKey = `${characterKey}_idle_${direction}`;
  if (sprite.anims && sprite.anims.currentAnim?.key !== idleKey) {
    sprite.play(idleKey);
  }
}

/**
 * 根据速度向量获取方向
 */
export function getDirectionFromVelocity(vx: number, vy: number): Direction {
  // 如果速度为0，返回down作为默认方向
  if (vx === 0 && vy === 0) {
    return 'down';
  }

  // 计算角度（弧度）
  const angle = Math.atan2(vy, vx);
  
  // 转换为度数
  const degrees = angle * (180 / Math.PI);
  
  // 根据角度范围确定方向
  // 右: -45 to 45
  // 下: 45 to 135
  // 左: 135 to 180 or -180 to -135
  // 上: -135 to -45
  
  if (degrees >= -45 && degrees < 45) {
    return 'right';
  } else if (degrees >= 45 && degrees < 135) {
    return 'down';
  } else if (degrees >= 135 || degrees < -135) {
    return 'left';
  } else {
    return 'up';
  }
}

/**
 * 更新角色动画（根据移动状态）
 */
export function updateCharacterAnimation(
  sprite: Phaser.GameObjects.Sprite,
  characterKey: string,
  vx: number,
  vy: number
): void {
  const isMoving = vx !== 0 || vy !== 0;
  const direction = getDirectionFromVelocity(vx, vy);
  
  if (isMoving) {
    playWalkAnimation(sprite, characterKey, direction);
  } else {
    playIdleAnimation(sprite, characterKey, direction);
  }
}

