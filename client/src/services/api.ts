import type { GameId, LeaderboardRow, PlayResult, User } from "../types";

const API = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Request failed");
  }

  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  user: (id: string) =>
    request<User>(`/users/${id}`),

  play: (
    userId: string,
    gameId: GameId,
    wager: number,
    choice?: unknown
  ) =>
    request<PlayResult>("/games/play", {
      method: "POST",
      body: JSON.stringify({
        userId,
        gameId,
        wager,
        choice
      })
    }),

  daily: (userId: string) =>
    request<User>(`/bonus/daily/${userId}`, {
      method: "POST"
    }),

  leaderboard: (type = "all") =>
    request<LeaderboardRow[]>(`/leaderboard?type=${type}`)
};

