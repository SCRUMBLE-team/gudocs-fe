import { useParams } from "react-router-dom";
import Header from "../../layouts/Header";

export default function SubscriptionDetailPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f9fc" }}>
      <Header />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <p style={{ color: "#64748d", fontSize: "14px" }}>
          구독 상세 (ID: {subscriptionId})
        </p>
      </main>
    </div>
  );
}
