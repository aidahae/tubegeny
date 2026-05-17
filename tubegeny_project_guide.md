# TubeGeny - Project Documentation & AI Context Template

이 문서는 TubeGeny 프로젝트의 아키텍처, 디자인 시스템, 그리고 구현된 기능들을 요약한 핵심 가이드입니다. 향후 AI 에이전트나 개발자가 이 프로젝트를 이어서 작업할 때, 이 문서만 읽으면 전체 구조와 의도를 즉각적으로 파악하고 일관성 있게 코드를 수정할 수 있습니다.

---

## 1. Project Overview (프로젝트 개요)
- **프로젝트 명:** TubeGeny (AI YouTube Protector & Viral Blueprints)
- **목적:** 유튜버들을 위한 AI 기반 채널 노란딱지(수익창출 정지) 방어 및 알고리즘 바이럴 전략 제공 SaaS 플랫폼.
- **주요 타겟:** 유튜브 알고리즘과 가이드라인 위반을 두려워하는 크리에이터.
- **아키텍처:** 바닐라 HTML/CSS/JS 기반의 Single Page Application (SPA) 형태. 프론트엔드 내에서 섹션(`hidden` 클래스 토글)을 전환하며 페이지 이동 효과를 구현함.

---

## 2. Design System & UI/UX (디자인 시스템)

TubeGeny는 **'미래지향적, 전문적, 신뢰감'**을 주는 다크 모드 기반의 네온(Neon) 스타일을 채택했습니다.

### 2.1. Color Palette (색상 규격)
모든 CSS는 `tubegeny-style.css`의 `:root` 변수로 관리됩니다.
- **Background:** `#0a0a0f` (매우 깊은 다크톤)
- **Neon Primary (Pink/Red):** `#ff0055` (위험 경고, 강력한 강조, 로고 색상)
- **Neon Secondary (Cyan):** `#00f0ff` (안전, 성공, 알고리즘 부스트)
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#a0a0b0`

### 2.2. Core UI Components (핵심 컴포넌트 클래스)
새로운 요소를 추가할 때는 반드시 아래의 기존 클래스들을 재사용하여 디자인 일관성을 유지해야 합니다.
- `.glass-card` / `.glass-infographic`: 반투명한 유리 질감 효과 (Glassmorphism).
- `.3d-hover` / `.3d-card`: 마우스 오버 시 입체적으로 떠오르며 네온 그림자가 생기는 3D 효과.
- `.btn-primary` / `.btn-outline`: 둥근 모서리(`border-radius: 50px`)의 메인 및 서브 버튼.
- `.reveal` / `.fade-right` / `.fade-left`: 스크롤 시 부드럽게 나타나는 애니메이션 클래스.
- `.neon-icon`: 아이콘에 네온 발광(Glow) 효과 부여.

### 2.3. Layout Rules (레이아웃 규칙)
- 전체 콘텐츠 최대 넓이(`max-width`)는 `1200px`로 제한하여 와이드 모니터에서도 콘텐츠가 과도하게 퍼지지 않도록 중앙 정렬.
- CSS Grid(`display: grid`)와 Flexbox를 적극 사용하여 요소들을 반응형으로 배치.

---

## 3. Core Features & File Structure (핵심 기능 및 파일 구조)

### 3.1. File Structure
- `tubegeny.html`: 전체 레이아웃, 랜딩 페이지, 대시보드, 마이페이지, 모달창 및 UI 전환 JS 로직이 포함된 메인 파일.
- `tubegeny-style.css`: 디자인 토큰 및 모든 스타일 정의 파일.
- `tubegeny-checkout.html`: 페이팔 결제 연동이 구현된 결제 페이지.

### 3.2. Page Routing Logic (페이지 전환 로직)
페이지 새로고침 없이, JS의 `classList.add('hidden')` 및 `remove('hidden')`를 통해 화면을 전환합니다.
1. **Landing Content (`#landing-content`)**: 초기 소개 화면 (Hero, Features, Pricing).
2. **Dashboard (`#dashboard`)**: 채널 URL 분석 후 보여지는 결과 화면 (위험도 프로그레스 바, PRO 잠금 해제 전략 등).
3. **My Page (`#mypage`)**: 유저 프로필, 현재 요금제, 분석 히스토리, 로그아웃 기능.

### 3.3. Navigation Logic (네비게이션 상태 관리)
상단 메뉴 바는 로그인 여부와 현재 페이지 위치에 따라 동적으로 변환됩니다. (`tubegeny.html` 내 JS 함수 사용)
- `showLanding()`: 랜딩 페이지 전용 메뉴(Why, Features 등) 활성화.
- `showDashboard()` / `showMyPage()`: 뒤로가기(`Back to Home`) 버튼 활성화.
- **인증 상태:** `currentUser` 객체 존재 여부에 따라 로그인(`Login`) 버튼과 마이페이지(`My Page`) 버튼이 스위칭됨.

### 3.4. Authentication (인증 시스템)
현재 **Firebase Authentication** 연동 템플릿 로직이 구현되어 있습니다. (`tubegeny.html` 하단 스크립트)
- 지원되는 소셜 로그인: Google, Apple, X(Twitter), Facebook.
- **현재 상태:** 임시 모의(Mock) 로그인 동작 상태. `localStorage`에 `tubegeny_user` 정보를 저장하여 새로고침 시에도 상태와 데이터(분석 히스토리 등)를 유지.
- **작동 원리:** `firebaseConfig` 내의 `apiKey`가 "YOUR_API_KEY"로 되어 있을 경우 개발자 경고창을 띄우고 모의 로그인을 실행함.

---

## 4. Next Action Items (향후 개발 시 즉시 적용해야 할 사항)

이 템플릿을 읽는 AI 에이전트는 다음 작업 지시를 받을 경우, 아래의 사항을 최우선으로 진행해야 합니다.

1. **실제 소셜 로그인 활성화 지시가 떨어졌을 때:**
   - 사용자로부터 제공받은 `Firebase Project API Keys`를 `tubegeny.html` 스크립트의 `firebaseConfig` 객체에 덮어씌웁니다.
   - 모의 로그인 로직(`handleSocialLogin` 내 fallback 로직)을 제거하고 주석 처리된 실제 `signInWithPopup` 코드를 활성화합니다.
2. **백엔드 DB 연동 지시가 떨어졌을 때:**
   - 현재 `localStorage`에 저장되는 `currentUser.history` 데이터를 Firebase Firestore 또는 Supabase Database 연결 코드로 치환해야 합니다.
3. **새로운 섹션 추가 지시가 떨어졌을 때:**
   - 절대 인라인 스타일이나 임의의 색상을 쓰지 말고, `.glass-card`, `.3d-hover`, `var(--neon-primary)` 등 기존 디자인 시스템 토큰을 무조건 재활용하여 일관성을 맞추어야 합니다.

---
**Document Last Updated:** 2026-05-17 (Version 1.0)
**Context Ready for Next AI Instruction.**
