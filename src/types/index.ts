export type ParticipantRole = 'member' | 'viewer'

export interface TeamMember {
  name: string; order: number; role: ParticipantRole
}

export interface Team {
  id: string
  code: string
  name: string // Agency name chosen at login
  brand: 'Nike' // Always Nike
  members: TeamMember[]
  created_at: string
  updated_at: string
}

export type ActivityKey =
  | 'b1a1' | 'b1a2' | 'b1a3'
  | 'b2a1' | 'b2a2' | 'b2a3' | 'b2a4' | 'b2a5'
  | 'b3a1' | 'b3a2' | 'b3a3'
  | 'b4a1' | 'b4a2' | 'b4a3' | 'b4a4'
  | 'b5a1' | 'b5a2' | 'b5a3'
  | 'b6a1' | 'b6a2' | 'b6a3'
  | 'b7a1' | 'b7a2' | 'b7a3'
  | 'final'

export interface ActivityScore {
  key: ActivityKey
  points: number
  max: number
  completed: boolean
  locked: boolean
  timestamp?: string
}

export type ScoreMap = Partial<Record<ActivityKey, ActivityScore>>

export interface ResponseMap {
  [key: string]: unknown
  _members?: TeamMember[]
  // Objectives cascade
  b2a5_objectives?: string[]
}

export interface BroadcastMessage {
  id: string; text: string; type: 'info' | 'warning' | 'success'; created_at: string
}

export interface WorkspaceState {
  team: Team | null
  scores: ScoreMap
  responses: ResponseMap
  syncStatus: 'idle' | 'saving' | 'saved' | 'error' | 'offline'
  lastSaved: string | null
  isViewer: boolean
  broadcastMessage: BroadcastMessage | null
}
