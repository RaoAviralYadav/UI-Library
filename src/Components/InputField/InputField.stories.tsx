
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputField } from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    onClear: { action: 'onClear' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: 'Create Account',
    helperText: 'Fill out all the fields to register.',
  },
};

export const WithInitialValue: Story = {
  args: {
    ...Default.args,
    label: 'Edit Profile',
    value: 'Jane Doe',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    invalid: true,
    errorMessage: 'The full name is required to proceed.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    label: 'Form Disabled',
    helperText: 'You cannot edit this form.',
    disabled: true,
    value: 'Read-only Name'
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    label: 'Submitting your data...',
    helperText: 'Please wait.',
    loading: true,
  },
};