import type { GameId } from "./types.js";

const rand=(n:number)=>Math.floor(Math.random()*n);
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));

export function resolve(gameId:GameId,wager:number,choice:any){
 let payout=0,outcome="",meta:Record<string,unknown>={};
 const win=(mult:number,label:string)=>{payout=Math.floor(wager*mult);outcome=label};
 switch(gameId){
  case "roulette":{
   const n=rand(37), red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n);
   const c=String(choice);
   const ok=c==="red"?red:c==="black"?n>0&&!red:c==="odd"?n>0&&n%2===1:c==="even"?n>0&&n%2===0:Number(c)===n;
   const mult=!Number.isNaN(Number(c))?35:1.9;
   win(ok?mult:0,`Ball landed on ${n} — ${ok?"winning pick!":"not this time."}`);meta={number:n,color:n===0?"green":red?"red":"black"};break;
  }
  case "blackjack":{
   const player=rand(8)+14,dealer=rand(10)+12;
   if(player>21) win(0,`You drew ${player}. Bust.`);
   else if(dealer>21||player>dealer) win(2,`Player ${player} vs dealer ${dealer}. You win!`);
   else if(player===dealer) win(1,`Push at ${player}.`);
   else win(0,`Player ${player} vs dealer ${dealer}. Dealer wins.`);
   meta={player,dealer,dealerCard:dealer};break;
  }
  case "slots":{
   const syms=["✦","◆","●","7","★","◈"], a=[syms[rand(syms.length)],syms[rand(syms.length)],syms[rand(syms.length)]];
   const same=a[0]===a[1]&&a[1]===a[2], pair=a[0]===a[1]||a[1]===a[2]||a[0]===a[2];
   win(same?(a[0]==="7"?15:8):pair?2:0,same?`JACKPOT — ${a.join(" ")}!`:pair?`Pair — ${a.join(" ")}.`:`No match — ${a.join(" ")}.`);meta={symbols:a};break;
  }
  case "crash":{
   const m=Number((0.5+Math.pow(Math.random(),1.8)*9.5).toFixed(2)); const cash=Math.min(clamp(Number(choice)||1,1,m),10);
   win(cash<m?cash:0, cash<m?`You cashed out at ${cash.toFixed(2)}x.`:`Crash at ${m.toFixed(2)}x — too late.`);
   meta={multiplier:m,cashOut:cash};break;
  }
  case "coinflip":{
   const r=Math.random()<.5?"heads":"tails"; win(String(choice)===r?2:0,`It was ${r}. ${String(choice)===r?"Nice call!":"Wrong call."}`);meta={side:r};break;
  }
  case "dice":{
   const d=rand(6)+1,c=String(choice);const ok=c==="low"?d<=3:c==="high"?d>=4:Number(c)===d;const mult=(!Number.isNaN(Number(c))?5:1.9);
   win(ok?mult:0,`Rolled ${d}. ${ok?"Your pick hit.":"Your pick missed."}`);meta={roll:d};break;
  }
  case "plinko":{
   const buckets=[.2,.5,1,2,5,2,1,.5,.2], m=buckets[rand(buckets.length)];win(m,`Ball landed in the ${m}x bucket.`);meta={multiplier:m};break;
  }
  case "wheel":{
   const ms=[1,1,1.5,2,3,5,10],m=ms[rand(ms.length)];win(m,`Wheel stopped on ${m}x.`);meta={multiplier:m};break;
  }
  case "higherlower":
  case "hilo":{
   const next=rand(13)+1, c=String(choice);const current=rand(13)+1;const ok=c==="higher"?next>current:next<current;win(next===current?1:ok?1.9:0,`Cards: ${current} → ${next}. ${next===current?"Push.":ok?"Correct!":"Incorrect."}`);meta={current,next};break;
  }
  case "mines":{
   const safe=rand(16);win(Math.random()<.6?2.2:0,`You revealed a ${Math.random()<.6?"safe tile":"mine"}.`);meta={safeIndex:safe};break;
  }
  case "keno":{
   const hits=rand(7);const m=[0,0,0,1,2,5,15][hits];win(m,`${hits} numbers matched.`);meta={hits};break;
  }
  case "towers":{
   const safe=rand(4),ok=Math.random()<.7;win(ok?1.8:0,ok?`You found the safe tile on level ${safe+1}.`:`Trap! The tower ended on level ${safe+1}.`);meta={safeIndex:safe};break;
  }
  case "memory":{
   const ok=Math.random()<.65;win(ok?2:0,ok?"All pairs matched!":"Time's up — try again.");meta={};break;
  }
  case "reaction":{
   const ms=rand(500)+180;const m=ms<250?4:ms<400?2:0;win(m,`${ms}ms reaction time.`);meta={ms};break;
  }
  case "luckycards":{
   const m=[0,1,1.5,2,3,5,10][rand(7)];win(m,`Lucky card revealed ${m}x.`);meta={multiplier:m};break;
  }
  case "numberguess":{
   const target=rand(10)+1;const guess=Number(choice);const ok=guess===target;win(ok?5:0,ok?`You guessed ${target}!`:`The number was ${target}.`);meta={target};break;
  }
  case "colormatch":{
   const cs=["cyan","violet","lime","amber"],r=cs[rand(cs.length)];win(String(choice)===r?3:0,`The color was ${r}.`);meta={color:r};break;
  }
  default: throw new Error("Unsupported game");
 }
 return {payout,profit:payout-wager,outcome,meta};
}
