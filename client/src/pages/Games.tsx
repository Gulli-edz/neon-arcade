import { useMemo, useState } from "react";
import GameCard, {games} from "../components/GameCard";
export default function Games(){
 const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
 const cats=["All",...Array.from(new Set(games.map(g=>g.category)))];
 const filtered=useMemo(()=>games.filter(g=>(cat==="All"||g.category===cat)&&(g.name+g.description).toLowerCase().includes(q.toLowerCase())),[q,cat]);
 return <div><div className="page-title"><div><p className="eyebrow">ARCADE LIBRARY</p><h1>All Games</h1><p>18 playable virtual-coin experiences. No real-money mechanics.</p></div></div>
 <div className="filters"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search games…"/><div className="chips">{cats.map(c=><button key={c} className={cat===c?"chip active":"chip"} onClick={()=>setCat(c)}>{c}</button>)}</div></div>
 <div className="game-grid">{filtered.map(g=><GameCard key={g.id} game={g}/>)}</div></div>
}
