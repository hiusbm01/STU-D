## 🛠️ Tech Stack & Decision Making

프로젝트의 목적과 효율성을 고려하여 다음과 같은 기술을 채택했습니다.

### 🎨 Frontend

| 기술 (Technology) | 선정 이유 (Reason for Selection) |
| :--- | :--- |
| <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"> | **컴포넌트 재사용성 및 생태계**<br>사용자 인터페이스를 컴포넌트 단위로 모듈화하여 유지보수성을 높이고, 방대한 라이브러리 생태계를 활용하기 위해 선택했습니다. |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"> | **빠른 빌드 및 개발 경험**<br>기존 CRA(Create-React-App) 대비 월등히 빠른 빌드 속도와 HMR(Hot Module Replacement) 기능을 통해 개발 효율성을 극대화하고자 도입했습니다. |
| <img src="https://img.shields.io/badge/Zustand-orange?style=flat-square"> | **간결한 전역 상태 관리**<br>Redux 대비 보일러플레이트 코드가 적고 직관적입니다. 로그인 정보와 같이 전역으로 필요한 데이터를 가볍고 효율적으로 관리하기 위해 선택했습니다. |
| <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white"> | **HTTP 통신 및 인터셉터 활용**<br>Fetch API보다 직관적이며, 특히 **Interceptor**를 활용해 모든 요청 헤더에 JWT 토큰을 자동으로 주입하는 등 중복 코드를 제거하기 위해 사용했습니다. |
| <img src="https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white"> | **빠른 UI 구축 및 디자인 일관성**<br>Grid 시스템과 반응형 컴포넌트를 활용하여 디자인 시간을 단축하고, 일관성 있는 사용자 경험(UX)을 제공하기 위해 사용했습니다. |

<br>

### ☕ Backend

| 기술 (Technology) | 선정 이유 (Reason for Selection) |
| :--- | :--- |
| <img src="https://img.shields.io/badge/Java 17-007396?style=flat-square&logo=openjdk&logoColor=white"> | **안정성 및 최신 기능 활용**<br>장기 지원(LTS) 버전으로서의 안정성과 Record 클래스 등 최신 문법을 활용하여 간결하고 견고한 코드를 작성하기 위해 선택했습니다. |
| <img src="https://img.shields.io/badge/Spring Boot 3-6DB33F?style=flat-square&logo=spring-boot&logoColor=white"> | **생산성 및 의존성 관리**<br>복잡한 설정 없이 내장 톰캣과 자동 구성을 통해 비즈니스 로직 구현에 집중할 수 있어 채택했습니다. |
| <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white"> | **표준화된 인증/인가 프레임워크**<br>검증된 보안 프레임워크를 통해 인증 로직을 구현하고, JWT 필터를 적용하여 Stateless한 보안 환경을 구축했습니다. |
| <img src="https://img.shields.io/badge/JPA (Hibernate)-59666C?style=flat-square&logo=hibernate&logoColor=white"> | **객체 지향적인 데이터 접근**<br>SQL 중심 개발에서 벗어나 객체 중심적으로 데이터를 관리하고, 더티 체킹(Dirty Checking) 등을 통해 데이터 정합성을 유지하기 위해 사용했습니다. |
| <img src="https://img.shields.io/badge/WebSocket (STOMP)-000000?style=flat-square&logo=socket.io&logoColor=white"> | **실시간 데이터 동기화**<br>사용자가 새로고침 하지 않아도 다른 사람의 좌석 예약 현황을 실시간으로 확인(Broadcasting)할 수 있도록 구현하기 위해 필수적이었습니다. |

<br>

### ☁️ Infrastructure & Database

| 기술 (Technology) | 선정 이유 (Reason for Selection) |
| :--- | :--- |
| <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"> | **신뢰성 높은 RDBMS**<br>회원, 좌석, 이용권 등 명확한 관계(Relation)를 가진 데이터 모델링에 적합하여 선택했습니다. |
| <img src="https://img.shields.io/badge/AWS Elastic Beanstalk-232F3E?style=flat-square&logo=amazon-aws&logoColor=white"> | **배포 자동화 및 관리 용이성**<br>인프라 설정에 드는 리소스를 줄이고, 오토스케일링 등 서버 관리를 위임하여 애플리케이션 개발에 집중하고자 사용했습니다. |
| <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white"> | **CI/CD 파이프라인 구축**<br>코드 푸시 시 빌드부터 AWS 배포까지의 과정을 자동화하여 개발 생산성을 높이고 배포 실수를 방지하기 위해 구축했습니다. |
