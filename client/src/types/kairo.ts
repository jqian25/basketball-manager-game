// 开罗风格篮球游戏 - 核心数据模型

// ==================== 球员系统 ====================

export type PlayerPosition = "PG" | "SG" | "SF" | "PF" | "C";

export type PlayerType = 
  | "Speedster"      // 速度型
  | "All-Star"       // 全能型
  | "S-Man"          // 投篮型
  | "Defender"       // 防守型
  | "Rebounder"      // 篮板型
  | "Playmaker"      // 组织型
  | "Dunker"         // 扣篮型
  | "Shooter";       // 射手型

export interface PlayerStats {
  stamina: number;    // 体力 (0-9999)
  shooting: number;   // 投篮 (0-9999)
  dribbling: number;  // 运球 (0-9999)
  passing: number;    // 传球 (0-9999)
  defense: number;    // 防守 (0-9999)
  jumping: number;    // 跳跃 (0-9999)
}

export interface PlayerSkill {
  id: string;
  name: string;
  description: string;
  effect: string;
  type: "basic" | "equipable";
}

export interface KairoPlayer {
  id: string;
  name: string;
  position: PlayerPosition;
  type: PlayerType;
  level: number;
  experience: number;
  stats: PlayerStats;
  skills: PlayerSkill[];
  cost: number;
  isJunior: boolean;
  positionAffinity: Record<PlayerPosition, "S" | "A" | "B" | "C">;
  spriteIndex: number; // 对应sprite图片索引
}

// ==================== 训练设施系统 ====================

export type FacilityType = 
  | "training_court"    // 训练球场
  | "gym"               // 健身房
  | "rest_area"         // 休息区
  | "medical_room"      // 医疗室
  | "shop"              // 商店
  | "restaurant"        // 餐厅
  | "locker_room";      // 更衣室

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  level: number;
  experience: number;
  maxExperience: number;
  buildCost: number;
  maintenanceCost: number;
  areaEffectRange: number;
  areaEffectBonus: {
    popularity?: number;
    training?: number;
    recovery?: number;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// ==================== 赞助商系统 ====================

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  monthlyIncome: number;
  bonus: {
    type: "money" | "popularity" | "training" | "stats";
    value: number;
  };
  unlockCondition: {
    type: "rank" | "popularity" | "wins" | "championship";
    value: number;
  };
  isActive: boolean;
}

// ==================== 联赛系统 ====================

export type LeagueLevel = 
  | "amateur"       // 业余联赛
  | "regional"      // 地区联赛
  | "national"      // 全国联赛
  | "continental"   // 大陆联赛
  | "world";        // 世界联赛

export interface League {
  id: string;
  name: string;
  level: LeagueLevel;
  teams: number;
  matchesPerSeason: number;
  unlockCondition: {
    type: "rank" | "championship";
    value: string | number;
  };
  rewards: {
    champion: { money: number; popularity: number; items?: string[] };
    runnerUp: { money: number; popularity: number };
    participation: { money: number; popularity: number };
  };
}

export interface Match {
  id: string;
  leagueId: string;
  opponent: {
    name: string;
    level: number;
    strength: number;
  };
  date: Date;
  result?: {
    homeScore: number;
    awayScore: number;
    won: boolean;
    mvp?: string;
  };
}

// ==================== 比赛事件 ====================

export type MatchEventType = 
  | "shot_success"
  | "shot_miss"
  | "three_pointer"
  | "dunk"
  | "assist"
  | "rebound"
  | "steal"
  | "block"
  | "foul"
  | "timeout"
  | "substitution"
  | "quarter_end";

export interface MatchEvent {
  id: number;
  type: MatchEventType;
  time: number;
  quarter: number;
  team: "home" | "away";
  player?: KairoPlayer;
  targetPlayer?: KairoPlayer;
  points?: number;
  description: string;
}

// ==================== 游戏状态 ====================

export interface KairoGameState {
  // 俱乐部信息
  clubName: string;
  clubLevel: number;
  clubRank: number;
  popularity: number;
  money: number;
  
  // 球员
  players: KairoPlayer[];
  maxPlayers: number;
  startingLineup: string[]; // 5个球员ID
  
  // 设施
  facilities: Facility[];
  clubLayout: { width: number; height: number };
  
  // 赞助商
  sponsors: Sponsor[];
  
  // 联赛
  currentLeague: string;
  currentSeason: number;
  matches: Match[];
  
  // 游戏进度
  gameDay: number;
  gameYear: number;
}

// ==================== 训练系统 ====================

export type TrainingType = 
  | "stamina"
  | "shooting"
  | "dribbling"
  | "passing"
  | "defense"
  | "jumping"
  | "all_round";

export interface TrainingSession {
  id: string;
  type: TrainingType;
  playerId: string;
  facilityId?: string;
  duration: number; // 天数
  cost: number;
  expectedGain: Partial<PlayerStats>;
}

// ==================== UI状态 ====================

export interface KairoUIState {
  currentView: "club" | "players" | "facilities" | "match" | "league" | "sponsors";
  selectedPlayer?: string;
  selectedFacility?: string;
  isMatchPlaying: boolean;
  showPlayerDetails: boolean;
  showTrainingMenu: boolean;
  showRecruitmentMenu: boolean;
}

