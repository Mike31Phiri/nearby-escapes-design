export interface HostListing {
  id: string;
  name: string;
  type: "stay" | "experience" | "transport";
  location: string;
  status: "active" | "pending" | "draft";
  image: string;
  price: number;
  bookings: number;
  rating: number;
  revenue: number;
}

export interface TripBooking {
  id: string;
  type: "stay" | "experience" | "transport";
  name: string;
  location: string;
  image: string;
  date: string;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
  bookingRef: string;
}

export interface UserReview {
  id: string;
  listingName: string;
  listingType: "stay" | "experience" | "transport";
  rating: number;
  date: string;
  text: string;
}

export interface HostProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  joined: string;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string;
  verifiedBadges: string[];
  listings: HostListing[];
  totalRevenue: number;
  totalBookings: number;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
  bookings: number;
}

// ---- Host Profiles ----

export const mockHostProfile: HostProfile = {
  id: "host-1",
  name: "Chanda Bwalya",
  email: "chanda.bwalya@nearbyescapes.com",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chanda%20Bwalya",
  bio: "Zambian-born travel enthusiast and hospitality curator. I handpick the finest lodges, camps, and experiences across Zambia to ensure every guest leaves with unforgettable memories.",
  location: "Lusaka, Zambia",
  joined: "January 2023",
  rating: 4.92,
  reviewCount: 187,
  responseRate: 98,
  responseTime: "within 1 hour",
  verifiedBadges: ["Identity Verified", "Email Verified", "Phone Verified"],
  totalRevenue: 184_500,
  totalBookings: 342,
  listings: [
    {
      id: "h1",
      name: "Luxury Safari Lodge",
      type: "stay",
      location: "Lower Zambezi",
      status: "active",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      price: 450,
      bookings: 128,
      rating: 4.9,
      revenue: 57600,
    },
    {
      id: "h2",
      name: "Kafue River Lodge",
      type: "stay",
      location: "Kafue National Park",
      status: "active",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      price: 380,
      bookings: 92,
      rating: 4.8,
      revenue: 34960,
    },
    {
      id: "h3",
      name: "Bangweulu Wetlands Camp",
      type: "stay",
      location: "Bangweulu",
      status: "active",
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      price: 420,
      bookings: 67,
      rating: 4.9,
      revenue: 28140,
    },
    {
      id: "h4",
      name: "Victoria Falls Helicopter Tour",
      type: "experience",
      location: "Livingstone",
      status: "active",
      image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=800&q=80",
      price: 180,
      bookings: 342,
      rating: 4.9,
      revenue: 61560,
    },
    {
      id: "h5",
      name: "Kafue Game Drive",
      type: "experience",
      location: "Kafue National Park",
      status: "active",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
      price: 120,
      bookings: 201,
      rating: 4.8,
      revenue: 24120,
    },
    {
      id: "h6",
      name: "Lusaka to Livingstone Bus Route",
      type: "transport",
      location: "Lusaka → Livingstone",
      status: "draft",
      image: "https://images.unsplash.com/photo-1544620347-f4fd8749f24e?w=800&q=80",
      price: 250,
      bookings: 0,
      rating: 0,
      revenue: 0,
    },
  ],
};

// ---- Mock Monthly Earnings ----
export const mockEarnings: MonthlyEarning[] = [
  { month: "Jan", amount: 12400, bookings: 24 },
  { month: "Feb", amount: 10800, bookings: 19 },
  { month: "Mar", amount: 15600, bookings: 31 },
  { month: "Apr", amount: 18900, bookings: 36 },
  { month: "May", amount: 22800, bookings: 44 },
  { month: "Jun", amount: 25600, bookings: 51 },
  { month: "Jul", amount: 28400, bookings: 56 },
  { month: "Aug", amount: 27500, bookings: 53 },
  { month: "Sep", amount: 23100, bookings: 46 },
  { month: "Oct", amount: 19200, bookings: 38 },
  { month: "Nov", amount: 14500, bookings: 28 },
  { month: "Dec", amount: 16700, bookings: 33 },
];

// ---- Guest Trip History ----
export const mockTrips: TripBooking[] = [
  {
    id: "trip-1",
    type: "stay",
    name: "Luxury Safari Lodge",
    location: "Lower Zambezi",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    date: "2025-03-15",
    status: "completed",
    price: 450,
    bookingRef: "NE-2025-8842",
  },
  {
    id: "trip-2",
    type: "experience",
    name: "Victoria Falls Helicopter Tour",
    location: "Livingstone",
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=800&q=80",
    date: "2025-06-20",
    status: "upcoming",
    price: 180,
    bookingRef: "NE-2025-9127",
  },
  {
    id: "trip-3",
    type: "transport",
    name: "Lusaka to Livingstone Bus",
    location: "Lusaka → Livingstone",
    image: "https://images.unsplash.com/photo-1544620347-f4fd8749f24e?w=800&q=80",
    date: "2025-04-02",
    status: "completed",
    price: 250,
    bookingRef: "NE-2025-8901",
  },
  {
    id: "trip-4",
    type: "stay",
    name: "Kafue River Lodge",
    location: "Kafue National Park",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    date: "2025-08-10",
    status: "upcoming",
    price: 380,
    bookingRef: "NE-2025-9453",
  },
  {
    id: "trip-5",
    type: "experience",
    name: "South Luangwa Walking Safari",
    location: "Mfuwe",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    date: "2024-11-05",
    status: "completed",
    price: 150,
    bookingRef: "NE-2024-7621",
  },
  {
    id: "trip-6",
    type: "stay",
    name: "Victoria Falls Hotel",
    location: "Livingstone",
    date: "2025-01-18",
    status: "cancelled",
    price: 320,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    bookingRef: "NE-2025-8712",
  },
];

// ---- Guest Reviews ----
export const mockReviews: UserReview[] = [
  {
    id: "rev-1",
    listingName: "Luxury Safari Lodge",
    listingType: "stay",
    rating: 5,
    date: "2025-03-20",
    text: "An absolutely breathtaking experience! Waking up to elephants at dawn was magical. The staff went above and beyond to make our stay unforgettable. The private plunge pool with views of the Zambezi was the highlight.",
  },
  {
    id: "rev-2",
    listingName: "Kafue Game Drive",
    listingType: "experience",
    rating: 5,
    date: "2025-03-22",
    text: "Our guide Moses was incredibly knowledgeable. We spotted all of the Big Five plus countless birds. The sundowner drinks in the bush were a perfect end to the day.",
  },
  {
    id: "rev-3",
    listingName: "Lusaka to Livingstone Bus",
    listingType: "transport",
    rating: 4,
    date: "2025-04-03",
    text: "Comfortable ride with air conditioning and WiFi. The bus was on time and the driver was professional. Would recommend for the budget-friendly option between cities.",
  },
  {
    id: "rev-4",
    listingName: "South Luangwa Walking Safari",
    listingType: "experience",
    rating: 5,
    date: "2024-11-08",
    text: "Walking with experienced rangers through the bush was a life-changing experience. Got up close (but safe!) with giraffes, zebras, and even a pride of lions. This is a must-do!",
  },
];
