export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  capacity: string;
  type: string;
  features: string[];
  image: string;
  model?: string;
  description?: string;
}

export const products: Product[] = [
  // تكييفات كاريير
  {
    id: 16,
    name: "كاريير أوبتيماكس 1.5 حصان بارد ساخن",
    brand: "Carrier",
    price: 19999,
    oldPrice: 22999,
    rating: 4.8,
    reviews: 189,
    capacity: "1.5 حصان",
    type: "بارد ساخن",
    features: ["بلازما", "شاشة LED", "ضمان 5 سنوات"],
    image: "/products/carrier-optimax-1.5hp.jpg",
    model: "53QHCT12N",
  },
  {
    id: 17,
    name: "كاريير أوبتيماكس 2.25 حصان بارد ساخن",
    brand: "Carrier",
    price: 25999,
    oldPrice: 29999,
    rating: 4.9,
    reviews: 145,
    capacity: "2.25 حصان",
    type: "بارد ساخن",
    features: ["بلازما", "شاشة LED", "ضمان 5 سنوات"],
    image: "/products/carrier-optimax-2.25hp.jpg",
    model: "53QHCT18N",
  },
  {
    id: 18,
    name: "كاريير انفرتر 1.5 حصان بارد ساخن",
    brand: "Carrier",
    price: 28999,
    oldPrice: 32999,
    rating: 4.9,
    reviews: 112,
    capacity: "1.5 حصان",
    type: "بارد ساخن",
    features: ["انفرتر", "توفير الطاقة", "هادئ جداً"],
    image: "/products/carrier-inverter-1.5hp.jpg",
  },

  // تكييفات ميديا
  {
    id: 19,
    name: "ميديا ميراكو ميشن 1.5 حصان بارد فقط",
    brand: "Midea",
    price: 14999,
    oldPrice: 17999,
    rating: 4.5,
    reviews: 167,
    capacity: "1.5 حصان",
    type: "بارد فقط",
    features: ["شاشة LED", "خاصية تربو", "ضمان 5 سنوات"],
    image: "/products/midea-mission-1.5hp.jpg",
    model: "MSMB1T-12CR",
  },
  {
    id: 20,
    name: "ميديا ميراكو ميشن 2.25 حصان بارد فقط",
    brand: "Midea",
    price: 19999,
    oldPrice: 22999,
    rating: 4.6,
    reviews: 134,
    capacity: "2.25 حصان",
    type: "بارد فقط",
    features: ["شاشة LED", "خاصية تربو", "ضمان 5 سنوات"],
    image: "/products/midea-mission-2.25hp.jpg",
    model: "MSMB1T-18CR",
  },
  {
    id: 21,
    name: "ميديا انفرتر 3 حصان بارد ساخن",
    brand: "Midea",
    price: 38999,
    oldPrice: 43999,
    rating: 4.8,
    reviews: 78,
    capacity: "3 حصان",
    type: "بارد ساخن",
    features: ["انفرتر", "واي فاي", "توفير الطاقة"],
    image: "/products/midea-inverter-3hp.jpg",
  },

  // تكييفات شارب
  {
    id: 22,
    name: "تكييف شارب انفرتر 1.5 حصان بارد فقط",
    brand: "Sharp",
    price: 21999,
    oldPrice: 24999,
    rating: 4.7,
    reviews: 198,
    capacity: "1.5 حصان",
    type: "بارد فقط",
    features: ["انفرتر", "بلازما كلاستر", "توفير الطاقة"],
    image: "/products/sharp-inverter-1.5hp.jpg",
  },
  {
    id: 23,
    name: "تكييف شارب انفرتر 2.25 حصان بارد ساخن",
    brand: "Sharp",
    price: 28999,
    oldPrice: 32999,
    rating: 4.8,
    reviews: 156,
    capacity: "2.25 حصان",
    type: "بارد ساخن",
    features: ["انفرتر", "بلازما كلاستر", "تنقية الهواء"],
    image: "/products/sharp-inverter-2.25hp.jpg",
  },

  // تكييفات تورنيدو
  {
    id: 24,
    name: "تكييف تورنيدو 1.5 حصان بارد فقط",
    brand: "Tornado",
    price: 12999,
    oldPrice: 15999,
    rating: 4.4,
    reviews: 267,
    capacity: "1.5 حصان",
    type: "بارد فقط",
    features: ["اقتصادي", "ضمان 5 سنوات", "تبريد سريع"],
    image: "/products/tornado-1.5hp.jpg",
  },
  {
    id: 25,
    name: "تكييف تورنيدو 2.25 حصان بارد ساخن",
    brand: "Tornado",
    price: 17999,
    oldPrice: 20999,
    rating: 4.5,
    reviews: 189,
    capacity: "2.25 حصان",
    type: "بارد ساخن",
    features: ["اقتصادي", "ضمان 5 سنوات", "بارد ساخن"],
    image: "/products/tornado-2.25hp.jpg",
  },

  // تكييفات هاير
  {
    id: 26,
    name: "تكييف هاير 1.5 حصان بارد فقط",
    brand: "Haier",
    price: 14999,
    oldPrice: 17999,
    rating: 4.5,
    reviews: 145,
    capacity: "1.5 حصان",
    type: "بارد فقط",
    features: ["تبريد سريع", "هادئ", "اقتصادي"],
    image: "/products/haier-1.5hp.jpg",
  },
  {
    id: 27,
    name: "تكييف هاير انفرتر 2.25 حصان بارد ساخن",
    brand: "Haier",
    price: 26999,
    oldPrice: 30999,
    rating: 4.7,
    reviews: 98,
    capacity: "2.25 حصان",
    type: "بارد ساخن",
    features: ["انفرتر", "توفير الطاقة", "تنقية الهواء"],
    image: "/products/haier-inverter-2.25hp.jpg",
  },
];

export const brands = [
  { name: "Carrier", nameAr: "كاريير", logo: "/brands/carrier.png", productCount: 6 },
  { name: "Midea", nameAr: "ميديا", logo: "/brands/midea.png", productCount: 7 },
  { name: "Sharp", nameAr: "شارب", logo: "/brands/sharp.png", productCount: 5 },
  { name: "Tornado", nameAr: "تورنيدو", logo: "/brands/tornado.png", productCount: 4 },
  { name: "Haier", nameAr: "هاير", logo: "/brands/haier.png", productCount: 5 },
];

export const capacities = [
  "1.5 حصان",
  "2.25 حصان",
  "3 حصان",
  "4 حصان",
  "5 حصان",
];

export const types = [
  "بارد فقط",
  "بارد ساخن",
];
