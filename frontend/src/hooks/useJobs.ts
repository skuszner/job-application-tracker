import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";
import { type Job } from "../types/job";

export type { Job, JobStatus } from "../types/job";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const latestLoadRef = useRef(0);

  const loadJobs = useCallback(async () => {
    const requestId = ++latestLoadRef.current;

    setError(null);
    setLoading(true);

    try {
      const response = await api.get<Job[]>("/jobs");
      if (!isMountedRef.current || requestId !== latestLoadRef.current) return;
      setJobs(response.data);
    } catch {
      if (!isMountedRef.current || requestId !== latestLoadRef.current) return;
      setError("We could not load your applications right now.");
    } finally {
      if (isMountedRef.current && requestId === latestLoadRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const createJob = async (payload: Omit<Job, "id" | "createdAt">) => {
    const response = await api.post<Job>("/jobs", payload);
    setJobs((previous) => [response.data, ...previous]);
    return response.data;
  };

  const updateJob = async (
    id: string,
    payload: Partial<Omit<Job, "id" | "createdAt">>
  ) => {
    const response = await api.put<Job>(`/jobs/${id}`, payload);
    setJobs((previous) =>
      previous.map((j) => (j.id === id ? response.data : j))
    );
    return response.data;
  };

  const deleteJob = async (id: string) => {
    await api.delete(`/jobs/${id}`);
    setJobs((previous) => previous.filter((j) => j.id !== id));
  };

  useEffect(() => {
    isMountedRef.current = true;
    void loadJobs();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadJobs]);

  return {
    jobs,
    loading,
    error,
    loadJobs,
    createJob,
    updateJob,
    deleteJob
  } as const;
}
