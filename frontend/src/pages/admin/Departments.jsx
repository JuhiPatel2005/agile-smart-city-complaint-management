import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Users,
} from "lucide-react";
import { adminFetch } from "../../utils/adminAuth";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [summary, setSummary] = useState({
    departments: 0,
    active: 0,
    resolved: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDepartments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await adminFetch(
        "http://localhost:5000/api/admin/departments"
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || "Failed to load department information."
        );
      }

      const data = await response.json();

      setDepartments(data.departments || []);
      setSummary(
        data.summary || {
          departments: 0,
          active: 0,
          resolved: 0,
          total: 0,
        }
      );
    } catch (error) {
      setError(error.message || "Failed to load departments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Loader2 size={20} className="animate-spin text-blue-600" />
          Loading department data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Departments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View departments responsible for handling categorised civic
              issues and monitor their current workload.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDepartments(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => loadDepartments()}
                className="w-fit rounded-lg bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Building2 size={19} />}
            label="Departments"
            value={summary.departments}
            description="Active departments"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<ClipboardList size={19} />}
            label="Active complaints"
            value={summary.active}
            description="Currently unresolved"
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            icon={<CheckCircle2 size={19} />}
            label="Resolved"
            value={summary.resolved}
            description="Successfully completed"
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {departments.map((department) => (
            <DepartmentCard
              key={department.name}
              department={department}
            />
          ))}
        </section>

        {departments.length === 0 && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Building2
              size={30}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
              No department data available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Department information could not be loaded from the complaint
              database.
            </p>
          </div>
        )}

        <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  Department routing
                </p>

                <h2 className="mt-1 font-display text-lg font-bold text-slate-950">
                  Complaints are routed by the selected category
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Citizens select a complaint category when filing a report. The selected category is mapped to the corresponding department.
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-slate-50"
            >
              Learn how it works
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, description, iconClass }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-display text-3xl font-extrabold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function DepartmentCard({ department }) {
  const workload =
    department.total > 0
      ? Math.min((department.active / department.total) * 100, 100)
      : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={20} />
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">
              {department.name}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {department.coverage}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          aria-label={`Options for ${department.name}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        {department.description}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <DepartmentMetric
          value={department.total}
          label="Total"
        />

        <DepartmentMetric
          value={department.active}
          label="Active"
        />

        <DepartmentMetric
          value={department.resolved}
          label="Resolved"
        />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-slate-400" />

            <span className="text-xs font-semibold text-slate-500">
              Department workload
            </span>
          </div>

          <span className="text-xs font-bold text-slate-700">
            {department.active} active
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{
              width: `${workload}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {department.status}
        </span>

        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700"
        >
          View complaints
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function DepartmentMetric({ value, label }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-lg font-extrabold text-slate-900">{value}</p>

      <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default Departments;