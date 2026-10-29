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
    const hadSubmissions = database.submissions !== undefined;
    for (const key of [
      "companies", "memberships", "invitations", "nextInvitationId",
      "teams", "participations", "teamInvitations", "teamJoinRequests",
      "nextTeamId", "nextParticipationId", "nextTeamInvitationId", "nextTeamJoinRequestId",
      "submissions", "submissionVersions", "nextSubmissionId", "nextSubmissionVersionId",
    ]) {
      if (database[key] === undefined) database[key] = structuredClone(seedDatabase[key]);
    }
    // bancos de antes das entregas ganham a equipe "Turma do Bit" e a referência do Hackathon 1 do seed
    if (!hadSubmissions) {
      for (const team of seedDatabase.teams) {
        if (!database.teams.some((item) => item.teamId === team.teamId)) database.teams.push(structuredClone(team));
      }
      for (const participation of seedDatabase.participations) {
        if (!database.participations.some((item) => item.id === participation.id)) {
          database.participations.push(structuredClone(participation));
        }
      }
      for (const hackathon of seedDatabase.hackathons) {
        const saved = database.hackathons.find((item) => item.hackathonId === hackathon.hackathonId);
        if (saved && hackathon.referenceCode && saved.referenceCode === undefined) {
          saved.referenceLanguage = hackathon.referenceLanguage;
          saved.referenceCode = hackathon.referenceCode;
        }
      }
      database.nextTeamId = Math.max(database.nextTeamId, seedDatabase.nextTeamId);
      database.nextParticipationId = Math.max(database.nextParticipationId, seedDatabase.nextParticipationId);
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
    // quem está inscrito em Hackathon ainda em andamento desta empresa não vira funcionário dela
    const registeredInCompany = database.participations.some((item) => {
      const hackathon = database.hackathons.find((h) => String(h.hackathonId) === String(item.hackathonId));
      const phase = hackathon && phaseOf(hackathon);
      return item.accountId === user.id && !item.leftAt && hackathon?.companyId === invitation.companyId
        && phase !== "Closed" && phase !== "Cancelled";
    });
    if (registeredInCompany) {
      return problem("Você está inscrito em um Hackathon desta empresa. Saia da inscrição antes de aceitar.", 409);
    }
    // funcionário não participa dos Hackathons da empresa: convites e pedidos de equipe neles são cancelados
    const companyTeamIds = database.teams
      .filter((team) => database.hackathons.some((h) => String(h.hackathonId) === String(team.hackathonId) && h.companyId === invitation.companyId))
      .map((team) => team.teamId);
    for (const item of [...database.teamInvitations, ...database.teamJoinRequests]) {
      const mine = item.accountId === user.id || item.email?.toLowerCase() === user.email.toLowerCase();
      if (mine && item.status === "Pending" && companyTeamIds.includes(item.teamId)) {
        item.status = "Cancelled";
        item.respondedAt = new Date().toISOString();
      }
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
  // a solução de referência nunca sai na resposta pública
  const { referenceLanguage: _referenceLanguage, referenceCode: _referenceCode, ...publicFields } = hackathon;
  return {
    ...publicFields,
    empresa: company?.name || "",
    premiacao: hackathon.premiacao ?? 0,
    status: phase === "Published" || phase === "Active",
    fase: PHASE_TEXT[phase],
    participantes: (() => {
      const count = activeParticipations(database, hackathon.hackathonId).length;
      return count === 1 ? "1 pessoa já entrou" : `${count} pessoas já entraram`;
    })(),
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
  // solução de referência segue as regras do código entregue
  if (body.SolucaoReferencia?.trim()) {
    const referenceError = validateCode(body.LinguagemReferencia, body.SolucaoReferencia);
    if (referenceError) return referenceError;
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
    // a referência só a empresa vê, então muda mesmo depois de publicado
    referenceCode: body.SolucaoReferencia?.trim() ? body.SolucaoReferencia : null,
    referenceLanguage: body.SolucaoReferencia?.trim() ? body.LinguagemReferencia || null : null,
  });
}

const LANGUAGES = ["JavaScript", "Python", "C#", "Java", "SQL", "Outra"];
const MAX_CODE_LENGTH = 100 * 1024;

// mesmas regras do SubmissionService.ValidateCode da API
function validateCode(language, code) {
  if (!LANGUAGES.includes(language)) return "Escolha uma linguagem.";
  if (!code?.trim()) return "Envie algum código.";
  if (code.length > MAX_CODE_LENGTH) return "O código deve ter no máximo 100 KB.";
  return null;
}

function toVersion(database, version, current) {
  return {
    versao: version.version,
    linguagem: version.language,
    nomeArquivo: version.fileName,
    enviadoPor: displayName(database, version.submittedBy),
    enviadoEm: version.submittedAt,
    vale: version.version === current,
  };
}

function toCode(version) {
  return version
    ? { versao: version.version, linguagem: version.language, nomeArquivo: version.fileName, codigo: version.code }
    : null;
}

function versionsOf(database, submission) {
  return database.submissionVersions
    .filter((item) => item.submissionId === submission.submissionId)
    .sort((a, b) => b.version - a.version);
}

// mesmas regras do SubmissionService da API
function handleSubmissions(path, method, body, database, user) {
  if (!user) return json({ message: "Não autenticado" }, 401);
  const match = path.match(/^\/api\/Hackathons\/([^/]+)\/(entrega|entregas|referencia)(?:\/([^/]+))?(?:\/versoes\/(\d+))?$/);
  if (!match) return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
  const [, hackathonId, section, extra, versionText] = match;
  const hackathon = database.hackathons.find((item) => String(item.hackathonId) === hackathonId);
  const phase = hackathon ? phaseOf(hackathon) : "Draft";

  if (section === "entrega") {
    if (!hackathon || phase === "Draft" || phase === "Cancelled") return problem(HACKATHON_NOT_FOUND, 404);
    const participation = activeParticipations(database, hackathon.hackathonId).find((item) => item.accountId === user.id);
    if (!participation) return problem("Você não está inscrito neste Hackathon.", 403);
    const findOwn = () =>
      database.submissions.find((item) =>
        participation.teamId ? item.teamId === participation.teamId : item.participationId === participation.id,
      );
    let submission = findOwn();

    if (method === "GET" && versionText) {
      const version = submission && versionsOf(database, submission).find((item) => item.version === Number(versionText));
      return version ? json(toCode(version)) : problem("Versão não encontrada.", 404);
    }

    if (method === "GET" && !extra && !versionText) {
      const versions = submission ? versionsOf(database, submission) : [];
      const team = participation.teamId && database.teams.find((item) => item.teamId === participation.teamId);
      return json({
        aberta: phase === "Active",
        dataInicio: hackathon.dataInicio,
        dataFinal: hackathon.dataFinal,
        equipe: team ? team.nome : null,
        versoes: versions.map((item) => toVersion(database, item, submission.currentVersion)),
        atual: toCode(versions.find((item) => item.version === submission?.currentVersion)),
      });
    }

    if (method === "POST" && !extra) {
      if (phase !== "Active") return problem("As submissões deste Hackathon estão fechadas.", 409);
      const error = validateCode(body?.linguagem, body?.codigo);
      if (error) return problem(error, 400);
      if (!submission) {
        submission = {
          submissionId: `s-${database.nextSubmissionId++}`,
          hackathonId: hackathon.hackathonId,
          teamId: participation.teamId,
          participationId: participation.teamId ? null : participation.id,
          currentVersion: 0,
        };
        database.submissions.push(submission);
      }
      const version = {
        id: `sv-${database.nextSubmissionVersionId++}`,
        submissionId: submission.submissionId,
        version: submission.currentVersion + 1,
        language: body.linguagem,
        fileName: body.nomeArquivo?.trim() ? body.nomeArquivo.trim().slice(0, 255) : null,
        code: body.codigo,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
      };
      database.submissionVersions.push(version);
      submission.currentVersion = version.version;
      saveDatabase(database);
      return json(toCode(version), 201);
    }
  }

  // visão da empresa: conta principal ou funcionário da empresa dona
  if (method !== "GET") return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
  const access = managedCompany(database, user);
  if (!access) return problem("Apenas empresas e seus funcionários podem gerenciar Hackathons.", 403);
  if (!hackathon || hackathon.companyId !== access.companyId) return problem(HACKATHON_NOT_FOUND, 404);

  if (section === "referencia") {
    return json({ linguagem: hackathon.referenceLanguage || null, codigo: hackathon.referenceCode || null });
  }

  const submissions = database.submissions.filter((item) => String(item.hackathonId) === hackathonId);
  if (!extra) {
    const active = activeParticipations(database, hackathon.hackathonId);
    const rows =
      hackathon.formato === "Equipe"
        ? database.teams
            .filter((team) => String(team.hackathonId) === hackathonId && active.some((item) => item.teamId === team.teamId))
            .map((team) => ({ nome: team.nome, submission: submissions.find((item) => item.teamId === team.teamId) }))
        : active.map((item) => ({
            nome: displayName(database, item.accountId),
            submission: submissions.find((submission) => submission.participationId === item.id),
          }));
    return json(
      rows
        .map(({ nome, submission }) => {
          const last = submission && versionsOf(database, submission)[0];
          return {
            submissionId: submission?.submissionId ?? null,
            nome,
            versaoAtual: submission?.currentVersion ?? null,
            enviadoEm: last?.submittedAt ?? null,
          };
        })
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    );
  }

  const submission = submissions.find((item) => item.submissionId === extra);
  if (!submission) return problem(versionText ? "Versão não encontrada." : "Entrega não encontrada.", 404);
  const versions = versionsOf(database, submission);
  if (versionText) {
    const version = versions.find((item) => item.version === Number(versionText));
    return version ? json(toCode(version)) : problem("Versão não encontrada.", 404);
  }
  const team = submission.teamId && database.teams.find((item) => item.teamId === submission.teamId);
  const participation = submission.participationId && database.participations.find((item) => item.id === submission.participationId);
  return json({
    submissionId: submission.submissionId,
    nome: team ? team.nome : displayName(database, participation?.accountId),
    versoes: versions.map((item) => toVersion(database, item, submission.currentVersion)),
    atual: toCode(versions.find((item) => item.version === submission.currentVersion)),
  });
}

const MAX_TEAM_SIZE = 5;
const ALREADY_REGISTERED = "Você já está inscrito neste Hackathon.";
const REGISTRATION_CLOSED = "As inscrições deste Hackathon estão encerradas.";
const TEAM_FULL = "Esta equipe já está completa.";

function activeParticipations(database, hackathonId) {
  return database.participations.filter(
    (item) => String(item.hackathonId) === String(hackathonId) && !item.leftAt,
  );
}

function teamMembers(database, teamId) {
  return database.participations.filter((item) => item.teamId === teamId && !item.leftAt);
}

function displayName(database, accountId) {
  const account = database.users.find((item) => item.id === accountId);
  return account?.name || account?.email || "";
}

function isPendingTeamInvitation(invitation) {
  return invitation.status === "Pending" && new Date(invitation.expiresAt) > new Date();
}

function toTeam(database, team) {
  return {
    teamId: team.teamId,
    nome: team.nome,
    aberta: team.aberta,
    membros: teamMembers(database, team.teamId).map((item) => ({
      accountId: item.accountId,
      nome: displayName(database, item.accountId),
    })),
    convitesPendentes: database.teamInvitations
      .filter((item) => item.teamId === team.teamId && isPendingTeamInvitation(item))
      .map((item) => ({ id: item.id, email: item.email, expiraEm: item.expiresAt })),
    pedidosPendentes: database.teamJoinRequests
      .filter((item) => item.teamId === team.teamId && item.status === "Pending")
      .map((item) => ({ id: item.id, accountId: item.accountId, nome: displayName(database, item.accountId) })),
  };
}

function toParticipation(database, hackathon, participation) {
  const company = database.companies.find((item) => item.companyId === hackathon.companyId);
  const team = participation.teamId && database.teams.find((item) => item.teamId === participation.teamId);
  return {
    hackathonId: hackathon.hackathonId,
    titulo: hackathon.titulo,
    empresa: company?.name || "",
    fase: PHASE_TEXT[phaseOf(hackathon)],
    formato: hackathon.formato,
    dataInicio: hackathon.dataInicio,
    equipe: team ? toTeam(database, team) : null,
  };
}

// mesma ordem de checagens do CheckCanJoinAsync da API
function checkCanJoin(database, user, hackathonId, alreadyMessage = ALREADY_REGISTERED) {
  if (user.role !== "participante") {
    return { error: problem("Apenas participantes podem se inscrever em Hackathons.", 403) };
  }
  const hackathon = database.hackathons.find((item) => String(item.hackathonId) === String(hackathonId));
  const phase = hackathon ? phaseOf(hackathon) : "Draft";
  if (!hackathon || phase === "Draft" || phase === "Cancelled") return { error: problem(HACKATHON_NOT_FOUND, 404) };
  if (managedCompany(database, user)?.companyId === hackathon.companyId) {
    return { error: problem("Quem organiza o Hackathon não pode participar dele.", 403) };
  }
  if (phase !== "Published") return { error: problem(REGISTRATION_CLOSED, 409) };
  if (activeParticipations(database, hackathon.hackathonId).some((item) => item.accountId === user.id)) {
    return { error: problem(alreadyMessage, 409) };
  }
  return { hackathon };
}

// quem acabou de se inscrever não fica com convite ou pedido que só daria erro
function cancelPendingForAccount(database, user, hackathonId) {
  const teamIds = database.teams.filter((item) => String(item.hackathonId) === String(hackathonId)).map((item) => item.teamId);
  const now = new Date().toISOString();
  for (const invitation of database.teamInvitations) {
    if (teamIds.includes(invitation.teamId) && invitation.status === "Pending" && invitation.email.toLowerCase() === user.email.toLowerCase()) {
      invitation.status = "Cancelled";
      invitation.respondedAt = now;
    }
  }
  for (const request of database.teamJoinRequests) {
    if (teamIds.includes(request.teamId) && request.status === "Pending" && request.accountId === user.id) {
      request.status = "Cancelled";
      request.respondedAt = now;
    }
  }
}

function cancelPendingForTeam(database, teamId) {
  const now = new Date().toISOString();
  for (const item of [...database.teamInvitations, ...database.teamJoinRequests]) {
    if (item.teamId === teamId && item.status === "Pending") {
      item.status = "Cancelled";
      item.respondedAt = now;
    }
  }
}

function joinTeam(database, user, team) {
  if (teamMembers(database, team.teamId).length >= MAX_TEAM_SIZE) return problem(TEAM_FULL, 409);
  database.participations.push({
    id: `p-${database.nextParticipationId++}`,
    hackathonId: team.hackathonId,
    accountId: user.id,
    teamId: team.teamId,
    joinedAt: new Date().toISOString(),
    leftAt: null,
  });
  cancelPendingForAccount(database, user, team.hackathonId);
  if (teamMembers(database, team.teamId).length >= MAX_TEAM_SIZE) cancelPendingForTeam(database, team.teamId);
  return null;
}

function memberTeam(database, user, teamId) {
  const team = database.teams.find(
    (item) => item.teamId === teamId && teamMembers(database, item.teamId).some((member) => member.accountId === user.id),
  );
  if (!team) return { error: problem("Equipe não encontrada.", 404) };
  const hackathon = database.hackathons.find((item) => String(item.hackathonId) === String(team.hackathonId));
  if (phaseOf(hackathon) !== "Published") return { error: problem(REGISTRATION_CLOSED, 409) };
  return { team, hackathon };
}

function validateTeamName(database, hackathonId, nome, currentTeamId) {
  const name = String(nome || "").trim();
  if (!name || name.length > 100) return problem("Informe um nome de equipe com até 100 caracteres.", 400);
  const taken = database.teams.some(
    (item) =>
      String(item.hackathonId) === String(hackathonId) &&
      item.teamId !== currentTeamId &&
      item.nome.toUpperCase() === name.toUpperCase(),
  );
  return taken ? problem("Já existe uma equipe com este nome neste Hackathon.", 409) : null;
}

// mesmas regras do ParticipationService da API
function handleParticipations(path, method, body, database, user) {
  const hackathonRoute = path.match(/^\/api\/Hackathons\/([^/]+)\/(inscricao|equipes)$/);

  if (method === "GET" && hackathonRoute?.[2] === "equipes") {
    const hackathon = database.hackathons.find((item) => String(item.hackathonId) === hackathonRoute[1]);
    const phase = hackathon ? phaseOf(hackathon) : "Draft";
    if (!hackathon || phase === "Draft" || phase === "Cancelled") return problem(HACKATHON_NOT_FOUND, 404);
    const open = database.teams
      .filter((item) => String(item.hackathonId) === hackathonRoute[1] && item.aberta)
      .map((item) => ({ teamId: item.teamId, nome: item.nome, membros: teamMembers(database, item.teamId).length }))
      .filter((item) => item.membros < MAX_TEAM_SIZE)
      .map((item) => ({ ...item, vagas: MAX_TEAM_SIZE - item.membros }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
    return json(open);
  }

  if (!user) return json({ message: "Não autenticado" }, 401);
  const now = new Date();

  if (method === "GET" && path === "/api/Participations/me") {
    const inscricoes = database.participations
      .filter((item) => item.accountId === user.id && !item.leftAt)
      .map((item) => ({ item, hackathon: database.hackathons.find((h) => String(h.hackathonId) === String(item.hackathonId)) }))
      .filter(({ hackathon }) => hackathon)
      .sort((a, b) => new Date(a.hackathon.dataInicio) - new Date(b.hackathon.dataInicio))
      .map(({ item, hackathon }) => toParticipation(database, hackathon, item));
    const teamInfo = (teamId) => {
      const team = database.teams.find((item) => item.teamId === teamId);
      const hackathon = database.hackathons.find((item) => String(item.hackathonId) === String(team?.hackathonId));
      return { team, hackathon };
    };
    const convitesRecebidos = database.teamInvitations
      .filter((item) => isPendingTeamInvitation(item) && item.email.toLowerCase() === user.email.toLowerCase())
      .map((item) => {
        const { team, hackathon } = teamInfo(item.teamId);
        return {
          id: item.id,
          teamId: item.teamId,
          equipe: team?.nome || "",
          hackathonId: hackathon?.hackathonId,
          hackathon: hackathon?.titulo || "",
          convidadoPor: displayName(database, item.invitedBy),
          expiraEm: item.expiresAt,
        };
      });
    const pedidosEnviados = database.teamJoinRequests
      .filter((item) => item.accountId === user.id && item.status === "Pending")
      .map((item) => {
        const { team, hackathon } = teamInfo(item.teamId);
        return { id: item.id, teamId: item.teamId, equipe: team?.nome || "", hackathonId: hackathon?.hackathonId, hackathon: hackathon?.titulo || "" };
      });
    return json({ inscricoes, convitesRecebidos, pedidosEnviados });
  }

  if (hackathonRoute?.[2] === "inscricao" && method === "POST") {
    const { hackathon, error } = checkCanJoin(database, user, hackathonRoute[1]);
    if (error) return error;
    if (hackathon.formato === "Equipe") return problem("Este Hackathon é em equipe. Crie uma equipe ou entre em uma.", 409);
    const participation = {
      id: `p-${database.nextParticipationId++}`,
      hackathonId: hackathon.hackathonId,
      accountId: user.id,
      teamId: null,
      joinedAt: now.toISOString(),
      leftAt: null,
    };
    database.participations.push(participation);
    cancelPendingForAccount(database, user, hackathon.hackathonId);
    saveDatabase(database);
    return json(toParticipation(database, hackathon, participation), 201);
  }

  if (hackathonRoute?.[2] === "inscricao" && method === "DELETE") {
    const hackathon = database.hackathons.find((item) => String(item.hackathonId) === hackathonRoute[1]);
    const phase = hackathon ? phaseOf(hackathon) : "Draft";
    if (!hackathon || phase === "Draft" || phase === "Cancelled") return problem(HACKATHON_NOT_FOUND, 404);
    if (hackathon.formato === "Equipe") return problem("Use sair da equipe.", 409);
    if (phase !== "Published") return problem(REGISTRATION_CLOSED, 409);
    const participation = activeParticipations(database, hackathon.hackathonId).find((item) => item.accountId === user.id);
    if (!participation) return problem("Inscrição não encontrada.", 404);
    participation.leftAt = now.toISOString();
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  if (hackathonRoute?.[2] === "equipes" && method === "POST") {
    const { hackathon, error } = checkCanJoin(database, user, hackathonRoute[1]);
    if (error) return error;
    if (hackathon.formato !== "Equipe") return problem("Este Hackathon é individual.", 409);
    const nameError = validateTeamName(database, hackathon.hackathonId, body?.nome);
    if (nameError) return nameError;
    const team = {
      teamId: `t-${database.nextTeamId++}`,
      hackathonId: hackathon.hackathonId,
      nome: body.nome.trim(),
      aberta: Boolean(body.aberta),
      criadoPor: user.id,
    };
    database.teams.push(team);
    database.participations.push({
      id: `p-${database.nextParticipationId++}`,
      hackathonId: hackathon.hackathonId,
      accountId: user.id,
      teamId: team.teamId,
      joinedAt: now.toISOString(),
      leftAt: null,
    });
    cancelPendingForAccount(database, user, hackathon.hackathonId);
    saveDatabase(database);
    return json(toTeam(database, team), 201);
  }

  const invitationAnswer = path.match(/^\/api\/Teams\/convites\/([^/]+)\/(aceitar|recusar)$/);
  if (method === "POST" && invitationAnswer) {
    const invitation = database.teamInvitations.find((item) => item.id === invitationAnswer[1]);
    if (!invitation || invitation.email.toLowerCase() !== user.email.toLowerCase()) return problem("Convite não encontrado.", 404);
    if (invitation.status !== "Pending") return problem("Este convite já foi respondido.", 409);
    if (new Date(invitation.expiresAt) <= now) return problem("Este convite expirou.", 410);
    if (invitationAnswer[2] === "recusar") {
      invitation.status = "Declined";
      invitation.respondedAt = now.toISOString();
      saveDatabase(database);
      return new Response(null, { status: 204 });
    }
    const team = database.teams.find((item) => item.teamId === invitation.teamId);
    const { hackathon, error } = checkCanJoin(database, user, team.hackathonId, "Você já está inscrito neste Hackathon. Saia da equipe atual antes.");
    if (error) return error;
    invitation.status = "Accepted";
    invitation.respondedAt = now.toISOString();
    const joinError = joinTeam(database, user, team);
    if (joinError) return joinError;
    saveDatabase(database);
    const participation = activeParticipations(database, hackathon.hackathonId).find((item) => item.accountId === user.id);
    return json(toParticipation(database, hackathon, participation));
  }

  const requestAnswer = path.match(/^\/api\/Teams\/pedidos\/([^/]+)(?:\/(aceitar|recusar))?$/);
  if (requestAnswer && method === "DELETE" && !requestAnswer[2]) {
    const request = database.teamJoinRequests.find((item) => item.id === requestAnswer[1] && item.accountId === user.id);
    if (!request) return problem("Pedido não encontrado.", 404);
    if (request.status !== "Pending") return problem("Este pedido já foi respondido.", 409);
    request.status = "Cancelled";
    request.respondedAt = now.toISOString();
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }
  if (requestAnswer && method === "POST" && requestAnswer[2]) {
    const request = database.teamJoinRequests.find(
      (item) => item.id === requestAnswer[1] && teamMembers(database, item.teamId).some((member) => member.accountId === user.id),
    );
    if (!request) return problem("Pedido não encontrado.", 404);
    if (request.status !== "Pending") return problem("Este pedido já foi respondido.", 409);
    const team = database.teams.find((item) => item.teamId === request.teamId);
    const hackathon = database.hackathons.find((item) => String(item.hackathonId) === String(team.hackathonId));
    if (phaseOf(hackathon) !== "Published") return problem(REGISTRATION_CLOSED, 409);
    request.respondedBy = user.id;
    request.respondedAt = now.toISOString();
    if (requestAnswer[2] === "recusar") {
      request.status = "Declined";
      saveDatabase(database);
      return new Response(null, { status: 204 });
    }
    const requester = database.users.find((item) => item.id === request.accountId);
    const { error } = checkCanJoin(database, requester, team.hackathonId);
    if (error) return error;
    request.status = "Accepted";
    const joinError = joinTeam(database, requester, team);
    if (joinError) return joinError;
    saveDatabase(database);
    return json({ accountId: requester.id, nome: displayName(database, requester.id) });
  }

  const teamRoute = path.match(/^\/api\/Teams\/([^/]+)(?:\/(convites|pedidos|membros\/me)(?:\/([^/]+))?)?$/);
  if (!teamRoute) return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
  const [, teamId, section, inviteId] = teamRoute;

  if (method === "POST" && section === "pedidos") {
    const team = database.teams.find((item) => item.teamId === teamId);
    if (!team) return problem("Equipe não encontrada.", 404);
    const { hackathon, error } = checkCanJoin(database, user, team.hackathonId);
    if (error) return error;
    if (!team.aberta) return problem("Esta equipe não está aceitando pedidos.", 409);
    if (teamMembers(database, teamId).length >= MAX_TEAM_SIZE) return problem(TEAM_FULL, 409);
    if (database.teamJoinRequests.some((item) => item.teamId === teamId && item.accountId === user.id && item.status === "Pending")) {
      return problem("Você já pediu para entrar nesta equipe.", 409);
    }
    const request = { id: `req-${database.nextTeamJoinRequestId++}`, teamId, accountId: user.id, status: "Pending", createdAt: now.toISOString() };
    database.teamJoinRequests.push(request);
    saveDatabase(database);
    return json({ id: request.id, teamId, equipe: team.nome, hackathonId: hackathon.hackathonId, hackathon: hackathon.titulo }, 201);
  }

  const { team, error } = memberTeam(database, user, teamId);
  if (error) return error;

  if (method === "PATCH" && !section) {
    if (body?.nome !== undefined && body?.nome !== null) {
      const nameError = validateTeamName(database, team.hackathonId, body.nome, team.teamId);
      if (nameError) return nameError;
      team.nome = body.nome.trim();
    }
    if (typeof body?.aberta === "boolean") team.aberta = body.aberta;
    saveDatabase(database);
    return json(toTeam(database, team));
  }

  if (method === "POST" && section === "convites") {
    if (teamMembers(database, teamId).length >= MAX_TEAM_SIZE) return problem(TEAM_FULL, 409);
    const email = String(body?.email || "").trim();
    const invited = database.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!invited || invited.role !== "participante") return problem("Nenhum participante encontrado com este e-mail.", 404);
    if (teamMembers(database, teamId).some((item) => item.accountId === invited.id)) return problem("Esta pessoa já está na equipe.", 409);
    if (database.teamInvitations.some((item) => item.teamId === teamId && isPendingTeamInvitation(item) && item.email.toLowerCase() === email.toLowerCase())) {
      return problem("Já existe um convite pendente para este e-mail.", 409);
    }
    const invitation = {
      id: `tinv-${database.nextTeamInvitationId++}`,
      teamId,
      email,
      invitedBy: user.id,
      status: "Pending",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + INVITATION_LIFETIME_MS).toISOString(),
    };
    database.teamInvitations.push(invitation);
    saveDatabase(database);
    return json({ id: invitation.id, email, expiraEm: invitation.expiresAt }, 201);
  }

  if (method === "DELETE" && section === "convites" && inviteId) {
    const invitation = database.teamInvitations.find((item) => item.id === inviteId && item.teamId === teamId);
    if (!invitation) return problem("Convite não encontrado.", 404);
    if (invitation.status !== "Pending") return problem("Este convite já foi respondido.", 409);
    invitation.status = "Revoked";
    invitation.respondedAt = now.toISOString();
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  if (method === "DELETE" && section === "membros/me") {
    const participation = teamMembers(database, teamId).find((item) => item.accountId === user.id);
    participation.leftAt = now.toISOString();
    if (teamMembers(database, teamId).length === 0) {
      // último a sair desfaz a equipe
      for (const item of database.participations) if (item.teamId === teamId) item.teamId = null;
      database.teams = database.teams.filter((item) => item.teamId !== teamId);
      database.teamInvitations = database.teamInvitations.filter((item) => item.teamId !== teamId);
      database.teamJoinRequests = database.teamJoinRequests.filter((item) => item.teamId !== teamId);
    }
    saveDatabase(database);
    return new Response(null, { status: 204 });
  }

  return json({ message: `Rota mock não encontrada: ${method} ${path}` }, 404);
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
  if (/^\/api\/Hackathons\/[^/]+\/(entrega|entregas|referencia)(\/|$)/.test(path)) {
    return handleSubmissions(path, method, body, database, currentUser);
  }
  if (
    path.startsWith("/api/Teams") ||
    path.startsWith("/api/Participations") ||
    /^\/api\/Hackathons\/[^/]+\/(inscricao|equipes)$/.test(path)
  ) {
    return handleParticipations(path, method, body, database, currentUser);
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
