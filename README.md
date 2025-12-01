# STU-D (실시간 스터디카페 좌석 예약 플랫폼)

## 📖 프로젝트 소개
**WebSocket** 기술을 도입하여 여러 사용자가 동시에 접속해도 **실시간으로 좌석 점유 상태가 동기화**되는 무인 스터디카페 예약 관리 플랫폼입니다.
기존 키오스크 시스템의 공간적 제약을 넘어, 웹 환경에서 직관적인 UI로 좌석을 선택하고 예약할 수 있도록 구현했습니다.

* **개발 기간:** 2024.08 ~ 2024.09 (1.5개월)
* **개발 인원:** 1명 (개인 프로젝트)

<br>

## 🛠️ 기술 스택 (Tech Stack)

### Backend
* **Java 17**, **Spring Boot 3.2**
* **Spring Security**, **JWT**: 보안 및 인증/인가 구현
* **Spring Data JPA**: 객체 지향적인 데이터 접근 및 비즈니스 로직 구현
* **WebSocket (STOMP)**: 실시간 좌석 정보 동기화
* **MySQL**: 관계형 데이터베이스 구축 (좌석, 이용권, 예약 내역 관리)

### Frontend
* **React**: 사용자 인터페이스 구축
* **Zustand**: 전역 상태 관리 (로그인 정보, 실시간 좌석 상태 등)
* **Axios**: API 통신 모듈화 및 Interceptor 적용

### DevOps & Tools
* **AWS Elastic Beanstalk, RDS**: 서버 및 데이터베이스 클라우드 배포
* **GitHub Actions**: CI/CD (자동 빌드 및 배포)

<br>

## 📌 주요 기능
1.  **실시간 좌석 예약 및 동기화**
    * WebSocket(STOMP)을 활용하여 타 사용자의 예약/퇴실 상태가 새로고침 없이 즉시 반영됩니다.
2.  **회원가입 및 로그인 (보안)**
    * Spring Security와 JWT를 이용한 안전한 토큰 기반 인증 시스템을 구축했습니다.
3.  **좌석 및 이용권 관리**
    * 사용자는 좌석 배치도를 보고 빈 좌석을 선택/이동할 수 있으며, 대시보드에서 최근 이용 기록을 확인할 수 있습니다.

<br>

## 🧨 트러블 슈팅 (Trouble Shooting)

### 1. Vite 개발 환경에서 API 호출 시 index.html 반환 문제
* **문제 상황:** 프론트엔드(Vite)에서 백엔드 API를 호출했으나, JSON 데이터 대신 `index.html` 문서가 반환되는 현상 발생.
* **원인:** React는 SPA(Single Page Application) 특성상 인식하지 못하는 경로 요청에 대해 기본적으로 `index.html`을 반환합니다. 브라우저와 서버 간의 출처(Origin)가 달라 발생한 프록시 설정 문제였습니다.
* **해결:** `vite.config.js` 파일에 **Proxy 설정**을 추가하여 `/api`로 시작하는 요청을 백엔드 서버로 우회하도록 설정하여 해결했습니다.
* <img width="794" height="442" alt="image" src="https://github.com/user-attachments/assets/b5b0ddeb-5bb3-4f7a-85f8-1cd3ada5e955" />


### 2. Axios 헤더 토큰 중복 코드 제거 (Interceptor 적용)
* **문제 상황:** 로그인 인증이 필요한 모든 API 요청마다 `Authorization` 헤더에 토큰을 넣는 코드를 반복해서 작성해야 했으며, 이는 유지보수성을 떨어뜨렸습니다.
* **해결:** **Axios Interceptor**를 도입하여 요청(Request)이 전송되기 직전에 **Zustand Store**에 저장된 토큰을 자동으로 헤더에 삽입하도록 모듈화했습니다. 이를 통해 반복되는 코드를 제거하고 개발 생산성을 높였습니다.

<img width="1001" height="501" alt="image" src="https://github.com/user-attachments/assets/163dbf71-d59b-49da-9dd2-a127cd0f6b58" />



<br>
