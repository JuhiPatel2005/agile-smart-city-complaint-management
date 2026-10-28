import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center">
        <div className="w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <SearchX size={30} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Error 404
          </p>

          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
            Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            The page you are looking for does not exist or may have been
            moved. Please return to a valid CivicTrack page.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={isAdminRoute ? "/admin/dashboard" : "/"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Home size={17} />
              {isAdminRoute ? "Admin Dashboard" : "Go Home"}
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>
          </div>

          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Requested path
            </p>

            <p className="mt-2 break-all rounded-xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-600">
              {location.pathname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;