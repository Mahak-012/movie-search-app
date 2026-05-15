import { useState, useEffect, useCallback, useRef } from "react";
import { useApp, isClean } from "../context/AppContext";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Loader from "../components/Loader";

const KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export default function Home() {
  const { theme } = useApp();
  const dark = theme==="dark";

  const [movies,       setMovies]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [selected,     setSelected]     = useState(null);
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedGenre,setSelectedGenre]= useState("");
  const [sortBy,       setSortBy]       = useState("popularity.desc");
  const [language,     setLanguage]     = useState("");

  const bg   = dark ? "#060606" : "#f8f8f8";
  const text = dark ? "white"   : "#111";
  const sub  = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  const fetchMovies = useCallback(async(pg=1)=>{
    setLoading(true);
    try {
      let url;
      if(activeSearch){
        url=`${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(activeSearch)}&page=${pg}&include_adult=false`;
      } else {
        const p=new URLSearchParams({ api_key:KEY,page:pg,sort_by:sortBy,include_adult:false,"vote_count.gte":"80",without_genres:"10749,27",...(selectedGenre&&{with_genres:selectedGenre}),...(language&&{with_original_language:language}) });
        url=`${BASE}/discover/movie?${p}`;
      }
      const d=await fetch(url).then(r=>r.json());
      const clean=(d.results||[]).filter(isClean);
      setMovies(pg===1?clean:prev=>[...prev,...clean]);
      setTotalPages(d.total_pages||1);
    } finally { setLoading(false); }
  },[activeSearch,selectedGenre,sortBy,language]);

  useEffect(()=>{setPage(1);fetchMovies(1);},[fetchMovies]);

  const handleSearch=(q)=>{setActiveSearch(q);setPage(1);};
  const loadMore=()=>{const n=page+1;setPage(n);fetchMovies(n);};

  return (
    <div style={{ minHeight:"100vh", background:bg, paddingTop:"64px" }}>

      {/* Animated background */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {/* Film reel lines */}
        <div style={{ position:"absolute", top:0, left:"8%", width:"1px", height:"100%", background:"linear-gradient(to bottom,transparent,rgba(229,62,62,0.06),transparent)", animation:"float 8s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:0, right:"8%", width:"1px", height:"100%", background:"linear-gradient(to bottom,transparent,rgba(229,62,62,0.06),transparent)", animation:"float 6s ease-in-out infinite reverse" }} />
        {/* Ambient glow */}
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"600px", borderRadius:"50%", background:dark?"radial-gradient(circle,rgba(229,62,62,0.04),transparent 70%)":"radial-gradient(circle,rgba(229,62,62,0.03),transparent 70%)", pointerEvents:"none" }} />
        {/* Corner accents */}
        <div style={{ position:"absolute", top:80, left:0, width:"200px", height:"1px", background:"linear-gradient(to right,transparent,rgba(229,62,62,0.15),transparent)" }} />
        <div style={{ position:"absolute", top:80, right:0, width:"200px", height:"1px", background:"linear-gradient(to left,transparent,rgba(229,62,62,0.15),transparent)" }} />
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:"1400px", margin:"0 auto", padding:"40px 24px 80px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"6px 16px", borderRadius:"100px", marginBottom:"20px", background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.25)" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#e53e3e", display:"inline-block", animation:"pulse 2s ease-in-out infinite", boxShadow:"0 0 10px #e53e3e" }} />
            <span style={{ fontSize:"12px", fontWeight:"700", color:"#ff6b6b", letterSpacing:"0.05em" }}>Discover Amazing Cinema</span>
          </div>

          <h1 className="shimmer-text" style={{ fontSize:"clamp(48px,8vw,80px)", fontWeight:"900", lineHeight:1, marginBottom:"12px", letterSpacing:"-2px" }}>
            CineVault
          </h1>
          <p style={{ fontSize:"15px", color:sub, marginBottom:"40px" }}>Search, explore and save your favorite movies</p>

          <SearchBar onSearch={handleSearch} />
          <FilterBar
            selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
            sortBy={sortBy} setSortBy={setSortBy}
            language={language} setLanguage={setLanguage}
          />
        </div>

        {/* Search result label */}
        {activeSearch && !loading && (
          <div style={{ marginBottom:"24px", fontSize:"14px", fontWeight:"600", color:sub }}>
            Results for <span style={{ color:"#e53e3e" }}>"{activeSearch}"</span> — {movies.length} movies found
          </div>
        )}

        {/* Grid */}
        {loading && page===1 ? <Loader /> :
         movies.length===0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>🎬</div>
            <p style={{ fontSize:"18px", fontWeight:"700", color:sub, marginBottom:"8px" }}>No movies found</p>
            <p style={{ fontSize:"14px", color:dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)" }}>Try a different search or filter</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"18px" }}>
            {movies.map(m=><MovieCard key={m.id} movie={m} onClick={setSelected} />)}
          </div>
        )}

        {/* Load More */}
        {!loading && page<totalPages && movies.length>0 && (
          <div style={{ textAlign:"center", marginTop:"48px" }}>
            <button onClick={loadMore}
              style={{ padding:"14px 40px", borderRadius:"14px", border:"none", cursor:"pointer", fontSize:"14px", fontWeight:"800", color:"white", background:"linear-gradient(135deg,#7f0000,#e53e3e)", boxShadow:"0 8px 30px rgba(229,62,62,0.4)", fontFamily:"inherit", letterSpacing:"0.05em" }}>
              Load More Movies
            </button>
          </div>
        )}
        {loading && page>1 && <Loader />}
      </div>

      {selected && <MovieModal movie={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}