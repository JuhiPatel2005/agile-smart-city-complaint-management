import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { userFetch } from "../utils/userAuth";

const API_URL = "http://localhost:5000";

const statusOrder = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [actionError, setActionError] = useState("");
  // Day 4: true when the signed-in citizen is following a complaint that
  // was reported by a different citizen. The backend only sends the safe
  // civic fields in that case, so owner-only actions are never offered.
  const [isFollower, setIsFollower] = useState(false);

  const loadComplaint = async () => {
    if (!id) {
      setError("Complaint ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const complaintId = decodeURIComponent(id);

      const response = await userFetch(
        `${API_URL}/api/complaints/${encodeURIComponent(complaintId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to retrieve the complaint."
        );
      }

      if (!data?.complaint) {
        throw new Error("Complaint data was not returned by the server.");
      }

      setComplaint(data.complaint);

      // The backend tells us which access level was granted.
      setIsFollower(data.trackingAccess === "follower");

      // Followers never had this complaint in their own session storage,
      // so the stored-complaint sync is skipped for them.
      if (data.trackingAccess !== "follower") {
        syncStoredComplaint(data.complaint);
      }
    } catch (requestError) {
      console.error("Complaint tracking error:", requestError);
      setError(
        requestError.message || "Unable to retrieve the complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleCloseComplaint = async () => {
    if (!complaint?.complaintId || closing) {
      return;
    }

    setClosing(true);
    setActionError("");

    try {
      const response = await userFetch(
        `${API_URL}/api/complaints/${encodeURIComponent(
          complaint.complaintId
        )}/close`,
        { method: "PATCH" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to close this complaint right now."
        );
      }

      setComplaint(data.complaint);

      syncStoredComplaint(data.complaint);
    } catch (closeError) {
      console.error("Complaint closure error:", closeError);

      setActionError(
        closeError.message || "Unable to close this complaint right now."
      );
    } finally {
      setClosing(false);
    }
  };

  const handleIssueStillExists = () => {
    if (!complaint?.complaintId) {
      return;
    }

    navigate(
      `/report?resubmit=${encodeURIComponent(complaint.complaintId)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Loader2 size={27} className="animate-spin" />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Loading complaint
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Getting the latest update on your complaint.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={27} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Complaint not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error ||
                "We could not find a complaint with the provided ID."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <ArrowLeft size={17} />
                Try Another ID
              </Link>

              <button
                onClick={loadComplaint}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={17} />
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const complaintId = complaint.complaintId;
  const issue = complaint.issue || "Civic Issue";
  const summary = complaint.summary || "No summary available.";
  const location = complaint.location || "Location not identified";
  const department = complaint.department || "Department not identified";
  const severity = complaint.severity || "Not identified";
  const status = complaint.status || "Submitted";

  const createdDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  const statusIndex = statusOrder.indexOf(status);

  const severityValue = String(severity).toLowerCase();

  const severityClasses = severityValue.includes("high")
    ? "border-red-200 bg-red-50 text-red-700"
    : severityValue.includes("medium")
    ? "border-amber-200 bg-amber-50 text-amber-700"
    : severityValue.includes("low")
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/track"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to tracking
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Complaint details
            </p>

            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {issue}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-mono font-semibold text-slate-700">
                {complaintId}
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span>Submitted {createdDate}</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                status === "Resolved" || status === "Closed"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : status === "In Progress"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {status === "Resolved" || status === "Closed" ? (
                <CheckCircle2 size={16} />
              ) : (
                <Clock3 size={16} />
              )}
              {status}
            </div>

            {complaint.isResubmission && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-700">
                <RotateCcw size={13} />
                Resubmitted complaint
              </span>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            {status === "Resolved" && !isFollower && (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <CheckCircle2 size={22} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-emerald-900">
                      Your complaint has been marked as resolved.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                      Has the issue been resolved? Please confirm so your
                      complaint can be closed, or let us know that the issue
                      is still there.
                    </p>
                  </div>
                </div>

                {actionError && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{actionError}</span>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCloseComplaint}
                    disabled={closing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {closing ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Check size={17} />
                    )}

                    {closing
                      ? "Closing complaint..."
                      : "Yes, Close Complaint"}
                  </button>

                  <button
                    type="button"
                    onClick={handleIssueStillExists}
                    disabled={closing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={17} />
                    No, Issue Still Exists
                  </button>
                </div>
              </section>
            )}

            {status === "Closed" && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-950">
                      Complaint Closed
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Thank you for confirming that the issue has been
                      resolved. This complaint stays in your history and can
                      still be viewed at any time.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {isFollower && (
              <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <ShieldCheck size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-slate-950">
                      You are tracking this complaint
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Another citizen reported this civic issue and you chose
                      to follow it. You can see its current status and
                      progress. For privacy, the other citizen's name,
                      email, phone number and their other complaints are
                      never shared with you.
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    Complaint information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Details identified from your complaint
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<MessageSquare size={18} />}
                  label="Issue"
                  value={issue}
                />

                <InfoCard
                  icon={<Building2 size={18} />}
                  label="Department"
                  value={department}
                />

                <InfoCard
                  icon={<ShieldAlert size={18} />}
                  label="Severity"
                  value={
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${severityClasses}`}
                    >
                      {severity}
                    </span>
                  }
                />

                <InfoCard
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={location}
                />

                <InfoCard
                  icon={<Clock3 size={18} />}
                  label="Current status"
                  value={status}
                />

                <InfoCard
                  icon={<FileText size={18} />}
                  label="Complaint ID"
                  value={complaintId}
                />

                {complaint.isResubmission && (
                  <InfoCard
                    icon={<RotateCcw size={18} />}
                    label="Original complaint"
                    value={
                      complaint.originalComplaintId || "Not available"
                    }
                  />
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Summary
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {summary}
                </p>
              </div>

              {!isFollower && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What you reported
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {complaint.description}
                  </p>
                </div>
              )}
            </section>

            {complaint.isResubmission && (
              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                    <RotateCcw size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      Resubmitted complaint
                    </span>

                    <h2 className="mt-3 font-display text-xl font-bold text-slate-950">
                      You reported that the issue still exists
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This complaint ({complaintId}) was raised after your
                      original complaint{" "}
                      {complaint.originalComplaintId} was marked as resolved.
                      Both complaints are kept in your history.
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
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <MessageSquare size={19} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    Status timeline
                  </h2>

                  <p className="text-sm text-slate-500">
                    Current progress of your complaint
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {statusOrder.map((timelineStatus, index) => {
                  const completed =
                    statusIndex >= index && statusIndex !== -1;

                  const active = statusIndex === index;

                  return (
                    <TimelineItem
                      key={timelineStatus}
                      title={timelineStatus}
                      description={getStatusDescription(timelineStatus)}
                      date={
                        completed
                          ? index === 0
                            ? createdDate
                            : index === statusIndex
                            ? "Current"
                            : "Completed"
                          : "Pending"
                      }
                      completed={completed}
                      active={active}
                      last={index === statusOrder.length - 1}
                    />
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                Complaint ID
              </p>

              <p className="mt-3 break-all font-mono text-xl font-bold">
                {complaintId}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Use this ID whenever you need to reference this complaint.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">
                Current status
              </h3>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-blue-900">
                    {status}
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    This is the latest update available for your complaint.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <h3 className="text-sm font-bold text-emerald-900">
                    Complaint reviewed
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    The issue details and responsible department were
                    identified when you submitted this complaint.
                  </p>
                </div>
              </div>
            </section>

            <button
              onClick={loadComplaint}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh Status
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

function getStatusDescription(status) {
  const descriptions = {
    Submitted: "Your complaint was received by the system.",
    "Under Review": "The complaint is being reviewed by the responsible team.",
    Assigned: "The complaint has been assigned to the responsible department.",
    "In Progress": "The responsible department is working on the issue.",
    Resolved: "The complaint has been marked as resolved.",
    Closed: "You confirmed that the issue has been resolved.",
  };

  return descriptions[status] || "Complaint status information.";
}

function syncStoredComplaint(complaint) {
  const storedData = sessionStorage.getItem("complaintData");

  if (!storedData) {
    return;
  }

  try {
    const storedComplaint = JSON.parse(storedData);

    if (storedComplaint?.complaintId === complaint.complaintId) {
      sessionStorage.setItem("complaintData", JSON.stringify(complaint));
    }
  } catch {
    sessionStorage.removeItem("complaintData");
  }
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="mt-3 text-sm font-bold leading-6 text-slate-900">
        {value}
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  completed = false,
  active = false,
  last = false,
}) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[15px] top-8 h-full w-px ${
            completed ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : active
            ? "border-blue-500 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-300"
        }`}
      >
        {completed ? <Check size={15} strokeWidth={3} /> : null}
      </div>

      <div className="min-w-0 pb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <h3
            className={`text-sm font-bold ${
              completed || active ? "text-slate-900" : "text-slate-400"
            }`}
          >
            {title}
          </h3>

          <span className="text-xs font-medium text-slate-400">
            {date}
          </span>
        </div>

        <p
          className={`mt-2 max-w-xl text-xs leading-5 ${
            completed || active ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default ComplaintDetails;