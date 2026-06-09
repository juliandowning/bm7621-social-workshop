import { createClient } from '@supabase/supabase-js'
import type { TeamMember } from '../types'

const supabaseUrl = 'https://abteskbtkgmplasgpekj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidGVza2J0a2dtcGxhc2dwZWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODY5MTcsImV4cCI6MjA5MTA2MjkxN30.YczwMyY4ElTJVlx4bPq01teH47HYcBZJPQAfREGPYvg'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { params: { eventsPerSecond: 2 } },
})

export async function getTeamByCode(code: string) {
  const { data, error } = await supabase
    .from('bm7621social_teams')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .maybeSingle()
  if (error) return null
  return data
}

export async function updateTeamMembers(teamId: string, members: TeamMember[], agencyName?: string) {
  const update: Record<string, unknown> = { members }
  if (agencyName) update['agency_name'] = agencyName
  const { error } = await supabase
    .from('bm7621social_teams')
    .update(update)
    .eq('id', teamId)
  return !error
}

export async function upsertWorkspaceData(teamId: string, payload: {
  scores?: Record<string, unknown>
  responses?: Record<string, unknown>
}) {
  const { error } = await supabase
    .from('bm7621social_workspace_data')
    .upsert({ team_id: teamId, ...payload, updated_at: new Date().toISOString() }, { onConflict: 'team_id' })
  return !error
}

export async function getWorkspaceData(teamId: string) {
  const { data, error } = await supabase
    .from('bm7621social_workspace_data')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle()
  if (error) return null
  return data
}

export async function getAllTeamsData() {
  const { data: teams, error } = await supabase.from('bm7621social_teams').select('*')
  if (error || !teams) return []
  const { data: workspaces } = await supabase.from('bm7621social_workspace_data').select('*')
  return teams.map((team: { id: string }) => ({
    ...team,
    workspace: workspaces?.find((ws: { team_id: string }) => ws.team_id === team.id) || null,
  }))
}

export async function sendBroadcast(message: string, type: 'info' | 'warning' | 'success' = 'info') {
  const { error } = await supabase.from('bm7621social_broadcast')
    .insert({ message, type, created_at: new Date().toISOString() })
  return !error
}

export function subscribeToBroadcast(callback: (payload: unknown) => void) {
  const channel = supabase.channel('social-broadcast')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bm7621social_broadcast' }, callback)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeToAllWorkspaces(callback: (payload: unknown) => void) {
  const channel = supabase.channel('social-workspace-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bm7621social_workspace_data' }, callback)
    .subscribe()
  return () => supabase.removeChannel(channel)
}
