import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/content";
export const metadata: Metadata = { title: "Experiments" };
export default async function ExperimentsPage() {
 const {editions,articles}=await getContent();
 const experiments=articles.filter(a=>/experiment|test|field study/i.test(`${a.category} ${a.title}`)||a.content_type==="project");
 return <div className="section-wrap page-section directory-page"><div className="page-kicker"><span>DIRECTORY: /EXPERIMENTS</span><span>ACCESS: PUBLIC</span></div><div className="page-intro"><p className="eyebrow">IDEAS, TESTS &amp; RESULTS</p><h1>Experiments</h1><p>Small investigations into ordinary things. Methods, observations, results and the occasional question that turns out to be more interesting than expected.</p></div><div className="archive-toolbar"><span>{String(experiments.length).padStart(2,"0")} EXPERIMENT FILES</span><span>NEWEST FIRST</span></div>{experiments.length?<div className="directory-entry-list">{experiments.map(a=>{const e=editions.find(x=>x.number===a.parent_issue_number);return e?<Link className="directory-entry" href={`/transmissions/${e.slug}#${a.slug}`} key={a.slug}><div className="directory-entry-meta"><span>{a.category}</span><span>{a.reading_time} READ</span></div><h2>{a.title}</h2><p>{a.excerpt}</p><span className="directory-entry-link">OPEN FIELD NOTE <b>↗</b></span></Link>:null})}</div>:<p className="directory-empty">No experiment files have been indexed yet. Oliver is still sorting the notebooks.</p>}<div className="directory-backlinks"><Link href="/archive">VIEW ALL TRANSMISSIONS ↗</Link><Link href="/library">OPEN THE LIBRARY ↗</Link></div></div>;
}
