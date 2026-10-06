import { useState } from "react";
import { PlayCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import VideoModal from "../components/VideoModal";
import { trainingModules, getVideos } from "../data/modules";

export default function LearningHub() {
  const [activeModule, setActiveModule] = useState(null);

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

        {/* Training Modules */}

        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Training Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingModules.map((module) => {
            const videos = getVideos(module);
            const hasVideo = videos.length > 0;
            return (
              <button
                key={module.title}
                type="button"
                disabled={!hasVideo}
                onClick={() => hasVideo && setActiveModule(module)}
                className={`text-left bg-white border border-slate-200 rounded-3xl p-6 transition ${
                  hasVideo ? "hover:shadow-md cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{module.title}</h3>
                  {hasVideo ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-full px-3 py-1">
                      <PlayCircle size={16} />
                      {videos.length > 1 ? `${videos.length} parts` : "Watch"}
                    </span>
                  ) : (
                    <span className="shrink-0 text-sm text-slate-400">
                      Video coming soon
                    </span>
                  )}
                </div>

                <p className="mt-2 text-slate-600">{module.description}</p>
              </button>
            );
          })}
        </div>

        {activeModule && (
          <VideoModal
            title={activeModule.title}
            videos={getVideos(activeModule)}
            onClose={() => setActiveModule(null)}
          />
        )}
      </div>
    </div>
  );
}
