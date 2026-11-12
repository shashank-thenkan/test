"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignalMark from "@/components/SignalMark";
export default function SiteHeader() {
  const path = usePathname();
  const items = [{label:"WORKSPACE",href:"/",match:path==="/"},{label:"ARCHIVE",href:"/archive",match:path.startsWith("/archive")||path.startsWith("/transmissions")},{label:"OPERATOR",href:"/operator",match:path.startsWith("/operator")},{label:"CONNECT",href:"#connect",match:false}];
  return <header className="site-header relog-header">
    <Link className="brand-lockup" href="/" aria-label="Re.Log home"><SignalMark small/><span className="wordmark">Re<span>.</span>Log</span></Link>
    <nav className="main-nav" aria-label="Main navigation">{items.map(item=>item.label==="CONNECT"?<button key={item.label} onClick={()=>window.dispatchEvent(new Event("relog:subscribe"))}>{item.label}</button>:<Link key={item.label} className={item.match?"active":""} href={item.href}>{item.label}</Link>)}</nav>
    <button className="header-status" onClick={()=>window.dispatchEvent(new Event("relog:open"))}><SignalMark small/> <span>OLIVER / ONLINE</span></button>
    <button className="mobile-connect" onClick={()=>window.dispatchEvent(new Event("relog:subscribe"))}>CONNECT</button>
  </header>;
}
