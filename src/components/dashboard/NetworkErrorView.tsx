import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { Button, Typography } from "@wanteddev/wds";
import errorAnimation from "../../lottie/error.json";

interface NetworkErrorViewProps {
  onRetry: () => void;
}

export default function NetworkErrorView({ onRetry }: NetworkErrorViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: errorAnimation,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "12px",
        padding: "40px 24px",
      }}
    >
      <div ref={containerRef} style={{ width: 260, height: 260 }} />
      <Typography
        variant="title3"
        weight="bold"
        color="semantic.label.normal"
        style={{ display: "block" }}
      >
        네트워크 오류가 발생했습니다
      </Typography>
      <Typography
        variant="body2"
        color="semantic.label.alternative"
        style={{ display: "block", textAlign: "center" }}
      >
        데이터를 불러오는 데 실패했습니다.
        <br />
        잠시 후 다시 시도해주세요.
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        size="medium"
        onClick={onRetry}
        style={{ marginTop: "8px" }}
      >
        다시 시도
      </Button>
    </div>
  );
}
