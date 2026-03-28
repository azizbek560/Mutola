import { useEffect, useState } from "react";
import { authJSON } from "../api.js";

export default function Bookmarks({ me, go }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    async function load() {
        try {
            const data = await authJSON("/api/bookmarks/", { method: "GET" });
            setBookmarks(data);
        } catch (e) {
            setMsg("⚠️ " + e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function remove(id) {
        try {
            await authJSON(`/api/bookmarks/${id}/`, { method: "DELETE" });
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
        } catch (e) {
            setMsg("⚠️ " + e.message);
        }
    }

    if (!me?.username) return (
        <div className="container section">
            <div className="authCard">
                <div className="authTitle">🔖 Saqlangan kitoblar</div>
                <p className="muted">Ko'rish uchun kirish qiling.</p>
                <button className="btn orange" onClick={() => go("login")}>Kirish</button>
            </div>
        </div>
    );

    return (
        <div className="container section">
            <div className="sectionHead">
                <h2>🔖 Saqlangan kitoblar</h2>
                <span className="muted small">{bookmarks.length} ta kitob</span>
            </div>

            {msg && <div className="warn">{msg}</div>}

            {loading ? (
                <div className="loadingPage">Yuklanmoqda...</div>
            ) : bookmarks.length === 0 ? (
                <div className="emptyState">
                    <div className="emptyIcon">🔖</div>
                    <div className="emptyTitle">Hali saqlangan kitob yo'q</div>
                    <p className="muted">Kitob sahifasidan "Saqlash" tugmasini bosing</p>
                    <button className="btn orange" onClick={() => go("home")}>Kitoblarni ko'rish</button>
                </div>
            ) : (
                <div className="bookmarksList">
                    {bookmarks.map((bm) => (
                        <div key={bm.id} className="bookmarkCard">
                            <div className="bookmarkCover">
                                {bm.book?.cover_url
                                    ? <img src={bm.book.cover_url} alt={bm.book.title} />
                                    : <div className="bmPh"></div>}
                            </div>
                            <div className="bookmarkInfo">
                                <div className="bookmarkTitle">{bm.book?.title}</div>
                                <div className="muted">{bm.book?.author}</div>
                                <div className="bookmarkMeta">
                                    <span className="small muted">{bm.book?.genre_name}</span>
                                    {bm.book?.is_premium
                                        ? <span className="pill premium">Premium</span>
                                        : <span className="pill free">Free</span>}
                                </div>
                                <div className="bookmarkDate muted small">
                                    Saqlangan: {new Date(bm.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="bookmarkActions">
                                <button className="btn blue" onClick={() => go("book?" + bm.book?.id)}>
                                    📖 O'qish
                                </button>
                                <button className="btn ghost" onClick={() => remove(bm.id)}>
                                    🗑️ O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}