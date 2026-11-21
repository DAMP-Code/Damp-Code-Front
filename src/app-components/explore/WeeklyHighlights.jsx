import React from "react";
import Title from "../Title";
import HackathonCard from "../HackathonCard";
import EmptyState from "../EmptyState";

const WeeklyHighlights = ({ hackathons = [], filtered = false, onClear }) => {
  const list = Array.isArray(hackathons) ? hackathons : [];

  return (
    <section className="flex h-auto w-full flex-col items-center justify-center py-6">
      <div className="flex w-9/10 max-w-7xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <Title text1="Melhores" text2="da semana" />
      </div>

      {list.length === 0 && filtered ? (
        <div className="flex w-9/10 max-w-7xl flex-col items-start gap-3 rounded-2xl border border-white/10 bg-surface-light p-8">
          <h2 className="text-xl font-semibold text-content">Nenhum desafio com esses filtros</h2>
          <p className="text-content-secondary">Tente tirar algum filtro ou buscar por outro termo.</p>
          {onClear && (
            <button type="button" onClick={onClear} className="rounded-xl bg-highlight px-5 py-2.5 font-bold text-surface hover:brightness-110">
              Limpar filtros
            </button>
          )}
        </div>
      ) : list.length === 0 ? (
        <div className="flex w-9/10 max-w-7xl justify-start">
          <EmptyState
            title="Nenhum destaque esta semana"
            text="Os hackathons publicados aparecem aqui. Enquanto isso, você pode criar uma conta e acompanhar os próximos desafios."
            actionLabel="Criar conta"
            to="/escolha"
          />
        </div>
      ) : (
        <div className="flex w-full min-w-0 max-w-7xl flex-wrap items-stretch justify-start gap-6">
          {list.map((hackathon) => (
            <HackathonCard
              key={hackathon.hackathonId || hackathon.HackathonId}
              hackathon={hackathon}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WeeklyHighlights
