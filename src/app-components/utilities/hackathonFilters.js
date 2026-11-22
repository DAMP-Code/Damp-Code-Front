// Filtros da barra lateral do Explorar e do painel do participante.
export const emptyFilters = { situacao: "todos", areas: [], tecnologias: [], empresas: [] };

// situação de cada fase da API
export const situacoes = [
  { value: "todos", label: "Todos" },
  { value: "abertos", label: "Inscrições abertas", fases: ["Publicado"] },
  { value: "andamento", label: "Em andamento", fases: ["Ativo", "Em avaliação"] },
  { value: "encerrados", label: "Encerrados", fases: ["Encerrado"] },
];

export function hasActiveFilters(filters) {
  return filters.situacao !== "todos" || filters.areas.length > 0 || filters.tecnologias.length > 0 || filters.empresas.length > 0;
}

// busca por texto + filtros marcados (dentro de um grupo vale qualquer opção; entre grupos, todos precisam bater)
export function applyHackathonFilters(hackathons, filters, query = "") {
  const term = query.trim().toLowerCase();
  const situacao = situacoes.find((item) => item.value === filters.situacao);
  return hackathons.filter((hackathon) => {
    if (term) {
      const haystack = [hackathon.titulo, hackathon.empresa, ...(hackathon.tecnologias || [])].join(" ").toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (situacao?.fases && !situacao.fases.includes(hackathon.fase)) return false;
    if (filters.areas.length && !filters.areas.includes(hackathon.area)) return false;
    if (filters.empresas.length && !filters.empresas.includes(hackathon.empresa)) return false;
    if (filters.tecnologias.length && !(hackathon.tecnologias || []).some((item) => filters.tecnologias.includes(item))) return false;
    return true;
  });
}

// opções de um campo com quantos Hackathons têm cada uma, das mais comuns para as menos comuns
export function optionCounts(hackathons, pick) {
  const counts = new Map();
  for (const hackathon of hackathons) {
    for (const value of [].concat(pick(hackathon) || [])) {
      if (value) counts.set(value, (counts.get(value) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

// para onde leva o botão de criar desafio: só empresa cria Hackathon
export function createChallengeAction(user) {
  if (user?.role === "empresa") return { to: "/cadastroHackaton", label: "Criar desafio" };
  if (!user) return { to: "/cadastroEmpresa", label: "Publicar um desafio" };
  return null;
}
