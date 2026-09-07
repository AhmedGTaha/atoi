export interface WebsiteContentField {
  key: string;
  section:
    | "hero"
    | "services"
    | "process"
    | "work"
    | "about"
    | "finalCta"
    | "footer";
  label: string;
  multiline: boolean;
  valueEn: string;
  valueAr: string;
}

/**
 * Seed/default copy for the public one-page site.
 * Voice: plain, confident, human. Short sentences. No buzzwords.
 * Also doubles as the fallback used if a key is ever missing from the database.
 */
export const DEFAULT_WEBSITE_CONTENT: WebsiteContentField[] = [
  {
    key: "hero.eyebrow",
    section: "hero",
    label: "Eyebrow",
    multiline: false,
    valueEn: "Software studio — Bahrain",
    valueAr: "استوديو برمجيات — البحرين",
  },
  {
    key: "hero.heading",
    section: "hero",
    label: "Heading",
    multiline: false,
    valueEn: "Websites and software your business can rely on.",
    valueAr: "مواقع وبرمجيات يعتمد عليها شغلك.",
  },
  {
    key: "hero.body",
    section: "hero",
    label: "Body",
    multiline: true,
    valueEn:
      "ATOI designs, builds, and looks after websites and business software for companies in Bahrain. One team, plain language, no surprises.",
    valueAr:
      "أتوي تصمم وتبني وتتابع المواقع والبرمجيات لشركات البحرين. فريق واحد، وكلام واضح، وبدون مفاجآت.",
  },
  {
    key: "hero.ctaPrimary",
    section: "hero",
    label: "Primary button label",
    multiline: false,
    valueEn: "Start a project",
    valueAr: "ابدأ مشروعك",
  },
  {
    key: "hero.ctaSecondary",
    section: "hero",
    label: "Secondary button label",
    multiline: false,
    valueEn: "See our work",
    valueAr: "شوف شغلنا",
  },
  {
    key: "services.heading",
    section: "services",
    label: "Heading",
    multiline: false,
    valueEn: "What we build",
    valueAr: "وش نبني",
  },
  {
    key: "services.body",
    section: "services",
    label: "Supporting copy",
    multiline: true,
    valueEn: "Four things, done properly. Pick one or combine them.",
    valueAr: "أربع أشياء، ونسويها صح. اختر وحدة أو اجمع بينها.",
  },
  {
    key: "services.item1.name",
    section: "services",
    label: "Service 1 name",
    multiline: false,
    valueEn: "Business websites",
    valueAr: "مواقع للشركات",
  },
  {
    key: "services.item1.description",
    section: "services",
    label: "Service 1 description",
    multiline: true,
    valueEn:
      "Fast Arabic/English sites that explain what you do and bring you customers.",
    valueAr: "مواقع سريعة بالعربي والإنجليزي تشرح شغلك وتجيب لك عملاء.",
  },
  {
    key: "services.item2.name",
    section: "services",
    label: "Service 2 name",
    multiline: false,
    valueEn: "Web applications",
    valueAr: "تطبيقات ويب",
  },
  {
    key: "services.item2.description",
    section: "services",
    label: "Service 2 description",
    multiline: true,
    valueEn:
      "Portals, dashboards, and booking flows your team and customers actually use.",
    valueAr: "بوابات ولوحات تحكم وحجوزات يستخدمها فريقك وعملاؤك فعلاً.",
  },
  {
    key: "services.item3.name",
    section: "services",
    label: "Service 3 name",
    multiline: false,
    valueEn: "Automation",
    valueAr: "أتمتة",
  },
  {
    key: "services.item3.description",
    section: "services",
    label: "Service 3 description",
    multiline: true,
    valueEn:
      "We connect your tools and remove the repetitive work eating your week.",
    valueAr: "نربط أدواتك ببعض ونشيل الشغل المتكرر اللي ياكل أسبوعك.",
  },
  {
    key: "services.item4.name",
    section: "services",
    label: "Service 4 name",
    multiline: false,
    valueEn: "Care plans",
    valueAr: "خطط متابعة",
  },
  {
    key: "services.item4.description",
    section: "services",
    label: "Service 4 description",
    multiline: true,
    valueEn:
      "Updates, backups, and someone to call when anything breaks.",
    valueAr: "تحديثات ونسخ احتياطي، وشخص تتصل عليه إذا تعطل شيء.",
  },
  {
    key: "process.heading",
    section: "process",
    label: "Heading",
    multiline: false,
    valueEn: "How it goes",
    valueAr: "كيف يمشي الشغل",
  },
  {
    key: "process.step1.name",
    section: "process",
    label: "Step 1 name",
    multiline: false,
    valueEn: "You talk, we listen",
    valueAr: "انت تتكلم، وحنا نسمع",
  },
  {
    key: "process.step1.description",
    section: "process",
    label: "Step 1 description",
    multiline: true,
    valueEn: "A short call about what you need. No jargon, no pressure.",
    valueAr: "مكالمة قصيرة عن اللي تحتاجه. بدون مصطلحات وبدون ضغط.",
  },
  {
    key: "process.step2.name",
    section: "process",
    label: "Step 2 name",
    multiline: false,
    valueEn: "We build it",
    valueAr: "نبنيه",
  },
  {
    key: "process.step2.description",
    section: "process",
    label: "Step 2 description",
    multiline: true,
    valueEn: "Fixed price, fixed timeline. You see progress every week.",
    valueAr: "سعر ثابت ومدة ثابتة. وتشوف التقدم كل أسبوع.",
  },
  {
    key: "process.step3.name",
    section: "process",
    label: "Step 3 name",
    multiline: false,
    valueEn: "We stay around",
    valueAr: "ونبقى معك",
  },
  {
    key: "process.step3.description",
    section: "process",
    label: "Step 3 description",
    multiline: true,
    valueEn: "Launch day is the start. We keep it running and improve it.",
    valueAr: "يوم الإطلاق هو البداية. نحافظ عليه شغال ونطوره.",
  },
  {
    key: "work.heading",
    section: "work",
    label: "Heading",
    multiline: false,
    valueEn: "Recent work",
    valueAr: "شغلنا الأخير",
  },
  {
    key: "work.seeAllLabel",
    section: "work",
    label: '"See all projects" label',
    multiline: false,
    valueEn: "See all projects",
    valueAr: "شوف كل المشاريع",
  },
  {
    key: "about.heading",
    section: "about",
    label: "Heading",
    multiline: false,
    valueEn: "A small studio in Manama.",
    valueAr: "استوديو صغير في المنامة.",
  },
  {
    key: "about.body",
    section: "about",
    label: "Body",
    multiline: true,
    valueEn:
      "We're a small team, and that's on purpose. You talk to the people building your software, in Arabic or English. No account managers relaying messages, no ticket queues.",
    valueAr:
      "فريقنا صغير، وهذا مقصود. تتكلم مع نفس الناس اللي تبني برمجياتك، بالعربي أو الإنجليزي. بدون وسطاء وبدون طوابير تذاكر.",
  },
  {
    key: "finalCta.eyebrow",
    section: "finalCta",
    label: "Eyebrow",
    multiline: false,
    valueEn: "START HERE",
    valueAr: "ابدأ من هنا",
  },
  {
    key: "finalCta.heading",
    section: "finalCta",
    label: "Heading",
    multiline: false,
    valueEn: "Tell us what you need.",
    valueAr: "قل لنا وش تحتاج.",
  },
  {
    key: "finalCta.body",
    section: "finalCta",
    label: "Body",
    multiline: true,
    valueEn:
      "One message is enough. We reply within one working day.",
    valueAr: "رسالة وحدة تكفي. ونرد عليك خلال يوم عمل واحد.",
  },
  {
    key: "finalCta.ctaLabel",
    section: "finalCta",
    label: "Button label",
    multiline: false,
    valueEn: "Start a project",
    valueAr: "ابدأ مشروعك",
  },
  {
    key: "footer.tagline",
    section: "footer",
    label: "Company tagline",
    multiline: false,
    valueEn: "Built in Bahrain.",
    valueAr: "مصنوع في البحرين.",
  },
];

export const DEFAULT_WEBSITE_CONTENT_MAP: Record<
  string,
  { valueEn: string; valueAr: string }
> = Object.fromEntries(
  DEFAULT_WEBSITE_CONTENT.map((f) => [
    f.key,
    { valueEn: f.valueEn, valueAr: f.valueAr },
  ]),
);
