import { motion } from 'framer-motion';
import { ReactNode, RefObject } from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  rows?: number;
  inputRef?: RefObject<HTMLInputElement>;
}

const FormField = ({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  error,
  disabled,
  type = 'text',
  placeholder,
  rows = 5,
  inputRef,
}: FormFieldProps) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const inputProps = type === 'textarea' ? { rows } : { type };

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-gray-300 font-medium mb-2 text-sm"
      >
        {icon}
        {label}
      </label>
      <InputComponent
        ref={inputRef as any}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          type === 'textarea' ? 'resize-none' : ''
        } ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
        }`}
        {...inputProps}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;

