import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../lib/api";
import { formatDate } from "../lib/format";
import { Button, LetterAvatar, Spinner, useToast } from "../components/ui";

export default function JobDescription() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/api/v1/job/get/${id}`)
      .then((res) => {
        if (cancelled) return;
        setJob(res.data.job);
        setApplied(Boolean(res.data.isApplied));
        setCount(res.data.applicationCount ?? res.data.job.applications?.length ?? 0);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, "Job not found."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function apply() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/description/${id}` } } });
      return;
    }
    if (user.role !== "student") return;
    setSaving(true);
    try {
      const res = await api.post(`/api/v1/application/apply/${id}`);
      setApplied(true);
      setCount((value) => value + 1);
      toast(res.data.message);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;
  if (error || !job) return <p className="px-4 py-16 text-center text-red-600">{error || "Job not found."}</p>;

  const rows = [
    ["Role", job.title],
    ["Location", job.location],
    ["Description", job.description],
    ["Requirements", (job.requirements || []).join(", ")],
    ["Experience", `${job.experienceLevel} yrs`],
    ["Salary", `${job.salary} LPA`],
    ["Total Applicants", String(count)],
    ["Posted Date", formatDate(job.createdAt)],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <LetterAvatar name={job.company?.name} src={job.company?.logo} className="h-16 w-16 text-xl" />
          <div>
            <h1 className="text-xl font-bold">{job.title}</h1>
            <p className="text-gray-500">{job.company?.name} · {job.location}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border px-2 py-1 text-xs font-semibold text-blue-700">{job.position} Positions</span>
              <span className="rounded-full border px-2 py-1 text-xs font-semibold text-[#F83002]">{job.jobType}</span>
              <span className="rounded-full border px-2 py-1 text-xs font-semibold text-[#7209b7]">{job.salary} LPA</span>
            </div>
          </div>
        </div>
        {user?.role === "recruiter" ? (
          <p className="text-sm text-gray-500">Recruiter accounts cannot apply.</p>
        ) : (
          <Button
            disabled={applied || saving}
            onClick={apply}
            className={applied ? "bg-gray-600 hover:bg-gray-600" : "bg-[#7209b7] hover:bg-[#5f0796]"}
          >
            {applied ? "Already Applied" : saving ? "Please wait" : "Apply Now"}
          </Button>
        )}
      </div>
      <h2 className="mt-8 border-b-2 border-gray-300 py-4 font-medium">Job Description</h2>
      <div className="max-w-4xl py-4">
        {rows.map(([label, value]) => (
          <p key={label} className="my-2 font-bold">
            {label}: <span className="pl-4 font-normal text-gray-800">{value}</span>
          </p>
        ))}
        {!user && (
          <p className="mt-4 text-sm text-gray-500">
            <Link to="/login" className="font-medium text-[#6A38C2]">Login</Link> as a student to apply.
          </p>
        )}
      </div>
    </div>
  );
}
