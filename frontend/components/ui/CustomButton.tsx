interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const CustomButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'cursor-pointer font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 disabled:opacity-50',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600',
    ghost: 'text-purple-400 hover:text-purple-300 hover:bg-slate-800/50',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-2 text-lg',
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </button>
  );
};