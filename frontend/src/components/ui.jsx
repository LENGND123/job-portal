import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fileUrl } from "../lib/api";

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "ok") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg ${toast.type === "error" ? "bg-red-600" : "bg-gray-900"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const buttonStyles = {
  primary: "bg-[#6A38C2] text-white hover:bg-[#5b30a6]",
  outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
  ghost: "text-gray-700 hover:bg-gray-100",
};

export function Button({ children, variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 ${className}`}
      {...props}
    />
  );
}

export function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6A38C2] ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
      {label}
      {children}
    </label>
  );
}

export function Dialog({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function LetterAvatar({ name = "", src, className = "h-12 w-12" }) {
  if (src) {
    return (
      <img
        src={fileUrl(src)}
        alt=""
        className={`${className} rounded-full border border-gray-200 bg-white object-cover`}
      />
    );
  }
  const letter = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span className={`${className} grid place-items-center rounded-full bg-[#6A38C2] font-semibold text-white`}>
      {letter}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="grid place-items-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6A38C2] border-t-transparent" />
    </div>
  );
}
