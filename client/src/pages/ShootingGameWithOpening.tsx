import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { ShootingGameScene, LEVEL_1_1 } from '../game/scenes/ShootingGameScene';

const CHEERLEADER_VIDEOS = [
  '/videos/cheerleader_blonde.mp4',
  '/videos/cheerleader_asian.mp4',
  '/videos/cheerleader_latina.mp4',
  '/videos/cheerleader_bunny.mp4',
  '/videos/cheerleader_redhead.mp4',
  '/cheerleader-opening.mp4',
  '/cheerleader-halftime.mp4',
];

/**
 * 带拉拉队开场的投篮小游戏页面
 */
export default function ShootingGameWithOpening() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOpening, setShowOpening] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    // 随机选择一个拉拉队视频
    const randomIndex = Math.floor(Math.random() * CHEERLEADER_VIDEOS.length);
    setSelectedVideo(CHEERLEADER_VIDEOS[randomIndex]);

    // 3秒后显示跳过按钮
    const timer = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setShowOpening(false);
    startGame();
  };

  const handleSkip = () => {
    setShowOpening(false);
    startGame();
  };

  const startGame = () => {
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
    gameRef.current.scene.start('ShootingGameScene', { level: LEVEL_1_1 });
  };

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  if (showOpening) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {selectedVideo && (
          <video
            ref={videoRef}
            src={selectedVideo}
            autoPlay
            onEnded={handleVideoEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}
        
        {showSkipButton && (
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              padding: '15px 30px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              background: 'rgba(255, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            跳过 ⏭️
          </button>
        )}

        <div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6)',
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 10000
        }}>
          🏀 比赛即将开始！
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

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

