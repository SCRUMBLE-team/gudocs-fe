import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, TextButton } from "@wanteddev/wds";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" },
  hover: {
    scale: 1.03,
    y: -4,
    boxShadow: "0 12px 40px rgba(0,102,255,0.15)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition:
          "background-color 0.3s, backdrop-filter 0.3s, border-bottom 0.3s",
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0066FF",
          letterSpacing: "-0.5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/landing")}
      >
        Gudocs<span style={{ color: "#0066FF" }}>!</span>
      </span>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button size="medium" onClick={() => navigate("/login")}>
          로그인
        </Button>
        <Button size="medium" onClick={() => navigate("/register")}>
          무료로 시작하기
        </Button>
      </div>
    </motion.nav>
  );
}

// ─── Dashboard Mockup ──────────────────────────────────────────────────────────

function DashboardMockup() {
  const subscriptions = [
    { name: "넷플릭스", amount: "₩17,000", color: "#E50914", icon: "🎬" },
    { name: "유튜브 프리미엄", amount: "₩14,900", color: "#FF0000", icon: "▶" },
    { name: "ChatGPT Plus", amount: "₩27,000", color: "#10A37F", icon: "✦" },
    { name: "Spotify", amount: "₩10,900", color: "#1DB954", icon: "♪" },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        width: "100%",
        maxWidth: 480,
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: "#F3F4F6",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#FF5F57",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#FEBC2E",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#28C840",
            display: "inline-block",
          }}
        />
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 11,
            color: "#9CA3AF",
            fontFamily: "monospace",
          }}
        >
          gudocs.app/dashboard
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
              이번 달 총 구독 비용
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-1px",
              }}
            >
              ₩102,600
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
              구독 수
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
              7개
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FFF7ED",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 16,
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12 }}>⚠️</span>
          <span style={{ fontSize: 11, color: "#92400E" }}>
            3일 내 결제 예정: Netflix ₩17,000
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subscriptions.map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                background: "#F9FAFB",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: s.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {s.name}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0066FF" }}>
                {s.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "80px 48px 60px",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div custom={0} variants={fadeUp}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EBF5FF",
                color: "#0066FF",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              ✦ 구독 관리의 새로운 기준
            </span>
          </motion.div>

          <motion.div custom={0.1} variants={fadeUp}>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#0A0A0A",
                letterSpacing: "-2px",
                marginBottom: 0,
              }}
            >
              꼼꼼한
              <br />
              구독관리가
              <br />
              필요할 땐,
            </h1>
          </motion.div>

          <motion.div custom={0.2} variants={fadeUp}>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#0066FF",
                letterSpacing: "-2px",
                marginBottom: 24,
              }}
            >
              Gudocs!
            </h1>
          </motion.div>

          <motion.div custom={0.3} variants={fadeUp}>
            <p
              style={{
                fontSize: 18,
                color: "#6B7280",
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              넷플릭스, 유튜브, ChatGPT까지—
              <br />
              모든 구독을 한 눈에. 지출을 스마트하게.
            </p>
          </motion.div>

          <motion.div
            custom={0.4}
            variants={fadeUp}
            style={{ display: "flex", gap: 12 }}
          >
            <TextButton size="medium" onClick={() => navigate("/register")}>
              무료로 시작하기 →
            </TextButton>
            <TextButton size="medium" onClick={() => navigate("/login")}>
              로그인
            </TextButton>
          </motion.div>

          <motion.div
            custom={0.5}
            variants={fadeUp}
            style={{ marginTop: 40, display: "flex", gap: 32 }}
          >
            {[
              { number: "7+", label: "구독 서비스 연동" },
              { number: "100%", label: "무료 사용" },
              { number: "실시간", label: "결제 알림" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: "#0066FF" }}
                >
                  {stat.number}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section: Pain Points ──────────────────────────────────────────────────────

const painPoints = [
  {
    emoji: "😩",
    title: "구독 서비스 분산 관리",
    description:
      "넷플릭스, 유튜브 프리미엄, ChatGPT 등 여러 구독 서비스의 내역을 한번에 관리하기 어려우셨나요?",
    color: "#EBF5FF",
    accent: "#0066FF",
  },
  {
    emoji: "💸",
    title: "구독 자동 결제 문제",
    description:
      "무료 체험 후 자동 결제가 이어지거나, 사용하지 않는 서비스를 해지 못해 불필요한 비용이 새고 있진 않나요?",
    color: "#FFF7ED",
    accent: "#F59E0B",
  },
  {
    emoji: "📊",
    title: "결제일·요금 변동 파악 어려움",
    description:
      "구독마다 결제일이 달라 관리가 어렵고, 가격 인상이나 환율 변동의 영향을 즉각 파악하기 힘들지 않나요?",
    color: "#F0FDF4",
    accent: "#10B981",
  },
];

function PainPointsSection() {
  return (
    <section
      style={{
        padding: "100px 48px",
        background: "#F8FAFF",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-block",
                background: "#FEF3C7",
                color: "#92400E",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Pain Points
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
            }}
          >
            이런 문제,{" "}
            <span style={{ color: "#0066FF" }}>겪고 있지 않나요?</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              whileHover={cardHover.hover}
              initial={cardHover.rest}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "36px 28px",
                border: "1px solid #E5E7EB",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: point.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  marginBottom: 20,
                }}
              >
                {point.emoji}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  marginBottom: 12,
                  letterSpacing: "-0.5px",
                }}
              >
                {point.title}
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section: Features ─────────────────────────────────────────────────────────

const features = [
  {
    icon: "📋",
    title: "구독 한눈에 관리",
    description:
      "모든 구독 서비스를 등록하고 한 화면에서 상태·금액·결제일을 즉시 확인하세요.",
    gradient: "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)",
  },
  {
    icon: "📈",
    title: "월별 지출 분석",
    description:
      "카테고리별 지출 비율과 월간 추이 그래프로 어디서 돈이 새는지 한눈에 파악하세요.",
    gradient: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
  },
  {
    icon: "🔔",
    title: "결제 예정 알림",
    description:
      "결제일 D-3, D-1 사전 알림으로 원치 않는 자동 결제를 예방하세요.",
    gradient: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)",
  },
  {
    icon: "💰",
    title: "비용 최적화",
    description:
      "오랫동안 사용하지 않은 구독을 감지하고 불필요한 지출을 정리할 수 있게 도와드립니다.",
    gradient: "linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)",
  },
];

function FeaturesSection() {
  return (
    <section style={{ padding: "100px 48px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-block",
                background: "#EBF5FF",
                color: "#0066FF",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Features
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
            }}
          >
            Gudocs가 <span style={{ color: "#0066FF" }}>해결합니다</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginTop: 16,
              lineHeight: 1.7,
            }}
          >
            복잡한 구독 관리, 이제 Gudocs 하나로 끝내세요.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
              style={{
                borderRadius: 20,
                padding: "36px 32px",
                background: feature.gradient,
                border: "1px solid rgba(0,0,0,0.05)",
                cursor: "default",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  marginBottom: 10,
                  letterSpacing: "-0.5px",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section: How It Works ─────────────────────────────────────────────────────

const steps = [
  {
    step: "01",
    title: "구독 서비스 등록",
    description:
      "넷플릭스, 스포티파이, ChatGPT 등 이용 중인 구독 서비스를 간단히 등록하세요. 서비스명, 금액, 결제일만 입력하면 됩니다.",
    visual: "📝",
    bgColor: "#EBF5FF",
  },
  {
    step: "02",
    title: "대시보드에서 한눈에 확인",
    description:
      "등록한 모든 구독이 대시보드에 정리됩니다. 이번 달 총 지출과 다가오는 결제일을 즉시 파악하세요.",
    visual: "📊",
    bgColor: "#F0FDF4",
  },
  {
    step: "03",
    title: "지출 분석으로 최적화",
    description:
      "카테고리별 지출 비율과 월간 추이 분석으로 불필요한 구독을 발견하고 스마트하게 정리하세요.",
    visual: "💡",
    bgColor: "#FFF7ED",
  },
];

function HowItWorksSection() {
  return (
    <section style={{ padding: "100px 48px", background: "#F8FAFF" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-block",
                background: "#F0FDF4",
                color: "#15803D",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              How it works
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
            }}
          >
            단 3단계로 시작하세요
          </motion.h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "center",
                direction: index % 2 !== 0 ? "rtl" : "ltr",
              }}
            >
              <div style={{ direction: "ltr" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "#0066FF",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#0A0A0A",
                    letterSpacing: "-1px",
                    marginBottom: 16,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.8 }}>
                  {step.description}
                </p>
              </div>

              <div
                style={{
                  direction: "ltr",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 40,
                    background: step.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 80,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  }}
                >
                  {step.visual}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ──────────────────────────────────────────────────────────────

function CTASection() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: "100px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg, #0066FF 0%, #003D99 100%)",
            padding: "80px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1.5px",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              지금 바로 구독 관리를
              <br />
              시작하세요
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 40,
                lineHeight: 1.7,
              }}
            >
              무료로 가입하고, 오늘부터 구독을 스마트하게 관리해보세요.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Button size="medium" onClick={() => navigate("/register")}>
                무료로 시작하기 →
              </Button>
              <Button size="medium" onClick={() => navigate("/login")}>
                로그인
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        padding: "40px 48px",
        borderTop: "1px solid #E5E7EB",
        background: "#F9FAFB",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 800, color: "#0066FF" }}>
          Gudocs!
        </span>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>
          © 2025 Team Scrumble. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "'Pretendard', sans-serif",
        background: "#fff",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
