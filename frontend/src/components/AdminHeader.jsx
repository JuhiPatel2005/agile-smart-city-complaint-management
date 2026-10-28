import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/admin/dashboard": "Dashboard",
  "/admin/complaints": "Complaints",
  "/admin/departments": "Departments",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

function AdminHeader({ onMenuClick }) {
  const location = useLocation();

  const getPageName = () => {
    if (location.pathname.includes("/admin/complaints/")) {
      return "Complaint Details";
    }

    return pageNames[location.pathname] || "Administration";
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">
            CivicTrack Administration
          </p>

          <h1 className="mt-0.5 truncate font-display text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
            {getPageName()}
          </h1>
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search complaints..."
            className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-56"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-800">
              Administrator
            </p>

            <p className="text-xs text-slate-400">
              CivicTrack Admin
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;