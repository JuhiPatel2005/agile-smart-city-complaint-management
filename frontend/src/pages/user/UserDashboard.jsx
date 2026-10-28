import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Loader2,
  LogOut,
  MapPin,
  RefreshCw,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { getUserData, userFetch, userLogout } from "../../utils/userAuth";

const API_URL = "http://localhost:5000";

const openStatuses = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
];

function UserDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => getUserData());
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userFetch(`${API_URL}/api/user/complaints`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to retrieve your complaints."
        );
      }

      setComplaints(data?.complaints || []);
    } catch (requestError) {
      console.error("Citizen complaints error:", requestError);

      setError(
        requestError.message || "Unable to retrieve your complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSignOut = () => {
    userLogout();

    navigate("/", {
      replace: true,
    });
  };

  const stats = [
    {
      label: "Total reported",
      value: complaints.length,
      icon: ClipboardList,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Open complaints",
      value: complaints.filter((complaint) =>
        openStatuses.includes(complaint.status)
      ).length,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Awaiting your confirmation",
      value: complaints.filter(
        (complaint) => complaint.status === "Resolved"
      ).length,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Closed",
      value: complaints.filter(
        (complaint) => complaint.status === "Closed"
      ).length,
      icon: ClipboardCheck,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "Resubmitted",
      value: complaints.filter(
        (complaint) => complaint.isResubmission
      ).length,
      icon: RotateCcw,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "High severity",
      value: complaints.filter(
        (complaint) => complaint.severity === "High"
      ).length,
      icon: TrendingUp,
      tone: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Citizen Dashboard
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Welcome{user?.name ? `, ${user.name}` : " back"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Track the civic complaints you reported and follow their
              progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Report an Issue
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon size={20} />
                </div>

                <p className="mt-4 font-display text-2xl font-extrabold text-slate-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-950">
                My complaints
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Complaints submitted using your CivicTrack account.
              </p>
            </div>

            <button
              type="button"
              onClick={loadComplaints}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {loading ? (
            <DashboardLoader />
          ) : error ? (
            <ErrorState
              title="Unable to load your complaints"
              description={error}
              onRetry={loadComplaints}
            />
          ) : complaints.length === 0 ? (
            <EmptyState
              title="No complaints yet"
              description="You have not reported any civic issues yet. Report an issue to get started."
              action={
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  Report an Issue
                  <ArrowRight size={14} />
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((complaint) => (
                <CitizenComplaintRow
                  key={complaint._id || complaint.complaintId}
                  complaint={complaint}
                />
              ))}
            </div>
          )}
        </section>

        {!loading && !error && complaints.length > 0 && (
          <p className="mt-5 text-xs text-slate-400">
            Showing {complaints.length}{" "}
            {complaints.length === 1 ? "complaint" : "complaints"}
          </p>
        )}
      </div>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Loader2 size={22} className="animate-spin" />
        </div>

        <p className="mt-4 text-sm font-bold text-slate-800">
          Loading your complaints
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Retrieving your reported issues.
        </p>
      </div>
    </div>
  );
}

function CitizenComplaintRow({ complaint }) {
  const complaintId = complaint.complaintId;
  const location = complaint.location || "Location not identified";

  return (
    <Link
      to={`/complaint/${encodeURIComponent(complaintId)}`}
      className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900">
            {complaint.issue}
          </p>

          {complaint.isResubmission && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
              <RotateCcw size={11} />
              Resubmitted
            </span>
          )}
        </div>

        <p className="mt-1 font-mono text-[10px] text-slate-400">
          {complaintId}
        </p>

        {complaint.isResubmission && complaint.originalComplaintId && (
          <p className="mt-1 text-[10px] text-slate-400">
            Original complaint:{" "}
            <span className="font-mono">
              {complaint.originalComplaintId}
            </span>
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            {location}
          </span>

          <span className="font-semibold text-slate-600">
            {complaint.department}
          </span>

          <span>{formatDate(complaint.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={complaint.severity} />

        <StatusBadge status={complaint.status} />

        {complaint.status === "Resolved" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white">
            Review Resolution
            <ArrowRight size={11} />
          </span>
        )}

        <ArrowRight size={16} className="ml-1 text-slate-300" />
      </div>
    </Link>
  );
}

function SeverityBadge({ severity }) {
  const classes =
    severity === "High"
      ? "bg-orange-100 text-orange-700"
      : severity === "Medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${classes}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  const isResolved = status === "Resolved";
  const isClosed = status === "Closed";

  const label = isResolved
    ? "Resolved \u00b7 Awaiting Confirmation"
    : status;

  const classes = isResolved
    ? "bg-emerald-50 text-emerald-700"
    : isClosed
    ? "bg-slate-100 text-slate-700"
    : status === "In Progress"
    ? "bg-blue-50 text-blue-700"
    : status === "Assigned"
    ? "bg-violet-50 text-violet-700"
    : status === "Under Review"
    ? "bg-amber-50 text-amber-700"
    : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${classes}`}
    >
      {label}
    </span>
  );
}

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default UserDashboard;
