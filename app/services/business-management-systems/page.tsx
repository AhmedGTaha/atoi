import { ServicePage, serviceMetadata } from "@/components/public/ServicePage";

export function generateMetadata() {
  return serviceMetadata("business");
}

export default function BusinessManagementSystemsPage() {
  return <ServicePage service="business" />;
}
