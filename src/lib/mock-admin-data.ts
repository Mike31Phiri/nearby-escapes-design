export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "guest" | "host" | "admin";
  status: "active" | "suspended" | "pending verification";
  location: string;
  joined: string;
  totalBookings: number;
  totalSpent: number;
  listings?: number;
  revenue?: number;
  lastActive: string;
}

export interface PendingListing {
  id: string;
  name: string;
  type: "stay" | "experience" | "transport";
  hostName: string;
  hostId: string;
  location: string;
  price: number;
  image: string;
  submittedAt: string;
  status: "pending_review" | "approved" | "rejected";
  reason?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalGuests: number;
  totalHosts: number;
  totalListings: number;
  activeListings: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  platformCommission: number;
  avgRating: number;
  growthRate: number;
  pendingModeration: number;
  reportedListings: number;
}

export interface MonthlyPlatformData {
  month: string;
  newUsers: number;
  newBookings: number;
  revenue: number;
  commission: number;
}

export interface SystemSetting {
  id: string;
  category: string;
  key: string;
  label: string;
  value: string;
  type: "text" | "number" | "percentage" | "boolean" | "select";
  options?: string[];
  description: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  userRole: "guest" | "host" | "admin";
  target: string;
  timestamp: string;
  type: "booking" | "listing" | "user" | "payment" | "report" | "system";
}

//Platform Stats ─────────────────────────────────────────────────

export const mockPlatformStats: PlatformStats = {
  totalUsers: 2847,
  totalGuests: 2410,
  totalHosts: 437,
  totalListings: 682,
  activeListings: 514,
  totalBookings: 12893,
  completedBookings: 10241,
  totalRevenue: 4_827_500,
  platformCommission: 724_125,
  avgRating: 4.72,
  growthRate: 23.5,
  pendingModeration: 18,
  reportedListings: 3,
};

//Monthly Data ───────────────────────────────────────────────────

export const mockMonthlyData: MonthlyPlatformData[] = [
  { month: "Jan", newUsers: 185, newBookings: 890, revenue: 342_000, commission: 51_300 },
  { month: "Feb", newUsers: 162, newBookings: 765, revenue: 298_000, commission: 44_700 },
  { month: "Mar", newUsers: 210, newBookings: 1020, revenue: 410_000, commission: 61_500 },
  { month: "Apr", newUsers: 198, newBookings: 945, revenue: 385_000, commission: 57_750 },
  { month: "May", newUsers: 245, newBookings: 1120, revenue: 456_000, commission: 68_400 },
  { month: "Jun", newUsers: 280, newBookings: 1280, revenue: 520_000, commission: 78_000 },
  { month: "Jul", newUsers: 310, newBookings: 1420, revenue: 578_000, commission: 86_700 },
  { month: "Aug", newUsers: 295, newBookings: 1350, revenue: 545_000, commission: 81_750 },
  { month: "Sep", newUsers: 230, newBookings: 1100, revenue: 445_000, commission: 66_750 },
  { month: "Oct", newUsers: 215, newBookings: 1050, revenue: 420_000, commission: 63_000 },
  { month: "Nov", newUsers: 195, newBookings: 970, revenue: 392_000, commission: 58_800 },
  { month: "Dec", newUsers: 260, newBookings: 1180, revenue: 478_000, commission: 71_700 },
];

//Admin Users ────────────────────────────────────────────────────

export const mockAdminUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Sarah Phiri",
    email: "sarah.phiri@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
    role: "guest",
    status: "active",
    location: "Lusaka, Zambia",
    joined: "2024-03-15",
    totalBookings: 12,
    totalSpent: 8450,
    lastActive: "2025-06-28T10:30:00Z",
  },
  {
    id: "u2",
    name: "Chanda Bwalya",
    email: "chanda.bwalya@nearbyescapes.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chanda%20Bwalya",
    role: "host",
    status: "active",
    location: "Lusaka, Zambia",
    joined: "2023-01-10",
    totalBookings: 342,
    totalSpent: 0,
    listings: 6,
    revenue: 184500,
    lastActive: "2025-06-29T08:15:00Z",
  },
  {
    id: "u3",
    name: "James Banda",
    email: "james.banda@work.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Banda",
    role: "guest",
    status: "active",
    location: "Ndola, Zambia",
    joined: "2024-06-20",
    totalBookings: 5,
    totalSpent: 2340,
    lastActive: "2025-06-27T14:00:00Z",
  },
  {
    id: "u4",
    name: "Emily Zulu",
    email: "emily.zulu@example.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
    role: "guest",
    status: "active",
    location: "Kitwe, Zambia",
    joined: "2024-08-05",
    totalBookings: 8,
    totalSpent: 5120,
    lastActive: "2025-06-26T09:45:00Z",
  },
  {
    id: "u5",
    name: "Michael Tembo",
    email: "mike.tembo@travelzambia.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Tembo",
    role: "host",
    status: "active",
    location: "Livingstone, Zambia",
    joined: "2023-09-01",
    totalBookings: 128,
    totalSpent: 0,
    listings: 3,
    revenue: 61560,
    lastActive: "2025-06-28T16:30:00Z",
  },
  {
    id: "u6",
    name: "Grace Mwale",
    email: "grace.mwale@example.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    role: "guest",
    status: "suspended",
    location: "Chipata, Zambia",
    joined: "2024-11-12",
    totalBookings: 3,
    totalSpent: 1800,
    lastActive: "2025-06-15T10:00:00Z",
  },
  {
    id: "u7",
    name: "David Mulenga",
    email: "david.mulenga@safari.co.zm",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=David%20Mulenga",
    role: "host",
    status: "active",
    location: "Mfuwe, Zambia",
    joined: "2023-04-18",
    totalBookings: 201,
    totalSpent: 0,
    listings: 4,
    revenue: 42120,
    lastActive: "2025-06-29T07:00:00Z",
  },
  {
    id: "u8",
    name: "Chisala Banda",
    email: "chisala.banda@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chisala%20Banda",
    role: "guest",
    status: "pending verification",
    location: "Kabwe, Zambia",
    joined: "2025-06-20",
    totalBookings: 0,
    totalSpent: 0,
    lastActive: "2025-06-20T07:30:00Z",
  },
  {
    id: "u9",
    name: "Mwila Phiri",
    email: "mwila.p@example.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mwila%20Phiri",
    role: "guest",
    status: "active",
    location: "Solwezi, Zambia",
    joined: "2024-10-01",
    totalBookings: 7,
    totalSpent: 3890,
    lastActive: "2025-06-25T12:00:00Z",
  },
  {
    id: "u10",
    name: "Admin User",
    email: "admin@nearbyescapes.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
    role: "admin",
    status: "active",
    location: "Lusaka, Zambia",
    joined: "2023-01-01",
    totalBookings: 0,
    totalSpent: 0,
    lastActive: "2025-06-29T09:00:00Z",
  },
  {
    id: "u11",
    name: "Trevor Banda",
    email: "trevor.banda@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Trevor%20Banda",
    role: "guest",
    status: "active",
    location: "Mongu, Zambia",
    joined: "2025-01-15",
    totalBookings: 2,
    totalSpent: 980,
    lastActive: "2025-06-22T11:00:00Z",
  },
  {
    id: "u12",
    name: "Nomsa Tembo",
    email: "nomsa.tembo@example.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Nomsa%20Tembo",
    role: "host",
    status: "pending verification",
    location: "Siavonga, Zambia",
    joined: "2025-06-25",
    totalBookings: 0,
    totalSpent: 0,
    listings: 1,
    revenue: 0,
    lastActive: "2025-06-25T14:00:00Z",
  },
];

//Pending Listings (Moderation Queue) ────────────────────────────

export const mockPendingListings: PendingListing[] = [
  {
    id: "pl-1",
    name: "Kafue River Lodge",
    type: "stay",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    location: "Kafue National Park",
    price: 380,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    submittedAt: "2025-06-27T10:30:00Z",
    status: "pending_review",
  },
  {
    id: "pl-2",
    name: "Victoria Falls Helicopter Tour",
    type: "experience",
    hostName: "Michael Tembo",
    hostId: "u5",
    location: "Livingstone",
    price: 180,
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=400&q=80",
    submittedAt: "2025-06-26T14:00:00Z",
    status: "pending_review",
  },
  {
    id: "pl-3",
    name: "Lusaka to Chipata Express",
    type: "transport",
    hostName: "David Mulenga",
    hostId: "u7",
    location: "Lusaka → Chipata",
    price: 200,
    image: "https://images.unsplash.com/photo-1544620347-f4fd8749f24e?w=400&q=80",
    submittedAt: "2025-06-25T09:15:00Z",
    status: "pending_review",
  },
  {
    id: "pl-4",
    name: "Lake Kariba Houseboat",
    type: "stay",
    hostName: "Nomsa Tembo",
    hostId: "u12",
    location: "Siavonga",
    price: 550,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    submittedAt: "2025-06-25T08:00:00Z",
    status: "pending_review",
  },
  {
    id: "pl-5",
    name: "Livingstone Cultural Tour",
    type: "experience",
    hostName: "Michael Tembo",
    hostId: "u5",
    location: "Livingstone",
    price: 85,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80",
    submittedAt: "2025-06-24T16:45:00Z",
    status: "pending_review",
  },
  {
    id: "pl-6",
    name: "Bangweulu Bird Watching Expedition",
    type: "experience",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    location: "Bangweulu",
    price: 160,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80",
    submittedAt: "2025-06-23T11:30:00Z",
    status: "approved",
  },
  {
    id: "pl-7",
    name: "Kitwe to Ndola Shuttle",
    type: "transport",
    hostName: "David Mulenga",
    hostId: "u7",
    location: "Kitwe → Ndola",
    price: 95,
    image: "https://images.unsplash.com/photo-1544620347-f4fd8749f24e?w=400&q=80",
    submittedAt: "2025-06-22T07:00:00Z",
    status: "rejected",
    reason: "Incomplete documentation — operator license not uploaded",
  },
  {
    id: "pl-8",
    name: "Luxury Safari Lodge - Peak Season",
    type: "stay",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    location: "Lower Zambezi",
    price: 650,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    submittedAt: "2025-06-21T10:00:00Z",
    status: "approved",
  },
];

//Activity Log ───────────────────────────────────────────────────

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "a1",
    action: "New booking confirmed",
    user: "Sarah Phiri",
    userRole: "guest",
    target: "Luxury Safari Lodge",
    timestamp: "2025-06-29T08:30:00Z",
    type: "booking",
  },
  {
    id: "a2",
    action: "New listing submitted",
    user: "Nomsa Tembo",
    userRole: "host",
    target: "Lake Kariba Houseboat",
    timestamp: "2025-06-29T07:00:00Z",
    type: "listing",
  },
  {
    id: "a3",
    action: "Account flagged for verification",
    user: "Chisala Banda",
    userRole: "guest",
    target: "Account #u8",
    timestamp: "2025-06-28T18:00:00Z",
    type: "user",
  },
  {
    id: "a4",
    action: "Commission payout processed",
    user: "System",
    userRole: "admin",
    target: "Monthly host payouts",
    timestamp: "2025-06-28T12:00:00Z",
    type: "payment",
  },
  {
    id: "a5",
    action: "Listing approved",
    user: "Admin User",
    userRole: "admin",
    target: "Bangweulu Bird Watching",
    timestamp: "2025-06-27T15:30:00Z",
    type: "listing",
  },
  {
    id: "a6",
    action: "Booking cancelled",
    user: "Grace Mwale",
    userRole: "guest",
    target: "Kafue River Lodge",
    timestamp: "2025-06-27T09:00:00Z",
    type: "booking",
  },
  {
    id: "a7",
    action: "New host registration",
    user: "Nomsa Tembo",
    userRole: "host",
    target: "Host account created",
    timestamp: "2025-06-25T14:00:00Z",
    type: "user",
  },
  {
    id: "a8",
    action: "Payment dispute raised",
    user: "Grace Mwale",
    userRole: "guest",
    target: "Transaction #TX-2847",
    timestamp: "2025-06-24T11:00:00Z",
    type: "payment",
  },
  {
    id: "a9",
    action: "Listing rejected",
    user: "Admin User",
    userRole: "admin",
    target: "Kitwe to Ndola Shuttle",
    timestamp: "2025-06-23T16:00:00Z",
    type: "listing",
  },
  {
    id: "a10",
    action: "Suspicious activity reported",
    user: "System",
    userRole: "admin",
    target: "User account #u6",
    timestamp: "2025-06-22T10:00:00Z",
    type: "report",
  },
  {
    id: "a11",
    action: "Commission rate updated",
    user: "Admin User",
    userRole: "admin",
    target: "Platform settings",
    timestamp: "2025-06-21T09:00:00Z",
    type: "system",
  },
  {
    id: "a12",
    action: "Bulk email sent",
    user: "System",
    userRole: "admin",
    target: "Monthly newsletter",
    timestamp: "2025-06-20T08:00:00Z",
    type: "system",
  },
];

//System Settings ────────────────────────────────────────────────

export const mockSystemSettings: SystemSetting[] = [
  {
    id: "s1",
    category: "commission",
    key: "commission_rate",
    label: "Platform Commission Rate",
    value: "15",
    type: "percentage",
    description: "Percentage taken from each booking as platform fee",
  },
  {
    id: "s2",
    category: "commission",
    key: "host_payout_delay",
    label: "Host Payout Delay (days)",
    value: "3",
    type: "number",
    description: "Number of days after check-out before host receives payment",
  },
  {
    id: "s3",
    category: "booking",
    key: "max_guests_per_booking",
    label: "Max Guests Per Booking",
    value: "20",
    type: "number",
    description: "Maximum number of guests allowed in a single booking",
  },
  {
    id: "s4",
    category: "booking",
    key: "cancellation_window",
    label: "Cancellation Window (hours)",
    value: "48",
    type: "number",
    description: "Hours before check-in within which free cancellation is allowed",
  },
  {
    id: "s5",
    category: "booking",
    key: "auto_confirm_bookings",
    label: "Auto-Confirm Bookings",
    value: "false",
    type: "boolean",
    description: "Automatically confirm bookings without host approval",
  },
  {
    id: "s6",
    category: "moderation",
    key: "require_listing_approval",
    label: "Require Listing Approval",
    value: "true",
    type: "boolean",
    description: "All new listings must be approved by an admin before going live",
  },
  {
    id: "s7",
    category: "moderation",
    key: "max_reports_before_auto_suspend",
    label: "Auto-Suspend After Reports",
    value: "5",
    type: "number",
    description: "Number of reports before a listing is automatically suspended",
  },
  {
    id: "s8",
    category: "platform",
    key: "platform_name",
    label: "Platform Name",
    value: "Nearby Escapes",
    type: "text",
    description: "The public-facing name of the platform",
  },
  {
    id: "s9",
    category: "platform",
    key: "support_email",
    label: "Support Email",
    value: "support@nearbyescapes.com",
    type: "text",
    description: "Primary support email address displayed to users",
  },
  {
    id: "s10",
    category: "platform",
    key: "currency",
    label: "Default Currency",
    value: "ZMW",
    type: "select",
    options: ["ZMW", "USD", "EUR"],
    description: "Default currency for all platform transactions",
  },
  {
    id: "s11",
    category: "notifications",
    key: "admin_booking_notifications",
    label: "Admin Booking Notifications",
    value: "true",
    type: "boolean",
    description: "Send email notifications to admins for new bookings",
  },
  {
    id: "s12",
    category: "notifications",
    key: "admin_report_notifications",
    label: "Admin Report Notifications",
    value: "true",
    type: "boolean",
    description: "Notify admins when a listing or user is reported",
  },
];

//Dispute Types ────────────────────────────────────────────────────

export interface DisputeCase {
  id: string;
  bookingRef: string;
  listingName: string;
  listingType: "stay" | "experience" | "transport";
  guestName: string;
  guestId: string;
  hostName: string;
  hostId: string;
  amount: number;
  reason: string;
  description: string;
  status: "open" | "investigating" | "resolved_host" | "resolved_guest" | "refunded" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  raisedBy: "guest" | "host" | "system";
  raisedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface PayoutRecord {
  id: string;
  hostName: string;
  hostId: string;
  amount: number;
  commission: number;
  netAmount: number;
  period: string;
  status: "pending" | "processing" | "paid" | "failed";
  method: "bank_transfer" | "mobile_money" | "paypal";
  processedAt?: string;
  bookingRefs: string[];
}

export interface PromoCode {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_delivery";
  value: number;
  minSpend?: number;
  maxUses: number;
  currentUses: number;
  appliesTo: "all" | "stay" | "experience" | "transport";
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface FeaturedListing {
  id: string;
  listingName: string;
  listingType: "stay" | "experience" | "transport";
  hostName: string;
  placement: "homepage_banner" | "category_featured" | "search_boost";
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  cost: number;
}

//Mock Disputes ──────────────────────────────────────────────────

export const mockDisputes: DisputeCase[] = [
  {
    id: "dp-1",
    bookingRef: "BK-2025-0428",
    listingName: "Kafue River Lodge",
    listingType: "stay",
    guestName: "Grace Mwale",
    guestId: "u6",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    amount: 5400,
    reason: "Property not as described",
    description:
      "The lodge had no running water for 2 of the 3 nights. Guest is requesting a 50% refund. Host claims the water issue was due to a broken pump that was fixed within 12 hours.",
    status: "open",
    priority: "high",
    raisedBy: "guest",
    raisedAt: "2025-06-24T11:00:00Z",
  },
  {
    id: "dp-2",
    bookingRef: "BK-2025-0391",
    listingName: "Victoria Falls Helicopter Tour",
    listingType: "experience",
    guestName: "Sarah Phiri",
    guestId: "u1",
    hostName: "Michael Tembo",
    hostId: "u5",
    amount: 3200,
    reason: "Tour cancelled by host at last minute",
    description:
      "Helicopter tour was cancelled 2 hours before departure due to 'maintenance issues'. Guest had already travelled to Livingstone and missed other activities. Seeking full refund plus compensation.",
    status: "investigating",
    priority: "critical",
    raisedBy: "guest",
    raisedAt: "2025-06-22T14:30:00Z",
  },
  {
    id: "dp-3",
    bookingRef: "BK-2025-0372",
    listingName: "Lusaka to Chipata Express",
    listingType: "transport",
    guestName: "James Banda",
    guestId: "u3",
    hostName: "David Mulenga",
    hostId: "u7",
    amount: 320,
    reason: "Vehicle broke down en route",
    description:
      "The shuttle broke down 2 hours into the journey. Passengers were stranded for 4 hours waiting for a replacement vehicle. Guest is requesting a 50% refund of the fare.",
    status: "open",
    priority: "medium",
    raisedBy: "guest",
    raisedAt: "2025-06-20T09:00:00Z",
  },
  {
    id: "dp-4",
    bookingRef: "BK-2025-0445",
    listingName: "Lake Kariba Houseboat",
    listingType: "stay",
    guestName: "Emily Zulu",
    guestId: "u4",
    hostName: "Nomsa Tembo",
    hostId: "u12",
    amount: 7800,
    reason: "Guest damaged property",
    description:
      "Host reports that the guest caused damage to the houseboat's interior furniture valued at K2,000. Guest denies responsibility, claiming the furniture was already damaged. Host is requesting compensation.",
    status: "investigating",
    priority: "medium",
    raisedBy: "host",
    raisedAt: "2025-06-18T16:00:00Z",
  },
  {
    id: "dp-5",
    bookingRef: "BK-2025-0360",
    listingName: "Lower Zambezi Safari Lodge",
    listingType: "stay",
    guestName: "Mwila Phiri",
    guestId: "u9",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    amount: 6200,
    reason: "Double booking conflict",
    description:
      "System allowed two bookings for the same dates. Host can only accommodate one party. Guest is flexible on dates but wants a 15% discount on the rescheduled booking. Host is agreeable but wants platform to cover the discount.",
    status: "open",
    priority: "high",
    raisedBy: "system",
    raisedAt: "2025-06-15T10:00:00Z",
  },
];

//Mock Payouts ───────────────────────────────────────────────────

export const mockPayouts: PayoutRecord[] = [
  {
    id: "po-1",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    amount: 18450,
    commission: 2768,
    netAmount: 15682,
    period: "Jun 2025",
    status: "paid",
    method: "bank_transfer",
    processedAt: "2025-06-28T12:00:00Z",
    bookingRefs: ["BK-2025-0428", "BK-2025-0410", "BK-2025-0395"],
  },
  {
    id: "po-2",
    hostName: "Michael Tembo",
    hostId: "u5",
    amount: 8200,
    commission: 1230,
    netAmount: 6970,
    period: "Jun 2025",
    status: "processing",
    method: "mobile_money",
    bookingRefs: ["BK-2025-0391", "BK-2025-0382"],
  },
  {
    id: "po-3",
    hostName: "David Mulenga",
    hostId: "u7",
    amount: 5600,
    commission: 840,
    netAmount: 4760,
    period: "Jun 2025",
    status: "pending",
    method: "bank_transfer",
    bookingRefs: ["BK-2025-0372", "BK-2025-0365"],
  },
  {
    id: "po-4",
    hostName: "Nomsa Tembo",
    hostId: "u12",
    amount: 3200,
    commission: 480,
    netAmount: 2720,
    period: "Jun 2025",
    status: "pending",
    method: "mobile_money",
    bookingRefs: ["BK-2025-0445"],
  },
  {
    id: "po-5",
    hostName: "Chanda Bwalya",
    hostId: "u2",
    amount: 22300,
    commission: 3345,
    netAmount: 18955,
    period: "May 2025",
    status: "paid",
    method: "bank_transfer",
    processedAt: "2025-05-28T10:00:00Z",
    bookingRefs: ["BK-2025-0340", "BK-2025-0332", "BK-2025-0321", "BK-2025-0310"],
  },
  {
    id: "po-6",
    hostName: "David Mulenga",
    hostId: "u7",
    amount: 9100,
    commission: 1365,
    netAmount: 7735,
    period: "May 2025",
    status: "paid",
    method: "bank_transfer",
    processedAt: "2025-05-28T10:00:00Z",
    bookingRefs: ["BK-2025-0335", "BK-2025-0328"],
  },
  {
    id: "po-7",
    hostName: "Michael Tembo",
    hostId: "u5",
    amount: 12400,
    commission: 1860,
    netAmount: 10540,
    period: "May 2025",
    status: "paid",
    method: "mobile_money",
    processedAt: "2025-05-28T10:00:00Z",
    bookingRefs: ["BK-2025-0342", "BK-2025-0325"],
  },
  {
    id: "po-8",
    hostName: "Nomsa Tembo",
    hostId: "u12",
    amount: 2100,
    commission: 315,
    netAmount: 1785,
    period: "Apr 2025",
    status: "failed",
    method: "bank_transfer",
    bookingRefs: ["BK-2025-0290"],
  },
];

//Mock Promotions ────────────────────────────────────────────────

export const mockPromoCodes: PromoCode[] = [
  {
    id: "pr-1",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    maxUses: 500,
    currentUses: 234,
    appliesTo: "all",
    startsAt: "2025-01-01T00:00:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
    isActive: true,
    description: "20% off first booking for new users",
  },
  {
    id: "pr-2",
    code: "ZAMBIA10",
    type: "percentage",
    value: 10,
    minSpend: 500,
    maxUses: 200,
    currentUses: 87,
    appliesTo: "stay",
    startsAt: "2025-03-01T00:00:00Z",
    expiresAt: "2025-09-30T23:59:59Z",
    isActive: true,
    description: "10% off stays over K500 — Zambia residents only",
  },
  {
    id: "pr-3",
    code: "SAFARI50",
    type: "fixed",
    value: 50,
    minSpend: 1000,
    maxUses: 100,
    currentUses: 12,
    appliesTo: "experience",
    startsAt: "2025-04-01T00:00:00Z",
    expiresAt: "2025-08-31T23:59:59Z",
    isActive: true,
    description: "K50 off any safari experience",
  },
  {
    id: "pr-4",
    code: "BUSFARE",
    type: "percentage",
    value: 15,
    maxUses: 300,
    currentUses: 301,
    appliesTo: "transport",
    startsAt: "2025-05-01T00:00:00Z",
    expiresAt: "2025-07-31T23:59:59Z",
    isActive: false,
    description: "15% off bus bookings — maxed out",
  },
  {
    id: "pr-5",
    code: "FLASHSALE",
    type: "fixed",
    value: 200,
    minSpend: 2000,
    maxUses: 50,
    currentUses: 38,
    appliesTo: "all",
    startsAt: "2025-06-15T00:00:00Z",
    expiresAt: "2025-06-30T23:59:59Z",
    isActive: true,
    description: "K200 off bookings over K2,000 — flash sale",
  },
];

export const mockFeaturedListings: FeaturedListing[] = [
  {
    id: "fl-1",
    listingName: "Luxury Safari Lodge",
    listingType: "stay",
    hostName: "Chanda Bwalya",
    placement: "homepage_banner",
    startsAt: "2025-06-01T00:00:00Z",
    endsAt: "2025-08-31T23:59:59Z",
    isActive: true,
    cost: 500,
  },
  {
    id: "fl-2",
    listingName: "Victoria Falls Helicopter Tour",
    listingType: "experience",
    hostName: "Michael Tembo",
    placement: "category_featured",
    startsAt: "2025-05-15T00:00:00Z",
    endsAt: "2025-07-15T23:59:59Z",
    isActive: true,
    cost: 200,
  },
  {
    id: "fl-3",
    listingName: "Lusaka to Chipata Express",
    listingType: "transport",
    hostName: "David Mulenga",
    placement: "search_boost",
    startsAt: "2025-06-01T00:00:00Z",
    endsAt: "2025-07-01T23:59:59Z",
    isActive: false,
    cost: 100,
  },
  {
    id: "fl-4",
    listingName: "Lake Kariba Houseboat",
    listingType: "stay",
    hostName: "Nomsa Tembo",
    placement: "category_featured",
    startsAt: "2025-07-01T00:00:00Z",
    endsAt: "2025-09-30T23:59:59Z",
    isActive: true,
    cost: 300,
  },
];

//Helpers ────────────────────────────────────────────────────────

export function statsFromUsers(users: AdminUser[]) {
  return {
    total: users.length,
    guests: users.filter((u) => u.role === "guest").length,
    hosts: users.filter((u) => u.role === "host").length,
    admins: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pendingVerification: users.filter((u) => u.status === "pending verification").length,
  };
}

export function statsFromListings(listings: PendingListing[]) {
  return {
    total: listings.length,
    pendingReview: listings.filter((l) => l.status === "pending_review").length,
    approved: listings.filter((l) => l.status === "approved").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };
}
