import NextImage, { type ImageProps } from "next/image";
import { photographyAlt } from "@/lib/photography";

/** Preserve Next image optimisation while making placeholder provenance truthful. */
export default function PracticeImage({ alt, src, ...props }: ImageProps) {
  return <NextImage {...props} src={src} alt={photographyAlt(src, alt)} />;
}

export function PhotographyNotice() {
  return (
    <p
      data-photography-notice
      className="mx-auto max-w-[1180px] px-1 pb-1 pt-3 text-[11px] leading-relaxed text-ink-muted"
    >
      Images are AI-generated illustrations, not photographs of Dr Sompo,
      patients or the practice premises.
    </p>
  );
}

export function PortraitLabel() {
  return (
    <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-forest">
      AI illustration · not Dr Sompo
    </span>
  );
}
