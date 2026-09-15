import React from "react";
import Title from "../Title";
import handleLogoChange from "../utilities/handleLogoChange";

const technologies = ["React", "Node", "Python", "MongoDB", "SQL", "PowerBI"];
const rankings = ["Top 1", "Top 10", "Top 15", "Top 20", "Top 50", "Top 100"];
const methods = [
  {
    id: 1,
    name: "Avaliação IA",
    description: "IA avalia performance automaticamente",
  },
  {
    id: 2,
    name: "Autodata",
    description: "Métricas automáticas de atividade",
  },
  {
    id: 3,
    name: "Avaliação Manual",
    description: "Equipe analisa os projetos",
  },
];

const FormSection = ({
  hackathon,
  handleChange,
  setHackathon,
  handleSubmit,
  message,
}) => {
  function handleTechnologies(e) {
  const { value, checked } = e.target;

  if (checked) {
    setHackathon({
      ...hackathon,
      Tecnologias: [...(hackathon.Tecnologias || []), value],
    });
  } else {
    setHackathon({
      ...hackathon,
      Tecnologias: (hackathon.Tecnologias || []).filter(
        (technology) => technology !== value
      ),
    });
  }
}

function handleRankings(item) {
  setHackathon({
    ...hackathon,
    Ranking: item,
  });
}

function handleMethod(item) {
  setHackathon({
    ...hackathon,
    Metodo: item.name,
  });
}

function handleLogoChange(e) {
 const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setHackathon(prev => ({
      ...prev,
      Logo: reader.result
    }));
  };

  reader.readAsDataURL(file);
}

  //   Comparação mental
  // Checkbox

  // O próprio HTML já guarda o valor:

  // <input value="React" />

  // Então:

  // e.target.value

  // já resolve.

  // Botão

  // Botão não guarda:

  // Top 10
  // Top 5
  // Top 100

  // Ele só sabe:
  // "fui clicado".

  // Então você injeta manualmente:

  // handleRankings(item)

  return (
    <section className="flex w-full flex-col gap-y-8 bg-surface px-5 py-8 sm:px-8 md:w-1/2 lg:px-10">
      <Title text1={"Criar"} text2={"Hackathon"} />

      <form className="flex flex-col gap-y-6 rounded-3xl border border-white/10 bg-surface-light/35 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.2)] sm:p-7" onSubmit={handleSubmit}>
        {/* Nome */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Nome do Hackathon</label>

          <input
            type="text"
            onChange={handleChange}
            name="Titulo"
            value={hackathon.Title}
            required
            minLength={5}
            maxLength={100}
            placeholder="Digite o nome do hackathon"
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
              outline-none
              focus:border-highlight
              transition
            "
          />
        </div>

        {/* Empresa */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Empresa Parceira</label>

          <input
            type="text"
            name="Empresa"
            onChange={handleChange}
            value={hackathon.Empresa}
            required
            minLength={2}
            maxLength={100}
            placeholder="Digite a empresa"
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
              outline-none
              focus:border-highlight
            "
          />
        </div>

        <div className="flex flex-col gap-y-4 rounded-2xl border border-white/10 bg-surface/40 p-4">
          <label className="text-highlight font-bold">Cores do Tema</label>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-y-2">
              <span className="text-content text-sm">Cor Principal</span>

              <input
                type="color"
                name="corPrincipal"
                value={hackathon.corPrincipal}
                onChange={handleChange}
                className="w-16 h-16 bg-transparent border-none cursor-pointer"
              />
            </div>
            {/* Secundária */}
            <div className="flex flex-col gap-y-2">
              <span className="text-content text-sm">Cor Secundária</span>

              <input
                type="color"
                name="corSecundaria"
                value={hackathon.corSecundaria}
                onChange={handleChange}
                className="w-16 h-16 bg-transparent border-none cursor-pointer"
              />
            </div>
            {/* Fundo */}
            <div className="flex flex-col gap-y-2">
              <span className="text-content text-sm">Cor de Fundo</span>

              <input
                type="color"
                name="corFundo"
                value={hackathon.corFundo}
                onChange={handleChange}
                className="w-16 h-16 bg-transparent border-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Upload Logo */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Logo do Hackathon</label>

          <input
            type="file"
            onChange={handleLogoChange}
            accept="image/*"
            className="
              text-content
              file:bg-brand
              file:border-none
              file:px-4
              file:py-2
              file:rounded-lg
              file:text-white
            "
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Status</label>

          <select
            name="status"
            onChange={handleChange}
            value={hackathon.status}
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
            "
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* DataFim */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Data Final:</label>

          <input
            name="DataFinal"
            type="date"
            onChange={handleChange}
            value={hackathon.DataFinal}
             min={hackathon.DataCriacao}
             max="2028-12-31" 
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
            "
          />
        
        </div>

        {/* Área */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Área</label>

          <select
            name="Area"
            onChange={handleChange}
            value={hackathon.Area}
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
            "
          >
            <option value="tech">Tech Geral</option>
            <option value="web">Desenvolvimento Web</option>
            <option value="dados">Ciência de Dados</option>
            <option value="ia">Inteligência Artificial</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Descrição</label>

          <textarea
            name="Descricao"
            onChange={handleChange}
            required
            value={hackathon.Descricao}
            minLength={30}
            maxLength={500}
            placeholder="Descreva o hackathon"
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
              min-h-[180px]
              resize-none
            "
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-highlight font-bold">Premiação Total</label>

          <input
            type="number"
            name="Premiacao"
            value={hackathon.Premiacao}
            onChange={handleChange}
            max={100000}
            min={0}
            placeholder="10000"
            className="
      bg-surface-light
      border border-brand
      rounded-xl
      p-4
      text-content
    "
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="text-highlight font-bold">Tecnologias</label>

          <div className="grid grid-cols-2 gap-4">
            {technologies.map((technology) => (
              <label key={technology} className="flex items-center gap-x-2 text-content">
                <input
                  type="checkbox"
                  value={technology}
                  //ver se está marcado e add
                  checked={hackathon.Tecnologias?.includes(technology) || false}
                  //altera o estado
                  onChange={handleTechnologies}
                />
                {technology}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="text-highlight font-bold">Quantos Ganham?</label>
          <div className="grid grid-cols-3 gap-4">
            {rankings.map((item) => (
              <button
                key={item}
                type="button"
                className={`
                  border rounded-xl p-4 transition
                  
                  ${
                    hackathon.Ranking === item
                      ? "bg-highlight border-highlight text-surface"
                      : "border-brand text-content hover:border-highlight hover:bg-surface-light"
                  }
        `}
                onClick={() => handleRankings(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methods.map((item) => (
            <div
              key={item.name}
              className={`
  cursor-pointer
  group
  rounded-2xl
  p-6
  flex flex-col
  gap-y-4
  border
  transition-all
  duration-300

  ${
    hackathon.Metodo === item.name
      ? `
        border-highlight
        bg-[#241042]
        shadow-[0_0_25px_rgba(255,204,0,0.18)]
        scale-[1.02]
      `
      : `
        bg-surface-light
        border-brand
        hover:border-highlight
        hover:-translate-y-1
        hover:shadow-[0_0_20px_rgba(198,143,230,0.15)]
      `
  }
`}
              onClick={() => handleMethod(item)}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <p className="text-highlight font-bold text-xl ">{item.name} </p>

                <div className="w-3 h-3 rounded-full bg-brand group-hover:bg-highlight transition" />
              </div>

              {/* DESCRIÇÃO */}
              <p className="text-zinc-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <input
            type="submit"
            value="Criar Hackathon"
            className="
      w-full
      bg-brand
      hover:bg-brand-hover
      text-white
      font-bold
      text-lg
      py-4
      rounded-2xl
      cursor-pointer
      transition-all
      duration-300
      hover:scale-[1.01]
      hover:shadow-[0_0_25px_rgba(108,72,197,0.35)]
    "
          />
        </div>
      </form>
      {message && <p className="rounded-xl border border-white/10 bg-surface-light px-5 py-3 text-center text-content">{message}</p>}
    </section>
  );
};

export default FormSection;
