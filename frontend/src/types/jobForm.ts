import { type JobStatus } from "./job";

export type JobFormValues = {
  company: string;
  role: string;
  status: JobStatus;
  appliedDate: string;
  notes: string;
};

export type JobFormErrors = {
  company?: string;
  role?: string;
  appliedDate?: string;
};
