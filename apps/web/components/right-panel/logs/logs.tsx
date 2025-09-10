import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw, CheckCircle, Clock } from "lucide-react";

interface LogsTabProps {
  compilationError: string | null;
  isPending: boolean;
  onRetry: () => Promise<void>;
  onClearErrors?: () => void;
  compilationAttempts?: number;
  maxCompilationAttempts?: number;
}

function LogsTab({
  compilationError,
  isPending,
  onRetry,
  onClearErrors,
  compilationAttempts = 0,
  maxCompilationAttempts = 3,
}: LogsTabProps) {
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <CardTitle>Compilation in Progress</CardTitle>
            <CardDescription>
              Please wait while we compile your LaTeX document...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Compiling...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (compilationError) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-red-600">Compilation Failed</CardTitle>
            <CardDescription>
              There was an error compiling your LaTeX document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-mono break-words">
                {compilationError}
              </p>
              {compilationAttempts > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Attempt {compilationAttempts} of {maxCompilationAttempts}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                onClick={onRetry}
                className="flex items-center gap-2"
                variant="outline"
                disabled={compilationAttempts >= maxCompilationAttempts}
              >
                <RefreshCw className="w-4 h-4" />
                {compilationAttempts >= maxCompilationAttempts
                  ? "Max Attempts Reached"
                  : "Try Again"}
              </Button>
              {onClearErrors && (
                <Button
                  onClick={onClearErrors}
                  className="flex items-center gap-2"
                  variant="ghost"
                >
                  Clear Errors
                </Button>
              )}
            </div>
            {compilationAttempts >= maxCompilationAttempts && (
              <div className="text-center text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                <p>
                  Maximum compilation attempts reached. Please check your LaTeX
                  syntax and try again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // No errors and not compiling - show success state or empty state
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-green-600">
            No Compilation Errors
          </CardTitle>
          <CardDescription>
            Your LaTeX document compiled successfully or hasn't been compiled
            yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Use the Compile button to generate your PDF, or check the LaTeX tab
            to edit your content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LogsTab;
