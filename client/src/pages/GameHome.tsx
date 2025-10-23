import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import AIAssistant from "@/components/AIAssistant";

export default function GameHome() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* AI助手 */}
      <AIAssistant />
      {/* 顶部导航栏 */}
      <nav className="bg-gray-900/80 border-b border-yellow-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">{APP_TITLE}</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            返回首页
          </Button>
        </div>
      </nav>

      {/* 主菜单 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuCard
            title="开始比赛"
            description="进入比赛模拟，观看你的球队征战赛场"
            icon="🏀"
            onClick={() => setLocation("/match")}
          />
          <MenuCard
            title="球员管理"
            description="查看和培养你的球员，提升他们的属性"
            icon="👥"
            onClick={() => setLocation("/players")}
          />
          <MenuCard
            title="阵容编辑"
            description="调整球队阵容和战术设置"
            icon="📋"
            onClick={() => setLocation("/lineup")}
          />
          <MenuCard
            title="设施建设"
            description="建造和升级俱乐部设施"
            icon="🏢"
            onClick={() => setLocation("/facilities")}
          />
          <MenuCard
            title="赞助商"
            description="管理赞助商合作，获取资金支持"
            icon="💰"
            onClick={() => setLocation("/sponsors")}
          />
          <MenuCard
            title="球迷活动"
            description="举办活动，提升俱乐部人气"
            icon="🎉"
            onClick={() => setLocation("/fans")}
          />
          <MenuCard
            title="数据统计"
            description="查看球队和球员的详细数据"
            icon="📊"
            onClick={() => setLocation("/stats")}
          />
          <MenuCard
            title="联赛排名"
            description="查看当前联赛排名和赛程"
            icon="🏆"
            onClick={() => setLocation("/league")}
          />
          <MenuCard
            title="设置"
            description="游戏设置和存档管理"
            icon="⚙️"
            onClick={() => setLocation("/settings")}
          />
        </div>
      </div>
    </div>
  );
}

interface MenuCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

function MenuCard({ title, description, icon, onClick }: MenuCardProps) {
  return (
    <Card
      className="bg-gray-900/60 border-yellow-500/30 hover:border-yellow-500/60 transition-all cursor-pointer backdrop-blur-sm hover:scale-105"
      onClick={onClick}
    >
      <CardHeader>
        <div className="text-5xl mb-2">{icon}</div>
        <CardTitle className="text-yellow-400">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

