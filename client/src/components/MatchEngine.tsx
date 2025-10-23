import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  scoring: number;
  passing: number;
  defense: number;
  athleticism: number;
  basketballIQ: number;
  stamina: number;
  currentStamina: number;
}

interface Team {
  name: string;
  players: Player[];
  score: number;
}

interface GameEvent {
  time: number;
  quarter: number;
  description: string;
  homeScore: number;
  awayScore: number;
  type: "score" | "miss" | "turnover" | "foul" | "rebound" | "block" | "steal";
}

interface MatchEngineProps {
  homeTeam: Team;
  awayTeam: Team;
  gameDuration: number; // 秒
  onGameEnd: (homeScore: number, awayScore: number, events: GameEvent[]) => void;
}

export default function MatchEngine({ 
  homeTeam, 
  awayTeam, 
  gameDuration,
  onGameEnd 
}: MatchEngineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(gameDuration);
  const [quarter, setQuarter] = useState(1);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [possession, setPossession] = useState<"home" | "away">("home");
  const [shotClock, setShotClock] = useState(24);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [showCheerleader, setShowCheerleader] = useState(false);
  const [cheerleaderVideo, setCheerleaderVideo] = useState("");
  
  const eventLogRef = useRef<HTMLDivElement>(null);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 模拟一个回合
  const simulatePossession = () => {
    const attackTeam = possession === "home" ? homeTeam : awayTeam;
    const defenseTeam = possession === "home" ? awayTeam : homeTeam;
    
    // 随机选择进攻球员
    const attacker = attackTeam.players[Math.floor(Math.random() * 5)];
    const defender = defenseTeam.players[Math.floor(Math.random() * 5)];
    
    // 计算命中率（基于球员属性）
    const baseHitRate = attacker.scoring / 20;
    const defenseModifier = 1 - (defender.defense / 40);
    const staminaModifier = attacker.currentStamina / attacker.stamina;
    const finalHitRate = baseHitRate * defenseModifier * staminaModifier;
    
    const roll = Math.random();
    
    let event: GameEvent;
    let description = "";
    
    if (roll < finalHitRate * 0.3) {
      // 三分命中
      const points = 3;
      if (possession === "home") {
        setHomeScore(s => s + points);
      } else {
        setAwayScore(s => s + points);
      }
      description = `${attacker.name} (#${attacker.number}) 三分球命中！+${points}分`;
      event = {
        time: timeRemaining,
        quarter,
        description,
        homeScore: possession === "home" ? homeScore + points : homeScore,
        awayScore: possession === "away" ? awayScore + points : awayScore,
        type: "score"
      };
    } else if (roll < finalHitRate * 0.6) {
      // 两分命中
      const points = 2;
      if (possession === "home") {
        setHomeScore(s => s + points);
      } else {
        setAwayScore(s => s + points);
      }
      description = `${attacker.name} (#${attacker.number}) 中距离投篮得分！+${points}分`;
      event = {
        time: timeRemaining,
        quarter,
        description,
        homeScore: possession === "home" ? homeScore + points : homeScore,
        awayScore: possession === "away" ? awayScore + points : awayScore,
        type: "score"
      };
    } else if (roll < 0.7) {
      // 投篮不中
      description = `${attacker.name} (#${attacker.number}) 投篮不中，${defender.name} 防守成功`;
      event = {
        time: timeRemaining,
        quarter,
        description,
        homeScore,
        awayScore,
        type: "miss"
      };
    } else if (roll < 0.8) {
      // 盖帽
      description = `精彩盖帽！${defender.name} (#${defender.number}) 封盖了 ${attacker.name} 的投篮`;
      event = {
        time: timeRemaining,
        quarter,
        description,
        homeScore,
        awayScore,
        type: "block"
      };
    } else {
      // 失误
      description = `${attacker.name} 传球失误，${defender.name} 抢断成功`;
      event = {
        time: timeRemaining,
        quarter,
        description,
        homeScore,
        awayScore,
        type: "steal"
      };
    }
    
    setEvents(prev => [event, ...prev]);
    setCurrentEvent(description);
    setTimeout(() => setCurrentEvent(null), 3000);
    
    // 切换球权
    setPossession(p => p === "home" ? "away" : "home");
    setShotClock(24);
    
    // 消耗体能
    attacker.currentStamina = Math.max(0, attacker.currentStamina - 1);
  };

  // 游戏主循环
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // 节结束
          if (quarter < 4) {
            setQuarter(q => q + 1);
            // 显示啦啦队表演
            if (quarter === 2) {
              setCheerleaderVideo("/cheerleader-halftime.mp4");
              setShowCheerleader(true);
              setTimeout(() => setShowCheerleader(false), 5000);
            } else {
              setCheerleaderVideo("/cheerleader-timeout.mp4");
              setShowCheerleader(true);
              setTimeout(() => setShowCheerleader(false), 3000);
            }
            return gameDuration / 4;
          } else {
            // 比赛结束
            setIsPlaying(false);
            onGameEnd(homeScore, awayScore, events);
            return 0;
          }
        }
        
        // 进攻时钟倒计时
        setShotClock(sc => {
          if (sc <= 0) {
            simulatePossession();
            return 24;
          }
          return sc - 1;
        });
        
        return prev - 1;
      });
    }, 1000 / gameSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, gameSpeed, quarter, timeRemaining]);

  // 自动滚动事件日志
  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = 0;
    }
  }, [events]);

  return (
    <div className="space-y-4">
      {/* 比分板 */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold mb-2">{homeTeam.name}</h3>
            <motion.div
              key={homeScore}
              initial={{ scale: 1.2, color: "#FF6B35" }}
              animate={{ scale: 1, color: "#000" }}
              className="text-7xl font-bold"
            >
              {homeScore}
            </motion.div>
          </div>
          
          <div className="text-center px-8">
            <div className="text-xl font-bold mb-2">第{quarter}节</div>
            <div className="text-5xl font-mono font-bold text-orange-600 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600">
              进攻时间: {shotClock}秒
            </div>
            <div className="mt-2 text-sm font-bold">
              {possession === "home" ? "←" : "→"} 球权
            </div>
          </div>
          
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold mb-2">{awayTeam.name}</h3>
            <motion.div
              key={awayScore}
              initial={{ scale: 1.2, color: "#FF6B35" }}
              animate={{ scale: 1, color: "#000" }}
              className="text-7xl font-bold"
            >
              {awayScore}
            </motion.div>
          </div>
        </div>
      </Card>

      {/* 球场区域 */}
      <Card className="relative h-96 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/bg-romantic-court.png)" }}
        />
        
        {/* 当前事件显示 */}
        <AnimatePresence>
          {currentEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="text-3xl font-bold text-white bg-black/70 px-8 py-4 rounded-lg backdrop-blur-sm text-center max-w-2xl">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setShowCheerleader(false)}
          >
            <video
              src={cheerleaderVideo}
              autoPlay
              loop
              className="max-w-5xl max-h-screen"
            />
            <div className="absolute top-8 right-8">
              <Button onClick={() => setShowCheerleader(false)}>
                跳过
              </Button>
            </div>
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
            {isPlaying ? "暂停" : "开始"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setGameSpeed(s => s === 4 ? 1 : s * 2)}
          >
            {gameSpeed}x 速度
          </Button>
        </div>
      </Card>

      {/* 事件日志 */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <h3 className="font-bold mb-2">比赛实况</h3>
        <div 
          ref={eventLogRef}
          className="h-48 overflow-y-auto space-y-1 text-sm"
        >
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-2 bg-gray-50 rounded"
            >
              <span className="font-mono text-gray-500">
                Q{event.quarter} {formatTime(event.time)}
              </span>
              {" - "}
              <span>{event.description}</span>
              {" "}
              <span className="font-bold text-orange-600">
                ({event.homeScore}-{event.awayScore})
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

