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
        const result = await getUser();

        if (result && !('error' in result)) {
          return result.user as User;

        } else if(result.error.includes('Unauthorized! Token not found!') || result.error.includes('Token expired!')) {
          
          const refreshResult = await refreshTokenApi();
          
          if (refreshResult && !('error' in refreshResult) && refreshResult.user) {

            // Set new tokens in cookies
            await setCookies(refreshResult.user.accessToken, refreshResult.user.refreshToken);
            return refreshResult.user as User;
          }
        }
    }

    return null;
  } catch (error) {
    console.error('Server authentication error:', error);
    return null;
  }
}