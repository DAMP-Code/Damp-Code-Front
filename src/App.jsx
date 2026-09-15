import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateUser from "./pages/CreateUser";
import UserLogin from "./pages/UserLogin";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import CreateCompany from "./pages/CreateCompany";
import CompanyDetails from "./pages/CompanyDetails";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CreateHackathon from "./pages/company/CreateHackathon";
import ParticipantDashboard from "./pages/participant/ParticipantDashboard";
import HackathonPage from "./pages/HackathonPage";
import Ranking from "./pages/company/Ranking";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/explore" element={<Explore />}></Route>
      <Route path="/" element={<h1>Rota Não Encontrada!</h1>}></Route>
      <Route path="/cadastroUser" element={<CreateUser />}></Route>
      <Route path="/cadastroEmpresa" element={<CreateCompany />}></Route>
      <Route path="/loginUser" element={<UserLogin />}></Route>
      <Route path="/escolha" element={<AccountTypeSelection />}></Route>
      <Route path="/cadastroEmpresa/detalhes" element={<CompanyDetails />} />
      <Route path="/dashboard/Empresa" element={<CompanyDashboard />}></Route>
      <Route
        path="/dashboard/participante"
        element={<ParticipantDashboard />}
      ></Route>
      <Route path="/cadastroHackaton" element={<CreateHackathon />}></Route>
      <Route path="/hackathon/:id" element={<HackathonPage />} />
      <Route path="/dashboard/ranking" element={<Ranking />} />
    </Routes>
  );
};

export default App;
