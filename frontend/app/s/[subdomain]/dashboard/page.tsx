
import DashboardPage from './Dashboard'
import { notFound } from 'next/navigation';
import { getTenants } from '@/services/tenantjsonOperations';


export default async function Dashboard({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;

  async function getTenant(subdomain: string) {
    if(!subdomain) return false;
  try {
      const tenants = await getTenants();
      return tenants?.some((tenant: any) => tenant.subdomain === subdomain) || false;
    } catch (error) {
      console.error("Error getting tenant: ", error);
      return false;
    }
  }

  const tenant = await getTenant(subdomain);
  if(!tenant) {
    notFound();
    }

    return (
    <DashboardPage/>
    );
}
