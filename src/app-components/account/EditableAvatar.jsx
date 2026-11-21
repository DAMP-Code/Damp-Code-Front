import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@/app-components/Avatar";
import Feedback from "./Feedback";
import { ACCOUNT_API, useAccountUpdate } from "./useAccountUpdate";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { avatarColors, defaultAvatarColor, resizeAvatar } from "@/app-components/utilities/avatar";
import { readableTextColor } from "@/app-components/utilities/color";

// Foto do perfil com lápis: clicar abre o menu para escolher ou remover a foto e trocar a cor das iniciais.
const EditableAvatar = ({ size = "lg" }) => {
  const { user, updateUser } = useContext(AuthContext);
  const { busy, status, send, setSectionStatus } = useAccountUpdate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInput = useRef(null);

  const image = user?.avatarImage || null;
  const color = user?.avatarColor || defaultAvatarColor;

  // fecha o menu com clique fora ou Esc
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function savePhoto(value) {
    const data = await send("foto", ACCOUNT_API, { avatarImage: value });
    if (!data) return;
    updateUser({ avatarImage: data.avatarImage || null });
    setSectionStatus("foto", true, value ? "Foto salva." : "Foto removida.");
  }

  // foto escolhida: recorta e reduz no navegador antes de mandar
  async function choosePhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setSectionStatus("foto", false, "Envie uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSectionStatus("foto", false, "A imagem tem mais de 10 MB. Escolha uma menor.");
      return;
    }
    try {
      await savePhoto(await resizeAvatar(file));
    } catch (error) {
      setSectionStatus("foto", false, error.message);
    }
  }

  async function saveColor(value) {
    if (busy === "cor") return;
    const data = await send("cor", ACCOUNT_API, { avatarColor: value });
    if (!data) return;
    updateUser({ avatarColor: data.avatarColor });
    setSectionStatus("cor", true, "Cor salva.");
  }

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} className="hidden" />
      <div ref={menuRef} className="relative w-fit shrink-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={busy === "foto"}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Editar foto e cor do perfil"
          title="Editar foto e cor"
          className="group relative rounded-2xl disabled:cursor-wait"
        >
          <Avatar name={user?.name} color={color} image={image} size={size} />
          <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-black/0 transition group-hover:bg-black/30 group-focus-visible:bg-black/30" />
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-full border-2 border-surface bg-highlight text-sm text-surface shadow-lg transition group-hover:scale-110"
          >
            <FontAwesomeIcon icon={busy === "foto" ? faSpinner : faPen} spin={busy === "foto"} />
          </span>
        </button>

        {open && (
          <div role="menu" className="absolute left-0 top-full z-30 mt-3 w-72 rounded-2xl border border-white/10 bg-surface-light p-2 text-left shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
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
                  setOpen(false);
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
      <Feedback status={status.foto} />
      <Feedback status={status.cor} />
    </div>
  );
};

export default EditableAvatar;
