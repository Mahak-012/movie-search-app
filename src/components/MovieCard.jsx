import { useState } from "react";
import { useApp } from "../context/AppContext";

const IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, onClick }) {
  const { theme, toggleFavorite, isFavorite, toggleWatchlist, isWatchlist, setRating, getRating } = useApp();
  const dark   = theme === "dark";
  const fav    = isFavorite(movie.id);
  const wl     = isWatchlist(movie.id);
  const myRate = getRating(movie.id);
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr]   = useState(false);

  const rating      = movie.vote_average?.toFixed(1);
  const year        = movie.release_date?.split("-")[0];
  const ratingColor = rating>=7?"#4ade80":rating>=5?"#60a5fa":"#f87171";

  const cardBg = dark ? "#0e0e0e" : "#ffffff";
  const border  = hovered ? "1px solid rgba(229,62,62,0.6)" : dark ? "1px solid rgba(229,62,62,0.1)" : "1px solid rgba(229,62,62,0.15)";

  return (
    <div
      className="fade-in"
      style={{
        background: cardBg, border, borderRadius:"16px", overflow:"hidden",
        cursor:"pointer", transition:"all 0.35s ease",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "none",
        boxShadow: hovered ? "0 24px 60px rgba(229,62,62,0.25), 0 0 0 1px rgba(229,62,62,0.3)" : dark?"0 4px 20px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={()=>onClick(movie)}
    >
      {/* Poster */}
      <div style={{ position:"relative", aspectRatio:"2/3", overflow:"hidden" }}>
        {!imgErr && movie.poster_path ? (
          <img src={`${IMG}${movie.poster_path}`} alt={movie.title}
            style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s", transform:hovered?"scale(1.08)":"scale(1)" }}
            onError={()=>setImgErr(true)} />
        ) : (
          <div style={{ width:"100%", height:"100%", background:dark?"#1a1a1a":"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"40px" }}>🎬</div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position:"absolute", inset:0,
          background: hovered
            ? "linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.4) 50%,transparent 100%)"
            : "linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%)",
          transition:"all 0.3s",
        }} />

        {/* Red glow on hover */}
        {hovered && <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center bottom,rgba(229,62,62,0.15),transparent 70%)" }} />}

        {/* Rating */}
        <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", alignItems:"center", gap:"4px", padding:"4px 8px", borderRadius:"8px", background:"rgba(0,0,0,0.8)", fontSize:"12px", fontWeight:"800", color:ratingColor }}>
          ⭐ {rating}
        </div>

        {/* Favorite */}
        <button onClick={e=>{e.stopPropagation();toggleFavorite(movie);}}
          style={{
            position:"absolute", top:"10px", right:"10px", width:"32px", height:"32px",
            borderRadius:"10px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px",
            background: fav ? "rgba(229,62,62,0.9)" : "rgba(0,0,0,0.65)",
            transform: hovered||fav ? "scale(1)" : "scale(0.8)",
            opacity: hovered||fav ? 1 : 0,
            transition:"all 0.3s",
          }}>
          {fav?"❤️":"🤍"}
        </button>

        {/* Watchlist */}
        <button onClick={e=>{e.stopPropagation();toggleWatchlist(movie);}}
          style={{
            position:"absolute", top:"48px", right:"10px", width:"32px", height:"32px",
            borderRadius:"10px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px",
            background: wl ? "rgba(229,62,62,0.9)" : "rgba(0,0,0,0.65)",
            transform: hovered||wl ? "scale(1)" : "scale(0.8)",
            opacity: hovered||wl ? 1 : 0,
            transition:"all 0.3s",
          }}>
          {wl?"🔖":"➕"}
        </button>

        {/* Year */}
        {year && (
          <div style={{ position:"absolute", bottom:"10px", left:"10px", fontSize:"10px", fontWeight:"700", padding:"3px 8px", borderRadius:"6px", background:"rgba(229,62,62,0.85)", color:"white", fontFamily:"sans-serif" }}>
            {year}
          </div>
        )}

        {/* Play button on hover */}
        {hovered && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(229,62,62,0.85)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", boxShadow:"0 0 30px rgba(229,62,62,0.6)", transition:"all 0.3s" }}>▶</div>
          </div>
        )}

        {/* My rating stars */}
        {hovered && (
          <div onClick={e=>e.stopPropagation()}
            style={{ position:"absolute", bottom:"10px", right:"10px", display:"flex", gap:"2px" }}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} onClick={e=>{e.stopPropagation();setRating(movie.id,s);}}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:"14px", color:s<=myRate?"#e53e3e":"rgba(255,255,255,0.4)", padding:"0", lineHeight:1 }}>
                ★
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"14px" }}>
        <h3 style={{ fontSize:"14px", fontWeight:"700", color:dark?"white":"#111", marginBottom:"4px", lineHeight:1.3, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
          {movie.title||movie.name}
        </h3>
        <p style={{ fontSize:"12px", color:dark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.45)", lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {movie.overview||"No description available."}
        </p>
        {myRate > 0 && (
          <div style={{ marginTop:"8px", display:"flex", gap:"2px" }}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} style={{ fontSize:"12px", color:s<=myRate?"#e53e3e":"rgba(150,150,150,0.3)" }}>★</span>
            ))}
            <span style={{ fontSize:"11px", color:"#e53e3e", marginLeft:"4px" }}>My Rating</span>
          </div>
        )}
      </div>
    </div>
  );
}