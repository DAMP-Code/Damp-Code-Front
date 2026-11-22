// id do vídeo em links do YouTube (watch?v=, youtu.be/, embed/, shorts/); outros sites não são incorporados
export function youtubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1) || null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
      const [, kind, id] = parsed.pathname.split("/");
      if (["embed", "shorts", "live"].includes(kind)) return id || null;
    }
  } catch {
    return null;
  }
  return null;
}
