/**
 * 建筑Sprite生成器
 * 使用程序化生成创建等距建筑sprite
 */

export interface BuildingConfig {
  name: string;
  width: number;
  height: number;
  floors: number;
  style: 'modern' | 'traditional' | 'sports' | 'commercial';
  primaryColor: string;
  secondaryColor: string;
  hasWindows: boolean;
  hasDoor: boolean;
  hasRoof: boolean;
}

export class BuildingSpriteGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * 生成建筑sprite
   */
  generateBuilding(config: BuildingConfig): HTMLCanvasElement {
    // 设置画布尺寸(等距2:1比例)
    this.canvas.width = config.width * 2;
    this.canvas.height = config.width + config.height;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制建筑主体
    this.drawBuildingBase(config);
    
    // 绘制楼层
    for (let floor = 0; floor < config.floors; floor++) {
      this.drawFloor(config, floor);
    }
    
    // 绘制屋顶
    if (config.hasRoof) {
      this.drawRoof(config);
    }
    
    // 绘制门
    if (config.hasDoor) {
      this.drawDoor(config);
    }
    
    // 添加细节
    this.addDetails(config);
    
    return this.canvas;
  }

  private drawBuildingBase(config: BuildingConfig) {
    const { width, height, primaryColor } = config;
    
    // 等距投影的三个面
    this.ctx.fillStyle = primaryColor;
    
    // 前面
    this.ctx.beginPath();
    this.ctx.moveTo(width, 0);
    this.ctx.lineTo(width * 2, width / 2);
    this.ctx.lineTo(width * 2, width / 2 + height);
    this.ctx.lineTo(width, height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // 左侧面(稍暗)
    this.ctx.fillStyle = this.darkenColor(primaryColor, 0.2);
    this.ctx.beginPath();
    this.ctx.moveTo(0, width / 2);
    this.ctx.lineTo(width, 0);
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, width / 2 + height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // 描边
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawFloor(config: BuildingConfig, floorIndex: number) {
    if (!config.hasWindows) return;
    
    const floorHeight = config.height / config.floors;
    const y = floorHeight * floorIndex + 10;
    
    // 绘制窗户
    const windowCount = Math.floor(config.width / 20);
    for (let i = 0; i < windowCount; i++) {
      const x = config.width + 10 + i * 20;
      this.drawWindow(x, y, 12, 12);
    }
  }

  private drawWindow(x: number, y: number, w: number, h: number) {
    // 窗框
    this.ctx.fillStyle = '#4A90E2';
    this.ctx.fillRect(x, y, w, h);
    
    // 窗格
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x + w/2, y);
    this.ctx.lineTo(x + w/2, y + h);
    this.ctx.moveTo(x, y + h/2);
    this.ctx.lineTo(x + w, y + h/2);
    this.ctx.stroke();
  }

  private drawRoof(config: BuildingConfig) {
    const { width, secondaryColor } = config;
    
    this.ctx.fillStyle = secondaryColor;
    
    // 等距屋顶
    this.ctx.beginPath();
    this.ctx.moveTo(width, -10);
    this.ctx.lineTo(width * 2, width / 2 - 10);
    this.ctx.lineTo(width * 2, width / 2);
    this.ctx.lineTo(width, 0);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawDoor(config: BuildingConfig) {
    const x = config.width + 5;
    const y = config.height - 30;
    
    // 门
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(x, y, 20, 30);
    
    // 门把手
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(x + 15, y + 15, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private addDetails(config: BuildingConfig) {
    // 根据建筑风格添加装饰
    switch (config.style) {
      case 'sports':
        this.addSportsDetails(config);
        break;
      case 'modern':
        this.addModernDetails(config);
        break;
      case 'traditional':
        this.addTraditionalDetails(config);
        break;
    }
  }

  private addSportsDetails(config: BuildingConfig) {
    // 添加篮球图标
    const x = config.width + 30;
    const y = 20;
    
    this.ctx.fillStyle = '#FF6B35';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private addModernDetails(config: BuildingConfig) {
    // 添加玻璃幕墙效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(
      config.width + 5,
      10,
      config.width - 10,
      config.height - 20
    );
  }

  private addTraditionalDetails(config: BuildingConfig) {
    // 添加传统装饰
    this.ctx.strokeStyle = '#8B4513';
    this.ctx.lineWidth = 3;
    
    // 横梁
    for (let i = 1; i < config.floors; i++) {
      const y = (config.height / config.floors) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(config.width, y);
      this.ctx.lineTo(config.width * 2, y + config.width / 2);
      this.ctx.stroke();
    }
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }
}

// 预定义的50个东京建筑配置
export const TOKYO_BUILDINGS: BuildingConfig[] = [
  {
    name: '涩谷商业大楼',
    width: 80,
    height: 120,
    floors: 6,
    style: 'modern',
    primaryColor: '#E8E8E8',
    secondaryColor: '#4A4A4A',
    hasWindows: true,
    hasDoor: true,
    hasRoof: false
  },
  {
    name: '新宿居酒屋',
    width: 60,
    height: 80,
    floors: 3,
    style: 'traditional',
    primaryColor: '#D4A574',
    secondaryColor: '#8B4513',
    hasWindows: true,
    hasDoor: true,
    hasRoof: true
  },
  {
    name: '篮球训练馆',
    width: 100,
    height: 80,
    floors: 2,
    style: 'sports',
    primaryColor: '#FF6B35',
    secondaryColor: '#004E89',
    hasWindows: true,
    hasDoor: true,
    hasRoof: true
  },
  // ... 继续添加其他47个建筑配置
];

