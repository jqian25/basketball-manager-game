import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Volume2, VolumeX, Save, Map, Package } from "lucide-react";
import { PokemonStyleBasketballScene } from "@/game/scenes/PokemonStyleBasketballScene";

export default function PokemonBasketball() {
  const [, setLocation] = useLocation();
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#87CEEB',
      pixelArt: true,
      scene: [PokemonStyleBasketballScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gameRef.current) {
      gameRef.current.sound.mute = !isMuted;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      {/* 游戏标题 */}
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🏀 宝可梦风格篮球RPG
        </h1>
        <p className="text-white/90 text-sm">
          Game Boy风格 | 完整可玩版本
        </p>
      </div>

      {/* 游戏容器 */}
      <div className="relative">
        <div 
          ref={containerRef} 
          className="border-8 border-gray-800 rounded-lg shadow-2xl bg-black"
          style={{ width: '800px', height: '600px' }}
        />
        
        {/* 控制按钮 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleMute}
            className="bg-black/70 hover:bg-black/90 text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="mt-6 flex gap-4">
        <Button
          onClick={() => setLocation("/game")}
          variant="outline"
          className="bg-white/90 hover:bg-white"
        >
          <Home className="w-4 h-4 mr-2" />
          返回主菜单
        </Button>
        
        <Button
          variant="outline"
          className="bg-white/90 hover:bg-white"
          onClick={() => {
            if (gameRef.current) {
              const scene = gameRef.current.scene.getScene('PokemonStyleBasketballScene') as any;
              if (scene && scene.saveSystem) {
                scene.saveSystem.save();
                alert('游戏已保存!');
              }
            }
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          保存游戏
        </Button>
      </div>

      {/* 操作说明 */}
      <div className="mt-6 bg-white/90 rounded-lg p-6 max-w-2xl">
        <h3 className="text-lg font-bold mb-3 text-gray-800">🎮 操作说明</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">移动控制</p>
            <ul className="space-y-1">
              <li>• WASD 或 方向键 - 移动</li>
              <li>• 空格键 - 互动/对话</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">系统功能</p>
            <ul className="space-y-1">
              <li>• I键 - 打开背包</li>
              <li>• M键 - 打开地图</li>
              <li>• ESC键 - 菜单</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 游戏特色:</strong> 昼夜循环、天气系统、20+NPC智能行为、完整任务系统、
            背包管理、存档功能、宝可梦风格对话、大型开放世界地图
          </p>
        </div>
      </div>
    </div>
  );
}

