import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function Login(){
  const [name,setName]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const {login}=useSession(); const nav=useNavigate();
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(name.trim().length<3)return setError("Choose a username with at least 3 characters."); setBusy(true); try{await login(name.trim());nav("/")}catch(err){setError(err instanceof Error?err.message:"Could not start session.")}finally{setBusy(false)}};
  return <div className="login-page"><div className="login-orb"/><div className="login-card">
    <div className="brand big"><span className="brand-mark">N</span> NEON<span className="muted">ARCADE</span></div>
    <p className="eyebrow">VIRTUAL ARCADE</p><h1>Play for the score.<br/><span>Not for money.</span></h1>
    <p className="sub">A polished collection of casino-inspired arcade games using free Coins with absolutely no real-world value.</p>
    <form onSubmit={submit}><label>Username</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. NeonFox" maxLength={20}/>{error&&<div className="error">{error}</div>}<button className="primary-btn wide" disabled={busy}>{busy?"Starting…":"Enter Arcade →"}</button></form>
    <div className="safety-row"><span>✓ No payments</span><span>✓ No withdrawals</span><span>✓ No crypto</span></div>
  </div></div>
}
