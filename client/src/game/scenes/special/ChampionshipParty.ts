import Phaser from 'phaser';

/**
 * 特殊场景 5 - 冠军庆祝派对
 * 球队赢得冠军后的庆祝派对场景
 */
export class ChampionshipPartyScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private npcs: Phaser.GameObjects.Sprite[] = [];
  private confetti: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private music!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'ChampionshipPartyScene' });
  }

  preload() {
    // 加载资源
    this.load.image('party_bg', '/assets/scenes/championship_party_bg.png');
    this.load.spritesheet('party_npc', '/assets/characters/party_npc.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('confetti', '/assets/effects/confetti.png');
    this.load.image('trophy', '/assets/items/trophy.png');
    this.load.audio('party_music', '/assets/audio/party_music.mp3');
  }

  create() {
    // 背景
    this.background = this.add.image(400, 300, 'party_bg');

    // 奖杯展示
    const trophy = this.add.image(400, 200, 'trophy');
    trophy.setScale(2);
    this.tweens.add({
      targets: trophy,
      y: 180,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 创建庆祝的NPC
    this.createPartyNPCs();

    // 五彩纸屑效果
    this.createConfettiEffect();

    // 播放音乐
    this.music = this.sound.add('party_music', { loop: true, volume: 0.5 });
    this.music.play();

    // 互动提示
    this.createInteractionUI();
  }

  private createPartyNPCs() {
    const positions = [
      { x: 200, y: 400 },
      { x: 300, y: 420 },
      { x: 500, y: 420 },
      { x: 600, y: 400 },
      { x: 350, y: 350 },
      { x: 450, y: 350 }
    ];

    positions.forEach((pos, index) => {
      const npc = this.add.sprite(pos.x, pos.y, 'party_npc');
      npc.setInteractive();

      // 庆祝动画
      this.tweens.add({
        targets: npc,
        y: pos.y - 20,
        duration: 500 + index * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // 点击对话
      npc.on('pointerdown', () => {
        this.showCelebrationDialog(index);
      });

      this.npcs.push(npc);
    });
  }

  private createConfettiEffect() {
    for (let i = 0; i < 5; i++) {
      const emitter = this.add.particles(i * 200, 0, 'confetti', {
        speed: { min: 100, max: 200 },
        angle: { min: 60, max: 120 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        frequency: 200,
        gravityY: 300
      });
      this.confetti.push(emitter);
    }
  }

  private showCelebrationDialog(npcIndex: number) {
    const messages = [
      "我们做到了!这是最棒的一季!",
      "冠军!我们是冠军!",
      "教练,谢谢您的指导!",
      "这个奖杯属于我们所有人!",
      "下赛季我们要卫冕!",
      "今晚尽情庆祝吧!"
    ];

    // 显示对话框
    const dialogBox = this.add.rectangle(400, 500, 600, 100, 0x000000, 0.8);
    const dialogText = this.add.text(400, 500, messages[npcIndex], {
      fontSize: '20px',
      color: '#ffffff',
      align: 'center'
    });
    dialogText.setOrigin(0.5);

    // 3秒后消失
    this.time.delayedCall(3000, () => {
      dialogBox.destroy();
      dialogText.destroy();
    });
  }

  private createInteractionUI() {
    const uiContainer = this.add.container(400, 550);

    const bg = this.add.rectangle(0, 0, 700, 80, 0x000000, 0.7);
    const text = this.add.text(0, 0, '点击队员对话 | 按ESC返回', {
      fontSize: '18px',
      color: '#ffffff'
    });
    text.setOrigin(0.5);

    uiContainer.add([bg, text]);

    // ESC键返回
    this.input.keyboard?.on('keydown-ESC', () => {
      this.music.stop();
      this.scene.start('MainGameScene');
    });
  }

  update() {
    // 更新逻辑
  }
}

