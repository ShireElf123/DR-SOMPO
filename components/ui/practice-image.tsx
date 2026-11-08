import NextImage, { type ImageProps } from "next/image";
import { photographyAlt } from "@/lib/photography";

/** Preserve Next image optimisation while making placeholder provenance truthful. */
export default function PracticeImage({ alt, src, ...props }: ImageProps) {
  return <NextImage {...props} src={src} alt={photographyAlt(src, alt)} />;
}
