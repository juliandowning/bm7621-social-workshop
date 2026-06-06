import { useWorkspaceStore } from '../../store/workspace'
import { BLOCK_STRUCTURE, ACTIVITY_LABELS, ACTIVITY_DISPLAY_NUM, BRAND_CONTEXT } from '../../data/workshop'
import { ActivityCard, Alert, ViewerBadge } from '../ui/shared'
import type { ActivityKey } from '../../types'

interface PlaceholderBlockProps {
  blockId: number
}

export function PlaceholderBlock({ blockId }: PlaceholderBlockProps) {
  const { team, scores, isViewer } = useWorkspaceStore()
  const block = BLOCK_STRUCTURE.find(b => b.id === blockId)
  const brand = team?.brand || 'Nike'
  const context = BRAND_CONTEXT[brand]

  if (!block) return null

  return (
    <div>
      {isViewer && (
        <div className="mb-4 flex items-center gap-2">
          <ViewerBadge />
          <span className="text-xs text-slate-500">You are in viewer mode — activities are read-only</span>
        </div>
      )}

      {/* Block intro */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 mb-6 text-white">
        <div className="text-[10px] font-bold tracking-widest uppercase text-brand-200 mb-1">Block {block.id} of 7</div>
        <h2 className="text-xl font-bold mb-1">{block.label}</h2>
        <p className="text-brand-100 text-sm">{block.description}</p>
        <div className="mt-3 text-xs text-brand-200">
          Your brand: <strong className="text-white">{brand}</strong> · {context.industry}
        </div>
      </div>

      {/* Placeholder activities */}
      {block.activities.map((actKey) => (
        <ActivityCard
          key={actKey}
          number={ACTIVITY_DISPLAY_NUM[actKey as ActivityKey]}
          title={ACTIVITY_LABELS[actKey as ActivityKey]}
          subtitle={`Block ${blockId} · Activity ${ACTIVITY_DISPLAY_NUM[actKey as ActivityKey]}`}
          points={scores[actKey as ActivityKey]?.points || 0}
          locked={scores[actKey as ActivityKey]?.locked}
        >
          <Alert type="info">
            🚧 <strong>Activity content coming soon</strong> — this placeholder will be replaced with the full activity before the workshop.
          </Alert>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-400 text-sm py-8">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold text-slate-600 mb-1">{ACTIVITY_LABELS[actKey as ActivityKey]}</div>
            <div className="text-xs">Activity for <strong>{brand}</strong> · {context.industry}</div>
          </div>
        </ActivityCard>
      ))}
    </div>
  )
}
