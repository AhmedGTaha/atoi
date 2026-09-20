import { ServicePage, serviceMetadata } from "@/components/public/ServicePage";

export function generateMetadata() {
  return serviceMetadata("custom");
}

export default function CustomSoftwarePage() {
  return <ServicePage service="custom" />;
}
