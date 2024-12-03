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
<br/>

<h2>목차</h2>

- [📝 프로젝트 소개](#-프로젝트-소개)
- [💾 주요 기능](#-주요-기능)
  - [온라인 상태 표시](#온라인-상태-표시)
  - [직업 별 임무 수행](#직업-별-임무-수행)
  - [마피아 임무 수행](#마피아-임무-수행)
  - [채팅 기능](#채팅-기능)
  - [실시간 투표 기능](#실시간-투표-기능)
  - [최종 결과](#최종-결과)
- [🏗️ 아키텍처](#️-아키텍처)
- [📚 기술스택](#-기술스택)
- [🌱 MafiaCamper 소개](#-mafiacamper-소개)

<br/>

<br/>

## 📝 프로젝트 소개

- 😆 화상 채팅을 통해 온라인으로 마피아 게임에 참여할 수 있게 함 <br/>
- 💖 텍스트 외에도 다양한 비언어적 신호를 바탕으로 마피아 게임의 긴장감을 고조 <br/>
- 🚃 실시간 투표 및 다양한 직업 별 역할 수행을 통해 새로운 차원의 마피아 게임 경험 제공 <br/>

<br/>
<br/>

## 💾 주요 기능

<br/>

### 온라인 상태 표시

![온라인 상태 유저](https://github.com/user-attachments/assets/b2ba1e92-85f6-45f4-8de8-e636a428942e)

- 사용자들은 실시간으로 현재 온라인 상태인 유저의 수와 명단을 확인할 수 있습니다.
- 현재 게임에 참여중인 사용자와 그렇지 않은 사용자를 구분해 표시합니다.


<br/>

### 직업 별 임무 수행

![직업 정보](https://github.com/user-attachments/assets/2a685eaa-3a67-4dfd-ab17-3975ab18cce1)

- 게임 참여자에게는 시민, 경찰, 의사, 마피아로 구성된 네 가지 직업 중 하나가 부여됩니다.
- 게임 참여자는 자신에게 부여된 직업에 따라 정해진 임무를 수행하며 승리를 위해 투쟁합니다.
  - 마피아: 시민을 제거할 대상을 선택합니다. 
  - 의사: 특정 시민을 보호할 수 있습니다. 
  - 경찰: 플레이어의 정체를 조사할 수 있습니다.

<br/>

### 마피아 임무 수행
![마피아](https://github.com/user-attachments/assets/09a1d91d-d1b1-4b9a-8e4d-e16f8fcf681b)
- 마피아 팀은 밤 시간 동안 시민들 중 한 명을 제거할 대상을 선정합니다.
- 마피아 간의 협력이 게임 승패를 좌우하는 중요한 요소입니다.
- 해당 인원이 의사에게 보호받지 못할 시, 아침 시간에 게임에서 탈락하게 됩니다.

<br/>

### 채팅 기능
![마피아_채팅](https://github.com/user-attachments/assets/54a87dd9-4640-4dd8-9a56-5833f23ac175)
- 사용자들은 게임이 시작하기 전과 게임이 진행되는 동안 방에 있는 사람들과 채팅으로 대화를 나눌 수 있습니다.
- 마피아 멤버들에게는 마피아끼리만 대화할 수 있는 비밀 채팅방이 부여됩니다.

<br/>

### 실시간 투표 기능
![1차 투표](https://github.com/user-attachments/assets/fee8e758-9337-4731-81f2-171b86f4c1f7)

- 투표는 실시간으로 진행이되며, 모든 플레이어가 투 현황을 확인할 수 있습니다.
- 한 턴에 투표는 총 2단계로 이루어집니다..
- 1차 투표
  - 토론 이후, 마피아로 의심되는 사람에게 투표합니다.
  - 동률일 경우 최종 변론 단계로 넘어갑니다.
- 최종 투표
  - 최종 변론 이후, 플레이어들은 최종적으로 마피아를 추리하여 투표합니다.
  - 투표 결과에 따라 게임의 승리 팀이 결정됩니다.

<br/>

### 최종 결과
![최종결과](https://github.com/user-attachments/assets/f5f8a8dc-da87-429c-a1ae-44f3366d1133)
- 게임의 승리 조건에 따라 시민팀 또는 마피아팀의 승리 여부를 발표합니다.
- 게임 결과는 모든 플레이어에게 실시간으로 공유됩니다.

<br/>
<br/>


## 🏗️ 아키텍처

![아키텍처](https://github.com/user-attachments/assets/1a81bc52-5a7c-4e79-addb-98e154d412aa)

<br/>
<br/>

## 📚 기술스택

| 분류                 | 기술 스택                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 공통                 | ![](https://img.shields.io/badge/NPM-%23CB3837.svg?logo=npm&logoColor=white) ![](https://img.shields.io/badge/WebRTC-333333?logo=webrtc) ![](https://img.shields.io/badge/Typescript-3178C6?logo=Typescript&logoColor=white) ![](https://img.shields.io/badge/-Prettier-F7B93E?logo=prettier&logoColor=white) ![](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white) ![](https://img.shields.io/badge/-Jest-%23C21325?logo=jest&logoColor=white) ![](https://img.shields.io/badge/Socket.io-black?logo=socket.io&badgeColor=010101) |
| FE                   | ![](https://img.shields.io/badge/Next.js-000000?logo=Next.js&logoColor=white) ![](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=ffffff) ![](https://img.shields.io/badge/-Zod-FF4154?logo=zod&logoColor=white) ![](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?logo=reacthookform&logoColor=white) ![](https://img.shields.io/badge/-Framer-0055FF?logo=Framer&logoColor=white)                                   |
| BE                   | ![](https://img.shields.io/badge/NestJS-%23E0234E.svg?logo=nestjs&logoColor=white) ![](https://img.shields.io/badge/TypeORM-FF4716?logo=typeorm&logoColor=white) ![](https://img.shields.io/badge/-RxJS-B7178C?logo=ReactiveX&logoColor=white)                                                                                                                                                                                                                                                                                                          |
| Database             | ![](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) ![](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                              |
| Infrastructure       | ![](https://img.shields.io/badge/Nginx-009639?logo=Nginx&logoColor=white) ![](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![](https://img.shields.io/badge/Github%20Actions-%232671E5.svg?logo=githubactions&logoColor=white) ![](https://img.shields.io/badge/Naver%20Cloud%20Platform-03C75A?logo=naver&logoColor=ffffff)                                                                                                                                                                                                 |
| Collabortation Tools | ![](https://img.shields.io/badge/Figma-%23F24E1E.svg?logo=figma&logoColor=white) ![](https://img.shields.io/badge/-Notion-000000?logo=notion&logoColor=white) ![](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white) ![](https://img.shields.io/badge/-Slack-4A154B?logo=slack&logoColor=white)                                                                                                                                                                                                                                   |

<br/>
<br/>

## 🌱 MafiaCamper 소개

|                               김영현                               |                                노현진                                 |                                 심재성                                 |                                  최경수                                  |
| :----------------------------------------------------------------: | :-------------------------------------------------------------------: | :--------------------------------------------------------------------: | :----------------------------------------------------------------------: |
| <img src="https://github.com/0Chord.png" width="100" height="100"> | <img src="https://github.com/HyunJinNo.png" width="100" height="100"> | <img src="https://github.com/simjaesung.png" width="100" height="100"> | <img src="https://github.com/Gyeongsu1997.png" width="100" height="100"> |
|                [@0Chord](https://github.com/0Chord)                |              [@HyunJinNo](https://github.com/HyunJinNo)               |              [@simjaesung](https://github.com/simjaesung)              |             [@Gyeongsu1997](https://github.com/Gyeongsu1997)             |
|                              Back-end                              |                               Front-end                               |                                Back-end                                |                                 Back-end                                 |