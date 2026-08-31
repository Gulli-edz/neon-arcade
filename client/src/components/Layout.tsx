import { Link, NavLink, useNavigate } from "react-router-dom";
import { Gamepad2, Trophy, UserRound, Gift, BarChart3, Home, Sparkles, LogOut } from "lucide-react";
import { useSession } from "../hooks/useSession";

const nav = [
  ["/", "Home", Home], ["/games", "Games", Gamepad2], ["/leaderboard", "Leaderboard", Trophy],
  ["/profile", "Profile", UserRound], ["/bonus", "Daily Bonus", Gift],
  ["/achievements", "Achievements", Sparkles], ["/statistics", "Statistics", BarChart3]
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useSession();
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem("neon-user"); setUser(null); navigate("/login"); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand"><span className="brand-mark">N</span><span>NEON<span className="muted">ARCADE</span></span></Link>
        <div className="virtual-pill">● VIRTUAL COINS ONLY · NO REAL VALUE</div>
        <div className="top-actions">
          <div className="coin-balance">◈ {user?.coins.toLocaleString()} <small>COINS</small></div>
          <button className="avatar" onClick={() => navigate("/profile")}>{user?.avatar}</button>
          <button className="icon-btn" onClick={logout} title="Log out"><LogOut size={18}/></button>
        </div>
      </header>
      <aside className="sidebar">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={18}/><span>{label}</span>
          </NavLink>
        ))}
      </aside>
      <main className="main-content">{children}</main>
      <div className="mobile-nav">
        {nav.slice(0,5).map(([to,label,Icon]) => <NavLink key={to} to={to} end={to==="/"}><Icon size={17}/><span>{label}</span></NavLink>)}
      </div>
    </div>
  );
}
