import React, { useState } from "react";

interface IProps {
  label?: string;
  options: { label: string; value: any }[];
  onChange?: (e: any) => void;
}

export default function RadioBtn(Props: IProps) {
  const { label, options, onChange } = Props;
  const [isActive, setIsActive] = useState(0);
  return (
    <div>
      {label && <label className="text-sm font-bold block">{label}</label>}

      <div className="relative flex w-full bg-gray-300 border-2 p-1 rounded-full">
        <div
          className="absolute top-0 bottom-0 left-0 bg-slate-800 rounded-full transition-all duration-300"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${
              ((options.length * 100) / options.length) * isActive
            }%)`,
          }}
        />

        {options?.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setIsActive(index);
              onChange && onChange(option.value);
            }}
            className={`relative p-1 w-full text-center transition-all duration-300
              ${index === 0 ? "rounded-l-full" : ""}
              ${index === options.length - 1 ? "rounded-r-full" : ""}
              ${isActive === index ? "text-white" : "text-black"}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
