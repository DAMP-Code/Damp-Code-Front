import React from "react";
import { youtubeId } from "@/app-components/utilities/youtube";

const typeLabel = { Texto: "Texto", Link: "Link", Video: "Vídeo" };

const ContentItem = ({ content, accent }) => {
  const videoId = content.tipo === "Video" ? youtubeId(content.url) : null;

  return (
    <li className="flex flex-col gap-2 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-content-secondary">
          {typeLabel[content.tipo] || content.tipo}
        </span>
        <h4 className="font-semibold text-white">{content.titulo}</h4>
      </div>

      {content.tipo === "Texto" ? (
        <p className="whitespace-pre-line leading-relaxed text-content-secondary wrap-break-word">{content.texto}</p>
      ) : (
        <>
          {content.texto && <p className="text-sm text-content-secondary">{content.texto}</p>}
          {videoId ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="size-full"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
                title={content.titulo}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accent }}
              className="w-fit font-semibold underline-offset-4 hover:underline"
            >
              {content.tipo === "Video" ? "Assistir o vídeo" : "Abrir o link"} (abre em nova aba)
            </a>
          )}
        </>
      )}
    </li>
  );
};

// Módulos do Hackathon na página pública: um bloco recolhível por módulo, o primeiro já aberto.
const ModuleList = ({ modules, accent }) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {modules.map((module, index) => (
        <details
          key={module.moduloId}
          open={index === 0}
          className="group rounded-xl border border-white/10 bg-surface/40 open:bg-surface/60"
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
              {module.posicao}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-semibold text-white">{module.titulo}</span>
              <span className="text-sm text-content-secondary">
                {module.conteudos.length === 1 ? "1 conteúdo" : `${module.conteudos.length} conteúdos`}
              </span>
            </span>
            <span aria-hidden="true" className="mt-1 text-content-secondary transition group-open:rotate-180">
              ▾
            </span>
          </summary>

          <div className="flex flex-col gap-4 px-4 pb-5">
            {module.descricao && <p className="text-sm text-content-secondary">{module.descricao}</p>}
            {module.conteudos.length === 0 ? (
              <p className="text-sm text-content-secondary">Os conteúdos deste módulo ainda vão ser publicados.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {module.conteudos.map((content) => (
                  <ContentItem key={content.conteudoId} content={content} accent={accent} />
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default ModuleList;
