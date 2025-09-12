import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  BaseWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'
import { FaPlus, FaTrash, FaArrowsAltH, FaGripVertical } from 'react-icons/fa'

/**
 * Props for the matching widget
 */
export interface MatchingWidgetProps extends BaseWidgetProps {
  question: string
  leftItems: Array<{
    id: string
    text: string
  }>
  rightItems: Array<{
    id: string
    text: string
  }>
  correctMatches: Array<{
    leftId: string
    rightId: string
  }>
  shuffleItems?: boolean
  showFeedback?: boolean
  feedback?: {
    correct?: string
    incorrect?: string
  }
  explanation?: string
}

/**
 * Register MatchingWidget props with the registry
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    MatchingWidget: MatchingWidgetProps
  }
}

// Matching Widget metadata
const matchingWidgetMetadata: WidgetMetadata = {
  type: 'MatchingWidget',
  displayName: 'Matching Questions',
  description:
    'Create matching exercises where users connect items from two columns',
  icon: 'match',
  category: 'Quiz',
  version: '1.0.0',
  tags: ['matching', 'quiz', 'education', 'interactive'],
  interactive: true,
}

/**
 * Matching Widget View Component
 * Displays the matching exercise interface
 */
const MatchingWidgetView: React.FC<WidgetViewProps<MatchingWidgetProps>> = ({
  widgetData,
  onEdit,
  onAnswer,
}) => {
  const {
    question = '',
    leftItems = [],
    rightItems = [],
    correctMatches = [],
    shuffleItems = false,
    showFeedback = false,
    feedback = {},
    explanation = '',
  } = widgetData
  const [userMatches, setUserMatches] = useState<
    Array<{ leftId: string; rightId: string }>
  >([])
  const [selectedLeftItem, setSelectedLeftItem] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Refs for drawing connection lines
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [connectionLines, setConnectionLines] = useState<
    Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
    }>
  >([])

  // Calculate connection lines
  const updateConnectionLines = () => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const lines: Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
    }> = []

    userMatches.forEach((match) => {
      const leftElement = leftRefs.current[match.leftId]
      const rightElement = rightRefs.current[match.rightId]

      if (leftElement && rightElement) {
        const leftRect = leftElement.getBoundingClientRect()
        const rightRect = rightElement.getBoundingClientRect()

        // Calculate line coordinates relative to container
        const x1 = leftRect.right - containerRect.left
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top
        const x2 = rightRect.left - containerRect.left
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top

        // Determine line color based on correctness
        let color = '#5fbb63' // blue
        if (showResult) {
          const isCorrectMatch = correctMatches.some(
            (correct) =>
              correct.leftId === match.leftId &&
              correct.rightId === match.rightId
          )
          color = isCorrectMatch ? '#10B981' : '#EF4444' // green or red
        }

        lines.push({ x1, y1, x2, y2, color })
      }
    })

    setConnectionLines(lines)
  }

  // Update lines when matches change or component updates
  useEffect(() => {
    const timer = setTimeout(updateConnectionLines, 100) // Small delay to ensure DOM is updated
    return () => clearTimeout(timer)
  }, [userMatches, showResult])

  // Update lines on window resize
  useEffect(() => {
    const handleResize = () => updateConnectionLines()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [userMatches])

  // Shuffle items if enabled
  const displayLeftItems = shuffleItems
    ? [...leftItems].sort(() => Math.random() - 0.5)
    : leftItems
  const displayRightItems = shuffleItems
    ? [...rightItems].sort(() => Math.random() - 0.5)
    : rightItems

  const handleLeftItemClick = (leftId: string) => {
    if (showResult) return
    setSelectedLeftItem(leftId === selectedLeftItem ? null : leftId)
  }
  const handleRightItemClick = (rightId: string) => {
    if (!selectedLeftItem || showResult) return

    // Check if this right item is already matched to another left item
    const isRightItemAlreadyMatched = userMatches.some(
      (match) => match.rightId === rightId
    )

    if (isRightItemAlreadyMatched) {
      // Don't allow matching to an already matched right item
      return
    }

    // Remove any existing match for the selected left item
    const updatedMatches = userMatches.filter(
      (match) => match.leftId !== selectedLeftItem
    )

    // Add the new match
    const newMatches = [
      ...updatedMatches,
      { leftId: selectedLeftItem, rightId },
    ]
    setUserMatches(newMatches)
    setSelectedLeftItem(null)
  }

  const removeMatch = (leftId: string) => {
    if (showResult) return
    setUserMatches(userMatches.filter((match) => match.leftId !== leftId))
  }

  const checkAnswer = () => {
    // Check if all correct matches are present and no incorrect ones
    const correct =
      correctMatches.length === userMatches.length &&
      correctMatches.every((correctMatch) =>
        userMatches.some(
          (userMatch) =>
            userMatch.leftId === correctMatch.leftId &&
            userMatch.rightId === correctMatch.rightId
        )
      )

    setIsCorrect(correct)
    setShowResult(true)

    if (onAnswer) {
      onAnswer(correct, userMatches)
    }
  }

  const resetAnswers = () => {
    setUserMatches([])
    setSelectedLeftItem(null)
    setShowResult(false)
  }

  // Get the matched right item for a left item
  const getMatchedRightId = (leftId: string) => {
    const match = userMatches.find((m) => m.leftId === leftId)
    return match?.rightId || null
  }
  // Check if a right item is already matched
  const isRightItemMatched = (rightId: string) => {
    return userMatches.some((match) => match.rightId === rightId)
  }

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* SVG for connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        style={{ width: '100%', height: '100%' }}
      >
        {connectionLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="2"
            strokeDasharray={showResult ? '0' : '5,5'}
          />
        ))}
      </svg>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">
            {widgetData.label}
          </h3>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-bfgreen-dark hover:text-bfgreen-dark"
            >
              Edit
            </button>
          )}{' '}
        </div>
        {question && <p className="text-gray-700">{question}</p>}
      </div>

      {/* Matching Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Match these items:</h4>
          <div className="space-y-2">
            {' '}
            {displayLeftItems.map((item) => {
              const matchedRightId = getMatchedRightId(item.id)
              const isSelected = selectedLeftItem === item.id

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    leftRefs.current[item.id] = el
                  }}
                  onClick={() => handleLeftItemClick(item.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-bfgreen-light border-bfgreen-base ring-2 ring-bfgreen-light'
                      : matchedRightId
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-300 hover:border-bfgreen-base'
                  } ${showResult ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.text}</span>
                    <div className="flex items-center gap-2">
                      {matchedRightId && !showResult && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeMatch(item.id)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}{' '}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">With these items:</h4>
          <div className="space-y-2">
            {' '}
            {displayRightItems.map((item) => {
              const isMatched = isRightItemMatched(item.id)
              const canSelect = selectedLeftItem && !isMatched && !showResult

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    rightRefs.current[item.id] = el
                  }}
                  onClick={() => handleRightItemClick(item.id)}
                  className={`p-3 border rounded-lg transition-all relative ${
                    canSelect
                      ? 'bg-bfgreen-light border-bfgreen-base cursor-pointer hover:bg-bfgreen-light'
                      : isMatched
                      ? 'bg-green-50 border-green-300 cursor-default'
                      : 'bg-gray-50 border-gray-200 cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        isMatched
                          ? 'text-green-700'
                          : canSelect
                          ? 'text-bfgreen-dark'
                          : 'text-gray-600'
                      }
                    >
                      {item.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>{' '}
        </div>
      </div>

      {/* Action Buttons */}
      {!showResult && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={checkAnswer}
            disabled={userMatches.length !== correctMatches.length}
            className="px-4 py-2 bg-bfgreen-base text-white rounded-lg hover:bg-bfgreen-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
          <button
            onClick={resetAnswers}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      )}

      {/* Results */}
      {showResult && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center mb-2">
              <span
                className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </span>
            </div>

            {showFeedback && (
              <p
                className={`text-sm ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isCorrect
                  ? feedback.correct || 'Great job!'
                  : feedback.incorrect || 'Try again!'}
              </p>
            )}
          </div>

          {explanation && (
            <div className="p-4 bg-bfgreen-light border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
              <p className="text-bfgreen-dark text-sm">{explanation}</p>
            </div>
          )}

          <button
            onClick={resetAnswers}
            className="px-4 py-2 bg-bfgreen-base text-white rounded-lg hover:bg-bfgreen-dark"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Matching Widget Edit Component
 * Provides a form for editing matching questions
 */
const MatchingWidgetEdit: React.FC<WidgetEditProps<MatchingWidgetProps>> = ({
  widgetData,
  onChange,
}) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...widgetData,
      question: e.target.value,
    })
  }

  const handleExplanationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({
      ...widgetData,
      explanation: e.target.value,
    })
  }

  // Left items management
  const addLeftItem = () => {
    const newItem = {
      id: uuidv4(),
      text: '',
    }
    onChange({
      ...widgetData,
      leftItems: [...(widgetData.leftItems || []), newItem],
    })
  }

  const updateLeftItem = (id: string, text: string) => {
    onChange({
      ...widgetData,
      leftItems:
        widgetData.leftItems?.map((item) =>
          item.id === id ? { ...item, text } : item
        ) || [],
    })
  }

  const removeLeftItem = (id: string) => {
    onChange({
      ...widgetData,
      leftItems: widgetData.leftItems?.filter((item) => item.id !== id) || [],
      correctMatches:
        widgetData.correctMatches?.filter((match) => match.leftId !== id) || [],
    })
  }

  // Right items management
  const addRightItem = () => {
    const newItem = {
      id: uuidv4(),
      text: '',
    }
    onChange({
      ...widgetData,
      rightItems: [...(widgetData.rightItems || []), newItem],
    })
  }

  const updateRightItem = (id: string, text: string) => {
    onChange({
      ...widgetData,
      rightItems:
        widgetData.rightItems?.map((item) =>
          item.id === id ? { ...item, text } : item
        ) || [],
    })
  }

  const removeRightItem = (id: string) => {
    onChange({
      ...widgetData,
      rightItems: widgetData.rightItems?.filter((item) => item.id !== id) || [],
      correctMatches:
        widgetData.correctMatches?.filter((match) => match.rightId !== id) ||
        [],
    })
  }

  // Correct matches management
  const updateCorrectMatch = (leftId: string, rightId: string) => {
    const existingMatches = widgetData.correctMatches || []
    const updatedMatches = existingMatches.filter(
      (match) => match.leftId !== leftId
    )

    if (rightId) {
      updatedMatches.push({ leftId, rightId })
    }

    onChange({
      ...widgetData,
      correctMatches: updatedMatches,
    })
  }

  const getCorrectMatchForLeft = (leftId: string) => {
    return (
      widgetData.correctMatches?.find((match) => match.leftId === leftId)
        ?.rightId || ''
    )
  }

  const handleShuffleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      shuffleItems: e.target.checked,
    })
  }

  const handleShowFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      showFeedback: e.target.checked,
    })
  }

  const handleFeedbackChange = (
    type: 'correct' | 'incorrect',
    value: string
  ) => {
    onChange({
      ...widgetData,
      feedback: {
        ...widgetData.feedback,
        [type]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Widget Title
          </label>
          <input
            type="text"
            value={widgetData.label || ''}
            onChange={handleLabelChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
            placeholder="Enter widget title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question or Instructions
          </label>
          <textarea
            value={widgetData.question || ''}
            onChange={handleQuestionChange}
            rows={3}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
            placeholder="Enter the matching question or instructions"
          />
        </div>
      </div>

      {/* Items Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Left Items</h4>
            <button
              type="button"
              onClick={addLeftItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-bfgreen-dark bg-bfgreen-light hover:bg-blue-200"
            >
              <FaPlus className="mr-1" size={12} />
              Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(widgetData.leftItems || []).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <FaGripVertical className="text-gray-400" />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateLeftItem(item.id, e.target.value)}
                  className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                  placeholder={`Left item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeLeftItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Right Items</h4>
            <button
              type="button"
              onClick={addRightItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-bfgreen-dark bg-bfgreen-light hover:bg-blue-200"
            >
              <FaPlus className="mr-1" size={12} />
              Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(widgetData.rightItems || []).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <FaGripVertical className="text-gray-400" />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateRightItem(item.id, e.target.value)}
                  className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                  placeholder={`Right item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeRightItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Correct Matches Configuration */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Correct Matches</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(widgetData.leftItems || []).map((leftItem) => (
            <div key={leftItem.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <span className="text-sm text-gray-600">
                  {leftItem.text ||
                    `Left item ${
                      (widgetData.leftItems || []).findIndex(
                        (i) => i.id === leftItem.id
                      ) + 1
                    }`}
                </span>
              </div>
              <FaArrowsAltH className="text-gray-400" />
              <div className="flex-1">
                <select
                  value={getCorrectMatchForLeft(leftItem.id)}
                  onChange={(e) =>
                    updateCorrectMatch(leftItem.id, e.target.value)
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                >
                  <option value="">Select match...</option>
                  {(widgetData.rightItems || []).map((rightItem) => (
                    <option key={rightItem.id} value={rightItem.id}>
                      {rightItem.text ||
                        `Right item ${
                          (widgetData.rightItems || []).findIndex(
                            (i) => i.id === rightItem.id
                          ) + 1
                        }`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="shuffle-items"
            type="checkbox"
            checked={widgetData.shuffleItems || false}
            onChange={handleShuffleChange}
            className="h-4 w-4 text-bfgreen-dark focus:ring-bfgreen-base border-gray-300 rounded"
          />
          <label
            htmlFor="shuffle-items"
            className="ml-2 block text-sm text-gray-700"
          >
            Shuffle items each time
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="show-feedback"
            type="checkbox"
            checked={widgetData.showFeedback || false}
            onChange={handleShowFeedbackChange}
            className="h-4 w-4 text-bfgreen-dark focus:ring-bfgreen-base border-gray-300 rounded"
          />
          <label
            htmlFor="show-feedback"
            className="ml-2 block text-sm text-gray-700"
          >
            Show custom feedback
          </label>
        </div>
      </div>

      {/* Feedback Configuration */}
      {widgetData.showFeedback && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Feedback Messages</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer Feedback
              </label>
              <textarea
                value={widgetData.feedback?.correct || ''}
                onChange={(e) =>
                  handleFeedbackChange('correct', e.target.value)
                }
                rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                placeholder="Great job!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incorrect Answer Feedback
              </label>
              <textarea
                value={widgetData.feedback?.incorrect || ''}
                onChange={(e) =>
                  handleFeedbackChange('incorrect', e.target.value)
                }
                rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
                placeholder="Try again!"
              />
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <textarea
          value={widgetData.explanation || ''}
          onChange={handleExplanationChange}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          placeholder="Provide an explanation of the correct answers..."
        />
      </div>
    </div>
  )
}

// Create the MatchingWidget interface implementation
const MatchingWidget: WidgetComponentInterface<MatchingWidgetProps> = {
  ViewComponent: MatchingWidgetView,
  EditComponent: MatchingWidgetEdit,
}

// Register the matching widget
registerWidget<MatchingWidgetProps>(matchingWidgetMetadata, MatchingWidget)

export { MatchingWidget, MatchingWidgetView, MatchingWidgetEdit }
export default MatchingWidget
