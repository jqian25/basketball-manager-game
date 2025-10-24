import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export default function StarWarsOpening() {
  const [showContent, setShowContent] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // 延迟显示内容（模拟星球大战的开场）
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setLocation('/');
  };

  return (
    <div className="star-wars-container">
      {/* 星空背景 */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* 标题 - 篮球经理 */}
      {showContent && (
        <div className="title-container">
          <h1 className="title-text">篮球经理</h1>
          <p className="subtitle-text">BASKETBALL MANAGER</p>
        </div>
      )}

      {/* 滚动文字 - 真正的3D透视 */}
      {showContent && (
        <div className="crawl-container">
          <div className="crawl">
            <div className="crawl-text">
              <div className="episode">第一章</div>
              <div className="chapter">传奇的开始</div>
              
              <p>在遥远的篮球宇宙中，一个传奇的篮球俱乐部即将诞生......</p>
              
              <p>作为新任经理，你将肩负起打造世界顶级篮球队的重任。从招募天赋异禀的球员，到精心设计战术策略；从建设豪华的训练设施，到赢得赞助商的青睐。</p>
              
              <p>每一个决策都将影响球队的命运。培养球员的六维属性，掌握17种成长类型的奥秘。在激烈的比赛中运用战术智慧，带领你的球队从业余联赛一路征战到世界联赛的巅峰。</p>
              
              <p>球迷们期待着你的表现，赞助商们关注着你的成绩。在这个充满挑战与机遇的篮球世界里，只有最优秀的经理才能打造出名震四海的传奇球队！</p>
              
              <p className="final-text">现在，你的篮球传奇即将开始......</p>
            </div>
          </div>
        </div>
      )}

      {/* 跳过按钮 */}
      <button onClick={handleSkip} className="skip-button">
        跳过 ⏭️
      </button>

      {/* CSS样式 */}
      <style>{`
        .star-wars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
          font-family: 'Arial', sans-serif;
        }

        /* 星空背景 - 三层视差效果 */
        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }

        .stars {
          background: radial-gradient(2px 2px at 20% 30%, white, transparent),
                      radial-gradient(2px 2px at 60% 70%, white, transparent),
                      radial-gradient(1px 1px at 50% 50%, white, transparent),
                      radial-gradient(1px 1px at 80% 10%, white, transparent),
                      radial-gradient(2px 2px at 90% 60%, white, transparent),
                      radial-gradient(1px 1px at 33% 80%, white, transparent),
                      radial-gradient(2px 2px at 15% 90%, white, transparent);
          background-size: 200% 200%;
          animation: starsMove 200s linear infinite;
        }

        .stars2 {
          background: radial-gradient(1px 1px at 10% 20%, white, transparent),
                      radial-gradient(1px 1px at 40% 60%, white, transparent),
                      radial-gradient(1px 1px at 70% 80%, white, transparent),
                      radial-gradient(1px 1px at 85% 40%, white, transparent);
          background-size: 150% 150%;
          animation: starsMove 150s linear infinite;
        }

        .stars3 {
          background: radial-gradient(1px 1px at 25% 45%, white, transparent),
                      radial-gradient(1px 1px at 55% 25%, white, transparent),
                      radial-gradient(1px 1px at 75% 65%, white, transparent);
          background-size: 100% 100%;
          animation: starsMove 100s linear infinite;
        }

        @keyframes starsMove {
          from { transform: translateY(0); }
          to { transform: translateY(-2000px); }
        }

        /* 标题容器 */
        .title-container {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          animation: titleFadeInOut 8s ease-in-out forwards;
        }

        .title-text {
          font-size: 100px;
          font-weight: bold;
          color: #FFD700;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                       0 0 60px rgba(255, 215, 0, 0.6);
          margin: 0;
          letter-spacing: 8px;
        }

        .subtitle-text {
          font-size: 24px;
          color: #FFD700;
          margin-top: 20px;
          letter-spacing: 12px;
          opacity: 0.8;
        }

        @keyframes titleFadeInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        /* 滚动文字容器 - 关键的3D透视设置 */
        .crawl-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          perspective: 300px;
          perspective-origin: 50% 50%;
          overflow: hidden;
        }

        .crawl {
          position: absolute;
          top: 100%;
          left: 50%;
          width: 100%;
          transform: translateX(-50%);
          animation: crawlAnimation 60s linear forwards;
          animation-delay: 8s;
        }

        /* 真正的3D旋转 - 这是关键！ */
        .crawl-text {
          width: 450px;
          margin: 0 auto;
          font-size: 28px;
          font-weight: 600;
          color: #FFD700;
          text-align: justify;
          line-height: 1.8;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
          transform: rotateX(25deg);
          transform-origin: 50% 100%;
        }

        .episode {
          font-size: 48px;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: 4px;
        }

        .chapter {
          font-size: 36px;
          text-align: center;
          margin-bottom: 50px;
          letter-spacing: 3px;
        }

        .crawl-text p {
          margin-bottom: 35px;
          text-indent: 2em;
        }

        .final-text {
          font-size: 36px !important;
          text-align: center !important;
          margin-top: 80px !important;
          text-indent: 0 !important;
          letter-spacing: 2px;
        }

        /* 滚动动画 - 从下往上，逐渐消失在远方 */
        @keyframes crawlAnimation {
          0% {
            top: 100%;
            opacity: 1;
          }
          100% {
            top: -150%;
            opacity: 0;
          }
        }

        /* 跳过按钮 */
        .skip-button {
          position: absolute;
          bottom: 40px;
          right: 40px;
          padding: 16px 36px;
          font-size: 20px;
          font-weight: bold;
          color: #FFD700;
          background: rgba(0, 0, 0, 0.8);
          border: 3px solid #FFD700;
          border-radius: 8px;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .skip-button:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }
      `}</style>
    </div>
  );
}

