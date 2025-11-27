export type ReportTargetType = 'user' | 'module' | 'lesson' | 'comment'

export interface ReportReason {
  code: string
  label: string
  description: string
}

export interface ReportTargetContext {
  targetType: ReportTargetType
  targetId: number
  targetLabel?: string
}

export interface CreateReportPayload {
  targetType: ReportTargetType
  targetId: number
  reason: string
  details?: string
}
