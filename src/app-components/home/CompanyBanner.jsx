import React from 'react'
import HomeBanner from './HomeBanner'

const CompanyBanner = () => {
  return (
    <HomeBanner text1={"Transforme desafios em recrutamento real"} text2={"Publique um hackathon com a vaga, o prêmio e o prazo. A avaliação pode ser por IA ou manual."} actionHref="/cadastroEmpresa" actionLabel="Publicar desafio" />
  )
}

export default CompanyBanner