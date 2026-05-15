import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

export default function Watchlist() {
  const { theme, watchlist } = useApp();
  const dark = theme==="dark";
  const [selected, setSelected] = useState(null);
  const bg   = dark?"#060606":"#f8f8f8";
  const text = dark?"white":"#111";
  const sub  = dark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.3)";

  return (
    <div style={{ minHeight:"100vh", background:bg, paddingTop:"64px" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:"32px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#e53e3e", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>🔖 Watch Later</div>
          <h1 style={{ fontSize:"40px", fontWeight:"900", color:text, lineHeight:1 }}>
            Watchlist <span style={{ fontSize:"20px", fontWeight:"400", color:"#e53e3e" }}>({watchlist.length})</span>
          </h1>
        </div>

        {watchlist.length===0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>🔖</div>
            <p style={{ fontSize:"18px", fontWeight:"700", color:sub, marginBottom:"8px" }}>Watchlist is empty</p>
            <p style={{ fontSize:"14px", color:dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)", marginBottom:"24px" }}>Add movies to watch later</p>
            <Link to="/" style={{ padding:"12px 28px", borderRadius:"12px", background:"linear-gradient(135deg,#7f0000,#e53e3e)", color:"white", textDecoration:"none", fontSize:"14px", fontWeight:"700" }}>
              Browse Movies →
            </Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"18px" }}>
            {watchlist.map(m=><MovieCard key={m.id} movie={m} onClick={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <MovieModal movie={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}