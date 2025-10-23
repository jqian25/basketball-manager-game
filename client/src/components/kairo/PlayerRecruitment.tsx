
import React, { useState } from 'react';
import styled from 'styled-components';
import { KairoPlayer, PlayerPosition, PlayerType } from '../../types/kairo';

// 像素风格通用样式
const PixelButton = styled.button`
  background-color: #a8a8a8;
  border: 2px solid #505050;
  border-bottom-color: #e0e0e0;
  border-right-color: #e0e0e0;
  color: #303030;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c0c0c0;
  }
  &:active {
    background-color: #808080;
    border-top-color: #e0e0e0;
    border-left-color: #e0e0e0;
    border-bottom-color: #505050;
    border-right-color: #505050;
  }
  &:disabled {
    background-color: #707070;
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const PixelPanel = styled.div`
  background-color: #d0d0d0;
  border: 2px solid #505050;
  border-bottom-color: #e0e0e0;
  border-right-color: #e0e0e0;
  padding: 16px;
  margin-bottom: 16px;
  font-family: 'Press Start 2P', cursive;
  color: #303030;
  box-shadow: 4px 4px 0px 0px #505050;
`;

const PixelInput = styled.input`
  background-color: #f0f0f0;
  border: 2px inset #a0a0a0;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  padding: 6px;
  margin: 4px;
  color: #303030;
  &:focus {
    outline: none;
    border: 2px inset #505050;
  }
`;

const PixelSelect = styled.select`
  background-color: #f0f0f0;
  border: 2px inset #a0a0a0;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  padding: 6px;
  margin: 4px;
  color: #303030;
  &:focus {
    outline: none;
    border: 2px inset #505050;
  }
`;

const PixelPlayerCard = styled(PixelPanel)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  background-color: #e8e8e8;
  border: 2px solid #606060;
  border-bottom-color: #f0f0f0;
  border-right-color: #f0f0f0;
  box-shadow: 2px 2px 0px 0px #606060;
`;

interface PlayerRecruitmentProps {
  onRecruitPlayer: (player: KairoPlayer) => void;
  onSignPlayer: (player: KairoPlayer) => void;
  onSendToTrainingCamp: (player: KairoPlayer, duration: number) => void;
  onMoneyChange: (amount: number) => void; // 用于扣除费用
  availableMoney: number;
  currentPlayers: KairoPlayer[];
}

const SCOUT_COST = 500;
const SIGNING_EVENT_COST = 200;
const TRAINING_CAMP_DAILY_COST = 100;

const PlayerRecruitment: React.FC<PlayerRecruitmentProps> = ({
  onRecruitPlayer,
  onSignPlayer,
  onSendToTrainingCamp,
  onMoneyChange,
  availableMoney,
  currentPlayers,
}) => {
  const [scoutedPlayers, setScoutedPlayers] = useState<KairoPlayer[]>([]);
  const [selectedPlayerForTraining, setSelectedPlayerForTraining] = useState<KairoPlayer | null>(null);
  const [trainingCampDuration, setTrainingCampDuration] = useState<number>(7);

  // 模拟生成随机球员
  const generateRandomPlayer = (isJunior: boolean = true): KairoPlayer => {
    const positions: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const types: PlayerType[] = ['Speedster', 'All-Star', 'S-Man', 'Defender', 'Rebounder', 'Playmaker', 'Dunker', 'Shooter'];

    const baseLevel = isJunior ? (Math.floor(Math.random() * 3) + 1) : (Math.floor(Math.random() * 5) + 3); // 青年球员1-3级，成熟球员3-7级
    const baseStats = isJunior ? 100 : 300;
    const statRange = isJunior ? 400 : 700;
    const costRange = isJunior ? 1500 : 5000;

    return {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `新秀球员 ${Math.floor(Math.random() * 100)}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      type: types[Math.floor(Math.random() * types.length)],
      level: baseLevel,
      experience: 0,
      stats: {
        stamina: Math.floor(Math.random() * statRange) + baseStats,
        shooting: Math.floor(Math.random() * statRange) + baseStats,
        dribbling: Math.floor(Math.random() * statRange) + baseStats,
        passing: Math.floor(Math.random() * statRange) + baseStats,
        defense: Math.floor(Math.random() * statRange) + baseStats,
        jumping: Math.floor(Math.random() * statRange) + baseStats,
      },
      skills: [],
      cost: Math.floor(Math.random() * costRange) + 1000, // 1000-6000金币
      isJunior: isJunior,
      positionAffinity: {
        PG: 'C', SG: 'C', SF: 'C', PF: 'C', C: 'C' // 简化处理，实际应根据位置生成
      },
      spriteIndex: Math.floor(Math.random() * 10), // 假设有10个球员sprite
    };
  };

  // 球探功能
  const scoutPlayers = () => {
    if (availableMoney < SCOUT_COST) {
      alert('资金不足以进行球探！需要 ' + SCOUT_COST + ' 金币。');
      return;
    }
    const newPlayers: KairoPlayer[] = Array.from({ length: 3 }, () => generateRandomPlayer(true));
    setScoutedPlayers(newPlayers);
    onMoneyChange(-SCOUT_COST); // 扣除球探费用
    alert(`成功花费 ${SCOUT_COST} 金币进行球探，发现了 ${newPlayers.length} 名球员！`);
  };

  const handleRecruitPlayer = (player: KairoPlayer) => {
    if (availableMoney < player.cost) {
      alert(`资金不足以招募 ${player.name}！需要 ${player.cost} 金币。`);
      return;
    }
    onRecruitPlayer(player);
    onMoneyChange(-player.cost); // 扣除招募费用
    setScoutedPlayers(scoutedPlayers.filter(p => p.id !== player.id)); // 从球探列表中移除
    alert(`成功招募 ${player.name}！`);
  };

  // 签名会功能
  const conductSigningEvent = () => {
    if (currentPlayers.length === 0) {
      alert('当前没有球员可以进行签名会！');
      return;
    }
    if (availableMoney < SIGNING_EVENT_COST) {
      alert('资金不足以组织签名会！需要 ' + SIGNING_EVENT_COST + ' 金币。');
      return;
    }
    const playerToSign = currentPlayers[Math.floor(Math.random() * currentPlayers.length)];
    onSignPlayer(playerToSign); // 通知父组件处理签名会效果
    onMoneyChange(-SIGNING_EVENT_COST); // 扣除签名会费用
    alert(`${playerToSign.name} 参加了签名会，提升了球队人气！`);
  };

  // 训练营功能
  const sendPlayerToTrainingCamp = () => {
    if (!selectedPlayerForTraining) {
      alert('请选择一名球员送往训练营！');
      return;
    }
    const totalCost = trainingCampDuration * TRAINING_CAMP_DAILY_COST;
    if (availableMoney < totalCost) {
      alert(`资金不足以支付训练营费用！需要 ${totalCost} 金币。`);
      return;
    }
    onSendToTrainingCamp(selectedPlayerForTraining, trainingCampDuration); // 通知父组件处理训练营效果
    onMoneyChange(-totalCost); // 扣除训练营费用
    alert(`${selectedPlayerForTraining.name} 已送往训练营 ${trainingCampDuration} 天！`);
    setSelectedPlayerForTraining(null); // 清除选择
  };

  return (
    <PixelPanel>
      <h2>球员招募中心</h2>

      {/* 球探功能 */}
      <PixelPanel>
        <h3>球探</h3>
        <p>花费 {SCOUT_COST} 金币进行一次球探，发现新的潜在球员。</p>
        <PixelButton onClick={scoutPlayers} disabled={availableMoney < SCOUT_COST}>进行球探</PixelButton>
        {scoutedPlayers.length > 0 && (
          <div>
            <h4>发现的球员:</h4>
            {scoutedPlayers.map(player => (
              <PixelPlayerCard key={player.id}>
                <p>名字: {player.name}</p>
                <p>位置: {player.position}</p>
                <p>类型: {player.type}</p>
                <p>等级: {player.level}</p>
                <p>身价: {player.cost} 金币</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <PixelButton onClick={() => handleRecruitPlayer(player)} disabled={availableMoney < player.cost}>招募</PixelButton>
                  <PixelButton onClick={() => setSelectedPlayerForTraining(player)}>送往训练营</PixelButton>
                </div>
              </PixelPlayerCard>
            ))}
          </div>
        )}
      </PixelPanel>

      {/* 签名会功能 */}
      <PixelPanel>
        <h3>签名会</h3>
        <p>组织一场签名会，提升球队人气。费用：{SIGNING_EVENT_COST} 金币。</p>
        <PixelButton onClick={conductSigningEvent} disabled={currentPlayers.length === 0 || availableMoney < SIGNING_EVENT_COST}>组织签名会</PixelButton>
      </PixelPanel>

      {/* 训练营功能 */}
      <PixelPanel>
        <h3>训练营</h3>
        <p>将选中的球员送往训练营，提升能力。</p>
        {selectedPlayerForTraining ? (
          <p>当前选择球员: <strong>{selectedPlayerForTraining.name}</strong></p>
        ) : (
          <p>请从已招募球员或球探发现的球员中选择一名。</p>
        )}
        <p>训练时长: 
          <PixelInput
            type="number"
            value={trainingCampDuration}
            onChange={(e) => setTrainingCampDuration(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            style={{ width: '60px', textAlign: 'center' }}
          /> 天
        </p>
        <p>总费用: {trainingCampDuration * TRAINING_CAMP_DAILY_COST} 金币</p>
        <PixelButton 
          onClick={sendPlayerToTrainingCamp} 
          disabled={!selectedPlayerForTraining || availableMoney < (trainingCampDuration * TRAINING_CAMP_DAILY_COST)}
        >
          送往训练营
        </PixelButton>
        
        {/* 允许从当前球队中选择球员送往训练营 */}
        {currentPlayers.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px dashed #a0a0a0', paddingTop: '16px' }}>
            <h4>从现有球员中选择送往训练营:</h4>
            <PixelSelect onChange={(e) => {
              const player = currentPlayers.find(p => p.id === e.target.value);
              setSelectedPlayerForTraining(player || null);
            }} value={selectedPlayerForTraining?.id || ''}>
              <option value="">-- 请选择球员 --</option>
              {currentPlayers.map(player => (
                <option key={player.id} value={player.id}>{player.name} ({player.position})</option>
              ))}
            </PixelSelect>
          </div>
        )}
      </PixelPanel>
    </PixelPanel>
  );
};

export default PlayerRecruitment;

