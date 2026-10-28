import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  description = "We could not load the requested information. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertCircle size={22} />
        </div>

        <h3 className="mt-5 text-sm font-bold text-slate-800">{title}</h3>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;