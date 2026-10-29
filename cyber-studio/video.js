// Keep assigned chapter and playlist context when loading a privacy-enhanced player.
export function videoEmbed(url) {
  try {
    const u = new URL(url);
    let id;
    if (["video.cs50.io", "youtu.be"].includes(u.hostname)) id = u.pathname.split("/").filter(Boolean)[0];
    else if (["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(u.hostname))
      id = u.searchParams.get("v") || u.pathname.split("/")[2];
    else return null;
    const list = u.searchParams.get("list");
    if (!/^[\w-]{11}$/.test(id || "") && !/^[\w-]+$/.test(list || "")) return null;
    const embed = new URL(`https://www.youtube-nocookie.com/embed/${/^[\w-]{11}$/.test(id || "") ? id : "videoseries"}`);
    const raw = u.searchParams.get("start") || u.searchParams.get("t") || u.hash.replace(/^#t=/, "") || "";
    const seconds = /^\d+$/.test(raw)
      ? Number(raw)
      : [...raw.matchAll(/(\d+)(h|m|s)/g)].reduce((n, m) => n + Number(m[1]) * { h: 3600, m: 60, s: 1 }[m[2]], 0);
    if (Number.isSafeInteger(seconds) && seconds > 0) embed.searchParams.set("start", String(seconds));
    if (/^[\w-]+$/.test(list || "")) embed.searchParams.set("list", list);
    return embed.href;
  } catch {
    return null;
  }
}
