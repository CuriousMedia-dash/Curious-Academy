import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, isAdmin, signOut } = useAuth();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Start Here", path: "/start-here" },
    { label: "Learning Hub", path: "/learning-hub" },
    { label: "Playbooks", path: "/playbooks" },
    { label: "Policies", path: "/policies" },
    { label: "Meet Team", path: "/team" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            top-4
            left-4
            z-50
            bg-white
            shadow-md
            border
            border-slate-200
            rounded-xl
            w-12
            h-12
            flex
            items-center
            justify-center
            text-xl
            hover:bg-slate-50
          "
        >
          ☰
        </button>
      )}

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="
  fixed
  inset-0
  bg-transparent
  z-40
"
          />

          <aside
            className="
              fixed
              top-0
              left-0
              h-screen
              w-72
              bg-white
              shadow-2xl
              z-50
              p-6
              flex
              flex-col
            "
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-xl text-slate-900">
                  Curious Media
                </h2>

                <p className="text-sm text-slate-500">
                  Employee Handbook
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                  w-8
                  h-8
                  rounded-lg
                  hover:bg-slate-100
                "
              >
                ✕
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="
                    w-full
                    text-left
                    p-3
                    rounded-xl
                    hover:bg-slate-100
                    transition
                  "
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {profile && (
              <div className="mt-auto pt-4 border-t border-slate-200">
                <p className="font-medium text-slate-900">{profile.full_name}</p>
                <p className="text-sm text-slate-500 break-all">{profile.email}</p>
                <p className="text-xs text-slate-400">{isAdmin ? "Admin" : "Employee"}</p>
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/login", { replace: true });
                  }}
                  className="mt-3 w-full flex items-center gap-2 p-3 rounded-xl text-red-700 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}