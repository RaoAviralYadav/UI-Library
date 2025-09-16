import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable, type Column } from './DataTable';
import React from 'react';

const meta: Meta<typeof DataTable<Person>> = {
  title: 'Components/DataTable',
  component: DataTable as React.ComponentType<import('./DataTable').DataTableProps<Person>>,
  argTypes: {
    onRowSelect: { action: 'onRowSelect' },
    selectionMode: {
      control: 'radio',
      options: ['single', 'multiple'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<Person>>;

// --- Mock Data and Columns ---

type Person = {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  signupDate: string;
};

const mockData: Person[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, status: 'active', signupDate: '2023-01-15' },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25, status: 'inactive', signupDate: '2023-02-20' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, status: 'pending', signupDate: '2022-12-10' },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 28, status: 'active', signupDate: '2023-03-05' },
  { id: 5, name: 'Ethan', email: 'ethan@example.com', age: 40, status: 'active', signupDate: '2021-11-30' },
  { id: 6, name: 'Fiona', email: 'fiona@example.com', age: 22, status: 'inactive', signupDate: '2023-05-01' },
];

const mockColumns: Column<Person>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'age',
    title: 'Age',
    dataIndex: 'age',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (status) => {
      const colorMap = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status as Person['status']]}`}>
          {status}
        </span>
      );
    },
  },
  {
    key: 'signupDate',
    title: 'Sign-up Date',
    dataIndex: 'signupDate',
    sortable: true,
    render: (date) => new Date(date as string).toLocaleDateString(),
  }
];


// --- Stories ---

export const Default: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
  },
  render: (args) => (
    <div>
      <h3 className="text-lg font-bold mb-2">Default Data Table</h3>
      <p className="text-sm text-gray-600 mb-4">Features sortable columns. Click on headers like "Name" or "Age" to see it in action.</p>
      <DataTable {...args} />
    </div>
  ),
};

export const MultiSelect: Story = {
    args: {
      ...Default.args,
      selectable: true,
      selectionMode: 'multiple',
    },
    render: (args) => (
      <div>
        <h3 className="text-lg font-bold mb-2">Multi-Select</h3>
        <p className="text-sm text-gray-600 mb-4">Use the checkboxes to select multiple rows. Check the "Actions" tab below to see the `onRowSelect` callback.</p>
        <DataTable {...args} />
      </div>
    ),
};

export const SingleSelect: Story = {
    args: {
      ...Default.args,
      selectable: true,
      selectionMode: 'single',
    },
    render: (args) => (
      <div>
        <h3 className="text-lg font-bold mb-2">Single-Select</h3>
        <p className="text-sm text-gray-600 mb-4">Use the radio buttons to select a single row.</p>
        <DataTable {...args} />
      </div>
    ),
};

export const Paginated: Story = {
    args: {
        ...Default.args,
        itemsPerPage: 3,
    },
    render: (args) => (
      <div>
        <h3 className="text-lg font-bold mb-2">Paginated Table</h3>
        <p className="text-sm text-gray-600 mb-4">This table displays only 3 items per page. Use the "Previous" and "Next" buttons to navigate.</p>
        <DataTable {...args} />
      </div>
    ),
};

export const Loading: Story = {
  args: {
    columns: mockColumns,
    loading: true,
    data: [],
    selectable: true,
    itemsPerPage: 4,
  },
  render: (args) => (
    <div>
      <h3 className="text-lg font-bold mb-2">Loading State</h3>
      <p className="text-sm text-gray-600 mb-4">Displays a skeleton loader while data is being fetched.</p>
      <DataTable {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
  render: (args) => (
    <div>
      <h3 className="text-lg font-bold mb-2">Empty State</h3>
      <p className="text-sm text-gray-600 mb-4">This is the default message shown when no data is provided.</p>
      <DataTable {...args} />
    </div>
  ),
};

export const CustomEmptyState: Story = {
    args: {
      ...Empty.args,
      emptyState: (
        <div className="text-center p-8">
          <h4 className="text-lg font-semibold">No Users Found!</h4>
          <p className="text-gray-500 mt-2">Could not find any users matching your search query. <br/> Please try again with different criteria.</p>
          <button className="mt-4 px-4 py-2 bg-blue-700 text-gray-100 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-500">
            Clear Search
          </button>
        </div>
      )
    },
    render: (args) => (
      <div>
        <h3 className="text-lg font-bold mb-2">Custom Empty State</h3>
        <p className="text-sm text-gray-600 mb-4">You can pass any React node to the `emptyState` prop for a custom message.</p>
        <DataTable {...args} />
      </div>
    ),
  };