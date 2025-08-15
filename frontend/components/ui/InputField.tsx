import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>;
  type?: 'text' | 'password' | 'select' | 'number' | 'email';
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const InputField: React.FC<InputProps> = ({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  children,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
      )}
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          {...props as any}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm ${className}`}
        >
          {children}
        </select>
      ) : (
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm mr-4 ${className}`}
          {...props}
        />
      )}
      {type === 'password' && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};