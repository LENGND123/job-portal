import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api, { errorMessage, fileUrl } from "../../lib/api";
import { Button, Field, Input, Spinner, TextArea, useToast } from "../../components/ui";

export default function CompanySetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name: "", description: "", website: "", location: "" });

  useEffect(() => {
    api
      .get(`/api/v1/company/get/${id}`)
      .then((res) => {
        const company = res.data.company;
        setForm({
          name: company.name || "",
          description: company.description || "",
          website: company.website || "",
          location: company.location || "",
        });
        setLogo(company.logo || "");
      })
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("website", form.website);
    data.append("location", form.location);
    if (file) data.append("logo", file);
    setSaving(true);
    try {
      const res = await api.put(`/api/v1/company/update/${id}`, data);
      setLogo(res.data.company.logo || "");
      setFile(null);
      toast(res.data.message);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Button variant="outline" onClick={() => navigate("/admin/companies")}>
        <ArrowLeft size={16} /> Back
      </Button>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold">Company setup</h1>
        {(preview || logo) && (
          <img src={preview || fileUrl(logo)} alt="" className="h-16 w-16 rounded-md border object-cover" />
        )}
        <Field label="Company name">
          <Input required value={form.name} onChange={(event) => setField("name", event.target.value)} />
        </Field>
        <Field label="Description">
          <TextArea rows={4} value={form.description} onChange={(event) => setField("description", event.target.value)} />
        </Field>
        <Field label="Website">
          <Input value={form.website} onChange={(event) => setField("website", event.target.value)} placeholder="https://" />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(event) => setField("location", event.target.value)} placeholder="Bangalore" />
        </Field>
        <Field label="Logo">
          <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </Field>
        <Button type="submit" disabled={saving}>{saving ? "Please wait" : "Update"}</Button>
      </form>
    </div>
  );
}
