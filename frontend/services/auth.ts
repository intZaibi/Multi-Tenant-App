import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser, refreshToken } from './api';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  tenant_id: number;
}


async function clearAuthCookies() {
  const store = await cookies();
  store.set('accessToken', '', { maxAge: 0, path: '/' });
  store.set('refreshToken', '', { maxAge: 0, path: '/' });
}

// Server-side authentication function
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshTokenCookie = cookieStore.get('refreshToken')?.value;
    console.log('accessToken: ', accessToken);
    console.log('refreshTokenCookie: ', refreshTokenCookie);

    if (!accessToken && !refreshTokenCookie) {
      console.log('No tokens found, returning null');
      return null;
    }

    // Try to get user with current access token
    if (accessToken) {
      try {
        const user = await getUser(accessToken);
        if (user && !('error' in user)) {
          return user as User;
        }
      } catch (error) {
        console.log('Access token invalid, trying refresh token', error);
        // Don't throw here, try refresh token instead
      }
    }

    // Try to refresh token if access token failed or doesn't exist
    if (refreshTokenCookie) {
      try {
        const refreshResult = await refreshToken(refreshTokenCookie);

        if (refreshResult && !('error' in refreshResult) && refreshResult.user) {
          // Set new tokens in cookies
          cookieStore.set('accessToken', refreshResult.user.accessToken);
          cookieStore.set('refreshToken', refreshResult.user.refreshToken);
        
          const user = await getUser(refreshResult.user.accessToken);
          if (user && !('error' in user)) {
            console.log('User authenticated with refreshed token');
            return user as User;
          }
        }
        
      } catch (error) {
        console.log('Refresh token failed', error);
        // Clear invalid tokens
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
        return null;
      }
    }

    // If we get here, both tokens are invalid
    // Clear any remaining invalid tokens
    if (accessToken) cookieStore.delete('accessToken');
    if (refreshTokenCookie) cookieStore.delete('refreshToken');
    
    console.log('All authentication methods failed, returning null');
    return null;
  } catch (error) {
    console.error('Server authentication error:', error);
    // Clear any tokens on error
    await clearAuthCookies();
    return null;
  }
}

// Server-side protected route wrapper
export async function requireAuth(): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    console.log('No user found, redirecting to /auth');
    redirect('/auth');
  }
  
  return user;
}
