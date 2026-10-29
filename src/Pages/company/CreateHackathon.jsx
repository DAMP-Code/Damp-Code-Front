import FormSection from '@/app-components/hackathon-creation/FormSection'
import PreviewSection from '@/app-components/hackathon-creation/PreviewSection'
import Header from '@/app-components/Header'
import Footer from '@/app-components/Footer'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import { toDateTimeLocal, toIsoDate } from '@/app-components/utilities/hackathonDates'
import { m } from 'motion/react'
import React, {useContext, useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'


const CreateHackathon = () => {

const navigate = useNavigate();
// com id: edição de um Hackathon já criado (rascunho ou publicado)
const { id } = useParams();
const { user } = useContext(AuthContext);

const [hackathon, setHackathon] = useState({
  Titulo: "",
  Descricao: "",
  Empresa: "", // só para a prévia: a API usa a empresa da conta
  Area: "tech", // mesmo valor da primeira opção do select
  Formato: "Individual",
  Tecnologias: [],
  Metodo: "",
  Ranking: "",
  TipoPremiacao: "",
  Premiacao: "",

  corPrincipal: "#6C48C5",
  corSecundaria: "#C68FE6",
  corFundo: "#170A36",

  Logo: "",
  logoFile: null,

  DataInicio: "",
  DataFinal: "", // fim das submissões
  DataFimAvaliacao: "",
})

  // fase vem da API; sem id ainda é um rascunho novo
  const [fase, setFase] = useState(id ? null : "Rascunho");
  const [companyAccess, setCompanyAccess] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        const response = await fetch("https://localhost:7092/api/Companies/me", {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        if (!response.ok) return
        const data = await response.json()
        setCompanyAccess(data)
        setHackathon((prev) => ({ ...prev, Empresa: data.name }))
      } catch (error) {
        console.error(error)
      }
    }

    loadCompany()
  }, [user?.token])

  useEffect(() => {
    if (!id) return

    async function loadHackathon() {
      try {
        const response = await fetch(`https://localhost:7092/api/Hackathons/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        if (!response.ok) {
          setMessage("Hackathon não encontrado.")
          return
        }
        const data = await response.json()
        setFase(data.fase)
        setHackathon((prev) => ({
          ...prev,
          Titulo: data.titulo,
          Descricao: data.descricao,
          Empresa: data.empresa,
          Area: data.area,
          Formato: data.formato,
          Tecnologias: data.tecnologias || [],
          Metodo: data.metodo || "",
          Ranking: data.ranking || "",
          TipoPremiacao: data.tipoPremiacao || "",
          Premiacao: data.premiacao || "",
          corPrincipal: data.corPrincipal || "#6C48C5",
          corSecundaria: data.corSecundaria || "#C68FE6",
          corFundo: data.corFundo || "#170A36",
          Logo: data.logo || "",
          DataInicio: toDateTimeLocal(data.dataInicio),
          DataFinal: toDateTimeLocal(data.dataFinal),
          DataFimAvaliacao: toDateTimeLocal(data.dataFimAvaliacao),
        }))
      } catch (error) {
        console.error(error)
      }
    }

    loadHackathon()
  }, [id, user?.token])

  async function handleChange(e) {
    // O handleChange é:

    // um handle genérico
    // Ele substitui:
    // handleNome
    // handleDescricao
    // handleEmpresa
    // handleArea
    // etc.
    // Tudo em UM só.

    const {name, value} = e.target

    setHackathon({
      ...hackathon,
      [name]: value
    })
  }

  const [loading, setLoading] = useState(false)

  // salva o rascunho (POST) ou as alterações (PUT) e devolve o Hackathon da API
  async function saveHackathon() {
    const body = {
      ...hackathon,
      logoFile: undefined, // o arquivo já virou data URL em Logo
      Empresa: undefined,
      Premiacao: hackathon.Premiacao === "" ? null : Number(hackathon.Premiacao),
      DataInicio: toIsoDate(hackathon.DataInicio),
      DataFinal: toIsoDate(hackathon.DataFinal),
      DataFimAvaliacao: toIsoDate(hackathon.DataFimAvaliacao),
    }

    const response = await fetch(
      id
        ? `https://localhost:7092/api/Hackathons/${id}`
        : "https://localhost:7092/api/Hackathons/register/Hackathon",
      {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.detail || "Erro ao salvar Hackathon");
    }
    return data;
  }

   async function handleSubmit(e){
    e.preventDefault();

    setLoading(true)
    setMessage("")
    try {
      const data = await saveHackathon();

      if (id) {
        setFase(data.fase);
        setMessage("Alterações salvas.");
      } else {
        setMessage("Rascunho salvo.");
        navigate(`/cadastroHackaton/${data.hackathonId}`);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
    }

  async function handlePublish() {
    setLoading(true)
    setMessage("")
    try {
      // salva antes para publicar exatamente o que está no formulário
      const saved = await saveHackathon();

      const response = await fetch(
        `https://localhost:7092/api/Hackathons/${saved.hackathonId}/publicar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (!id) navigate(`/cadastroHackaton/${saved.hackathonId}`);
        throw new Error(data?.detail || "Erro ao publicar Hackathon");
      }

      navigate("/dashboard/Empresa");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const isDraft = fase === "Rascunho"
  const isPublished = Boolean(fase) && !isDraft

  return (
    <div className='min-h-screen bg-surface'>
        <Header />
        <section className='flex h-full w-full flex-col md:flex-row'>
            <FormSection
              handleSubmit={handleSubmit}
              handlePublish={handlePublish}
              message={message}
              hackathon={hackathon}
              handleChange={handleChange}
              setHackathon={setHackathon}
              isEditing={Boolean(id)}
              isDraft={isDraft}
              isPublished={isPublished}
              canPublish={companyAccess?.canPublish === true}
              loading={loading}
            />
            <PreviewSection hackathon={hackathon}/>
        </section>
        <Footer />
    </div>
  )
}

export default CreateHackathon
