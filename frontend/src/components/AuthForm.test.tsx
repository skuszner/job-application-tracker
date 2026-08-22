import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import AuthForm from "./AuthForm";

function renderAuthForm() {
  const setValue = vi.fn();
  const setError = vi.fn();
  const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

  render(
    <AuthForm
      title="Job Application Tracker"
      subtitle="Sign in to continue."
      submitLabel="Log in"
      loading={false}
      error={null}
      setError={setError}
      footerPrompt="Don't have an account?"
      footerLinkLabel="Sign up"
      footerLinkHref="/sign-up"
      onSubmit={onSubmit}
      inputFields={[
        {
          label: "Email",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          value: "",
          setValue
        }
      ]}
    />
  );

  return { setValue, setError, onSubmit };
}

describe("AuthForm", () => {
  it("renders the form title, submit button, and footer link", () => {
    renderAuthForm();

    expect(
      screen.getByRole("heading", { name: /job application tracker/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/sign-up"
    );
  });

  it("submits the form and clears the error when the user types", async () => {
    const user = userEvent.setup();
    const { setValue, setError, onSubmit } = renderAuthForm();

    const input = screen.getByPlaceholderText(/you@example.com/i);
    await user.type(input, "test@example.com");

    expect(setValue).toHaveBeenCalled();
    expect(setError).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /log in/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
