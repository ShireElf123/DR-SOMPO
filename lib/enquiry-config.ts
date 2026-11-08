/** Server-only configuration. Never pass the receiver URL or token to a browser. */
export function enquiryDeliveryEnabled(): boolean {
  // Enabling collection is an explicit practice approval, not an inference from a stray URL.
  if (
    process.env.ENQUIRY_ENABLED !== "true" ||
    !process.env.ENQUIRY_WEBHOOK_URL
  )
    return false;
  try {
    const url = new URL(process.env.ENQUIRY_WEBHOOK_URL);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
