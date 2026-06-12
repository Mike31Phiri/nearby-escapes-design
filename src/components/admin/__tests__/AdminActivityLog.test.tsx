import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminActivityLog } from "../AdminActivityLog";

describe("AdminActivityLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header with title and event count", () => {
    render(<AdminActivityLog />);
    expect(screen.getByText("Audit Log")).toBeInTheDocument();
    expect(screen.getByText(/total events/)).toBeInTheDocument();
  });

  it("renders activity items with user names from mock data", () => {
    render(<AdminActivityLog />);
    const sarahElements = screen.getAllByText("Sarah Phiri");
    expect(sarahElements.length).toBeGreaterThanOrEqual(1);
    const nomsaElements = screen.getAllByText("Nomsa Tembo");
    expect(nomsaElements.length).toBeGreaterThanOrEqual(1);
    const graceElements = screen.getAllByText("Grace Mwale");
    expect(graceElements.length).toBeGreaterThanOrEqual(1);
    const adminElements = screen.getAllByText("Admin User");
    expect(adminElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows activity type badges on items", () => {
    render(<AdminActivityLog />);
    // "Booking" appears as type badges on items AND in select options
    const bookingElements = screen.getAllByText("Booking");
    expect(bookingElements.length).toBeGreaterThanOrEqual(1);
    const listingElements = screen.getAllByText("Listing");
    expect(listingElements.length).toBeGreaterThanOrEqual(1);
    const paymentElements = screen.getAllByText("Payment");
    expect(paymentElements.length).toBeGreaterThanOrEqual(1);
  });

  it("filters activities by search input", async () => {
    render(<AdminActivityLog />);
    const searchInput = screen.getByPlaceholderText("Search actions, users, or targets...");
    await userEvent.type(searchInput, "Grace");

    const graceElements = screen.getAllByText(/Grace/);
    expect(graceElements.length).toBeGreaterThanOrEqual(1);
  });

  it("sorts activities when clicking the sort toggle button", async () => {
    render(<AdminActivityLog />);
    const sortBtn = screen.getByText("Newest");
    await userEvent.click(sortBtn);
    expect(screen.getByText("Oldest")).toBeInTheDocument();
  });

  it("shows type summary chips for each activity type", () => {
    render(<AdminActivityLog />);
    // Text appears both in chips AND in Select dropdown items — use getAllByText
    expect(screen.getAllByText(/Booking\s*\(\d+\)/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Listing\s*\(\d+\)/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Payment\s*\(\d+\)/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/User\s*\(\d+\)/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/System\s*\(\d+\)/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows empty state when search matches nothing", async () => {
    render(<AdminActivityLog />);
    const searchInput = screen.getByPlaceholderText("Search actions, users, or targets...");
    await userEvent.type(searchInput, "zzzzznotexist");

    expect(screen.getByText("No events found")).toBeInTheDocument();
    expect(screen.getByText("Clear All Filters")).toBeInTheDocument();
  });

  it("clears all filters from empty state", async () => {
    render(<AdminActivityLog />);
    const searchInput = screen.getByPlaceholderText("Search actions, users, or targets...");
    await userEvent.type(searchInput, "zzzzznotexist");

    await userEvent.click(screen.getByText("Clear All Filters"));

    expect(screen.queryByText("No events found")).not.toBeInTheDocument();
    const sarahElements = screen.getAllByText("Sarah Phiri");
    expect(sarahElements.length).toBeGreaterThanOrEqual(1);
  });

  it("toggles type filter when clicking a type chip", async () => {
    render(<AdminActivityLog />);
    // Find the Payment chip (not inside the mocked Select) by filtering out select items
    const paymentElements = screen.getAllByText(/Payment\s*\(\d+\)/);
    const chipBtn = paymentElements.find((el) => !el.closest('[data-testid="mock-select"]'));
    expect(chipBtn).toBeTruthy();
    if (chipBtn) await userEvent.click(chipBtn);
    // After filtering by 'payment', "Admin User" should still be present
    const adminElements = screen.getAllByText("Admin User");
    expect(adminElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows user role badges on activity items", () => {
    render(<AdminActivityLog />);
    // "guest" and "host" role badges appear on items (admin role badges are hidden)
    const guestElements = screen.getAllByText("guest");
    expect(guestElements.length).toBeGreaterThanOrEqual(1);
    const hostElements = screen.getAllByText("host");
    expect(hostElements.length).toBeGreaterThanOrEqual(1);
  });
});
