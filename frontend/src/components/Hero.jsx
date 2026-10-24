import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    const keyword = query.trim();
    navigate(keyword ? `/browse?q=${encodeURIComponent(keyword)}` : "/browse");
  }

  return (
    <section className="px-4 pb-6 pt-14 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-[#F83002]">
          No. 1 Job Hunt Website
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Search, Apply &
          <br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-500">
          Find roles that match your skills, apply in one click, and track every application from your profile.
        </p>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex w-full max-w-2xl overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find your dream jobs"
            aria-label="Search jobs"
            className="flex-1 px-5 py-3 outline-none"
          />
          <button type="submit" className="bg-[#6A38C2] px-8 font-medium text-white hover:bg-[#5b30a6]">
            Search
          </button>
        </form>
      </motion.div>
    </section>
  );
}
