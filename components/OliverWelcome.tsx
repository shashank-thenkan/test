"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Position = { x: number; y: number };

export default function OliverWelcome() {
  const [mode, setMode] = useState<"welcome" | "about">("welcome");
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const drag = useRef<{ pointerX: number; pointerY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const place = () => setPosition({
      x: window.innerWidth <= 760 ? 12 : Math.max(260, Math.min(window.innerWidth * 0.19, window.innerWidth - 540 - 16)),
      y: window.innerWidth <= 760 ? 76 : Math.max(100, Math.min(window.innerHeight * 0.15, window.innerHeight - 500))
    });
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!drag.current) return;
      const width = Math.min(520, window.innerWidth - 40);
      const height = Math.min(650, window.innerHeight - 100);
      setPosition({
        x: Math.max(8, Math.min(window.innerWidth - width - 8, drag.current.originX + event.clientX - drag.current.pointerX)),
        y: Math.max(72, Math.min(window.innerHeight - height - 8, drag.current.originY + event.clientY - drag.current.pointerY))
      });
    };
    const stop = () => { drag.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
  }, []);

  if (!mounted || !position) return null;

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { pointerX: event.clientX, pointerY: event.clientY, originX: position.x, originY: position.y };
  };

  return createPortal(
    minimized ? (
      <button className="oliver-window-launcher" onClick={() => setMinimized(false)} aria-label="Reopen Oliver window">
        <span className="status-dot" /> OLIVER <small>REMOTE INTERFACE</small> <b>↗</b>
      </button>
    ) : (
      <section className="welcome-console oliver-independent-window" aria-label="Oliver's independent welcome window" style={{ left: position.x, top: position.y }}>
        <div className="welcome-console-head oliver-window-dragbar" onPointerDown={startDrag}>
          <div className="console-orb">O<span>.</span></div>
          <div><b>OLIVER v3.7</b><small>REMOTE INTERFACE // ACTIVE</small></div>
          <button onClick={() => setMinimized(true)} aria-label="Minimise Oliver window">−</button>
        </div>
        <div className="welcome-console-body">
          {mode === "welcome" ? <><h2>Oh. Hello.</h2><p>I wasn't expecting an external connection. Although, technically, I should have anticipated the possibility.</p><p>This is my workspace. I maintain the transmissions, run experiments, and keep a record of other curiosities.</p><p>Would you like me to show you around?</p><div className="welcome-actions"><Link href="/archive">SHOW ME AROUND <b>→</b></Link><button onClick={() => setMode("about")}>WHAT IS RE.LOG? <b>→</b></button><Link href="/transmissions/26-14">I’LL EXPLORE MYSELF <b>→</b></Link></div></> : <><h2>A weekly record.</h2><p>Re.Log is an independent weekly publication. Research, experiments, observations, creative projects and other things worth spending a little more time on.</p><p>The email is the weekly dispatch. This workspace is where the archive and its supplementary material live.</p><div className="welcome-actions"><Link href="/archive">EXPLORE THE ARCHIVE <b>→</b></Link><button onClick={() => setMode("welcome")}>BACK <b>↶</b></button></div></>}
        </div>
      </section>
    ),
    document.body
  );
}
