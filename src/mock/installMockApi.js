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
    const database = JSON.parse(saved);
    // bancos salvos antes das empresas/funcionários ganham as listas novas do seed
    for (const key of ["companies", "memberships", "invitations", "nextInvitationId"]) {
      if (database[key] === undefined) database[key] = structuredClone(seedDatabase[key]);
    }
    for (const user of seedDatabase.users) {
      if (!database.users.some((item) => item.email === user.email)) {
        database.users.push({ ...user, id: database.nextUserId++ });
      }
    }
    return database;
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
    // token falso: o mock só precisa saber quem está chamando
    token: `mock-${user.id}`,
  };
}

function problem(detail, status) {
  return json({ detail }, status);
}

const INVITATION_LIFETIME_MS = 24 * 60 * 60 * 1000;

function isPendingInvitation(invitation) {
  return invitation.status === "Pending" && new Date(invitation.expiresAt) > new Date();
}

function toCompanyAccess(company, isPrimaryAccount) {
  return {
    companyId: company.companyId,
    name: company.name,
    verificationStatus: company.verificationStatus,
    isPrimaryAccount,
    canPublish: company.verificationStatus === "Verified",
  };
}

function managedCompany(database, user) {
  const primary = database.companies.find((item) => item.accountId === user.id);
  if (primary) return toCompanyAccess(primary, true);
  const membership = database.memberships.find(
    (item) => item.accountId === user.id && !item.endedAt,
  );
  if (!membership) return null;
  const company = database.companies.find((item) => item.companyId === membership.companyId);
  return company ? toCompanyAccess(company, false) : null;
}

function toInvitation(invitation) {
  return {
    id: invitation.id,
    email: invitation.email,
    jobTitle: invitation.jobTitle,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  };
}

// mesmas regras do CompanyService da API
function handleCompanies(path, method, body, database, user) {
  if (!user) return json({ message: "Não autenticado" }, 401);
  const primaryCompany = database.companies.find((item) => item.accountId === user.id);

  if (method === "GET" && path === "/api/Companies/me") {
    const access = managedCompany(database, user);
    return access ? json(access) : problem("Empresa não encontrada.", 404);
  }

  if (method === "GET" && path === "/api/Companies/me/employees") {
    const access = managedCompany(database, user);
    if (!access) return problem("Empresa não encontrada.", 404);
    const employees = database.memberships
      .filter((item) => item.companyId === access.companyId && !item.endedAt)
      .map((item) => {
        const account = database.users.find((u) => u.id === item.accountId);
        return {
          accountId: item.accountId,
          name: account?.name || account?.email || "",
          email: account?.email || "",
          jobTitle: item.jobTitle,
          startedAt: item.startedAt,
        };
      });
    return json(employees);
  }

  if (method === "GET" && path === "/api/Companies/me/invitations") {
    if (!primaryCompany) return problem("Apenas a conta principal da empresa pode ver os convites.", 403);
    return json(
      database.invitations
        .filter((item) => item.companyId === primaryCompany.companyId && isPendingInvitation(item))
        .map(toInvitation),
    );
  }

  if (method === "POST" && path === "/api/Companies/me/invitations") {
    if (!primaryCompany) return problem("Apenas a conta principal da empresa pode convidar funcionários.", 403);
    const email = String(body?.email || "").trim();
    if (!email.includes("@")) return problem("Informe um e-mail válido.", 400);
    const normalized = email.toLowerCase();
    if (normalized === user.email.toLowerCase()) return problem("Você não pode convidar a própria conta.", 400);
    const invited = database.users.find((item) => item.email.toLowerCase() === normalized);
    if (!invited) {
      return problem("Nenhum participante encontrado com este e-mail. Peça para a pessoa criar a conta primeiro.", 404);
    }
    if (invited.role !== "participante") {
      return problem("Este e-mail pertence a uma conta que não pode ser funcionária.", 409);
    }
    if (
      database.memberships.some(
        (item) => item.companyId === primaryCompany.companyId && item.accountId === invited.id && !item.endedAt,
      )
    ) {
      return problem("Esta pessoa já é funcionária da empresa.", 409);
    }
    if (
      database.invitations.some(
        (item) =>
          item.companyId === primaryCompany.companyId &&
          item.email.toLowerCase() === normalized &&
          isPendingInvitation(item),
      )
    ) {
      return problem("Já existe um convite pendente para este e-mail.", 409);
    }
    const now = new Date();
    const invitation = {
      id: `inv-${database.nextInvitationId++}`,
      companyId: primaryCompany.companyId,
      email,
      jobTitle: String(body?.jobTitle || "").trim() || null,
      status: "Pending",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + INVITATION_LIFETIME_MS).toISOString(),
    };
    database.invitations.push(invitation);
    saveDatabase(database);
    return json(toInvitation(invitation), 201);
  }

  const revokeMatch = path.match(/^\/api\/Companies\/me\/invitations\/([^/]+)$/);
  if (method === "DELETE" && revokeMatch) {
    if (!primaryCompany) return problem("Apenas a conta principal da empresa pode revogar convites.", 403);
    const invitation = database.invitations.find(
      (item) => item.id === revokeMatch[1] && item.companyId === primaryCompany.companyId,
    );
    if (!invitation) return problem("Convite não encontrado.", 404);
    if (invitation.status !== "Pending") return problem("Este convite já foi respondido.", 409);
    invitation.status = "Revoked";
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  const removeMatch = path.match(/^\/api\/Companies\/me\/employees\/([^/]+)$/);
  if (method === "DELETE" && removeMatch) {
    if (!primaryCompany) return problem("Apenas a conta principal da empresa pode remover funcionários.", 403);
    const membership = database.memberships.find(
      (item) =>
        item.companyId === primaryCompany.companyId &&
        String(item.accountId) === removeMatch[1] &&
        !item.endedAt,
    );
    if (!membership) return problem("Funcionário não encontrado.", 404);
    membership.endedAt = new Date().toISOString();
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  if (method === "GET" && path === "/api/Companies/invitations/received") {
    if (user.role !== "participante") return json([]);
    return json(
      database.invitations
        .filter((item) => item.email.toLowerCase() === user.email.toLowerCase() && isPendingInvitation(item))
        .map((item) => ({
          id: item.id,
          companyName: database.companies.find((c) => c.companyId === item.companyId)?.name || "",
          jobTitle: item.jobTitle,
          expiresAt: item.expiresAt,
        })),
    );
  }

  const answerMatch = path.match(/^\/api\/Companies\/invitations\/([^/]+)\/(accept|decline)$/);
  if (method === "POST" && answerMatch) {
    const invitation = database.invitations.find((item) => item.id === answerMatch[1]);
    if (!invitation || invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      return problem("Convite não encontrado.", 404);
    }
    if (user.role !== "participante") return problem("Apenas participantes podem responder convites.", 403);
    if (invitation.status !== "Pending") return problem("Este convite já foi respondido.", 409);
    if (new Date(invitation.expiresAt) <= new Date()) return problem("Este convite expirou.", 410);

    if (answerMatch[2] === "decline") {
      invitation.status = "Declined";
      saveDatabase(database);
      return new Response(null, { status: 204 });
    }

    if (database.memberships.some((item) => item.accountId === user.id && !item.endedAt)) {
      return problem("Você já está vinculado a uma empresa.", 409);
    }
    database.memberships.push({
      companyId: invitation.companyId,
      accountId: user.id,
      jobTitle: invitation.jobTitle,
      startedAt: new Date().toISOString(),
      endedAt: null,
    });
    invitation.status = "Accepted";
    saveDatabase(database);
    return json(managedCompany(database, user));
  }

  return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
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

function handle(path, method, body, token) {
  const database = loadDatabase();

  if (path.startsWith("/api/Companies")) {
    const currentUser = database.users.find((item) => `mock-${item.id}` === token);
    return handleCompanies(path, method, body, database, currentUser);
  }

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
    // toda empresa nova começa aguardando verificação
    database.companies.push({
      companyId: `c-${user.id}`,
      accountId: user.id,
      name: user.name,
      verificationStatus: "Pending",
    });
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

    const headers = new Headers(init.headers || {});
    const token = (headers.get("Authorization") || "").replace("Bearer ", "");

    return handle(path, method, body, token);
  };
}
