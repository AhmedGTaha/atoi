import { ServicePage, serviceMetadata } from "@/components/public/ServicePage";

export function generateMetadata() {
  return serviceMetadata("inventory");
}

export default function InventoryManagementSystemsPage() {
  return <ServicePage service="inventory" />;
}
