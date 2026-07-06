import Sidebar from "../components/Sidebar";

export default function Policies() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="max-w-7xl mx-auto pl-28 pr-8 py-8">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Company Policies
            </h1>

            <p className="mt-3 text-slate-600 text-lg">
              Review company guidelines, expectations, and workplace policies.
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="
              bg-white
              border
              border-slate-200
              rounded-xl
              px-4
              py-2
              shadow-sm
              hover:bg-slate-50
              transition
            "
          >
            ← Back
          </button>
        </div>

        {/* Policy Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-semibold">
              Attendance Policy
            </h2>

            <p className="mt-2 text-slate-600">
              Working hours, attendance expectations, and reporting procedures.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-semibold">
              Leave Policy
            </h2>

            <p className="mt-2 text-slate-600">
              Leave types, approval workflows, and time-off guidelines.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-semibold">
              Code of Conduct
            </h2>

            <p className="mt-2 text-slate-600">
              Professional standards, workplace behavior, and ethics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}