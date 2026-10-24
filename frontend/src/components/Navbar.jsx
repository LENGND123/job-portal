import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import api, { errorMessage } from "../lib/api";
import { logout } from "../redux/authSlice";
import { Button, LetterAvatar, useToast } from "./ui";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenu(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  async function onLogout() {
    try {
      await api.get("/api/v1/user/logout");
    } catch (error) {
      toast(errorMessage(error), "error");
    }
    dispatch(logout());
    setMenu(false);
    navigate("/");
    toast("Logged out.");
  }

  const links = user?.role === "recruiter"
    ? [
        ["/admin/companies", "Companies"],
        ["/admin/jobs", "Jobs"],
      ]
    : [
        ["/", "Home"],
        ["/jobs", "Jobs"],
        ["/browse", "Browse"],
      ];

  const linkClass = (to) => {
    const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
    return active ? "text-[#6A38C2]" : "text-gray-700 hover:text-[#6A38C2]";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Job<span className="text-[#F83002]">Portal</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-5 font-medium">
            {links.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className={linkClass(to)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Signup</Button>
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button aria-label="Account menu" onClick={() => setMenu((value) => !value)}>
                <LetterAvatar
                  name={user.fullname}
                  src={user.profile?.profilePhoto}
                  className="h-10 w-10 text-sm"
                />
              </button>
              {menu && (
                <div className="absolute right-0 top-12 w-64 rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
                  <p className="font-medium">{user.fullname}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {user.profile?.bio || (user.role === "recruiter" ? "Recruiter" : "Student")}
                  </p>
                  <div className="my-3 h-px bg-gray-100" />
                  {user.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setMenu(false)}
                    >
                      <UserRound size={16} /> View Profile
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button className="md:hidden" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-gray-100 px-4 py-4 md:hidden">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className={`block font-medium ${linkClass(to)}`}>
              {label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-2 pt-2">
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button>Signup</Button></Link>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              {user.role === "student" && (
                <Link to="/profile"><Button variant="outline">Profile</Button></Link>
              )}
              <Button variant="outline" onClick={onLogout}>Logout</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
