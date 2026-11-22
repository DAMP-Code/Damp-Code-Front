import React from 'react'
import LegalPage from '@/app-components/legal/LegalPage'
import { emailOficial } from '@/app-components/legal/contato'

// Texto dos Termos de Serviço (versão extensa); summary traz a versão resumida de cada seção.
const sections = [
  {
    id: 'aceitacao',
    title: 'Aceitação dos termos',
    summary: [
      'Ao acessar ou utilizar a DampCode, o usuário declara estar ciente e de acordo com estes Termos de Serviço e com nossa Política de Privacidade. Caso não concorde com as condições estabelecidas, deverá deixar de utilizar a plataforma.',
    ],
    blocks: [
      '1.1. Estes Termos de Serviço regulamentam o acesso e a utilização da DampCode, incluindo seus recursos de cadastro, gerenciamento de perfis, criação e participação em hackathons, envio de projetos, avaliações, rankings e interação entre usuários.',
      '1.2. A utilização da plataforma implica concordância com estes termos e com a Política de Privacidade, que deverá ser consultada separadamente.',
      '1.3. Caso o usuário não concorde com alguma disposição, deverá interromper a utilização da plataforma.',
      '1.4. A DampCode poderá estabelecer regras complementares para funcionalidades específicas, eventos, competições ou serviços. Quando aplicáveis, essas regras serão apresentadas aos usuários antes da participação.',
    ],
  },
  {
    id: 'contas',
    title: 'Contas de participante e de empresa',
    summary: [
      'A DampCode disponibiliza contas para participantes e empresas. Os usuários devem fornecer informações verdadeiras, manter seus dados atualizados e proteger suas credenciais de acesso.',
      'Participantes devem informar seus dados pessoais corretamente. Empresas devem fornecer informações legítimas, incluindo CNPJ válido, quando solicitado.',
      'Cada usuário é responsável pelas atividades realizadas em sua conta.',
    ],
    blocks: [
      '2.1. A DampCode disponibiliza modalidades de cadastro destinadas a participantes e empresas.',
      '2.2. **Contas de participantes:** destinadas a pessoas interessadas em desenvolver habilidades, participar de desafios, apresentar projetos e interagir com a comunidade.',
      '2.3. **Contas empresariais:** destinadas a organizações que desejam criar hackathons, propor desafios, identificar talentos e estabelecer conexões profissionais.',
      '2.4. Durante o cadastro, poderão ser solicitadas as seguintes informações:',
      {
        list: [
          'Participantes: nome completo, endereço de e-mail e senha.',
          'Empresas: informações de identificação empresarial, incluindo CNPJ, além dos dados necessários à administração da conta.',
        ],
      },
      '2.5. Todos os usuários devem fornecer informações verdadeiras, completas e atualizadas, responsabilizando-se por eventuais informações falsas ou fraudulentas.',
      '2.6. O usuário é responsável pela confidencialidade de suas credenciais e pelas atividades realizadas por meio de sua conta. Qualquer suspeita de acesso não autorizado deverá ser comunicada à equipe responsável.',
      '2.7. As empresas são responsáveis por garantir que possuem autorização para representar a organização cadastrada e publicar desafios ou oportunidades em seu nome.',
      '2.8. A DampCode poderá solicitar informações adicionais para verificar a legitimidade de contas empresariais ou prevenir fraudes.',
      '2.9. A criação de uma conta não garante aprovação automática em processos seletivos, contratação profissional ou participação em todos os eventos disponíveis.',
    ],
  },
  {
    id: 'hackathons',
    title: 'Hackathons e inscrições',
    summary: [
      'A plataforma permite a criação, divulgação e participação em hackathons, conforme as condições definidas pelos respectivos organizadores.',
      'Cada evento poderá estabelecer seus próprios requisitos de participação, prazos, critérios de avaliação, regras de equipe e restrições de idade. A inscrição representa a concordância com as regras específicas daquele evento.',
    ],
    blocks: [
      '3.1. A DampCode permite que participantes encontrem, consultem e se inscrevam em hackathons, bem como que empresas ou organizadores criem e gerenciem seus próprios eventos.',
      '3.2. Cada hackathon poderá apresentar condições específicas, incluindo:',
      {
        list: [
          'Descrição e objetivos do desafio.',
          'Requisitos técnicos e conhecimentos necessários.',
          'Período de inscrição e realização.',
          'Limite de participantes ou equipes.',
          'Regras para formação de equipes.',
          'Formato e prazo para entrega dos projetos.',
          'Critérios de avaliação e seleção.',
          'Premiações e eventuais oportunidades profissionais.',
          'Restrições de idade e demais requisitos de elegibilidade.',
        ],
      },
      '3.3. É responsabilidade do participante ler e compreender as condições de cada evento antes de efetuar sua inscrição.',
      '3.4. As regras particulares de uma hackathon poderão complementar estes termos, desde que sejam disponibilizadas de maneira clara e previamente à participação.',
      '3.5. A inscrição poderá ser recusada ou cancelada quando o participante não atender aos requisitos estabelecidos pelo organizador ou violar as regras do evento.',
      '3.6. Os organizadores são responsáveis por fornecer informações corretas sobre seus desafios, prazos, critérios de participação e condições de premiação.',
      '3.7. A participação em processos seletivos associados a uma hackathon não representa promessa ou garantia de contratação.',
      '3.8. As condições de idade serão definidas individualmente por evento. Quando houver participação de crianças ou adolescentes, deverão ser observadas as exigências legais aplicáveis, incluindo as medidas necessárias à proteção de seus dados e interesses.',
    ],
  },
  {
    id: 'entregas',
    title: 'Entregas e propriedade do código',
    summary: [
      'Os projetos, códigos e demais materiais desenvolvidos pelos participantes permanecem sob a titularidade de seus respectivos criadores, salvo acordo específico previamente apresentado e aceito.',
      'A DampCode poderá utilizar as entregas exclusivamente para viabilizar a participação, avaliação e divulgação dos resultados, respeitando os direitos de seus autores.',
    ],
    blocks: [
      '4.1. Os participantes mantêm os direitos de propriedade intelectual sobre os códigos, projetos, documentos, soluções e demais materiais que desenvolverem, respeitados os direitos de terceiros e os acordos específicos aplicáveis.',
      '4.2. A inscrição em uma hackathon ou o envio de uma entrega não representa, por si só, transferência de propriedade intelectual para a DampCode, para a empresa organizadora ou para qualquer patrocinador.',
      '4.3. Ao enviar um projeto, o participante concede à DampCode uma autorização limitada, não exclusiva e gratuita para armazenar, processar e disponibilizar o material na medida necessária à administração da hackathon, sua avaliação e apresentação de resultados dentro da plataforma.',
      '4.4. A divulgação pública de projetos, códigos ou outros materiais deverá respeitar as configurações de visibilidade e as regras informadas para cada evento.',
      '4.5. Caso uma hackathon preveja cessão, licenciamento ou utilização comercial das soluções desenvolvidas, essas condições deverão ser apresentadas de maneira específica, clara e destacada antes da inscrição, exigindo a concordância aplicável dos participantes.',
      '4.6. Os participantes são responsáveis por garantir que suas entregas não violem direitos autorais, marcas, patentes, licenças de software, segredos comerciais ou outros direitos de terceiros.',
      '4.7. A DampCode não reivindica automaticamente a propriedade dos projetos enviados e não deverá utilizar entregas para finalidades comerciais não autorizadas por seus titulares.',
    ],
  },
  {
    id: 'avaliacao',
    title: 'Avaliação, resultado e prêmios',
    summary: [
      'As avaliações e classificações seguirão os critérios definidos para cada hackathon. Os resultados poderão considerar aspectos técnicos, criatividade, funcionalidade e outros requisitos estabelecidos pelos organizadores.',
      'A concessão de prêmios depende das condições divulgadas para cada evento. A DampCode não garante premiações que não tenham sido formalmente anunciadas.',
    ],
    blocks: [
      '5.1. Cada hackathon deverá apresentar seus critérios de avaliação, que poderão considerar qualidade técnica, criatividade, originalidade, aplicabilidade, documentação, apresentação e cumprimento dos requisitos do desafio.',
      '5.2. A avaliação poderá ser realizada por representantes das empresas organizadoras, avaliadores convidados ou outros responsáveis definidos para o evento.',
      '5.3. Os resultados e classificações serão divulgados conforme o cronograma e as condições estabelecidas para cada hackathon.',
      '5.4. A DampCode poderá disponibilizar rankings, pontuações, níveis, experiência e outras funcionalidades de gamificação, com o objetivo de incentivar o aprendizado e o desenvolvimento dos participantes.',
      '5.5. A pontuação e os resultados de gamificação não representam, necessariamente, certificação profissional, garantia de competência ou promessa de oportunidade de emprego.',
      '5.6. As premiações deverão seguir as condições anunciadas pelo respectivo organizador, incluindo natureza, quantidade, requisitos e prazo de entrega.',
      '5.7. A responsabilidade pelo fornecimento de prêmios anunciados será do organizador ou patrocinador responsável, conforme as condições divulgadas.',
      '5.8. Eventuais divergências sobre avaliações ou resultados deverão ser encaminhadas pelos canais indicados na descrição do evento.',
    ],
  },
  {
    id: 'conduta',
    title: 'Conduta na plataforma',
    summary: [
      'É proibido utilizar a DampCode para atividades ilegais, fraudes, plágio, assédio, discriminação, violação de direitos autorais ou qualquer comportamento que prejudique outros usuários ou o funcionamento da plataforma.',
      'O descumprimento dessas regras poderá resultar em advertências, suspensão ou encerramento da conta.',
    ],
    blocks: [
      '6.1. Todos os usuários devem utilizar a DampCode de maneira ética, respeitosa e em conformidade com a legislação brasileira.',
      '6.2. São consideradas condutas proibidas:',
      {
        list: [
          'Praticar fraudes, falsificar informações ou manipular resultados.',
          'Plagiar projetos ou apresentar trabalhos de terceiros como próprios.',
          'Violar direitos autorais ou de propriedade intelectual.',
          'Realizar ataques, tentativas de invasão ou acessos não autorizados.',
          'Distribuir códigos maliciosos ou comprometer a segurança da plataforma.',
          'Praticar assédio, discriminação, ameaças ou outras formas de abuso.',
          'Utilizar a plataforma para atividades ilegais.',
          'Publicar conteúdo enganoso, ofensivo ou prejudicial a outros usuários.',
          'Utilizar contas falsas para manipular inscrições, avaliações ou rankings.',
        ],
      },
      '6.3. As empresas também deverão respeitar os participantes, apresentar desafios legítimos e não utilizar a plataforma para divulgar oportunidades fraudulentas ou enganosas.',
      '6.4. A equipe responsável pela DampCode poderá analisar denúncias e violações, adotando medidas proporcionais à gravidade da situação.',
      '6.5. As medidas poderão incluir advertências, remoção de conteúdo, desclassificação de eventos, suspensão temporária ou encerramento definitivo da conta, respeitados os direitos dos envolvidos e as obrigações legais.',
    ],
  },
  {
    id: 'responsabilidade',
    title: 'Limitação de responsabilidade',
    summary: [
      'A DampCode busca oferecer um ambiente seguro e funcional, mas não garante disponibilidade ininterrupta ou ausência de falhas técnicas.',
      'A plataforma não se responsabiliza por informações falsas fornecidas por usuários, condutas de terceiros ou acordos realizados diretamente entre participantes e empresas, sem prejuízo das responsabilidades previstas em lei.',
    ],
    blocks: [
      '7.1. A DampCode é uma plataforma de conexão e organização de atividades relacionadas à tecnologia e ao desenvolvimento profissional.',
      '7.2. Embora sejam adotadas medidas para manter a segurança e a disponibilidade dos serviços, não é possível garantir funcionamento ininterrupto, ausência absoluta de falhas ou disponibilidade permanente de todos os recursos.',
      '7.3. A DampCode não se responsabiliza por:',
      {
        list: [
          'Informações incorretas ou fraudulentas fornecidas por usuários ou empresas.',
          'Condutas de participantes, organizadores, patrocinadores ou terceiros.',
          'Problemas decorrentes de serviços externos utilizados para hospedagem, comunicação ou armazenamento.',
          'Perdas decorrentes do descumprimento das regras de uma hackathon por seus participantes ou organizadores.',
          'Acordos profissionais ou comerciais estabelecidos diretamente entre usuários e empresas.',
        ],
      },
      '7.4. A plataforma não garante contratação, estágio, premiação, reconhecimento profissional ou resultado específico decorrente da participação em hackathons.',
      '7.5. As disposições desta seção não afastam responsabilidades que não possam ser excluídas ou limitadas pela legislação aplicável, incluindo os direitos dos consumidores, quando incidentes.',
    ],
  },
  {
    id: 'alteracoes',
    title: 'Alterações nestes termos',
    summary: [
      'Estes termos poderão ser atualizados para acompanhar mudanças nas funcionalidades, regras e obrigações legais. As alterações serão disponibilizadas na própria plataforma, com indicação da data de atualização.',
    ],
    blocks: [
      '8.1. Estes termos poderão ser modificados para acompanhar a evolução da plataforma, a inclusão de novas funcionalidades, mudanças operacionais ou alterações na legislação.',
      '8.2. A versão atualizada será disponibilizada nesta página, acompanhada da respectiva data de revisão.',
      '8.3. Quando as alterações forem relevantes, a DampCode buscará informar os usuários por meios adequados, podendo solicitar nova manifestação de concordância quando necessário.',
      '8.4. A continuidade da utilização da plataforma após a entrada em vigor das alterações estará sujeita aos termos atualizados, respeitadas as exigências legais aplicáveis.',
    ],
  },
  {
    id: 'contato',
    title: 'Contato',
    summary: [
      `Para dúvidas, solicitações ou esclarecimentos relacionados a estes termos, entre em contato pelo canal oficial de atendimento da DampCode: **${emailOficial}**.`,
    ],
    blocks: [
      '9.1. Dúvidas, solicitações, reclamações ou comunicações relacionadas a estes Termos de Serviço poderão ser encaminhadas ao canal oficial da DampCode:',
      {
        list: [
          `**E-mail:** ${emailOficial}`,
          '**Responsáveis pelo projeto:** Equipe responsável pelo desenvolvimento e administração da DampCode.',
        ],
      },
      '9.2. As solicitações serão analisadas e respondidas pelos responsáveis, observados os prazos e as obrigações legais aplicáveis.',
    ],
  },
]

const Terms = () => (
  <LegalPage
    title='Termos de Serviço'
    intro={[
      'Bem-vindo à DampCode! Estes Termos de Serviço estabelecem as condições para acesso e utilização da nossa plataforma, desenvolvida para conectar programadores, estudantes, empresas e profissionais da tecnologia por meio de hackathons, desafios práticos e oportunidades de desenvolvimento profissional.',
      'Ao criar uma conta, acessar ou utilizar qualquer funcionalidade da plataforma, você declara que leu e compreendeu estes termos e concorda com as condições aqui estabelecidas.',
    ]}
    updatedAt='novembro de 2026'
    sections={sections}
    closing='Ao utilizar a DampCode, você reconhece que teve acesso a estes Termos de Serviço e às condições que regulamentam a utilização da plataforma.'
    other={{ to: '/privacidade', label: 'Ler a Política de Privacidade' }}
  />
)

export default Terms
