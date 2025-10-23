/**
 * 开放世界游戏主组件
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { GameMap, PlayerCharacter, InputState, NPC } from "../../types/openWorld";
import { PlayerController } from "../../systems/openWorld/PlayerController";
import { NPCDialogueSystem } from "../../systems/openWorld/NPCDialogueSystem";
import { SHOHOKU_SCHOOL_MAP } from "../../data/maps/shohokuSchoolMap";

export function OpenWorldGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMap, setCurrentMap] = useState<GameMap>(SHOHOKU_SCHOOL_MAP);
  const [player, setPlayer] = useState<PlayerCharacter>({
    id: "player-1",
    name: "玩家",
    x: SHOHOKU_SCHOOL_MAP.spawnPoint.x,
    y: SHOHOKU_SCHOOL_MAP.spawnPoint.y,
    direction: "down",
    speed: 5,
    spriteSheet: "/characters/player-pg-idle.png",
    currentAnimation: "idle",
    currentMapId: SHOHOKU_SCHOOL_MAP.metadata.id
  });
  
  const [dialogueNpc, setDialogueNpc] = useState<NPC | null>(null);
  const [dialogueMessages, setDialogueMessages] = useState<Array<{speaker: string; text: string}>>([]);
  const [playerInput, setPlayerInput] = useState("");
  
  const playerControllerRef = useRef<PlayerController | null>(null);
  const dialogueSystemRef = useRef<NPCDialogueSystem>(new NPCDialogueSystem());
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  // 初始化玩家控制器
  useEffect(() => {
    playerControllerRef.current = new PlayerController(player);
    playerControllerRef.current.setCurrentMap(currentMap);
  }, []);

  // 键盘输入处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dialogueNpc) {
        // 对话模式下不处理移动
        if (e.key === "Escape") {
          setDialogueNpc(null);
          setDialogueMessages([]);
          dialogueSystemRef.current.endDialogue();
        }
        return;
      }

      const inputUpdate: Partial<InputState> = {};
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          inputUpdate.up = true;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          inputUpdate.down = true;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          inputUpdate.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          inputUpdate.right = true;
          break;
        case "Shift":
          inputUpdate.run = true;
          break;
        case " ":
        case "Enter":
          inputUpdate.interact = true;
          checkInteraction();
          break;
      }
      
      if (Object.keys(inputUpdate).length > 0) {
        playerControllerRef.current?.updateInput(inputUpdate);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const inputUpdate: Partial<InputState> = {};
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          inputUpdate.up = false;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          inputUpdate.down = false;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          inputUpdate.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          inputUpdate.right = false;
          break;
        case "Shift":
          inputUpdate.run = false;
          break;
        case " ":
        case "Enter":
          inputUpdate.interact = false;
          break;
      }
      
      if (Object.keys(inputUpdate).length > 0) {
        playerControllerRef.current?.updateInput(inputUpdate);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dialogueNpc]);

  // 检查交互
  const checkInteraction = useCallback(() => {
    if (!playerControllerRef.current) return;
    
    const playerPos = playerControllerRef.current.getPosition();
    const interactionRange = 2;

    // 检查NPC交互
    for (const npc of currentMap.npcs) {
      const distance = Math.sqrt(
        Math.pow(npc.x - playerPos.x, 2) + Math.pow(npc.y - playerPos.y, 2)
      );
      
      if (distance <= interactionRange && npc.interactable) {
        startDialogue(npc);
        return;
      }
    }

    // 检查篮球场入口
    for (const court of currentMap.basketballCourts) {
      if (playerPos.x >= court.x && playerPos.x <= court.x + court.width &&
          playerPos.y >= court.y && playerPos.y <= court.y + court.height) {
        alert(`进入${court.courtName}（功能开发中...）`);
        return;
      }
    }
  }, [currentMap]);

  // 开始对话
  const startDialogue = async (npc: NPC) => {
    setDialogueNpc(npc);
    
    const session = await dialogueSystemRef.current.startDialogue(npc, player.name);
    setDialogueMessages(session.messages.map(m => ({
      speaker: m.speaker,
      text: m.text
    })));
  };

  // 发送消息
  const sendMessage = async () => {
    if (!playerInput.trim() || !dialogueNpc) return;
    
    const userMessage = playerInput;
    setPlayerInput("");
    
    // 添加玩家消息
    setDialogueMessages(prev => [...prev, {
      speaker: player.name,
      text: userMessage
    }]);

    // 获取NPC回复
    const response = await dialogueSystemRef.current.sendMessage(userMessage, player.name);
    
    setDialogueMessages(prev => [...prev, {
      speaker: dialogueNpc.name,
      text: response
    }]);
  };

  // 游戏循环
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // 更新玩家
      if (playerControllerRef.current && !dialogueNpc) {
        playerControllerRef.current.update(deltaTime);
        const updatedPlayer = playerControllerRef.current.getPlayer();
        setPlayer(updatedPlayer);
      }

      // 渲染
      render();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dialogueNpc]);

  // 渲染函数
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = "#87CEEB"; // 天空蓝
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = 32;
    const cameraX = player.x * tileSize - canvas.width / 2;
    const cameraY = player.y * tileSize - canvas.height / 2;

    // 渲染地图瓦片
    for (let y = 0; y < currentMap.tiles.length; y++) {
      for (let x = 0; x < currentMap.tiles[y].length; x++) {
        const tile = currentMap.tiles[y][x];
        const screenX = x * tileSize - cameraX;
        const screenY = y * tileSize - cameraY;

        // 根据瓦片类型绘制
        switch (tile.type) {
          case "grass":
            ctx.fillStyle = "#90EE90";
            break;
          case "road":
            ctx.fillStyle = "#808080";
            break;
          case "building":
            ctx.fillStyle = "#8B4513";
            break;
          case "court":
            ctx.fillStyle = "#FFA500";
            break;
          case "water":
            ctx.fillStyle = "#4169E1";
            break;
          default:
            ctx.fillStyle = "#FFFFFF";
        }

        ctx.fillRect(screenX, screenY, tileSize, tileSize);
        
        // 绘制网格线
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.strokeRect(screenX, screenY, tileSize, tileSize);
      }
    }

    // 渲染NPC
    for (const npc of currentMap.npcs) {
      const screenX = npc.x * tileSize - cameraX;
      const screenY = npc.y * tileSize - cameraY;
      
      ctx.fillStyle = "#FF6347";
      ctx.fillRect(screenX, screenY, tileSize, tileSize);
      
      // 绘制NPC名字
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, screenX + tileSize / 2, screenY - 5);
    }

    // 渲染玩家
    const playerScreenX = player.x * tileSize - cameraX;
    const playerScreenY = player.y * tileSize - cameraY;
    
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(playerScreenX, playerScreenY, tileSize, tileSize);
    
    // 绘制玩家名字
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name, playerScreenX + tileSize / 2, playerScreenY - 5);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="mx-auto"
      />
      
      {/* 控制提示 */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded">
        <div className="text-sm">
          <p><strong>移动:</strong> WASD 或 方向键</p>
          <p><strong>奔跑:</strong> Shift</p>
          <p><strong>交互:</strong> Space 或 Enter</p>
          <p><strong>位置:</strong> ({player.x.toFixed(1)}, {player.y.toFixed(1)})</p>
        </div>
      </div>

      {/* 对话框 */}
      {dialogueNpc && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 h-64 overflow-y-auto space-y-2">
              {dialogueMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded ${
                    msg.speaker === player.name
                      ? "bg-blue-600 ml-auto max-w-md"
                      : "bg-gray-700 mr-auto max-w-md"
                  }`}
                >
                  <div className="font-bold text-sm">{msg.speaker}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2 bg-gray-800 rounded"
                autoFocus
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                发送
              </button>
              <button
                onClick={() => {
                  setDialogueNpc(null);
                  setDialogueMessages([]);
                  dialogueSystemRef.current.endDialogue();
                }}
                className="px-6 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                结束对话
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

