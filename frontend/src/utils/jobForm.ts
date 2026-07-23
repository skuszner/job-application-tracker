import { type Job } from "../types/job";
import { type JobFormErrors, type JobFormValues } from "../types/jobForm";

type JobFormSource = Pick<
  Job,
  "company" | "role" | "status" | "appliedDate" | "notes"
>;

export function createInitialJobFormValues(): JobFormValues {
  return {
    company: "",
    role: "",
    status: "APPLIED",
    appliedDate: new Date().toISOString().slice(0, 10),
    notes: ""
  };
}

export function createJobFormValuesFromJob(
  job: JobFormSource | null | undefined
): JobFormValues {
  if (!job) {
    return createInitialJobFormValues();
  }

  return {
    company: job.company,
    role: job.role,
    status: job.status,
    appliedDate: job.appliedDate
      ? new Date(job.appliedDate).toISOString().slice(0, 10)
      : "",
    notes: job.notes ?? ""
  };
}

export function validateJobFormValues(values: JobFormValues): JobFormErrors {
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

export function normalizeJobFormValues(
  values: JobFormValues
): Omit<Job, "id" | "createdAt"> {
  return {
    company: values.company.trim(),
    role: values.role.trim(),
    status: values.status,
    appliedDate: values.appliedDate,
    notes: values.notes.trim() ? values.notes.trim() : null
  };
}

export type { JobFormErrors, JobFormValues };
