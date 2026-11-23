// Endereço da API. Sem VITE_API_URL usa a API local do `dotnet run`.
// No build do Docker ela vem vazia: as chamadas ficam relativas (/api/...) e o nginx do front repassa para a API.
export const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7092"
