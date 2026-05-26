import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { Button, Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";
import loginAnimation from "../../lottie/login.json";

export default function LoginRequiredView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: loginAnimation,
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
        로그인이 필요합니다
      </Typography>
      <Typography
        variant="body2"
        color="semantic.label.alternative"
        style={{ display: "block", textAlign: "center" }}
      >
        구독 관리 대시보드를 이용하려면 로그인해주세요.
      </Typography>
      <Button
        variant="solid"
        color="primary"
        size="medium"
        onClick={() => navigate("/login")}
        style={{ marginTop: "8px" }}
      >
        로그인하기
      </Button>
    </div>
  );
}
