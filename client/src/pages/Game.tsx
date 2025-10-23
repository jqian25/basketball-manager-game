import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Game() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600">篮球经理</h1>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
          >
            返回首页
          </Button>
        </div>

        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            游戏开发中...
          </h2>
          <p className="text-gray-600">
            核心游戏功能正在开发，敬请期待！
          </p>
        </div>
      </div>
    </div>
  );
}

