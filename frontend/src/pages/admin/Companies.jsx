import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";
import api, { errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { Button, Dialog, Field, Input, LetterAvatar, Spinner, useToast } from "../../components/ui";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    api
      .get("/api/v1/company/get")
      .then((res) => setCompanies(res.data.companies || []))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const visible = companies.filter((company) => company.name.toLowerCase().includes(query.trim().toLowerCase()));

  async function createCompany(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/api/v1/company/register", { name });
      toast(res.data.message);
      navigate(`/admin/companies/${res.data.company._id}`);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Input
          className="sm:max-w-xs"
          placeholder="Filter by name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter companies by name"
        />
        <Button onClick={() => setOpen(true)}>New Company</Button>
      </div>
      {loading ? <Spinner /> : null}
      <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Logo", "Name", "Date", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-gray-500">No companies yet. Create one to post a job.</td>
              </tr>
            ) : null}
            {visible.map((company) => (
              <tr key={company._id} className="border-t">
                <td className="px-4 py-3">
                  <LetterAvatar name={company.name} src={company.logo} className="h-10 w-10 text-sm" />
                </td>
                <td className="px-4 py-3 font-medium">{company.name}</td>
                <td className="px-4 py-3">{formatDate(company.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/companies/${company._id}`}
                    aria-label={`Edit ${company.name}`}
                    className="inline-flex rounded-md border border-gray-200 p-2 hover:bg-gray-50"
                  >
                    <Pen size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} title="New company" onClose={() => setOpen(false)}>
        <form onSubmit={createCompany} className="space-y-4">
          <p className="text-sm text-gray-500">Give the company a name. You can add the logo and details next.</p>
          <Field label="Company name">
            <Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Northstar" />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? "Please wait" : "Continue"}</Button>
        </form>
      </Dialog>
    </div>
  );
}
