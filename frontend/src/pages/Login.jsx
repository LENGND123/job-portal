import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../lib/api";
import { setUser } from "../redux/authSlice";
import DemoAccounts from "../components/DemoAccounts";
import { Button, Field, Input, useToast } from "../components/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/api/v1/user/login", { email, password, role });
      const user = res.data.user;
      dispatch(setUser(user));
      toast(res.data.message);
      const from = location.state?.from?.pathname;
      if (from && user.role === "recruiter" && from.startsWith("/admin")) navigate(from);
      else if (from && user.role === "student" && !from.startsWith("/admin")) navigate(from);
      else navigate(user.role === "recruiter" ? "/admin/companies" : "/");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f7f7fb] px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back. Pick your role and continue.</p>
        <div className="mt-6 space-y-4">
          <Field label="Email">
            <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <Input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          </Field>
          <RolePicker role={role} onChange={setRole} />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={saving}>
          {saving ? "Please wait" : "Login"}
        </Button>
        <p className="mt-4 text-center text-sm">
          New here? <Link to="/signup" className="font-medium text-[#6A38C2]">Create an account</Link>
        </p>
        <DemoAccounts />
      </form>
    </div>
  );
}

export function RolePicker({ role, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">I am a</p>
      <div className="flex gap-2">
        {[
          ["student", "Student"],
          ["recruiter", "Recruiter"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${role === value ? "bg-[#6A38C2] text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
