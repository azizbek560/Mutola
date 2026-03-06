import { useEffect, useState } from "react";
import { authJSON, getJSON, setToken } from "./api.js";

/* -------------------- small helpers -------------------- */
function useHashPage() {
  const [hash, setHash] = useState(window.location.hash || "#home");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const raw = hash.replace("#", "");
  const page = (raw.split(/[?&]/)[0] || "home").trim();
  return [page, (p) => (window.location.hash = "#" + p)];
}

function Stars({ value }) {
  const v = Math.round((value || 0) * 10) / 10;
  const full = Math.round(value || 0);
  return (
    <span className="stars" title={String(v)}>
      {"★★★★★".split("").map((_, i) => (
        <span key={i} className={i < full ? "on" : "off"}>★</span>
      ))}
      <span className="muted small" style={{ marginLeft: 8 }}>
        {v ? v.toFixed(1) : "—"}
      </span>
    </span>
  );
}

/* -------------------- NAVBAR -------------------- */
function Navbar({ page, go, me, genres }) {
  const [openGenres, setOpenGenres] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  function iconForGenre(name = "") {
    const n = name.toLowerCase();
    if (n.includes("hikoya")) return "📄";
    if (n.includes("roman")) return "⭐";
    if (n.includes("she") || n.includes("she'r") || n.includes("poe")) return "✍️";
    if (n.includes("qissa")) return "💡";
    if (n.includes("shaxsiy")) return "👤";
    if (n.includes("folklor")) return "🪕";
    if (n.includes("bolalar")) return "🙂";
    if (n.includes("ertak")) return "⏳";
    if (n.includes("fantast")) return "🚀";
    if (n.includes("ilmiy")) return "⚛️";
    if (n.includes("diniy")) return "🕌";
    return "📚";
  }

  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target;
      if (!t.closest?.(".drop")) {
        setOpenGenres(false);
        setOpenHelp(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="header">
      <div className="container nav">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <span className="logoBadge">M</span>
          <span>Mutola</span>
        </a>

        <nav className="navlinks">
          <a href="#home" className={page === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); go("home"); }}>
            Bosh sahifa
          </a>

          <div className={"drop " + (openGenres ? "open" : "")}>
            <button
              className={page === "genres" ? "dropBtn active" : "dropBtn"}
              onClick={() => { setOpenGenres(v => !v); setOpenHelp(false); }}
            >
              Janrlar <span className="chev">▾</span>
            </button>

            <div className="dropMenu" role="menu">
              <div className="dropTitle">Janrlar</div>
              <div className="dropScroll">
                {(genres || []).map((g) => (
                  <a
                    key={g.id}
                    className="dropItem"
                    href="#genres"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenGenres(false);
                      go("genres");
                      localStorage.setItem("last_genre_id", String(g.id));
                    }}
                  >
                    <span className="gIcon">{iconForGenre(g.name)}</span>
                    <span className="gName">{g.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="#premium" className={page === "premium" ? "active" : ""} onClick={(e) => { e.preventDefault(); go("premium"); }}>
            Premium
          </a>

          <a href="#donate" className={page === "donate" ? "active" : ""} onClick={(e) => { e.preventDefault(); go("donate"); }}>
            Donat
          </a>

          <div className={"drop " + (openHelp ? "open" : "")}>
            <button
              className={page === "help" ? "dropBtn active" : "dropBtn"}
              onClick={() => { setOpenHelp(v => !v); setOpenGenres(false); }}
            >
              Yordam <span className="chev">▾</span>
            </button>

            <div className="dropMenu" role="menu">
              <a
                className="dropItem"
                href="https://t.me/lmutola_ibrary_bot"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenHelp(false)}
              >
                <span className="gIcon">📨</span>
                <span className="gName">Telegram orqali bog'lanish</span>
              </a>
            </div>
          </div>
        </nav>

        <div className="userbox">
          {me?.username ? (
            <div className="userpill">
              <span className="dot2"></span>
              <span>{me.username}</span>
              {me.is_premium ? <span className="pill premium">Premium</span> : <span className="pill free">Free</span>}
              <a
                className="logoutLink"
                href="#home"
                onClick={async (e) => {
                  e.preventDefault();
                  try { await authJSON("/api/auth/logout/", { method: "POST" }); } catch { }
                  setToken("");
                  go("home");
                  window.location.reload();
                }}
              >
                Chiqish
              </a>
            </div>
          ) : (
            <a className="btn smallBtn" href="#login" onClick={(e) => { e.preventDefault(); go("login"); }}>
              Kirish
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

/* -------------------- HERO -------------------- */
function Hero({ q, setQ, onSearch }) {
  return (
    <section className="hero">
      <div className="container heroGrid">
        <div>
          <h1>Kitoblarni o'qing, baholang va audio tinglang.</h1>
          <div className="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kitob, muallif yoki janr..." />
            <button onClick={onSearch}>Qidirish</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- BOOK CARD -------------------- */
function BookCard({ b, onOpen }) {
  return (
    <button className="bookCard" onClick={() => onOpen(b.id)}>
      <div className="cover">
        {b.cover_url ? <img src={b.cover_url} alt={b.title} /> : <div className="ph"></div>}
        {b.is_premium ? <span className="tag premium">Premium</span> : <span className="tag free">Free</span>}
      </div>
      <div className="meta">
        <div className="title">{b.title}</div>
        <div className="author muted">{b.author || "Unknown"}</div>
        <div className="row">
          <span className="small muted">{b.genre_name}</span>
          <span className="small muted">{b.views} 👁</span>
        </div>
        <div className="row">
          <Stars value={b.rating_avg} />
          <span className="small muted">({b.rating_count || 0})</span>
        </div>
      </div>
    </button>
  );
}

/* -------------------- MODAL -------------------- */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modalBack" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

/* -------------------- GENRES PAGE -------------------- */
function PageGenres({ genres, onPick }) {
  return (
    <div className="container section">
      <div className="sectionHead">
        <h2>Janrlar</h2>
        <span className="muted">Bosib filter qiling</span>
      </div>

      <div className="chips">
        <button className="chip" onClick={() => onPick("")}>Hammasi</button>
        {genres.map((g) => (
          <button key={g.id} className="chip" onClick={() => onPick(g.slug)}>
            {g.name} <span className="muted small">({g.books_count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------- PREMIUM -------------------- */
function CompareTable() {
  const rows = [
    ["E-kitoblarni o'qish", true, true],
    ["Kitoblarni qidirish & janrlar", true, true],
    ["Izoh qoldirish + yulduzcha", true, true],
    ["Premium kitoblarga kirish", false, true],
    ["Audiokitobni tinglash", false, true],
    ["Audiokitobni yuklab olish", false, true],
  ];
  return (
    <div className="compare">
      <div className="compareHead">
        <div></div>
        <div className="col free">Mutola bepul</div>
        <div className="col prem">Mutola Premium</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="compareRow">
          <div className="feat">{r[0]}</div>
          <div className="val">{r[1] ? "✅" : "—"}</div>
          <div className="val">{r[2] ? "✅" : "—"}</div>
        </div>
      ))}
    </div>
  );
}

function PagePremium({ go }) {
  return (
    <div className="container section">
      <div className="sectionHead">
        <h2>Premium xususiyatlari</h2>
        <span className="muted">Bepul va Premium solishtirish</span>
      </div>

      <div className="card bright">
        <div className="premiumGrid">
          <div>
            <h3>Mutola Premium xususiyatlari</h3>
            <p className="muted">
              Premium obuna orqali audiokitoblar, premium kitoblar va ko'proq imkoniyatlar ochiladi.
            </p>
            <a className="btn orange" href="#donate" onClick={(e) => { e.preventDefault(); go("donate"); }}>
              Premiumga obuna bo'lish
            </a>
          </div>
          <div className="iconsRow">
            <div className="iconCard">🎧 <b>Audiokitob</b><div className="muted small">Ism va summani kiriting, so'ng Click/Payme ni bosing.</div></div>
            <div className="iconCard">📚 <b>Premium kitoblar</b><div className="muted small">Premium</div></div>
            <div className="iconCard">⭐ <b>Reyting/izoh</b><div className="muted small">Barchaga</div></div>
          </div>
        </div>

        <CompareTable />
      </div>
    </div>
  );
}

/* -------------------- CLICK PAY PAGE (DEMO UI) -------------------- */
function ClickPayPage() {
  const hash = window.location.hash; 
  const qs = new URLSearchParams(hash.split("?")[1] || "");

  const merchant = qs.get("merchant") || "MUTOLA";
  const orderId = qs.get("id") || "----";
  const amount = Number(qs.get("amount") || 0);

  return (
    <div className="container section">
      <div className="clickDemo">
        <div className="clickHead">
          <div className="clickBrand">click</div>
        </div>

        <div className="clickBox">
          <div className="clickTop">
            <div>
              <div className="clickLbl">To'lanmoqda :</div>
              <div className="clickVal big">{merchant}</div>
            </div>
            <div className="clickLogo">🔷</div>
          </div>

          <div className="clickGrid">
            <div className="clickCard">
              <div className="clickLbl">Identifikator</div>
              <div className="clickVal">{orderId}</div>
            </div>

            <div className="clickCard">
              <div className="clickLbl">To'lov summasi</div>
              <div className="clickVal">
                {amount ? amount.toLocaleString("uz-UZ") : "0"} so'm
              </div>
            </div>
          </div>

          <div className="clickActions">
            <a className="btn blue" href="#home?success=1">Davom etish</a>
            <a className="btn ghost" href="#donate">Ortga</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- DONATE -------------------- */
function DonatePage({ me }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("5000");
  const [msg, setMsg] = useState("");
  const presets = ["10000", "15000", "20000", "25000", "30000", "40000", "50000", "100000"];

  function validate() {
    const n = (name || "").trim();
    const a = Number(amount);
    if (!me?.username) { setMsg("Donate qilish uchun avval Kirish qiling."); return null; }
    if (!n) { setMsg("Ismni kiriting."); return null; }
    if (!a || a < 1000) { setMsg("Summani to'g'ri kiriting (kamida 1000 UZS)."); return null; }
    return { n, a };
  }

  function goClick() {
    setMsg("");
    const v = validate();
    if (!v) return;

    localStorage.setItem("don_name", v.n);
    localStorage.setItem("don_amount", String(v.a));

    const orderId = "ORD-" + Date.now();
    window.location.hash =
      `#clickpay?merchant=${encodeURIComponent("MUTOLA")}` +
      `&id=${encodeURIComponent(orderId)}` +
      `&amount=${encodeURIComponent(String(v.a))}`;
  }

  function goPayme() {
    setMsg("");
    const v = validate();
    if (!v) return;
    localStorage.setItem("don_name", v.n);
    localStorage.setItem("don_amount", String(v.a));
    window.location.href = "https://payme.uz";
  }

  return (
    <div className="container section">
      <div className="sectionHead">
        <h2>Donat</h2>
        <span className="muted">Click / Payme orqali</span>
      </div>

      <div className="donateCard">
        <div className="donateTop">
          <div className="donateTitle">Mutola loyihasini qo'llab-quvvatlang</div>
          <div className="muted small">Ism va summani kiriting, keyin to'lov turini tanlang.</div>
        </div>

        <div className="formGrid">
          <div>
            <label>To'liq ism</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" />
          </div>
          <div>
            <label>Miqdor (UZS)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div className="presetRow">
          {presets.map((p) => (
            <button key={p} className={amount === p ? "chip on" : "chip"} onClick={() => setAmount(p)}>
              {Number(p).toLocaleString("uz-UZ")} UZS
            </button>
          ))}
        </div>

        <div className="payRow">
          <button className="payBtn payme" onClick={goPayme}>
            <span className="payLogo">💳</span>
            <span>Payme</span>
          </button>
          <button className="payBtn click" onClick={goClick}>
            <span className="payLogo">🔷</span>
            <span>Click</span>
          </button>
        </div>

        {msg ? <div className="note">{msg}</div> : null}
      </div>
    </div>
  );
}

/* -------------------- HELP -------------------- */
function HelpPage() {
  return (
    <div className="container section">
      <div className="sectionHead">
        <h2>Yordam</h2>
        <span className="muted">Telegram orqali bog'lanish</span>
      </div>
      <div className="card bright">
        <p className="muted">Agar muammo bo'lsa, telegram bot orqali bog'laning:</p>
        <a className="btn blue" href="https://t.me/lmutola_ibrary_bot" target="_blank" rel="noreferrer">
          Telegram bot
        </a>
      </div>
    </div>
  );
}

/* -------------------- LOGIN -------------------- */
function LoginPage({ refreshMe, go }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true); setMsg("");
    try {
      const path = mode === "login" ? "/api/auth/login/" : "/api/auth/register/";
      const data = await authJSON(path, { method: "POST", body: JSON.stringify({ username, password }) });
      setToken(data.token);
      await refreshMe();
      go("home");
    } catch (e) {
      setMsg("⚠️ " + (e.message || "Xatolik"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section">
      <div className="sectionHead">
        <h2>{mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}</h2>
        <span className="muted">Token auth</span>
      </div>

      <div className="card bright" style={{ maxWidth: 520 }}>
        <div className="toggleRow">
          <button className={mode === "login" ? "seg on" : "seg"} onClick={() => setMode("login")}>Kirish</button>
          <button className={mode === "register" ? "seg on" : "seg"} onClick={() => setMode("register")}>Register</button>
        </div>

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />

        <label>Parol</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="parol" />

        <button className="btn orange full" disabled={loading} onClick={submit}>
          {loading ? "..." : (mode === "login" ? "Kirish" : "Ro'yxatdan o'tish")}
        </button>

        {msg ? <div className="note">{msg}</div> : null}
      </div>
    </div>
  );
}

/* -------------------- COMMENT + BOOK DETAIL -------------------- */
function CommentBox({ me, bookId, onPosted }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function post() {
    setMsg("");
    if (!me?.username) { setMsg("Izoh qoldirish uchun kirish qiling."); return; }
    setLoading(true);
    try {
      await authJSON(`/api/books/${bookId}/comments/`, { method: "POST", body: JSON.stringify({ rating, text }) });
      setText("");
      setMsg("✅ Izoh qo'shildi");
      onPosted();
    } catch (e) {
      setMsg("⚠️ " + (e.message || "Xatolik"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="commentBox">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="muted small">Baholang:</div>
        <div className="rateRow">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} className={i <= rating ? "star on" : "star"} onClick={() => setRating(i)}>★</button>
          ))}
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Izoh yozing..." />
      <button className="btn blue full" disabled={loading} onClick={post}>
        {loading ? "..." : "Izoh qoldirish"}
      </button>
      {msg ? <div className="note">{msg}</div> : null}
    </div>
  );
}

function BookDetailModal({ bookId, me, goDonate }) {
  const [book, setBook] = useState(null);
  const [tab, setTab] = useState("ebook");
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    // Book detail
    const b = await getJSON(`/api/books/${bookId}/`);
    setBook(b);

    try {
      const cs = await getJSON(`/api/books/${bookId}/comments/`);
      setComments(cs);
    } catch {
      setComments([]);
    }
  }

  useEffect(() => { load().catch((e) => setMsg(String(e.message || e))); }, [bookId]);

  async function openPdf() {
    setMsg("");
    try {
      const data = await authJSON(`/api/books/${bookId}/pdf/`, { method: "GET" });
      window.open(data.pdf_url, "_blank");
    } catch (e) {
      setMsg("⚠️ " + (e.message || "Xatolik"));
    }
  }

  async function openAudio() {
    setMsg("");
    try {
      const data = await authJSON(`/api/books/${bookId}/audio/`, { method: "GET" });
      window.open(data.audio_url, "_blank");
    } catch (e) {
      setMsg("⚠️ " + (e.message || "Xatolik"));
    }
  }

  return (
    <div>
      {!book ? <div className="muted">Yuklanmoqda...</div> : (
        <>
          <div className="bdHead">
            {book.cover_url ? (
              <div className="bdCover">
                <img src={book.cover_url} alt={book.title} />
              </div>
            ) : null}
            <div>
              <div className="muted small">{book.genre_name}</div>
              <div className="bdTitle">{book.title}</div>
              <div className="muted">{book.author || "Unknown"}</div>
              <div className="row" style={{ marginTop: 8 }}>
                <Stars value={book.rating_avg} />
                <span className="muted small">({book.rating_count || 0} reyting)</span>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={tab === "ebook" ? "tab on" : "tab"} onClick={() => setTab("ebook")}>E-kitob</button>
            <button className={tab === "audio" ? "tab on" : "tab"} onClick={() => setTab("audio")}>Audiokitob</button>
            <button className={tab === "comments" ? "tab on" : "tab"} onClick={() => setTab("comments")}>Izohlar</button>
          </div>

          {msg ? (
            <div className="warn">
              {msg}
              {msg.toLowerCase().includes("premium") ? (
                <div style={{ marginTop: 10 }}>
                  <button className="btn orange" onClick={goDonate}>Premiumga obuna bo'lish</button>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "ebook" ? (
            <div className="card bright">
              <p className="muted">{book.description || "Tavsif yo'q."}</p>
              <button className="btn blue" onClick={openPdf}>PDF ochish</button>
              {book.is_premium ? <div className="muted small" style={{ marginTop: 8 }}>Bu kitob premium.</div> : null}
            </div>
          ) : null}

          {tab === "audio" ? (
            <div className="card bright">
              <p className="muted">Audiokitob faqat Premium foydalanuvchilar uchun.</p>
              <div className="row" style={{ gap: 10 }}>
                <button className="btn orange" disabled={!book.audio_url} onClick={openAudio}>Audiokitobni ochish</button>
                <span className="muted small">{book.audio_url ? "Audio mavjud ✅" : "Audio yo'q"}</span>
              </div>
              <div className="muted small" style={{ marginTop: 10 }}>

              </div>
            </div>
          ) : null}

          {tab === "comments" ? (
            <div>
              <CommentBox me={me} bookId={bookId} onPosted={load} />
              <div className="commentsList">
                {comments.length === 0 ? <div className="muted">Hali izoh yo'q.</div> : comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div className="who">{c.user_name}</div>
                      <div className="rateMini">
                        {"★".repeat(c.rating)}<span className="muted">{"★".repeat(5 - c.rating)}</span>
                      </div>
                    </div>
                    <div className="muted small">{new Date(c.created_at).toLocaleString()}</div>
                    <div style={{ marginTop: 8 }}>{c.text || <span className="muted">(izoh yo'q)</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

/* -------------------- APP -------------------- */
export default function App() {
  const [page, go] = useHashPage();
  const [q, setQ] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [payBanner, setPayBanner] = useState("");

  async function refreshMe() {
    try {
      const data = await authJSON("/api/auth/me/", { method: "GET" });
      setMe(data);
    } catch {
      setMe(null);
    }
  }

  async function loadGenres() {
    const gs = await getJSON("/api/genres/");
    setGenres(gs);
  }

  async function loadBooks() {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (genreFilter) sp.set("genre", genreFilter);
    if (page === "premium") sp.set("premium", "1");
    const data = await getJSON("/api/books/?" + sp.toString());
    setBooks(data);
  }

  useEffect(() => {
    (async () => {
      try {
        setError("");
        await refreshMe();
        await loadGenres();
        await loadBooks();
      } catch (e) {
        setError(String(e.message || e));
      }
    })();
  }, []);

  useEffect(() => {
    const handlePay = async () => {
      const h = window.location.hash || "";
      if (!h.includes("success=1")) return;
      try {
        await authJSON("/api/subscribe/", { method: "POST", body: "{}" });
        await refreshMe();
        setPayBanner("✅ To'lov muvaffaqiyatli bo'ldi! Premium aktiv bo'ldi.");
        window.location.hash = "#home";
      } catch (e) {
        setPayBanner("⚠️ Premiumni yoqish uchun avval Kirish qiling.");
        window.location.hash = "#login";
      }
    };
    handlePay();
    window.addEventListener("hashchange", handlePay);
    return () => window.removeEventListener("hashchange", handlePay);
    
  }, []);

  useEffect(() => { loadBooks().catch(() => { }); }, [genreFilter, page]); 

  function onSearch() {
    go("home");
    loadBooks().catch(() => { });
  }

  const pageHome = (
    <div className="container section">
      <div className="sectionHead">
        <h2>{page === "premium" ? "Premium kitoblar" : "Kitoblar"}</h2>
        <span className="muted">Janr: {genreFilter || "Hammasi"}</span>
      </div>
      <div className="grid">
        {books.map((b) => <BookCard key={b.id} b={b} onOpen={(id) => setOpenId(id)} />)}
      </div>
    </div>
  );

  return (
    <div className="app">
      <Navbar page={page} go={go} me={me} genres={genres} />
      <Hero q={q} setQ={setQ} onSearch={onSearch} />

      {payBanner ? <div className="container"><div className="note">{payBanner}</div></div> : null}

      {error ? <div className="container"><div className="warn">⚠️ {error}</div></div> : null}

      {page === "genres" ? <PageGenres genres={genres} onPick={(s) => { setGenreFilter(s); go("home"); }} /> : null}
      {page === "premium" ? <PagePremium go={go} /> : null}
      {page === "donate" ? <DonatePage me={me} /> : null}
      {page === "clickpay" ? <ClickPayPage /> : null}
      {page === "help" ? <HelpPage /> : null}
      {page === "login" ? <LoginPage refreshMe={refreshMe} go={go} /> : null}

      {(page === "home" || page === "premium") ? pageHome : null}

      <Modal open={!!openId} onClose={() => setOpenId(null)}>
        {openId ? <BookDetailModal bookId={openId} me={me} goDonate={() => go("donate")} /> : null}
      </Modal>

      <footer className="footer">
        <div className="container footGrid">
          <div className="muted">© Mutola</div>
        </div>
      </footer>
    </div>
  );
}
