import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import JobList from "./JobList";
import type { Job } from "../types/job";
import { jobStatusLabels, jobStatusColors } from "../constants/jobStatus";

const sampleJob: Job = {
  id: "job-1",
  company: "Test Company",
  role: "Test Role",
  status: "INTERVIEW",
  notes: "Test Notes",
  appliedDate: "2026-07-01T00:00:00.000Z",
  createdAt: "2026-07-01T00:00:00.000Z"
};

describe("JobList", () => {
  it("shows the empty state when there are no jobs", () => {
    render(
      <JobList
        jobs={[]}
        statusLabels={jobStatusLabels}
        statusColors={jobStatusColors}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText(/no applications found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try changing the status filter or search terms/i)
    ).toBeInTheDocument();
  });

  it("renders an error message when the list fails to load", () => {
    render(
      <JobList
        jobs={[]}
        statusLabels={jobStatusLabels}
        statusColors={jobStatusColors}
        loading={false}
        error="Unable to load applications"
      />
    );

    expect(
      screen.getByText(/unable to load applications/i)
    ).toBeInTheDocument();
  });

  it("renders jobs and forwards clicks to the selected job", async () => {
    const user = userEvent.setup();
    const onJobClick = vi.fn();

    render(
      <JobList
        jobs={[sampleJob]}
        onJobClick={onJobClick}
        statusLabels={jobStatusLabels}
        statusColors={jobStatusColors}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText(/test role/i)).toBeInTheDocument();
    expect(screen.getByText(/test company/i)).toBeInTheDocument();
    expect(screen.getByText(/test notes/i)).toBeInTheDocument();
    expect(screen.getByText(/interview/i)).toBeInTheDocument();

    await user.click(screen.getByText(/test company/i));

    expect(onJobClick).toHaveBeenCalledTimes(1);
    expect(onJobClick).toHaveBeenCalledWith(sampleJob);
  });
});
