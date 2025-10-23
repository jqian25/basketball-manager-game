
import React, { useState, useEffect } from 'react';
import { League, Match, KairoGameState } from '../../types/kairo';
import './LeagueSystem.css'; // For pixel-style UI

interface LeagueSystemProps {
  currentGameState: KairoGameState;
  onMatchSelected?: (matchId: string) => void;
  onLeagueChanged?: (leagueId: string) => void;
}

const LeagueSystem: React.FC<LeagueSystemProps> = ({ currentGameState, onMatchSelected, onLeagueChanged }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'rankings' | 'rewards'>('schedule');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(currentGameState.currentLeague);

  // 假设所有可用的联赛信息都存储在一个数组中，或者通过其他方式获取
  // 这里我们暂时模拟一个联赛列表，实际应用中可能从API或全局状态获取
  const allLeagues: League[] = [
    {
      id: "league_amateur",
      name: "业余联赛",
      level: "amateur",
      teams: 8,
      matchesPerSeason: 14,
      unlockCondition: { type: "rank", value: 100 },
      rewards: {
        champion: { money: 1000, popularity: 50, items: ["训练手册"] },
        runnerUp: { money: 500, popularity: 20 },
        participation: { money: 100, popularity: 5 },
      },
    },
    {
      id: "league_regional",
      name: "地区联赛",
      level: "regional",
      teams: 10,
      matchesPerSeason: 18,
      unlockCondition: { type: "rank", value: 50 },
      rewards: {
        champion: { money: 5000, popularity: 150, items: ["高级训练手册"] },
        runnerUp: { money: 2000, popularity: 70 },
        participation: { money: 300, popularity: 15 },
      },
    },
    {
      id: "league_national",
      name: "全国联赛",
      level: "national",
      teams: 12,
      matchesPerSeason: 22,
      unlockCondition: { type: "rank", value: 10 },
      rewards: {
        champion: { money: 20000, popularity: 500, items: ["稀有训练手册", "球星卡包"] },
        runnerUp: { money: 8000, popularity: 200 },
        participation: { money: 1000, popularity: 50 },
      },
    },
  ];

  const currentLeague = allLeagues.find(l => l.id === selectedLeagueId) || allLeagues[0]; // 确保有一个默认联赛
  const leagueMatches = currentGameState.matches.filter(m => m.leagueId === selectedLeagueId);

  useEffect(() => {
    if (currentGameState.currentLeague && !selectedLeagueId) {
      setSelectedLeagueId(currentGameState.currentLeague);
    }
  }, [currentGameState.currentLeague, selectedLeagueId]);

  if (!currentLeague) {
    return <div className="kairo-panel">加载联赛信息...</div>;
  }

  const renderSchedule = () => {
    const upcomingMatches = leagueMatches.filter(m => !m.result || !m.result.homeScore).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastMatches = leagueMatches.filter(m => m.result && m.result.homeScore).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="schedule-content">
        <h3>即将到来的比赛</h3>
        {upcomingMatches.length === 0 ? (
          <p>暂无即将到来的比赛。</p>
        ) : (
          <div className="match-list">
            {upcomingMatches.map(match => (
              <div key={match.id} className="match-item upcoming" onClick={() => onMatchSelected && onMatchSelected(match.id)}>
                <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
                <span className="match-teams">{currentGameState.clubName} vs {match.opponent.name}</span>
                <span className="match-level">对手等级: {match.opponent.level}</span>
              </div>
            ))}
          </div>
        )}

        <h3>已结束的比赛</h3>
        {pastMatches.length === 0 ? (
          <p>暂无已结束的比赛。</p>
        ) : (
          <div className="match-list">
            {pastMatches.map(match => (
              <div key={match.id} className="match-item past" onClick={() => onMatchSelected && onMatchSelected(match.id)}>
                <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
                <span className="match-teams">{currentGameState.clubName} {match.result?.homeScore} - {match.result?.awayScore} {match.opponent.name}</span>
                <span className={`match-result ${match.result?.won ? 'won' : 'lost'}`}>{match.result?.won ? '胜' : '负'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRankings = () => {
    // 假设有一个简单的排名逻辑，根据胜场数或积分
    // 这里我们模拟一个基于俱乐部等级和随机值的排名
    const teamStats: { [key: string]: { wins: number; losses: number; draws: number; points: number } } = {};

    // Initialize team stats
    [currentGameState.clubName, ...currentLeague.teams].forEach(teamName => {
      teamStats[teamName] = { wins: 0, losses: 0, draws: 0, points: 0 };
    });

    // Calculate stats based on past matches
    leagueMatches.forEach(match => {
      if (match.result) {
        if (match.result.homeScore > match.result.awayScore) {
          if (match.result.won) { // Assuming `won` means current club won
            teamStats[currentGameState.clubName].wins++;
            teamStats[match.opponent.name].losses++;
          } else { // Opponent won against current club
            teamStats[match.opponent.name].wins++;
            teamStats[currentGameState.clubName].losses++;
          }
        } else if (match.result.homeScore < match.result.awayScore) {
          if (match.result.won) { // Assuming `won` means current club won
            teamStats[currentGameState.clubName].wins++;
            teamStats[match.opponent.name].losses++;
          } else { // Opponent won against current club
            teamStats[match.opponent.name].wins++;
            teamStats[currentGameState.clubName].losses++;
          }
        } else {
          // Draw, if applicable in basketball (unlikely, but for completeness)
          teamStats[currentGameState.clubName].draws++;
          teamStats[match.opponent.name].draws++;
        }
        // For simplicity, points are not calculated here, only wins/losses
      }
    });

    const teamsWithStats = Object.keys(teamStats).map(teamName => ({
      name: teamName,
      wins: teamStats[teamName].wins,
      losses: teamStats[teamName].losses,
      draws: teamStats[teamName].draws,
      winRate: teamStats[teamName].wins / (teamStats[teamName].wins + teamStats[teamName].losses + teamStats[teamName].draws) || 0,
    }));

    // Sort by wins, then by win rate, then by name
    const sortedTeams = teamsWithStats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="rankings-content">
        <h3>{currentLeague.name} 排名</h3>
        <table className="kairo-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>队伍</th>
              <th>胜</th>
              <th>负</th>
              <th>胜率</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.name} className={team.name === currentGameState.clubName ? 'player-team' : ''}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{((team.wins / (team.wins + team.losses)) * 100 || 0).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRewards = () => {
    const { champion, runnerUp, participation } = currentLeague.rewards;

    return (
      <div className="rewards-content">
        <h3>{currentLeague.name} 奖励</h3>
        <div className="reward-category">
          <h4>冠军奖励</h4>
          <p>金钱: {champion.money}</p>
          <p>人气: {champion.popularity}</p>
          {champion.items && champion.items.length > 0 && <p>物品: {champion.items.join(', ')}</p>}
        </div>
        <div className="reward-category">
          <h4>亚军奖励</h4>
          <p>金钱: {runnerUp.money}</p>
          <p>人气: {runnerUp.popularity}</p>
        </div>
        <div className="reward-category">
          <h4>参与奖励</h4>
          <p>金钱: {participation.money}</p>
          <p>人气: {participation.popularity}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="kairo-panel league-system">
      <div className="panel-header">
        <h2>联赛系统</h2>
        <select 
          value={selectedLeagueId}
          onChange={(e) => {
            setSelectedLeagueId(e.target.value);
            onLeagueChanged && onLeagueChanged(e.target.value);
          }}
          className="kairo-select"
        >
          {currentGameState.leagues.map(league => (
            <option key={league.id} value={league.id}>{league.name} ({league.level})</option>
          ))}
        </select>
      </div>
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>赛程</button>
        <button className={`tab-button ${activeTab === 'rankings' ? 'active' : ''}`} onClick={() => setActiveTab('rankings')}>排名</button>
        <button className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>奖励</button>
      </div>
      <div className="tab-content">
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'rankings' && renderRankings()}
        {activeTab === 'rewards' && renderRewards()}
      </div>
    </div>
  );
};

export default LeagueSystem;

