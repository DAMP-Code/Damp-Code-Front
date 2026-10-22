import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ title, text, actionLabel, to }) => {
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-4 rounded-2xl border border-white/10 bg-surface-light p-8 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <h2 className="text-xl font-semibold text-content">{title}</h2>
      <p className="leading-relaxed text-content-secondary">{text}</p>
      {to && actionLabel ? (
        <Link
          to={to}
          className="rounded-xl bg-highlight px-6 py-3 text-sm font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
