import { useEffect, useRef, useState } from "react";

type SingleSelectProps = {
  options: any[];
  valueKey: string;
  labelKey: string;
  selected: number | null;
  setSelected: (val: number | null) => void;
  multiple?: false;
  placeholder?: string;
  className?: string;
  error?: string; // ново
};

type MultiSelectProps = {
  options: any[];
  valueKey: string;
  labelKey: string;
  selected: number[];
  setSelected: (val: number[]) => void;
  multiple: true;
  placeholder?: string;
  className?: string;
  error?: string; // ново
};

type DropdownSelectProps = SingleSelectProps | MultiSelectProps;

export default function DropdownSelect(props: DropdownSelectProps) {
  const {
    options,
    valueKey,
    labelKey,
    selected,
    setSelected,
    placeholder = "Select...",
    className = "",
    error,
  } = props;

  const multiple = props.multiple === true;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOption = (id: number) => {
    if (multiple) {
        const arr = selected as number[];
        const setMulti = setSelected as (val: number[]) => void;
        setMulti(arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]);
    } else {
      const setSingle = setSelected as (val: number | null) => void;
      setSingle(id === selected ? null : id);
      setOpen(false);
    }
  };

  const renderLabel = () => {
    if (multiple) {
      const arr = selected as number[];
      if (arr.length === 0) return placeholder;
      return options
        .filter((o) => arr.includes(o[valueKey]))
        .map((o) => o[labelKey])
        .join(", ");
    }
    const opt = options.find((o) => o[valueKey] === selected);
    return opt ? opt[labelKey] : placeholder;
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full border p-3 rounded flex justify-between items-center ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
      >
        <span className="truncate">{renderLabel()}</span>
        <span
          className={`
            h-4 w-4 flex items-center justify-center
            transition-transform duration-200
            ${open ? "rotate-180 text-sky-600" : "text-gray-400"}
        `}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-auto">
          {options.map((opt) => (
            <label
              key={opt[valueKey]}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                checked={
                  multiple
                    ? (selected as number[]).includes(opt[valueKey])
                    : selected === opt[valueKey]
                }
                onChange={() => toggleOption(opt[valueKey])}
              />
              <span>{opt[labelKey]}</span>
            </label>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
