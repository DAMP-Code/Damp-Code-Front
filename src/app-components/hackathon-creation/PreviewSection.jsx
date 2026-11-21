import React from 'react'
import HackathonView from '@/app-components/hackathon-page/HackathonView'

// mesmos rótulos das opções de área do formulário
const areaLabels = {
  tech: 'Tech Geral',
  web: 'Desenvolvimento Web',
  dados: 'Ciência de Dados',
  ia: 'Inteligência Artificial',
}

// Converte o estado do formulário (Titulo, Premios...) no formato que a página do Hackathon recebe da API.
function toPagePreview(hackathon) {
  return {
    titulo: hackathon.Titulo || 'Nome do Hackathon',
    empresa: hackathon.Empresa,
    area: areaLabels[hackathon.Area] || hackathon.Area,
    formato: hackathon.Formato,
    descricao: hackathon.Descricao,
    metodo: hackathon.Metodo,
    tecnologias: hackathon.Tecnologias,
    premios: (hackathon.Premios || [])
      .filter((prize) => prize.Tipo)
      .map((prize) => ({
        posicao: prize.Posicao,
        tipo: prize.Tipo,
        valor: prize.Valor === '' ? null : Number(prize.Valor),
        descricao: prize.Descricao,
      })),
    corPrincipal: hackathon.corPrincipal,
    corSecundaria: hackathon.corSecundaria,
    logo: hackathon.Logo,
    dataInicio: hackathon.DataInicio || null,
    dataFinal: hackathon.DataFinal || null,
    dataFimAvaliacao: hackathon.DataFimAvaliacao || null,
    // a prévia mostra a página como ela fica depois de publicada
    fase: 'Publicado',
    participantes: '0 pessoas já entraram',
  }
}

const PreviewSection = ({ hackathon }) => {
  return (
    <section
      style={{ backgroundColor: hackathon.corFundo }}
      aria-label='Prévia da página do Hackathon'
      className='sticky top-20 hidden h-[calc(100vh-5rem)] w-1/2 flex-col gap-4 overflow-y-auto overflow-x-hidden border-l border-white/10 bg-surface px-5 py-6 text-white md:flex lg:px-8'
    >
      <p className='text-sm text-content-secondary'>
        Prévia: é assim que os participantes vão ver a página depois de publicada.
      </p>

      <HackathonView
        hackathon={toPagePreview(hackathon)}
        action={
          <button
            type='button'
            disabled
            style={{ backgroundColor: hackathon.corPrincipal }}
            className='w-full cursor-default rounded-xl px-8 py-3 text-lg font-semibold text-white shadow-lg'
          >
            Participar
          </button>
        }
      />
    </section>
  )
}

export default PreviewSection
