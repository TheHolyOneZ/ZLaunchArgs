import { Terminal } from "lucide-react";
import { useLaunch } from "../../hooks/useLaunch";
import type { AppEntry, ArgProfile } from "../../types";
interface LaunchPreviewProps {
  app: AppEntry;
  profile: ArgProfile;
}
export function LaunchPreview({ app, profile }: LaunchPreviewProps) {
  const { buildArgs } = useLaunch();
  const args = buildArgs(profile);
  const exeName = app.executablePath.split(/[\\/]/).pop() ?? app.name;
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(255,255,255,0.07)", background: "#0a0a0c" }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <Terminal size={10} className="text-zinc-700 ml-1" />
        <span className="text-[10px] text-zinc-700 font-mono">command preview</span>
      </div>
      <div className="px-3 py-3 font-mono text-xs leading-relaxed break-all min-h-[52px]">
        <span className="text-zinc-500 select-none">$ </span>
        <span className="text-zinc-100 font-medium">{exeName}</span>
        {args.length > 0 ? (
          args.map((arg, i) => (
            <span key={i}>
              {" "}
              <span
                className={
                  arg.startsWith("--") ? "text-blue-400" :
                  arg.startsWith("-") || arg.startsWith("/") ? "text-cyan-400" :
                  "text-emerald-400"
                }
              >
                {arg}
              </span>
            </span>
          ))
        ) : (
          <span className="text-zinc-700"> — no arguments enabled</span>
        )}
        <span className="cursor-blink text-zinc-600 ml-0.5">▋</span>
      </div>
    </div>
  );
}
