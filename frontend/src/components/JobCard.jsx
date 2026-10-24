import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { timeAgo } from "../lib/format";
import { LetterAvatar } from "./ui";

export default function JobCard({ job, index = 0 }) {
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        to={`/description/${job._id}`}
        className="block rounded-md border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
      >
        <p className="text-xs text-gray-400">{timeAgo(job.createdAt)}</p>
        <div className="my-2 flex items-center gap-3">
          <LetterAvatar name={job.company?.name} src={job.company?.logo} className="h-12 w-12" />
          <div>
            <h3 className="font-medium">{job.company?.name}</h3>
            <p className="text-sm text-gray-500">{job.location}</p>
          </div>
        </div>
        <h2 className="my-2 text-lg font-bold">{job.title}</h2>
        <p className="line-clamp-2 text-sm text-gray-600">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-blue-700">
            {job.position} Positions
          </span>
          <span className="rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-[#F83002]">
            {job.jobType}
          </span>
          <span className="rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-[#7209b7]">
            {job.salary} LPA
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
