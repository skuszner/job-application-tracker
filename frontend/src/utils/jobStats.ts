import { type Job } from "../types/job";

export type JobStat = {
  label: string;
  value: number;
};

export function buildJobStats(jobs: Job[]): JobStat[] {
  const interviewCount = jobs.filter(
    (job) => job.status === "INTERVIEW"
  ).length;
  const offerCount = jobs.filter((job) => job.status === "OFFER").length;
  const activeCount = jobs.filter((job) => job.status !== "REJECTED").length;

  return [
    { label: "Total applications", value: jobs.length },
    { label: "Active applications", value: activeCount },
    { label: "Interviews", value: interviewCount },
    { label: "Offers", value: offerCount }
  ];
}
