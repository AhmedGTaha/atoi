import Link from "next/link";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  localizedPublicPath,
  publicLanguageUrls,
  PUBLIC_ORIGIN,
} from "@/lib/i18n/publicRoutes";
import {
  SERVICE_CONTENT,
  SERVICE_PATHS,
  type ServiceKey,
} from "@/lib/content/services";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getWebsiteContent } from "@/lib/services/websiteContentService";
import { getPublishedPortfolio } from "@/lib/services/portfolioService";
import { publicMetadata } from "@/lib/publicMetadata";
import { Container } from "@/components/ui/Container";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StatusBar } from "./StatusBar";
import { MotionReveal } from "./MotionReveal";
import { StartProjectModalProvider } from "./StartProjectModalProvider";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { About } from "./About";
import { FinalCta } from "./FinalCta";
import { SelectedWork } from "./SelectedWork";
import styles from "./ServicePage.module.css";

const RELATED_SERVICES: Record<ServiceKey, ServiceKey[]> = {
  custom: ["business", "pos"],
  pos: ["inventory", "custom"],
  business: ["custom", "inventory"],
  inventory: ["business", "pos"],
};

export async function serviceMetadata(service: ServiceKey) {
  const locale = await getLocale();
  const copy = SERVICE_CONTENT[service][locale];
  return publicMetadata(
    SERVICE_PATHS[service],
    copy.title,
    copy.description,
    locale,
  );
}

export async function ServicePage({ service }: { service: ServiceKey }) {
  const [locale, settings, content, projects] = await Promise.all([
    getLocale(),
    getCompanySettings(),
    getWebsiteContent(),
    service === "custom" ? getPublishedPortfolio() : Promise.resolve([]),
  ]);
  const copy = SERVICE_CONTENT[service][locale];
  const dict = getDictionary(locale);
  const related = RELATED_SERVICES[service];
  const url = publicLanguageUrls(SERVICE_PATHS[service])[locale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: copy.name,
    serviceType: copy.name,
    description: copy.description,
    url,
    provider: {
      "@type": "Organization",
      name: "ATOI",
      url: `${PUBLIC_ORIGIN}/`,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url, inLanguage: locale },
  };

  return (
    <StartProjectModalProvider locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar
        locale={locale}
        companyName={settings.companyName}
        lightLogoUrl={
          settings.activeLightLogo?.publicUrl ?? settings.logoPublicUrl
        }
        darkLogoUrl={
          settings.activeDarkLogo?.publicUrl ?? settings.logoPublicUrl
        }
      />
      <main id="main-content" className={styles.page}>
        <section className={styles.hero}>
          <Container>
            <MotionReveal as="p" className="section-marker mb-8" immediate>
              <Link
                href={`${localizedPublicPath("/", locale)}#services`}
                className="hover:text-foreground"
              >
                {locale === "ar" ? "خدمات ATOI" : "ATOI / services"}
              </Link>
              <span aria-hidden="true"> / </span>
              {copy.name}
            </MotionReveal>
            <div className={styles.heroGrid}>
              <div>
                <MotionReveal
                  as="h1"
                  className={styles.title}
                  immediate
                  delay={60}
                >
                  {copy.heading}
                </MotionReveal>
                <MotionReveal
                  as="p"
                  className={styles.intro}
                  immediate
                  delay={140}
                >
                  {copy.intro}
                </MotionReveal>
                <MotionReveal
                  className="mt-8 flex flex-wrap gap-3"
                  immediate
                  delay={220}
                >
                  <StartProjectTrigger className="btn btn-primary">
                    {dict.nav.startProject}
                  </StartProjectTrigger>
                  <a href="#capabilities" className="btn btn-secondary">
                    {locale === "ar" ? "ما يمكننا تطويره" : "What we can build"}
                  </a>
                </MotionReveal>
              </div>
              <MotionReveal className={styles.outline} immediate delay={280}>
                <p className="section-marker mb-6">{copy.outlineLabel}</p>
                <ol>
                  {copy.outline.map((item, i) => (
                    <li key={item.title}>
                      <span className={styles.number} aria-hidden="true">
                        0{i + 1}
                      </span>
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={styles.principle}>{copy.principle}</p>
              </MotionReveal>
            </div>
          </Container>
        </section>

        <section className="public-section border-t">
          <Container>
            <MotionReveal className={styles.sectionHeading}>
              <p className="section-marker mb-5">
                [01] {locale === "ar" ? "المشكلة أولًا" : "the problem first"}
              </p>
              <h2>{copy.problemHeading}</h2>
              <p>{copy.problemIntro}</p>
            </MotionReveal>
            <div className={styles.problemGrid}>
              {copy.problems.map((item, i) => (
                <MotionReveal
                  key={item.title}
                  className={styles.problem}
                  delay={i * 60}
                >
                  <span className="section-marker" aria-hidden="true">
                    / 0{i + 1}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </MotionReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="capabilities" className="public-section border-t">
          <Container>
            <MotionReveal className={styles.sectionHeading}>
              <p className="section-marker mb-5">
                [02] {locale === "ar" ? "ما نبنيه" : "what we build"}
              </p>
              <h2>{copy.capabilityHeading}</h2>
              <p>{copy.capabilityIntro}</p>
            </MotionReveal>
            <div className={styles.capabilities}>
              {copy.capabilities.map((item, i) => (
                <MotionReveal
                  key={item.title}
                  className={styles.capability}
                  delay={i * 45}
                >
                  <span className={styles.number} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </MotionReveal>
              ))}
            </div>
            <MotionReveal className={styles.fit}>
              <h3>{copy.fitHeading}</h3>
              <p>{copy.fitBody}</p>
            </MotionReveal>
          </Container>
        </section>

        <About locale={locale} content={content} />
        {projects.length > 0 && (
          <SelectedWork locale={locale} content={content} projects={projects} />
        )}

        <section
          className="public-section border-t"
          aria-labelledby="service-faq-heading"
        >
          <Container className={styles.faqGrid}>
            <MotionReveal>
              <p className="section-marker mb-5">
                {locale === "ar" ? "أسئلة شائعة" : "frequently asked"}
              </p>
              <h2 id="service-faq-heading">{copy.faqHeading}</h2>
            </MotionReveal>
            <div className={styles.faqs}>
              {copy.faqs.map((item) => (
                <details key={item.title}>
                  <summary>{item.title}</summary>
                  <p>{item.text}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section className="public-section border-t">
          <Container>
            <MotionReveal className={styles.related}>
              <div>
                <p className="section-marker mb-4">
                  {locale === "ar" ? "خدمة مرتبطة" : "also worth exploring"}
                </p>
                <h2>{copy.relatedHeading}</h2>
                <p>{copy.relatedBody}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {related.map((relatedService) => (
                  <Link
                    key={relatedService}
                    className="btn btn-secondary"
                    href={localizedPublicPath(
                      SERVICE_PATHS[relatedService],
                      locale,
                    )}
                  >
                    {SERVICE_CONTENT[relatedService][locale].name}
                    <span aria-hidden="true">
                      {locale === "ar" ? "←" : "→"}
                    </span>
                  </Link>
                ))}
              </div>
            </MotionReveal>
          </Container>
        </section>
        <FinalCta
          locale={locale}
          content={content}
          companyEmail={settings.companyEmail}
        />
      </main>
      <Footer locale={locale} content={content} settings={settings} />
      <StatusBar email={settings.companyEmail} />
    </StartProjectModalProvider>
  );
}
