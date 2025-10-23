import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 模拟球员数据
const createMockPlayer = (id: number, name: string, position: string, team: "home" | "away") => ({
  id,
  name,
  position,
  scoring: Math.floor(Math.random() * 10) + 10,
  passing: Math.floor(Math.random() * 10) + 10,
  defense: Math.floor(Math.random() * 10) + 10,
  athleticism: Math.floor(Math.random() * 10) + 10,
  basketballIQ: Math.floor(Math.random() * 10) + 10,
  stamina: Math.floor(Math.random() * 10) + 10,
  threePointTendency: Math.random() * 5 + 3,
  midRangeTendency: Math.random() * 5 + 3,
  driveTendency: Math.random() * 5 + 3,
  team,
});

// 模拟比赛事件
interface GameEvent {
  id: number;
  type: "shot" | "assist" | "rebound" | "steal" | "block" | "quarter_end";
  time: number;
  quarter: number;
  team: "home" | "away";
  player?: { name: string };
  targetPlayer?: { name: string };
  success?: boolean;
  points?: number;
  description: string;
}

export default function QuickMatch() {
  const [, setLocation] = useLocation();
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  
  const [quarter, setQuarter] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3分钟 = 180秒
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  const eventIdCounter = useRef(0);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新事件
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // 比赛计时器
  useEffect(() => {
    if (!gameStarted || isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // 每5秒生成一个事件
        if (prev % 5 === 0) {
          generateRandomEvent();
        }
        
        // 时间到，结束比赛
        if (newTime <= 0) {
          setGameStarted(false);
          addEvent({
            type: "quarter_end",
            team: "home",
            description: "比赛结束！",
          });
        }
        
        return Math.max(0, newTime);
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [gameStarted, isPaused, speed, timeRemaining]);

  const addEvent = (eventData: Partial<GameEvent>) => {
    const event: GameEvent = {
      id: eventIdCounter.current++,
      time: timeRemaining,
      quarter,
      team: eventData.team || "home",
      type: eventData.type || "shot",
      description: eventData.description || "",
      ...eventData,
    };
    
    setEvents(prev => [...prev, event]);
    setCurrentEvent(event);
    
    // 3秒后清除当前事件动画
    setTimeout(() => {
      setCurrentEvent(null);
    }, 3000);
  };

  const generateRandomEvent = () => {
    const team = Math.random() > 0.5 ? "home" : "away";
    const eventTypes = ["shot", "assist", "rebound", "steal", "block"] as const;
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const playerNames = ["张三", "李四", "王五", "赵六", "孙七"];
    const playerName = playerNames[Math.floor(Math.random() * playerNames.length)];
    
    let description = "";
    let points = 0;
    
    switch (type) {
      case "shot":
        const shotTypes = ["三分球", "中距离", "上篮"];
        const shotType = shotTypes[Math.floor(Math.random() * shotTypes.length)];
        const success = Math.random() > 0.5;
        
        if (success) {
          points = shotType === "三分球" ? 3 : 2;
          if (team === "home") {
            setHomeScore(prev => prev + points);
          } else {
            setAwayScore(prev => prev + points);
          }
        }
        
        description = `${playerName} ${shotType} ${success ? "命中" : "不中"}！`;
        addEvent({ type, team, player: { name: playerName }, success, points, description });
        break;
        
      case "assist":
        description = `${playerName} 精彩助攻！`;
        addEvent({ type, team, player: { name: playerName }, description });
        break;
        
      case "rebound":
        description = `${playerName} 抢到篮板！`;
        addEvent({ type, team, player: { name: playerName }, description });
        break;
        
      case "steal":
        description = `${playerName} 抢断成功！`;
        addEvent({ type, team, player: { name: playerName }, description });
        break;
        
      case "block":
        description = `${playerName} 盖帽！`;
        addEvent({ type, team, player: { name: playerName }, description });
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setGameStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSpeedChange = () => {
    setSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-orange-100 relative overflow-hidden">
      {/* 新海诚风格背景 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url('/match-court-bg.png'), linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFF5E6 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* 飘动的云朵 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-32 bg-white rounded-full opacity-60 blur-xl"
            initial={{ x: -300, y: Math.random() * 400 }}
            animate={{ x: "120vw", y: Math.random() * 400 + 50 }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* 返回按钮 */}
        <Button
          variant="outline"
          onClick={() => setLocation("/match")}
          className="mb-4 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回比赛选择
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：计分板和控制 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 计分板 */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="relative">
                {/* 计分板背景图 */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "url('/match-scoreboard.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                
                <div className="relative p-8">
                  {/* 时间和节数 */}
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-orange-600 mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-2xl text-gray-700">
                      第 {quarter} 节
                    </div>
                  </div>

                  {/* 比分 */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* 主队 */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">主队</div>
                      <motion.div 
                        className="text-7xl font-bold text-orange-500"
                        key={homeScore}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {homeScore}
                      </motion.div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-400">VS</div>
                    </div>

                    {/* 客队 */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">客队</div>
                      <motion.div 
                        className="text-7xl font-bold text-blue-500"
                        key={awayScore}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {awayScore}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 控制按钮 */}
            <div className="flex gap-4 justify-center">
              {!gameStarted ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl px-12 py-6"
                >
                  <Play className="w-6 h-6 mr-2" />
                  开始比赛
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    size="lg"
                    variant={isPaused ? "default" : "outline"}
                    className="text-lg px-8 py-6"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    {isPaused ? "继续" : "暂停"}
                  </Button>
                  
                  <Button
                    onClick={handleSpeedChange}
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    <FastForward className="w-5 h-5 mr-2" />
                    {speed}x 倍速
                  </Button>
                </>
              )}
            </div>

            {/* 当前事件动画 */}
            <AnimatePresence>
              {currentEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.8 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 shadow-2xl">
                    <div className="text-4xl font-bold text-center">
                      {currentEvent.description}
                    </div>
                    {currentEvent.points && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-6xl font-bold text-center mt-4 text-yellow-300"
                      >
                        +{currentEvent.points}
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 球员动作动画区域 */}
            <div className="relative h-64 bg-gradient-to-b from-transparent to-white/50 rounded-xl overflow-hidden">
              <AnimatePresence>
                {currentEvent?.type === "shot" && currentEvent.success && (
                  <motion.img
                    key="shooting"
                    src="/player-shooting.png"
                    alt="投篮"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-contain"
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -100 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {currentEvent?.type === "block" && (
                  <motion.img
                    key="defense"
                    src="/player-defense.png"
                    alt="防守"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-contain"
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 200 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {currentEvent?.type === "shot" && currentEvent.success && currentEvent.points === 2 && (
                  <motion.img
                    key="dunking"
                    src="/player-dunking.png"
                    alt="扣篮"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-contain"
                    initial={{ opacity: 0, y: -200 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 200 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧：事件日志 */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl h-[600px] flex flex-col">
              <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-blue-500">
                <h3 className="text-xl font-bold text-white">比赛实况</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {events.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    等待比赛开始...
                  </div>
                ) : (
                  <>
                    {events.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg ${
                          event.team === "home"
                            ? "bg-orange-50 border-l-4 border-orange-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(event.time)} - Q{event.quarter}
                          </span>
                          {event.points && (
                            <span className="text-lg font-bold text-green-600">
                              +{event.points}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {event.description}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={eventsEndRef} />
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* 观众欢呼背景 */}
        {currentEvent?.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{
              backgroundImage: "url('/crowd-cheering.png')",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          />
        )}
      </div>
    </div>
  );
}

