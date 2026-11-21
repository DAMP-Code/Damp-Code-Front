// Cores que a pessoa pode escolher para o avatar (as do tema e mais algumas vivas).
export const avatarColors = [
  { value: "#6C48C5", label: "Roxo" },
  { value: "#C68FE6", label: "Lilás" },
  { value: "#FFEA00", label: "Amarelo" },
  { value: "#38BDF8", label: "Azul" },
  { value: "#3FB950", label: "Verde" },
  { value: "#F97316", label: "Laranja" },
  { value: "#EC4899", label: "Rosa" },
  { value: "#EF4444", label: "Vermelho" },
];

export const defaultAvatarColor = avatarColors[0].value;

// iniciais para o avatar: "Ana Ribeiro" -> "AR"; e-mail ou nome vazio também funcionam
export function initials(name) {
  const parts = String(name || "").replace(/@.*/, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// Recorta a foto no centro em quadrado e reduz para size×size (JPEG), devolvendo um data URL pequeno.
// Assim uma foto de celular de vários MB vira algo perto de 30 KB antes de ir para a API.
export function resizeAvatar(file, size = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Este arquivo não é uma imagem válida."));
      image.onload = () => {
        const side = Math.min(image.width, image.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas
          .getContext("2d")
          .drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
