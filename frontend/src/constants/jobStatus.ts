import { type JobStatus } from "../types/job";

export const jobStatusOptions: JobStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED"
];

export const jobStatusLabels: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected"
};

export const jobStatusColors: Record<
  JobStatus,
  "neutral" | "primary" | "success" | "danger"
> = {
  APPLIED: "primary",
  INTERVIEW: "neutral",
  OFFER: "success",
  REJECTED: "danger"
};
