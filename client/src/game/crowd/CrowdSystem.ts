import Phaser from 'phaser';

// 定义单个观众的配置接口
interface CrowdMemberConfig {
    x: number;
    y: number;
    texture: string; // 观众使用的纹理/图集名称
    animationKey: string; // 默认动画键
    scale?: number; // 缩放比例
    depth?: number; // 深度，用于Z轴排序
}

// CrowdSystem的配置接口
interface CrowdSystemConfig {
    scene: Phaser.Scene;
    area: Phaser.Geom.Rectangle; // 观众分布的区域
    memberCount: number; // 观众总数
    memberTextures: string[]; // 可用的观众纹理列表
    soundKeys: {
        cheer: string;
        murmur: string;
        applause: string;
    };
}

/**
 * CrowdSystem 类
 * 负责管理游戏中的观众群，包括他们的视觉动画和环境声音。
 * 旨在实现高性能、高视觉效果和详细的注释。
 */
export default class CrowdSystem {
    private scene: Phaser.Scene;
    private config: CrowdSystemConfig;
    private crowdGroup: Phaser.GameObjects.Group; // 使用Group管理所有观众，方便批处理
    private soundManager: Phaser.Sound.BaseSoundManager;

    // 性能优化：用于存储观众对象的数组，方便遍历和更新
    private members: Phaser.GameObjects.Sprite[] = [];
    
    // 动画性能优化：用于存储所有观众的初始位置，方便重置或计算视差
    private initialPositions: { x: number, y: number }[] = [];

    // 声音管理：存储声音实例，以便控制播放和音量
    private crowdSounds: { [key: string]: Phaser.Sound.BaseSound } = {};

    /**
     * 构造函数
     * @param config - CrowdSystem的配置对象
     */
    constructor(config: CrowdSystemConfig) {
        this.scene = config.scene;
        this.config = config;
        this.soundManager = this.scene.sound;
        
        // 创建一个Group来管理观众Sprite，Group有助于Phaser进行内部优化
        this.crowdGroup = this.scene.add.group({
            runChildUpdate: true, // 允许Group中的子对象执行它们的update方法（如果需要）
            defaultKey: config.memberTextures[0] // 默认纹理
        });

        this.initializeCrowd();
        this.initializeSounds();
        
        // 注册场景的update事件，用于观众的周期性更新（如随机动作、视差滚动）
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * 初始化观众群：创建并定位所有观众Sprite。
     * 性能优化：使用随机分布和预计算位置。
     */
    private initializeCrowd(): void {
        const { area, memberCount, memberTextures } = this.config;
        
        // 预创建动画（假设在场景的preload或create阶段已经加载了图集和定义了动画）
        // 示例：确保至少有一个名为 'cheer' 的动画存在
        if (!this.scene.anims.exists('crowd_cheer')) {
             // 这是一个模拟的动画创建，实际项目中应在场景中预先定义
             this.scene.anims.create({
                 key: 'crowd_cheer',
                 frames: this.scene.anims.generateFrameNumbers(memberTextures[0], { start: 0, end: 3 }),
                 frameRate: 8,
                 repeat: -1
             });
        }
        
        for (let i = 0; i < memberCount; i++) {
            // 随机选择纹理
            const texture = Phaser.Utils.Array.GetRandom(memberTextures);
            
            // 在指定区域内随机生成位置
            const x = Phaser.Math.Between(area.x, area.x + area.width);
            const y = Phaser.Math.Between(area.y, area.y + area.height);
            
            // 视觉效果：根据Y坐标（深度）设置缩放和深度，实现近大远小的透视效果
            // 观众越靠下（Y值越大），越靠近玩家，缩放越大，深度越大。
            const t = (y - area.y) / area.height; // 归一化Y坐标 (0到1)
            const scale = Phaser.Math.Linear(0.5, 1.0, t); // 缩放从0.5到1.0
            const depth = y; // 深度直接使用Y坐标
            
            const member = this.scene.add.sprite(x, y, texture)
                .setScale(scale)
                .setDepth(depth)
                .setOrigin(0.5, 1); // 设置原点在底部中心，确保缩放时底部对齐地面
            
            // 播放默认动画
            member.play('crowd_cheer', true, Phaser.Math.Between(0, 3)); // 随机起始帧，避免同步
            
            this.crowdGroup.add(member);
            this.members.push(member);
            this.initialPositions.push({ x, y });
        }
        
        console.log(`CrowdSystem initialized with ${memberCount} members.`);
    }

    /**
     * 初始化环境声音。
     * 性能优化：使用循环音效，并设置较低的音量。
     */
    private initializeSounds(): void {
        const { soundKeys } = this.config;

        // 观众环境声 - 低音量循环播放
        this.crowdSounds['murmur'] = this.soundManager.add(soundKeys.murmur, {
            volume: 0.1,
            loop: true
        });
        this.crowdSounds['murmur'].play();
    }

    /**
     * 周期性更新函数，由场景的UPDATE事件触发。
     * @param time - 当前时间
     * @param delta - 自上次更新以来的时间差
     */
    public update(time: number, delta: number): void {
        // 性能优化：每隔一定时间（如500ms）才执行一次随机动作和视差计算，减少CPU开销
        if (time % 500 < delta) {
            this.randomizeMemberActions();
        }
        
        // 视差滚动效果（如果场景支持）
        // 假设有一个摄像机或背景滚动，这里实现一个简单的基于时间的微小晃动
        this.applySubtleMovement(time);
    }

    /**
     * 随机化部分观众的动作，增加视觉变化。
     * 视觉效果：让观众的动作不完全同步。
     */
    private randomizeMemberActions(): void {
        // 随机选择一小部分观众（例如5%）进行动作变化
        const count = Math.ceil(this.members.length * 0.05);
        const randomMembers = Phaser.Utils.Array.Shuffle(this.members).slice(0, count);

        randomMembers.forEach(member => {
            // 随机播放一个短暂的“欢呼”或“挥手”动画，然后返回默认动画
            const action = Phaser.Math.RND.pick(['cheer_short', 'wave', 'cheer']);
            
            if (action === 'cheer') {
                // 确保动画存在，并随机设置起始帧
                member.play('crowd_cheer', true, Phaser.Math.Between(0, 3));
            } else {
                // 假设 'cheer_short' 和 'wave' 是非循环动画
                // 播放一次后，监听complete事件，返回默认动画
                if (this.scene.anims.exists(action)) {
                    member.play(action);
                    member.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        member.play('crowd_cheer', true);
                    });
                }
            }
        });
    }
    
    /**
     * 应用微妙的移动效果，模拟观众的轻微晃动。
     * 性能优化：使用三角函数（sin/cos）进行平滑、低成本的移动。
     */
    private applySubtleMovement(time: number): void {
        const amplitude = 0.5; // 晃动幅度
        const speed = 0.001; // 晃动速度
        
        this.members.forEach((member, index) => {
            const initialPos = this.initialPositions[index];
            
            // 基于时间和观众索引的组合，计算水平和垂直偏移
            const offsetX = Math.sin(time * speed + index * 0.1) * amplitude;
            const offsetY = Math.cos(time * speed * 0.5 + index * 0.2) * amplitude * 0.5; // 垂直晃动更小
            
            member.x = initialPos.x + offsetX;
            member.y = initialPos.y + offsetY;
        });
    }

    /**
     * 触发观众欢呼声和动画高潮。
     * 视觉效果/声音效果：用于游戏中的关键时刻。
     */
    public triggerCheer(): void {
        const { soundKeys } = this.config;
        
        // 播放欢呼声和掌声
        if (this.soundManager.get(soundKeys.cheer)) {
            this.soundManager.play(soundKeys.cheer, { volume: 0.8 });
        }
        if (this.soundManager.get(soundKeys.applause)) {
            this.soundManager.play(soundKeys.applause, { volume: 0.6 });
        }
        
        // 视觉效果：让所有观众执行一次强烈的欢呼动画
        this.members.forEach(member => {
            // 假设 'cheer_intense' 是一个强烈的非循环欢呼动画
            if (this.scene.anims.exists('cheer_intense')) {
                member.play('cheer_intense');
                member.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    member.play('crowd_cheer', true); // 结束后返回默认循环动画
                });
            } else {
                 // 如果没有强烈动画，就强制重播默认动画，产生同步效果
                 member.play('crowd_cheer', true, 0);
            }
        });
    }

    /**
     * 销毁系统和所有资源。
     */
    public destroy(): void {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        
        // 停止所有声音
        Object.values(this.crowdSounds).forEach(sound => {
            sound.stop();
            sound.destroy();
        });
        this.crowdSounds = {};
        
        // 销毁Group及其所有子对象
        this.crowdGroup.destroy(true);
        this.members = [];
        this.initialPositions = [];
        console.log('CrowdSystem destroyed.');
    }
}

// ====================================================================
// 示例用法（在某个Scene的create方法中）
// 假设场景中已经加载了 'crowd_atlas' 图集和 'cheer_sound', 'murmur_sound', 'applause_sound' 音效

/*
class GameScene extends Phaser.Scene {
    private crowdSystem: CrowdSystem;

    preload() {
        // 预加载资源
        this.load.atlas('crowd_atlas', 'assets/crowd_atlas.png', 'assets/crowd_atlas.json');
        this.load.audio('cheer_sound', 'assets/cheer.mp3');
        this.load.audio('murmur_sound', 'assets/murmur.mp3');
        this.load.audio('applause_sound', 'assets/applause.mp3');
    }

    create() {
        // 1. 定义动画（重要：确保动画预先定义）
        this.anims.create({
            key: 'crowd_cheer',
            frames: this.anims.generateFrameNumbers('crowd_atlas', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'cheer_intense',
            frames: this.anims.generateFrameNumbers('crowd_atlas', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0 // 非循环
        });
        // ... 其他动画如 'cheer_short', 'wave'

        // 2. 初始化观众系统
        const crowdArea = new Phaser.Geom.Rectangle(50, 100, 700, 200); // 观众分布区域
        
        this.crowdSystem = new CrowdSystem({
            scene: this,
            area: crowdArea,
            memberCount: 150, // 观众数量，可根据性能调整
            memberTextures: ['crowd_atlas'], // 使用的图集键
            soundKeys: {
                cheer: 'cheer_sound',
                murmur: 'murmur_sound',
                applause: 'applause_sound'
            }
        });

        // 3. 游戏事件触发欢呼
        // this.time.delayedCall(5000, () => {
        //     this.crowdSystem.triggerCheer();
        // });
    }
    
    // update() {
    //     // CrowdSystem 已经在构造函数中注册了场景的 update 事件，无需在此手动调用
    // }
    
    // shutdown() {
    //    this.crowdSystem.destroy();
    // }
}
*/
// ====================================================================