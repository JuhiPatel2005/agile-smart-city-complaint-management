import { FileSearch } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  description = "There is currently no information to display.",
  action,
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <FileSearch size={22} />
        </div>

        <h3 className="mt-5 text-sm font-bold text-slate-800">{title}</h3>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;