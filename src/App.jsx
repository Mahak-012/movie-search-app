import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import CinemaIntro from "./components/CinemaIntro";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import TopRated from "./pages/TopRated";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";

function AppInner() {
  const { theme } = useApp();
  const [introDone, setIntroDone] = useState(false);
  const dark = theme==="dark";

  return (
    <div style={{ minHeight:"100vh", background:dark?"#060606":"#f8f8f8", color:dark?"white":"#111", transition:"background 0.4s, color 0.4s" }}>
      {!introDone && <CinemaIntro onDone={()=>setIntroDone(true)} />}
      <Navbar />
      <Notification />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/trending"  element={<Trending />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}