import { useState } from "react";
import { type Job } from "./useJobs";
import {
  createInitialJobFormValues,
  normalizeJobFormValues,
  validateJobFormValues,
  type JobFormErrors,
  type JobFormValues
} from "../utils/jobForm";

type CreateJobPayload = Omit<Job, "id" | "createdAt">;

export function useNewJobForm(
  createJob: (payload: CreateJobPayload) => Promise<Job>,
  onSuccess?: () => void
) {
  const [newJob, setNewJob] = useState<JobFormValues>(
    createInitialJobFormValues
  );
  const [newJobErrors, setNewJobErrors] = useState<JobFormErrors>({});
  const [creatingJob, setCreatingJob] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const resetNewJob = () => {
    setNewJob(createInitialJobFormValues());
    setNewJobErrors({});
    setAddError(null);
  };

  const handleNewJobChange = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K]
  ) => {
    setNewJob((prev) => ({ ...prev, [key]: value }));
    setNewJobErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleCreateJob = async () => {
    const validationErrors = validateJobFormValues(newJob);
    if (Object.keys(validationErrors).length > 0) {
      setNewJobErrors(validationErrors);
      return false;
    }

    setCreatingJob(true);
    setAddError(null);

    try {
      await createJob(normalizeJobFormValues(newJob));

      resetNewJob();
      onSuccess?.();
      return true;
    } catch {
      setAddError("We could not save this application. Please try again.");
      return false;
    } finally {
      setCreatingJob(false);
    }
  };

  return {
    newJob,
    newJobErrors,
    creatingJob,
    addError,
    handleNewJobChange,
    handleCreateJob,
    resetNewJob
  } as const;
}
