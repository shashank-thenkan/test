"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article, Edition } from "@/content";
export default function ArchiveBrowser({ editions, articles }: { editions: Edition[]; articles: Article[] }) {
  const [query,setQuery]=useState(""); const [filter,setFilter]=useState("All"); const [sort,setSort]=useState("recent");
  const q=query.toLowerCase();
  const matchingEditions=useMemo(()=>editions.filter(e=>(`${e.title} ${e.summary} ${e.number}`).toLowerCase().includes(q)),[editions,q]);
  const matchingPieces=useMemo(()=>articles.filter(a=>(filter==="All"||a.content_type===filter)&&(`${a.title} ${a.excerpt} ${a.category} ${a.tags.join(" ")}`).toLowerCase().includes(q)).sort((a,b)=>sort==="az"?a.title.localeCompare(b.title):b.parent_issue_number.localeCompare(a.parent_issue_number)||a.title.localeCompare(b.title)),[articles,q,filter,sort]);
  const categories=["All","mini","feature","project"];
  const parentFor=(a:Article)=>editions.find(e=>e.number===a.parent_issue_number);
  return <><div className="archive-toolbar-new"><label className="archive-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search transmissions, topics or keywords…" aria-label="Search archive"/><kbd>⌘ K</kbd></label><div className="filter-label">FILTER BY FORMAT //</div><div className="filter-list">{categories.map(f=><button className={filter===f?"selected":""} key={f} onClick={()=>setFilter(f)}>{f==="All"?"All":f}</button>)}</div></div>
  <div className="archive-columns"><section className="archive-panel"><h2>// TRANSMISSIONS <small>{matchingEditions.length.toString().padStart(2,"0")} FILES</small></h2>{matchingEditions.map(e=><Link href={`/transmissions/${e.slug}`} className="transmission-row" key={e.slug}>{e.coverImage&&<img src={e.coverImage} alt=""/>}<div><small>ISSUE / {e.number}　{e.date}</small><h3>{e.title}</h3><p>{e.summary}</p></div><b>↗</b></Link>)}{!matchingEditions.length&&<p className="empty-state">No transmissions match that search.</p>}</section>
  <section className="archive-panel pieces-panel"><div className="pieces-heading"><h2>// INDEX: PIECES & NOTES</h2><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort pieces"><option value="recent">SORT: RECENT</option><option value="az">SORT: A–Z</option></select></div><p className="index-intro">Individual pieces, experiments and notes from within transmissions. A different way to explore the archive.</p>{matchingPieces.map(a=>{const e=parentFor(a);return e?<Link className="piece-row" href={`/transmissions/${e.slug}#${a.slug}`} key={a.slug}><span className="piece-thumb">{a.icon||"▧"}</span><strong>{a.title}</strong><small>{a.category}</small><em>ISSUE {e.number} ↗</em></Link>:null})}{!matchingPieces.length&&<p className="empty-state">No individual pieces found.</p>}</section></div></>;
}
