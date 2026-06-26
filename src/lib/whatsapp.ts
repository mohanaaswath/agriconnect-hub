import { BUSINESS } from "./constants";

export function waLink(message: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productInquiry(name: string, code: string) {
  return waLink(`Hello Dhandapani Farms, I'm interested in your product "${name}" (${code}). Please share more details.`);
}

export function livestockInquiry(name: string, code: string) {
  return waLink(`Hello, I'd like to inquire about the livestock "${name}" (${code}). Is it still available?`);
}

export function propertyInquiry(name: string, code: string) {
  return waLink(`Hello, I'm interested in the property "${name}" (${code}). Please share more details.`);
}
