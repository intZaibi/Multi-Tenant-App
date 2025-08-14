import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (name: string, email: string, password: string, role: string, tenantId: number) => {
  try {
    const response = await api.post("/auth/register", { name, email, password, role, tenantId });
    
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
    
    return response.data;
  } catch (error) {
    console.log("login failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Login failed!" };
    }
    return { error: "Login failed!" };
  }
}

export const refreshToken = async (refreshTokenParam: string) => {
  try {
    const response = await api.get("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshTokenParam}`,
      },
    });
    
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

export const getUser = async (accessToken: string) => {
  try {
    const response = await api.get("/auth/get-user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.log("get user failed!", error);
    if (axios.isAxiosError(error)) {
      console.log("error in get user", error.response?.data?.error);
      return { error: error.response?.data?.error || error.message || "Get user failed!" };
    }
    return { error: "Get user failed!" };
  }
}

export const getTenants = async () => {
  try {
    const response = await api.get("/auth/tenants");
    return response.data;
  } catch (error) {
    console.log("get tenants failed!", error);
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get tenants failed!" };
    }
    return { error: "Get tenants failed!" };
  }
}

export const logout = async () => {
  try {
    await api.get("/auth/logout");

    return { success: "Logout successful!" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Logout failed!" };
    }
    return { error: "Logout failed!" };
  }
}

export const getUserNotifications = async () => {
  try {
    const response = await api.get("/notifications/get-notifications",);
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
  try {
    const response = await api.get("/notifications/get-unread-notifications");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get unread notifications failed!" };
    }
    return { error: "Get unread notifications failed!" };
  }
}

export const getNotificationStats = async () => {
  try {
    const response = await api.get("/notifications/stats/overview");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error || error.message || "Get notification stats failed!" };
    }
    return { error: "Get notification stats failed!" };
  }
}

export const getTenantNotificationStats = async (tenantId: number) => {
  try {
    const response = await api.get(`/notifications/stats/tenant/${tenantId}`);
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
  try {
    const response = await api.post("/notifications/mark-as-read", { notificationId });
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
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
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