export interface WebsiteContentField {
  key: string;
  section: "hero" | "services" | "process" | "work" | "about" | "finalCta" | "footer";
  label: string;
  multiline: boolean;
  valueEn: string;
  valueAr: string;
}

/**
 * Seed/default copy for the public one-page site, matching the supplied
 * ui-reference screenshots and SRS sections 11-17. Also doubles as the
 * fallback used if a key is ever missing from the database.
 */
export const DEFAULT_WEBSITE_CONTENT: WebsiteContentField[] = [
  {
    key: "hero.eyebrow",
    section: "hero",
    label: "Eyebrow",
    multiline: false,
    valueEn: "BAHRAIN-BASED DIGITAL STUDIO",
    valueAr: "استوديو رقمي من البحرين",
  },
  {
    key: "hero.heading",
    section: "hero",
    label: "Heading",
    multiline: false,
    valueEn: "Software built around your business.",
    valueAr: "برمجيات مصممة حول أعمالك.",
  },
  {
    key: "hero.body",
    section: "hero",
    label: "Body",
    multiline: true,
    valueEn:
      "We build websites, business systems, automation and custom software for businesses that want to work smarter.",
    valueAr:
      "نصمم مواقع إلكترونية وأنظمة أعمال وأتمتة وبرمجيات مخصصة للشركات التي تريد العمل بذكاء أكبر.",
  },
  {
    key: "hero.ctaPrimary",
    section: "hero",
    label: "Primary button label",
    multiline: false,
    valueEn: "Start a project",
    valueAr: "ابدأ مشروعاً",
  },
  {
    key: "hero.ctaSecondary",
    section: "hero",
    label: "Secondary button label",
    multiline: false,
    valueEn: "View our work",
    valueAr: "شاهد أعمالنا",
  },
  {
    key: "services.heading",
    section: "services",
    label: "Heading",
    multiline: false,
    valueEn: "What we can take care of",
    valueAr: "ما يمكننا الاهتمام به",
  },
  {
    key: "services.body",
    section: "services",
    label: "Supporting copy",
    multiline: true,
    valueEn: "No packages to decode. Just the right digital solution for the way you work.",
    valueAr: "لا حزم معقدة لفك رموزها. فقط الحل الرقمي المناسب لطريقة عملك.",
  },
  {
    key: "services.item1.name",
    section: "services",
    label: "Service 1 name",
    multiline: false,
    valueEn: "Websites & web applications",
    valueAr: "مواقع وتطبيقات ويب",
  },
  {
    key: "services.item1.description",
    section: "services",
    label: "Service 1 description",
    multiline: true,
    valueEn: "A clear digital home that helps your customers take the next step.",
    valueAr: "منزل رقمي واضح يساعد عملاءك على اتخاذ الخطوة التالية.",
  },
  {
    key: "services.item2.name",
    section: "services",
    label: "Service 2 name",
    multiline: false,
    valueEn: "Business software",
    valueAr: "برمجيات الأعمال",
  },
  {
    key: "services.item2.description",
    section: "services",
    label: "Service 2 description",
    multiline: true,
    valueEn: "Practical tools designed around the way your team already works.",
    valueAr: "أدوات عملية مصممة حول طريقة عمل فريقك الحالية.",
  },
  {
    key: "services.item3.name",
    section: "services",
    label: "Service 3 name",
    multiline: false,
    valueEn: "Automation",
    valueAr: "الأتمتة",
  },
  {
    key: "services.item3.description",
    section: "services",
    label: "Service 3 description",
    multiline: true,
    valueEn: "Less repetitive work, fewer handovers and more time for what matters.",
    valueAr: "عمل متكرر أقل، تسليمات أقل، ووقت أكبر لما يهم.",
  },
  {
    key: "services.item4.name",
    section: "services",
    label: "Service 4 name",
    multiline: false,
    valueEn: "AI solutions",
    valueAr: "حلول الذكاء الاصطناعي",
  },
  {
    key: "services.item4.description",
    section: "services",
    label: "Service 4 description",
    multiline: true,
    valueEn: "Useful intelligence applied thoughtfully to your real business tasks.",
    valueAr: "ذكاء مفيد يُطبق بعناية على مهام عملك الحقيقية.",
  },
  {
    key: "process.heading",
    section: "process",
    label: "Heading",
    multiline: false,
    valueEn: "Simple from the start.",
    valueAr: "بسيط منذ البداية.",
  },
  {
    key: "process.step1.name",
    section: "process",
    label: "Step 1 name",
    multiline: false,
    valueEn: "Tell us what you need",
    valueAr: "أخبرنا بما تحتاجه",
  },
  {
    key: "process.step1.description",
    section: "process",
    label: "Step 1 description",
    multiline: true,
    valueEn: "Describe the business problem or idea in your own words.",
    valueAr: "صف مشكلة عملك أو فكرتك بكلماتك الخاصة.",
  },
  {
    key: "process.step2.name",
    section: "process",
    label: "Step 2 name",
    multiline: false,
    valueEn: "We plan and build it",
    valueAr: "نخطط ونبنيه",
  },
  {
    key: "process.step2.description",
    section: "process",
    label: "Step 2 description",
    multiline: true,
    valueEn: "We determine the right approach, then get to work.",
    valueAr: "نحدد النهج الصحيح، ثم نبدأ العمل.",
  },
  {
    key: "process.step3.name",
    section: "process",
    label: "Step 3 name",
    multiline: false,
    valueEn: "Follow the progress",
    valueAr: "تابع التقدم",
  },
  {
    key: "process.step3.description",
    section: "process",
    label: "Step 3 description",
    multiline: true,
    valueEn: "Stay close to the project without having to manage the details.",
    valueAr: "ابق قريباً من المشروع دون الحاجة لإدارة التفاصيل.",
  },
  {
    key: "work.heading",
    section: "work",
    label: "Heading",
    multiline: false,
    valueEn: "Selected work",
    valueAr: "أعمال مختارة",
  },
  {
    key: "work.seeAllLabel",
    section: "work",
    label: "\"See all projects\" label",
    multiline: false,
    valueEn: "See all projects",
    valueAr: "عرض كل المشاريع",
  },
  {
    key: "about.heading",
    section: "about",
    label: "Heading",
    multiline: false,
    valueEn: "Bahrain-based. Built around your business.",
    valueAr: "من البحرين. مصمم حول أعمالك.",
  },
  {
    key: "about.body",
    section: "about",
    label: "Body",
    multiline: true,
    valueEn:
      "Atrio is a Bahrain-based digital studio helping small businesses go digital without the complexity. We keep communication direct, our process simple, and our solutions practical — so you can focus on running your business while we handle the software.",
    valueAr:
      "أتريو استوديو رقمي مقره البحرين يساعد الشركات الصغيرة على التحول الرقمي دون تعقيد. نحافظ على تواصل مباشر، وعملية بسيطة، وحلول عملية — لتتمكن من التركيز على إدارة أعمالك بينما نتولى نحن الجانب البرمجي.",
  },
  {
    key: "finalCta.eyebrow",
    section: "finalCta",
    label: "Eyebrow",
    multiline: false,
    valueEn: "LET'S MAKE IT SIMPLER",
    valueAr: "لنجعل الأمر أبسط",
  },
  {
    key: "finalCta.heading",
    section: "finalCta",
    label: "Heading",
    multiline: false,
    valueEn: "Have a problem software could solve?",
    valueAr: "هل لديك مشكلة يمكن للبرمجيات حلها؟",
  },
  {
    key: "finalCta.body",
    section: "finalCta",
    label: "Body",
    multiline: true,
    valueEn: "Tell us what your business needs. You do not need to know the technical solution.",
    valueAr: "أخبرنا بما تحتاجه أعمالك. لست بحاجة لمعرفة الحل التقني.",
  },
  {
    key: "finalCta.ctaLabel",
    section: "finalCta",
    label: "Button label",
    multiline: false,
    valueEn: "Start a project",
    valueAr: "ابدأ مشروعاً",
  },
  {
    key: "footer.tagline",
    section: "footer",
    label: "Company tagline",
    multiline: false,
    valueEn: "Software solutions, made straightforward.",
    valueAr: "حلول برمجية، بأسلوب مباشر.",
  },
];

export const DEFAULT_WEBSITE_CONTENT_MAP: Record<string, { valueEn: string; valueAr: string }> =
  Object.fromEntries(
    DEFAULT_WEBSITE_CONTENT.map((f) => [f.key, { valueEn: f.valueEn, valueAr: f.valueAr }])
  );
