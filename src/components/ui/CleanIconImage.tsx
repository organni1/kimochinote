import Image from "next/image";

export function CleanIconImage({
  src,
  alt = "",
  sizeClassName = "h-14 w-14",
  imageClassName = "",
}: {
  src: string;
  alt?: string;
  sizeClassName?: string;
  imageClassName?: string;
}) {
  return (
    <span className={`inline-flex shrink-0 overflow-hidden rounded-2xl bg-[#fffaf6] ${sizeClassName}`}>
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        className={`h-full w-full scale-[1.08] object-cover ${imageClassName}`}
      />
    </span>
  );
}
