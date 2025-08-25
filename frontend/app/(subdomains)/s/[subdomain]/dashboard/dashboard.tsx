import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { getServerUser, User } from '@/services/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage( {tenant_id}: {tenant_id: number}) {
  const user = await getServerUser();
  console.log("DashboardPage: user", user);
  if(user?.tenant_id !== tenant_id) {
    console.log("DashboardPage: User tenant_id does not match tenant_id, redirecting to /auth");
    redirect('/auth');
  }
  
    return (
      <DashboardLayout user={user as User}>
        <DashboardContent user={user as User} />
      </DashboardLayout>
    );
}
