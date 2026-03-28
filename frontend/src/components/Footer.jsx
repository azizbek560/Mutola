export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footGrid">
        <div className="footBrand">
          <svg viewBox="0 0 64 64" fill="none" width="28" height="28">
            <path
              d="M8 16C8 12 12 10 16 12L32 20L48 12C52 10 56 12 56 16V44C56 48 52 50 48 48L32 40L16 48C12 50 8 48 8 44V16Z"
              fill="url(#grad2)"
            />
            <defs>
              <linearGradient id="grad2" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="#ff7a00" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
          </svg>
          <span className="footName">ReadUz</span>
        </div>
        <div className="footLinks">
          <a href="#home">Bosh sahifa</a>
          <a href="#premium">Premium</a>
          <a href="#donate">Donat</a>
          <a href="https://t.me/lmutola_ibrary_bot" target="_blank" rel="noreferrer">Telegram</a>
        </div>
        <div className="muted small">© 2026 ReadUz. Barcha huquqlar himoyalangan.</div>
      </div>
    </footer>
  );
}