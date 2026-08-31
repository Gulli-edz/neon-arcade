import type { User } from "../types";
export default function StatCards({user}:{user:User}) {
  const s=user.stats;
  const cards=[["Rounds",s.rounds.toLocaleString()],["Win Rate",`${s.rounds ? Math.round(s.wins/s.rounds*100):0}%`],["Total Profit",`${s.totalProfit>=0?"+":""}${s.totalProfit.toLocaleString()}`],["Best Streak",String(s.bestWinStreak)]];
  return <div className="stat-grid">{cards.map(([a,b])=><div className="stat-card" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
}
