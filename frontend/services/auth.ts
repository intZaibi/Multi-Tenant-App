import { getUser, refreshToken as refreshTokenApi } from './api';
import { getCookies, setCookies } from './cookies';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  tenant_id: number;
}


// Server-side authentication function
export async function getServerUser(): Promise<User | null> {
  try {
    const { accessToken, refreshToken } = await getCookies();

    if (!accessToken && !refreshToken) {
      console.log('No tokens found, returning null');
      return null;
    }

    // Try to get user with current access token
    if (accessToken) {
      try {
        const user = await getUser();
        if (user && !('error' in user)) {
          return user as User;
        }
      } catch (error) {
        console.log('Access token invalid, trying refresh token', error);
      }
    }

    // Try to refresh token if access token failed or doesn't exist
    if (refreshToken) {
      try {
        const refreshResult = await refreshTokenApi();

        if (refreshResult && !('error' in refreshResult) && refreshResult.user) {
          // Set new tokens in cookies
          await setCookies(refreshResult.user.accessToken, refreshResult.user.refreshToken);
        
          const user = await getUser();
          if (user && !('error' in user)) {
            console.log('User authenticated with refreshed token');
            return user as User;
          }
        }
        
      } catch (error) {
        console.log('Refresh token failed', error);
        return null;
      }
    }

    console.log('All authentication methods failed, returning null');
    return null;
  } catch (error) {
    console.error('Server authentication error:', error);
    return null;
  }
}