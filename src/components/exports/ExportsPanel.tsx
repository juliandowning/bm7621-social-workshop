import { useWorkspaceStore } from '../../store/workspace'
import { selectTotalScore, selectCompletedCount } from '../../store/workspace'

export function ExportsPanel() {
  const { team, scores } = useWorkspaceStore()
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)

  const exportWorkbook = () => {
    const lines = [
      `BM7621 SOCIAL MEDIA WORKSHOP — TEAM WORKBOOK`,
      `Team: ${team?.name} · Brand: ${team?.brand}`,
      `Exported: ${new Date().toLocaleString()}`,
      '',
      `TOTAL SCORE: ${total}`,
      `ACTIVITIES COMPLETED: ${completed}/22`,
      '',
      '─── SCORES ───────────────────────────────────',
      ...Object.entries(scores).map(([key, val]) =>
        `${key}: ${val?.points || 0}/${val?.max || 5} pts ${val?.locked ? '(submitted)' : ''}`
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `BM7621-Social-${team?.name}-${new Date().toISOString().slice(0,10)}.txt`
    a.click()
  }

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl">📄</div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Team Workbook</div>
            <div className="text-xs text-slate-500">Complete record of all activity scores</div>
          </div>
        </div>
        <button onClick={exportWorkbook} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">Download</button>
      </div>

      <details className="mt-6">
        <summary className="text-xs text-slate-400 cursor-pointer select-none hover:text-slate-500">Advanced options</summary>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-3 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Restore from Backup</div>
          <p className="text-sm text-slate-500 mb-3">Import a JSON backup file from your facilitator.</p>
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">📂 Import Backup</button>
        </div>
      </details>
    </div>
  )
}
