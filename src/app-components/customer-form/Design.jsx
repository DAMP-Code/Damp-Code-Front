import { CardStack } from '@/components/ui/CardStack'
import React from 'react'
const cards = [
  {
    id: 1,
    company: "iFood",
    description:
      "Hackathon ATIVO promovido por uma das maiores empresas de tecnologia e delivery da América Latina. Participe de desafios reais focados em soluções inovadoras para o setor de alimentos, logística e experiência do usuário. Os 50 melhores colocados avançam para etapas exclusivas, incluindo mentorias, networking com profissionais da área e oportunidades concretas de entrevistas com a empresa.",
  },
  {
    id: 2,
    company: "Nubank",
    description:
      "Desafios desenvolvidos por uma das maiores fintechs do mundo, com foco em inovação financeira, escalabilidade e experiência digital. Resolva problemas reais enfrentados pelo mercado, concorra a premiações atrativas e ganhe visibilidade com recrutadores. Os participantes com melhor desempenho podem ser convidados para processos seletivos e oportunidades de contratação.",
  },
];

const Design = ({text1, text2, showCard = false}) => {
  return (
    <div className='w-full bg-[radial-gradient(circle_at_30%_20%,rgba(108,72,197,0.24),transparent_35%),var(--color-surface)] p-1'>
        <div className='w-full h-full hidden md:flex flex-col items-center justify-center gap-y-5'>
          <div className='flex h-2/5 w-full flex-col items-center gap-y-3 text-start'>
            <h2 className='text-3xl text-brand-light'>Bem vindo, <b>Vencedor</b></h2>
            <img src="/src/assets/DAMPCode.svg" className="md:max-w-5/12 pt-3" alt="damp-code-logo" />
            <h2 className='text-xl text-brand'><b>Onde desafios reais viram conquistas reais</b></h2>
            <p className='w-4/5 max-w-2xl text-base leading-relaxed text-content-secondary xl:text-lg'>{text1}</p>
            <p className='hidden w-4/5 max-w-2xl text-base leading-relaxed text-content-secondary xl:flex xl:text-lg'>
                {text2}
            </p>
            <button className='mt-5 w-2/3 rounded-xl bg-highlight py-4 text-lg text-surface shadow-[0_12px_30px_rgba(255,234,0,0.14)] hover:-translate-y-0.5 hover:brightness-110'><b>NÃO PERCA OPORTUNIDADES</b></button>
          </div>
            <div className={`card w-full lg:w-2/3 h-2/5 lg:1/5 items-start ${showCard ? 'hidden lg:flex' : 'hidden'}`}>
                <CardStack items={cards}/>
            </div>
        </div>
    </div>
  )
}

export default Design
