import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const MarkdownWidget: React.FC = () => {
  const [markdownText, setMarkdownText] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(event.target.value)
  }

  return (
    <div>
      WIP
      <textarea
        className="w-full h-48 resize-none border-2 border-gray-300 rounded-md p-2"
        value={markdownText}
        onChange={handleInputChange}
        placeholder="Enter Markdown text..."
        rows={10}
        cols={50}
      />
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  )
}

export default MarkdownWidget
