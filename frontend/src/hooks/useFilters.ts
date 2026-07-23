import { useMemo, useState } from "react";
import { type Job } from "./useJobs";
import { type JobStatus } from "../types/job";

type StatusFilter = "ALL" | JobStatus;

export function useFilters(jobs: Job[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return [...jobs]
      .filter((job) => {
        if (statusFilter !== "ALL" && job.status !== statusFilter) return false;
        if (!normalizedQuery) return true;
        return (
          job.company.toLowerCase().includes(normalizedQuery) ||
          job.role.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
      );
  }, [jobs, searchTerm, statusFilter]);

  const hasFilters = Boolean(searchTerm.trim()) || statusFilter !== "ALL";

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredJobs,
    hasFilters,
    handleClearFilters
  };
}
