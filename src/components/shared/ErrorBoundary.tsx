import { Component, type ReactNode } from "react";
interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
  copied: boolean;
}
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, copied: false };
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error.message, "\n", error.stack);
  }
  copyError = () => {
    const { error } = this.state;
    if (!error) return;
    const text = `${error.message}\n\n${error.stack ?? ""}`;
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-zinc-100 p-8 gap-4">
          <div className="text-red-400 text-sm font-semibold">
            Render Error
          </div>
          <pre className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-w-2xl w-full overflow-auto whitespace-pre-wrap select-text cursor-text">
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <div className="flex gap-2">
            <button
              onClick={this.copyError}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition-colors"
            >
              {this.state.copied ? "Copied!" : "Copy Error"}
            </button>
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
