import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
export function Toast() {
  const toast = useUiStore((s) => s.toast);
  const clearToast = useUiStore((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);
  if (!toast) return null;
  const config = {
    success: { icon: <CheckCircle size={14} />, color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    error: { icon: <XCircle size={14} />, color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
    info: { icon: <Info size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  }[toast.type];
  return (
    <div className="fixed bottom-8 right-5 z-50 animate-slide-up pointer-events-auto">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl shadow-black/50 min-w-64 max-w-xs"
        style={{ background: "#18181b", borderColor: config.border }}
      >
        <span style={{ color: config.color }} className="shrink-0">{config.icon}</span>
        <span className="text-sm text-zinc-300 flex-1 leading-snug">{toast.message}</span>
        <button
          onClick={clearToast}
          className="shrink-0 p-0.5 text-zinc-600 hover:text-zinc-400 rounded transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
