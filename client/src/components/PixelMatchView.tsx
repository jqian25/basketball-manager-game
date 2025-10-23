import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Player {
  id: number;
  x: number;
  y: number;
  team: "orange" | "blue";
  action: "idle" | "run" | "shoot" | "dunk" | "defend" | "celebrate";
  direction: "left" | "right";
  hasBall: boolean;
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
  const [ballPos, setBallPos] = useState({ x: 400, y: 300 });
  const animationFrameRef = useRef<number | null>(null);

  // 初始化球员位置
  useEffect(() => {
    const initialPlayers: Player[] = [
      // 橙队（主队）
      { id: 1, x: 100, y: 200, team: "orange", action: "idle", direction: "right", hasBall: false },
      { id: 2, x: 150, y: 300, team: "orange", action: "idle", direction: "right", hasBall: false },
      { id: 3, x: 100, y: 400, team: "orange", action: "idle", direction: "right", hasBall: false },
      { id: 4, x: 200, y: 250, team: "orange", action: "idle", direction: "right", hasBall: false },
      { id: 5, x: 200, y: 350, team: "orange", action: "idle", direction: "right", hasBall: false },
      // 蓝队（客队）
      { id: 6, x: 700, y: 200, team: "blue", action: "idle", direction: "left", hasBall: false },
      { id: 7, x: 650, y: 300, team: "blue", action: "idle", direction: "left", hasBall: false },
      { id: 8, x: 700, y: 400, team: "blue", action: "idle", direction: "left", hasBall: false },
      { id: 9, x: 600, y: 250, team: "blue", action: "idle", direction: "left", hasBall: false },
      { id: 10, x: 600, y: 350, team: "blue", action: "idle", direction: "left", hasBall: false },
    ];
    setPlayers(initialPlayers);
  }, []);

  // 根据比赛事件更新球员动作
  useEffect(() => {
    if (!currentEvent) return;

    // 简单的事件驱动动画
    if (currentEvent.includes("投篮") || currentEvent.includes("三分")) {
      // 随机一个橙队球员投篮
      const shooter = Math.floor(Math.random() * 5);
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === shooter
            ? { ...p, action: "shoot", hasBall: true }
            : { ...p, action: "idle", hasBall: false }
        )
      );

      // 2秒后恢复
      setTimeout(() => {
        setPlayers((prev) => prev.map((p) => ({ ...p, action: "idle", hasBall: false })));
      }, 2000);
    } else if (currentEvent.includes("扣篮")) {
      const dunker = Math.floor(Math.random() * 5);
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === dunker
            ? { ...p, action: "dunk", hasBall: true }
            : { ...p, action: "idle", hasBall: false }
        )
      );

      setTimeout(() => {
        setPlayers((prev) => prev.map((p) => ({ ...p, action: "idle", hasBall: false })));
      }, 2000);
    } else if (currentEvent.includes("防守")) {
      // 蓝队防守
      setPlayers((prev) =>
        prev.map((p) => (p.team === "blue" ? { ...p, action: "defend" } : p))
      );

      setTimeout(() => {
        setPlayers((prev) => prev.map((p) => ({ ...p, action: "idle" })));
      }, 1500);
    }
  }, [currentEvent]);

  // 绘制像素场景
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const courtImg = new Image();
    courtImg.src = "/pixel-court.png";

    const orangePlayerImg = new Image();
    orangePlayerImg.src = "/pixel-player-orange.png";

    const bluePlayerImg = new Image();
    bluePlayerImg.src = "/pixel-player-blue.png";

    const ballImg = new Image();
    ballImg.src = "/pixel-basketball.png";

    let frameCount = 0;

    const animate = () => {
      frameCount++;

      // 清空画布
      ctx.clearRect(0, 0, 800, 600);

      // 绘制球场
      if (courtImg.complete) {
        ctx.drawImage(courtImg, 0, 0, 800, 600);
      }

      // 绘制球员
      players.forEach((player) => {
        const img = player.team === "orange" ? orangePlayerImg : bluePlayerImg;
        if (!img.complete) return;

        // 根据动作选择sprite帧（简化版，实际需要sprite sheet）
        let frameX = 0;
        switch (player.action) {
          case "idle":
            frameX = 0;
            break;
          case "run":
            frameX = Math.floor(frameCount / 10) % 2 === 0 ? 1 : 2;
            break;
          case "shoot":
            frameX = 3;
            break;
          case "dunk":
            frameX = 4;
            break;
          case "defend":
            frameX = 5;
            break;
          case "celebrate":
            frameX = 6;
            break;
        }

        // 绘制球员（放大4倍，从32x32到128x128）
        const spriteWidth = img.width / 8; // 假设8帧
        const spriteHeight = img.height;

        ctx.save();
        if (player.direction === "left") {
          ctx.scale(-1, 1);
          ctx.drawImage(
            img,
            frameX * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            -player.x - 32,
            player.y - 32,
            64,
            64
          );
        } else {
          ctx.drawImage(
            img,
            frameX * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            player.x - 32,
            player.y - 32,
            64,
            64
          );
        }
        ctx.restore();

        // 如果持球，绘制篮球
        if (player.hasBall && ballImg.complete) {
          ctx.drawImage(ballImg, player.x - 8, player.y - 50, 16, 16);
        }
      });

      // 绘制篮球（如果没有球员持球）
      if (!players.some((p) => p.hasBall) && ballImg.complete) {
        ctx.drawImage(ballImg, ballPos.x - 8, ballPos.y - 8, 16, 16);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 等待所有图片加载
    Promise.all([
      new Promise((resolve) => (courtImg.onload = resolve)),
      new Promise((resolve) => (orangePlayerImg.onload = resolve)),
      new Promise((resolve) => (bluePlayerImg.onload = resolve)),
      new Promise((resolve) => (ballImg.onload = resolve)),
    ]).then(() => {
      animate();
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [players, ballPos]);

  return (
    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
      {/* 像素画布 */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-yellow-500 rounded-lg shadow-2xl"
      style={{
        imageRendering: "pixelated" as any,
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

