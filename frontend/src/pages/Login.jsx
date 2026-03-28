import { useState } from "react";
import { authJSON, setToken } from "../api.js";

export default function Login({ refreshMe, go }) {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotUsername, setForgotUsername] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");

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

    async function submitForgot() {
        setForgotMsg("");
        try {
            const data = await authJSON("/api/auth/forgot-password/", { method: "POST", body: JSON.stringify({ username: forgotUsername }) });
            setForgotMsg("✅ Yangi parol: " + data.new_password);
        } catch (e) {
            setForgotMsg("⚠️ " + (e.message || "Xatolik"));
        }
    }

    if (forgotMode) return (
        <div className="container section">
            <div className="authCard">
                <div className="authTitle">🔑 Parolni tiklash</div>
                <label>Username</label>
                <input value={forgotUsername} onChange={(e) => setForgotUsername(e.target.value)} placeholder="username" />
                <button className="btn orange full" onClick={submitForgot}>Parolni tiklash</button>
                {forgotMsg && <div className="note">{forgotMsg}</div>}
                <button className="linkBtn" onClick={() => setForgotMode(false)}>← Orqaga</button>
            </div>
        </div>
    );

    return (
        <div className="container section">
            <div className="authCard">
                <div className="authTitle">
                    {mode === "login" ? "👋 Xush kelibsiz!" : "📝 Ro'yxatdan o'tish"}
                </div>
                <div className="authSub muted">
                    {mode === "login" ? "Hisobingizga kiring" : "Yangi hisob yarating"}
                </div>

                <div className="toggleRow">
                    <button className={mode === "login" ? "seg on" : "seg"} onClick={() => setMode("login")}>Kirish</button>
                    <button className={mode === "register" ? "seg on" : "seg"} onClick={() => setMode("register")}>Ro'yxatdan o'tish</button>
                </div>

                <label>Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                />

                <label>Parol</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="parol"
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                />

                <button className="btn orange full" disabled={loading} onClick={submit}>
                    {loading ? "⏳ Kutish..." : (mode === "login" ? "Kirish" : "Ro'yxatdan o'tish")}
                </button>

                {msg && <div className="warn">{msg}</div>}

                {mode === "login" && (
                    <button className="linkBtn" onClick={() => setForgotMode(true)}>
                        Parolni unutdingizmi?
                    </button>
                )}
            </div>
        </div>
    );
}