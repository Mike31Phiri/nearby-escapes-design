export interface HostBooking {
  id: string;
  bookingRef: string;
  listingId: string;
  listingName: string;
  listingType: "stay" | "experience" | "transport";
  listingImage: string;
  guestName: string;
  guestAvatar: string;
  guestEmail: string;
  guestPhone: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  guests: number;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockHostBookings: HostBooking[] = [
  {
    id: "hb-1",
    bookingRef: "NE-2026-9102",
    listingId: "h1",
    listingName: "Luxury Safari Lodge",
    listingType: "stay",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    guestName: "Sarah Phiri",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
    guestEmail: "sarah.phiri@email.com",
    guestPhone: "+260 97 123 4567",
    checkIn: "2026-06-25",
    checkOut: "2026-06-29",
    guests: 2,
    amount: 1800,
    currency: "ZMW",
    status: "pending",
    message:
      "Hello! My husband and I are celebrating our anniversary and would love to stay at your lodge. We're interested in the sunset river cruise — is that included? Also, do you offer any anniversary packages?",
    createdAt: "2026-06-20T10:30:00Z",
    updatedAt: "2026-06-20T10:30:00Z",
  },
  {
    id: "hb-2",
    bookingRef: "NE-2026-9127",
    listingId: "h4",
    listingName: "Victoria Falls Helicopter Tour",
    listingType: "experience",
    listingImage: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=400&q=80",
    guestName: "James Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Banda",
    guestEmail: "james.banda@work.com",
    guestPhone: "+260 96 555 7890",
    date: "2026-06-28",
    guests: 4,
    amount: 720,
    currency: "ZMW",
    status: "pending",
    message:
      "We're a group of 4 looking for the 2-hour helicopter tour over the falls. Two of us are photographers — any restrictions on camera equipment on board? Also, what's the cancellation policy if weather is bad?",
    createdAt: "2026-06-21T14:15:00Z",
    updatedAt: "2026-06-21T14:15:00Z",
  },
  {
    id: "hb-3",
    bookingRef: "NE-2026-8945",
    listingId: "h2",
    listingName: "Kafue River Lodge",
    listingType: "stay",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    guestName: "Emily Zulu",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
    guestEmail: "emily.zulu@example.com",
    guestPhone: "+260 95 333 2211",
    checkIn: "2026-06-24",
    checkOut: "2026-06-29",
    guests: 3,
    amount: 1900,
    currency: "ZMW",
    status: "pending",
    message:
      "We're a family of 3 (our son is 8) looking to experience Kafue. Do you have family-friendly game drives? Also, is the pool open year-round? Looking forward to our first safari!",
    createdAt: "2026-06-19T09:45:00Z",
    updatedAt: "2026-06-19T09:45:00Z",
  },
  {
    id: "hb-4",
    bookingRef: "NE-2026-8842",
    listingId: "h5",
    listingName: "Kafue Game Drive",
    listingType: "experience",
    listingImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80",
    guestName: "Michael Tembo",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Tembo",
    guestEmail: "mike.tembo@travelzambia.com",
    guestPhone: "+260 97 888 9900",
    date: "2026-06-30",
    guests: 2,
    amount: 240,
    currency: "ZMW",
    status: "confirmed",
    createdAt: "2026-06-15T11:00:00Z",
    updatedAt: "2026-06-15T14:30:00Z",
  },
  {
    id: "hb-5",
    bookingRef: "NE-2026-8765",
    listingId: "h1",
    listingName: "Luxury Safari Lodge",
    listingType: "stay",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    guestName: "Grace Mwale",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    guestEmail: "grace.mwale@example.com",
    guestPhone: "+260 96 444 5566",
    checkIn: "2026-06-20",
    checkOut: "2026-06-24",
    guests: 2,
    amount: 1800,
    currency: "ZMW",
    status: "confirmed",
    createdAt: "2026-06-10T08:20:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "hb-6",
    bookingRef: "NE-2026-8601",
    listingId: "h4",
    listingName: "Victoria Falls Helicopter Tour",
    listingType: "experience",
    listingImage: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=400&q=80",
    guestName: "David Mulenga",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=David%20Mulenga",
    guestEmail: "david.mulenga@safari.co.zm",
    guestPhone: "+260 95 777 3344",
    date: "2026-06-21",
    guests: 1,
    amount: 180,
    currency: "ZMW",
    status: "completed",
    createdAt: "2026-06-05T16:45:00Z",
    updatedAt: "2026-06-21T18:00:00Z",
  },
  {
    id: "hb-7",
    bookingRef: "NE-2026-8532",
    listingId: "h2",
    listingName: "Kafue River Lodge",
    listingType: "stay",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    guestName: "Chisala Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chisala%20Banda",
    guestEmail: "chisala.banda@email.com",
    guestPhone: "+260 97 111 2233",
    checkIn: "2026-06-19",
    checkOut: "2026-06-22",
    guests: 7,
    amount: 1140,
    currency: "ZMW",
    status: "completed",
    message:
      "We're a family reunion group — absolutely can't wait! Could we arrange a group dinner by the river on our first night?",
    createdAt: "2026-06-05T07:30:00Z",
    updatedAt: "2026-06-22T10:00:00Z",
  },
  {
    id: "hb-8",
    bookingRef: "NE-2026-8400",
    listingId: "h5",
    listingName: "Kafue Game Drive",
    listingType: "experience",
    listingImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80",
    guestName: "Mwila Phiri",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mwila%20Phiri",
    guestEmail: "mwila.p@example.com",
    guestPhone: "+260 96 222 4455",
    date: "2026-05-15",
    guests: 3,
    amount: 360,
    currency: "ZMW",
    status: "cancelled",
    createdAt: "2026-05-10T12:00:00Z",
    updatedAt: "2026-05-12T09:00:00Z",
  },
];

export const statsFromBookings = (bookings: HostBooking[]) => ({
  total: bookings.length,
  pending: bookings.filter((b) => b.status === "pending").length,
  confirmed: bookings.filter((b) => b.status === "confirmed").length,
  completed: bookings.filter((b) => b.status === "completed").length,
  cancelled: bookings.filter((b) => b.status === "cancelled").length,
  revenue: bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.amount, 0),
  pendingRevenue: bookings
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + b.amount, 0),
});
