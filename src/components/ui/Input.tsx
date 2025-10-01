import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  variant?: "default" | "glass" | "outline";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      success,
      variant = "default",
      leftIcon,
      rightIcon,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || "");

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

    // Handle controlled/uncontrolled input
    const inputValue = value !== undefined ? value : internalValue;
    const hasValue = Boolean(inputValue && String(inputValue).length > 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const baseStyles = "relative w-full transition-all duration-300 group";

    const variants = {
      default:
        "bg-white border border-slate-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20",
      glass:
        "bg-white/10 backdrop-blur-md border border-white/20 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/20",
      outline:
        "bg-transparent border-2 border-slate-300 focus-within:border-green-500 focus-within:bg-green-50/50",
    };

    const labelBaseStyles =
      "absolute left-4 transition-all duration-300 pointer-events-none select-none";
    const labelVariants = {
      default:
        focused || hasValue
          ? "top-0 -translate-y-1/2 text-xs font-medium bg-white px-2 text-green-600"
          : "top-1/2 -translate-y-1/2 text-base text-slate-500",
      glass:
        focused || hasValue
          ? "top-0 -translate-y-1/2 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 rounded text-white"
          : "top-1/2 -translate-y-1/2 text-base text-white/70",
      outline:
        focused || hasValue
          ? "top-0 -translate-y-1/2 text-xs font-medium bg-white px-2 text-green-600"
          : "top-1/2 -translate-y-1/2 text-base text-slate-500",
    };

    return (
      <div className="space-y-2">
        <div className={cn(baseStyles)}>
          <div
            className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-300",
              variants[variant],
              error &&
                "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
              success &&
                "border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20",
              props.disabled && "opacity-50 cursor-not-allowed bg-slate-50",
              "hover:shadow-md focus-within:shadow-lg"
            )}
          >
            {/* Left Icon */}
            {leftIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                {leftIcon}
              </div>
            )}

            {/* Floating Label */}
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  labelBaseStyles,
                  labelVariants[variant],
                  leftIcon && "left-12",
                  error && focused && "text-red-600",
                  success && focused && "text-green-600"
                )}
              >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Input Field */}
            <input
              type={currentType}
              id={inputId}
              value={inputValue}
              className={cn(
                "w-full h-14 px-4 bg-transparent text-base placeholder-transparent transition-all duration-300",
                "focus:outline-none focus:placeholder-slate-400",
                "disabled:cursor-not-allowed disabled:bg-transparent",
                leftIcon && "pl-12",
                (rightIcon || isPasswordType || success || error) && "pr-12",
                label ? "pt-6 pb-2" : "py-4",
                variant === "glass" && "text-white placeholder-white/50",
                className
              )}
              ref={ref}
              onFocus={(e) => {
                setFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                props.onBlur?.(e);
              }}
              onChange={handleInputChange}
              {...props}
            />

            {/* Right Icons Container */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Success Icon */}
              {success && !error && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}

              {/* Error Icon */}
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}

              {/* Password Toggle */}
              {isPasswordType && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-200 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Custom Right Icon */}
              {rightIcon && !success && !error && !isPasswordType && (
                <div className="text-slate-400">{rightIcon}</div>
              )}
            </div>

            {/* Shimmer Effect on Focus */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
                focused && "opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            className={cn(
              "text-sm transition-colors duration-200",
              success ? "text-green-600" : "text-slate-600"
            )}
          >
            {helperText}
          </p>
        )}

        {/* Success Message */}
        {success && !error && helperText && (
          <div className="flex items-center gap-2 text-sm text-green-600 animate-in slide-in-from-top-1 duration-200">
            <CheckCircle className="w-4 h-4" />
            <p>{helperText}</p>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
