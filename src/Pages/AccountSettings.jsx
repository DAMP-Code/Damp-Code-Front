import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import Avatar from "@/app-components/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { authFieldClass } from "@/app-components/auth/AuthShell";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { avatarColors, defaultAvatarColor, resizeAvatar } from "@/app-components/utilities/avatar";
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
  const [image, setImage] = useState(user?.avatarImage || null);
  const fileInput = useRef(null);
  const [photoMenu, setPhotoMenu] = useState(false);
  const photoMenuRef = useRef(null);

  // fecha o menu da foto com clique fora ou Esc
  useEffect(() => {
    if (!photoMenu) return;
    function handleClick(e) {
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) setPhotoMenu(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setPhotoMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [photoMenu]);
  const [busy, setBusy] = useState(null); // "nome" | "foto" | "cor" | "senha"
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

  // foto escolhida: recorta e reduz no navegador antes de mandar
  async function choosePhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setStatus((current) => ({ ...current, foto: { ok: false, text: "Envie uma imagem PNG, JPG ou WebP." } }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus((current) => ({ ...current, foto: { ok: false, text: "A imagem tem mais de 10 MB. Escolha uma menor." } }));
      return;
    }
    try {
      await savePhoto(await resizeAvatar(file));
    } catch (error) {
      setStatus((current) => ({ ...current, foto: { ok: false, text: error.message } }));
    }
  }

  async function savePhoto(value) {
    const data = await send("foto", API, { avatarImage: value });
    if (!data) return;
    setImage(data.avatarImage || null);
    updateUser({ avatarImage: data.avatarImage || null });
    setStatus((current) => ({ ...current, foto: { ok: true, text: value ? "Foto salva." : "Foto removida." } }));
  }

  async function saveColor(value) {
    if (busy === "cor") return;
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
        {/* QUEM ESTÁ LOGADO: clicar na foto abre o menu com foto e cor */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-5">
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} className="hidden" />
            <div ref={photoMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setPhotoMenu(!photoMenu)}
                disabled={busy === "foto"}
                aria-haspopup="menu"
                aria-expanded={photoMenu}
                aria-label="Editar foto e cor do perfil"
                title="Editar foto e cor"
                className="group relative rounded-2xl disabled:cursor-wait"
              >
                <Avatar name={canEditName ? name || user?.name : user?.name} color={color} image={image} size="lg" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-black/0 transition group-hover:bg-black/30 group-focus-visible:bg-black/30"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-full border-2 border-surface bg-highlight text-sm text-surface shadow-lg transition group-hover:scale-110"
                >
                  <FontAwesomeIcon icon={busy === "foto" ? faSpinner : faPen} spin={busy === "foto"} />
                </span>
              </button>

              {photoMenu && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-20 mt-3 w-72 rounded-2xl border border-white/10 bg-surface-light p-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setPhotoMenu(false);
                      fileInput.current?.click();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-content hover:bg-white/5"
                  >
                    <FontAwesomeIcon icon={faImage} className="w-4 text-brand-light" />
                    {image ? "Trocar foto" : "Escolher foto"}
                  </button>
                  {image && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setPhotoMenu(false);
                        savePhoto("");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-content hover:bg-white/5 hover:text-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 text-content-secondary" />
                      Remover foto
                    </button>
                  )}
                  {/* sem "disabled" enquanto salva: desabilitar tiraria o foco do teclado da cor escolhida */}
                  <fieldset className="mt-1 border-t border-white/10 px-3 pb-2 pt-3">
                    <legend className="float-left w-full text-sm font-medium text-content">Cor das iniciais</legend>
                    <p className="text-xs text-content-secondary">{image ? "Aparece quando você está sem foto." : "Fundo do círculo com as suas iniciais."}</p>
                    <div className="mt-3 grid grid-cols-8 gap-1.5">
                      {avatarColors.map((item) => {
                        const selected = item.value.toLowerCase() === String(color).toLowerCase();
                        return (
                          <label key={item.value} className="cursor-pointer" title={item.label}>
                            <input
                              type="radio"
                              name="avatar-color"
                              value={item.value}
                              checked={selected}
                              onChange={() => saveColor(item.value)}
                              className="peer sr-only"
                            />
                            <span
                              style={{ backgroundColor: item.value, color: readableTextColor(item.value) }}
                              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ring-offset-2 ring-offset-surface-light transition peer-focus-visible:ring-2 peer-focus-visible:ring-white ${
                                selected ? "ring-2 ring-white" : "hover:scale-110"
                              }`}
                            >
                              {selected ? "✓" : ""}
                              <span className="sr-only">{item.label}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">Configurações da conta</h1>
              <p className="truncate text-content-secondary">
                {user?.email} · {roleLabel[user?.role]}
              </p>
            </div>
          </div>
          <Feedback status={status.foto} />
          <Feedback status={status.cor} />
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
