import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

function Footer() {

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">


      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">


          {/* Brand */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold">
                CI
              </div>

              <div>

                <div className="font-[family-name:var(--font-display)] text-lg font-extrabold">
                  Civic<span className="text-blue-400">Track</span>
                </div>

                <div className="text-[9px] font-medium tracking-wider text-slate-500">
                  SMART CITY COMPLAINT PORTAL
                </div>

              </div>

            </div>


                <p className="max-w-md text-sm leading-7 text-slate-400">
                  A civic complaint portal that helps citizens report problems
                  and helps departments resolve them faster.
                </p>


            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400">

              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />

              Smart complaint routing

            </div>

          </div>


          {/* Platform */}

          <div>

            <h3 className="mb-5 text-sm font-bold text-white">
              Platform
            </h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">

              <Link
                to="/"
                className="transition-colors hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/report"
                className="transition-colors hover:text-white"
              >
                Report an Issue
              </Link>

              <Link
                to="/track"
                className="transition-colors hover:text-white"
              >
                Track Complaint
              </Link>

              <Link
                to="/about"
                className="transition-colors hover:text-white"
              >
                About
              </Link>

            </div>

          </div>


          {/* System */}

          <div>

            <h3 className="mb-5 text-sm font-bold text-white">
              System
            </h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">

              <Link
                to="/admin/login"
                className="group inline-flex items-center gap-1 transition-colors hover:text-white"
              >
                Administration

                <ArrowUpRight
                  size={13}
                  className="opacity-60"
                />

              </Link>

              <span>
                Smart complaint routing
              </span>

              <span>
                Civic issue management
              </span>

            </div>

          </div>

        </div>


        {/* Bottom */}

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <span>
            © 2026 CivicTrack. Minor Project.
          </span>

          <span>
            Smart City Complaint Portal
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;