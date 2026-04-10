import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}
export function Modal({ title, onClose, children, width = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full ${width} mx-4 rounded-2xl border shadow-2xl shadow-black/70 animate-slide-up`}
        style={{ background: "#18181b", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.06] rounded-lg transition-all"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
