import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getUserData, userFetch } from "../utils/userAuth";

const API_URL = "http://localhost:5000";
const MAX_DESCRIPTION_LENGTH = 1000;

function ReportIssue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [citizen] = useState(() => getUserData());

  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    landmark: "",
    city: "",
    postalCode: "",
    severity: "Medium",
  });

  const [originalComplaint, setOriginalComplaint] = useState(null);
  const [originalLoading, setOriginalLoading] = useState(false);
  const [originalError, setOriginalError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  // Day 4: set when the backend reports that this exact civic issue is
  // already active. `duplicate.sameCitizen` selects between the two
  // required messages. No complaint is created in either case.
  const [duplicate, setDuplicate] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followError, setFollowError] = useState("");

  const resubmitId = searchParams.get("resubmit") || "";

  const isResubmission = Boolean(
    originalComplaint && originalComplaint.status === "Resolved"
  );

  const loadOriginalComplaint = async () => {
    if (!resubmitId) {
      return;
    }

    try {
      setOriginalLoading(true);
      setOriginalError("");

      const response = await userFetch(
        `${API_URL}/api/complaints/${encodeURIComponent(resubmitId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to open this complaint for resubmission."
        );
      }

      setOriginalComplaint(data.complaint);
      setForm((current) => ({
        ...current,
        category: data.complaint.category || data.complaint.department || "",
        location: data.complaint.area || "",
        landmark: data.complaint.landmark || "",
        city: data.complaint.city || "",
        postalCode: data.complaint.postalCode || "",
        severity: data.complaint.severity || "Medium",
      }));
    } catch (requestError) {
      console.error("Resubmission lookup error:", requestError);
      setOriginalComplaint(null);
      setOriginalError(
        requestError.message ||
          "Unable to open this complaint for resubmission."
      );
    } finally {
      setOriginalLoading(false);
    }
  };

  useEffect(() => {
    loadOriginalComplaint();
  }, [resubmitId]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (duplicate) {
      setDuplicate(null);
    }

    if (followError) {
      setFollowError("");
    }

    if (field === "location") {
      setLocationError("");
    }
  };

  const resetForm = () => {
    setForm({
      category: "",
      description: "",
      location: "",
      landmark: "",
      city: "",
      postalCode: "",
      severity: "Medium",
    });
    setError("");
    setLocationError("");
    setDuplicate(null);
    setFollowError("");
  };

  // Day 4: the second citizen explicitly chooses to follow the existing
  // complaint. The relationship is stored with an idempotent backend call,
  // then the citizen is taken to the real tracking page for that ID.
  const handleFollowExisting = async () => {
    if (!duplicate?.complaintId || following) {
      return;
    }

    setFollowing(true);
    setFollowError("");

    try {
      const response = await userFetch(
        `${API_URL}/api/complaints/${encodeURIComponent(
          duplicate.complaintId
        )}/follow`,
        {
          method: "POST",
          body: JSON.stringify({ followToken: duplicate.followToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to start tracking this complaint."
        );
      }

      navigate(
        `/complaint/${encodeURIComponent(duplicate.complaintId)}`
      );
    } catch (requestError) {
      console.error("Follow existing complaint error:", requestError);
      setFollowError(
        requestError.message ||
          "Unable to start tracking this complaint right now."
      );
    } finally {
      setFollowing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const description = form.description.trim();
    const location = form.location.trim();
    const city = form.city.trim();

    if (!description) {
      setError(
        isResubmission
          ? "Please describe what is still unresolved before continuing."
          : "Please describe the civic issue before continuing."
      );
      return;
    }

    if (description.length < 10) {
      setError("Complaint must be at least 10 characters long.");
      return;
    }
    if (!form.category) {
      setError("Please select a complaint category.");
      return;
    }
    if (!location || !city) {
      setError("Please enter the issue area/street and city.");
      return;
    }
    if (form.postalCode.trim() && !/^\d{6}$/.test(form.postalCode.trim())) {
      setError("PIN code must contain exactly 6 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setLocationError("");
    setDuplicate(null);
    setFollowError("");

    try {
      const payload = {
        complaint: description,
        category: form.category,
        location,
        landmark: form.landmark.trim(),
        city,
        postalCode: form.postalCode.trim(),
        severity: form.severity,
      };

      if (isResubmission) {
        payload.originalComplaintId = originalComplaint.complaintId;
      }

      const response = await userFetch(`${API_URL}/api/complaints`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Day 4: a recognised duplicate is an expected outcome, not a server
      // error. The backend returns 409 with `duplicate: true`, so we show
      // the friendly duplicate panel instead of a generic error banner.
      if (!response.ok && data?.duplicate === true) {
        setError("");
        setLocationError("");
        setDuplicate({
          sameCitizen: Boolean(data.sameCitizen),
          complaintId: data.complaintId,
          status: data.status,
          followToken: data.followToken || "",
          existingComplaint: data.existingComplaint || null
        });
        return;
      }

      if (!response.ok) {
        const message =
          data?.error ||
          data?.message ||
          "Unable to submit the complaint.";

        const submissionError = new Error(message);
        submissionError.isLocationError = /location/i.test(message);

        throw submissionError;
      }

      if (!data?.complaint?.complaintId) {
        throw new Error("The server did not return a complaint ID.");
      }

      sessionStorage.removeItem("civicai_analysis");

      sessionStorage.setItem(
        "complaintData",
        JSON.stringify(data.complaint)
      );

      navigate("/analysis");
    } catch (submitError) {
      console.error("Complaint submission error:", submitError);

      const message =
        submitError.message ||
        "Something went wrong while submitting your complaint.";

      // Location problems are shown under the location field so the citizen
      // knows exactly what to fix; everything else uses the general banner.
      if (submitError.isLocationError) {
        setLocationError(message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
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
              {isResubmission ? (
                <RotateCcw size={14} />
              ) : (
                <Sparkles size={14} />
              )}
              {isResubmission
                ? "Resubmission"
                : "Smart reporting"}
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {isResubmission
                ? "Resubmit complaint"
                : "Report a civic issue"}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {isResubmission
                ? "Your previous complaint was marked as resolved, but you indicated that the issue still exists. Tell us what is still unresolved."
                : "Provide the issue category, location, urgency, and a clear description. Your complaint will be routed to the corresponding municipal department."}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-950">
                {isResubmission
                  ? "What is still unresolved?"
                  : "Tell us about the problem"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isResubmission
                  ? "Explain what is still wrong at the same location, or update the location if it has changed."
                  : "Choose the closest issue category and enter the location details so the right department can handle your report."}
              </p>
            </div>

            {originalLoading && (
              <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Loader2
                  size={18}
                  className="shrink-0 animate-spin text-blue-600"
                />

                <p className="text-sm font-medium text-slate-600">
                  Checking your complaint {resubmitId}...
                </p>
              </div>
            )}

            {originalError && (
              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <p className="text-sm font-bold text-amber-900">
                    This complaint cannot be resubmitted
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    {originalError} You can still report a new civic issue
                    below.
                  </p>
                </div>
              </div>
            )}

            {duplicate && (
              <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
                      {duplicate.sameCitizen
                        ? "Already registered"
                        : "Already reported"}
                    </p>

                    <h3 className="mt-2 font-display text-lg font-bold text-amber-950">
                      {duplicate.sameCitizen
                        ? "You have already registered this complaint."
                        : "This issue has already been reported."}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      {duplicate.sameCitizen
                        ? "Your existing complaint is still active. Please track it instead of submitting it again."
                        : `Complaint ID: ${duplicate.complaintId}. You can track the existing complaint to follow its progress.`}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-amber-200 bg-white/70 px-4 py-3 text-xs text-amber-900">
                      <span>
                        Complaint ID:{" "}
                        <span className="font-mono font-bold">
                          {duplicate.complaintId}
                        </span>
                      </span>

                      <span>
                        Current status:{" "}
                        <span className="font-bold">
                          {duplicate.status}
                        </span>
                      </span>

                      {duplicate.existingComplaint?.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-amber-500" />
                          {duplicate.existingComplaint.location}
                        </span>
                      )}
                    </div>

                    {duplicate.sameCitizen ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/complaint/${encodeURIComponent(
                              duplicate.complaintId
                            )}`
                          )
                        }
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
                      >
                        <Search size={16} />
                        Track Existing Complaint
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleFollowExisting}
                          disabled={following}
                          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {following ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Linking you to this complaint...
                            </>
                          ) : (
                            <>
                              <Search size={16} />
                              Track Existing Complaint
                            </>
                          )}
                        </button>

                        <p className="mt-3 text-xs leading-5 text-amber-800">
                          You will be able to follow the status of this
                          complaint. The other citizen's name, contact
                          details and their other complaints are never
                          shared with you.
                        </p>
                      </>
                    )}

                    {followError && (
                      <p className="mt-3 text-xs font-semibold text-red-700">
                        {followError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isResubmission && (
              <div className="mb-8 rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <RotateCcw
                    size={18}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
                      Original complaint
                    </p>

                    <p className="mt-2 font-mono text-sm font-bold text-slate-900">
                      {originalComplaint.complaintId}
                    </p>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {originalComplaint.issue}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {originalComplaint.description}
                    </p>

                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={13} className="text-slate-400" />
                      {originalComplaint.location ||
                        "Location not identified"}
                    </p>

                    <Link
                      to={`/complaint/${encodeURIComponent(
                        originalComplaint.complaintId
                      )}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:text-violet-900"
                    >
                      View original complaint
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <UserRound size={18} className="mt-0.5 shrink-0 text-blue-600" />

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-slate-900">
                  Reporting as {citizen?.name || "your CivicTrack account"}
                </p>

                <p className="mt-1 truncate text-xs leading-5 text-slate-500">
                  {citizen?.email
                    ? `${citizen.email}${
                        citizen.phone ? ` · ${citizen.phone}` : ""
                      }`
                    : "Your registered account details are attached to this complaint automatically."}
                </p>

              </div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-bold text-slate-800">Complaint category <span className="text-red-500">*</span></label>
                <select id="category" value={form.category} onChange={(event) => updateField("category", event.target.value)} disabled={loading} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60">
                  <option value="">Select the issue category</option>
                  <option value="Water Supply & Sewerage">Water supply and drainage / sewerage</option>
                  <option value="Roads & Infrastructure">Roads, potholes and footpaths</option>
                  <option value="Electricity & Street Lighting">Electricity and street lighting</option>
                  <option value="Solid Waste Management">Garbage and waste collection</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="description"
                    className="text-sm font-bold text-slate-800"
                  >
                    {isResubmission
                      ? "What is still unresolved?"
                      : "Describe the issue"}
                  </label>

                  <span className="text-xs font-medium text-slate-400">
                    {form.description.length}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>

                <textarea
                  id="description"
                  value={form.description}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Example: There is a large pothole near the main entrance of the community park. It is difficult for vehicles and two-wheelers to pass safely."
                  rows={8}
                  disabled={loading}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-400">
                  {isResubmission
                    ? "Explain what is still wrong, when you noticed it, and any impact you see now."
                    : "Describe what happened, where it happened, and any impact you noticed."}
                </p>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Location
                  <span className="ml-2 text-xs font-medium text-red-500">
                    Required
                  </span>
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="Street, sector, area or locality"
                    required
                    maxLength={180}
                    disabled={loading}
                    aria-invalid={Boolean(locationError)}
                    aria-describedby={locationError ? "location-error" : undefined}
                    className={`w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60 ${locationError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
                  />

                  {locationError ? (
                    <p
                      id="location-error"
                      className="mt-2 text-xs font-medium text-red-600"
                    >
                      {locationError}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">Enter the street, sector, neighbourhood, or area where the issue is located.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="landmark" className="mb-2 block text-sm font-bold text-slate-800">Nearby landmark <span className="text-xs font-medium text-slate-400">Optional</span></label>
                  <input id="landmark" value={form.landmark} onChange={(event) => updateField("landmark", event.target.value)} maxLength={180} placeholder="e.g. near community park gate" disabled={loading} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60" />
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-bold text-slate-800">City <span className="text-red-500">*</span></label>
                  <input id="city" value={form.city} onChange={(event) => updateField("city", event.target.value)} maxLength={100} required placeholder="e.g. Gandhinagar" disabled={loading} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="mb-2 block text-sm font-bold text-slate-800">PIN code <span className="text-xs font-medium text-slate-400">Optional</span></label>
                  <input id="postalCode" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit PIN code" disabled={loading} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60" />
                </div>
                <div>
                  <label htmlFor="severity" className="mb-2 block text-sm font-bold text-slate-800">Urgency level <span className="text-red-500">*</span></label>
                  <select id="severity" value={form.severity} onChange={(event) => updateField("severity", event.target.value)} disabled={loading} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60">
                    <option value="Low">Low — minor issue</option>
                    <option value="Medium">Medium — needs attention</option>
                    <option value="High">High — urgent / safety concern</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <h3 className="text-sm font-bold text-blue-900">
                      Complaint routing
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Your selected category determines the responsible department. The submitted location and urgency are saved with your complaint for staff review.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={17} />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting your complaint...
                    </>
                  ) : isResubmission ? (
                    <>
                      <RotateCcw size={18} />
                      Submit Resubmission
                    </>
                  ) : (
                    <>
                      Submit Complaint
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={21} />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-slate-950">
                How complaint tracking works
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Describe
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Explain the issue in your own words.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-600">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Review
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      We identify the issue, its location and how urgent it is.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Assigned
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your complaint is sent to the responsible department.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 text-emerald-600" />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    What you'll receive
                  </h3>

                  <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-500">
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                      Issue type
                    </li>

                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                      Responsible department
                    </li>

                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                      How urgent the issue is
                    </li>

                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                      Complaint tracking ID
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Info size={20} className="mt-0.5 text-blue-600" />

                <p className="text-xs leading-5 text-slate-500">
                  Your complaint is reviewed and saved as soon as you submit
                  it, and you will receive a complaint ID to track it.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ReportIssue;