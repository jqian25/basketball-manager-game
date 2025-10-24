// client/src/game/systems/MarketSystem.ts

import Phaser from 'phaser';

/**
 * @interface IEquipment
 * @description 装备接口，定义了商店中可售卖的装备的基本属性。
 * Game Boy风格的装备属性通常比较简单。
 */
interface IEquipment {
    /** 装备的唯一ID */
    id: number;
    /** 装备的名称 */
    name: string;
    /** 装备的描述 */
    description: string;
    /** 装备的售价（货币单位，例如金币） */
    price: number;
    /** 装备的攻击力加成 */
    attack: number;
    /** 装备的防御力加成 */
    defense: number;
}

/**
 * @interface IPlayerInventory
 * @description 玩家背包和货币接口，用于MarketSystem与其交互。
 */
interface IPlayerInventory {
    /** 玩家当前的货币数量 */
    gold: number;
    /** 玩家已拥有的装备列表 */
    equipment: IEquipment[];

    /**
     * @method addGold
     * @description 增加玩家货币。
     * @param amount 增加的数量
     */
    addGold(amount: number): void;

    /**
     * @method removeGold
     * @description 减少玩家货币。
     * @param amount 减少的数量
     * @returns boolean 是否成功减少（即玩家货币充足）
     */
    removeGold(amount: number): boolean;

    /**
     * @method addEquipment
     * @description 将装备添加到玩家背包。
     * @param equipment 要添加的装备对象
     */
    addEquipment(equipment: IEquipment): void;
}

/**
 * @class MarketSystem
 * @description 商店系统，负责处理装备的展示、购买逻辑和与玩家背包的交互。
 * 遵循Game Boy风格，强调简洁的逻辑和反馈。
 */
export class MarketSystem {
    /** 商店中当前出售的装备列表 */
    private marketItems: IEquipment[] = [];
    /** 玩家背包和货币管理器的引用 */
    private inventory: IPlayerInventory;
    /** Phaser场景的引用，用于触发事件或显示UI */
    private scene: Phaser.Scene;

    /**
     * @constructor
     * @param scene Phaser场景实例
     * @param inventory 玩家背包/货币管理器实例
     */
    constructor(scene: Phaser.Scene, inventory: IPlayerInventory) {
        this.scene = scene;
        this.inventory = inventory;
        this.initializeMarketItems();
        console.log("MarketSystem: 商店系统已初始化。");
    }

    /**
     * @private
     * @method initializeMarketItems
     * @description 初始化商店出售的装备列表。
     * 模拟Game Boy时代简单的装备数据。
     */
    private initializeMarketItems(): void {
        this.marketItems = [
            { id: 101, name: "木剑", description: "一把普通的木剑，聊胜于无。", price: 50, attack: 5, defense: 0 },
            { id: 102, name: "皮甲", description: "轻便的皮质护甲。", price: 80, attack: 0, defense: 3 },
            { id: 201, name: "铁剑", description: "生锈的铁剑，威力尚可。", price: 200, attack: 12, defense: 0 },
            { id: 202, name: "铁盾", description: "坚固的铁盾，提供可靠的防御。", price: 350, attack: 0, defense: 8 },
        ];
        console.log(`MarketSystem: 商店加载了 ${this.marketItems.length} 件商品。`);
    }

    /**
     * @method getMarketItems
     * @description 获取商店中当前出售的装备列表。
     * @returns IEquipment[] 装备列表
     */
    public getMarketItems(): IEquipment[] {
        return this.marketItems;
    }

    /**
     * @method buyEquipment
     * @description 尝试购买指定的装备。
     * @param equipmentId 尝试购买的装备ID
     * @returns boolean 购买是否成功
     */
    public buyEquipment(equipmentId: number): boolean {
        const itemToBuy = this.marketItems.find(item => item.id === equipmentId);

        // 1. 检查商品是否存在
        if (!itemToBuy) {
            this.displayMessage("MarketSystem: 错误！商品不存在。");
            return false;
        }

        // 2. 检查玩家货币是否充足
        if (this.inventory.gold < itemToBuy.price) {
            // Game Boy风格：简洁的失败提示
            this.displayMessage("MarketSystem: 你的金币不足。");
            return false;
        }

        // 3. 执行购买逻辑
        // 3.1 扣除货币
        const success = this.inventory.removeGold(itemToBuy.price);
        
        if (success) {
            // 3.2 添加装备到背包
            this.inventory.addEquipment(itemToBuy);
            
            // 3.3 购买成功反馈
            this.displayMessage(`MarketSystem: 成功购买 ${itemToBuy.name}！`);
            
            // 3.4 触发Phaser事件，通知UI更新（例如更新金币显示）
            this.scene.events.emit('market:purchase_success', itemToBuy);
            
            return true;
        } else {
            // 理论上不会走到这里，但作为安全措施
            this.displayMessage("MarketSystem: 购买失败，未知错误。");
            return false;
        }
    }

    /**
     * @private
     * @method displayMessage
     * @description 模拟Game Boy风格的文本框消息显示。
     * 在实际游戏中，这会调用一个UI管理器来显示一个简单的文本框。
     * @param message 要显示的消息内容
     */
    private displayMessage(message: string): void {
        // 实际的Game Boy风格实现会在这里创建一个简单的文本框UI
        // 例如：使用Phaser的BitmapText或简单的Text对象，背景是黑白或绿黑
        console.log(`[GB-Style Message] ${message}`);
        
        // 可以在这里触发一个场景事件，让UI层来处理显示
        this.scene.events.emit('market:message', message);
    }
}

// --- 示例用法 (Example Usage) ---

/**
 * @class MockPlayerInventory
 * @description 模拟的玩家背包和货币系统，用于MarketSystem的测试。
 */
class MockPlayerInventory implements IPlayerInventory {
    public gold: number = 500;
    public equipment: IEquipment[] = [];

    addGold(amount: number): void {
        this.gold += amount;
        console.log(`[Inventory] 获得 ${amount} 金币。当前金币: ${this.gold}`);
    }

    removeGold(amount: number): boolean {
        if (this.gold >= amount) {
            this.gold -= amount;
            console.log(`[Inventory] 消耗 ${amount} 金币。当前金币: ${this.gold}`);
            return true;
        }
        return false;
    }

    addEquipment(equipment: IEquipment): void {
        this.equipment.push(equipment);
        console.log(`[Inventory] 获得装备: ${equipment.name}。背包数量: ${this.equipment.length}`);
    }
}

/**
 * @class MarketScene
 * @description 模拟Phaser场景，展示MarketSystem的集成和使用。
 * 这是一个完整的、可运行的Phaser 3场景示例。
 */
class MarketScene extends Phaser.Scene {
    private marketSystem!: MarketSystem;
    private inventory!: MockPlayerInventory;
    private goldText!: Phaser.GameObjects.Text;
    private messageText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MarketScene' });
    }

    preload() {
        // 预加载Game Boy风格的字体或图集
        // 实际项目中需要加载资源，这里仅模拟
        this.load.bitmapFont('gb_font', 'assets/fonts/gb.png', 'assets/fonts/gb.xml');
    }

    create() {
        // 1. 初始化玩家背包
        this.inventory = new MockPlayerInventory();

        // 2. 初始化商店系统
        this.marketSystem = new MarketSystem(this, this.inventory);

        // 3. Game Boy风格 UI 元素 (模拟)
        const style = { fontFamily: 'gb_font', fontSize: '16px', color: '#000000', backgroundColor: '#FFFFFF', padding: { x: 5, y: 5 } };
        
        // 模拟Game Boy的黑白/绿黑配色
        this.cameras.main.setBackgroundColor('#C6C6C6'); // 浅灰色背景

        // 金币显示
        this.goldText = this.add.text(10, 10, `金币: ${this.inventory.gold}`, style).setOrigin(0);

        // 消息框 (Game Boy风格)
        this.messageText = this.add.text(10, 50, '欢迎来到商店!', style).setOrigin(0);
        
        // 监听系统消息事件
        this.events.on('market:message', (message: string) => {
            this.messageText.setText(message);
        });
        
        // 监听购买成功事件
        this.events.on('market:purchase_success', (item: IEquipment) => {
            this.goldText.setText(`金币: ${this.inventory.gold}`);
            // 可以在这里更新商店列表UI
        });

        // 4. 模拟商店列表和购买按钮 (Game Boy风格的简单文本菜单)
        let yOffset = 100;
        const items = this.marketSystem.getMarketItems();
        
        this.add.text(10, yOffset, "--- 商店商品 ---", style);
        yOffset += 30;

        items.forEach((item, index) => {
            const itemText = this.add.text(10, yOffset, 
                `${index + 1}. ${item.name} (${item.price}G) - 攻:${item.attack} 防:${item.defense}`, 
                style
            ).setInteractive({ useHandCursor: true });
            
            itemText.on('pointerdown', () => {
                this.handlePurchase(item.id);
            });

            yOffset += 25;
        });
        
        this.add.text(10, yOffset + 20, "点击商品名称进行购买。", {...style, fontSize: '12px'});
    }

    /**
     * @private
     * @method handlePurchase
     * @description 处理UI点击后的购买逻辑。
     * @param id 装备ID
     */
    private handlePurchase(id: number): void {
        console.log(`尝试购买 ID: ${id}`);
        this.marketSystem.buyEquipment(id);
    }
}

// 完整的Phaser配置，用于测试
// const config: Phaser.Types.Core.GameConfig = {
//     type: Phaser.AUTO,
//     width: 480, // 模拟Game Boy屏幕宽度
//     height: 320, // 模拟Game Boy屏幕高度
//     scene: MarketScene,
//     parent: 'game-container', // 假设HTML中有一个ID为'game-container'的元素
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 0 }
//         }
//     }
// };

// new Phaser.Game(config);

// 最终输出只包含MarketSystem及其依赖的接口，以及示例类（MarketScene和MockPlayerInventory）
// 确保MarketSystem是默认导出的主要部分。

// 为了符合文件要求，我们只保留MarketSystem及其接口，并将MarketScene和MockPlayerInventory作为示例放在注释中或作为内部类。
// 由于要求是 "client/src/game/systems/MarketSystem.ts" 的内容，我们将核心代码放在最前面。

// 重新组织代码，确保MarketSystem是核心导出。

// (代码已在上方提供，这里不再重复，但确保其结构是清晰的)
