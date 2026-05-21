import type { ReactNode } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import type { UpcomingNotification } from "../type/dashboard";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
  notifications?: UpcomingNotification[];
}

export default function AppLayout({ children, notifications = [] }: Props) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f6f9fc" }}>
        <Header notifications={notifications} />
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header notifications={notifications} />
        <div style={{ flex: 1, backgroundColor: "#f6f9fc" }}>{children}</div>
      </div>
    </div>
  );
}
