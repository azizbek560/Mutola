import { useEffect, useState } from "react";
import { authJSON } from "../api.js";

export default function Profile({ me, refreshMe, go }) {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [passMsg, setPassMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("info");

    async function loadProfile() {
        if (!me?.username) return;
        try {
            const data = await authJSON(`/api/auth/profile/${me.username}/`, { method: "GET" });
            setProfile(data);
            setFullName(data.full_name || "");
            setBio(data.bio || "");
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => { loadProfile(); }, [me]);

    async function saveProfile() {
        setLoading(true); setMsg("");
        try {
            await authJSON("/api/auth/profile/update/", {
                method: "PUT",
                body: JSON.stringify({ full_name: fullName, bio }),
            });
            setMsg("✅ Profil yangilandi");
            setEditMode(false);
            await loadProfile();
            await refreshMe();
        } catch (e) {
            setMsg("⚠️ " + e.message);
        } finally {
            setLoading(false);
        }
    }

    async function changePassword() {
        setPassMsg("");
        if (!oldPassword || !newPassword) { setPassMsg("⚠️ Ikkala maydonni to'ldiring"); return; }
        try {
            await authJSON("/api/auth/change-password/", {
                method: "PUT",
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            setPassMsg("✅ Parol muvaffaqiyatli o'zgartirildi");
            setOldPassword(""); setNewPassword("");
        } catch (e) {
            setPassMsg("⚠️ " + e.message);
        }
    }

    async function activatePremium() {
        try {
            await authJSON("/api/subscribe/", { method: "POST", body: "{}" });
            await refreshMe();
            setMsg("✅ Premium aktivlashtirildi!");
        } catch (e) {
            setMsg("⚠️ " + e.message);
        }
    }

    if (!me?.username) return (
        <div className="container section">
            <div className="authCard">
                <div className="authTitle">Profil</div>
                <p className="muted">Profilni ko'rish uchun kirish qiling.</p>
                <button className="btn orange" onClick={() => go("login")}>Kirish</button>
            </div>
        </div>
    );

    return (
        <div className="container section">
            <div className="profileCard">
                <div className="profileTop">
                    <div className="profileAvatar">
                        {profile?.avatar_url
                            ? <img src={profile.avatar_url} alt="avatar" />
                            : <div className="avatarPh">{me.username[0].toUpperCase()}</div>}
                    </div>
                    <div className="profileInfo">
                        <div className="profileName">{profile?.full_name || me.username}</div>
                        <div className="profileUsername muted">@{me.username}</div>
                        <div className="profileBadges">
                            {me.is_premium
                                ? <span className="pill premium">⭐ Premium</span>
                                : <span className="pill free">Free</span>}
                            <span className="pill">{profile?.comments_count || 0} izoh</span>
                            <span className="pill">{profile?.bookmarks_count || 0} saqlangan</span>
                        </div>
                    </div>
                </div>

                <div className="tabs">
                    <button className={tab === "info" ? "tab on" : "tab"} onClick={() => setTab("info")}>Ma'lumot</button>
                    <button className={tab === "password" ? "tab on" : "tab"} onClick={() => setTab("password")}>Parol</button>
                    <button className={tab === "premium" ? "tab on" : "tab"} onClick={() => setTab("premium")}>Premium</button>
                </div>

                {tab === "info" && (
                    <div className="profileSection">
                        {!editMode ? (
                            <>
                                <div className="profileField">
                                    <span className="fieldLabel">To'liq ism:</span>
                                    <span>{profile?.full_name || "Kiritilmagan"}</span>
                                </div>
                                <div className="profileField">
                                    <span className="fieldLabel">Bio:</span>
                                    <span>{profile?.bio || "Kiritilmagan"}</span>
                                </div>
                                <button className="btn blue" onClick={() => setEditMode(true)}>✏️ Tahrirlash</button>
                            </>
                        ) : (
                            <>
                                <label>To'liq ism</label>
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="To'liq ismingiz" />
                                <label>Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="O'zingiz haqida..."
                                    className="bioInput"
                                />
                                <div className="btnRow">
                                    <button className="btn orange" disabled={loading} onClick={saveProfile}>
                                        {loading ? "..." : "✅ Saqlash"}
                                    </button>
                                    <button className="btn ghost" onClick={() => setEditMode(false)}>Bekor qilish</button>
                                </div>
                            </>
                        )}
                        {msg && <div className="note">{msg}</div>}
                    </div>
                )}

                {tab === "password" && (
                    <div className="profileSection">
                        <label>Eski parol</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Eski parol" />
                        <label>Yangi parol</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yangi parol" />
                        <button className="btn orange" onClick={changePassword}>🔑 Parolni o'zgartirish</button>
                        {passMsg && <div className="note">{passMsg}</div>}
                    </div>
                )}

                {tab === "premium" && (
                    <div className="profileSection">
                        {me.is_premium ? (
                            <div className="premiumActive">
                                <div className="premiumIcon">⭐</div>
                                <div className="premiumTitle">Premium faol!</div>
                                <p className="muted">Siz barcha premium imkoniyatlardan foydalana olasiz.</p>
                            </div>
                        ) : (
                            <>
                                <p className="muted">Premium obuna orqali audiokitoblar va premium kitoblarga kirish imkoni ochiladi.</p>
                                <button className="btn orange" onClick={activatePremium}>⭐ Premiumni faollashtirish</button>
                                <button className="btn blue" style={{ marginTop: 10 }} onClick={() => go("donate")}>💳 Donat orqali to'lash</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}