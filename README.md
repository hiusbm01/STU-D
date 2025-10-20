# 💻 프로젝트: STU-D


> Spring Boot와 React를 사용하여 구현한 실시간 스터디카페 좌석 예약 및 이용권 관리 웹 애플리케이션입니다.
---

## Backend

- **Spring Security + JWT**: 프로젝트의 핵심 인증/인가 시스템 구현
    - 로그인, 회원가입, 권한 관리 등 보안 관련 로직 담당
    - JWT를 활용하여 클라이언트와 서버 간 안전한 토큰 기반 인증 처리
- **Spring Data JPA**: 데이터베이스 연동과 비즈니스 로직 구현
    - 좌석, 이용권, 예약 내역 등 주요 엔티티 관리
    - 복잡한 쿼리를 JPA Repository로 간단히 처리
- **WebSocket(STOMP)**: 실시간 좌석 정보 동기화
    - 여러 사용자가 동시에 접속해도 좌석 상태 즉시 업데이트
    - 실시간 좌석 예약, 해제, 이용권 사용 등 반영
- **이용권 로직**: 시간권, 정액권, 기간권 별 구매 및 사용 처리
    - 각 이용권 타입별 유효 기간, 사용 가능 시간, 잔여 내역 관리

---

## 🎨 Frontend

- **React**
- **Zustand**: 전역 상태 관리
    - 로그인 정보, 실시간 좌석 상태, 최근 이용 기록 등 전역 데이터 관리
- **Axios Interceptor**: API 통신 모듈화
    - 인증 토큰 자동 삽입, 반복 코드 제거
    - 클린 코드 적용 및 유지보수 편리성 향상
- **CSS Grid**: 동적 좌석 배치도 UI 구현
    - 좌석 수, 위치 변경 시 UI 자동 조정
    - 실시간 상태 반영과 직관적 시각화

---

## 🗄 Database & Deployment

- **ERD 설계 및 MySQL 테이블 구축**
    - 좌석, 이용권, 예약 기록, 사용자 테이블 등 관계형 DB 설계
- **GitHub Actions를 통한 CI/CD**
    - 코드 push → 자동 빌드 및 배포
- **AWS Elastic Beanstalk + RDS**
    - 안정적인 서버 운영 및 데이터베이스 관리

---

### TROUBLE SHOOTING

## 🐞 문제 상황

- 이용권 구매 기능 테스트 중 API 호출 실패
- Vite 개발 서버(React)에서 호출 시 **에러 발생**
- 콘솔에는 별다른 에러 로그 없음

---

## 🔍 원인

💡 **프론트에서 보낸 API 요청이 백엔드까지 전달되지 않음**

- Network 탭 확인 → 응답이 JSON이 아니라 HTML(`index.html`)
- React는 SPA라서 모르는 경로가 들어오면 기본적으로 index.html을 반환

---

## 🛠️ 해결 과정

**1. 문제 확인**

- Console + Network 탭 확인
- HTTP 상태는 200 OK지만, 응답이 JSON이 아닌 index.html

**2. 원인 추측**

- 처음엔 상대 경로 문제로 의심했으나 해결되지 않음
- Postman 테스트 결과 정상 동작 → 백엔드 문제는 아님을 확인

**3. 구글링**

🔍 검색 키워드: `vite proxy index.html 반환`

- 비슷한 사례 확인
- Vite에서 프록시가 제대로 안 되면 React가 index.html을 내려준다는 점을 알게 됨

**4. 해결**

- `vite.config.js` 프록시 설정 수정 후 서버 재시작

<img width="964" height="582" alt="image" src="https://github.com/user-attachments/assets/80ce8e47-0340-4710-bdad-83ae19a06dd1" />


- API 호출 시 정상적으로 JSON 응답 반환 🎉

---

## 배운 점

- React SPA는 모르는 경로에 대해 index.html을 반환한다는 동작 원리 이해
- Postman에서 잘 되는데 브라우저에서 안 될 경우 → **프록시 / CORS / 경로 문제**를 우선 확인해야 함
- 프론트-백엔드 연동 문제 발생 시 **Network 탭을 먼저 확인**하는 습관이 중요

---

## ✨ 기능 개선: Axios Interceptor

### 문제점

- 프로젝트가 커지면서 컴포넌트가 늘어나고, **모든 컴포넌트에서 Authorization 헤더 코드 반복**

```jsx
const token = useUserStore(state => state.token);
const response = await axios.get('/api/...', {
  headers: { 'Authorization': `Bearer ${token}` }
});

```

- 코드 반복 → 토큰이나 인증 로직 변경 시 모든 컴포넌트 수정 필요

### 해결 과정

1. Axios 공통 헤더 구글링 → Axios Interceptor 개념 발견
2. `apiClient.js` 파일 생성 → Axios 인스턴스에 인터셉터 적용
3. Zustand 스토어에서 토큰 자동 가져와 모든 요청 헤더에 삽입
4. 컴포넌트에서는 단순히 `apiClient.get('/경로')`만 사용

<img width="1331" height="541" alt="image" src="https://github.com/user-attachments/assets/8c1ea9a4-1a21-47bd-ab09-3b564b5aa863" />


### 결과

- 코드 반복 제거 → **클린 코드 적용**
- 컴포넌트에서 토큰 신경 안 써도 됨 → 개발 생산성 향상
- 새로운 API 요청 시 반복 작업 최소화 → 유지보수 및 확장성 개선
