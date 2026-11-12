"use client";
import { useEffect, useState } from "react";
import SignalMark from "@/components/SignalMark";
export default function ConnectionIntro(){
 const [show,setShow]=useState(false);
 useEffect(()=>{const key="relog_connection_seen";if(!sessionStorage.getItem(key)){setShow(true);const t=setTimeout(()=>{setShow(false);sessionStorage.setItem(key,"1")},1900);return()=>clearTimeout(t)}},[]);
 if(!show)return null;
 return <div className="connection-intro" aria-label="Establishing connection"><div className="connection-mark"><SignalMark/><span>Re.Log</span></div><div className="connection-lines"><p>[ INITIALISING REMOTE CONNECTION ]</p><p>[ LOCATING ARCHIVE DIRECTORY ]</p><p>[ HELLO, OLIVER ] <span>...</span></p></div><div className="connection-progress"><i/></div><small>UNRECOGNISED DEVICE / ACCESS GRANTED</small></div>
}
