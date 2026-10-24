import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api, { errorMessage } from "../../lib/api";
import { JOB_TYPES } from "../../lib/constants";
import { Button, Field, Input, Select, Spinner, TextArea, useToast } from "../../components/ui";

const empty = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "Full-time",
  experienceLevel: "",
  position: "",
  companyId: "",
};

export default function PostJob() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/v1/company/get")
      .then((res) => setCompanies(res.data.companies || []))
      .catch((err) => toast(errorMessage(err), "error"));
  }, [toast]);

  useEffect(() => {
    if (!id) return undefined;
    api
      .get(`/api/v1/job/get/${id}`)
      .then((res) => {
        const job = res.data.job;
        setForm({
          title: job.title || "",
          description: job.description || "",
          requirements: (job.requirements || []).join(", "),
          salary: job.salary ?? "",
          location: job.location || "",
          jobType: job.jobType || "Full-time",
          experienceLevel: job.experienceLevel ?? "",
          position: job.position ?? "",
          companyId: job.company?._id || "",
        });
      })
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
    return undefined;
  }, [id, toast]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!form.companyId) {
      toast("Create a company before posting a job.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        experienceLevel: Number(form.experienceLevel),
        position: Number(form.position),
      };
      const res = editing
        ? await api.put(`/api/v1/job/update/${id}`, payload)
        : await api.post("/api/v1/job/post", payload);
      toast(res.data.message);
      navigate("/admin/jobs");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="outline" onClick={() => navigate("/admin/jobs")}>
        <ArrowLeft size={16} /> Back
      </Button>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold">{editing ? "Edit job" : "Post a new job"}</h1>
        {companies.length === 0 ? (
          <p className="text-sm text-gray-600">
            You need a company first.{" "}
            <button type="button" className="font-medium text-[#6A38C2]" onClick={() => navigate("/admin/companies")}>
              Create one
            </button>
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <Input required value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="Frontend Developer" />
          </Field>
          <Field label="Location">
            <Input required value={form.location} onChange={(event) => setField("location", event.target.value)} placeholder="Bangalore" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <TextArea required rows={4} value={form.description} onChange={(event) => setField("description", event.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Requirements">
              <Input required value={form.requirements} onChange={(event) => setField("requirements", event.target.value)} placeholder="React, Node.js, MongoDB" />
            </Field>
          </div>
          <Field label="Salary (LPA)">
            <Input required type="number" min="0" step="0.1" value={form.salary} onChange={(event) => setField("salary", event.target.value)} />
          </Field>
          <Field label="Experience (years)">
            <Input required type="number" min="0" step="1" value={form.experienceLevel} onChange={(event) => setField("experienceLevel", event.target.value)} />
          </Field>
          <Field label="Open positions">
            <Input required type="number" min="1" step="1" value={form.position} onChange={(event) => setField("position", event.target.value)} />
          </Field>
          <Field label="Job type">
            <Select value={form.jobType} onChange={(event) => setField("jobType", event.target.value)}>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Company">
              <Select required value={form.companyId} onChange={(event) => setField("companyId", event.target.value)}>
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>{company.name}</option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Please wait" : editing ? "Update job" : "Post job"}</Button>
      </form>
    </div>
  );
}
