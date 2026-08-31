import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { GameId } from "../types";

export const games: {id: GameId; name: string; category: string; description: string; icon: string; hot?: boolean}[] = [
  {id:"roulette",name:"Roulette",category:"Chance",description:"Spin the wheel and predict the result.",icon:"◉",hot:true},
  {id:"blackjack",name:"Blackjack",category:"Cards",description:"Beat the dealer without going over 21.",icon:"♠"},
  {id:"slots",name:"Neon Slots",category:"Arcade",description:"Spin three reels for virtual jackpots.",icon:"▥",hot:true},
  {id:"crash",name:"Crash",category:"Arcade",description:"Ride the multiplier and stop before the crash.",icon:"↗"},
  {id:"coinflip",name:"Coin Flip",category:"Chance",description:"Call heads or tails in a quick duel.",icon:"◐"},
  {id:"dice",name:"Dice",category:"Chance",description:"Pick high, low or a target number.",icon:"⚄"},
  {id:"plinko",name:"Plinko",category:"Arcade",description:"Drop a ball through the neon pegs.",icon:"⠿"},
  {id:"wheel",name:"Lucky Wheel",category:"Chance",description:"Spin a wheel of virtual prizes.",icon:"◌"},
  {id:"higherlower",name:"Higher / Lower",category:"Cards",description:"Guess whether the next card is higher.",icon:"⇅"},
  {id:"mines",name:"Mines",category:"Arcade",description:"Reveal safe tiles and avoid hidden mines.",icon:"✦"},
  {id:"keno",name:"Keno",category:"Chance",description:"Choose numbers and test your luck.",icon:"⑨"},
  {id:"hilo",name:"Hi-Lo",category:"Cards",description:"Predict the next card direction.",icon:"↕"},
  {id:"towers",name:"Towers",category:"Arcade",description:"Climb levels by finding the safe tile.",icon:"△"},
  {id:"memory",name:"Memory",category:"Skill",description:"Match pairs against the clock.",icon:"◫"},
  {id:"reaction",name:"Reaction",category:"Skill",description:"Hit the target as fast as possible.",icon:"⚡"},
  {id:"luckycards",name:"Lucky Cards",category:"Cards",description:"Draw a mystery card for a multiplier.",icon:"▱"},
  {id:"numberguess",name:"Number Guess",category:"Skill",description:"Find the hidden number in limited tries.",icon:"#"},
  {id:"colormatch",name:"Color Match",category:"Skill",description:"Predict the next neon color.",icon:"●"}
];

export default function GameCard({ game }: {game: typeof games[number]}) {
  return <motion.div whileHover={{y:-5}} className="game-card">
    {game.hot && <span className="hot-tag">HOT</span>}
    <div className="game-icon">{game.icon}</div>
    <div className="game-category">{game.category}</div>
    <h3>{game.name}</h3>
    <p>{game.description}</p>
    <Link to={`/games/${game.id}`} className="primary-btn">Play <span>→</span></Link>
  </motion.div>
}
