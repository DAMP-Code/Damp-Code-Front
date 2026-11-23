import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { homeByRole } from "./roles";
import { API_URL } from "@/app-components/utilities/apiUrl";

// Protege uma rota pelo tipo de conta. Sem login vai para o login; com a conta errada volta para o próprio painel.
// Funcionário de empresa entra com conta de participante, então nas rotas da empresa ele passa se /Companies/me responder.
const RequireRole = ({ role, children }) => {
  const { user } = useContext(AuthContext);
  const [isEmployee, setIsEmployee] = useState(null);
  const needsCompanyCheck = role === "empresa" && user?.role === "participante";

  useEffect(() => {
    if (!needsCompanyCheck) return;
    let active = true;

    async function checkCompany() {
      try {
        const response = await fetch(`${API_URL}/api/Companies/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (active) setIsEmployee(response.ok);
      } catch (error) {
        console.error(error);
        if (active) setIsEmployee(false);
      }
    }

    checkCompany();
    return () => {
      active = false;
    };
  }, [needsCompanyCheck, user?.token]);

  if (!user) return <Navigate to="/loginUser" replace />;
  // role pode ser um tipo ("empresa") ou uma lista (["participante", "empresa", "admin"])
  if ([].concat(role).includes(user.role)) return children;

  if (needsCompanyCheck) {
    // ainda conferindo se é funcionário
    if (isEmployee === null) return null;
    if (isEmployee) return children;
  }

  return <Navigate to={homeByRole[user.role] || "/"} replace />;
};

export default RequireRole;
