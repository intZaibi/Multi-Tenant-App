'use server';
import DashboardPage from './dashboard'
import { notFound } from 'next/navigation';

export async function getTenants() {
  const fs = await import('fs');
  const path = await import('path');
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  return tenants;
}

export default async function Dashboard({ params  }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const tenants = await getTenants();
  const tenant = tenants?.some((tenant: any) => tenant.subdomain === subdomain) || false;
  if(!tenant) {
    notFound();
  }

  return (
    <DashboardPage/>
  );
}
