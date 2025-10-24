/**
 * 道场场景 - 篮球对战
 * 简化版回合制战斗系统
 */

import Phaser from 'phaser';
import { GameState, TeamMember } from '../GameState';

export class DojoScene extends Phaser.Scene {
  private gameState: GameState;
  private playerTeam: TeamMember[] = [];
  private enemyTeam: TeamMember[] = [];
  private currentPlayerIndex: number = 0;
  private currentEnemyIndex: number = 0;
  private battleLog: string[] = [];
  private battleUI!: Phaser.GameObjects.Container;
  private logText!: Phaser.GameObjects.Text;
  private playerHPBar!: Phaser.GameObjects.Graphics;
  private enemyHPBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'DojoScene' });
    this.gameState = GameState.getInstance();
  }

  create() {
    // 背景
    this.add.rectangle(400, 300, 800, 600, 0x8b4513);
    
    // 标题
    this.add.text(400, 30, '🏀 篮球道场对战', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 初始化队伍
    this.initializeTeams();

    // 创建战斗UI
    this.createBattleUI();

    // 开始战斗
    this.startBattle();
  }

  private initializeTeams() {
    const playerData = this.gameState.getPlayerData();
    this.playerTeam = [...playerData.team];
    
    // 生成敌方队伍
    this.enemyTeam = [
      {
        id: 'enemy_1',
        name: '道场学员',
        position: 'SG',
        level: 5,
        hp: 45,
        maxHp: 45,
        attack: 10,
        defense: 7,
        speed: 12,
        skills: ['快攻', '防守']
      }
    ];
  }

  private createBattleUI() {
    this.battleUI = this.add.container(0, 0);

    // 玩家区域
    const playerBg = this.add.rectangle(150, 250, 250, 150, 0x0066cc, 0.3);
    const playerNameText = this.add.text(150, 200, this.playerTeam[0].name, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 玩家HP条
    this.playerHPBar = this.add.graphics();
    this.updateHPBar(this.playerHPBar, 50, 280, this.playerTeam[0].hp, this.playerTeam[0].maxHp, 0x00ff00);

    // 敌方区域
    const enemyBg = this.add.rectangle(650, 250, 250, 150, 0xcc0000, 0.3);
    const enemyNameText = this.add.text(650, 200, this.enemyTeam[0].name, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 敌方HP条
    this.enemyHPBar = this.add.graphics();
    this.updateHPBar(this.enemyHPBar, 550, 280, this.enemyTeam[0].hp, this.enemyTeam[0].maxHp, 0xff0000);

    // 战斗日志
    const logBg = this.add.rectangle(400, 450, 700, 200, 0x000000, 0.8);
    this.logText = this.add.text(100, 370, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: 600 }
    });

    // 操作按钮
    this.createActionButtons();

    this.battleUI.add([
      playerBg, playerNameText, enemyBg, enemyNameText, logBg, this.logText
    ]);
  }

  private createActionButtons() {
    const buttonY = 520;
    
    // 投篮按钮
    const shootBtn = this.createButton(150, buttonY, '🏀 投篮', () => {
      this.playerAction('shoot');
    });

    // 传球按钮
    const passBtn = this.createButton(300, buttonY, '🤝 传球', () => {
      this.playerAction('pass');
    });

    // 防守按钮
    const defendBtn = this.createButton(450, buttonY, '🛡️ 防守', () => {
      this.playerAction('defend');
    });

    // 返回按钮
    const backBtn = this.createButton(650, buttonY, '🏠 返回', () => {
      this.scene.start('TownScene');
    });
  }

  private createButton(x: number, y: number, text: string, callback: () => void) {
    const btn = this.add.rectangle(x, y, 120, 40, 0x4a90e2);
    const btnText = this.add.text(x, y, text, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', callback);
    btn.on('pointerover', () => btn.setFillStyle(0x5aa0f2));
    btn.on('pointerout', () => btn.setFillStyle(0x4a90e2));

    return { btn, btnText };
  }

  private updateHPBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, hp: number, maxHp: number, color: number) {
    graphics.clear();
    
    // 背景
    graphics.fillStyle(0x333333);
    graphics.fillRect(x, y, 200, 20);
    
    // HP条
    const hpWidth = (hp / maxHp) * 200;
    graphics.fillStyle(color);
    graphics.fillRect(x, y, hpWidth, 20);
    
    // 边框
    graphics.lineStyle(2, 0xffffff);
    graphics.strokeRect(x, y, 200, 20);

    // HP文本
    const hpText = this.add.text(x + 100, y + 10, `${hp}/${maxHp}`, {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private startBattle() {
    this.addLog('战斗开始!');
    this.addLog(`${this.playerTeam[0].name} VS ${this.enemyTeam[0].name}`);
  }

  private playerAction(action: string) {
    const player = this.playerTeam[this.currentPlayerIndex];
    const enemy = this.enemyTeam[this.currentEnemyIndex];

    let damage = 0;
    let message = '';

    switch (action) {
      case 'shoot':
        damage = Math.max(0, player.attack - enemy.defense + Phaser.Math.Between(-3, 3));
        enemy.hp -= damage;
        message = `${player.name} 投篮命中! 造成 ${damage} 点伤害!`;
        break;
      
      case 'pass':
        damage = Math.floor(player.attack * 0.8);
        enemy.hp -= damage;
        message = `${player.name} 精彩助攻! 造成 ${damage} 点伤害!`;
        break;
      
      case 'defend':
        player.defense += 2;
        message = `${player.name} 加强防守! 防御力提升!`;
        break;
    }

    this.addLog(message);
    this.updateHPBar(this.enemyHPBar, 550, 280, enemy.hp, enemy.maxHp, 0xff0000);

    // 检查胜负
    if (enemy.hp <= 0) {
      this.victory();
      return;
    }

    // 敌方回合
    this.time.delayedCall(1000, () => {
      this.enemyAction();
    });
  }

  private enemyAction() {
    const player = this.playerTeam[this.currentPlayerIndex];
    const enemy = this.enemyTeam[this.currentEnemyIndex];

    const actions = ['shoot', 'pass', 'defend'];
    const action = Phaser.Utils.Array.GetRandom(actions);

    let damage = 0;
    let message = '';

    switch (action) {
      case 'shoot':
        damage = Math.max(0, enemy.attack - player.defense + Phaser.Math.Between(-3, 3));
        player.hp -= damage;
        message = `${enemy.name} 投篮! 造成 ${damage} 点伤害!`;
        break;
      
      case 'pass':
        damage = Math.floor(enemy.attack * 0.8);
        player.hp -= damage;
        message = `${enemy.name} 传球进攻! 造成 ${damage} 点伤害!`;
        break;
      
      case 'defend':
        enemy.defense += 2;
        message = `${enemy.name} 防守姿态!`;
        break;
    }

    this.addLog(message);
    this.updateHPBar(this.playerHPBar, 50, 280, player.hp, player.maxHp, 0x00ff00);

    // 检查胜负
    if (player.hp <= 0) {
      this.defeat();
    }
  }

  private victory() {
    this.addLog('');
    this.addLog('🎉 胜利! 你赢得了比赛!');
    
    const reward = 500;
    this.gameState.addMoney(reward);
    this.gameState.defeatDojo('dojo_1');
    
    this.addLog(`获得奖励: ${reward} 金币!`);

    this.time.delayedCall(3000, () => {
      this.scene.start('TownScene');
    });
  }

  private defeat() {
    this.addLog('');
    this.addLog('💔 失败了... 继续努力!');

    this.time.delayedCall(3000, () => {
      this.scene.start('TownScene');
    });
  }

  private addLog(message: string) {
    this.battleLog.push(message);
    if (this.battleLog.length > 8) {
      this.battleLog.shift();
    }
    this.logText.setText(this.battleLog.join('\n'));
  }
}

