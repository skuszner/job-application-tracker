import { Box, Chip, Sheet, Typography } from "@mui/joy";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  statusLabels: Record<Job["status"], string>;
  statusColors: Record<
    Job["status"],
    "neutral" | "primary" | "success" | "danger"
  >;
}

export default function JobCard({
  job,
  onClick,
  statusLabels,
  statusColors
}: JobCardProps) {
  return (
    <Sheet
      key={job.id}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "md",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1.5,
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        cursor: onClick ? "pointer" : "default"
      }}
      onClick={onClick ? () => onClick(job) : undefined}
    >
      <Box>
        <Typography level="title-md">{job.role}</Typography>
        <Typography level="body-sm">
          {job.company} • Applied{" "}
          {new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }).format(new Date(job.appliedDate))}
        </Typography>
        {job.notes && (
          <Typography level="body-sm" sx={{ mt: 0.75 }}>
            {job.notes}
          </Typography>
        )}
      </Box>

      <Chip color={statusColors[job.status]}>{statusLabels[job.status]}</Chip>
    </Sheet>
  );
}
