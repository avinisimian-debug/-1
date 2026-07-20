"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const title = this.props.fallbackTitle ?? "Something went wrong";
    const message =
      this.props.fallbackMessage ??
      "An unexpected error occurred. Please try again.";
    const retry = this.props.retryLabel ?? "Try again";

    return (
      <div
        role="alert"
        className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center"
      >
        <div className="glass-card max-w-md p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-muted p-3 text-start text-xs text-destructive">
              {this.state.error.message}
            </pre>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={this.handleRetry}
          >
            <RefreshCw className="h-4 w-4" data-icon="inline-start" />
            {retry}
          </Button>
        </div>
      </div>
    );
  }
}
