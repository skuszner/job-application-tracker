import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Box, Grid, Sheet, Stack, Typography } from "@mui/joy";

import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { usePagination } from "../hooks/usePagination";
import { useNewJobForm } from "../hooks/useNewJobForm";
import { useEditJobForm } from "../hooks/useEditJobForm";
import { useJobs } from "../hooks/useJobs";

import JobDialog from "../components/JobDialog";
import JobFormFields from "../components/JobFormFields";
import Pagination from "../components/Pagination";
import FiltersBar from "../components/FiltersBar";
import JobList from "../components/JobList";
import TopToolbar from "../components/TopToolbar";
import StatsCard from "../components/StatsCard";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  jobStatusColors,
  jobStatusLabels,
  jobStatusOptions
} from "../constants/jobStatus";
import { buildJobStats } from "../utils/jobStats";

const jobsPerPage = 6;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { jobs, loading, error, loadJobs, createJob, updateJob, deleteJob } =
    useJobs();
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

  const {
    editingJob,
    formValues: editValues,
    errors: editErrors,
    updating,
    updateError,
    startEditing,
    resetEditing,
    handleChange: handleEditChange,
    handleUpdate
  } = useEditJobForm(updateJob, () => setPage(1));

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const closeDeleteDialog = () => {
    setConfirmOpen(false);
    setDeletingId(null);
    setDeleting(false);
  };

  const handleDeleteClick = () => {
    if (!editingJob) return;
    setDeletingId(editingJob.id);
    setDeleting(false);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId || deleting) return;
    setDeleting(true);

    try {
      await deleteJob(deletingId);
      resetEditing();
      setPage(1);
    } catch {
      // silently ignore API errors in this flow
    } finally {
      closeDeleteDialog();
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, setPage]);

  const stats = useMemo(() => buildJobStats(jobs), [jobs]);

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
          onStatusChange={setStatusFilter}
          hasFilters={hasFilters}
          onClear={handleClearFilters}
          statusOptions={jobStatusOptions}
          statusLabels={jobStatusLabels}
          resultsCount={filteredJobs.length}
        />

        <JobList
          jobs={visibleJobs}
          onJobClick={(job) => startEditing(job)}
          statusLabels={jobStatusLabels}
          statusColors={jobStatusColors}
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
          statusOptions={jobStatusOptions}
          statusLabels={jobStatusLabels}
        />
      </JobDialog>

      <JobDialog
        open={Boolean(editingJob)}
        onClose={() => resetEditing()}
        title="Edit job application"
        description="Update the details of your job application."
        error={updateError}
        submitLabel="Save changes"
        onSubmit={() => void handleUpdate()}
        submitting={updating}
        onDelete={handleDeleteClick}
        deleteLabel="Delete application"
      >
        {editValues && (
          <JobFormFields
            values={editValues}
            errors={editErrors}
            onChange={handleEditChange}
            statusOptions={jobStatusOptions}
            statusLabels={jobStatusLabels}
          />
        )}
      </JobDialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={closeDeleteDialog}
        title="Delete application"
        message="Are you sure you want to delete this application? This action can not be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </Box>
  );
}
