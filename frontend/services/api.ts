import axios from "axios";
import { deleteCookies, getCookies, setCookies } from "./cookies";
import { insertTenant, deleteTenant as deleteTenantJson } from "./tenantjsonOperations";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         await deleteCookies();
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const register = async (name: string, email: string, password: string, role: string, tenantId: number) => {
  
  try {
    const response = await api.post("/auth/register", { name, email, password, role, tenantId });
    
    // await setCookies(response.data.user.accessToken, response.data.user.refreshToken);
    localStorage.setItem('accessToken', response.data.user.accessToken);
    localStorage.setItem('refreshToken', response.data.user.refreshToken);
    return response.data;
  } catch (error) {
    console.log("register failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Register failed!" };
    }
    return { error: "Register failed!" };
  }
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    localStorage.setItem('accessToken', response.data.user.accessToken);
    localStorage.setItem('refreshToken', response.data.user.refreshToken);
    
    return response.data;
  } catch (error) {
    console.log("login failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Login failed!" };
    }
    return { error: "Login failed!" };
  }
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await api.get("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    localStorage.setItem('accessToken', response.data.user.accessToken);
    localStorage.setItem('refreshToken', response.data.user.refreshToken);
    return response.data;
  } catch (error) {
    console.log("refresh token failed!", error);
    if (axios.isAxiosError(error)) {
      console.log("error in refresh token", error.response?.data?.error);
      return { error: error.response?.data?.error || error.message || "Refresh token failed!" };
    }
    return { error: "Refresh token failed!" };
  }
}

export const getUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return { error: "Token not found!" };
  }
  try {
    const response = await api.get("/auth/get-user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.log("get user failed!", error);
    if (axios.isAxiosError(error)) {
      console.log("error in get user", error.response?.data?.error);
      return { error: error.response?.data?.error || error.message || "Get user failed!" };
    }
    return { error: "Get user failed!" };
  }
}

export const logout = async () => {
  const { accessToken } = await getCookies();
  try {
    await api.get("/auth/logout", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { success: "Logout successful!" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Logout failed!" };
    }
    return { error: "Logout failed!" };
  }
}

export const getUserNotifications = async () => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.get("/notifications/get-notifications", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if(error?.response?.data?.error === "No notifications found") {
        return { notifications: [] };
      }
      return { error: error.response?.data?.error || error.message || "Get notifications failed!" };
    }
    return { error: "Get notifications failed!" };
  }
}

export const getUnreadNotifications = async () => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.get("/notifications/get-unread-notifications", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get unread notifications failed!" };
    }
    return { error: "Get unread notifications failed!" };
  }
}

export const getNotificationStats = async () => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.get("/notifications/stats/overview", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get notification stats failed!" };
    }
    return { error: "Get notification stats failed!" };
  }
}

export const getTenantNotificationStats = async (tenantId: number) => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.get(`/notifications/stats/tenant/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("get tenant notification stats failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get tenant notification stats failed!" };
    }
    return { error: "Get tenant notification stats failed!" };
  }
}

export const markAsRead = async (notificationId: number | null) => {
  const accessToken = localStorage.getItem('accessToken');
    try {
    const response = await api.post("/notifications/mark-as-read", { notificationId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.log("mark as read failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Mark as read failed!" };
    }
    return { error: "Mark as read failed!" };
  }
}

export const deleteNotification = async (notificationId: number) => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.delete(`/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.log("delete notification failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Delete notification failed!" };
    }
    return { error: "Delete notification failed!" };
  }
} 

export const getTenants = async () => {
  try {
    const response = await api.get("/tenant/get-tenants");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get tenants failed!" };
    }
    return { error: "Get tenants failed!" };
  }
}

export const createTenant = async (name: string, subdomain: string) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!name || !subdomain) {
    return { error: "Name and subdomain are required!" };
  }
  try {
    const response = await api.post("/tenant/create-tenant", { name, subdomain }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // add tenant to tenants.json
    insertTenant(response.data.tenant.insertId, name, subdomain);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error from create tenant: ", error);
      return { error: error.response?.data?.error || error.message || "Create tenant failed!" };
    }
    console.log("error from create tenant: ", error);
    return { error: "Create tenant failed!" };
  }
}

export const getTenantById = async (id: number) => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await api.get(`/tenant/get-tenant/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get tenant by id failed!" };
    }
    return { error: "Get tenant by id failed!" };
  }
}

export const deleteTenant = async (id: number) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!id) {
    return { error: "Tenant id is required!" };
  }
  try {
    const response = await api.delete(`/tenant/delete-tenant/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response from delete tenant: ", response);
    deleteTenantJson(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Delete tenant failed!" };
    }
    return { error: "Delete tenant failed!" };
  }
}
