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
