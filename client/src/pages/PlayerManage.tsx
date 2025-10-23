import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, User } from "lucide-react";

/**
 * 球员管理页面
 * 创建、查看、编辑球员
 */
export default function PlayerManage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // 示例球员数据
  const [players] = useState([
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
      stamina: 16,
      level: 5,
      exp: 450,
      nextLevelExp: 500,
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
      stamina: 17,
      level: 6,
      exp: 320,
      nextLevelExp: 600,
    },
  ]);

  const getPositionName = (pos: string) => {
    const names: Record<string, string> = {
      PG: "控球后卫",
      SG: "得分后卫",
      SF: "小前锋",
      PF: "大前锋",
      C: "中锋",
    };
    return names[pos] || pos;
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
        球员管理
      </motion.h1>

      {/* 创建球员按钮 */}
      <div className="mb-6 text-center">
        <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-5 w-5" />
          创建新球员
        </Button>
      </div>

      {/* 球员列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{player.name}</CardTitle>
                      <div className="text-sm opacity-90">
                        #{player.number} · {getPositionName(player.position)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* 等级和经验 */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">等级 {player.level}</span>
                    <span className="text-sm text-gray-600">
                      {player.exp} / {player.nextLevelExp} EXP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${(player.exp / player.nextLevelExp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 六维属性 */}
                <div className="space-y-2">
                  {[
                    { label: "得分", value: player.scoring, color: "bg-red-500" },
                    { label: "传球", value: player.passing, color: "bg-blue-500" },
                    { label: "防守", value: player.defense, color: "bg-green-500" },
                    { label: "运动", value: player.athleticism, color: "bg-purple-500" },
                    { label: "IQ", value: player.basketballIQ, color: "bg-yellow-500" },
                    { label: "体能", value: player.stamina, color: "bg-orange-500" },
                  ].map((attr) => (
                    <div key={attr.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{attr.label}</span>
                        <span className="font-bold">{attr.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`${attr.color} h-1.5 rounded-full transition-all`}
                          style={{ width: `${(attr.value / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    查看详情
                  </Button>
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    训练升级
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

