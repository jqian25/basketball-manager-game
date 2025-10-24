/**
 * 游戏全局状态管理
 * 管理玩家数据、队伍、背包、进度等
 */

export interface PlayerData {
  name: string;
  money: number;
  x: number;
  y: number;
  scene: string;
  team: TeamMember[];
  inventory: InventoryItem[];
  badges: string[];
  progress: GameProgress;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  skills: string[];
  equipment?: Equipment;
}

export interface Equipment {
  shoes?: Item;
  jersey?: Item;
  accessory?: Item;
}

export interface Item {
  id: string;
  name: string;
  type: 'shoes' | 'jersey' | 'accessory' | 'consumable';
  price: number;
  effect: {
    attack?: number;
    defense?: number;
    speed?: number;
    hp?: number;
  };
  description: string;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
}

export interface GameProgress {
  defeatedDojos: string[];
  completedQuests: string[];
  unlockedAreas: string[];
}

export class GameState {
  private static instance: GameState;
  private playerData: PlayerData;

  private constructor() {
    // 初始化玩家数据
    this.playerData = this.loadPlayerData() || this.createNewPlayer();
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  private createNewPlayer(): PlayerData {
    return {
      name: '新手训练师',
      money: 1000,
      x: 400,
      y: 300,
      scene: 'town',
      team: [
        {
          id: 'starter_1',
          name: '小明',
          position: 'PG',
          level: 5,
          hp: 50,
          maxHp: 50,
          attack: 12,
          defense: 8,
          speed: 15,
          skills: ['快速突破', '三分投篮']
        }
      ],
      inventory: [
        {
          item: {
            id: 'potion',
            name: '体力药水',
            type: 'consumable',
            price: 50,
            effect: { hp: 20 },
            description: '恢复20点HP'
          },
          quantity: 3
        }
      ],
      badges: [],
      progress: {
        defeatedDojos: [],
        completedQuests: [],
        unlockedAreas: ['town']
      }
    };
  }

  // 保存玩家数据
  savePlayerData(): void {
    try {
      localStorage.setItem('pixelRPG_playerData', JSON.stringify(this.playerData));
    } catch (error) {
      console.error('Failed to save player data:', error);
    }
  }

  // 加载玩家数据
  private loadPlayerData(): PlayerData | null {
    try {
      const data = localStorage.getItem('pixelRPG_playerData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load player data:', error);
      return null;
    }
  }

  // 获取玩家数据
  getPlayerData(): PlayerData {
    return this.playerData;
  }

  // 更新玩家位置
  updatePosition(x: number, y: number, scene: string): void {
    this.playerData.x = x;
    this.playerData.y = y;
    this.playerData.scene = scene;
    this.savePlayerData();
  }

  // 添加金币
  addMoney(amount: number): void {
    this.playerData.money += amount;
    this.savePlayerData();
  }

  // 扣除金币
  spendMoney(amount: number): boolean {
    if (this.playerData.money >= amount) {
      this.playerData.money -= amount;
      this.savePlayerData();
      return true;
    }
    return false;
  }

  // 添加队员
  addTeamMember(member: TeamMember): boolean {
    if (this.playerData.team.length < 6) {
      this.playerData.team.push(member);
      this.savePlayerData();
      return true;
    }
    return false;
  }

  // 移除队员
  removeTeamMember(id: string): void {
    this.playerData.team = this.playerData.team.filter(m => m.id !== id);
    this.savePlayerData();
  }

  // 添加物品
  addItem(item: Item, quantity: number = 1): void {
    const existing = this.playerData.inventory.find(i => i.item.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.playerData.inventory.push({ item, quantity });
    }
    this.savePlayerData();
  }

  // 使用物品
  useItem(itemId: string, targetId: string): boolean {
    const invItem = this.playerData.inventory.find(i => i.item.id === itemId);
    if (!invItem || invItem.quantity <= 0) return false;

    const target = this.playerData.team.find(m => m.id === targetId);
    if (!target) return false;

    // 应用物品效果
    if (invItem.item.effect.hp) {
      target.hp = Math.min(target.maxHp, target.hp + invItem.item.effect.hp);
    }

    invItem.quantity--;
    if (invItem.quantity <= 0) {
      this.playerData.inventory = this.playerData.inventory.filter(i => i.item.id !== itemId);
    }

    this.savePlayerData();
    return true;
  }

  // 装备物品
  equipItem(memberId: string, item: Item): void {
    const member = this.playerData.team.find(m => m.id === memberId);
    if (!member) return;

    if (!member.equipment) {
      member.equipment = {};
    }

    // 装备物品
    if (item.type === 'shoes') {
      member.equipment.shoes = item;
      member.speed += item.effect.speed || 0;
    } else if (item.type === 'jersey') {
      member.equipment.jersey = item;
      member.defense += item.effect.defense || 0;
    } else if (item.type === 'accessory') {
      member.equipment.accessory = item;
      member.attack += item.effect.attack || 0;
    }

    this.savePlayerData();
  }

  // 击败道场
  defeatDojo(dojoId: string): void {
    if (!this.playerData.progress.defeatedDojos.includes(dojoId)) {
      this.playerData.progress.defeatedDojos.push(dojoId);
      this.savePlayerData();
    }
  }

  // 解锁区域
  unlockArea(areaId: string): void {
    if (!this.playerData.progress.unlockedAreas.includes(areaId)) {
      this.playerData.progress.unlockedAreas.push(areaId);
      this.savePlayerData();
    }
  }

  // 重置游戏
  resetGame(): void {
    this.playerData = this.createNewPlayer();
    this.savePlayerData();
  }
}

