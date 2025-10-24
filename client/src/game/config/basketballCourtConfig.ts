import Phaser from 'phaser';
import { BasketballCourtScene } from '../scenes/BasketballCourtScene';

/**
 * Kairosoft风格篮球场游戏配置
 */
export const basketballCourtConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'phaser-game-container',
  backgroundColor: '#87CEEB', // 天空蓝背景
  scene: [BasketballCourtScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: true, // 像素完美渲染
    antialias: false,
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

