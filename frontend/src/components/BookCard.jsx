export function Stars({ value }) {
  const v = Math.round((value || 0) * 10) / 10;
  const full = Math.round(value || 0);
  return (
    <span className="stars" title={String(v)}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={i <= full ? "on" : "off"}>?</span>
      ))}
      <span className="muted small" style={{ marginLeft: 6 }}>
        {v ? v.toFixed(1) : "?"}
      </span>
    </span>
  );
}

export default function BookCard({ b, onOpen }) {
  return (
    <button className="bookCard" onClick={() => onOpen(b.id)}>
      <div className="cover">
        {b.cover_url
          ? <img src={b.cover_url} alt={b.title} loading="lazy" />
          : <div className="ph"></div>}
        {b.is_premium
          ? <span className="tag premium">Premium</span>
          : <span className="tag free">Free</span>}
      </div>
      <div className="meta">
        <div className="title">{b.title}</div>
        <div className="author muted">{b.author || "Noma'lum"}</div>
        <div className="row" style={{ marginTop: 4 }}>
          <span className="small muted">{b.genre_name}</span>
          <span className="small muted">{b.views} ??</span>
        </div>
        <div className="row" style={{ marginTop: 4 }}>
          <Stars value={b.rating_avg} />
          <span className="small muted">({b.rating_count || 0})</span>
        </div>
      </div>
    </button>
  );
}
