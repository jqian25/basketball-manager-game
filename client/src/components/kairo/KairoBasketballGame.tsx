import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ClubOverview from "./ClubOverview";
import PlayerManagement from "./PlayerManagement";
import FacilityManagement from "./FacilityManagement";
import SponsorSystem from "./SponsorSystem";
import LeagueSystem from "./LeagueSystem";
import MatchSimulator from "./MatchSimulator";
import type { KairoGameState, KairoPlayer } from "@/types/kairo";

// 初始游戏状态
const initialGameState: KairoGameState = {
  clubName: "我的篮球俱乐部",
  clubLevel: 1,
  clubRank: 100,
  popularity: 100,
  money: 50000,
  
  players: [
    {
      id: "p1",
      name: "张三",
      position: "PG",
      type: "Speedster",
      level: 1,
      experience: 0,
      stats: {
        stamina: 500,
        shooting: 400,
        dribbling: 600,
        passing: 550,
        defense: 450,
        jumping: 400
      },
      skills: [],
      cost: 5000,
      isJunior: false,
      positionAffinity: { PG: "S", SG: "A", SF: "B", PF: "C", C: "C" },
      spriteIndex: 1
    },
    {
      id: "p2",
      name: "李四",
      position: "SG",
      type: "Shooter",
      level: 1,
      experience: 0,
      stats: {
        stamina: 450,
        shooting: 650,
        dribbling: 400,
        passing: 450,
        defense: 400,
        jumping: 500
      },
      skills: [],
      cost: 6000,
      isJunior: false,
      positionAffinity: { PG: "B", SG: "S", SF: "A", PF: "C", C: "C" },
      spriteIndex: 2
    },
    {
      id: "p3",
      name: "王五",
      position: "SF",
      type: "All-Star",
      level: 1,
      experience: 0,
      stats: {
        stamina: 500,
        shooting: 500,
        dribbling: 500,
        passing: 500,
        defense: 500,
        jumping: 500
      },
      skills: [],
      cost: 8000,
      isJunior: false,
      positionAffinity: { PG: "B", SG: "A", SF: "S", PF: "A", C: "B" },
      spriteIndex: 3
    },
    {
      id: "p4",
      name: "赵六",
      position: "PF",
      type: "Rebounder",
      level: 1,
      experience: 0,
      stats: {
        stamina: 550,
        shooting: 400,
        dribbling: 350,
        passing: 400,
        defense: 600,
        jumping: 700
      },
      skills: [],
      cost: 7000,
      isJunior: false,
      positionAffinity: { PG: "C", SG: "C", SF: "B", PF: "S", C: "A" },
      spriteIndex: 4
    },
    {
      id: "p5",
      name: "孙七",
      position: "C",
      type: "Defender",
      level: 1,
      experience: 0,
      stats: {
        stamina: 600,
        shooting: 350,
        dribbling: 300,
        passing: 350,
        defense: 700,
        jumping: 650
      },
      skills: [],
      cost: 7500,
      isJunior: false,
      positionAffinity: { PG: "C", SG: "C", SF: "C", PF: "A", C: "S" },
      spriteIndex: 5
    }
  ],
  maxPlayers: 40,
  startingLineup: ["p1", "p2", "p3", "p4", "p5"],
  
  facilities: [],
  clubLayout: { width: 20, height: 15 },
  
  sponsors: [],
  
  currentLeague: "amateur",
  currentSeason: 1,
  matches: [],
  
  gameDay: 1,
  gameYear: 2024
};

export default function KairoBasketballGame() {
  const [gameState, setGameState] = useState<KairoGameState>(initialGameState);
  const [activeTab, setActiveTab] = useState("overview");

  // 更新游戏状态的辅助函数
  const updateGameState = (updates: Partial<KairoGameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const updatePlayers = (players: KairoPlayer[]) => {
    setGameState(prev => ({ ...prev, players }));
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-amber-50 to-orange-100 p-4">
      {/* 开罗风格标题 */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-orange-600 pixel-font drop-shadow-lg">
          🏀 篮球俱乐部物语 🏀
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          打造你的世界级篮球队！
        </p>
      </div>

      {/* 主游戏区域 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-orange-200">
            <TabsTrigger value="overview" className="pixel-font">
              俱乐部
            </TabsTrigger>
            <TabsTrigger value="players" className="pixel-font">
              球员
            </TabsTrigger>
            <TabsTrigger value="facilities" className="pixel-font">
              设施
            </TabsTrigger>
            <TabsTrigger value="match" className="pixel-font">
              比赛
            </TabsTrigger>
            <TabsTrigger value="league" className="pixel-font">
              联赛
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="pixel-font">
              赞助
            </TabsTrigger>
          </TabsList>

          {/* 俱乐部总览 */}
          <TabsContent value="overview" className="p-4">
            <ClubOverview gameState={gameState} />
          </TabsContent>

          {/* 球员管理 */}
          <TabsContent value="players" className="p-4">
            <PlayerManagement 
              players={gameState.players}
              money={gameState.money}
              onPlayersChange={updatePlayers}
              onMoneyChange={(money) => updateGameState({ money })}
            />
          </TabsContent>

          {/* 设施管理 */}
          <TabsContent value="facilities" className="p-4">
            <FacilityManagement 
              facilities={gameState.facilities}
              money={gameState.money}
              clubLayout={gameState.clubLayout}
              onFacilitiesChange={(facilities) => updateGameState({ facilities })}
              onMoneyChange={(money) => updateGameState({ money })}
            />
          </TabsContent>

          {/* 比赛 */}
          <TabsContent value="match" className="p-4">
            <MatchSimulator 
              players={gameState.players.filter(p => 
                gameState.startingLineup.includes(p.id)
              )}
            />
          </TabsContent>

          {/* 联赛 */}
          <TabsContent value="league" className="p-4">
            <LeagueSystem 
              currentLeague={gameState.currentLeague}
              matches={gameState.matches}
              clubRank={gameState.clubRank}
            />
          </TabsContent>

          {/* 赞助商 */}
          <TabsContent value="sponsors" className="p-4">
            <SponsorSystem 
              sponsors={gameState.sponsors}
              clubRank={gameState.clubRank}
              popularity={gameState.popularity}
              onSponsorsChange={(sponsors) => updateGameState({ sponsors })}
              onMoneyChange={(money) => updateGameState({ money })}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* 像素风格CSS */}
      <style>{`
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
}

