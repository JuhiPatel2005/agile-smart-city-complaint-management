import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  Save,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react";
import { adminFetch } from "../../utils/adminAuth";

const API_URL = "http://localhost:5000";

const statusOrder = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];

const departments = [
  "Water Supply & Sewerage",
  "Roads & Infrastructure",
  "Electricity & Street Lighting",
  "Solid Waste Management",
];

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadComplaint = async () => {
    if (!id) {
      setError("Complaint ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const complaintId = decodeURIComponent(id);

      const response = await adminFetch(
        `${API_URL}/api/admin/complaints/${encodeURIComponent(complaintId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to retrieve the complaint."
        );
      }

      if (!data?.complaint) {
        throw new Error("Complaint data was not returned.");
      }

      setComplaint(data.complaint);
      setCitizen(data.citizen || null);
      setSelectedDepartment(data.complaint.department || "");
    } catch (requestError) {
      console.error("Admin complaint details error:", requestError);

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

  const handleUpdate = async () => {
    if (!complaint?.complaintId) {
      return;
    }

    if (!selectedDepartment) {
      setError("Please select a department.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await adminFetch(
        `http://localhost:5000/api/admin/complaints/${encodeURIComponent(
          complaint.complaintId
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            department: selectedDepartment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to update complaint."
        );
      }

      setComplaint(data.complaint);
      setSelectedDepartment(data.complaint.department);
      setSuccess("Complaint updated successfully.");
    } catch (updateError) {
      console.error("Complaint update error:", updateError);

      setError(
        updateError.message || "Unable to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAdvanceStatus = async () => {
    if (!complaint?.complaintId || !nextStatus || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await adminFetch(
        `http://localhost:5000/api/admin/complaints/${encodeURIComponent(
          complaint.complaintId
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
            department: selectedDepartment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Failed to move the complaint to "${nextStatus}".`
        );
      }

      // The UI is updated only from the confirmed server response, never
      // optimistically, so a rejected transition never fakes a change.
      setComplaint(data.complaint);
      setSelectedDepartment(data.complaint.department || "");
      setSuccess(`Complaint moved to "${data.complaint.status}".`);
    } catch (updateError) {
      console.error("Status transition error:", updateError);

      setError(
        updateError.message ||
          `Unable to move the complaint to "${nextStatus}".`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Loader2 size={27} className="animate-spin" />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Loading complaint
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Retrieving complaint information from MongoDB.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={27} />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">
              Complaint not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error ||
                "We could not find the requested complaint."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/admin/complaints"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <ArrowLeft size={17} />
                Back to complaints
              </Link>

              <button
                type="button"
                onClick={loadComplaint}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={17} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const complaintId = complaint.complaintId;
  const status = complaint.status || "Submitted";
  const isClosed = status === "Closed";
  const timelineStatuses = isClosed
    ? [...statusOrder, "Closed"]
    : statusOrder;
  const statusIndex = timelineStatuses.indexOf(status);

  // The only administrative transition available is the next sequential
  // workflow status. Resolved and Closed have no admin transition:
  // Resolved waits for the citizen confirmation that closes it.
  const currentStatusIndex = statusOrder.indexOf(status);
  const nextStatus =
    currentStatusIndex !== -1 &&
    currentStatusIndex < statusOrder.length - 1
      ? statusOrder[currentStatusIndex + 1]
      : null;
  const location = complaint.location || "Location not identified";

  const createdDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Date unavailable";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to complaints
        </Link>

        <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-sm font-bold text-blue-600">
                {complaintId}
              </p>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="text-xs font-medium text-slate-400">
                Citizen Report
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {complaint.issue}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Submitted {createdDate}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                status === "Resolved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isClosed
                  ? "border-slate-200 bg-slate-100 text-slate-700"
                  : status === "In Progress"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : status === "Assigned"
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isClosed ? (
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

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            {isClosed && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-sm font-medium text-emerald-800">
                  The citizen confirmed that this issue has been resolved, so
                  the complaint is now closed.
                </p>
              </div>
            )}

            {complaint.isResubmission && (
              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm sm:p-7">
                <div className="flex items-start gap-3">
                  <RotateCcw
                    size={19}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      Resubmitted complaint
                    </span>

                    <h2 className="mt-3 font-display text-lg font-bold text-slate-950">
                      The citizen reported that the issue still exists
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This complaint was raised by the citizen after the
                      original complaint was marked as resolved. Process it
                      through the normal workflow and the citizen will be asked
                      to confirm the result again.
                    </p>

                    {complaint.originalComplaintId && (
                      <Link
                        to={`/admin/complaints/${encodeURIComponent(
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

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Citizen complaint
                  </h2>

                  <p className="text-xs text-slate-500">
                    Original issue description
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {complaint.description}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Complaint categorisation
                  </h2>

                  <p className="text-xs text-slate-500">
                    Structured information generated from the complaint
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ComplaintInfoCard
                  icon={<FileText size={18} />}
                  label="Issue"
                  value={complaint.issue}
                />

                <ComplaintInfoCard
                  icon={<ShieldAlert size={18} />}
                  label="Severity"
                  value={complaint.severity}
                />

                <ComplaintInfoCard
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={location}
                />

                <ComplaintInfoCard
                  icon={<Building2 size={18} />}
                  label="Department"
                  value={complaint.department}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Generated summary
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {complaint.summary}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Complaint timeline
                  </h2>

                  <p className="text-xs text-slate-500">
                    Current workflow progress
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {timelineStatuses.map((timelineStatus, index) => {
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
                            : active
                            ? "Current"
                            : "Completed"
                          : "Pending"
                      }
                      completed={completed}
                      active={active}
                      last={index === timelineStatuses.length - 1}
                    />
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {citizen && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-950">
                      Reported by
                    </h2>

                    <p className="text-xs text-slate-500">
                      Registered citizen account
                    </p>
                  </div>
                </div>

                <dl className="mt-6 space-y-4 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Name
                    </dt>

                    <dd className="mt-1 truncate font-semibold text-slate-700">
                      {citizen.name || "Not available"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </dt>

                    <dd className="mt-1 truncate font-semibold text-slate-700">
                      {citizen.email || "Not available"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </dt>

                    <dd className="mt-1 truncate font-semibold text-slate-700">
                      {citizen.phone || "Not available"}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Workflow status
                  </h2>

                  <p className="text-xs text-slate-500">
                    Complaints advance one step at a time
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current status
                </p>

                <p className="mt-1.5 text-sm font-bold text-slate-900">
                  {status}
                </p>
              </div>

              {nextStatus ? (
                <>
                  <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      Next status
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-blue-700">
                      {nextStatus}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-blue-600">
                      {getStatusDescription(nextStatus)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdvanceStatus}
                    disabled={saving}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <ArrowRight size={17} />
                        Advance to {nextStatus}
                      </>
                    )}
                  </button>
                </>
              ) : status === "Resolved" ? (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="text-xs leading-5 text-emerald-800">
                    This complaint is awaiting citizen confirmation.
                    Only the citizen who reported it can close it, so no
                    further status changes are available here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />

                  <p className="text-xs leading-5 text-slate-600">
                    This complaint is closed and the workflow is
                    complete. No further status changes are possible.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Department
                  </h2>

                  <p className="text-xs text-slate-500">
                    Reassign the responsible department
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="adminDepartment"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Department
                </label>

                <select
                  id="adminDepartment"
                  value={selectedDepartment}
                  onChange={(event) => {
                    setSelectedDepartment(event.target.value);
                    setSuccess("");
                    setError("");
                  }}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                >
                  {departments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save changes
                  </>
                )}
              </button>
            </section>

            <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                Current status
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Clock3 size={21} />
                </div>

                <div>
                  <p className="text-lg font-bold">{status}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Stored in MongoDB
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Department
                  </h2>

                  <p className="text-xs text-slate-500">
                    Current assignment
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold leading-6 text-slate-900">
                  {complaint.department}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Responsible department
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Complaint ID
              </p>

              <p className="mt-3 break-all font-mono text-lg font-bold text-slate-900">
                {complaintId}
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Use this ID to reference the complaint in the citizen tracking
                system.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ComplaintInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-bold leading-6 text-slate-900">
        {value}
      </p>
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
        {completed && <Check size={15} strokeWidth={3} />}
      </div>

      <div className="min-w-0 pb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <h3
            className={`text-sm font-bold ${
              completed || active
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            {title}
          </h3>

          <span className="text-xs font-medium text-slate-400">
            {date}
          </span>
        </div>

        <p
          className={`mt-2 text-xs leading-5 ${
            completed || active
              ? "text-slate-500"
              : "text-slate-400"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function getStatusDescription(status) {
  const descriptions = {
    Submitted: "The complaint has been received by the system.",
    "Under Review":
      "The complaint is being reviewed by the responsible team.",
    Assigned:
      "The complaint has been assigned to the responsible department.",
    "In Progress":
      "The responsible department is currently working on the issue.",
    Resolved:
      "The complaint has been marked as resolved and is awaiting citizen confirmation.",
    Closed:
      "The citizen confirmed the resolution and the complaint is closed.",
  };

  return descriptions[status] || "Complaint workflow status.";
}

export default ComplaintDetails;