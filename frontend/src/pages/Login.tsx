import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";
import AuthForm from "../components/AuthForm";
import { isValidEmail } from "../utils/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, password);
      navigate("/dashboard", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Job Application Tracker"
      subtitle="Sign in to continue."
      submitLabel="Log in"
      loading={loading}
      error={error}
      setError={setError}
      footerPrompt="Don't have an account?"
      footerLinkLabel="Sign up"
      footerLinkHref="/sign-up"
      onSubmit={handleSubmit}
      inputFields={[
        {
          label: "Email",
          name: "email",
          type: "email",
          placeholder: "email@example.com",
          value: email,
          setValue: setEmail
        },
        {
          label: "Password",
          name: "password",
          type: "password",
          placeholder: "password",
          value: password,
          setValue: setPassword
        }
      ]}
    />
  );
}
