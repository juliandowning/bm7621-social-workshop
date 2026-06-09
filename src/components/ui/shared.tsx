import React from 'react'

// ─── HELPERS ─────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ─── CONFIRM SUBMIT ──────────────────────────────────────────
export function confirmSubmit(onConfirm: () => void) {
  if (window.confirm('Submit your answers?\n\nOnce submitted your answers will lock and cannot be changed unless unlocked by the facilitator.')) {
    onConfirm()
  }
}

// ─── ACTIVITY CARD ───────────────────────────────────────────
interface ActivityCardProps {
  number: number | string
  title: string
  subtitle?: string
  points: number
  max?: number
  locked?: boolean
  isPitch?: boolean
  children: React.ReactNode
}
export function ActivityCard({ number, title, subtitle, points, max = 5, locked, isPitch, children }: ActivityCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
            A{number}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
            {isPitch && <div className="text-[10px] font-bold text-violet-600 mt-1">📊 Feeds Agency Pitch</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {locked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">🔒 Submitted</span>}
          <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', points > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
            {points}/{max} pts
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

// ─── FEEDBACK PANEL ──────────────────────────────────────────
interface FeedbackPanelProps {
  score: number
  max?: number
  why: string
  example?: string
  keyLearning?: string[]
  completionPts?: number
  qualityPts?: number
}
export function FeedbackPanel({ score, max = 5, why, example, keyLearning, completionPts, qualityPts }: FeedbackPanelProps) {
  return (
    <div className="mt-4 border border-brand-200 bg-brand-50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-brand-500 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Your Score: {score}/{max}</span>
        {(completionPts !== undefined && qualityPts !== undefined) && (
          <span className="text-brand-100 text-xs font-mono">Completion {completionPts}/2 · Quality {qualityPts}/3</span>
        )}
      </div>
      <div className="px-4 py-3 border-b border-brand-100">
        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-1">Why you scored this</div>
        <div className="text-sm text-slate-700 leading-relaxed">{why}</div>
      </div>
      {example && (
        <div className="px-4 py-3 border-b border-brand-100 bg-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">Example strong answer</div>
          <div className="text-sm text-slate-600 leading-relaxed italic">{example}</div>
        </div>
      )}
      {keyLearning && keyLearning.length > 0 && (
        <div className="px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Key learning points</div>
          <ul className="space-y-1">
            {keyLearning.map((pt, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2">
                <span className="text-brand-400 flex-shrink-0">→</span>{pt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── QUALITY FEEDBACK ────────────────────────────────────────
interface QualityFeedbackProps { completionPts: number; qualityPts: number; qualityReason: string }
export function QualityFeedback({ completionPts, qualityPts, qualityReason }: QualityFeedbackProps) {
  return (
    <div className="mt-3 space-y-1.5">
      <div className={cn('flex items-center gap-2 text-xs px-3 py-2 rounded-lg',
        completionPts >= 2 ? 'bg-emerald-50 text-emerald-700' : completionPts === 1 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600')}>
        <span className="font-bold w-20 flex-shrink-0">Completion: {completionPts}/2</span>
        <span>{completionPts >= 2 ? 'All required fields completed' : completionPts === 1 ? 'Some fields completed' : 'Required fields missing'}</span>
      </div>
      <div className={cn('flex items-center gap-2 text-xs px-3 py-2 rounded-lg',
        qualityPts >= 3 ? 'bg-emerald-50 text-emerald-700' : qualityPts >= 2 ? 'bg-brand-50 text-brand-700' : qualityPts === 1 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500')}>
        <span className="font-bold w-20 flex-shrink-0">Quality: {qualityPts}/3</span>
        <span>{qualityReason}</span>
      </div>
    </div>
  )
}

// ─── ALERT ───────────────────────────────────────────────────
interface AlertProps { type?: 'info' | 'success' | 'warning'; children: React.ReactNode }
export function Alert({ type = 'info', children }: AlertProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  }
  return (
    <div className={cn('border rounded-xl px-4 py-3 text-sm mb-4', styles[type])}>
      {children}
    </div>
  )
}

// ─── CHAR COUNT ───────────────────────────────────────────────
export function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length
  const ok = len >= min && len <= max
  const over = len > max
  return (
    <div className={cn('text-[10px] mt-1 font-mono', ok ? 'text-emerald-600' : over ? 'text-red-500' : 'text-slate-400')}>
      {len} / {max} · min {min}
    </div>
  )
}

// ─── CHOICE BUTTON ───────────────────────────────────────────
interface ChoiceButtonProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
  description?: string
}
export function ChoiceButton({ label, selected, onClick, disabled, description }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left p-3.5 border-2 rounded-xl transition-all',
        selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300',
        disabled && 'cursor-default'
      )}
    >
      <div className={cn('font-semibold text-sm', selected ? 'text-brand-700' : 'text-slate-800')}>{label}</div>
      {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
    </button>
  )
}

// ─── MULTI CHOICE ────────────────────────────────────────────
interface MultiChoiceProps {
  options: { id: string; label: string; description?: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
  max?: number
}
export function MultiChoice({ options, selected, onChange, disabled, max }: MultiChoiceProps) {
  const toggle = (id: string) => {
    if (disabled) return
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      if (max && selected.length >= max) return
      onChange([...selected, id])
    }
  }
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const sel = selected.includes(opt.id)
        const atMax = !!max && selected.length >= max && !sel
        return (
          <button key={opt.id} onClick={() => toggle(opt.id)} disabled={disabled || atMax}
            className={cn('w-full text-left p-3 border-2 rounded-xl transition-all flex items-center gap-3',
              sel ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300',
              (disabled || atMax) && 'cursor-default opacity-60')}>
            <div className={cn('w-4 h-4 border-2 rounded flex-shrink-0 flex items-center justify-center',
              sel ? 'border-brand-500 bg-brand-500' : 'border-slate-300')}>
              {sel && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
            </div>
            <div>
              <div className={cn('font-medium text-sm', sel ? 'text-brand-700' : 'text-slate-800')}>{opt.label}</div>
              {opt.description && <div className="text-xs text-slate-500">{opt.description}</div>}
            </div>
          </button>
        )
      })}
      {max && <div className="text-xs text-slate-400 mt-1">Select up to {max} options ({selected.length}/{max})</div>}
    </div>
  )
}

// ─── RANKING ─────────────────────────────────────────────────
interface RankingProps {
  items: { id: string; label: string }[]
  ranked: string[]
  onChange: (ranked: string[]) => void
  disabled?: boolean
}
export function Ranking({ items, ranked, onChange, disabled }: RankingProps) {
  const unranked = items.filter(i => !ranked.includes(i.id))
  const rankedItems = ranked.map(id => items.find(i => i.id === id)!).filter(Boolean)

  const addToRank = (id: string) => { if (!disabled) onChange([...ranked, id]) }
  const removeFromRank = (id: string) => { if (!disabled) onChange(ranked.filter(r => r !== id)) }
  const moveUp = (idx: number) => {
    if (disabled || idx === 0) return
    const next = [...ranked]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }
  const moveDown = (idx: number) => {
    if (disabled || idx === ranked.length - 1) return
    const next = [...ranked]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Available — tap to rank</div>
        <div className="space-y-1.5">
          {unranked.map(item => (
            <button key={item.id} onClick={() => addToRank(item.id)} disabled={disabled}
              className="w-full text-left px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-brand-300 hover:bg-brand-50 transition-all">
              {item.label}
            </button>
          ))}
          {unranked.length === 0 && <div className="text-xs text-slate-400 italic py-2">All items ranked</div>}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Your Ranking</div>
        <div className="space-y-1.5">
          {rankedItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 px-3 py-2.5 border-2 border-brand-200 bg-brand-50 rounded-lg">
              <span className="text-xs font-bold text-brand-600 w-5">#{idx + 1}</span>
              <span className="flex-1 text-sm text-brand-800">{item.label}</span>
              {!disabled && (
                <div className="flex gap-1">
                  <button onClick={() => moveUp(idx)} className="text-slate-400 hover:text-slate-600 text-xs px-1">▲</button>
                  <button onClick={() => moveDown(idx)} className="text-slate-400 hover:text-slate-600 text-xs px-1">▼</button>
                  <button onClick={() => removeFromRank(item.id)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
                </div>
              )}
            </div>
          ))}
          {rankedItems.length === 0 && <div className="text-xs text-slate-400 italic py-2">Tap items to add to your ranking</div>}
        </div>
      </div>
    </div>
  )
}

// ─── VIEWER BADGE ────────────────────────────────────────────
export function ViewerBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
      👁 Viewing only
    </span>
  )
}

// ─── BROADCAST TOAST ─────────────────────────────────────────
interface BroadcastToastProps { message: string; type: 'info' | 'warning' | 'success'; onDismiss: () => void }
export function BroadcastToast({ message, type, onDismiss }: BroadcastToastProps) {
  const styles = {
    info: 'bg-blue-600 text-white',
    warning: 'bg-amber-500 text-white',
    success: 'bg-emerald-600 text-white',
  }
  return (
    <div className={cn('fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-sm w-full mx-4', styles[type])}>
      <div className="text-lg">📢</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onDismiss} className="text-white/70 hover:text-white text-lg">✕</button>
    </div>
  )
}

// ─── PROGRESS BAR ────────────────────────────────────────────
export function ProgressBar({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('h-1.5 bg-slate-100 rounded-full overflow-hidden', className)}>
      <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}
