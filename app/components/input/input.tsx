interface InputProps {
  label?: string;
  placeholder?: string;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
}

export default function Input({
  label,
  placeholder,
  prefix,
  suffix,
  type = "text",
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-base font-semibold text-gray-400">{label}</label>
      <div className="flex justify-between items-center gap-2 rounded-lg bg-gray-50 px-6 py-3">
        <div className="flex items-center gap-2 w-full">
          {prefix && (
            <span className="body-md font-bold text-brand-primary whitespace-nowrap">
              {prefix}
            </span>
          )}
          <input
            className="w-full h-10 rounded-md outline-0 text-base text-gray-400 placeholder:text-gray-300"
            placeholder={placeholder}
            type={type}
            inputMode={type === "number" ? "numeric" : undefined}
          />
        </div>
        {suffix && (
          <span className="body-md font-bold text-gray-400 whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
