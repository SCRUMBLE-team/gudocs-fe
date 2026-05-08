# 디자인 시스템 가이드 — Wanted Montage (WDS)

## 개요

이 프로젝트는 **Wanted Design System(WDS)**, 공식명 **Montage**를 사용합니다.
WDS에 있는 컴포넌트를 **최우선**으로 사용하고, 없는 경우에만 Tailwind CSS로 직접 구현합니다.

- 공식 문서: https://montage.wanted.co.kr
- 패키지: `@wanteddev/wds`, `@wanteddev/wds-icon`, `@wanteddev/wds-lottie`, `@wanteddev/wds-theme`, `@wanteddev/wds-engine`

---

## 설치 패키지

```json
"@wanteddev/wds": "^3.6.0",
"@wanteddev/wds-engine": "^3.6.0",
"@wanteddev/wds-icon": "^3.6.0",
"@wanteddev/wds-lottie": "^3.6.0",
"@wanteddev/wds-theme": "^3.6.0"
```

---

## 초기 설정

### main.tsx

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "pretendard/dist/web/static/pretendard.css";
import { ThemeProvider } from "@wanteddev/wds";
import "@wanteddev/wds/global.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
```

- 앱 전체를 `ThemeProvider`로 감싸야 WDS 컴포넌트와 CSS 변수가 정상 동작한다.
- `@wanteddev/wds/global.css`는 반드시 import한다.
- 기본 폰트는 **Pretendard** (`pretendard` 패키지).

---

## 사용 중인 컴포넌트

### Button

```tsx
import { Button } from "@wanteddev/wds";

// variant: "solid" | "outlined"
// color: "primary" | "assistive"
// size: "large" | "medium" | "small"

<Button variant="solid" color="primary" size="large" fullWidth>
  로그인
</Button>

<Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
  취소
</Button>
```

| prop      | 사용 값                           |
| --------- | --------------------------------- |
| `variant` | `solid`, `outlined`               |
| `color`   | `primary`, `assistive`            |
| `size`    | `large`, `medium`, `small`        |
| `fullWidth` | boolean — 전체 너비 버튼        |
| `type`    | `"submit"` (form 제출 버튼에 명시) |

---

### Typography

```tsx
import { Typography } from "@wanteddev/wds";

<Typography variant="title2" weight="bold" align="center" style={{ display: "block" }}>
  로그인
</Typography>

<Typography variant="body2" color="semantic.label.alternative">
  설명 텍스트
</Typography>
```

#### variant 종류 (사용 중)

| variant    | 용도                    |
| ---------- | ----------------------- |
| `title2`   | 페이지 제목             |
| `title3`   | 섹션 제목               |
| `body1`    | 본문 (강조)             |
| `body2`    | 본문 (일반)             |
| `label1`   | 폼 레이블               |
| `caption1` | 보조 텍스트 (작은 글씨) |

#### weight

| weight   | 용도           |
| -------- | -------------- |
| `bold`   | 제목, 강조     |
| `medium` | 레이블, 중간   |

#### color (semantic 토큰)

| color 값                      | 용도                  |
| ----------------------------- | --------------------- |
| `semantic.label.normal`       | 기본 텍스트           |
| `semantic.label.alternative`  | 보조/설명 텍스트      |

> `style={{ display: "block" }}`을 추가해야 줄바꿈이 적용된다.

---

### TextField

```tsx
import { TextField } from "@wanteddev/wds";

<TextField
  type="email"
  placeholder="이메일을 입력하세요"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  invalid={!!errors.email}
  width="100%"
/>
```

| prop          | 설명                             |
| ------------- | -------------------------------- |
| `type`        | `"text"` \| `"email"` \| `"password"` |
| `invalid`     | 에러 상태 (boolean)              |
| `width`       | `"100%"` 등 CSS 값              |
| `autoFocus`   | 자동 포커스                      |

---

### FormField & FormErrorMessage

폼 필드 레이아웃과 에러 메시지 표시에 사용한다.

```tsx
import { FormField, FormErrorMessage } from "@wanteddev/wds";

<FormField flexDirection="column" gap="4px">
  <Typography variant="label1" weight="medium" color="semantic.label.normal" style={{ display: "block" }}>
    이메일
  </Typography>
  <TextField
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    invalid={!!errors.email}
    width="100%"
  />
  {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
</FormField>
```

---

### useToast (Toast 메시지)

성공/실패 상황에서 항상 토스트를 사용한다.

```tsx
import { useToast } from "@wanteddev/wds";

const toast = useToast();

// 성공
toast({ content: "저장되었습니다.", variant: "positive", duration: "short" });

// 정보
toast({ content: "API 연동 후 사용 가능합니다.", variant: "informative", duration: "short" });

// 에러
toast({ content: "오류가 발생했습니다.", variant: "negative", duration: "short" });
```

| variant       | 용도        |
| ------------- | ----------- |
| `positive`    | 성공        |
| `informative` | 안내/정보   |
| `negative`    | 실패/오류   |

---

### 아이콘 (@wanteddev/wds-icon)

```tsx
import { IcBell, IcSearch } from "@wanteddev/wds-icon";

<IcBell size={24} />
<IcSearch size={20} color="gray600" />
```

---

## CSS 변수 (시맨틱 토큰)

WDS가 제공하는 CSS 변수를 활용한다. 하드코딩된 색상(예: `#333`) 사용을 지양한다.

### 배경색

| 변수                                        | 용도                              |
| ------------------------------------------- | --------------------------------- |
| `--semantic-background-normal-normal`       | 카드, 모달 등 기본 흰색 배경      |
| `--semantic-background-normal-alternative`  | 페이지 전체 배경 (연한 회색)      |

### 선(Border/Divider)

| 변수                              | 용도                        |
| --------------------------------- | --------------------------- |
| `--semantic-line-solid-normal`    | 카드 테두리, 구분선         |

### 텍스트/레이블

| 변수                         | 용도              |
| ---------------------------- | ----------------- |
| `--semantic-label-normal`    | 기본 텍스트 색상  |
| `--semantic-primary-normal`  | 링크, 강조 색상   |

### 사용 예시

```tsx
<div
  style={{
    backgroundColor: "var(--semantic-background-normal-normal)",
    border: "1px solid var(--semantic-line-solid-normal)",
    borderRadius: "16px",
    padding: "48px 40px",
  }}
>
  내용
</div>
```

---

## 브랜드 컬러 (커스텀)

WDS 토큰 외에 프로젝트 전용 브랜드 그라디언트를 사용한다.

```css
/* 로고, 아바타, 포인트 요소 */
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
```

---

## 타이포그래피

- 기본 폰트: **Pretendard**
- `fontFamily: "Pretendard, sans-serif"` — 네이티브 `<button>` 등 WDS 외 요소에 명시

---

## 공통 UI 패턴

### 페이지 레이아웃

```tsx
<div style={{ minHeight: "100vh", backgroundColor: "var(--semantic-background-normal-alternative)" }}>
  <Header />
  <div style={{ maxWidth: "660px", margin: "0 auto", padding: "40px 24px 80px" }}>
    {/* 콘텐츠 */}
  </div>
</div>
```

### 카드 컴포넌트

```tsx
<div
  style={{
    backgroundColor: "var(--semantic-background-normal-normal)",
    borderRadius: "20px",
    padding: "28px 32px",
    marginBottom: "16px",
    border: "1px solid var(--semantic-line-solid-normal)",
  }}
>
  {/* 카드 내용 */}
</div>
```

### 폼 레이아웃

```tsx
<form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
  {/* FormField들 */}
</form>
```

### 위험 영역 (Danger Zone)

```tsx
<div
  style={{
    border: "1.5px solid #fecaca",
    borderRadius: "20px",
    padding: "28px 32px",
  }}
>
  <Typography variant="title3" weight="bold" style={{ color: "#dc2626" }}>
    위험 영역
  </Typography>
</div>
```

---

## 규칙 요약

| 상황                          | 방법                                      |
| ----------------------------- | ----------------------------------------- |
| UI 컴포넌트 필요              | WDS 컴포넌트 우선 사용                    |
| 색상 지정                     | `var(--semantic-*)` CSS 변수 사용         |
| WDS에 없는 컴포넌트           | Tailwind CSS로 직접 구현                  |
| 성공/실패 피드백              | `useToast` 사용                           |
| 폼 에러 표시                  | `FormErrorMessage` + `invalid` prop       |
| 되돌릴 수 없는 작업 (삭제 등) | 반드시 확인 모달 표시 후 실행             |
| 아이콘                        | `@wanteddev/wds-icon` 사용                |
