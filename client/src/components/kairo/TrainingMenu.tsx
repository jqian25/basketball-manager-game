
import React, { useState, useEffect } from 'react';
import styles from './TrainingMenu.module.css'; // 导入CSS模块
import { KairoPlayer, Facility, TrainingType, TrainingSession, PlayerStats } from '../../types/kairo';

interface TrainingMenuProps {
  players: KairoPlayer[];
  facilities: Facility[];
  onTrain: (session: TrainingSession) => void;
  onClose: () => void;
}

const TrainingMenu: React.FC<TrainingMenuProps> = ({ players, facilities, onTrain, onClose }) => {
  const [selectedTrainingType, setSelectedTrainingType] = useState<TrainingType | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1); // 默认训练天数

  const availableTrainingTypes: TrainingType[] = [
    "stamina", "shooting", "dribbling", "passing", "defense", "jumping", "all_round"
  ];

  const handleTrain = () => {
    if (selectedTrainingType && selectedPlayerId) {
      const player = players.find(p => p.id === selectedPlayerId);
      if (!player) return;

      // 估算训练收益和成本 (简化逻辑，实际游戏中会更复杂)
      const cost = duration * 100; // 假设每天100金币
      const expectedGain: Partial<PlayerStats> = {};
      switch (selectedTrainingType) {
        case "stamina": expectedGain.stamina = duration * 5; break;
        case "shooting": expectedGain.shooting = duration * 5; break;
        case "dribbling": expectedGain.dribbling = duration * 5; break;
        case "passing": expectedGain.passing = duration * 5; break;
        case "defense": expectedGain.defense = duration * 5; break;
        case "jumping": expectedGain.jumping = duration * 5; break;
        case "all_round":
          expectedGain.stamina = duration * 2;
          expectedGain.shooting = duration * 2;
          expectedGain.dribbling = duration * 2;
          expectedGain.passing = duration * 2;
          expectedGain.defense = duration * 2;
          expectedGain.jumping = duration * 2;
          break;
      }

      const newSession: TrainingSession = {
        id: `train-${Date.now()}`,
        type: selectedTrainingType,
        playerId: selectedPlayerId,
        facilityId: selectedFacilityId || undefined,
        duration,
        cost,
        expectedGain,
      };
      onTrain(newSession);
      onClose();
    }
  };

  return (
    <div className={styles["kairo-menu-container"]}>
      <div className={styles["kairo-menu-header"]}>
        <h2>训练菜单</h2>
        <button className={styles["kairo-close-button"]} onClick={onClose}>X</button>
      </div>
      <div className={styles["kairo-menu-content"]}>
        {/* 训练类型选择 */}
        <div className={styles["kairo-menu-section"]}>
          <h3>选择训练类型:</h3>
          <div className={styles["kairo-button-group"]}>
            {availableTrainingTypes.map(type => (
              <button
                key={type}
                className={`${styles["kairo-button"]} ${selectedTrainingType === type ? styles["selected"] : ''}`}
                onClick={() => setSelectedTrainingType(type)}
              >
                {type.replace(/_/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 球员选择 */}
        <div className={styles["kairo-menu-section"]}>
          <h3>选择球员:</h3>
          <select
            className={styles["kairo-select"]}
            value={selectedPlayerId || ''}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
          >
            <option value="" disabled>选择一名球员</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.position}) - Lv.{player.level}
              </option>
            ))}
          </select>
        </div>

        {/* 设施选择 (可选) */}
        <div className={styles["kairo-menu-section"]}>
          <h3>选择设施 (可选):</h3>
          <select
            className={styles["kairo-select"]}
            value={selectedFacilityId || ''}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
          >
            <option value="">无设施</option>
            {facilities.filter(f => f.type === 'training_court' || f.type === 'gym').map(facility => (
              <option key={facility.id} value={facility.id}>
                {facility.name} (Lv.{facility.level})
              </option>
            ))}
          </select>
        </div>

        {/* 训练天数 */}
        <div className={styles["kairo-menu-section"]}>
          <h3>训练天数: {duration}天</h3>
          <input
            type="range"
            min="1"
            max="7"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className={styles["kairo-slider"]}
          />
        </div>

        <button
          className={`${styles["kairo-button"]} ${styles["kairo-train-button"]}`}
          onClick={handleTrain}
          disabled={!selectedTrainingType || !selectedPlayerId}
        >
          开始训练
        </button>
      </div>
    </div>
  );
};

export default TrainingMenu;

