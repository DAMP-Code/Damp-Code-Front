import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // junta os campos novos (nome, cor, token...) no usuário salvo, para a navbar e as telas mudarem na hora
  function updateUser(changes) {
    setUser((current) => {
      const next = { ...current, ...changes };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};