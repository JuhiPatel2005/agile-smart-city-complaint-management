import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Info,
  Search,
  ShieldCheck,
} from "lucide-react";

function TrackComplaint() {
  const navigate = useNavigate();

  const [complaintId, setComplaintId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("complaintData");

    if (!storedData) {
      return;
    }

    try {
      const complaint = JSON.parse(storedData);

      if (complaint?.complaintId) {
        setComplaintId(complaint.complaintId);
      }
    } catch {
      sessionStorage.removeItem("complaintData");
    }
  }, []);

  const handleTrack = (event) => {
    event.preventDefault();

    const cleanedId = complaintId.trim();

    if (!cleanedId) {
      setError("Please enter a complaint ID.");
      return;
    }

    setError("");

    navigate(`/complaint/${encodeURIComponent(cleanedId)}`);
  };

  const handleRecentComplaint = () => {
    const storedData = sessionStorage.getItem("complaintData");

    if (!storedData) {
      setError("No recently submitted complaint was found.");
      return;
    }

    try {
      const complaint = JSON.parse(storedData);

      if (!complaint?.complaintId) {
        setError("No valid complaint ID was found.");
        return;
      }

      navigate(`/complaint/${encodeURIComponent(complaint.complaintId)}`);
    } catch {
      setError("Unable to read your recent complaint.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              <ClipboardList size={14} />
              Complaint tracking
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Track your complaint
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Enter your complaint ID to view its current status, assigned
              department, and complaint details.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search size={22} />
            </div>

            <h2 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Find your complaint
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the complaint ID you received after submitting your civic
              issue.
            </p>

            <form onSubmit={handleTrack} className="mt-8">
              <label
                htmlFor="complaintId"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Complaint ID
              </label>

              <input
                id="complaintId"
                type="text"
                value={complaintId}
                onChange={(event) => {
                  setComplaintId(event.target.value);
                  setError("");
                }}
                placeholder="Example: CIV-2026-10001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm text-slate-900 outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Track Complaint
                <ArrowRight size={17} />
              </button>
            </form>

            {sessionStorage.getItem("complaintData") && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleRecentComplaint}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  <CheckCircle2 size={16} />
                  View my recently submitted complaint
                </button>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Secure complaint tracking
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your complaint ID is used to find your complaint and show
                    its latest status.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <Clock3 size={21} />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold">
                Complaint progress
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your complaint moves through a defined workflow as it is
                reviewed and handled.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  "Submitted",
                  "Under Review",
                  "Assigned",
                  "In Progress",
                  "Resolved",
                ].map((status, index) => (
                  <div key={status} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-blue-300">
                      {index + 1}
                    </div>

                    <span className="text-sm text-slate-300">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Why use your complaint ID?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    It provides a unique reference for finding your complaint
                    and viewing its latest status.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default TrackComplaint;