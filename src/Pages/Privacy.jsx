import React from 'react'
import LegalPage from '@/app-components/legal/LegalPage'
import { emailOficial, encarregadoDeDados } from '@/app-components/legal/contato'

// Texto da Política de Privacidade (versão extensa); summary traz a versão resumida de cada seção.
const sections = [
  {
    id: 'dados-coletados',
    title: 'Dados que coletamos',
    summary: [
      'Podemos coletar as seguintes informações:',
      {
        list: [
          '**Participantes:** nome completo, endereço de e-mail e senha.',
          '**Empresas:** informações de identificação empresarial, incluindo CNPJ.',
          '**Dados de utilização:** informações relacionadas às inscrições, participações, entregas, avaliações e atividades realizadas na plataforma.',
        ],
      },
    ],
    blocks: [
      'Para disponibilizar as funcionalidades da DampCode, poderemos coletar e tratar diferentes categorias de informações.',
      { subtitle: '1.1. Dados de participantes' },
      'Durante o cadastro, poderão ser solicitados:',
      { list: ['Nome completo;', 'Endereço de e-mail;', 'Senha de acesso.'] },
      'Informações adicionais poderão ser fornecidas voluntariamente pelo usuário durante a utilização da plataforma, conforme a disponibilidade de funcionalidades, incluindo informações profissionais, acadêmicas, habilidades e projetos desenvolvidos.',
      { subtitle: '1.2. Dados de empresas' },
      'Para a criação e administração de contas empresariais, poderão ser solicitadas informações como:',
      {
        list: [
          'CNPJ;',
          'Nome ou identificação da empresa;',
          'Endereço de e-mail;',
          'Credenciais de acesso;',
          'Outras informações necessárias à identificação e administração da conta.',
        ],
      },
      { subtitle: '1.3. Dados relacionados à utilização' },
      'Durante a utilização da DampCode, poderão ser registrados dados relacionados às atividades realizadas na plataforma, como:',
      {
        list: [
          'Hackathons consultadas e inscrições realizadas;',
          'Projetos e materiais enviados;',
          'Participações em equipes;',
          'Avaliações, pontuações e resultados;',
          'Interações e atividades realizadas na comunidade.',
        ],
      },
      'Essas informações são necessárias para o funcionamento dos recursos oferecidos e para a manutenção do histórico de participação dos usuários.',
      { subtitle: '1.4. Dados de autenticação e segurança' },
      'A plataforma poderá tratar informações técnicas relacionadas ao acesso e à autenticação das contas, incluindo registros necessários à verificação em duas etapas e à prevenção de acessos não autorizados.',
      'Os e-mails enviados para verificação em duas etapas serão utilizados para confirmar a legitimidade dos acessos e proteger as contas.',
    ],
  },
  {
    id: 'uso',
    title: 'Como usamos os dados',
    summary: [
      'Os dados são utilizados para:',
      {
        list: [
          'Criar e administrar contas.',
          'Realizar autenticação e verificação de identidade.',
          'Permitir inscrições e participação em hackathons.',
          'Gerenciar entregas, avaliações e resultados.',
          'Facilitar a conexão entre participantes e empresas.',
          'Garantir a segurança e o funcionamento da plataforma.',
        ],
      },
    ],
    blocks: [
      'As informações coletadas serão utilizadas para finalidades específicas e legítimas relacionadas ao funcionamento da DampCode.',
      'Entre as principais finalidades estão:',
      '**2.1. Gerenciamento de contas:** criação, autenticação, manutenção e administração de contas de participantes e empresas.',
      '**2.2. Segurança:** realização de verificações de acesso, autenticação em duas etapas e prevenção de atividades fraudulentas ou não autorizadas.',
      '**2.3. Funcionamento das hackathons:** gerenciamento de inscrições, equipes, submissões, avaliações, classificações e resultados.',
      '**2.4. Conexão profissional:** permitir que empresas organizadoras identifiquem participantes, consultem informações disponibilizadas para os eventos e estabeleçam contato relacionado a oportunidades profissionais.',
      '**2.5. Gamificação:** gerenciamento de níveis, experiência, pontuações, rankings e histórico de participação.',
      '**2.6. Manutenção da plataforma:** identificação de problemas técnicos, aprimoramento de funcionalidades e manutenção da estabilidade e segurança dos serviços.',
      'O tratamento de dados será realizado de acordo com as hipóteses legais aplicáveis a cada finalidade, incluindo, quando cabível, execução de contrato, cumprimento de obrigações legais, exercício regular de direitos e legítimo interesse, observados os requisitos da LGPD.',
      'Quando o tratamento depender de consentimento, este será solicitado de maneira adequada, podendo ser revogado pelo titular nos termos da legislação.',
    ],
  },
  {
    id: 'compartilhamento',
    title: 'Compartilhamento com empresas',
    summary: [
      'Informações dos participantes poderão ser disponibilizadas às empresas organizadoras de hackathons quando forem necessárias à administração dos eventos, avaliação dos projetos ou processos seletivos associados.',
      'O compartilhamento deverá respeitar as finalidades informadas e a legislação aplicável.',
    ],
    blocks: [
      'Uma das principais propostas da DampCode é aproximar participantes e empresas por meio de desafios tecnológicos, hackathons e oportunidades profissionais.',
      'Por esse motivo, determinadas informações poderão ser compartilhadas com empresas organizadoras, patrocinadoras ou responsáveis por eventos, quando necessárias às finalidades apresentadas aos participantes.',
      { subtitle: '3.1. Informações compartilhadas' },
      'Dependendo da hackathon e das funcionalidades utilizadas, poderão ser disponibilizados:',
      {
        list: [
          'Nome e informações de identificação do participante;',
          'Informações de perfil fornecidas pelo próprio usuário;',
          'Projetos, códigos e materiais enviados;',
          'Resultados, classificações e avaliações;',
          'Informações necessárias à comunicação relacionada ao evento.',
        ],
      },
      { subtitle: '3.2. Finalidade do compartilhamento' },
      'O compartilhamento poderá ocorrer para:',
      {
        list: [
          'Administrar inscrições e participações;',
          'Avaliar projetos e selecionar vencedores;',
          'Organizar equipes e atividades;',
          'Identificar habilidades e conhecimentos dos participantes;',
          'Viabilizar oportunidades de estágio, emprego ou processos seletivos relacionados aos eventos.',
        ],
      },
      { subtitle: '3.3. Responsabilidade das empresas' },
      'As empresas que receberem informações pessoais deverão utilizá-las de maneira compatível com as finalidades informadas e respeitar a legislação de proteção de dados.',
      'Quando uma empresa realizar tratamento de dados para finalidades próprias, como um processo seletivo independente, poderá assumir suas próprias responsabilidades como controladora dos dados envolvidos.',
      'A DampCode não autoriza a utilização indiscriminada das informações dos participantes nem o compartilhamento para finalidades incompatíveis com aquelas apresentadas aos usuários.',
    ],
  },
  {
    id: 'armazenamento',
    title: 'Armazenamento e segurança',
    summary: [
      'Os dados são armazenados utilizando serviços de infraestrutura e bancos de dados, incluindo Vercel, MongoDB e PostgreSQL.',
      'Adotamos medidas técnicas e administrativas destinadas a proteger as informações contra acessos não autorizados, perdas e utilizações indevidas.',
    ],
    blocks: [
      { subtitle: '4.1. Infraestrutura utilizada' },
      'A DampCode utiliza serviços tecnológicos para hospedagem, processamento e armazenamento das informações, incluindo:',
      {
        list: [
          '**Vercel:** infraestrutura de hospedagem e disponibilização da aplicação.',
          '**MongoDB:** banco de dados utilizado para armazenamento de informações da aplicação.',
          '**PostgreSQL:** banco de dados relacional utilizado para armazenamento e gerenciamento de informações estruturadas.',
        ],
      },
      'Esses serviços integram a infraestrutura tecnológica necessária ao funcionamento da plataforma.',
      { subtitle: '4.2. Medidas de segurança' },
      'Buscamos adotar medidas técnicas e administrativas para proteger os dados pessoais contra acessos não autorizados, destruição, perda, alteração ou qualquer forma de tratamento inadequado ou ilícito.',
      'Entre as medidas de proteção previstas estão:',
      {
        list: [
          'Controle de acesso às informações;',
          'Proteção das credenciais de autenticação;',
          'Utilização de mecanismos de verificação em duas etapas;',
          'Medidas de proteção dos bancos de dados;',
          'Adoção de práticas de segurança durante o desenvolvimento e manutenção da aplicação.',
        ],
      },
      'Nenhum sistema conectado à internet está completamente livre de riscos. Portanto, apesar dos esforços de proteção, não é possível garantir segurança absoluta contra todos os incidentes.',
      { subtitle: '4.3. Retenção e exclusão' },
      'Os dados pessoais serão mantidos pelo período necessário ao cumprimento das finalidades para as quais foram coletados, considerando as necessidades operacionais da plataforma e as obrigações legais aplicáveis.',
      'Quando não forem mais necessários, os dados poderão ser eliminados ou anonimizados, ressalvadas as hipóteses legais que autorizem ou exijam sua conservação.',
      'Solicitações de exclusão serão analisadas individualmente, considerando a existência de obrigações legais, regulatórias ou outras hipóteses previstas na LGPD que justifiquem a manutenção de determinadas informações.',
      { subtitle: '4.4. Serviços de terceiros' },
      'Os serviços externos utilizados pela DampCode poderão realizar operações técnicas necessárias à hospedagem, processamento e armazenamento dos dados.',
      'Quando aplicável, essas operações estarão sujeitas às obrigações de proteção de dados e segurança pertinentes, inclusive quanto a eventuais transferências internacionais de dados.',
    ],
  },
  {
    id: 'direitos',
    title: 'Seus direitos (LGPD)',
    summary: [
      'Os usuários podem solicitar:',
      {
        list: [
          'Confirmação e acesso aos seus dados.',
          'Correção de informações incorretas.',
          'Exclusão, bloqueio ou anonimização, quando aplicável.',
          'Informações sobre compartilhamento.',
          'Revogação do consentimento, quando essa for a base legal utilizada.',
          'Outros direitos previstos na LGPD.',
        ],
      },
    ],
    blocks: [
      'De acordo com a Lei Geral de Proteção de Dados Pessoais, os usuários possuem direitos relacionados ao tratamento de suas informações pessoais.',
      'Entre eles estão:',
      '**5.1. Confirmação e acesso:** solicitar a confirmação da existência de tratamento e consultar os dados pessoais mantidos pela plataforma.',
      '**5.2. Correção:** solicitar a atualização ou correção de informações incompletas, incorretas ou desatualizadas.',
      '**5.3. Anonimização, bloqueio ou eliminação:** solicitar essas medidas quando os dados forem desnecessários, excessivos ou tratados em desconformidade com a legislação.',
      '**5.4. Portabilidade:** solicitar a portabilidade dos dados, observadas as condições e regulamentações aplicáveis.',
      '**5.5. Informação sobre compartilhamento:** solicitar informações sobre as entidades públicas e privadas com as quais os dados pessoais foram compartilhados.',
      '**5.6. Revogação do consentimento:** retirar o consentimento anteriormente fornecido, quando essa for a hipótese legal utilizada para o tratamento.',
      '**5.7. Oposição ao tratamento:** opor-se a tratamentos realizados em desconformidade com a legislação, observadas as condições legais.',
      '**5.8. Revisão de decisões automatizadas:** solicitar a revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem seus interesses, nos termos da legislação.',
      'As solicitações poderão ser encaminhadas pelos canais oficiais de contato da DampCode.',
      'O atendimento será realizado de acordo com os procedimentos e prazos estabelecidos pela LGPD e pela regulamentação aplicável.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies e armazenamento local',
    summary: [
      'Atualmente, a DampCode não utiliza ferramentas de Analytics, rastreamento ou publicidade personalizada por cookies.',
      'O armazenamento local ou tecnologias semelhantes poderão ser utilizados para viabilizar funcionalidades essenciais, como autenticação e manutenção de sessões, quando necessário.',
    ],
    blocks: [
      { subtitle: '6.1. Utilização de cookies' },
      'Atualmente, a DampCode não utiliza ferramentas de Analytics, rastreamento ou publicidade personalizada baseada em cookies.',
      'Caso sejam implementadas tecnologias dessa natureza futuramente, esta política será atualizada para informar suas finalidades e condições de utilização.',
      { subtitle: '6.2. Armazenamento local' },
      'A plataforma poderá utilizar mecanismos de armazenamento local do navegador ou tecnologias semelhantes para permitir o funcionamento de recursos essenciais, como manutenção de sessões, autenticação e preferências de utilização.',
      'Esses mecanismos deverão ser utilizados de maneira compatível com suas finalidades e com a legislação aplicável.',
      { subtitle: '6.3. Alterações futuras' },
      'A inclusão de novos mecanismos de rastreamento, publicidade ou análise de comportamento será acompanhada da atualização das informações de privacidade e, quando necessário, da disponibilização de mecanismos adequados de escolha e consentimento.',
    ],
  },
  {
    id: 'alteracoes',
    title: 'Alterações nesta política',
    summary: [
      'Esta política poderá ser atualizada para refletir mudanças nos serviços, nas práticas de tratamento de dados ou na legislação. A versão vigente estará disponível nesta página.',
    ],
    blocks: [
      'Esta Política de Privacidade poderá ser atualizada periodicamente para acompanhar mudanças nas funcionalidades da DampCode, nos serviços utilizados, nas práticas de tratamento de dados ou na legislação aplicável.',
      'A versão vigente estará sempre disponível nesta página, acompanhada da data de sua última atualização.',
      'Quando ocorrerem alterações relevantes que afetem os direitos ou as condições de tratamento dos usuários, a DampCode buscará comunicar as mudanças por meios adequados.',
    ],
  },
  {
    id: 'contato',
    title: 'Contato e encarregado de dados',
    summary: [
      'Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:',
      {
        list: [`**E-mail:** ${emailOficial}`, '**Responsável pelo tratamento de dados:** Equipe responsável pela DampCode.'],
      },
      'As solicitações serão analisadas conforme os procedimentos previstos na LGPD.',
    ],
    blocks: [
      'Caso tenha dúvidas, deseje exercer seus direitos previstos na LGPD ou necessite de esclarecimentos sobre o tratamento de suas informações pessoais, entre em contato com os responsáveis pela DampCode.',
      {
        list: [
          '**Controlador dos dados:** Responsável legal pela operação da plataforma DampCode.',
          `**E-mail para assuntos relacionados à privacidade:** ${emailOficial}`,
          `**Encarregado pelo tratamento de dados pessoais (quando aplicável):** ${encarregadoDeDados}`,
        ],
      },
      'As solicitações serão recebidas e encaminhadas aos responsáveis pelo tratamento de dados, que deverão fornecer os esclarecimentos e adotar as providências cabíveis conforme a legislação.',
    ],
  },
]

const Privacy = () => (
  <LegalPage
    title='Política de Privacidade'
    intro={[
      'A DampCode valoriza a privacidade e a segurança das informações de seus usuários. Esta Política de Privacidade descreve como os dados pessoais são coletados, utilizados, armazenados e compartilhados durante a utilização da plataforma.',
      'Nosso tratamento de dados observa as disposições da Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018), bem como as demais normas aplicáveis à proteção da privacidade.',
    ]}
    updatedAt='novembro de 2026'
    sections={sections}
    closing='A DampCode reafirma seu compromisso com a transparência, a proteção da privacidade e o tratamento responsável das informações pessoais de seus usuários.'
    other={{ to: '/termos', label: 'Ler os Termos de Serviço' }}
  />
)

export default Privacy
