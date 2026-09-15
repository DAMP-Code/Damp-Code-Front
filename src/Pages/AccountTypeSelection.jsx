import BackButton from '@/app-components/BackButton'
import ColorBends from '@/app-components/ColorBends'
import React from 'react'
import { Link } from 'react-router-dom'

const AccountTypeSelection = () => {
  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface px-5 py-12'>

  {/* BACKGROUND */}
  <div className='absolute inset-0 z-0'>
    <ColorBends
      colors={["#FFEA00", "#6C48C5", "#C68FE6"]}
      rotation={90}
      speed={0.2}
      scale={1}
      frequency={1}
      warpStrength={1}
      mouseInfluence={1}
      noise={0.15}
      parallax={0.5}
      iterations={1}
      intensity={1.5}
      bandWidth={6}
      transparent
      autoRotate={0}
      color="#A855F7"
    />
  </div>

  {/* CONTEÚDO */}
  <div className='relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row'>

    <div className='relative z-10 flex w-full flex-col items-center'>

  <div className='flex w-full flex-col items-stretch justify-center gap-6 md:flex-row lg:gap-10'>

    <div className='
  w-full min-h-[300px]
  md:w-[420px]
  lg:w-[500px]

  bg-[url(/src/assets/participant.svg)]
  bg-cover
  bg-center
  bg-no-repeat

  rounded-3xl
  border border-brand-light/30
  shadow-[0_20px_55px_rgba(0,0,0,0.32)]

  text-content
  p-8

  flex flex-col
  justify-between

  hover:-translate-y-1
  hover:border-highlight/60
  transition-all
  duration-300
'>
  <p className='
    text-lg
    lg:text-2xl
    font-semibold
    text-center
    leading-relaxed
  '>
    Participe de hackathons e evolua em sua carreira de tecnologia,
    concorra a prêmios e oportunidades.
  </p>

  <Link
    to={'/cadastroUser'}
    className='
      w-full
      h-14

      flex
      items-center
      justify-center

      text-xl
      lg:text-2xl

      font-bold

      bg-brand/95
      hover:bg-brand-hover hover:shadow-[0_12px_30px_rgba(108,72,197,0.35)]

      rounded-xl

      transition-all
      duration-300
    '
  >
    Participante
  </Link>
</div>

    <div className='
  w-full min-h-[300px]
  md:w-[420px]
  lg:w-[500px]

  bg-[url(/src/assets/company.svg)]
  bg-cover
  bg-center
  bg-no-repeat

  rounded-3xl
  border border-brand-light/30
  shadow-[0_20px_55px_rgba(0,0,0,0.32)]

  text-content
  p-8

  flex flex-col
  justify-between

  hover:-translate-y-1
  hover:border-highlight/60
  transition-all
  duration-300
'>
  <p className='
    text-lg
    lg:text-2xl
    font-semibold
    text-center
    leading-relaxed
  '>
    Crie seus próprios hackathons, firme parcerias e encontre as pessoas certas para sua empresa.
  </p>

  <Link
    to={'/cadastroEmpresa'}
    className='
      w-full
      h-14

      flex
      items-center
      justify-center

      text-xl
      lg:text-2xl

      font-bold

      bg-brand/95
      hover:bg-brand-hover hover:shadow-[0_12px_30px_rgba(108,72,197,0.35)]

      rounded-xl

      transition-all
      duration-300
    '
  >
    Empresa
  </Link>
</div>

  </div>

  {/* BOTÃO ABAIXO */}
  <div className='mt-8'>
    <BackButton />
  </div>

</div>

  </div>
</div>
  )
}

export default AccountTypeSelection
