import { useEffect, useState } from "react";
import { authJSON } from "../api.js";

export default function Notifications({ me, go, setUnreadCount }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    async function load() {
        try {
            const data = await authJSON("/api/notifications/", { method: "GET" });
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.is_read).length);
        } catch (e) {
            setMsg("⚠️ " + e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function readOne(id) {
        try {
            await authJSON(`/api/notifications/${id}/read/`, { method: "POST" });
            setNotifications((prev) =>
                prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (e) {
            setMsg("⚠️ " + e.message);
        }
    }

    async function readAll() {
        try {
            await authJSON("/api/notifications/read-all/", { method: "POST" });
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (e) {
            setMsg("⚠️ " + e.message);
        }
    }

    if (!me?.username) return (
        <div className="container section">
            <div className="authCard">
                <div className="authTitle">🔔 Bildirishnomalar</div>
                <p className="muted">Ko'rish uchun kirish qiling.</p>
                <button className="btn orange" onClick={() => go("login")}>Kirish</button>
            </div>
        </div>
    );

    const unread = notifications.filter((n) => !n.is_read).length;

    return (
        <div className="container section">
            <div className="sectionHead">
                <h2>🔔 Bildirishnomalar
                    {unread > 0 && <span className="badge" style={{ marginLeft: 8 }}>{unread}</span>}
                </h2>
                {unread > 0 && (
                    <button className="btn ghost" onClick={readAll}>✅ Barchasini o'qildi</button>
                )}
            </div>

            {msg && <div className="warn">{msg}</div>}

            {loading ? (
                <div className="loadingPage">Yuklanmoqda...</div>
            ) : notifications.length === 0 ? (
                <div className="emptyState">
                    <div className="emptyIcon">🔔</div>
                    <div className="emptyTitle">Hali bildirishnoma yo'q</div>
                    <p className="muted">Yangi bildirishnomalar bu yerda ko'rinadi</p>
                </div>
            ) : (
                <div className="notifList">
                    {notifications.map((n) => (
                        <div key={n.id} className={`notifCard ${n.is_read ? "read" : "unread"}`}>
                            <div className="notifIcon">{n.is_read ? "📭" : "📬"}</div>
                            <div className="notifContent">
                                <div className="notifMessage">{n.message}</div>
                                <div className="notifDate muted small">
                                    {new Date(n.created_at).toLocaleString()}
                                </div>
                            </div>
                            {!n.is_read && (
                                <button className="btn ghost" onClick={() => readOne(n.id)}>
                                    O'qildi
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}