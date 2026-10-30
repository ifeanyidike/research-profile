// Preserve assigned clip bounds in a privacy-enhanced player.
export function videoEmbed(url, segment) {
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
      : /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.test(raw)
        ? [...raw.matchAll(/(\d+)(h|m|s)/g)].reduce((n, m) => n + Number(m[1]) * { h: 3600, m: 60, s: 1 }[m[2]], 0)
        : NaN;
    const start = segment?.start ?? seconds;
    const end = segment?.end ?? (u.searchParams.has("end") ? Number(u.searchParams.get("end")) : undefined);
    if (!Number.isSafeInteger(start) || start < 0) return null;
    if (end !== undefined && (!Number.isSafeInteger(end) || end <= start)) return null;
    if (start > 0) embed.searchParams.set("start", String(start));
    if (end !== undefined) embed.searchParams.set("end", String(end));
    // A single assigned clip must not pull learners into a whole playlist.
    if (!/^[\w-]{11}$/.test(id || "") && /^[\w-]+$/.test(list || "")) embed.searchParams.set("list", list);
    return embed.href;
  } catch {
    return null;
  }
}

// The watch page may ignore an end parameter; the viewing guide still states
// where to stop. Use the same validated identity/start as the embedded player.
export function videoLink(url, segment) {
  const embed = videoEmbed(url, segment);
  if (!embed) return null;
  const parsed = new URL(embed);
  const id = parsed.pathname.split("/").pop();
  if (id === "videoseries") return null;
  const watch = new URL("https://www.youtube.com/watch");
  watch.searchParams.set("v", id);
  if (parsed.searchParams.has("start")) watch.searchParams.set("t", parsed.searchParams.get("start") + "s");
  return watch.href;
}
