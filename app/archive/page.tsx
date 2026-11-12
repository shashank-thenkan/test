import type { Metadata } from "next";
import ArchiveBrowser from "@/components/ArchiveBrowser";
import { getContent } from "@/content";
export const metadata: Metadata = { title: "The Archive" };
export default async function ArchivePage(){
  const { editions, articles } = await getContent();
  return <div className="archive-page page-shell"><section className="archive-hero"><div><div className="section-kicker">// ARCHIVE <span>ISSUES / {String(editions.length).padStart(3,"0")}</span></div><h1>The Archive</h1><p>A record of all transmissions. Past investigations, experiments, notes and other documented curiosities from the Re.Log project.</p></div><aside className="archive-oliver"><span className="status-dot"/> OLIVER　/　ARCHIVE CUSTODIAN<p>The complete record.</p><p>You may browse, search,<br/>or get distracted.</p><small>› Proceed? ▉</small></aside></section><ArchiveBrowser editions={editions} articles={articles}/></div>
}
