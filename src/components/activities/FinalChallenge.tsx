import { useWorkspaceStore } from '../../store/workspace'

export function FinalChallenge() {
  const { team } = useWorkspaceStore()

  return (
    <div className="bg-white border-2 border-violet-300 rounded-2xl p-6 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <div className="text-[10px] font-bold tracking-widest uppercase text-violet-600 mb-2">Final Activity</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Social Masters Challenge</h2>
      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
        A quiz-based championship covering everything from today's workshop.
        Questions across all 7 blocks. Answers lock on submission.
      </p>
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-700 mb-4">
        🚧 Quiz content coming soon — will be populated with {team?.brand}-relevant questions before the workshop.
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl font-bold text-violet-600">20</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Questions</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl font-bold text-brand-600">6</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Rounds</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl font-bold text-amber-600">30s</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Per Question</div>
        </div>
      </div>
    </div>
  )
}
