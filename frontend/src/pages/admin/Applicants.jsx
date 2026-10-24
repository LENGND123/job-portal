import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api, { errorMessage, fileUrl } from "../../lib/api";
import { formatDate, statusClass } from "../../lib/format";
import { Button, Spinner, useToast } from "../../components/ui";

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/v1/application/${id}/applicants`)
      .then((res) => {
        setJob(res.data.job);
        setRows(res.data.applications || []);
      })
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  async function onStatus(item, status) {
    const previous = item.status;
    setRows((list) => list.map((row) => (row._id === item._id ? { ...row, status } : row)));
    try {
      await api.post(`/api/v1/application/status/${item._id}/update`, { status });
      toast("Status updated.");
    } catch (err) {
      setRows((list) => list.map((row) => (row._id === item._id ? { ...row, status: previous } : row)));
      toast(errorMessage(err), "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button variant="outline" onClick={() => navigate("/admin/jobs")}>
        <ArrowLeft size={16} /> Back
      </Button>
      <h1 className="mt-6 text-xl font-bold">
        Applicants {job?.title ? `for ${job.title}` : ""} ({rows.length})
      </h1>
      <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Full name", "Email", "Contact", "Resume", "Date", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-500">No one has applied yet.</td>
              </tr>
            ) : null}
            {rows.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-3">{item.applicant?.fullname}</td>
                <td className="px-4 py-3">{item.applicant?.email}</td>
                <td className="px-4 py-3">{item.applicant?.phoneNumber}</td>
                <td className="px-4 py-3">
                  {item.applicant?.profile?.resume ? (
                    <a className="text-blue-600 hover:underline" href={fileUrl(item.applicant.profile.resume)} target="_blank" rel="noreferrer">
                      {item.applicant.profile.resumeOriginalName || "Resume"}
                    </a>
                  ) : (
                    "NA"
                  )}
                </td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for ${item.applicant?.fullname || "applicant"}`}
                    value={item.status}
                    onChange={(event) => onStatus(item, event.target.value)}
                    className={`rounded-md border px-2 py-1 text-sm ${statusClass(item.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
