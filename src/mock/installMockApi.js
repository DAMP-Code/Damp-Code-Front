import { seedDatabase } from "./seed";

const API = "https://localhost:7092";
const STORAGE_KEY = "damp-mock-db";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function loadDatabase() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
    return structuredClone(seedDatabase);
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
    return structuredClone(seedDatabase);
  }
}

function saveDatabase(database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function isActive(status) {
  return status === true || status === "true" || status === "ativo" || status === "Ativo";
}

function toHackathon(body, id) {
  return {
    hackathonId: id,
    titulo: body.Titulo || body.titulo || "Sem título",
    descricao: body.Descricao || body.descricao || "",
    empresa: body.Empresa || body.empresa || "",
    area: body.Area || body.area || "",
    tecnologias: body.Tecnologias || body.tecnologias || [],
    metodo: body.Metodo || body.metodo || "",
    premiacao: Number(body.Premiacao ?? body.premiacao ?? 0),
    corPrincipal: body.corPrincipal || "#6C48C5",
    corSecundaria: body.corSecundaria || "#C68FE6",
    corFundo: body.corFundo || "#170A36",
    logo: body.Logo || body.logo || "",
    dataFinal: body.DataFinal || body.dataFinal || new Date().toISOString(),
    status: isActive(body.status),
    participantes: body.participantes || "0 pessoas já entraram",
  };
}

function handle(path, method, body) {
  const database = loadDatabase();

  if (method === "POST" && path === "/api/Auth/login") {
    const user = database.users.find(
      (item) =>
        item.email.toLowerCase() === String(body?.email || "").toLowerCase() &&
        item.password === body?.password,
    );
    if (!user) return json({ message: "Email ou senha inválidos" }, 401);
    return json(publicUser(user));
  }

  if (method === "POST" && path === "/api/Auth/register/participante") {
    const email = String(body?.email || "").toLowerCase();
    if (database.users.some((item) => item.email.toLowerCase() === email)) {
      return json({ message: "Email já cadastrado" }, 409);
    }
    const user = {
      id: database.nextUserId++,
      name: body?.name || "",
      email: body?.email || "",
      password: body?.password || "",
      role: "participante",
      tecnologias: body?.tecnologias || [],
    };
    database.users.push(user);
    saveDatabase(database);
    return json(publicUser(user), 201);
  }

  if (method === "POST" && path === "/api/Auth/register/empresa") {
    const email = String(body?.email || "").toLowerCase();
    if (database.users.some((item) => item.email.toLowerCase() === email)) {
      return json({ message: "Email já cadastrado" }, 409);
    }
    const user = {
      id: database.nextUserId++,
      name: body?.name || "",
      email: body?.email || "",
      password: body?.password || "",
      role: "empresa",
      cnpj: body?.cnpj || "",
      area: body?.area || "",
      descricao: body?.descricao || "",
      tecnologias: body?.tecnologias || [],
    };
    database.users.push(user);
    saveDatabase(database);
    return json(publicUser(user), 201);
  }

  if (method === "GET" && path === "/api/Hackathons") {
    return json(database.hackathons);
  }

  const hackathonMatch = path.match(/^\/api\/Hackathons\/(\d+)$/);
  if (method === "GET" && hackathonMatch) {
    const hackathon = database.hackathons.find(
      (item) => String(item.hackathonId) === hackathonMatch[1],
    );
    if (!hackathon) return json({ message: "Hackathon não encontrado" }, 404);
    return json(hackathon);
  }

  if (method === "POST" && path === "/api/Hackathons/register/Hackathon") {
    const hackathon = toHackathon(body || {}, database.nextHackathonId++);
    database.hackathons.unshift(hackathon);
    saveDatabase(database);
    return json(hackathon, 201);
  }

  return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
}

export function installMockApi() {
  if (window.__dampMockInstalled) return;
  window.__dampMockInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    if (!url?.startsWith(API)) return originalFetch(input, init);

    const path = url.slice(API.length).split("?")[0];
    const method = (init.method || "GET").toUpperCase();
    let body = null;
    if (init.body) {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = null;
      }
    }

    return handle(path, method, body);
  };
}
