import React from "react";
import { Toaster, toast } from "react-hot-toast";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary Caught:", error, info);
    toast.error("Something went wrong. Please refresh the page.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
          <h1 className="text-2xl font-semibold text-gray-700">App crashed</h1>
          <p className="text-gray-500 mt-2">
            Please refresh or go back to the home page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-black text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <>
        <Toaster />
        {this.props.children}
      </>
    );
  }
}

export default GlobalErrorBoundary;
