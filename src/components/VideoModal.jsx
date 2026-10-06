import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Turns common share links into embeddable URLs.
// Returns { type: "iframe" | "video", src }.
export function resolveVideo(url) {
  if (!url) return null;

  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive)
    return { type: "iframe", src: `https://drive.google.com/file/d/${drive[1]}/preview` };

  const loom = url.match(/loom\.com\/share\/([\w]+)/);
  if (loom) return { type: "iframe", src: `https://www.loom.com/embed/${loom[1]}` };

  // Anything else is treated as a direct video file (e.g. /videos/company-overview.mp4)
  return { type: "video", src: url };
}

export default function VideoModal({ title, videos = [], onClose }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const resolved = resolveVideo(videos[current]?.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {videos.length > 1 && (
          <div className="flex gap-2 px-6 py-3 border-b border-slate-200">
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  i === current
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        <div className="bg-black">
          {resolved?.type === "iframe" ? (
            <iframe
              key={resolved.src}
              className="w-full aspect-video"
              src={resolved.src}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={resolved?.src}
              className="w-full aspect-video"
              src={resolved?.src}
              controls
              autoPlay
              controlsList="nodownload"
            />
          )}
        </div>
      </div>
    </div>
  );
}
