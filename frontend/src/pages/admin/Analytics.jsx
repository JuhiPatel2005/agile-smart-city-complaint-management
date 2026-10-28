import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { adminFetch } from "../../utils/adminAuth";

const departmentNames = [
  "Water Supply & Sewerage",
  "Roads & Infrastructure",
  "Electricity & Street Lighting",
  "Solid Waste Management",
];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("6");
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
          data?.error || "Failed to retrieve analytics."
        );
      }

      setAnalytics(data);
    } catch (requestError) {
      console.error("Analytics error:", requestError);

      setError(
        requestError.message || "Unable to retrieve analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const visibleMonthlyData = useMemo(() => {
    if (!analytics?.monthly) {
      return [];
    }

    if (period === "6") {
      return analytics.monthly.slice(-6);
    }

    if (period === "12") {
      return analytics.monthly;
    }

    const currentYear = new Date().getFullYear();

    return analytics.monthly.filter(
      (item) => item.year === currentYear
    );
  }, [analytics, period]);

  if (loading) {
    return (
      <AnalyticsLoading />
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
              Analytics unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error || "Unable to retrieve analytics."}
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

  const totalSeverityCount = Object.values(severities).reduce(
    (sum, value) => sum + value,
    0
  );

  const departmentData = departmentNames.map((name) => {
    const count = analytics.departments[name] || 0;

    return {
      name,
      count,
      percentage:
        overview.totalComplaints > 0
          ? Math.round(
              (count / overview.totalComplaints) * 100
            )
          : 0,
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Understand complaint trends, severity distribution, department
              workload and complaint trends from live database data.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAnalytics}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsStat
            icon={<FileText size={20} />}
            label="Total complaints"
            value={overview.totalComplaints}
            detail="Current database total"
            iconClass="bg-blue-50 text-blue-600"
          />

          <AnalyticsStat
            icon={<CheckCircle2 size={20} />}
            label="Resolution rate"
            value={`${overview.resolutionRate}%`}
            detail={`${overview.resolved} resolved complaints`}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <AnalyticsStat
            icon={<Clock3 size={20} />}
            label="Pending review"
            value={overview.pendingReview}
            detail="Submitted or under review"
            iconClass="bg-violet-50 text-violet-600"
          />

          <AnalyticsStat
            icon={<Activity size={20} />}
            label="Complaint categorisations"
            value={overview.totalComplaints}
            detail="Stored with structured fields"
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Complaint trend
                  </h2>

                  <p className="text-xs text-slate-500">
                    Complaints created during the selected period
                  </p>
                </div>
              </div>

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="6">Last 6 months</option>
                <option value="12">Last 12 months</option>
                <option value="year">This year</option>
              </select>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3 border-b border-slate-100 px-2 sm:gap-5">
              {visibleMonthlyData.map((item) => {
                const maxCount = Math.max(
                  ...visibleMonthlyData.map(
                    (entry) => entry.count
                  ),
                  1
                );

                const height =
                  item.count === 0
                    ? 3
                    : Math.max(
                        (item.count / maxCount) * 100,
                        8
                      );

                const label = new Date(
                  item.year,
                  item.month - 1,
                  1
                ).toLocaleDateString("en-IN", {
                  month: "short"
                });

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="relative">
                      <div
                        className="w-full rounded-t-xl bg-blue-100 transition group-hover:bg-blue-200"
                        style={{
                          height: `${height * 2.2}px`
                        }}
                      />

                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">
                        {item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-between px-2 text-[10px] font-medium text-slate-400 sm:gap-8">
              {visibleMonthlyData.map((item) => (
                <span
                  key={`${item.year}-${item.month}`}
                  className="flex-1 text-center"
                >
                  {new Date(
                    item.year,
                    item.month - 1,
                    1
                  ).toLocaleDateString("en-IN", {
                    month: "short"
                  })}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Severity distribution
                </h2>

                <p className="text-xs text-slate-500">
                  Complaints by priority
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full border-[22px] border-blue-100">
              <div className="text-center">
                <p className="font-display text-2xl font-extrabold text-slate-950">
                  {totalSeverityCount}
                </p>

                <p className="text-[10px] font-semibold text-slate-400">
                  Total
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <LegendItem
                label="High"
                value={severities.High}
                className="bg-red-500"
              />

              <LegendItem
                label="Medium"
                value={severities.Medium}
                className="bg-amber-400"
              />

              <LegendItem
                label="Low"
                value={severities.Low}
                className="bg-emerald-500"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Complaints by department
                </h2>

                <p className="text-xs text-slate-500">
                  Distribution of classified complaints
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {departmentData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {item.name}
                    </p>

                    <p className="text-xs font-bold text-slate-500">
                      {item.count}
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${item.percentage}%`
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-[10px] text-slate-400">
                    {item.percentage}% of complaints
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BarChart3 size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-950">
                  Resolution performance
                </h2>

                <p className="text-xs text-slate-500">
                  Current workflow performance
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <PerformanceRow
                label="Resolved complaints"
                value={overview.resolved}
                percentage={`${getPercentage(
                  overview.resolved,
                  overview.totalComplaints
                )}%`}
              />

              <PerformanceRow
                label="In progress"
                value={overview.inProgress}
                percentage={`${getPercentage(
                  overview.inProgress,
                  overview.totalComplaints
                )}%`}
              />

              <PerformanceRow
                label="Pending review"
                value={overview.pendingReview}
                percentage={`${getPercentage(
                  overview.pendingReview,
                  overview.totalComplaints
                )}%`}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-emerald-500"
                />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Current resolution rate
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {overview.resolutionRate}% of stored complaints are
                    currently marked as resolved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <Activity size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                  Complaint categorisation activity
                </p>

                <h2 className="mt-1 font-display text-lg font-bold">
                  Structured civic intelligence
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Each complaint record stores the category, location, urgency, status and department selected or assigned during intake.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MiniMetric
                value={overview.totalComplaints}
                label="Analyzed"
              />

              <MiniMetric
                value="4"
                label="Departments"
              />

              <MiniMetric
                value="5"
                label="Complaint fields"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-100 bg-amber-50 p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <Clock3
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Response-time analytics not available yet
              </h3>

              <p className="mt-2 text-xs leading-5 text-amber-700">
                The current Complaint model stores creation and update
                timestamps but does not store timestamps for each individual
                status transition. Therefore, an accurate average response
                time cannot be calculated yet.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Loader2 size={27} className="animate-spin" />
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
            Loading analytics
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Calculating statistics from MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsStat({
  icon,
  label,
  value,
  detail,
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

      <p className="mt-1 text-xs font-semibold text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function LegendItem({
  label,
  value,
  className,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${className}`}
        />

        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-xs font-bold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function PerformanceRow({
  label,
  value,
  percentage,
}) {
  const numericPercentage = Number.parseFloat(
    percentage
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">
            {value}
          </p>

          <p className="text-[10px] text-slate-400">
            {percentage}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{
            width: `${Math.min(
              Math.max(numericPercentage, 0),
              100
            )}%`
          }}
        />
      </div>
    </div>
  );
}

function MiniMetric({
  value,
  label,
}) {
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

function getPercentage(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default Analytics;