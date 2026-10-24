import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import { Spinner } from "../components/ui";
import { useJobs } from "../hooks/useJobs";

export default function Browse() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const { jobs, loading, error } = useJobs(query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {query ? `Search results for "${query}"` : "Browse jobs"}{" "}
        <span className="text-lg font-medium text-gray-400">({loading ? "…" : jobs.length})</span>
      </h1>
      {loading ? <Spinner /> : null}
      {error ? <p className="mt-6 text-red-600">{error}</p> : null}
      {!loading && !error && jobs.length === 0 ? (
        <p className="mt-6 text-gray-500">No jobs matched that search.</p>
      ) : null}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <JobCard key={job._id} job={job} index={index} />
        ))}
      </div>
    </div>
  );
}
