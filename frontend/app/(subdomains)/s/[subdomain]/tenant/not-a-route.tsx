"use client";
import DashboardLayout from '@/components/DashboardLayout';
import TenantManagement from '@/components/TenantManagement';
import { getServerUser, User } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TenantPage() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getServerUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('Dashboard: No user found, redirecting to /auth');
    router.push('/auth');
  }

    return (
      <DashboardLayout user={user as User}>
        <TenantManagement />
      </DashboardLayout>
    );
}
