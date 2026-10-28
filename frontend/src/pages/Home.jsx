import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareText,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UserRound,
  Users,
} from "lucide-react";


function Home() {

  const features = [
    {
      icon: BrainCircuit,
      title: "Department Routing",
      description:
        "Your selected complaint category routes the report to the corresponding department.",
    },
    {
      icon: Target,
      title: "Clear Issue Categories",
      description:
        "Choose the category that best describes the civic problem you observed.",
    },
    {
      icon: TriangleAlert,
      title: "Urgency Selection",
      description:
        "Select Low, Medium or High urgency based on the situation.",
    },
    {
      icon: Network,
      title: "Department Routing",
      description:
        "Your complaint reaches the department responsible for the issue.",
    },
    {
      icon: MapPin,
      title: "Accurate Location Details",
      description:
        "Provide the area, nearby landmark, city and optional PIN code.",
    },
    {
      icon: Clock3,
      title: "Complaint Tracking",
      description:
        "Provide a clear way for citizens to follow the progress of reported issues.",
    },
  ];


  const categories = [
    {
      title: "Roads & Infrastructure",
      description: "Potholes, damaged roads and public infrastructure issues.",
      icon: "RI",
    },
    {
      title: "Sanitation",
      description: "Garbage accumulation, waste management and cleanliness.",
      icon: "SA",
    },
    {
      title: "Water Supply",
      description: "Water leakage, supply problems and drainage concerns.",
      icon: "WS",
    },
    {
      title: "Electrical",
      description: "Streetlights, electrical infrastructure and related issues.",
      icon: "EL",
    },
  ];


  return (
    <div className="overflow-hidden">


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative border-b border-slate-200 bg-white">

        {/* Background decoration */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl" />

          <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-slate-100 blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">


            {/* Hero copy */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700">

                <Sparkles size={14} />

                Smart city complaint portal

              </div>


              <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.08] tracking-[-1.8px] text-slate-950 sm:text-5xl lg:text-[62px] lg:tracking-[-2.8px]">

                Report civic issues.
                <br />

                <span className="text-blue-600">
                  We route them for you.
                </span>

              </h1>


              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">

                Citizens select a complaint category, describe the issue, provide its location and choose an urgency level. The system routes each report to the corresponding department.

              </p>


              {/* CTA */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/report"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                >

                  Report an Issue

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />

                </Link>


                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >

                  Track a Complaint

                </Link>

              </div>


              {/* Login options */}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Existing users can sign in
                </p>

                <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">

                  <Link
                    to="/login/citizen"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                  >

                    <UserRound size={16} className="text-blue-600" />

                    Citizen Login

                  </Link>


                  <Link
                    to="/admin/login"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                  >

                    <ShieldCheck size={16} className="text-slate-500" />

                    Admin Login

                  </Link>

                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Citizens sign in to report and track complaints.
                  Administrators sign in to the civic management workspace.
                </p>

              </div>


              {/* Small trust points */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                  <CheckCircle2
                    size={15}
                    className="text-emerald-500"
                  />

                  Quick complaint review

                </div>


                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                  <ShieldCheck
                    size={15}
                    className="text-emerald-500"
                  />

                  Right department, first time

                </div>

              </div>

            </div>


            {/* Hero visual */}

            <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">

              {/* Complaint review card */}

              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">

                {/* Window header */}

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white">
                      CI
                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-900">
                        Issue Review
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Category-based routing
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Reviewed

                  </div>

                </div>


                {/* Complaint */}

                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                  <div className="mb-2 flex items-center gap-2">

                    <MessageSquareText
                      size={14}
                      className="text-slate-400"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Citizen complaint
                    </span>

                  </div>

                  <p className="text-sm leading-6 text-slate-700">

                    "There is a large pothole near the school
                    gate and several vehicles are having trouble
                    passing through."

                  </p>

                </div>


                {/* Review result */}

                <div className="mt-5 space-y-3">

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-slate-100 bg-white p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Issue
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        Pothole
                      </p>

                    </div>


                    <div className="rounded-xl border border-slate-100 bg-white p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Severity
                      </p>

                      <div className="mt-1 flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-amber-500" />

                        <p className="text-sm font-bold text-slate-900">
                          High
                        </p>

                      </div>

                    </div>

                  </div>


                  <div className="rounded-xl border border-slate-100 bg-white p-3">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          Near School Gate
                        </p>

                      </div>

                      <MapPin
                        size={18}
                        className="text-blue-500"
                      />

                    </div>

                  </div>


                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                      Responsible department
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-900">
                      Roads & Infrastructure
                    </p>

                  </div>

                </div>


                {/* Processing footer */}

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

                  <BrainCircuit
                    size={14}
                    className="text-blue-500"
                  />

                  <span className="text-[10px] font-medium text-slate-400">
                    Sent to the responsible department
                  </span>

                </div>

              </div>


              {/* Floating badge */}

              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">

                    <CheckCircle2
                      size={18}
                      className="text-emerald-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-medium text-slate-400">
                      Complaint details
                    </p>

                    <p className="text-xs font-bold text-slate-900">
                      Ready for action
                    </p>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUE STRIP
      ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-5 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">

          <div className="flex items-center gap-4 py-6 md:px-7 md:first:pl-0">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

              <BrainCircuit
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                Fast review
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Submit structured complaint details
              </p>

            </div>

          </div>


          <div className="flex items-center gap-4 py-6 md:px-7">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

              <Network
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                Structured routing
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Identify the responsible department
              </p>

            </div>

          </div>


          <div className="flex items-center gap-4 py-6 md:px-7 md:last:pr-0">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

              <Users
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                Citizen-focused
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Simpler reporting and tracking
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              How it works
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From a complaint to the right department.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Choose the issue category, enter the location and describe the problem. The report is routed to the corresponding department.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">


            {/* Step 1 */}

            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex items-center justify-between">

                <span className="text-4xl font-extrabold tracking-tight text-slate-200">
                  01
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

                  <MessageSquareText
                    size={19}
                    className="text-blue-600"
                  />

                </div>

              </div>

              <h3 className="mt-8 text-base font-bold text-slate-900">
                Citizen reports an issue
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A citizen describes the civic problem using
                everyday language.
              </p>

            </div>


            {/* Step 2 */}

            <div className="relative rounded-2xl border border-blue-100 bg-blue-50/50 p-6">

              <div className="flex items-center justify-between">

                <span className="text-4xl font-extrabold tracking-tight text-blue-100">
                  02
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-blue-100">

                  <BrainCircuit
                    size={19}
                    className="text-blue-600"
                  />

                </div>

              </div>

              <h3 className="mt-8 text-base font-bold text-slate-900">
                We review the complaint
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The citizen provides the category, location, urgency and a clear description.
              </p>

            </div>


            {/* Step 3 */}

            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex items-center justify-between">

                <span className="text-4xl font-extrabold tracking-tight text-slate-200">
                  03
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

                  <ArrowUpRight
                    size={19}
                    className="text-blue-600"
                  />

                </div>

              </div>

              <h3 className="mt-8 text-base font-bold text-slate-900">
                The right department is assigned the complaint
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The department can then act on it and you can follow the
                progress.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Core capabilities
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Designed around the civic issue lifecycle.
              </h2>

            </div>


            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            >

              Explore the system

              <ArrowRight size={15} />

            </Link>

          </div>


          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (

                <div
                  key={feature.title}
                  className="bg-white p-6 transition-colors hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Icon size={19} />

                  </div>

                  <h3 className="mt-5 text-sm font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          ISSUE CATEGORIES
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Civic issue coverage
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Built for everyday civic problems.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Citizens can report common public issues using clear categories that map to the responsible department.
            </p>

          </div>


          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => (

              <div
                key={category.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xs font-extrabold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    {category.icon}
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 transition-colors group-hover:text-blue-500"
                  />

                </div>


                <h3 className="mt-6 text-sm font-bold text-slate-900">
                  {category.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {category.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CIVICTRACK
      ====================================================== */}

      <section className="bg-slate-950 py-20 text-white sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="grid items-center gap-14 lg:grid-cols-2">


            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                Why CivicTrack
              </p>

              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">

                Turn everyday complaints into real action.

              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">

                Citizens submit complaints using consistent fields, helping staff review reports and route them to the appropriate department.

              </p>


              <div className="mt-8 space-y-4">

                {[
                  "Submit a complaint with a clear category and description",
                  "Include the exact area, city and nearby landmark",
                  "Route reports to the corresponding department",
                  "Follow the progress of each complaint",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-blue-400"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* Information panel */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

              <div className="flex items-center justify-between border-b border-slate-800 pb-5">

                <div>

                  <p className="text-xs font-bold text-slate-300">
                    How your complaint is handled
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    From your description to the right department
                  </p>

                </div>

                <div className="rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-400">
                  Smart
                </div>

              </div>


              <div className="mt-6 space-y-3">


                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Your complaint
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    What you write about the problem
                  </p>

                </div>


                <div className="flex justify-center">

                  <div className="h-5 w-px bg-slate-700" />

                </div>


                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
                    We review it
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Issue, location, urgency and responsible department
                  </p>

                </div>


                <div className="flex justify-center">

                  <div className="h-5 w-px bg-slate-700" />

                </div>


                <div className="grid grid-cols-2 gap-3">

                  {[
                    "Issue",
                    "Location",
                    "Severity",
                    "Department",
                  ].map((item) => (

                    <div
                      key={item}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {item}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-300">
                        Detected
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

            <Sparkles size={21} />

          </div>


          <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">

            Have a civic issue to report?

          </h2>


          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">

            Select a category, provide the location and describe the
            issue. The selected category routes it to the relevant department.

          </p>


          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/report"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >

              Report an Issue

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5"
              />

            </Link>


            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >

              Learn about CivicTrack

            </Link>

          </div>


          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:gap-5">

            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Already registered
            </span>

            <Link
              to="/login/citizen"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
            >

              <UserRound size={15} />

              Citizen Login

            </Link>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
            >

              <ShieldCheck size={15} className="text-slate-400" />

              Admin Login

            </Link>

          </div>

        </div>

      </section>


    </div>
  );
}


export default Home;