import { Sheet, Typography } from "@mui/joy";

interface StatsCardProps {
  label: string;
  value: number;
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <Sheet
      variant="outlined"
      sx={{ borderRadius: "sm", boxShadow: "md", height: "100%" }}
    >
      <Typography level="body-sm" sx={{ mx: 2, mt: 1, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography level="h1" sx={{ mx: 2, mt: 0.75, mb: 1 }}>
        {value}
      </Typography>
    </Sheet>
  );
}
