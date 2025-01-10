import React from 'react'
import Sidebar from '../../layout/sidebar/Sidebar'

const CourseEditorPage: React.FC = () => {
  return (
    <div
      className={`flex w-full h-screen items-center justify-center bg-[url(./assets/graph-paper.svg)]`}
    >
      <div className="flex w-full h-full">
        <div className="p-4 w-full">
          <div
            className="max-w-[920px] bg-white shadow-md h-full m-auto rounded-xl
          flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto"
          ></div>
        </div>
      </div>
      <Sidebar position="right" title="Modules"></Sidebar>
    </div>
  )
}

export default CourseEditorPage
