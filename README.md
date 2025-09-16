# Project Title: Advanced Component Library

A curated collection of robust, reusable, and well-tested React components, built with Next.js, TypeScript, and Tailwind CSS. This library is developed and documented using Storybook for a superior developer experience.

**[➡️ View Live Demo](https://ui-library-sepia-seven.vercel.app/)**

-----

## Table of Contents

- [About The Project](#about-the-project)
- [Component Documentation](#component-documentation)
  - [DataTable](#datatable)
  - [InputField Form](#inputfield-form)
- [My Approach](#my-approach)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Showcase (Gifs & Screenshots)](#showcase)

-----

## About The Project

This project provides a set of high-quality, production-ready React components designed for modern web applications. Each component is built with a focus on functionality, customizability, and accessibility. The entire library is developed in a Storybook environment, allowing for isolated development, testing, and documentation.

-----

## Component Documentation

Here's a detailed look at the components available in this library.

### DataTable

A powerful and flexible table component for displaying datasets with built-in support for sorting, selection, and pagination.

#### ✨ Features:

  * **Sorting**: Click on the header of any `sortable` column to sort the data in ascending or descending order.
  * **Row Selection**: Supports both `single` and `multiple` row selection via radio buttons or checkboxes. The `onRowSelect` callback provides the currently selected rows.
  * **Pagination**: Automatically paginates large datasets, with simple "Next" and "Previous" controls to navigate. The number of items per page is customizable.
  * **Custom Rendering**: Use the `render` function in the column definition to render custom JSX, such as badges, links, or images, for any cell.
  * **Loading & Empty States**: Displays an elegant skeleton loader while data is being fetched and shows a clean, informative message when the dataset is empty.

#### 🚀 Usage:

To use the `DataTable`, you need to provide `data` (an array of objects, where each object has a unique `id`) and `columns` (an array defining the table structure).

```tsx
import { DataTable, type Column } from './components/DataTable';

// 1. Define your data type
type User = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
};

// 2. Define your columns
const columns: Column<User>[] = [
  {
    key: 'name',
    title: 'User Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (status) => (
      <span className={status === 'active' ? 'active-badge' : 'inactive-badge'}>
        {status}
      </span>
    ),
  },
];

// 3. Provide your data
const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];


// 4. Render the component
<DataTable
  data={data}
  columns={columns}
  selectable
  selectionMode="multiple"
  onRowSelect={(selected) => console.log(selected)}
  itemsPerPage={5}
/>
```

-----

### InputField Form

This is not just an input field but a complete, self-contained form component perfect for registration or profile updates. It internally manages the state for multiple fields.

#### ✨ Features:

  * **Multi-Field Structure**: Includes fields for Full Name, Username, and Password, providing a ready-to-use form out of the box.
  * **Password Visibility Toggle**: A clickable eye icon allows users to show or hide their password entry.
  * **Clearable Input**: The "Full Name" field shows a clear button when it contains text, allowing for quick resets.
  * **Bot Prevention**: A simple "I am human" checkbox must be checked to enable the submit button.
  * **State Management**: Handles `disabled` and `loading` states gracefully, disabling all interactive elements and showing a spinner on the submit button.
  * **Validation Display**: Can visually indicate an error state and display a helpful `errorMessage`.

#### 🚀 Usage:

The component is straightforward to use. You can control its primary value (`fullname`) and overall state via props.

```tsx
import { InputField } from './components/InputField';

// Basic usage
<InputField
  label="Create Your Account"
  helperText="Fill in the details below to get started."
/>

// With an initial value and error state
<InputField
  label="Edit Profile"
  value="Jane Doe"
  invalid
  errorMessage="This name is already taken."
/>

// In a loading state during submission
<InputField
  label="Submitting..."
  loading
/>
```

-----

## My Approach

  * **Clear Folder Structure**: Components are organized into their own folders, each containing the component logic (`.tsx`), tests (`.test.tsx`), and stories (`.stories.tsx`). This co-location makes the codebase easy to navigate and maintain.

  * **Component-Driven Development**: I used **Storybook** to build and test components in isolation. This approach allows for a faster development cycle, easier debugging, and automatic visual documentation.

  * **Type-Safety First**: **TypeScript** is used throughout the project to enforce type safety, reduce runtime errors, and improve code completion and readability. Generic types are used in the `DataTable` to make it adaptable to any data structure.

  * **Utility-First Styling**: **Tailwind CSS** provides a highly efficient way to style components without writing custom CSS. For managing component variants (e.g., button sizes, input styles), I used `class-variance-authority` to keep style logic clean and co-located with the component.

-----

## Tech Stack

  * **[React](https://reactjs.org/)**: A powerful framework for building server-rendered and static web applications.
  * **[TypeScript](https://www.typescriptlang.org/)**: Provides static typing to enhance code quality and developer experience.
  * **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
  * **[Storybook](https://storybook.js.org/)**: A tool for building, testing, and documenting UI components in isolation.
  * **[Vitest](https://vitest.dev/)**: A blazing-fast unit test framework used for testing component logic and interactions.
  * **[Testing Library](https://testing-library.com/)**: A library for writing user-centric tests that simulate real interactions.

-----

## Folder Structure

The project follows a clean and intuitive folder structure.

```
/
├── src/
│   ├── components/
│   │   ├── DataTable/
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.stories.tsx
│   │   │   └── DataTable.test.tsx
│   │   └── InputField/
│   │       ├── InputField.tsx
│   │       ├── InputField.stories.tsx
│   │       └── InputField.test.tsx
│   └── libs/
│       └── utils.ts         # (e.g., for cn utility)
├── .storybook/              # Storybook configuration
├── public/                  # Static assets
└── package.json
```

-----

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

  * Node.js (v18 or later)
  * npm or yarn

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/RaoAviralYadav/UI-Library.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd UI-Library
    ```
3.  Install dependencies:
    ```sh
    npm install
    ```

-----

## Available Scripts

In the project directory, you can run:

  * `npm run dev`
    Runs the app in development mode. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view it in the browser.

  * `npm run storybook`
    Starts the Storybook development server. Open [http://localhost:6006](https://www.google.com/search?q=http://localhost:6006) to view your components and stories.

  * `npm run test`
    Launches the test runner in watch mode.

  * `npm run build`
    Builds the app for production.

-----

## Showcase



**DataTable with Sorting and Selection**
![Default](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20Default.gif)

![Multi](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20Multi.gif)

![Single](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20single%20select.png)

![Pagination](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20Pagnination.gif)

![Load](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20Load.gif)

![Not found](https://github.com/RaoAviralYadav/UI-Library/blob/964041b3a4b9bca2597b99c132d7971f5f4f8471/public/DT%20Not%20Found.png)

![Image Alt](https://github.com/RaoAviralYadav/UI-Library/blob/228c48b12de0cd33003d0368843051f18696c7e2/public/DT%20Custom%20Not%20Found.png)

**InputField Form in Different States (Error, Loading)**
![Default](https://github.com/RaoAviralYadav/UI-Library/blob/84f0d2d7daee71dc6cf2d31a07030c20f1c0ea21/public/IF%20Default.gif)

![Pre](https://github.com/RaoAviralYadav/UI-Library/blob/84f0d2d7daee71dc6cf2d31a07030c20f1c0ea21/public/IF%20Pre.png)

![Disabled](https://github.com/RaoAviralYadav/UI-Library/blob/84f0d2d7daee71dc6cf2d31a07030c20f1c0ea21/public/IF%20Disabled.gif)

![Red](https://github.com/RaoAviralYadav/UI-Library/blob/84f0d2d7daee71dc6cf2d31a07030c20f1c0ea21/public/IF%20Red.png)

![Ghost](https://github.com/RaoAviralYadav/UI-Library/blob/84f0d2d7daee71dc6cf2d31a07030c20f1c0ea21/public/IF%20Ghost.gif)


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
