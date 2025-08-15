"use client";
import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import { getServerUser, User } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
  const user = await getServerUser();
      if(user){
        setUser(user);
        setLoading(false);
      }else{
        router.push('/auth');
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
    }

    return (
      <DashboardLayout user={user as User}>
        <DashboardContent user={user as User} />
      </DashboardLayout>
    );
}
