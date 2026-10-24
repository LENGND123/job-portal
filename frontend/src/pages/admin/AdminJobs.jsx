import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pen, Users } from "lucide-react";
import api, { errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { Button, Input, Spinner, useToast } from "../../components/ui";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    api
      .get("/api/v1/job/getadminjobs")
      .then((res) => setJobs(res.data.jobs || []))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const visible = jobs.filter((job) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return job.title.toLowerCase().includes(needle) || job.company?.name?.toLowerCase().includes(needle);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Input
          className="sm:max-w-xs"
          placeholder="Filter by role or company"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter jobs"
        />
        <Link to="/admin/jobs/create">
          <Button>New Job</Button>
        </Link>
      </div>
      {loading ? <Spinner /> : null}
      <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Company", "Role", "Date", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-gray-500">No jobs yet.</td>
              </tr>
            ) : null}
            {visible.map((job) => (
              <tr key={job._id} className="border-t">
                <td className="px-4 py-3">{job.company?.name}</td>
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">{formatDate(job.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/jobs/${job._id}`} aria-label={`Edit ${job.title}`} className="inline-flex rounded-md border border-gray-200 p-2 hover:bg-gray-50">
                      <Pen size={16} />
                    </Link>
                    <Link to={`/admin/jobs/${job._id}/applicants`} aria-label={`Applicants for ${job.title}`} className="inline-flex rounded-md border border-gray-200 p-2 hover:bg-gray-50">
                      <Users size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
