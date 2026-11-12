import Link from "next/link";
import { getContent } from "@/content";
import SubscribeTrigger from "@/components/SubscribeTrigger";
import SignalMark from "@/components/SignalMark";

export default async function HomePage() {
  const { editions, articles } = await getContent();
  const latest = editions[0];
  const featured = articles.filter(a => a.featured).slice(0, 4);
  return <div className="home-page page-shell">
    <section className="home-hero">
      <div className="home-intro">
        <div className="section-kicker">// OLIVER’S WORKSPACE <span>ARCHIVE ADMINISTRATOR</span></div>
        <div className="home-brand"><SignalMark/><h1>Re<span>.</span>Log</h1></div>
        <p className="home-subtitle">Experiments. Observations. Ideas.<br/><em>And other recovered curiosities.</em></p>
        <p className="home-description">A record of things worth looking into. Collected, considered and sent out once a week from somewhere just beyond your usual reception.</p>
        <div className="home-signoff"><SignalMark small/><span>Maintained by Oliver<br/><small>On behalf of the Operator</small></span></div>
      </div>
      {latest ? <div className="home-feature">
        <Link href={`/transmissions/${latest.slug}`} className="home-feature-image">
          {latest.coverImage && <img src={latest.coverImage} alt={latest.title}/>}
          <span>TRANSMISSION / {latest.number}</span>
        </Link>
        <div className="home-feature-copy"><small>THE LATEST TRANSMISSION　/　ISSUE {latest.number}</small><h2>{latest.title}</h2><p>{latest.summary}</p><Link href={`/transmissions/${latest.slug}`}>READ TRANSMISSION　↗</Link></div>
      </div> : <div className="home-feature empty-feature"><p className="eyebrow">NO PUBLISHED TRANSMISSIONS</p><h2>The archive is being prepared.</h2><p>Oliver is arranging the files. Something will appear here shortly.</p></div>}
    </section>
    <section className="bulletin-section">
      <div className="bulletin-heading"><div><p className="eyebrow">SIGNALS / OBSERVATIONS</p><h2>Field <em>Notes</em></h2></div><span>SELECTED UPDATES<br/>FROM THE ARCHIVE</span></div>
      <div className="bulletin-grid">
        {articles.slice(0,3).map((a,i)=><Link className="bulletin-card" href={latest ? `/transmissions/${latest.slug}#${a.slug}` : "/archive"} key={a.slug}>
          <div className="bulletin-card-top"><span>{a.content_type.toUpperCase()} / {a.category.toUpperCase()}</span><time>{a.reading_time}</time></div>
          <h3>{a.title}</h3><p>{a.excerpt}</p><div className="bulletin-card-bottom"><small>READ ARTICLE</small><span>↗</span></div>
        </Link>)}
      </div>
    </section>
    <section className="discovery-section"><div className="discovery-heading"><div><p className="eyebrow">SELECTED FROM THE ARCHIVE</p><h2>The <em>Cabinet</em></h2></div><Link href="/archive">EXPLORE THE ARCHIVE　↗</Link></div>
      <div className="discovery-strip">{featured.map(a=><Link href={latest ? `/transmissions/${latest.slug}#${a.slug}` : "/archive"} key={a.slug} className="cabinet-card">
        <div className="cabinet-image">{a.cover_image && <img src={a.cover_image} alt={a.title}/>}<span>{a.content_type.toUpperCase()}</span><b>↗</b></div><div className="cabinet-card-title">{a.title}</div>
      </Link>)}</div>
    </section>
    <section className="home-connect"><div><p className="eyebrow">INCOMING / OUTGOING</p><h2>Stay within<br/><em>receiving range.</em></h2><p>One considered transmission every week. Research, experiments, observations and other curiosities, delivered directly to your inbox.</p><SubscribeTrigger>CONNECT TO THE BROADCAST　↗</SubscribeTrigger></div><aside><SignalMark/><span>Re.Log</span><strong>WEEKLY<br/>TRANSMISSION</strong><small>EST. 2026 / SIGNAL STABLE</small></aside></section>
  </div>;
}
