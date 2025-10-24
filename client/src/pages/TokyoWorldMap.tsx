import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { TokyoWorldMapScene } from '../game/scenes/TokyoWorldMapScene';

export default function TokyoWorldMap() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      backgroundColor: '#87CEEB',
      scene: [TokyoWorldMapScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div id="game-container" style={{ width: '100%', height: '100%' }} />
      
      {/* 顶部信息栏 */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '10px' }}>🗼 东京大地图 🗼</h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          完整的开罗游戏风格东京开放世界 | 50个场景 | 10个地标 | 7个区域
        </p>
      </div>

      {/* 控制说明 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '14px',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🎮 控制说明</div>
        <div>WASD / 方向键: 移动</div>
        <div>鼠标悬停: 查看地标信息</div>
        <div>鼠标点击: 查看地标详情</div>
        <div style={{ marginTop: '10px', color: '#FFD700' }}>右上角: 小地图（黄点=地标，红点=你）</div>
      </div>

      {/* 地标列表 */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '13px',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>🏛️ 地标列表</div>
        <div style={{ marginBottom: '5px' }}>🗼 东京塔（333m）</div>
        <div style={{ marginBottom: '5px' }}>🗼 东京晴空塔（634m）</div>
        <div style={{ marginBottom: '5px' }}>🚶 涩谷十字路口</div>
        <div style={{ marginBottom: '5px' }}>⛩️ 浅草寺</div>
        <div style={{ marginBottom: '5px' }}>⛩️ 明治神宫</div>
        <div style={{ marginBottom: '5px' }}>🏯 皇居</div>
        <div style={{ marginBottom: '5px' }}>⚾ 东京巨蛋</div>
        <div style={{ marginBottom: '5px' }}>🌉 彩虹大桥</div>
        <div style={{ marginBottom: '5px' }}>📺 富士电视台</div>
        <div style={{ marginBottom: '5px' }}>🏬 涩谷109</div>
        
        <div style={{ marginTop: '15px', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>🏙️ 区域列表</div>
        <div style={{ marginBottom: '5px' }}>涩谷区（青年文化）</div>
        <div style={{ marginBottom: '5px' }}>新宿区（商业娱乐）</div>
        <div style={{ marginBottom: '5px' }}>秋叶原区（动漫电器）</div>
        <div style={{ marginBottom: '5px' }}>浅草区（传统寺庙）</div>
        <div style={{ marginBottom: '5px' }}>原宿区（时尚潮流）</div>
        <div style={{ marginBottom: '5px' }}>银座区（奢华购物）</div>
        <div style={{ marginBottom: '5px' }}>台场区（海滨娱乐）</div>
      </div>

      {/* 统计信息 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '13px',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>📊 地图统计</div>
        <div>地图尺寸: 6.4km × 6.4km</div>
        <div>瓦片数量: 40,000个</div>
        <div>地标建筑: 10个</div>
        <div>区域: 7个</div>
        <div>场景: 50个</div>
        <div style={{ marginTop: '10px', color: '#FFD700' }}>风格: 开罗游戏</div>
      </div>
    </div>
  );
}

