// O input datetime-local trabalha no horário de quem preenche, sem fuso.
// A API guarda instantes em UTC, então convertemos nos dois sentidos.

export function toDateTimeLocal(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toIsoDate(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}
