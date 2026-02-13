# Brainforest - Leaves (Frontend)

This is the frontend for the Brainforest application, built with React and Vite. It provides the user interface for interacting with the Brainforest platform.

## Features

- User authentication (Login/Register)
- Module creation and management
- Interactive and responsive user interface
- Accessibility and eco-design audits integrated

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting**: [ESLint](https://eslint.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [npm](https://www.npmjs.com/) (v10.x or higher)

### Installation

1.  Navigate to the frontend directory:
    ```sh
    cd brainforest/leaves
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the `leaves` directory and add the necessary environment variables.

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

### Running the Development Server

To start the local development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the TypeScript and builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs unit and integration tests using Vitest.
- `npm run audit:a11y`: Runs automated accessibility checks.
- `npm run audit:eco`: Runs an eco-design audit using Sitespeed.io.
- `npm run preview`: Serves the production build locally for previewing.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. The tests are located in the `src/test` directory.

To run all tests:
```sh
npm test
```

## Contributing

Contributions are welcome! Please read our `CONTRIBUTING.md` file for details on our code of conduct and the process for submitting pull requests.


