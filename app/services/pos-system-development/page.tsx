import { ServicePage, serviceMetadata } from "@/components/public/ServicePage";

export function generateMetadata() {
  return serviceMetadata("pos");
}

export default function PosSystemPage() {
  return <ServicePage service="pos" />;
}
