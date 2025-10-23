import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OpeningAnimation from "@/components/OpeningAnimation";
import { APP_TITLE, getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Zap, Trophy, X, Check } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showOpening, setShowOpening] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // 如果已登录，直接跳转到游戏（使用useEffect避免渲染期间调用）
  useEffect(() => {
    if (isAuthenticated && user && !showOpening) {
      setLocation("/game");
    }
  }, [isAuthenticated, user, showOpening, setLocation]);

  const handleOpeningComplete = () => {
    setShowOpening(false);
    setShowLogin(true);
  };

  const handleGuestLogin = () => {
    // 游客登录，直接进入游戏
    setLocation("/game");
  };

  const handleUserLogin = () => {
    // 跳转到Manus OAuth登录
    window.location.href = getLoginUrl();
  };

  if (showOpening) {
    return <OpeningAnimation onComplete={handleOpeningComplete} />;
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-orange-400 relative overflow-hidden p-8">
        {/* 动态背景效果 */}
        <div className="stars"></div>
        <div className="particles"></div>
        
        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-12 text-6xl font-bold text-white glow-text-strong"
        >
          {APP_TITLE}
        </motion.h1>

        {/* 两个大竖条 */}
        <div className="flex gap-8 max-w-4xl w-full mt-20">
          {/* 左侧 - 游客模式 */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="flex-1"
          >
            <Card className="h-full bg-gradient-to-br from-blue-600/90 to-blue-800/90 border-blue-400 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-4"
                >
                  <Zap className="w-20 h-20 text-yellow-400" />
                </motion.div>
                <CardTitle className="text-4xl font-bold text-white mb-2">
                  快速体验
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  无需注册，即刻开始
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                {[
                  { icon: Check, text: "即刻开始，无需注册", color: "text-green-400" },
                  { icon: Check, text: "3分钟快速比赛", color: "text-green-400" },
                  { icon: Check, text: "简化规则，轻松上手", color: "text-green-400" },
                  { icon: X, text: "无数据保存", color: "text-red-400" },
                  { icon: X, text: "无球员成长", color: "text-red-400" },
                  { icon: X, text: "无啦啦队表演", color: "text-red-400" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-white"
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <span className="text-lg">{item.text}</span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="pt-6"
                >
                  <Button
                    onClick={handleGuestLogin}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xl py-6 transition-all hover:scale-105 font-bold"
                    size="lg"
                  >
                    开始游客体验
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧 - 注册用户模式 */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            className="flex-1"
          >
            <Card className="h-full bg-gradient-to-br from-orange-600/90 to-orange-800/90 border-orange-400 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-4"
                >
                  <Trophy className="w-20 h-20 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
                </motion.div>
                <CardTitle className="text-4xl font-bold text-white mb-2">
                  完整体验
                </CardTitle>
                <CardDescription className="text-orange-100 text-lg">
                  解锁所有功能
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                {[
                  { text: "⭐ NBA完整规则（48分钟）" },
                  { text: "🏆 球员经验成长系统" },
                  { text: "💎 个人球队管理后台" },
                  { text: "🎯 详细数据统计分析" },
                  { text: "💃 性感啦啦队表演" },
                  { text: "🎁 赞助商合作系统" },
                  { text: "📊 联赛排名与奖励" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-white text-lg"
                  >
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="pt-6"
                >
                  <Button
                    onClick={handleUserLogin}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xl py-6 transition-all hover:scale-105 font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                    size="lg"
                  >
                    注册/登录完整版
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

