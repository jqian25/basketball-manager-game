import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, float } from "drizzle-orm/mysql-core";

/**
 * 用户表
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 球员表
 * 六维属性系统：Scoring, Passing, Defense, Athleticism, IQ, Stamina (1-20)
 */
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // 所属用户（null表示系统球员）
  name: varchar("name", { length: 100 }).notNull(),
  
  // 位置：PG/SG/SF/PF/C
  position: mysqlEnum("position", ["PG", "SG", "SF", "PF", "C"]).notNull(),
  
  // 身材档位 (1-3: 小/中/大)
  bodyType: int("bodyType").notNull().default(2),
  
  // 六维属性 (1-20)
  scoring: int("scoring").notNull().default(10),        // 得分能力
  passing: int("passing").notNull().default(10),        // 传球能力
  defense: int("defense").notNull().default(10),        // 防守能力
  athleticism: int("athleticism").notNull().default(10), // 运动能力
  basketballIQ: int("basketballIQ").notNull().default(10), // 篮球智商
  stamina: int("stamina").notNull().default(10),        // 体能上限
  
  // 倾向 (0-100)
  threePointTendency: int("threePointTendency").notNull().default(25),  // 三分倾向
  midRangeTendency: int("midRangeTendency").notNull().default(25),      // 中投倾向
  driveTendency: int("driveTendency").notNull().default(25),            // 突破倾向
  postUpTendency: int("postUpTendency").notNull().default(25),          // 低位倾向
  
  // 经验值和等级
  experience: int("experience").notNull().default(0),
  level: int("level").notNull().default(1),
  
  // 成长类型 (17种)
  growthType: varchar("growthType", { length: 50 }).notNull().default("balanced"),
  
  // 头像
  avatarUrl: text("avatarUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

/**
 * 球队表
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  
  // 阵容配置 (JSON: 先发5人 + 替补2人的球员ID)
  lineup: text("lineup").notNull(), // JSON array of player IDs
  
  // 战术配置
  pace: mysqlEnum("pace", ["slow", "normal", "fast"]).notNull().default("normal"),
  spacing: mysqlEnum("spacing", ["inside", "balanced", "outside"]).notNull().default("balanced"),
  defenseStrategy: mysqlEnum("defenseStrategy", ["man", "zone"]).notNull().default("man"),
  
  // 球队数据
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * 比赛记录表
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // 比赛类型
  matchType: mysqlEnum("matchType", ["guest", "registered"]).notNull(),
  
  // 参赛球队
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  
  // 比分
  homeScore: int("homeScore").notNull().default(0),
  awayScore: int("awayScore").notNull().default(0),
  
  // 比赛时长（分钟）
  duration: int("duration").notNull().default(48), // 游客模式3分钟，注册模式48分钟
  
  // 详细数据 (JSON)
  homeStats: text("homeStats"), // JSON: 球队统计
  awayStats: text("awayStats"),
  playerStats: text("playerStats"), // JSON: 球员统计
  
  // MVP
  mvpPlayerId: int("mvpPlayerId"),
  
  // 比赛结果
  winner: mysqlEnum("winner", ["home", "away", "draw"]).notNull(),
  
  // 比赛回放数据 (JSON)
  replayData: text("replayData"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

/**
 * 设施表
 */
export const facilities = mysqlTable("facilities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // 设施类型
  facilityType: mysqlEnum("facilityType", [
    "training_court",      // 训练场
    "gym",                 // 健身房
    "medical_center",      // 医疗中心
    "fan_zone",            // 球迷区
    "sponsor_lounge",      // 赞助商休息室
  ]).notNull(),
  
  // 等级 (1-10)
  level: int("level").notNull().default(1),
  
  // 效果加成
  bonusType: varchar("bonusType", { length: 50 }).notNull(),
  bonusValue: float("bonusValue").notNull().default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = typeof facilities.$inferInsert;

/**
 * 赞助商表
 */
export const sponsors = mysqlTable("sponsors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // 赞助商信息
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: text("logoUrl"),
  
  // 合约
  contractValue: int("contractValue").notNull(), // 合约金额
  contractDuration: int("contractDuration").notNull(), // 合约期限（场次）
  remainingMatches: int("remainingMatches").notNull(), // 剩余场次
  
  // 要求
  minWinRate: float("minWinRate").notNull().default(0), // 最低胜率要求
  
  // 状态
  isActive: boolean("isActive").notNull().default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = typeof sponsors.$inferInsert;

/**
 * 联赛表
 */
export const leagues = mysqlTable("leagues", {
  id: int("id").autoincrement().primaryKey(),
  
  // 联赛信息
  name: varchar("name", { length: 100 }).notNull(),
  tier: mysqlEnum("tier", ["amateur", "professional", "world"]).notNull(),
  
  // 赛季
  season: int("season").notNull(),
  
  // 状态
  isActive: boolean("isActive").notNull().default(true),
  
  // 奖励 (JSON)
  rewards: text("rewards"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type League = typeof leagues.$inferSelect;
export type InsertLeague = typeof leagues.$inferInsert;

/**
 * 联赛排名表
 */
export const leagueStandings = mysqlTable("leagueStandings", {
  id: int("id").autoincrement().primaryKey(),
  leagueId: int("leagueId").notNull(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
  
  // 排名数据
  rank: int("rank").notNull(),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  pointsFor: int("pointsFor").notNull().default(0),
  pointsAgainst: int("pointsAgainst").notNull().default(0),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeagueStanding = typeof leagueStandings.$inferSelect;
export type InsertLeagueStanding = typeof leagueStandings.$inferInsert;



/**
 * NPC市场表 - 可购买的NPC列表
 */
export const npcMarketplace = mysqlTable("npcMarketplace", {
  id: int("id").autoincrement().primaryKey(),
  npcId: varchar("npcId", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["student", "teacher", "coach", "vendor", "celebrity"]).notNull(),
  basePrice: float("basePrice").notNull(),
  premiumPrice: float("premiumPrice"),
  defaultPersonality: text("defaultPersonality"),
  spriteSheet: text("spriteSheet").notNull(),
  previewImage: text("previewImage"),
  isAvailable: boolean("isAvailable").default(true),
  stockLimit: int("stockLimit"),
  soldCount: int("soldCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NpcMarketplace = typeof npcMarketplace.$inferSelect;
export type InsertNpcMarketplace = typeof npcMarketplace.$inferInsert;

/**
 * 用户拥有的NPC表
 */
export const userNpcs = mysqlTable("userNpcs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  npcMarketplaceId: int("npcMarketplaceId").notNull(),
  npcId: varchar("npcId", { length: 100 }).notNull(),
  customName: varchar("customName", { length: 100 }),
  isPremium: boolean("isPremium").default(false),
  aiConfig: text("aiConfig"), // JSON
  placement: text("placement"), // JSON
  interactionCount: int("interactionCount").default(0),
  lastInteractionAt: timestamp("lastInteractionAt"),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
  isActive: boolean("isActive").default(true),
});

export type UserNpc = typeof userNpcs.$inferSelect;
export type InsertUserNpc = typeof userNpcs.$inferInsert;

/**
 * 地图自定义对象表
 */
export const mapCustomObjects = mysqlTable("mapCustomObjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mapId: varchar("mapId", { length: 100 }).notNull(),
  objectType: varchar("objectType", { length: 50 }).notNull(),
  objectData: text("objectData").notNull(), // JSON
  isPurchased: boolean("isPurchased").default(false),
  purchasePrice: float("purchasePrice"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  isActive: boolean("isActive").default(true),
});

export type MapCustomObject = typeof mapCustomObjects.$inferSelect;
export type InsertMapCustomObject = typeof mapCustomObjects.$inferInsert;

