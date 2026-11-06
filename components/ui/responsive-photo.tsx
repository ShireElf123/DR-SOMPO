import { getImageProps } from "next/image";
import { photographyAlt } from "@/lib/photography";

/** Browser art direction, not two CSS-hidden images competing for preload bandwidth. */
export function ResponsivePhoto({
  image,
  mobileImage,
  alt,
}: {
  image: string;
  mobileImage?: string;
  alt: string;
}) {
  const common = {
    alt: mobileImage
      ? "AI-generated healthcare illustration; not a photograph of the doctor or practice."
      : photographyAlt(image, alt),
    fill: true,
    sizes: "(max-width: 1180px) 96vw, 1180px",
    className: "object-cover",
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const desktop = getImageProps({ ...common, src: image }).props;
  const mobile = mobileImage
    ? getImageProps({ ...common, src: mobileImage, sizes: "100vw" }).props
    : desktop;
  return (
    <picture data-responsive-hero>
      {mobileImage && (
        <source
          media="(min-width: 640px)"
          srcSet={desktop.srcSet}
          sizes={desktop.sizes}
        />
      )}
      <img {...mobile} alt={common.alt} />
    </picture>
  );
}
