import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { theme, toggleTheme, favorites, watchlist } = useApp();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const dark = theme === "dark";

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navBg  = dark ? "rgba(6,6,6,0.96)"     : "rgba(255,255,255,0.96)";
  const border = dark ? "rgba(229,62,62,0.2)"   : "rgba(229,62,62,0.15)";
  const text   = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";

  const links = [
    { to: "/",          label: "Discover" },
    { to: "/trending",  label: "Trending" },
    { to: "/favorites", label: favorites.length > 0 ? `Favorites (${favorites.length})` : "Favorites" },
    { to: "/watchlist", label: watchlist.length  > 0 ? `Watchlist (${watchlist.length})`  : "Watchlist" },
    { to: "/top-rated", label: "Top Rated" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) window.location.href = `/?q=${encodeURIComponent(searchVal.trim())}`;
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: navBg,
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${border}`,
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.25)" : "none",
          transition: "box-shadow 0.3s, background 0.3s",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

            {/* LOGO */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg,#7f0000,#e53e3e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", boxShadow: "0 0 20px rgba(229,62,62,0.4)",
                }}>🎬</motion.div>
              <span style={{
                fontSize: "20px", fontWeight: "900",
                background: "linear-gradient(135deg,#e53e3e,#ff6b6b)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}>CineVault</span>
            </Link>

            {/* DESKTOP LINKS */}
            {!isMobile && (
              <div style={{ display: "flex", gap: "4px" }}>
                {links.map(({ to, label }) => {
                  const active = location.pathname === to;
                  return (
                    <Link key={to} to={to} style={{ position: "relative", textDecoration: "none" }}>
                      <motion.span
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: "block",
                          padding: "8px 16px", borderRadius: "10px",
                          fontSize: "13px", fontWeight: "600",
                          color: active ? "#e53e3e" : text,
                          background: active ? "rgba(229,62,62,0.1)" : "transparent",
                          letterSpacing: "0.01em", whiteSpace: "nowrap",
                          transition: "color 0.2s, background 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={e => {
                          if (!active) {
                            e.currentTarget.style.color = "#e53e3e";
                            e.currentTarget.style.background = "rgba(229,62,62,0.06)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            e.currentTarget.style.color = text;
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        {label}
                        {active && (
                          <motion.span
                            layoutId="active-pill"
                            style={{
                              position: "absolute", inset: 0,
                              borderRadius: "10px",
                              background: "rgba(229,62,62,0.1)",
                              zIndex: -1,
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </motion.span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* RIGHT ICONS */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  border: `1px solid ${border}`, background: "transparent",
                  cursor: "pointer", fontSize: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#e53e3e"}
                onMouseLeave={e => e.currentTarget.style.borderColor = border}>
                <motion.span
                  key={dark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  transition={{ duration: 0.3 }}>
                  {dark ? "☀️" : "🌙"}
                </motion.span>
              </motion.button>

              {/* Hamburger — mobile only */}
              {isMobile && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMenuOpen(o => !o)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "4px", display: "flex", flexDirection: "column", gap: "5px",
                  }}
                  aria-label="Menu"
                >
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{
                        rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                        y:      menuOpen && i === 0 ? 7  : menuOpen && i === 2 ? -7  : 0,
                        opacity: menuOpen && i === 1 ? 0 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "block", width: "22px", height: "2px",
                        borderRadius: "1px", background: "#e53e3e",
                      }}
                    />
                  ))}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── MOBILE DROPDOWN ── */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 30,
                background: "rgba(0,0,0,0.5)",
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0,  y: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: "64px", left: 0, right: 0,
                zIndex: 40,
                background: dark ? "rgba(6,6,6,0.99)" : "rgba(255,255,255,0.99)",
                backdropFilter: "blur(24px)",
                borderBottom: `1px solid ${border}`,
                padding: "12px 16px 20px",
              }}
            >
              {/* Search */}
              <form onSubmit={handleSearch} style={{ marginBottom: "12px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", borderRadius: "12px",
                  border: `1px solid ${border}`,
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                }}>
                  <span style={{ fontSize: "14px" }}>🔍</span>
                  <input
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder="Search movies..."
                    style={{
                      flex: 1, background: "transparent",
                      border: "none", outline: "none",
                      fontSize: "14px", fontFamily: "inherit",
                      color: dark ? "white" : "#111",
                    }}
                  />
                </div>
              </form>

              {/* Links — staggered */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {links.map(({ to, label }, i) => {
                  const active = location.pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
                    >
                      <Link to={to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "13px 16px", borderRadius: "12px",
                          fontSize: "15px", fontWeight: "600",
                          textDecoration: "none",
                          color: active ? "#e53e3e" : dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)",
                          background: active ? "rgba(229,62,62,0.1)" : "transparent",
                          borderLeft: `3px solid ${active ? "#e53e3e" : "transparent"}`,
                          transition: "background 0.15s",
                        }}>
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: border, margin: "10px 0" }} />

              {/* Theme */}
              <motion.button
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.06, duration: 0.25 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { toggleTheme(); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "13px 16px",
                  borderRadius: "12px", background: "transparent",
                  border: "none", cursor: "pointer",
                  fontSize: "15px", fontWeight: "600",
                  color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)",
                  fontFamily: "inherit",
                }}>
                <span>{dark ? "☀️" : "🌙"}</span>
                <span>{dark ? "Switch to Light" : "Switch to Dark"}</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}