/**
 * 开罗风格篮球经营游戏
 * 真正可以前后左右移动的等距视角游戏
 */

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Volume2, VolumeX } from "lucide-react";
import { EnhancedKairoScene } from "@/game/scenes/EnhancedKairoScene";

export default function KairoBasketball() {
  const [, setLocation] = useLocation();
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Phaser游戏配置
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#87CEEB',
      pixelArt: true,
      scene: [EnhancedKairoScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // 创建游戏实例
    gameRef.current = new Phaser.Game(config);
    setGameReady(true);

    // 清理函数
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // 音量控制
  const toggleMute = () => {
    if (gameRef.current) {
      gameRef.current.sound.mute = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部控制栏 */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏀</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">篮球热潮物语</h1>
                <p className="text-white/60 text-sm">
                  开罗风格篮球经营游戏
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setLocation("/game")}
              >
                <Home className="w-4 h-4 mr-1" />
                返回菜单
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏画布容器 */}
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <div 
            ref={containerRef} 
            className="rounded-xl overflow-hidden shadow-2xl border-4 border-white/10"
            style={{ width: '800px', height: '600px' }}
          />
          
          {!gameReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg">加载游戏中...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 游戏说明 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-white font-bold text-lg mb-4">🎮 游戏操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <div>
              <h3 className="font-semibold mb-2">移动</h3>
              <p className="text-sm">使用 <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">↓</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> 方向键移动角色</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">互动</h3>
              <p className="text-sm">点击建筑物进行互动</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-white font-semibold mb-2">🎯 游戏特色</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>✅ 真正可以前后左右移动的角色</li>
              <li>✅ 开罗风格等距视角</li>
              <li>✅ 像素艺术风格</li>
              <li>✅ 篮球经营玩法</li>
              <li>✅ 建筑互动系统</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

