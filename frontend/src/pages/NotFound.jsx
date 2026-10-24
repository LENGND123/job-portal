import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-500">That link does not match a page in JobPortal.</p>
        <Link to="/" className="mt-4 inline-block font-medium text-[#6A38C2]">Back home</Link>
      </div>
    </div>
  );
}
