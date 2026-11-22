import React, { useContext } from 'react'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import Header from '../app-components/Header'
import "../style.css"
import Banner from '../app-components/home/Banner'
import Cards from '../app-components/home/Cards'
import HomeRanking from '../app-components/home/HomeRanking'
import CompanyBanner from '../app-components/home/CompanyBanner'
import Game from '@/app-components/home/Game'
import HomeCommunity from '@/app-components/home/HomeCommunity'
import Footer from '@/app-components/Footer'
import HomeTicker from '@/app-components/home/HomeTicker'
import HomeSteps from '@/app-components/home/HomeSteps'

const Home = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className='bg-surface w-full min-h-screen'>
      <Header />

      <section id="inicio">
        <Banner />
      </section>

      <HomeTicker />

      <section id="explore">
        <Cards />
      </section>

      <section id="como-funciona">
        <HomeSteps />
      </section>

      <section id="ranking">
        <HomeRanking />
      </section>

      {/* seções de apresentação (com "Criar conta" e "Publicar desafio"): só para quem ainda não entrou */}
      {!user && (
        <>
          <section id="empresas">
            <CompanyBanner />
          </section>

          <section id="game">
            <Game />
          </section>

          <section id="comunidade">
            <HomeCommunity />
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}

export default Home