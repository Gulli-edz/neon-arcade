import { useEffect,useMemo,useState } from "react";
import { useParams,Link } from "react-router-dom";
import { motion,AnimatePresence } from "framer-motion";
import { games } from "../components/GameCard";
import { useSession } from "../hooks/useSession";
import { api } from "../services/api";
import type { GameId,PlayResult } from "../types";

const gameInfo=(id:GameId)=>games.find(g=>g.id===id)!;

export default function GamePage(){
 const {id}=useParams(); const gameId=id as GameId; const game=gameInfo(gameId); const {user,setUser}=useSession();
 const [wager,setWager]=useState(100); const [choice,setChoice]=useState<any>(); const [result,setResult]=useState<PlayResult|null>(null); const [busy,setBusy]=useState(false);
 useEffect(()=>{setResult(null);setChoice(undefined)},[gameId]);
 if(!user||!game)return <div>Game not found.</div>;
 const play=async()=>{setBusy(true);try{const r=await api.play(user.id,gameId,Math.max(1,Math.floor(wager)),choice);setResult(r);setUser({...user,coins:r.balance,xp:r.xp,level:r.level,stats:r.stats,achievements:r.achievements})}catch(e){setResult({ok:false,gameId,outcome:e instanceof Error?e.message:"Error",wager,payout:0,profit:0,balance:user.coins,xp:user.xp,level:user.level,xpGained:0,stats:user.stats,achievements:user.achievements})}finally{setBusy(false)}};
 return <div><Link to="/games" className="back">← All games</Link><div className="game-header"><div><p className="eyebrow">{game.category}</p><h1>{game.icon} {game.name}</h1><p>{game.description}</p></div><div className="game-balance">◈ {user.coins.toLocaleString()}<small>VIRTUAL COINS</small></div></div>
 <div className="play-layout"><div className="game-stage"><GameBoard id={gameId} wager={wager} choice={choice} setChoice={setChoice} result={result}/></div><div className="control-panel"><label>Virtual wager</label><div className="wager-input"><input type="number" min="1" max={user.coins} value={wager} onChange={e=>setWager(Number(e.target.value))}/><span>COINS</span></div><div className="quick-bets">{[25,100,500,1000].map(n=><button key={n} onClick={()=>setWager(Math.min(n,user.coins))}>+{n}</button>)}</div><button className="primary-btn play-btn" disabled={busy||user.coins<1} onClick={play}>{busy?"Resolving…":"Play Round"}</button><div className="rules-note">Server-validated random outcome. Coins are fictional and cannot be bought, withdrawn, transferred, or redeemed.</div></div></div>
 <AnimatePresence>{result&&result.ok&&<motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className={`result-toast ${result.profit>=0?"win":"loss"}`}><strong>{result.profit>=0?"WIN":"ROUND RESULT"}</strong><span>{result.outcome}</span><b>{result.profit>=0?"+":""}{result.profit.toLocaleString()} Coins</b><small>+{result.xpGained} XP</small></motion.div>}</AnimatePresence>
 </div>
}

function GameBoard({id,wager,choice,setChoice,result}:{id:GameId,wager:number,choice:any,setChoice:(v:any)=>void,result:PlayResult|null}){
 const generic = <div className="generic-board"><div className="big-game-symbol">{gameInfo(id).icon}</div><p>Choose an option, then play a server-resolved virtual round.</p><div className="choice-grid">{choices(id).map(c=><button className={choice===c?"choice selected":"choice"} key={String(c)} onClick={()=>setChoice(c)}>{String(c)}</button>)}</div></div>;
 if(id==="roulette")return <Roulette choice={choice} setChoice={setChoice} result={result}/>;
 if(id==="blackjack")return <Blackjack result={result}/>;
 if(id==="slots")return <Slots result={result}/>;
 if(id==="crash")return <Crash result={result}/>;
 if(id==="plinko")return <Plinko result={result}/>;
 if(id==="mines"||id==="towers"||id==="memory")return <GridGame id={id} result={result}/>;
 return generic;
}
function choices(id:GameId){if(id==="roulette")return ["red","black","odd","even",0,1,2,3,4,5,6,7,8,9,10,11,12];if(id==="coinflip")return["heads","tails"];if(id==="dice")return["low","high",1,2,3,4,5,6];if(id==="wheel")return["1x","2x","3x","5x","10x"];if(id==="higherlower"||id==="hilo")return["higher","lower"];if(id==="colormatch")return["cyan","violet","lime","amber"];return["A","B","C","D"];}

function Roulette({choice,setChoice,result}:any){return <div className="roulette-board"><motion.div animate={result?{rotate:360}: {}} transition={{duration:1.2}} className="roulette-wheel"><div className="wheel-center">0</div></motion.div><div className="choice-grid">{["red","black","odd","even",0,7,13,21,32].map(c=><button className={choice===c?"choice selected":"choice"} key={String(c)} onClick={()=>setChoice(c)}>{String(c)}</button>)}</div>{result&&<div className="round-meta">Landed on <b>{result.meta?.number as string ?? "—"}</b></div>}</div>}
function Blackjack({result}:any){return <div className="cards-board"><div className="felt-title">BLACKJACK TABLE</div><div className="cards-row"><div className="playing-card">?</div><div className="playing-card">?</div><span>VS</span><div className="playing-card">{result?.meta?.dealerCard ?? "♣K"}</div></div><p>{result?.outcome??"Hit or stand is simplified into one server-resolved arcade round."}</p></div>}
function Slots({result}:any){return <div className="slots-board"><div className="reels">{[0,1,2].map(i=><motion.div key={i} animate={result?{y:[-30,0,20,0]}:{}} transition={{duration:.55,delay:i*.08}} className="reel">{result?.meta?.symbols?.[i]??"✦"}</motion.div>)}</div><p>{result?.outcome??"Three reels. Match symbols for a virtual multiplier."}</p></div>}
function Crash({result}:any){const m=Number(result?.meta?.multiplier??1);return <div className="crash-board"><motion.div animate={{scale:[1,1.03,1]}} transition={{repeat:Infinity,duration:1.4}} className="multiplier">{result?`${m.toFixed(2)}x`:"1.00x"}</motion.div><div className="crash-curve"><svg viewBox="0 0 500 180" preserveAspectRatio="none"><path d="M0 170 C120 165 150 145 230 120 S360 55 500 10" fill="none" stroke="currentColor" strokeWidth="4"/></svg></div><p>{result?.outcome??"Ride the multiplier — this simulation resolves a virtual cash-out outcome automatically."}</p></div>}
function Plinko({result}:any){return <div className="plinko-board"><div className="peg-field">{Array.from({length:45},(_,i)=><span key={i} className="peg">•</span>)}</div>{result&&<motion.div initial={{top:0}} animate={{top:"78%"}} transition={{duration:.8}} className="plinko-ball">●</motion.div>}<div className="buckets">{["0.2x","0.5x","1x","2x","5x","2x","1x","0.5x","0.2x"].map(x=><span key={x}>{x}</span>)}</div></div>}
function GridGame({id,result}:any){const n=id==="memory"?12:16;return <div className="tile-board">{Array.from({length:n},(_,i)=><motion.div whileTap={{scale:.92}} className={`tile ${result&&i===Number(result.meta?.safeIndex)?"safe":""}`} key={i}>{result&&i===Number(result.meta?.safeIndex)?"✓":"?"}</motion.div>)}</div>}
