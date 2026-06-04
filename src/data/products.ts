export interface ShopProduct {

  id: number;

  name: string;

  price: string;

  priceAmount: number;

  frontImage: string;

  backImage: string;

  images: string[];

  category: string;

  stock: number;

  sizes: string[];

  description: string;

  details: string[];

}



export const categoryLabels: Record<string, string> = {

  hoodies: 'Hoodies',

  tees: 'Tees',

  longsleeves: 'Long Sleeves',

  jerseys: 'Jerseys',

  caps: 'Caps',

  bottoms: 'Bottoms',

  accessories: 'Accessories',

};



export const shopProducts: ShopProduct[] = [

  {

    id: 1,

    name: 'DREAM HOODIE',

    price: '₵150',

    priceAmount: 150,

    frontImage: '/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png',

    backImage: '/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png',

    images: [

      '/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png',

      '/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png',

      '/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png',

    ],

    category: 'hoodies',

    stock: 25,

    sizes: ['S', 'M', 'L', 'XL'],

    description: 'Premium cotton hoodie with bold HARV DREAMS branding.',

    details: [

      'Heavyweight cotton blend',

      'Bold chest branding',

      'Relaxed street fit',

      'Made for dreamers',

    ],

  },

  {

    id: 2,

    name: 'VISION TEE',

    price: '₵85',

    priceAmount: 85,

    frontImage: '/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png',

    backImage: '/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png',

    images: [

      '/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png',

      '/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png',

    ],

    category: 'tees',

    stock: 42,

    sizes: ['XS', 'S', 'M', 'L', 'XL'],

    description: 'Classic fit tee with visionary HARV DREAMS design.',

    details: [

      'Soft breathable cotton',

      'Classic crew neckline',

      'Screen-printed artwork',

      'Everyday street essential',

    ],

  },

  {

    id: 3,

    name: 'STREET DREAMS JERSEY',

    price: '₵120',

    priceAmount: 120,

    frontImage: '/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png',

    backImage: '/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png',

    images: [

      '/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png',

      '/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png',

    ],

    category: 'jerseys',

    stock: 18,

    sizes: ['M', 'L', 'XL', 'XXL'],

    description: 'Athletic jersey built for street style and movement.',

    details: [

      'Lightweight mesh fabric',

      'Athletic cut',

      'Dream-driven back graphic',

      'Game-day energy',

    ],

  },

  {

    id: 4,

    name: 'AMBITION CAP',

    price: '₵65',

    priceAmount: 65,

    frontImage: '/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png',

    backImage: '/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png',

    images: [

      '/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png',

      '/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png',

    ],

    category: 'caps',

    stock: 0,

    sizes: ['One Size'],

    description: 'Embroidered cap with HARV DREAMS logo.',

    details: [

      'Adjustable strap',

      'Embroidered front logo',

      'Curved brim',

      'One size fits most',

    ],

  },

  {

    id: 5,

    name: 'CREST TRIM TEE',

    price: '₵95',

    priceAmount: 95,

    frontImage: '/products/crest-trim-tee.png',

    backImage: '/products/crest-trim-tee.png',

    images: ['/products/crest-trim-tee.png'],

    category: 'tees',

    stock: 30,

    sizes: ['XS', 'S', 'M', 'L', 'XL'],

    description:

      'Black crew tee with white contrast trim, embroidered crest, and bold front graphic. Live your soul.',

    details: [

      'Contrast ribbed collar & cuffs',

      'Embroidered HARV DREAMS crest',

      'Relaxed street fit',

      'Premium cotton blend',

    ],

  },

  {

    id: 6,

    name: 'DREAMSCAPE RAGLAN',

    price: '₵120',

    priceAmount: 120,

    frontImage: '/products/dreamscape-raglan-front.png',

    backImage: '/products/dreams-raglan-back.png',

    images: [

      '/products/dreamscape-raglan-front.png',

      '/products/dreams-raglan-back.png',

    ],

    category: 'longsleeves',

    stock: 24,

    sizes: ['S', 'M', 'L', 'XL'],

    description:

      'White & tan raglan long sleeve with gothic “DREAMS” sleeve lettering and Dreamscape chest graphic.',

    details: [

      'Tan raglan sleeves & collar',

      'Gothic sleeve print with green outline',

      'HARV DREAMS back-neck logo',

      'Relaxed baseball-tee fit',

    ],

  },

  {

    id: 7,

    name: 'TOUGHER ME GRAPHIC TEE',

    price: '₵90',

    priceAmount: 90,

    frontImage: '/products/tougher-me-tee.png',

    backImage: '/products/tougher-me-tee.png',

    images: ['/products/tougher-me-tee.png'],

    category: 'tees',

    stock: 28,

    sizes: ['XS', 'S', 'M', 'L', 'XL'],

    description:

      'White graphic tee — “Tough Dreams, Tougher Me” back print with stacked harv chest artwork.',

    details: [

      'Soft heavyweight cotton',

      'Front stacked harv graphic',

      'Bold back statement print',

      'Classic oversized fit',

    ],

  },

  {

    id: 8,

    name: 'CHOSEN ONE CROSS TEE',

    price: '₵88',

    priceAmount: 88,

    frontImage: '/products/chosen-one-cross-tee.png',

    backImage: '/products/chosen-one-cross-tee.png',

    images: ['/products/chosen-one-cross-tee.png'],

    category: 'tees',

    stock: 35,

    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:

      'Oversized tee with red cross back graphic. Available in black & white colorways.',

    details: [

      'Bold red cross back print',

      '“Chosen one” detailing',

      'Oversized street silhouette',

      'Soft cotton jersey',

    ],

  },

  {

    id: 9,

    name: 'HARV DREAMS ARCH TEE',

    price: '₵92',

    priceAmount: 92,

    frontImage: '/products/arch-tee-contrast-denim.png',

    backImage: '/products/arch-tee-contrast-denim.png',

    images: ['/products/arch-tee-contrast-denim.png'],

    category: 'tees',

    stock: 32,

    sizes: ['S', 'M', 'L', 'XL', 'XXL'],

    description:

      'Oversized white tee with arched HARV DREAMS chest lettering. Street-ready everyday essential.',

    details: [

      'Arched chest logo print',

      'Oversized relaxed fit',

      'Premium cotton body',

      'Pairs with contrast denim',

    ],

  },

  {

    id: 10,

    name: 'CONTRAST STITCH DENIM',

    price: '₵220',

    priceAmount: 220,

    frontImage: '/products/arch-tee-contrast-denim.png',

    backImage: '/products/arch-tee-contrast-denim.png',

    images: ['/products/arch-tee-contrast-denim.png'],

    category: 'bottoms',

    stock: 20,

    sizes: ['28', '30', '32', '34', '36', '38'],

    description:

      'Ultra baggy dark denim with white contrast stitching. Statement street fit built for dreamers.',

    details: [

      'Heavyweight dark-wash denim',

      'White contrast seam stitching',

      'Extreme baggy silhouette',

      'Classic 5-pocket construction',

    ],

  },

];



/** Newest products first (by id), up to `limit` */

export function getLatestProducts(limit = 16): ShopProduct[] {

  return [...shopProducts].sort((a, b) => b.id - a.id).slice(0, limit);

}



export function getProductById(id: number): ShopProduct | undefined {

  return shopProducts.find((p) => p.id === id);

}



export function getCategoryLabel(category: string): string {

  return categoryLabels[category] ?? category;

}


