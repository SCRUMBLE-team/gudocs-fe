# 구독 관리 대시보드 — CLAUDE.md

## 프로젝트 개요

**다양한 구독 서비스(OTT, 음악 스트리밍, 클라우드 등)를 한곳에서 통합 관리**하고,
월 구독 지출과 결제일을 확인할 수 있는 **웹 기반 대시보드 시스템**.

### 핵심 목적

- **통합 관리 편의성** — 여러 플랫폼에 흩어진 구독 정보를 단일 인터페이스에서 관리
- **지출 가시성 확보** — 월별 총액 및 카테고리별 비율로 불필요한 지출 파악
- **결제 사고 방지** — 결제일 사전 알림으로 원치 않는 자동 결제 예방

---

## 기술 스택

| 영역       | 기술                            |
| ---------- | ------------------------------- |
| Frontend   | TypeScript, React               |
| 상태 관리  | Zustand (전역 상태)             |
| 스타일     | Tailwind CSS v4, Wanted Design System (`@wanteddev/wds`) |
| api 호출출 | axios                           |
| 차트       | (별도 정의 시 여기에 추가)      |
| Backend/DB | (별도 정의 시 여기에 추가)      |
| 배포 환경  | `https://localhost` (개발 기준) |

---

## 디렉터리 구조

## 디렉토리명/파일명 컨벤션

### **📂 디렉토리명**

- 케밥케이스(kebab-case) 사용

### **📄 파일명**

1. 도메인 내부 파일

- 상위 디렉토리명을 prefix로 붙이고, 파스칼케이스(PascalCase)로 작성
- 예:

  `domain/post/components/list/PostListItem.tsx`

2. assets 내 리소스

- 케밥케이스(kebab-case) 사용
- icons/는 `ic_` prefix 고정

3. 도메인 전용 설정 파일

- {도메인명}.{역할}.ts 로 작성
- 역할 구분: constants, types, route 등

## 3. 도메인 구조 규칙 (예: solving 도메인)

### ✅ 최상위 도메인

- 각 도메인의 루트는 `src/domain/{domain}/` 디렉토리입니다.
- 루트 하위에는 다음과 같은 폴더를 둘 수 있습니다:
  - `components/`
  - `layouts/`
  - `hooks/`
  - `utils/`
  - `pages/`
  - 기타 필요에 따라 확장 가능
- 하위 폴더는 **common**과 **세부 도메인별 폴더**로 구분합니다.
  - common/은 도메인 내부에서 공통으로 사용하는 리소스를 관리하며, 반드시 존재합니다.
- 도메인 내 라우팅, 상수, 타입 정의 파일은 각각 하나씩만 생성합니다.
  - 상수와 enum은 `*.constants.ts` 파일에서 함께 관리합니다.

### 🚫 세부 도메인 제한

- 세부 도메인(live, review 등)은 그 하위에 `components`, `hooks` 등의 폴더를 직접 생성할 수 없습니다.
- 대신, 최상위 도메인의 각 폴더(`components`, `hooks`, `utils`, `constants`, `apis`, `layouts`) 안에 세부 도메인 이름(live, review)으로 하위 폴더를 만들어 관리합니다.

## 전체 구조 예시

```bash
src/
├── assets/
│   ├── icons/
│   ├── images/
│   └── lotties/
│
├── components/            // 전역 공용 컴포넌트
│   ├── Button/
│   ├── Modal/
│   └── ...
│── types/
│   ├── user.ts/
│   ├── post.ts/
│   └── ..
├── domain/
│   ├── auth/              // 로그인/회원가입
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── auth.types.ts
│   │   ├── auth.constants.ts
│   │   └── auth.route.ts
│   │
│   ├── post/              // 게시글 관련
│   │   ├── components/
│   │   │   |
│   │   │   ├── list/
│   │   │   ├── write/
│   │   │   └── detail/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── PostWritePage.tsx
│   │   │   └── PostDetailPage.tsx
│   │   ├── post.types.ts
│   │   ├── post.constants.ts
│   │   └── post.route.ts
│   │
│   ├── mypage/            // 마이페이지
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MyPage.tsx
│   │   ├── mypage.types.ts
│   │   ├── mypage.constants.ts
│   │   └── mypage.route.ts
│   │
│   ├── matching/          // 매칭 현황
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MatchingPage.tsx
│   │   ├── matching.types.ts
│   │   ├── matching.constants.ts
│   │   └── matching.route.ts
│   │
│   ├── review/            // 독립 리뷰 도메인
│   │   ├── components/
│   │   │   └── ReviewForm.tsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── ReviewPage.tsx
│   │   ├── review.types.ts
│   │   ├── review.constants.ts
│   │   └── review.route.ts
│   │
│   ├── map/               // 동네 지도
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MapPage.tsx
│   │   ├── map.types.ts
│   │   ├── map.constants.ts
│   │   └── map.route.ts
│   │
│   ├── chat/              // 채팅
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── ChatPage.tsx
│   │   ├── chat.types.ts
│   │   ├── chat.constants.ts
│   │   └── chat.route.ts
│   │
│   └ notification/    //알림
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── notification.types.ts
│       ├── notification.constants.ts
│       └── notification.route.ts
│
├── hooks/                 // 전역 공용 훅
├── layouts/               // 전역 레이아웃 (헤더)
src/
├── api/
│   ├── axiosInstance.ts   # (공통) BaseURL, Interceptor 설정
│   ├── postApi.ts         # 게시글 관련 API 모음
│   ├── userApi.ts         # 유저 관련 API 모음
│   └── ...
├── stores/
│   ├── usePostStore.ts    # 게시글 작성 폼, UI 상태 관리
│   ├── useUserStore.ts    # 로그인 유저 정보 관리
│   └── useSocketStore.ts  # (예외) 소켓 연결 및 이벤트 관리
└── types/
    └── post.ts            # 타입 정의는 별도 관리
├── utils/
├── app.constants.ts
└── index.tsx

```

---

## 도메인 모델 & 타입 정의

```typescript
// 구독 카테고리
type SubscriptionCategory =
  | "OTT"
  | "음악 스트리밍"
  | "클라우드"
  | "게임"
  | "교육"
  | "뉴스/미디어"
  | "소프트웨어"
  | "기타";

// 구독 상태
type SubscriptionStatus = "active" | "paused" | "cancelled";

// 결제 수단
type PaymentMethod = "신용카드" | "체크카드" | "계좌이체" | "간편결제";
```

---

## 주요 기능 & 구현 가이드

### 1. 인증 (홈)

- 페이지 경로: `/login`, `/register`, `/forgot-password`
- 인증 상태는 **Zustand** `useAuthStore`로 전역 관리
- 로그인 후 `/dashboard`로 리다이렉트
- 비로그인 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트

```typescript
// store/authStore.ts 예시
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}
```

---

### 2. 구독 관리

- 페이지 경로: `/dashboard/subscriptions`, `/dashboard/subscriptions/[id]`

- 목록 페이지: 카테고리 필터, 상태 필터 지원
- 등록/수정: 폼 입력값 검증 후 API 호출
  - 필수 입력: `name`, `category`, `price`, `billingDay`, `paymentMethod`
  - `billingDay` 범위: 1 ~ 31
  - `price` 단위: 원(KRW), 0 이상
- 삭제: 확인 모달 → API 호출 → 목록 refetch
- 일시 정지: `status`를 `'active'` ↔ `'paused'` 토글

---

### 3. 지출 분석

- 페이지 경로: `/dashboard/analytics`
- 이번 달 총 구독 지출 = `price` 합산 (status: `'active'`인 항목만)
- **도넛 차트** (카테고리별 비율) — Recharts `PieChart` 사용
- **막대 그래프** (최근 6개월 추이) — Recharts `BarChart` 사용
- 월 이동: 이전/다음 달 버튼으로 조회 월 변경

```typescript
// 월별 총액 계산 예시
const calcMonthlyTotal = (subscriptions: Subscription[]): number =>
  subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.price, 0);
```

---

### 4. 알림

- 페이지 경로: `/dashboard/notifications`
- 헤더의 벨 아이콘 → 드롭다운으로 최근 알림 목록 표시
- 읽지 않은 알림 수: 헤더 벨 아이콘에 뱃지로 표시
- 알림 설정: `NotificationSetting` 저장 → 서버에 PATCH 요청
- 전체 읽음: 모든 알림 `read: true` → PATCH `/notifications/read-all`

---

### 5. 마이페이지

- 페이지 경로: `/dashboard/mypage`
- 회원 정보 수정 (이름)
- 비밀번호 변경: 변경 후 강제 로그아웃 → `/login` 이동
- 회원 탈퇴: 비밀번호 재확인 → 탈퇴 처리 → 서비스 메인 이동

---

## 스타일링 가이드

### Wanted Design System (WDS)

UI를 구현할 때 **커스텀 컴포넌트보다 WDS 컴포넌트를 우선 사용**한다.
WDS에 없는 경우에만 Tailwind CSS로 직접 구현한다.

- 패키지: `@wanteddev/wds`, `@wanteddev/wds-icon`
- 문서: https://montage.wanted.co.kr
- 기본 폰트: Pretendard (`pretendard` 패키지로 설치, `main.tsx`에서 import)

#### ThemeProvider 설정

`main.tsx`에서 앱 전체를 `ThemeProvider`로 감싼다.

```tsx
import { ThemeProvider } from '@wanteddev/wds'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

#### 컴포넌트 사용 예시

```tsx
import { Button, Badge, Avatar } from '@wanteddev/wds'
import { IcSearch, IcBell } from '@wanteddev/wds-icon'

// 버튼
<Button variant="primary" size="md" onClick={handleClick}>
  구독 추가
</Button>

<Button variant="outlined" size="sm" disabled>
  비활성화
</Button>

// 뱃지 (알림 카운트 등)
<Badge count={unreadCount} max={99}>
  <IcBell size={24} />
</Badge>

// 아이콘
<IcSearch size={20} color="gray600" />
```

#### 색상 및 토큰 활용

WDS 디자인 토큰을 CSS 변수로 활용한다. Tailwind 임의값보다 토큰을 우선 사용한다.

```tsx
// ✅ WDS 토큰 사용
<div style={{ color: 'var(--color-gray-700)' }}>텍스트</div>

// ✅ WDS 컴포넌트의 variant/color prop 사용
<Button variant="primary">확인</Button>

// ❌ 하드코딩된 색상 직접 사용 지양
<div style={{ color: '#333' }}>텍스트</div>
```

---

## 공통 UI 규칙

### Toast 메시지

성공/실패 상황에서 항상 토스트 메시지를 사용한다.

```typescript
// 성공 예시
toast.success("구독 서비스가 등록되었습니다.");
// 삭제 예시
toast.success("삭제되었습니다.");
// 에러 예시
toast.error("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
```

### 확인 모달

삭제, 탈퇴 등 **되돌릴 수 없는 작업**은 반드시 확인 모달을 띄운다.

```typescript
// 삭제 모달 메시지 형식
`${subscriptionName} 구독을 삭제하시겠습니까?`;
```

### 에러 처리

API 에러 발생 시:

1. `console.error`로 에러 로깅
2. 사용자에게 toast.error 표시

---

## API 엔드포인트 (예시 규칙)

api 정의 시 추가

```

```

---

## 코딩 컨벤션

- **언어**: TypeScript strict mode (`"strict": true`)
- **컴포넌트**: 함수형 컴포넌트만 사용, `export default` 사용
- **커스텀 훅**: 비즈니스 로직은 훅으로 분리 (`useSubscriptions`, `useAnalytics` 등)
- **상수**: `constants/` 디렉터리에 별도 관리
- **any 금지**: TypeScript `any` 사용 금지, 정확한 타입 명시
- **null 체크**: optional chaining(`?.`) 및 nullish coalescing(`??`) 적극 활용

---

## 백로그 요약 (총 21개)

| #     | 메인 메뉴  | 기능                                                       |
| ----- | ---------- | ---------------------------------------------------------- |
| 1–4   | 홈         | 회원가입, 로그인, 로그아웃, 비밀번호 찾기                  |
| 5–10  | 구독 관리  | 등록, 목록 조회, 상세 조회, 수정, 삭제, 일시 정지          |
| 11–14 | 지출 분석  | 월별 지출 조회, 카테고리별 비율, 추이 그래프, CSV 내보내기 |
| 15–18 | 알림       | 알림 설정, 수신 확인, 개별 삭제, 전체 읽음 처리            |
| 19–21 | 마이페이지 | 정보 수정, 비밀번호 변경, 회원 탈퇴                        |
