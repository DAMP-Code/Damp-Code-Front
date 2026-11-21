import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders, faXmark } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '@/app-components/utilities/AuthContext'
import {
  createChallengeAction,
  emptyFilters,
  hasActiveFilters,
  optionCounts,
  situacoes,
} from '@/app-components/utilities/hackathonFilters'

// grupo de caixas de marcar com a contagem de Hackathons de cada opção
const CheckGroup = ({ title, options, selected, onToggle }) => {
  if (options.length === 0) return null
  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='mb-2 text-sm font-semibold text-content'>{title}</legend>
      {options.map(([value, count]) => (
        <label key={value} className='flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-content-secondary hover:bg-white/5 hover:text-content'>
          <input
            type='checkbox'
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
            className='size-4 accent-[#FFEA00]'
          />
          <span className='flex-1 truncate'>{value}</span>
          <span className='text-xs text-content-secondary/70'>{count}</span>
        </label>
      ))}
    </fieldset>
  )
}

// Barra de filtros do Explorar e do painel do participante. A página guarda os filtros e passa a lista de Hackathons.
const Sidebar = ({ hackathons = [], filters = emptyFilters, onChange = () => {} }) => {
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const active = hasActiveFilters(filters)
  const action = createChallengeAction(user)

  function toggle(field, value) {
    const list = filters[field]
    onChange({ ...filters, [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] })
  }

  const counts = {
    todos: hackathons.length,
    ...Object.fromEntries(situacoes.filter((item) => item.fases).map((item) => [item.value, hackathons.filter((h) => item.fases.includes(h.fase)).length])),
  }

  // o painel aparece duas vezes (celular e desktop); cada um com nome próprio no grupo de rádio
  const renderPanel = (prefix) => (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold text-content'>Filtros</h2>
        {active && (
          <button type='button' onClick={() => onChange(emptyFilters)} className='text-sm font-semibold text-highlight hover:underline'>
            Limpar
          </button>
        )}
      </div>

      <fieldset className='flex flex-col gap-2'>
        <legend className='mb-2 text-sm font-semibold text-content'>Situação</legend>
        <div className='flex flex-wrap gap-2'>
          {situacoes.map((item) => {
            const selected = filters.situacao === item.value
            return (
              <label
                key={item.value}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-highlight ${
                  selected ? 'border-highlight bg-highlight text-surface' : 'border-white/15 text-content-secondary hover:border-white/30 hover:text-content'
                }`}
              >
                <input
                  type='radio'
                  name={`situacao-${prefix}`}
                  value={item.value}
                  checked={selected}
                  onChange={() => onChange({ ...filters, situacao: item.value })}
                  className='sr-only'
                />
                {item.label} <span className={selected ? 'text-surface/70' : 'text-content-secondary/70'}>{counts[item.value]}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <CheckGroup title='Área' options={optionCounts(hackathons, (h) => h.area)} selected={filters.areas} onToggle={(value) => toggle('areas', value)} />
      <CheckGroup title='Tecnologias' options={optionCounts(hackathons, (h) => h.tecnologias)} selected={filters.tecnologias} onToggle={(value) => toggle('tecnologias', value)} />
      <CheckGroup title='Empresa' options={optionCounts(hackathons, (h) => h.empresa)} selected={filters.empresas} onToggle={(value) => toggle('empresas', value)} />

      {/* criar desafio: só empresa cria; participante vê como publicar pela empresa */}
      {action ? (
        <Link
          to={action.to}
          className='mt-2 w-full rounded-xl bg-highlight px-4 py-3 text-center text-sm font-bold text-surface shadow-[0_10px_25px_rgba(255,234,0,0.12)] transition hover:-translate-y-0.5 hover:brightness-110'
        >
          {action.label}
        </Link>
      ) : (
        <div className='mt-2 rounded-xl border border-white/10 bg-surface/50 p-4 text-sm text-content-secondary'>
          Desafios são publicados por empresas.{' '}
          <Link to='/cadastroEmpresa' className='font-semibold text-highlight hover:underline'>
            Cadastrar minha empresa
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* celular e tablet: botão que abre os filtros por cima da página */}
      <div className='fixed bottom-5 right-5 z-40 md:hidden'>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='flex items-center gap-2 rounded-full bg-highlight px-5 py-3 font-bold text-surface shadow-[0_12px_30px_rgba(0,0,0,0.45)]'
        >
          <FontAwesomeIcon icon={faSliders} /> Filtros
          {active && <span className='size-2 rounded-full bg-surface' aria-label='filtros ativos' />}
        </button>
      </div>
      {open && (
        <div className='fixed inset-0 z-50 flex md:hidden' role='dialog' aria-modal='true' aria-label='Filtros'>
          <button type='button' aria-label='Fechar filtros' onClick={() => setOpen(false)} className='flex-1 bg-black/60' />
          <div className='flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-surface-light p-6'>
            <button
              type='button'
              onClick={() => setOpen(false)}
              aria-label='Fechar filtros'
              className='mb-4 self-end text-xl text-content-secondary hover:text-content'
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            {renderPanel('celular')}
            <button type='button' onClick={() => setOpen(false)} className='mt-6 rounded-xl border border-white/15 py-3 font-semibold text-content'>
              Ver resultados
            </button>
          </div>
        </div>
      )}

      {/* desktop: barra fixa ao lado da lista */}
      <aside className='sticky top-24 m-5 hidden h-fit max-h-[calc(100vh-7rem)] w-3/12 min-w-56 max-w-72 flex-col overflow-y-auto rounded-2xl border border-white/10 bg-surface-light/90 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:flex'>
        {renderPanel('desktop')}
      </aside>
    </>
  )
}

export default Sidebar
