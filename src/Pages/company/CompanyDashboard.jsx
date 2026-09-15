import ManageChallenges from '@/app-components/company-dashboard/ManageChallenges'
import CreateChallenge from '@/app-components/explore/CreateChallenge'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import React from 'react'

const CompanyDashboard = () => {
  return (
        <div className='bg-surface w-full min-h-screen'>
        <Header />
          <div className='flex flex-col w-full h-full items-center'>
            {/* 🔥 Criar Hackathon */}
            <CreateChallenge />
            {/* 📂 Gerenciar Hackathons */}
            <ManageChallenges />

{/* Editar / Pausar / Encerrar
👥 Visualizar Participantes
Lista rápida dos inscritos
🏆 Ver Rankings & Dados
leva para DashboardEmpresa completa */}
        </div>
        <Footer />
    </div>
  )
}

export default CompanyDashboard