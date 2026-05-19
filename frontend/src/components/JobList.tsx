import { Sheet, Stack, Typography } from "@mui/joy";
import JobCard from "./JobCard";
import type { Job } from "../hooks/useJobs";

interface JobListProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
  statusLabels: Record<Job["status"], string>;
  statusColors: Record<
    Job["status"],
    "neutral" | "primary" | "success" | "danger"
  >;
  loading: boolean;
  error: string | null;
}

export default function JobList({
  jobs,
  onJobClick,
  statusLabels,
  statusColors,
  loading,
  error
}: JobListProps) {
  if (error) {
    return (
      <Sheet
        variant="soft"
        color="danger"
        sx={{ p: 2, borderRadius: "md", mb: 2 }}
      >
        <Typography level="body-sm">{error}</Typography>
      </Sheet>
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <Sheet
        variant="soft"
        sx={{
          p: 3,
          borderRadius: "md",
          textAlign: "center",
          border: "1px dashed",
          borderColor: "neutral.300"
        }}
      >
        <Typography level="title-md">No applications found</Typography>
        <Typography level="body-sm" textColor="neutral.600" sx={{ mt: 0.5 }}>
          Try changing the status filter or search terms.
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={1.5}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onClick={onJobClick}
          statusLabels={statusLabels}
          statusColors={statusColors}
        />
      ))}
    </Stack>
  );
}
