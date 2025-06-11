# My Book List

이 프로젝트는 React, Express, Supabase를 기반으로 한 풀스택 웹 애플리케이션입니다.책을 추가, 조회, 수정, 삭제 (CRUD) 할 수 있는 기능을 제공합니다.

👉 [DEMO](https://main.d2o5ebd0zxhk9j.amplifyapp.com/)

![미리보기](./client/public/demo.png)

## 기술 스택

- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL → Supabase (PostgreSQL-based)
- **Deployment**: AWS Elastic Beanstalk (Backend), AWS Amplify (Frontend)

## 주요 기능

- 도서 목록 조회, 추가, 수정, 삭제
- Supabase를 이용한 데이터 저장 및 관리

## 폴더 및 파일 구조

```bash
fullstack-crud-book-app/
├── backend/               # 백엔드 서버 코드 (Express + Supabase)
│   ├── .elasticbeanstalk/ # AWS Elastic Beanstalk 설정 폴더
│   │   └── config.yml     # 환경설정, 플랫폼 정보, 배포 설정 등을 포함
│   ├── supabase.js        # 백엔드 진입점 (Express 서버)
│   ├── package.json
│   └── …
├── client/                # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/         # 주요 페이지 컴포넌트
│   │   │   ├── Add.tsx
│   │   │   ├── Books.tsx
│   │   │   └── Update.tsx
│   │   ├── types/         # 타입 정의 (TypeScript)
│   │   │   └── book.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── …
│   ├── package.json
│   ├── amplify.yml        # AWS Amplify에서 프론트엔드 빌드/배포 설정 파일
│   └── …
└── …
```

## 개발 과정 전체 요약 (Step-by-Step)

### 1. 백엔드 개발

- Express로 REST API 작성 (GET, POST, PUT, DELETE)
- `.env` 파일로 환경 변수 관리
- 초기에는 MySQL 사용 → 나중에 Supabase로 마이그레이션
- `cors` 모듈을 이용해 CORS 설정 적용

### 2. Supabase 연결

- Supabase 프로젝트 생성
- `books` 테이블 구성
- `@supabase/supabase-js` 라이브러리로 연결
- `.env`에서 `SUPABASE_URL`, `SUPABASE_ANON_KEY` 사용

### 3. 프론트엔드 개발 (Vite + React + TS)

- `VITE_API_URL` 환경변수로 API 주소 관리
- 개발/배포 환경 구분을 위해 환경변수 값 분리
- `fetch`로 백엔드 API 요청 수행

### 4. AWS Elastic Beanstalk (EB)로 백엔드 배포

- EB CLI 초기화 (`eb init`)
- Node.js 환경으로 EB 환경 생성 (`eb create`)
- EB에 환경 변수 등록 (`eb setenv`) (Supabase 관련, NODE_ENV 등)
- CORS 설정
  - NODE_ENV === 'production'일 경우에만 Amplify 도메인 허용
- 배포 후 Mixed Content 이슈로 인해 인증서 필요 (HTTP -> HTTPS)

### 5. AWS Amplify로 프론트엔드 배포

- GitHub 연동으로 Amplify 프로젝트 생성
- 루트에 `amplify.yml` 생성해 `client/` 기준으로 빌드 지정

  ```yaml
  version: 1
  frontend:
    phases:
      preBuild:
        commands:
          - cd client
          - yarn install
      build:
        commands:
          - yarn build
    artifacts:
      baseDirectory: client/dist
      files:
        - "**/*"
    cache:
      paths:
        - client/node_modules/**/*
  ```

- 환경 변수: VITE_API_URL에 API 요청 URL 등록

### 6. 도메인 연결

- DNS 검증 방식 사용
- 도메인 등록
- DNS 관리에서 CNAME 설정 → ACM에서 발급된 CNAME 이름 및 CNAME 값 입력
- AWS ACM에서 도메인 검증된 후 인증서 발급 (AWS ACM)

### 7. SSL 인증서 등록 및 로드밸런서 설정

- AWS ACM에서 SSL 인증서 발급 완료 후
- AWS EC2 → 로드밸런서 설정으로 이동
- HTTPS 리스너(443 포트) 추가
- 발급받은 SSL 인증서 연결
- 대상 그룹(Target Group)에 EB 인스턴스 연결
- EB 환경에 HTTPS 리스너가 작동하도록 설정
- 보안 그룹에서 인바운드 규칙 추가
  - 로드밸런서가 HTTPS(443) 요청을 받아 처리하고, 내부적으로는 EC2 인스턴스에 HTTP(80)로 요청을 전달하므로, EC2 보안 그룹에는 HTTP(80) 인바운드 규칙만 유지하고, 로드밸런서 보안 그룹에는 HTTPS(443)와 HTTP(80) 인바운드 규칙을 모두 추가한다.

### 8. HTTPS 문제 해결

- 프론트 API 호출 URL을 `https://` 로 변경
- 백엔드 CORS 설정에 HTTPS 도메인 등록
- Amplify에서 `https://`로 환경 변수 변경

### 🌐 연결된 플랫폼/서비스 정리표

| **목적**      | **서비스**            | **설명**                    |
| ------------- | --------------------- | --------------------------- |
| 백엔드 호스팅 | AWS Elastic Beanstalk | Node.js Express 앱 배포     |
| 프론트 호스팅 | AWS Amplify           | React + Vite 앱 정적 배포   |
| HTTPS 인증서  | AWS ACM               | HTTPS 적용 위한 인증서 발급 |
| 데이터베이스  | Supabase              | PostgreSQL 기반 BaaS        |
| 도메인        | 내도메인.한국         | 무료 도메인 등록            |
| DNS 관리      | 내도메인.한국         | DNS 레코드 (CNAME 등) 설정  |
