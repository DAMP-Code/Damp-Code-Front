import React, { useContext, useState } from "react";
import Feedback from "./Feedback";
import { ACCOUNT_API, useAccountUpdate } from "./useAccountUpdate";
import { authFieldClass } from "@/app-components/auth/AuthShell";
import { AuthContext } from "@/app-components/utilities/AuthContext";

const panelClass = "flex flex-col gap-5 rounded-3xl border border-white/10 bg-surface-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-8";
const saveClass = "w-fit rounded-xl bg-highlight px-5 py-2.5 font-bold text-surface transition hover:brightness-110 disabled:opacity-60";

// Formulários das configurações da conta: dados (nome e e-mail) e troca de senha.
const AccountForms = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { busy, status, send, setSectionStatus } = useAccountUpdate();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canEditName = user?.role === "participante";

  async function saveName(e) {
    e.preventDefault();
    const data = await send("nome", ACCOUNT_API, { name });
    if (!data) return;
    updateUser({ name: data.name });
    setSectionStatus("nome", true, "Nome salvo.");
  }

  async function savePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSectionStatus("senha", false, "A nova senha e a confirmação não são iguais.");
      return;
    }
    const data = await send("senha", `${ACCOUNT_API}/senha`, { senhaAtual: currentPassword, novaSenha: newPassword });
    if (!data) return;
    // trocar a senha invalida o token antigo; a resposta traz um novo
    updateUser({ token: data.token, expiresAt: data.expiresAt });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSectionStatus("senha", true, "Senha alterada. Use a nova senha no próximo login.");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* DADOS */}
      <form onSubmit={saveName} className={panelClass}>
        <div>
          <h3 className="text-xl font-semibold">Seus dados</h3>
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
          <div className="mt-auto flex flex-col gap-2">
            <button type="submit" disabled={busy === "nome" || name.trim() === user?.name} className={saveClass}>
              {busy === "nome" ? "Salvando..." : "Salvar nome"}
            </button>
            <Feedback status={status.nome} />
          </div>
        )}
      </form>

      {/* SENHA */}
      <form onSubmit={savePassword} className={panelClass}>
        <div>
          <h3 className="text-xl font-semibold">Senha</h3>
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
        <div className="flex flex-col gap-2">
          <button type="submit" disabled={busy === "senha"} className={saveClass}>
            {busy === "senha" ? "Salvando..." : "Trocar senha"}
          </button>
          <Feedback status={status.senha} />
        </div>
      </form>
    </div>
  );
};

export default AccountForms;
