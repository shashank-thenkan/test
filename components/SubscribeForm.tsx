"use client";

import { FormEvent, useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage("Please confirm that you'd like to receive the weekly transmissions.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The connection could not be established.");
      setStatus("success");
      setMessage("Excellent. Check your inbox for a confirmation message. I'll wait here.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="subscribe-form" onSubmit={submit}>
      <label className="field-label" htmlFor="receiver-email">EMAIL ADDRESS</label>
      <div className="email-row">
        <input id="receiver-email" type="email" autoComplete="email" required placeholder="receiver@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" disabled={status === "loading"}>{status === "loading" ? "CONNECTING..." : "ESTABLISH CONNECTION ↗"}</button>
      </div>
      <label className="consent-row">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>I agree to receive Re.Log's weekly email transmissions. I can unsubscribe at any time.</span>
      </label>
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(event) => setWebsite(event.target.value)} />
      {message && <p className={`form-message ${status}`} role="status">{message}</p>}
    </form>
  );
}
