import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../libs/utils';

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.453-5.118m1.914-1.172A9.982 9.982 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.986 9.986 0 01-1.263 3.633m-3.56-3.56a3 3 0 00-4.243-4.243m-2.122 2.122a3 3 0 004.242 4.242" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
  </svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const inputVariants = cva(
  'transition-transform transition-colors duration-200 ease-out w-full rounded-md focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        filled: 'bg-gray-100 border-transparent focus:ring-blue-500',
        outlined: 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        ghost: 'bg-transparent border-transparent hover:bg-gray-50',
      },
      inputSize: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
      },
      invalid: {
        true: 'border-red-500 focus:ring-red-500',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      inputSize: 'md',
      invalid: false,
    },
  }
);

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  loading?: boolean;
  onClear?: () => void;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      variant,
      inputSize,
      invalid,
      label,
      helperText,
      errorMessage,
      disabled,
      loading,
      value,
      onClear,
      ...props
    },
    ref
  ) => {
    const uid = React.useId();
    const fullnameId = `fullname-${uid}`;
    const usernameId = `username-${uid}`;
    const passwordId = `password-${uid}`;
    const humanId = `human-${uid}`;

    const [fullname, setFullname] = useState<string>(() => (typeof value === 'string' ? value : ''));
    useEffect(() => {
      if (typeof value === 'string') setFullname(value);
    }, [value]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isHuman, setIsHuman] = useState(false);

    const hasError = !!invalid || !!errorMessage;
    const isDisabled = !!disabled || !!loading;

    const handleClearFullname = () => {
      setFullname('');
      if (onClear) onClear();
    };

    return (
      <div className={cn('w-full max-w-md p-4 rounded-2xl bg-white shadow-sm border border-gray-200', className)}>
        <div className="flex items-center justify-between mb-3">
          {label ? (
            <div>
              <label htmlFor={fullnameId} className="text-gray-700 font-semibold">{label}</label>
              {helperText && <div className="text-xs text-gray-500 mt-1">{helperText}</div>}
            </div>
          ) : <div />}
        </div>

        <div className="flex flex-col gap-2 mb-3 group">
          <div className="relative">
            <input
              id={fullnameId}
              ref={ref}
              name="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Full name"
              {...(hasError ? { 'aria-invalid': 'true' } : {})}
              disabled={isDisabled}
              className={cn(
                inputVariants({ variant, inputSize, invalid: hasError }),
                'hover:border-blue-500 hover:shadow-sm transform-gpu hover:-translate-y-0.5',
                'placeholder:text-gray-400',
                'pr-12'
              )}
              {...props}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
              {fullname && !isDisabled && (
                <button type="button" aria-label="Clear full name" onClick={handleClearFullname} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
              <div className="p-1">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <label htmlFor={usernameId} className="sr-only">Username</label>
          <input
            id={usernameId}
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (e.g. johndoe)"
            disabled={isDisabled}
            className={cn(
              inputVariants({ variant, inputSize, invalid: hasError }),
              'hover:border-blue-500 hover:shadow-sm transform-gpu hover:-translate-y-0.5',
              'placeholder:text-gray-400',
              'pr-3'
            )}
            aria-describedby={`${usernameId}-hint`}
          />
          <div id={`${usernameId}-hint`} className="text-xs text-gray-500">Use only letters, numbers, dot or underscore.</div>
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <div className="relative">
            <label htmlFor={passwordId} className="sr-only">Password</label>
            <input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isDisabled}
              className={cn(
                inputVariants({ variant, inputSize, invalid: hasError }),
                'pr-12',
                'hover:border-blue-500 hover:shadow-sm transform-gpu hover:-translate-y-0.5',
                'placeholder:text-gray-400'
              )}
              aria-describedby={`${passwordId}-hint`}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((s) => !s)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" disabled={isDisabled}>
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <div id={`${passwordId}-hint`} className="text-xs text-gray-500">Minimum 8 characters. Use a mix of letters and numbers.</div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id={humanId}
            name="areYouHuman"
            type="checkbox"
            checked={isHuman}
            onChange={(e) => setIsHuman(e.target.checked)}
            className={cn(
              'h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors',
              { 'opacity-50 cursor-not-allowed': isDisabled } as unknown as string
            )}
            disabled={isDisabled}
          />
          <label htmlFor={humanId} className="text-sm text-gray-700 select-none">I am human (prevent bots)</label>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            {isHuman ? 'Thanks — human verified' : 'Please confirm you are human'}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert(`Submitting:\nFullname: ${fullname}\nUsername: ${username}\nPassword: ${password ? '•••••••' : '(empty)'}\nHuman: ${isHuman}`)}
              disabled={!isHuman || loading}
              className={cn(
                'px-3 py-2 rounded-md text-white font-medium transition-transform',
                isHuman && !loading ? 'bg-blue-600 hover:scale-105 active:scale-100' : 'bg-gray-300 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFullname('');
                setUsername('');
                setPassword('');
                setIsHuman(false);
                if (onClear) onClear();
              }}
              className="px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-sm"
              disabled={isDisabled}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export { InputField };