// The ArtSuite download behind a code (public/artsuite/). Right code: the newest ArtSuite DMG from the feed on Julian's home
// PC, streamed through here (Windows: a redirect to the newest launcher zip). Wrong code: back to the page with ?wrong. Codes are not case sensitive.
// The repo is public, so only a salted PBKDF2 hash of the code is here. New code:
//   node -e 'const c=require("crypto"),s=c.randomBytes(16).toString("hex");console.log(s,c.pbkdf2Sync("NEWCODE".toLowerCase(),s,200000,32,"sha256").toString("hex"))'
// ponytail: the feed itself is still public; this gates the link people are given, not the files.
import { pbkdf2Sync, timingSafeEqual } from "node:crypto";

const FEED = "https://dispatch.julianmehu.com/falconer/artsuite/";
const UA = { "User-Agent": "Falconer/1.0 CFNetwork" }; // Cloudflare refuses default user agents

const SALT = "a5fd1bc089144ad627b5a1d3e69efbb2";
const HASH = Buffer.from("b7aa2103479ee52d3f512a3dab404afc6a1ea6f03ded870878bf903af7770e3a", "hex");
const matches = (code) => timingSafeEqual(pbkdf2Sync(code.trim().toLowerCase(), SALT, 200000, 32, "sha256"), HASH);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.redirect(303, "/artsuite/");
  if (!matches(String(req.body?.code ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slows guessing
    return res.redirect(303, "/artsuite/?wrong");
  }
  try {
    const manifest = await (await fetch(FEED + "manifest.json", { headers: UA })).json();
    const app = manifest.apps.find((a) => a.id === "artsuite");
    // Windows zip is ~90 MB, over Vercel's 4.5 MB response cap: send the browser to the feed file directly.
    if (req.body?.os === "windows") {
      if (!app.windows) return res.status(503).send("The Windows version isn't available yet.");
      return res.redirect(303, FEED + app.windows.zip);
    }
    const dmg = await fetch(FEED + app.dmg, { headers: UA });
    if (!dmg.ok) throw new Error(`feed answered ${dmg.status}`);
    const body = Buffer.from(await dmg.arrayBuffer());
    res.setHeader("Content-Type", "application/x-apple-diskimage");
    res.setHeader("Content-Disposition", `attachment; filename="ArtSuite-${app.version}.dmg"`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(body);
  } catch (e) {
    console.error("artsuite download", e);
    return res.status(503).send("The download server is offline right now. Please try again later.");
  }
}
