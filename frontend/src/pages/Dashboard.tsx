import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Box, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { usePagination } from "../hooks/usePagination";
import { useNewJobForm } from "../hooks/useNewJobForm.ts";
import JobDialog from "../components/JobDialog";
import JobFormFields, { type JobStatus } from "../components/JobFormFields.tsx";
import Pagination from "../components/Pagination";
import useJobs, { type Job } from "../hooks/useJobs";
import FiltersBar from "../components/FiltersBar";
import JobList from "../components/JobList";
import TopToolbar from "../components/TopToolbar";
import StatsCard from "../components/StatsCard";

type StatusFilter = "ALL" | JobStatus;

const statusOptions: JobStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED"
];

const statusLabels: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected"
};

const statusColors: Record<
  JobStatus,
  "neutral" | "primary" | "success" | "danger"
> = {
  APPLIED: "primary",
  INTERVIEW: "neutral",
  OFFER: "success",
  REJECTED: "danger"
};

const jobsPerPage = 6;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { jobs, loading, error, loadJobs, createJob } = useJobs();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredJobs,
    hasFilters,
    handleClearFilters
  } = useFilters(jobs);
  const {
    page,
    setPage,
    totalPages,
    visibleItems: visibleJobs
  } = usePagination(filteredJobs, jobsPerPage);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const {
    newJob,
    newJobErrors,
    creatingJob,
    addError,
    handleNewJobChange,
    handleCreateJob,
    resetNewJob
  } = useNewJobForm(createJob, () => {
    setAddModalOpen(false);
    setPage(1);
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, setPage]);

  const interviewCount = jobs.filter(
    (job) => job.status === "INTERVIEW"
  ).length;
  const offerCount = jobs.filter((job) => job.status === "OFFER").length;
  const activeCount = jobs.filter((job) => job.status !== "REJECTED").length;
  const stats = [
    { label: "Total applications", value: jobs.length },
    { label: "Active applications", value: activeCount },
    { label: "Interviews", value: interviewCount },
    { label: "Offers", value: offerCount }
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Box maxWidth={1120} mx="auto">
      <Sheet
        variant="outlined"
        sx={{ mb: 3, p: 3, borderRadius: "sm", boxShadow: "md" }}
      >
        <TopToolbar
          email={user?.email}
          onAddClick={() => setAddModalOpen(true)}
          onRefresh={() => void loadJobs()}
          refreshLoading={loading}
          onLogout={handleLogout}
        />
      </Sheet>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} xs={12} sm={6} md={3}>
            <StatsCard label={stat.label} value={stat.value} />
          </Grid>
        ))}
      </Grid>

      <Sheet
        variant="outlined"
        sx={{ mt: 3, p: 3, borderRadius: "sm", boxShadow: "md" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography level="h3">All applications</Typography>
            <Typography level="body-sm" textColor="neutral.600">
              Search and filter for specific roles, companies, or application
              statuses. Click on any application to view details, update status,
              or add notes.
            </Typography>
          </Box>
        </Stack>

        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={(v) => setStatusFilter(v as StatusFilter)}
          hasFilters={hasFilters}
          onClear={handleClearFilters}
          statusOptions={statusOptions}
          statusLabels={statusLabels}
          resultsCount={filteredJobs.length}
        />

        <JobList
          jobs={visibleJobs as Job[]}
          onJobClick={() => {}}
          statusLabels={statusLabels}
          statusColors={statusColors}
          loading={loading}
          error={error}
        />

        {!loading && !error && filteredJobs.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mt: 2.5 }}
          >
            <Typography level="body-sm" textColor="neutral.600">
              Showing {(page - 1) * jobsPerPage + 1} to{" "}
              {Math.min(page * jobsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length}
            </Typography>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Stack>
        )}
      </Sheet>

      <JobDialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          resetNewJob();
        }}
        title="Add job application"
        description="Enter the details of your job application. These details can be edited later."
        error={addError}
        submitLabel="Save application"
        onSubmit={() => void handleCreateJob()}
        submitting={creatingJob}
      >
        <JobFormFields
          values={newJob}
          errors={newJobErrors}
          onChange={handleNewJobChange}
          statusOptions={statusOptions}
          statusLabels={statusLabels}
        />
      </JobDialog>
    </Box>
  );
}
