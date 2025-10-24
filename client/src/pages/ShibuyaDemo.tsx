/**
 * 涩谷十字路口完整演示页面
 */

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ShibuyaCrossingScene } from '../game/scenes/ShibuyaCrossingScene';

export default function ShibuyaDemo() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: containerRef.current,
      backgroundColor: '#000000',
      scene: [ShibuyaCrossingScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
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
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      padding: '20px'
    }}>
      {/* 标题 */}
      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        color: 'white',
        maxWidth: '1280px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '42px', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🏀 涩谷十字路口 - 完整游戏演示
        </h1>
        <p style={{ fontSize: '20px', color: '#aaa', marginBottom: '15px' }}>
          Shibuya Crossing - Full Playable Map
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '16px',
          color: '#FF6B35'
        }}>
          <span>✅ WASD移动控制</span>
          <span>✅ 6个可交互建筑</span>
          <span>✅ 4个NPC对话</span>
          <span>✅ 实时小地图</span>
          <span>✅ 碰撞检测</span>
        </div>
      </div>
      
      {/* 游戏容器 */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '1280px', 
          height: '720px',
          border: '3px solid #FF6B35',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(255, 107, 53, 0.5)'
        }} 
      />

      {/* 操作说明 */}
      <div style={{
        marginTop: '25px',
        padding: '20px 40px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        border: '2px solid #333',
        color: 'white',
        maxWidth: '1280px',
        width: '100%'
      }}>
        <h3 style={{ 
          marginBottom: '15px', 
          fontSize: '24px',
          color: '#FF6B35'
        }}>
          🎮 完整游戏功能
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '25px',
          marginBottom: '20px'
        }}>
          {/* 移动控制 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            border: '1px solid #444'
          }}>
            <h4 style={{ color: '#4CAF50', marginBottom: '10px', fontSize: '18px' }}>
              ⌨️ 移动控制
            </h4>
            <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
              <div><strong>W</strong> - 向上移动</div>
              <div><strong>A</strong> - 向左移动</div>
              <div><strong>S</strong> - 向下移动</div>
              <div><strong>D</strong> - 向右移动</div>
            </div>
          </div>

          {/* 交互系统 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            border: '1px solid #444'
          }}>
            <h4 style={{ color: '#2196F3', marginBottom: '10px', fontSize: '18px' }}>
              💬 交互系统
            </h4>
            <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
              <div><strong>E</strong> - 与NPC对话</div>
              <div><strong>E</strong> - 查看建筑详情</div>
              <div><strong>ESC</strong> - 关闭对话框</div>
              <div><strong>ESC</strong> - 关闭建筑详情</div>
            </div>
          </div>

          {/* 地图元素 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            border: '1px solid #444'
          }}>
            <h4 style={{ color: '#FFC107', marginBottom: '10px', fontSize: '18px' }}>
              🗺️ 地图元素
            </h4>
            <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
              <div>🏀 <strong>涩谷篮球馆</strong> - 比赛训练</div>
              <div>🛍️ <strong>109百货</strong> - 购物</div>
              <div>🍜 <strong>拉面店</strong> - 恢复体力</div>
              <div>🚇 <strong>涩谷站</strong> - 场景切换</div>
            </div>
          </div>
        </div>

        {/* NPC角色 */}
        <div style={{
          padding: '15px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <h4 style={{ color: '#9C27B0', marginBottom: '10px', fontSize: '18px' }}>
            👥 NPC角色（4个）
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '15px',
            fontSize: '14px'
          }}>
            <div>
              <strong style={{ color: '#FF6B35' }}>安西教练</strong>
              <div style={{ color: '#aaa' }}>篮球教练，经验丰富</div>
            </div>
            <div>
              <strong style={{ color: '#FF6B35' }}>晴子</strong>
              <div style={{ color: '#aaa' }}>篮球队经理，热情开朗</div>
            </div>
            <div>
              <strong style={{ color: '#FF6B35' }}>流川枫</strong>
              <div style={{ color: '#aaa' }}>篮球高手，冷酷专注</div>
            </div>
            <div>
              <strong style={{ color: '#FF6B35' }}>商店老板</strong>
              <div style={{ color: '#aaa' }}>体育用品店，友好健谈</div>
            </div>
          </div>
        </div>
      </div>

      {/* 技术特性 */}
      <div style={{
        marginTop: '15px',
        padding: '15px 30px',
        backgroundColor: '#1a3a1a',
        borderRadius: '8px',
        border: '2px solid #2ECC71',
        color: '#90EE90',
        maxWidth: '1280px',
        width: '100%',
        textAlign: 'center'
      }}>
        <strong>✨ 技术特性：</strong> 
        <span style={{ marginLeft: '15px' }}>
          Phaser 3游戏引擎 | 开罗游戏风格 | 实时碰撞检测 | 动态小地图 | 
          NPC AI对话系统 | 建筑交互系统 | 平滑相机跟随 | 响应式控制
        </span>
      </div>
    </div>
  );
}

