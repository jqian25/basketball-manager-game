interface BasketballProps {
  className?: string;
  size?: number;
}

export default function Basketball({ className = "", size = 100 }: BasketballProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 定义渐变和阴影 */}
      <defs>
        {/* 篮球主体渐变 */}
        <radialGradient id="basketballGradient" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#FF8C42" />
          <stop offset="50%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#C44536" />
        </radialGradient>
        
        {/* 高光效果 */}
        <radialGradient id="highlightGradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        
        {/* 阴影滤镜 */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 篮球主体 */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#basketballGradient)"
        filter="url(#shadow)"
      />

      {/* 篮球纹路 */}
      <g stroke="#2C1810" strokeWidth="2.5" fill="none" strokeLinecap="round">
        {/* 中间横线 */}
        <path d="M 10 50 Q 30 45, 50 50 T 90 50" />
        
        {/* 左侧弧线 */}
        <path d="M 50 5 Q 25 25, 20 50 T 50 95" />
        
        {/* 右侧弧线 */}
        <path d="M 50 5 Q 75 25, 80 50 T 50 95" />
        
        {/* 顶部弧线 */}
        <path d="M 15 25 Q 35 15, 50 10 T 85 25" />
        
        {/* 底部弧线 */}
        <path d="M 15 75 Q 35 85, 50 90 T 85 75" />
      </g>

      {/* 高光效果 */}
      <ellipse
        cx="35"
        cy="30"
        rx="20"
        ry="25"
        fill="url(#highlightGradient)"
        opacity="0.6"
      />
    </svg>
  );
}

