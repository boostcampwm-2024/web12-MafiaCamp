<h1> MafiaCamp 🕵🏻‍♂️</h1>

<img src="https://github.com/user-attachments/assets/af23f745-caa8-4c12-a4da-00e25571b105" />

> 배포 링크 <br/> **https://mafiacamp.p-e.kr/**

<br/>

<div align="center">
  <div align="center">
    <a href="https://www.notion.so/web12-MafiaCamp-db7e416f79ce4e3e9a7d6c0f60a87c3f" target="_blank"><img src="https://img.shields.io/badge/-Notion-000000?logo=notion&logoColor=white"></a>
    <a href="https://www.figma.com/design/jykNeGhfgzFa0meKngwVGC/web12-MafiaCamp?node-id=3203-2446&node-type=canvas&t=79ymMpi5I0LGEe5Q-0" target="_blank"><img src="https://img.shields.io/badge/Figma-%23F24E1E.svg?logo=figma&logoColor=white"></a>
    <a href="https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki" target="_blank"><img src="https://img.shields.io/badge/GitHub%20Wiki-181717?logo=github&logoColor=white"></a>
  </div>
  <div align="center">
    <a href="https://www.notion.so/116351182b074467b8c69d7535bba23d" target="_blank"><img   src="https://img.shields.io/badge/📒%20기획서-4687FF?logo=none&logoColor=white"></a>
    <a href="https://www.notion.so/12cc95a1e2c6810fb297f33bb782f817?v=12cc95a1e2c6814ebd96000cfbf3113a" target="_blank"><img src="https://img.shields.io/badge/📝%20회의록-90E59A?logo=none&logoColor=white"></a>
    <a href="https://github.com/boostcampwm-2024/web12-MafiaCamp/projects?query=is%3Aopen" target="blank"><img src="https://img.shields.io/badge/🎯%20백로그-02B78F?logo=none&logoColor=white"></a>
  </div>
</div>

<br/>

<div align="center">

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb12-MafiaCamp&count_bg=%23328BC8&title_bg=%23414F59&icon=microsoftedge.svg&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

</div>

<br/>

<h2>목차</h2>

- [🤔 기존 마피아 게임의 문제](#-기존-마피아-게임의-문제)
- [🤩 MafiaCamp로 해결하자!](#-MafiaCamp로-해결하자)
- [💾 주요 기능](#-주요-기능)
- [🏆 문제 해결 경험 및 기술적 도전](#-문제-해결-경험-및-기술적-도전)
- [🏛️️ 아키텍처](#%EF%B8%8F%EF%B8%8F-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
- [📚 기술스택](#-기술스택)
- [🌱 MafiaCamper 소개](#-mafiacamper-소개)

<br/>
<br/>

## 🤔 기존 마피아 게임의 문제
![image](https://github.com/user-attachments/assets/cb464c74-4ed3-40b1-a3e3-7404bccd5642)

<br/>
<br/>

## 🤩 MafiaCamp로 해결하자!
![image](https://github.com/user-attachments/assets/c751508b-d7eb-4e03-8257-e3b46e6dcfaa)

<br/>
<br/>

## 💾 주요 기능

### 온라인 상태 표시
<img src="https://github.com/user-attachments/assets/b2ba1e92-85f6-45f4-8de8-e636a428942e" width="350" />

- 사용자들은 실시간으로 현재 온라인 상태인 유저의 수와 명단을 확인할 수 있습니다.
- 현재 게임에 참여 중인 사용자와 그렇지 않은 사용자를 구분해 표시합니다.


<br/>

### 직업 별 임무 수행

![직업 정보](https://github.com/user-attachments/assets/2a685eaa-3a67-4dfd-ab17-3975ab18cce1)

- 게임 참여자에게는 `시민`, `경찰`, `의사`, `마피아`로 구성된 네 가지 직업 중 하나가 부여됩니다.
- 게임 참여자는 자신에게 부여된 직업에 따라 승리를 위해 정해진 임무를 수행합니다.
  - 🙍🏻`시민`: 명 추리로 마피아를 가려내야 합니다.
  - 👮🏻`경찰`: 플레이어의 정체를 조사할 수 있습니다.
  - 🧑🏻‍⚕️`의사`: 특정 시민을 보호할 수 있습니다.
  - 🕵🏻‍♂️`마피아`: 제거할 대상을 선택합니다.

<br/>

### 채팅 기능
![마피아_채팅](https://github.com/user-attachments/assets/54a87dd9-4640-4dd8-9a56-5833f23ac175)
- 게임이 시작하기 전과 후 방에 있는 플레이어들과 채팅으로 대화를 나눌 수 있습니다.
- 또한 `마피아`끼리만 대화할 수 있는 비밀 채팅 방이 부여됩니다.

<br/>

### 실시간 투표 기능
![1차 투표](https://github.com/user-attachments/assets/fee8e758-9337-4731-81f2-171b86f4c1f7)

- 투표는 실시간으로 진행이 되며, 모든 플레이어가 투표 현황을 확인할 수 있습니다.
- 한 턴에 투표는 총 2단계로 이루어집니다.
- 1차 투표
  - 토론 이후, `마피아`로 의심되는 사람에게 투표합니다.
  - 동률일 경우 최종 변론 단계로 넘어갑니다.
- 최종 투표
  - 최종 변론 이후, 플레이어들은 최종적으로 `마피아`를 추리하여 투표합니다.
  - 투표 결과에 따라 게임의 승리 팀이 결정됩니다.

<br/>

### 마피아 임무 수행
![마피아](https://github.com/user-attachments/assets/09a1d91d-d1b1-4b9a-8e4d-e16f8fcf681b)
- `마피아` 팀은 밤 시간 동안 `시민`들 중 제거할 한 명을 선정합니다.
- `마피아` 간의 협력이 게임 승패를 좌우하는 중요한 요소입니다.
- `마피아`에게 선택된 `시민`이 `의사`에게 보호 받지 못할 시, 아침 시간에 게임에서 탈락하게 됩니다.

<br/>

### 최종 결과
![최종결과](https://github.com/user-attachments/assets/f5f8a8dc-da87-429c-a1ae-44f3366d1133)
- 게임의 승리 조건에 따라 `시민` 팀 또는 `마피아` 팀의 승리 여부를 발표합니다.
- 게임 결과는 모든 플레이어에게 실시간으로 공유됩니다.

<br/>
<br/>

## 🏆 문제 해결 경험 및 기술적 도전
### `FE`
| **제목** | **핵심 키워드** |
| --- | --- |
| [🐳 Next.js와 Docker를 사용한 빌드 최적화하기](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%F0%9F%90%B3Next.js%EC%99%80-Docker%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EB%B9%8C%EB%93%9C-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0) | `Front-end` `Next.js` `Docker` `최적화` `빌드` |
| ↪ [Enter키 이벤트 중복 호출 문제](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/Enter%ED%82%A4-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%A4%91%EB%B3%B5-%ED%98%B8%EC%B6%9C-%EB%AC%B8%EC%A0%9C) | `Front-end` |
| 🗳️ [투표 대상자 지정 오류](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%ED%88%AC%ED%91%9C-%EB%8C%80%EC%83%81%EC%9E%90-%EC%A7%80%EC%A0%95-%EC%98%A4%EB%A5%98) | `JavaScript` |
| 💵 [캐시로 인한 미들웨어 미호출 및 페이지 전환 오류](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%EC%BA%90%EC%8B%9C%EB%A1%9C-%EC%9D%B8%ED%95%9C-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4-%EB%AF%B8%ED%98%B8%EC%B6%9C-%EB%B0%8F-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%A0%84%ED%99%98-%EC%98%A4%EB%A5%98) | `Front-end` `Next.js` `Cache` `Middleware` `Authentication` `Authorization` |
| ⚫ [다크 모드에서 텍스트가 보이지 않는 문제](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%EB%8B%A4%ED%81%AC-%EB%AA%A8%EB%93%9C%EC%97%90%EC%84%9C-%ED%85%8D%EC%8A%A4%ED%8A%B8%EA%B0%80-%EB%B3%B4%EC%9D%B4%EC%A7%80-%EC%95%8A%EB%8A%94-%EB%AC%B8%EC%A0%9C) | `DarkMode` |
|  ⚠️[게임 방에서 새로고침 또는 브라우저 탭을 닫을 때의 예외 처리](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%EA%B2%8C%EC%9E%84-%EB%B0%A9%EC%97%90%EC%84%9C-%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8-%EB%98%90%EB%8A%94-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%ED%83%AD%EC%9D%84-%EB%8B%AB%EC%9D%84-%EB%95%8C%EC%9D%98-%EC%98%88%EC%99%B8-%EC%B2%98%EB%A6%AC) | `Exception` `beforeunload` |

<br/>

### `BE`

| **제목** | **핵심 키워드** |
| --- | --- |
| ⭐ [웹소켓 방 관리 구조 개선](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%EC%9B%B9%EC%86%8C%EC%BC%93-%EB%B0%A9-%EA%B4%80%EB%A6%AC-%EA%B5%AC%EC%A1%B0-%EA%B0%9C%EC%84%A0) | `WebSocket` `Socket.IO` |
| 🚪 [Pub-Sub 패턴을 통한 실시간 방 목록 조회 기능 개발](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/Pub%E2%80%90Sub-%ED%8C%A8%ED%84%B4%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EB%B0%A9-%EB%AA%A9%EB%A1%9D-%EC%A1%B0%ED%9A%8C-%EA%B8%B0%EB%8A%A5-%EA%B0%9C%EB%B0%9C) | `Pub/Sub` `Socket.IO` |
| 🔁 [유한 상태 기계를 이용한 게임 진행 모델링](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%EC%9C%A0%ED%95%9C-%EC%83%81%ED%83%9C-%EA%B8%B0%EA%B3%84%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B2%8C%EC%9E%84-%EC%A7%84%ED%96%89-%EB%AA%A8%EB%8D%B8%EB%A7%81) | `오토마타 이론` |
| [🔐 동시성 이슈를 해결하기 위한 LockManager 만들기](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%F0%9F%94%90-%EB%8F%99%EC%8B%9C%EC%84%B1-%EC%9D%B4%EC%8A%88%EB%A5%BC-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0-%EC%9C%84%ED%95%9C-LockManager-%EB%A7%8C%EB%93%A4%EA%B8%B0) | `async-mutex` |
| [⏰ RxJS로 실시간 타이머 구축하기](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%E2%8F%B0-Rxjs%EB%A1%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EB%B0%A9-%ED%83%80%EC%9D%B4%EB%A8%B8-%EA%B4%80%EB%A6%AC) | `RxJS` |
| [🐳 Next.js와 Docker를 사용한 빌드 최적화하기](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%F0%9F%90%B3Next.js%EC%99%80-Docker%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EB%B9%8C%EB%93%9C-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0) | `Front-end` `Next.js` `Docker` `최적화` `빌드` |
| [🟢 Redis를 통한 유저 온라인 상태 관리 시스템 구현하기](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/Redis%EB%A5%BC-%ED%86%B5%ED%95%9C-%EC%9C%A0%EC%A0%80-%EC%98%A8%EB%9D%BC%EC%9D%B8-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0) | `Redis` `Pub/Sub` |
| [🐳](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/%F0%9F%90%B3Next.js%EC%99%80-Docker%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EB%B9%8C%EB%93%9C-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0) [openvidu 에러 디버깅을 위한 Docker 개발환경 설정](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/openvidu-%EC%97%90%EB%9F%AC-%EB%94%94%EB%B2%84%EA%B9%85%EC%9D%84-%EC%9C%84%ED%95%9C-Docker-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95) | `Docker` `OpenVidu` `WebRTC` |
| 📑 [NestJS, mkcert CA 인증서 문제해결 방법](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/NestJS,-mkcert-CA-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%AC%B8%EC%A0%9C%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95) | `NestJS` `SSL 인증서` |
| 🧊 [openvidu ICE 후보 관련 오류](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/openvidu-ICE-%ED%9B%84%EB%B3%B4-%EA%B4%80%EB%A0%A8-%EC%98%A4%EB%A5%98) | `OpenVidu` `WebRTC` `ICE` |
| 🔒 [mutex lock 문제](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/mutex-lock-%EB%AC%B8%EC%A0%9C) | `Mutex` |
| ⚠️ [openvidu 세션 종료 메서드 오류](https://github.com/boostcampwm-2024/web12-MafiaCamp/wiki/openvidu-%EC%84%B8%EC%85%98-%EC%A2%85%EB%A3%8C-%EB%A9%94%EC%84%9C%EB%93%9C-%EC%98%A4%EB%A5%98) | `OpenVidu` `Session` |

<br/>
<br/>

## 🏛️️ 아키텍처

![아키텍처](https://github.com/user-attachments/assets/1a81bc52-5a7c-4e79-addb-98e154d412aa)


<br/>
<br/>


## 📚 기술스택

| 분류                 | 기술 스택                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 공통                 | ![](https://img.shields.io/badge/NPM-%23CB3837.svg?logo=npm&logoColor=white) ![](https://img.shields.io/badge/WebRTC-333333?logo=webrtc) ![](https://img.shields.io/badge/Typescript-3178C6?logo=Typescript&logoColor=white) ![](https://img.shields.io/badge/-Prettier-F7B93E?logo=prettier&logoColor=white) ![](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white) ![](https://img.shields.io/badge/-Jest-%23C21325?logo=jest&logoColor=white) ![](https://img.shields.io/badge/Socket.io-black?logo=socket.io&badgeColor=010101) |
| FE                  | ![](https://img.shields.io/badge/Next.js-000000?logo=Next.js&logoColor=white) ![](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=ffffff) ![](https://img.shields.io/badge/-Zod-FF4154?logo=zod&logoColor=white) ![](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?logo=reacthookform&logoColor=white) ![](https://img.shields.io/badge/-Framer-0055FF?logo=Framer&logoColor=white)                                   |
| BE                  | ![](https://img.shields.io/badge/NestJS-%23E0234E.svg?logo=nestjs&logoColor=white) ![](https://img.shields.io/badge/TypeORM-FF4716?logo=typeorm&logoColor=white) ![](https://img.shields.io/badge/-RxJS-B7178C?logo=ReactiveX&logoColor=white)                                                                                                                                                                                                                                                                                                          |
| Database            | ![](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) ![](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                              |
| Infrastructure      | ![](https://img.shields.io/badge/Nginx-009639?logo=Nginx&logoColor=white) ![](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![](https://img.shields.io/badge/Github%20Actions-%232671E5.svg?logo=githubactions&logoColor=white) ![](https://img.shields.io/badge/Naver%20Cloud%20Platform-03C75A?logo=naver&logoColor=ffffff)                                                                                                                                                                                                 |
| Collaboration Tools | ![](https://img.shields.io/badge/Figma-%23F24E1E.svg?logo=figma&logoColor=white) ![](https://img.shields.io/badge/-Notion-000000?logo=notion&logoColor=white) ![](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white) ![](https://img.shields.io/badge/-Slack-4A154B?logo=slack&logoColor=white)                                                                                                                                                                                                                                   |

<br/>
<br/>


## 🌱 MafiaCamper 소개

|                                  J051_김영현                                  |                                J085_노현진                                 |                                 J149_심재성                                 |                                  J251_최경수                                  |
|:------------------------------------------------------------------:| :-------------------------------------------------------------------: | :--------------------------------------------------------------------: | :----------------------------------------------------------------------: |
| <img src="https://github.com/0Chord.png" width="100" height="100"> | <img src="https://github.com/HyunJinNo.png" width="100" height="100"> | <img src="https://github.com/simjaesung.png" width="100" height="100"> | <img src="https://github.com/Gyeongsu1997.png" width="100" height="100"> |
|                [@0Chord](https://github.com/0Chord)                |              [@HyunJinNo](https://github.com/HyunJinNo)               |              [@simjaesung](https://github.com/simjaesung)              |             [@Gyeongsu1997](https://github.com/Gyeongsu1997)             |
|                              Back-end                              |                               Front-end                               |                                Back-end                                |                                 Back-end                                 |
