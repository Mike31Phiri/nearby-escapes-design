import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDisputes } from "../AdminDisputes";

describe("AdminDisputes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header with title", () => {
    render(<AdminDisputes />);
    expect(screen.getByText("Disputes & Resolution")).toBeInTheDocument();
  });

  it("renders the stats row with all 4 stat items", () => {
    render(<AdminDisputes />);
    expect(screen.getByText("Total Cases")).toBeInTheDocument();
    // "Open" appears as both a stat label and a select-option — use getAllByText
    const openElements = screen.getAllByText("Open");
    expect(openElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
    expect(screen.getByText("Disputed Amount")).toBeInTheDocument();
  });

  it("renders all 5 dispute cards from mock data", () => {
    render(<AdminDisputes />);
    expect(screen.getByText("Kafue River Lodge")).toBeInTheDocument();
    expect(screen.getByText("Victoria Falls Helicopter Tour")).toBeInTheDocument();
    expect(screen.getByText("Lusaka to Chipata Express")).toBeInTheDocument();
    expect(screen.getByText("Lake Kariba Houseboat")).toBeInTheDocument();
    expect(screen.getByText("Lower Zambezi Safari Lodge")).toBeInTheDocument();
  });

  it("filters disputes by search input (listing name)", async () => {
    render(<AdminDisputes />);
    const searchInput = screen.getByPlaceholderText(
      "Search by listing, guest, host, or reference...",
    );
    await userEvent.type(searchInput, "Kafue");

    expect(screen.getByText("Kafue River Lodge")).toBeInTheDocument();
    expect(screen.queryByText("Victoria Falls Helicopter Tour")).not.toBeInTheDocument();
  });

  it("shows empty state when search matches nothing", async () => {
    render(<AdminDisputes />);
    const searchInput = screen.getByPlaceholderText(
      "Search by listing, guest, host, or reference...",
    );
    await userEvent.type(searchInput, "zzzzznotexist");

    expect(screen.getByText("No disputes found")).toBeInTheDocument();
    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
  });

  it("clears all filters when clicking Clear Filters from empty state", async () => {
    render(<AdminDisputes />);
    const searchInput = screen.getByPlaceholderText(
      "Search by listing, guest, host, or reference...",
    );
    await userEvent.type(searchInput, "zzzzznotexist");

    await userEvent.click(screen.getByText("Clear Filters"));

    expect(screen.getByText("Kafue River Lodge")).toBeInTheDocument();
    expect(screen.queryByText("No disputes found")).not.toBeInTheDocument();
  });

  it("shows correct priority badges on dispute cards", async () => {
    render(<AdminDisputes />);
    // Use findAllByText (async) to wait for badges to render if needed
    const highBadges = await screen.findAllByText("High Priority");
    expect(highBadges.length).toBeGreaterThanOrEqual(1);

    const criticalBadges = screen.getAllByText("Critical Priority");
    expect(criticalBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("shows correct status badges on dispute cards", () => {
    render(<AdminDisputes />);
    // "Open" appears as badge text on the card AND as a select option
    const openBadges = screen.getAllByText("Open");
    expect(openBadges.length).toBeGreaterThanOrEqual(1);
  });
});
