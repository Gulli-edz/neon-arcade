export type GameId =
  | "roulette" | "blackjack" | "slots" | "crash" | "coinflip" | "dice"
  | "plinko" | "wheel" | "higherlower" | "mines" | "keno" | "hilo"
  | "towers" | "memory" | "reaction" | "luckycards" | "numberguess" | "colormatch";

export type User = {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  level: number;
  xp: number;
  stats: {
    rounds: number; wins: number; losses: number; totalWagered: number;
    totalProfit: number; biggestWin: number; biggestLoss: number;
    winStreak: number; loseStreak: number; bestWinStreak: number;
    favoriteGame: string;
  };
  achievements: string[];
  daily: { day: number; claimedAt: string | null };
  recentGames: { gameId: GameId; playedAt: string }[];
};

export type LeaderboardRow = {
  rank: number; username: string; level: number; totalProfit: number;
  rounds: number; winrate: number; coins: number; achievements: number;
};

export type PlayResult = {
  ok: boolean;
  gameId: GameId;
  outcome: string;
  wager: number;
  payout: number;
  profit: number;
  balance: number;
  xp: number;
  level: number;
  xpGained: number;
  stats: User["stats"];
  achievements: string[];
  meta?: Record<string, unknown>;
};
