import Phaser from 'phaser';

export default class KairoMatchScene extends Phaser.Scene {
  private players: Phaser.GameObjects.Sprite[] = [];
  private ball?: Phaser.GameObjects.Sprite;
  private scoreText?: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;
  private homeScore: number = 0;
  private awayScore: number = 0;
  private timeRemaining: number = 180; // 3分钟
  private gameTimer?: Phaser.Time.TimerEvent;
  private eventTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'KairoMatchScene' });
  }

  preload() {
    // 加载球场背景
    this.load.image('court', '/kairo/courts/basketball-court-main-indoor.png');
    
    // 加载球员精灵图
    this.load.image('player_orange', '/kairo/player-pg-idle.png');
    this.load.image('player_blue', '/kairo/player-sg-shooting.png');
    
    // 加载篮球
    this.load.image('basketball', '/kairo/ui/basketball-icon.png');
  }

  create() {
    // 设置球场背景
    const court = this.add.image(400, 300, 'court');
    court.setDisplaySize(800, 600);

    // 创建比分显示
    this.scoreText = this.add.text(400, 30, '0 - 0', {
      fontSize: '48px',
      color: '#FFFFFF',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // 创建时间显示
    this.timeText = this.add.text(400, 80, 'Q1 2:48', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 创建橙队球员（主队）- 左侧
    this.createPlayer(150, 200, 'player_orange', 'home');
    this.createPlayer(200, 300, 'player_orange', 'home');
    this.createPlayer(150, 400, 'player_orange', 'home');
    this.createPlayer(100, 250, 'player_orange', 'home');
    this.createPlayer(100, 350, 'player_orange', 'home');

    // 创建蓝队球员（客队）- 右侧
    this.createPlayer(650, 200, 'player_blue', 'away');
    this.createPlayer(600, 300, 'player_blue', 'away');
    this.createPlayer(650, 400, 'player_blue', 'away');
    this.createPlayer(700, 250, 'player_blue', 'away');
    this.createPlayer(700, 350, 'player_blue', 'away');

    // 创建篮球
    this.ball = this.add.sprite(400, 300, 'basketball');
    this.ball.setScale(0.5);

    // 启动游戏计时器
    this.startGameTimer();
    
    // 启动事件生成器
    this.startEventGenerator();
  }

  private createPlayer(x: number, y: number, texture: string, team: 'home' | 'away') {
    const player = this.add.sprite(x, y, texture);
    player.setScale(2); // 放大2倍
    player.setData('team', team);
    player.setData('originalX', x);
    player.setData('originalY', y);
    this.players.push(player);
  }

  private startGameTimer() {
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        this.updateTimeDisplay();
        
        if (this.timeRemaining <= 0) {
          this.endGame();
        }
      },
      loop: true
    });
  }

  private startEventGenerator() {
    this.eventTimer = this.time.addEvent({
      delay: 3000, // 每3秒生成一个事件
      callback: () => {
        this.generateRandomEvent();
      },
      loop: true
    });
  }

  private generateRandomEvent() {
    const eventType = Phaser.Math.Between(1, 5);
    
    switch (eventType) {
      case 1:
      case 2:
        this.simulateShot();
        break;
      case 3:
        this.simulatePass();
        break;
      case 4:
        this.simulateRebound();
        break;
      case 5:
        this.simulateSteal();
        break;
    }
  }

  private simulateShot() {
    const team = Math.random() > 0.5 ? 'home' : 'away';
    const shooter = this.players.find(p => p.getData('team') === team);
    
    if (!shooter || !this.ball) return;

    // 球员移动到投篮位置
    this.tweens.add({
      targets: shooter,
      x: team === 'home' ? 300 : 500,
      y: 300,
      duration: 500,
      onComplete: () => {
        // 投篮动作
        const success = Math.random() > 0.4;
        
        if (success) {
          // 进球动画
          this.tweens.add({
            targets: this.ball,
            x: team === 'home' ? 700 : 100,
            y: 200,
            scaleX: 0.3,
            scaleY: 0.3,
            duration: 800,
            ease: 'Quad.easeOut',
            onComplete: () => {
              // 得分
              const points = Math.random() > 0.7 ? 3 : 2;
              if (team === 'home') {
                this.homeScore += points;
              } else {
                this.awayScore += points;
              }
              this.updateScoreDisplay();
              
              // 球回到中场
              this.resetBall();
            }
          });
        } else {
          // 不中动画
          this.tweens.add({
            targets: this.ball,
            x: team === 'home' ? 650 : 150,
            y: 250,
            duration: 600,
            onComplete: () => {
              this.resetBall();
            }
          });
        }
        
        // 球员回到原位
        this.tweens.add({
          targets: shooter,
          x: shooter.getData('originalX'),
          y: shooter.getData('originalY'),
          duration: 1000,
          delay: 1000
        });
      }
    });
  }

  private simulatePass() {
    const passer = Phaser.Utils.Array.GetRandom(this.players);
    const receiver = this.players.find(p => 
      p !== passer && p.getData('team') === passer.getData('team')
    );
    
    if (!receiver || !this.ball) return;

    this.tweens.add({
      targets: this.ball,
      x: receiver.x,
      y: receiver.y,
      duration: 400,
      ease: 'Quad.easeInOut'
    });
  }

  private simulateRebound() {
    const rebounder = Phaser.Utils.Array.GetRandom(this.players);
    
    if (!rebounder || !this.ball) return;

    this.tweens.add({
      targets: rebounder,
      y: rebounder.y - 30,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        if (this.ball) {
          this.ball.x = rebounder.x;
          this.ball.y = rebounder.y;
        }
      }
    });
  }

  private simulateSteal() {
    const stealer = Phaser.Utils.Array.GetRandom(this.players);
    
    if (!stealer || !this.ball) return;

    this.tweens.add({
      targets: stealer,
      x: this.ball.x,
      y: this.ball.y,
      duration: 300,
      onComplete: () => {
        // 快速回到原位
        this.tweens.add({
          targets: stealer,
          x: stealer.getData('originalX'),
          y: stealer.getData('originalY'),
          duration: 500
        });
      }
    });
  }

  private resetBall() {
    if (!this.ball) return;
    
    this.tweens.add({
      targets: this.ball,
      x: 400,
      y: 300,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 500
    });
  }

  private updateScoreDisplay() {
    if (this.scoreText) {
      this.scoreText.setText(`${this.homeScore} - ${this.awayScore}`);
      
      // 得分闪烁效果
      this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true
      });
    }
  }

  private updateTimeDisplay() {
    if (this.timeText) {
      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      const quarter = Math.ceil((180 - this.timeRemaining) / 45) || 1;
      this.timeText.setText(`Q${quarter} ${mins}:${secs.toString().padStart(2, '0')}`);
    }
  }

  private endGame() {
    if (this.gameTimer) {
      this.gameTimer.destroy();
    }
    if (this.eventTimer) {
      this.eventTimer.destroy();
    }

    // 显示比赛结束
    const endText = this.add.text(400, 300, '比赛结束！', {
      fontSize: '64px',
      color: '#FFD700',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.tweens.add({
      targets: endText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  update() {
    // 可以在这里添加持续的动画更新
  }
}

