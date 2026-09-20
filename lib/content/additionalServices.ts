import type { Locale } from "@/lib/i18n/locale";
import type { ServiceCopy } from "./services";

export const ADDITIONAL_SERVICE_CONTENT: Record<
  "business" | "inventory",
  Record<Locale, ServiceCopy>
> = {
  business: {
    en: {
      name: "Business management systems",
      title: "Business Management System Development | ATOI",
      description:
        "ATOI develops custom business management systems that connect operations, staff, customers, workflows, reporting, documents, and branches in one platform.",
      heading: "One System to Run Your Business",
      intro:
        "When projects, approvals, customer records, and daily tasks live in separate tools, managing the business becomes a job of its own. ATOI builds custom business management software around the way your company operates.",
      principle:
        "Bring the right work together. Keep each team focused on what it needs.",
      outlineLabel: "A connected operating system for the company",
      outline: [
        {
          title: "Map the operation",
          text: "Understand the people, records, decisions, and handovers behind the work.",
        },
        {
          title: "Define access and responsibility",
          text: "Give each role the information, actions, and approvals relevant to it.",
        },
        {
          title: "Build one shared view",
          text: "Connect day-to-day execution with the dashboards and reports management needs.",
        },
      ],
      problemHeading: "The business is connected. Its tools should be too.",
      problemIntro:
        "A company management system is useful when separate processes need to share information and responsibility. The scope should follow the operation, rather than forcing every department into an identical workflow.",
      problems: [
        {
          title: "Work is split across tools",
          text: "Tasks, documents, customer updates, and approvals are stored in different places, making it difficult to see the complete history of the work.",
        },
        {
          title: "Approvals depend on follow-ups",
          text: "Requests wait in messages or inboxes. A defined workflow can route them, record decisions, and show what is still pending.",
        },
        {
          title: "Management lacks a current view",
          text: "Build dashboards from agreed operational data so managers can understand workload, progress, and exceptions without assembling reports manually.",
        },
        {
          title: "Branches and teams work in isolation",
          text: "Share the records that should be common while keeping branch, department, and role boundaries clear.",
        },
      ],
      capabilityHeading: "Build the management system your operation requires.",
      capabilityIntro:
        "The modules below are possible capabilities, not a fixed package. We define the first release around the workflows, users, data, and integrations that matter to your business.",
      capabilities: [
        {
          title: "Staff, roles, and permissions",
          text: "User accounts, teams, responsibilities, and access controls designed around the structure of your company.",
        },
        {
          title: "Customers and sales workflows",
          text: "Customer records, enquiries, opportunities, sales steps, and service history where they belong in the agreed scope.",
        },
        {
          title: "Tasks, projects, and approvals",
          text: "Assign work, track deadlines and status, route approvals, and keep decisions attached to the relevant record.",
        },
        {
          title: "Documents and operational records",
          text: "Store or reference the files, forms, notes, and records teams need, with access and retention requirements agreed during planning.",
        },
        {
          title: "Branches, dashboards, and reporting",
          text: "Branch-specific or consolidated views, filters, and reports based on the questions managers need the system to answer.",
        },
        {
          title: "Integrations and automation",
          text: "Connect suitable systems through available APIs or data exchanges after reviewing provider access, technical limits, and responsibilities.",
        },
      ],
      fitHeading:
        "Start with the part of the business that needs clarity most.",
      fitBody:
        "A business management platform does not need every possible module on day one. We can begin with a defined operational bottleneck, establish reliable records and permissions, then add connected workflows as the business is ready for them.",
      faqHeading: "Planning a company management system.",
      faqs: [
        {
          title: "Can you build one system for several departments?",
          text: "Yes. We define what data departments share, what stays private, and how work moves between them. Each role can receive a focused view instead of seeing every part of the platform.",
        },
        {
          title: "Does every listed capability have to be included?",
          text: "No. The system is scoped around your requirements. We prioritize the workflows and reporting needed for the first release and leave unrelated modules out.",
        },
        {
          title:
            "Can the system support branches and different permission levels?",
          text: "It can be designed for branch-specific records, shared company data, and role-based permissions. We agree these boundaries and reporting rules before development.",
        },
        {
          title: "Can it integrate with software we already use?",
          text: "Potentially. We review the software's APIs, exports, access conditions, and data ownership before recommending or committing to an integration.",
        },
        {
          title: "Can we replace spreadsheets gradually?",
          text: "Yes. A staged rollout can move one process at a time, with data checks and clear ownership. This can reduce disruption and give teams time to validate the new workflow.",
        },
        {
          title: "How do you decide the first release?",
          text: "We look for a useful end-to-end workflow that removes a real bottleneck. Its users, records, rules, exceptions, and integrations become the basis of the first project scope.",
        },
      ],
      relatedHeading: "Connect the wider operation.",
      relatedBody:
        "Explore custom software for unique workflows and inventory systems for products, warehouses, and stock movement.",
    },
    ar: {
      name: "أنظمة إدارة الشركات",
      title: "تطوير أنظمة إدارة الشركات | ATOI",
      description:
        "تطوّر ATOI أنظمة مخصصة لإدارة الشركات تجمع العمليات والموظفين والعملاء والمهام والموافقات والتقارير والفروع ضمن منصة واحدة.",
      heading: "نظام واحد لإدارة أعمال شركتك",
      intro:
        "عندما تتوزع المشاريع والموافقات وبيانات العملاء والمهام اليومية بين أدوات متعددة، تصبح متابعة العمل عبئًا إضافيًا. تطوّر ATOI نظام إدارة شركة مخصصًا وفق طريقة تشغيل شركتك وهيكل فرقها.",
      principle:
        "نجمع الإجراءات التي تحتاج إلى الترابط، ونمنح كل فريق ما يحتاجه بوضوح.",
      outlineLabel: "منصة تشغيل مترابطة للشركة",
      outline: [
        {
          title: "نفهم دورة العمل",
          text: "نراجع الموظفين والسجلات والقرارات وتسليم المهام بين الأقسام.",
        },
        {
          title: "نحدد الصلاحيات والمسؤوليات",
          text: "يصل كل دور إلى المعلومات والإجراءات والموافقات المرتبطة بعمله.",
        },
        {
          title: "نبني رؤية موحدة",
          text: "نربط التنفيذ اليومي بلوحات المتابعة والتقارير التي تحتاجها الإدارة.",
        },
      ],
      problemHeading: "أعمال الشركة مترابطة، ويجب أن تكون أنظمتها كذلك.",
      problemIntro:
        "يفيد نظام إدارة الأعمال عندما تحتاج إجراءات متعددة إلى مشاركة البيانات والمسؤوليات. نطوّر النظام بما يناسب كل قسم، دون فرض مسار واحد على أعمال مختلفة.",
      problems: [
        {
          title: "العمل موزع بين أدوات كثيرة",
          text: "توجد المهام والمستندات وتحديثات العملاء والموافقات في أماكن منفصلة، فلا يظهر السجل الكامل للعمل بسهولة.",
        },
        {
          title: "الموافقات تعتمد على المتابعة اليدوية",
          text: "تتأخر الطلبات داخل الرسائل أو البريد. يمكن لمسار واضح توجيه الطلب وتسجيل القرار وإظهار ما ينتظر الإجراء.",
        },
        {
          title: "لا توجد رؤية محدثة للإدارة",
          text: "لوحات مبنية على بيانات تشغيلية متفق عليها توضّح ضغط العمل والتقدم والاستثناءات دون تجميع التقارير يدويًا.",
        },
        {
          title: "الفروع والأقسام تعمل بصورة منفصلة",
          text: "نشارك البيانات التي يجب أن تكون موحدة، مع الحفاظ على حدود واضحة بين الفروع والأقسام والصلاحيات.",
        },
      ],
      capabilityHeading: "نطوّر نظام إدارة أعمال حسب متطلبات شركتك.",
      capabilityIntro:
        "العناصر التالية إمكانات يمكن تطويرها وليست باقة ثابتة. نحدد الإصدار الأول بناءً على الإجراءات والمستخدمين والبيانات والتكاملات التي يحتاجها العمل فعلًا.",
      capabilities: [
        {
          title: "الموظفون والأدوار والصلاحيات",
          text: "حسابات المستخدمين والفرق والمسؤوليات ومستويات الوصول وفق الهيكل الإداري للشركة.",
        },
        {
          title: "العملاء وإجراءات المبيعات",
          text: "بيانات العملاء والاستفسارات والفرص وخطوات البيع وسجل الخدمة عندما تكون ضمن نطاق المشروع.",
        },
        {
          title: "المهام والمشاريع والموافقات",
          text: "توزيع العمل ومتابعة المواعيد والحالة وتوجيه الموافقات وربط القرارات بالسجل المعني.",
        },
        {
          title: "المستندات والسجلات التشغيلية",
          text: "حفظ الملفات والنماذج والملاحظات والسجلات أو الإشارة إليها، وفق صلاحيات وسياسات حفظ نتفق عليها أثناء التخطيط.",
        },
        {
          title: "الفروع ولوحات المتابعة والتقارير",
          text: "عروض خاصة بكل فرع أو موحدة للشركة، مع فلاتر وتقارير تجيب عن الأسئلة المهمة للإدارة.",
        },
        {
          title: "الربط والأتمتة",
          text: "ربط الأنظمة المناسبة عبر واجهاتها أو تبادل البيانات بعد مراجعة الوصول والقيود الفنية ومسؤوليات الأطراف.",
        },
      ],
      fitHeading: "ابدأ بالجزء الذي يحتاج إلى وضوح أكبر.",
      fitBody:
        "لا يحتاج برنامج إدارة الشركة إلى جميع الوحدات منذ اليوم الأول. يمكن أن نبدأ بإجراء متكامل يعالج مشكلة واضحة، ونثبت البيانات والصلاحيات، ثم نضيف إجراءات مترابطة عندما تصبح الشركة جاهزة لها.",
      faqHeading: "أسئلة عند التخطيط لنظام إدارة الشركة.",
      faqs: [
        {
          title: "هل يمكن بناء نظام واحد لعدة أقسام؟",
          text: "نعم. نحدد البيانات المشتركة والبيانات الخاصة بكل قسم وطريقة انتقال العمل بينها. ويمكن أن يحصل كل دور على واجهة تناسب مهامه بدل الاطلاع على جميع أجزاء المنصة.",
        },
        {
          title: "هل يجب تنفيذ جميع الإمكانات المذكورة؟",
          text: "لا. نحدد النظام حسب احتياج شركتك، ونركز في الإصدار الأول على الإجراءات والتقارير ذات الأولوية دون إضافة وحدات لا تخدم الهدف.",
        },
        {
          title: "هل يدعم النظام عدة فروع وصلاحيات مختلفة؟",
          text: "يمكن تصميمه بسجلات خاصة بكل فرع وبيانات مشتركة للشركة وصلاحيات حسب الدور. نتفق على هذه الحدود وقواعد التقارير قبل التطوير.",
        },
        {
          title: "هل يمكن ربطه بالبرامج التي نستخدمها؟",
          text: "قد يكون ذلك ممكنًا. نراجع واجهات البرنامج وملفات التصدير وشروط الوصول وملكية البيانات قبل اقتراح الربط أو الالتزام بتنفيذه.",
        },
        {
          title: "هل يمكن استبدال ملفات إكسل تدريجيًا؟",
          text: "نعم. يمكن نقل إجراء واحد في كل مرحلة، مع تدقيق البيانات وتحديد مسؤوليتها. يساعد ذلك على تقليل أثر التغيير ومنح الفريق وقتًا لمراجعة المسار الجديد.",
        },
        {
          title: "كيف تحددون الإصدار الأول؟",
          text: "نبحث عن إجراء متكامل يزيل عائقًا حقيقيًا. يصبح مستخدموه وسجلاته وقواعده واستثناءاته وتكاملاته أساس نطاق المشروع الأول.",
        },
      ],
      relatedHeading: "اربط بقية عمليات الشركة.",
      relatedBody:
        "تعرّف على البرمجيات المخصصة للإجراءات الفريدة، وأنظمة المخزون لإدارة المنتجات والمستودعات وحركة الكميات.",
    },
  },
  inventory: {
    en: {
      name: "Inventory management systems",
      title: "Custom Inventory Management System Development | ATOI",
      description:
        "ATOI develops custom inventory and warehouse management systems for stock, products, suppliers, purchasing, transfers, reporting, and business integrations.",
      heading: "Inventory Software Built Around Your Operations",
      intro:
        "Stock moves through purchasing, warehouses, branches, sales, returns, and adjustments. ATOI builds custom inventory software that follows those movements and the rules your team uses to manage them.",
      principle:
        "Know what moved, where it moved, and why the quantity changed.",
      outlineLabel: "A reliable flow of inventory information",
      outline: [
        {
          title: "Define what you track",
          text: "Products, variants, units, locations, and the records that establish quantity.",
        },
        {
          title: "Map every movement",
          text: "Purchases, receipts, transfers, sales, returns, adjustments, and other agreed events.",
        },
        {
          title: "Turn movement into visibility",
          text: "Alerts, permissions, audit history, and reports built on consistent stock rules.",
        },
      ],
      problemHeading:
        "Stock accuracy depends on the process behind the number.",
      problemIntro:
        "An inventory management system should record why quantities change and who is responsible. We define those rules with your team before deciding which screens and automations to build.",
      problems: [
        {
          title: "Different files show different stock",
          text: "Centralize the agreed inventory records so teams are not reconciling separate spreadsheets and branch lists whenever they need an answer.",
        },
        {
          title: "Transfers disappear between locations",
          text: "Track dispatch, receipt, and exceptions so a movement has a clear status instead of reducing one location before another confirms it.",
        },
        {
          title: "Purchasing starts too late",
          text: "Use reorder information and low-stock alerts based on the thresholds and responsibilities defined for the operation.",
        },
        {
          title: "Adjustments have no history",
          text: "Record the reason, user, time, and supporting notes required for corrections, returns, and other quantity changes.",
        },
      ],
      capabilityHeading: "Build around the way inventory actually moves.",
      capabilityIntro:
        "These capabilities can be combined based on project scope. Product structure, costing, devices, offline needs, and integrations require explicit discovery before they are included.",
      capabilities: [
        {
          title: "Products, variants, and stock levels",
          text: "Define product records, variants, units, and available quantities in the way your operation needs to identify and count them.",
        },
        {
          title: "Warehouses, branches, and transfers",
          text: "Track inventory by location and manage transfer requests, dispatch, receipt, and discrepancies through an agreed workflow.",
        },
        {
          title: "Suppliers and purchase orders",
          text: "Maintain supplier records and purchasing steps from request or order through receipt, subject to the approvals required by your team.",
        },
        {
          title: "Alerts, permissions, and audit history",
          text: "Notify responsible users about defined stock conditions, control sensitive actions, and preserve a history of important changes.",
        },
        {
          title: "Barcode and sales workflows",
          text: "Design scanning and sales-related stock updates around selected devices and the transaction rules confirmed during technical planning.",
        },
        {
          title: "Reports, APIs, and integrations",
          text: "Create operational reports and connect suitable sales, accounting, or other systems where access and technical feasibility are confirmed.",
        },
      ],
      fitHeading: "One stock figure needs one agreed definition.",
      fitBody:
        "Available, reserved, in transit, damaged, and physically counted stock may mean different things in your operation. We define those states and the events that change them so dashboards and reports reflect the same rules used by the team.",
      faqHeading: "Questions about inventory system development.",
      faqs: [
        {
          title: "Can you build inventory software for our workflow?",
          text: "Yes. We map how products enter, move through, and leave the business, then define the records, permissions, and exceptions the system needs to support.",
        },
        {
          title: "Can it support several warehouses and branches?",
          text: "It can be designed for multiple locations with separate balances, transfer workflows, and consolidated visibility. The exact hierarchy and access rules are agreed during scoping.",
        },
        {
          title: "Can inventory update from sales?",
          text: "Yes, when sales are handled inside the system or through a feasible integration. We define when stock changes, how returns behave, and what happens when transactions are corrected.",
        },
        {
          title: "Can the system use barcodes?",
          text: "Barcode workflows can be included after confirming label rules, scanner or device requirements, product identifiers, and the actions scanning should perform.",
        },
        {
          title: "Can you import our current stock and product data?",
          text: "We can plan an import after reviewing the available files, identifiers, duplicates, units, and opening balances. Sample migrations help identify issues before changeover.",
        },
        {
          title: "Can it connect to accounting, ecommerce, or other systems?",
          text: "We assess each provider's APIs, exports, permissions, and limits. An integration is included only after its technical approach and responsibilities are agreed.",
        },
      ],
      relatedHeading: "Connect inventory to the business around it.",
      relatedBody:
        "Explore business management systems for wider operations and custom POS development for checkout and sales workflows.",
    },
    ar: {
      name: "أنظمة إدارة المخزون والمستودعات",
      title: "تطوير أنظمة إدارة المخزون والمستودعات | ATOI",
      description:
        "تطوّر ATOI أنظمة مخصصة لإدارة المخزون والمستودعات تشمل المنتجات والموردين والمشتريات والتحويلات والتنبيهات والتقارير والتكاملات المطلوبة.",
      heading: "نظام مخزون مصمم لطريقة عمل شركتك",
      intro:
        "تتحرك البضاعة بين المشتريات والمستودعات والفروع والمبيعات والمرتجعات والتسويات. تطوّر ATOI برنامج إدارة مخزون مخصصًا يتابع هذه الحركة وفق القواعد التي يعتمدها فريقك.",
      principle: "اعرف ما الذي تحرك، وإلى أين، ولماذا تغيرت الكمية.",
      outlineLabel: "مسار موثوق لمعلومات المخزون",
      outline: [
        {
          title: "نحدد ما تتم متابعته",
          text: "المنتجات والمتغيرات والوحدات والمواقع والسجلات التي تحدد الكمية.",
        },
        {
          title: "نرسم حركة المخزون",
          text: "المشتريات والاستلام والتحويلات والمبيعات والمرتجعات والتسويات وغيرها من الحركات المتفق عليها.",
        },
        {
          title: "نحوّل الحركة إلى رؤية واضحة",
          text: "تنبيهات وصلاحيات وسجل تغييرات وتقارير مبنية على قواعد موحدة.",
        },
      ],
      problemHeading: "دقة المخزون تبدأ من الإجراء الذي غيّر الكمية.",
      problemIntro:
        "يجب أن يوضح نظام إدارة المخزون سبب تغير الكمية والمسؤول عن الإجراء. نحدد هذه القواعد مع فريقك قبل اختيار الشاشات والأتمتة التي يحتاجها النظام.",
      problems: [
        {
          title: "كل ملف يعرض كمية مختلفة",
          text: "نجمع سجلات المخزون المتفق عليها حتى لا يضطر الفريق إلى مطابقة جداول وقوائم منفصلة كلما احتاج إلى معلومة.",
        },
        {
          title: "التحويلات تضيع بين المواقع",
          text: "متابعة الإرسال والاستلام والفروقات، بحيث تكون لكل حركة حالة واضحة ولا تخصم الكمية قبل تأكيد الطرف الآخر دون ضوابط.",
        },
        {
          title: "الشراء يبدأ بعد فوات الأوان",
          text: "تنبيهات انخفاض المخزون ومعلومات إعادة الطلب وفق الحدود والمسؤوليات التي تحددها الشركة.",
        },
        {
          title: "لا يوجد سجل واضح للتسويات",
          text: "تسجيل السبب والمستخدم والوقت والملاحظات المطلوبة عند التصحيح والمرتجعات وغيرها من التغييرات في الكميات.",
        },
      ],
      capabilityHeading: "نطوّر النظام حول حركة المخزون الفعلية.",
      capabilityIntro:
        "يمكن جمع هذه الإمكانات بحسب نطاق المشروع. تحتاج بنية المنتجات والتكلفة والأجهزة والعمل دون اتصال والتكاملات إلى دراسة واضحة قبل إدراجها.",
      capabilities: [
        {
          title: "المنتجات والمتغيرات ومستويات المخزون",
          text: "تعريف المنتجات ومتغيراتها ووحداتها والكميات المتاحة بالطريقة التي تناسب تعريفها وجردها داخل الشركة.",
        },
        {
          title: "المستودعات والفروع والتحويلات",
          text: "متابعة الكميات حسب الموقع وإدارة طلب التحويل والإرسال والاستلام والفروقات عبر مسار متفق عليه.",
        },
        {
          title: "الموردون وأوامر الشراء",
          text: "سجلات الموردين وإجراءات الشراء من الطلب أو الأمر حتى الاستلام، مع الموافقات التي يحتاجها فريقك.",
        },
        {
          title: "التنبيهات والصلاحيات وسجل التغييرات",
          text: "تنبيه المسؤولين وفق حالات مخزون محددة، والتحكم في الإجراءات الحساسة، وحفظ تاريخ التغييرات المهمة.",
        },
        {
          title: "الباركود وإجراءات المبيعات",
          text: "تصميم المسح وتحديثات المخزون المرتبطة بالمبيعات وفق الأجهزة وقواعد المعاملات التي يتم تأكيدها في التخطيط الفني.",
        },
        {
          title: "التقارير وواجهات الربط والتكاملات",
          text: "تقارير تشغيلية وربط مناسب مع المبيعات أو المحاسبة أو الأنظمة الأخرى عندما يتوفر الوصول وتثبت الجدوى الفنية.",
        },
      ],
      fitHeading: "الكمية الواحدة تحتاج إلى تعريف واحد متفق عليه.",
      fitBody:
        "قد تختلف معاني الكمية المتاحة والمحجوزة والمنقولة والتالفة والمعدودة فعليًا في شركتك. نحدد هذه الحالات والأحداث التي تغيرها حتى تستخدم التقارير القواعد نفسها التي يعمل بها الفريق.",
      faqHeading: "أسئلة حول تطوير نظام إدارة المخزون.",
      faqs: [
        {
          title: "هل يمكن برمجة نظام مخزون حسب إجراءاتنا؟",
          text: "نعم. نرسم طريقة دخول المنتجات وحركتها وخروجها، ثم نحدد السجلات والصلاحيات والاستثناءات التي يجب أن يدعمها النظام.",
        },
        {
          title: "هل يدعم النظام عدة مستودعات وفروع؟",
          text: "يمكن تصميمه بأرصدة منفصلة لكل موقع ومسارات تحويل ورؤية موحدة للإدارة. نحدد تسلسل المواقع وقواعد الوصول الدقيقة أثناء دراسة المشروع.",
        },
        {
          title: "هل تتحدث كميات المخزون من المبيعات؟",
          text: "نعم، عندما تتم المبيعات داخل النظام أو من خلال تكامل ممكن فنيًا. نحدد وقت تحديث الكمية وطريقة معالجة المرتجعات وتصحيح المعاملات.",
        },
        {
          title: "هل يمكن استخدام الباركود؟",
          text: "يمكن إدراج إجراءات الباركود بعد تحديد قواعد الملصقات والأجهزة أو الماسحات ومعرفات المنتجات والعمليات التي يجب أن ينفذها المسح.",
        },
        {
          title: "هل يمكن استيراد بيانات المنتجات والكميات الحالية؟",
          text: "نخطط للاستيراد بعد مراجعة الملفات والمعرفات والتكرار والوحدات والأرصدة الافتتاحية. تساعد العينات التجريبية على اكتشاف المشكلات قبل الانتقال.",
        },
        {
          title: "هل يمكن ربطه بالمحاسبة أو المتجر الإلكتروني أو أنظمة أخرى؟",
          text: "نقيّم واجهات كل مزوّد وملفات التصدير والصلاحيات والقيود. لا يُدرج الربط إلا بعد الاتفاق على طريقته الفنية ومسؤوليات الأطراف.",
        },
      ],
      relatedHeading: "اربط المخزون ببقية أعمال الشركة.",
      relatedBody:
        "تعرّف على أنظمة إدارة الشركات للعمليات الأوسع، وتطوير نقاط البيع المخصصة لإجراءات البيع والتحصيل.",
    },
  },
};
