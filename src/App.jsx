import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import CreateUser from "./Pages/CreateUser";
import UserLogin from "./Pages/UserLogin";
import AccountTypeSelection from "./Pages/AccountTypeSelection";
import CreateCompany from "./Pages/CreateCompany";
import CompanyDetails from "./Pages/CompanyDetails";
import CompanyDashboard from "./Pages/company/CompanyDashboard";
import CreateHackathon from "./Pages/company/CreateHackathon";
import ParticipantDashboard from "./Pages/participant/ParticipantDashboard";
import HackathonPage from "./Pages/HackathonPage";
import Ranking from "./Pages/company/Ranking";

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
