import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Loader from "../components/Loader";

export default function TopRated() {
  const { theme } = useApp();
  const dark = theme==="dark";
  const [selected, setSelected] = useState(null);
  const { data, loading } = useFetch("/movie/top_rated", { "vote_count.gte":"500" });
  const movies = (data?.results||[]).filter(m=>!m.adult);

  const bg   = dark?"#060606":"#f8f8f8";
  const text = dark?"white":"#111";

  return (
    <div style={{ minHeight:"100vh", background:bg, paddingTop:"64px" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <div style={{ marginBottom:"32px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#e53e3e", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>🏆 All Time Best</div>
          <h1 style={{ fontSize:"40px", fontWeight:"900", color:text, lineHeight:1 }}>Top Rated</h1>
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