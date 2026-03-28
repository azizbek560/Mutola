import { useEffect, useState } from "react";
import { getJSON } from "../api.js";
import BookCard from "../components/BookCard.jsx";

export default function Books({ go, initialGenre, initialQ }) {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [genreFilter, setGenreFilter] = useState(initialGenre || "");
    const [q, setQ] = useState(initialQ || "");
    const [loading, setLoading] = useState(true);

    async function load(genre, search) {
        setLoading(true);
        try {
            const sp = new URLSearchParams();
            if (search) sp.set("q", search);
            if (genre) sp.set("genre", genre);
            const data = await getJSON("/api/books/?" + sp.toString());
            setBooks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const gs = await getJSON("/api/genres/");
                setGenres(gs);
            } catch { }
        })();
        load(genreFilter, q);
    }, []);

    function onSearch(e) {
        e.preventDefault();
        load(genreFilter, q);
    }

    function pickGenre(slug) {
        setGenreFilter(slug);
        load(slug, q);
    }

    return (
        <div className="container section">
            <div className="sectionHead">
                <h2>📚 Barcha kitoblar</h2>
                <span className="muted small">{books.length} ta kitob</span>
            </div>

            <form className="search" onSubmit={onSearch} style={{ marginBottom: 16 }}>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Kitob, muallif yoki janr..."
                />
                <button type="submit">🔍 Qidirish</button>
            </form>

            <div className="chips" style={{ marginBottom: 20 }}>
                <button
                    className={genreFilter === "" ? "chip on" : "chip"}
                    onClick={() => pickGenre("")}
                >
                    Hammasi
                </button>
                {genres.map((g) => (
                    <button
                        key={g.id}
                        className={genreFilter === g.slug ? "chip on" : "chip"}
                        onClick={() => pickGenre(g.slug)}
                    >
                        {g.name}
                        <span className="muted small" style={{ marginLeft: 4 }}>({g.books_count})</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loadingPage">Yuklanmoqda...</div>
            ) : books.length === 0 ? (
                <div className="emptyState">
                    <div className="emptyIcon">📚</div>
                    <div className="emptyTitle">Kitob topilmadi</div>
                    <p className="muted">Boshqa kalit so'z bilan qidiring</p>
                    <button className="btn orange" onClick={() => { setQ(""); setGenreFilter(""); load("", ""); }}>
                        Tozalash
                    </button>
                </div>
            ) : (
                <div className="grid">
                    {books.map((b) => (
                        <BookCard key={b.id} b={b} onOpen={(id) => go("book?" + id)} />
                    ))}
                </div>
            )}
        </div>
    );
}