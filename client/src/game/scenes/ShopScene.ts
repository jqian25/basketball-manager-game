/**
 * 商店场景 - 购买装备和道具
 */

import Phaser from 'phaser';
import { GameState, Item } from '../GameState';

export class ShopScene extends Phaser.Scene {
  private gameState: GameState;
  private shopItems: Item[] = [];
  private selectedItem: Item | null = null;

  constructor() {
    super({ key: 'ShopScene' });
    this.gameState = GameState.getInstance();
  }

  create() {
    // 背景
    this.add.rectangle(400, 300, 800, 600, 0x006400);
    
    // 标题
    this.add.text(400, 30, '🛒 装备商店', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 显示金币
    const playerData = this.gameState.getPlayerData();
    this.add.text(400, 70, `💰 你的金币: ${playerData.money}`, {
      fontSize: '20px',
      color: '#ffff00'
    }).setOrigin(0.5);

    // 初始化商品
    this.initializeShop();

    // 创建商品列表
    this.createShopItems();

    // 返回按钮
    this.createBackButton();
  }

  private initializeShop() {
    this.shopItems = [
      {
        id: 'shoes_basic',
        name: '基础球鞋',
        type: 'shoes',
        price: 200,
        effect: { speed: 2 },
        description: '提升速度 +2'
      },
      {
        id: 'shoes_pro',
        name: '专业球鞋',
        type: 'shoes',
        price: 500,
        effect: { speed: 5 },
        description: '提升速度 +5'
      },
      {
        id: 'jersey_basic',
        name: '训练球衣',
        type: 'jersey',
        price: 300,
        effect: { defense: 3 },
        description: '提升防御 +3'
      },
      {
        id: 'jersey_pro',
        name: '比赛球衣',
        type: 'jersey',
        price: 600,
        effect: { defense: 6 },
        description: '提升防御 +6'
      },
      {
        id: 'accessory_wristband',
        name: '护腕',
        type: 'accessory',
        price: 250,
        effect: { attack: 3 },
        description: '提升攻击 +3'
      },
      {
        id: 'accessory_headband',
        name: '头带',
        type: 'accessory',
        price: 400,
        effect: { attack: 5 },
        description: '提升攻击 +5'
      },
      {
        id: 'potion',
        name: '体力药水',
        type: 'consumable',
        price: 50,
        effect: { hp: 20 },
        description: '恢复20点HP'
      },
      {
        id: 'super_potion',
        name: '超级药水',
        type: 'consumable',
        price: 150,
        effect: { hp: 50 },
        description: '恢复50点HP'
      }
    ];
  }

  private createShopItems() {
    const startY = 120;
    const itemHeight = 60;

    this.shopItems.forEach((item, index) => {
      const y = startY + index * itemHeight;
      
      // 背景
      const bg = this.add.rectangle(400, y, 700, 50, 0x228b22, 0.5);
      bg.setStrokeStyle(2, 0xffffff);
      bg.setInteractive({ useHandCursor: true });

      // 商品信息
      const nameText = this.add.text(120, y, item.name, {
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      const descText = this.add.text(300, y, item.description, {
        fontSize: '14px',
        color: '#cccccc'
      }).setOrigin(0, 0.5);

      const priceText = this.add.text(550, y, `💰 ${item.price}`, {
        fontSize: '16px',
        color: '#ffff00'
      }).setOrigin(0, 0.5);

      // 购买按钮
      const buyBtn = this.add.rectangle(680, y, 80, 35, 0x4a90e2);
      const buyText = this.add.text(680, y, '购买', {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5);

      buyBtn.setInteractive({ useHandCursor: true });
      buyBtn.on('pointerdown', () => this.buyItem(item));
      buyBtn.on('pointerover', () => buyBtn.setFillStyle(0x5aa0f2));
      buyBtn.on('pointerout', () => buyBtn.setFillStyle(0x4a90e2));

      // 悬停效果
      bg.on('pointerover', () => {
        bg.setFillStyle(0x2d8b2d, 0.7);
        this.selectedItem = item;
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x228b22, 0.5);
      });
    });
  }

  private buyItem(item: Item) {
    const playerData = this.gameState.getPlayerData();

    if (playerData.money < item.price) {
      this.showMessage('金币不足!', 0xff0000);
      return;
    }

    // 扣除金币
    this.gameState.spendMoney(item.price);

    // 添加物品
    this.gameState.addItem(item);

    this.showMessage(`购买成功! 获得 ${item.name}`, 0x00ff00);

    // 刷新金币显示
    this.scene.restart();
  }

  private showMessage(text: string, color: number) {
    const message = this.add.text(400, 300, text, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba
    }).setOrigin(0.5);

    this.tweens.add({
      targets: message,
      alpha: 0,
      y: 250,
      duration: 2000,
      onComplete: () => message.destroy()
    });
  }

  private createBackButton() {
    const backBtn = this.add.rectangle(400, 560, 150, 40, 0x8b0000);
    const backText = this.add.text(400, 560, '🏠 返回城镇', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.scene.start('TownScene');
    });
    backBtn.on('pointerover', () => backBtn.setFillStyle(0xaa0000));
    backBtn.on('pointerout', () => backBtn.setFillStyle(0x8b0000));
  }
}

