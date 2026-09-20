import type { Locale } from "@/lib/i18n/locale";
import type { PublicPath } from "@/lib/i18n/publicRoutes";
import { ADDITIONAL_SERVICE_CONTENT } from "./additionalServices";

export const SERVICE_PATHS = {
  custom: "/services/custom-software-development",
  pos: "/services/pos-system-development",
  business: "/services/business-management-systems",
  inventory: "/services/inventory-management-systems",
} as const satisfies Record<string, PublicPath>;
export type ServiceKey = keyof typeof SERVICE_PATHS;

interface Item {
  title: string;
  text: string;
}
export interface ServiceCopy {
  name: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  principle: string;
  outlineLabel: string;
  outline: Item[];
  problemHeading: string;
  problemIntro: string;
  problems: Item[];
  capabilityHeading: string;
  capabilityIntro: string;
  capabilities: Item[];
  fitHeading: string;
  fitBody: string;
  faqHeading: string;
  faqs: Item[];
  relatedHeading: string;
  relatedBody: string;
}

const CORE_SERVICE_CONTENT: Record<
  "custom" | "pos",
  Record<Locale, ServiceCopy>
> = {
  custom: {
    en: {
      name: "Custom software development",
      title: "Custom Software Development Company | ATOI",
      description:
        "ATOI builds custom software, internal business systems, web applications, and operational platforms designed around how your business actually works.",
      heading: "Custom Software Built Around Your Business",
      intro:
        "Your team should not have to redesign its work around generic software. ATOI builds custom business software around your actual workflows, from the first request to the final approval.",
      principle:
        "Start with the way the business works. Build the system around it.",
      outlineLabel: "From scattered work to one system",
      outline: [
        {
          title: "Understand the workflow",
          text: "The spreadsheets, WhatsApp messages, paper forms, and decisions behind the work.",
        },
        {
          title: "Connect the moving parts",
          text: "People, information, approvals, and the tools you need to keep.",
        },
        {
          title: "Build one working system",
          text: "A shared place to do the work and see what happens next.",
        },
      ],
      problemHeading: "When the workaround becomes the work.",
      problemIntro:
        "A spreadsheet can be a good starting point. It becomes a problem when keeping it updated takes more effort than the operation it is meant to support.",
      problems: [
        {
          title: "Information in too many places",
          text: "Requests in WhatsApp, records on paper, and updates in separate tools. Bring the relevant information into one workflow.",
        },
        {
          title: "The same task, again",
          text: "Re-entering data, chasing approvals, or copying reports. Automate repeatable steps and keep people involved where judgment matters.",
        },
        {
          title: "No clear view of progress",
          text: "Build dashboards and responsibility tracking so teams can see what is waiting, who owns it, and what needs attention.",
        },
        {
          title: "Software that sets the rules",
          text: "Replace an awkward legacy system or connect disconnected applications around the process your business actually needs.",
        },
      ],
      capabilityHeading: "Your workflow. The right building blocks.",
      capabilityIntro:
        "We scope the system around the work it needs to support. That might mean a focused internal tool, a custom web application, or a business management platform with several connected parts.",
      capabilities: [
        {
          title: "Operations platforms",
          text: "Manage jobs, requests, resources, and handovers in one place, with records that follow the work.",
        },
        {
          title: "Customer and staff portals",
          text: "Give customers and teams access to the information and actions relevant to them, with defined roles and permissions.",
        },
        {
          title: "Workflows and approvals",
          text: "Route decisions, track status, and record approvals without relying on someone to chase the next person.",
        },
        {
          title: "Dashboards and reporting",
          text: "Turn operational data into useful views for the people running the business, with filters and exports agreed in scope.",
        },
        {
          title: "Booking and SaaS platforms",
          text: "Build scheduling, account access, and product workflows around your service or software business model.",
        },
        {
          title: "Integrations and automation",
          text: "Connect systems through available APIs or agreed data exchanges. We assess access, limitations, and dependencies before committing to an integration.",
        },
      ],
      fitHeading: "Keep what works. Replace what gets in the way.",
      fitBody:
        "You may not need to replace every tool at once. We can plan a first release around a specific bottleneck, agree how existing data will move, and build on that foundation as priorities become clearer.",
      faqHeading: "Before we build.",
      faqs: [
        {
          title:
            "Can you replace spreadsheets and manual processes with one system?",
          text: "Yes. We start by mapping the files, steps, and responsibilities involved. We then agree which records belong in the system, how they connect, and how existing data should be checked and imported.",
        },
        {
          title: "Can you integrate with our existing software?",
          text: "We can build integrations where the software provides suitable APIs, exports, or other access. We review the vendor's documentation, permissions, and constraints before defining the integration scope.",
        },
        {
          title: "Can you build software for a process unique to our company?",
          text: "Yes. That is the point of custom software. We work through real examples with your team and turn your rules, exceptions, and approval steps into a system you can review as it develops.",
        },
        {
          title: "Can the system support multiple branches or teams?",
          text: "It can be designed for shared or branch-specific records, different access levels, and consolidated reporting. We define those boundaries with you before building.",
        },
        {
          title: "How are the cost and timeline decided?",
          text: "They depend on the workflows, data, integrations, and delivery scope. We agree priorities and a practical first release before setting the project plan; a larger platform can be delivered in stages.",
        },
        {
          title: "Do you work with companies outside Bahrain?",
          text: "Yes. ATOI is based in Bahrain and can work with businesses remotely. We agree communication, review sessions, and any local requirements as part of the project scope.",
        },
      ],
      relatedHeading: "Does the workflow start at the checkout?",
      relatedBody:
        "Explore custom POS development for sales, stock, branches, and the operations behind the counter.",
    },
    ar: {
      name: "تطوير أنظمة وبرمجيات مخصصة",
      title: "تطوير أنظمة وبرمجيات مخصصة للشركات | ATOI",
      description:
        "تطوّر ATOI أنظمة مخصصة للشركات وتطبيقات ويب ومنصات تشغيل تربط إجراءات العمل والفرق والبيانات، وفق احتياجات نشاطك وطريقة إدارته.",
      heading: "نطوّر نظامًا يناسب طريقة عمل شركتك",
      intro:
        "ليس مطلوبًا أن تغيّر إجراءات شركتك لتناسب برنامجًا جاهزًا. في ATOI نبدأ بفهم العمل كما يجري فعليًا، ثم نطوّر نظامًا مخصصًا يخدم فريقك من استلام الطلب إلى اعتماده وإنجازه.",
      principle: "نفهم طريقة عملك أولًا. ثم نبني النظام على أساسها.",
      outlineLabel: "من إجراءات متفرقة إلى نظام واحد",
      outline: [
        {
          title: "نفهم التفاصيل",
          text: "ملفات إكسل، رسائل واتساب، النماذج الورقية، والقرارات التي يعتمد عليها العمل.",
        },
        {
          title: "نربط الإجراءات",
          text: "الفرق والبيانات والموافقات، مع الأدوات التي تحتاج إلى الاستمرار في استخدامها.",
        },
        {
          title: "نبني نظامًا يجمع العمل",
          text: "مكان واضح لتنفيذ المهام ومتابعة حالتها ومعرفة الخطوة التالية.",
        },
      ],
      problemHeading: "عندما تصبح متابعة العمل عبئًا بحد ذاتها.",
      problemIntro:
        "قد تؤدي الجداول الغرض في البداية. لكن مع زيادة الطلبات والموظفين، تصبح متابعة النسخ والتحديثات والأخطاء عملًا يوميًا إضافيًا.",
      problems: [
        {
          title: "بيانات موزعة بين أكثر من مكان",
          text: "طلبات على واتساب، وسجلات ورقية، وتحديثات في برامج منفصلة. نجمع البيانات اللازمة ضمن مسار عمل مترابط.",
        },
        {
          title: "مهام تتكرر يدويًا",
          text: "إدخال المعلومات أكثر من مرة، وملاحقة الموافقات، وتجهيز التقارير. يمكن أتمتة الخطوات المتكررة مع إبقاء القرارات المهمة بيد الفريق.",
        },
        {
          title: "صعوبة معرفة حالة العمل",
          text: "لوحات متابعة توضّح الطلبات المعلّقة والمسؤول عن كل مهمة وما يحتاج إلى تدخل، بدل الاعتماد على الاستفسارات المتكررة.",
        },
        {
          title: "برنامج لا يناسب إجراءاتك",
          text: "نطوّر بديلًا لنظام قديم أو نربط الأنظمة الحالية، وفق احتياج العمل بدل إجبار الموظفين على إجراءات غير مناسبة.",
        },
      ],
      capabilityHeading: "نظام إدارة شركة يبدأ من احتياجك الفعلي.",
      capabilityIntro:
        "قد تحتاج إلى أداة داخلية لمهمة محددة، أو تطبيق ويب مخصص، أو منصة تربط عدة أقسام. نحدد المكونات المطلوبة قبل البدء، دون إضافة تعقيد لا يخدم العمل.",
      capabilities: [
        {
          title: "أنظمة إدارة العمليات",
          text: "تنظيم الطلبات والمهام والموارد وتسليم العمل بين الفرق، مع سجل واضح لكل إجراء.",
        },
        {
          title: "بوابات العملاء والموظفين",
          text: "وصول مناسب لكل مستخدم إلى بياناته ومهامه، بصلاحيات تتوافق مع دوره ومسؤوليته.",
        },
        {
          title: "مسارات العمل والموافقات",
          text: "توجيه الطلب إلى الشخص المختص وتسجيل الموافقات ومتابعة الحالة دون ملاحقات يدوية مستمرة.",
        },
        {
          title: "لوحات المتابعة والتقارير",
          text: "عرض البيانات التي تحتاجها الإدارة والفرق، مع خيارات البحث والتصفية والتصدير المتفق عليها.",
        },
        {
          title: "أنظمة الحجز ومنصات البرمجيات",
          text: "تطوير الحجوزات وحسابات المستخدمين وإجراءات الخدمة أو منتج البرمجيات كخدمة، بحسب نموذج عملك.",
        },
        {
          title: "الربط والأتمتة",
          text: "ربط الأنظمة عبر واجهاتها المتاحة أو آليات تبادل البيانات المناسبة، بعد التحقق من الصلاحيات والقيود الفنية.",
        },
      ],
      fitHeading: "نحتفظ بما يخدمك. ونطوّر ما يعطّل العمل.",
      fitBody:
        "ليس من الضروري تغيير جميع الأدوات دفعة واحدة. يمكن أن نبدأ بإجراء يسبب تأخيرًا واضحًا، ونحدد طريقة نقل بياناته، ثم نوسّع النظام تدريجيًا وفق الأولويات.",
      faqHeading: "أسئلة قبل بدء المشروع.",
      faqs: [
        {
          title: "هل يمكن استبدال إكسل والإجراءات اليدوية بنظام واحد؟",
          text: "نعم. نراجع الملفات والخطوات والمسؤوليات أولًا، ثم نحدد البيانات التي سيحتويها النظام والعلاقات بينها، وكيفية تدقيق البيانات الحالية واستيرادها.",
        },
        {
          title: "هل يمكن ربط النظام بالبرامج التي نستخدمها؟",
          text: "يمكن ذلك عندما يتيح البرنامج واجهات ربط أو تصدير بيانات أو وسيلة وصول مناسبة. نراجع التوثيق والصلاحيات والقيود معك قبل الاتفاق على نطاق الربط.",
        },
        {
          title: "إجراءات شركتنا خاصة بنا، هل يمكن برمجة نظام لها؟",
          text: "نعم، وهذا أساس التطوير المخصص. نناقش أمثلة واقعية مع فريقك لفهم القواعد والاستثناءات والموافقات، ثم نحولها إلى نظام تراجعه أثناء التطوير.",
        },
        {
          title: "هل يدعم النظام عدة فروع أو فرق؟",
          text: "يمكن تصميمه ببيانات مشتركة أو منفصلة لكل فرع، وصلاحيات مختلفة، وتقارير موحدة للإدارة. نتفق على هذه الحدود قبل التنفيذ.",
        },
        {
          title: "كيف تحددون تكلفة المشروع ومدة تنفيذه؟",
          text: "بحسب الإجراءات المطلوبة والبيانات والتكاملات ونطاق التسليم. نحدد الأولويات والإصدار الأول قبل وضع خطة المشروع، ويمكن تقسيم المنصات الأكبر إلى مراحل.",
        },
        {
          title: "هل تعملون مع شركات خارج البحرين؟",
          text: "نعم. مقر ATOI في البحرين ويمكننا العمل مع الشركات عن بُعد. نتفق على آلية التواصل وجلسات المراجعة وأي متطلبات محلية ضمن نطاق المشروع.",
        },
      ],
      relatedHeading: "هل تبدأ إجراءات نشاطك من نقطة البيع؟",
      relatedBody:
        "تعرّف على تطوير أنظمة نقاط بيع مخصصة تربط المبيعات بالمخزون والفروع والعمليات اليومية.",
    },
  },
  pos: {
    en: {
      name: "Custom POS system development",
      title: "Custom POS System Development | ATOI",
      description:
        "ATOI builds custom POS systems for restaurants, retail businesses, and multi-branch operations with inventory, reporting, staff controls, and integrations.",
      heading: "A POS System Built for How Your Business Operates",
      intro:
        "When an off-the-shelf POS cannot follow your workflow, the answer may be a system built around it. ATOI develops custom point of sale software and the business operations behind it. We do not sell a ready-made POS product.",
      principle: "The sale is one step. Build for everything around it.",
      outlineLabel: "A connected sales workflow",
      outline: [
        {
          title: "At the counter",
          text: "Products, orders, customers, and the steps your staff follow to complete a sale.",
        },
        {
          title: "Behind the sale",
          text: "Stock movements, employee permissions, and branch-specific operations.",
        },
        {
          title: "Across the business",
          text: "Reporting and agreed integrations that give management a connected view.",
        },
      ],
      problemHeading: "A checkout should fit the operation.",
      problemIntro:
        "Custom development makes sense when the gaps in a standard product affect daily work. We start with those gaps, not a fixed feature package.",
      problems: [
        {
          title: "Sales and stock do not agree",
          text: "Define how sales, returns, and transfers affect inventory so the two are part of the same process.",
        },
        {
          title: "Every branch works differently",
          text: "Set shared rules while allowing the local products, access levels, and workflows each branch needs.",
        },
        {
          title: "Staff work around the system",
          text: "Design the order flow, permissions, and shift tasks around how your team actually serves customers.",
        },
        {
          title: "Reports require another spreadsheet",
          text: "Bring agreed sales and operational data into reporting views, with definitions your team can use consistently.",
        },
      ],
      capabilityHeading: "Build the scope your business needs.",
      capabilityIntro:
        "These are capabilities we can design and build around project requirements, not a list of features in an existing product. Integrations depend on provider access, documentation, and approval where required.",
      capabilities: [
        {
          title: "Sales and customers",
          text: "Point of sale, invoices, discounts, returns, customer records, and loyalty rules tailored to the way you trade.",
        },
        {
          title: "Products and inventory",
          text: "Products, variants, stock movements, and branch transfers connected to sales, with the tracking rules agreed for your business.",
        },
        {
          title: "Branches and staff",
          text: "Multiple locations, employee roles and permissions, shifts, and branch-level or consolidated sales reporting.",
        },
        {
          title: "Restaurant operations",
          text: "Table and order flows, kitchen display systems, and online ordering connections where needed for the agreed restaurant or cafe workflow.",
        },
        {
          title: "Reporting and dashboards",
          text: "Sales, returns, stock, and operational views designed around the questions your managers need to answer.",
        },
        {
          title: "Integrations and APIs",
          text: "Accounting, payment, and other business-system connections subject to technical feasibility. We define responsibilities and provider requirements before implementation.",
        },
      ],
      fitHeading: "Built around the business, not just the till.",
      fitBody:
        "Restaurants, cafes, retail stores, salons, service businesses, and multi-branch companies have different workflows. We scope the transaction flow, devices, connectivity needs, and data migration with your team. A custom build is useful when those requirements justify it; it is not automatically the best choice for every checkout.",
      faqHeading: "Questions from the counter and the back office.",
      faqs: [
        {
          title: "Can you build a POS specifically for our business?",
          text: "Yes. We map your sales process and the work around it, then agree the screens, rules, permissions, and reports needed. The result is a custom development project, not a subscription to a ready-made ATOI POS.",
        },
        {
          title: "Can the POS work across multiple branches?",
          text: "It can be designed for multiple branches, with shared product data, local permissions, and consolidated reporting. Connectivity and synchronization requirements are agreed during scoping.",
        },
        {
          title: "Can you connect inventory to sales?",
          text: "Yes. We define how completed sales, returns, adjustments, and transfers should update stock. Product variants, units, and other inventory rules are scoped around your operation.",
        },
        {
          title: "Can you integrate with accounting or payment systems?",
          text: "We assess the chosen provider's APIs, access conditions, and approval process first. We can then propose a suitable integration; support for a particular provider is not assumed or guaranteed in advance.",
        },
        {
          title: "Can you migrate data from our current system?",
          text: "We can plan a migration after reviewing the available exports, data quality, and mapping requirements. The scope includes agreeing what moves, checking sample imports, and planning the changeover.",
        },
        {
          title: "Can it work offline or with our existing devices?",
          text: "Offline operation, receipt printers, scanners, and payment terminals need explicit technical planning. We review the exact devices and connectivity scenarios before confirming compatibility or including offline features.",
        },
        {
          title: "Do you build POS systems for businesses outside Bahrain?",
          text: "We can work with businesses outside Bahrain remotely. Local invoicing rules, payment-provider requirements, and operating needs must be identified and agreed as part of the project.",
        },
      ],
      relatedHeading: "Need more than a point of sale?",
      relatedBody:
        "Explore custom software for the wider operation: internal workflows, customer portals, approvals, and connected business systems.",
    },
    ar: {
      name: "تطوير أنظمة نقاط بيع مخصصة",
      title: "تطوير أنظمة نقاط بيع POS مخصصة | ATOI",
      description:
        "تطوّر ATOI أنظمة نقاط بيع مخصصة للمطاعم والمحلات والأنشطة متعددة الفروع، تربط المبيعات بالمخزون والتقارير وصلاحيات الموظفين وفق متطلبات المشروع.",
      heading: "نظام نقاط بيع مصمم لطريقة عمل نشاطك",
      intro:
        "عندما لا يلائم نظام نقاط البيع الجاهز إجراءاتك، قد تحتاج إلى نظام يُبنى على أساسها. نطوّر في ATOI نظام نقاط بيع مخصصًا والعمليات المرتبطة به، ولسنا مزوّدًا لمنتج POS جاهز للاشتراك.",
      principle: "عملية البيع خطوة واحدة. نبني لما يرتبط بها أيضًا.",
      outlineLabel: "مسار مترابط للمبيعات والتشغيل",
      outline: [
        {
          title: "عند نقطة البيع",
          text: "المنتجات والطلبات والعملاء والخطوات التي يتبعها الموظف لإتمام البيع.",
        },
        {
          title: "خلف كل عملية",
          text: "حركة المخزون وصلاحيات الموظفين والإجراءات الخاصة بكل فرع.",
        },
        {
          title: "على مستوى النشاط",
          text: "تقارير وتكاملات متفق عليها تمنح الإدارة رؤية مترابطة للعمل.",
        },
      ],
      problemHeading: "نقطة البيع جزء من التشغيل، وليست شاشة منفصلة.",
      problemIntro:
        "يكون التطوير المخصص مناسبًا عندما تؤثر قيود الحل الجاهز في العمل اليومي. نبدأ بهذه الاحتياجات بدل فرض باقة ثابتة من المزايا.",
      problems: [
        {
          title: "المبيعات والمخزون غير مترابطين",
          text: "نحدد كيف تؤثر المبيعات والمرتجعات والتحويلات في الكميات، ليعمل نظام المبيعات والمخزون ضمن إجراء واحد.",
        },
        {
          title: "اختلاف الإجراءات بين الفروع",
          text: "قواعد مشتركة للنشاط، مع مراعاة المنتجات والصلاحيات والإجراءات التي يحتاجها كل فرع.",
        },
        {
          title: "خطوات يدوية لتجاوز قيود النظام",
          text: "تصميم الطلبات والصلاحيات ومهام الورديات بما يتوافق مع طريقة فريقك في خدمة العملاء.",
        },
        {
          title: "تقارير تحتاج إلى تجميع يدوي",
          text: "جمع بيانات المبيعات والتشغيل المتفق عليها في تقارير واضحة، بتعريفات موحدة يستخدمها الفريق.",
        },
      ],
      capabilityHeading: "نحدد المزايا بناءً على احتياج نشاطك.",
      capabilityIntro:
        "هذه إمكانات يمكن تطويرها ضمن المشروع، وليست مزايا متاحة في منتج جاهز. يعتمد أي ربط خارجي على توفر الوصول الفني والتوثيق وموافقات المزوّد عند الحاجة.",
      capabilities: [
        {
          title: "المبيعات والعملاء",
          text: "نقاط البيع والفواتير والخصومات والمرتجعات وبيانات العملاء وقواعد الولاء المناسبة لنشاطك.",
        },
        {
          title: "المنتجات والمخزون",
          text: "إدارة المنتجات ومتغيراتها وحركة المخزون والتحويل بين الفروع، وربطها بالمبيعات وفق قواعد العمل المتفق عليها.",
        },
        {
          title: "الفروع والموظفون",
          text: "إدارة مواقع متعددة وأدوار الموظفين وصلاحياتهم وورديات العمل، مع تقارير لكل فرع أو تقارير موحدة.",
        },
        {
          title: "تشغيل المطاعم والمقاهي",
          text: "إجراءات الطاولات والطلبات وشاشات المطبخ وربط الطلبات الإلكترونية، بحسب نطاق نظام نقاط البيع المطلوب للمطعم أو المقهى.",
        },
        {
          title: "التقارير ولوحات المتابعة",
          text: "عرض المبيعات والمرتجعات والمخزون وبيانات التشغيل، بما يساعد الإدارة على متابعة الأسئلة المهمة لنشاطها.",
        },
        {
          title: "التكاملات وواجهات الربط",
          text: "ربط أنظمة المحاسبة والدفع والأنظمة الأخرى بعد دراسة الجدوى الفنية، وتحديد مسؤوليات الأطراف ومتطلبات المزوّد.",
        },
      ],
      fitHeading: "نظام يناسب النشاط، وليس الكاشير فقط.",
      fitBody:
        "تختلف احتياجات المطاعم والمقاهي والمحلات والصالونات والأنشطة الخدمية والشركات متعددة الفروع. نراجع معك إجراءات البيع والأجهزة والاتصال ونقل البيانات. التطوير المخصص خيار عندما تبرره هذه الاحتياجات، وليس ضرورة لكل نشاط.",
      faqHeading: "أسئلة من نقطة البيع إلى الإدارة.",
      faqs: [
        {
          title: "هل يمكن برمجة نظام POS خاص بنشاطنا؟",
          text: "نعم. نفهم خطوات البيع والعمليات المرتبطة بها، ثم نتفق على الشاشات والقواعد والصلاحيات والتقارير. الخدمة مشروع تطوير مخصص، وليست اشتراكًا في نظام جاهز من ATOI.",
        },
        {
          title: "هل يمكن تشغيل نظام نقاط البيع في عدة فروع؟",
          text: "يمكن تصميمه ببيانات منتجات مشتركة وصلاحيات خاصة بكل فرع وتقارير موحدة للإدارة. نحدد متطلبات الاتصال ومزامنة البيانات خلال دراسة المشروع.",
        },
        {
          title: "هل يمكن ربط المبيعات بالمخزون؟",
          text: "نعم. نتفق على طريقة تحديث الكميات بعد البيع والمرتجعات والتسويات والتحويلات، مع تحديد متغيرات المنتجات ووحداتها وقواعد المخزون المناسبة.",
        },
        {
          title: "هل يمكن الربط مع برامج المحاسبة أو مزوّدي الدفع؟",
          text: "نراجع واجهات المزوّد المختار وشروط الوصول وإجراءات الموافقة أولًا، ثم نقترح آلية الربط المناسبة. لا نفترض دعم أي مزوّد أو نضمنه قبل هذه المراجعة.",
        },
        {
          title: "هل يمكن نقل البيانات من نظامنا الحالي؟",
          text: "نخطط لذلك بعد مراجعة ملفات التصدير وجودة البيانات وتوافق الحقول. نحدد ما سيُنقل، ونختبر عينات من الاستيراد، ونتفق على خطة الانتقال.",
        },
        {
          title: "هل يعمل النظام دون إنترنت أو مع أجهزتنا الحالية؟",
          text: "العمل دون اتصال والطابعات والماسحات وأجهزة الدفع تحتاج إلى تخطيط فني واضح. نراجع الأجهزة المحددة وحالات الاتصال قبل تأكيد التوافق أو إدراج العمل دون إنترنت ضمن النطاق.",
        },
        {
          title: "هل تطوّرون أنظمة نقاط بيع لأنشطة خارج البحرين؟",
          text: "يمكننا العمل عن بُعد مع أنشطة خارج البحرين. نحدد متطلبات الفوترة المحلية وشروط مزوّدي الدفع واحتياجات التشغيل ونتفق عليها ضمن نطاق المشروع.",
        },
      ],
      relatedHeading: "هل تحتاج إلى نظام يتجاوز نقطة البيع؟",
      relatedBody:
        "تعرّف على تطوير البرمجيات المخصصة لإدارة الإجراءات الداخلية وبوابات العملاء والموافقات وربط أنظمة الشركة.",
    },
  },
};

export const SERVICE_CONTENT: Record<
  ServiceKey,
  Record<Locale, ServiceCopy>
> = {
  ...CORE_SERVICE_CONTENT,
  ...ADDITIONAL_SERVICE_CONTENT,
};
