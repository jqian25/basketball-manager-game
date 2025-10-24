/**
 * 像素RPG篮球游戏 - 宝可梦风格
 * 真正可玩的2D游戏,支持自由移动、对话、战斗、购物、招募
 */

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Home, Volume2, VolumeX } from "lucide-react";

// 导入游戏场景
import { TownScene } from "@/game/scenes/TownScene";
import { DojoScene } from "@/game/scenes/DojoScene";
import { ShopScene } from "@/game/scenes/ShopScene";
import { BattleScene } from "@/game/scenes/BattleScene";

export default function PixelRPG() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
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
      backgroundColor: '#2d2d2d',
      pixelArt: true, // 像素风格
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [TownScene, DojoScene, ShopScene, BattleScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // 创建游戏实例
    gameRef.current = new Phaser.Game(config);
    
    // 传递用户信息到游戏
    gameRef.current.registry.set('user', user);
    gameRef.current.registry.set('playerName', user?.name || '玩家');

    setGameReady(true);

    // 清理函数
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [user]);

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
                <h1 className="text-white font-bold text-lg">篮球热潮物语 RPG</h1>
                <p className="text-white/60 text-sm">
                  {user?.name || '游客'} 的冒险
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
            <div>
              <h3 className="font-semibold mb-2">移动</h3>
              <p className="text-sm">使用 <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">↓</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> 方向键移动</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">互动</h3>
              <p className="text-sm">按 <kbd className="px-2 py-1 bg-white/10 rounded">空格</kbd> 与NPC对话、进入建筑</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">菜单</h3>
              <p className="text-sm">按 <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> 打开菜单、查看队伍</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-white font-semibold mb-2">🎯 游戏目标</h3>
            <p className="text-white/80 text-sm">
              探索城镇、挑战道场、招募球员、购买装备,打造最强篮球队伍!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

