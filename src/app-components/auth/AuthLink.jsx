import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/app-components/utilities/viewTransition";

// Link entre as telas de acesso que troca de tela com animação.
// Ctrl/Cmd + clique e botão do meio continuam abrindo em outra aba normalmente.
export default function AuthLink({ to, onClick, ...props }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleClick(e) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    // já está nesta tela: nada para trocar
    if (to === pathname) return;
    navigateWithTransition(navigate, to);
  }

  return <Link to={to} onClick={handleClick} {...props} />;
}
