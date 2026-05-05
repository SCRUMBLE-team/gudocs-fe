import { Typography } from "@wanteddev/wds";
import Header from "../../layouts/Header";

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--semantic-background-normal-alternative)",
      }}
    >
      <Header />
      <div style={{ padding: "32px 24px" }}>
        <Typography variant="title2" weight="bold">
          대시보드
        </Typography>
      </div>
    </div>
  );
}
