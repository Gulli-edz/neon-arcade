import { useEffect,useState } from "react";
import { api } from "../services/api";
import type { LeaderboardRow } from "../types";
export default function Leaderboard(){
 const [type,setType]=useState("all"); const [rows,setRows]=useState<LeaderboardRow[]>([]);
 useEffect(()=>{api.leaderboard(type).then(setRows).catch(()=>{})},[type]);
 return <div><div className="page-title"><div><p className="eyebrow">GLOBAL ARCADE</p><h1>Leaderboard</h1><p>Competitive scores only — Coins have no real-world value.</p></div></div>
 <div className="tabs">{["all","weekly","daily","wins","balance","streak"].map(t=><button className={type===t?"tab active":"tab"} key={t} onClick={()=>setType(t)}>{t==="all"?"All Time":t==="wins"?"Most Wins":t==="balance"?"Highest Balance":t==="streak"?"Win Streak":t[0].toUpperCase()+t.slice(1)}</button>)}</div>
 <div className="podium">{rows.slice(0,3).map((r,i)=><div className={`podium-card p${i+1}`} key={r.username}><div className="crown">{i===0?"♛":i===1?"②":"③"}</div><div className="avatar lg">{r.username[0]}</div><h2>{r.username}</h2><span>LVL {r.level}</span><strong>{r.totalProfit>=0?"+":""}{r.totalProfit.toLocaleString()} profit</strong></div>)}</div>
 <div className="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>Level</th><th>Profit</th><th>Games</th><th>Winrate</th><th>Coins</th><th>Achievements</th></tr></thead><tbody>{rows.map(r=><tr key={r.username}><td>{r.rank}</td><td><span className="avatar sm">{r.username[0]}</span> {r.username}</td><td>{r.level}</td><td className="positive">+{r.totalProfit.toLocaleString()}</td><td>{r.rounds}</td><td>{r.winrate}%</td><td>◈ {r.coins.toLocaleString()}</td><td>{r.achievements}</td></tr>)}</tbody></table></div>
 </div>
}
