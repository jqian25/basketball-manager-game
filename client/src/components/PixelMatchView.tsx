import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Player {
  id: number;
  x: number;
  y: number;
  team: "orange" | "blue";
  action: "idle" | "walk" | "shoot" | "dunk" | "defend";
  direction: "down" | "left" | "right" | "up";
  targetX: number;
  targetY: number;
  hasBall: boolean;
  speed: number;
  animFrame: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isFlying: boolean;
}

interface PixelMatchViewProps {
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: number;
  currentEvent?: string;
}

export default function PixelMatchView({
  homeScore,
  awayScore,
  quarter,
  timeRemaining,
  currentEvent,
}: PixelMatchViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [ball, setBall] = useState<Ball>({ x: 400, y: 300, vx: 0, vy: 0, isFlying: false });
  const animationFrameRef = useRef<number | null>(null);
  const spritesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const courtImgRef = useRef<HTMLImageElement | null>(null);
  const ballImgRef = useRef<HTMLImageElement | null>(null);
  const frameCountRef = useRef(0);

  // 初始化球员位置（开罗游戏风格的阵型）
  useEffect(() => {
    const initialPlayers: Player[] = [
      // 橙队（主队）- 左侧阵型
      { id: 1, x: 150, y: 200, team: "orange", action: "idle", direction: "right", targetX: 150, targetY: 200, hasBall: false, speed: 2, animFrame: 0 },
      { id: 2, x: 200, y: 300, team: "orange", action: "idle", direction: "right", targetX: 200, targetY: 300, hasBall: true, speed: 2, animFrame: 0 },
      { id: 3, x: 150, y: 400, team: "orange", action: "idle", direction: "right", targetX: 150, targetY: 400, hasBall: false, speed: 2, animFrame: 0 },
      { id: 4, x: 250, y: 250, team: "orange", action: "idle", direction: "right", targetX: 250, targetY: 250, hasBall: false, speed: 2, animFrame: 0 },
      { id: 5, x: 250, y: 350, team: "orange", action: "idle", direction: "right", targetX: 250, targetY: 350, hasBall: false, speed: 2, animFrame: 0 },
      
      // 蓝队（客队）- 右侧阵型
      { id: 6, x: 650, y: 200, team: "blue", action: "idle", direction: "left", targetX: 650, targetY: 200, hasBall: false, speed: 2, animFrame: 0 },
      { id: 7, x: 600, y: 300, team: "blue", action: "idle", direction: "left", targetX: 600, targetY: 300, hasBall: false, speed: 2, animFrame: 0 },
      { id: 8, x: 650, y: 400, team: "blue", action: "idle", direction: "left", targetX: 650, targetY: 400, hasBall: false, speed: 2, animFrame: 0 },
      { id: 9, x: 550, y: 250, team: "blue", action: "idle", direction: "left", targetX: 550, targetY: 250, hasBall: false, speed: 2, animFrame: 0 },
      { id: 10, x: 550, y: 350, team: "blue", action: "idle", direction: "left", targetX: 550, targetY: 350, hasBall: false, speed: 2, animFrame: 0 },
    ];
    setPlayers(initialPlayers);
  }, []);

  // 加载所有sprite图片
  useEffect(() => {
    const loadSprites = async () => {
      const sprites: { [key: string]: HTMLImageElement } = {};
      
      // 加载橙队球员
      for (let i = 1; i <= 10; i++) {
        const img = new Image();
        img.src = `/sprites/player_orange_${i}.png`;
        sprites[`orange_${i}`] = img;
      }
      
      // 加载蓝队球员
      for (let i = 1; i <= 10; i++) {
        const img = new Image();
        img.src = `/sprites/player_blue_${i}.png`;
        sprites[`blue_${i}`] = img;
      }
      
      spritesRef.current = sprites;
    };
    
    // 加载球场
    const courtImg = new Image();
    courtImg.src = "/pixel-court.png";
    courtImgRef.current = courtImg;
    
    // 加载篮球
    const ballImg = new Image();
    ballImg.src = "/pixel-basketball.png";
    ballImgRef.current = ballImg;
    
    loadSprites();
  }, []);

  // 球员AI移动逻辑
  const updatePlayerAI = (player: Player, allPlayers: Player[], currentBall: Ball): Player => {
    let newPlayer = { ...player };
    
    // 如果已经到达目标位置，设置新目标
    const distToTarget = Math.hypot(player.x - player.targetX, player.y - player.targetY);
    
    if (distToTarget < 5) {
      // 到达目标，设置新的随机目标
      if (player.hasBall) {
        // 持球者向篮筐移动
        if (player.team === "orange") {
          newPlayer.targetX = 700 + Math.random() * 50;
          newPlayer.targetY = 280 + Math.random() * 40;
        } else {
          newPlayer.targetX = 50 + Math.random() * 50;
          newPlayer.targetY = 280 + Math.random() * 40;
        }
      } else {
        // 无球者随机移动
        newPlayer.targetX = 100 + Math.random() * 600;
        newPlayer.targetY = 150 + Math.random() * 300;
      }
    }
    
    // 向目标移动
    const dx = player.targetX - player.x;
    const dy = player.targetY - player.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist > 1) {
      const moveX = (dx / dist) * player.speed;
      const moveY = (dy / dist) * player.speed;
      
      newPlayer.x += moveX;
      newPlayer.y += moveY;
      
      // 更新方向
      if (Math.abs(dx) > Math.abs(dy)) {
        newPlayer.direction = dx > 0 ? "right" : "left";
      } else {
        newPlayer.direction = dy > 0 ? "down" : "up";
      }
      
      // 更新动作
      newPlayer.action = "walk";
      
      // 更新动画帧
      if (frameCountRef.current % 10 === 0) {
        newPlayer.animFrame = (newPlayer.animFrame + 1) % 3;
      }
    } else {
      newPlayer.action = "idle";
      newPlayer.animFrame = 0;
    }
    
    return newPlayer;
  };

  // 主游戏循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      frameCountRef.current++;
      
      // 清空画布
      ctx.clearRect(0, 0, 800, 600);
      
      // 绘制球场
      if (courtImgRef.current && courtImgRef.current.complete) {
        ctx.drawImage(courtImgRef.current, 0, 0, 800, 600);
      } else {
        // 简单的球场背景
        ctx.fillStyle = "#D2691E";
        ctx.fillRect(0, 0, 800, 600);
        
        // 中线
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 600);
        ctx.stroke();
        
        // 中圈
        ctx.beginPath();
        ctx.arc(400, 300, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // 三分线
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(50, 300, 150, -Math.PI/2, Math.PI/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(750, 300, 150, Math.PI/2, Math.PI*1.5);
        ctx.stroke();
      }
      
      // 更新并绘制球员
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(player => 
          updatePlayerAI(player, prevPlayers, ball)
        );
        
        // 绘制所有球员
        updatedPlayers.forEach((player, index) => {
          const spriteKey = `${player.team}_${index % 5 + 1}`;
          const sprite = spritesRef.current[spriteKey];
          
          if (sprite && sprite.complete) {
            // Sprite sheet布局：3列4行
            // 行：0=down, 1=left, 2=right, 3=up
            const directionRow = { down: 0, left: 1, right: 2, up: 3 }[player.direction];
            const frameCol = player.animFrame;
            
            const spriteWidth = sprite.width / 3;  // 3帧
            const spriteHeight = sprite.height / 4; // 4方向
            
            const sx = frameCol * spriteWidth;
            const sy = directionRow * spriteHeight;
            
            // 放大4倍绘制（16x16 -> 64x64）
            const scale = 4;
            const drawWidth = spriteWidth * scale;
            const drawHeight = spriteHeight * scale;
            
            ctx.save();
            ctx.imageSmoothingEnabled = false; // 像素艺术不要平滑
            ctx.drawImage(
              sprite,
              sx, sy, spriteWidth, spriteHeight,
              player.x - drawWidth / 2, player.y - drawHeight / 2, drawWidth, drawHeight
            );
            ctx.restore();
            
            // 如果持球，绘制篮球
            if (player.hasBall && ballImgRef.current && ballImgRef.current.complete) {
              ctx.drawImage(
                ballImgRef.current,
                player.x - 8, player.y - drawHeight / 2 - 16, 16, 16
              );
            }
          } else {
            // 后备方案：绘制简单的矩形
            ctx.fillStyle = player.team === "orange" ? "#FF6B35" : "#3B82F6";
            ctx.fillRect(player.x - 8, player.y - 8, 16, 16);
          }
        });
        
        return updatedPlayers;
      });
      
      // 绘制篮球（如果在空中）
      if (ball.isFlying && ballImgRef.current && ballImgRef.current.complete) {
        ctx.drawImage(ballImgRef.current, ball.x - 8, ball.y - 8, 16, 16);
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ball, players]);

  // 根据比赛事件触发动作
  useEffect(() => {
    if (!currentEvent) return;

    if (currentEvent.includes("投篮") || currentEvent.includes("三分")) {
      // 触发投篮动画
      setPlayers(prev => {
        const shooter = prev.find(p => p.hasBall);
        if (shooter) {
          return prev.map(p => 
            p.id === shooter.id 
              ? { ...p, action: "shoot" }
              : p
          );
        }
        return prev;
      });
    }
  }, [currentEvent]);

  return (
    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center p-4">
      {/* 像素画布 */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-yellow-500 rounded-lg shadow-2xl"
        style={{
          imageRendering: "pixelated" as any,
          maxWidth: "100%",
          height: "auto",
        }}
      />

      {/* 比分显示 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg border-2 border-yellow-500">
        <div className="flex items-center gap-6 text-white font-bold">
          <div className="text-center">
            <div className="text-orange-400 text-sm">主队</div>
            <div className="text-3xl">{homeScore}</div>
          </div>
          <div className="text-yellow-400 text-2xl">-</div>
          <div className="text-center">
            <div className="text-blue-400 text-sm">客队</div>
            <div className="text-3xl">{awayScore}</div>
          </div>
        </div>
        <div className="text-center text-yellow-400 text-sm mt-1">
          Q{quarter} {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* 当前事件提示 */}
      {currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 px-6 py-2 rounded-full text-white font-bold shadow-lg"
        >
          {currentEvent}
        </motion.div>
      )}
    </div>
  );
}

