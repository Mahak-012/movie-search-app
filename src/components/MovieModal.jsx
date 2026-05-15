import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

const IMG_BIG = "https://image.tmdb.org/t/p/w1280";
const IMG_SM  = "https://image.tmdb.org/t/p/w500";
const KEY     = import.meta.env.VITE_TMDB_API_KEY;
const BASE    = "https://api.themoviedb.org/3";

export default function MovieModal({ movie, onClose }) {
  const { theme, toggleFavorite, isFavorite, toggleWatchlist, isWatchlist, setRating, getRating } = useApp();
  const dark   = theme === "dark";
  const fav    = isFavorite(movie.id);
  const wl     = isWatchlist(movie.id);
  const myRate = getRating(movie.id);

  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast,    setCast]    = useState([]);
  const [similar, setSimilar] = useState([]);
  const [tab,     setTab]     = useState("about");

  useEffect(()=>{
    document.body.style.overflow="hidden";
    Promise.all([
      fetch(`${BASE}/movie/${movie.id}?api_key=${KEY}`).then(r=>r.json()),
      fetch(`${BASE}/movie/${movie.id}/videos?api_key=${KEY}`).then(r=>r.json()),
      fetch(`${BASE}/movie/${movie.id}/credits?api_key=${KEY}`).then(r=>r.json()),
      fetch(`${BASE}/movie/${movie.id}/similar?api_key=${KEY}&include_adult=false`).then(r=>r.json()),
    ]).then(([det,vid,cred,sim])=>{
      setDetails(det);
      setTrailer(vid.results?.find(v=>v.type==="Trailer"&&v.site==="YouTube"));
      setCast(cred.cast?.slice(0,8)||[]);
      setSimilar((sim.results||[]).filter(m=>!m.adult).slice(0,4));
    });
    return ()=>{ document.body.style.overflow=""; };
  },[movie.id]);

  const rating      = movie.vote_average?.toFixed(1);
  const ratingColor = rating>=7?"#4ade80":rating>=5?"#60a5fa":"#f87171";
  const modalBg     = dark ? "#0a0a0a" : "#ffffff";
  const textColor   = dark ? "white" : "#111";
  const subColor    = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const cardBg      = dark ? "rgba(229,62,62,0.06)" : "rgba(229,62,62,0.04)";
  const border      = "rgba(229,62,62,0.15)";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", background:"rgba(0,0,0,0.9)", backdropFilter:"blur(16px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>

      <div style={{ position:"relative", width:"100%", maxWidth:"900px", maxHeight:"90vh", overflowY:"auto", borderRadius:"20px", background:modalBg, border:`1px solid ${border}`, boxShadow:"0 40px 100px rgba(229,62,62,0.2), 0 0 0 1px rgba(229,62,62,0.1)" }}
        onClick={e=>e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose}
          style={{ position:"absolute", top:"16px", right:"16px", zIndex:10, width:"40px", height:"40px", borderRadius:"12px", border:"none", cursor:"pointer", background:"rgba(0,0,0,0.7)", color:"white", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          ✕
        </button>

        {/* Backdrop */}
        <div style={{ position:"relative", height:"260px", borderRadius:"20px 20px 0 0", overflow:"hidden" }}>
          {movie.backdrop_path
            ? <img src={`${IMG_BIG}${movie.backdrop_path}`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.4)" }} />
            : <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#1a0000,#3d0000)" }} />}
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top,${modalBg} 0%,transparent 50%)` }} />
          {/* Red glow */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,rgba(229,62,62,0.08),transparent 70%)" }} />

          {/* Action buttons */}
          <div style={{ position:"absolute", top:"16px", left:"16px", display:"flex", gap:"8px" }}>
            <button onClick={()=>toggleFavorite(movie)}
              style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"700", background:fav?"rgba(229,62,62,0.9)":"rgba(0,0,0,0.7)", color:"white" }}>
              {fav?"❤️ Saved":"🤍 Save"}
            </button>
            <button onClick={()=>toggleWatchlist(movie)}
              style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"700", background:wl?"rgba(229,62,62,0.9)":"rgba(0,0,0,0.7)", color:"white" }}>
              {wl?"🔖 Listed":"➕ Watchlist"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:"0 24px 28px", marginTop:"-60px", position:"relative" }}>
          <div style={{ display:"flex", gap:"20px", marginBottom:"20px" }}>
            <div style={{ width:"100px", height:"148px", flexShrink:0, borderRadius:"12px", overflow:"hidden", border:`2px solid ${border}` }}>
              {movie.poster_path
                ? <img src={`${IMG_SM}${movie.poster_path}`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ width:"100%", height:"100%", background:dark?"#1a1a1a":"#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px" }}>🎬</div>}
            </div>
            <div style={{ flex:1, paddingTop:"60px" }}>
              <h2 style={{ fontSize:"24px", fontWeight:"900", color:textColor, marginBottom:"10px", lineHeight:1.2 }}>{movie.title}</h2>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                <span style={{ fontSize:"13px", fontWeight:"800", padding:"4px 10px", borderRadius:"8px", background:"rgba(229,62,62,0.15)", color:ratingColor }}>⭐ {rating}</span>
                {details?.runtime && <span style={{ fontSize:"12px", padding:"4px 10px", borderRadius:"8px", background:cardBg, color:subColor }}>⏱ {Math.floor(details.runtime/60)}h {details.runtime%60}m</span>}
                <span style={{ fontSize:"12px", padding:"4px 10px", borderRadius:"8px", background:cardBg, color:subColor }}>📅 {movie.release_date?.split("-")[0]}</span>
                {details?.genres?.slice(0,3).map(g=>(
                  <span key={g.id} style={{ fontSize:"12px", padding:"4px 10px", borderRadius:"8px", background:"rgba(229,62,62,0.08)", color:"#ff6b6b", border:`1px solid ${border}` }}>{g.name}</span>
                ))}
              </div>

              {/* My rating */}
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"12px" }}>
                <span style={{ fontSize:"12px", color:subColor }}>Your rating:</span>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setRating(movie.id,s)}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:s<=myRate?"#e53e3e":"rgba(150,150,150,0.3)", padding:"0", transition:"transform 0.1s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:"4px", padding:"4px", borderRadius:"12px", background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)", width:"fit-content", marginBottom:"20px" }}>
            {["about","cast","trailer","similar"].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ padding:"8px 18px", borderRadius:"10px", fontSize:"12px", fontWeight:"700", textTransform:"capitalize", cursor:"pointer", border:"none", transition:"all 0.2s",
                  background: tab===t ? "linear-gradient(135deg,#7f0000,#e53e3e)" : "transparent",
                  color: tab===t ? "white" : subColor,
                  boxShadow: tab===t ? "0 4px 16px rgba(229,62,62,0.4)" : "none",
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* About */}
          {tab==="about" && (
            <div>
              <p style={{ fontSize:"14px", lineHeight:1.8, color:subColor, marginBottom:"16px" }}>{movie.overview||"No description."}</p>
              {details && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
                  {[{l:"Status",v:details.status},{l:"Budget",v:details.budget?`$${(details.budget/1e6).toFixed(1)}M`:"N/A"},{l:"Revenue",v:details.revenue?`$${(details.revenue/1e6).toFixed(1)}M`:"N/A"},{l:"Votes",v:details.vote_count?.toLocaleString()}].map(({l,v})=>(
                    <div key={l} style={{ padding:"12px 16px", borderRadius:"12px", background:cardBg, border:`1px solid ${border}` }}>
                      <div style={{ fontSize:"10px", color:"#e53e3e", marginBottom:"4px", fontWeight:"700", letterSpacing:"0.05em" }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize:"14px", fontWeight:"700", color:textColor }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cast */}
          {tab==="cast" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
              {cast.length>0 ? cast.map(c=>(
                <div key={c.id} style={{ textAlign:"center" }}>
                  <div style={{ width:"100%", aspectRatio:"1/1", borderRadius:"12px", overflow:"hidden", background:dark?"#1a1a1a":"#e8eeff", marginBottom:"8px" }}>
                    {c.profile_path
                      ? <img src={`https://image.tmdb.org/t/p/w185${c.profile_path}`} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>👤</div>}
                  </div>
                  <div style={{ fontSize:"12px", fontWeight:"700", color:textColor, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize:"11px", color:"#e53e3e", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{c.character}</div>
                </div>
              )) : <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"32px", color:subColor }}>No cast info</div>}
            </div>
          )}

          {/* Trailer */}
          {tab==="trailer" && (
            trailer
              ? <div style={{ borderRadius:"16px", overflow:"hidden", aspectRatio:"16/9" }}>
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailer.key}`} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen title="Trailer" />
                </div>
              : <div style={{ textAlign:"center", padding:"48px", color:subColor }}>
                  <div style={{ fontSize:"40px", marginBottom:"12px" }}>🎬</div>
                  <p>No trailer available</p>
                </div>
          )}

          {/* Similar */}
          {tab==="similar" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
              {similar.length>0 ? similar.map(m=>(
                <div key={m.id} style={{ borderRadius:"12px", overflow:"hidden", border:`1px solid ${border}`, cursor:"pointer", transition:"transform 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                  {m.poster_path
                    ? <img src={`${IMG_SM}${m.poster_path}`} alt={m.title} style={{ width:"100%", aspectRatio:"2/3", objectFit:"cover" }} />
                    : <div style={{ width:"100%", aspectRatio:"2/3", background:dark?"#1a1a1a":"#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>🎬</div>}
                  <div style={{ padding:"8px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:textColor, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{m.title}</div>
                  </div>
                </div>
              )) : <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"32px", color:subColor }}>No similar movies</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}