export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isHost: boolean;
}

export interface Thread {
  id: string;
  guestName: string;
  guestAvatar: string;
  guestInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  listingName: string;
  listingImage: string;
  messages: Message[];
}

export const mockThreads: Thread[] = [
  {
    id: "thread-1",
    guestName: "Sarah Phiri",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
    guestInitials: "SP",
    lastMessage: "Perfect, thank you so much! We'll see you on the 25th. 😊",
    lastMessageTime: "2026-06-22T14:30:00Z",
    unread: true,
    listingName: "Luxury Safari Lodge",
    listingImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    messages: [
      {
        id: "m1",
        senderId: "guest-1",
        senderName: "Sarah Phiri",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
        text: "Hello! My husband and I are celebrating our anniversary and would love to stay at your lodge. We're interested in the sunset river cruise — is that included?",
        timestamp: "2026-06-20T10:30:00Z",
        isHost: false,
      },
      {
        id: "m2",
        senderId: "host-1",
        senderName: "Chanda Bwalya",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chanda%20Bwalya",
        text: "Hi Sarah! Congratulations on your anniversary! 🎉 The sunset river cruise is included with all stays of 3+ nights. I'd also recommend our private bush dinner under the stars — it's K350 per couple and absolutely magical for a celebration.",
        timestamp: "2026-06-20T11:15:00Z",
        isHost: true,
      },
      {
        id: "m3",
        senderId: "guest-1",
        senderName: "Sarah Phiri",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
        text: "That sounds incredible! We'd love to book the bush dinner. One more question — do you have any anniversary packages or special touches we can add?",
        timestamp: "2026-06-21T09:20:00Z",
        isHost: false,
      },
      {
        id: "m4",
        senderId: "host-1",
        senderName: "Chanda Bwalya",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chanda%20Bwalya",
        text: "Absolutely! We offer a Romance Package (K550) which includes: sparkling wine on arrival, rose petal turndown, a private couple's massage, and a special anniversary breakfast. Would you like me to add that to your booking?",
        timestamp: "2026-06-21T10:00:00Z",
        isHost: true,
      },
      {
        id: "m5",
        senderId: "guest-1",
        senderName: "Sarah Phiri",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Phiri",
        text: "Perfect, thank you so much! We'll see you on the 25th. 😊",
        timestamp: "2026-06-22T14:30:00Z",
        isHost: false,
      },
    ],
  },
  {
    id: "thread-2",
    guestName: "James Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Banda",
    guestInitials: "JB",
    lastMessage: "No restrictions on cameras. We have secure storage on board.",
    lastMessageTime: "2026-06-21T15:00:00Z",
    unread: false,
    listingName: "Victoria Falls Helicopter Tour",
    listingImage: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=400&q=80",
    messages: [
      {
        id: "m6",
        senderId: "guest-2",
        senderName: "James Banda",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Banda",
        text: "We're a group of 4 looking for the 2-hour helicopter tour. Two of us are photographers — any restrictions on camera equipment on board?",
        timestamp: "2026-06-21T14:15:00Z",
        isHost: false,
      },
      {
        id: "m7",
        senderId: "host-1",
        senderName: "Chanda Bwalya",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chanda%20Bwalya",
        text: "Hi James! No restrictions on cameras. We have secure storage on board for equipment and our pilots are happy to help position for the best shots. Just let us know your gear sizes in advance so we can安排好.",
        timestamp: "2026-06-21T15:00:00Z",
        isHost: true,
      },
    ],
  },
  {
    id: "thread-3",
    guestName: "Emily Zulu",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
    guestInitials: "EZ",
    lastMessage: "Is the pool open year-round? Looking forward to our first safari!",
    lastMessageTime: "2026-06-19T09:45:00Z",
    unread: false,
    listingName: "Kafue River Lodge",
    listingImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    messages: [
      {
        id: "m8",
        senderId: "guest-3",
        senderName: "Emily Zulu",
        senderAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Zulu",
        text: "We're a family of 3 (our son is 8) looking to experience Kafue. Do you have family-friendly game drives? Also, is the pool open year-round? Looking forward to our first safari!",
        timestamp: "2026-06-19T09:45:00Z",
        isHost: false,
      },
    ],
  },
];

export interface HostReview {
  id: string;
  guestName: string;
  guestAvatar: string;
  guestInitials: string;
  rating: number;
  date: string;
  text: string;
  listingName: string;
  replied: boolean;
  replyText?: string;
}

export const mockHostReviews: HostReview[] = [
  {
    id: "rev-1",
    guestName: "Grace Mwale",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Grace%20Mwale",
    guestInitials: "GM",
    rating: 5,
    date: "2026-06-24",
    text: "Absolutely breathtaking! Waking up to elephants at dawn was magical. The staff went above and beyond to make our stay unforgettable. The private plunge pool with views of the Zambezi was the highlight. We'll definitely be back!",
    listingName: "Luxury Safari Lodge",
    replied: true,
    replyText:
      "Thank you Grace! It was a pleasure hosting you. We're thrilled you loved the elephants — they've been visiting regularly this month. Can't wait to welcome you back!",
  },
  {
    id: "rev-2",
    guestName: "David Mulenga",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=David%20Mulenga",
    guestInitials: "DM",
    rating: 5,
    date: "2026-06-21",
    text: "Incredible experience! The helicopter ride over Victoria Falls was absolutely worth it. Our pilot was knowledgeable and made sure we got the best views. Highly recommend the extended tour.",
    listingName: "Victoria Falls Helicopter Tour",
    replied: false,
  },
  {
    id: "rev-3",
    guestName: "Chisala Banda",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chisala%20Banda",
    guestInitials: "CB",
    rating: 4,
    date: "2026-06-22",
    text: "Beautiful lodge with amazing river views. The family reunion dinner setup was perfect. Only minor issue was the Wi-Fi being intermittent in some rooms. But the staff were incredibly helpful and the food was outstanding.",
    listingName: "Kafue River Lodge",
    replied: false,
  },
  {
    id: "rev-4",
    guestName: "Michael Tembo",
    guestAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Tembo",
    guestInitials: "MT",
    rating: 5,
    date: "2026-06-15",
    text: "Our guide Moses was incredibly knowledgeable. We spotted all of the Big Five plus countless birds. The sundowner drinks in the bush were a perfect end to the day. Will definitely book again!",
    listingName: "Kafue Game Drive",
    replied: true,
    replyText:
      "Thank you Michael! Moses will be thrilled to hear your kind words. He truly has a gift for finding the wildlife. See you on your next adventure!",
  },
];

export interface Dispute {
  id: string;
  guestName: string;
  listingName: string;
  issue: string;
  amount: number;
  date: string;
  status: "open" | "resolved" | "escalated";
  guestInitiative: boolean;
}

export const mockDisputes: Dispute[] = [
  {
    id: "disp-1",
    guestName: "Mwila Phiri",
    listingName: "Kafue Game Drive",
    issue: "Guide arrived 45 minutes late — missed prime game viewing time.",
    amount: 360,
    date: "2026-05-15",
    status: "resolved",
    guestInitiative: true,
  },
  {
    id: "disp-2",
    guestName: "Anonymous Guest",
    listingName: "Luxury Safari Lodge",
    issue: "Air conditioning unit was not working during first night.",
    amount: 1800,
    date: "2026-06-10",
    status: "open",
    guestInitiative: false,
  },
];
