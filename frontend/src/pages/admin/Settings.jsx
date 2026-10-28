import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Database,
  Globe2,
  LockKeyhole,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    complaintRouting: true,
    autoRouting: true,
    maintenanceMode: false,
  });

  const updateSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage complaint workflow preferences and
            administration settings.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<SettingsIcon size={19} />}
              title="General settings"
              description="Basic preferences for the complaint management workspace."
            />

            <div className="divide-y divide-slate-100">
              <SettingRow
                icon={<Globe2 size={18} />}
                title="System language"
                description="Language used across the administration interface."
                control={
                  <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Gujarati</option>
                  </select>
                }
              />

              <SettingRow
                icon={<Database size={18} />}
                title="Data management"
                description="Manage complaint records and system data in future releases."
                control={
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                    Prototype
                  </span>
                }
              />

              <SettingRow
                icon={<SlidersHorizontal size={18} />}
                title="Default complaint view"
                description="Choose the default layout used when opening complaints."
                control={
                  <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                    <option>List view</option>
                    <option>Detailed view</option>
                  </select>
                }
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Bell size={19} />}
              title="Notifications"
              description="Control administrative alerts and system notifications."
            />

            <div className="divide-y divide-slate-100">
              <ToggleRow
                title="System notifications"
                description="Receive notifications about important complaint activity."
                enabled={settings.notifications}
                onChange={() => updateSetting("notifications")}
              />

              <ToggleRow
                title="Email alerts"
                description="Receive email notifications for important administrative events."
                enabled={settings.emailAlerts}
                onChange={() => updateSetting("emailAlerts")}
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Sparkles size={19} />}
              title="Complaint categorisation"
              description="Configure complaint intake and processing preferences."
            />

            <div className="divide-y divide-slate-100">
              <ToggleRow
                title="Complaint categorisation"
                description="Use the language model to structure incoming citizen complaints."
                enabled={settings.complaintRouting}
                onChange={() => updateSetting("complaintRouting")}
              />

              <ToggleRow
                title="Automatic department routing"
                description="Use the citizen-selected category to route complaints to the relevant department."
                enabled={settings.autoRouting}
                onChange={() => updateSetting("autoRouting")}
              />
            </div>

            <div className="m-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:m-6">
              <div className="flex gap-3">
                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-bold text-blue-900">
                    Complaint categorisation pipeline
                  </p>

                  <p className="mt-2 text-xs leading-5 text-blue-700">
                    Citizen submits category, description, location and urgency → complaint record is created → department reviews and updates status.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<ShieldCheck size={19} />}
              title="Security"
              description="Administration access and security controls."
            />

            <div className="divide-y divide-slate-100">
              <SettingRow
                icon={<LockKeyhole size={18} />}
                title="Administrator authentication"
                description="Secure authentication will be connected during the implementation phase."
                control={
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
                    Coming later
                  </span>
                }
              />

              <SettingRow
                icon={<ShieldCheck size={18} />}
                title="Role-based access"
                description="Different administrator permissions can be introduced when authentication is implemented."
                control={
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                    Planned
                  </span>
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-red-900">
                  Maintenance mode
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Temporarily restrict system access during maintenance.
                </p>
              </div>

              <Toggle
                enabled={settings.maintenanceMode}
                onChange={() => updateSetting("maintenanceMode")}
              />
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Settings shown here are currently UI prototype controls.
            </p>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Save size={17} />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 p-6 sm:p-7">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, description, control }) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex gap-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">{title}</p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{control}</div>
    </div>
  );
}

function ToggleRow({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 p-6 sm:p-7">
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        enabled ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default Settings;