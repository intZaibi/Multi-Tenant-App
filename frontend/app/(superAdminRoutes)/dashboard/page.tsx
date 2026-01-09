"use client"
import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { User } from '@/services/auth';
import { getUser } from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
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
    <DashboardLayout user={user as User}>
      <DashboardContent user={user as User} />
    </DashboardLayout>
  );
}
