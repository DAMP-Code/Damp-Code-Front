import {createContext, useState} from 'react'

//cria canal de dados goblal
export const RegistrationContext = createContext();

//componente que envolve as rotas
export const RegistrationProvider = ({children}) => {
    //dados é onde eles ficam, set pra atualizar
    const [registrationData, setRegistrationData] = useState({});
    return (
    // Todos os componentes dentro disso podem acessar dados e setDados
      <RegistrationContext.Provider value={{ registrationData, setRegistrationData}}> 
        {children}
      </RegistrationContext.Provider>
    )
}
