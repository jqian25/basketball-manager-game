/**
 * client/src/game/audio/AudioManager.ts
 *
 * 宝可梦Game Boy风格的Phaser 3音效管理器。
 * 实现了背景音乐(BGM)和音效(SFX)的独立管理、音量控制和淡入淡出效果。
 * 设计为单例模式，确保全局唯一的音效控制中心。
 *
 * 遵循原则:
 * 1. 简洁、高性能的音频播放和控制。
 * 2. 独立控制BGM和SFX的音量，并提供全局主音量。
 * 3. 使用Phaser的Tween管理器实现平滑的淡入淡出效果。
 */

import * as Phaser from 'phaser';

// 定义音频类型
export enum AudioType {
    BGM = 'bgm',
    SFX = 'sfx',
}

// 定义音频管理器配置
interface AudioConfig {
    masterVolume: number; // 主音量 (0.0 to 1.0)
    bgmVolume: number;    // 背景音乐音量 (0.0 to 1.0)
    sfxVolume: number;    // 音效音量 (0.0 to 1.0)
}

export class AudioManager {
    private static instance: AudioManager;
    private scene: Phaser.Scene;
    private config: AudioConfig;

    // 当前正在播放的BGM
    private currentBGM: Phaser.Sound.BaseSound | null = null;
    // BGM的音量Tween动画
    private bgmTween: Phaser.Tweens.Tween | null = null;

    /**
     * 私有构造函数，实现单例模式。
     * @param scene Phaser场景实例
     */
    private constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // 默认配置，符合Game Boy风格的初始音量（通常是全开）
        this.config = {
            masterVolume: 1.0,
            bgmVolume: 0.8,
            sfxVolume: 1.0,
        };
    }

    /**
     * 获取AudioManager的单例实例。
     * @param scene 首次调用时需要传入Phaser场景实例
     * @returns AudioManager实例
     */
    public static getInstance(scene?: Phaser.Scene): AudioManager {
        if (!AudioManager.instance) {
            if (!scene) {
                throw new Error("AudioManager must be initialized with a Phaser.Scene instance.");
            }
            AudioManager.instance = new AudioManager(scene);
        }
        return AudioManager.instance;
    }

    /**
     * 根据音频类型和主音量计算最终音量。
     * 最终音量 = 主音量 * 类型音量 * 基础音量
     * @param type 音频类型 (BGM 或 SFX)
     * @param baseVolume 基础音量 (传入的音量参数)
     * @returns 最终播放音量
     */
    private calculateVolume(type: AudioType, baseVolume: number): number {
        const typeVolume = type === AudioType.BGM ? this.config.bgmVolume : this.config.sfxVolume;
        return this.config.masterVolume * typeVolume * baseVolume;
    }

    // --- 音量控制 API ---

    /**
     * 设置主音量。
     * @param volume 主音量 (0.0 to 1.0)
     */
    public setMasterVolume(volume: number): void {
        this.config.masterVolume = Phaser.Math.Clamp(volume, 0, 1);
        this.updateCurrentBGMVolume();
    }

    /**
     * 设置背景音乐音量。
     * @param volume BGM音量 (0.0 to 1.0)
     */
    public setBGMVolume(volume: number): void {
        this.config.bgmVolume = Phaser.Math.Clamp(volume, 0, 1);
        this.updateCurrentBGMVolume();
    }

    /**
     * 设置音效音量。
     * @param volume SFX音量 (0.0 to 1.0)
     */
    public setSFXVolume(volume: number): void {
        this.config.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    }

    /**
     * 获取配置的音量。
     * @param type 音频类型
     * @returns 音量值 (0.0 to 1.0)
     */
    public getVolume(type: AudioType | 'master'): number {
        switch (type) {
            case 'master':
                return this.config.masterVolume;
            case AudioType.BGM:
                return this.config.bgmVolume;
            case AudioType.SFX:
                return this.config.sfxVolume;
        }
    }

    /**
     * 更新当前BGM的实际播放音量。
     * 用于在不进行淡入淡出时，实时响应音量配置的改变。
     */
    private updateCurrentBGMVolume(): void {
        // 只有在没有音量Tween动画进行时才直接设置音量，避免冲突
        if (this.currentBGM && !this.bgmTween) {
            const finalVolume = this.calculateVolume(AudioType.BGM, 1.0); // 假设BGM的baseVolume为1.0
            this.currentBGM.setVolume(finalVolume);
        }
    }

    // --- BGM 管理 API ---

    /**
     * 播放背景音乐，支持淡入效果。
     * 如果有BGM正在播放，会先停止。
     * @param key 音频资源键名
     * @param loop 是否循环播放 (默认: true)
     * @param duration 淡入时间 (毫秒，默认: 0，即不淡入)
     * @param baseVolume 基础音量 (0.0 to 1.0, 默认: 1.0)
     */
    public playBGM(key: string, loop: boolean = true, duration: number = 0, baseVolume: number = 1.0): void {
        // 1. 停止当前的BGM和所有Tween
        this.stopBGM(0);

        // 2. 创建并配置新的BGM
        this.currentBGM = this.scene.sound.add(key, { loop: loop });
        const finalVolume = this.calculateVolume(AudioType.BGM, baseVolume);

        if (duration > 0) {
            // 淡入逻辑
            this.currentBGM.setVolume(0);
            this.currentBGM.play();

            this.bgmTween = this.scene.tweens.add({
                targets: this.currentBGM,
                volume: finalVolume,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    this.bgmTween = null;
                }
            });
        } else {
            // 直接播放
            this.currentBGM.setVolume(finalVolume);
            this.currentBGM.play();
        }
    }

    /**
     * 停止当前背景音乐，支持淡出效果。
     * @param duration 淡出时间 (毫秒，默认: 0，即立即停止)
     */
    public stopBGM(duration: number = 0): void {
        if (!this.currentBGM) {
            return;
        }

        // 停止任何正在进行的BGM音量Tween
        if (this.bgmTween) {
            this.bgmTween.stop();
            this.bgmTween = null;
        }

        if (duration > 0) {
            // 淡出逻辑
            const bgmToStop = this.currentBGM; // 引用当前BGM，防止在Tween完成前被新的playBGM覆盖
            this.currentBGM = null; // 立即清除currentBGM引用，防止updateCurrentBGMVolume干扰
            
            this.bgmTween = this.scene.tweens.add({
                targets: bgmToStop,
                volume: 0,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    bgmToStop.stop();
                    this.bgmTween = null;
                }
            });
        } else {
            // 立即停止
            this.currentBGM.stop();
            this.currentBGM = null;
        }
    }

    /**
     * 交叉淡入淡出背景音乐。
     * @param newKey 新BGM的音频资源键名
     * @param fadeOutDuration 旧BGM淡出时间 (毫秒)
     * @param fadeInDuration 新BGM淡入时间 (毫秒)
     * @param baseVolume 基础音量 (0.0 to 1.0, 默认: 1.0)
     */
    public crossFadeBGM(newKey: string, fadeOutDuration: number, fadeInDuration: number, baseVolume: number = 1.0): void {
        const oldBGM = this.currentBGM;
        
        // 1. 停止旧BGM的Tween
        if (this.bgmTween) {
            this.bgmTween.stop();
            this.bgmTween = null;
        }

        // 2. 创建并配置新的BGM
        const newBGM = this.scene.sound.add(newKey, { loop: true });
        const finalVolume = this.calculateVolume(AudioType.BGM, baseVolume);

        // 3. 播放新BGM并开始淡入
        newBGM.setVolume(0);
        newBGM.play();
        this.currentBGM = newBGM;

        // 新BGM淡入 Tween
        this.bgmTween = this.scene.tweens.add({
            targets: newBGM,
            volume: finalVolume,
            duration: fadeInDuration,
            ease: 'Linear',
            onComplete: () => {
                this.bgmTween = null;
            }
        });

        // 4. 旧BGM淡出 Tween
        if (oldBGM) {
            this.scene.tweens.add({
                targets: oldBGM,
                volume: 0,
                duration: fadeOutDuration,
                ease: 'Linear',
                onComplete: () => {
                    oldBGM.stop();
                    // 销毁旧的音频实例以释放资源，Phaser的SoundManager会处理
                }
            });
        }
    }

    // --- SFX 管理 API ---

    /**
     * 播放音效。
     * Game Boy风格通常是单声道、瞬时、且不循环的音效。
     * @param key 音频资源键名
     * @param baseVolume 基础音量 (0.0 to 1.0, 默认: 1.0)
     * @param config 可选的Phaser.Types.Sound.SoundConfig配置
     * @returns 播放的Phaser.Sound.BaseSound实例
     */
    public playSFX(key: string, baseVolume: number = 1.0, config?: Phaser.Types.Sound.SoundConfig): Phaser.Sound.BaseSound {
        const finalVolume = this.calculateVolume(AudioType.SFX, baseVolume);
        
        const sfxConfig: Phaser.Types.Sound.SoundConfig = {
            ...config,
            volume: finalVolume,
            loop: false, // SFX通常不循环
        };

        // 使用play方法，Phaser会自动处理音效的播放和销毁
        const sfx = this.scene.sound.play(key, sfxConfig);
        
        return sfx;
    }

    /**
     * 停止所有正在播放的音效。
     * 注意：这会停止所有非BGM的音频。
     */
    public stopAllSFX(): void {
        // 遍历所有声音实例并停止非BGM的实例
        this.scene.sound.getAll().forEach(sound => {
            // 检查是否是当前BGM实例，如果是则跳过
            if (sound !== this.currentBGM && sound.isPlaying) {
                sound.stop();
            }
        });
    }

    /**
     * 停止所有音频 (包括BGM和SFX)。
     */
    public stopAll(): void {
        this.scene.sound.stopAll();
        this.currentBGM = null;
        if (this.bgmTween) {
            this.bgmTween.stop();
            this.bgmTween = null;
        }
    }

    /**
     * 静音/取消静音所有音频。
     * @param muted 是否静音
     */
    public setMute(muted: boolean): void {
        this.scene.sound.mute = muted;
    }

    /**
     * 检查是否处于静音状态。
     * @returns 是否静音
     */
    public isMuted(): boolean {
        return this.scene.sound.mute;
    }
}

/**
 * 辅助函数，方便在其他模块中获取AudioManager实例。
 * @param scene Phaser场景实例
 * @returns AudioManager实例
 */
export function getAudioManager(scene: Phaser.Scene): AudioManager {
    return AudioManager.getInstance(scene);
}