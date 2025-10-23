
import React, { useState, useEffect } from 'react';
import './FacilityManagement.css'; // 导入CSS文件
import { Facility, FacilityType } from '../../types/kairo';

// 定义组件的Props接口
interface FacilityManagementProps {
  facilities: Facility[];
  clubLayout: { width: number; height: number };
  money: number; // 模拟金钱，用于建造和升级判断
  onBuild: (type: FacilityType, position: { x: number; y: number }) => void;
  onUpgrade: (facilityId: string) => void;
  onMove: (facilityId: string, newPosition: { x: number; y: number }) => void;
}

// 模拟设施的建造和升级成本及效果
const FACILITY_DEFINITIONS: Record<FacilityType, {
  name: string;
  buildCost: number;
  upgradeCosts: number[]; // 存储每个等级的升级成本
  size: { width: number; height: number };
  baseEffect: any; // 简化处理，实际可能更复杂
}> = {
  training_court: {
    name: "训练球场",
    buildCost: 5000,
    upgradeCosts: [2000, 5000, 10000],
    size: { width: 2, height: 2 },
    baseEffect: { training: 10 }
  },
  gym: {
    name: "健身房",
    buildCost: 3000,
    upgradeCosts: [1500, 4000, 8000],
    size: { width: 1, height: 1 },
    baseEffect: { recovery: 5 }
  },
  rest_area: {
    name: "休息区",
    buildCost: 1000,
    upgradeCosts: [500, 1200, 2500],
    size: { width: 1, height: 1 },
    baseEffect: { recovery: 10 }
  },
  medical_room: {
    name: "医疗室",
    buildCost: 4000,
    upgradeCosts: [2000, 6000, 12000],
    size: { width: 1, height: 1 },
    baseEffect: { recovery: 15 }
  },
  shop: {
    name: "商店",
    buildCost: 2000,
    upgradeCosts: [1000, 2500, 5000],
    size: { width: 1, height: 1 },
    baseEffect: { popularity: 5 }
  },
  restaurant: {
    name: "餐厅",
    buildCost: 2500,
    upgradeCosts: [1200, 3000, 6000],
    size: { width: 2, height: 1 },
    baseEffect: { popularity: 8, recovery: 3 }
  },
  locker_room: {
    name: "更衣室",
    buildCost: 1500,
    upgradeCosts: [800, 2000, 4000],
    size: { width: 1, height: 1 },
    baseEffect: { popularity: 2 }
  },
};

const FacilityManagement: React.FC<FacilityManagementProps> = ({
  facilities,
  clubLayout,
  money,
  onBuild,
  onUpgrade,
  onMove,
}) => {
  const [selectedTool, setSelectedTool] = useState<'build' | 'upgrade' | 'move' | null>(null);
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const gridSize = 32; // 像素风格，每个格子32x32像素

  // 检查位置是否有效（在布局内且不与其他设施重叠）
  const isValidPosition = (x: number, y: number, width: number, height: number, excludeId?: string) => {
    if (x < 0 || y < 0 || x + width > clubLayout.width || y + height > clubLayout.height) {
      return false; // 超出边界
    }

    for (const existingFacility of facilities) {
      if (existingFacility.id === excludeId) continue;

      const ex = existingFacility.position.x;
      const ey = existingFacility.position.y;
      const ew = existingFacility.size.width;
      const eh = existingFacility.size.height;

      // 检查重叠
      if (x < ex + ew && x + width > ex && y < ey + eh && y + height > ey) {
        return false; // 重叠
      }
    }
    return true;
  };

  const handleGridClick = (x: number, y: number) => {
    if (selectedTool === 'build' && selectedFacilityType) {
      const definition = FACILITY_DEFINITIONS[selectedFacilityType];
      if (money >= definition.buildCost && isValidPosition(x, y, definition.size.width, definition.size.height)) {
        onBuild(selectedFacilityType, { x, y });
        setSelectedTool(null);
        setSelectedFacilityType(null);
      } else {
        alert('金钱不足或位置无效！');
      }
    } else if (selectedTool === 'move' && selectedFacilityId) {
      const facilityToMove = facilities.find(f => f.id === selectedFacilityId);
      if (facilityToMove) {
        if (isValidPosition(x, y, facilityToMove.size.width, facilityToMove.size.height, facilityToMove.id)) {
          onMove(selectedFacilityId, { x, y });
          setSelectedTool(null);
          setSelectedFacilityId(null);
        } else {
          alert('位置无效！');
        }
      }
    }
  };

  const handleFacilityClick = (facility: Facility) => {
    if (selectedTool === 'upgrade') {
      const definition = FACILITY_DEFINITIONS[facility.type];
      const nextLevel = facility.level + 1;
      if (nextLevel - 1 < definition.upgradeCosts.length) {
        const upgradeCost = definition.upgradeCosts[nextLevel - 1];
        if (money >= upgradeCost) {
          onUpgrade(facility.id);
          setSelectedTool(null);
        } else {
          alert('金钱不足！');
        }
      } else {
        alert('已达到最高等级！');
      }
    } else if (selectedTool === 'move') {
      setSelectedFacilityId(facility.id);
      // 此时不取消selectedTool，等待用户点击新位置
    }
  };

  // 渲染网格
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < clubLayout.height; y++) {
      for (let x = 0; x < clubLayout.width; x++) {
        const isHovering = hoverPosition && hoverPosition.x === x && hoverPosition.y === y;
        let highlightColor = '';
        if (isHovering) {
          if (selectedTool === 'build' && selectedFacilityType) {
            const definition = FACILITY_DEFINITIONS[selectedFacilityType];
            highlightColor = isValidPosition(x, y, definition.size.width, definition.size.height) ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
          } else if (selectedTool === 'move' && selectedFacilityId) {
            const facilityToMove = facilities.find(f => f.id === selectedFacilityId);
            if (facilityToMove) {
              highlightColor = isValidPosition(x, y, facilityToMove.size.width, facilityToMove.size.height, facilityToMove.id) ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
            }
          }
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className="grid-cell"
            style={{
              width: gridSize,
              height: gridSize,
              backgroundColor: highlightColor,
            }}
            onMouseEnter={() => setHoverPosition({ x, y })}
            onMouseLeave={() => setHoverPosition(null)}
            onClick={() => handleGridClick(x, y)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="facility-management-container">
      <h2 className="pixel-title">设施管理</h2>

      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={() => {
            setSelectedTool('build');
            setSelectedFacilityId(null);
          }}
          className={`pixel-button ${selectedTool === 'build' ? 'active' : ''}`}
        >建造</button>
        <button 
          onClick={() => {
            setSelectedTool('upgrade');
            setSelectedFacilityType(null);
            setSelectedFacilityId(null);
          }}
          className={`pixel-button ${selectedTool === 'upgrade' ? 'active' : ''}`}
        >升级</button>
        <button 
          onClick={() => {
            setSelectedTool('move');
            setSelectedFacilityType(null);
          }}
          className={`pixel-button ${selectedTool === 'move' ? 'active' : ''}`}
        >布局</button>
        {selectedTool && (
          <button 
            onClick={() => {
              setSelectedTool(null);
              setSelectedFacilityType(null);
              setSelectedFacilityId(null);
            }}
            className="pixel-button cancel"
          >取消</button>
        )}
      </div>

      {selectedTool === 'build' && (
        <div className="tool-options-panel">
          <h3 className="pixel-subtitle">选择建造设施:</h3>
          <div className="facility-type-buttons">
            {Object.entries(FACILITY_DEFINITIONS).map(([type, def]) => (
              <button
                key={type}
                onClick={() => setSelectedFacilityType(type as FacilityType)}
                className={`pixel-small-button ${selectedFacilityType === type ? 'active' : ''}`}
              >
                {def.name} (¥{def.buildCost})
              </button>
            ))}
          </div>
          {selectedFacilityType && (
            <p className="pixel-text">
              建造: {FACILITY_DEFINITIONS[selectedFacilityType].name} (¥{FACILITY_DEFINITIONS[selectedFacilityType].buildCost})
            </p>
          )}
        </div>
      )}

      <div
        className="grid-container"
        style={{
          width: clubLayout.width * gridSize,
          height: clubLayout.height * gridSize,
          gridTemplateColumns: `repeat(${clubLayout.width}, ${gridSize}px)`,
          gridTemplateRows: `repeat(${clubLayout.height}, ${gridSize}px)`,
        }}
      >
        {renderGrid()}

        {facilities.map((facility) => {
          const definition = FACILITY_DEFINITIONS[facility.type];
          return (
            <div
              key={facility.id}
              className={`facility-item ${selectedFacilityId === facility.id && selectedTool === 'move' ? 'selected-for-move' : ''}`}
              style={{
                left: facility.position.x * gridSize,
                top: facility.position.y * gridSize,
                width: facility.size.width * gridSize,
                height: facility.size.height * gridSize,
                cursor: (selectedTool === 'upgrade' || selectedTool === 'move') ? 'pointer' : 'default',
                zIndex: selectedFacilityId === facility.id && selectedTool === 'move' ? 10 : 5,
              }}
              onClick={() => handleFacilityClick(facility)}
            >
              {definition.name} Lv.{facility.level}
            </div>
          );
        })}

        {selectedTool === 'build' && selectedFacilityType && hoverPosition && (
          <div
            className="hover-preview"
            style={{
              left: hoverPosition.x * gridSize,
              top: hoverPosition.y * gridSize,
              width: FACILITY_DEFINITIONS[selectedFacilityType].size.width * gridSize,
              height: FACILITY_DEFINITIONS[selectedFacilityType].size.height * gridSize,
              backgroundColor: isValidPosition(hoverPosition.x, hoverPosition.y, FACILITY_DEFINITIONS[selectedFacilityType].size.width, FACILITY_DEFINITIONS[selectedFacilityType].size.height) ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)',
            }}
          />
        )}

        {selectedTool === 'move' && selectedFacilityId && hoverPosition && (
          <div
            className="hover-preview"
            style={{
              left: hoverPosition.x * gridSize,
              top: hoverPosition.y * gridSize,
              width: facilities.find(f => f.id === selectedFacilityId)?.size.width * gridSize || 0,
              height: facilities.find(f => f.id === selectedFacilityId)?.size.height * gridSize || 0,
              backgroundColor: isValidPosition(hoverPosition.x, hoverPosition.y, facilities.find(f => f.id === selectedFacilityId)?.size.width || 0, facilities.find(f => f.id === selectedFacilityId)?.size.height || 0, selectedFacilityId) ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FacilityManagement;

