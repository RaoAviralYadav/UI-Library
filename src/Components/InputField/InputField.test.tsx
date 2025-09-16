
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputField';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('InputField (Form Component)', () => {
  // -- Basic Rendering --
  it('renders the label and helper text correctly', () => {
    render(<InputField label="Test Label" helperText="Some help" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Some help')).toBeInTheDocument();
  });

  it('renders all form inputs: fullname, username, password, and checkbox', () => {
    render(<InputField />);
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username (e.g. johndoe)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'I am human (prevent bots)' })).toBeInTheDocument();
  });
  
  it('renders an error message when invalid', () => {
    render(<InputField errorMessage="This is an error" invalid />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
    // The fullname input should have aria-invalid
    expect(screen.getByPlaceholderText('Full name')).toHaveAttribute('aria-invalid', 'true');
  });
  
  it('initializes the full name input with the value prop', () => {
    render(<InputField value="Initial Name" />);
    expect(screen.getByPlaceholderText('Full name')).toHaveValue('Initial Name');
  });

  // -- User Interactions --
  it('allows typing in all text fields', async () => {
    const user = userEvent.setup();
    render(<InputField />);

    const fullnameInput = screen.getByPlaceholderText('Full name');
    const usernameInput = screen.getByPlaceholderText('Username (e.g. johndoe)');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(fullnameInput, 'John Doe');
    await user.type(usernameInput, 'johndoe123');
    await user.type(passwordInput, 'password123');

    expect(fullnameInput).toHaveValue('John Doe');
    expect(usernameInput).toHaveValue('johndoe123');
    expect(passwordInput).toHaveValue('password123');
  });
  
  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<InputField />);
    const passwordInput = screen.getByPlaceholderText('Password');
    const showButton = screen.getByRole('button', { name: 'Show password' });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(showButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    await user.click(showButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('clears the fullname input when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<InputField value="Initial Value" onClear={onClear} />);
    const fullnameInput = screen.getByPlaceholderText('Full name');
    expect(fullnameInput).toHaveValue('Initial Value');
    
    const clearButton = screen.getByRole('button', { name: 'Clear full name' });
    await user.click(clearButton);

    expect(fullnameInput).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('enables submit button only when "I am human" is checked', async () => {
    const user = userEvent.setup();
    render(<InputField />);
    const humanCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    expect(submitButton).toBeDisabled();
    
    await user.click(humanCheckbox);
    expect(submitButton).not.toBeDisabled();
    
    await user.click(humanCheckbox);
    expect(submitButton).toBeDisabled();
  });
  
  it('resets all fields when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<InputField />);
    
    // Populate fields
    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Username (e.g. johndoe)'), 'johndoe');
    await user.type(screen.getByPlaceholderText('Password'), 'password');
    await user.click(screen.getByRole('checkbox'));
    
    // Verify fields are populated
    expect(screen.getByPlaceholderText('Full name')).toHaveValue('John Doe');
    expect(screen.getByRole('checkbox')).toBeChecked();
    
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    await user.click(resetButton);
    
    // Verify fields are cleared
    expect(screen.getByPlaceholderText('Full name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Username (e.g. johndoe)')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  // -- Props and States --
  it('disables all interactive elements when disabled prop is true', () => {
    render(<InputField disabled />);
    
    expect(screen.getByPlaceholderText('Full name')).toBeDisabled();
    expect(screen.getByPlaceholderText('Username (e.g. johndoe)')).toBeDisabled();
    expect(screen.getByPlaceholderText('Password')).toBeDisabled();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
  
  it('disables elements and shows loading state on submit button when loading prop is true', () => {
    render(<InputField loading />);
    
    expect(screen.getByPlaceholderText('Full name')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Submitting.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submitting.../i })).toBeDisabled();
  });

  it('updates the fullname input when the value prop changes', () => {
    const { rerender } = render(<InputField value="First" />);
    expect(screen.getByPlaceholderText('Full name')).toHaveValue('First');
    
    rerender(<InputField value="Second" />);
    expect(screen.getByPlaceholderText('Full name')).toHaveValue('Second');
  });
});