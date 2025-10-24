/**
 * Phaser游戏React组件包装器
 * 将Phaser游戏嵌入到React应用中
 */

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '@/game/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';

interface NPCDialogData {
  name: string;
}

interface BuildingData {
  name: string;
}

export function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentNPC, setCurrentNPC] = useState<string>('');
  const [dialogHistory, setDialogHistory] = useState<Array<{role: string, content: string}>>([]);
  const [userInput, setUserInput] = useState('');
  const [showBuildingInfo, setShowBuildingInfo] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<string>('');

  useEffect(() => {
    // 初始化Phaser游戏
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }

    // 监听NPC交互事件
    const handleNPCInteraction = (event: Event) => {
      const customEvent = event as CustomEvent<NPCDialogData>;
      const { name } = customEvent.detail;
      setCurrentNPC(name);
      setShowDialog(true);
      setDialogHistory([
        { role: 'assistant', content: `你好！我是${name}，有什么可以帮助你的吗？` }
      ]);
    };

    // 监听建筑点击事件
    const handleBuildingClick = (event: Event) => {
      const customEvent = event as CustomEvent<BuildingData>;
      const { name } = customEvent.detail;
      setCurrentBuilding(name);
      setShowBuildingInfo(true);
    };

    window.addEventListener('npc-interaction', handleNPCInteraction);
    window.addEventListener('building-clicked', handleBuildingClick);

    return () => {
      window.removeEventListener('npc-interaction', handleNPCInteraction);
      window.removeEventListener('building-clicked', handleBuildingClick);
      
      // 清理游戏实例
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // 发送消息到AI
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setDialogHistory(prev => [...prev, newMessage]);
    setUserInput('');

    try {
      // 调用AI对话API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcName: currentNPC,
          message: userInput,
          history: dialogHistory
        })
      });

      const data = await response.json();
      
      setDialogHistory(prev => [...prev, {
        role: 'assistant',
        content: data.reply || '抱歉，我现在有点忙...'
      }]);
    } catch (error) {
      console.error('AI对话失败:', error);
      setDialogHistory(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我现在无法回应...'
      }]);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Phaser游戏容器 */}
      <div id="game-container" className="w-full h-full" />

      {/* NPC对话框 */}
      {showDialog && (
        <Card className="absolute top-4 right-4 w-96 p-4 bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-orange-300">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-lg">与 {currentNPC} 对话</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDialog(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 对话历史 */}
          <div className="h-64 overflow-y-auto mb-3 space-y-2 p-2 bg-gray-50 rounded-lg">
            {dialogHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-8 text-right'
                    : 'bg-green-100 mr-8'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600"
            >
              发送
            </Button>
          </div>
        </Card>
      )}

      {/* 建筑信息面板 */}
      {showBuildingInfo && (
        <Card className="absolute top-4 left-4 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-blue-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">{currentBuilding}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBuildingInfo(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              这是一个{currentBuilding}，可以提升球员的训练效果。
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button className="bg-blue-500 hover:bg-blue-600">
                升级设施
              </Button>
              <Button variant="outline">
                查看详情
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

