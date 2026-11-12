import Link from "next/link";
import type { CSSProperties } from "react";
import type { Edition } from "@/content";

export default function EditionCard({ edition }: { edition: Edition }) {
  return (
    <Link href={`/transmissions/${edition.slug}`} className="edition-card" id={edition.slug}>
      <div className="edition-card-image" style={{ "--cover-image": `url(${edition.coverImage})` } as CSSProperties}>
        <div className="cover-image-grain" />
        <div className="edition-card-image-meta"><span>RE.LOG / {edition.number}</span><span>TRANSMISSION ARCHIVE</span></div>
        <span className="cover-image-index">{edition.number}</span>
        <span className="cover-image-caption">FIELD NOTES · {edition.date.toUpperCase()}</span>
      </div>
      <div className="edition-card-content">
        <div className="edition-card-top">
          <span>FILE // {edition.number}</span>
          <span>{edition.date}</span>
        </div>
        <h3>{edition.title}</h3>
        <p>{edition.summary}</p>
        <div className="edition-card-bottom">
          <span>{edition.articles.length.toString().padStart(2, "0")} FILES INDEXED</span>
          <span className="text-link">OPEN TRANSMISSION ↗</span>
        </div>
      </div>
    </Link>
  );
}
