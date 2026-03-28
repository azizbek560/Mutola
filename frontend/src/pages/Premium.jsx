import { useEffect, useState } from "react";
import { getJSON } from "../api.js";
import BookCard from "../components/BookCard.jsx";

export default function Premium({ me, go }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getJSON("/api/books/?premium=1");
                setBooks(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const rows = [
        ["E-kitoblarni o'qish", true, true],
        ["Kitoblarni qidirish va janrlar", true, true],
        ["Izoh qoldirish va yulduzcha", true, true],
        ["Premium kitoblarga kirish", false, true],
        ["Audiokitobni tinglash", false, true],
        ["Audiokitobni yuklab olish", false, true],
    ];

    return (
        <div className="container section">
            <div className="premiumHero">
                <div className="premiumHeroIcon">⭐</div>
                <h2>Mutola Premium</h2>
                <p className="muted">Audiokitoblar, premium kitoblar va ko'proq imkoniyatlar</p>
                {!me?.is_premium && (
                    <button className="btn orange" onClick={() => go("donate")}>
                        💳 Premiumga obuna bo'lish
                    </button>
                )}
                {me?.is_premium && (
                    <div className="premiumActive">
                        <span>✅ Siz allaqachon Premium foydalanuvchisiz!</span>
                    </div>
                )}
            </div>

            <div className="compareCard">
                <h3>Bepul vs Premium</h3>
                <div className="compare">
                    <div className="compareHead">
                        <div></div>
                        <div className="col free">Bepul</div>
                        <div className="col prem">Premium</div>
                    </div>
                    {rows.map((r, i) => (
                        <div key={i} className="compareRow">
                            <div className="feat">{r[0]}</div>
                            <div className="val">{r[1] ? "✅" : "—"}</div>
                            <div className="val">{r[2] ? "✅" : "—"}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sectionHead" style={{ marginTop: 32 }}>
                <h2>📚 Premium kitoblar</h2>
                <span className="muted small">{books.length} ta kitob</span>
            </div>

            {loading ? (
                <div className="loadingPage">Yuklanmoqda...</div>
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