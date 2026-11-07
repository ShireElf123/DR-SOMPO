/** All current /images assets are generated placeholders. Replace these labels
 * only when the practice supplies and approves real, licensed photography. */
const subjects: Record<string, string> = {
  "hospital-exterior.jpg": "a hospital exterior",
  "waiting-room.jpg": "a waiting room",
  "corridor.jpg": "a hospital corridor",
  "screening-room.jpg": "a private consulting and examination room",
  "research-desk.jpg": "a specialist consulting desk with a stethoscope and clinical notes",
};

export function photographyAlt(src: unknown, suppliedAlt: string): string {
  if (!suppliedAlt || typeof src !== "string" || !src.startsWith("/images/"))
    return suppliedAlt;
  const subject = subjects[src.slice(8)] ?? suppliedAlt;
  return `AI-generated illustration: ${subject}. Not a verified practice photograph.`;
}
