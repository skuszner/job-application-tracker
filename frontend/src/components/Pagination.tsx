import { Button, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange
}: PaginationProps) {
  const paginationItemWidth = { xs: 28, sm: 34 };

  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_value, index) => index + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        -1,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [1, -1, page - 1, page, page + 1, -1, totalPages];
  }, [page, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Stack direction="row" spacing={0.75}>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </Button>

      {paginationItems.map((item, index) => {
        if (item === -1) {
          return (
            <Typography
              key={`ellipsis-${index}`}
              level="body-sm"
              sx={{
                alignSelf: "center",
                width: paginationItemWidth,
                display: "flex",
                justifyContent: "center"
              }}
            >
              ...
            </Typography>
          );
        }

        return (
          <Button
            key={item}
            variant={item === page ? "solid" : "outlined"}
            color={item === page ? "primary" : "neutral"}
            onClick={() => onPageChange(item)}
            sx={{
              width: paginationItemWidth,
              minWidth: paginationItemWidth
            }}
          >
            {item}
          </Button>
        );
      })}

      <Button
        variant="outlined"
        color="neutral"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </Stack>
  );
}
