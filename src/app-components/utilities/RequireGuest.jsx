import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { homeByRole } from "./roles";

// Telas só para quem não entrou (login, escolher conta, cadastros): quem já está logado vai para o próprio painel.
const RequireGuest = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to={homeByRole[user.role] || "/"} replace />;
  return children;
};

export default RequireGuest;
