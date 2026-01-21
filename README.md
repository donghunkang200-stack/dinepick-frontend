# 🍽️ DinePick Frontend

레스토랑 예약 서비스 **DinePick**의 프론트엔드 웹 애플리케이션입니다.

---

## 📋 프로젝트 개요

**DinePick**은 사용자가 레스토랑을 탐색하고 예약·즐겨찾기·마이페이지 기능을 이용할 수 있는  
**레스토랑 예약 플랫폼**입니다.

본 레포지토리는 **React 기반 SPA 프론트엔드**로,  
백엔드 REST API와 연동하여 실제 서비스 흐름에 가까운 UI/UX를 구현하는 것을 목표로 합니다.

- 회원가입/로그인 및 JWT 인증
- 레스토랑 탐색/검색/상세
- 예약 가능 여부 확인 및 예약 생성/수정/취소
- 마이페이지(내 정보/내 예약) 제공
- (관리자) 회원/탈퇴 회원 조회 및 복구, 관리 기능 화면 연동

---

## 🛠 기술 스택

### ✨ Front-End

- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS / Custom CSS
- **State Management**: React Hooks (useState, useEffect, Context)

### 🔗 Back-End 연동

- RESTful API (Spring Boot)
- JWT 기반 인증 API (Access Token + Refresh Token)

---

## 📦 주요 기능

### ✅ 인증 및 회원 관리

- **회원가입 / 로그인**
- **JWT 기반 인증**
  - Access Token + Refresh Token 발급/갱신 흐름 연동
  - API 요청 시 `Authorization: Bearer {accessToken}` 헤더 적용
- **내 정보 조회 및 수정**
- **회원 탈퇴**
- **관리자 기능 (권한 기반 UI/라우팅 분기)**
  - 전체 회원 목록 조회
  - 탈퇴 회원 목록 조회
  - 특정 회원 조회
  - 회원 복구

### 🍽 레스토랑 관리

- **레스토랑 목록 조회**
- **검색 기능**
  - 키워드 검색
  - 카테고리 필터
- **레스토랑 상세 정보 조회**
- **위치 기반 주변 레스토랑 검색**
  - 거리순 정렬 결과 UI 제공

### 📅 예약 관리

- **실시간 예약 가능 여부 확인**
  - 예약 가능/불가 상태에 따른 UI 분기
- **예약 생성**
- **내 예약 목록 조회 (회원 전용 엔드포인트 연동)**
- **예약 상세 조회**
- **예약 수정 및 취소**

---

## 🏗 프로젝트 구조

```bash
src
├── api                         # 백엔드 API 요청 모듈
│   ├── api.js                  # Axios 기본 설정 및 공통 인스턴스
│   ├── auth.js                 # 인증 관련 API (로그인, 회원가입, 토큰)
│   ├── members.js              # 회원/관리자 관련 API
│   ├── reservations.js         # 예약 관련 API
│   └── restaurants.js          # 레스토랑 조회/검색 API
├── components                  # 재사용 UI 컴포넌트
│   ├── common                  # 공통 컴포넌트 (Button, Modal 등)
│   ├── home                    # 홈 화면 전용 컴포넌트
│   ├── layout                  # 레이아웃 컴포넌트 (Header, Footer)
│   ├── mypage                  # 마이페이지 관련 컴포넌트
│   ├── restaurant-detail       # 레스토랑 상세 화면 컴포넌트
│   └── restaurants             # 레스토랑 목록 화면 컴포넌트
├── contexts                    # 전역 상태 관리(Context API)
├── hooks                       # Custom Hooks
│   └── useGeolocation.js       # 위치 정보 조회 훅 (주변 레스토랑 검색)
├── pages                       # 페이지 단위 컴포넌트
├── routes                      # 라우팅 및 접근 제어
│   ├── AuthRedirect.jsx        # 로그인 상태에 따른 리다이렉트 처리
│   └── ProtectedRoute.jsx      # 인증 필요 페이지 보호 라우트
└── main.jsx                    # React 애플리케이션 엔트리 포인트
```
