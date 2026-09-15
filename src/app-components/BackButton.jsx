import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand-light/30 bg-brand px-5 py-2.5 font-semibold text-white shadow-[0_8px_24px_rgba(108,72,197,0.25)] hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_12px_28px_rgba(108,72,197,0.35)] active:translate-y-0"
    >
      Voltar
    </button>
  );
};

export default BackButton;
