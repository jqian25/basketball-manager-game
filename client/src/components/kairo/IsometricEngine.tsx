import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

// 建筑类型定义
export interface Building {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  level: number;
  effect: string;
  affinity: string[];
}

// 等角投影坐标转换
export class IsometricUtils {
  static tileWidth = 64;
  static tileHeight = 32;

  // 世界坐标转屏幕坐标
  static worldToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - y) * (this.tileWidth / 2),
      y: (x + y) * (this.tileHeight / 2),
    };
  }

  // 屏幕坐标转世界坐标
  static screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: (x / (this.tileWidth / 2) + y / (this.tileHeight / 2)) / 2,
      y: (y / (this.tileHeight / 2) - x / (this.tileWidth / 2)) / 2,
    };
  }
}

// 契合度计算引擎
export class AffinityEngine {
  static calculateAffinity(buildings: Building[]): Map<string, number> {
    const affinityMap = new Map<string, number>();

    buildings.forEach((building) => {
      // 查找周围的建筑
      const nearbyBuildings = buildings.filter((b) => {
        if (b.id === building.id) return false;
        const distance = Math.sqrt(
          Math.pow(b.x - building.x, 2) + Math.pow(b.y - building.y, 2)
        );
        return distance <= 3; // 3格范围内
      });

      // 计算契合度
      let affinity = 0;
      nearbyBuildings.forEach((nearby) => {
        if (building.affinity.includes(nearby.type)) {
          affinity += 10; // 每个契合建筑+10%
        }
      });

      affinityMap.set(building.id, Math.min(affinity, 80)); // 最高80%
    });

    return affinityMap;
  }
}

interface IsometricEngineProps {
  buildings: Building[];
  onBuildingPlace: (x: number, y: number, buildingType: string) => void;
  onBuildingSelect: (building: Building | null) => void;
}

export const IsometricEngine: React.FC<IsometricEngineProps> = ({
  buildings,
  onBuildingPlace,
  onBuildingSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建PixiJS应用
    const app = new PIXI.Application();
    appRef.current = app;

    // 初始化
    (async () => {
      await app.init({
        width: 1200,
        height: 800,
        backgroundColor: 0x87ceeb, // 天空蓝
        antialias: true,
      });

      containerRef.current?.appendChild(app.canvas);

      // 创建场景容器
      const worldContainer = new PIXI.Container();
      app.stage.addChild(worldContainer);

      // 绘制地面网格
      drawGrid(worldContainer, 20, 20);

      // 绘制建筑
      buildings.forEach((building) => {
        drawBuilding(worldContainer, building);
      });

      // 添加交互
      app.stage.eventMode = 'static';
      app.stage.hitArea = app.screen;
      app.stage.on('pointerdown', (event) => {
        const pos = event.global;
        const worldPos = IsometricUtils.screenToWorld(
          pos.x - app.screen.width / 2,
          pos.y - 200
        );
        console.log('Clicked:', worldPos);
      });
    })();

    return () => {
      app.destroy(true, { children: true, texture: true });
    };
  }, [buildings]);

  // 绘制地面网格
  const drawGrid = (container: PIXI.Container, width: number, height: number) => {
    const graphics = new PIXI.Graphics();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const screenPos = IsometricUtils.worldToScreen(x, y);

        // 绘制菱形地砖
        graphics.moveTo(screenPos.x, screenPos.y);
        graphics.lineTo(
          screenPos.x + IsometricUtils.tileWidth / 2,
          screenPos.y + IsometricUtils.tileHeight / 2
        );
        graphics.lineTo(screenPos.x, screenPos.y + IsometricUtils.tileHeight);
        graphics.lineTo(
          screenPos.x - IsometricUtils.tileWidth / 2,
          screenPos.y + IsometricUtils.tileHeight / 2
        );
        graphics.lineTo(screenPos.x, screenPos.y);

        // 填充颜色（棋盘格）
        const color = (x + y) % 2 === 0 ? 0xff9966 : 0xffaa77;
        graphics.fill({ color, alpha: 0.8 });
        graphics.stroke({ width: 1, color: 0x996633 });
      }
    }

    graphics.x = 600;
    graphics.y = 100;
    container.addChild(graphics);
  };

  // 绘制建筑
  const drawBuilding = (container: PIXI.Container, building: Building) => {
    const screenPos = IsometricUtils.worldToScreen(building.x, building.y);

    // 创建建筑容器
    const buildingContainer = new PIXI.Container();
    buildingContainer.x = screenPos.x + 600;
    buildingContainer.y = screenPos.y + 100;

    // 绘制建筑底座
    const base = new PIXI.Graphics();
    base.rect(
      -building.width * 16,
      -building.height * 8,
      building.width * 32,
      building.height * 16
    );
    base.fill({ color: 0x8b4513, alpha: 0.9 });
    base.stroke({ width: 2, color: 0x654321 });
    buildingContainer.addChild(base);

    // 绘制建筑主体
    const body = new PIXI.Graphics();
    body.rect(
      -building.width * 16,
      -building.height * 8 - 40,
      building.width * 32,
      40
    );
    body.fill({ color: 0xd2691e, alpha: 0.9 });
    body.stroke({ width: 2, color: 0x8b4513 });
    buildingContainer.addChild(body);

    // 添加文字标签
    const text = new PIXI.Text({
      text: building.name,
      style: {
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: 'bold',
      },
    });
    text.anchor.set(0.5);
    text.y = -building.height * 8 - 50;
    buildingContainer.addChild(text);

    // 添加交互
    buildingContainer.eventMode = 'static';
    buildingContainer.cursor = 'pointer';
    buildingContainer.on('pointerdown', () => {
      setSelectedBuilding(building);
      onBuildingSelect(building);
    });

    container.addChild(buildingContainer);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} />
      {selectedBuilding && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <h3>{selectedBuilding.name}</h3>
          <p>类型: {selectedBuilding.type}</p>
          <p>等级: {selectedBuilding.level}</p>
          <p>效果: {selectedBuilding.effect}</p>
        </div>
      )}
    </div>
  );
};

