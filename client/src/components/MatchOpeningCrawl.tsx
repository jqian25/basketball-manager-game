import { motion } from "framer-motion";
import { useEffect } from "react";
import "../styles/starwars.css";

interface MatchOpeningCrawlProps {
  homeTeam: string;
  awayTeam: string;
  onComplete: () => void;
}

export default function MatchOpeningCrawl({ 
  homeTeam, 
  awayTeam, 
  onComplete 
}: MatchOpeningCrawlProps) {
  
  useEffect(() => {
    // 15秒后自动完成
    const timer = setTimeout(() => {
      onComplete();
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="starwars-container">
      {/* 星空背景 */}
      <div className="stars"></div>
      
      {/* 星球大战文字滚动 */}
      <div className="starwars-crawl glow-text">
        <div className="starwars-title">
          篮球对决
        </div>
        
        <p>
          在这个充满激情的篮球赛场上，两支强大的球队即将展开一场史诗般的对决......
        </p>
        
        <p>
          <span className="text-orange-400 font-bold">{homeTeam}</span>，
          这支拥有辉煌历史的球队，以其精湛的进攻技巧和坚韧的防守闻名于世。
          他们的球员们在无数次训练中磨练技艺，
          六维属性达到了巅峰状态。
        </p>
        
        <p>
          而他们的对手，<span className="text-blue-400 font-bold">{awayTeam}</span>，
          同样是一支不可小觑的劲旅。
          他们以快速的攻防转换和精准的三分球著称，
          每一次进攻都充满了威胁。
        </p>
        
        <p>
          今天，这两支球队将在这片神圣的球场上，
          为了荣誉、为了胜利、为了球迷们的期待，
          展开一场惊心动魄的较量！
        </p>
        
        <p>
          球员们已经做好了准备，
          啦啦队的欢呼声响彻全场，
          观众们屏息以待......
        </p>
        
        <p className="text-yellow-400 text-center font-bold text-6xl mt-12">
          比赛即将开始！
        </p>
      </div>
      
      {/* 跳过按钮 */}
      <button 
        className="starwars-skip" 
        onClick={onComplete}
      >
        跳过开场 →
      </button>
    </div>
  );
}

