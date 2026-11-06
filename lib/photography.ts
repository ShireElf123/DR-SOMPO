/** All current /images assets are generated placeholders. Replace these labels
 * only when the practice supplies and approves real, licensed photography. */
const subjects: Record<string, string> = {
  "hero-doctor.jpg": "a healthcare professional, not Dr Sompo",
  "portrait-somp-card.jpg": "a healthcare professional, not Dr Sompo",
  "consultation.jpg": "a healthcare consultation",
  "hospital-exterior.jpg": "a hospital exterior",
  "waiting-room.jpg": "a waiting room",
  "corridor.jpg": "a hospital corridor",
};

export function photographyAlt(src: unknown, suppliedAlt: string): string {
  if (!suppliedAlt || typeof src !== "string" || !src.startsWith("/images/"))
    return suppliedAlt;
  const subject = subjects[src.slice(8)] ?? suppliedAlt;
  return `AI-generated illustration: ${subject}. Not a verified practice photograph.`;
}
