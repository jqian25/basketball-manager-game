import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Play, Pause, FastForward } from "lucide-react";

/**
 * 比赛进行页面
 * 包含实时比赛模拟、动画播放、数据统计
 */
export default function MatchPlay() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // 比赛状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1); // 1x, 2x, 4x
  const [quarter, setQuarter] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(720); // 12分钟 = 720秒
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  
  // 当前事件
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [showShotAnimation, setShowShotAnimation] = useState(false);
  
  // 啦啦队表演
  const [showCheerleader, setShowCheerleader] = useState(false);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 比赛循环
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // 节结束
          if (quarter < 4) {
            setQuarter(q => q + 1);
            setShowCheerleader(true);
            setTimeout(() => setShowCheerleader(false), 5000);
            return 720;
          } else {
            // 比赛结束
            setIsPlaying(false);
            return 0;
          }
        }
        
        // 模拟比赛事件
        if (Math.random() < 0.1) {
          simulateEvent();
        }
        
        return prev - 1;
      });
    }, 1000 / gameSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, gameSpeed, quarter]);

  // 模拟比赛事件
  const simulateEvent = () => {
    const events = [
      { text: "三分球命中！", points: 3, team: "home" },
      { text: "中距离投篮得分！", points: 2, team: "home" },
      { text: "上篮得分！", points: 2, team: "away" },
      { text: "三分球命中！", points: 3, team: "away" },
      { text: "投篮不中", points: 0, team: "home" },
      { text: "精彩盖帽！", points: 0, team: "away" },
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(event.text);
    
    if (event.points > 0) {
      setShowShotAnimation(true);
      setTimeout(() => setShowShotAnimation(false), 2000);
      
      if (event.team === "home") {
        setHomeScore(s => s + event.points);
      } else {
        setAwayScore(s => s + event.points);
      }
    }
    
    setTimeout(() => setCurrentEvent(null), 3000);
  };

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

      {/* 比分板 */}
      <Card className="p-6 mb-6 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold mb-2">主队</h3>
            <motion.div
              key={homeScore}
              initial={{ scale: 1.5, color: "#FF6B35" }}
              animate={{ scale: 1, color: "#000" }}
              className="text-6xl font-bold"
            >
              {homeScore}
            </motion.div>
          </div>
          
          <div className="text-center px-8">
            <div className="text-xl font-bold mb-2">第{quarter}节</div>
            <div className="text-4xl font-mono font-bold text-orange-600">
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold mb-2">客队</h3>
            <motion.div
              key={awayScore}
              initial={{ scale: 1.5, color: "#FF6B35" }}
              animate={{ scale: 1, color: "#000" }}
              className="text-6xl font-bold"
            >
              {awayScore}
            </motion.div>
          </div>
        </div>
      </Card>

      {/* 球场区域 */}
      <Card className="relative h-96 mb-6 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
        {/* 球场背景 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url(/bg-romantic-court.png)" }}
        />
        
        {/* 投篮动画 */}
        <AnimatePresence>
          {showShotAnimation && (
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: -200, rotate: 720 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 bottom-1/4 w-16 h-16"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-orange-700 shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 事件文字 */}
        <AnimatePresence>
          {currentEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-4xl font-bold text-white bg-black/50 px-8 py-4 rounded-lg backdrop-blur-sm glow-text">
                {currentEvent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 啦啦队表演 */}
      <AnimatePresence>
        {showCheerleader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <video
              src="/cheerleader-performance.mp4"
              autoPlay
              muted
              className="max-w-4xl max-h-screen"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制面板 */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                暂停
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                开始
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setGameSpeed(s => s === 4 ? 1 : s * 2)}
          >
            <FastForward className="mr-2 h-4 w-4" />
            {gameSpeed}x 速度
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowCheerleader(true)}
          >
            观看啦啦队
          </Button>
        </div>
      </Card>
    </div>
  );
}

