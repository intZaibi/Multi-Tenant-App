import DashboardLayout from '@/components/DashboardLayout';
import TenantManagement from '@/components/TenantManagement';
import { getServerUser } from '@/services/auth';
import { redirect } from 'next/navigation';

export default async function TenantsPage() {
  try {
    const user = await getServerUser();

    if (!user) {
      console.log('Tenants: No user found, redirecting to /auth');
      redirect('/auth');
    }

    // Check if user is Super Admin
    if (user.role !== 'Super Admin') {
      console.log('Tenants: User is not Super Admin, redirecting to /auth');
      redirect('/auth');
    }

    return (
      <DashboardLayout user={user}>
        <TenantManagement />
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Tenants page error:', error);
    redirect('/auth');
  }
}
