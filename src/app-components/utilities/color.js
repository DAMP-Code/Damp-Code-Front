// Cor do texto sobre um fundo escolhido pela empresa: branco ou o roxo escuro do tema, o que tiver mais contraste.
function luminance(hex) {
  const value = String(hex || "").replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(full.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DARK_TEXT = "#170A36";

export function readableTextColor(background) {
  const bg = luminance(background);
  if (bg === null) return "#FFFFFF";
  const contrastWithWhite = 1.05 / (bg + 0.05);
  const contrastWithDark = (bg + 0.05) / (luminance(DARK_TEXT) + 0.05);
  return contrastWithWhite >= contrastWithDark ? "#FFFFFF" : DARK_TEXT;
}
