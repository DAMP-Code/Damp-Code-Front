import { useContext, useState } from "react";
import { AuthContext } from "@/app-components/utilities/AuthContext";
import { API_URL } from "@/app-components/utilities/apiUrl";

export const ACCOUNT_API = `${API_URL}/api/Auth/me`;

// Envio das configurações da conta (PUT /api/Auth/me e /me/senha) com estado de "salvando" e mensagem por seção.
export function useAccountUpdate() {
  const { user } = useContext(AuthContext);
  const [busy, setBusy] = useState(null); // seção que está salvando: "nome" | "foto" | "cor" | "senha"
  const [status, setStatus] = useState({});

  const setSectionStatus = (section, ok, text) => setStatus((current) => ({ ...current, [section]: { ok, text } }));

  // devolve o JSON da resposta, ou null com a mensagem de erro já na seção
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
        setSectionStatus(section, false, data?.detail || "Não foi possível salvar.");
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      setSectionStatus(section, false, "Não foi possível conectar com o servidor.");
      return null;
    } finally {
      setBusy(null);
    }
  }

  return { busy, status, send, setSectionStatus };
}
