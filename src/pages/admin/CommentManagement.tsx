import React, { useMemo, useState } from 'react'
import { FaSearch, FaTrash, FaExternalLinkAlt } from 'react-icons/fa'
import Spinner from '../../components/feedback/Spinner'
import { useAdminComments } from '../../api/admin/admin.services'
import { useDeleteModuleComment } from '../../api/module/module-comment.services'
import { useQueryClient } from '@tanstack/react-query'
import ReportDetailsModal from '../../components/interaction/ReportDetailsModal'
import { ReportTargetContext } from '../../types/report.types'

const CommentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'reports' | 'recent'>('reports')
  const { data: comments, isLoading, error } = useAdminComments()
  const deleteComment = useDeleteModuleComment()
  const queryClient = useQueryClient()
  const [reportDetailsTarget, setReportDetailsTarget] = useState<ReportTargetContext | null>(null)

  const filteredComments = useMemo(() => {
    if (!comments) return []

    if (!searchTerm) return comments

    const lower = searchTerm.toLowerCase()
    return comments.filter((comment) =>
      comment.content.toLowerCase().includes(lower) ||
      comment.module_id.toString().includes(lower) ||
      comment.user_id.toString().includes(lower)
    )
  }, [comments, searchTerm])

  const sortedComments = useMemo(() => {
    const copy = [...filteredComments]
    if (sortBy === 'reports') {
      return copy.sort(
        (a, b) => (b.report_count ?? 0) - (a.report_count ?? 0)
      )
    }

    return copy.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [filteredComments, sortBy])

  const handleDelete = async (commentId: number) => {
    const confirmed = window.confirm(
      'Delete this comment? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await deleteComment.mutateAsync(commentId)
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] })
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Unable to load comments. Please try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comment Management</h2>
          <p className="text-sm text-gray-600">
            Monitor and moderate module comments that were reported by users.
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {filteredComments.length} comment(s)
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by keywords, module ID, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bfgreen-base focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600">
            Found {filteredComments.length} comment(s) matching &ldquo;
            {searchTerm}&rdquo;
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-600">Sort results by</span>
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as 'reports' | 'recent')
            }
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
          >
            <option value="reports">Reports (high to low)</option>
            <option value="recent">Most recent</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 truncate max-w-md">
                      {comment.content}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Module #{comment.module_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    User #{comment.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-bfred-base">
                    <div className="flex items-center gap-3">
                      <span>{comment.report_count}</span>
                      {comment.report_count > 0 && (
                        <button
                          onClick={() =>
                            setReportDetailsTarget({
                              targetType: 'comment',
                              targetId: comment.id,
                              targetLabel: `Comment #${comment.id}`,
                            })
                          }
                          className="text-bfblue-base hover:text-bfblue-dark text-xs font-semibold"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          window.open(`/module/${comment.module_id}`, '_blank')
                        }
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        View module
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                        disabled={deleteComment.isPending}
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedComments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              {searchTerm
                ? 'No comments match your search.'
                : 'No comments have been reported yet.'}
            </p>
          </div>
        )}
      </div>
      <ReportDetailsModal
        isOpen={!!reportDetailsTarget}
        target={reportDetailsTarget}
        onClose={() => setReportDetailsTarget(null)}
      />
    </div>
  )
}

export default CommentManagement
