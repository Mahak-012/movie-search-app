import { useState, useEffect } from "react";

export default function CinemaIntro({ onDone }) {
  const [phase, setPhase] = useState("curtain");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 800);
    const t2 = setTimeout(() => setPhase("open"), 2200);
    const t3 = setTimeout(() => onDone(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={{ background:"#000" }}>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 4px)",
        zIndex:10,
      }} />

      {/* Spotlight beams */}
      <div className="absolute" style={{
        top:0, left:"30%",
        width:"3px", height:"60vh",
        background:"linear-gradient(to bottom,rgba(229,62,62,0.6),transparent)",
        transformOrigin:"top center",
        animation:"spotlight 2s ease-in-out infinite",
        filter:"blur(8px)",
      }} />
      <div className="absolute" style={{
        top:0, left:"70%",
        width:"3px", height:"60vh",
        background:"linear-gradient(to bottom,rgba(229,62,62,0.6),transparent)",
        transformOrigin:"top center",
        animation:"spotlight 2s ease-in-out infinite reverse",
        filter:"blur(8px)",
      }} />

      {/* Film grain */}
      <div className="absolute inset-0" style={{
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        animation:"flicker 0.1s infinite",
        pointerEvents:"none", zIndex:5,
      }} />

      {/* Cinema seats silhouette */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-0" style={{ zIndex:6 }}>
        {Array.from({length:24}).map((_,i) => (
          <div key={i} style={{
            width:"28px", height:"40px",
            background:"#0a0a0a",
            borderRadius:"6px 6px 0 0",
            border:"1px solid rgba(229,62,62,0.1)",
            marginBottom:0,
          }} />
        ))}
      </div>

      {/* Curtains */}
      <div className="absolute inset-0" style={{ zIndex:8, display:"flex" }}>
        <div className="h-full" style={{
          width:"50%",
          background:"linear-gradient(to right,#8B0000,#6B0000)",
          animation: phase==="open" ? "curtainLeft 0.9s cubic-bezier(0.77,0,0.18,1) forwards" : "none",
          boxShadow:"inset -20px 0 40px rgba(0,0,0,0.5)",
        }}>
          {/* Curtain folds */}
          {[20,45,70].map(p=>(
            <div key={p} className="absolute h-full w-px" style={{left:`${p}%`,background:"rgba(0,0,0,0.3)"}} />
          ))}
        </div>
        <div className="h-full" style={{
          width:"50%",
          background:"linear-gradient(to left,#8B0000,#6B0000)",
          animation: phase==="open" ? "curtainRight 0.9s cubic-bezier(0.77,0,0.18,1) forwards" : "none",
          boxShadow:"inset 20px 0 40px rgba(0,0,0,0.5)",
        }}>
          {[30,55,80].map(p=>(
            <div key={p} className="absolute h-full w-px" style={{left:`${p}%`,background:"rgba(0,0,0,0.3)"}} />
          ))}
        </div>
      </div>

      {/* Logo */}
      {(phase==="logo"||phase==="open") && (
        <div className="absolute inset-0 flex items-center justify-center" style={{zIndex:9}}>
          <div style={{ textAlign:"center", animation:"logoReveal 0.8s ease forwards" }}>
            <div style={{
              fontSize:"72px", fontWeight:"900",
              background:"linear-gradient(135deg,#e53e3e,#ff6b6b,#fff,#ff6b6b,#e53e3e)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"shimmer 2s linear infinite",
              letterSpacing:"-2px",
              fontFamily:"Georgia,serif",
              textShadow:"none",
            }}>
              CineVault
            </div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", letterSpacing:"6px", marginTop:"8px", fontFamily:"sans-serif" }}>
              YOUR CINEMA UNIVERSE
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:"4px", marginTop:"16px" }}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background: i%2===0?"#e53e3e":"#444", animation:`float ${1+i*0.15}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}