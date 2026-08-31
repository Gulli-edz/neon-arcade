import Database from "better-sqlite3";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import type { GameId } from "./types.js";

const dir = process.env.DB_DIR
  ? path.resolve(process.env.DB_DIR)
  : path.resolve("data");

fs.mkdirSync(dir, { recursive: true });

export const db = new Database(path.join(dir, "arcade.sqlite"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id TEXT PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL DEFAULT '',
 avatar TEXT NOT NULL,
 coins INTEGER NOT NULL DEFAULT 10000,
 level INTEGER NOT NULL DEFAULT 1,
 xp INTEGER NOT NULL DEFAULT 0,
 rounds INTEGER NOT NULL DEFAULT 0,
 wins INTEGER NOT NULL DEFAULT 0,
 losses INTEGER NOT NULL DEFAULT 0,
 total_wagered INTEGER NOT NULL DEFAULT 0,
 total_profit INTEGER NOT NULL DEFAULT 0,
 biggest_win INTEGER NOT NULL DEFAULT 0,
 biggest_loss INTEGER NOT NULL DEFAULT 0,
 win_streak INTEGER NOT NULL DEFAULT 0,
 lose_streak INTEGER NOT NULL DEFAULT 0,
 best_win_streak INTEGER NOT NULL DEFAULT 0,
 favorite_game TEXT NOT NULL DEFAULT 'Slots',
 daily_day INTEGER NOT NULL DEFAULT 1,
 daily_claimed_at TEXT
);

CREATE TABLE IF NOT EXISTS rounds(
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 game_id TEXT NOT NULL,
 wager INTEGER NOT NULL,
 payout INTEGER NOT NULL,
 profit INTEGER NOT NULL,
 outcome TEXT NOT NULL,
 played_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements(
 user_id TEXT NOT NULL,
 name TEXT NOT NULL,
 PRIMARY KEY(user_id,name)
);

CREATE INDEX IF NOT EXISTS idx_rounds_user ON rounds(user_id);
`);

export const achievementDefs = [
  "First Win",
  "10 Games Played",
  "100 Games Played",
  "Lucky Streak",
  "High Roller",
  "Jackpot",
  "10 Wins in a Row",
  "Millionaire",
  "Roulette Master",
  "Blackjack Master",
  "Slot Master"
];

function hashPassword(password: string): string {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false;

  const [salt, originalHash] = stored.split(":");

  const hash = scryptSync(password, salt, 64).toString("hex");

  return timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(originalHash, "hex")
  );
}

export function getUser(id: string) {
  const u = db.prepare("SELECT * FROM users WHERE id=?").get(id) as any;

  if (!u) return null;

  const ach = (
    db
      .prepare(
        "SELECT name FROM achievements WHERE user_id=? ORDER BY name"
      )
      .all(id) as any[]
  ).map(x => x.name);

  const recent = (
    db
      .prepare(
        "SELECT game_id as gameId, played_at as playedAt FROM rounds WHERE user_id=? ORDER BY played_at DESC LIMIT 8"
      )
      .all(id) as any[]
  );

  return {
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    coins: u.coins,
    level: u.level,
    xp: u.xp,
    stats: {
      rounds: u.rounds,
      wins: u.wins,
      losses: u.losses,
      totalWagered: u.total_wagered,
      totalProfit: u.total_profit,
      biggestWin: u.biggest_win,
      biggestLoss: u.biggest_loss,
      winStreak: u.win_streak,
      loseStreak: u.lose_streak,
      bestWinStreak: u.best_win_streak,
      favoriteGame: u.favorite_game
    },
    achievements: ach,
    daily: {
      day: u.daily_day,
      claimedAt: u.daily_claimed_at
    },
    recentGames: recent
  };
}

export function createUser(username: string, password: string) {
  const existing = db
    .prepare("SELECT id FROM users WHERE lower(username)=lower(?)")
    .get(username) as any;

  if (existing) {
    throw new Error("Username already exists");
  }

  const id = randomUUID();
  const avatar = username.trim()[0]?.toUpperCase() || "N";
  const passwordHash = hashPassword(password);

  db.prepare(
    "INSERT INTO users(id,username,password_hash,avatar) VALUES(?,?,?,?)"
  ).run(id, username.trim(), passwordHash, avatar);

  return getUser(id)!;
}

export function authenticateUser(username: string, password: string) {
  const u = db
    .prepare("SELECT * FROM users WHERE lower(username)=lower(?)")
    .get(username) as any;

  if (!u) return null;

  if (!verifyPassword(password, u.password_hash)) {
    return null;
  }

  return getUser(u.id);
}

export function recordRound(
  userId: string,
  gameId: GameId,
  wager: number,
  payout: number,
  profit: number,
  outcome: string
) {
  const u = db.prepare("SELECT * FROM users WHERE id=?").get(userId) as any;

  if (!u) throw new Error("User not found");

  const win = profit > 0;
  const xpGain = 10 + Math.min(40, Math.floor(wager / 250));

  const newXp = u.xp + xpGain;
  const newLevel = 1 + Math.floor(newXp / 100);

  const ws = win ? u.win_streak + 1 : 0;
  const ls = win ? 0 : u.lose_streak + 1;

  db.prepare(`
    UPDATE users SET
      coins=coins+?,
      rounds=rounds+1,
      wins=wins+?,
      losses=losses+?,
      total_wagered=total_wagered+?,
      total_profit=total_profit+?,
      biggest_win=?,
      biggest_loss=?,
      win_streak=?,
      lose_streak=?,
      best_win_streak=?,
      xp=?,
      level=?,
      favorite_game=?
    WHERE id=?
  `).run(
    profit,
    win ? 1 : 0,
    win ? 0 : 1,
    wager,
    profit,
    Math.max(u.biggest_win, profit),
    Math.max(
      u.biggest_loss,
      Math.abs(Math.min(0, profit))
    ),
    ws,
    ls,
    Math.max(u.best_win_streak, ws),
    newXp,
    newLevel,
    gameId,
    userId
  );

  db.prepare(
    "INSERT INTO rounds VALUES(?,?,?,?,?,?,?,?)"
  ).run(
    randomUUID(),
    userId,
    gameId,
    wager,
    payout,
    profit,
    outcome,
    new Date().toISOString()
  );

  const nu = db
    .prepare("SELECT * FROM users WHERE id=?")
    .get(userId) as any;

  const unlock = (
    name: string,
    condition: boolean
  ) => {
    if (condition) {
      db.prepare(
        "INSERT OR IGNORE INTO achievements(user_id,name) VALUES(?,?)"
      ).run(userId, name);
    }
  };

  unlock("First Win", nu.wins >= 1);
  unlock("10 Games Played", nu.rounds >= 10);
  unlock("100 Games Played", nu.rounds >= 100);
  unlock("Lucky Streak", nu.best_win_streak >= 5);
  unlock("High Roller", nu.total_wagered >= 10000);
  unlock("Jackpot", profit >= wager * 10);
  unlock("10 Wins in a Row", nu.best_win_streak >= 10);
  unlock("Millionaire", nu.coins >= 1000000);

  unlock(
    "Roulette Master",
    gameId === "roulette" &&
      (
        db
          .prepare(
            "SELECT COUNT(*) c FROM rounds WHERE user_id=? AND game_id='roulette'"
          )
          .get(userId) as any
      ).c >= 25
  );

  unlock(
    "Blackjack Master",
    gameId === "blackjack" &&
      (
        db
          .prepare(
            "SELECT COUNT(*) c FROM rounds WHERE user_id=? AND game_id='blackjack'"
          )
          .get(userId) as any
      ).c >= 25
  );

  unlock(
    "Slot Master",
    gameId === "slots" &&
      (
        db
          .prepare(
            "SELECT COUNT(*) c FROM rounds WHERE user_id=? AND game_id='slots'"
          )
          .get(userId) as any
      ).c >= 25
  );

  return getUser(userId)!;
}