import DashboardLayout from '@/components/DashboardLayout';
import TenantManagement from '@/components/TenantManagement';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getUser } from '@/services/api';
import { User } from '@/services/auth';

export default function TenantsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const user = await getUser();
      console.log("DashboardPage: user", user);
      setUser(user);
      setLoading(false);
    }
    getUserData();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  } else if (!user) {
    console.log("DashboardPage: User not found, redirecting to /auth");
    toast.error("User not found, redirecting to /auth");
    router.push('/auth');
    return null;
  }

  if(user.role !== 'Super Admin') {
    console.log('Dashboard: User is not Super Admin, redirecting to /auth');
    router.push('/auth');
  }

    return (
      <DashboardLayout user={user}>
        <TenantManagement />
      </DashboardLayout>
    );
}
