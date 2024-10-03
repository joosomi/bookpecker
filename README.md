## 📑 **목차**

1. [Quick Start - 서버 구동 가이드](#quick-start)
   - [환경 변수 설정 (.env 파일)](#환경-변수-설정-env-파일)
   - [Docker 실행 가이드](#docker-실행-가이드)
2. [서버 구동 가이드](#서버-구동-가이드)
3. [ERD 다이어그램](#erd-다이어그램)
4. [API 명세서](#api-명세서)
5. [디렉토리 구조](#디렉토리-구조)
6. [프로젝트 관리 및 코드 품질 관리](#프로젝트-관리-및-코드-품질-관리)
7. [프로젝트 회고](#프로젝트-회고)

<br>

# 📚🐦 Bookpecker API

책을 검색하고, 해당 책에 대한 독서 기록을 남길 수 있습니다. <br>
저장한 책의 정보와 나만의 기록을 사람들과 쉽게 공유해보세요!

#### 📅 개발 기간
`24.09.20 ~ 진행 중`

- 현재 `feature/aws` 브랜치에서 AWS EC2와 RDS를 사용하여 배포 환경을 구축 중이며,
  추후 CI/CD 파이프라인을 구성할 예정입니다.
   <details>
     <summary><strong>진행 상황</strong></summary>
   
     - [x] 로컬 환경 개발 완료
   
       - [x] 카카오 소셜 회원가입/로그인 기능 (REST)
       - [x] 책 검색 및 저장 기능 (REST)
       - [x] 좋아요 기능 (GraphQL)
       - [x] 저장한 책 정보 외부 공유 기능 (REST)
       - [x] 노트 CRUD 기능 (GraphQL)
   
     - [ ] Jest 테스트 코드 작성 중
     - [ ] CI/CD 배포 파이프라인 구축
   </details>

#### 🛠️ 개발 환경

![NestJS](https://img.shields.io/badge/NestJS-9.5.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.1.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.7.x-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-5.18.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white) <br>
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white) ![Kakao OAuth2](https://img.shields.io/badge/Kakao%20OAuth2-FFCD00?style=for-the-badge&logo=kakao&logoColor=black) ![Naver Book API](https://img.shields.io/badge/Naver%20Book%20API-03C75A?style=for-the-badge&logo=naver&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Quick Start

### 🛒 프로젝트 클론

```
git clone https://github.com/joosomi/bookpecker.git
```

### 환경 변수 설정 (.env 파일)

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 다음과 같은 환경 변수를 설정하세요:

```bash
# 애플리케이션 포트 설정
APP_PORT=

# PostgreSQL 데이터베이스 설정
POSTGRES_USER=                   # PostgreSQL 사용자 이름
POSTGRES_PASSWORD=               # PostgreSQL 사용자 비밀번호
POSTGRES_DB=                     # 사용할 데이터베이스 이름
POSTGRES_HOST=        # 데이터베이스 호스트 (개발환경 : localhost)
POSTGRES_PORT=                   # PostgreSQL 데이터베이스 포트

# Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

#KAKAO
KAKAO_CLIENT_ID=
KAKAO_REDIRECT_URI=

#JWT secret key
JWT_SECRET=
JWT_SHARE_SECRET=

#NAVER
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

---

### Docker 실행 가이드

프로젝트의 데이터베이스 및 필요한 서비스를 Docker로 실행하려면, 아래 단계를 따르세요.

### 1. Docker Compose 설정 확인

루트 디렉토리에 있는 `docker-compose.dev.yml` 파일을 확인하고, `.env` 파일이 제대로 설정되었는지 확인하세요.

### 2. Docker 컨테이너 실행

아래 명령어를 사용하여 Docker 컨테이너를 백그라운드에서 실행합니다:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

- **app**

   - 개발 환경에서 애플리케이션을 실행하는 서비스입니다. 코드 수정 시 바로 반영되도록 volumes 설정을 통해 실시간으로 변경 사항을 적용합니다. <br> app 서비스는 DB 서비스인 db_dev에 의존하여, DB가 실행된 후에 애플리케이션이 실행됩니다.

- **db_dev**

   - image: `postgres:15.7` 버전의 PostgreSQL을 사용합니다.
   - `db-init.sh` 스크립트: PostgreSQL 컨테이너가 처음 실행될 때 자동으로 실행됩니다.
     데이터베이스를 생성하고, 환경변수로 설정한 이름, 비밀번호의 사용자를 생성하고 해당 DB에 대한 권한을 부여합니다.

---

## 서버 구동 가이드

### 1. 패키지 설치

Docker 컨테이너가 실행된 후, 프로젝트의 모든 의존성을 설치해야 합니다.

```bash
npm install
```

### 2. 서버 실행

서버 실행

```
npm run start
```

개발 모드 실행

```
npm run start:dev
```

---

## ERD 다이어그램

![ERD 다이어그램](/docs/erd.png)

#### 주요 엔티티

- **User**:
  - 카카오 소셜 로그인을 통해 받아온 사용자 정보 저장
  - kakaoId, 이메일, 사용자가 설정한 이름 등 기본 정보 관리
- **Book**:
  - Naver 책 검색 API를 통해 검색된 책 정보 저장
  - ISBN을 unique 식별자로 사용하여 중복 방지 (0으로 시작할 수 있기 때문에 문자열로 저장)
- **UserBook**:
  - 사용자-책 정보 관리 (좋아요 기능)
- **Note**:
  - 사용자의 책 관련 노트 저장
  - 특정 책에 대한 사용자의 생각, 리뷰 등 기록

---

## API 명세서

#### 📮 Postman Documentation

[Postman Documentation](https://documenter.getpostman.com/view/38557459/2sAXqy2eBR)
<br>
<br>
![swagger](/docs/postman.png)

#### 📗 로컬 환경에서 Swagger 문서 접근

로컬에서 프로젝트를 실행한 후, 다음 URL을 통해 Swagger 문서에 접근할 수 있습니다:

```
http://localhost:<APP_PORT>/api-docs

참고: `<APP_PORT>`는 `.env` 파일에서 설정한 포트 번호입니다.
```

Swagger를 통해 API 요청을 테스트하고, 각 엔드포인트의 상세 정보를 확인할 수 있습니다.
<br>
<br>
![swagger](/docs/api.png)


---

### 디렉토리 구조

<details>
  <summary><strong>🔍 디렉토리 구조</strong></summary>

```
...
├── docker
│   ├── Dockerfile.dev
│   └── db-init.sh
├── docker-compose.dev.yml
├── nest-cli.json
├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── app.module.ts
│   ├── feature
│   │   ├── auth
│   │   │   ├── auth.module.ts
│   │   │   ├── decorators
│   │   │   │   └── public.decorator.ts
│   │   │   ├── guards
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies
│   │   │   │   └── jwt-auth.strategy.ts
│   │   │   └── types
│   │   │       └── jwt.type.ts
│   │   ├── common
│   │   │   └── book-search
│   │   │       ├── book-search.controller.spec.ts
│   │   │       ├── book-search.controller.ts
│   │   │       ├── book-search.module.ts
│   │   │       ├── book-search.service.spec.ts
│   │   │       ├── book-search.service.ts
│   │   │       ├── dto
│   │   │       │   └── book-search.dto.ts
│   │   │       └── types
│   │   │           └── naver-api.types.ts
│   │   ├── graphql
│   │   │   ├── book
│   │   │   │   ├── book.graphql
│   │   │   │   ├── book.module.ts
│   │   │   │   ├── book.resolver.ts
│   │   │   │   ├── book.service.spec.ts
│   │   │   │   ├── book.service.ts
│   │   │   │   └── dto
│   │   │   │       ├── save-book.input.ts
│   │   │   │       └── toggle-like.input.ts
│   │   │   ├── note
│   │   │   │   ├── dto
│   │   │   │   │   ├── create-note-dto.ts
│   │   │   │   │   └── update-note-dto.ts
│   │   │   │   ├── note.graphql
│   │   │   │   ├── note.module.ts
│   │   │   │   ├── note.resolver.ts
│   │   │   │   ├── note.service.spec.ts
│   │   │   │   └── note.service.ts
│   │   │   └── scalar
│   │   │       └── date-scalar.ts
│   │   └── rest
│   │       ├── oauth
│   │       │   ├── oauth.controller.spec.ts
│   │       │   ├── oauth.controller.ts
│   │       │   ├── oauth.module.ts
│   │       │   ├── oauth.service.spec.ts
│   │       │   ├── oauth.service.ts
│   │       │   └── strategies
│   │       │       └── kakao.strategy.ts
│   │       └── share-book
│   │           ├── dto
│   │           │   └── create-book-share-token.dto.ts
│   │           ├── share-book.controller.spec.ts
│   │           ├── share-book.controller.ts
│   │           ├── share-book.module.ts
│   │           ├── share-book.service.spec.ts
│   │           ├── share-book.service.ts
│   │           └── types
│   │               └── shared-book-response.type.ts
│   ├── filter
│   │   └── global-exception.filter.ts
│   ├── graphql.ts
│   ├── logging
│   │   └── logger.ts
│   ├── main.ts
│   └── prisma
│       ├── prisma.module.ts
│       ├── prisma.service.spec.ts
│       └── prisma.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

</details>

---

### 프로젝트 관리 및 코드 품질 관리

효율적인 프로젝트 관리를 위해 Issue와 PR에 대한 템플릿을 설정하여 프로젝트를 진행하였습니다.

#### Git issue를 활용한 프로젝트 task 관리

<details>
  <summary><strong>🔍 Issue</strong></summary>

![issue](/docs/issue.png)

</details>

#### PR 관리

<details>
  <summary><strong>🔍 PR</strong></summary>
  
![issue](/docs/pr.png)
</details>

#### 코드 품질 관리

일관된 코드 스타일을 유지하기 위해 ESLint와 Prettier를 사용하였습니다.

   - 주요 ESLint 설정:
      
      - 함수 반환 타입 명시 설정으로 타입 안정성 강화
      - `any` 타입 사용시 경고하여 타입 명확성 유지

---

### 프로젝트 회고

새로운 기술들을 사용해보게 되어서 구현하는 데에 생각보다 개발에 시간이 많이 걸렸지만, GraphQL과 OAuth, Prisma를 활용해볼 수 있어서 유익했습니다.

먼저 kakao passport를 활용하여 쉽게 카카오 인증을 구현할 수 있다는 것을 배웠습니다. 처음에는 Passport 라이브러리 사용 없이 Auth 서비스 단에서 인증 로직을 처리하였으나, 코드가 길고 비효율적이라고 느껴져서 kakao passport를 적용하였고, guard로 쉽게 인증 처리를 할 수 있다는 것을 알게 되었습니다.

처음에는 graphql code-first 방식으로 구현을 했으나 요구 사항을 다시 검토하여 schema-first로 구현했어야 하는 것을 알게되어 리팩토링하였습니다. 스키마 파일 정의를 통한 리졸버 구현 방식을 배울 수 있어서 좋았습니다. 독립적으로 스키마 파일이 관리되어서 개발 중 변경 사항이 있을 때 쉽게 수정할 수 있었습니다.

Prisma를 처음 사용해보았는데 장점을 알게 되어 좋았습니다. 특히 DB 마이그레이션을 관리할 수 있어 변경 사항을 쉽게 파악할 수 있었습니다. 또한 prisma studio로 쉽게 데이터 확인이 가능하니까 개발 과정에서도 편리했습니다.

외부 공유 기능에서는 JWT 토큰을 활용해 만료 시간을 설정하여 구현했습니다. 처음에는 막연히 Guard로 처리해야하나 생각했었는데, 비로그인 사용자도 접근할 수 있는 엔드포인트이고, 단순히 제한 시간만 필요한 상황이기 때문에, Custom Guard를 별도로 구현하기보다는 서비스 단에서 토큰을 검증하는 방식이 더 단순하고 효율적이라고 판단했습니다. 추후 여러 종류의 공유 토큰이 생기거나, 공유 관련 엔드포인트가 더 필요하게 된다면, Custom Guard를 도입하는 것도 고려해볼 수 있겠지만, 현재는 엔드포인트가 하나뿐이므로 서비스 레벨에서 공유 토큰을 검증하였습니다.
