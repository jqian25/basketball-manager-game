/**
 * 街道装饰元素生成器
 * 生成树木、路灯、车辆、标志牌等
 */

export class StreetElementsGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * 生成树木sprite
   */
  generateTree(type: 'cherry' | 'pine' | 'maple'): HTMLCanvasElement {
    this.canvas.width = 40;
    this.canvas.height = 60;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 树干
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(16, 40, 8, 20);
    
    // 树冠
    switch (type) {
      case 'cherry':
        this.drawCherryTreeCanopy();
        break;
      case 'pine':
        this.drawPineTreeCanopy();
        break;
      case 'maple':
        this.drawMapleTreeCanopy();
        break;
    }
    
    return this.canvas;
  }

  private drawCherryTreeCanopy() {
    // 粉色樱花树冠
    this.ctx.fillStyle = '#FFB7C5';
    this.ctx.beginPath();
    this.ctx.arc(20, 25, 15, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 花朵细节
    this.ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const x = 20 + Math.cos(angle) * 10;
      const y = 25 + Math.sin(angle) * 10;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawPineTreeCanopy() {
    // 绿色松树
    this.ctx.fillStyle = '#228B22';
    
    // 三层三角形
    for (let i = 0; i < 3; i++) {
      const y = 15 + i * 10;
      const size = 12 + i * 2;
      
      this.ctx.beginPath();
      this.ctx.moveTo(20, y);
      this.ctx.lineTo(20 - size, y + 15);
      this.ctx.lineTo(20 + size, y + 15);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  private drawMapleTreeCanopy() {
    // 红色枫树
    this.ctx.fillStyle = '#FF4500';
    
    // 不规则树冠
    this.ctx.beginPath();
    this.ctx.arc(15, 20, 10, 0, Math.PI * 2);
    this.ctx.arc(25, 20, 10, 0, Math.PI * 2);
    this.ctx.arc(20, 30, 12, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 生成路灯sprite
   */
  generateStreetLight(): HTMLCanvasElement {
    this.canvas.width = 30;
    this.canvas.height = 80;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 灯柱
    this.ctx.fillStyle = '#696969';
    this.ctx.fillRect(13, 20, 4, 60);
    
    // 灯罩
    this.ctx.fillStyle = '#2F4F4F';
    this.ctx.beginPath();
    this.ctx.arc(15, 15, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 灯光(发光效果)
    this.ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(15, 15, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 底座
    this.ctx.fillStyle = '#4A4A4A';
    this.ctx.fillRect(10, 75, 10, 5);
    
    return this.canvas;
  }

  /**
   * 生成汽车sprite(等距视角)
   */
  generateCar(color: string): HTMLCanvasElement {
    this.canvas.width = 60;
    this.canvas.height = 40;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 车身主体(等距)
    this.ctx.fillStyle = color;
    
    // 前面
    this.ctx.beginPath();
    this.ctx.moveTo(30, 10);
    this.ctx.lineTo(50, 20);
    this.ctx.lineTo(50, 30);
    this.ctx.lineTo(30, 35);
    this.ctx.closePath();
    this.ctx.fill();
    
    // 侧面(稍暗)
    this.ctx.fillStyle = this.darkenColor(color, 0.2);
    this.ctx.beginPath();
    this.ctx.moveTo(10, 20);
    this.ctx.lineTo(30, 10);
    this.ctx.lineTo(30, 35);
    this.ctx.lineTo(10, 30);
    this.ctx.closePath();
    this.ctx.fill();
    
    // 车窗
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(20, 15, 20, 8);
    
    // 车轮
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(18, 32, 4, 0, Math.PI * 2);
    this.ctx.arc(42, 28, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    return this.canvas;
  }

  /**
   * 生成篮球架sprite
   */
  generateBasketballHoop(): HTMLCanvasElement {
    this.canvas.width = 50;
    this.canvas.height = 100;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 支柱
    this.ctx.fillStyle = '#C0C0C0';
    this.ctx.fillRect(22, 30, 6, 70);
    
    // 底座
    this.ctx.fillStyle = '#808080';
    this.ctx.fillRect(15, 95, 20, 5);
    
    // 篮板
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(10, 20, 30, 25);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(15, 28, 20, 12);
    
    // 篮筐
    this.ctx.strokeStyle = '#FF6347';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(25, 45, 8, 0, Math.PI);
    this.ctx.stroke();
    
    // 篮网
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const x = 17 + i * 4;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 45);
      this.ctx.lineTo(x, 55);
      this.ctx.stroke();
    }
    
    return this.canvas;
  }

  /**
   * 生成标志牌sprite
   */
  generateSignBoard(text: string, color: string): HTMLCanvasElement {
    this.canvas.width = 80;
    this.canvas.height = 60;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 支柱
    this.ctx.fillStyle = '#696969';
    this.ctx.fillRect(38, 35, 4, 25);
    
    // 标志牌
    this.ctx.fillStyle = color;
    this.ctx.fillRect(10, 10, 60, 30);
    
    // 边框
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(10, 10, 60, 30);
    
    // 文字
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, 40, 28);
    
    return this.canvas;
  }

  /**
   * 生成长椅sprite
   */
  generateBench(): HTMLCanvasElement {
    this.canvas.width = 60;
    this.canvas.height = 40;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 座位
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(10, 15, 40, 8);
    
    // 靠背
    this.ctx.fillRect(10, 8, 40, 3);
    
    // 腿
    this.ctx.fillRect(12, 23, 3, 12);
    this.ctx.fillRect(25, 23, 3, 12);
    this.ctx.fillRect(38, 23, 3, 12);
    this.ctx.fillRect(45, 23, 3, 12);
    
    // 支撑杆
    this.ctx.fillRect(12, 11, 3, 12);
    this.ctx.fillRect(45, 11, 3, 12);
    
    return this.canvas;
  }

  /**
   * 生成垃圾桶sprite
   */
  generateTrashCan(): HTMLCanvasElement {
    this.canvas.width = 30;
    this.canvas.height = 40;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 桶身
    this.ctx.fillStyle = '#4169E1';
    this.ctx.fillRect(8, 15, 14, 20);
    
    // 桶盖
    this.ctx.fillStyle = '#1E90FF';
    this.ctx.fillRect(6, 12, 18, 4);
    
    // 回收标志
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('♻', 15, 28);
    
    return this.canvas;
  }

  /**
   * 生成自动售货机sprite
   */
  generateVendingMachine(): HTMLCanvasElement {
    this.canvas.width = 50;
    this.canvas.height = 80;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 机身
    this.ctx.fillStyle = '#FF6347';
    this.ctx.fillRect(10, 10, 30, 65);
    
    // 显示窗口
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(15, 15, 20, 15);
    
    // 商品格子
    const colors = ['#FFD700', '#4169E1', '#32CD32', '#FF69B4'];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        this.ctx.fillStyle = colors[(i + j) % 4];
        this.ctx.fillRect(15 + j * 10, 35 + i * 8, 8, 6);
      }
    }
    
    // 投币口
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(20, 68, 10, 3);
    
    return this.canvas;
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }
}

