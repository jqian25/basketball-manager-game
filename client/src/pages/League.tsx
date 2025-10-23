import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Trophy, Medal, Star } from "lucide-react";

/**
 * 联赛系统页面
 * 显示联赛排名、赛程、奖励
 */
export default function League() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // 示例联赛排名数据
  const [standings] = useState([
    { rank: 1, team: "火箭队", wins: 45, losses: 10, winRate: 0.818, points: 5420 },
    { rank: 2, team: "湖人队", wins: 42, losses: 13, winRate: 0.764, points: 5280 },
    { rank: 3, team: "勇士队", wins: 40, losses: 15, winRate: 0.727, points: 5150 },
    { rank: 4, team: "我的球队", wins: 35, losses: 20, winRate: 0.636, points: 4890 },
    { rank: 5, team: "凯尔特人", wins: 33, losses: 22, winRate: 0.600, points: 4750 },
    { rank: 6, team: "热火队", wins: 30, losses: 25, winRate: 0.545, points: 4620 },
    { rank: 7, team: "76人队", wins: 28, losses: 27, winRate: 0.509, points: 4480 },
    { rank: 8, team: "快船队", wins: 25, losses: 30, winRate: 0.455, points: 4320 },
  ]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Star className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-orange-400 p-8">
      {/* 返回按钮 */}
      <Button
        variant="outline"
        onClick={() => setLocation("/game")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      {/* 标题 */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8 text-center glow-text"
      >
        联赛排名
      </motion.h1>

      {/* 赛季信息 */}
      <Card className="mb-6 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">2024-2025 赛季</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">55</div>
              <div className="text-sm text-gray-600">已完成比赛</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">27</div>
              <div className="text-sm text-gray-600">剩余比赛</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">35</div>
              <div className="text-sm text-gray-600">胜场</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">20</div>
              <div className="text-sm text-gray-600">负场</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 排名表 */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>联赛排名榜</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-3 px-4 text-left">排名</th>
                  <th className="py-3 px-4 text-left">球队</th>
                  <th className="py-3 px-4 text-center">胜</th>
                  <th className="py-3 px-4 text-center">负</th>
                  <th className="py-3 px-4 text-center">胜率</th>
                  <th className="py-3 px-4 text-center">总得分</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <motion.tr
                    key={team.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-200 hover:bg-orange-50 transition-colors ${
                      team.team === "我的球队" ? "bg-orange-100 font-bold" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(team.rank)}
                        <span className="text-lg font-bold">{team.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {team.team}
                        {team.team === "我的球队" && (
                          <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                            你
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-green-600 font-bold">
                      {team.wins}
                    </td>
                    <td className="py-4 px-4 text-center text-red-600 font-bold">
                      {team.losses}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {(team.winRate * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-center font-mono">
                      {team.points.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 奖励信息 */}
      <Card className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">赛季奖励</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <div className="font-bold">冠军</div>
              <div className="text-sm text-gray-600">$100,000</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <div className="font-bold">亚军</div>
              <div className="text-sm text-gray-600">$50,000</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Medal className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <div className="font-bold">季军</div>
              <div className="text-sm text-gray-600">$25,000</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

