import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "Enter your password",
      required = true,
      className = "",
      name,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div
        className={`flex items-center border border-gray-700 rounded bg-bg-block ${className}`}
      >
        <input
          ref={ref}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          className="flex-1 focus:outline-none rounded-l"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;