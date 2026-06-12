import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminPayouts } from "../AdminPayouts";

// Helper: click a select-item button with a specific value
async function clickSelectItem(value: string) {
  const items = screen.getAllByTestId("select-item");
  const target = items.find((el) => el.getAttribute("data-value") === value);
  if (target) await userEvent.click(target);
}

describe("AdminPayouts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header with title", () => {
    render(<AdminPayouts />);
    expect(screen.getByText("Payout Management")).toBeInTheDocument();
    expect(screen.getByText(/total payouts processed/)).toBeInTheDocument();
  });

  it("renders the stats row with all 4 stat items", () => {
    render(<AdminPayouts />);
    expect(screen.getByText("Gross Payouts")).toBeInTheDocument();
    expect(screen.getByText("Commission Earned")).toBeInTheDocument();
    // "Processed" and "Pending" appear as stat labels AND as status badges on cards
    const processedElements = screen.getAllByText("Processed");
    expect(processedElements.length).toBeGreaterThanOrEqual(1);
    const pendingElements = screen.getAllByText("Pending");
    expect(pendingElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders payout cards for mock payout records", () => {
    render(<AdminPayouts />);
    // Host names appear as card titles and in commission labels
    const chandaElements = screen.getAllByText("Chanda Bwalya");
    expect(chandaElements.length).toBeGreaterThanOrEqual(1);
    const michaelElements = screen.getAllByText("Michael Tembo");
    expect(michaelElements.length).toBeGreaterThanOrEqual(1);
    const davidElements = screen.getAllByText("David Mulenga");
    expect(davidElements.length).toBeGreaterThanOrEqual(1);
    const nomsaElements = screen.getAllByText("Nomsa Tembo");
    expect(nomsaElements.length).toBeGreaterThanOrEqual(1);
  });

  it("filters payouts by host name search", async () => {
    render(<AdminPayouts />);
    const searchInput = screen.getByPlaceholderText("Search by host name or period...");
    await userEvent.type(searchInput, "Chanda");

    const chandaElements = screen.getAllByText("Chanda Bwalya");
    expect(chandaElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Michael Tembo")).not.toBeInTheDocument();
  });

  it("filters payouts by period search", async () => {
    render(<AdminPayouts />);
    const searchInput = screen.getByPlaceholderText("Search by host name or period...");
    await userEvent.type(searchInput, "Jun");

    const chandaElements = screen.getAllByText("Chanda Bwalya");
    expect(chandaElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Michael Tembo")).toBeInTheDocument();
  });

  it("shows empty state when search matches nothing", async () => {
    render(<AdminPayouts />);
    const searchInput = screen.getByPlaceholderText("Search by host name or period...");
    await userEvent.type(searchInput, "zzzzznotexist");

    expect(screen.getByText("No payouts found")).toBeInTheDocument();
    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
  });

  it("filters by status", async () => {
    render(<AdminPayouts />);
    // Select "paid" status
    await clickSelectItem("paid");

    const davidElements = screen.getAllByText("David Mulenga");
    expect(davidElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows Process Payout button for pending payouts", () => {
    render(<AdminPayouts />);
    const processBtns = screen.getAllByText("Process Payout");
    expect(processBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("shows Pending status badges", () => {
    render(<AdminPayouts />);
    const pendingBadges = screen.getAllByText("Pending");
    expect(pendingBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("clears all filters from empty state", async () => {
    render(<AdminPayouts />);
    const searchInput = screen.getByPlaceholderText("Search by host name or period...");
    await userEvent.type(searchInput, "zzzzznotexist");

    await userEvent.click(screen.getByText("Clear Filters"));

    const chandaElements = screen.getAllByText("Chanda Bwalya");
    expect(chandaElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("No payouts found")).not.toBeInTheDocument();
  });

  it("displays gross amount labels on payout cards", () => {
    render(<AdminPayouts />);
    const grossElements = screen.getAllByText(/gross/);
    expect(grossElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows commission breakdown on payout cards", () => {
    render(<AdminPayouts />);
    expect(screen.getAllByText(/Commission/).length).toBeGreaterThanOrEqual(1);
  });
});
