import type { ReactNode } from "react";
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
      <div className="text-zinc-600">{icon}</div>
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        {description && (
          <p className="text-xs text-zinc-600 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
