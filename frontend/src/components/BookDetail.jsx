import { useState, useEffect } from "react";
import { getJSON, authJSON } from "../api.js";
import { Stars } from "./BookCard.jsx";

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
      setText(""); setRating(5);
      setMsg("? Izoh qoshildi");
      onPosted();
    } catch (e) {
      setMsg("?? " + (e.message || "Xatolik"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="commentBox">
      <div className="rateLabel">Bahongiz:</div>
      <div className="rateRow">
        {[1,2,3,4,5].map((i) => (
          <button key={i} className={i <= rating ? "star on" : "star"} onClick={() => setRating(i)}>?</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Izoh yozing..." />
      <button className="btn blue full" disabled={loading} onClick={post}>
        {loading ? "..." : "Izoh qoldirish"}
      </button>
      {msg && <div className="note">{msg}</div>}
    </div>
  );
}

export default function BookDetail({ bookId, me, goDonate, onClose }) {
  const [book, setBook] = useState(null);
  const [tab, setTab] = useState("info");
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [msg, setMsg] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  async function load() {
    const b = await getJSON(`/api/books/${bookId}/`);
    setBook(b);
    try {
      const cs = await getJSON(`/api/books/${bookId}/comments/`);
      setComments(cs);
    } catch { setComments([]); }
    try {
      const rel = await getJSON(`/api/books/${bookId}/related/`);
      setRelated(rel);
    } catch { setRelated([]); }
    if (me?.username) {
      try {
        const bms = await authJSON("/api/bookmarks/", { method: "GET" });
        const found = bms.find(bm => bm.book?.id === bookId);
        if (found) { setBookmarked(true); setBookmarkId(found.id); }
      } catch {}
    }
  }

  useEffect(() => { load().catch((e) => setMsg(String(e.message || e))); }, [bookId]);

  async function toggleBookmark() {
    if (!me?.username) { setMsg("Saqlash uchun kirish qiling."); return; }
    try {
      if (bookmarked) {
        await authJSON(`/api/bookmarks/${bookmarkId}/`, { method: "DELETE" });
        setBookmarked(false); setBookmarkId(null);
      } else {
        const data = await authJSON("/api/bookmarks/", { method: "POST", body: JSON.stringify({ book_id: bookId }) });
        setBookmarked(true); setBookmarkId(data.id);
      }
    } catch (e) { setMsg("?? " + e.message); }
  }

  async function openPdf() {
    setMsg("");
    try {
      const data = await authJSON(`/api/books/${bookId}/pdf/`, { method: "GET" });
      window.open(data.pdf_url, "_blank");
    } catch (e) { setMsg("?? " + (e.message || "Xatolik")); }
  }

  async function openAudio() {
    setMsg("");
    try {
      const data = await authJSON(`/api/books/${bookId}/audio/`, { method: "GET" });
      window.open(data.audio_url, "_blank");
    } catch (e) { setMsg("?? " + (e.message || "Xatolik")); }
  }

  if (!book) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <div className="bookDetailWrap">
      <div className="bdTop">
        <div className="bdCoverWrap">
          {book.cover_url
            ? <img src={book.cover_url} alt={book.title} className="bdCoverImg" />
            : <div className="bdCoverPh"></div>}
        </div>
        <div className="bdInfo">
          <div className="bdGenre">{book.genre_name}</div>
          <div className="bdTitle">{book.title}</div>
          <div className="bdAuthor muted">{book.author || "Noma'lum"}</div>
          <div className="bdRating">
            <Stars value={book.rating_avg} />
            <span className="muted small">({book.rating_count || 0} ta reyting)</span>
          </div>
          <div className="bdViews muted small">?? {book.views} marta ko'rilgan</div>
          <div className="bdActions">
            <button className="btn blue" onClick={openPdf}>?? PDF o'qish</button>
            <button className="btn orange" onClick={openAudio}>?? Audio tinglash</button>
            <button className={`btn ${bookmarked ? "bookmarked" : "ghost"}`} onClick={toggleBookmark}>
              {bookmarked ? "?? Saqlangan" : "?? Saqlash"}
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <div className="warn">
          {msg}
          {msg.toLowerCase().includes("premium") && (
            <button className="btn orange" style={{ marginTop: 10 }} onClick={goDonate}>
              Premiumga obuna bolish
            </button>
          )}
        </div>
      )}

      <div className="tabs">
        <button className={tab === "info" ? "tab on" : "tab"} onClick={() => setTab("info")}>Ma'lumot</button>
        <button className={tab === "comments" ? "tab on" : "tab"} onClick={() => setTab("comments")}>
          Izohlar {comments.length > 0 && <span className="tabCount">{comments.length}</span>}
        </button>
        {related.length > 0 && (
          <button className={tab === "related" ? "tab on" : "tab"} onClick={() => setTab("related")}>O'xshash</button>
        )}
      </div>

      {tab === "info" && (
        <div className="bdDesc">
          <p>{book.description || "Tavsif yo'q."}</p>
          {book.is_premium && <div className="premiumNote">? Bu premium kitob</div>}
        </div>
      )}

      {tab === "comments" && (
        <div>
          <CommentBox me={me} bookId={bookId} onPosted={load} />
          <div className="commentsList">
            {comments.length === 0
              ? <div className="muted">Hali izoh yo'q. Birinchi bo'ling!</div>
              : comments.map((c) => (
                <div key={c.id} className="comment">
                  <div className="commentTop">
                    <span className="who">{c.user_name}</span>
                    <span className="rateMini">{"?".repeat(c.rating)}<span className="muted">{"?".repeat(5 - c.rating)}</span></span>
                  </div>
                  <div className="muted small">{new Date(c.created_at).toLocaleString()}</div>
                  <div className="commentText">{c.text || <span className="muted">(izoh yo'q)</span>}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === "related" && (
        <div className="relatedGrid">
          {related.map((b) => (
            <button key={b.id} className="relatedCard" onClick={() => { onClose(); setTimeout(() => onClose(b.id), 100); }}>
              {b.cover_url
                ? <img src={b.cover_url} alt={b.title} />
                : <div className="relatedPh"></div>}
              <div className="relatedTitle">{b.title}</div>
              <div className="muted small">{b.author}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
