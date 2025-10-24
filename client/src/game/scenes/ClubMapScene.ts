import Phaser from 'phaser';

// 地图网格配置
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

// 设施类型
interface Facility {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  image: string;
  cost: number;
  income: number;
}

export class ClubMapScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private facilities: Facility[] = [];
  private gridGraphics?: Phaser.GameObjects.Graphics;
  private selectedFacility?: Facility;
  
  constructor() {
    super({ key: 'ClubMapScene' });
  }

  preload() {
    // 加载球场背景
    this.load.image('ground', '/kairo/courts/basketball-court-main-indoor.png');
    
    // 加载球员精灵
    this.load.image('player', '/kairo/player-pg-idle.png');
    
    // 加载设施建筑（使用实际存在的文件）
    this.load.image('gym', '/kairo/facilities/gym.png');
    this.load.image('sports-gym', '/kairo/facilities/sports-gym.png');
    this.load.image('cafeteria', '/kairo/facilities/cafeteria.png');
    this.load.image('merch-store', '/kairo/facilities/merch-store.png');
    this.load.image('boutique', '/kairo/facilities/boutique.png');
    this.load.image('bookstore', '/kairo/facilities/bookstore.png');
    this.load.image('drugstore', '/kairo/facilities/drugstore.png');
    this.load.image('music-shop', '/kairo/facilities/music-shop.png');
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // 绘制等轴测网格
    this.drawIsometricGrid();
    
    // 创建初始设施
    this.createInitialFacilities();
    
    // 创建玩家
    this.createPlayer();
    
    // 设置键盘控制
    this.cursors = this.input.keyboard?.createCursorKeys();
    
    // 添加点击事件
    this.input.on('pointerdown', this.handleClick, this);
    
    // 显示提示文本
    this.add.text(10, 10, '点击空地建设设施 | 方向键移动', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(1000);
  }

  private drawIsometricGrid() {
    this.gridGraphics = this.add.graphics();
    this.gridGraphics.lineStyle(1, 0xcccccc, 0.3);

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const isoPos = this.cartesianToIsometric(x, y);
        
        // 绘制菱形网格
        const points = [
          { x: isoPos.x, y: isoPos.y },
          { x: isoPos.x + TILE_WIDTH / 2, y: isoPos.y + TILE_HEIGHT / 2 },
          { x: isoPos.x, y: isoPos.y + TILE_HEIGHT },
          { x: isoPos.x - TILE_WIDTH / 2, y: isoPos.y + TILE_HEIGHT / 2 },
        ];
        
        this.gridGraphics.beginPath();
        this.gridGraphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.gridGraphics.lineTo(points[i].x, points[i].y);
        }
        this.gridGraphics.closePath();
        this.gridGraphics.strokePath();
      }
    }
  }

  private createInitialFacilities() {
    // 创建初始设施布局
    const initialFacilities: Omit<Facility, 'id'>[] = [
      { name: '健身房', type: 'training', x: 5, y: 5, image: 'gym', cost: 5000, income: 100 },
      { name: '运动馆', type: 'training', x: 8, y: 5, image: 'sports-gym', cost: 8000, income: 150 },
      { name: '餐厅', type: 'amenity', x: 5, y: 8, image: 'cafeteria', cost: 3000, income: 80 },
      { name: '商店', type: 'shop', x: 8, y: 8, image: 'merch-store', cost: 4000, income: 120 },
      { name: '书店', type: 'shop', x: 11, y: 5, image: 'bookstore', cost: 3500, income: 90 },
    ];

    initialFacilities.forEach((data, index) => {
      const facility: Facility = {
        ...data,
        id: `facility_${index}`
      };
      this.addFacility(facility);
    });
  }

  private addFacility(facility: Facility) {
    const isoPos = this.cartesianToIsometric(facility.x, facility.y);
    
    // 创建设施精灵
    const sprite = this.add.sprite(isoPos.x, isoPos.y, facility.image);
    sprite.setOrigin(0.5, 0.8); // 调整原点使建筑底部对齐网格
    sprite.setScale(0.15); // 缩小到合适大小
    sprite.setInteractive();
    sprite.setData('facility', facility);
    
    // 添加点击事件
    sprite.on('pointerdown', () => {
      this.selectFacility(facility);
    });
    
    // 添加悬停效果
    sprite.on('pointerover', () => {
      sprite.setTint(0xffff00);
    });
    
    sprite.on('pointerout', () => {
      sprite.clearTint();
    });
    
    this.facilities.push(facility);
  }

  private createPlayer() {
    const startPos = this.cartesianToIsometric(10, 10);
    this.player = this.add.sprite(startPos.x, startPos.y, 'player');
    this.player.setScale(2);
    this.player.setDepth(100);
    this.player.setData('gridX', 10);
    this.player.setData('gridY', 10);
  }

  private selectFacility(facility: Facility) {
    this.selectedFacility = facility;
    
    // 显示设施信息
    const infoText = `${facility.name}\n类型: ${facility.type}\n成本: $${facility.cost}\n收入: $${facility.income}/月`;
    
    // 触发自定义事件通知React组件
    this.game.events.emit('facilitySelected', facility);
    
    console.log('选中设施:', facility);
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    // 将屏幕坐标转换为网格坐标
    const gridPos = this.screenToGrid(pointer.x, pointer.y);
    
    if (gridPos && this.isValidGridPosition(gridPos.x, gridPos.y)) {
      console.log('点击网格:', gridPos);
      
      // 检查是否已有设施
      const existingFacility = this.facilities.find(
        f => f.x === gridPos.x && f.y === gridPos.y
      );
      
      if (!existingFacility) {
        // 触发建设事件
        this.game.events.emit('buildRequest', gridPos);
      }
    }
  }

  update() {
    if (!this.player || !this.cursors) return;

    const speed = 2;
    let moved = false;
    let gridX = this.player.getData('gridX');
    let gridY = this.player.getData('gridY');

    // 键盘移动
    if (this.cursors.left?.isDown) {
      gridX--;
      moved = true;
    } else if (this.cursors.right?.isDown) {
      gridX++;
      moved = true;
    }

    if (this.cursors.up?.isDown) {
      gridY--;
      moved = true;
    } else if (this.cursors.down?.isDown) {
      gridY++;
      moved = true;
    }

    if (moved && this.isValidGridPosition(gridX, gridY)) {
      this.player.setData('gridX', gridX);
      this.player.setData('gridY', gridY);
      
      const isoPos = this.cartesianToIsometric(gridX, gridY);
      this.player.setPosition(isoPos.x, isoPos.y);
    }
  }

  // 坐标转换工具函数
  private cartesianToIsometric(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - y) * (TILE_WIDTH / 2) + 400,
      y: (x + y) * (TILE_HEIGHT / 2) + 100
    };
  }

  private screenToGrid(screenX: number, screenY: number): { x: number; y: number } | null {
    // 简化的屏幕到网格转换
    const offsetX = screenX - 400;
    const offsetY = screenY - 100;
    
    const gridX = Math.floor((offsetX / (TILE_WIDTH / 2) + offsetY / (TILE_HEIGHT / 2)) / 2);
    const gridY = Math.floor((offsetY / (TILE_HEIGHT / 2) - offsetX / (TILE_WIDTH / 2)) / 2);
    
    return { x: gridX, y: gridY };
  }

  private isValidGridPosition(x: number, y: number): boolean {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
  }
}

