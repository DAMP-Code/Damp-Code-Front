import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import Title from "@/app-components/Title";
import { AuthContext } from "@/app-components/utilities/AuthContext";

const API = "https://localhost:7092/api/Hackathons";

const inputClass = "w-full rounded-xl border border-border bg-surface px-4 py-3 text-content outline-none focus:border-brand";
const primaryClass = "rounded-xl bg-highlight px-5 py-2.5 font-semibold text-surface transition hover:brightness-110 disabled:opacity-60";
const secondaryClass = "rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-content transition hover:bg-white/20 disabled:opacity-40";
const dangerClass = "rounded-lg bg-danger/20 px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger hover:text-white disabled:opacity-40";

const typeOptions = [
  { value: "Texto", label: "Texto" },
  { value: "Link", label: "Link (curso, documentação, repositório)" },
  { value: "Video", label: "Vídeo" },
];
const typeLabel = { Texto: "Texto", Link: "Link", Video: "Vídeo" };

// Formulário de módulo, usado para criar e para editar.
const ModuleForm = ({ initial, submitLabel, onSubmit, onCancel, busy }) => {
  const [titulo, setTitulo] = useState(initial?.titulo || "");
  const [descricao, setDescricao] = useState(initial?.descricao || "");

  async function handleSubmit(e) {
    e.preventDefault();
    const saved = await onSubmit({ titulo, descricao });
    if (saved && !initial) {
      setTitulo("");
      setDescricao("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
        Título do módulo
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={120} required placeholder="Ex.: Semana 1 — Fundamentos" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
        Descrição (opcional)
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={1000} rows={2} className={inputClass} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={primaryClass}>{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className={secondaryClass}>Cancelar</button>}
      </div>
    </form>
  );
};

// Formulário de conteúdo: texto direto, ou URL para link e vídeo.
const ContentForm = ({ initial, submitLabel, onSubmit, onCancel, busy }) => {
  const [tipo, setTipo] = useState(initial?.tipo || "Texto");
  const [titulo, setTitulo] = useState(initial?.titulo || "");
  const [texto, setTexto] = useState(initial?.texto || "");
  const [url, setUrl] = useState(initial?.url || "");
  const isText = tipo === "Texto";

  async function handleSubmit(e) {
    e.preventDefault();
    const saved = await onSubmit({ tipo, titulo, texto, url: isText ? "" : url });
    if (saved && !initial) {
      setTitulo("");
      setTexto("");
      setUrl("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
        <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={160} required className={inputClass} />
        </label>
      </div>
      {!isText && (
        <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
          {tipo === "Video" ? "Link do vídeo (YouTube aparece direto na página)" : "Link"}
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://" className={inputClass} />
        </label>
      )}
      <label className="flex flex-col gap-1.5 text-sm text-content-secondary">
        {isText ? "Texto" : "Descrição curta (opcional)"}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required={isText}
          maxLength={isText ? 20000 : 1000}
          rows={isText ? 6 : 2}
          className={inputClass}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={primaryClass}>{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className={secondaryClass}>Cancelar</button>}
      </div>
    </form>
  );
};

// Empresa: módulos e conteúdos de um Hackathon (material de apoio que aparece na página dele).
const ManageModules = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hackathon, setHackathon] = useState(null);
  const [modules, setModules] = useState(null);
  const [editing, setEditing] = useState(null); // "m:<id>" ou "c:<id>"
  const [adding, setAdding] = useState(null); // id do módulo com o formulário de conteúdo aberto
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${user?.token}`, "Content-Type": "application/json" };
  const base = `${API}/${encodeURIComponent(id)}/modulos`;

  const loadModules = useCallback(async () => {
    try {
      const response = await fetch(`${API}/${encodeURIComponent(id)}/modulos`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) {
        setError("Não foi possível carregar os módulos.");
        setModules([]);
        return;
      }
      setModules(await response.json());
    } catch (error) {
      console.error(error);
      setError("Não foi possível conectar com o servidor.");
      setModules([]);
    }
  }, [id, user?.token]);

  useEffect(() => {
    async function loadHackathon() {
      try {
        const response = await fetch(`${API}/${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (response.ok) setHackathon(await response.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadHackathon();
    loadModules();
  }, [id, user?.token, loadModules]);

  // envia a mudança, recarrega a lista e devolve se deu certo
  async function send(url, method, body) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.detail || "Não foi possível salvar a mudança.");
        return false;
      }
      await loadModules();
      return true;
    } catch (error) {
      console.error(error);
      setError("Não foi possível conectar com o servidor.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  // troca o item de lugar com o vizinho e manda a lista inteira na nova ordem
  function move(list, index, direction, idKey, url) {
    const ids = list.map((item) => item[idKey]);
    const target = index + direction;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    return send(url, "PUT", { ids });
  }

  const locked = hackathon && ["Encerrado", "Cancelado"].includes(hackathon.fase);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 text-content sm:px-6 lg:py-12">
        <BackButton />
        <div>
          <Title text1={"Módulos"} text2={hackathon ? ` - ${hackathon.titulo}` : ""} />
          <p className="max-w-2xl text-content-secondary">
            Organize o material de apoio em módulos. Eles aparecem na página do Hackathon, na ordem desta lista.
          </p>
          <Link to={`/hackathon/${encodeURIComponent(id)}`} className="mt-2 inline-block font-semibold text-highlight hover:underline">
            Ver a página do Hackathon
          </Link>
        </div>

        {locked && (
          <p className="rounded-xl border border-warning/40 bg-warning/10 px-5 py-3 text-warning">
            Hackathon {hackathon.fase.toLowerCase()}: os módulos ficam só para leitura.
          </p>
        )}
        {error && <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-danger">{error}</p>}

        {!locked && (
          <section className="rounded-2xl border border-white/10 bg-surface-light p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Novo módulo</h2>
            <ModuleForm submitLabel="Adicionar módulo" busy={busy} onSubmit={(body) => send(base, "POST", body)} />
          </section>
        )}

        {modules === null ? (
          <p className="text-content-secondary">Carregando os módulos…</p>
        ) : modules.length === 0 ? (
          <p className="text-content-secondary">Nenhum módulo ainda. O primeiro módulo criado aparece na página do Hackathon.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {modules.map((module, moduleIndex) => {
              const moduleUrl = `${base}/${encodeURIComponent(module.moduloId)}`;
              return (
                <li key={module.moduloId} className="rounded-2xl border border-white/10 bg-surface-light p-5 sm:p-6">
                  {editing === `m:${module.moduloId}` ? (
                    <ModuleForm
                      initial={module}
                      submitLabel="Salvar módulo"
                      busy={busy}
                      onCancel={() => setEditing(null)}
                      onSubmit={async (body) => {
                        const saved = await send(moduleUrl, "PUT", body);
                        if (saved) setEditing(null);
                        return saved;
                      }}
                    />
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand font-bold text-white">
                          {module.posicao}
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-lg font-semibold wrap-break-word">{module.titulo}</h2>
                          {module.descricao && <p className="text-sm text-content-secondary">{module.descricao}</p>}
                        </div>
                      </div>
                      {!locked && (
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            aria-label={`Mover ${module.titulo} para cima`}
                            disabled={busy || moduleIndex === 0}
                            onClick={() => move(modules, moduleIndex, -1, "moduloId", `${base}/ordem`)}
                            className={secondaryClass}
                          >
                            ↑
                          </button>
                          <button
                            aria-label={`Mover ${module.titulo} para baixo`}
                            disabled={busy || moduleIndex === modules.length - 1}
                            onClick={() => move(modules, moduleIndex, 1, "moduloId", `${base}/ordem`)}
                            className={secondaryClass}
                          >
                            ↓
                          </button>
                          <button onClick={() => setEditing(`m:${module.moduloId}`)} className={secondaryClass}>Editar</button>
                          <button
                            disabled={busy}
                            onClick={() =>
                              window.confirm(`Apagar o módulo "${module.titulo}" e os conteúdos dele?`) && send(moduleUrl, "DELETE")
                            }
                            className={dangerClass}
                          >
                            Apagar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONTEÚDOS */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4">
                    {module.conteudos.length === 0 && (
                      <p className="text-sm text-content-secondary">Nenhum conteúdo neste módulo.</p>
                    )}
                    {module.conteudos.map((content, contentIndex) => {
                      const contentUrl = `${moduleUrl}/conteudos/${encodeURIComponent(content.conteudoId)}`;
                      return editing === `c:${content.conteudoId}` ? (
                        <div key={content.conteudoId} className="rounded-xl bg-surface/60 p-4">
                          <ContentForm
                            initial={content}
                            submitLabel="Salvar conteúdo"
                            busy={busy}
                            onCancel={() => setEditing(null)}
                            onSubmit={async (body) => {
                              const saved = await send(contentUrl, "PUT", body);
                              if (saved) setEditing(null);
                              return saved;
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          key={content.conteudoId}
                          className="flex flex-col gap-3 rounded-xl bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-content-secondary">
                                {typeLabel[content.tipo] || content.tipo}
                              </span>
                              <span className="font-medium wrap-break-word">{content.titulo}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-content-secondary">
                              {content.tipo === "Texto" ? content.texto : content.url}
                            </p>
                          </div>
                          {!locked && (
                            <div className="flex shrink-0 flex-wrap gap-2">
                              <button
                                aria-label={`Mover ${content.titulo} para cima`}
                                disabled={busy || contentIndex === 0}
                                onClick={() => move(module.conteudos, contentIndex, -1, "conteudoId", `${moduleUrl}/conteudos/ordem`)}
                                className={secondaryClass}
                              >
                                ↑
                              </button>
                              <button
                                aria-label={`Mover ${content.titulo} para baixo`}
                                disabled={busy || contentIndex === module.conteudos.length - 1}
                                onClick={() => move(module.conteudos, contentIndex, 1, "conteudoId", `${moduleUrl}/conteudos/ordem`)}
                                className={secondaryClass}
                              >
                                ↓
                              </button>
                              <button onClick={() => setEditing(`c:${content.conteudoId}`)} className={secondaryClass}>Editar</button>
                              <button
                                disabled={busy}
                                onClick={() => window.confirm(`Apagar o conteúdo "${content.titulo}"?`) && send(contentUrl, "DELETE")}
                                className={dangerClass}
                              >
                                Apagar
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!locked &&
                      (adding === module.moduloId ? (
                        <div className="rounded-xl border border-white/10 p-4">
                          <h3 className="mb-3 font-semibold">Novo conteúdo</h3>
                          <ContentForm
                            submitLabel="Adicionar conteúdo"
                            busy={busy}
                            onCancel={() => setAdding(null)}
                            onSubmit={(body) => send(`${moduleUrl}/conteudos`, "POST", body)}
                          />
                        </div>
                      ) : (
                        <button onClick={() => setAdding(module.moduloId)} className="w-fit font-semibold text-highlight hover:underline">
                          + Adicionar conteúdo
                        </button>
                      ))}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageModules;
