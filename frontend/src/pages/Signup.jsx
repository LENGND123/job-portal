import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../lib/api";
import { setUser } from "../redux/authSlice";
import DemoAccounts from "../components/DemoAccounts";
import { Button, Field, Input, useToast } from "../components/ui";
import { RolePicker } from "./Login";

export default function Signup() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
  });
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/api/v1/user/register", form);
      dispatch(setUser(res.data.user));
      toast(res.data.message);
      navigate(res.data.user.role === "recruiter" ? "/admin/companies" : "/");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f7f7fb] px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="mt-1 text-sm text-gray-500">Create a student or recruiter account.</p>
        <div className="mt-6 space-y-4">
          <Field label="Full name">
            <Input required value={form.fullname} onChange={(event) => setField("fullname", event.target.value)} placeholder="Priya Shah" />
          </Field>
          <Field label="Email">
            <Input required type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Phone number">
            <Input required value={form.phoneNumber} onChange={(event) => setField("phoneNumber", event.target.value)} placeholder="9876543210" />
          </Field>
          <Field label="Password">
            <Input required type="password" minLength={6} value={form.password} onChange={(event) => setField("password", event.target.value)} placeholder="At least 6 characters" />
          </Field>
          <RolePicker role={form.role} onChange={(role) => setField("role", role)} />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={saving}>
          {saving ? "Please wait" : "Signup"}
        </Button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="font-medium text-[#6A38C2]">Login</Link>
        </p>
        <DemoAccounts />
      </form>
    </div>
  );
}
