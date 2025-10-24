import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ShootingGameScene, LEVEL_1_1 } from '../game/scenes/ShootingGameScene';

/**
 * 投篮小游戏页面
 */
export default function ShootingGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      parent: 'shooting-game-container',
      backgroundColor: '#87CEEB',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 2 },
          debug: false
        }
      },
      scene: [ShootingGameScene]
    };

    gameRef.current = new Phaser.Game(config);

    // 启动场景并传入关卡数据
    gameRef.current.scene.start('ShootingGameScene', { level: LEVEL_1_1 });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          🏀 篮球投篮挑战
        </h1>
        <p className="text-xl text-white text-center mt-2">
          拖拽篮球，瞄准篮筐，投出完美弧线！
        </p>
      </div>
      
      <div 
        id="shooting-game-container" 
        className="border-4 border-white rounded-lg shadow-2xl"
      />

      <div className="mt-6 bg-white/90 rounded-lg p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">游戏说明</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold text-orange-600 mb-2">🏀 篮球类型</h3>
            <ul className="space-y-1 text-gray-700">
              <li>🟠 <strong>普通球</strong> - 标准弹道</li>
              <li>🟡 <strong>加速球</strong> - 点击加速</li>
              <li>⚫ <strong>爆炸球</strong> - 撞击爆炸</li>
              <li>🔵 <strong>分裂球</strong> - 点击分裂</li>
              <li>🟢 <strong>回旋球</strong> - 回旋效果</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-orange-600 mb-2">⭐ 评分标准</h3>
            <ul className="space-y-1 text-gray-700">
              <li>⭐⭐⭐ 使用1-2个篮球</li>
              <li>⭐⭐ 使用3-4个篮球</li>
              <li>⭐ 使用5+个篮球</li>
            </ul>
            <h3 className="font-bold text-orange-600 mt-4 mb-2">🎮 操作方式</h3>
            <ul className="space-y-1 text-gray-700">
              <li>拖拽篮球调整力度和角度</li>
              <li>松开鼠标发射篮球</li>
              <li>特殊篮球点击触发能力</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

