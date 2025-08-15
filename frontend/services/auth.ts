import { getUser, refreshToken as refreshTokenApi } from './api';

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
    const result = await getUser();
    if (result && !('error' in result) && result.user) {
      return result.user as User;
    }
    if(result.error.includes('Token not found!') || result.error.includes('Token expired!')){
      
      const refreshResult = await refreshTokenApi();
      
      if (refreshResult && !('error' in refreshResult) && refreshResult.user) {
        console.log('User authenticated with refreshed token', refreshResult.user);
        return refreshResult.user as User;
      }
    }

    console.log('Refresh token failed');
    return null;

  } catch (error) {
    console.error('Server authentication error:', error);
    return null;
  }
}
