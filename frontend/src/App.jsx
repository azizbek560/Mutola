import { useEffect, useState } from "react";
import { authJSON, getJSON } from "./api.js";
import BookDetail from "./components/BookDetail.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import Books from "./pages/Books.jsx";
import Donate from "./pages/Donate.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import Premium from "./pages/Premium.jsx";
import Profile from "./pages/Profile.jsx";

function useHashPage() {
    const [hash, setHash] = useState(window.location.hash || "#home");
    useEffect(() => {
        const onHash = () => setHash(window.location.hash || "#home");
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);
    const raw = hash.replace("#", "");
    const [pagePart, ...rest] = raw.split("?");
    const param = rest.join("?");
    const page = (pagePart || "home").trim();
    return [page, param, (p) => (window.location.hash = "#" + p)];
}

function Modal({ open, onClose, children }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);
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

export default function App() {
    const [page, param, go] = useHashPage();
    const [me, setMe] = useState(null);
    const [genres, setGenres] = useState([]);
    const [openBookId, setOpenBookId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    async function refreshMe() {
        try {
            const data = await authJSON("/api/auth/me/", { method: "GET" });
            setMe(data);
        } catch {
            setMe(null);
        }
    }

    useEffect(() => {
        refreshMe();
        (async () => {
            try {
                const gs = await getJSON("/api/genres/");
                setGenres(gs);
            } catch { }
        })();
    }, []);

    useEffect(() => {
        if (page === "book" && param) {
            setOpenBookId(Number(param));
        }
    }, [page, param]);

    useEffect(() => {
        if (me?.username) {
            (async () => {
                try {
                    const data = await authJSON("/api/notifications/", { method: "GET" });
                    setUnreadCount(data.filter((n) => !n.is_read).length);
                } catch { }
            })();
        }
    }, [me]);

    function handleGo(p) {
        if (p.startsWith("book?")) {
            const id = Number(p.replace("book?", ""));
            setOpenBookId(id);
            window.location.hash = "#book?" + id;
        } else {
            setOpenBookId(null);
            window.location.hash = "#" + p;
        }
    }

    return (
        <div className="app">
            <Navbar
                page={page}
                go={handleGo}
                me={me}
                genres={genres}
                unreadCount={unreadCount}
            />
            <main>
                {page === "home" && <Home go={handleGo} />}
                {page === "books" && <Books go={handleGo} />}
                {page === "genres" && <Books go={handleGo} initialGenre={localStorage.getItem("last_genre_slug") || ""} />}
                {page === "search" && <Books go={handleGo} initialQ={param} />}
                {page === "login" && <Login refreshMe={refreshMe} go={handleGo} />}
                {page === "profile" && <Profile me={me} refreshMe={refreshMe} go={handleGo} />}
                {page === "bookmarks" && <Bookmarks me={me} go={handleGo} />}
                {page === "notifications" && <Notifications me={me} go={handleGo} setUnreadCount={setUnreadCount} />}
                {page === "premium" && <Premium me={me} go={handleGo} />}
                {page === "donate" && <Donate me={me} go={handleGo} refreshMe={refreshMe} />}
            </main>
            <Modal open={!!openBookId} onClose={() => { setOpenBookId(null); window.location.hash = "#home"; }}>
                {openBookId && (
                    <BookDetail
                        bookId={openBookId}
                        me={me}
                        goDonate={() => { setOpenBookId(null); handleGo("donate"); }}
                        onClose={(newId) => {
                            if (newId) { setOpenBookId(newId); }
                            else { setOpenBookId(null); window.location.hash = "#home"; }
                        }}
                    />
                )}
            </Modal>
            <Footer />
        </div>
    );
}