import React from "react";
import Title from "../Title";
import HackathonCard from "../HackathonCard";
import EmptyState from "../EmptyState";

const WeeklyHighlights = ({ hackathons = [] }) => {
  const list = Array.isArray(hackathons) ? hackathons : [];

  return (
    <section className="flex h-auto w-full flex-col items-center justify-center py-6">
      <div className="flex w-9/10 max-w-7xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <Title text1="Melhores" text2="da semana" />
      </div>

      {list.length === 0 ? (
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
