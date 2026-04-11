import { useEffect } from "react";

import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const { checkAuth, ...state } = useAuthStore();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return state;
};
