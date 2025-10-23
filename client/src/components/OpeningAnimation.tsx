import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Basketball from "./Basketball";
import "../styles/starwars.css";
import "../styles/opening-effects.css";

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [stage, setStage] = useState<"crawl" | "player" | "basketball" | "complete">("crawl");
  const [showSkip, setShowSkip] = useState(true);

  useEffect(() => {
    // 星球大战文字滚动 - 60秒后自动进入下一阶段
    const crawlTimer = setTimeout(() => {
      if (stage === "crawl") setStage("player");
    }, 60000);

    // 球员投篮场景 - 3秒
    const playerTimer = setTimeout(() => {
      if (stage === "player") setStage("basketball");
    }, 3000);

    // 篮球飞行动画 - 2秒
    const basketballTimer = setTimeout(() => {
      if (stage === "basketball") {
        setStage("complete");
        onComplete();
      }
    }, 2000);

    return () => {
      clearTimeout(crawlTimer);
      clearTimeout(playerTimer);
      clearTimeout(basketballTimer);
    };
  }, [stage, onComplete]);

  const handleSkip = () => {
    setStage("complete");
    onComplete();
  };

  return (
    <AnimatePresence mode="wait">
      {stage === "crawl" && (
        <motion.div
          key="crawl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="starwars-container"
        >
          <div className="stars"></div>
          <div className="starwars-crawl glow-text">
            <div className="starwars-title">篮球经理</div>
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
          {showSkip && (
            <button className="starwars-skip" onClick={handleSkip}>
              跳过开场 →
            </button>
          )}
        </motion.div>
      )}

      {stage === "player" && (
        <motion.div
          key="player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black"
        >
          {/* 动漫风格开场视频 */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          >
            <source src="/opening-fate-style.mp4" type="video/mp4" />
          </video>
          
          {/* 球员投篮特写 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative">
              {/* 金色光晕效果 */}
              <div className="absolute inset-0 golden-glow"></div>
              
              {/* 球员图片占位符 */}
              <motion.img
                src="/player-sg.png"
                alt="Player shooting"
                className="h-[80vh] object-contain relative z-10"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {stage === "basketball" && (
        <motion.div
          key="basketball"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden"
        >
          {/* 篮球从顶部掉落 */}
          <motion.div
            className="absolute"
            initial={{ x: "50vw", y: "-10vh", rotate: 0 }}
            animate={{
              x: "50vw",
              y: "40vh",
              rotate: 720,
            }}
            transition={{
              duration: 1.5,
              ease: [0.34, 1.56, 0.64, 1], // 弹跳效果
            }}
          >
            <Basketball size={150} className="drop-shadow-2xl" />
          </motion.div>

          {/* 发光的标题文字 */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h1 className="text-8xl font-bold text-yellow-400 glow-text-strong">
              篮球经理
            </h1>
          </motion.div>

          {/* 粒子特效 */}
          <div className="particles"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

