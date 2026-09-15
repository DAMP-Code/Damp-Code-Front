import React from "react";
import { useNavigate } from "react-router-dom";

const HackathonCard = ({ hackathon }) => {
  const navigate = useNavigate();
  console.log(hackathon);
  return (
    <div
      style={{
        backgroundImage: `url(${hackathon.logo})`,
      }}
      className="
    w-[min(100%,21rem)]
    min-h-80
    flex
    flex-col
    text-center
    rounded-2xl
    items-center
    justify-center
    relative
    overflow-hidden
    bg-no-repeat
    bg-cover
    bg-center
    border border-white/10
    shadow-[0_18px_45px_rgba(0,0,0,0.28)]
    transition-all duration-300
    hover:-translate-y-1.5 hover:border-brand-light/50 hover:shadow-[0_24px_55px_rgba(108,72,197,0.24)]
  "
    >
      <h1 className="z-10 max-w-[85%] text-balance text-2xl text-content drop-shadow-lg">
        <b>{hackathon.titulo}</b>
      </h1>

      <h2 className="z-10 mt-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-sm text-content backdrop-blur-sm">{hackathon.empresa}</h2>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>
      <div className="absolute bottom-0 z-10 flex w-full items-center justify-between gap-3 border-t border-white/10 bg-surface-light/95 px-4 py-3 text-left backdrop-blur-md">
        <div className="flex flex-col text-center">
          <h1 className="text-content text-lg">
            <b>{hackathon.tecnologias?.length || 0}</b>
          </h1>

          <h3 className="text-content-secondary">
            <b>Techs</b>
          </h3>
        </div>

        <div className="flex flex-col text-center">
          <h1 className="text-content text-lg">
            <b>R$ {hackathon.premiacao}</b>
          </h1>

          <h3 className="text-content-secondary">
            <b>Prêmio</b>
          </h3>
        </div>

        <button className="rounded-lg bg-highlight px-3 py-2 text-sm font-bold text-surface hover:-translate-y-0.5 hover:brightness-110" onClick={() => navigate(`/hackathon/${hackathon.hackathonId}`)}>
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default HackathonCard;
