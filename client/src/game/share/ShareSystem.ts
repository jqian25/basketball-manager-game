import Phaser from 'phaser';

/**
 * 成就分享系统
 * 负责游戏的成就截图、本地保存和分享功能。
 * 依赖于Phaser.Game的截图功能和浏览器的下载/分享API。
 */
export class ShareSystem {
    private scene: Phaser.Scene;
    private game: Phaser.Game;

    /**
     * 构造函数
     * @param scene Phaser场景实例，用于访问游戏对象和配置。
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.game = scene.game;
        console.log('ShareSystem initialized.');
    }

    /**
     * 截取整个游戏画面的截图。
     * @param callback 截图完成后执行的回调函数，接收一个包含截图数据的Base64字符串。
     * @param format 截图格式，默认为'image/png'。
     * @param encoderOptions 截图编码选项，0到1之间的数字，仅对'image/jpeg'或'image/webp'有效。
     */
    public takeScreenshot(callback: (data: string) => void, format: string = 'image/png', encoderOptions?: number): void {
        // 确保游戏已渲染，截图操作通常在下一帧执行
        this.game.renderer.snapshot(
            (image: HTMLImageElement | string) => {
                // Phaser的snapshot回调会返回一个HTMLImageElement或Base64字符串
                let dataUrl: string;
                if (typeof image === 'string') {
                    dataUrl = image;
                } else {
                    // 如果返回的是HTMLImageElement，需要将其转换为DataURL
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(image, 0, 0);
                        dataUrl = canvas.toDataURL(format, encoderOptions);
                    } else {
                        console.error('Canvas context is null, cannot convert image to DataURL.');
                        return;
                    }
                }
                
                // 确保DataURL是Base64格式
                if (dataUrl && dataUrl.startsWith('data:')) {
                    callback(dataUrl);
                } else {
                    console.error('Screenshot failed: Invalid data URL returned.');
                }
            },
            format,
            encoderOptions
        );
    }

    /**
     * 截取特定区域的截图（例如成就弹窗）。
     * 注意：Phaser的snapshot API默认截取整个游戏画布。
     * 为了截取特定区域，我们需要在回调中对整个截图进行裁剪。
     * 
     * @param rect 待裁剪的区域矩形 { x, y, width, height }，基于游戏画布坐标。
     * @param callback 截图完成后执行的回调函数，接收一个包含截图数据的Base64字符串。
     * @param format 截图格式，默认为'image/png'。
     * @param encoderOptions 截图编码选项。
     */
    public takeRegionScreenshot(
        rect: { x: number, y: number, width: number, height: number },
        callback: (data: string) => void,
        format: string = 'image/png',
        encoderOptions?: number
    ): void {
        this.game.renderer.snapshot(
            (image: HTMLImageElement | string) => {
                let sourceImage: HTMLImageElement;
                if (typeof image === 'string') {
                    // 如果是Base64字符串，先创建一个Image对象
                    sourceImage = new Image();
                    sourceImage.onload = () => this.cropAndCallback(sourceImage, rect, callback, format, encoderOptions);
                    sourceImage.src = image;
                } else {
                    sourceImage = image;
                    this.cropAndCallback(sourceImage, rect, callback, format, encoderOptions);
                }
            },
            format,
            encoderOptions
        );
    }

    /**
     * 内部方法：裁剪图片并执行回调。
     */
    private cropAndCallback(
        sourceImage: HTMLImageElement,
        rect: { x: number, y: number, width: number, height: number },
        callback: (data: string) => void,
        format: string,
        encoderOptions?: number
    ): void {
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // 使用drawImage进行裁剪
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ctx.drawImage(
                sourceImage,
                rect.x, rect.y, rect.width, rect.height, // 源图像裁剪区域
                0, 0, rect.width, rect.height             // 目标画布放置区域
            );
            
            const dataUrl = canvas.toDataURL(format, encoderOptions);
            callback(dataUrl);
        } else {
            console.error('Canvas context is null, cannot perform cropping.');
        }
    }

    /**
     * 将Base64格式的截图数据下载到用户的本地设备。
     * @param dataUrl Base64格式的图片数据 (e.g., 'data:image/png;base64,...')
     * @param filename 下载文件的名称，默认为 'achievement_screenshot.png'
     */
    public downloadScreenshot(dataUrl: string, filename: string = 'achievement_screenshot.png'): void {
        try {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Screenshot downloaded as ${filename}`);
        } catch (error) {
            console.error('Failed to download screenshot:', error);
            alert('截图下载失败，请检查浏览器设置或尝试右键保存图片。');
        }
    }

    /**
     * 使用Web Share API进行分享（仅在支持的浏览器和移动设备上可用）。
     * @param dataUrl Base64格式的图片数据
     * @param title 分享标题
     * @param text 分享文本
     * @param filename 文件名，用于转换为File对象
     */
    public async shareScreenshot(dataUrl: string, title: string = '我的游戏成就', text: string = '快来看看我在游戏中解锁的新成就！'): Promise<void> {
        if (!navigator.share) {
            console.warn('Web Share API is not supported in this browser. Falling back to download or manual sharing.');
            alert('您的浏览器不支持Web分享功能，请尝试下载图片后手动分享。');
            return;
        }

        try {
            // 将DataURL转换为Blob，再转换为File对象
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'achievement.png', { type: blob.type });

            const shareData: ShareData = {
                files: [file],
                title: title,
                text: text,
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log('Screenshot shared successfully.');
            } else {
                console.warn('Cannot share this data (e.g., file type not supported or missing text/url).');
                // 尝试不带文件的分享作为降级
                await navigator.share({ title: title, text: text });
            }
        } catch (error) {
            // 用户取消分享也会进入catch
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Sharing cancelled by user.');
            } else {
                console.error('Error sharing screenshot:', error);
            }
        }
    }

    /**
     * 完整的成就分享流程：截图 -> 尝试分享 -> 降级到下载。
     * 
     * @param achievementElementOrRect 可选参数，如果提供，则截取特定区域。
     *                                 可以是HTML元素（用于获取位置）或裁剪矩形 { x, y, width, height }。
     * @param shareTitle 分享标题
     * @param shareText 分享文本
     * @param filename 下载文件名
     */
    public async triggerAchievementShare(
        achievementElementOrRect?: { x: number, y: number, width: number, height: number } | HTMLElement,
        shareTitle: string = '我的游戏成就',
        shareText: string = '快来看看我在游戏中解锁的新成就！',
        filename: string = 'achievement_screenshot.png'
    ): Promise<void> {
        let rect: { x: number, y: number, width: number, height: number } | undefined;

        if (achievementElementOrRect instanceof HTMLElement) {
            // 如果传入的是HTML元素，计算其在Phaser画布上的相对位置和大小
            const bounds = achievementElementOrRect.getBoundingClientRect();
            const canvasBounds = this.game.canvas.getBoundingClientRect();

            // 假设Phaser画布全屏或与视口大小一致，这里简化处理，直接使用DOM坐标
            // 实际生产环境中，需要考虑Phaser的缩放和全屏模式
            rect = {
                x: bounds.left - canvasBounds.left,
                y: bounds.top - canvasBounds.top,
                width: bounds.width,
                height: bounds.height
            };
            console.log('Calculated screenshot rect from element:', rect);
        } else if (achievementElementOrRect) {
            rect = achievementElementOrRect;
        }

        const screenshotCallback = async (dataUrl: string) => {
            // 1. 尝试使用Web Share API分享
            if (navigator.share) {
                await this.shareScreenshot(dataUrl, shareTitle, shareText);
            } else {
                // 2. 如果不支持Web Share API，则自动下载
                this.downloadScreenshot(dataUrl, filename);
            }
        };

        if (rect) {
            this.takeRegionScreenshot(rect, screenshotCallback);
        } else {
            this.takeScreenshot(screenshotCallback);
        }
    }

    /**
     * 示例用法：将此系统集成到Phaser场景中
     * 
     * // 在某个场景的create方法中：
     * // this.shareSystem = new ShareSystem(this);
     * 
     * // 触发分享（截取整个屏幕）：
     * // this.shareSystem.triggerAchievementShare();
     * 
     * // 触发分享（截取特定区域，例如一个成就弹窗的坐标）：
     * // const achievementRect = { x: 100, y: 100, width: 400, height: 200 };
     * // this.shareSystem.triggerAchievementShare(achievementRect, '新的里程碑', '我刚刚完成了史诗级成就！');
     */
}

// 导出类型，方便其他模块使用
export default ShareSystem;