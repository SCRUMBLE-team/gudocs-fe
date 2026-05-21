import { Skeleton } from "@wanteddev/wds";

export default function AnalyticsSkeleton() {
  return (
    <div>
      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--semantic-background-normal-normal)",
              borderRadius: "16px",
              padding: "20px 22px",
              border: "1px solid var(--semantic-line-solid-normal)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Skeleton width="60%" height={12} />
            <Skeleton width="80%" height={28} />
            <Skeleton width="50%" height={12} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--semantic-background-normal-normal)",
            borderRadius: "16px",
            padding: "22px 24px",
            border: "1px solid var(--semantic-line-solid-normal)",
          }}
        >
          <Skeleton width="40%" height={18} style={{ marginBottom: "6px" }} />
          <Skeleton width="30%" height={12} style={{ marginBottom: "20px" }} />
          <Skeleton width="100%" height={220} style={{ borderRadius: "8px" }} />
        </div>

        <div
          style={{
            backgroundColor: "var(--semantic-background-normal-normal)",
            borderRadius: "16px",
            padding: "22px 24px",
            border: "1px solid var(--semantic-line-solid-normal)",
          }}
        >
          <Skeleton width="50%" height={18} style={{ marginBottom: "6px" }} />
          <Skeleton width="30%" height={12} style={{ marginBottom: "16px" }} />
          <Skeleton
            width="160px"
            height={160}
            style={{ borderRadius: "50%", margin: "0 auto 16px" }}
          />
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={14}
              style={{ marginBottom: "10px" }}
            />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div
        style={{
          backgroundColor: "var(--semantic-background-normal-normal)",
          borderRadius: "16px",
          padding: "22px 24px",
          border: "1px solid var(--semantic-line-solid-normal)",
        }}
      >
        <Skeleton width="30%" height={18} style={{ marginBottom: "6px" }} />
        <Skeleton width="20%" height={12} style={{ marginBottom: "20px" }} />
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={48}
            style={{ marginBottom: "4px", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}
