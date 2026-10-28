import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  MessageSquare,
  Route,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              <Sparkles size={14} />
              About CivicTrack
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Making civic issue reporting smarter and more structured.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              CivicTrack is a web-based civic complaint portal where residents submit structured reports and track progress as the relevant municipal department handles them.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Report an Issue
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Track Complaint
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                The problem
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Citizens know the problem. They shouldn't need to know the
                department.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                Civic complaints are often submitted as free-form
                descriptions. A citizen may know that a road is damaged, water
                is leaking, or a streetlight is not working, but may not know
                which municipal department should handle the issue.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                CivicTrack guides citizens to select the issue category and enter the location, urgency and description. The selected category determines the responsible department.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Citizen-entered complaint description",
                  "Required location and contact details",
                  "Citizen-selected category and urgency",
                  "Department-wise complaint routing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <BrainCircuit size={22} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                    Core idea
                  </p>

                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    Your complaint → the right department
                  </h3>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Citizen says
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  "There is a broken streetlight near the school entrance and
                  the road becomes very dark at night."
                </p>
              </div>

              <div className="my-4 flex justify-center">
                <ArrowRight size={20} className="rotate-90 text-blue-400" />
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Citizens select
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {["Issue", "Severity", "Location", "Department"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                How it works
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                From complaint to the right department in a few steps
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                The system is designed around a simple citizen experience, so
                reporting an issue takes only a moment.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <WorkflowCard
                number="01"
                icon={<FileText size={21} />}
                title="Citizen reports"
                description="The citizen describes the civic problem in their own words."
              />

              <WorkflowCard
                number="02"
                icon={<BrainCircuit size={21} />}
                title="Details entered"
                description="Choose the category, urgency and provide the location."
              />

              <WorkflowCard
                number="03"
                icon={<Target size={21} />}
                title="Complaint recorded"
                description="The complaint is saved with the selected details."
              />

              <WorkflowCard
                number="04"
                icon={<Route size={21} />}
                title="Department assigned"
                description="The complaint goes to the department responsible for it."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              Smart review
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              What is recorded with your complaint
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Choose a category, describe what happened, and enter where the issue is located. These details help staff review and manage your complaint.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <FeatureCard
              icon={<Search size={20} />}
              title="Issue"
              description="The category selected by the citizen."
            />

            <FeatureCard
              icon={<ShieldAlert size={20} />}
              title="Severity"
              description="The urgency level selected by the citizen."
            />

            <FeatureCard
              icon={<MapPin size={20} />}
              title="Location"
              description="Area, landmark, city and optional PIN code entered by the citizen."
            />

            <FeatureCard
              icon={<Building2 size={20} />}
              title="Department"
              description="Determines the department that should handle the issue."
            />

            <FeatureCard
              icon={<FileText size={20} />}
              title="Summary"
              description="Creates a concise structured summary of the complaint."
            />
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Zap size={21} />
                </div>

                <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Built around a simple principle
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                  Let citizens explain problems naturally. We take care of
                  working out the details and sending each complaint onward.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DarkFeature
                  icon={<MessageSquare size={20} />}
                  title="Citizen-friendly"
                  description="No technical knowledge is required to report an issue."
                />

                <DarkFeature
                  icon={<BrainCircuit size={20} />}
                  title="Smart review"
                  description="Complaints written in everyday words are read and checked."
                />

                <DarkFeature
                  icon={<Route size={20} />}
                  title="Right department"
                  description="Each complaint is assigned to the team best suited to fix it."
                />

                <DarkFeature
                  icon={<ShieldCheck size={20} />}
                  title="Human-oriented"
                  description="The process is designed to support departments and oversight."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles size={21} />
            </div>

            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-slate-950">
              Ready to report a civic issue?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Describe the problem in your own words and we will take it from
              there.
            </p>

            <Link
              to="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report an Issue
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function WorkflowCard({ number, icon, title, description }) {
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="font-mono text-xs font-bold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function DarkFeature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold text-white">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

export default About;