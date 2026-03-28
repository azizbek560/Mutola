import { useEffect, useState } from "react";
import { authJSON, setToken } from "../api.js";

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

function Logo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <path
        d="M8 16C8 12 12 10 16 12L32 20L48 12C52 10 56 12 56 16V44C56 48 52 50 48 48L32 40L16 48C12 50 8 48 8 44V16Z"
        fill="url(#grad)"
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#ff7a00" />
          <stop offset="100%" stopColor="#ff0000" />
        </linearGradient>
      </defs>
    </svg>
  );
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
    try { await authJSON("/api/auth/logout/", { method: "POST" }); } catch { }
    setToken("");
    go("home");
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="container nav">
        <div className="brand" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          <Logo />
          <span>ReadUz</span>
        </div>

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
                <a className="dropItem" href="#books"
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