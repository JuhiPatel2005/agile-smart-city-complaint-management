import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Tag,
} from "lucide-react";

function AnalysisResult() {
  const navigate = useNavigate();

  const storedData = sessionStorage.getItem("complaintData");

  if (!storedData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertCircle size={26} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Nothing to show yet
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Report a civic issue first. Once your complaint has been
              reviewed, the details will appear here.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report an Issue
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
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
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={26} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Unable to read complaint
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Please submit the complaint again.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report Again
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint || !complaint.complaintId) {
    sessionStorage.removeItem("complaintData");

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={26} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Invalid complaint data
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Please submit your complaint again.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report Again
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const issue = complaint.issue || "Not identified";
  const location = complaint.location || "Not identified";
  const severity = complaint.severity || "Not identified";
  const department = complaint.department || "Not identified";
  const summary = complaint.summary || "No summary was generated.";
  const description =
    complaint.description || "No complaint description available.";

  const isResubmission = Boolean(complaint.isResubmission);

  const severityValue = String(severity).toLowerCase();

  const severityClasses =
    severityValue.includes("high") ||
    severityValue.includes("critical")
      ? "border-red-200 bg-red-50 text-red-700"
      : severityValue.includes("medium")
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : severityValue.includes("low")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  const handleSubmitComplaint = () => {
    navigate("/complaint-submitted");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            to="/report"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to report
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                <CheckCircle2 size={14} />
                {isResubmission
                  ? "Resubmission reviewed"
                  : "Review complete"}
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                {isResubmission
                  ? "Your complaint has been resubmitted"
                  : "Your complaint has been reviewed"}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {isResubmission
                  ? "Your new complaint has been reviewed and saved with a new complaint ID. The original complaint stays in your history."
                  : "Your complaint details have been saved and routed to the selected department."}
              </p>
            </div>

            <button
              onClick={() => navigate("/report")}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Report another issue
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            {isResubmission && (
              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <RotateCcw
                    size={20}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />

                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-bold text-slate-950">
                      What is still unresolved
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      You told us that the original complaint was not actually
                      fixed, so your resubmission explains what is still wrong.
                    </p>

                    {complaint.originalComplaintId && (
                      <Link
                        to={`/complaint/${encodeURIComponent(
                          complaint.originalComplaintId
                        )}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:text-violet-900"
                      >
                        View original complaint
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Your complaint
                  </p>

                  <p className="mt-2 text-base leading-7 text-slate-700">
                    {description}
                  </p>

                  <div className="mt-4 inline-flex rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                    Complaint ID: {complaint.complaintId}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-950">
                      Complaint details
                    </h2>

                    <p className="text-sm text-slate-500">
                      What we identified from your description
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Issue
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {issue}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={18} className="text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Severity
                    </span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-bold capitalize ${severityClasses}`}
                    >
                      {severity}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Location
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {location}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-violet-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {department}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Summary
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {summary}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
              <div className="flex gap-4">
                <InfoIcon />

                <div>
                  <h3 className="text-sm font-bold text-blue-900">
                    Review before continuing
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    {isResubmission
                      ? "Your resubmitted complaint has already been reviewed and saved with a new complaint ID. Review the details before continuing to the confirmation."
                      : "Your complaint has already been reviewed and saved with its complaint ID. Review the details before continuing to the submission confirmation."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <Sparkles size={21} />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold">
                Ready to continue?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your complaint has been reviewed and saved. Continue to view
                your complaint confirmation and tracking ID.
              </p>

              <button
                onClick={handleSubmitComplaint}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">
                How we handle your complaint
              </h3>

              <div className="mt-5 space-y-4">
                {[
                  "Your complaint description",
                  "Reviewing your complaint",
                  "Identifying the issue and location",
                  "Rating how urgent it is",
                  "Sending it to the responsible department",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {index + 1}
                    </div>

                    <p className="text-sm font-medium text-slate-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
      <AlertCircle size={19} />
    </div>
  );
}

export default AnalysisResult;