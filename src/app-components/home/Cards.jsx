import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Title from "../Title";
import HackathonCard from "../HackathonCard";
import EmptyState from "../EmptyState";

const Cards = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHackathons() {
      try {
        const response = await fetch("https://localhost:7092/api/Hackathons");
        const data = await response.json();
        if (!cancelled) {
          setHackathons(Array.isArray(data) ? data.slice(0, 4) : []);
        }
      } catch {
        if (!cancelled) setHackathons([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHackathons();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex h-auto w-full flex-col items-center justify-center py-12 text-content lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
        <Title text1="Hackathons" text2="em destaque" />
        <Link
          to="/explore"
          className="mb-5 shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-brand-light hover:bg-white/5 hover:text-highlight"
        >
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="w-full max-w-7xl px-5 text-content-secondary">Carregando hackathons.</p>
      ) : null}

      {!loading && hackathons.length === 0 ? (
        <div className="flex w-full max-w-7xl justify-start px-5">
          <EmptyState
            title="Nenhum hackathon em destaque"
            text="Quando houver desafios publicados, eles aparecem aqui com prêmio, tecnologias e empresa."
            actionLabel="Criar conta"
            to="/escolha"
          />
        </div>
      ) : null}

      {!loading && hackathons.length > 0 ? (
        <div className="flex w-full max-w-7xl flex-col flex-wrap items-center justify-start gap-6 px-5 md:flex-row">
          {hackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon.hackathonId || hackathon.HackathonId}
              hackathon={hackathon}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default Cards;
