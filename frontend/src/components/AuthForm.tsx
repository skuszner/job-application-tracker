import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Sheet,
  Typography
} from "@mui/joy";
import { MdErrorOutline } from "react-icons/md";

export type AuthFormField = {
  label: string;
  name: string;
  type: "email" | "password" | "text";
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  loading: boolean;
  error: string | null;
  setError: (value: string | null) => void;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  onSubmit: (event: React.FormEvent) => void;
  inputFields: AuthFormField[];
};

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  loading,
  error,
  setError,
  footerPrompt,
  footerLinkLabel,
  footerLinkHref,
  onSubmit,
  inputFields
}: AuthFormProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Sheet
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{
          width: 320,
          mx: "auto",
          my: 4,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md"
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>{title}</b>
          </Typography>
          <Typography level="body-sm">{subtitle}</Typography>
        </div>

        {inputFields.map((field) => (
          <FormControl key={field.name} disabled={loading} error={!!error}>
            <FormLabel>{field.label}</FormLabel>
            <Input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => {
                field.setValue(e.target.value);
                if (error) setError(null);
              }}
              required
            />
          </FormControl>
        ))}

        <Button
          sx={{ mt: 1 }}
          type="submit"
          disabled={loading}
          loading={loading}
        >
          {submitLabel}
        </Button>

        {error && (
          <Typography
            color="danger"
            sx={{ mt: 1, alignSelf: "center" }}
            startDecorator={<MdErrorOutline />}
          >
            {error}
          </Typography>
        )}

        <Typography
          endDecorator={<Link href={footerLinkHref}>{footerLinkLabel}</Link>}
          sx={{ fontSize: "sm", alignSelf: "center" }}
        >
          {footerPrompt}
        </Typography>
      </Sheet>
    </Box>
  );
}
