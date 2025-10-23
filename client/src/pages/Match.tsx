import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Play, Users, Clock, Trophy } from "lucide-react";
import { useState } from "react";

export default function Match() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [matchMode, setMatchMode] = useState<"guest" | "registered" | null>(null);

  // 如果未选择模式，显示模式选择界面
  if (!matchMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-orange-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              onClick={() => setLocation("/game")}
              variant="outline"
              className="border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回主菜单
            </Button>
          </motion.div>

          {/* 标题 */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-orange-600 mb-4"
          >
            选择比赛模式
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 mb-12 text-lg"
          >
            选择适合你的比赛方式
          </motion.p>

          {/* 模式选择卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 游客模式 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-blue-200"
                onClick={() => setLocation("/match/quick")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl">游客模式</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    快速体验，轻松上手
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">比赛时长：3分钟</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">简化规则</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">无数据保存</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg py-6 mt-6">
                    开始快速比赛
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* 注册模式 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className={`h-full transition-all duration-300 border-2 ${
                isAuthenticated 
                  ? "hover:shadow-2xl cursor-pointer hover:scale-105 border-orange-200" 
                  : "opacity-60 cursor-not-allowed border-gray-200"
              }`}
                onClick={() => isAuthenticated && setMatchMode("registered")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl flex items-center gap-2">
                        完整模式
                        {!isAuthenticated && (
                          <span className="text-sm text-gray-500 font-normal">(需要登录)</span>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-lg">
                    NBA完整规则，专业体验
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">比赛时长：48分钟（4节×12分钟）</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">NBA完整规则</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">球员经验成长</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">啦啦队表演</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg py-6 mt-6"
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? "开始完整比赛" : "登录后解锁"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 游客提示 */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 text-center"
            >
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="py-4">
                  <p className="text-gray-700">
                    想体验完整的NBA规则和球员成长系统？
                    <Button
                      onClick={() => setLocation("/")}
                      variant="link"
                      className="text-orange-600 font-semibold"
                    >
                      立即注册/登录
                    </Button>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // 比赛进行界面（完整模式）
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <Button
          onClick={() => setMatchMode(null)}
          variant="outline"
          className="mb-8 border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回模式选择
        </Button>

        {/* 完整比赛界面占位 */}
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            完整比赛
          </h1>
          <p className="text-xl text-gray-300">
            48分钟 NBA 完整规则比赛引擎开发中...
          </p>
        </div>
      </div>
    </div>
  );
}

