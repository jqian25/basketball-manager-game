/**
 * 战斗场景 - 占位符
 * 后续可扩展为更复杂的战斗系统
 */

import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    this.add.text(400, 300, '战斗场景开发中...', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('TownScene');
    });
  }
}

