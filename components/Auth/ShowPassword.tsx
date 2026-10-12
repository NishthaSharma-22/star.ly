"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type ShowPasswordProps = Omit<React.ComponentProps<"input">, "type">;

export function ShowPassword({ className, ...props }: ShowPasswordProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full border p-1 pr-10 focus:outline-none ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:cursor-pointer"
      >
        {visible ? <EyeOff size={20}/> : <Eye size={20}/>}
      </button>
    </div>
  );
}
