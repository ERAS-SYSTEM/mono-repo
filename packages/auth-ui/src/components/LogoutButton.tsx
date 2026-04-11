import { useAuthStore } from "../store/authStore";

export const LogoutButton = () => {
  const { logout } = useAuthStore();
  return <button onClick={() => void logout()}>Logout</button>;
};
