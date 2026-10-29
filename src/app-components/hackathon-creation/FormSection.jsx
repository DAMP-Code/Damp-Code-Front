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
  handlePublish,
  message,
  isEditing,
  isDraft,
  isPublished,
  canPublish,
  loading,
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
  // depois de publicado, quantos ganham fica travado
  if (isPublished) return;
  setHackathon({
    ...hackathon,
    Ranking: item,
  });
}

function handleMethod(item) {
  if (isPublished) return;
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
      <Title text1={isEditing ? "Editar" : "Criar"} text2={"Hackathon"} />

      <form className="flex flex-col gap-y-6 rounded-3xl border border-white/10 bg-surface-light/35 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.2)] sm:p-7" onSubmit={handleSubmit}>
        {isPublished && (
          <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-warning">
            Depois de publicado, só cores e logo podem ser alterados.
          </p>
        )}

        {/* Nome */}
        <div className="flex flex-col gap-y-2">
          <label className="text-content font-semibold">Nome do Hackathon</label>

          <input
            type="text"
            onChange={handleChange}
            name="Titulo"
            value={hackathon.Titulo}
            disabled={isPublished}
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

        <div className="flex flex-col gap-y-4 rounded-2xl border border-white/10 bg-surface/40 p-4">
          <label className="text-content font-semibold">Cores do Tema</label>

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
          <label className="text-content font-semibold">Logo do Hackathon</label>

          <input
            type="file"
            onChange={handleLogoChange}
            accept="image/png,image/jpeg,image/webp,image/gif"
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

        {/* Formato */}
        <div className="flex flex-col gap-y-2">
          <label className="text-content font-semibold">Formato</label>

          <select
            name="Formato"
            onChange={handleChange}
            value={hackathon.Formato}
            disabled={isPublished}
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
            "
          >
            <option value="Individual">Individual</option>
            <option value="Equipe">Equipe (2 a 5 pessoas)</option>
          </select>
        </div>

        {/* Datas: início, fim das submissões e fim da avaliação */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-y-2">
            <label className="text-content font-semibold">Data de início</label>

            <input
              name="DataInicio"
              type="datetime-local"
              onChange={handleChange}
              value={hackathon.DataInicio}
              disabled={isPublished}
              className="
                bg-surface-light
                border border-brand
                rounded-xl
                p-4
                text-content
              "
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-content font-semibold">Fim das submissões</label>

            <input
              name="DataFinal"
              type="datetime-local"
              onChange={handleChange}
              value={hackathon.DataFinal}
              disabled={isPublished}
              className="
                bg-surface-light
                border border-brand
                rounded-xl
                p-4
                text-content
              "
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-content font-semibold">Fim da avaliação</label>

            <input
              name="DataFimAvaliacao"
              type="datetime-local"
              onChange={handleChange}
              value={hackathon.DataFimAvaliacao}
              disabled={isPublished}
              className="
                bg-surface-light
                border border-brand
                rounded-xl
                p-4
                text-content
              "
            />
          </div>
        </div>

        {/* Área */}
        <div className="flex flex-col gap-y-2">
          <label className="text-content font-semibold">Área</label>

          <select
            name="Area"
            onChange={handleChange}
            value={hackathon.Area}
            disabled={isPublished}
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
          <label className="text-content font-semibold">Descrição</label>

          <textarea
            name="Descricao"
            onChange={handleChange}
            required
            value={hackathon.Descricao}
            disabled={isPublished}
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

        {/* Tipo de premiação */}
        <div className="flex flex-col gap-y-2">
          <label className="text-content font-semibold">Tipo de premiação</label>

          <select
            name="TipoPremiacao"
            onChange={handleChange}
            value={hackathon.TipoPremiacao}
            disabled={isPublished}
            className="
              bg-surface-light
              border border-brand
              rounded-xl
              p-4
              text-content
            "
          >
            <option value="">Selecione</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Entrevista">Encaminhamento para entrevista</option>
          </select>
        </div>

        {/* o valor só faz sentido quando a premiação é em dinheiro */}
        {hackathon.TipoPremiacao === "Dinheiro" && (
        <div className="flex flex-col gap-y-2">
          <label className="text-content font-semibold">Premiação Total</label>

          <input
            type="number"
            name="Premiacao"
            value={hackathon.Premiacao}
            onChange={handleChange}
            disabled={isPublished}
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
        )}

        <div className="flex flex-col gap-y-4">
          <label className="text-content font-semibold">Tecnologias</label>

          <div className="grid grid-cols-2 gap-4">
            {technologies.map((technology) => (
              <label key={technology} className="flex items-center gap-x-2 text-content">
                <input
                  type="checkbox"
                  value={technology}
                  //ver se está marcado e add
                  checked={hackathon.Tecnologias?.includes(technology) || false}
                  disabled={isPublished}
                  //altera o estado
                  onChange={handleTechnologies}
                />
                {technology}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="text-content font-semibold">Quantos Ganham?</label>
          <div className="grid grid-cols-3 gap-4">
            {rankings.map((item) => (
              <button
                key={item}
                type="button"
                disabled={isPublished}
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
        bg-surface
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
                <p className="text-content font-semibold text-xl ">{item.name} </p>

                <div className="w-3 h-3 rounded-full bg-brand group-hover:bg-highlight transition" />
              </div>

              {/* DESCRIÇÃO */}
              <p className="text-content-secondary text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col gap-y-3">
          <input
            type="submit"
            value={isPublished ? "Salvar alterações" : "Salvar rascunho"}
            disabled={loading}
            className="
      w-full
      bg-highlight
      hover:brightness-110
      text-surface
      font-bold
      text-lg
      py-4
      rounded-xl
      cursor-pointer
      transition-all
      duration-300
      hover:-translate-y-0.5
      shadow-[0_12px_30px_rgba(255,234,0,0.15)]
    "
          />

          {/* Publicar só existe para rascunho; empresa não verificada vê o botão desabilitado */}
          {isDraft && (
            <>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading || !canPublish}
                className="w-full rounded-xl border border-highlight py-4 text-lg font-bold text-highlight transition-all duration-300 hover:bg-highlight hover:text-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-highlight"
              >
                Publicar
              </button>
              {!canPublish && (
                <p className="text-center text-sm text-warning">
                  Sua empresa precisa ser verificada para publicar.
                </p>
              )}
            </>
          )}
        </div>
      </form>
      {message && <p className="rounded-xl border border-white/10 bg-surface-light px-5 py-3 text-center text-content">{message}</p>}
    </section>
  );
};

export default FormSection;
