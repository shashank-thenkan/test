import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OliverAssistant from "@/components/OliverAssistant";
import { getContent } from "@/content";

export const metadata: Metadata = {
  title: { default: "Re.Log — Independent Weekly Transmissions", template: "%s — Re.Log" },
  description: "Research, experiments, observations and creative pursuits, collected into a weekly transmission.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://relog.example")
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { editions } = await getContent();
  const assistantEditions = editions.map(({slug,title,summary,number})=>({slug,title,summary,number}));
  return <html lang="en"><body><div className="site-shell"><SiteHeader/><main>{children}</main><SiteFooter/></div><OliverAssistant editions={assistantEditions}/></body></html>;
}
