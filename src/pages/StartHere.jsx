import Sidebar from "../components/Sidebar";

export default function StartHere() {
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

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-semibold">
              Company Overview
            </h3>

            <p className="mt-2 text-slate-600">
              Learn about our story, mission, vision, and values.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-semibold">
              Team Introduction
            </h3>

            <p className="mt-2 text-slate-600">
              Meet the departments and key people you'll work with.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-semibold">
              Departments
            </h3>

            <p className="mt-2 text-slate-600">
              Understand how each department contributes to the business.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-semibold">
              First Week Guide
            </h3>

            <p className="mt-2 text-slate-600">
              Recommended steps to complete during your first week.
            </p>
          </div>

        </div>

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