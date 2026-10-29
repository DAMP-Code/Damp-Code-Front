import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import BackButton from "@/app-components/BackButton";
import Footer from "@/app-components/Footer";
import Header from "@/app-components/Header";
import HackathonTitle from "@/app-components/hackathon-creation/HackathonTitle";
import HackathonSubtitle from "@/app-components/hackathon-creation/HackathonSubtitle";

const API = "https://localhost:7092/api/Hackathons";
const languages = ["JavaScript", "Python", "C#", "Java", "SQL", "Outra"];
const MAX_CODE_LENGTH = 100 * 1024;

function formatDateTime(date) {
  if (!date) return "";
  const value = new Date(date);
  return `${value.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

// Entrega de código: editor ou arquivo de texto, versões enviadas (vale a última aceita).
const SubmissionPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [hackathon, setHackathon] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState(null);
  const [viewing, setViewing] = useState(null); // versão antiga aberta só para leitura
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const token = user?.token;
  const hackathonUrl = `${API}/${encodeURIComponent(id)}`;

  useEffect(() => {
    async function load() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const hackathonResponse = await fetch(hackathonUrl, { headers });
        if (hackathonResponse.ok) setHackathon(await hackathonResponse.json());

        const response = await fetch(`${hackathonUrl}/entrega`, { headers });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setError(data?.detail || "Não foi possível carregar a entrega.");
          return;
        }
        setSubmission(data);
        // o editor começa com a versão que vale, para a pessoa continuar de onde parou
        if (data.atual) {
          setLanguage(data.atual.linguagem);
          setCode(data.atual.codigo);
          setFileName(data.atual.nomeArquivo);
        }
      } catch (loadError) {
        console.error(loadError);
        setError("Erro ao conectar com o servidor");
      }
    }

    load();
  }, [hackathonUrl, token, reload]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_CODE_LENGTH) {
      setMessage("O código deve ter no máximo 100 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCode(String(reader.result || ""));
      setFileName(file.name);
      setViewing(null);
      setMessage("");
    };
    reader.readAsText(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(`${hackathonUrl}/entrega`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ linguagem: language, codigo: code, nomeArquivo: fileName }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(data?.detail || "Não foi possível enviar a versão.");
        return;
      }
      setMessage(`Versão ${data.versao} enviada. É ela que vale agora.`);
      setReload((value) => value + 1);
    } catch (submitError) {
      console.error(submitError);
      setMessage("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  async function openVersion(version) {
    if (version.vale) {
      setViewing(null);
      return;
    }
    try {
      const response = await fetch(`${hackathonUrl}/entrega/versoes/${version.versao}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setViewing(await response.json());
    } catch (versionError) {
      console.error(versionError);
    }
  }

  const colors = {
    principal: hackathon?.corPrincipal || "#6C48C5",
    secundaria: hackathon?.corSecundaria || "#C68FE6",
    fundo: hackathon?.corFundo || "#170A36",
  };
  const open = submission?.aberta === true;
  const notStarted = submission && !open && new Date(submission.dataInicio) > new Date();
  const editorValue = viewing ? viewing.codigo : code;

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <section
        style={{ backgroundColor: colors.fundo }}
        className="flex min-h-screen w-full flex-col gap-y-8 px-5 py-8 text-white lg:px-10"
      >
        <div className="mx-auto w-full max-w-7xl">
          <BackButton />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 rounded-3xl border border-white/10 bg-surface/40 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
          <HackathonTitle
            text1="Sua entrega"
            text2={hackathon ? ` - ${hackathon.titulo}` : ""}
            color1={colors.principal}
            color2={colors.secundaria}
          />
          {submission && (
            <p className="text-content-secondary">
              {submission.equipe ? `Equipe ${submission.equipe} · ` : ""}
              {open && `Fim das submissões: ${formatDateTime(submission.dataFinal)}`}
              {notStarted && `As submissões abrem em ${formatDateTime(submission.dataInicio)}`}
              {!open && !notStarted && "As submissões foram encerradas"}
            </p>
          )}
        </div>

        {error ? (
          <div className="mx-auto w-full max-w-7xl rounded-2xl border border-white/10 bg-surface/40 p-6 text-content">
            <p>{error}</p>
            <Link to={`/hackathon/${encodeURIComponent(id)}`} className="mt-3 inline-block underline text-content-secondary hover:text-content">
              Voltar para o Hackathon
            </Link>
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
            {/* EDITOR */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/40 p-6 backdrop-blur-sm lg:col-span-2">
              <HackathonSubtitle text1="CÓDIGO" text2=" DA ENTREGA" color1={colors.principal} color2={colors.secundaria} />

              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={viewing ? viewing.linguagem : language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={!open || Boolean(viewing)}
                  className="rounded-xl border border-brand bg-surface-light p-3 text-content"
                >
                  {languages.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept=".js,.py,.cs,.java,.sql,.txt"
                  onChange={handleFile}
                  disabled={!open}
                  className="text-content file:mr-3 file:rounded-lg file:border-none file:bg-brand file:px-4 file:py-2 file:text-white"
                />
                {fileName && !viewing && <span className="text-sm text-content-secondary">{fileName}</span>}
              </div>

              {viewing && (
                <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-2 text-sm text-warning">
                  Vendo a versão {viewing.versao} (só leitura).{" "}
                  <button type="button" onClick={() => setViewing(null)} className="underline">
                    Voltar ao editor
                  </button>
                </p>
              )}

              <textarea
                value={editorValue}
                onChange={(e) => setCode(e.target.value)}
                readOnly={!open || Boolean(viewing)}
                spellCheck={false}
                rows={20}
                placeholder="Digite ou cole seu código aqui"
                className="min-h-[420px] resize-y rounded-xl border border-brand bg-surface p-4 font-mono text-sm text-content outline-none focus:border-highlight"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-content-secondary">{code.length.toLocaleString("pt-BR")} / 102.400 caracteres</span>
                <button
                  type="submit"
                  disabled={!open || loading || Boolean(viewing)}
                  style={{ backgroundColor: colors.principal }}
                  className="rounded-xl px-8 py-3 text-lg font-semibold shadow-lg transition-all hover:-translate-y-1 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Enviar versão
                </button>
              </div>
              {message && <p className="rounded-xl border border-white/10 bg-surface-light px-5 py-3 text-center text-content">{message}</p>}
            </form>

            {/* VERSÕES */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/40 p-6 backdrop-blur-sm">
              <HackathonSubtitle text1="VERSÕES" text2=" ENVIADAS" color1={colors.principal} color2={colors.secundaria} />
              {submission?.versoes.length === 0 && <p className="text-content-secondary">Nenhuma versão enviada ainda.</p>}
              <ul className="flex flex-col gap-2">
                {submission?.versoes.map((version) => (
                  <li key={version.versao}>
                    <button
                      type="button"
                      onClick={() => openVersion(version)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition hover:border-highlight ${
                        viewing?.versao === version.versao ? "border-highlight bg-surface" : "border-white/10 bg-surface-light/40"
                      }`}
                    >
                      <span className="font-semibold">v{version.versao}</span>
                      {version.vale && <span className="ml-2 rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold text-success">vale esta</span>}
                      <span className="block text-sm text-content-secondary">
                        {formatDateTime(version.enviadoEm)} · {version.enviadoPor} · {version.linguagem}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SubmissionPage;
