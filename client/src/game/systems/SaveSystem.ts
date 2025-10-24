// client/src/game/systems/SaveSystem.ts

import Phaser from 'phaser';

/**
 * @interface GameData
 * @description 游戏存档数据的接口定义。
 * 模拟宝可梦Game Boy风格的最小化核心数据。
 */
export interface GameData {
    /** 玩家名称 */
    playerName: string;
    /** 游戏时间（秒） */
    playTime: number;
    /** 徽章数量 */
    badges: number;
    /** 宝可梦数量 */
    pokedexCount: number;
    /** 玩家当前位置（场景名或坐标） */
    currentLocation: string;
    /** 存档时间戳 */
    saveTimestamp: number;
    /** 其他自定义数据 */
    [key: string]: any;
}

/**
 * @interface SaveSlot
 * @description 单个存档位的结构，包含元数据和游戏数据。
 */
export interface SaveSlot {
    /** 存档位的唯一标识符 */
    slotId: number;
    /** 存档的创建/更新时间 */
    timestamp: number;
    /** 存档的简要信息（用于UI显示） */
    summary: string;
    /** 实际的游戏数据 */
    data: GameData;
}

/**
 * @class SaveSystem
 * @description 游戏存档和加载系统。
 * 使用localStorage进行数据持久化，模拟Game Boy的存档机制。
 * 遵循单例模式，确保全局只有一个存档系统实例。
 */
export class SaveSystem {
    private static instance: SaveSystem;
    /** localStorage中存储所有存档的主键 */
    private static readonly STORAGE_KEY = 'pokemon_gb_saves';
    /** 默认支持的存档位数量 */
    private static readonly MAX_SLOTS = 3;

    /**
     * 私有构造函数，防止外部直接实例化。
     */
    private constructor() {
        console.log('SaveSystem initialized.');
    }

    /**
     * 获取SaveSystem的单例实例。
     * @returns SaveSystem实例
     */
    public static getInstance(): SaveSystem {
        if (!SaveSystem.instance) {
            SaveSystem.instance = new SaveSystem();
        }
        return SaveSystem.instance;
    }

    /**
     * @method getSaveSlots
     * @description 从localStorage加载所有存档位的数据。
     * @returns 包含所有存档位的数组，如果无数据则返回空数组。
     */
    public getSaveSlots(): SaveSlot[] {
        try {
            const rawData = localStorage.getItem(SaveSystem.STORAGE_KEY);
            if (rawData) {
                const saves = JSON.parse(rawData) as SaveSlot[];
                // 确保返回的是一个数组，并且处理可能的数据损坏
                if (Array.isArray(saves)) {
                    return saves;
                }
            }
        } catch (error) {
            console.error('Failed to load save data from localStorage:', error);
        }
        // 初始化空存档位
        return this.initializeEmptySlots();
    }

    /**
     * @method initializeEmptySlots
     * @description 创建MAX_SLOTS个空的存档位。
     * @returns 空存档位数组。
     */
    private initializeEmptySlots(): SaveSlot[] {
        const slots: SaveSlot[] = [];
        for (let i = 1; i <= SaveSystem.MAX_SLOTS; i++) {
            slots.push({
                slotId: i,
                timestamp: 0, // 0表示未使用的存档
                summary: '--- 空存档位 ---',
                data: this.createEmptyGameData()
            });
        }
        return slots;
    }

    /**
     * @method createEmptyGameData
     * @description 创建一个默认的空游戏数据对象。
     * @returns GameData对象
     */
    public createEmptyGameData(): GameData {
        return {
            playerName: 'RED',
            playTime: 0,
            badges: 0,
            pokedexCount: 0,
            currentLocation: 'Pallet Town',
            saveTimestamp: 0,
            // 模拟一些Game Boy风格的默认值
            money: 3000,
            items: []
        };
    }

    /**
     * @method saveGame
     * @description 将当前游戏数据保存到指定的存档位。
     * @param slotId 要保存的存档位ID (1, 2, 3...)
     * @param gameData 当前的游戏数据
     * @returns 是否保存成功
     */
    public saveGame(slotId: number, gameData: GameData): boolean {
        if (slotId < 1 || slotId > SaveSystem.MAX_SLOTS) {
            console.error(`Invalid slotId: ${slotId}. Must be between 1 and ${SaveSystem.MAX_SLOTS}.`);
            return false;
        }

        try {
            const allSlots = this.getSaveSlots();
            const slotIndex = slotId - 1;
            const now = Date.now();

            // 更新游戏数据中的时间戳
            gameData.saveTimestamp = now;

            const newSlot: SaveSlot = {
                slotId: slotId,
                timestamp: now,
                summary: this.generateSummary(gameData),
                data: gameData
            };

            // 替换或更新对应的存档位
            allSlots[slotIndex] = newSlot;

            // 写入localStorage
            localStorage.setItem(SaveSystem.STORAGE_KEY, JSON.stringify(allSlots));
            console.log(`Game successfully saved to Slot ${slotId}.`);
            return true;
        } catch (error) {
            console.error(`Failed to save game to Slot ${slotId}:`, error);
            return false;
        }
    }

    /**
     * @method loadGame
     * @description 从指定的存档位加载游戏数据。
     * @param slotId 要加载的存档位ID
     * @returns 存档位数据，如果存档位为空或加载失败，则返回null。
     */
    public loadGame(slotId: number): GameData | null {
        if (slotId < 1 || slotId > SaveSystem.MAX_SLOTS) {
            console.error(`Invalid slotId: ${slotId}. Must be between 1 and ${SaveSystem.MAX_SLOTS}.`);
            return null;
        }

        const allSlots = this.getSaveSlots();
        const slot = allSlots[slotId - 1];

        // 检查存档位是否有效（timestamp > 0 表示已保存过）
        if (slot && slot.timestamp > 0) {
            console.log(`Game successfully loaded from Slot ${slotId}.`);
            return slot.data;
        } else {
            console.warn(`Attempted to load from empty or invalid Slot ${slotId}.`);
            return null;
        }
    }

    /**
     * @method deleteSave
     * @description 删除指定的存档位数据，将其重置为空。
     * @param slotId 要删除的存档位ID
     * @returns 是否删除成功
     */
    public deleteSave(slotId: number): boolean {
        if (slotId < 1 || slotId > SaveSystem.MAX_SLOTS) {
            console.error(`Invalid slotId: ${slotId}. Must be between 1 and ${SaveSystem.MAX_SLOTS}.`);
            return false;
        }

        try {
            const allSlots = this.getSaveSlots();
            const slotIndex = slotId - 1;

            // 重置为初始空存档状态
            allSlots[slotIndex] = {
                slotId: slotId,
                timestamp: 0,
                summary: '--- 空存档位 ---',
                data: this.createEmptyGameData()
            };

            // 写入localStorage
            localStorage.setItem(SaveSystem.STORAGE_KEY, JSON.stringify(allSlots));
            console.log(`Save data for Slot ${slotId} successfully deleted.`);
            return true;
        } catch (error) {
            console.error(`Failed to delete save data for Slot ${slotId}:`, error);
            return false;
        }
    }

    /**
     * @method generateSummary
     * @description 根据游戏数据生成一个Game Boy风格的简短摘要，用于UI显示。
     * @param data 游戏数据
     * @returns 摘要字符串
     */
    private generateSummary(data: GameData): string {
        const date = new Date(data.saveTimestamp);
        // 格式化时间为 HH:MM
        const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        // 限制地点长度以符合GB屏幕显示
        const location = data.currentLocation.substring(0, 15); 
        const playtimeHours = Math.floor(data.playTime / 3600);
        const playtimeMinutes = Math.floor((data.playTime % 3600) / 60);

        // 格式: 玩家名 @ 地点 | 徽章:X | 时间:H:M (模拟GB风格的紧凑显示)
        return `${data.playerName} @ ${location}\nBadges: ${data.badges} | Time: ${playtimeHours}h ${playtimeMinutes}m`;
    }

    /**
     * @method formatPlayTime
     * @description 将秒数转换为Game Boy风格的时:分:秒格式字符串。
     * @param totalSeconds 总秒数
     * @returns 格式化后的时间字符串 (HH:MM:SS)
     */
    public formatPlayTime(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * @method isSlotUsed
     * @description 检查指定的存档位是否已被使用。
     * @param slotId 存档位ID
     * @returns 如果已使用则返回true，否则返回false。
     */
    public isSlotUsed(slotId: number): boolean {
        const allSlots = this.getSaveSlots();
        const slot = allSlots[slotId - 1];
        return slot && slot.timestamp > 0;
    }

    /**
     * @method getSlotSummary
     * @description 获取指定存档位的摘要信息。
     * @param slotId 存档位ID
     * @returns 摘要字符串，如果存档位不存在则返回null。
     */
    public getSlotSummary(slotId: number): string | null {
        const allSlots = this.getSaveSlots();
        const slot = allSlots[slotId - 1];
        return slot ? slot.summary : null;
    }

    /**
     * @method clearAllSaves
     * @description ⚠️ 危险操作：清除所有存档数据。仅用于开发或重置。
     */
    public clearAllSaves(): void {
        localStorage.removeItem(SaveSystem.STORAGE_KEY);
        console.warn('All save data has been cleared from localStorage.');
    }
}

// ----------------------------------------------------------------------
// 示例：如何集成到Phaser 3 Scene中 (此部分仅为示例，不应包含在最终的SaveSystem.ts文件中)
// ----------------------------------------------------------------------
/*
class ExampleScene extends Phaser.Scene {
    private saveSystem: SaveSystem;
    private currentData: GameData;
    private playTimer: number = 0;

    constructor() {
        super('ExampleScene');
        this.saveSystem = SaveSystem.getInstance();
        this.currentData = this.saveSystem.createEmptyGameData();
    }

    create() {
        // 尝试加载第一个存档位
        const loadedData = this.saveSystem.loadGame(1);
        if (loadedData) {
            this.currentData = loadedData;
            this.playTimer = this.currentData.playTime;
            console.log('Game loaded. Welcome back, ' + this.currentData.playerName);
        } else {
            console.log('No save found. Starting new game.');
            this.currentData.playerName = 'ASH'; // 默认新玩家名
        }

        // 模拟游戏时间流逝
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.playTimer++;
                this.currentData.playTime = this.playTimer;
            },
            loop: true
        });

        // 模拟保存操作 (按 S 键)
        this.input.keyboard.on('keydown-S', () => {
            // 模拟更新数据
            this.currentData.badges = Math.floor(Math.random() * 8); 
            this.currentData.currentLocation = 'Viridian City';
            this.saveSystem.saveGame(1, this.currentData);
        });

        // 模拟加载操作 (按 L 键)
        this.input.keyboard.on('keydown-L', () => {
            const data = this.saveSystem.loadGame(1);
            if (data) {
                this.currentData = data;
                this.playTimer = data.playTime;
                console.log('Loaded PlayTime:', this.saveSystem.formatPlayTime(this.currentData.playTime));
            }
        });

        // 模拟删除操作 (按 D 键)
        this.input.keyboard.on('keydown-D', () => {
            this.saveSystem.deleteSave(1);
        });

        // 显示存档列表摘要
        const slots = this.saveSystem.getSaveSlots();
        slots.forEach(slot => {
            console.log(`Slot ${slot.slotId}: ${slot.summary}`);
        });
    }
}
*/