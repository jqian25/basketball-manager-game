import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  InsertPlayer, Player, players,
  InsertTeam, Team, teams,
  InsertMatch, Match, matches,
  InsertFacility, Facility, facilities,
  InsertSponsor, Sponsor, sponsors,
  InsertLeague, League, leagues,
  InsertLeagueStanding, LeagueStanding, leagueStandings
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ 用户操作 ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ 球员操作 ============

export async function createPlayer(player: InsertPlayer): Promise<Player | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(players).values(player);
  const insertId = Number(result[0].insertId);
  return getPlayerById(insertId);
}

export async function getPlayerById(id: number): Promise<Player | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPlayersByUserId(userId: number): Promise<Player[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(players).where(eq(players.userId, userId));
}

export async function updatePlayer(id: number, updates: Partial<Player>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(players).set(updates).where(eq(players.id, id));
}

export async function deletePlayer(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(players).where(eq(players.id, id));
}

// ============ 球队操作 ============

export async function createTeam(team: InsertTeam): Promise<Team | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(teams).values(team);
  const insertId = Number(result[0].insertId);
  return getTeamById(insertId);
}

export async function getTeamById(id: number): Promise<Team | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamsByUserId(userId: number): Promise<Team[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(teams).where(eq(teams.userId, userId));
}

export async function updateTeam(id: number, updates: Partial<Team>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(teams).set(updates).where(eq(teams.id, id));
}

// ============ 比赛操作 ============

export async function createMatch(match: InsertMatch): Promise<Match | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(matches).values(match);
  const insertId = Number(result[0].insertId);
  return getMatchById(insertId);
}

export async function getMatchById(id: number): Promise<Match | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMatchesByUserId(userId: number, limit: number = 20): Promise<Match[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(matches)
    .where(eq(matches.userId, userId))
    .orderBy(desc(matches.createdAt))
    .limit(limit);
}

// ============ 设施操作 ============

export async function createFacility(facility: InsertFacility): Promise<Facility | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(facilities).values(facility);
  const insertId = Number(result[0].insertId);
  return getFacilityById(insertId);
}

export async function getFacilityById(id: number): Promise<Facility | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(facilities).where(eq(facilities.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFacilitiesByUserId(userId: number): Promise<Facility[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(facilities).where(eq(facilities.userId, userId));
}

export async function upgradeFacility(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const facility = await getFacilityById(id);
  if (!facility || facility.level >= 10) return;

  await db.update(facilities).set({ 
    level: facility.level + 1,
    bonusValue: facility.bonusValue * 1.2 // 每级提升20%
  }).where(eq(facilities.id, id));
}

// ============ 赞助商操作 ============

export async function createSponsor(sponsor: InsertSponsor): Promise<Sponsor | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(sponsors).values(sponsor);
  const insertId = Number(result[0].insertId);
  return getSponsorById(insertId);
}

export async function getSponsorById(id: number): Promise<Sponsor | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(sponsors).where(eq(sponsors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveSponsorsByUserId(userId: number): Promise<Sponsor[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(sponsors)
    .where(and(eq(sponsors.userId, userId), eq(sponsors.isActive, true)));
}

export async function updateSponsorMatches(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const sponsor = await getSponsorById(id);
  if (!sponsor) return;

  const newRemaining = sponsor.remainingMatches - 1;
  
  await db.update(sponsors).set({
    remainingMatches: newRemaining,
    isActive: newRemaining > 0
  }).where(eq(sponsors.id, id));
}

// ============ 联赛操作 ============

export async function createLeague(league: InsertLeague): Promise<League | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(leagues).values(league);
  const insertId = Number(result[0].insertId);
  return getLeagueById(insertId);
}

export async function getLeagueById(id: number): Promise<League | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(leagues).where(eq(leagues.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveLeagues(): Promise<League[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leagues).where(eq(leagues.isActive, true));
}

// ============ 联赛排名操作 ============

export async function upsertLeagueStanding(standing: InsertLeagueStanding): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(leagueStandings).values(standing).onDuplicateKeyUpdate({
    set: {
      wins: standing.wins,
      losses: standing.losses,
      pointsFor: standing.pointsFor,
      pointsAgainst: standing.pointsAgainst,
      rank: standing.rank,
    }
  });
}

export async function getLeagueStandings(leagueId: number): Promise<LeagueStanding[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leagueStandings)
    .where(eq(leagueStandings.leagueId, leagueId))
    .orderBy(leagueStandings.rank);
}

