import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-100">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-8 md:flex-row md:items-center">
        <div>
          <p className="text-xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            © {new Date().getFullYear()} JobPortal. Search, apply, and hire in one place.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#6A38C2]">Home</Link>
          <Link to="/jobs" className="hover:text-[#6A38C2]">Jobs</Link>
          <Link to="/browse" className="hover:text-[#6A38C2]">Browse</Link>
        </div>
      </div>
    </footer>
  );
}
