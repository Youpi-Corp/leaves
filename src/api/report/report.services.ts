import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchReportReasonsQuery,
  fetchReportSummaryQuery,
  fetchReportDetailsQuery,
  submitReportQuery,
  updateReportStatusQuery,
  ReportStatusAction,
} from './report.queries'
import { CreateReportPayload, ReportTargetType } from '../../types/report.types'

export const useReportReasons = () => {
  return useQuery({
    queryKey: ['reports', 'reasons'],
    queryFn: fetchReportReasonsQuery,
    staleTime: 1000 * 60 * 60,
  })
}

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => submitReportQuery(payload),
  })
}

export const useReportDetails = (
  targetType?: ReportTargetType,
  targetId?: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ['reports', 'details', targetType, targetId],
    queryFn: () => fetchReportDetailsQuery(targetType!, targetId!),
    enabled: Boolean(enabled && targetType && targetId),
    staleTime: 0,
  })
}

export const useReportSummary = () => {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: fetchReportSummaryQuery,
    refetchInterval: 1000 * 60,
  })
}

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      targetType,
      targetId,
      action,
    }: {
      targetType: ReportTargetType
      targetId: number
      action: ReportStatusAction
    }) => updateReportStatusQuery(targetType, targetId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'summary'] })
      queryClient.invalidateQueries({
        queryKey: ['reports', 'details', variables.targetType, variables.targetId],
      })
    },
  })
}
