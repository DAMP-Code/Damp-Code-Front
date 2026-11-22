// Formata o valor de um prêmio em dinheiro: R$ 1.000,00
export function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "A definir";
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Soma dos prêmios em dinheiro. Sem lista de prêmios, vale o campo antigo de premiação (o 1º lugar).
export function totalPrize(hackathon) {
  const money = (hackathon.premios || []).filter((prize) => prize.tipo === "Dinheiro");
  if (money.length > 0) return money.reduce((sum, prize) => sum + (Number(prize.valor) || 0), 0);
  return Number(hackathon.premiacao) || 0;
}

// Texto curto do prêmio: dinheiro formatado ou "Entrevista"
export function prizeLabel(prize) {
  return prize.tipo === "Dinheiro" ? formatMoney(prize.valor) : "Entrevista";
}
