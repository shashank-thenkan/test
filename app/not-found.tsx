import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-wrap not-found">
      <p className="eyebrow">ERROR 404 / FILE NOT FOUND</p>
      <h1>That file seems<br /><em>to have moved.</em></h1>
      <p>I've checked the index twice. It isn't here. I would blame the Operator, but that would be premature.</p>
      <Link className="button-primary" href="/archive">RETURN TO THE ARCHIVE ↗</Link>
    </div>
  );
}
