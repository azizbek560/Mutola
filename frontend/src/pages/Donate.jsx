import { useState } from "react";
import { authJSON } from "../api.js";

export default function Donate({ me, go, refreshMe }) {
    const [name, setName] = useState(me?.username || "");
    const [amount, setAmount] = useState("20000");
    const [msg, setMsg] = useState("");
    const presets = ["10000", "20000", "30000", "50000", "100000"];

    async function activatePremium() {
        if (!me?.username) { setMsg("⚠️ Avval kirish qiling."); return; }
        try {
            await authJSON("/api/subscribe/", { method: "POST", body: "{}" });
            await refreshMe();
            setMsg("✅ Premium muvaffaqiyatli aktivlashtirildi!");
        } catch (e) {
            setMsg("⚠️ " + e.message);
        }
    }

    function goClick() {
        if (!me?.username) { setMsg("⚠️ Avval kirish qiling."); return; }
        if (!name.trim()) { setMsg("⚠️ Ismni kiriting."); return; }
        if (Number(amount) < 1000) { setMsg("⚠️ Kamida 1000 UZS kiriting."); return; }
        setMsg("");
        const orderId = "ORD-" + Date.now();
        window.location.hash = `#clickpay?merchant=MUTOLA&id=${orderId}&amount=${amount}`;
    }

    function goPayme() {
        if (!me?.username) { setMsg("⚠️ Avval kirish qiling."); return; }
        window.location.href = "https://payme.uz";
    }

    return (
        <div className="container section">
            <div className="sectionHead">
                <h2>💳 Donat</h2>
                <span className="muted">Loyihani qo'llab-quvvatlang</span>
            </div>

            <div className="donateGrid">
                <div className="donateCard">
                    <div className="donateTitle">Mutola loyihasini qo'llab-quvvatlang</div>
                    <p className="muted">To'lov qilgandan so'ng premium avtomatik aktivlashadi.</p>

                    <label>To'liq ism</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" />

                    <label>Miqdor (UZS)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="20000"
                    />

                    <div className="presetRow">
                        {presets.map((p) => (
                            <button
                                key={p}
                                className={amount === p ? "chip on" : "chip"}
                                onClick={() => setAmount(p)}
                            >
                                {Number(p).toLocaleString()} UZS
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

                    {msg && <div className="note">{msg}</div>}
                </div>

                <div className="donateInfo">
                    <div className="donateInfoCard">
                        <div className="donateInfoIcon">⭐</div>
                        <div className="donateInfoTitle">Premium imkoniyatlar</div>
                        <ul className="donateList">
                            <li>✅ Barcha audiokitoblar</li>
                            <li>✅ Premium kitoblar</li>
                            <li>✅ Cheksiz o'qish</li>
                        </ul>
                    </div>
                    {me?.username && !me?.is_premium && (
                        <button className="btn orange full" onClick={activatePremium}>
                            ⭐ Premiumni hozir faollashtirish (test)
                        </button>
                    )}
                    {me?.is_premium && (
                        <div className="premiumActive">✅ Siz allaqachon Premium foydalanuvchisiz!</div>
                    )}
                </div>
            </div>
        </div>
    );
}