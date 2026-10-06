import { useState } from "react";
import { PlayCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import VideoModal from "../components/VideoModal";
import { onboardingSections } from "../data/onboarding";

export default function StartHere() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="max-w-7xl mx-auto pl-28 pr-8 py-8">
        {/* Header */}

        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Start Here
            </h1>

            <p className="mt-3 text-slate-600 text-lg">
              Everything you need to get started at Curious Media.
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

        {/* Welcome Card */}

        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-semibold">
            Welcome to Curious Media
          </h2>

          <p className="mt-3 text-slate-600">
            Start your onboarding journey by learning about our company,
            teams, culture, and the tools you'll use every day.
          </p>
        </div>

        {/* Onboarding Sections */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {onboardingSections.map((section) => {
            const hasVideo = Boolean(section.video);
            return (
              <button
                key={section.title}
                type="button"
                disabled={!hasVideo}
                onClick={() => hasVideo && setActiveSection(section)}
                className={`text-left bg-white border border-slate-200 rounded-3xl p-6 transition ${
                  hasVideo ? "hover:shadow-md cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  {hasVideo ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-full px-3 py-1">
                      <PlayCircle size={16} />
                      Watch
                    </span>
                  ) : (
                    <span className="shrink-0 text-sm text-slate-400">
                      Video coming soon
                    </span>
                  )}
                </div>

                <p className="mt-2 text-slate-600">{section.description}</p>

                {section.presenter && (
                  <p className="mt-3 text-sm text-slate-500">
                    Presented by {section.presenter}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {activeSection && (
          <VideoModal
            title={activeSection.title}
            video={activeSection.video}
            onClose={() => setActiveSection(null)}
          />
        )}

        {/* Progress Section */}

        <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-8">
          <h2 className="text-2xl font-semibold">
            Getting Started Checklist
          </h2>

          <div className="mt-6 space-y-4">

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Review Company Overview
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Meet Your Team
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Learn Department Structure
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Complete First Week Guide
            </label>

          </div>
        </div>

      </div>
    </div>
  );
}