import {
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  Typography
} from "@mui/joy";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  color?: "primary" | "danger" | "neutral";
}

export default function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  color = "danger"
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Typography level="h4">{title}</Typography>
        <Typography level="body-sm" textColor="neutral.600" sx={{ mt: 1 }}>
          {message}
        </Typography>

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
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            color={color}
            variant="solid"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
