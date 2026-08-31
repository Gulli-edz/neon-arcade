import { Navigate,Route,Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { SessionProvider,useSession } from "./hooks/useSession";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Bonus from "./pages/Bonus";
import Achievements from "./pages/Achievements";
import Statistics from "./pages/Statistics";
import GamePage from "./pages/GamePage";

function Private(){const {user,loading}=useSession();if(loading)return <div className="loading">Loading arcade…</div>;if(!user)return <Navigate to="/login" replace/>;return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:id" element={<GamePage/>}/><Route path="/leaderboard" element={<Leaderboard/>}/><Route path="/profile" element={<Profile/>}/><Route path="/bonus" element={<Bonus/>}/><Route path="/achievements" element={<Achievements/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout>}
export default function App(){return <SessionProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/*" element={<Private/>}/></Routes></SessionProvider>}
