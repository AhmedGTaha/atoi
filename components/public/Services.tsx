import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

const SERVICE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    altEn: "Website code on a screen",
    altAr: "كود موقع على شاشة",
    icon: "M8 6l-6 6 6 6M16 6l6 6-6 6",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    altEn: "Web application code close-up",
    altAr: "كود تطبيق ويب عن قرب",
    icon: "M4 5h16v11H4zM4 8h16M9 2v3M15 2v3",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    altEn: "Team planning work on a whiteboard",
    altAr: "فريق يخطط للعمل على لوح",
    icon: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    altEn: "Support call with a client",
    altAr: "مكالمة دعم مع عميل",
    icon: "M4 13a8 8 0 0116 0M12 11a3 3 0 100-6 3 3 0 000 6zM5 21c1-4 4-6 7-6s6 2 7 6",
  },
];

export function Services({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="services" className="lp-section">
      <Container>
        <p className="lp-kicker">
          {locale === "ar" ? "وش نبني" : "What we do"}
        </p>
        <div className="lp-split">
          <h2 className="lp-h2">{t(content, "services.heading", locale)}</h2>
          <p className="lp-lead">{t(content, "services.body", locale)}</p>
        </div>
        <div className="lp-grid">
          {[1, 2, 3, 4].map((n) => {
            const img = SERVICE_IMAGES[n - 1];
            return (
              <article key={n} className="lp-card">
                <div className="lp-card-photo">
                  <Image
                    src={img.src}
                    alt={locale === "ar" ? img.altAr : img.altEn}
                    width={1200}
                    height={750}
                    loading="lazy"
                  />
                </div>
                <div className="lp-card-body">
                  <svg
                    className="lp-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={img.icon} />
                  </svg>
                  <h3>{t(content, `services.item${n}.name`, locale)}</h3>
                  <p>{t(content, `services.item${n}.description`, locale)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
