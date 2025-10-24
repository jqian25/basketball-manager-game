/**
 * 开罗风格篮球经营游戏 - 使用Phaser引擎
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Building2, 
  Users, 
  Dumbbell, 
  Trophy, 
  DollarSign,
  Home,
  Play,
  Pause
} from "lucide-react";
import { PhaserGame } from "@/components/game/PhaserGame";

export default function KairoGame() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // 游戏状态
  const [gameState, setGameState] = useState({
    clubName: user?.name ? `${user.name}的篮球俱乐部` : "我的篮球俱乐部",
    level: 1,
    money: 50000,
    research: 100,
    fans: 1000,
    reputation: 50,
    year: 1,
    month: 1,
    week: 1,
    isPaused: false
  });

  // 游戏时间流逝
  useEffect(() => {
    if (gameState.isPaused) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        let { year, month, week } = prev;
        week += 1;
        if (week > 4) {
          week = 1;
          month += 1;
        }
        if (month > 12) {
          month = 1;
          year += 1;
        }
        return { ...prev, year, month, week };
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [gameState.isPaused]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* 顶部状态栏 - 开罗风格 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 shadow-2xl border-b-4 border-orange-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* 俱乐部信息 */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border-2 border-white/30">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">{gameState.clubName}</h1>
                <p className="text-sm opacity-90">
                  Lv.{gameState.level} | {gameState.year}年 {gameState.month}月 第{gameState.week}周
                </p>
              </div>
            </div>

            {/* 资源显示 */}
            <div className="flex gap-3">
              <div className="bg-yellow-500 px-3 py-2 rounded-lg shadow-lg border-2 border-yellow-600">
                <p className="text-xs font-bold text-yellow-900">资金</p>
                <p className="text-lg font-bold">💰 ${gameState.money.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500 px-3 py-2 rounded-lg shadow-lg border-2 border-blue-600">
                <p className="text-xs font-bold text-blue-900">研究</p>
                <p className="text-lg font-bold">🔬 {gameState.research}</p>
              </div>
              <div className="bg-green-500 px-3 py-2 rounded-lg shadow-lg border-2 border-green-600">
                <p className="text-xs font-bold text-green-900">粉丝</p>
                <p className="text-lg font-bold">👥 {gameState.fans.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500 px-3 py-2 rounded-lg shadow-lg border-2 border-purple-600">
                <p className="text-xs font-bold text-purple-900">声望</p>
                <p className="text-lg font-bold">⭐ {gameState.reputation}</p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
              >
                {gameState.isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    继续
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    暂停
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => setLocation("/game")}
              >
                <Home className="w-4 h-4 mr-1" />
                返回菜单
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Phaser游戏主区域 */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-2xl border-4 border-orange-300 overflow-hidden">
          <div className="h-[800px]">
            <PhaserGame />
          </div>
        </div>

        {/* 底部提示栏 */}
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-orange-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <p className="text-sm font-medium text-gray-700">
                使用<kbd className="px-2 py-1 bg-white rounded border border-gray-300">方向键</kbd>移动，
                按<kbd className="px-2 py-1 bg-white rounded border border-gray-300">空格</kbd>与NPC对话，
                点击建筑查看详情
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Users className="w-4 h-4 mr-1" />
                球员管理
              </Button>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                <Dumbbell className="w-4 h-4 mr-1" />
                训练系统
              </Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                <Trophy className="w-4 h-4 mr-1" />
                比赛
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

