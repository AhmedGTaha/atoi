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
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    altEn: "Web application code close-up",
    altAr: "كود تطبيق ويب عن قرب",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    altEn: "Team planning work on a whiteboard",
    altAr: "فريق يخطط للعمل على لوح",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    altEn: "Support call with a client",
    altAr: "مكالمة دعم مع عميل",
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
    <section id="services" className="public-section services-section">
      <Container>
        <p className="section-marker mb-5">
          [02] {locale === "ar" ? "وش نبني" : "what we do"}
        </p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[20ch]">
            {t(content, "services.heading", locale)}
          </h2>
          <p className="max-w-sm text-muted">
            {t(content, "services.body", locale)}
          </p>
        </div>
        <div className="service-cards">
          {[1, 2, 3, 4].map((n) => {
            const img = SERVICE_IMAGES[n - 1];
            return (
              <article key={n} className="service-card">
                <div className="service-photo">
                  <Image
                    src={img.src}
                    alt={locale === "ar" ? img.altAr : img.altEn}
                    width={1200}
                    height={750}
                    loading="lazy"
                  />
                </div>
                <div className="service-card-body">
                  <p className="section-marker">0{n}</p>
                  <h3>{t(content, `services.item${n}.name`, locale)}</h3>
                  <p className="text-muted">
                    {t(content, `services.item${n}.description`, locale)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
