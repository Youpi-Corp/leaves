// src/components/widget/widgets/MultipleChoiceWidget.tsx
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { registerWidget } from '../WidgetRegistry'
import {
  QuizFeedback,
  QuizBaseEditor,
  QuizWidgetViewProps,
  QuizWidgetEditProps,
} from '../quiz/QuizWidgetBase'
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa'
import { QuizWidgetProps } from '../quiz/QuizWidgetBase'

export interface MultipleChoiceWidgetProps extends QuizWidgetProps {
  id: string
  type: 'MultipleChoiceWidget'
  label: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  allowMultiple?: boolean
  shuffleOptions?: boolean
}

// View component for multiple choice questions
const MultipleChoiceWidgetView: React.FC<
  QuizWidgetViewProps<MultipleChoiceWidgetProps>
> = ({ widgetData, onAnswer, readonly = false }) => {
  const {
    question = '',
    options = [],
    allowMultiple = false,
    showFeedback = false,
    feedback = {},
  } = widgetData || {}
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Shuffle options if needed
  const displayOptions =
    widgetData?.shuffleOptions && options.length > 0
      ? [...options].sort(() => Math.random() - 0.5)
      : options

  const handleOptionClick = (optionId: string) => {
    if (readonly) return

    let newSelected: string[]

    if (allowMultiple) {
      // Toggle selection for multi-select
      newSelected = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId]
    } else {
      // Single select
      newSelected = [optionId]
    }

    setSelectedOptions(newSelected)
    setShowResult(false)
  }

  const checkAnswer = () => {
    const correctOptionIds = options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id)

    // For multi-select, all correct options must be selected and no incorrect ones
    const correct = allowMultiple
      ? correctOptionIds.length === selectedOptions.length &&
        correctOptionIds.every((id) => selectedOptions.includes(id))
      : selectedOptions.length === 1 &&
        correctOptionIds.includes(selectedOptions[0])

    setIsCorrect(correct)
    setShowResult(true)

    if (onAnswer) {
      // Only pass correctness and answers, no point value
      onAnswer(correct, selectedOptions)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {widgetData.label}
        </h3>
        <p className="text-gray-700">{question}</p>
      </div>

      <div className="space-y-2">
        {displayOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedOptions.includes(option.id)
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 flex-shrink-0 mr-2 rounded-${
                  allowMultiple ? 'sm' : 'full'
                } border ${
                  selectedOptions.includes(option.id)
                    ? 'bg-blue-500 border-blue-500 text-white flex items-center justify-center'
                    : 'border-gray-400'
                }`}
              >
                {selectedOptions.includes(option.id) && (
                  <FaCheck className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1">{option.text}</div>
            </div>
          </div>
        ))}
      </div>

      {!readonly && (
        <div className="mt-4">
          <button
            onClick={checkAnswer}
            disabled={selectedOptions.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        </div>
      )}

      {showResult && (
        <QuizFeedback
          isCorrect={isCorrect}
          feedback={feedback}
          showFeedback={showFeedback}
        />
      )}

      {showResult && isCorrect && widgetData.explanation && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
          <strong>Explanation:</strong> {widgetData.explanation}
        </div>
      )}
    </div>
  )
}

// Edit component for multiple choice questions
const MultipleChoiceWidgetEdit: React.FC<
  QuizWidgetEditProps<MultipleChoiceWidgetProps>
> = ({ widgetData, onChange }) => {
  // Initialize with default data immediately if options is undefined
  React.useEffect(() => {
    if (!widgetData.options) {
      const defaultData = getDefaultWidgetData()
      onChange({
        ...widgetData,
        options: defaultData.options,
        allowMultiple: defaultData.allowMultiple,
        shuffleOptions: defaultData.shuffleOptions,
        showFeedback: defaultData.showFeedback,
        feedback: defaultData.feedback,
      })
    }
  }, [])

  // Add a safeguard to ensure options is always an array
  const options = widgetData.options || []

  const handleAllowMultipleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...widgetData,
      allowMultiple: e.target.checked,
    })
  }

  const handleShuffleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      shuffleOptions: e.target.checked,
    })
  }

  const addOption = () => {
    onChange({
      ...widgetData,
      options: [
        ...options,
        {
          id: uuidv4(),
          text: '',
          isCorrect: false,
        },
      ],
    })
  }

  const updateOption = (
    id: string,
    field: 'text' | 'isCorrect',
    value: string | boolean
  ) => {
    onChange({
      ...widgetData,
      options: options.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    })
  }

  const removeOption = (id: string) => {
    onChange({
      ...widgetData,
      options: options.filter((opt) => opt.id !== id),
    })
  }

  const moveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === options.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newOptions = [...options]
    ;[newOptions[index], newOptions[newIndex]] = [
      newOptions[newIndex],
      newOptions[index],
    ]

    onChange({
      ...widgetData,
      options: newOptions,
    })
  }

  return (
    <QuizBaseEditor widgetData={widgetData} onChange={onChange}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Answer Options
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allow-multiple"
                checked={widgetData.allowMultiple || false}
                onChange={handleAllowMultipleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="allow-multiple"
                className="ml-2 text-sm text-gray-700"
              >
                Allow multiple answers
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="shuffle-options"
                checked={widgetData.shuffleOptions || false}
                onChange={handleShuffleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="shuffle-options"
                className="ml-2 text-sm text-gray-700"
              >
                Shuffle options
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-start border border-gray-200 p-2 rounded-md"
            >
              <div className="flex flex-col items-center mr-2 space-y-1">
                <button
                  type="button"
                  onClick={() => moveOption(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded ${
                    index === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveOption(index, 'down')}
                  disabled={index === options.length - 1}
                  className={`p-1 rounded ${
                    index === options.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-grow">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOption(option.id, 'text', e.target.value)
                  }
                  placeholder="Option text"
                  className="w-full mb-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 ml-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      updateOption(option.id, 'isCorrect', e.target.checked)
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-1 text-xs text-gray-700">Correct</label>
                </div>

                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Delete option"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <FaPlus className="w-3 h-3 mr-1" />
          Add Option
        </button>
      </div>
    </QuizBaseEditor>
  )
}

const getDefaultWidgetData = (): MultipleChoiceWidgetProps => {
  return {
    id: uuidv4(),
    type: 'MultipleChoiceWidget',
    label: 'Multiple Choice Question',
    question: 'Enter your question here',
    options: [
      { id: uuidv4(), text: 'Option 1', isCorrect: false },
      { id: uuidv4(), text: 'Option 2', isCorrect: true },
    ],
    allowMultiple: false,
    shuffleOptions: false,
    showFeedback: true,
    feedback: {
      correct: 'Great job!',
      incorrect: 'Try again!',
    },
  }
}

// Create widget metadata
const multipleChoiceWidgetMetadata = {
  type: 'MultipleChoiceWidget',
  displayName: 'Multiple Choice Question',
  description: 'Create a single or multiple-choice question',
  category: 'Quiz',
  tags: ['quiz', 'question', 'multiple choice', 'interactive'],
  icon: 'quiz',
  version: '1.0.0',
  interactive: true,
}

// Create the component interface
const MultipleChoiceWidget = {
  ViewComponent: MultipleChoiceWidgetView,
  EditComponent: MultipleChoiceWidgetEdit,
  getDefaultWidgetData: getDefaultWidgetData,
}

// Register the widget
registerWidget<MultipleChoiceWidgetProps>(
  multipleChoiceWidgetMetadata,
  MultipleChoiceWidget
)

export {
  MultipleChoiceWidget,
  MultipleChoiceWidgetView,
  MultipleChoiceWidgetEdit,
}
export default MultipleChoiceWidget
