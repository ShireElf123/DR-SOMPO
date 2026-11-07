import { allServices, practice } from "@/lib/practice";
import { isValidPreferredDate, practiceToday } from "@/lib/appointment-dates";

export const CONTACT_METHODS = ["Telephone", "Email", "WhatsApp"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];
export const SLOTS = [
  { value: "Early morning", label: "Early morning", time: "08:00 – 10:00" },
  { value: "Late morning", label: "Late morning", time: "10:00 – 12:00" },
  { value: "Early afternoon", label: "Early afternoon", time: "13:00 – 15:00" },
  { value: "Late afternoon", label: "Late afternoon", time: "15:00 – 16:30" },
] as const;
export type Slot = (typeof SLOTS)[number]["value"];
export const MAX = {
  name: 120,
  contact: 160,
  message: 800,
  preferredDate: 10,
  preferredSlot: 20,
  service: 80,
};
export type EnquiryFields = {
  name: string;
  contactMethod: string;
  contact: string;
  preferredDate: string;
  preferredSlot: string;
  service: string;
  message: string;
  consent: boolean;
};
export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

export function isContactMethodAvailable(method: string): boolean {
  return (
    method === "Telephone" ||
    method === "Email" ||
    (method === "WhatsApp" && Boolean(practice.whatsappNumber))
  );
}

/** Support old title-based bookmarks, but use IDs everywhere in the form contract. */
export function resolveService(value: unknown): string {
  if (typeof value !== "string") return "";
  return (
    allServices.find((item) => item.id === value || item.title === value)?.id ??
    ""
  );
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "").length;
  return (
    /^\+?[\d()\s-]+$/.test(value) &&
    value.length <= 30 &&
    digits >= 9 &&
    digits <= 15
  );
}

export function validateEnquiry(
  data: EnquiryFields,
  today = practiceToday(),
): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (data.name.trim().length < 2 || data.name.length > MAX.name)
    errors.name = "Please enter your name (2–120 characters).";
  if (!isContactMethodAvailable(data.contactMethod))
    errors.contactMethod =
      "Please choose telephone or email. WhatsApp is not available yet.";
  if (
    data.contact.length > MAX.contact ||
    !(data.contactMethod === "Email"
      ? isEmail(data.contact.trim())
      : isPhone(data.contact.trim()))
  ) {
    errors.contact =
      data.contactMethod === "Email"
        ? "Please check that email address."
        : "Please enter a telephone number with 9–15 digits.";
  }
  if (data.preferredDate && !isValidPreferredDate(data.preferredDate, today))
    errors.preferredDate = "Please choose a real date within the next 90 days.";
  if (
    data.preferredSlot &&
    !SLOTS.some((slot) => slot.value === data.preferredSlot)
  )
    errors.preferredSlot = "Please choose a valid time preference.";
  if (data.preferredDate && !data.preferredSlot)
    errors.preferredSlot = "Please choose a time preference for that day.";
  if (data.preferredSlot && !data.preferredDate)
    errors.preferredDate = "Please choose a day for that time preference.";
  if (data.service && !resolveService(data.service))
    errors.service = "Please choose a service from the list.";
  if (data.message.length > MAX.message)
    errors.message = "Please keep your note to 800 characters or fewer.";
  if (!data.consent)
    errors.consent =
      "Please confirm the practice may use these details to respond.";
  return errors;
}
