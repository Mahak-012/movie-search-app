import { useApp } from "../context/AppContext";

const GENRES = [
  {id:"",name:"All"},{id:"28",name:"Action"},{id:"12",name:"Adventure"},
  {id:"16",name:"Animation"},{id:"35",name:"Comedy"},{id:"80",name:"Crime"},
  {id:"18",name:"Drama"},{id:"14",name:"Fantasy"},{id:"36",name:"History"},
  {id:"10402",name:"Music"},{id:"9648",name:"Mystery"},{id:"878",name:"Sci-Fi"},
  {id:"53",name:"Thriller"},{id:"10752",name:"War"},{id:"37",name:"Western"},
];

const SORT = [
  {value:"popularity.desc",label:"Most Popular"},
  {value:"vote_average.desc",label:"Top Rated"},
  {value:"release_date.desc",label:"Newest First"},
  {value:"release_date.asc",label:"Oldest First"},
  {value:"revenue.desc",label:"Box Office"},
];

const LANGS = [
  {value:"",label:"All Languages"},{value:"en",label:"English"},
  {value:"hi",label:"Hindi"},{value:"ur",label:"Urdu"},
  {value:"ko",label:"Korean"},{value:"ja",label:"Japanese"},
  {value:"fr",label:"French"},{value:"es",label:"Spanish"},
  {value:"ar",label:"Arabic"},
];

export default function FilterBar({ selectedGenre, setSelectedGenre, sortBy, setSortBy, language, setLanguage }) {
  const { theme } = useApp();
  const dark = theme==="dark";

  const selectStyle = {
    background: dark?"rgba(229,62,62,0.08)":"rgba(229,62,62,0.05)",
    border: "1px solid rgba(229,62,62,0.2)",
    color: dark?"white":"#111",
    padding:"9px 14px", borderRadius:"12px",
    fontSize:"13px", fontWeight:"600", outline:"none", cursor:"pointer", fontFamily:"inherit",
  };

  return (
    <div style={{ marginTop:"24px" }}>
      {/* Genre pills */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center", marginBottom:"16px" }}>
        {GENRES.map(g=>{
          const active = selectedGenre===g.id;
          return (
            <button key={g.id} onClick={()=>setSelectedGenre(g.id)}
              style={{
                padding:"7px 16px", borderRadius:"100px", fontSize:"12px", fontWeight:"700",
                cursor:"pointer", border:"none", transition:"all 0.2s",
                background: active?"linear-gradient(135deg,#7f0000,#e53e3e)":dark?"rgba(229,62,62,0.07)":"rgba(229,62,62,0.06)",
                color: active?"white":dark?"rgba(255,255,255,0.55)":"rgba(0,0,0,0.55)",
                boxShadow: active?"0 4px 16px rgba(229,62,62,0.4)":"none",
                fontFamily:"inherit",
              }}>
              {g.name}
            </button>
          );
        })}
      </div>

      {/* Sort + Language */}
      <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
        <select value={language} onChange={e=>setLanguage(e.target.value)} style={selectStyle}>
          {LANGS.map(l=><option key={l.value} value={l.value} style={{ background:dark?"#111":"#fff", color:dark?"white":"#111" }}>{l.label}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={selectStyle}>
          {SORT.map(s=><option key={s.value} value={s.value} style={{ background:dark?"#111":"#fff", color:dark?"white":"#111" }}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}