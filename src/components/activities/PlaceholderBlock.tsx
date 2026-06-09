import { useWorkspaceStore } from '../../store/workspace'
import { BLOCK_STRUCTURE, ACTIVITY_LABELS } from '../../data/workshop'
import { ActivityCard, Alert, ViewerBadge } from '../ui/shared'
import type { ActivityKey } from '../../types'

interface PlaceholderBlockProps { blockId: number }

export function PlaceholderBlock({ blockId }: PlaceholderBlockProps) {
  const { scores, isViewer } = useWorkspaceStore()
  const block = BLOCK_STRUCTURE.find(b => b.id === blockId)
  if (!block) return null

  return (
    <div>
      {isViewer && (
        <div className="mb-4 flex items-center gap-2">
          <ViewerBadge />
          <span className="text-xs text-slate-500">You are in viewer mode — activities are read-only</span>
        </div>
      )}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 mb-6 text-white">
        <div className="text-[10px] font-bold tracking-widest uppercase text-brand-200 mb-1">Block {block.id} of 7</div>
        <h2 className="text-xl font-bold mb-1">{block.label}</h2>
        <p className="text-brand-100 text-sm">{block.deliverable}</p>
      </div>
      {block.activities.map((actKey, i) => (
        <ActivityCard key={actKey} number={i + 1} title={ACTIVITY_LABELS[actKey as ActivityKey]}
          subtitle={`Block ${blockId} · Activity ${i + 1}`}
          points={scores[actKey as ActivityKey]?.points || 0}
          locked={scores[actKey as ActivityKey]?.locked}>
          <Alert type="info">🚧 <strong>Activity content coming soon.</strong></Alert>
        </ActivityCard>
      ))}
    </div>
  )
}
