import express from "express";
import path from "node:path";
import cors from "cors";
import { z } from "zod";
import { createUser,getUser,recordRound,db } from "./db.js";
import { resolve } from "./gameEngine.js";
import type { GameId } from "./types.js";

const app=express();app.use(cors());app.use(express.json());
const port=Number(process.env.PORT || 4000);
const validGames=new Set<GameId>(["roulette","blackjack","slots","crash","coinflip","dice","plinko","wheel","higherlower","mines","keno","hilo","towers","memory","reaction","luckycards","numberguess","colormatch"]);

app.post("/api/auth/demo",(req,res)=>{const p=z.object({username:z.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_ -]+$/)}).safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid username"});res.json(createUser(p.data.username));});
app.get("/api/users/:id",(req,res)=>{const u=getUser(req.params.id);if(!u)return res.status(404).json({error:"User not found"});res.json(u);});
app.post("/api/games/play",(req,res)=>{
 const p=z.object({userId:z.string().uuid(),gameId:z.string(),wager:z.number().int().min(1).max(1_000_000),choice:z.any().optional()}).safeParse(req.body);
 if(!p.success||!validGames.has(p.data.gameId as GameId))return res.status(400).json({error:"Invalid game request"});
 const u=getUser(p.data.userId);if(!u)return res.status(404).json({error:"User not found"});
 if(p.data.wager>u.coins)return res.status(400).json({error:"Not enough virtual Coins"});
 const r=resolve(p.data.gameId as GameId,p.data.wager,p.data.choice);
 const updated=recordRound(u.id,p.data.gameId as GameId,p.data.wager,r.payout,r.profit,r.outcome);
 res.json({ok:true,gameId:p.data.gameId,outcome:r.outcome,wager:p.data.wager,payout:r.payout,profit:r.profit,balance:updated.coins,xp:updated.xp,level:updated.level,xpGained:updated.xp-u.xp,stats:updated.stats,achievements:updated.achievements,meta:r.meta});
});
app.post("/api/bonus/daily/:id",(req,res)=>{
 const u=getUser(req.params.id);if(!u)return res.status(404).json({error:"User not found"});
 const today=new Date().toDateString();if(u.daily.claimedAt&&new Date(u.daily.claimedAt).toDateString()===today)return res.status(400).json({error:"Daily bonus already claimed"});
 const rewards=[500,750,1000,1500,2000,3000,5000];const amount=rewards[u.daily.day-1]??500;
 const nextDay=u.daily.day===7?1:u.daily.day+1;
 db.prepare("UPDATE users SET coins=coins+?,daily_day=?,daily_claimed_at=? WHERE id=?").run(amount,nextDay,new Date().toISOString(),u.id);
 res.json(getUser(u.id));
});
app.get("/api/leaderboard",(req,res)=>{
 const type=String(req.query.type||"all");
 let order="total_profit DESC";
 if(type==="wins")order="wins DESC"; if(type==="balance")order="coins DESC";if(type==="streak")order="best_win_streak DESC";
 if(type==="daily")order="wins DESC"; if(type==="weekly")order="total_profit DESC";
 const rows=db.prepare(`SELECT username,level,total_profit as totalProfit,rounds,coins,wins,best_win_streak FROM users ORDER BY ${order} LIMIT 50`).all() as any[];
 res.json(rows.map((r,i)=>({rank:i+1,username:r.username,level:r.level,totalProfit:r.totalProfit,rounds:r.rounds,winrate:r.rounds?Math.round(r.wins/r.rounds*100):0,coins:r.coins,achievements:(db.prepare("SELECT COUNT(*) c FROM achievements WHERE user_id=(SELECT id FROM users WHERE username=?)").get(r.username) as any).c})));
});
app.get("/api/health",(_,res)=>res.json({ok:true,virtualOnly:true}));

// Production: serve the built React app from the same server.
const clientDist = path.resolve(process.cwd(), "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.use((req,res,next)=>{
  if(req.method==="GET" && !req.path.startsWith("/api")){
    return res.sendFile(path.join(clientDist,"index.html"));
  }
  next();
});

app.listen(port,"0.0.0.0",()=>console.log(`Neon Arcade running on port ${port}`));
