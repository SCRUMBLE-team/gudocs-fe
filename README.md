# 구독 관리 대시보드

다양한 구독 서비스를 한곳에서 통합 관리하는 웹 대시보드입니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Wanted Design System** (`@wanteddev/wds`)
- **Zustand** (전역 상태)
- **Axios** (API 통신)

---

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/SCRUMBLE-team/gudocs-fe.git
cd gudocs-fe
```

### 2. `.npmrc` 파일 생성

`@wanteddev` 패키지는 GitHub Package Registry에서 제공되므로 인증이 필요합니다.
프로젝트 루트에 `.npmrc` 파일을 직접 생성하세요. (`.gitignore`에 포함되어 있어 저장소에 없습니다.)

```
@wanteddev:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=여기에_토큰_입력
```

> **GitHub Personal Access Token 발급 방법**
>
> 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 2. **`read:packages`** 권한 체크 후 토큰 생성
> 3. 생성된 토큰(`ghp_...`)을 위 파일에 입력

### 3. 의존성 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과물 미리보기
npm run lint     # ESLint 검사
```

---

## 주의사항

- **`.npmrc`는 절대 커밋하지 마세요.** 토큰이 유출될 수 있습니다. (`.gitignore`에 등록되어 있음)
- `@wanteddev` 패키지 설치 시 GitHub 토큰 없이는 `npm install`이 실패합니다.
