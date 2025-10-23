
import React, { useState } from 'react';
import { KairoPlayer, PlayerPosition, PlayerType, PlayerSkill, PlayerStats, TrainingSession } from '../../types/kairo';

// 模拟数据
const mockPlayers: KairoPlayer[] = [
  {
    id: 'p1',
    name: 'Michael J.',
    position: 'SG',
    type: 'All-Star',
    level: 10,
    experience: 5000,
    stats: { stamina: 9000, shooting: 9500, dribbling: 8800, passing: 8000, defense: 7500, jumping: 9200 },
    skills: [{ id: 's1', name: 'Fadeaway', description: '后仰跳投', effect: '高难度投篮命中率提升', type: 'basic' }],
    cost: 1000000,
    isJunior: false,
    positionAffinity: { PG: 'B', SG: 'S', SF: 'A', PF: 'C', C: 'C' },
    spriteIndex: 0,
  },
  {
    id: 'p2',
    name: 'Magic E.',
    position: 'PG',
    type: 'Playmaker',
    level: 8,
    experience: 3000,
    stats: { stamina: 8500, shooting: 7000, dribbling: 9200, passing: 9800, defense: 7000, jumping: 6000 },
    skills: [{ id: 's2', name: 'No-Look Pass', description: '不看人传球', effect: '传球成功率提升', type: 'basic' }],
    cost: 800000,
    isJunior: false,
    positionAffinity: { PG: 'S', SG: 'A', SF: 'B', PF: 'C', C: 'C' },
    spriteIndex: 1,
  },
];

const mockRecruitmentPool: KairoPlayer[] = [
  {
    id: 'rp1',
    name: 'Rookie A',
    position: 'PF',
    type: 'Rebounder',
    level: 1,
    experience: 0,
    stats: { stamina: 6000, shooting: 4000, dribbling: 3000, passing: 3000, defense: 5000, jumping: 7000 },
    skills: [],
    cost: 10000,
    isJunior: true,
    positionAffinity: { PG: 'C', SG: 'C', SF: 'B', PF: 'S', C: 'A' },
    spriteIndex: 2,
  },
  {
    id: 'rp2',
    name: 'Prospect B',
    position: 'C',
    type: 'Dunker',
    level: 2,
    experience: 500,
    stats: { stamina: 7000, shooting: 5000, dribbling: 4000, passing: 3500, defense: 6000, jumping: 8000 },
    skills: [],
    cost: 15000,
    isJunior: true,
    positionAffinity: { PG: 'C', SG: 'C', SF: 'C', PF: 'A', C: 'S' },
    spriteIndex: 3,
  },
];

interface PlayerManagementProps {
  // 可以添加全局状态管理相关的props，例如从Redux/Context获取player数据的方法
}

const PlayerManagement: React.FC<PlayerManagementProps> = () => {
  const [players, setPlayers] = useState<KairoPlayer[]>(mockPlayers);
  const [recruitmentPool, setRecruitmentPool] = useState<KairoPlayer[]>(mockRecruitmentPool);
  const [selectedPlayer, setSelectedPlayer] = useState<KairoPlayer | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'recruit' | 'train'>('list');

  const handleSelectPlayer = (player: KairoPlayer) => {
    setSelectedPlayer(player);
    setActiveTab('details');
  };

  const handleRecruitPlayer = (player: KairoPlayer) => {
    setPlayers((prev) => [...prev, player]);
    setRecruitmentPool((prev) => prev.filter((p) => p.id !== player.id));
    alert(`${player.name} 已成功招募！`);
  };

  const handleTrainPlayer = (player: KairoPlayer, trainingType: keyof PlayerStats) => {
    // 模拟训练效果
    const updatedPlayers = players.map((p) =>
      p.id === player.id
        ? {
            ...p,
            stats: {
              ...p.stats,
              [trainingType]: Math.min(9999, p.stats[trainingType] + 100), // 简单增加100点，上限9999
            },
            experience: p.experience + 50, // 增加经验
            level: p.experience + 50 >= p.level * 1000 ? p.level + 1 : p.level, // 简单升级逻辑
          }
        : p
    );
    setPlayers(updatedPlayers);
    alert(`${player.name} 在 ${trainingType} 方面进行了训练！`);
  };

  const renderPlayerList = () => (
    <div className="kairo-panel player-list-panel">
      <h2 className="kairo-title">球员列表</h2>
      <div className="player-grid">
        {players.length === 0 ? (
          <p className="kairo-text">目前没有球员。</p>
        ) : (
          players.map((player) => (
            <div key={player.id} className="kairo-card player-card" onClick={() => handleSelectPlayer(player)}>
              <div className="player-sprite" style={{ backgroundPosition: `-${player.spriteIndex * 64}px 0` }}></div>
              <div className="player-info">
                <p className="kairo-text player-name">{player.name}</p>
                <p className="kairo-text">等级: {player.level}</p>
                <p className="kairo-text">位置: {player.position}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPlayerDetails = () => {
    if (!selectedPlayer) return <p className="kairo-text">请选择一名球员查看详情。</p>;
    return (
      <div className="kairo-panel player-details-panel">
        <h2 className="kairo-title">球员详情: {selectedPlayer.name}</h2>
        <div className="details-content">
          <div className="player-sprite large" style={{ backgroundPosition: `-${selectedPlayer.spriteIndex * 64}px 0` }}></div>
          <div className="player-stats-info">
            <p className="kairo-text">等级: {selectedPlayer.level} (经验: {selectedPlayer.experience})</p>
            <p className="kairo-text">位置: {selectedPlayer.position} ({selectedPlayer.type})</p>
            <p className="kairo-text">身价: ${selectedPlayer.cost.toLocaleString()}</p>
            <p className="kairo-text">是否青训: {selectedPlayer.isJunior ? '是' : '否'}</p>
            <h3 className="kairo-subtitle">能力值:</h3>
            <ul className="kairo-list stats-list">
              {Object.entries(selectedPlayer.stats).map(([key, value]) => (
                <li key={key} className="kairo-list-item">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </li>
              ))}
            </ul>
            <h3 className="kairo-subtitle">技能:</h3>
            <ul className="kairo-list skills-list">
              {selectedPlayer.skills.length === 0 ? (
                <li className="kairo-list-item">无</li>
              ) : (
                selectedPlayer.skills.map((skill) => (
                  <li key={skill.id} className="kairo-list-item">
                    {skill.name} ({skill.type}): {skill.description}
                  </li>
                ))
              )}
            </ul>
            <h3 className="kairo-subtitle">位置适应性:</h3>
            <ul className="kairo-list affinity-list">
              {Object.entries(selectedPlayer.positionAffinity).map(([pos, affinity]) => (
                <li key={pos} className="kairo-list-item">
                  {pos}: {affinity}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="kairo-button" onClick={() => setActiveTab('list')}>返回列表</button>
        <button className="kairo-button" onClick={() => setActiveTab('train')}>训练球员</button>
      </div>
    );
  };

  const renderRecruitment = () => (
    <div className="kairo-panel recruitment-panel">
      <h2 className="kairo-title">招募球员</h2>
      <div className="player-grid">
        {recruitmentPool.length === 0 ? (
          <p className="kairo-text">目前没有可招募的球员。</p>
        ) : (
          recruitmentPool.map((player) => (
            <div key={player.id} className="kairo-card player-card recruit-card">
              <div className="player-sprite" style={{ backgroundPosition: `-${player.spriteIndex * 64}px 0` }}></div>
              <div className="player-info">
                <p className="kairo-text player-name">{player.name}</p>
                <p className="kairo-text">等级: {player.level}</p>
                <p className="kairo-text">位置: {player.position}</p>
                <p className="kairo-text">身价: ${player.cost.toLocaleString()}</p>
                <button className="kairo-button recruit-button" onClick={() => handleRecruitPlayer(player)}>招募</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTraining = () => {
    if (!selectedPlayer) return <p className="kairo-text">请选择一名球员进行训练。</p>;

    const trainingStats: (keyof PlayerStats)[] = ['stamina', 'shooting', 'dribbling', 'passing', 'defense', 'jumping'];

    return (
      <div className="kairo-panel training-panel">
        <h2 className="kairo-title">训练球员: {selectedPlayer.name}</h2>
        <p className="kairo-text">当前能力值:</p>
        <ul className="kairo-list stats-list">
          {Object.entries(selectedPlayer.stats).map(([key, value]) => (
            <li key={key} className="kairo-list-item">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </li>
          ))}
        </ul>
        <h3 className="kairo-subtitle">选择训练项目:</h3>
        <div className="training-options">
          {trainingStats.map((stat) => (
            <button key={stat} className="kairo-button" onClick={() => handleTrainPlayer(selectedPlayer, stat)}>
              训练 {stat.charAt(0).toUpperCase() + stat.slice(1)}
            </button>
          ))}
        </div>
        <button className="kairo-button" onClick={() => setActiveTab('details')}>返回详情</button>
      </div>
    );
  };

  return (
    <div className="player-management-container">
      <style>{`
        .player-management-container {
          font-family: 'Press Start 2P', cursive; /* 像素字体 */
          color: #eee;
          background-color: #222;
          border: 4px solid #555;
          padding: 16px;
          margin: 16px;
          box-shadow: 8px 8px 0px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .kairo-panel {
          background-color: #333;
          border: 2px solid #666;
          padding: 12px;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
        }
        .kairo-title {
          font-size: 24px;
          color: #ffcc00;
          margin-bottom: 12px;
          text-shadow: 2px 2px 0px #000;
        }
        .kairo-subtitle {
          font-size: 18px;
          color: #00ff00;
          margin-top: 16px;
          margin-bottom: 8px;
          text-shadow: 1px 1px 0px #000;
        }
        .kairo-text {
          font-size: 14px;
          line-height: 1.5;
          color: #eee;
        }
        .kairo-button {
          background-color: #007bff;
          color: white;
          border: 2px solid #0056b3;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          margin-right: 8px;
          margin-top: 8px;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
          transition: all 0.1s ease;
        }
        .kairo-button:hover {
          background-color: #0056b3;
          box-shadow: 1px 1px 0px rgba(0,0,0,0.4);
          transform: translate(2px, 2px);
        }
        .kairo-button:active {
          background-color: #004085;
          box-shadow: 0px 0px 0px rgba(0,0,0,0.4);
          transform: translate(3px, 3px);
        }
        .kairo-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .kairo-list-item {
          padding: 4px 0;
          border-bottom: 1px dashed #555;
        }
        .kairo-list-item:last-child {
          border-bottom: none;
        }
        .tab-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .player-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .kairo-card {
          background-color: #444;
          border: 2px solid #777;
          padding: 8px;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kairo-card:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px rgba(0,0,0,0.3);
        }
        .player-sprite {
          width: 64px;
          height: 64px;
          background-image: url('/path/to/your/pixel-player-sprites.png'); /* 占位符，需要替换为实际路径 */
          background-size: auto 64px; /* 假设精灵图是横向排列的 */
          image-rendering: pixelated;
        }
        .player-sprite.large {
          width: 96px;
          height: 96px;
          background-size: auto 96px;
        }
        .player-info {
          flex-grow: 1;
        }
        .player-name {
          font-weight: bold;
          color: #fff;
        }
        .recruit-card .recruit-button {
          background-color: #28a745;
          border-color: #218838;
        }
        .recruit-card .recruit-button:hover {
          background-color: #218838;
        }
        .details-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .player-stats-info {
          flex-grow: 1;
        }
        .training-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
      `}</style>
      <div className="tab-buttons">
        <button className="kairo-button" onClick={() => setActiveTab('list')}>球员列表</button>
        <button className="kairo-button" onClick={() => setActiveTab('recruit')}>招募球员</button>
        {selectedPlayer && (
          <button className="kairo-button" onClick={() => setActiveTab('details')}>球员详情</button>
        )}
        {selectedPlayer && (
          <button className="kairo-button" onClick={() => setActiveTab('train')}>训练球员</button>
        )}
      </div>

      {activeTab === 'list' && renderPlayerList()}
      {activeTab === 'details' && renderPlayerDetails()}
      {activeTab === 'recruit' && renderRecruitment()}
      {activeTab === 'train' && renderTraining()}
    </div>
  );
};

export default PlayerManagement;

