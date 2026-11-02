/**
 * Hairline scroll-progress indicator. It is a compositor-only CSS scroll
 * timeline (no React, no spring subscription), so the cost is zero client JS;
 * browsers without scroll-driven animations simply omit it rather than
 * showing a bar stuck at one end.
 */
export function ScrollProgress() {
  return <div aria-hidden="true" className="scroll-progress" />;
}
