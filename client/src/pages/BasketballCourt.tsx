import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { basketballCourtConfig } from '../game/config/basketballCourtConfig';
import { useLocation } from 'wouter';

/**
 * Kairosoft风格篮球场页面
 * 展示高质量的等距地图系统
 */
export default function BasketballCourt() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建Phaser游戏实例
    gameRef.current = new Phaser.Game({
      ...basketballCourtConfig,
      parent: containerRef.current
    });

    // 清理函数
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-all duration-200 flex items-center gap-2"
            >
              <span>←</span>
              <span>返回主页</span>
            </button>
            <h1 className="text-2xl font-bold text-white">
              🏀 Kairosoft风格篮球场地图
            </h1>
          </div>
          <div className="text-white text-sm">
            <p>使用 <span className="font-bold">WASD</span> 键移动角色</p>
          </div>
        </div>
      </div>

      {/* 游戏容器 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-4">
          <div
            ref={containerRef}
            id="phaser-game-container"
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">🎨 视觉特色</h3>
              <p className="text-sm text-sky-100">
                2:1等距投影 • 像素完美渲染 • 饱和色彩
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">🗺️ 地图元素</h3>
              <p className="text-sm text-sky-100">
                15种瓦片 • 篮球场 • 建筑物 • 装饰物
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">🎮 交互系统</h3>
              <p className="text-sm text-sky-100">
                WASD移动 • 相机跟随 • 深度排序
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

