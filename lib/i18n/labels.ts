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
    business_website: "business website",
    restaurant_cafe: "restaurant / café",
    school_system: "school system",
    clinic_medical: "clinic / medical",
    retail_online_store: "retail / online store",
    something_else: "something else",
  },
  ar: {
    business_website: "موقع تجاري",
    restaurant_cafe: "مطعم / مقهى",
    school_system: "نظام مدرسي",
    clinic_medical: "عيادة / طبي",
    retail_online_store: "تجارة تجزئة / متجر إلكتروني",
    something_else: "شيء آخر",
  },
};

export function businessTypeLabel(locale: Locale, type: BusinessType): string {
  return BUSINESS_TYPE_LABELS[locale][type];
}
