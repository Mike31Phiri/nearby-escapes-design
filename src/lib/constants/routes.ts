/**
 * Centralised route constants for Nearby Escapes.
 * Import ROUTES from here — never hardcode path strings in components or hooks.
 *
 * Static paths are plain strings; dynamic paths are arrow functions.
 */

export const ROUTES = {
  home: "/",

  // Public verticals
  stays: {
    index: "/zambia/stays",
    byLocation: (slug: string) => `/${slug}/stays`,
    detail: (slug: string) => `/stays/${slug}`,
    // Legacy — kept for back-compat, both redirect to /zambia/stays
    search: "/stays",
    category: (cat: string) => `/stays/category/${cat}`,
    province: (prov: string) => `/${prov}/stays`,
  },

  experiences: {
    index: "/experiences",
    search: "/experiences",
    detail: (slug: string) => `/experiences/${slug}`,
    category: (cat: string) => `/experiences/category/${cat}`,
    province: (prov: string) => `/experiences/province/${prov}`,
  },

  transport: {
    index: "/transport",
    search: "/transport",
    detail: (slug: string) => `/transport/${slug}`,
    route: (r: string) => `/transport/routes/${r}`,
  },

  packages: {
    index: "/packages",
    detail: (slug: string) => `/packages/${slug}`,
    category: (cat: string) => `/packages/category/${cat}`,
  },

  // Public pages
  about: "/about",
  howItWorks: "/how-it-works",
  safety: "/safety",
  contact: "/contact",
  faqs: "/faqs",
  terms: "/terms",
  privacy: "/privacy",
  listProperty: "/list-property",

  // Auth
  login: "/login",
  register: "/register",
  registerGuest: "/register/guest",
  registerHost: "/register/host",
  verify: "/verify",
  forgotPassword: "/forgot-password",

  // Booking flow
  bookReview: (id: string) => `/book/${id}/review`,
  bookPayment: (id: string) => `/book/${id}/payment`,
  bookConfirmation: (id: string) => `/book/${id}/confirmation`,
  tripAddOns: (tripId: string) => `/book/trip/${tripId}/add-ons`,

  // Guest account
  account: {
    profile: "/profile",
    trips: "/account/trips",
    trip: (id: string) => `/account/trips/${id}`,
    saved: "/account/saved",
    reviews: "/account/reviews",
    loyalty: "/account/loyalty",
    messages: "/account/messages",
    thread: (id: string) => `/account/messages/${id}`,
    settings: "/account/settings",
  },

  // Host listing creation drafts — spec: /listings/create/[id]?step=N
  listingDrafts: {
    /** Entry point: capability check → type select → auto-create draft */
    create: "/host/create",
    /** The wizard editor, one step per URL query param */
    editor: (id: string, step = 1) => `/listings/create/${id}?step=${step}`,
    base: "/listings/create",
  },

  // Host portal
  host: {
    dashboard: "/host/dashboard",
    listings: "/host/listings",
    listing: (id: string) => `/host/listings/${id}`,
    editListing: (id: string) => `/host/listings/${id}/edit`,
    bookings: "/host/bookings",
    booking: (id: string) => `/host/bookings/${id}`,
    inventory: "/host/inventory",
    earnings: "/host/earnings",
    financeLedger: (id: string) => `/host/finances/ledger/${id}`,
    reviews: "/host/reviews",
    account: "/host/account",
    settings: "/host/settings",
    availability: "/host/availability",
  },

  // Admin portal
  admin: {
    dashboard: "/admin/dashboard",
    bookings: "/admin/bookings",
    listings: "/admin/listings",
    packages: "/admin/listings/packages",
    newPackage: "/admin/listings/packages/new",
    package: (id: string) => `/admin/listings/packages/${id}`,
    users: "/admin/users",
    user: (id: string) => `/admin/users/${id}`,
    finance: "/admin/finance",
    payouts: "/admin/finance/payouts",
    reports: "/admin/finance/reports",
    reviews: "/admin/reviews",
    content: "/admin/content",
    analytics: "/admin/analytics",
    notifications: "/admin/notifications",
    settings: "/admin/settings",
    team: "/admin/settings/team",
  },
} as const;
