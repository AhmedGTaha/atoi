"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@prisma/client";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatNumber, interpolate } from "@/lib/i18n/format";

type GalleryImage = Pick<
  PortfolioImage,
  "id" | "publicUrl" | "altEn" | "altAr" | "isMain"
>;

export function ProjectGallery({
  images,
  locale,
  title,
  frameLabel,
  mode = "card",
  className,
}: {
  images: GalleryImage[];
  locale: Locale;
  title: string;
  frameLabel?: string;
  mode?: "card" | "detail" | "preview" | "featured";
  className?: string;
}) {
  const coverIndex = useMemo(
    () =>
      Math.max(
        0,
        images.findIndex((image) => image.isMain),
      ),
    [images],
  );
  const [imageIndex, setImageIndex] = useState(coverIndex);
  const [frameRatio, setFrameRatio] = useState<number>();
  const imageSignature = images.map((image) => image.id).join(",");
  const dict = getDictionary(locale);

  useEffect(() => {
    setImageIndex(coverIndex);
  }, [coverIndex, imageSignature]);

  // A gallery keeps one stable frame while the visitor moves through it.  Use
  // the largest source image as that frame, rather than cropping every upload
  // into a design-time ratio such as 16:10.
  useEffect(() => {
    let cancelled = false;

    // Do not carry a previous project's canvas into a newly supplied gallery
    // while its own image dimensions are being resolved.
    setFrameRatio(undefined);

    Promise.all(
      images.map(
        (galleryImage) =>
          new Promise<{ width: number; height: number } | null>((resolve) => {
            const source = new window.Image();
            source.onload = () =>
              resolve({
                width: source.naturalWidth,
                height: source.naturalHeight,
              });
            source.onerror = () => resolve(null);
            source.src = galleryImage.publicUrl;
          }),
      ),
    ).then((dimensions) => {
      if (cancelled) return;
      const largest = dimensions.reduce<{
        width: number;
        height: number;
      } | null>((current, candidate) => {
        if (!candidate) return current;
        if (
          !current ||
          candidate.width * candidate.height > current.width * current.height
        ) {
          return candidate;
        }
        return current;
      }, null);
      setFrameRatio(
        largest && largest.width > 0 && largest.height > 0
          ? largest.width / largest.height
          : undefined,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [imageSignature, images]);

  const image = images[imageIndex];
  const count = images.length;
  const canGoPrevious = imageIndex > 0;
  const canGoNext = imageIndex < count - 1;

  if (!image) {
    return (
      <div
        className={`project-gallery project-gallery-${mode} ${className ?? ""}`}
      >
        {mode === "featured" && frameLabel && (
          <div className="project-gallery-framebar">{frameLabel}</div>
        )}
        <div className="project-gallery-empty">{dict.gallery.emptyImage}</div>
      </div>
    );
  }

  const alt =
    localize(locale, {
      valueEn: image.altEn ?? "",
      valueAr: image.altAr ?? "",
    }) || title;

  return (
    <div
      className={`project-gallery project-gallery-${mode} ${className ?? ""}`}
    >
      {mode === "featured" && frameLabel && (
        <div className="project-gallery-framebar">{frameLabel}</div>
      )}
      <div
        className="project-gallery-stage"
        style={
          frameRatio
            ? ({
                "--project-gallery-ratio": String(frameRatio),
              } as CSSProperties)
            : undefined
        }
      >
        <Image
          src={image.publicUrl}
          alt={alt}
          fill
          sizes={
            mode === "detail"
              ? "(min-width: 1024px) 52vw, 94vw"
              : mode === "featured"
                ? "(min-width: 1024px) 58vw, 92vw"
                : "(min-width: 1024px) 34vw, 92vw"
          }
          className="object-contain object-center"
          unoptimized={image.publicUrl.startsWith("blob:")}
        />
        {canGoPrevious && (
          <button
            type="button"
            aria-label={dict.gallery.previousImage}
            onClick={() => setImageIndex((index) => index - 1)}
            className="project-gallery-arrow project-gallery-arrow-previous"
          >
            ‹
          </button>
        )}
        {canGoNext && (
          <button
            type="button"
            aria-label={dict.gallery.nextImage}
            onClick={() => setImageIndex((index) => index + 1)}
            className="project-gallery-arrow project-gallery-arrow-next"
          >
            ›
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="project-gallery-status">
          <span>
            {formatNumber(locale, imageIndex + 1)} /{" "}
            {formatNumber(locale, count)}
          </span>
          <div
            className="project-gallery-dots"
            aria-label={interpolate(dict.gallery.positionLabel, {
              index: formatNumber(locale, imageIndex + 1),
              count: formatNumber(locale, count),
            })}
          >
            {images.map((galleryImage, index) => (
              <button
                key={galleryImage.id}
                type="button"
                aria-label={`${dict.gallery.showImage} ${formatNumber(locale, index + 1)}`}
                aria-current={index === imageIndex}
                onClick={() => setImageIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {mode === "detail" && count > 1 && (
        <div
          className="project-gallery-thumbnails"
          aria-label={dict.gallery.projectImages}
        >
          {images.map((galleryImage, index) => (
            <button
              key={galleryImage.id}
              type="button"
              onClick={() => setImageIndex(index)}
              aria-label={`${dict.gallery.showImage} ${formatNumber(locale, index + 1)}`}
              aria-current={index === imageIndex}
            >
              <Image
                src={galleryImage.publicUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={galleryImage.publicUrl.startsWith("blob:")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
