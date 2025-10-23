
import React, { useState, useEffect, useMemo } from 'react';
import { Sponsor, KairoGameState } from '../../types/kairo';
import './SponsorSystem.css'; // 引入CSS模块或全局CSS

// 模拟赞助商Logo图片，实际项目中应为图片路径
const sponsorLogos: { [key: string]: string } = {
  'sponsor-a': 'url("https://via.placeholder.com/64x64/FF0000/FFFFFF?text=SA")', // 示例图片
  'sponsor-b': 'url("https://via.placeholder.com/64x64/00FF00/FFFFFF?text=SB")',
  'sponsor-c': 'url("https://via.placeholder.com/64x64/0000FF/FFFFFF?text=SC")',
  'sponsor-d': 'url("https://via.placeholder.com/64x64/FFFF00/000000?text=SD")',
  'sponsor-e': 'url("https://via.placeholder.com/64x64/FF00FF/FFFFFF?text=SE")',
};

interface SponsorSystemProps {
  allSponsors: Sponsor[];
  gameState: KairoGameState;
  onSignSponsor: (sponsorId: string) => void;
  onTerminateSponsor: (sponsorId: string) => void;
}

const SponsorSystem: React.FC<SponsorSystemProps> = ({
  allSponsors,
  gameState,
  onSignSponsor,
  onTerminateSponsor,
}) => {
  const [localSponsors, setLocalSponsors] = useState<Sponsor[]>(allSponsors);

  useEffect(() => {
    setLocalSponsors(allSponsors);
  }, [allSponsors]);

  const availableSponsors = useMemo(
    () => localSponsors.filter((s) => !s.isActive),
    [localSponsors]
  );
  const activeSponsors = useMemo(
    () => localSponsors.filter((s) => s.isActive),
    [localSponsors]
  );

  const canSignSponsor = (sponsor: Sponsor): boolean => {
    const { unlockCondition } = sponsor;
    if (!unlockCondition) return true;

    switch (unlockCondition.type) {
      case 'rank':
        return gameState.clubRank <= (unlockCondition.value as number);
      case 'popularity':
        return gameState.popularity >= (unlockCondition.value as number);
      case 'wins':
        // 假设 gameState 中有 wins 字段，这里简化处理
        return true; // 实际应根据游戏状态判断
      case 'championship':
        // 假设 gameState 中有 championship 字段，这里简化处理
        return false; // 实际应根据游戏状态判断
      default:
        return true;
    }
  };

  const getUnlockConditionText = (sponsor: Sponsor): string => {
    const { unlockCondition } = sponsor;
    if (!unlockCondition) return '无';

    switch (unlockCondition.type) {
      case 'rank':
        return `俱乐部排名达到前 ${unlockCondition.value}`;
      case 'popularity':
        return `俱乐部人气达到 ${unlockCondition.value}`;
      case 'wins':
        return `赢得 ${unlockCondition.value} 场比赛`;
      case 'championship':
        return `赢得 ${unlockCondition.value} 次冠军`;
      default:
        return '未知条件';
    }
  };

  const getTotalMonthlyIncome = useMemo(() => {
    return activeSponsors.reduce((sum, s) => sum + s.monthlyIncome, 0);
  }, [activeSponsors]);

  const getTotalBonusText = useMemo(() => {
    const bonusMap: { [key: string]: number } = {};
    activeSponsors.forEach((s) => {
      if (s.bonus) {
        bonusMap[s.bonus.type] = (bonusMap[s.bonus.type] || 0) + s.bonus.value;
      }
    });

    return Object.entries(bonusMap)
      .map(([type, value]) => {
        switch (type) {
          case 'money':
            return `+${value} 金钱`;
          case 'popularity':
            return `+${value} 人气`;
          case 'training':
            return `训练效率提升 ${value}%`;
          case 'stats':
            return `球员属性提升 ${value}`; // 示例，实际可能更复杂
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  }, [activeSponsors]);

  const renderSponsorCard = (sponsor: Sponsor, isAvailable: boolean) => {
    const canSign = isAvailable && canSignSponsor(sponsor);
    const conditionText = getUnlockConditionText(sponsor);

    return (
      <div key={sponsor.id} className="kairo-sponsor-card">
        <div
          className="kairo-sponsor-logo"
          style={{ backgroundImage: sponsorLogos[sponsor.id] || 'url("https://via.placeholder.com/64x64/CCCCCC/000000?text=Logo")' }}
        ></div>
        <div className="kairo-sponsor-info">
          <div className="kairo-sponsor-name">{sponsor.name}</div>
          <div className="kairo-sponsor-tier">等级: {sponsor.tier}</div>
          <div className="kairo-sponsor-income">每月收益: ${sponsor.monthlyIncome}</div>
          {sponsor.bonus && (
            <div className="kairo-sponsor-bonus">
              奖励: {sponsor.bonus.type === 'money' && `+${sponsor.bonus.value} 金钱`}
              {sponsor.bonus.type === 'popularity' && `+${sponsor.bonus.value} 人气`}
              {sponsor.bonus.type === 'training' && `训练效率提升 ${sponsor.bonus.value}%`}
              {sponsor.bonus.type === 'stats' && `球员属性提升 ${sponsor.bonus.value}`}
            </div>
          )}
          {isAvailable && (
            <div className="kairo-sponsor-condition">条件: {conditionText}</div>
          )}
        </div>
        <div className="kairo-sponsor-actions">
          {isAvailable ? (
            <button
              className="kairo-button"
              onClick={() => onSignSponsor(sponsor.id)}
              disabled={!canSign}
            >
              {canSign ? '签约' : '条件不足'}
            </button>
          ) : (
            <button
              className="kairo-button terminate"
              onClick={() => onTerminateSponsor(sponsor.id)}
            >
              解约
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="kairo-sponsor-system-container">
      <h2 className="kairo-title">赞助商系统</h2>

      <div className="kairo-info-bar">
        <span>金钱: ${gameState.money}</span>
        <span>人气: {gameState.popularity}</span>
        <span>排名: {gameState.clubRank}</span>
      </div>

      <div className="kairo-sponsor-content">
        <div className="kairo-sponsor-list available">
          <h3 className="kairo-subtitle">可签约赞助商</h3>
          {availableSponsors.length === 0 ? (
            <p className="kairo-empty-message">暂无更多赞助商可签约。</p>
          ) : (
            availableSponsors.map((s) => renderSponsorCard(s, true))
          )}
        </div>

        <div className="kairo-sponsor-list active">
          <h3 className="kairo-subtitle">我的赞助商</h3>
          <div className="kairo-summary">
            <p>每月总收益: ${getTotalMonthlyIncome}</p>
            <p>总额外奖励: {getTotalBonusText || '无'}</p>
          </div>
          {activeSponsors.length === 0 ? (
            <p className="kairo-empty-message">您尚未签约任何赞助商。</p>
          ) : (
            activeSponsors.map((s) => renderSponsorCard(s, false))
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorSystem;

