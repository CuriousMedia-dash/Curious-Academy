import { useNavigate } from "react-router-dom";
import { navigationCards } from "../data/navigation";

export default function NavigationCards() {
  const navigate = useNavigate();

  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {navigationCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="
              bg-white
              border
              border-slate-200
              rounded-3xl
              p-6
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <h3 className="text-2xl font-bold text-slate-900">
              {card.title}
            </h3>

            <p className="mt-3 text-slate-600">
              {card.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {card.items.map((item) => (
                <span
                  key={item}
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-slate-100
                    text-slate-700
                    text-sm
                  "
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-blue-600 font-medium">
                {card.linkText} →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}