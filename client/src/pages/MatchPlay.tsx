import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import MatchEngine from "@/components/MatchEngine";

export default function MatchPlay() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [gameEnded, setGameEnded] = useState(false);
  const [finalScore, setFinalScore] = useState({ home: 0, away: 0 });

  // 示例球队数据
  const homeTeam = {
    name: "我的球队",
    score: 0,
    players: [
      {
        id: 1,
        name: "艾伦·史密斯",
        position: "PG",
        number: 1,
        scoring: 18,
        passing: 16,
        defense: 14,
        athleticism: 15,
        basketballIQ: 17,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 2,
        name: "迈克尔·约翰逊",
        position: "SG",
        number: 23,
        scoring: 19,
        passing: 13,
        defense: 15,
        athleticism: 18,
        basketballIQ: 14,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 3,
        name: "詹姆斯·威廉姆斯",
        position: "SF",
        number: 6,
        scoring: 17,
        passing: 14,
        defense: 16,
        athleticism: 17,
        basketballIQ: 15,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 4,
        name: "安东尼·戴维斯",
        position: "PF",
        number: 4,
        scoring: 16,
        passing: 12,
        defense: 18,
        athleticism: 16,
        basketballIQ: 14,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 5,
        name: "沙奎尔·奥尼尔",
        position: "C",
        number: 34,
        scoring: 18,
        passing: 10,
        defense: 19,
        athleticism: 15,
        basketballIQ: 13,
        stamina: 100,
        currentStamina: 100,
      },
    ],
  };

  const awayTeam = {
    name: "对手球队",
    score: 0,
    players: [
      {
        id: 6,
        name: "斯蒂芬·库里",
        position: "PG",
        number: 30,
        scoring: 20,
        passing: 17,
        defense: 13,
        athleticism: 16,
        basketballIQ: 18,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 7,
        name: "克莱·汤普森",
        position: "SG",
        number: 11,
        scoring: 19,
        passing: 14,
        defense: 15,
        athleticism: 17,
        basketballIQ: 16,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 8,
        name: "勒布朗·詹姆斯",
        position: "SF",
        number: 23,
        scoring: 20,
        passing: 18,
        defense: 17,
        athleticism: 19,
        basketballIQ: 20,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 9,
        name: "凯文·杜兰特",
        position: "PF",
        number: 35,
        scoring: 21,
        passing: 15,
        defense: 16,
        athleticism: 18,
        basketballIQ: 17,
        stamina: 100,
        currentStamina: 100,
      },
      {
        id: 10,
        name: "尼古拉·约基奇",
        position: "C",
        number: 15,
        scoring: 19,
        passing: 19,
        defense: 17,
        athleticism: 14,
        basketballIQ: 19,
        stamina: 100,
        currentStamina: 100,
      },
    ],
  };

  // 游客模式：3分钟 = 180秒
  // 注册模式：48分钟 = 2880秒（简化为480秒）
  const gameDuration = isAuthenticated ? 480 : 180;

  const handleGameEnd = (homeScore: number, awayScore: number, events: any[]) => {
    setFinalScore({ home: homeScore, away: awayScore });
    setGameEnded(true);
  };

  if (gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-orange-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">比赛结束</h1>
          
          <div className="flex justify-around items-center mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{homeTeam.name}</h2>
              <div className="text-6xl font-bold text-orange-600">{finalScore.home}</div>
            </div>
            <div className="text-4xl font-bold text-gray-400">-</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{awayTeam.name}</h2>
              <div className="text-6xl font-bold text-blue-600">{finalScore.away}</div>
            </div>
          </div>

          <div className="text-center mb-8">
            {finalScore.home > finalScore.away ? (
              <div className="text-3xl font-bold text-green-600">🎉 胜利！</div>
            ) : finalScore.home < finalScore.away ? (
              <div className="text-3xl font-bold text-red-600">😞 失败</div>
            ) : (
              <div className="text-3xl font-bold text-gray-600">🤝 平局</div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setLocation("/match")}
            >
              返回
            </Button>
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={() => {
                setGameEnded(false);
                setFinalScore({ home: 0, away: 0 });
              }}
            >
              再来一局
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-orange-400 p-8">
      {/* 返回按钮 */}
      <Button
        variant="outline"
        onClick={() => setLocation("/match")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      {/* 比赛引擎 */}
      <MatchEngine
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        gameDuration={gameDuration}
        onGameEnd={handleGameEnd}
      />
    </div>
  );
}

