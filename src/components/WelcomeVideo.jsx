import { resolveVideo } from "./VideoModal";

// Paste the leadership welcome video link here.
// YouTube (Unlisted), Google Drive ("Anyone with the link"), and Loom links all work.
const WELCOME_VIDEO = "";

export default function WelcomeVideo() {
  const video = resolveVideo(WELCOME_VIDEO);

  return (
    <section className="mt-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome from Leadership
        </h2>

        <p className="mt-2 text-slate-600">
          Learn about Curious Media, our culture, mission and how we work.
        </p>

        <div className="mt-6 max-w-4xl mx-auto overflow-hidden rounded-2xl bg-black">
          {video?.type === "iframe" ? (
            <iframe
              className="w-full aspect-video"
              src={video.src}
              title="Welcome from Leadership"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="w-full aspect-video" src={video?.src} controls />
          )}
        </div>
      </div>
    </section>
  );
}
