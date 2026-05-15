import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const BLOCKED = ["erotic","adult","nude","naked","porn","xxx","explicit"];
const BLOCKED_GENRES = [10749,27];

export function isClean(movie) {
  if (movie.adult) return false;
  const t = (movie.title||"").toLowerCase();
  const o = (movie.overview||"").toLowerCase();
  if (BLOCKED.some(k => t.includes(k)||o.includes(k))) return false;
  if (movie.genre_ids?.some(id => BLOCKED_GENRES.includes(id))) return false;
  return true;
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("cv_theme")||"dark");
  const [favorites, setFavorites] = useState(() => { try{return JSON.parse(localStorage.getItem("cv_fav"))||[];}catch{return[];} });
  const [watchlist, setWatchlist] = useState(() => { try{return JSON.parse(localStorage.getItem("cv_wl"))||[];}catch{return[];} });
  const [ratings, setRatings] = useState(() => { try{return JSON.parse(localStorage.getItem("cv_rat"))||{};}catch{return {};} });
  const [notification, setNotification] = useState(null);

  useEffect(()=>{ localStorage.setItem("cv_theme",theme); },[theme]);
  useEffect(()=>{ localStorage.setItem("cv_fav",JSON.stringify(favorites)); },[favorites]);
  useEffect(()=>{ localStorage.setItem("cv_wl",JSON.stringify(watchlist)); },[watchlist]);
  useEffect(()=>{ localStorage.setItem("cv_rat",JSON.stringify(ratings)); },[ratings]);

  const notify = (msg) => { setNotification(msg); setTimeout(()=>setNotification(null),2500); };
  const toggleTheme = () => setTheme(t => t==="dark"?"light":"dark");
  const toggleFavorite = (m) => { setFavorites(p => p.find(f=>f.id===m.id)?p.filter(f=>f.id!==m.id):[...p,m]); };
  const toggleWatchlist = (m) => { setWatchlist(p => p.find(f=>f.id===m.id)?p.filter(f=>f.id!==m.id):[...p,m]); };
  const isFavorite = (id) => favorites.some(f=>f.id===id);
  const isWatchlist = (id) => watchlist.some(f=>f.id===id);
  const setRating = (id, val) => setRatings(p=>({...p,[id]:val}));
  const getRating = (id) => ratings[id]||0;

  return (
    <AppContext.Provider value={{ theme, toggleTheme, favorites, toggleFavorite, isFavorite, watchlist, toggleWatchlist, isWatchlist, ratings, setRating, getRating, notification, notify }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);