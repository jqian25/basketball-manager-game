/**
 * 玩家移动控制器
 * 处理玩家输入、移动、碰撞检测
 */

import type { PlayerCharacter, InputState, GameMap, CollisionBox } from "../../types/openWorld";

export class PlayerController {
  private player: PlayerCharacter;
  private inputState: InputState;
  private currentMap: GameMap | null = null;

  constructor(player: PlayerCharacter) {
    this.player = player;
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false,
      run: false,
      menu: false
    };
  }

  /**
   * 设置当前地图
   */
  setCurrentMap(map: GameMap) {
    this.currentMap = map;
  }

  /**
   * 更新输入状态
   */
  updateInput(input: Partial<InputState>) {
    Object.assign(this.inputState, input);
  }

  /**
   * 更新玩家状态（每帧调用）
   */
  update(deltaTime: number) {
    if (!this.currentMap) return;

    // 计算移动方向
    let dx = 0;
    let dy = 0;

    if (this.inputState.up) dy -= 1;
    if (this.inputState.down) dy += 1;
    if (this.inputState.left) dx -= 1;
    if (this.inputState.right) dx += 1;

    // 归一化对角线移动
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707; // 1/√2
      dy *= 0.707;
    }

    // 计算速度（奔跑时加速）
    const speed = this.inputState.run ? this.player.speed * 1.5 : this.player.speed;

    // 计算新位置
    const newX = this.player.x + dx * speed * deltaTime;
    const newY = this.player.y + dy * speed * deltaTime;

    // 碰撞检测
    if (this.canMoveTo(newX, newY)) {
      this.player.x = newX;
      this.player.y = newY;

      // 更新方向
      if (dx < 0) this.player.direction = "left";
      else if (dx > 0) this.player.direction = "right";
      else if (dy < 0) this.player.direction = "up";
      else if (dy > 0) this.player.direction = "down";

      // 更新动画状态
      if (dx !== 0 || dy !== 0) {
        this.player.currentAnimation = this.inputState.run ? "running" : "walking";
      } else {
        this.player.currentAnimation = "idle";
      }
    }
  }

  /**
   * 检查是否可以移动到指定位置
   */
  private canMoveTo(x: number, y: number): boolean {
    if (!this.currentMap) return false;

    const playerBox: CollisionBox = {
      x: x,
      y: y,
      width: 0.8, // 玩家碰撞箱宽度（格子单位）
      height: 0.8
    };

    // 检查地图边界
    if (x < 0 || y < 0 || 
        x >= this.currentMap.metadata.width || 
        y >= this.currentMap.metadata.height) {
      return false;
    }

    // 检查瓦片碰撞
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    
    if (tileX >= 0 && tileX < this.currentMap.tiles[0].length &&
        tileY >= 0 && tileY < this.currentMap.tiles.length) {
      const tile = this.currentMap.tiles[tileY][tileX];
      if (!tile.walkable) {
        return false;
      }
    }

    // 检查与地图对象的碰撞
    for (const obj of this.currentMap.objects) {
      if (this.checkCollision(playerBox, {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height
      })) {
        return false;
      }
    }

    return true;
  }

  /**
   * AABB碰撞检测
   */
  private checkCollision(box1: CollisionBox, box2: CollisionBox): boolean {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  }

  /**
   * 获取玩家当前位置
   */
  getPosition(): { x: number; y: number } {
    return { x: this.player.x, y: this.player.y };
  }

  /**
   * 获取玩家朝向
   */
  getDirection(): string {
    return this.player.direction;
  }

  /**
   * 获取玩家动画状态
   */
  getAnimationState(): string {
    return this.player.currentAnimation;
  }

  /**
   * 传送玩家到指定位置
   */
  teleport(x: number, y: number) {
    this.player.x = x;
    this.player.y = y;
  }

  /**
   * 获取玩家数据
   */
  getPlayer(): PlayerCharacter {
    return this.player;
  }
}

