import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_TITLE, getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";
import "../styles/starwars.css";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showCrawl, setShowCrawl] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // 如果已登录，直接跳转到游戏
  if (isAuthenticated && user) {
    setLocation("/game");
    return null;
  }

  const handleSkipCrawl = () => {
    setShowCrawl(false);
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

  const handleRegister = () => {
    // 跳转到Manus OAuth注册
    window.location.href = getLoginUrl();
  };

  if (showCrawl) {
    return (
      <div className="starwars-container">
        <div className="stars"></div>
        <div className="starwars-crawl">
          <div className="starwars-title">篮球热潮物语</div>
          <p>
            在遥远的篮球宇宙中，一个传奇的篮球俱乐部即将诞生......
          </p>
          <p>
            作为新任经理，你将肩负起打造世界顶级篮球队的重任。从招募天赋异禀的球员，到精心设计战术策略；从建设豪华的训练设施，到赢得赞助商的青睐。
          </p>
          <p>
            每一个决策都将影响球队的命运。培养球员的六维属性，掌握17种成长类型的奥秘。在激烈的比赛中运用战术智慧，带领你的球队从业余联赛一路征战到世界联赛的巅峰。
          </p>
          <p>
            球迷们期待着你的表现，赞助商们关注着你的成绩。在这个充满挑战与机遇的篮球世界里，只有最优秀的经理才能打造出名震四海的传奇球队！
          </p>
          <p>
            现在，你的篮球传奇即将开始......
          </p>
        </div>
        <button className="starwars-skip" onClick={handleSkipCrawl}>
          跳过开场 →
        </button>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="stars"></div>
        <Card className="w-full max-w-md mx-4 bg-gray-900/80 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-yellow-400">
              {APP_TITLE}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {isRegisterMode ? "创建新账号" : "选择登录方式"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isRegisterMode ? (
              <>
                <Button
                  onClick={handleGuestLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  游客登录
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">或</span>
                  </div>
                </div>
                <Button
                  onClick={handleUserLogin}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  size="lg"
                >
                  注册用户登录
                </Button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  还没有账号？{" "}
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    立即注册
                  </button>
                </p>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleRegister}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  size="lg"
                >
                  注册
                </Button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  已有账号？{" "}
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    返回登录
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

