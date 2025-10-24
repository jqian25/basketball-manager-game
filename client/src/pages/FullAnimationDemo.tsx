/**
 * 完整动画演示页面
 * 展示所有184帧动画：起床、小鸟飞行、角色走路
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import FullAnimationDemoScene from '../game/scenes/FullAnimationDemoScene';

export default function FullAnimationDemo() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: 'full-animation-demo-container',
      backgroundColor: '#87CEEB',
      scene: [FullAnimationDemoScene],
      scale: {
        mode: Phaser.Scale.FIT,
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
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        id="full-animation-demo-container"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

