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
    // Hackathons salvos antes do ciclo de vida (sem storedStatus) são trocados pelos do seed
    if (database.hackathons?.some((item) => item.storedStatus === undefined)) {
      database.hackathons = structuredClone(seedDatabase.hackathons);
      database.nextHackathonId = seedDatabase.nextHackathonId;
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

const MAX_LOGO_LENGTH = 2 * 1024 * 1024;
const WINNERS_COUNTS = [1, 10, 15, 20, 50, 100];
const NO_COMPANY = "Apenas empresas e seus funcionários podem gerenciar Hackathons.";
const HACKATHON_NOT_FOUND = "Hackathon não encontrado.";
const DATES_ORDER = "As datas precisam seguir: início, fim das submissões, fim da avaliação.";
const FINISHED = "Este Hackathon já foi encerrado ou cancelado.";
const PHASE_TEXT = {
  Draft: "Rascunho",
  Published: "Publicado",
  Active: "Ativo",
  InReview: "Em avaliação",
  Closed: "Encerrado",
  Cancelled: "Cancelado",
};

// mesma regra do HackathonPhases.GetPhase da API: o status gravado manda, depois as datas
function phaseOf(hackathon, now = new Date()) {
  if (hackathon.storedStatus === "Draft") return "Draft";
  if (hackathon.storedStatus === "Cancelled") return "Cancelled";
  if (hackathon.storedStatus === "Closed") return "Closed";
  if (!hackathon.dataInicio || now < new Date(hackathon.dataInicio)) return "Published";
  if (!hackathon.dataFinal || now < new Date(hackathon.dataFinal)) return "Active";
  if (!hackathon.dataFimAvaliacao || now < new Date(hackathon.dataFimAvaliacao)) return "InReview";
  return "Closed";
}

function toHackathonResponse(database, hackathon) {
  const phase = phaseOf(hackathon);
  const company = database.companies.find((item) => item.companyId === hackathon.companyId);
  return {
    ...hackathon,
    empresa: company?.name || "",
    premiacao: hackathon.premiacao ?? 0,
    status: phase === "Published" || phase === "Active",
    fase: PHASE_TEXT[phase],
    participantes: hackathon.participantes || "0 pessoas já entraram",
  };
}

function toIsoOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseFormato(value) {
  return value === "Individual" || value === "Equipe" ? value : null;
}

function parseTipoPremiacao(value) {
  return value === "Dinheiro" || value === "Entrevista" ? value : null;
}

function parseRanking(value) {
  const match = String(value || "").match(/^Top (\d+)$/);
  return match && WINNERS_COUNTS.includes(Number(match[1])) ? value : null;
}

function slugify(title) {
  const slug = String(title)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
  return slug || "hackathon";
}

function uniqueSlug(database, title) {
  const slug = slugify(title);
  if (!database.hackathons.some((item) => item.slug === slug)) return slug;
  let suffix = 2;
  while (database.hackathons.some((item) => item.slug === `${slug}-${suffix}`)) suffix++;
  return `${slug}-${suffix}`;
}

function validateVisual(body) {
  const colors = [body.corPrincipal, body.corSecundaria, body.corFundo];
  if (colors.some((color) => color && !/^#[0-9A-Fa-f]{6}$/.test(color))) {
    return "As cores devem estar no formato #RRGGBB.";
  }
  if (!body.Logo) return null;
  if (body.Logo.length > MAX_LOGO_LENGTH) return "O logo deve ter no máximo 2 MB.";
  return /^data:image\/(png|jpeg|webp|gif);base64,/.test(body.Logo)
    ? null
    : "O logo deve ser uma imagem PNG, JPEG, WEBP ou GIF.";
}

function validateDraft(body) {
  const missing = [];
  if (!body.Titulo?.trim()) missing.push("título");
  if (!body.Descricao?.trim()) missing.push("descrição");
  if (!body.Area?.trim()) missing.push("área");
  if (!parseFormato(body.Formato)) missing.push("formato");
  if (missing.length) return `Preencha: ${missing.join(", ")}.`;
  const limits = [
    ["título", body.Titulo, 200],
    ["descrição", body.Descricao, 4000],
    ["área", body.Area, 100],
    ["método de avaliação", body.Metodo, 100],
    ["tecnologias", (body.Tecnologias || []).reduce((longest, name) => (name.length > longest.length ? name : longest), ""), 100],
  ];
  const tooLong = limits.find(([, value, limit]) => value?.trim().length > limit);
  if (tooLong) return `O campo ${tooLong[0]} deve ter no máximo ${tooLong[2]} caracteres.`;
  if (body.Premiacao !== null && body.Premiacao !== undefined && body.Premiacao !== "") {
    const premiacao = Number(body.Premiacao);
    if (!(premiacao >= 0 && premiacao <= 9999999999.99)) return "A premiação deve ficar entre 0 e 9.999.999.999,99.";
  }
  const visualError = validateVisual(body);
  if (visualError) return visualError;
  const [inicio, fim, avaliacao] = [body.DataInicio, body.DataFinal, body.DataFimAvaliacao].map(toIsoOrNull);
  if (inicio && fim && avaliacao && !(inicio < fim && fim < avaliacao)) return DATES_ORDER;
  return null;
}

function missingCrucialFields(hackathon) {
  const missing = [];
  if (!hackathon.tecnologias?.length) missing.push("tecnologias");
  if (!hackathon.dataInicio) missing.push("data de início");
  if (!hackathon.dataFinal) missing.push("fim das submissões");
  if (!hackathon.dataFimAvaliacao) missing.push("fim da avaliação");
  if (!hackathon.tipoPremiacao) missing.push("tipo de premiação");
  if (hackathon.tipoPremiacao === "Dinheiro" && !(hackathon.premiacao > 0)) missing.push("premiação");
  if (!hackathon.ranking) missing.push("quantos ganham");
  if (!hackathon.metodo) missing.push("método de avaliação");
  return missing;
}

function applyContent(hackathon, body) {
  const tipoPremiacao = parseTipoPremiacao(body.TipoPremiacao);
  // valor em dinheiro não vale para premiação por entrevista
  const premiacao =
    tipoPremiacao === "Entrevista" || body.Premiacao === null || body.Premiacao === undefined || body.Premiacao === ""
      ? null
      : Number(body.Premiacao);
  Object.assign(hackathon, {
    titulo: body.Titulo.trim(),
    descricao: body.Descricao.trim(),
    area: body.Area.trim(),
    tecnologias: [...new Set(body.Tecnologias || [])],
    metodo: body.Metodo || "",
    premiacao,
    formato: parseFormato(body.Formato),
    tipoPremiacao,
    ranking: parseRanking(body.Ranking),
    dataInicio: toIsoOrNull(body.DataInicio),
    dataFinal: toIsoOrNull(body.DataFinal),
    dataFimAvaliacao: toIsoOrNull(body.DataFimAvaliacao),
  });
}

function applyVisual(hackathon, body) {
  Object.assign(hackathon, {
    corPrincipal: body.corPrincipal || null,
    corSecundaria: body.corSecundaria || null,
    corFundo: body.corFundo || null,
    logo: body.Logo || "",
  });
}

// mesmas regras do HackathonService da API
function handleHackathons(path, method, body, database, user) {
  const now = new Date();
  const respond = (hackathon, status = 200) => json(toHackathonResponse(database, hackathon), status);

  if (method === "GET" && path === "/api/Hackathons") {
    const visible = database.hackathons
      .filter((item) => item.storedStatus === "Scheduled" || item.storedStatus === "Closed")
      .sort(
        (a, b) =>
          (phaseOf(a, now) === "Closed") - (phaseOf(b, now) === "Closed") ||
          new Date(a.dataInicio) - new Date(b.dataInicio),
      );
    return json(visible.map((item) => toHackathonResponse(database, item)));
  }

  const access = user ? managedCompany(database, user) : null;

  if (method === "GET" && path === "/api/Hackathons/empresa") {
    if (!user) return json({ message: "Não autenticado" }, 401);
    if (!access) return problem(NO_COMPANY, 403);
    const own = database.hackathons
      .filter((item) => item.companyId === access.companyId)
      .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
    return json(own.map((item) => toHackathonResponse(database, item)));
  }

  if (method === "POST" && path === "/api/Hackathons/register/Hackathon") {
    if (!user) return json({ message: "Não autenticado" }, 401);
    if (!access) return problem(NO_COMPANY, 403);
    const error = validateDraft(body || {});
    if (error) return problem(error, 400);
    const hackathon = {
      hackathonId: database.nextHackathonId++,
      companyId: access.companyId,
      storedStatus: "Draft",
      slug: uniqueSlug(database, body.Titulo.trim()),
      dataCriacao: now.toISOString(),
    };
    applyContent(hackathon, body);
    applyVisual(hackathon, body);
    database.hackathons.unshift(hackathon);
    saveDatabase(database);
    return respond(hackathon, 201);
  }

  const match = path.match(/^\/api\/Hackathons\/([^/]+)(?:\/(publicar|cancelar|encerrar))?$/);
  if (!match) return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
  const [, id, action] = match;

  if (method === "GET" && !action) {
    const hackathon = database.hackathons.find((item) => String(item.hackathonId) === id || item.slug === id);
    if (!hackathon) return problem(HACKATHON_NOT_FOUND, 404);
    const phase = phaseOf(hackathon, now);
    if ((phase === "Draft" || phase === "Cancelled") && access?.companyId !== hackathon.companyId) {
      return problem(HACKATHON_NOT_FOUND, 404);
    }
    return respond(hackathon);
  }

  if (!user) return json({ message: "Não autenticado" }, 401);
  if (!access) return problem(NO_COMPANY, 403);
  const hackathon = database.hackathons.find(
    (item) => String(item.hackathonId) === id && item.companyId === access.companyId,
  );
  if (!hackathon) return problem(HACKATHON_NOT_FOUND, 404);
  const phase = phaseOf(hackathon, now);

  if (method === "PUT" && !action) {
    if (phase === "Closed" || phase === "Cancelled") return problem(FINISHED, 409);
    // os logos do seed são caminhos de SVG: reenviar o mesmo logo não deve travar a edição
    const checked = body?.Logo && body.Logo === hackathon.logo ? { ...body, Logo: "" } : body || {};
    const error = phase === "Draft" ? validateDraft(checked) : validateVisual(checked);
    if (error) return problem(error, 400);
    // depois de publicado, só cores e logo mudam
    if (phase === "Draft") applyContent(hackathon, body);
    applyVisual(hackathon, body);
    saveDatabase(database);
    return respond(hackathon);
  }

  if (method === "DELETE" && !action) {
    if (hackathon.storedStatus !== "Draft") return problem("Só é possível apagar rascunhos. Use cancelar.", 409);
    database.hackathons = database.hackathons.filter((item) => item !== hackathon);
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  if (method === "POST" && action === "publicar") {
    if (hackathon.storedStatus !== "Draft") return problem("Este Hackathon já foi publicado.", 409);
    if (!access.canPublish) return problem("Sua empresa precisa ser verificada para publicar.", 403);
    const missing = missingCrucialFields(hackathon);
    if (missing.length) return problem(`Preencha antes de publicar: ${missing.join(", ")}.`, 400);
    if (new Date(hackathon.dataInicio) <= now) return problem("A data de início precisa ser no futuro.", 400);
    if (!(hackathon.dataInicio < hackathon.dataFinal && hackathon.dataFinal < hackathon.dataFimAvaliacao)) {
      return problem(DATES_ORDER, 400);
    }
    hackathon.storedStatus = "Scheduled";
    hackathon.dataPublicacao = now.toISOString();
    saveDatabase(database);
    return respond(hackathon);
  }

  if (method === "POST" && action === "cancelar") {
    if (phase === "Closed" || phase === "Cancelled") return problem(FINISHED, 409);
    hackathon.storedStatus = "Cancelled";
    saveDatabase(database);
    return respond(hackathon);
  }

  if (method === "POST" && action === "encerrar") {
    if (phase !== "InReview") return problem("Só é possível encerrar durante a avaliação.", 409);
    hackathon.storedStatus = "Closed";
    saveDatabase(database);
    return respond(hackathon);
  }

  return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
}

function handle(path, method, body, token) {
  const database = loadDatabase();

  const currentUser = database.users.find((item) => `mock-${item.id}` === token);
  if (path.startsWith("/api/Companies")) {
    return handleCompanies(path, method, body, database, currentUser);
  }
  if (path.startsWith("/api/Hackathons")) {
    return handleHackathons(path, method, body, database, currentUser);
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
