// client/src/game/scenes/InteriorScenes.ts

import * as Phaser from 'phaser';

/**
 * @interface InteriorSceneConfig
 * @description 定义内部场景的配置结构，用于初始化场景和加载资源。
 */
export interface InteriorSceneConfig {
    /** 场景的唯一键名 */
    key: string;
    /** 场景对应的像素艺术建筑名称（用于地图交互或过渡） */
    buildingName: string;
    /** 场景的Fate风格高清插图资源键名 */
    hdImageKey: string;
    /** 场景的像素艺术背景或室内地图资源键名（可选，如果需要像素艺术室内行走） */
    pixelArtKey?: string;
    /** 场景的描述或名称 */
    description: string;
}

/**
 * @abstract
 * @class BaseInteriorScene
 * @extends Phaser.Scene
 * @description 所有内部场景的基类。实现了资源预加载、场景切换和高清插图显示的核心逻辑。
 *
 * 遵循Game Boy风格的场景切换和像素艺术缩放，同时满足高清插图的特殊需求。
 */
export abstract class BaseInteriorScene extends Phaser.Scene {
    protected config: InteriorSceneConfig;
    protected hdImageKey: string;

    /**
     * @constructor
     * @param config 场景配置对象
     */
    constructor(config: InteriorSceneConfig) {
        // 确保使用配置中的key作为场景的key
        super({ key: config.key });
        this.config = config;
        this.hdImageKey = config.hdImageKey;
    }

    /**
     * @method init
     * @description 场景初始化，通常用于接收外部数据。
     * @param data 外部传入的数据，例如玩家位置、场景切换前的状态等。
     */
    init(data: any) {
        console.log(`Initializing Scene: ${this.config.key}`, data);
        // 实际场景切换时可在此处添加淡入/淡出效果
        // this.cameras.main.fadeIn(500);
    }

    /**
     * @method preload
     * @description 资源预加载。
     *
     * 注意：在实际生产环境中，高清插图应在主场景或加载场景中统一预加载，
     * 以避免场景切换时的卡顿。这里仅作为示例代码，资源路径需实际存在。
     */
    preload() {
        // 模拟加载Fate风格高清插图
        // 实际应用中，资源路径应根据项目结构调整
        const hdImagePath = `assets/interiors/${this.hdImageKey}.jpg`;
        this.load.image(this.hdImageKey, hdImagePath);

        // 模拟加载像素艺术室内地图（如果存在）
        if (this.config.pixelArtKey) {
            const pixelArtPath = `assets/maps/${this.config.pixelArtKey}.png`;
            this.load.image(this.config.pixelArtKey, pixelArtPath);
        }

        console.log(`Preloading assets for ${this.config.key}: ${this.hdImageKey}`);
    }

    /**
     * @method create
     * @description 场景创建，放置游戏对象和逻辑。
     */
    create() {
        // 1. 显示Fate风格高清插图
        this.displayHDIllustration();

        // 2. 添加场景交互逻辑（例如：返回出口、NPC交互等）
        this.addInteractionLogic();

        console.log(`Scene created: ${this.config.key}`);
    }

    /**
     * @method displayHDIllustration
     * @description 显示高清插图，并确保其适应屏幕。
     * 实现了插图的居中和自适应缩放，以满足“高清插图”的需求。
     */
    protected displayHDIllustration() {
        const { width, height } = this.sys.game.canvas;

        // 添加高清插图
        const hdImage = this.add.image(width / 2, height / 2, this.hdImageKey);

        // 确保插图覆盖整个屏幕或保持比例居中
        // 这是一个通用的适应屏幕的缩放逻辑
        const scaleX = width / hdImage.width;
        const scaleY = height / hdImage.height;
        // 使用Math.max确保图片至少覆盖屏幕的短边，实现"Cover"效果
        const scale = Math.max(scaleX, scaleY); 

        hdImage.setScale(scale);
        hdImage.setOrigin(0.5, 0.5); // 居中
        hdImage.setDepth(10); // 确保在最上层显示
    }

    /**
     * @method addInteractionLogic
     * @description 抽象方法，用于子类实现特定的场景交互逻辑。
     * 例如：返回主场景的出口、与场景内NPC的对话等。
     */
    protected abstract addInteractionLogic(): void;

    /**
     * @method transitionToMainScene
     * @description 切换回主地图场景的通用方法。
     */
    protected transitionToMainScene() {
        console.log(`Transitioning from ${this.config.key} back to MainScene...`);
        // 模拟切换场景，并传入切换后的玩家位置信息
        this.scene.start('MainScene', { fromScene: this.config.key, exitPoint: this.config.buildingName });
    }
}

// ====================================================================
// 场景配置列表
// ====================================================================

/**
 * @const InteriorSceneConfigs
 * @description 10个建筑内部场景的配置列表。
 */
export const InteriorSceneConfigs: InteriorSceneConfig[] = [
    { key: 'GymScene', buildingName: 'BasketballCourt', hdImageKey: 'hd_gym', description: '篮球馆内部' },
    { key: 'ShopScene', buildingName: 'ConvenienceStore', hdImageKey: 'hd_shop', description: '商店内部' },
    { key: 'HospitalScene', buildingName: 'CityHospital', hdImageKey: 'hd_hospital', description: '医院内部' },
    { key: 'DormScene', buildingName: 'StudentDormitory', hdImageKey: 'hd_dorm', description: '学生宿舍内部' },
    { key: 'LibraryScene', buildingName: 'CityLibrary', hdImageKey: 'hd_library', description: '图书馆内部' },
    { key: 'CafeScene', buildingName: 'CoffeeShop', hdImageKey: 'hd_cafe', description: '咖啡馆内部' },
    { key: 'PoliceScene', buildingName: 'PoliceStation', hdImageKey: 'hd_police', description: '警察局内部' },
    { key: 'LabScene', buildingName: 'ResearchLab', hdImageKey: 'hd_lab', description: '研究实验室内部' },
    { key: 'HomeScene', buildingName: 'PlayerHome', hdImageKey: 'hd_home', description: '玩家自宅内部' },
    { key: 'OfficeScene', buildingName: 'OfficeBuilding', hdImageKey: 'hd_office', description: '公司办公室内部' },
];

// ====================================================================
// 10个具体的内部场景实现 (占位符逻辑)
// ====================================================================

/**
 * @class GymScene
 * @description 篮球馆内部场景。
 */
export class GymScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[0]); }
    protected addInteractionLogic() {
        // 示例：添加一个返回按钮
        const { width, height } = this.sys.game.canvas;
        const exitText = this.add.text(width - 20, height - 20, '返回 (Exit)', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

        exitText.on('pointerdown', () => {
            this.transitionToMainScene();
        });
        console.log('GymScene specific logic added: Exit interaction implemented.');
    }
}

export class ShopScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[1]); }
    protected addInteractionLogic() { console.log('ShopScene specific logic added: Buy/Sell interface placeholder.'); }
}

export class HospitalScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[2]); }
    protected addInteractionLogic() { console.log('HospitalScene specific logic added: Healing services placeholder.'); }
}

export class DormScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[3]); }
    protected addInteractionLogic() { console.log('DormScene specific logic added: Rest and save game placeholder.'); }
}

export class LibraryScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[4]); }
    protected addInteractionLogic() { console.log('LibraryScene specific logic added: Research/Lore interaction placeholder.'); }
}

export class CafeScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[5]); }
    protected addInteractionLogic() { console.log('CafeScene specific logic added: NPC dialogue and item placeholder.'); }
}

export class PoliceScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[6]); }
    protected addInteractionLogic() { console.log('PoliceScene specific logic added: Quest giver/Report crime placeholder.'); }
}

export class LabScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[7]); }
    protected addInteractionLogic() { console.log('LabScene specific logic added: Evolution/Experiment placeholder.'); }
}

export class HomeScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[8]); }
    protected addInteractionLogic() { console.log('HomeScene specific logic added: PC storage/Family interaction placeholder.'); }
}

export class OfficeScene extends BaseInteriorScene {
    constructor() { super(InteriorSceneConfigs[9]); }
    protected addInteractionLogic() { console.log('OfficeScene specific logic added: Work/Mission briefing placeholder.'); }
}

/**
 * @const AllInteriorScenes
 * @description 包含所有10个内部场景类的数组，方便在游戏配置中统一注册。
 */
export const AllInteriorScenes = [
    GymScene, ShopScene, HospitalScene, DormScene, LibraryScene,
    CafeScene, PoliceScene, LabScene, HomeScene, OfficeScene
];

/**
 * @function getSceneClassByKey
 * @description 根据场景键名获取对应的场景类。
 * @param key 场景键名
 * @returns 对应的场景类或undefined
 */
export function getSceneClassByKey(key: string): (new () => BaseInteriorScene) | undefined {
    const config = InteriorSceneConfigs.find(c => c.key === key);
    if (!config) return undefined;

    switch (key) {
        case 'GymScene': return GymScene;
        case 'ShopScene': return ShopScene;
        case 'HospitalScene': return HospitalScene;
        case 'DormScene': return DormScene;
        case 'LibraryScene': return LibraryScene;
        case 'CafeScene': return CafeScene;
        case 'PoliceScene': return PoliceScene;
        case 'LabScene': return LabScene;
        case 'HomeScene': return HomeScene;
        case 'OfficeScene': return OfficeScene;
        default: return undefined;
    }
}

// --------------------------------------------------------------------
// 辅助功能：模拟主场景的入口函数和游戏配置 (用于演示和测试)
// --------------------------------------------------------------------

/**
 * @class MainScene
 * @extends Phaser.Scene
 * @description 模拟主地图场景，用于演示场景切换。
 *
 * 注意：在实际项目中，这应该是一个单独的文件。这里仅用于演示。
 */
export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // 预加载一个用于主场景的背景图
        this.load.image('main_map', 'assets/main_map.png');
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        this.add.image(width / 2, height / 2, 'main_map').setDisplaySize(width, height);

        this.add.text(width / 2, 50, '主地图场景 (MainScene)', { fontSize: '32px', color: '#000000' }).setOrigin(0.5);

        let yOffset = 100;
        // 添加进入所有内部场景的按钮
        InteriorSceneConfigs.forEach(config => {
            const button = this.add.text(width / 2, yOffset, `进入: ${config.description} (${config.buildingName})`, {
                fontSize: '24px',
                color: '#0000ff',
                backgroundColor: '#ffffff',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            button.on('pointerdown', () => {
                console.log(`Entering ${config.key}...`);
                // 切换到对应的内部场景
                this.scene.start(config.key, { entryPoint: config.buildingName });
            });

            yOffset += 50;
        });
    }

    init(data: any) {
        if (data.fromScene) {
            console.log(`Returned to MainScene from ${data.fromScene}. Exited from building: ${data.exitPoint}`);
            // 可以在这里处理玩家在地图上的位置更新
        }
    }
}

/**
 * @const GameConfig
 * @description Phaser 3 游戏配置。
 * 遵循Game Boy/宝可梦风格，使用低分辨率和像素艺术渲染。
 */
export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 256, // 经典Game Boy/GBC/GBA风格的低分辨率
    height: 224,
    parent: 'game-container',
    zoom: 3, // 放大以适应现代屏幕，同时保持像素艺术风格
    pixelArt: true, // 启用像素艺术渲染
    scene: [MainScene, ...AllInteriorScenes.map(SceneClass => new SceneClass())],
    scale: {
        mode: Phaser.Scale.FIT, // 适应屏幕
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    backgroundColor: '#000000'
};

/**
 * @function startGame
 * @description 启动Phaser游戏实例。
 */
export function startGame() {
    new Phaser.Game(GameConfig);
}

// --------------------------------------------------------------------
// 模块导出
// --------------------------------------------------------------------

export {
    InteriorSceneConfigs,
    BaseInteriorScene,
    GymScene, ShopScene, HospitalScene, DormScene, LibraryScene,
    CafeScene, PoliceScene, LabScene, HomeScene, OfficeScene,
    AllInteriorScenes
};
