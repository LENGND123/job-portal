import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Pen, Phone } from "lucide-react";
import api, { errorMessage, fileUrl } from "../lib/api";
import { formatDate, statusClass } from "../lib/format";
import { setUser } from "../redux/authSlice";
import { Button, Dialog, Field, Input, LetterAvatar, Spinner, TextArea, useToast } from "../components/ui";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", phoneNumber: "", bio: "", skills: "" });
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get("/api/v1/user/me"), api.get("/api/v1/application/get")])
      .then(([me, applied]) => {
        if (cancelled) return;
        dispatch(setUser(me.data.user));
        setApplications(applied.data.applications || []);
      })
      .catch((err) => {
        if (!cancelled) toast(errorMessage(err), "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, toast]);

  function openEditor() {
    setForm({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: (user?.profile?.skills || []).join(", "),
    });
    setPhoto(null);
    setResume(null);
    setOpen(true);
  }

  async function onSave(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("fullname", form.fullname);
    data.append("email", form.email);
    data.append("phoneNumber", form.phoneNumber);
    data.append("bio", form.bio);
    data.append("skills", form.skills);
    if (photo) data.append("profilePhoto", photo);
    if (resume) data.append("resume", resume);
    setSaving(true);
    try {
      const res = await api.post("/api/v1/user/profile/update", data);
      dispatch(setUser(res.data.user));
      setOpen(false);
      toast(res.data.message);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !user) return <Spinner />;

  const skills = user?.profile?.skills || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border border-gray-200 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <LetterAvatar name={user?.fullname} src={user?.profile?.profilePhoto} className="h-24 w-24 text-3xl" />
            <div>
              <h1 className="text-xl font-medium">{user?.fullname}</h1>
              <p className="mt-1 text-sm text-gray-600">{user?.profile?.bio || "Add a short bio."}</p>
            </div>
          </div>
          <Button variant="outline" className="h-10 w-10 px-0" aria-label="Edit profile" onClick={openEditor}>
            <Pen size={16} />
          </Button>
        </div>
        <div className="my-5 space-y-2 text-sm text-gray-700">
          <p className="flex items-center gap-3"><Mail size={16} /> {user?.email}</p>
          <p className="flex items-center gap-3"><Phone size={16} /> {user?.phoneNumber}</p>
        </div>
        <h2 className="font-semibold">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.length === 0 ? <p className="text-sm text-gray-500">No skills added yet.</p> : null}
          {skills.map((skill) => (
            <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-[#6A38C2]">
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <h2 className="font-semibold">Resume</h2>
          {user?.profile?.resume ? (
            <a href={fileUrl(user.profile.resume)} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
              {user.profile.resumeOriginalName || "Open resume"}
            </a>
          ) : (
            <p className="text-sm text-gray-500">No resume uploaded.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="my-5 text-lg font-bold">Applied Jobs</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Job Role", "Company", "Status"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.filter((item) => item.job).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-gray-500">You have not applied to any jobs yet.</td>
                </tr>
              ) : null}
              {applications.filter((item) => item.job).map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">{item.job.title}</td>
                  <td className="px-4 py-3">{item.job.company?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} title="Update profile" onClose={() => setOpen(false)}>
        <form onSubmit={onSave} className="space-y-4">
          <Field label="Full name">
            <Input required value={form.fullname} onChange={(event) => setForm({ ...form, fullname: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field label="Phone number">
            <Input required value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
          </Field>
          <Field label="Bio">
            <TextArea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </Field>
          <Field label="Skills">
            <Input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} placeholder="React, Node.js, Figma" />
          </Field>
          <Field label="Profile photo">
            <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
          </Field>
          <Field label="Resume">
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? "Please wait" : "Update"}</Button>
        </form>
      </Dialog>
    </div>
  );
}
