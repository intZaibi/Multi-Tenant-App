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
    const {accessToken, refreshToken} = await getCookies();
    if(!accessToken && !refreshToken){
      console.log('No access token or refresh token found');
      return null;
    }
    
    const result = await getUser(accessToken);
    if (result && !('error' in result) && result.user) {
      // setCookies(result.user.accessToken, result.user.refreshToken);
      return result.user as User;
    }
    if(result.error.includes('Token not found!') || result.error.includes('Token expired!')){
      console.log('Token not found or expired, refreshing token');
      const refreshResult = await refreshTokenApi(refreshToken);
      
      if (refreshResult && !('error' in refreshResult) && refreshResult.user) {
        console.log('User authenticated with refreshed token', refreshResult.user);
        setCookies(refreshResult.user.accessToken, refreshResult.user.refreshToken);
        
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
