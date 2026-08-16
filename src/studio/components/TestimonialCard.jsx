export default function TestimonialCard({ name, role, photo, rating, text }) {
  return (
    <article className="s28-testimonial">
      <div className="s28-stars" aria-label={`${rating} out of 5 stars`}>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
      <p className="s28-testimonial-text">“{text}”</p>
      <div className="s28-testimonial-head">
        <img src={photo} alt={name} width={52} height={52} loading="lazy" decoding="async" />
        <div>
          <div className="s28-testimonial-name">{name}</div>
          <div className="s28-testimonial-role">{role}</div>
        </div>
      </div>
    </article>
  );
}
