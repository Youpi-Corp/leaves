import { API_CONFIG, getApiUrl } from '../config/api.config'
import {
  CreateReportPayload,
  ReportReason,
  ReportTargetType,
} from '../../types/report.types'

export interface ReportRecord {
  id: number
  reporter_id: number
  target_type: CreateReportPayload['targetType']
  target_id: number
  reason: string
  details?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface ReportDetailRecord extends ReportRecord {
  reporter?: {
    id: number
    pseudo?: string | null
    email?: string | null
  } | null
}

export interface ReportGroupSummary {
  target_type: ReportTargetType
  target_id: number
  total_reports: number
  pending_reports: number
  latest_report_at: string | null
  target_label: string
  target_secondary?: string | null
  target_link?: string | null
}

export type ReportStatusAction = 'dismiss' | 'resolve'

export const fetchReportReasonsQuery = async (): Promise<ReportReason[]> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REPORT.REASONS), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load report reasons')
  }

  const { data } = await response.json()
  return data
}

export const fetchReportSummaryQuery = async (): Promise<ReportGroupSummary[]> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REPORT.SUMMARY), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load report summary')
  }

  const { data } = await response.json()
  return data
}

export const updateReportStatusQuery = async (
  targetType: ReportTargetType,
  targetId: number,
  action: ReportStatusAction
): Promise<{ updated: number }> => {
  const response = await fetch(
    getApiUrl(
      `${API_CONFIG.ENDPOINTS.REPORT.TARGET_STATUS}/${targetType}/${targetId}/status`
    ),
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update report status')
  }

  const { data } = await response.json()
  return data
}

export const fetchReportDetailsQuery = async (
  targetType: ReportTargetType,
  targetId: number
): Promise<ReportDetailRecord[]> => {
  const response = await fetch(
    getApiUrl(
      `${API_CONFIG.ENDPOINTS.REPORT.DETAILS}/${targetType}/${targetId}`
    ),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to load report details')
  }

  const { data } = await response.json()
  return data
}

export const submitReportQuery = async (
  payload: CreateReportPayload
): Promise<ReportRecord> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REPORT.CREATE), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetType: payload.targetType,
      targetId: payload.targetId,
      reason: payload.reason,
      details: payload.details,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to submit report')
  }

  const { data } = await response.json()
  return data
}
