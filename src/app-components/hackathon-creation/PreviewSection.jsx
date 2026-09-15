import React from 'react'
import HackathonTitle from './HackathonTitle'
import HackathonSubtitle from './HackathonSubtitle'

const PreviewSection = ({ hackathon }) => {
  return (
    <section style={{backgroundColor: hackathon.corFundo}} className='sticky top-20 hidden h-[calc(100vh-5rem)] w-1/2 flex-col gap-y-8 overflow-y-auto border-l border-white/10 bg-[#070012] px-6 py-8 text-white md:flex lg:px-10'>

      {/* HEADER */}
      <div className='flex-col lg:flex justify-between items-start w-full'>

        <div className='flex items-center gap-x-5 w-full lg:w-3/4 pb-5'>
          <img className='w-1/3' src={hackathon.Logo || "/src/assets/DAMPCode.svg"} />

          {/* TITULO */}
          <HackathonTitle
            text1={hackathon.Titulo}
            text2={` - ${hackathon.Empresa}`}
            color1={hackathon.corPrincipal}
            color2={hackathon.corSecundaria}
          /> 

        </div>

        {/* BOTÃO */}
        <button style={{backgroundColor: hackathon.corPrincipal}} className='transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg'>
          Iniciar agora
        </button>

      </div>

      {/* INFORMAÇÕES */}
      <div className='flex flex-wrap gap-x-10 text-sm text-zinc-300 border-b border-zinc-700 pb-6'>

        <p>Área:<b>{hackathon.Area}</b></p>

        {/* PARTICIPANTES */}
        <p>
          {hackathon.participantes || 'X pessoas já entraram'}
        </p>

        {/* VAGAS */}
        <p>
          vagas em prêmios:
          <span className='font-bold text-white'>
            {hackathon.ranking}
          </span>{' '}
        </p>

        {/* premiacao */}
        <p>
          Premiação: R$<b>{hackathon.Premiacao}</b>
        </p>

        {/* DATA */}
        <p>
          Termina {hackathon.Data}
        </p>

      </div>

      {/* CONTEÚDO */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>

        {/* ESQUERDA */}
        <div className='flex flex-col gap-y-10'>

          <div>
            <HackathonSubtitle
                text1="DESCRIÇÃO "
                text2={"DO HACKATON"}
                color1={hackathon.corPrincipal}
                color2={hackathon.corSecundaria}
            />

            <p className='text-zinc-300 leading-relaxed mt-3 text-base wrap-break-word max-w-full'>
              {hackathon.Descricao}
            </p>
          </div>

          <div>
            <HackathonSubtitle
                text1="MÉTODO DE"
                text2={"AVALIAÇÃO"}
                color1={hackathon.corPrincipal}
                color2={hackathon.corSecundaria}
            />

            <p className='text-zinc-300 leading-relaxed mt-3 text-base'>
              {hackathon.Metodo}
            </p>
          </div>

        </div>

        {/* DIREITA */}
        <div className='flex flex-col gap-y-10'>
          <div>
            <HackathonSubtitle
                text1="QUAL É A SUA"
                text2={"OPORTUNIDADE"}
                color1={hackathon.corPrincipal}
                color2={hackathon.corSecundaria}
            />

            <p className='text-zinc-300 leading-relaxed mt-3 text-base'>
              Nesse hackaton, está escolhido o top{' '}
              <span style={{color: hackathon.corPrincipal}} className=' font-bold'>100</span>,
              os 100 mais dedicados terão os benefícios,
              de mais de{' '}
              <span style={{color: hackathon.corPrincipal}} className=' font-bold'>
                R$ 10000
              </span>{' '}
              distribuídos, e oportunidades na empresa.
            </p>
          </div>

          <div>

            <HackathonSubtitle
                text1="LISTA DE"
                text2={"TECNOLOGIAS"}
                color1={hackathon.corPrincipal}
                color2={hackathon.corSecundaria}
            />

            <div className='flex flex-wrap items-center gap-x-5 mt-5'>

              {hackathon.tecnologias?.map((technology, index) => (
                // <img
                //   key={index}
                //   src={tec}
                //   alt="Tecnologia"
                //   className='w-10 h-10 object-contain'
                // />
                <p key={index}>{technology}</p>
              ))}

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div style={{color: hackathon.corPrincipal}} className='hidden lg:flex align-top gap-x-8 font-semibold text-xl p-10 w-1/2'>

        <button className='hover:text-white transition-all'>
          Desafio
        </button>

        <button className='hover:text-white transition-all'>
          Ranking
        </button>

        <button className='hover:text-white transition-all'>
          Comunidade
        </button>

        <button className='hover:text-white transition-all'>
          Conteúdos
        </button>

        <button className='hover:text-white transition-all'>
          Certificado
        </button>

      </div>
          
    </section>
  )
}

export default PreviewSection
