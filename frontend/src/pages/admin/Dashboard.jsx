import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { adminFetch } from "../../utils/adminAuth";

const departmentNames = [
  "Water Supply & Sewerage",
  "Roads & Infrastructure",
  "Electricity & Street Lighting",
  "Solid Waste Management",
];

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(
        "http://localhost:5000/api/admin/analytics"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to retrieve dashboard data."
        );
      }

      setAnalytics(data);
    } catch (requestError) {
      console.error("Dashboard analytics error:", requestError);

      setError(
        requestError.message || "Unable to retrieve dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const departmentData = useMemo(() => {
    if (!analytics?.departments) {
      return [];
    }

    const departments = analytics.departments;

    const maxCount = Math.max(
      ...departmentNames.map((name) => departments[name] || 0),
      1
    );

    return departmentNames.map((name) => ({
      name,
      count: departments[name] || 0,
      percentage: Math.round(
        ((departments[name] || 0) / maxCount) * 100
      )
    }));
  }, [analytics]);

  const monthlyData = useMemo(() => {
    if (!analytics?.monthly) {
      return [];
    }

    return analytics.monthly.map((item) => ({
      ...item,
      label: new Date(
        item.year,
        item.month - 1,
        1
      ).toLocaleDateString("en-IN", {
        month: "short"
      })
    }));
  }, [analytics]);

  if (loading) {
    return (
      <DashboardLoading />
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={27} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Dashboard unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error || "Unable to retrieve dashboard data."}
            </p>

            <button
              type="button"
              onClick={loadAnalytics}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overview = analytics.overview;
  const severities = analytics.severities;
  const recentComplaints = analytics.recentComplaints || [];

  const totalForSeverity = Object.values(severities).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Monitor civic complaints, department workload, and
              department workload.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadAnalytics}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              to="/admin/complaints"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <FileText size={17} />
              View all
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total complaints"
            value={overview.totalComplaints}
            description="Stored in MongoDB"
            icon={<FileText size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Pending review"
            value={overview.pendingReview}
            description="Submitted or under review"
            icon={<Clock3 size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="In progress"
            value={overview.inProgress}
            description="Currently being handled"
            icon={<TrendingUp size={20} />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Resolved"
            value={overview.resolved}
            description={`${overview.resolutionRate}% resolution rate`}
            icon={<CheckCircle2 size={20} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Complaint activity
                  </h2>

                  <p className="text-xs text-slate-500">
                    Monthly complaints stored in the database
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 border-b border-slate-100 px-2 sm:gap-4">
              {monthlyData.map((item) => {
                const maxCount = Math.max(
                  ...monthlyData.map((entry) => entry.count),
                  1
                );

                const height =
                  item.count === 0
                    ? 3
                    : Math.max(
                        (item.count / maxCount) * 100,
                        8
                      );

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      className="relative rounded-t-lg bg-blue-100 transition group-hover:bg-blue-200"
                      style={{
                        height: `${height}%`
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block">
                        {item.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-between px-2 text-[10px] font-medium text-slate-400">
              {monthlyData.map((item) => (
                <span key={`${item.year}-${item.month}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Severity overview
                </h2>

                <p className="text-xs text-slate-500">
                  Current complaint priority
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <SeverityRow
                label="High"
                count={severities.High}
                percentage={getPercentage(
                  severities.High,
                  totalForSeverity
                )}
                className="bg-red-500"
              />

              <SeverityRow
                label="Medium"
                count={severities.Medium}
                percentage={getPercentage(
                  severities.Medium,
                  totalForSeverity
                )}
                className="bg-amber-400"
              />

              <SeverityRow
                label="Low"
                count={severities.Low}
                percentage={getPercentage(
                  severities.Low,
                  totalForSeverity
                )}
                className="bg-emerald-500"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Recent complaints
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest civic issues received by the system
                </p>
              </div>

              <Link
                to="/admin/complaints"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            {recentComplaints.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentComplaints.map((complaint) => (
                  <ComplaintRow
                    key={complaint._id || complaint.complaintId}
                    complaint={complaint}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No complaints have been submitted yet." />
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Department workload
                </h2>

                <p className="text-xs text-slate-500">
                  Complaints classified by department
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-6">
              {departmentData.map((department) => (
                <div key={department.name}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {department.name}
                    </p>

                    <p className="text-xs font-bold text-slate-500">
                      {department.count}
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${department.percentage}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/admin/departments"
              className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Manage departments
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                  Complaint system
                </p>

                <h2 className="mt-1 font-display text-lg font-bold">
                  Complaint overview
                </h2>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <MetricBox
                value={overview.totalComplaints}
                label="Analyzed"
              />

              <MetricBox
                value="100%"
                label="Stored with structured output"
              />

              <MetricBox
                value="4"
                label="Core departments"
              />

              <MetricBox
                value="5"
                label="Complaint fields"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  Quick action
                </p>

                <h2 className="mt-1 font-display text-lg font-bold text-slate-950">
                  Review pending complaints
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              There are currently {overview.pendingReview} complaints
              waiting for review or further assignment.
            </p>

            <Link
              to="/admin/complaints"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Review complaints
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 size={18} />
              </div>

              <h2 className="font-display text-base font-bold text-slate-900">
                Database-backed dashboard
              </h2>
            </div>

            <p className="mt-2 pl-12 text-xs leading-5 text-slate-500">
              Dashboard statistics are calculated from the current complaint
              collection in MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Data connected
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Loader2 size={27} className="animate-spin" />
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
            Loading dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Retrieving live complaint statistics.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function SeverityRow({
  label,
  count,
  percentage,
  className,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <p className="text-xs font-bold text-slate-500">
          {count}
        </p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  );
}

function ComplaintRow({ complaint }) {
  const severityClass =
    complaint.severity === "High"
      ? "bg-red-50 text-red-700"
      : complaint.severity === "Medium"
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  const statusClass =
    complaint.status === "Resolved"
      ? "bg-emerald-50 text-emerald-700"
      : complaint.status === "Closed"
      ? "bg-slate-200 text-slate-700"
      : complaint.status === "In Progress"
      ? "bg-blue-50 text-blue-700"
      : complaint.status === "Assigned"
      ? "bg-violet-50 text-violet-700"
      : complaint.status === "Under Review"
      ? "bg-amber-50 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <Link
      to={`/admin/complaints/${encodeURIComponent(
        complaint.complaintId
      )}`}
      className="block px-6 py-5 transition hover:bg-slate-50 sm:px-7"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">
              {complaint.issue}
            </p>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold ${severityClass}`}
            >
              {complaint.severity}
            </span>

            {complaint.isResubmission && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">
                <RotateCcw size={11} />
                Resubmitted
              </span>
            )}
          </div>

          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {complaint.complaintId}
          </p>

          {complaint.isResubmission && complaint.originalComplaintId && (
            <p className="mt-1 text-[10px] text-slate-500">
              Original:{" "}
              <span className="font-mono">
                {complaint.originalComplaintId}
              </span>
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              {complaint.location || "Location not identified"}
            </span>

            <span>{complaint.department}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
          >
            {complaint.status}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {formatDate(complaint.createdAt)}
          </span>

          <ArrowRight
            size={16}
            className="text-slate-300"
          />
        </div>
      </div>
    </Link>
  );
}

function MetricBox({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-lg font-extrabold text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-semibold text-slate-500">
        {message}
      </p>
    </div>
  );
}

function getPercentage(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
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

export default Dashboard;