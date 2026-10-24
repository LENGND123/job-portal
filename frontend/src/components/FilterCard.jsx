import { FILTERS } from "../lib/constants";

export default function FilterCard({ value, onChange }) {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filter Jobs</h2>
        <button type="button" className="text-sm text-[#6A38C2]" onClick={() => onChange({})}>
          Clear
        </button>
      </div>
      <hr className="mt-3" />
      {FILTERS.map((group) => (
        <div key={group.filterType} className="mt-4">
          <h3 className="font-semibold">{group.filterType}</h3>
          {group.options.map((option) => {
            const selected = value[group.filterType] === option;
            return (
              <label key={option} className="my-2 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name={group.filterType}
                  checked={selected}
                  onChange={() => onChange({ ...value, [group.filterType]: option })}
                  onClick={() => {
                    if (selected) onChange({ ...value, [group.filterType]: "" });
                  }}
                />
                {option}
              </label>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
