import type { Locale } from "./locale";
import type { ProjectStatusValue } from "@/lib/validation/shared";
import type { BusinessType } from "@/lib/validation/shared";

export const STATUS_LABELS: Record<Locale, Record<ProjectStatusValue, string>> = {
  en: {
    PENDING_TEAM_APPROVAL: "Pending Team Approval",
    DEVELOPMENT: "Development",
    TESTING: "Testing",
    DONE: "Done",
  },
  ar: {
    PENDING_TEAM_APPROVAL: "بانتظار موافقة الفريق",
    DEVELOPMENT: "قيد التطوير",
    TESTING: "قيد الاختبار",
    DONE: "مكتمل",
  },
};

export function statusLabel(locale: Locale, status: ProjectStatusValue): string {
  return STATUS_LABELS[locale][status];
}

export const BUSINESS_TYPE_LABELS: Record<Locale, Record<BusinessType, string>> = {
  en: {
    restaurant_cafe: "Restaurant / Cafe",
    retail: "Retail",
    salon_beauty: "Salon / Beauty",
    healthcare: "Healthcare",
    professional_services: "Professional Services",
    construction: "Construction",
    ecommerce: "E-commerce",
    startup: "Startup",
    other: "Other",
  },
  ar: {
    restaurant_cafe: "مطعم / مقهى",
    retail: "تجارة تجزئة",
    salon_beauty: "صالون / تجميل",
    healthcare: "رعاية صحية",
    professional_services: "خدمات مهنية",
    construction: "مقاولات وبناء",
    ecommerce: "متجر إلكتروني",
    startup: "شركة ناشئة",
    other: "أخرى",
  },
};

export function businessTypeLabel(locale: Locale, type: BusinessType): string {
  return BUSINESS_TYPE_LABELS[locale][type];
}
