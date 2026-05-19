import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Typography
} from "@mui/joy";
import type { ReactNode } from "react";

interface JobDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  error?: string | null;
  children: ReactNode;
  cancelLabel?: string;
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
  submitColor?: "primary" | "neutral" | "danger";
  submitVariant?: "solid" | "outlined" | "soft";
  width?: string;
}

export default function JobDialog({
  open,
  onClose,
  title,
  description,
  error,
  children,
  cancelLabel = "Cancel",
  submitLabel,
  onSubmit,
  submitting = false,
  submitColor = "primary",
  submitVariant = "solid",
  width = "min(560px, 92vw)"
}: JobDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" sx={{ width }}>
        <ModalClose />
        <Typography level="h3">{title}</Typography>

        {description && (
          <Typography level="body-sm" textColor="neutral.600" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}

        {error && (
          <Sheet
            variant="soft"
            color="danger"
            sx={{ p: 1.25, borderRadius: "sm", mb: 1 }}
          >
            <Typography level="body-sm">{error}</Typography>
          </Sheet>
        )}

        <Stack spacing={1.25}>{children}</Stack>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <Button
            color="neutral"
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onSubmit}
            loading={submitting}
            color={submitColor}
            variant={submitVariant}
          >
            {submitLabel}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
