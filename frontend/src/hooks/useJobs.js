import { useEffect, useState } from "react";
import api, { errorMessage } from "../lib/api";

export function useJobs(keyword = "") {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          const res = await api.get("/api/v1/job/get", { params: { keyword } });
          if (!cancelled) {
            setJobs(res.data.jobs || []);
            setLoading(false);
          }
          return;
        } catch (err) {
          const offline = !err.response;
          if (!offline || attempt === 5) {
            if (!cancelled) {
              setJobs([]);
              setError(errorMessage(err, "Could not load jobs."));
              setLoading(false);
            }
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [keyword]);

  return { jobs, loading, error };
}
