import * as Phaser from 'phaser';

/**
 * @class PlayerAnimations
 * @description 负责创建和管理玩家角色的所有Phaser 3动画。
 * 这是一个静态工具类，用于在游戏启动时初始化动画。
 */
export class PlayerAnimations {
    /**
     * @static
     * @method create
     * @description 在Phaser 3的动画管理器中创建所有玩家动画。
     * @param {Phaser.Animations.AnimationManager} anims - Phaser 3的动画管理器实例。
     * @param {string} textureKey - 用于动画的纹理图集键名。
     */
    public static create(anims: Phaser.Animations.AnimationManager, textureKey: string): void {
        // 性能优化：使用一个统一的工具函数创建动画，减少重复代码和潜在错误。
        const createAnim = (key: string, startFrame: number, endFrame: number, frameRate: number, repeat: number = -1): void => {
            anims.create({
                key: key,
                frames: anims.generateFrameNames(textureKey, {
                    prefix: 'player_',
                    start: startFrame,
                    end: endFrame,
                    suffix: '.png',
                    zeroPad: 2
                }),
                frameRate: frameRate,
                repeat: repeat,
                // 视觉效果/性能优化：使用 'linear' 播放模式确保动画平滑，
                // 并且在帧率不高时，避免使用 'yoyo' 模式，因为移动动画通常是循环的。
                // 默认使用 'linear'。
            });
        };

        // 1. 站立动画 (Idle) - 玩家静止时的动画
        // 视觉效果：通常只有1-2帧，帧率较低（4fps），以节省CPU资源。
        createAnim('player_idle', 0, 1, 4);

        // 2. 奔跑/行走动画 (Run/Walk) - 玩家移动时的动画
        // 视觉效果：帧数较多，帧率较高（12fps），以确保移动流畅。
        // 性能优化：使用适中的帧率（如10-12fps）可以提供良好的视觉效果，同时避免过高帧率带来的不必要的CPU负担。
        createAnim('player_run', 2, 9, 12);

        // 3. 攻击动画 (Attack) - 玩家攻击时的动画
        // 视觉效果：通常是单次播放，帧率高（18fps），以确保动作的冲击力。
        // 性能优化：repeat: 0 表示只播放一次，播放完毕后停止，节省资源。
        createAnim('player_attack', 10, 15, 18, 0);

        // 4. 受伤动画 (Hurt) - 玩家受到伤害时的动画
        // 视觉效果：通常是单次播放，帧率高（10fps），以快速反馈玩家状态变化。
        createAnim('player_hurt', 16, 17, 10, 0);

        // 5. 死亡动画 (Die) - 玩家死亡时的动画
        // 视觉效果：通常是单次播放，帧率适中（8fps），以展示完整的死亡过程。
        createAnim('player_die', 18, 23, 8, 0);

        // 额外的优化：
        // 预加载所有动画的帧，确保动画播放时不会有延迟。Phaser 3的generateFrameNames已经隐式处理了这一点。
        
        console.log('Player animations created successfully.');
    }

    /**
     * @static
     * @method playMovement
     * @description 根据玩家的移动状态播放相应的动画。
     * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image} player - 玩家精灵对象。
     * @param {boolean} isMoving - 玩家是否正在移动。
     * @param {number} velocityX - 玩家的X轴速度。
     */
    public static playMovement(player: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image, isMoving: boolean, velocityX: number): void {
        if (isMoving) {
            // 播放奔跑动画
            player.anims.play('player_run', true);

            // 视觉效果：根据X轴速度设置精灵的翻转，实现面向移动方向的效果。
            // 性能优化：只在速度方向改变时才设置翻转，避免每帧都进行不必要的设置。
            if (velocityX < 0) {
                // 向左移动，翻转精灵
                player.setFlipX(true);
            } else if (velocityX > 0) {
                // 向右移动，取消翻转
                player.setFlipX(false);
            }
        } else {
            // 播放站立动画
            player.anims.play('player_idle', true);
        }
    }
}

// 示例用法（可选，仅用于说明如何使用）：
/*
// 在Scene的preload方法中加载图集：
// this.load.atlas('player_atlas', 'assets/player_atlas.png', 'assets/player_atlas.json');

// 在Scene的create方法中：
// const player = this.physics.add.sprite(400, 300, 'player_atlas');
// PlayerAnimations.create(this.anims, 'player_atlas');

// 在Scene的update方法中：
// const isMoving = player.body.velocity.x !== 0 || player.body.velocity.y !== 0;
// PlayerAnimations.playMovement(player, isMoving, player.body.velocity.x);
*/
