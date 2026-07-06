import Sidebar from "../components/Sidebar";

export default function LearningHub() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="max-w-7xl mx-auto pl-28 pr-8 py-8">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Learning Hub
            </h1>

            <p className="mt-3 text-slate-600 text-lg">
              Explore training modules, resources, and learning materials.
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

        {/* Learning Hub Content */}

        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold">
            Training Modules
          </h2>

          <p className="mt-3 text-slate-600">
            Your learning modules will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}