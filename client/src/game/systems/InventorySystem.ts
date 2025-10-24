// client/src/game/systems/InventorySystem.ts

import Phaser from 'phaser';

/**
 * 物品类型枚举
 * 遵循宝可梦风格：装备（如自行车、钓竿）、药品（如伤药）、道具（如精灵球）
 */
export enum ItemType {
    EQUIPMENT = 'EQUIPMENT', // 装备/关键物品
    MEDICINE = 'MEDICINE',   // 药品
    ITEM = 'ITEM',           // 普通道具/精灵球
}

/**
 * 物品数据接口
 */
export interface ItemData {
    id: string;             // 唯一ID
    name: string;           // 名称
    description: string;    // 描述
    type: ItemType;         // 物品类型
    iconFrame: number;      // 在图集中的帧索引 (Phaser 3 SpriteSheet)
    maxStack: number;       // 最大堆叠数量 (对于关键物品或装备通常为 1)
}

/**
 * 背包槽位接口
 */
export interface InventorySlot {
    item: ItemData;         // 槽位中的物品数据
    quantity: number;       // 数量
}

/**
 * 背包系统配置
 */
export interface InventoryConfig {
    capacity: number;       // 背包总容量（槽位数量）
    maxQuantity: number;    // 单个物品默认最大堆叠数量
}

/**
 * 宝可梦 Game Boy 风格的背包系统
 * 负责物品数据的管理、增删、使用逻辑。继承自 EventEmitter 实现事件驱动。
 */
export class InventorySystem extends Phaser.Events.EventEmitter {
    private scene: Phaser.Scene;
    private config: InventoryConfig;
    // 使用 Map 存储，key 为 item.id，方便查找和管理堆叠
    private items: Map<string, InventorySlot>; 

    // 假设这是所有物品的数据库 (生产环境中通常从 JSON 或外部文件加载)
    private static ITEM_DATABASE: Map<string, ItemData> = new Map<string, ItemData>([
        { id: 'potion', name: '伤药', description: '恢复20点HP，可堆叠。', type: ItemType.MEDICINE, iconFrame: 0, maxStack: 99 },
        { id: 'super_potion', name: '好伤药', description: '恢复50点HP，可堆叠。', type: ItemType.MEDICINE, iconFrame: 0, maxStack: 99 },
        { id: 'pokeball', name: '精灵球', description: '用于捕捉野生宝可梦。', type: ItemType.ITEM, iconFrame: 1, maxStack: 99 },
        { id: 'bike', name: '自行车', description: '旅行速度翻倍，关键物品。', type: ItemType.EQUIPMENT, iconFrame: 2, maxStack: 1 },
        { id: 'key_item_a', name: '秘传机器01', description: '用于解锁特定区域的技能。', type: ItemType.EQUIPMENT, iconFrame: 3, maxStack: 1 },
    ].map(item => [item.id, item]));

    constructor(scene: Phaser.Scene, config: Partial<InventoryConfig> = {}) {
        super();
        this.scene = scene;
        this.config = {
            capacity: config.capacity || 30, // 默认容量
            maxQuantity: config.maxQuantity || 99, // 默认最大堆叠
        };
        this.items = new Map();
        
        // 性能优化：预先绑定事件，避免运行时重复创建
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    /**
     * 获取背包中所有物品槽位的数组
     */
    public getSlots(): InventorySlot[] {
        // 返回一个包含所有槽位的数组，方便 UI 遍历
        return Array.from(this.items.values());
    }

    /**
     * 获取背包中物品的总数（非槽位数量）
     */
    public getItemCount(): number {
        return this.items.size;
    }

    /**
     * 根据物品ID获取物品数据
     */
    public static getItemData(itemId: string): ItemData | undefined {
        return InventorySystem.ITEM_DATABASE.get(itemId);
    }

    /**
     * 检查背包是否已满
     * 注意：这里只检查槽位数量是否达到容量，不考虑堆叠。
     */
    public isFull(): boolean {
        return this.items.size >= this.config.capacity;
    }

    /**
     * 添加物品到背包
     * @param itemId 物品ID
     * @param quantity 数量
     * @returns 是否成功添加
     */
    public addItem(itemId: string, quantity: number = 1): boolean {
        const itemData = InventorySystem.getItemData(itemId);
        if (!itemData) {
            console.warn(`Item ID ${itemId} not found in database.`);
            return false;
        }

        const slot = this.items.get(itemId);
        const maxStack = itemData.maxStack || this.config.maxQuantity;

        if (slot) {
            // 物品已存在，尝试堆叠
            const newQuantity = Math.min(slot.quantity + quantity, maxStack);
            const added = newQuantity - slot.quantity;

            if (added > 0) {
                slot.quantity = newQuantity;
                this.emit('itemAdded', itemData, added);
                this.emit('inventoryUpdated');
                return true;
            } else {
                // 无法堆叠，已达到最大堆叠
                return false;
            }
        } else {
            // 物品不存在，创建新槽位
            if (this.isFull()) {
                console.warn('Inventory is full (slot capacity reached).');
                return false;
            }

            const initialQuantity = Math.min(quantity, maxStack);
            this.items.set(itemId, {
                item: itemData,
                quantity: initialQuantity,
            });

            this.emit('itemAdded', itemData, initialQuantity);
            this.emit('inventoryUpdated');
            return true;
        }
    }

    /**
     * 从背包中移除物品
     * @param itemId 物品ID
     * @param quantity 数量
     * @returns 是否成功移除
     */
    public removeItem(itemId: string, quantity: number = 1): boolean {
        const slot = this.items.get(itemId);

        if (!slot) {
            return false; // 物品不存在
        }

        if (slot.quantity > quantity) {
            // 数量足够，减少数量
            slot.quantity -= quantity;
            this.emit('itemRemoved', slot.item, quantity);
            this.emit('inventoryUpdated');
            return true;
        } else if (slot.quantity === quantity) {
            // 数量正好，移除槽位
            this.items.delete(itemId);
            this.emit('itemRemoved', slot.item, quantity);
            this.emit('inventoryUpdated');
            return true;
        } else {
            // 数量不足
            return false;
        }
    }

    /**
     * 使用物品的逻辑（简化版）
     * 实际游戏中，这里会触发更复杂的逻辑，例如恢复HP、改变状态等。
     * @param itemId 物品ID
     * @returns 是否成功使用
     */
    public useItem(itemId: string): boolean {
        const slot = this.items.get(itemId);

        if (!slot) {
            return false;
        }

        // 关键逻辑：根据物品类型或ID执行效果
        switch (slot.item.type) {
            case ItemType.MEDICINE:
                // 假设药品使用后直接消耗
                console.log(`使用药品: ${slot.item.name}`);
                this.removeItem(itemId, 1);
                // 触发实际效果（例如：治愈宝可梦）
                this.emit('itemUsed', slot.item);
                return true;
            case ItemType.EQUIPMENT:
                // 装备/关键物品无需消耗，直接触发效果
                console.log(`使用装备/关键物品: ${slot.item.name}`);
                // 实际游戏中可能需要切换装备状态
                this.emit('itemUsed', slot.item);
                return true;
            case ItemType.ITEM:
                // 普通道具，例如精灵球，通常在战斗中或特定场景使用
                console.log(`使用道具: ${slot.item.name}`);
                this.removeItem(itemId, 1);
                this.emit('itemUsed', slot.item);
                return true;
            default:
                return false;
        }
    }

    /**
     * 序列化背包数据，用于保存
     */
    public serialize(): { itemId: string, quantity: number }[] {
        return Array.from(this.items.values()).map(slot => ({
            itemId: slot.item.id,
            quantity: slot.quantity,
        }));
    }

    /**
     * 反序列化背包数据，用于加载
     */
    public deserialize(data: { itemId: string, quantity: number }[]): void {
        this.items.clear();
        data.forEach(entry => {
            const itemData = InventorySystem.ITEM_DATABASE.get(entry.itemId);
            if (itemData) {
                this.items.set(entry.itemId, {
                    item: itemData,
                    quantity: entry.quantity,
                });
            } else {
                console.warn(`Item ID ${entry.itemId} not found during deserialization. Skipping.`);
            }
        });
        this.emit('inventoryUpdated');
    }
}

// ==================================================================================================
// UI 组件 (Game Boy 风格)
// ==================================================================================================

/**
 * 宝可梦 Game Boy 风格的 UI 框架类 (GBWindow)
 * 负责绘制边框、背景和文本。
 */
export class GBWindow extends Phaser.GameObjects.Graphics {
    // Game Boy 风格的颜色和尺寸常量
    private readonly BORDER_COLOR = 0x000000;
    private readonly BG_COLOR = 0xCCCCCC; // 模拟 Game Boy 的灰绿色背景
    private readonly BORDER_THICKNESS = 2;
    private readonly SHADOW_COLOR = 0x888888; // 阴影颜色
    private readonly HIGHLIGHT_COLOR = 0xFFFFFF; // 高光颜色

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, { x, y });
        scene.add.existing(this);
        this.drawWindow(width, height);
    }

    /**
     * 绘制 Game Boy 风格的窗口边框和背景。
     * 采用内嵌边框和高光/阴影模拟 3D 效果。
     */
    private drawWindow(width: number, height: number): void {
        this.clear();

        // 1. 绘制外部边框和背景
        // 外部边框 (黑色)
        this.lineStyle(this.BORDER_THICKNESS, this.BORDER_COLOR, 1);
        this.strokeRect(0, 0, width, height);

        // 内部背景 (灰绿色)
        this.fillStyle(this.BG_COLOR, 1);
        this.fillRect(this.BORDER_THICKNESS, this.BORDER_THICKNESS, width - 2 * this.BORDER_THICKNESS, height - 2 * this.BORDER_THICKNESS);

        // 2. 模拟 3D 凹陷效果 (Game Boy 风格的关键)
        // 顶部和左侧高光 (白色)
        this.lineStyle(1, this.HIGHLIGHT_COLOR, 1);
        this.beginPath();
        this.moveTo(this.BORDER_THICKNESS, height - this.BORDER_THICKNESS);
        this.lineTo(this.BORDER_THICKNESS, this.BORDER_THICKNESS);
        this.lineTo(width - this.BORDER_THICKNESS, this.BORDER_THICKNESS);
        this.strokePath();

        // 底部和右侧阴影 (深灰色)
        this.lineStyle(1, this.SHADOW_COLOR, 1);
        this.beginPath();
        this.moveTo(width - this.BORDER_THICKNESS, this.BORDER_THICKNESS);
        this.lineTo(width - this.BORDER_THICKNESS, height - this.BORDER_THICKNESS);
        this.lineTo(this.BORDER_THICKNESS, height - this.BORDER_THICKNESS);
        this.strokePath();
    }
}

/**
 * 宝可梦 Game Boy 风格的背包 UI 场景
 * 负责展示背包内容、处理用户输入。
 */
export class InventoryUI extends Phaser.GameObjects.Container {
    private inventory: InventorySystem;
    private window: GBWindow;
    private itemText: Phaser.GameObjects.Text[] = [];
    private cursor: Phaser.GameObjects.Graphics;
    private descriptionWindow: GBWindow; // 物品描述窗口
    private descriptionText: Phaser.GameObjects.Text; // 物品描述文本
    private selectedIndex: number = 0;
    private scrollOffset: number = 0; // 滚动偏移量，用于实现列表滚动
    
    private readonly WINDOW_WIDTH = 240;
    private readonly WINDOW_HEIGHT = 160;
    private readonly ITEM_HEIGHT = 16;
    private readonly VISIBLE_ITEMS = 8; // 屏幕上可见的物品数量

    constructor(scene: Phaser.Scene, inventory: InventorySystem) {
        // 居中显示
        const x = (scene.scale.width - this.WINDOW_WIDTH) / 2;
        const y = (scene.scale.height - this.WINDOW_HEIGHT) / 2;
        super(scene, x, y);
        scene.add.existing(this);

        this.inventory = inventory;

        // 主列表窗口 (占据上方大部分空间)
        const listWindowHeight = this.VISIBLE_ITEMS * this.ITEM_HEIGHT + 4; // 8项 + 上下边距
        this.window = new GBWindow(scene, 0, 0, this.WINDOW_WIDTH, listWindowHeight);
        this.add(this.window);

        // 描述窗口 (占据下方空间)
        const descWindowY = listWindowHeight + 4; // 留一点间距
        const descWindowHeight = this.WINDOW_HEIGHT - descWindowY;
        this.descriptionWindow = new GBWindow(scene, 0, descWindowY, this.WINDOW_WIDTH, descWindowHeight);
        this.add(this.descriptionWindow);

        // 字体设置为 Game Boy 风格 (像素字体)
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'monospace', // 模拟像素字体
            fontSize: '12px',
            color: '#000000',
            wordWrap: { width: this.WINDOW_WIDTH - 20 },
            padding: { x: 0, y: 2 } // 调整行间距
        };

        // 物品列表文本
        for (let i = 0; i < this.VISIBLE_ITEMS; i++) {
            // 文本位置在主窗口内部，留出边框
            const text = scene.add.text(10, 2 + i * this.ITEM_HEIGHT, '', textStyle); 
            this.add(text);
            this.itemText.push(text);
        }

        // 描述文本
        this.descriptionText = scene.add.text(
            10, 
            descWindowY + 2, // 描述窗口内部
            '选择一个物品', 
            { ...textStyle, wordWrap: { width: this.WINDOW_WIDTH - 20 } }
        );
        this.add(this.descriptionText);


        // 游标
        this.cursor = scene.add.graphics();
        this.cursor.fillStyle(0x000000, 1);
        // 绘制一个更像 GB 的小箭头 (例如 4x6 像素)
        this.cursor.fillTriangle(0, 0, 6, 3, 0, 6); 
        this.add(this.cursor);

        this.setVisible(false);

        // 绑定事件
        inventory.on('inventoryUpdated', this.refreshUI, this);
    }

    /**
     * 刷新 UI, 重新绘制物品列表和描述
     */
    private refreshUI(): void {
        const slots = this.inventory.getSlots();
        const totalItems = slots.length;

        // 确保选中索引不越界
        if (this.selectedIndex >= totalItems) {
            this.selectedIndex = Math.max(0, totalItems - 1);
        }

        // 处理滚动偏移量 (如果选中项超出可见范围，则调整滚动)
        if (this.selectedIndex < this.scrollOffset) {
            // 向上滚动
            this.scrollOffset = this.selectedIndex;
        } else if (this.selectedIndex >= this.scrollOffset + this.VISIBLE_ITEMS) {
            // 向下滚动
            this.scrollOffset = this.selectedIndex - this.VISIBLE_ITEMS + 1;
        }
        
        // 绘制物品列表
        for (let i = 0; i < this.VISIBLE_ITEMS; i++) {
            const slotIndex = this.scrollOffset + i;
            const textObject = this.itemText[i];

            if (slotIndex < totalItems) {
                const slot = slots[slotIndex];
                // 物品名称后跟数量，关键物品不显示数量
                const quantityStr = slot.item.maxStack === 1 ? '' : ` x${slot.quantity}`;
                textObject.setText(`${slot.item.name}${quantityStr}`);
            } else {
                textObject.setText(''); // 清空未使用的行
            }
        }

        this.updateCursorPosition();
        this.updateDescription();
    }

    /**
     * 更新游标位置
     */
    private updateCursorPosition(): void {
        const slots = this.inventory.getSlots();
        if (slots.length === 0 || !this.visible) {
            this.cursor.setVisible(false);
            return;
        }

        // 游标只在当前可见的物品上移动
        const relativeIndex = this.selectedIndex - this.scrollOffset;

        if (relativeIndex >= 0 && relativeIndex < this.VISIBLE_ITEMS) {
            this.cursor.setVisible(true);
            
            // 游标位置 (X: 靠近文本, Y: 对应行)
            const cursorX = 2; // 稍微靠左
            const cursorY = 2 + relativeIndex * this.ITEM_HEIGHT + 5; // 垂直居中于文本行

            this.cursor.setPosition(cursorX, cursorY);
        } else {
            this.cursor.setVisible(false); // 理论上不应该发生，除非逻辑错误
        }
    }

    /**
     * 更新物品描述文本
     */
    private updateDescription(): void {
        const slots = this.inventory.getSlots();
        if (slots.length > 0 && this.selectedIndex < slots.length) {
            const selectedItem = slots[this.selectedIndex];
            this.descriptionText.setText(selectedItem.item.description);
        } else {
            this.descriptionText.setText('背包是空的');
        }
    }

    /**
     * 处理键盘输入 (简化版)
     */
    public handleInput(key: 'UP' | 'DOWN' | 'ACTION' | 'CANCEL'): void {
        if (!this.visible) return;

        const slots = this.inventory.getSlots();
        if (slots.length === 0) return;

        switch (key) {
            case 'UP':
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    this.refreshUI(); // 刷新 UI 来处理滚动和游标
                }
                break;
            case 'DOWN':
                if (this.selectedIndex < slots.length - 1) {
                    this.selectedIndex++;
                    this.refreshUI(); // 刷新 UI 来处理滚动和游标
                }
                break;
            case 'ACTION':
                const selectedItem = slots[this.selectedIndex];
                if (selectedItem) {
                    // 尝试使用物品
                    const used = this.inventory.useItem(selectedItem.item.id);
                    if (used) {
                        // 成功使用后，重新刷新 UI，因为物品可能被消耗或移除
                        this.refreshUI(); 
                        // 如果当前槽位被移除，selectedIndex 可能会自动调整
                    } else {
                        // 无法使用（例如，关键物品可能需要特定场景）
                        console.log(`物品 ${selectedItem.item.name} 无法在此处使用。`);
                    }
                }
                break;
            case 'CANCEL':
                this.setVisible(false);
                break;
        }
    }

    /**
     * 切换背包 UI 的可见性
     */
    public toggleVisibility(): void {
        this.setVisible(!this.visible);
        if (this.visible) {
            this.refreshUI();
            this.cursor.setVisible(this.inventory.getSlots().length > 0);
        } else {
            this.cursor.setVisible(false);
        }
    }
}

// ==================================================================================================
// 示例场景 (用于测试和演示)
// ==================================================================================================

/**
 * 示例场景，用于初始化和测试背包系统
 * 开发者可以将此场景添加到 Phaser 游戏的配置中进行测试。
 */
export class InventoryTestScene extends Phaser.Scene {
    private inventorySystem!: InventorySystem;
    private inventoryUI!: InventoryUI;
    private debugText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'InventoryTestScene' });
    }

    preload() {
        // 实际项目中，在这里加载 Game Boy 风格的字体和物品图标图集
    }

    create() {
        // 设置背景为深色，以突出 GB 风格的 UI
        this.cameras.main.setBackgroundColor('#444444'); 

        // 1. 初始化背包系统
        this.inventorySystem = new InventorySystem(this);

        // 2. 初始化背包 UI
        this.inventoryUI = new InventoryUI(this, this.inventorySystem);

        // 3. 添加一些初始物品 (测试滚动和堆叠)
        this.inventorySystem.addItem('potion', 5);
        this.inventorySystem.addItem('pokeball', 10);
        this.inventorySystem.addItem('bike', 1);
        this.inventorySystem.addItem('key_item_a', 1);
        this.inventorySystem.addItem('potion', 3); // 测试堆叠
        this.inventorySystem.addItem('pokeball', 50); // 堆叠更多
        // 添加更多物品以测试滚动 (需要超过 VISIBLE_ITEMS = 8 个槽位)
        for (let i = 0; i < 6; i++) {
            this.inventorySystem.addItem(`item_${i}`, 1);
            // 临时添加物品到数据库 (仅为测试目的)
            InventorySystem.ITEM_DATABASE.set(`item_${i}`, {
                id: `item_${i}`, 
                name: `测试道具${i+1}`, 
                description: `这是测试道具${i+1}的描述。`, 
                type: ItemType.ITEM, 
                iconFrame: 4 + i, 
                maxStack: 99 
            });
        }
        this.inventorySystem.addItem('item_0', 1); // 再次添加以确保触发滚动

        // 4. 调试文本
        this.debugText = this.add.text(10, 10, '按 [I] 键打开/关闭背包\n按 [↑][↓] 选择物品\n按 [Z] 键使用物品\n按 [X] 键关闭背包', { fontSize: '16px', color: '#FFFFFF', backgroundColor: '#00000080' });
        this.debugText.setDepth(100);

        // 5. 绑定输入
        this.input.keyboard.on('keydown-I', () => {
            this.inventoryUI.toggleVisibility();
        });

        this.input.keyboard.on('keydown-UP', () => {
            this.inventoryUI.handleInput('UP');
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.inventoryUI.handleInput('DOWN');
        });

        this.input.keyboard.on('keydown-Z', () => { // Z 键模拟 A 键 (确认/使用)
            this.inventoryUI.handleInput('ACTION');
            this.updateDebugInfo();
        });

        this.input.keyboard.on('keydown-X', () => { // X 键模拟 B 键 (取消/关闭)
            this.inventoryUI.handleInput('CANCEL');
        });

        // 6. 监听事件并更新调试信息
        this.inventorySystem.on('itemUsed', (item: ItemData) => {
            console.log(`物品使用成功: ${item.name}`);
            this.updateDebugInfo();
        });
        this.inventorySystem.on('inventoryUpdated', this.updateDebugInfo, this);
        this.updateDebugInfo();
    }

    private updateDebugInfo(): void {
        const slots = this.inventorySystem.getSlots();
        let info = '背包内容:\n';
        slots.forEach(slot => {
            info += `- ${slot.item.name}: x${slot.quantity}\n`;
        });
        
        this.debugText.setText(`按 [I] 键打开/关闭背包\n按 [↑][↓] 选择物品\n按 [Z] 键使用物品\n按 [X] 键关闭背包\n\n${info}`);
    }
}
// 导出所有必要的类
export * from './InventorySystem';
export * from './InventorySystem';