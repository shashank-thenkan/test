"use client";
import type { ReactNode } from "react";
export default function SubscribeTrigger({children}:{children:ReactNode}){return <button className="subscribe-trigger" onClick={()=>window.dispatchEvent(new Event("relog:subscribe"))}>{children}</button>}
