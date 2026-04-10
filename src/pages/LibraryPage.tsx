import { Sidebar } from "../components/layout/Sidebar";
import { CenterPanel } from "../components/layout/CenterPanel";
import { RightPanel } from "../components/layout/RightPanel";
export function LibraryPage() {
  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      <Sidebar />
      <CenterPanel />
      <RightPanel />
    </div>
  );
}
