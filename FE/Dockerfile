# 1. 빌드 단계
# 생성할 Docker 이미지의 베이스가 되는 이미지를 지정합니다.
# node - 개발 편의성 및 다양한 도구가 포함된 이미지로, 개발 환경이나 복잡한 빌드 작업에 적합합니다.
# node:alpine - 크기가 작고 가벼운 이미지로, 프로덕션 환경이나 리소스가 제한된 환경에 적합합니다.
FROM node:20-alpine AS build

# 1-1. 작업 디렉토리 설정
# 애플리케이션 파일을 저장하고 실행할 기본 작업 디렉토리를 지정합니다.
# /app 디렉토리가 자동으로 생성되며, 이후의 모든 명령어가 이 디렉토리에서 실행됩니다.
WORKDIR /app

# 1-2. 의존성 파일 복사
COPY package.json package-lock.json ./

# 1-3. 의존성 설치
# 컨테이너 안에서 명령어를 실행하고 이미지를 빌드합니다.
RUN npm install --force

# 1-4. 애플리케이션 코드 복사
# 현재 디렉토리의 모든 파일을 /app 디렉토리로 복사합니다.
COPY . .

# 1-5. 애플리케이션 빌드
RUN npm run build

# 2. 런타임 단계
FROM node:20-alpine

# 2-1. 빌드 결과물과 필요한 파일만 복사
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# 2-2. 포트 설정
# 컨테이너가 사용하는 포트를 명시적으로 지정하는 명령어로, 호스트와 통신할 포트를 설정합니다.
EXPOSE 3000

# 2-3. 애플리케이션 실행
# 컨테이너가 시작될 때 실행할 기본 명령어를 지정합니다.
# CMD는 Dockerfile에서 한 번만 사용할 수 있습니다.
CMD [ "node", "server.js" ]