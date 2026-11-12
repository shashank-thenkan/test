import SignalMark from "@/components/SignalMark";
import Link from "next/link";
export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand"><SignalMark small/><div><span className="footer-wordmark">Re.Log</span><p>An independent weekly transmission.</p></div></div>
    <div className="footer-meta"><span>ARCHIVE ACCESS / WEEKLY BROADCASTS</span><span>© 2026 RE.LOG</span><Link href="/archive">EXPLORE THE ARCHIVE ↗</Link></div>
  </footer>;
}
