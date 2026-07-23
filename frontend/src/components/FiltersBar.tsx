import { Button, Input, Option, Select, Stack, Typography } from "@mui/joy";
import { MdSearch } from "react-icons/md";
import type { JobStatus } from "../types/job";

interface FiltersBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: JobStatus | "ALL";
  onStatusChange: (value: JobStatus | "ALL") => void;
  hasFilters: boolean;
  onClear: () => void;
  statusOptions: JobStatus[];
  statusLabels: Record<JobStatus, string>;
  resultsCount: number;
}

export default function FiltersBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  hasFilters,
  onClear,
  statusOptions,
  statusLabels,
  resultsCount
}: FiltersBarProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 2 }}>
      <Input
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search company or role"
        startDecorator={<MdSearch />}
        endDecorator={
          searchTerm.trim() ? (
            <Typography
              level="body-sm"
              textColor="neutral.500"
            >{`${resultsCount} result${resultsCount === 1 ? "" : "s"}`}</Typography>
          ) : undefined
        }
        sx={{ flex: 1 }}
      />

      <Select
        value={statusFilter}
        onChange={(_e, value) => value && onStatusChange(value)}
        sx={{ minWidth: { xs: "100%", md: 220 } }}
      >
        <Option value="ALL">All statuses</Option>
        {statusOptions.map((status) => (
          <Option key={status} value={status}>
            {statusLabels[status]}
          </Option>
        ))}
      </Select>

      <Button
        variant="outlined"
        color="neutral"
        onClick={onClear}
        disabled={!hasFilters}
      >
        Clear filters
      </Button>
    </Stack>
  );
}
