import React, { useMemo, useState, useCallback } from 'react'
import Modal from '../feedback/Modal'
import {
  ReportReason,
  ReportTargetContext,
} from '../../types/report.types'
import {
  useCreateReport,
  useReportReasons,
} from '../../api/report/report.services'

interface ReportModalProps extends ReportTargetContext {
  isOpen: boolean
  onClose: () => void
}

const fallbackReasons: ReportReason[] = [
  {
    code: 'spam',
    label: 'Spam or Scam',
    description: 'Unwanted advertising, phishing links, or suspicious content',
  },
  {
    code: 'harassment',
    label: 'Harassment',
    description: 'Bullying, threats, or targeted harassment',
  },
  {
    code: 'hate',
    label: 'Hate Speech',
    description: 'Derogatory or hateful content toward a protected group',
  },
  {
    code: 'nudity',
    label: 'Nudity or Sexual Content',
    description: 'Sexual or explicit imagery and descriptions',
  },
  {
    code: 'self_harm',
    label: 'Self-Harm',
    description: 'Content encouraging self-harm or suicide',
  },
  {
    code: 'misinformation',
    label: 'Misinformation',
    description: 'False or misleading information presented as fact',
  },
  {
    code: 'plagiarism',
    label: 'Plagiarism',
    description: 'Copied content without credit or permission',
  },
  {
    code: 'other',
    label: 'Other',
    description: 'Anything else that violates BrainForest guidelines',
  },
]

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetLabel,
}) => {
  const { data: reasons, isLoading } = useReportReasons()
  const createReportMutation = useCreateReport()
  const [selectedReason, setSelectedReason] = useState('')
  const [details, setDetails] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState('')

  const reasonOptions = useMemo(() => {
    if (reasons && reasons.length > 0) {
      return reasons
    }
    return fallbackReasons
  }, [reasons])

  const resetForm = useCallback(() => {
    setFeedback('idle')
    setErrorMessage('')
    setDetails('')
    setSelectedReason('')
  }, [])

  const defaultReasonCode = reasonOptions[0]?.code || ''
  const effectiveReason = selectedReason || defaultReasonCode

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const friendlyTarget = useMemo(() => {
    if (targetLabel) return targetLabel

    switch (targetType) {
      case 'user':
        return `User #${targetId}`
      case 'module':
        return `Module #${targetId}`
      case 'lesson':
        return `Lesson #${targetId}`
      case 'comment':
      default:
        return `Comment #${targetId}`
    }
  }, [targetLabel, targetType, targetId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!effectiveReason || createReportMutation.isPending) {
      return
    }

    setErrorMessage('')
    try {
      await createReportMutation.mutateAsync({
        targetType,
        targetId,
        reason: effectiveReason,
        details: details.trim() || undefined,
      })
      setFeedback('success')
    } catch (error) {
      setFeedback('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit your report. Please try again.'
      )
    }
  }

  const isSubmitDisabled =
    createReportMutation.isPending || !effectiveReason || feedback === 'success'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="w-full max-w-lg">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-bfbase-black">
            Report {friendlyTarget}
          </h3>
          <p className="text-sm text-bfbase-grey mt-1">
            Reports stay anonymous. Please choose the most accurate reason and
            add helpful context.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <select
              value={effectiveReason}
              onChange={(event) => setSelectedReason(event.target.value)}
              disabled={isLoading || reasonOptions.length === 0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
            >
              {reasonOptions.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.label}
                </option>
              ))}
            </select>
            {effectiveReason && (
              <p className="text-xs text-gray-500 mt-2">
                {
                  reasonOptions.find((reason) => reason.code === effectiveReason)
                    ?.description
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details (optional)
            </label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bfgreen-base"
              placeholder="Share context that helps moderators understand the issue."
            />
            <div className="text-right text-xs text-gray-400">
              {details.length}/1000
            </div>
          </div>

          {feedback === 'success' && (
            <div className="bg-bfgreen-light text-bfgreen-dark px-4 py-2 rounded-lg text-sm">
              Thank you! Our moderators will review your report shortly.
            </div>
          )}

          {feedback === 'error' && errorMessage && (
            <div className="bg-bfred-light text-bfred-base px-4 py-2 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {feedback === 'success' ? 'Close' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-4 py-2 bg-bfred-base text-white rounded-lg hover:bg-bfred-dark disabled:opacity-50"
            >
              {createReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ReportModal
