import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import KairoMatchScene from '@/game/scenes/KairoMatchScene';

export default function KairoMatch() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#2d2d2d',
      scene: [KairoMatchScene],
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
      },
      render: {
        pixelArt: true, // 像素艺术渲染
        antialias: false
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
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-orange-100 to-amber-200">
      <div 
        ref={containerRef} 
        className="shadow-2xl rounded-lg overflow-hidden border-4 border-orange-400"
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  );
}

