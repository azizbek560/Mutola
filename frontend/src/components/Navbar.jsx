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
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kitob sahifalari - chap */}
    <path d="M24 38 C24 38 8 30 8 16 L8 14 C8 14 16 18 24 22 Z" fill="#c0392b"/>
    <path d="M24 38 C24 38 8 30 8 16 L8 14 C8 14 16 18 24 22 Z" fill="#e74c3c" opacity="0.7"/>
    {/* Kitob sahifalari - o'ng */}
    <path d="M24 38 C24 38 40 30 40 16 L40 14 C40 14 32 18 24 22 Z" fill="#c0392b"/>
    <path d="M24 38 C24 38 40 30 40 16 L40 14 C40 14 32 18 24 22 Z" fill="#e74c3c" opacity="0.7"/>
    {/* Quyosh / yorug'lik */}
    <circle cx="24" cy="12" r="4" fill="#f39c12"/>
    <path d="M24 6 L24 4" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 20 L24 22" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 8 L16.5 6.5" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 8 L31.5 6.5" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 12 L14 12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 12 L34 12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
    {/* Readuz text */}
    <text x="24" y="46" textAnchor="middle" fontSize="7" fontWeight="900" fill="#c0392b" fontFamily="Inter,sans-serif">READUZ</text>
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