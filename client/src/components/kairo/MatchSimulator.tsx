
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KairoPlayer, Match, MatchEvent, MatchEventType } from '../../types/kairo';

// 模拟比赛事件的生成和概率
const generateMatchEvent = (quarter: number, time: number, homePlayers: KairoPlayer[], awayPlayers: KairoPlayer[]): MatchEvent | null => {
  const eventTypes: MatchEventType[] = [
    "shot_success", "shot_miss", "three_pointer", "dunk", "assist",
    "rebound", "steal", "block", "foul", "timeout", "substitution"
  ];
  const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  const isHomeTeam = Math.random() > 0.5;
  const team = isHomeTeam ? "home" : "away";
  const players = isHomeTeam ? homePlayers : awayPlayers;
  const randomPlayer = players[Math.floor(Math.random() * players.length)];

  let description = "";
  let points: number | undefined = undefined;

  switch (randomEventType) {
    case "shot_success":
      points = Math.random() > 0.7 ? 3 : 2; // 3分球或2分球
      description = `${randomPlayer.name} ${points === 3 ? '命中三分' : '投篮得分'}！`;
      break;
    case "shot_miss":
      description = `${randomPlayer.name} 投篮不中。`;
      break;
    case "three_pointer":
      points = 3;
      description = `${randomPlayer.name} 命中一记精彩三分！`;
      break;
    case "dunk":
      points = 2;
      description = `${randomPlayer.name} 暴力扣篮得分！`;
      break;
    case "assist":
      const assistPlayer = players[Math.floor(Math.random() * players.length)];
      description = `${assistPlayer.name} 助攻 ${randomPlayer.name} 得分。`;
      break;
    case "rebound":
      description = `${randomPlayer.name} 抢下篮板。`;
      break;
    case "steal":
      description = `${randomPlayer.name} 完成抢断！`;
      break;
    case "block":
      description = `${randomPlayer.name} 送出盖帽！`;
      break;
    case "foul":
      description = `${randomPlayer.name} 犯规。`;
      break;
    case "timeout":
      description = `${team === 'home' ? '主队' : '客队'} 请求暂停。`;
      break;
    case "substitution":
      const subInPlayer = players[Math.floor(Math.random() * players.length)];
      const subOutPlayer = players[Math.floor(Math.random() * players.length)];
      description = `${team === 'home' ? '主队' : '客队'} 换人：${subOutPlayer.name} 下场，${subInPlayer.name} 上场。`;
      break;
    default:
      description = `比赛事件发生。`;
  }

  return {
    id: Date.now() + Math.random(),
    type: randomEventType,
    time,
    quarter,
    team,
    player: randomPlayer,
    points,
    description,
  };
};

interface MatchSimulatorProps {
  match: Match;
  homeTeamPlayers: KairoPlayer[];
  awayTeamPlayers: KairoPlayer[];
  onMatchEnd: (result: { homeScore: number; awayScore: number; won: boolean; mvp?: string }) => void;
}

const MatchSimulator: React.FC<MatchSimulatorProps> = ({ match, homeTeamPlayers, awayTeamPlayers, onMatchEnd }) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [matchTime, setMatchTime] = useState(0); // In seconds, 12 minutes per quarter
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const quarterDuration = 12 * 60; // 12 minutes per quarter
  const totalQuarters = 4;

  const simulateGameTick = useCallback(() => {
    setMatchTime((prevTime) => {
      const newTime = prevTime + 10; // Simulate 10 seconds passing

      if (newTime >= quarterDuration) {
        // End of quarter
        if (currentQuarter < totalQuarters) {
          setMatchEvents((prevEvents) => [
            ...prevEvents,
            {
              id: Date.now() + Math.random(),
              type: "quarter_end",
              time: quarterDuration,
              quarter: currentQuarter,
              team: "home", // Placeholder team
              description: `第 ${currentQuarter} 节结束`,
            },
          ]);
          setCurrentQuarter((prevQuarter) => prevQuarter + 1);
          return 0; // Reset time for next quarter
        } else {
          // End of match
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsMatchOver(true);
          const won = homeScore > awayScore;
          // Simple MVP selection (could be more complex)
          const mvpCandidate = homeTeamPlayers.concat(awayTeamPlayers)[Math.floor(Math.random() * (homeTeamPlayers.length + awayTeamPlayers.length))];
          onMatchEnd({ homeScore, awayScore, won, mvp: mvpCandidate?.name });
          return prevTime; // Keep last time
        }
      }

      // Generate events randomly
      if (Math.random() < 0.3) { // Adjust probability for events
        const event = generateMatchEvent(currentQuarter, newTime, homeTeamPlayers, awayTeamPlayers);
        if (event) {
          setMatchEvents((prevEvents) => [...prevEvents, event]);
          if (event.points) {
            if (event.team === "home") {
              setHomeScore((prevScore) => prevScore + event.points!); // Non-null assertion because we check event.points
            } else {
              setAwayScore((prevScore) => prevScore + event.points!); // Non-null assertion
            }
          }
        }
      }
      return newTime;
    });
  }, [currentQuarter, homeScore, awayScore, homeTeamPlayers, awayTeamPlayers, onMatchEnd]);

  useEffect(() => {
    if (!isMatchOver) {
      intervalRef.current = setInterval(simulateGameTick, 1000); // Simulate every second
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMatchOver, simulateGameTick]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="kairo-match-simulator pixel-font">
      <style>{`
        .kairo-match-simulator {
          background-color: #2e2e2e;
          border: 4px solid #8b8b8b;
          border-radius: 8px;
          padding: 16px;
          color: #e0e0e0;
          font-family: 'Press Start 2P', cursive; /* Example pixel font */
          image-rendering: pixelated;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
        }
        .pixel-font {
          font-family: 'Press Start 2P', cursive; /* Ensure pixel font is applied */
        }
        .scoreboard {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 20px;
          background-color: #1a1a1a;
          padding: 10px;
          border: 2px solid #555;
          border-radius: 4px;
        }
        .team-score {
          text-align: center;
        }
        .team-name {
          font-size: 1.5em;
          color: #ffcc00;
          margin-bottom: 5px;
        }
        .score-value {
          font-size: 3em;
          color: #00ff00;
        }
        .quarter-time {
          text-align: center;
          font-size: 1.2em;
          color: #00ffff;
          margin-bottom: 15px;
        }
        .event-log {
          background-color: #1a1a1a;
          border: 2px solid #555;
          border-radius: 4px;
          height: 300px;
          overflow-y: auto;
          padding: 10px;
          font-size: 0.9em;
          line-height: 1.4;
        }
        .event-log p {
          margin: 5px 0;
          border-bottom: 1px dotted #333;
          padding-bottom: 3px;
        }
        .event-log p:last-child {
          border-bottom: none;
        }
        .event-log .home-event {
          color: #ff6666;
        }
        .event-log .away-event {
          color: #66ccff;
        }
        .event-log .system-event {
          color: #cccccc;
          font-style: italic;
        }
        .match-over-message {
          text-align: center;
          font-size: 1.8em;
          color: #ff00ff;
          margin-top: 20px;
          text-shadow: 2px 2px #000;
        }
      `}</style>
      <div className="scoreboard">
        <div className="team-score">
          <div className="team-name">你的队伍</div>
          <div className="score-value">{homeScore}</div>
        </div>
        <div className="team-score">
          <div className="team-name">{match.opponent.name}</div>
          <div className="score-value">{awayScore}</div>
        </div>
      </div>

      <div className="quarter-time">
        第 {currentQuarter} 节 - 时间: {formatTime(matchTime)}
      </div>

      <div className="event-log">
        {matchEvents.map((event) => (
          <p
            key={event.id}
            className={
              event.type === "quarter_end"
                ? "system-event"
                : event.team === "home"
                ? "home-event"
                : "away-event"
            }
          >
            [{formatTime(event.time)}] {event.description}
          </p>
        ))}
      </div>

      {isMatchOver && (
        <div className="match-over-message">
          比赛结束！
          <p>{homeScore > awayScore ? "你赢了！" : homeScore < awayScore ? "你输了！" : "平局！"}</p>
        </div>
      )}
    </div>
  );
};

export default MatchSimulator;

