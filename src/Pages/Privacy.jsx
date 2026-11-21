import React from 'react'
import LegalPage from '@/app-components/legal/LegalPage'

// Texto provisório (lorem ipsum) até a equipe mandar a política definitiva.
const lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.',
  'Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Vestibulum id ligula porta felis euismod semper.',
]

const sections = [
  { id: 'dados-coletados', title: 'Dados que coletamos', paragraphs: lorem },
  { id: 'uso', title: 'Como usamos os dados', paragraphs: lorem },
  { id: 'compartilhamento', title: 'Compartilhamento com empresas', paragraphs: lorem },
  { id: 'armazenamento', title: 'Armazenamento e segurança', paragraphs: lorem },
  { id: 'direitos', title: 'Seus direitos (LGPD)', paragraphs: lorem },
  { id: 'cookies', title: 'Cookies e armazenamento local', paragraphs: lorem },
  { id: 'alteracoes', title: 'Alterações nesta política', paragraphs: lorem },
  { id: 'contato', title: 'Contato e encarregado de dados', paragraphs: lorem.slice(0, 1) },
]

const Privacy = () => (
  <LegalPage
    title='Política de Privacidade'
    intro='Quais dados o Damp Code guarda, para que eles servem, com quem são compartilhados e como você pode pedir acesso ou exclusão.'
    updatedAt='21/11/2026'
    sections={sections}
    other={{ to: '/termos', label: 'Ler os Termos de Serviço' }}
  />
)

export default Privacy
