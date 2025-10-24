import "phaser";

// =====================================================================================
// 1. 核心接口和模拟数据
// =====================================================================================

/**
 * @interface IUnit
 * @description 游戏单位（角色）的基本数据结构。
 */
export interface IUnit {
    id: number;
    name: string;
    level: number;
    spriteKey: string; // 用于加载Game Boy风格的像素图
}

/**
 * @interface ITeamData
 * @description 队伍的配置数据。
 * 队伍由固定数量的槽位组成，每个槽位可以存放一个单位的ID。
 */
export interface ITeamData {
    // 队伍槽位，键为槽位索引（0, 1, 2...），值为单位ID。
    // 如果槽位为空，则值为 null。
    slots: { [key: number]: number | null }; 
    maxSize: number;
}

/**
 * @interface ITeamSystemConfig
 * @description TeamSystem的配置选项，用于配置Game Boy风格的UI。
 */
export interface ITeamSystemConfig {
    maxTeamSize: number;
    // Game Boy风格的颜色配置 (4色调色板模拟)
    palette: {
        background: number; // 背景色 (如 0x9bbc0f)
        primary: number;    // 主要边框/文本色 (如 0x0f380f)
        secondary: number;  // 次要边框/填充色 (如 0x306230)
        highlight: number;  // 选中高亮色 (如 0x8bac0f)
    };
    fontKey: string; // BitmapText的键名
    slotSize: number; // 每个槽位的尺寸 (像素)
    padding: number; // 边距
}

// 模拟的单位数据库，实际游戏中应从外部加载
const MOCK_UNIT_DB: { [id: number]: IUnit } = {
    1: { id: 1, name: "PIKACHU", level: 5, spriteKey: "unit_pikachu" },
    2: { id: 2, name: "CHARMAND", level: 7, spriteKey: "unit_charmand" },
    3: { id: 3, name: "BULBASAU", level: 6, spriteKey: "unit_bulbasau" },
    4: { id: 4, name: "SQUIRTLE", level: 8, spriteKey: "unit_squirtle" },
    5: { id: 5, name: "JIGGLYPU", level: 4, spriteKey: "unit_jigglypu" },
    6: { id: 6, name: "MEOWTH", level: 3, spriteKey: "unit_meowth" },
    7: { id: 7, name: "SNORLAX", level: 10, spriteKey: "unit_snorlax" },
};

// =====================================================================================
// 2. TeamSystem 类实现
// =====================================================================================

/**
 * @class TeamSystem
 * @description 队伍管理系统，负责管理队伍数据和Game Boy风格的UI交互。
 * 易于集成：只需在任何Scene中实例化并调用 initUI 即可。
 */
export class TeamSystem {
    private scene: Phaser.Scene;
    private config: ITeamSystemConfig;
    private teamData: ITeamData;
    private uiContainer: Phaser.GameObjects.Container;
    private selectedSlotIndex: number = 0;
    private slotGraphics: Phaser.GameObjects.Graphics[] = [];
    private slotTexts: Phaser.GameObjects.BitmapText[] = [];
    private slotSprites: Phaser.GameObjects.Image[] = [];
    private highlightRect: Phaser.GameObjects.Graphics;

    /**
     * 构造函数
     * @param scene 所在的Phaser场景
     * @param config 系统配置
     */
    constructor(scene: Phaser.Scene, config: ITeamSystemConfig) {
        this.scene = scene;
        this.config = config;
        
        // 初始化空队伍数据
        const slots: { [key: number]: number | null } = {};
        for (let i = 0; i < config.maxTeamSize; i++) {
            slots[i] = null;
        }
        this.teamData = {
            slots: slots,
            maxSize: config.maxTeamSize,
        };

        // 创建UI容器，便于整体移动和管理
        this.uiContainer = scene.add.container(0, 0);
        this.uiContainer.setScrollFactor(0); // 固定在屏幕上
        
        // 初始化高亮框
        this.highlightRect = scene.add.graphics();
        this.highlightRect.setDepth(10);
        this.uiContainer.add(this.highlightRect);
    }

    /**
     * 模拟从数据库或数据管理器获取单位详情
     * @param unitId 单位ID
     * @returns IUnit 或 undefined
     */
    private getUnitData(unitId: number): IUnit | undefined {
        return MOCK_UNIT_DB[unitId];
    }

    /**
     * 初始化并渲染Game Boy风格的队伍配置界面
     * @param x UI的起始X坐标
     * @param y UI的起始Y坐标
     */
    public initUI(x: number, y: number): void {
        this.uiContainer.setPosition(x, y);
        this.drawBackground();
        this.drawSlots();
        this.updateHighlight(this.selectedSlotIndex);
        this.setupInput();
    }

    /**
     * 绘制Game Boy风格的背景和边框
     */
    private drawBackground(): void {
        const { padding, slotSize, maxTeamSize, palette } = this.config;
        // 计算总宽度和高度
        const totalWidth = (slotSize + padding) * maxTeamSize + padding;
        const totalHeight = slotSize + padding * 2;

        const graphics = this.scene.add.graphics();
        this.uiContainer.add(graphics);

        // 1. 绘制背景 (使用背景色)
        graphics.fillStyle(palette.background, 1);
        graphics.fillRect(0, 0, totalWidth, totalHeight);

        // 2. 绘制边框 (使用主色)
        graphics.lineStyle(2, palette.primary, 1);
        graphics.strokeRect(0, 0, totalWidth, totalHeight);
    }

    /**
     * 绘制队伍槽位
     */
    private drawSlots(): void {
        const { padding, slotSize, maxTeamSize, palette, fontKey } = this.config;

        for (let i = 0; i < maxTeamSize; i++) {
            const slotX = padding + i * (slotSize + padding);
            const slotY = padding;

            // 1. 绘制槽位图形 (Graphics)
            const slotGfx = this.scene.add.graphics();
            slotGfx.lineStyle(1, palette.secondary, 1);
            slotGfx.strokeRect(slotX, slotY, slotSize, slotSize);
            this.uiContainer.add(slotGfx);
            this.slotGraphics.push(slotGfx);

            // 2. 绘制单位Sprite (Image - 模拟)
            // 实际项目中需要预加载这些spriteKey对应的图片
            const unitSprite = this.scene.add.image(
                slotX + slotSize / 2, 
                slotY + slotSize / 2, 
                "pixel_art_placeholder" // 使用一个通用的占位符
            );
            unitSprite.setDisplaySize(slotSize * 0.8, slotSize * 0.8);
            unitSprite.setVisible(false); // 默认隐藏
            this.uiContainer.add(unitSprite);
            this.slotSprites.push(unitSprite);

            // 3. 绘制单位名称 (BitmapText)
            const unitText = this.scene.add.bitmapText(
                slotX + slotSize / 2, 
                slotY + slotSize + 2, 
                fontKey, 
                "", 
                8
            );
            unitText.setOrigin(0.5, 0);
            unitText.setTint(palette.primary);
            this.uiContainer.add(unitText);
            this.slotTexts.push(unitText);

            // 4. 为槽位添加交互（点击）
            const hitArea = this.scene.add.zone(
                slotX, slotY, slotSize, slotSize
            ).setOrigin(0, 0).setInteractive();
            hitArea.on('pointerdown', () => this.selectSlot(i));
            this.uiContainer.add(hitArea);

            // 首次渲染槽位内容
            this.renderSlot(i);
        }
    }

    /**
     * 更新单个槽位的UI显示
     * @param slotIndex 槽位索引
     */
    private renderSlot(slotIndex: number): void {
        const unitId = this.teamData.slots[slotIndex];
        const unitSprite = this.slotSprites[slotIndex];
        const unitText = this.slotTexts[slotIndex];

        if (unitId !== null) {
            const unitData = this.getUnitData(unitId);
            if (unitData) {
                // 实际项目中应根据 unitData.spriteKey 加载对应的图片
                // 这里仅模拟显示
                unitSprite.setTexture(unitData.spriteKey || "pixel_art_placeholder"); 
                unitSprite.setVisible(true);
                unitText.setText(unitData.name);
            }
        } else {
            unitSprite.setVisible(false);
            unitText.setText("EMPTY");
        }
    }

    /**
     * 设置初始队伍配置
     * @param unitIds 包含单位ID的数组
     */
    public setTeam(unitIds: number[]): void {
        const slots = this.teamData.slots;
        const max = this.teamData.maxSize;
        
        // 清空现有队伍
        for (let i = 0; i < max; i++) {
            slots[i] = null;
        }

        // 填充新队伍
        for (let i = 0; i < Math.min(unitIds.length, max); i++) {
            slots[i] = unitIds[i];
        }

        // 更新UI
        for (let i = 0; i < max; i++) {
            this.renderSlot(i);
        }
    }

    /**
     * 将一个单位添加到第一个空槽位
     * @param unitId 要添加的单位ID
     * @returns 是否添加成功
     */
    public addUnit(unitId: number): boolean {
        for (let i = 0; i < this.teamData.maxSize; i++) {
            if (this.teamData.slots[i] === null) {
                this.teamData.slots[i] = unitId;
                this.renderSlot(i);
                console.log(`Unit ${unitId} added to slot ${i}`);
                return true;
            }
        }
        console.warn("Team is full!");
        return false;
    }

    /**
     * 从指定槽位移除单位
     * @param slotIndex 槽位索引
     */
    public removeUnit(slotIndex: number): void {
        if (this.teamData.slots[slotIndex] !== null) {
            this.teamData.slots[slotIndex] = null;
            this.renderSlot(slotIndex);
            console.log(`Unit removed from slot ${slotIndex}`);
        }
    }

    /**
     * 交换两个槽位的单位
     * @param indexA 槽位A
     * @param indexB 槽位B
     */
    public swapUnits(indexA: number, indexB: number): void {
        if (indexA < 0 || indexA >= this.teamData.maxSize || indexB < 0 || indexB >= this.teamData.maxSize) {
            console.warn("Invalid slot index for swap.");
            return;
        }

        const temp = this.teamData.slots[indexA];
        this.teamData.slots[indexA] = this.teamData.slots[indexB];
        this.teamData.slots[indexB] = temp;

        this.renderSlot(indexA);
        this.renderSlot(indexB);
        console.log(`Swapped units between slot ${indexA} and ${indexB}`);
    }

    /**
     * 获取当前的队伍配置数据
     * @returns ITeamData
     */
    public getTeamData(): ITeamData {
        return this.teamData;
    }

    // =====================================================================================
    // 3. UI 交互逻辑 (Game Boy 风格)
    // =====================================================================================

    /**
     * 设置键盘输入监听
     */
    private setupInput(): void {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) return;
        const cursors = keyboard.createCursorKeys();
        const spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // 模拟Game Boy的左右方向键选择槽位
        cursors.left.on('down', () => this.selectSlot(this.selectedSlotIndex - 1));
        cursors.right.on('down', () => this.selectSlot(this.selectedSlotIndex + 1));

        // 模拟A键（空格）进行操作
        spaceKey.on('down', this.handleSlotAction, this);
    }

    /**
     * 选择槽位并更新高亮框
     * @param newIndex 新的槽位索引
     */
    private selectSlot(newIndex: number): void {
        const max = this.teamData.maxSize;
        // 循环选择
        if (newIndex < 0) {
            newIndex = max - 1;
        } else if (newIndex >= max) {
            newIndex = 0;
        }
        
        this.selectedSlotIndex = newIndex;
        this.updateHighlight(newIndex);
    }

    /**
     * 更新高亮框的位置和样式
     * @param slotIndex 当前选中的槽位索引
     */
    private updateHighlight(slotIndex: number): void {
        const { padding, slotSize, palette } = this.config;
        const slotX = padding + slotIndex * (slotSize + padding);
        const slotY = padding;

        this.highlightRect.clear();
        // 绘制高亮边框
        this.highlightRect.lineStyle(2, palette.highlight, 1);
        this.highlightRect.strokeRect(slotX, slotY, slotSize, slotSize);
        
        // 将高亮框的位置同步到UI容器的坐标系
        this.highlightRect.x = this.uiContainer.x;
        this.highlightRect.y = this.uiContainer.y;
    }
    
    /**
     * 处理选中槽位的操作（模拟Game Boy的A键）
     * 
     * 这是一个简化的示例：
     * 1. 如果槽位有单位，则移除它。
     * 2. 如果槽位为空，则添加一个随机单位（模拟从背包中选择）。
     */
    private handleSlotAction(): void {
        const index = this.selectedSlotIndex;
        const currentUnitId = this.teamData.slots[index];
        
        if (currentUnitId !== null) {
            // 移除单位
            this.removeUnit(index);
        } else {
            // 添加随机单位
            const availableUnitIds = Object.keys(MOCK_UNIT_DB).map(id => parseInt(id));
            const randomUnitId = availableUnitIds[Math.floor(Math.random() * availableUnitIds.length)];
            this.addUnit(randomUnitId);
        }
    }
}
