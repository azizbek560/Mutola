export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footGrid">
        <div className="footBrand">
          <span className="logoBadge">R</span>
          <span className="footName">Readuz</span>
        </div>
        <div className="footLinks">
          <a href="#home">Bosh sahifa</a>
          <a href="#premium">Premium</a>
          <a href="#donate">Donat</a>
          <a href="https://t.me/lmutola_ibrary_bot" target="_blank" rel="noreferrer">Telegram</a>
        </div>
        <div className="muted small">© 2026 Readuz. Barcha huquqlar himoyalangan.</div>
      </div>
    </footer>
  );
}