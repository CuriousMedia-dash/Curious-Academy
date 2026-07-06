import Sidebar from "../components/Sidebar";

export default function ModuleDetail() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="max-w-7xl mx-auto pl-28 pr-8 py-8">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Module Title
            </h1>

            <p className="mt-3 text-slate-600 text-lg">
              Learn key concepts, processes, and best practices through
              videos and resources.
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

        {/* Video Section */}

        <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Training Video
          </h2>

          <div className="overflow-hidden rounded-2xl">
            <iframe
              className="w-full h-[450px]"
              src="https://www.youtube.com/embed/jNQXAC9IVRw"
              title="Training Video"
              allowFullScreen
            />
          </div>
        </div>

        {/* Learning Objectives */}

        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold">
            Learning Objectives
          </h2>

          <ul className="mt-4 space-y-3 text-slate-700">
            <li>• Understand core concepts</li>
            <li>• Learn team workflows</li>
            <li>• Apply best practices</li>
            <li>• Review supporting resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}