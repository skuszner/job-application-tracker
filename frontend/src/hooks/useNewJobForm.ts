import { useState } from "react";
import { type Job } from "./useJobs";
import {
  type JobFormErrors,
  type JobFormValues
} from "../components/JobFormFields";

type CreateJobPayload = Omit<Job, "id" | "createdAt">;

function createInitialJob(): JobFormValues {
  return {
    company: "",
    role: "",
    status: "APPLIED",
    appliedDate: new Date().toISOString().slice(0, 10),
    notes: ""
  };
}

function validateJob(values: JobFormValues): JobFormErrors {
  const errors: JobFormErrors = {};

  if (!values.company.trim()) errors.company = "Company is required.";
  if (!values.role.trim()) errors.role = "Role is required.";
  if (
    !values.appliedDate ||
    Number.isNaN(new Date(values.appliedDate).getTime())
  ) {
    errors.appliedDate = "Use a valid application date.";
  }

  return errors;
}

export function useNewJobForm(
  createJob: (payload: CreateJobPayload) => Promise<Job>,
  onSuccess?: () => void
) {
  const [newJob, setNewJob] = useState<JobFormValues>(createInitialJob);
  const [newJobErrors, setNewJobErrors] = useState<JobFormErrors>({});
  const [creatingJob, setCreatingJob] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const resetNewJob = () => {
    setNewJob(createInitialJob());
    setNewJobErrors({});
    setAddError(null);
  };

  const handleNewJobChange = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K]
  ) => {
    setNewJob((previous) => ({ ...previous, [key]: value }));
    setNewJobErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const handleCreateJob = async () => {
    const validationErrors = validateJob(newJob);
    if (Object.keys(validationErrors).length > 0) {
      setNewJobErrors(validationErrors);
      return false;
    }

    setCreatingJob(true);
    setAddError(null);

    try {
      await createJob({
        company: newJob.company.trim(),
        role: newJob.role.trim(),
        status: newJob.status,
        appliedDate: newJob.appliedDate,
        notes: newJob.notes.trim() ? newJob.notes.trim() : null
      });

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
