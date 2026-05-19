import { Box, Button, Stack, Typography } from "@mui/joy";
import { MdAdd, MdLogout, MdRefresh } from "react-icons/md";

interface TopToolbarProps {
  email?: string;
  onAddClick: () => void;
  onRefresh: () => void;
  refreshLoading: boolean;
  onLogout: () => void;
}

export default function TopToolbar({
  email,
  onAddClick,
  onRefresh,
  refreshLoading,
  onLogout
}: TopToolbarProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
    >
      <Box>
        <Typography level="h2" sx={{ mb: 0.5 }}>
          Your application dashboard
        </Typography>
        <Typography level="body-md" textColor="neutral.600">
          Welcome back{email ? `, ${email}` : ""}. Track every role, interview,
          and offer in one place.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          startDecorator={<MdAdd />}
          onClick={onAddClick}
          sx={{ whiteSpace: "nowrap" }}
        >
          Add job
        </Button>
        <Button
          variant="outlined"
          startDecorator={<MdRefresh />}
          onClick={onRefresh}
          loading={refreshLoading}
        >
          Refresh
        </Button>
        <Button
          color="neutral"
          variant="solid"
          startDecorator={<MdLogout />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Stack>
    </Stack>
  );
}
