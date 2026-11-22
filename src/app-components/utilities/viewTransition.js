// Troca de tela com View Transition. O BrowserRouter não faz isso sozinho (o viewTransition do
// React Router só funciona com roteador de dados), então a transição começa aqui e termina quando
// a tela nova avisa que já está montada (markTransitionReady). Sem suporte no navegador, só navega.
let finishTransition = null;

export function navigateWithTransition(navigate, to, options) {
  if (!document.startViewTransition) {
    navigate(to, options);
    return;
  }
  document.startViewTransition(
    () =>
      new Promise((resolve) => {
        finishTransition = resolve;
        // se a tela nova não avisar, a transição não pode travar a página
        setTimeout(resolve, 800);
        navigate(to, options);
      }),
  );
}

export function markTransitionReady() {
  finishTransition?.();
  finishTransition = null;
}
