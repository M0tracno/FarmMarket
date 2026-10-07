export const CART_CONFIG = {
  FREE_SHIPPING_THRESHOLD_PAISE: 50000,
  DEFAULT_SHIPPING_PAISE: 5000,
  MAX_QUANTITY_PER_ITEM: 10,
  MIN_QUANTITY_PER_ITEM: 1,
} as const;

export const CURRENCY = {
  SYMBOL: '₹',
  LOCALE: 'en-IN',
  PAISE_PER_RUPEE: 100,
  FRACTION_DIGITS: 2,
} as const;

export const PAYMENT_SUCCESS_COPY = {
  title: 'Your Order is Confirmed!',
  description: 'Your order has been placed successfully.',
  viewOrders: 'View My Orders',
  home: 'Go to home',
  orderOptions: 'Order options',
} as const;

export const WALLET_COPY = {
  enterAmount: 'Enter Amount',
  selectPaymentMethod: 'Select Payment Method',
  proceed: 'Proceed to pay',
  usageTitle: 'Pay using Wallet',
  usageDescription: 'Use your wallet balance to make purchases quickly and securely within the app. At checkout, select wallet as your payment method, and the available balance will be automatically applied to your order. If your wallet balance is insufficient, you can add money or choose another payment method to complete the purchase.',
  gotIt: 'Got it',
  title: 'Wallet',
  addMoney: 'Add Money to Wallet',
  history: 'History',
  howToUse: 'How to use',
} as const;

export const WALLET_DATA = {
  balance: '500',
  transactions: [
    { id: 'refund-03-may', title: 'Refund credited', date: '03 MAY', amount: '+244', credited: true },
    { id: 'order-02-may', title: 'Order debited', date: '02 MAY', amount: '-100', credited: false },
  ],
} as const;

export const PAYMENT_SUCCESS_ORDER = {
  name: 'Backpack Sprayer',
  price: '466.6',
  unit: '/unit',
  location: 'Kolar, Karnataka',
} as const;

export const CART_COPY = {
  title: 'Cart',
  back: 'Go back',
  search: 'Search',
  wishlist: 'Wishlist',
  emptyTitle: 'Your cart is empty',
  emptyDescription: 'Browse products and add items to your cart',
  changeAddress: 'Change',
  applyCoupon: 'Apply Coupon',
  couponOffers: 'Checkout offers and coupons',
  couponApplied: (code: string) => `Coupon: ${code}`,
  couponAccessibility: (code: string) => `Coupon ${code} applied`,
  changeCoupon: 'Tap to change or remove',
  recommendations: 'You might like this',
  viewMore: 'View More',
  priceDetails: 'Price Details',
  productPrice: 'Product Price',
  shipping: 'Shipping Charges',
  freeShipping: 'Free',
  orderTotal: 'Order Total',
  viewPrice: 'View The Price',
  continue: 'Continue',
  checkout: 'Continue to checkout',
  addToCart: 'Add To Card',
  addProduct: (name: string) => `Add ${name} to cart`,
  removeProduct: (name: string) => `Remove ${name} from cart`,
  discount: (percent: number) => `${percent}% off`,
  increaseQuantity: 'Increase quantity',
  decreaseQuantity: 'Decrease quantity',
  increment: '+',
  decrement: '−',
  couponSymbol: '%',
  pricePrefix: '+ ',
} as const;

export const SCREEN_TITLES = {
  home: 'Home',
  products: 'Products',
  orders: 'Orders',
  profile: 'Profile',
} as const;

export type CartCopy = {
  [Key in keyof typeof CART_COPY]: (typeof CART_COPY)[Key] extends string
    ? string
    : (typeof CART_COPY)[Key];
};

export const PAYMENT_COPY = {
  title: 'Payment Method',
  selectMethod: 'Select Payment Method',
  placeOrder: 'Place Order',
} as const;

export const PAYMENT_OPTIONS = [
  { id: 'cash', label: 'Cash on delivery', discountPaise: 0 },
  { id: 'cash-offer', label: 'Cash on delivery', discountPaise: 1000, offer: 'Extra 10 rupees off' },
] as const;

export const PRODUCT_DETAIL_COPY = {
  title: 'Product Details',
  selectPack: 'Select Pack Size',
  reviews: '100+ Reviews',
  wishlist: 'Save product',
  share: 'Share product',
  cart: 'Open cart',
  longExpiry: 'Long Expiry Available',
  cashDelivery: 'Cash on Delivery',
  qrVerified: 'QR Code Verified',
  addToCart: 'Add To Cart',
  buyNow: 'Buy Now',
  address: 'Address',
  productDetails: 'Product Details',
  watchVideo: 'Watch Product Video',
  videoDescription: 'Watch product usage, dosage, and application guide.',
  returns: 'Ease 4 days returns and exchanges',
  returnsDescription: 'Return or exchange eligible products within 4 days of delivery.',
  similarProducts: 'Similar Products',
  ratingReview: 'Rating & Review',
  ratingReviewCount: '(100+ Reviews)',
  reply: 'Reply',
  helpful: 'Mark review helpful',
  reviewOptions: 'Review options',
  recommendedProducts: 'You Might Like',
  faq: 'Frequently Asked Questions',
  image: (index: number) => `Product image ${index + 1}`,
} as const;

export const PRODUCT_DETAIL_ADDRESS = {
  name: 'Jagadeesh',
  address: 'full Address',
  delivery: 'Delivery between 15 June - 20 June',
} as const;

export const PRODUCT_DETAIL_SECTIONS = [
  { id: 'about', title: 'About Product' },
  { id: 'description', title: 'Product Description' },
] as const;

export const PRODUCT_DETAIL_CONFIG = {
  starCount: 5,
  initialPackId: '250g',
  initialImageIndex: 0,
} as const;

export const PRODUCT_PACKS = [
  { id: '100g', label: '100 G' },
  { id: '250g', label: '250 G' },
  { id: '500g', label: '500 G' },
  { id: '1kg', label: '1 Kg' },
] as const;

export const PRODUCT_BENEFITS = [
  { imageKey: 'longExpiry', label: PRODUCT_DETAIL_COPY.longExpiry },
  { imageKey: 'cashDelivery', label: PRODUCT_DETAIL_COPY.cashDelivery },
  { imageKey: 'qrVerified', label: PRODUCT_DETAIL_COPY.qrVerified },
] as const;

export const PRODUCT_RATING = {
  score: '4.9',
  filledStars: 4.5,
  distribution: [
    { stars: 5, percent: 93 },
    { stars: 4, percent: 87 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 5 },
    { stars: 1, percent: 5 },
  ],
} as const;

export const PRODUCT_REVIEWS = [
  {
    id: 'review-001',
    author: 'Suresh.B',
    stars: 5,
    date: '12/05/2026',
    text: 'Used on my cotton crop and saw good disease control within a few days. Highly recommended.',
  },
] as const;

export const PRODUCT_FAQS = [
  { id: 'crop', question: 'Is this product suitable for my crop?' },
  { id: 'usage', question: 'How do I use this product?' },
  { id: 'dosage', question: 'What is the recommended dosage?' },
  { id: 'help', question: 'Need help choosing the right product?' },
] as const;
