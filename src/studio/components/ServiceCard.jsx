import CallNowButton from "./CallNowButton";

export default function ServiceCard({ title, desc }) {
  return (
    <article className="s28-service-card">
      <span className="s28-eyebrow">Service</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}