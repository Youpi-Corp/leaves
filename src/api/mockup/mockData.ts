/**
 * Mockup data for development and testing
 */

// Modules data
export const mockModules = [
  { 
    id: 1, 
    title: 'Introduction to React', 
    description: 'Learn the basics of React and start building user interfaces',
    lessonCount: 5, 
    lastEdited: '2025-04-28',
    lessons: [
      { 
        id: 1, 
        title: 'React Fundamentals', 
        description: 'An introduction to React core concepts', 
        lastEdited: '2025-04-27', 
        duration: 15 
      },
      { 
        id: 2, 
        title: 'Component-Based Architecture', 
        description: 'Learn about React components and their lifecycle', 
        lastEdited: '2025-04-26', 
        duration: 20 
      },
      { 
        id: 3, 
        title: 'State and Props', 
        description: 'Managing data flow in React applications', 
        lastEdited: '2025-04-25', 
        duration: 25 
      },
      { 
        id: 4, 
        title: 'Hooks Introduction', 
        description: 'Using React hooks for state and side effects', 
        lastEdited: '2025-04-24', 
        duration: 30 
      },
      { 
        id: 5, 
        title: 'Building a Simple App', 
        description: 'Putting it all together in a practical project', 
        lastEdited: '2025-04-23', 
        duration: 45 
      }
    ]
  },
  { 
    id: 2, 
    title: 'State Management with Redux', 
    description: 'Master global state management with Redux',
    lessonCount: 4, 
    lastEdited: '2025-04-25',
    lessons: [
      { 
        id: 1, 
        title: 'Redux Core Concepts', 
        description: 'Understanding actions, reducers, and the store', 
        lastEdited: '2025-04-24', 
        duration: 20 
      },
      { 
        id: 2, 
        title: 'Middleware and Async Operations', 
        description: 'Handling side effects in Redux', 
        lastEdited: '2025-04-23', 
        duration: 25 
      },
      { 
        id: 3, 
        title: 'Redux with React', 
        description: 'Integrating Redux with React applications', 
        lastEdited: '2025-04-22', 
        duration: 30 
      },
      { 
        id: 4, 
        title: 'Redux Toolkit', 
        description: 'Simplifying Redux with modern tools', 
        lastEdited: '2025-04-21', 
        duration: 35 
      }
    ]
  },
  { 
    id: 3, 
    title: 'React Hooks Deep Dive', 
    description: 'Advanced usage of React hooks in modern applications',
    lessonCount: 2, 
    lastEdited: '2025-04-20',
    lessons: [
      { 
        id: 1, 
        title: 'useState and useEffect', 
        description: 'Mastering the basic hooks', 
        lastEdited: '2025-04-19', 
        duration: 25 
      },
      { 
        id: 2, 
        title: 'useContext', 
        description: 'Managing global state with Context', 
        lastEdited: '2025-04-18', 
        duration: 20 
      }
    ]
  },
  { 
    id: 4, 
    title: 'Building Responsive UIs', 
    description: 'Create interfaces that work on any device',
    lessonCount: 0, 
    lastEdited: '2025-04-15',
    lessons: []
  },
  { 
    id: 5, 
    title: 'Authentication and Authorization', 
    description: 'Implement secure authentication in web applications',
    lessonCount: 0, 
    lastEdited: '2025-04-10',
    lessons: []
  }
];

// Carousel data
export const mockCarousels = {
  'featured': {
    title: 'Featured Modules',
    moduleIds: [1, 2, 3, 4, 5]
  },
  'popular': {
    title: 'Popular This Week',
    moduleIds: [2, 3, 4, 5]
  },
  'recent': {
    title: 'Recently Added',
    moduleIds: [5, 4, 3]
  },
  "continue": {
    title: 'Continue Learning',
    moduleIds: [1, 2, 3, 4]
  }
};