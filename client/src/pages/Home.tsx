import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Trophy, Flame, ArrowUpRight } from "lucide-react";
import { useSession } from "../hooks/useSession";
import StatCards from "../components/StatCards";
import GameCard, {games} from "../components/GameCard";
import type { User } from "../types";

export default function Home(){
 const {user}=useSession(); if(!user)return null; const s=user.stats;
 return <div>
  <div className="hero"><div><p className="eyebrow">WELCOME BACK, {user.username.toUpperCase()}</p><h1>Level up your <span>arcade run.</span></h1><p>Everything here is virtual. Build your score, collect XP, and climb the leaderboard.</p></div>
   <div className="hero-level"><div className="level-badge">LVL {user.level}</div><div className="xp-track"><div style={{width:`${user.xp%100}%`}}/></div><small>{user.xp%100}/100 XP</small></div>
  </div>
  <div className="balance-banner"><div><small>VIRTUAL BALANCE</small><strong>◈ {user.coins.toLocaleString()}</strong><span>Coins · zero monetary value</span></div><Link to="/bonus" className="secondary-btn"><Gift size={17}/> Claim daily</Link></div>
  <StatCards user={user}/>
  <section><div className="section-head"><div><p className="eyebrow">FEATURED</p><h2>Games worth replaying</h2></div><Link to="/games">View all <ArrowUpRight size={16}/></Link></div><div className="game-grid">{games.slice(0,6).map(g=><GameCard key={g.id} game={g}/>)}</div></section>
  <div className="two-col">
   <section className="panel"><div className="section-head"><h2>Top Players</h2><Link to="/leaderboard">Leaderboard →</Link></div><TopList/></section>
   <section className="panel"><div className="section-head"><h2>Achievements</h2><Link to="/achievements">View all →</Link></div><div className="achievement-row">{user.achievements.slice(0,5).map(a=><div className="achievement-mini" key={a}><div>✦</div><span>{a}</span></div>)}</div></section>
  </div>
 </div>
}
function TopList(){const names=[["1","PixelWolf","48"],["2","NovaByte","42"],["3","OrbitAce","39"],["4","LumaFox","35"],["5","GhostGrid","31"]];return <div className="top-list">{names.map(([r,n,l])=><div key={r}><b className={`rank r${r}`}>{r}</b><span className="avatar sm">{n[0]}</span><strong>{n}</strong><span className="level-small">LVL {l}</span></div>)}</div>}
