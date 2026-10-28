import ManageChallenges from '@/app-components/company-dashboard/ManageChallenges'
import ManageEmployees from '@/app-components/company-dashboard/ManageEmployees'
import CreateChallenge from '@/app-components/explore/CreateChallenge'
import Sidebar from '@/app-components/explore/Sidebar'
import Footer from '@/app-components/Footer'
import Header from '@/app-components/Header'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

const CompanyDashboard = () => {
  const { user } = useContext(AuthContext)
  const [companyAccess, setCompanyAccess] = useState(null)

  useEffect(() => {
    async function loadCompany() {
      try {
        const response = await fetch("https://localhost:7092/api/Companies/me", {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        if (!response.ok) return
        setCompanyAccess(await response.json())
      } catch (error) {
        console.error(error)
      }
    }

    loadCompany()
  }, [user?.token])

  // funcionário ainda não gerencia Hackathons por aqui: as telas atuais identificam a empresa pelo user.name
  const isEmployee = companyAccess?.isPrimaryAccount === false

  return (
        <div className='bg-surface w-full min-h-screen'>
        <Header />
          <div className='flex flex-col w-full h-full items-center'>
            {companyAccess && companyAccess.verificationStatus !== "Verified" && (
              <div className='mt-8 w-9/10 max-w-6xl rounded-2xl border border-warning/40 bg-warning/10 px-6 py-4 text-warning'>
                Sua empresa ainda não foi verificada. Você pode criar rascunhos, mas só poderá publicar depois da verificação.
              </div>
            )}
            {!isEmployee && (
              <>
                {/* 🔥 Criar Hackathon */}
                <CreateChallenge />
                {/* 📂 Gerenciar Hackathons */}
                <ManageChallenges />
              </>
            )}
            {/* 👥 Funcionários */}
            <ManageEmployees companyAccess={companyAccess} />

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
