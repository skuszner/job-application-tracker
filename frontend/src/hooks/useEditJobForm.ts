import { useState } from "react";
import { type Job } from "./useJobs";
import {
  createJobFormValuesFromJob,
  normalizeJobFormValues,
  validateJobFormValues,
  type JobFormErrors,
  type JobFormValues
} from "../utils/jobForm";

type UpdateJobPayload = Partial<Omit<Job, "id" | "createdAt">>;

export function useEditJobForm(
  updateJob: (id: string, payload: UpdateJobPayload) => Promise<Job>,
  onSuccess?: () => void
) {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formValues, setFormValues] = useState<JobFormValues | null>(null);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const startEditing = (job: Job) => {
    setEditingJob(job);
    setFormValues(createJobFormValuesFromJob(job));
    setErrors({});
    setUpdateError(null);
  };

  const resetEditing = () => {
    setEditingJob(null);
    setFormValues(null);
    setErrors({});
    setUpdateError(null);
  };

  const handleChange = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K]
  ) => {
    if (!formValues) return;
    setFormValues((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleUpdate = async () => {
    if (!editingJob || !formValues) return false;
    const validation = validateJobFormValues(formValues);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return false;
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      await updateJob(editingJob.id, normalizeJobFormValues(formValues));

      resetEditing();
      onSuccess?.();
      return true;
    } catch {
      setUpdateError("We could not update this application. Please try again.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    editingJob,
    formValues,
    errors,
    updating,
    updateError,
    startEditing,
    resetEditing,
    handleChange,
    handleUpdate
  } as const;
}
