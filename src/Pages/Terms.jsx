import React from 'react'
import LegalPage from '@/app-components/legal/LegalPage'

// Texto provisório (lorem ipsum) até a equipe mandar os termos definitivos.
const lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.',
  'Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Vestibulum id ligula porta felis euismod semper.',
]

const sections = [
  { id: 'aceitacao', title: 'Aceitação dos termos', paragraphs: lorem },
  { id: 'contas', title: 'Contas de participante e de empresa', paragraphs: lorem },
  { id: 'hackathons', title: 'Hackathons e inscrições', paragraphs: lorem },
  { id: 'entregas', title: 'Entregas e propriedade do código', paragraphs: lorem },
  { id: 'avaliacao', title: 'Avaliação, resultado e prêmios', paragraphs: lorem },
  { id: 'conduta', title: 'Conduta na plataforma', paragraphs: lorem },
  { id: 'responsabilidade', title: 'Limitação de responsabilidade', paragraphs: lorem },
  { id: 'alteracoes', title: 'Alterações nestes termos', paragraphs: lorem },
  { id: 'contato', title: 'Contato', paragraphs: lorem.slice(0, 1) },
]

const Terms = () => (
  <LegalPage
    title='Termos de Serviço'
    intro='As regras para usar o Damp Code: o que você pode fazer na plataforma, como funcionam os Hackathons, as entregas e os prêmios.'
    updatedAt='21/11/2026'
    sections={sections}
    other={{ to: '/privacidade', label: 'Ler a Política de Privacidade' }}
  />
)

export default Terms
