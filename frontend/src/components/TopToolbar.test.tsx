import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TopToolbar from "./TopToolbar";

describe("TopToolbar", () => {
  it("renders the welcome text and wires the action buttons", async () => {
    const user = userEvent.setup();
    const onAddClick = vi.fn();
    const onRefresh = vi.fn();
    const onLogout = vi.fn();

    render(
      <TopToolbar
        email="test@example.com"
        onAddClick={onAddClick}
        onRefresh={onRefresh}
        refreshLoading={false}
        onLogout={onLogout}
      />
    );

    expect(screen.getByText(/your application dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByText(/welcome back, test@example.com/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add job/i }));
    await user.click(screen.getByRole("button", { name: /refresh/i }));
    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(onAddClick).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
