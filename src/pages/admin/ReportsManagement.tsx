import React, { useMemo, useState } from 'react'
import {
  useReportSummary,
  useUpdateReportStatus,
} from '../../api/report/report.services'
import { ReportGroupSummary } from '../../api/report/report.queries'
import { ReportTargetContext, ReportTargetType } from '../../types/report.types'
import Spinner from '../../components/feedback/Spinner'
import ReportDetailsModal from '../../components/interaction/ReportDetailsModal'
import {
  FaExternalLinkAlt,
  FaSync,
  FaTimesCircle,
  FaCheckCircle,
  FaListUl,
} from 'react-icons/fa'

const typeLabels: Record<ReportTargetType, string> = {
  user: 'User',
  module: 'Module',
  lesson: 'Lesson',
  comment: 'Comment',
}

const typeFilters: Array<{ label: string; value: 'all' | ReportTargetType }> = [
  { label: 'All types', value: 'all' },
  { label: 'Users', value: 'user' },
  { label: 'Modules', value: 'module' },
  { label: 'Lessons', value: 'lesson' },
  { label: 'Comments', value: 'comment' },
]

const ReportsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ReportTargetType>('all')
  const [showOnlyPending, setShowOnlyPending] = useState(true)
  const [detailsTarget, setDetailsTarget] = useState<ReportTargetContext | null>(
    null
  )

  const { data: summary, isLoading, isError, refetch } = useReportSummary()
  const updateStatus = useUpdateReportStatus()

  const filteredReports = useMemo(() => {
    if (!summary) return []

    return summary.filter((group) => {
      if (typeFilter !== 'all' && group.target_type !== typeFilter) {
        return false
      }

      if (showOnlyPending && group.pending_reports === 0) {
        return false
      }

      if (!searchTerm) return true

      const term = searchTerm.toLowerCase()
      const secondary = group.target_secondary
        ? group.target_secondary.toLowerCase()
        : ''

      return (
        group.target_label.toLowerCase().includes(term) ||
        (secondary ? secondary.includes(term) : false) ||
        `${group.target_type} #${group.target_id}`
          .toLowerCase()
          .includes(term)
      )
    })
  }, [summary, searchTerm, typeFilter, showOnlyPending])

  const handleStatusChange = (
    group: ReportGroupSummary,
    action: 'dismiss' | 'resolve'
  ) => {
    updateStatus.mutate({
      targetType: group.target_type,
      targetId: group.target_id,
      action,
    })
  }

  const openTarget = (group: ReportGroupSummary) => {
    if (!group.target_link) return
    window.open(group.target_link, '_blank')
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
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">
            Unable to load reports. Please try again later.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-bfblue-base text-white rounded-lg hover:bg-bfblue-dark inline-flex items-center gap-2"
          >
            <FaSync className="w-4 h-4" />
            Retry
          </button>
        </div>
      )
    }

    if (!filteredReports.length) {
      return (
        <div className="text-center py-16 text-gray-500">
          <FaListUl className="w-10 h-10 mx-auto mb-4" />
          <p>
            {showOnlyPending
              ? 'No pending reports match your filters.'
              : 'No reports found for the selected filters.'}
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Pending
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Last reported
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((group) => {
              const pendingBadgeColor =
                group.pending_reports > 0
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'

              return (
                <tr key={`${group.target_type}-${group.target_id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {group.target_label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {group.target_secondary || `ID #${group.target_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {typeLabels[group.target_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pendingBadgeColor}`}>
                      {group.pending_reports}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.total_reports}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.latest_report_at
                      ? new Date(group.latest_report_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() =>
                          setDetailsTarget({
                            targetType: group.target_type,
                            targetId: group.target_id,
                            targetLabel: group.target_label,
                          })
                        }
                        className="text-bfblue-base hover:text-bfblue-dark"
                      >
                        Details
                      </button>
                      {group.target_link && (
                        <button
                          onClick={() => openTarget(group)}
                          className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          Open
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(group, 'dismiss')}
                        disabled={group.pending_reports === 0 || updateStatus.isPending}
                        className="text-orange-600 hover:text-orange-800 inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <FaTimesCircle className="w-4 h-4" />
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleStatusChange(group, 'resolve')}
                        disabled={group.pending_reports === 0 || updateStatus.isPending}
                        className="text-green-600 hover:text-green-800 inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Reports Management</h2>
          <p className="text-sm text-gray-600">
            Review grouped reports, inspect details, and resolve or dismiss issues quickly.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="relative md:col-span-1">
          <input
            type="text"
            placeholder="Search target, ID, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
          />
        </div>
        <div className="md:col-span-1">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | ReportTargetType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
          >
            {typeFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showOnlyPending}
            onChange={(e) => setShowOnlyPending(e.target.checked)}
            className="w-4 h-4 text-bfgreen-base focus:ring-bfgreen-base"
          />
          Show only pending
        </label>
      </div>

      <div className="bg-white rounded-lg border">
        {renderContent()}
      </div>

      <ReportDetailsModal
        isOpen={!!detailsTarget}
        target={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />
    </div>
  )
}

export default ReportsManagement
