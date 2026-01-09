"use client"
import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { User } from '@/services/auth';
import { getUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


export default function DashboardPage( {tenant_id}: {tenant_id: number}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const user = await getUser();
      console.log("DashboardPage: user", user);
      if(user?.tenant_id !== tenant_id) {
        toast.error("You are not registered for this tenant! Please create an account first.");
        console.log("DashboardPage: User tenant_id does not match tenant_id, redirecting to /auth");
        router.push('/auth');
      }
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
  
    return (
      <DashboardLayout user={user as User}>
        <DashboardContent user={user as User} />
      </DashboardLayout>
    );
}
