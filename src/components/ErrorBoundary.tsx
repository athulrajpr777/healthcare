import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let displayMsg = error?.message || 'An unexpected application error occurred.';
    try {
      const parsed = JSON.parse(displayMsg);
      if (parsed?.error) {
        displayMsg = `Database sync error (${parsed.operationType || 'operation'}): ${parsed.error}`;
      }
    } catch {
      // Plain error message
    }
    return { hasError: true, message: displayMsg };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#FAFBF9] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-rose-200 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-[#1C2E1E]">
              Something interrupted GlycoLens
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed break-words">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-2xl bg-[#1C2E1E] hover:bg-[#2a452d] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
