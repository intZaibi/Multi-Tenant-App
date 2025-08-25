import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { getServerUser, User } from '@/services/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    console.log('Dashboard: No user found, redirecting to /auth');
    redirect('/auth');
  }

  if(user.role !== 'Super Admin') {
    console.log('Dashboard: User is not Super Admin, redirecting to /auth');
    redirect('/auth');
  }

  return (
    <DashboardLayout user={user as User}>
      <DashboardContent user={user as User} />
    </DashboardLayout>
  );
}
