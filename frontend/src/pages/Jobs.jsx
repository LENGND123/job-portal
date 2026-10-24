import { useMemo, useState } from "react";
import FilterCard from "../components/FilterCard";
import JobCard from "../components/JobCard";
import { Spinner } from "../components/ui";
import { useJobs } from "../hooks/useJobs";
import { matchesIndustry, salaryMatches } from "../lib/format";

export default function Jobs() {
  const { jobs, loading, error } = useJobs("");
  const [filters, setFilters] = useState({ Location: "", Industry: "", Salary: "" });

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const locationOk = !filters.Location || job.location.toLowerCase().includes(filters.Location.toLowerCase());
      const industryOk = matchesIndustry(job.title, filters.Industry);
      const salaryOk = salaryMatches(job.salary, filters.Salary);
      return locationOk && industryOk && salaryOk;
    });
  }, [jobs, filters]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 md:flex-row">
      <FilterCard value={filters} onChange={setFilters} />
      <div className="min-h-[50vh] flex-1 md:max-h-[88vh] md:overflow-y-auto md:pr-2">
        <h1 className="mb-4 text-xl font-bold">{loading ? "Jobs" : `${filtered.length} jobs found`}</h1>
        {loading ? <Spinner /> : null}
        {error ? <p className="text-red-600">{error}</p> : null}
        {!loading && !error && filtered.length === 0 ? (
          <p className="text-gray-500">No jobs match these filters.</p>
        ) : null}
        <div className="flex flex-col gap-4">
          {filtered.map((job, index) => (
            <JobCard key={job._id} job={job} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
