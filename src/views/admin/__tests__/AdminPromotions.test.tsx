import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminPromotions } from "../AdminPromotions";

describe("AdminPromotions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header with title", () => {
    render(<AdminPromotions />);
    expect(screen.getByText("Promotions & Marketing")).toBeInTheDocument();
    expect(screen.getByText(/active promo codes/)).toBeInTheDocument();
  });

  it("renders the tab bar with both tabs", () => {
    render(<AdminPromotions />);
    expect(screen.getByText("Promo Codes")).toBeInTheDocument();
    expect(screen.getByText("Featured Listings")).toBeInTheDocument();
  });

  it("shows promo code cards by default (codes tab)", () => {
    render(<AdminPromotions />);
    expect(screen.getByText("WELCOME20")).toBeInTheDocument();
    expect(screen.getByText("ZAMBIA10")).toBeInTheDocument();
    expect(screen.getByText("SAFARI50")).toBeInTheDocument();
    expect(screen.getByText("BUSFARE")).toBeInTheDocument();
    expect(screen.getByText("FLASHSALE")).toBeInTheDocument();
  });

  it("switches to featured listings tab showing featured items", async () => {
    render(<AdminPromotions />);
    await userEvent.click(screen.getByText("Featured Listings"));

    expect(screen.getByText("Luxury Safari Lodge")).toBeInTheDocument();
    expect(screen.getByText("Victoria Falls Helicopter Tour")).toBeInTheDocument();
    expect(screen.getByText("Lusaka to Chipata Express")).toBeInTheDocument();
    expect(screen.getByText("Lake Kariba Houseboat")).toBeInTheDocument();
  });

  it("filters promo codes by code search", async () => {
    render(<AdminPromotions />);
    const searchInput = screen.getByPlaceholderText("Search promo codes...");
    await userEvent.type(searchInput, "WELCOME");

    expect(screen.getByText("WELCOME20")).toBeInTheDocument();
    expect(screen.queryByText("ZAMBIA10")).not.toBeInTheDocument();
  });

  it("filters featured listings by name search", async () => {
    render(<AdminPromotions />);
    await userEvent.click(screen.getByText("Featured Listings"));

    const searchInput = screen.getByPlaceholderText("Search featured listings...");
    await userEvent.type(searchInput, "Safari");

    expect(screen.getByText("Luxury Safari Lodge")).toBeInTheDocument();
    expect(screen.queryByText("Victoria Falls Helicopter Tour")).not.toBeInTheDocument();
  });

  it("shows empty state when search matches no promo codes", async () => {
    render(<AdminPromotions />);
    const searchInput = screen.getByPlaceholderText("Search promo codes...");
    await userEvent.type(searchInput, "zzzzznotexist");

    expect(screen.getByText("No promo codes found")).toBeInTheDocument();
  });

  it("shows empty state when search matches no featured listings", async () => {
    render(<AdminPromotions />);
    await userEvent.click(screen.getByText("Featured Listings"));

    const searchInput = screen.getByPlaceholderText("Search featured listings...");
    await userEvent.type(searchInput, "zzzzznotexist");

    expect(screen.getByText("No featured listings found")).toBeInTheDocument();
  });

  it("shows usage progress on promo code cards", () => {
    render(<AdminPromotions />);
    const usedTexts = screen.getAllByText(/used/);
    expect(usedTexts.length).toBeGreaterThanOrEqual(5);
  });

  it("shows discount values on promo cards", () => {
    render(<AdminPromotions />);
    expect(screen.getByText("20%")).toBeInTheDocument(); // WELCOME20: 20%
    expect(screen.getByText("K50")).toBeInTheDocument(); // SAFARI50: K50 off
    expect(screen.getByText("K200")).toBeInTheDocument(); // FLASHSALE: K200 off
  });

  it("shows featured listing placement labels after switching tabs", async () => {
    render(<AdminPromotions />);
    await userEvent.click(screen.getByText("Featured Listings"));

    expect(screen.getByText("Search Boost")).toBeInTheDocument();
    expect(screen.getByText("Homepage Banner")).toBeInTheDocument();
    const featuredLabels = screen.getAllByText("Category Featured");
    expect(featuredLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the Create Promo Code button", () => {
    render(<AdminPromotions />);
    expect(screen.getByText("Create Promo Code")).toBeInTheDocument();
  });

  it("opens create dialog when clicking Create Promo Code", async () => {
    render(<AdminPromotions />);
    await userEvent.click(screen.getByText("Create Promo Code"));

    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByText(/Add a new promotional code/)).toBeInTheDocument();
  });

  it("shows Deactivate buttons on active promo cards", () => {
    render(<AdminPromotions />);
    const deactivateBtns = screen.getAllByText("Deactivate");
    expect(deactivateBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("shows Activate buttons on inactive promo cards", () => {
    render(<AdminPromotions />);
    const activateBtns = screen.getAllByText("Activate");
    // BUSFARE is inactive (disabled/expired)
    expect(activateBtns.length).toBeGreaterThanOrEqual(1);
  });
});
