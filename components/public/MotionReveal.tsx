"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import clsx from "clsx";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  immediate?: boolean;
};

/** A deliberately small progressive-enhancement entrance primitive. */
export function MotionReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => setVisible(true);
    if (immediate) {
      const frame = requestAnimationFrame(() => {
        setReady(true);
        requestAnimationFrame(show);
      });
      return () => cancelAnimationFrame(frame);
    }

    setReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={clsx("motion-reveal", className)}
      data-motion-ready={ready || undefined}
      data-motion-visible={visible || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function HeroDepth({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(
        1,
        Math.max(0, -element.getBoundingClientRect().top / 500),
      );
      element.style.setProperty("--hero-scroll-y", `${progress * -24}px`);
      element.style.setProperty(
        "--hero-scroll-opacity",
        `${1 - progress * 0.18}`,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="hero-depth">
      {children}
    </div>
  );
}
