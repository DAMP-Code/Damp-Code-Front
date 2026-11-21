import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/app-components/Header";
import Footer from "@/app-components/Footer";
import EditableAvatar from "@/app-components/account/EditableAvatar";
import AccountForms from "@/app-components/account/AccountForms";
import { AuthContext } from "@/app-components/utilities/AuthContext";

const roleLabel = { participante: "Participante", empresa: "Empresa", admin: "Admin" };

// Perfil de empresa e admin: só as configurações da conta. O participante tem tudo junto em /perfil.
const AccountSettings = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "participante") return <Navigate to="/perfil#configuracoes" replace />;

  return (
    <div className="min-h-screen bg-surface text-content">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
        <section className="flex items-start gap-5">
          <EditableAvatar size="lg" />
          <div className="min-w-0 pt-2">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{user?.name}</h1>
            <p className="truncate text-content-secondary">
              {user?.email} · {roleLabel[user?.role]}
            </p>
          </div>
        </section>
        <AccountForms />
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
