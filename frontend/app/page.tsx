import { redirect } from 'next/navigation';
import { getServerUser } from '@/services/auth';

export default async function HomePage() {
  try {
    
    // Check if user is authenticated
    const user = await getServerUser();
    
    // Redirect to dashboard if authenticated, otherwise to auth page
    if (user) {
      console.log('Home: User authenticated, redirecting to /dashboard');
      redirect('/dashboard');
    } else {
      console.log('Home: No user found, redirecting to /auth');
      redirect('/auth');
    }
  } catch (error) {
    console.error('Home page error:', error);
    redirect('/auth');
  }
}
