import React, { useContext, useState } from "react";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import Avatar from "@/app-components/Avatar";
import { authFieldClass } from "@/app-components/auth/AuthShell";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { avatarColors, defaultAvatarColor } from "@/app-components/utilities/avatar";
import { readableTextColor } from "@/app-components/utilities/color";

const API = "https://localhost:7092/api/Auth/me";

const panelClass = "flex flex-col gap-5 rounded-3xl border border-white/10 bg-surface-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-8";
const saveClass = "w-fit rounded-xl bg-highlight px-5 py-2.5 font-bold text-surface transition hover:brightness-110 disabled:opacity-60";
const roleLabel = { participante: "Participante", empresa: "Empresa", admin: "Admin" };

// mensagem de sucesso ou erro embaixo de cada seção
const Feedback = ({ status }) =>
  status ? (
    <p role="status" className={`text-sm font-medium ${status.ok ? "text-success" : "text-danger"}`}>
      {status.text}
    </p>
  ) : null;

// Configurações da conta: nome, cor do avatar e senha. Vale para participante, empresa e admin.
const AccountSettings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [color, setColor] = useState(user?.avatarColor || defaultAvatarColor);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(null); // "nome" | "cor" | "senha"
  const [status, setStatus] = useState({});

  const canEditName = user?.role === "participante";

  // envia para a API e devolve o JSON da resposta, ou null (com a mensagem de erro na seção)
  async function send(section, url, body) {
    setBusy(section);
    setStatus((current) => ({ ...current, [section]: null }));
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus((current) => ({ ...current, [section]: { ok: false, text: data?.detail || "Não foi possível salvar." } }));
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      setStatus((current) => ({ ...current, [section]: { ok: false, text: "Não foi possível conectar com o servidor." } }));
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function saveName(e) {
    e.preventDefault();
    const data = await send("nome", API, { name });
    if (!data) return;
    updateUser({ name: data.name });
    setStatus((current) => ({ ...current, nome: { ok: true, text: "Nome salvo." } }));
  }

  async function saveColor(value) {
    const previous = color;
    setColor(value);
    const data = await send("cor", API, { avatarColor: value });
    if (!data) {
      setColor(previous);
      return;
    }
    updateUser({ avatarColor: data.avatarColor });
    setStatus((current) => ({ ...current, cor: { ok: true, text: "Cor salva." } }));
  }

  async function savePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus((current) => ({ ...current, senha: { ok: false, text: "A nova senha e a confirmação não são iguais." } }));
      return;
    }
    const data = await send("senha", `${API}/senha`, { senhaAtual: currentPassword, novaSenha: newPassword });
    if (!data) return;
    // trocar a senha invalida o token antigo; a resposta traz um novo
    updateUser({ token: data.token, expiresAt: data.expiresAt });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus((current) => ({ ...current, senha: { ok: true, text: "Senha alterada. Use a nova senha no próximo login." } }));
  }

  return (
    <div className="min-h-screen bg-surface text-content">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
        {/* QUEM ESTÁ LOGADO */}
        <section className="flex items-center gap-5">
          <Avatar name={canEditName ? name || user?.name : user?.name} color={color} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">Configurações da conta</h1>
            <p className="truncate text-content-secondary">
              {user?.email} · {roleLabel[user?.role]}
            </p>
          </div>
        </section>

        {/* DADOS */}
        <form onSubmit={saveName} className={panelClass}>
          <div>
            <h2 className="text-xl font-semibold">Seus dados</h2>
            <p className="mt-1 text-sm text-content-secondary">O nome aparece no seu perfil, nas equipes e no resultado dos Hackathons.</p>
          </div>

          {canEditName ? (
            <label className="flex flex-col gap-2 text-sm font-medium">
              Nome
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={150}
                autoComplete="name"
                className={authFieldClass}
              />
            </label>
          ) : (
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Nome</span>
              <span className="text-base">{user?.name}</span>
              <span className="text-content-secondary">
                {user?.role === "empresa"
                  ? "O nome da empresa aparece nos Hackathons e passou pela verificação. Para mudar, fale com o suporte."
                  : "Contas de Admin não têm nome para editar."}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">E-mail</span>
            <span className="text-base">{user?.email}</span>
            <span className="text-content-secondary">O e-mail é usado para entrar e não muda por aqui.</span>
          </div>

          {canEditName && (
            <div className="flex flex-col gap-2">
              <button type="submit" disabled={busy === "nome" || name.trim() === user?.name} className={saveClass}>
                {busy === "nome" ? "Salvando..." : "Salvar nome"}
              </button>
              <Feedback status={status.nome} />
            </div>
          )}
        </form>

        {/* COR DO AVATAR */}
        <section className={panelClass}>
          <div>
            <h2 className="text-xl font-semibold">Cor do avatar</h2>
            <p className="mt-1 text-sm text-content-secondary">É a cor do círculo com as suas iniciais na barra do topo. Salva ao escolher.</p>
          </div>
          <fieldset disabled={busy === "cor"} className="flex flex-wrap gap-3">
            <legend className="sr-only">Escolha a cor do avatar</legend>
            {avatarColors.map((item) => {
              const selected = item.value.toLowerCase() === String(color).toLowerCase();
              return (
                <label key={item.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="avatar-color"
                    value={item.value}
                    checked={selected}
                    onChange={() => saveColor(item.value)}
                    className="peer sr-only"
                  />
                  <span
                    title={item.label}
                    style={{ backgroundColor: item.value, color: readableTextColor(item.value) }}
                    className={`flex size-12 items-center justify-center rounded-full text-lg font-bold ring-offset-4 ring-offset-surface-light transition peer-focus-visible:ring-2 peer-focus-visible:ring-white ${
                      selected ? "ring-2 ring-white" : "hover:scale-105"
                    }`}
                  >
                    {selected ? "✓" : ""}
                    <span className="sr-only">{item.label}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          <Feedback status={status.cor} />
        </section>

        {/* SENHA */}
        <form onSubmit={savePassword} className={panelClass}>
          <div>
            <h2 className="text-xl font-semibold">Senha</h2>
            <p className="mt-1 text-sm text-content-secondary">Depois de trocar, os outros aparelhos em que você entrou saem da conta.</p>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Senha atual
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={authFieldClass}
            />
          </label>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Nova senha
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                placeholder="Mínimo de 10 caracteres"
                className={authFieldClass}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Confirmar nova senha
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                className={authFieldClass}
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={busy === "senha"} className={saveClass}>
              {busy === "senha" ? "Salvando..." : "Trocar senha"}
            </button>
            <Feedback status={status.senha} />
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
