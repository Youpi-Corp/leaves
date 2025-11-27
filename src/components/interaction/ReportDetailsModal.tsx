import React, { useMemo } from 'react'
import Modal from '../feedback/Modal'
import Spinner from '../feedback/Spinner'
import { ReportTargetContext } from '../../types/report.types'
import { useReportDetails, useReportReasons } from '../../api/report/report.services'
import { ReportDetailRecord } from '../../api/report/report.queries'

interface ReportDetailsModalProps {
  isOpen: boolean
  target: ReportTargetContext | null
  onClose: () => void
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-700',
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  target,
  onClose,
}) => {
  const { data: reasonCatalog } = useReportReasons()
  const reasonMap = useMemo(() => {
    if (!reasonCatalog) return new Map<string, string>()
    return new Map(reasonCatalog.map((reason) => [reason.code, reason.label]))
  }, [reasonCatalog])

  const {
    data: reportDetails,
    isLoading,
    isError,
    refetch,
  } = useReportDetails(target?.targetType, target?.targetId, isOpen)

  if (!target) {
    return null
  }

  const getReasonLabel = (reason: string) => reasonMap.get(reason) || reason

  const formatDateTime = (value: string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )
    }

    if (isError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Unable to load report details. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-bfblue-base text-white rounded-lg hover:bg-bfblue-dark"
          >
            Retry
          </button>
        </div>
      )
    }

    if (!reportDetails || reportDetails.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No reports have been filed for this item.</p>
        </div>
      )
    }

    return (
      <ul className="space-y-4">
        {reportDetails.map((report: ReportDetailRecord) => (
          <li key={report.id} className="border rounded-lg p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {getReasonLabel(report.reason)}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusStyles[report.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {report.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Submitted {formatDateTime(report.created_at)}
            </p>
            <div className="mt-3 text-sm text-gray-700">
              <p>
                Reporter:{' '}
                <span className="font-medium text-gray-900">
                  {report.reporter?.pseudo || `User #${report.reporter_id}`}
                </span>
                {report.reporter?.email && (
                  <span className="text-gray-500"> ({report.reporter.email})</span>
                )}
              </p>
              {report.details && (
                <p className="mt-2 whitespace-pre-line text-gray-800">
                  {report.details}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Reports for {target.targetLabel || `${target.targetType} #${target.targetId}`}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {reportDetails?.length || 0} report(s) found
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium"
          >
            Close
          </button>
        </div>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </Modal>
  )
}

export default ReportDetailsModal
