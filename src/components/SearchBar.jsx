import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

const KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p/w92";

const BLOCKED = ["erotic","adult","nude","naked","porn","xxx","explicit"];
const BLOCKED_GENRES = [10749,27];

function isClean(m) {
  if (m.adult) return false;
  const t=(m.title||"").toLowerCase(), o=(m.overview||"").toLowerCase();
  if (BLOCKED.some(k=>t.includes(k)||o.includes(k))) return false;
  if (m.genre_ids?.some(id=>BLOCKED_GENRES.includes(id))) return false;
  return true;
}

export default function SearchBar({ onSearch }) {
  const { theme } = useApp();
  const dark = theme==="dark";
  const [q,setQ]             = useState("");
  const [focused,setFocused] = useState(false);
  const [sugg,setSugg]       = useState([]);
  const [loading,setLoading] = useState(false);
  const timer = useRef(null);

  const border  = focused ? "1.5px solid rgba(229,62,62,0.7)" : dark?"1.5px solid rgba(229,62,62,0.2)":"1.5px solid rgba(229,62,62,0.2)";
  const bg      = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const color   = dark ? "white" : "#111";

  const handleChange = (e) => {
    const val=e.target.value; setQ(val);
    clearTimeout(timer.current);
    if(val.trim().length<2){setSugg([]);return;}
    timer.current = setTimeout(async()=>{
      setLoading(true);
      try {
        const res=await fetch(`${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(val)}&include_adult=false`);
        const d=await res.json();
        setSugg((d.results||[]).filter(isClean).slice(0,6));
      } finally { setLoading(false); }
    },350);
  };

  const submit = (e) => { e.preventDefault(); if(q.trim()){onSearch(q.trim());setSugg([]);} };
  const pick   = (m)  => { setQ(m.title); setSugg([]); onSearch(m.title); };
  const clear  = ()   => { setQ(""); setSugg([]); onSearch(""); };

  return (
    <div style={{ position:"relative", maxWidth:"680px", margin:"0 auto" }}>
      <form onSubmit={submit}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 20px", borderRadius:"18px", background:bg, border, boxShadow:focused?"0 0 40px rgba(229,62,62,0.12)":"none", transition:"all 0.3s" }}>
          <span style={{ fontSize:"20px", flexShrink:0 }}>{loading?"⏳":"🔍"}</span>
          <input value={q} onChange={handleChange}
            onFocus={()=>setFocused(true)}
            onBlur={()=>setTimeout(()=>{setFocused(false);setSugg([]);},200)}
            placeholder="Search movies by title, genre, actor..."
            style={{ flex:1, minWidth:0, background:"transparent", border:"none", outline:"none", fontSize:"15px", fontWeight:"500", color, fontFamily:"inherit" }} />
          {q && <button type="button" onClick={clear} style={{ fontSize:"14px", color:dark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)", background:"none", border:"none", cursor:"pointer", flexShrink:0 }}>✕</button>}
          <button type="submit"
            style={{ padding:"10px 24px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"800", color:"white", letterSpacing:"0.05em", background:"linear-gradient(135deg,#7f0000,#e53e3e)", boxShadow:"0 4px 20px rgba(229,62,62,0.4)", whiteSpace:"nowrap", fontFamily:"inherit", flexShrink:0 }}>
            SEARCH
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {sugg.length>0 && focused && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, borderRadius:"16px", overflow:"hidden", zIndex:50, background:dark?"#0d0d0d":"#fff", border:"1px solid rgba(229,62,62,0.2)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
          {sugg.map(m=>(
            <button key={m.id} onClick={()=>pick(m)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"12px 16px", borderBottom:"1px solid rgba(229,62,62,0.06)", background:"transparent", cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"background 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(229,62,62,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:"36px", height:"52px", borderRadius:"8px", overflow:"hidden", flexShrink:0, background:dark?"#1a1a1a":"#f0f0f0" }}>
                {m.poster_path
                  ? <img src={`${IMG}${m.poster_path}`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>🎬</div>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"14px", fontWeight:"700", color:dark?"white":"#111" }}>{m.title}</div>
                <div style={{ fontSize:"12px", color:"#e53e3e" }}>{m.release_date?.split("-")[0]} · ⭐ {m.vote_average?.toFixed(1)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}