/**
 * 篮球RPG游戏 - 基于Monster Tamer引擎
 * 完整可玩的宝可梦风格篮球RPG游戏
 */

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home } from "lucide-react";

export default function BasketballRPG() {
  const [, setLocation] = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
                  宝可梦风格篮球冒险游戏
                </p>
              </div>
            </div>

            <div className="flex gap-2">
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

      {/* 游戏iframe容器 */}
      <div className="flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl">
          <iframe
            ref={iframeRef}
            src="/monster-game.html"
            className="w-full h-[600px] rounded-xl shadow-2xl border-4 border-white/10 bg-black"
            title="Basketball RPG Game"
          />
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
              <h3 className="font-semibold mb-2">确认</h3>
              <p className="text-sm">按 <kbd className="px-2 py-1 bg-white/10 rounded">空格</kbd> 确认选择</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">返回</h3>
              <p className="text-sm">按 <kbd className="px-2 py-1 bg-white/10 rounded">Shift</kbd> 返回上一级</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-white font-semibold mb-2">🎯 游戏特色</h3>
            <p className="text-white/80 text-sm">
              探索篮球世界、与NPC对话、挑战篮球道场、收集球员、升级队伍,成为最强篮球训练师!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

