import { Component } from "react";

// Error Boundaries are the ONE case in React that still requires a
// class component — there is no hook equivalent in stable React.
// Without this, an unexpected error thrown anywhere during rendering
// would unmount the ENTIRE app to a blank white screen, with zero
// recovery path for the user.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // React calls this automatically when a descendant component
  // throws during rendering. Returning new state triggers a re-render
  // showing the fallback UI instead of the crashed subtree.
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // componentDidCatch is where we'd normally report to an error-
  // tracking service (Sentry, etc.) in a real production deployment.
  // For now, we at least log it clearly so it's visible in the
  // browser console during development and QA.
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-(--color-bg)">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-(--color-text-secondary) text-sm max-w-sm mb-6">
            An unexpected error occurred. Try reloading the page — if the
            problem continues, please come back later.
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 rounded-lg bg-(--color-accent) text-white font-medium hover:opacity-90 transition-opacity"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
