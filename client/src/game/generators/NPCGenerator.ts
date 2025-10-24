// client/src/game/generators/NPCGenerator.ts

/**
 * @fileoverview NPC角色生成器模块
 * @description 
 * 实现了符合Game Boy风格宝可梦游戏标准的NPC角色生成逻辑。
 * 支持20种不同NPC类型，每种类型具有4方向（上、下、左、右）8帧动画。
 * 动画帧的布局遵循常见的精灵表规范：
 * - 4行（方向）：下、上、左、右
 * - 8列（帧）：0-7
 * 
 * 每一行动画帧的顺序为：
 * [站立帧, 走动帧1, 站立帧, 走动帧2, 站立帧, 走动帧3, 站立帧, 走动帧4]
 * 
 * 为了简化和符合经典宝可梦的行走动画，我们使用帧索引 0 (站立), 1 (走动帧1), 3 (走动帧2) 来创建基本的行走动画序列 [1, 0, 3, 0]。
 */

import * as Phaser from 'phaser';

// -----------------------------------------------------------------------------
// 1. 类型定义和接口
// -----------------------------------------------------------------------------

/**
 * 定义NPC的朝向。
 */
export type NPCDirection = 'down' | 'up' | 'left' | 'right';

/**
 * 定义NPC的行走状态。
 */
export type NPCState = 'idle' | 'walk';

/**
 * 定义所有支持的NPC类型。
 * 包含要求的20种不同NPC类型。
 */
export const NPCTypes = [
    'player', 'coach', 'student', 'doctor', 'merchant', 
    'old_man', 'old_woman', 'boy', 'girl', 'policeman',
    'scientist', 'waitress', 'hiker', 'fisherman', 'swimmer',
    'biker', 'juggler', 'artist', 'chef', 'gardener'
] as const;
export type NPCType = typeof NPCTypes[number];

/**
 * NPC配置接口。
 * 描述了生成一个NPC所需的全部信息。
 */
export interface NPCConfig {
    /** NPC的唯一标识符 */
    id: string;
    /** NPC的类型，对应精灵表中的一个角色 */
    type: NPCType;
    /** NPC在地图上的初始X坐标 (瓦片坐标) */
    tileX: number;
    /** NPC在地图上的初始Y坐标 (瓦片坐标) */
    tileY: number;
    /** NPC的初始朝向 */
    direction: NPCDirection;
    /** 精灵表中单个NPC瓦片的宽度 (像素) */
    frameWidth: number;
    /** 精灵表中单个NPC瓦片的高度 (像素) */
    frameHeight: number;
    /** 精灵表资源的关键名称 (Phaser Asset Key) */
    assetKey: string;
}

/**
 * NPC动画配置接口。
 * 描述了生成一个NPC动画所需的全部信息。
 */
export interface NPCAnimationConfig {
    key: string;
    frames: number[];
    frameRate: number;
    repeat: number;
}

// -----------------------------------------------------------------------------
// 2. 核心逻辑 - 帧计算和动画生成
// -----------------------------------------------------------------------------

/**
 * 根据方向和帧索引计算精灵表中的帧号。
 * 
 * 精灵表布局（4行 x 8列）：
 * 行 0: down (下)
 * 行 1: up (上)
 * 行 2: left (左)
 * 行 3: right (右)
 * 列 0-7: 动画帧
 * 
 * 帧号 = (行索引 * 8) + 列索引
 * 
 * @param direction NPC朝向
 * @param frameIndex 动画帧的列索引 (0-7)
 * @returns 精灵表中的全局帧号
 */
export function getFrameIndex(direction: NPCDirection, frameIndex: number): number {
    const directionMap: Record<NPCDirection, number> = {
        down: 0,
        up: 1,
        left: 2,
        right: 3,
    };

    const rowIndex = directionMap[direction];
    // 确保帧索引在 0-7 范围内
    const colIndex = Math.min(Math.max(frameIndex, 0), 7); 

    // 假设每个NPC类型在精灵表中占据 4行 x 8列 = 32帧
    // 实际的帧号计算需要考虑NPC类型在整个大精灵表中的偏移量。
    // 在这个简化版本中，我们假设每个NPC类型都有自己的独立小精灵表。
    return (rowIndex * 8) + colIndex;
}

/**
 * 生成一个方向上的行走动画帧序列。
 * 
 * 使用帧索引：
 * 0: 站立 (Idle)
 * 1: 走动帧1 (Walk Frame 1)
 * 3: 走动帧2 (Walk Frame 2)
 * 
 * 动画序列: [1, 0, 3, 0]
 * 
 * @param direction NPC朝向
 * @param type NPC类型 (用于区分不同NPC的帧偏移，本例中简化处理)
 * @returns 动画配置对象
 */
function createWalkAnimationFrames(direction: NPCDirection, type: NPCType): NPCAnimationConfig {
    // 实际的帧索引，对应精灵表中的列
    // 宝可梦风格的行走动画通常是 [左脚, 站立, 右脚, 站立]
    const walkFrames = [1, 0, 3, 0]; 
    
    // 将列索引转换为全局帧号
    const frames = walkFrames.map(colIndex => getFrameIndex(direction, colIndex));

    return {
        key: `${type}_walk_${direction}`,
        frames: frames,
        frameRate: 8, // 动画播放速度，可调
        repeat: -1,   // 循环播放
    };
}

/**
 * 生成一个方向上的站立动画帧序列。
 * 
 * 使用帧索引：
 * 0: 站立 (Idle)
 * 
 * @param direction NPC朝向
 * @param type NPC类型
 * @returns 动画配置对象
 */
function createIdleAnimationFrames(direction: NPCDirection, type: NPCType): NPCAnimationConfig {
    const frame = getFrameIndex(direction, 0);

    return {
        key: `${type}_idle_${direction}`,
        frames: [frame],
        frameRate: 0, // 站立动画不需要帧率
        repeat: 0,    // 不循环
    };
}

/**
 * 为给定的NPC类型在Phaser的动画管理器中创建所有必要的动画。
 * 
 * @param scene 当前的Phaser场景
 * @param type NPC类型
 * @param assetKey 精灵表资源的关键名称
 */
export function createNPCAnimations(scene: Phaser.Scene, type: NPCType, assetKey: string): void {
    const directions: NPCDirection[] = ['down', 'up', 'left', 'right'];

    for (const direction of directions) {
        // 1. 创建站立动画
        const idleConfig = createIdleAnimationFrames(direction, type);
        // 检查动画是否已存在，避免重复创建
        if (!scene.anims.exists(idleConfig.key)) {
            scene.anims.create({
                key: idleConfig.key,
                frames: scene.anims.generateFrameNumbers(assetKey, { frames: idleConfig.frames }),
                frameRate: idleConfig.frameRate,
                repeat: idleConfig.repeat,
            });
        }

        // 2. 创建行走动画
        const walkConfig = createWalkAnimationFrames(direction, type);
        // 检查动画是否已存在，避免重复创建
        if (!scene.anims.exists(walkConfig.key)) {
            scene.anims.create({
                key: walkConfig.key,
                frames: scene.anims.generateFrameNumbers(assetKey, { frames: walkConfig.frames }),
                frameRate: walkConfig.frameRate,
                repeat: walkConfig.repeat,
            });
        }
    }
}


// -----------------------------------------------------------------------------
// 3. NPC 生成器类
// -----------------------------------------------------------------------------

/**
 * NPC角色生成器类。
 * 负责根据配置生成Phaser的精灵对象，并管理其动画。
 * 
 * 性能优化：
 * 1. 动画预创建：在构造函数中一次性为所有NPC类型创建动画，避免运行时重复创建。
 * 2. Map存储：使用Map存储NPC精灵，通过ID快速查找。
 */
export class NPCGenerator {
    private scene: Phaser.Scene;
    private configs: NPCConfig[];
    private npcs: Map<string, Phaser.GameObjects.Sprite> = new Map();

    /**
     * 构造函数。
     * @param scene 当前的Phaser场景。
     * @param configs 待生成的NPC配置列表。
     */
    constructor(scene: Phaser.Scene, configs: NPCConfig[]) {
        this.scene = scene;
        this.configs = configs;
        
        // 预先创建所有需要的动画
        this.createAllAnimations();
    }

    /**
     * 为所有配置中的NPC类型创建动画。
     * 确保每个类型只创建一次动画。
     */
    private createAllAnimations(): void {
        const processedTypes = new Set<NPCType>();
        for (const config of this.configs) {
            if (!processedTypes.has(config.type)) {
                // 假设所有相同类型的NPC使用相同的assetKey
                createNPCAnimations(this.scene, config.type, config.assetKey);
                processedTypes.add(config.type);
            }
        }
    }

    /**
     * 生成并初始化所有NPC精灵。
     * @returns 生成的NPC精灵数组。
     */
    public generateAll(): Phaser.GameObjects.Sprite[] {
        const generatedNPCs: Phaser.GameObjects.Sprite[] = [];

        for (const config of this.configs) {
            const npc = this.generateNPC(config);
            generatedNPCs.push(npc);
        }

        return generatedNPCs;
    }

    /**
     * 根据单个配置生成一个NPC精灵对象。
     * @param config NPC配置。
     * @returns 生成的Phaser精灵对象。
     */
    private generateNPC(config: NPCConfig): Phaser.GameObjects.Sprite {
        const { id, type, tileX, tileY, direction, assetKey, frameWidth, frameHeight } = config;

        // 1. 计算像素坐标
        // 假设瓦片大小为 frameWidth x frameHeight
        const pixelX = tileX * frameWidth + frameWidth / 2;
        const pixelY = tileY * frameHeight + frameHeight / 2;

        // 2. 创建精灵
        const npc = this.scene.add.sprite(pixelX, pixelY, assetKey);
        
        // 设置初始帧和朝向
        const initialFrame = getFrameIndex(direction, 0);
        npc.setFrame(initialFrame);
        
        // 设置精灵的尺寸和原点
        npc.setDisplaySize(frameWidth, frameHeight);
        npc.setOrigin(0.5, 0.5); // 居中对齐

        // 3. 存储和返回
        npc.name = id;
        // 使用 setData 存储NPC的元数据，方便后续逻辑访问
        npc.setData('type', type);
        npc.setData('direction', direction);
        npc.setData('state', 'idle'); // 初始状态为站立

        this.npcs.set(id, npc);
        
        // 4. 播放初始站立动画
        this.playAnimation(npc, 'idle', direction);

        return npc;
    }

    /**
     * 播放NPC的动画。
     * @param npc 要播放动画的精灵对象。
     * @param state NPC状态 ('idle' 或 'walk')。
     * @param direction NPC朝向。
     */
    public playAnimation(npc: Phaser.GameObjects.Sprite, state: NPCState, direction: NPCDirection): void {
        const type = npc.getData('type') as NPCType;
        const animationKey = `${type}_${state}_${direction}`;
        
        // 检查动画是否存在，避免运行时错误
        if (this.scene.anims.exists(animationKey)) {
            // 只有当前动画不同时才播放，减少不必要的CPU/GPU开销
            if (npc.anims.getCurrentKey() !== animationKey) {
                npc.play(animationKey);
            }
            npc.setData('state', state);
            npc.setData('direction', direction);
        } else {
            // 动画不存在时，设置到正确的站立帧，保证视觉正确性
            const initialFrame = getFrameIndex(direction, 0);
            npc.setFrame(initialFrame);
            console.warn(`Animation key not found: ${animationKey}. Setting to static frame.`);
        }
    }

    /**
     * 获取指定ID的NPC精灵。
     * @param id NPC的唯一标识符。
     * @returns Phaser精灵对象或 undefined。
     */
    public getNPC(id: string): Phaser.GameObjects.Sprite | undefined {
        return this.npcs.get(id);
    }
}

// -----------------------------------------------------------------------------
// 4. 辅助函数 - 移动和停止 (便于在游戏逻辑中调用)
// -----------------------------------------------------------------------------

/**
 * 模拟NPC的移动逻辑。
 * @param npc 要移动的NPC精灵。
 * @param newDirection 新的朝向。
 */
export function moveNPC(npc: Phaser.GameObjects.Sprite, newDirection: NPCDirection): void {
    const currentDirection = npc.getData('direction') as NPCDirection;
    const currentState = npc.getData('state') as NPCState;
    // 假设 NPCGenerator 实例存储在场景的 data 属性中
    const generator = npc.scene.data.get('npcGenerator') as NPCGenerator; 

    if (!generator) {
        console.error("NPCGenerator instance not found in scene data. Cannot control NPC.");
        return;
    }

    // 1. 播放行走动画 (如果当前不是行走状态或方向改变)
    if (currentState !== 'walk' || newDirection !== currentDirection) {
        generator.playAnimation(npc, 'walk', newDirection);
    }

    // 2. 模拟移动 (在实际游戏循环中，这通常由物理引擎处理)
    const speed = 1.5; // 像素/帧
    switch (newDirection) {
        case 'up':
            npc.y -= speed;
            break;
        case 'down':
            npc.y += speed;
            break;
        case 'left':
            npc.x -= speed;
            break;
        case 'right':
            npc.x += speed;
            break;
    }
}

/**
 * 停止NPC移动并切换到站立动画。
 * @param npc 要停止的NPC精灵。
 */
export function stopNPC(npc: Phaser.GameObjects.Sprite): void {
    const currentDirection = npc.getData('direction') as NPCDirection;
    const generator = npc.scene.data.get('npcGenerator') as NPCGenerator;

    if (generator && npc.getData('state') === 'walk') {
        generator.playAnimation(npc, 'idle', currentDirection);
    }
}