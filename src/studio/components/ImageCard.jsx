export default function ImageCard({ src, alt, label, onClick }) {
  return (
    <button type="button" className="s28-tile" onClick={onClick} aria-label={alt}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {label ? <span className="s28-tile-label">{label}</span> : null}
    </button>
  );
}