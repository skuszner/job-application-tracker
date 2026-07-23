import {
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Textarea,
  Typography
} from "@mui/joy";
import { type JobFormErrors, type JobFormValues } from "../types/jobForm";
import { type JobStatus } from "../types/job";

interface JobFormFieldsProps {
  values: JobFormValues;
  errors: JobFormErrors;
  onChange: <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K]
  ) => void;
  statusOptions: JobStatus[];
  statusLabels: Record<JobStatus, string>;
}

export default function JobFormFields({
  values,
  errors,
  onChange,
  statusOptions,
  statusLabels
}: JobFormFieldsProps) {
  return (
    <>
      <FormControl error={Boolean(errors.company)}>
        <FormLabel>Company</FormLabel>
        <Input
          value={values.company}
          onChange={(event) => onChange("company", event.target.value)}
          placeholder="Example: Microsoft"
        />
        {errors.company && (
          <Typography level="body-xs" color="danger">
            {errors.company}
          </Typography>
        )}
      </FormControl>

      <FormControl error={Boolean(errors.role)}>
        <FormLabel>Role</FormLabel>
        <Input
          value={values.role}
          onChange={(event) => onChange("role", event.target.value)}
          placeholder="Example: Frontend Engineer"
        />
        {errors.role && (
          <Typography level="body-xs" color="danger">
            {errors.role}
          </Typography>
        )}
      </FormControl>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Status</FormLabel>
          <Select
            value={values.status}
            onChange={(_event, value) => {
              if (value) {
                onChange("status", value);
              }
            }}
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {statusLabels[status]}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }} error={Boolean(errors.appliedDate)}>
          <FormLabel>Applied date</FormLabel>
          <Input
            type="date"
            value={values.appliedDate}
            onChange={(event) => onChange("appliedDate", event.target.value)}
          />
          {errors.appliedDate && (
            <Typography level="body-xs" color="danger">
              {errors.appliedDate}
            </Typography>
          )}
        </FormControl>
      </Stack>

      <FormControl>
        <FormLabel>Notes (optional)</FormLabel>
        <Textarea
          minRows={3}
          value={values.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          placeholder="Recruiter details, interview prep, referral context..."
        />
      </FormControl>
    </>
  );
}
