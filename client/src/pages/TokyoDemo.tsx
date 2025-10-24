/**
 * Tokyo Open World Demo Page
 * 展示50个东京场景和角色系统的演示页面
 */

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { TokyoOpenWorldScene } from '../game/scenes/TokyoOpenWorldScene';

export default function TokyoDemo() {
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
      scene: [TokyoOpenWorldScene],
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
      backgroundColor: '#1a1a1a'
    }}>
      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          🏀 篮球经理RPG - 东京开放世界演示
        </h1>
        <p style={{ fontSize: '18px', color: '#aaa' }}>
          50个开罗游戏风格的东京场景 | 10个可爱角色精灵 | WASD键控制
        </p>
      </div>
      
      <div 
        ref={containerRef} 
        style={{ 
          width: '1280px', 
          height: '720px',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />

      <div style={{
        marginTop: '20px',
        padding: '15px 30px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        color: 'white',
        maxWidth: '1280px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>🎮 操作说明</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <strong>移动控制：</strong>
            <br />
            W - 向上移动
            <br />
            A - 向左移动
            <br />
            S - 向下移动
            <br />
            D - 向右移动
          </div>
          <div>
            <strong>快速切换场景：</strong>
            <br />
            1 - 涩谷十字路口
            <br />
            2 - 秋叶原
            <br />
            3 - 浅草寺
            <br />
            4 - 国立竞技场
            <br />
            5 - 东京巨蛋
            <br />
            6 - 下北泽
            <br />
            7 - 东京塔
            <br />
            8 - 东京迪士尼
            <br />
            9 - 羽田机场
          </div>
          <div>
            <strong>其他功能：</strong>
            <br />
            空格 - 查看完整场景列表（控制台）
            <br />
            <br />
            <strong>场景特性：</strong>
            <br />
            • 50个东京场景
            <br />
            • 5大分类（商业/文化/居住/体育/特色）
            <br />
            • 10个体育场馆有篮球场
            <br />
            • 场景互联网络
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px 20px',
        backgroundColor: '#1a3a1a',
        borderRadius: '8px',
        color: '#90EE90',
        maxWidth: '1280px',
        textAlign: 'center'
      }}>
        <strong>✅ 已完成功能：</strong> 
        50个开罗风格场景 | 10个角色精灵 | WASD键控制 | 场景切换系统 | NPC动画
      </div>
    </div>
  );
}

