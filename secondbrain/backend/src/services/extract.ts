import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function extractText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 SecondBrainBot" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    return (article?.textContent ?? "").replace(/\s+/g, " ").trim();
  } catch {
    return ""; // YouTube/Twitter/login-walled pages often fail; fall back to metadata only
  }
}