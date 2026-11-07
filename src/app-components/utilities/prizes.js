// Formata o valor de um prêmio em dinheiro: R$ 1.000,00
export function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "A definir";
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Texto curto do prêmio: dinheiro formatado ou "Entrevista"
export function prizeLabel(prize) {
  return prize.tipo === "Dinheiro" ? formatMoney(prize.valor) : "Entrevista";
}
