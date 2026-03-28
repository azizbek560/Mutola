import { useEffect, useState } from "react";
import { getJSON } from "../api.js";
import BookCard from "../components/BookCard.jsx";

export default function Home({ go }) {
    const [books, setBooks] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [newBooks, setNewBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [all, top, newest, st] = await Promise.all([
                    getJSON("/api/books/"),
                    getJSON("/api/books/top/"),
                    getJSON("/api/books/new/"),
                    getJSON("/api/stats/"),
                ]);
                setBooks(all);
                setTopBooks(top);
                setNewBooks(newest);
                setStats(st);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function onSearch(e) {
        e.preventDefault();
        if (q.trim()) go("search?" + q.trim());
    }

    if (loading) return <div className="loadingPage">Yuklanmoqda...</div>;

    return (
        <div>
            <section className="hero">
                <div className="container heroInner">
                    <div className="heroText">
                        <div className="heroBadge">📚 Onlayn kutubxona</div>
                        <h1>Kitoblarni o'qing, baholang va audio tinglang</h1>
                        <p className="heroSub muted">18 dan ortiq kitob, audiokitoblar va premium kontent bir joyda.</p>
                        <form className="search" onSubmit={onSearch}>
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kitob, muallif yoki janr..." />
                            <button type="submit">🔍 Qidirish</button>
                        </form>
                        {stats && (
                            <div className="heroStats">
                                <div className="heroStat"><span>{stats.total_books}</span>📖 Kitob</div>
                                <div className="heroStat"><span>{stats.total_genres}</span>🏷️ Janr</div>
                                <div className="heroStat"><span>{stats.total_users}</span>👤 Foydalanuvchi</div>
                                <div className="heroStat"><span>{stats.total_premium_users}</span>⭐ Premium</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="container section">
                <div className="sectionHead">
                    <h2>🔥 Eng ko'p o'qilgan</h2>
                    <button className="seeAll" onClick={() => go("books")}>Barchasi →</button>
                </div>
                <div className="grid">
                    {topBooks.slice(0, 6).map((b) => (
                        <BookCard key={b.id} b={b} onOpen={(id) => go("book?" + id)} />
                    ))}
                </div>
            </section>

            <section className="container section">
                <div className="sectionHead">
                    <h2>🆕 Yangi qo'shilgan</h2>
                    <button className="seeAll" onClick={() => go("books")}>Barchasi →</button>
                </div>
                <div className="grid">
                    {newBooks.slice(0, 6).map((b) => (
                        <BookCard key={b.id} b={b} onOpen={(id) => go("book?" + id)} />
                    ))}
                </div>
            </section>

            <section className="container section">
                <div className="sectionHead">
                    <h2>📚 Barcha kitoblar</h2>
                    <span className="muted small">{books.length} ta kitob</span>
                </div>
                <div className="grid">
                    {books.map((b) => (
                        <BookCard key={b.id} b={b} onOpen={(id) => go("book?" + id)} />
                    ))}
                </div>
            </section>
        </div>
    );
}