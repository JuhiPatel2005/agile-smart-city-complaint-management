import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  Home,
  MapPin,
  Search,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

function ComplaintSubmitted() {
  const storedData = sessionStorage.getItem("complaintData");

  if (!storedData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <ClipboardCheck size={30} />
            </div>

            <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-950">
              Complaint information not found
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Please submit a complaint first to receive your complaint ID.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report an Issue
              <ArrowRight size={17} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  let complaint;

  try {
    complaint = JSON.parse(storedData);
  } catch {
    sessionStorage.removeItem("complaintData");

    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ClipboardCheck size={30} />
            </div>

            <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-950">
              Unable to read complaint
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Please submit the complaint again.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report Again
              <ArrowRight size={17} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!complaint?.complaintId) {
    sessionStorage.removeItem("complaintData");

    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ClipboardCheck size={30} />
            </div>

            <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-950">
              Invalid complaint data
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Please submit the complaint again.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report Again
              <ArrowRight size={17} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const complaintId = complaint.complaintId;
  const issue = complaint.issue || "Civic Issue";
  const department = complaint.department || "Relevant Department";
  const location = complaint.location || "Location not identified";
  const severity = complaint.severity || "Not identified";
  const status = complaint.status || "Submitted";

  const severityValue = String(severity).toLowerCase();

  const severityClasses = severityValue.includes("high")
    ? "border-red-200 bg-red-50 text-red-700"
    : severityValue.includes("medium")
    ? "border-amber-200 bg-amber-50 text-amber-700"
    : severityValue.includes("low")
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-50 text-slate-700";

  const isResubmission = Boolean(complaint.isResubmission);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 px-6 py-12 text-center text-white sm:px-10 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <Check size={32} strokeWidth={2.5} />
              </div>

              <div className="mx-auto mt-6 max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                  <Sparkles size={14} />
                  {isResubmission
                    ? "Resubmission received"
                    : "Complaint received"}
                </div>

                <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {isResubmission
                    ? "Your complaint has been resubmitted"
                    : "Your complaint has been submitted"}
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  {isResubmission
                    ? "Your new complaint ID is shown below. The original complaint stays in your history so you can always refer back to it."
                    : "Your complaint has been recorded. Keep the complaint ID for future reference."}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                      Complaint ID
                    </p>

                    <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-slate-950">
                      {complaintId}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <ClipboardCheck size={22} />
                  </div>
                </div>
              </div>

              {isResubmission && complaint.originalComplaintId && (
                <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
                      Original complaint
                    </p>

                    <p className="mt-2 font-mono text-sm font-bold text-slate-950">
                      {complaint.originalComplaintId}
                    </p>
                  </div>

                  <Link
                    to={`/complaint/${encodeURIComponent(
                      complaint.originalComplaintId
                    )}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:text-violet-900"
                  >
                    View original complaint
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ClipboardCheck size={18} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Issue
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {issue}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Sparkles size={18} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {department}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MapPin size={18} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {location}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <ShieldAlert size={18} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Severity
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${severityClasses}`}
                  >
                    {severity}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-lg font-bold text-slate-950">
                  What happens next?
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Check size={18} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      {isResubmission
                        ? "Resubmission received"
                        : "Complaint received"}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {isResubmission
                        ? "Your new complaint has been recorded successfully."
                        : "Your complaint has been recorded successfully."}
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-slate-200 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <Clock3 size={18} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      Department review
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      The responsible department can review and process the
                      issue.
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-slate-200 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <MapPin size={18} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      Track progress
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Use your complaint ID to check the complaint status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Current status
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {status}
                    </p>
                  </div>

                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {status}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-center">
                <Link
                  to={`/complaint/${encodeURIComponent(complaintId)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  View My Complaint
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <ClipboardCheck size={17} />
                  My Dashboard
                </Link>

                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Search size={17} />
                  Track Complaint
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-5 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-blue-600"
            >
              <Home size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ComplaintSubmitted;