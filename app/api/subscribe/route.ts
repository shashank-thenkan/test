import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const consent = body.consent === true;
    const honeypot = typeof body.website === "string" ? body.website : "";

    // Quietly accept honeypot submissions without forwarding them.
    if (honeypot) return NextResponse.json({ ok: true });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "That email address doesn't look quite right." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Please confirm that you'd like to receive the weekly transmissions." }, { status: 400 });
    }

    const apiToken = process.env.MAILERLITE_API_TOKEN;
    const groupId = process.env.MAILERLITE_GROUP_ID;

    if (!apiToken || !groupId) {
      return NextResponse.json({ error: "The receiver registry isn't connected yet. Please try again later." }, { status: 503 });
    }

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email,
        status: "unconfirmed",
        groups: [groupId]
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      console.error("MailerLite subscription error:", response.status, detail);
      if (response.status === 422) {
        return NextResponse.json({ error: "MailerLite couldn't accept that address. Check it and try again." }, { status: 422 });
      }
      return NextResponse.json({ error: "The connection couldn't be completed just now. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: "Confirmation requested." });
  } catch (error) {
    console.error("Subscription route error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
