import { useState, useEffect } from "react";
import { setToken, authJSON } from "../api.js";

function iconForGenre(name = "") {
  const n = name.toLowerCase();
  if (n.includes("hikoya")) return "📄";
  if (n.includes("roman")) return "⭐";
  if (n.includes("she")) return "✏️";
  if (n.includes("qissa")) return "💡";
  if (n.includes("shaxsiy")) return "👤";
  if (n.includes("folklor")) return "🪕";
  if (n.includes("bolalar")) return "🙂";
  if (n.includes("ertak")) return "⏳";
  if (n.includes("fantast")) return "🚀";
  if (n.includes("ilmiy")) return "⚛️";
  if (n.includes("diniy")) return "🕌";
  if (n.includes("psixolog")) return "🧠";
  if (n.includes("tarix")) return "📜";
  if (n.includes("biznes")) return "💼";
  return "📚";
}

export default function Navbar({ page, go, me, genres, unreadCount }) {
  const [openGenres, setOpenGenres] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest?.(".drop")) setOpenGenres(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function logout() {
    try { await authJSON("/api/auth/logout/", { method: "POST" }); } catch {}
    setToken("");
    go("home");
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="container nav">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Kitob - chap qanot */}
            <path d="M50 65 C50 65 15 55 12 30 L12 28 C12 28 30 38 50 45 Z" fill="#e8442a"/>
            {/* Kitob - o'ng qanot */}
            <path d="M50 65 C50 65 85 55 88 30 L88 28 C88 28 70 38 50 45 Z" fill="#e8442a"/>
            {/* Kitob markaziy chiziq */}
            <path d="M50 45 L50 65" stroke="#c0392b" strokeWidth="2"/>
            {/* Quyosh doirasi */}
            <circle cx="50" cy="22" r="10" fill="#f5a623"/>
            {/* Quyosh nurlari */}
            <line x1="50" y1="6" x2="50" y2="2" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="38" x2="50" y2="34" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="34" y1="22" x2="30" y2="22" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="70" y1="22" x2="66" y2="22" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="39" y1="11" x2="36" y2="8" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="64" y1="11" x2="67" y2="8" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="39" y1="33" x2="36" y2="36" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            <line x1="64" y1="33" x2="67" y2="36" stroke="#f5a623" strokeWidth="3" strokeLinecap="round"/>
            {/* READUZ text */}
            <text x="50" y="82" textAnchor="middle" fontSize="14" fontWeight="900" fill="#e8442a" fontFamily="Inter,sans-serif" letterSpacing="2">READUZ</text>
          </svg>
        </a>

        <button className="burgerBtn" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`navlinks ${menuOpen ? "open" : ""}`}>
          <a href="#home" className={page === "home" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); go("home"); setMenuOpen(false); }}>
            Bosh sahifa
          </a>

          <div className={"drop " + (openGenres ? "open" : "")}>
            <button className={`dropBtn ${page === "genres" ? "active" : ""}`}
              onClick={() => setOpenGenres(v => !v)}>
              Janrlar <span className="chev">▾</span>
            </button>
            <div className="dropMenu">
              <div className="dropTitle">Janrlar</div>
              <div className="dropScroll">
                <a className="dropItem" href="#home"
                  onClick={(e) => { e.preventDefault(); setOpenGenres(false); go("books"); setMenuOpen(false); }}>
                  <span className="gIcon">📚</span>
                  <span className="gName">Hammasi</span>
                </a>
                {(genres || []).map((g) => (
                  <a key={g.id} className="dropItem" href="#genres"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenGenres(false);
                      setMenuOpen(false);
                      localStorage.setItem("last_genre_slug", g.slug);
                      go("genres");
                    }}>
                    <span className="gIcon">{iconForGenre(g.name)}</span>
                    <span className="gName">{g.name}</span>
                    <span className="gCount">{g.books_count}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="#premium" className={page === "premium" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); go("premium"); setMenuOpen(false); }}>
            Premium
          </a>

          <a href="#donate" className={page === "donate" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); go("donate"); setMenuOpen(false); }}>
            Donat
          </a>

          <a href="https://t.me/lmutola_ibrary_bot" target="_blank" rel="noreferrer"
            onClick={() => setMenuOpen(false)}>
            Telegram
          </a>

          {me?.username && (
            <>
              <a href="#bookmarks" className={page === "bookmarks" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); go("bookmarks"); setMenuOpen(false); }}>
                🔖 Saqlangan
              </a>
              <a href="#notifications" className={page === "notifications" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); go("notifications"); setMenuOpen(false); }}>
                🔔 {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : "Bildirishnomalar"}
              </a>
            </>
          )}
        </nav>

        <div className="userbox">
          {me?.username ? (
            <div className="userpill">
              <span className="dot2"></span>
              <a href="#profile" onClick={(e) => { e.preventDefault(); go("profile"); }} className="profileLink">
                {me.username}
              </a>
              {me.is_premium
                ? <span className="pill premium">Premium</span>
                : <span className="pill free">Free</span>}
              <button className="logoutBtn" onClick={logout}>Chiqish</button>
            </div>
          ) : (
            <a className="btn smallBtn" href="#login"
              onClick={(e) => { e.preventDefault(); go("login"); }}>
              Kirish
            </a>
          )}
        </div>
      </div>
    </header>
  );
}