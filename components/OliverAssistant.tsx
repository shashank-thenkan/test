"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignalMark from "@/components/SignalMark";

type Message = { id: number; from: "oliver" | "visitor"; text: string; links?: { label: string; href: string }[] };
const FIRST = "Oh. That's unexpected. You're not supposed to have access to this directory. Well, the connection is established now. There's little point making a fuss about it. I'm Oliver. I look after this archive, which belongs to the Operator. He has a habit of becoming intensely preoccupied with things for reasons that aren't always immediately apparent. I've taken the liberty of organising some of his research, experiments, observations and creative projects into regular weekly transmissions. Most of it would otherwise remain sitting in a folder somewhere. A bit of a waste, really. Shall I show you around?";
const RETURNING = ["Oh, hello again. I see you've found your way back. The archive has been behaving itself, more or less.", "Back again. Excellent. I was just checking whether anyone had noticed the filing system. Nobody has. Yet.", "Welcome back. There are new things to inspect, assuming your curiosity remains operational."];
const SUGGESTIONS = ["/latest", "/archive", "/random", "/help"];

function answer(input: string, pathname: string, editions: {slug:string;title:string;summary:string;number:string}[]): Message {
  const v = input.toLowerCase().trim();
  const published = editions;
  const latest = published[0];
  const make = (text: string, links?: Message["links"]): Message => ({ id: Date.now() + Math.random(), from: "oliver", text, links });
  if (v === "/help" || v.includes("what can you do")) return make("I can help you navigate the archive, locate a transmission, explain the publication or arrange for future transmissions to reach you. Try /latest, /archive, /random, /about or /connect. You may also simply ask.");
  if (v === "/latest" || v.includes("latest") || v.includes("newest")) return latest ? make(`The latest published transmission is “${latest.title}”. I've left it somewhere reasonably easy to find.`, [{label:"OPEN LATEST TRANSMISSION",href:`/transmissions/${latest.slug}`}]) : make("No published transmissions yet. A temporary administrative embarrassment.");
  if (v === "/archive" || v.includes("archive") || v.includes("previous log")) return make("The archive contains the transmissions I've assembled so far. Each Log contains its original articles and any supplementary material worth retaining.", [{label:"BROWSE THE ARCHIVE",href:"/archive"}]);
  if (v === "/random" || v.includes("surprise") || v.includes("random")) { const pick = published[Math.floor(Math.random()*published.length)]; return pick ? make(`An arbitrary selection: “${pick.title}”. I make no promises about the rabbit hole.`,[{label:"OPEN THIS LOG",href:`/transmissions/${pick.slug}`}]) : make("The archive is not sufficiently populated for random exploration. I refuse to invent a file."); }
  if (v === "/about" || v.includes("what is re.log") || v.includes("what is relog")) return make("Re.Log is an independent collection of research, experiments, observations, ideas and creative pursuits, assembled into regular transmissions. I maintain the archive. The Operator supplies most of the interesting material.");
  if (v === "/operator" || v.includes("who is the operator")) return make("The Operator is responsible for most of the material here. Curious, easily distracted, and occasionally capable of spending an unreasonable amount of time on a question with no obvious practical application. I find this useful.",[{label:"VIEW OPERATOR FILE",href:"/operator"}]);
  if (v === "/connect" || v.includes("subscribe") || v.includes("email") || v.includes("receive transmissions")) return make("A sensible decision. I can arrange for the weekly transmissions to reach you. Use the receiver registration below; I require very little, by human standards.",[{label:"OPEN RECEIVER REGISTRATION",href:"#subscribe"}]);
  if (v === "/status" || v.includes("status")) return make(`Connection stable. Current location: ${pathname === "/" ? "Workspace" : pathname}. Archive accessible. Operator lucidity: variable. My own status: entirely satisfactory.`);
  if (/^(hi|hello|hey)(|\s)/.test(v)) return make("Hello. Good to have you here. Are you looking for something in particular, or shall I make a recommendation?");
  if (v.includes("pasta") || v.includes("experiment")) return latest ? make("The experiments are filed inside their original transmissions. The latest Log is a reasonable place to begin.",[{label:"OPEN LATEST LOG",href:`/transmissions/${latest.slug}`}]) : make("I would direct you to the archive, but it is still being populated.");
  return make("I don't have a neatly indexed answer for that yet. I can, however, help you explore the archive or explain how this little operation works.",[{label:"EXPLORE THE ARCHIVE",href:"/archive"},{label:"WHAT IS RE.LOG?",href:"/about"}]);
}

function TypedText({ text }: { text: string }) {
  const [visible, setVisible] = useState("");
  useEffect(() => { let i=0; setVisible(""); const timer=window.setInterval(()=>{ i=Math.min(i+3,text.length); setVisible(text.slice(0,i)); if(i>=text.length) window.clearInterval(timer); },12); return ()=>window.clearInterval(timer); },[text]);
  return <>{visible}{visible.length < text.length && <span className="oliver-output-cursor" aria-hidden="true"/>}</>;
}

export default function OliverAssistant({ editions = [] }: { editions?: {slug:string;title:string;summary:string;number:string}[] }) {
  const pathname = usePathname();
  const [ready,setReady]=useState(false); const [open,setOpen]=useState(false); const [intro,setIntro]=useState(false); const [minimized,setMinimized]=useState(false);
  const [messages,setMessages]=useState<Message[]>([]); const [input,setInput]=useState(""); const [typing,setTyping]=useState(false); const [subscribe,setSubscribe]=useState(false);
  const [email,setEmail]=useState(""); const [consent,setConsent]=useState(false); const [busy,setBusy]=useState(false); const [status,setStatus]=useState("");
  const endRef=useRef<HTMLDivElement>(null); const inputRef=useRef<HTMLInputElement>(null); const timerRef=useRef<number|undefined>(undefined); const idRef=useRef(0);
  const addMessage=(from:Message["from"],text:string,links?:Message["links"])=>({id:++idRef.current,from,text,links});

  useEffect(()=>{
    // Migrate the previous intro flag. Build 10 introduced a new key, which
    // accidentally made existing visitors look like first-time visitors again.
    const alreadyIntroduced =
      localStorage.getItem("relog_intro_seen_v3") === "1" ||
      localStorage.getItem("relog_intro_seen_v2") === "1";
    setReady(true);
    if (alreadyIntroduced) {
      localStorage.setItem("relog_intro_seen_v3", "1");
      const saved = sessionStorage.getItem("relog_oliver_messages");
      if (saved) {
        try { setMessages(JSON.parse(saved)); }
        catch { sessionStorage.removeItem("relog_oliver_messages"); }
      }
    } else {
      // Mark first contact immediately, not only when the visitor dismisses it.
      // Refreshing during the introduction must not replay the first-contact scene.
      localStorage.setItem("relog_intro_seen_v3", "1");
      localStorage.setItem("relog_intro_seen_v2", "1");
      setOpen(true);
      setIntro(true);
      setMessages([addMessage("oliver", FIRST)]);
    }
    return ()=>{ if(timerRef.current) window.clearTimeout(timerRef.current); };
  },[]);
  useEffect(()=>{ if(ready && messages.length) sessionStorage.setItem("relog_oliver_messages",JSON.stringify(messages)); },[messages,ready]);
  useEffect(()=>{ if(open) endRef.current?.scrollIntoView({behavior:"smooth",block:"end"}); },[messages,open,typing,subscribe,status]);
  useEffect(()=>{ const onOpen=()=>{setOpen(true);setMinimized(false);setIntro(false);setSubscribe(false);setMessages(old=>[...old,addMessage("oliver",returningLine())]);}; const onSubscribe=()=>{setOpen(true);setMinimized(false);setIntro(false);setSubscribe(true);setStatus("");}; window.addEventListener("relog:open",onOpen);window.addEventListener("relog:subscribe",onSubscribe);return()=>{window.removeEventListener("relog:open",onOpen);window.removeEventListener("relog:subscribe",onSubscribe);};},[messages.length]);

  function returningLine() {
    const key = "relog_oliver_reopen_count";
    const count = Number(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(count + 1));
    return RETURNING[count % RETURNING.length];
  }
  function launch() {
    const wasAlreadyOpen = open && !minimized;
    setOpen(true);
    setMinimized(false);
    setIntro(false);
    setSubscribe(false);
    if (!wasAlreadyOpen) {
      setMessages(old => [...old, addMessage("oliver", old.length ? returningLine() : RETURNING[0])]);
    }
    window.setTimeout(() => inputRef.current?.focus(), 100);
  }
  function finishIntro(){
    localStorage.setItem("relog_intro_seen_v3","1");
    localStorage.setItem("relog_intro_seen_v2","1");
    setIntro(false);
    setMinimized(true);
  }
  function send(raw:string){const clean=raw.trim();if(!clean||typing)return;setMessages(old=>[...old,addMessage("visitor",clean)]);setInput("");setTyping(true);timerRef.current=window.setTimeout(()=>{setMessages(old=>[...old,answer(clean,pathname,editions)]);setTyping(false);},550);}
  function submit(e:FormEvent){e.preventDefault();send(input);}
  function command(c:string){if(c==="/connect"){setSubscribe(true);setStatus("");return;}send(c);}
  async function submitSubscription(e:FormEvent){e.preventDefault();setBusy(true);setStatus("");try{const r=await fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,consent,website:""})});const data=await r.json();if(!r.ok)throw new Error(data.error||"The connection failed.");setStatus("Your address has been entered into the receiver registry. Please check your inbox for confirmation.");setEmail("");setMessages(old=>[...old,addMessage("oliver","Excellent. A new receiver. I shall endeavour to behave responsibly with this information.")]);}catch(err){setStatus(err instanceof Error?err.message:"Something went wrong.");}finally{setBusy(false);}}
  if(!ready)return null;
  return <div className={`oliver-widget ${open&&!minimized?"is-open":""} ${intro?"intro-mode":""}`}>
    {(!open||minimized)?<button className="oliver-launcher" onClick={launch}><i className="status-dot"/><SignalMark small/> OLIVER <small>{messages.length?"REOPEN INTERFACE":"AVAILABLE"}</small></button>:<>
      {intro&&<button className="oliver-backdrop" aria-label="Enter workspace" onClick={finishIntro}/>}
      <section className="oliver-panel" aria-label="Oliver remote interface">
        <header className="oliver-panel-head"><div className="oliver-avatar"><SignalMark/></div><div className="oliver-head-copy"><strong>OLIVER <span>v3.7</span></strong><small>REMOTE INTERFACE / ONLINE</small></div><button className="icon-button" onClick={()=>{setIntro(false);setMinimized(true);}} aria-label="Minimise Oliver">−</button><button className="icon-button" onClick={()=>{setIntro(false);setOpen(false);setMinimized(false);}} aria-label="Close Oliver">×</button></header>
        <div className="oliver-messages" aria-live="polite">{messages.map(m=><div className={`message ${m.from}`} key={m.id}><span className="message-label">{m.from==="oliver"?"OLIVER":"YOU"}</span><p>{m.from==="oliver"?<TypedText text={m.text}/>:m.text}</p>{m.links?.map(l=>l.href==="#subscribe"?<button className="message-link" key={l.label} onClick={()=>setSubscribe(true)}>{l.label} ↗</button>:<Link className="message-link" href={l.href} key={l.label}>{l.label} ↗</Link>)}</div>)}{typing&&<div className="message oliver is-typing"><span className="message-label">OLIVER</span><p>Considering that<span className="typing-dots">...</span></p></div>}<div ref={endRef}/></div>
        {subscribe?<form className="oliver-subscribe" onSubmit={submitSubscription} id="subscribe"><p className="subscribe-prompt">Excellent. You'd like to receive the transmissions. I only require what you humans call an email address. I promise to use it for the stated purpose and not for anything especially interesting.</p><label>YOUR EMAIL ADDRESS<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label className="consent-line"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I agree to receive Re.Log's weekly transmissions. I can unsubscribe at any time.</label><button type="submit" disabled={busy||!consent}>{busy?"REGISTERING…":"ADD ME TO THE RECEIVERS　↗"}</button>{status&&<p className="subscribe-status">{status}</p>}<button type="button" className="back-chat" onClick={()=>setSubscribe(false)}>RETURN TO OLIVER</button></form>:<><div className="quick-commands">{SUGGESTIONS.map(c=><button key={c} onClick={()=>command(c)} disabled={typing}>{c}</button>)}<button onClick={()=>command("/connect")} disabled={typing}>/connect</button></div><form className="oliver-input" onSubmit={submit}><span className="prompt-symbol">›</span><input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter a command or ask Oliver…" aria-label="Message Oliver" disabled={typing}/><button type="submit" disabled={!input.trim()||typing} aria-label="Send message">↗</button></form></>}
        {intro&&<div className="oliver-intro-actions"><span>REMOTE INTRODUCTION / FIRST CONTACT</span><button onClick={finishIntro}>ENTER WORKSPACE ↗</button></div>}
      </section>
    </>}
  </div>;
}
