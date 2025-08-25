import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { getServerUser, User } from '@/services/auth';

export default async function DashboardPage() {
  const user = await getServerUser();
    return (
      <DashboardLayout user={user as User}>
        <DashboardContent user={user as User} />
      </DashboardLayout>
    );
}
