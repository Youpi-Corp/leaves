// src/components/widget/quiz/QuizWidgetBase.tsx
import React from 'react'
import { BaseWidgetProps } from '../../../types/WidgetTypes';

export interface QuizWidgetProps extends BaseWidgetProps {
  question: string;
  explanation?: string;
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
  showFeedback?: boolean;
  required?: boolean;
}

export interface QuizWidgetViewProps<T extends QuizWidgetProps, AnswerType = unknown> {
  widgetData: T;
  onAnswer?: (isCorrect: boolean, answer: AnswerType) => void;
  onEdit?: () => void;
  readonly?: boolean;
}

export interface QuizWidgetEditProps<T extends QuizWidgetProps> {
  widgetData: T;
  onChange: (data: T) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export interface QuizWidgetComponentInterface<T extends QuizWidgetProps> {
  ViewComponent: React.FC<QuizWidgetViewProps<T>>;
  EditComponent: React.FC<QuizWidgetEditProps<T>>;
}

// Common quiz component elements
export const QuizFeedback: React.FC<{
  isCorrect: boolean;
  feedback?: { correct?: string; incorrect?: string };
  showFeedback?: boolean;
}> = ({ isCorrect, feedback, showFeedback }) => {
  if (!showFeedback) return null;
  
  const message = isCorrect 
    ? (feedback?.correct || 'Correct!') 
    : (feedback?.incorrect || 'Incorrect. Try again.');
  
  return (
    <div className={`mt-2 p-2 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {message}
    </div>
  );
};

// Common question editor fields
export const QuizBaseEditor = <T extends QuizWidgetProps>({
  widgetData,
  onChange,
  children,
}: {
  widgetData: T;
  onChange: (data: T) => void;
  children: React.ReactNode;
}) => {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...widgetData,
      question: e.target.value,
    });
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...widgetData,
      explanation: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Title
        </label>
        <input
          type="text"
          value={widgetData.label || ''}
          onChange={(e) => onChange({ ...widgetData, label: e.target.value })}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <textarea
          value={widgetData.question}
          onChange={handleQuestionChange}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          placeholder="Enter your question here..."
        />
      </div>
      
      {children}
    
      
      {widgetData.showFeedback && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer Feedback
            </label>
            <input
              type="text"
              value={widgetData.feedback?.correct || ''}
              onChange={(e) => onChange({
                ...widgetData,
                feedback: {
                  ...widgetData.feedback,
                  correct: e.target.value
                }
              })}
              placeholder="Great job!"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Incorrect Answer Feedback
            </label>
            <input
              type="text"
              value={widgetData.feedback?.incorrect || ''}
              onChange={(e) => onChange({
                ...widgetData,
                feedback: {
                  ...widgetData.feedback,
                  incorrect: e.target.value
                }
              })}
              placeholder="Try again"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
            />
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <textarea
          value={widgetData.explanation || ''}
          onChange={handleExplanationChange}
          rows={2}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-bfgreen-base focus:border-bfgreen-base"
          placeholder="Explanation shown after answering"
        />
      </div>
    </div>
  );
};