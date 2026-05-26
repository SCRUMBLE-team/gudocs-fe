import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { getUser } from "../api/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
