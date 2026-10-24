import { useNavigate } from "react-router-dom";
import { BarChart3, Code2, Layers, PenTool, Server } from "lucide-react";

const categories = [
  { name: "Frontend Developer", icon: Code2 },
  { name: "Backend Developer", icon: Server },
  { name: "Data Science", icon: BarChart3 },
  { name: "Graphic Designer", icon: PenTool },
  { name: "FullStack Developer", icon: Layers },
];

export default function CategoryCarousel() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex max-w-5xl gap-3 overflow-x-auto px-4 py-6">
      {categories.map(({ name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => navigate(`/browse?q=${encodeURIComponent(name)}`)}
          className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium shadow-sm hover:border-[#6A38C2] hover:text-[#6A38C2]"
        >
          <Icon size={16} />
          {name}
        </button>
      ))}
    </section>
  );
}
