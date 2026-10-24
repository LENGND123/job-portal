import { Link } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import { Spinner } from "./ui";

export default function LatestJobs() {
  const { jobs, loading, error } = useJobs("");
  const latest = jobs.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-center text-3xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
      </h2>
      {loading ? <Spinner /> : null}
      {error ? <p className="mt-8 text-center text-red-600">{error}</p> : null}
      {!loading && !error && latest.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">No openings yet.</p>
      ) : null}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {latest.map((job, index) => (
          <JobCard key={job._id} job={job} index={index} />
        ))}
      </div>
      {latest.length > 0 && (
        <div className="mt-8 text-center">
          <Link to="/jobs" className="font-medium text-[#6A38C2]">
            View all jobs
          </Link>
        </div>
      )}
    </section>
  );
}
