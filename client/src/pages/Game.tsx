import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_TITLE } from "@/const";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Users,
  Trophy,
  Building2,
  Handshake,
  BarChart3,
  Settings,
  LogOut,
  Play,
  Home,
  Map,
  Gamepad2,
} from "lucide-react";

export default function Game() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // 游戏功能菜单
  const gameMenuItems = [
    {
      icon: Play,
      title: "快速比赛",
      description: "立即开始一场比赛",
      color: "from-orange-500 to-orange-600",
      path: "/match",
      available: true,
    },
    {
      icon: Users,
      title: "球员管理",
      description: "管理你的球员阵容",
      color: "from-blue-500 to-blue-600",
      path: "/players",
      available: isAuthenticated,
    },
    {
      icon: Trophy,
      title: "联赛",
      description: "参加各级别联赛",
      color: "from-yellow-500 to-yellow-600",
      path: "/league",
      available: isAuthenticated,
    },
    {
      icon: Building2,
      title: "设施建设",
      description: "升级训练和俱乐部设施",
      color: "from-green-500 to-green-600",
      path: "/facilities",
      available: isAuthenticated,
    },
    {
      icon: Handshake,
      title: "赞助商",
      description: "管理赞助商合作",
      color: "from-purple-500 to-purple-600",
      path: "/sponsors",
      available: isAuthenticated,
    },
    {
      icon: BarChart3,
      title: "数据统计",
      description: "查看球队和球员数据",
      color: "from-pink-500 to-pink-600",
      path: "/stats",
      available: isAuthenticated,
    },
    {
      icon: Map,
      title: "开放世界",
      description: "探索日本，体验RPG冒险",
      color: "from-indigo-500 to-indigo-600",
      path: "/openworld",
      available: isAuthenticated,
    },
    {
      icon: Gamepad2,
      title: "开罗经营模式",
      description: "经典像素风格经营养成游戏",
      color: "from-rose-500 to-rose-600",
      path: "/kairo",
      available: isAuthenticated,
    },
    {
      icon: Building2,
      title: "现代化经理模式",
      description: "Fate风格高质量UI经营游戏",
      color: "from-cyan-500 to-cyan-600",
      path: "/modern",
      available: isAuthenticated,
    },
    {
      icon: Map,
      title: "像素RPG模式",
      description: "宝可梦风格自由探索篮球游戏",
      color: "from-violet-500 to-violet-600",
      path: "/rpg",
      available: true,
    },
    {
      icon: Gamepad2,
      title: "篮球RPG冒险",
      description: "完整可玩的宝可梦风格篮球游戏",
      color: "from-emerald-500 to-emerald-600",
      path: "/basketball-rpg",
      available: true,
    },
    {
      icon: Building2,
      title: "开罗篮球物语",
      description: "真正能移动的开罗风格经营游戏",
      color: "from-pink-500 to-pink-600",
      path: "/kairo-basketball",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-orange-100 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 顶部导航栏 */}
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg">
              {APP_TITLE}
            </h1>
            {user && (
              <p className="text-gray-600 mt-2">
                欢迎回来，<span className="font-semibold text-orange-500">{user.name || "经理"}</span>
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
            
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            )}
          </motion.div>
        </div>

        {/* 游戏功能菜单网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {gameMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isLocked = !item.available;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-2xl ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:scale-105"
                  } relative overflow-hidden`}
                  onClick={() => !isLocked && setLocation(item.path)}
                >
                  {/* 渐变背景 */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`}
                  ></div>

                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {item.title}
                          {isLocked && (
                            <span className="text-sm text-gray-500 font-normal">
                              (需要登录)
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <Button
                      className={`w-full bg-gradient-to-r ${item.color} text-white hover:opacity-90 transition-opacity`}
                      disabled={isLocked}
                    >
                      {isLocked ? "登录后解锁" : "进入"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 游客模式提示 */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600">游客模式提示</CardTitle>
                <CardDescription>
                  您当前以游客身份游玩，功能受限。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  注册登录后可解锁：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>球员管理和成长系统</li>
                  <li>完整48分钟NBA规则比赛</li>
                  <li>联赛和排名系统</li>
                  <li>设施建设和赞助商</li>
                  <li>详细数据统计</li>
                  <li>性感啦啦队表演</li>
                </ul>
                <Button
                  onClick={() => setLocation("/")}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                >
                  立即注册/登录
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

