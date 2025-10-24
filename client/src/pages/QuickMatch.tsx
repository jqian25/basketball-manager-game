import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import KairoMatch from "@/components/game/KairoMatch";
import MatchOpeningCrawl from "@/components/MatchOpeningCrawl";
import KairoBasketballGame from "@/components/kairo/KairoBasketballGame";
import { Monitor, Gamepad2, Building2 } from "lucide-react";

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
  shotType?: "three" | "mid" | "layup" | "dunk";
}

// 解说员评论库
const commentaryTemplates = {
  shot_success_three: [
    "漂亮！三分球空心入网！",
    "太准了！三分球命中！",
    "完美的三分球！",
    "这球投得真漂亮！三分命中！",
    "神准！三分球！"
  ],
  shot_success_dunk: [
    "暴扣！势不可挡！",
    "太震撼了！扣篮得分！",
    "霸气的扣篮！",
    "这记扣篮太精彩了！",
    "力量与美感的完美结合！扣篮得分！"
  ],
  shot_success_normal: [
    "进了！两分入账！",
    "漂亮的投篮！",
    "球进了！",
    "稳稳命中！",
    "得分！"
  ],
  shot_miss: [
    "可惜！没进！",
    "哎呀，差一点！",
    "这球没投进！",
    "遗憾，没能命中！",
    "打铁了！"
  ],
  block: [
    "盖帽！精彩的防守！",
    "被盖了！",
    "太棒了！这个盖帽！",
    "防守球员及时赶到！盖帽！",
    "漂亮的封盖！"
  ],
  steal: [
    "抢断成功！",
    "漂亮的抢断！",
    "断球了！",
    "防守球员判断准确！抢断！",
    "太快了！抢断成功！"
  ],
  rebound: [
    "篮板球！",
    "抢到篮板！",
    "漂亮的篮板球！",
    "卡位成功！拿下篮板！",
    "篮板球被抢到了！"
  ],
  assist: [
    "精彩的助攻！",
    "漂亮的传球！",
    "完美的配合！",
    "这个助攻太棒了！",
    "团队配合！助攻得分！"
  ],
  score_lead: [
    "比分拉开了！",
    "领先优势扩大！",
    "分差越来越大！",
    "主队打出了气势！",
    "客队奋起直追！"
  ]
};

// 观众反应库
const crowdReactions = [
  "哇！！！",
  "太厉害了！",
  "好球！",
  "加油！",
  "太帅了！",
  "不可思议！",
  "Amazing！"
];

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
  const [showAnimation, setShowAnimation] = useState(false);
  const [commentary, setCommentary] = useState<string>("");
  const [crowdReaction, setCrowdReaction] = useState<string>("");
  const [cameraAngle, setCameraAngle] = useState<"wide" | "close" | "hoop" | "crowd">("wide");
  const [viewMode, setViewMode] = useState<"cinematic" | "pixel">("cinematic"); // 新增：视角模式
  const [showStarWarsCrawl, setShowStarWarsCrawl] = useState(false); // 新增：星球大战开场
  const [showCheerleader, setShowCheerleader] = useState(false); // 新增：啦啦队开场
  
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
          setCommentary("比赛结束！感谢各位观众的观看！");
        }
        
        return Math.max(0, newTime);
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [gameStarted, isPaused, speed, timeRemaining]);

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateCommentary = (event: GameEvent): string => {
    switch (event.type) {
      case "shot":
        if (event.success) {
          if (event.shotType === "three") {
            return getRandomItem(commentaryTemplates.shot_success_three);
          } else if (event.shotType === "dunk") {
            return getRandomItem(commentaryTemplates.shot_success_dunk);
          } else {
            return getRandomItem(commentaryTemplates.shot_success_normal);
          }
        } else {
          return getRandomItem(commentaryTemplates.shot_miss);
        }
      case "block":
        return getRandomItem(commentaryTemplates.block);
      case "steal":
        return getRandomItem(commentaryTemplates.steal);
      case "rebound":
        return getRandomItem(commentaryTemplates.rebound);
      case "assist":
        return getRandomItem(commentaryTemplates.assist);
      default:
        return "";
    }
  };

  const selectCameraAngle = (event: GameEvent): "wide" | "close" | "hoop" | "crowd" => {
    if (event.type === "shot" && event.success) {
      return Math.random() > 0.5 ? "close" : "hoop";
    } else if (event.type === "block" || event.type === "steal") {
      return "close";
    } else if (event.points && event.points >= 3) {
      return "crowd";
    } else {
      return "wide";
    }
  };

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
    setShowAnimation(true);
    
    // 生成解说
    const comment = generateCommentary(event);
    setCommentary(comment);
    
    // 如果得分，显示观众反应
    if (event.success && event.points) {
      setCrowdReaction(getRandomItem(crowdReactions));
      setTimeout(() => setCrowdReaction(""), 2000);
    }
    
    // 选择镜头角度
    setCameraAngle(selectCameraAngle(event));
    
    // 5秒后清除当前事件动画
    setTimeout(() => {
      setShowAnimation(false);
      setCurrentEvent(null);
      setCommentary("");
    }, 5000);
  };

  const generateRandomEvent = () => {
    const team = Math.random() > 0.5 ? "home" : "away";
    const eventTypes = ["shot", "assist", "rebound", "steal", "block"] as const;
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const playerNames = ["张三", "李四", "王五", "赵六", "孙七"];
    const playerName = playerNames[Math.floor(Math.random() * playerNames.length)];
    
    let description = "";
    let points = 0;
    let shotType: "three" | "mid" | "layup" | "dunk" | undefined;
    
    switch (type) {
      case "shot":
        const shotTypes: Array<"three" | "mid" | "layup" | "dunk"> = ["three", "mid", "layup", "dunk"];
        shotType = shotTypes[Math.floor(Math.random() * shotTypes.length)];
        const success = Math.random() > 0.4;
        
        const shotTypeText = {
          three: "三分球",
          mid: "中距离",
          layup: "上篮",
          dunk: "扣篮"
        }[shotType];
        
        if (success) {
          points = shotType === "three" ? 3 : 2;
          if (team === "home") {
            setHomeScore(prev => prev + points);
          } else {
            setAwayScore(prev => prev + points);
          }
        }
        
        description = `${playerName} ${shotTypeText} ${success ? "命中" : "不中"}！`;
        addEvent({ type, team, player: { name: playerName }, success, points, description, shotType });
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
    // 修复：先显示啦啦队开场，比赛不开始
    setShowCheerleader(true);
    setCommentary("欢迎来到篮球比赛现场！让我们为啦啦队的精彩表演鼓掌！");
    // 注意：这里不设置 gameStarted=true
  };
  
  // 新增：啦啦队视频播放完毕的回调
  const handleCheerleaderEnd = () => {
    setShowCheerleader(false);
    setGameStarted(true);
    setIsPaused(false);
    setCommentary("比赛开始！双方球员进入场地！");
    setTimeout(() => setCommentary(""), 3000);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSpeedChange = () => {
    setSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  // 获取动画图片
  const getAnimationImage = () => {
    if (!currentEvent) return null;
    
    switch (currentEvent.type) {
      case "shot":
        if (currentEvent.success) {
          if (currentEvent.shotType === "dunk") {
            return "/player-dunking.png";
          } else if (currentEvent.shotType === "three") {
            return "/player-shooting.png";
          } else {
            return "/player-shooting.png";
          }
        }
        return null;
        
      case "block":
        return "/player-defense.png";
        
      case "steal":
        return "/player-defense.png";
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-orange-100 relative overflow-hidden">
      {/* 修复：啦啦队开场全屏显示（使用视频/图片+自动关闭） */}
      <AnimatePresence>
        {showCheerleader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={handleCheerleaderEnd}
          >
            {/* 使用图片模拟视频，5秒后自动关闭 */}
            <img
              src="/cheerleader-performance.png"
              alt="Cheerleader Performance"
              className="w-full h-full object-cover"
              onLoad={() => {
                // 图片加载后5秒自动关闭
                setTimeout(handleCheerleaderEnd, 5000);
              }}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
            >
              <div className="text-5xl font-bold text-white drop-shadow-2xl">
                🎉 啦啦队热场表演 🎉
              </div>
              <div className="text-2xl text-yellow-400 mt-4">
                比赛即将开始...
              </div>
              <div className="text-lg text-white/80 mt-2">
                （点击屏幕跳过）
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 新海诚风格背景 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFF5E6 100%)",
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

      {/* 全屏动画层（灌篮高手风格） */}
      <AnimatePresence>
        {showAnimation && currentEvent && getAnimationImage() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          >
            {/* 速度线背景（灌篮高手风格） */}
            {cameraAngle === "close" && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-0.5 bg-white"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: 0,
                      width: "100%",
                      opacity: 0.3,
                    }}
                    initial={{ x: "100vw" }}
                    animate={{ x: "-100vw" }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.01,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            )}

            {/* 球员动作特写 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ 
                  scale: cameraAngle === "close" ? 0.5 : 0.8, 
                  opacity: 0,
                  x: cameraAngle === "close" ? -200 : 0,
                  y: cameraAngle === "hoop" ? 200 : 0,
                }}
                animate={{ 
                  scale: cameraAngle === "close" ? 1.5 : 1.2, 
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                exit={{ 
                  scale: cameraAngle === "close" ? 2 : 1.5, 
                  opacity: 0 
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <img
                  src={getAnimationImage()!}
                  alt="动作"
                  className={`object-contain drop-shadow-2xl ${
                    cameraAngle === "close" ? "max-h-[90vh]" : "max-h-[70vh]"
                  }`}
                />
                
                {/* 闪光效果 */}
                {currentEvent.success && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-white rounded-full blur-3xl"
                  />
                )}
              </motion.div>
            </div>

            {/* 观众席（得分时） */}
            {cameraAngle === "crowd" && currentEvent.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-96"
                style={{
                  backgroundImage: "url('/crowd-cheering.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              />
            )}

            {/* 观众反应文字 */}
            {crowdReaction && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                className="absolute top-20 right-20"
              >
                <div className="text-6xl font-black text-yellow-400 drop-shadow-2xl transform -rotate-12">
                  {crowdReaction}
                </div>
              </motion.div>
            )}

            {/* 得分特效 */}
            {currentEvent.points && (
              <motion.div
                initial={{ scale: 0, y: 100, rotate: -45 }}
                animate={{ scale: 2, y: 0, rotate: 0 }}
                exit={{ scale: 3, opacity: 0, y: -100 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
              >
                <div className="relative">
                  {/* 阴影 */}
                  <div className="absolute inset-0 text-9xl font-black text-black blur-lg opacity-50 transform translate-x-3 translate-y-3">
                    +{currentEvent.points}
                  </div>
                  {/* 主文字 */}
                  <div className="relative text-9xl font-black text-yellow-400 drop-shadow-2xl">
                    +{currentEvent.points}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 解说员字幕（灌篮高手风格） */}
      <AnimatePresence>
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-32 left-0 right-0 z-40 flex justify-center pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-orange-500">
              <div className="text-2xl md:text-3xl font-bold text-white text-center">
                <span className="text-orange-500">【解说】</span> {commentary}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                        initial={{ scale: 1.5, color: "#FFD700" }}
                        animate={{ scale: 1, color: "#F97316" }}
                        transition={{ duration: 0.5 }}
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
                        initial={{ scale: 1.5, color: "#FFD700" }}
                        animate={{ scale: 1, color: "#3B82F6" }}
                        transition={{ duration: 0.5 }}
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
                  
                  {/* 新增：视角切换按钮 */}
                  <Button
                    onClick={() => setViewMode(prev => prev === "cinematic" ? "pixel" : "cinematic")}
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    {viewMode === "cinematic" ? (
                      <>
                        <Gamepad2 className="w-5 h-5 mr-2" />
                        像素模式
                      </>
                    ) : (
                      <>
                        <Monitor className="w-5 h-5 mr-2" />
                        电影模式
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
            
            {/* 新增：开罗风格比赛视图 */}
            {gameStarted && viewMode === "pixel" && (
              <Card className="bg-black/90 backdrop-blur-sm shadow-2xl overflow-hidden mt-6">
                <KairoMatch />
              </Card>
            )}
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
      </div>
    </div>
  );
}

