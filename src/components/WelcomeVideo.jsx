export default function WelcomeVideo() {
  return (
    <section className="mt-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Welcome from Leadership
        </h2>

        <p className="mt-2 text-slate-600">
          Learn about Curious Media, our culture, mission and how we work.
        </p>

        <div className="mt-6 max-w-4xl mx-auto overflow-hidden rounded-2xl">
  <iframe
    className="w-full aspect-video"
    src="https://www.youtube.com/embed/jNQXAC9IVRw"
    title="Welcome Video"
    allowFullScreen
  />
</div>

      </div>
    </section>
  );
}