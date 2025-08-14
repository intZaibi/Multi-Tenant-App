import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { getServerUser } from '@/services/auth';
// import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  try {
  const user = await getServerUser();

    if (!user) {
      console.log('Dashboard: No user found, redirecting to /auth');
      // redirect('/auth');
      return <div>No user found</div>;
    }

    return (
      <DashboardLayout user={user}>
        <DashboardContent user={user} />
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Dashboard page error:', error);
    redirect('/auth');
  }
}
