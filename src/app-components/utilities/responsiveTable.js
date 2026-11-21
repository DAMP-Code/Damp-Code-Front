// Em telas menores que lg (celular e tablet) a tabela vira uma lista de cartões: o cabeçalho
// some, cada linha empilha as células e o nome da coluna (atributo data-label da célula)
// aparece antes do valor. A partir de lg volta a ser uma tabela comum.
export const theadClass = "hidden lg:table-header-group";
export const tbodyClass = "block lg:table-row-group";
export const rowClass = "block border-t border-border first:border-t-0 lg:table-row lg:first:border-t";

// célula com o nome da coluna à esquerda e o valor à direita
export const cellClass =
  "flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-right before:text-xs before:font-semibold before:uppercase before:tracking-wider before:text-content-secondary before:content-[attr(data-label)] lg:table-cell lg:text-left lg:before:content-none";

// célula sem rótulo (título da linha, ações, mensagem de lista vazia)
export const blockCellClass = "block py-1.5 lg:table-cell";
