import React from 'react'
import Header from '../app-components/Header'
import "../style.css"
import Banner from '../app-components/home/Banner'
import Cards from '../app-components/home/Cards'
import HomeRanking from '../app-components/home/HomeRanking'
import CompanyBanner from '../app-components/home/CompanyBanner'
import Game from '@/app-components/home/Game'
import HomeCommunity from '@/app-components/home/HomeCommunity'
import Footer from '@/app-components/Footer'

const Home = () => {
  return (
    <div className='bg-surface w-full min-h-screen'>
      <Header />

      <section id="inicio">
        <Banner />
      </section>

      <section id="explore">
        <Cards />
      </section>

      <section id="ranking">
        <HomeRanking />
      </section>

      <section id="empresas">
        <CompanyBanner />
      </section>

      <section id="game">
        <Game />
      </section>

      <section id="comunidade">
        <HomeCommunity />
      </section>

      <Footer />
    </div>
  )
}

export default Home