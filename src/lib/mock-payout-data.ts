/**
 * Mock payout & ledger data for the host Back Office.
 * Each monthly payout contains one ledger row per booking included in it,
 * with the platform commission (12%) and withholding tax (5%) broken out.
 */

export interface LedgerEntry {
  bookingId: string;
  guest: string;
  date: string; // YYYY-MM-DD
  grossRate: number; // guest-paid gross rate (ZMW)
  commission: number; // 12% platform commission
  tax: number; // 5% withholding tax
  netEarnings: number; // gross - commission - tax
}

export type PayoutStatus = "cleared" | "upcoming";

export interface PayoutMonth {
  id: string;
  label: string; // "July 2026"
  amount: number; // net amount paid out
  status: PayoutStatus;
  clearedOn?: string; // e.g. "5 August 2026"
  entries: LedgerEntry[];
}

const COMMISSION_RATE = 0.12;
const TAX_RATE = 0.05;

/** Build a ledger row from a gross rate. */
export function buildLedgerEntry(
  bookingId: string,
  guest: string,
  date: string,
  grossRate: number,
): LedgerEntry {
  const commission = Math.round(grossRate * COMMISSION_RATE * 100) / 100;
  const tax = Math.round(grossRate * TAX_RATE * 100) / 100;
  const netEarnings = Math.round((grossRate - commission - tax) * 100) / 100;
  return { bookingId, guest, date, grossRate, commission, tax, netEarnings };
}

type NumericLedgerField = "grossRate" | "commission" | "tax" | "netEarnings";

/** Sum a numeric field across ledger entries. */
export function sumLedger(entries: LedgerEntry[], key: NumericLedgerField): number {
  return entries.reduce((sum, e) => sum + e[key], 0);
}

export const mockPayouts: PayoutMonth[] = [
  {
    id: "payout-jul-2026",
    label: "July 2026",
    amount: 4230,
    status: "cleared",
    clearedOn: "5 August 2026",
    entries: [
      buildLedgerEntry("BK-9041", "Alice Walker", "2026-07-03", 1200),
      buildLedgerEntry("BK-9053", "Marcus Thorne", "2026-07-08", 860),
      buildLedgerEntry("BK-9062", "Emma Lewis", "2026-07-12", 740),
      buildLedgerEntry("BK-9070", "Samuel Nkhoma", "2026-07-15", 1050),
      buildLedgerEntry("BK-9084", "Priya Patel", "2026-07-19", 520),
      buildLedgerEntry("BK-9091", "David Kim", "2026-07-22", 910),
      buildLedgerEntry("BK-9098", "Sarah Jenkins", "2026-07-26", 680),
    ],
  },
  {
    id: "payout-jun-2026",
    label: "June 2026",
    amount: 3875,
    status: "cleared",
    clearedOn: "5 July 2026",
    entries: [
      buildLedgerEntry("BK-8971", "Michael Banda", "2026-06-02", 980),
      buildLedgerEntry("BK-8980", "Grace Mwale", "2026-06-06", 620),
      buildLedgerEntry("BK-8992", "Tom Hardy", "2026-06-11", 1150),
      buildLedgerEntry("BK-9004", "Nomsa Daka", "2026-06-16", 540),
      buildLedgerEntry("BK-9012", "John Chileshe", "2026-06-21", 880),
      buildLedgerEntry("BK-9023", "Lydia Phiri", "2026-06-27", 760),
    ],
  },
  {
    id: "payout-may-2026",
    label: "May 2026",
    amount: 3450,
    status: "cleared",
    clearedOn: "5 June 2026",
    entries: [
      buildLedgerEntry("BK-8890", "Kate Zulu", "2026-05-04", 890),
      buildLedgerEntry("BK-8902", "Paul Musonda", "2026-05-09", 1040),
      buildLedgerEntry("BK-8915", "Amina Hassan", "2026-05-14", 570),
      buildLedgerEntry("BK-8926", "James Kasonde", "2026-05-20", 720),
      buildLedgerEntry("BK-8938", "Chileshe Mutale", "2026-05-27", 650),
    ],
  },
  {
    id: "payout-aug-2026",
    label: "August 2026",
    amount: 2860,
    status: "upcoming",
    entries: [
      buildLedgerEntry("BK-9104", "Noah Tembo", "2026-08-01", 690),
      buildLedgerEntry("BK-9112", "Zainab Banda", "2026-08-05", 840),
      buildLedgerEntry("BK-9120", "Rachel Simwanza", "2026-08-08", 520),
      buildLedgerEntry("BK-9127", "Brian Moyo", "2026-08-12", 960),
    ],
  },
];

/** Quick summary helpers used by the Finance dashboard. */
export const payoutSummary = {
  upcoming: mockPayouts
    .filter((p) => p.status === "upcoming")
    .reduce((sum, p) => sum + p.amount, 0),
  cleared: mockPayouts.filter((p) => p.status === "cleared").reduce((sum, p) => sum + p.amount, 0),
  ytdGross: mockPayouts.reduce((sum, p) => sum + sumLedger(p.entries, "grossRate"), 0),
};
