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
import SubmissionsReview from "./Pages/company/SubmissionsReview";
import EvaluationRanking from "./Pages/company/EvaluationRanking";
import CreateHackathon from "./Pages/company/CreateHackathon";
import ParticipantDashboard from "./Pages/participant/ParticipantDashboard";
import HackathonPage from "./Pages/HackathonPage";
import SubmissionPage from "./Pages/SubmissionPage";
import Ranking from "./Pages/company/Ranking";
import Profile from "./Pages/participant/Profile";
import AdminVerification from "./Pages/admin/AdminVerification";
import ManageModules from "./Pages/company/ManageModules";
import About from "./Pages/About";
import AccountSettings from "./Pages/AccountSettings";
import ResultsRanking from "./Pages/ResultsRanking";
import RequireRole from "./app-components/utilities/RequireRole";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/explore" element={<Explore />}></Route>
      <Route path="/sobre" element={<About />} />
      <Route path="/ranking" element={<ResultsRanking />} />
      <Route path="/conta" element={<RequireRole role={["participante", "empresa", "admin"]}><AccountSettings /></RequireRole>} />
      <Route path="/" element={<h1>Rota Não Encontrada!</h1>}></Route>
      <Route path="/cadastroUser" element={<CreateUser />}></Route>
      <Route path="/cadastroEmpresa" element={<CreateCompany />}></Route>
      <Route path="/loginUser" element={<UserLogin />}></Route>
      <Route path="/escolha" element={<AccountTypeSelection />}></Route>
      <Route path="/cadastroEmpresa/detalhes" element={<CompanyDetails />} />
      <Route path="/dashboard/Empresa" element={<RequireRole role="empresa"><CompanyDashboard /></RequireRole>}></Route>
      <Route path="/dashboard/Empresa/entregas/:id" element={<RequireRole role="empresa"><SubmissionsReview /></RequireRole>}></Route>
      <Route path="/dashboard/Empresa/avaliacao/:id" element={<RequireRole role="empresa"><EvaluationRanking /></RequireRole>}></Route>
      <Route
        path="/dashboard/participante"
        element={<RequireRole role="participante"><ParticipantDashboard /></RequireRole>}
      ></Route>
      <Route path="/cadastroHackaton" element={<RequireRole role="empresa"><CreateHackathon key="novo" /></RequireRole>}></Route>
      <Route path="/cadastroHackaton/:id" element={<RequireRole role="empresa"><CreateHackathon key="editar" /></RequireRole>}></Route>
      <Route path="/cadastroHackaton/:id/modulos" element={<RequireRole role="empresa"><ManageModules /></RequireRole>} />
      <Route path="/hackathon/:id" element={<HackathonPage />} />
      <Route path="/hackathon/:id/entrega" element={<RequireRole role="participante"><SubmissionPage /></RequireRole>} />
      <Route path="/dashboard/ranking" element={<RequireRole role="empresa"><Ranking /></RequireRole>} />
      <Route path="/perfil" element={<RequireRole role="participante"><Profile /></RequireRole>} />
      <Route path="/admin" element={<RequireRole role="admin"><AdminVerification /></RequireRole>} />
    </Routes>
  );
};

export default App;
