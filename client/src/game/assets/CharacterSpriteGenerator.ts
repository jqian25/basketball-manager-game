/**
 * 角色Sprite动画生成器
 * 生成开罗风格4方向行走动画
 */

export interface CharacterConfig {
  name: string;
  bodyColor: string;
  hairColor: string;
  clothesColor: string;
  size: number;
  role: 'player' | 'coach' | 'fan' | 'npc';
}

export class CharacterSpriteGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * 生成4方向行走动画sprite sheet
   * 每个方向4帧动画
   */
  generateSpriteSheet(config: CharacterConfig): HTMLCanvasElement {
    const frameWidth = config.size;
    const frameHeight = config.size * 1.5;
    
    // 4方向 x 4帧 = 16帧
    this.canvas.width = frameWidth * 4;
    this.canvas.height = frameHeight * 4;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 下(0), 左(1), 右(2), 上(3)
    const directions = ['down', 'left', 'right', 'up'];
    
    directions.forEach((direction, dirIndex) => {
      for (let frame = 0; frame < 4; frame++) {
        const x = frame * frameWidth;
        const y = dirIndex * frameHeight;
        
        this.drawCharacterFrame(
          config,
          x,
          y,
          frameWidth,
          frameHeight,
          direction,
          frame
        );
      }
    });
    
    return this.canvas;
  }

  private drawCharacterFrame(
    config: CharacterConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    direction: string,
    frame: number
  ) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // 身体
    this.drawBody(config, centerX, centerY + 5, direction, frame);
    
    // 头部
    this.drawHead(config, centerX, centerY - 8, direction);
    
    // 腿部(行走动画)
    this.drawLegs(config, centerX, centerY + 15, direction, frame);
    
    // 手臂
    this.drawArms(config, centerX, centerY + 2, direction, frame);
    
    // 根据角色类型添加特殊元素
    this.addRoleSpecificDetails(config, centerX, centerY, direction);
  }

  private drawHead(
    config: CharacterConfig,
    x: number,
    y: number,
    direction: string
  ) {
    // 头部(圆形)
    this.ctx.fillStyle = config.bodyColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 头发
    this.ctx.fillStyle = config.hairColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y - 2, 7, Math.PI, 0, true);
    this.ctx.fill();
    
    // 眼睛
    this.ctx.fillStyle = '#000000';
    if (direction === 'down' || direction === 'up') {
      // 正面/背面 - 两只眼睛
      this.ctx.fillRect(x - 3, y, 2, 2);
      this.ctx.fillRect(x + 1, y, 2, 2);
    } else {
      // 侧面 - 一只眼睛
      const eyeX = direction === 'left' ? x - 2 : x + 2;
      this.ctx.fillRect(eyeX, y, 2, 2);
    }
  }

  private drawBody(
    config: CharacterConfig,
    x: number,
    y: number,
    direction: string,
    frame: number
  ) {
    // 身体(矩形)
    this.ctx.fillStyle = config.clothesColor;
    this.ctx.fillRect(x - 5, y, 10, 12);
    
    // 衣服细节
    this.ctx.strokeStyle = this.darkenColor(config.clothesColor, 0.2);
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - 5, y, 10, 12);
  }

  private drawLegs(
    config: CharacterConfig,
    x: number,
    y: number,
    direction: string,
    frame: number
  ) {
    const legColor = this.darkenColor(config.clothesColor, 0.3);
    this.ctx.fillStyle = legColor;
    
    // 行走动画 - 腿部摆动
    const leftLegOffset = this.getLegOffset(frame, true);
    const rightLegOffset = this.getLegOffset(frame, false);
    
    // 左腿
    this.ctx.fillRect(x - 4, y + leftLegOffset, 3, 8);
    
    // 右腿
    this.ctx.fillRect(x + 1, y + rightLegOffset, 3, 8);
  }

  private drawArms(
    config: CharacterConfig,
    x: number,
    y: number,
    direction: string,
    frame: number
  ) {
    this.ctx.fillStyle = config.bodyColor;
    
    // 手臂摆动动画
    const leftArmOffset = this.getArmOffset(frame, true);
    const rightArmOffset = this.getArmOffset(frame, false);
    
    if (direction === 'left') {
      // 左侧 - 只显示一只手臂
      this.ctx.fillRect(x - 7, y + leftArmOffset, 2, 10);
    } else if (direction === 'right') {
      // 右侧 - 只显示一只手臂
      this.ctx.fillRect(x + 5, y + rightArmOffset, 2, 10);
    } else {
      // 正面/背面 - 两只手臂
      this.ctx.fillRect(x - 7, y + leftArmOffset, 2, 10);
      this.ctx.fillRect(x + 5, y + rightArmOffset, 2, 10);
    }
  }

  private getLegOffset(frame: number, isLeft: boolean): number {
    // 行走动画 - 腿部上下摆动
    const offsets = [0, -1, 0, 1];
    const index = isLeft ? frame : (frame + 2) % 4;
    return offsets[index];
  }

  private getArmOffset(frame: number, isLeft: boolean): number {
    // 行走动画 - 手臂前后摆动
    const offsets = [0, 1, 0, -1];
    const index = isLeft ? frame : (frame + 2) % 4;
    return offsets[index];
  }

  private addRoleSpecificDetails(
    config: CharacterConfig,
    x: number,
    y: number,
    direction: string
  ) {
    switch (config.role) {
      case 'player':
        // 篮球
        this.ctx.fillStyle = '#FF6B35';
        this.ctx.beginPath();
        this.ctx.arc(x + 8, y + 10, 4, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      
      case 'coach':
        // 战术板
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - 10, y + 5, 6, 8);
        break;
      
      case 'fan':
        // 应援棒
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + 8, y - 5, 2, 10);
        break;
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

// 预定义角色配置
export const CHARACTER_PRESETS: CharacterConfig[] = [
  {
    name: '主角球员',
    bodyColor: '#FFE4C4',
    hairColor: '#8B4513',
    clothesColor: '#FF6B35',
    size: 32,
    role: 'player'
  },
  {
    name: '教练',
    bodyColor: '#FFE4C4',
    hairColor: '#696969',
    clothesColor: '#2F4F4F',
    size: 32,
    role: 'coach'
  },
  {
    name: '球迷',
    bodyColor: '#FFE4C4',
    hairColor: '#FFD700',
    clothesColor: '#4169E1',
    size: 32,
    role: 'fan'
  },
  {
    name: 'NPC市民',
    bodyColor: '#FFE4C4',
    hairColor: '#000000',
    clothesColor: '#808080',
    size: 32,
    role: 'npc'
  }
];

