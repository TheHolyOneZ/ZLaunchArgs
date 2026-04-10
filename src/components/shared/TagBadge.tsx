import { X } from "lucide-react";
import type { Tag } from "../../types";
interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  small?: boolean;
}
export function TagBadge({ tag, onRemove, small = false }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all ${
        small ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-[10px]"
      }`}
      style={{
        backgroundColor: tag.color + "18",
        color: tag.color,
        border: `1px solid ${tag.color}35`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tag.color }} />
      {tag.name}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity ml-0.5">
          <X size={9} />
        </button>
      )}
    </span>
  );
}
