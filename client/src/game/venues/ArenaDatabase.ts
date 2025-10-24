// client/src/game/venues/ArenaDatabase.ts

/**
 * 篮球场馆数据接口
 * 包含场馆的基本信息，用于游戏中的场馆数据库。
 */
export interface Arena {
  /** 场馆的唯一标识符，使用缩写或短名称 */
  id: string;
  /** 场馆的官方全名 */
  name: string;
  /** 场馆所在的城市 */
  city: string;
  /** 场馆所在的州/省/地区 */
  state: string;
  /** 场馆的主队（NBA球队） */
  team: string;
  /** 场馆的篮球比赛容量 */
  capacity: number;
  /** 场馆的开馆年份 */
  opened: number;
}

/**
 * 包含30个著名篮球场馆数据的数组。
 * 数据主要来源于当前NBA的30个主场场馆。
 */
export const ArenaDatabase: Arena[] = [
  {
    id: "AAC",
    name: "American Airlines Center",
    city: "Dallas",
    state: "Texas",
    team: "Dallas Mavericks",
    capacity: 19200,
    opened: 2001,
  },
  {
    id: "BallArena",
    name: "Ball Arena",
    city: "Denver",
    state: "Colorado",
    team: "Denver Nuggets",
    capacity: 19520,
    opened: 1999,
  },
  {
    id: "Barclays",
    name: "Barclays Center",
    city: "Brooklyn",
    state: "New York",
    team: "Brooklyn Nets",
    capacity: 17732,
    opened: 2012,
  },
  {
    id: "CapOne",
    name: "Capital One Arena",
    city: "Washington",
    state: "D.C.",
    team: "Washington Wizards",
    capacity: 20356,
    opened: 1997,
  },
  {
    id: "Chase",
    name: "Chase Center",
    city: "San Francisco",
    state: "California",
    team: "Golden State Warriors",
    capacity: 18064,
    opened: 2019,
  },
  {
    id: "Crypto",
    name: "Crypto.com Arena",
    city: "Los Angeles",
    state: "California",
    team: "Los Angeles Lakers",
    capacity: 18997,
    opened: 1999,
  },
  {
    id: "Delta",
    name: "Delta Center",
    city: "Salt Lake City",
    state: "Utah",
    team: "Utah Jazz",
    capacity: 18306,
    opened: 1991,
  },
  {
    id: "FedEx",
    name: "FedExForum",
    city: "Memphis",
    state: "Tennessee",
    team: "Memphis Grizzlies",
    capacity: 17794,
    opened: 2004,
  },
  {
    id: "Fiserv",
    name: "Fiserv Forum",
    city: "Milwaukee",
    state: "Wisconsin",
    team: "Milwaukee Bucks",
    capacity: 17500,
    opened: 2018,
  },
  {
    id: "FrostBank",
    name: "Frost Bank Center",
    city: "San Antonio",
    state: "Texas",
    team: "San Antonio Spurs",
    capacity: 18418,
    opened: 2002,
  },
  {
    id: "Gainbridge",
    name: "Gainbridge Fieldhouse",
    city: "Indianapolis",
    state: "Indiana",
    team: "Indiana Pacers",
    capacity: 17923,
    opened: 1999,
  },
  {
    id: "Golden1",
    name: "Golden 1 Center",
    city: "Sacramento",
    state: "California",
    team: "Sacramento Kings",
    capacity: 17583,
    opened: 2016,
  },
  {
    id: "Intuit",
    name: "Intuit Dome",
    city: "Inglewood",
    state: "California",
    team: "Los Angeles Clippers",
    capacity: 18000,
    opened: 2024,
  },
  {
    id: "Kaseya",
    name: "Kaseya Center",
    city: "Miami",
    state: "Florida",
    team: "Miami Heat",
    capacity: 19600,
    opened: 1999,
  },
  {
    id: "Kia",
    name: "Kia Center",
    city: "Orlando",
    state: "Florida",
    team: "Orlando Magic",
    capacity: 18846,
    opened: 2010,
  },
  {
    id: "LittleCaesars",
    name: "Little Caesars Arena",
    city: "Detroit",
    state: "Michigan",
    team: "Detroit Pistons",
    capacity: 20332,
    opened: 2017,
  },
  {
    id: "MSG",
    name: "Madison Square Garden",
    city: "New York",
    state: "New York",
    team: "New York Knicks",
    capacity: 19812,
    opened: 1968,
  },
  {
    id: "Moda",
    name: "Moda Center",
    city: "Portland",
    state: "Oregon",
    team: "Portland Trail Blazers",
    capacity: 19441,
    opened: 1995,
  },
  {
    id: "Mortgage",
    name: "Mortgage Matchup Center",
    city: "Phoenix",
    state: "Arizona",
    team: "Phoenix Suns",
    capacity: 17071,
    opened: 1992,
  },
  {
    id: "Paycom",
    name: "Paycom Center",
    city: "Oklahoma City",
    state: "Oklahoma",
    team: "Oklahoma City Thunder",
    capacity: 18203,
    opened: 2002,
  },
  {
    id: "Rocket",
    name: "Rocket Arena",
    city: "Cleveland",
    state: "Ohio",
    team: "Cleveland Cavaliers",
    capacity: 19432,
    opened: 1994,
  },
  {
    id: "Scotiabank",
    name: "Scotiabank Arena",
    city: "Toronto",
    state: "Ontario",
    team: "Toronto Raptors",
    capacity: 19800,
    opened: 1999,
  },
  {
    id: "Smoothie",
    name: "Smoothie King Center",
    city: "New Orleans",
    state: "Louisiana",
    team: "New Orleans Pelicans",
    capacity: 16867,
    opened: 1999,
  },
  {
    id: "Spectrum",
    name: "Spectrum Center",
    city: "Charlotte",
    state: "North Carolina",
    team: "Charlotte Hornets",
    capacity: 19077,
    opened: 2005,
  },
  {
    id: "StateFarm",
    name: "State Farm Arena",
    city: "Atlanta",
    state: "Georgia",
    team: "Atlanta Hawks",
    capacity: 17044,
    opened: 1999,
  },
  {
    id: "Target",
    name: "Target Center",
    city: "Minneapolis",
    state: "Minnesota",
    team: "Minnesota Timberwolves",
    capacity: 18978,
    opened: 1990,
  },
  {
    id: "TDGarden",
    name: "TD Garden",
    city: "Boston",
    state: "Massachusetts",
    team: "Boston Celtics",
    capacity: 19580,
    opened: 1995,
  },
  {
    id: "Toyota",
    name: "Toyota Center",
    city: "Houston",
    state: "Texas",
    team: "Houston Rockets",
    capacity: 18055,
    opened: 2003,
  },
  {
    id: "United",
    name: "United Center",
    city: "Chicago",
    state: "Illinois",
    team: "Chicago Bulls",
    capacity: 20917,
    opened: 1994,
  },
  {
    id: "Xfinity",
    name: "Xfinity Mobile Arena",
    city: "Philadelphia",
    state: "Pennsylvania",
    team: "Philadelphia 76ers",
    capacity: 20478,
    opened: 1996,
  },
];

// 导出场馆数据库，方便其他模块引用
export default ArenaDatabase;

// 额外导出一个函数，方便通过ID查找场馆
export function getArenaById(id: string): Arena | undefined {
  return ArenaDatabase.find(arena => arena.id === id);
}

// 额外导出一个函数，方便通过主队名称查找场馆
export function getArenaByTeam(team: string): Arena | undefined {
  return ArenaDatabase.find(arena => arena.team === team);
}