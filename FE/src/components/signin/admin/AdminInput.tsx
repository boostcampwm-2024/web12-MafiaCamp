import { AuthAdmin } from '@/types/authAdmin';
import { HTMLInputTypeAttribute } from 'react';
import { FieldError, UseFormReturn } from 'react-hook-form';

interface AdminInputProps {
  methods: UseFormReturn<AuthAdmin>;
  inputId: 'email' | 'nickname' | 'password' | 'oAuthId';
  inputType: HTMLInputTypeAttribute;
  placeholder: string;
  maxLength: number;
  fieldError?: FieldError;
}

const AdminInput = ({
  methods,
  inputId,
  inputType,
  placeholder,
  maxLength,
  fieldError,
}: AdminInputProps) => {
  return (
    <div className='relative w-full'>
      <input
        className={[
          `${fieldError ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'}`,
          'w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm outline-none ring-1',
        ].join(' ')}
        id={inputId}
        type={inputType}
        placeholder={placeholder}
        {...methods.register(inputId)}
        maxLength={maxLength}
        autoComplete='off'
        onChange={(e) => {
          methods.setValue(inputId, e.target.value);
          methods.trigger(inputId);
        }}
      />
      {fieldError && (
        <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
          {fieldError.message as string}
        </p>
      )}
    </div>
  );
};

export default AdminInput;
