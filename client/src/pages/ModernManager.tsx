/**
 * 现代化篮球经理游戏 - 替代Kairo像素风格
 * 使用Fate/stay night高质量动漫风格 + 灌篮高手配色
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Building2, 
  Users, 
  Dumbbell, 
  Trophy, 
  DollarSign,
  Home,
  Play,
  Pause,
  TrendingUp,
  Star,
  Calendar,
  MessageCircle,
  Settings,
  Award,
  Target,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GameState {
  clubName: string;
  level: number;
  money: number;
  research: number;
  fans: number;
  reputation: number;
  year: number;
  month: number;
  week: number;
  isPaused: boolean;
}

interface Building {
  id: string;
  name: string;
  type: string;
  level: number;
  effect: string;
  icon: any;
}

interface Player {
  id: string;
  name: string;
  position: string;
  level: number;
  scoring: number;
  passing: number;
  defense: number;
}

export default function ModernManager() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    clubName: user?.name ? `${user.name}的篮球俱乐部` : "我的篮球俱乐部",
    level: 1,
    money: 50000,
    research: 100,
    fans: 1000,
    reputation: 50,
    year: 1,
    month: 1,
    week: 1,
    isPaused: false
  });

  // 建筑列表
  const [buildings, setBuildings] = useState<Building[]>([
    { id: "1", name: "训练馆", type: "training", level: 1, effect: "+10% 训练效率", icon: Dumbbell },
    { id: "2", name: "办公室", type: "office", level: 1, effect: "+5% 收入", icon: Building2 },
    { id: "3", name: "球员宿舍", type: "dorm", level: 1, effect: "+10% 体力恢复", icon: Home },
  ]);

  // 球员列表
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "张三", position: "PG", level: 5, scoring: 12, passing: 15, defense: 10 },
    { id: "2", name: "李四", position: "SG", level: 4, scoring: 14, passing: 10, defense: 8 },
    { id: "3", name: "王五", position: "SF", level: 6, scoring: 16, passing: 12, defense: 12 },
  ]);

  // 当前视图
  const [currentView, setCurrentView] = useState<"overview" | "buildings" | "players" | "match">("overview");

  // AI助手对话
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");

  const chatMutation = trpc.ai.chat.useMutation();

  // 游戏时间流逝
  useEffect(() => {
    if (gameState.isPaused) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        let { year, month, week, money, fans } = prev;
        week += 1;
        if (week > 4) {
          week = 1;
          month += 1;
          // 每月收入
          money += 5000 + fans * 0.5;
        }
        if (month > 12) {
          month = 1;
          year += 1;
        }
        return { ...prev, year, month, week, money, fans };
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [gameState.isPaused]);

  // 发送聊天消息
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: "user" as const, content: chatInput };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput("");

    try {
      const result = await chatMutation.mutateAsync({
        message: chatInput,
        history: chatMessages
      });

      setChatMessages([...updatedMessages, { role: "assistant", content: result.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages([...updatedMessages, { role: "assistant", content: "抱歉，我现在有点忙，请稍后再试！" }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-red-50">
      {/* 顶部导航栏 - Fate风格 */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* 俱乐部信息 */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border-2 border-white/40 shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg">
                  {gameState.clubName}
                </h1>
                <div className="flex items-center gap-3 text-sm opacity-95">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Lv.{gameState.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {gameState.year}年 {gameState.month}月 第{gameState.week}周
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 资源显示 */}
            <div className="flex gap-3">
              <motion.div 
                className="bg-gradient-to-br from-yellow-400 to-yellow-600 px-4 py-2 rounded-xl shadow-xl border-2 border-yellow-300"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs font-bold text-yellow-900">资金</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {gameState.money.toLocaleString()}
                </p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-blue-400 to-blue-600 px-4 py-2 rounded-xl shadow-xl border-2 border-blue-300"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs font-bold text-blue-900">研究点</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  <Zap className="w-5 h-5" />
                  {gameState.research}
                </p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-green-400 to-green-600 px-4 py-2 rounded-xl shadow-xl border-2 border-green-300"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs font-bold text-green-900">粉丝</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  {gameState.fans.toLocaleString()}
                </p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-purple-400 to-purple-600 px-4 py-2 rounded-xl shadow-xl border-2 border-purple-300"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs font-bold text-purple-900">声望</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  <Award className="w-5 h-5" />
                  {gameState.reputation}
                </p>
              </motion.div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm"
                onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
              >
                {gameState.isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    继续
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    暂停
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm"
                onClick={() => setLocation("/game")}
              >
                <Home className="w-4 h-4 mr-1" />
                返回菜单
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-6">
        {/* 导航标签 */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "overview", label: "总览", icon: TrendingUp },
            { id: "buildings", label: "建筑", icon: Building2 },
            { id: "players", label: "球员", icon: Users },
            { id: "match", label: "比赛", icon: Trophy }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={currentView === tab.id ? "default" : "outline"}
              className={currentView === tab.id ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={() => setCurrentView(tab.id as any)}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          {currentView === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* 俱乐部统计 */}
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    俱乐部统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">总球员数</span>
                      <span className="font-bold">{players.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">建筑数量</span>
                      <span className="font-bold">{buildings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">本月收入</span>
                      <span className="font-bold text-green-600">+${(5000 + gameState.fans * 0.5).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 最近比赛 */}
              <Card className="shadow-xl border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    最近比赛
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium">胜 vs 雄鹿队</p>
                      <p className="text-xs text-gray-600">98 - 92</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium">负 vs 湖人队</p>
                      <p className="text-xs text-gray-600">85 - 102</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 快速操作 */}
              <Card className="shadow-xl border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    快速操作
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    开始训练
                  </Button>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Trophy className="w-4 h-4 mr-2" />
                    参加比赛
                  </Button>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <Users className="w-4 h-4 mr-2" />
                    招募球员
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentView === "buildings" && (
            <motion.div
              key="buildings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {buildings.map(building => (
                <Card key={building.id} className="shadow-xl border-2 border-orange-200 hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <building.icon className="w-5 h-5 text-orange-500" />
                      {building.name}
                    </CardTitle>
                    <CardDescription>等级 {building.level}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{building.effect}</p>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      升级 (${1000 * building.level})
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Card className="shadow-xl border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">建造新建筑</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentView === "players" && (
            <motion.div
              key="players"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {players.map(player => (
                <Card key={player.id} className="shadow-xl border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle>{player.name}</CardTitle>
                    <CardDescription>{player.position} | Lv.{player.level}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>得分</span>
                        <span className="font-bold">{player.scoring}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>传球</span>
                        <span className="font-bold">{player.passing}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>防守</span>
                        <span className="font-bold">{player.defense}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                      <Dumbbell className="w-4 h-4 mr-2" />
                      训练
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {currentView === "match" && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-xl border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-red-500" />
                    比赛系统
                  </CardTitle>
                  <CardDescription>选择对手开始比赛</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg">
                      <div className="flex flex-col items-center">
                        <Trophy className="w-8 h-8 mb-2" />
                        <span>友谊赛</span>
                      </div>
                    </Button>
                    <Button className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg">
                      <div className="flex flex-col items-center">
                        <Award className="w-8 h-8 mb-2" />
                        <span>联赛</span>
                      </div>
                    </Button>
                    <Button className="h-24 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg">
                      <div className="flex flex-col items-center">
                        <Star className="w-8 h-8 mb-2" />
                        <span>锦标赛</span>
                      </div>
                    </Button>
                    <Button className="h-24 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-lg">
                      <div className="flex flex-col items-center">
                        <Target className="w-8 h-8 mb-2" />
                        <span>挑战赛</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI助手浮动按钮 */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* AI助手对话窗口 */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-orange-200 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
              <h3 className="font-bold text-lg">AI助手</h3>
              <p className="text-sm opacity-90">有什么可以帮您的吗？</p>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>开始对话吧！</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || chatMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  发送
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

