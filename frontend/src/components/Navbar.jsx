import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getUserData,
  isUserAuthenticated,
  subscribeToUserAuth,
  userLogout,
} from "../utils/userAuth";

function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() =>
    isUserAuthenticated() ? getUserData() : null
  );

  useEffect(() => {
    return subscribeToUserAuth(() => {
      setUser(isUserAuthenticated() ? getUserData() : null);
    });
  }, []);

  const isCitizen = Boolean(user);

  const navItems = isCitizen
    ? [
        {
          label: "Home",
          path: "/",
        },
        {
          label: "Dashboard",
          path: "/dashboard",
        },
        {
          label: "Report Issue",
          path: "/report",
        },
        {
          label: "Track Complaint",
          path: "/track",
        },
        {
          label: "About",
          path: "/about",
        },
      ]
    : [
        {
          label: "Home",
          path: "/",
        },
        {
          label: "Track Complaint",
          path: "/track",
        },
        {
          label: "About",
          path: "/about",
        },
      ];

  const handleLogout = () => {
    userLogout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">


        {/* Brand */}

        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm shadow-blue-600/20">
            CI
          </div>


          <div className="hidden sm:block">

            <div className="font-[family-name:var(--font-display)] text-[17px] font-extrabold tracking-tight text-slate-900">
              Civic<span className="text-blue-600">Track</span>
            </div>

            <div className="text-[9px] font-medium tracking-wide text-slate-400">
              SMART CITY COMPLAINT PORTAL
            </div>

          </div>

        </Link>


        {/* Desktop navigation */}

        <nav className="hidden items-center gap-7 lg:flex">

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-950"
                }`
              }
            >
              {item.label}
            </NavLink>

          ))}

        </nav>


        {/* Desktop actions */}

        {isCitizen ? (

          <div className="hidden items-center gap-3 lg:flex">

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">

              <UserRound size={15} className="shrink-0 text-blue-600" />

              <span className="max-w-[150px] truncate text-[13px] font-bold text-slate-700">
                {user?.name || "Citizen"}
              </span>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={15} />
              Logout
            </button>

          </div>

        ) : (

          <div className="hidden items-center gap-2 lg:flex">

            <Link
              to="/login/citizen"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <UserRound size={15} className="text-blue-600" />
              Citizen Login
            </Link>


            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <ShieldCheck size={15} className="text-slate-400" />
              Admin Login
            </Link>


            <Link
              to="/report"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
            >

              Report an Issue

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />

            </Link>

          </div>

        )}


        {/* Mobile menu button */}

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
        >

          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}

        </button>

      </div>


      {/* Mobile navigation */}

      {mobileOpen && (

        <div className="border-t border-slate-200 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-5 py-4">

            {isCitizen && (

              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <UserRound size={17} />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-bold text-slate-900">
                    {user?.name || "Citizen"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email || "Signed in"}
                  </p>

                </div>

              </div>

            )}

            <nav className="flex flex-col gap-1">

              {navItems.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>

              ))}


              {isCitizen ? (

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              ) : (

                <>

                  <Link
                    to="/report"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Report an Issue
                    <ArrowRight size={16} />
                  </Link>


                  <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">

                    <Link
                      to="/login/citizen"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                    >
                      <UserRound size={16} className="text-blue-600" />
                      Citizen Login
                    </Link>


                    <Link
                      to="/admin/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                    >
                      <ShieldCheck size={16} className="text-slate-400" />
                      Admin Login
                    </Link>

                  </div>

                </>

              )}

            </nav>

          </div>

        </div>

      )}

    </header>
  );
}

export default Navbar;