export interface ListingReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  date: string;
  authorLocation?: string;
}

// Central pool of realistic guest names and locations
interface GuestProfile {
  author: string;
  authorLocation: string;
}

const guestProfiles: GuestProfile[] = [
  { author: "Sarah & James Mitchell", authorLocation: "Cape Town, SA" },
  { author: "Thomas Richter", authorLocation: "Berlin, Germany" },
  { author: "Amara Okafor", authorLocation: "Lagos, Nigeria" },
  { author: "David Chen", authorLocation: "Singapore" },
  { author: "Emma & Luke Peterson", authorLocation: "Melbourne, Australia" },
  { author: "Maya Patel", authorLocation: "Nairobi, Kenya" },
  { author: "Carlos Mendez", authorLocation: "Madrid, Spain" },
  { author: "Grace & John Kamau", authorLocation: "Nairobi, Kenya" },
  { author: "Hiroshi Tanaka", authorLocation: "Tokyo, Japan" },
  { author: "Fatima & Ali Hassan", authorLocation: "Harare, Zimbabwe" },
  { author: "Olivia Wright", authorLocation: "London, UK" },
  { author: "Samuel Ngoma", authorLocation: "Lusaka, Zambia" },
  { author: "Priya Sharma", authorLocation: "Mumbai, India" },
  { author: "Andre & Marie Dubois", authorLocation: "Paris, France" },
  { author: "Liam O'Brien", authorLocation: "Dublin, Ireland" },
  { author: "Zoe & Mark Andersen", authorLocation: "Copenhagen, Denmark" },
  { author: "Kwame Mensah", authorLocation: "Accra, Ghana" },
  { author: "Sophie Laurent", authorLocation: "Montreal, Canada" },
  { author: "Ryan & Kate Thompson", authorLocation: "Auckland, New Zealand" },
  { author: "Bwalya Chisanga", authorLocation: "Kitwe, Zambia" },
];

// Collection of realistic review content templates
const reviewTemplates = [
  "Absolutely incredible experience from start to finish. The staff anticipated our every need and the location is simply breathtaking. We will definitely be coming back!",
  "A truly special place. The attention to detail in both the accommodations and service was outstanding. Highly recommend for anyone looking for an authentic Zambian experience.",
  "Exceeded all expectations. The guides were knowledgeable and passionate, the food was delicious, and the setting was magical. A once-in-a-lifetime trip.",
  "Beautiful property with amazing views. The room was spacious and clean, and the staff went out of their way to make us feel welcome. Would definitely stay again.",
  "An unforgettable adventure! Everything was perfectly organized from the moment we arrived. The wildlife sightings were incredible and the guides were top-notch.",
  "We loved every minute of our stay. The perfect blend of luxury and wilderness. Sunset on the deck watching hippos in the river — pure magic.",
  "Outstanding service and facilities. The rooms are beautifully appointed and the common areas are perfect for relaxing after a day of exploring.",
  "Couldn't have asked for a better experience. The team was professional, friendly, and ensured we had the best possible time. Five stars all around.",
  "Magical setting with world-class service. The food was exceptional — fresh, local ingredients prepared with care. Our kids loved every moment too.",
  "A hidden gem! So glad we decided to book here. The location is stunning, the hosts were welcoming, and everything exceeded our expectations.",
  "This was the highlight of our Zambia trip. The attention to safety and comfort was impressive. Our guide was incredibly knowledgeable about the local wildlife.",
  "Stunning location with impeccable service. The rooms are tastefully decorated and the food is fantastic. Special shoutout to the team for making our anniversary special.",
];

export const mockListingReviews: Record<string, ListingReview[]> = {
  // ── Stays ──
  "1": [
    { id: "lr-1", ...guestProfiles[0], rating: 5, content: reviewTemplates[0], date: "Mar 2025" },
    { id: "lr-2", ...guestProfiles[1], rating: 5, content: reviewTemplates[4], date: "Feb 2025" },
    { id: "lr-3", ...guestProfiles[14], rating: 5, content: reviewTemplates[11], date: "Jan 2025" },
    { id: "lr-4", ...guestProfiles[3], rating: 4, content: reviewTemplates[9], date: "Dec 2024" },
    { id: "lr-5", ...guestProfiles[18], rating: 5, content: reviewTemplates[5], date: "Nov 2024" },
    { id: "lr-6", ...guestProfiles[6], rating: 5, content: reviewTemplates[1], date: "Oct 2024" },
  ],
  "2": [
    { id: "lr-7", ...guestProfiles[7], rating: 5, content: reviewTemplates[2], date: "Mar 2025" },
    { id: "lr-8", ...guestProfiles[8], rating: 4, content: reviewTemplates[6], date: "Feb 2025" },
    { id: "lr-9", ...guestProfiles[19], rating: 5, content: reviewTemplates[7], date: "Jan 2025" },
    { id: "lr-10", ...guestProfiles[10], rating: 5, content: reviewTemplates[3], date: "Dec 2024" },
    { id: "lr-11", ...guestProfiles[2], rating: 4, content: reviewTemplates[8], date: "Nov 2024" },
  ],
  "3": [
    { id: "lr-12", ...guestProfiles[4], rating: 5, content: reviewTemplates[0], date: "Feb 2025" },
    {
      id: "lr-13",
      ...guestProfiles[15],
      rating: 5,
      content: reviewTemplates[10],
      date: "Jan 2025",
    },
    { id: "lr-14", ...guestProfiles[11], rating: 4, content: reviewTemplates[1], date: "Dec 2024" },
  ],
  "4": [
    { id: "lr-15", ...guestProfiles[16], rating: 5, content: reviewTemplates[5], date: "Mar 2025" },
    { id: "lr-16", ...guestProfiles[9], rating: 4, content: reviewTemplates[9], date: "Feb 2025" },
    { id: "lr-17", ...guestProfiles[5], rating: 5, content: reviewTemplates[11], date: "Jan 2025" },
    { id: "lr-18", ...guestProfiles[13], rating: 4, content: reviewTemplates[3], date: "Dec 2024" },
  ],
  "5": [
    { id: "lr-19", ...guestProfiles[1], rating: 5, content: reviewTemplates[4], date: "Mar 2025" },
    { id: "lr-20", ...guestProfiles[17], rating: 5, content: reviewTemplates[2], date: "Feb 2025" },
    { id: "lr-21", ...guestProfiles[12], rating: 5, content: reviewTemplates[6], date: "Jan 2025" },
    { id: "lr-22", ...guestProfiles[0], rating: 4, content: reviewTemplates[7], date: "Dec 2024" },
  ],
  "6": [
    { id: "lr-23", ...guestProfiles[8], rating: 4, content: reviewTemplates[3], date: "Feb 2025" },
    { id: "lr-24", ...guestProfiles[19], rating: 5, content: reviewTemplates[8], date: "Jan 2025" },
  ],
  "7": [
    {
      id: "lr-25",
      ...guestProfiles[14],
      rating: 5,
      content: reviewTemplates[10],
      date: "Mar 2025",
    },
    { id: "lr-26", ...guestProfiles[3], rating: 5, content: reviewTemplates[0], date: "Feb 2025" },
    { id: "lr-27", ...guestProfiles[6], rating: 5, content: reviewTemplates[1], date: "Dec 2024" },
  ],
  "8": [
    { id: "lr-28", ...guestProfiles[10], rating: 4, content: reviewTemplates[9], date: "Mar 2025" },
    { id: "lr-29", ...guestProfiles[2], rating: 5, content: reviewTemplates[6], date: "Feb 2025" },
    { id: "lr-30", ...guestProfiles[18], rating: 4, content: reviewTemplates[3], date: "Jan 2025" },
  ],

  // ── Experiences ──
  e1: [
    {
      id: "lr-e1",
      ...guestProfiles[7],
      rating: 5,
      content:
        "Hands down the best way to see Victoria Falls! The helicopter ride was smooth and the views were absolutely mind-blowing. Our pilot was funny and knowledgeable. Worth every ngwee!",
      date: "Feb 2025",
    },
    {
      id: "lr-e2",
      ...guestProfiles[3],
      rating: 5,
      content:
        "I've been to Victoria Falls three times before, but seeing it from the air was a completely different experience. The 'Flight of Angels' lives up to its name. Bucket list material.",
      date: "Jan 2025",
    },
    {
      id: "lr-e3",
      ...guestProfiles[15],
      rating: 5,
      content:
        "Booked this for my husband's birthday and it was the highlight of our entire Zambia trip. The views of the Batoka Gorge are spectacular. Professional team and great safety briefing.",
      date: "Dec 2024",
    },
    {
      id: "lr-e4",
      ...guestProfiles[11],
      rating: 4,
      content:
        "Amazing experience! Only giving 4 stars because it was a bit short for the price, but the views are unmatched. Definitely do it once in your life.",
      date: "Nov 2024",
    },
  ],
  e2: [
    {
      id: "lr-e5",
      ...guestProfiles[4],
      rating: 5,
      content:
        "This was the most authentic safari experience we've ever had. Walking through the bush on foot, tracking animals with a world-class guide — it's a completely different thrill from a game drive. Highly recommended!",
      date: "Mar 2025",
    },
    {
      id: "lr-e6",
      ...guestProfiles[0],
      rating: 5,
      content:
        "Our guide Benson was incredible. He could read animal tracks from miles away and knew every plant's medicinal use. We saw giraffes, zebras, and even a leopard in a tree. Unforgettable.",
      date: "Feb 2025",
    },
    {
      id: "lr-e7",
      ...guestProfiles[16],
      rating: 5,
      content:
        "I was nervous about a walking safari but the rangers made us feel completely safe. The experience of being on foot in the African bush is humbling and exhilarating.",
      date: "Jan 2025",
    },
  ],
  e3: [
    {
      id: "lr-e8",
      ...guestProfiles[1],
      rating: 5,
      content:
        "Lake Tanganyika is stunning! The water is crystal clear and the cichlid fish are incredibly colorful. Like snorkeling in an aquarium. Lunch on the beach was fresh and delicious.",
      date: "Feb 2025",
    },
    {
      id: "lr-e9",
      ...guestProfiles[12],
      rating: 4,
      content:
        "Beautiful location and great snorkeling. The beach is pristine and the water is warm. Saw lots of colorful fish. The boat ride out was scenic too.",
      date: "Jan 2025",
    },
  ],
  e4: [
    {
      id: "lr-e10",
      ...guestProfiles[5],
      rating: 5,
      content:
        "Kafue is truly wild and untouched. We saw lions, wild dogs, elephants, and a leopard. Our guide Moses was fantastic — he knew exactly where to find the animals.",
      date: "Mar 2025",
    },
    {
      id: "lr-e11",
      ...guestProfiles[9],
      rating: 5,
      content:
        "This game drive exceeded our expectations. The park is massive and feels completely untamed. The sundowner drinks overlooking the Kafue River were the perfect end.",
      date: "Feb 2025",
    },
    {
      id: "lr-e12",
      ...guestProfiles[18],
      rating: 5,
      content:
        "Best game drive we've been on in Zambia. The guides communicate with each other to track sightings. Saw a pride of 12 lions resting under a sausage tree!",
      date: "Jan 2025",
    },
  ],

  // ── Hidden Gems ──
  g1: [
    {
      id: "lr-g1",
      ...guestProfiles[14],
      rating: 5,
      content:
        "Shiwa Ngandu is like stepping back in time. The history of the estate is fascinating and the grounds are beautiful. The hot springs nearby are a bonus. A must-visit for history buffs.",
      date: "Feb 2025",
    },
    {
      id: "lr-g2",
      ...guestProfiles[2],
      rating: 5,
      content:
        "What a unique place! An English manor in the middle of the Zambian bush. The story of Sir Stewart Gore-Browne is incredible. The library alone is worth the trip.",
      date: "Jan 2025",
    },
  ],
  g2: [
    {
      id: "lr-g3",
      ...guestProfiles[19],
      rating: 5,
      content:
        "The hike to Kundalila Falls is stunning. The waterfall is powerful and the pool at the bottom is perfect for swimming after the hike. The views of the valley are spectacular.",
      date: "Mar 2025",
    },
    {
      id: "lr-g4",
      ...guestProfiles[10],
      rating: 4,
      content:
        "Beautiful waterfall and a great hike. The path down to the base is steep but manageable. Bring sturdy shoes and plenty of water. The views from the top are worth it.",
      date: "Feb 2025",
    },
  ],
  g3: [
    {
      id: "lr-g5",
      ...guestProfiles[6],
      rating: 5,
      content:
        "Liuwa Plain is one of Africa's last true wilderness areas. We saw thousands of wildebeest migrating across the plains. Raw, remote, and absolutely breathtaking.",
      date: "Dec 2024",
    },
  ],
  g4: [
    {
      id: "lr-g6",
      ...guestProfiles[8],
      rating: 5,
      content:
        "The sunset cruise to Chapel Island is magical. The colors over Lake Kariba are unreal. Learned so much about the Nyami Nyami legend from our guide. Drinks and snacks were a nice touch.",
      date: "Jan 2025",
    },
    {
      id: "lr-g7",
      ...guestProfiles[13],
      rating: 4,
      content:
        "Lovely peaceful cruise. Chapel Island is interesting and the sunset views are beautiful. Great way to spend an evening on Lake Kariba.",
      date: "Dec 2024",
    },
  ],

  // ── Packages ──
  p1: [
    {
      id: "lr-p1",
      ...guestProfiles[7],
      rating: 5,
      content:
        "The perfect weekend getaway. Everything was organized seamlessly — from airport pickup to the falls tour to the sunset cruise. The lodge was beautiful and the food was exceptional.",
      date: "Feb 2025",
    },
    {
      id: "lr-p2",
      ...guestProfiles[1],
      rating: 5,
      content:
        "Incredible value for a luxury weekend. The helicopter tour over the falls was the highlight. Our guide was knowledgeable and friendly. Will definitely book again.",
      date: "Jan 2025",
    },
  ],
  p2: [
    {
      id: "lr-p3",
      ...guestProfiles[4],
      rating: 5,
      content:
        "The ultimate safari experience. Five days of pure luxury in the bush. The game drives were incredible — saw leopards, lions, and wild dogs. The camp is stunning and the staff are world-class.",
      date: "Mar 2025",
    },
    {
      id: "lr-p4",
      ...guestProfiles[0],
      rating: 5,
      content:
        "This was our honeymoon and it was absolutely perfect. The private bush dinner under the stars, the spa treatment overlooking the river, the expert guides — everything was flawless.",
      date: "Feb 2025",
    },
    {
      id: "lr-p5",
      ...guestProfiles[17],
      rating: 5,
      content:
        "Best safari we've ever been on. The walking safari component was thrilling, and returning to a luxury camp with hot showers and gourmet food felt surreal. Highly recommended.",
      date: "Jan 2025",
    },
  ],
  p3: [
    {
      id: "lr-p6",
      ...guestProfiles[9],
      rating: 4,
      content:
        "Short but sweet getaway on Lake Kariba. The chalet was comfortable with beautiful lake views. The boat safari was fun — saw hippos, crocodiles, and lots of birds.",
      date: "Feb 2025",
    },
    {
      id: "lr-p7",
      ...guestProfiles[5],
      rating: 5,
      content:
        "Perfect weekend escape from Lusaka. The lake is gorgeous and the food was fantastic. The infinity pool overlooking Kariba is a highlight. We'll be back!",
      date: "Jan 2025",
    },
  ],

  // ── Transport ──
  t1: [
    {
      id: "lr-t1",
      ...guestProfiles[10],
      rating: 4,
      content:
        "Comfortable and reliable bus service between Lusaka and Livingstone. The bus was clean with AC and WiFi. Left on time and arrived as scheduled. Good value for the price.",
      date: "Mar 2025",
    },
    {
      id: "lr-t2",
      ...guestProfiles[19],
      rating: 5,
      content:
        "Much better than I expected for bus travel in Zambia. Reclining seats, working WiFi, and a friendly crew. The rest stop midway was well-timed. Will use again.",
      date: "Feb 2025",
    },
    {
      id: "lr-t3",
      ...guestProfiles[11],
      rating: 4,
      content:
        "Good service. On-time departure and comfortable seats. The USB charging was a nice surprise. Only wish the rest stop was a bit longer.",
      date: "Jan 2025",
    },
  ],
  t2: [
    {
      id: "lr-t4",
      ...guestProfiles[2],
      rating: 4,
      content:
        "Efficient and comfortable journey from Lusaka to Ndola. The bus was modern with good AC. The road is in good condition so the ride was smooth.",
      date: "Feb 2025",
    },
    {
      id: "lr-t5",
      ...guestProfiles[8],
      rating: 5,
      content:
        "The most comfortable bus I've taken in Zambia. Power Tools has really raised the standard. Polite staff, clean bus, reliable schedule.",
      date: "Jan 2025",
    },
  ],
  t3: [
    {
      id: "lr-t6",
      ...guestProfiles[16],
      rating: 4,
      content:
        "Long journey from Kitwe to Chipata but the bus was comfortable and made timely stops. The scenery along the way was beautiful. Good service from Eastern Express.",
      date: "Mar 2025",
    },
    {
      id: "lr-t7",
      ...guestProfiles[3],
      rating: 4,
      content:
        "Affordable and reliable way to get to the Eastern Province. The bus was clean and the driver was careful on the roads. Recommended for budget travel.",
      date: "Jan 2025",
    },
  ],
};
