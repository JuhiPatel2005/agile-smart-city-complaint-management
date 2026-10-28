import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { adminFetch } from "../../utils/adminAuth";

const statuses = [
  "All statuses",
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

const departments = [
  "All departments",
  "Water Supply & Sewerage",
  "Roads & Infrastructure",
  "Electricity & Street Lighting",
  "Solid Waste Management",
];

const severities = [
  "All severities",
  "High",
  "Medium",
  "Low",
];

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All severities");
  const [status, setStatus] = useState("All statuses");
  const [department, setDepartment] = useState("All departments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(
        "http://localhost:5000/api/admin/complaints"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to retrieve complaints."
        );
      }

      setComplaints(data?.complaints || []);
    } catch (requestError) {
      console.error("Admin complaints error:", requestError);
      setError(
        requestError.message || "Unable to retrieve complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        String(complaint.complaintId || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(complaint.issue || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(complaint.location || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(complaint.department || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesSeverity =
        severity === "All severities" ||
        complaint.severity === severity;

      const matchesStatus =
        status === "All statuses" ||
        complaint.status === status;

      const matchesDepartment =
        department === "All departments" ||
        complaint.department === department;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [complaints, search, severity, status, department]);

  const clearFilters = () => {
    setSearch("");
    setSeverity("All severities");
    setStatus("All statuses");
    setDepartment("All departments");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Complaints
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review, filter, and manage civic complaints received by the
              system.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <ClipboardList size={17} className="text-blue-600" />

            <span className="text-sm font-bold text-slate-700">
              {filteredComplaints.length} complaints
            </span>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by complaint ID, issue, location or department..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <SlidersHorizontal size={17} />

              <span className="text-xs font-bold uppercase tracking-wider">
                Filters
              </span>
            </div>

            <FilterSelect
              value={severity}
              onChange={setSeverity}
              options={severities}
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
              options={statuses}
            />

            <FilterSelect
              value={department}
              onChange={setDepartment}
              options={departments}
            />

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Filter size={15} />
              Clear
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p>{error}</p>

              <button
                type="button"
                onClick={loadComplaints}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-red-700 underline underline-offset-2"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Loader2 size={22} className="animate-spin" />
                </div>

                <p className="mt-4 text-sm font-bold text-slate-800">
                  Loading complaints
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Retrieving complaints from MongoDB.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Complaint
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Department
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Severity
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Date
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.map((complaint) => (
                      <ComplaintTableRow
                        key={complaint._id || complaint.complaintId}
                        complaint={complaint}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredComplaints.map((complaint) => (
                  <ComplaintMobileCard
                    key={complaint._id || complaint.complaintId}
                    complaint={complaint}
                  />
                ))}
              </div>

              {filteredComplaints.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Search size={21} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-800">
                    No complaints found
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {!loading && (
          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <p>
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </p>

            <button
              type="button"
              onClick={loadComplaints}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative min-w-[170px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function ComplaintTableRow({ complaint }) {
  const complaintId = complaint.complaintId;
  const location = complaint.location || "Location not identified";

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-5">
        <Link
          to={`/admin/complaints/${encodeURIComponent(complaintId)}`}
          className="block"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">
              {complaint.issue}
            </p>

            {complaint.isResubmission && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                <RotateCcw size={11} />
                Resubmitted Complaint
              </span>
            )}
          </div>

          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {complaintId}
          </p>

          {complaint.isResubmission && complaint.originalComplaintId && (
            <p className="mt-1 text-[10px] text-slate-500">
              Original:{" "}
              <span className="font-mono">
                {complaint.originalComplaintId}
              </span>

              {complaint.citizenName && (
                <span className="ml-2 text-slate-400">
                  Reported by {complaint.citizenName}
                </span>
              )}
            </p>
          )}
        </Link>
      </td>

      <td className="px-4 py-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={14} className="text-slate-400" />
          {location}
        </div>
      </td>

      <td className="px-4 py-5">
        <span className="text-xs font-semibold text-slate-600">
          {complaint.department}
        </span>
      </td>

      <td className="px-4 py-5">
        <SeverityBadge severity={complaint.severity} />
      </td>

      <td className="px-4 py-5">
        <StatusBadge status={complaint.status} />
      </td>

      <td className="px-4 py-5 text-xs font-medium text-slate-500">
        {formatDate(complaint.createdAt)}
      </td>

      <td className="px-4 py-5 text-right">
        <Link
          to={`/admin/complaints/${encodeURIComponent(complaintId)}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
        >
          View
          <ArrowRight size={14} />
        </Link>
      </td>
    </tr>
  );
}

function ComplaintMobileCard({ complaint }) {
  const complaintId = complaint.complaintId;
  const location = complaint.location || "Location not identified";

  return (
    <Link
      to={`/admin/complaints/${encodeURIComponent(complaintId)}`}
      className="block p-5 transition hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">
              {complaint.issue}
            </p>

            {complaint.isResubmission && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                <RotateCcw size={11} />
                Resubmitted Complaint
              </span>
            )}
          </div>

          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {complaintId}
          </p>

          {complaint.isResubmission && complaint.originalComplaintId && (
            <p className="mt-1 text-[10px] text-slate-500">
              Original:{" "}
              <span className="font-mono">
                {complaint.originalComplaintId}
              </span>

              {complaint.citizenName && (
                <span className="ml-2 text-slate-400">
                  Reported by {complaint.citizenName}
                </span>
              )}
            </p>
          )}
        </div>

        <ArrowRight
          size={17}
          className="shrink-0 text-slate-300"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SeverityBadge severity={complaint.severity} />
        <StatusBadge status={complaint.status} />
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          {location}
        </div>

        <div>
          <span className="font-semibold text-slate-400">
            Department:
          </span>{" "}
          {complaint.department}
        </div>

        <div>
          <span className="font-semibold text-slate-400">
            Date:
          </span>{" "}
          {formatDate(complaint.createdAt)}
        </div>
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
  const classes =
    status === "Resolved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Closed"
      ? "bg-slate-200 text-slate-700"
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
      {status}
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

export default Complaints;