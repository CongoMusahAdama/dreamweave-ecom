import type { CartItem } from '@/contexts/CartContext';
import type { ShopProduct } from '@/data/products';
import { getProductById } from '@/data/products';
import type { DeliveryDetails, ShopOrder } from '@/types/customer';
import { formatDeliveryBlock } from '@/lib/delivery';

/** Set in harv/.env as VITE_WHATSAPP_NUMBER=233XXXXXXXXX (country code, no + or spaces) */
const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

export const WHATSAPP_NUMBER = (rawNumber || '233201274491').replace(/\D/g, '');

/** Public URL for product images (WhatsApp prefilled text supports links, not embedded images) */
export function absoluteImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const origin =
    typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_SITE_URL || '';
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function deliverySection(delivery?: DeliveryDetails | null) {
  if (!delivery) return [];
  return ['', formatDeliveryBlock(delivery)];
}

function imageLine(imagePath: string, label = 'Image') {
  const url = absoluteImageUrl(imagePath);
  if (!url) return [];
  return [`${label}: ${url}`];
}

export function buildSingleProductOrderMessage(
  product: ShopProduct,
  size: string,
  quantity = 1,
  delivery?: DeliveryDetails | null,
  options?: { colorPreference?: string }
) {
  const lineTotal = product.priceAmount * quantity;
  const imageUrl = absoluteImageUrl(product.frontImage);
  const colorLine = options?.colorPreference?.trim()
    ? `Color preference: ${options.colorPreference.trim()}`
    : '';

  return [
    'Hello HARV DREAMS, I would like to place an order:',
    '',
    `Product: ${product.name}`,
    `Size: ${size}`,
    `Quantity: ${quantity}`,
    ...(colorLine ? [colorLine] : []),
    `Price: ${product.price}${quantity > 1 ? ' each' : ''}`,
    `Line total: ₵${lineTotal}`,
    ...imageLine(product.frontImage, 'Product image'),
    ...(product.images?.length > 1
      ? product.images.slice(1, 4).flatMap((src, i) => imageLine(src, `View ${i + 2}`))
      : []),
    ...deliverySection(delivery),
    '',
    'Please confirm availability and payment details. Thank you.',
    imageUrl ? '(Tap image links above to view product photos.)' : '',
  ]
    .filter(Boolean)
    .join('\n');
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function buildOrderFollowUpMessage(order: ShopOrder) {
  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const status = STATUS_LABEL[order.status] || order.status;
  const payment =
    order.channel === 'paystack'
      ? order.paymentStatus === 'paid'
        ? 'Paid (Paystack)'
        : order.paymentStatus === 'failed'
          ? 'Payment failed'
          : 'Awaiting Paystack payment'
      : 'WhatsApp checkout';

  const itemLines = order.items.flatMap((item, i) => {
    const product = getProductById(item.productId);
    const img = product?.frontImage ? imageLine(product.frontImage, `   Image`) : [];
    const color = item.colorPreference ? ` · ${item.colorPreference}` : '';
    return [
      `${i + 1}. ${item.name} — Size ${item.size} × ${item.quantity} — ${item.price}${color}`,
      ...img,
    ];
  });

  return [
    'Hello HARV DREAMS, I would like to follow up on my order:',
    '',
    `Order: ${order.orderNumber}`,
    `Date: ${date}`,
    `Status: ${status}`,
    `Payment: ${payment}`,
    `Total: ₵${order.totalAmount}`,
    '',
    'Items:',
    ...itemLines,
    ...deliverySection(order.shippingAddress),
    '',
    'Please advise on delivery or payment. Thank you.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildCartOrderMessage(
  items: CartItem[],
  total: number,
  delivery?: DeliveryDetails | null
) {
  const itemBlocks = items.flatMap((item, i) => {
    const lines = [
      `${i + 1}. ${item.name} — Size ${item.size} × ${item.quantity} — ${item.price} each`,
      ...imageLine(item.frontImage, `   Image`),
    ];
    return lines;
  });

  return [
    'Hello HARV DREAMS, I would like to checkout my order:',
    '',
    'Order items & product images:',
    '',
    ...itemBlocks,
    '',
    `Order total: ₵${total}`,
    ...deliverySection(delivery),
    '',
    'Please confirm availability, delivery, and payment. Thank you.',
    '(Tap image links above to view product photos.)',
  ].join('\n');
}
