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
