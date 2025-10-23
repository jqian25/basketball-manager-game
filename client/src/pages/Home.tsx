import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OpeningAnimation from "@/components/OpeningAnimation";
import { APP_TITLE, getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showOpening, setShowOpening] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // 如果已登录，直接跳转到游戏
  if (isAuthenticated && user) {
    setLocation("/game");
    return null;
  }

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

  const handleRegister = () => {
    // 跳转到Manus OAuth注册
    window.location.href = getLoginUrl();
  };

  if (showOpening) {
    return <OpeningAnimation onComplete={handleOpeningComplete} />;
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* 动态背景效果 */}
        <div className="stars"></div>
        <div className="particles"></div>
        
        <Card className="w-full max-w-md mx-4 bg-gray-900/80 border-yellow-500/30 backdrop-blur-sm relative z-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-yellow-400 glow-text">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105"
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
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all hover:scale-105"
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
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all hover:scale-105"
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

