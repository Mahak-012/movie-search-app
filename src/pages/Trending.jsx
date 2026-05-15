import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Loader from "../components/Loader";

export default function Trending() {
  const { theme } = useApp();
  const dark = theme==="dark";
  const [period, setPeriod] = useState("week");
  const [selected, setSelected] = useState(null);
  const { data, loading } = useFetch(`/trending/movie/${period}`);
  const movies = (data?.results||[]).filter(m=>!m.adult);

  const bg   = dark?"#060606":"#f8f8f8";
  const text = dark?"white":"#111";
  const sub  = dark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)";

  return (
    <div style={{ minHeight:"100vh", background:bg, paddingTop:"64px" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"32px" }}>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"700", color:"#e53e3e", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>🔥 Trending Now</div>
            <h1 style={{ fontSize:"40px", fontWeight:"900", color:text, lineHeight:1 }}>What's Hot</h1>
          </div>
          <div style={{ display:"flex", gap:"4px", padding:"4px", borderRadius:"14px", background:dark?"rgba(229,62,62,0.08)":"rgba(229,62,62,0.06)" }}>
            {["day","week"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)}
                style={{ padding:"10px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:"800", cursor:"pointer", border:"none", fontFamily:"inherit", transition:"all 0.2s",
                  background:period===p?"linear-gradient(135deg,#7f0000,#e53e3e)":"transparent",
                  color:period===p?"white":sub,
                  boxShadow:period===p?"0 4px 16px rgba(229,62,62,0.4)":"none",
                }}>
                {p==="day"?"Today":"This Week"}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader /> : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"18px" }}>
            {movies.map(m=><MovieCard key={m.id} movie={m} onClick={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <MovieModal movie={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}