export const RESTAURANT_ITEMS = [
  {
    id: 1,
    name: "Mushroom Bistro",
    region: "부산",
    category: "Western",
    rating: 4.7,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=1200&auto=format&fit=crop",
    description:
      "A cozy bistro with seasonal dishes and a calm atmosphere for special moments.",
    address: "부산 해운대구 달맞이길 12",
    phone: "051-123-4567",
    openingHours: "11:30 - 22:00",
  },
  {
    id: 2,
    name: "Cherry Table",
    region: "부산",
    category: "Cafe",
    rating: 4.5,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1528826194825-8d3b4ee31c06?q=80&w=1200&auto=format&fit=crop",
    description: "Modern cafe with handcrafted desserts and signature coffee.",
    address: "부산 수영구 광안해변로 88",
    phone: "051-234-5678",
    openingHours: "10:00 - 21:30",
  },
  {
    id: 3,
    name: "Herb Kitchen",
    region: "부산",
    category: "Korean",
    rating: 4.6,
    priceRange: "₩",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
    description: "Korean comfort food with fresh herbs and clean flavors.",
    address: "부산 부산진구 서면로 25",
    phone: "051-345-6789",
    openingHours: "11:00 - 21:00",
  },
  {
    id: 4,
    name: "Seoul Signature",
    region: "서울",
    category: "Korean",
    rating: 4.8,
    priceRange: "₩₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
    description:
      "Premium Korean dining with signature courses and refined service.",
    address: "서울 강남구 테헤란로 77",
    phone: "02-123-0000",
    openingHours: "12:00 - 22:30",
  },
  {
    id: 5,
    name: "Izakaya Night",
    region: "서울",
    category: "Japanese",
    rating: 4.4,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    description: "Japanese izakaya with skewers, sake, and late-night vibe.",
    address: "서울 마포구 연남로 18",
    phone: "02-456-1111",
    openingHours: "17:00 - 01:00",
  },
];

export const getRestaurantById = ({ id }) => {
  const numericId = Number(id);
  return RESTAURANT_ITEMS.find((item) => item.id === numericId) ?? null;
};
