import React, { useState, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

// 开罗风格篮球游戏主组件
export default function KairoGame() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [money, setMoney] = useState(50000);
  const [fans, setFans] = useState(100);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    level: number;
  }>>([]);

  // 设施类型和价格
  const facilityTypes = {
    gym: { name: '健身房', price: 10000, image: '/kairo/facility-gym.png' },
    pool: { name: '游泳池', price: 15000, image: '/kairo/facility-pool.png' },
    restaurant: { name: '餐厅', price: 8000, image: '/kairo/facility-restaurant.png' },
    shop: { name: '商店', price: 5000, image: '/kairo/facility-shop.png' },
    medical: { name: '医疗中心', price: 12000, image: '/kairo/facility-medical.png' },
    lounge: { name: '休息室', price: 7000, image: '/kairo/facility-lounge.png' },
  };

  // 初始化PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: 1200,
      height: 800,
      backgroundColor: 0xf5e6d3,
      antialias: true,
    });

    canvasRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // 加载篮球场背景
    const courtSprite = PIXI.Sprite.from('/kairo/court-isometric.png');
    courtSprite.x = 100;
    courtSprite.y = 50;
    courtSprite.scale.set(0.8);
    app.stage.addChild(courtSprite);

    // 添加网格线（用于放置设施）
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xcccccc, 0.3);
    
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 8; j++) {
        const x = 100 + i * 100;
        const y = 100 + j * 100;
        graphics.drawRect(x, y, 100, 100);
      }
    }
    app.stage.addChild(graphics);

    return () => {
      app.destroy(true);
      appRef.current = null;
    };
  }, []);

  // 放置设施
  const placeFacility = (type: string, x: number, y: number) => {
    const facilityInfo = facilityTypes[type as keyof typeof facilityTypes];
    if (money < facilityInfo.price) {
      alert('资金不足！');
      return;
    }

    const newFacility = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      level: 1,
    };

    setFacilities([...facilities, newFacility]);
    setMoney(money - facilityInfo.price);
    setSelectedFacility(null);

    // 在PixiJS中添加设施精灵
    if (appRef.current) {
      const sprite = PIXI.Sprite.from(facilityInfo.image);
      sprite.x = x;
      sprite.y = y;
      sprite.scale.set(0.5);
      sprite.interactive = true;
      sprite.cursor = 'pointer';
      
      sprite.on('pointerdown', () => {
        alert(`${facilityInfo.name} Lv.${newFacility.level}`);
      });

      appRef.current.stage.addChild(sprite);
    }
  };

  // 处理画布点击
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFacility || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 100) * 100;
    const y = Math.floor((e.clientY - rect.top) / 100) * 100;

    placeFacility(selectedFacility, x, y);
  };

  return (
    <div className="kairo-game">
      {/* 顶部状态栏 */}
      <div className="status-bar">
        <div className="status-item">
          <img src="/kairo/ui-money-icon.png" alt="金币" className="status-icon" />
          <span className="status-value">${money.toLocaleString()}</span>
        </div>
        <div className="status-item">
          <img src="/kairo/ui-star-icon.png" alt="粉丝" className="status-icon" />
          <span className="status-value">{fans.toLocaleString()} 粉丝</span>
        </div>
      </div>

      {/* 游戏画布 */}
      <div 
        ref={canvasRef} 
        className="game-canvas"
        onClick={handleCanvasClick}
        style={{ cursor: selectedFacility ? 'crosshair' : 'default' }}
      />

      {/* 设施选择菜单 */}
      <div className="facility-menu">
        <h3>建造设施</h3>
        {Object.entries(facilityTypes).map(([key, info]) => (
          <button
            key={key}
            className={`facility-button ${selectedFacility === key ? 'selected' : ''}`}
            onClick={() => setSelectedFacility(key)}
            disabled={money < info.price}
          >
            <img src={info.image} alt={info.name} className="facility-icon" />
            <div className="facility-info">
              <div className="facility-name">{info.name}</div>
              <div className="facility-price">${info.price.toLocaleString()}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 样式 */}
      <style jsx>{`
        .kairo-game {
          width: 100%;
          height: 100vh;
          background: linear-gradient(to bottom, #87CEEB, #f5e6d3);
          position: relative;
          overflow: hidden;
        }

        .status-bar {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 30px;
          background: rgba(255, 255, 255, 0.9);
          padding: 15px 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-icon {
          width: 32px;
          height: 32px;
        }

        .status-value {
          font-size: 20px;
          font-weight: bold;
          color: #FF6B35;
        }

        .game-canvas {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid #FF6B35;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .facility-menu {
          position: absolute;
          right: 20px;
          top: 100px;
          width: 250px;
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          max-height: 600px;
          overflow-y: auto;
        }

        .facility-menu h3 {
          margin: 0 0 15px 0;
          color: #FF6B35;
          font-size: 18px;
          border-bottom: 2px solid #FF6B35;
          padding-bottom: 10px;
        }

        .facility-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          margin-bottom: 10px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .facility-button:hover:not(:disabled) {
          border-color: #FF6B35;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
        }

        .facility-button.selected {
          border-color: #FF6B35;
          background: #fff5f0;
        }

        .facility-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .facility-icon {
          width: 48px;
          height: 48px;
        }

        .facility-info {
          flex: 1;
          text-align: left;
        }

        .facility-name {
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
        }

        .facility-price {
          font-size: 14px;
          color: #FF6B35;
        }
      `}</style>
    </div>
  );
}

