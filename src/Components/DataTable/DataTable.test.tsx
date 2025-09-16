import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import '@testing-library/jest-dom';
import type { Column } from './DataTable';
import { describe, it, expect, vi } from 'vitest';

// --- Mock Data and Types ---
type MockUser = {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
};

const mockColumns: Column<MockUser>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { 
    key: 'status', 
    title: 'Status', 
    dataIndex: 'status',
    render: (status) => <span data-testid={`status-${status}`}>{status}</span>
  },
];

const mockData: MockUser[] = [
  { id: 1, name: 'Alice', age: 30, status: 'active' },
  { id: 2, name: 'Bob', age: 25, status: 'inactive' },
  { id: 3, name: 'Charlie', age: 35, status: 'active' },
];

// --- Test Suite ---

describe('DataTable', () => {

  // -- Basic Rendering --
  it('renders the correct headers', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument();
  });

  it('renders the correct number of data rows', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('renders custom content using the render function', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    expect(screen.getByTestId('status-active')).toBeInTheDocument();
    expect(screen.getByTestId('status-inactive')).toBeInTheDocument();
  });

  // -- States --
  it('displays a default empty state message when no data is provided', () => {
    render(<DataTable columns={mockColumns} data={[]} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });
  
  it('displays a custom empty state when provided', () => {
    const customEmpty = <div>No items here.</div>;
    render(<DataTable columns={mockColumns} data={[]} emptyState={customEmpty} />);
    expect(screen.getByText('No items here.')).toBeInTheDocument();
    expect(screen.queryByText('No data available.')).not.toBeInTheDocument();
  });

  it('displays a skeleton loader when in the loading state', () => {
    render(<DataTable columns={mockColumns} data={[]} loading={true} />);
    // Check for the presence of animated pulse elements which indicate the skeleton
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.getAllByRole('generic', { name: '' })[0].querySelector('.animate-pulse')).toBeInTheDocument();
  });

  // -- Sorting --
  it('sorts data by a column when its header is clicked', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={mockColumns} data={mockData} />);
    
    const ageHeader = screen.getByRole('columnheader', { name: 'Age' });
    const rows = () => within(screen.getByRole('rowgroup')).getAllByRole('row');

    // Initial order should be Alice, Bob, Charlie
    let cells = within(rows()[0]).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Alice');

    // Click to sort by age (ascending) -> Bob (25), Alice (30), Charlie (35)
    await user.click(ageHeader);
    cells = within(rows()[0]).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Bob');
    
    // Click again to sort by age (descending) -> Charlie (35), Alice (30), Bob (25)
    await user.click(ageHeader);
    cells = within(rows()[0]).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Charlie');
  });

  // -- Selection --
  it('handles multi-row selection', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();
    render(<DataTable columns={mockColumns} data={mockData} selectable onRowSelect={onRowSelect} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const selectAllCheckbox = checkboxes[0];
    const row1Checkbox = checkboxes[1];
    const row2Checkbox = checkboxes[2];

    // Select row 1
    await user.click(row1Checkbox);
    expect(onRowSelect).toHaveBeenCalledWith([mockData[0]]);
    
    // Select row 2
    await user.click(row2Checkbox);
    expect(onRowSelect).toHaveBeenCalledWith([mockData[0], mockData[1]]);

    // Deselect row 1
    await user.click(row1Checkbox);
    expect(onRowSelect).toHaveBeenCalledWith([mockData[1]]);

    // Select all
    await user.click(selectAllCheckbox);
    expect(onRowSelect).toHaveBeenCalledWith(mockData);
    
    // Deselect all
    await user.click(selectAllCheckbox);
    expect(onRowSelect).toHaveBeenCalledWith([]);
  });

  it('handles single-row selection', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();
    render(<DataTable columns={mockColumns} data={mockData} selectable selectionMode="single" onRowSelect={onRowSelect} />);
    
    const radios = screen.getAllByRole('radio');
    const row1Radio = radios[0];
    const row2Radio = radios[1];
    
    // Select row 1
    await user.click(row1Radio);
    expect(onRowSelect).toHaveBeenCalledWith([mockData[0]]);
    expect(row1Radio).toBeChecked();
    expect(row2Radio).not.toBeChecked();

    // Select row 2
    await user.click(row2Radio);
    expect(onRowSelect).toHaveBeenCalledWith([mockData[1]]);
    expect(row1Radio).not.toBeChecked();
    expect(row2Radio).toBeChecked();
  });

  // -- Pagination --
  it('paginates data correctly', async () => {
    const user = userEvent.setup();
    const extendedData: MockUser[] = [
        ...mockData,
        { id: 4, name: 'Diana', age: 40, status: 'inactive' },
    ]; // 4 items total
    render(<DataTable columns={mockColumns} data={extendedData} itemsPerPage={2} />);

    // Page 1 should have Alice and Bob
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const prevButton = screen.getByRole('button', { name: 'Previous' });
    
    expect(prevButton).toBeDisabled();
    
    // Go to page 2
    await user.click(nextButton);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    // Go back to page 1
    await user.click(prevButton);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(prevButton).toBeDisabled();
  });
});