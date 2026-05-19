import { useEffect, useState } from "react";
import api from "../services/api";

export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type Job = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  notes: string | null;
  appliedDate: string;
  createdAt: string;
};

export default function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.get<Job[]>("/jobs");
      setJobs(response.data);
    } catch {
      setError("We could not load your applications right now.");
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (payload: Omit<Job, "id" | "createdAt">) => {
    const response = await api.post<Job>("/jobs", payload);
    setJobs((previous) => [response.data, ...previous]);
    return response.data;
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  return {
    jobs,
    setJobs,
    loading,
    error,
    loadJobs,
    createJob
  } as const;
}
